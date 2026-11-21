# Measure camera motion per shot of a reference video.
# usage: python -I -X utf8 src/cam-motion.py <video> <out.csv> [--start S] [--dur D]
# Decodes at 10 fps, 240 px wide; detects hard cuts (grey-histogram jump); between consecutive frames estimates a
# similarity transform (scale, rotation, shift) from tracked corners (LK + RANSAC). Per shot it reports total zoom
# (end scale / start scale), pan x / tilt y (fraction of frame width/height, positive = content moves left/up =
# camera moves right/down), rotation (deg), shake (std of frame-to-frame shift, % width), local motion (median
# residual flow of inliers vs. all points = character/object motion or parallax) and a label.
import sys, subprocess, numpy as np, cv2, csv, argparse
ap = argparse.ArgumentParser(); ap.add_argument("video"); ap.add_argument("out")
ap.add_argument("--start", type=float, default=0); ap.add_argument("--dur", type=float, default=0)
a = ap.parse_args()
FPS, W = 10, 240
probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", a.video], capture_output=True, text=True).stdout.strip().split(",")
w0, h0 = int(probe[0]), int(probe[1]); H = int(round(W * h0 / w0 / 2) * 2)
cmd = ["ffmpeg", "-v", "error", "-ss", str(a.start)] + (["-t", str(a.dur)] if a.dur else []) + ["-i", a.video, "-vf", f"fps={FPS},scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "gray", "-"]
p = subprocess.Popen(cmd, stdout=subprocess.PIPE)
frames = []
while True:
    b = p.stdout.read(W * H)
    if len(b) < W * H: break
    frames.append(np.frombuffer(b, np.uint8).reshape(H, W))
n = len(frames)
def hist(f): h = cv2.calcHist([f], [0], None, [32], [0, 256]); return cv2.normalize(h, h).flatten()
hs = [hist(f) for f in frames]
hd = [0] + [cv2.compareHist(hs[i - 1], hs[i], cv2.HISTCMP_BHATTACHARYYA) for i in range(1, n)]
md = [0] + [float(np.mean(cv2.absdiff(frames[i - 1], frames[i]))) for i in range(1, n)]
def is_cut(i):
    if hd[i] > 0.3: return True
    nb = sorted(md[max(1, i - 5):i] + md[i + 1:i + 6]) or [0]
    return md[i] > 14 and md[i] > 4 * (nb[len(nb) // 2] + 1)
cuts = [0] + [i for i in range(1, n) if is_cut(i)] + [n]
# merge cuts closer than 0.3 s (flashes)
c2 = [cuts[0]]
for c in cuts[1:]:
    if c - c2[-1] >= 3 or c == n: c2.append(c)
cuts = c2
rows = []
for k in range(len(cuts) - 1):
    s, e = cuts[k], cuts[k + 1]
    S, R, TX, TY, shifts, local = 1.0, 0.0, 0.0, 0.0, [], []
    for i in range(s + 1, e):
        f0, f1 = frames[i - 1], frames[i]
        pts = cv2.goodFeaturesToTrack(f0, 300, 0.01, 6)
        if pts is None or len(pts) < 12: continue
        p1, st, _ = cv2.calcOpticalFlowPyrLK(f0, f1, pts, None)
        ok = st.flatten() == 1
        if ok.sum() < 12: continue
        A, inl = cv2.estimateAffinePartial2D(pts[ok], p1[ok], method=cv2.RANSAC, ransacReprojThreshold=1.0)
        if A is None: continue
        sc = float(np.hypot(A[0, 0], A[1, 0])); rot = float(np.degrees(np.arctan2(A[1, 0], A[0, 0])))
        if inl is None or inl.mean() < 0.5 or abs(sc - 1) > 0.05 or abs(rot) > 3 or abs(A[0, 2]) > W * 0.1: continue  # unreliable pair (dark, text, flash)
        S *= sc; R += rot; TX += A[0, 2] / W; TY += A[1, 2] / H
        shifts.append((A[0, 2] / W, A[1, 2] / H))
        pred = (pts[ok].reshape(-1, 2) @ A[:, :2].T) + A[:, 2]
        res = np.linalg.norm(p1[ok].reshape(-1, 2) - pred, axis=1)
        local.append(float(np.mean(res > 1.5)))  # share of points not explained by the camera move
    dur = (e - s) / FPS
    sh = np.array(shifts) if shifts else np.zeros((1, 2))
    shake = float(np.std(np.diff(sh[:, 0])) + np.std(np.diff(sh[:, 1]))) * 100 if len(sh) > 2 else 0
    loc = float(np.median(local)) if local else 0
    zoom = (S - 1) * 100; pan = -TX * 100; tilt = -TY * 100
    lab = []
    if abs(zoom) >= 2: lab.append("zoom-in" if zoom > 0 else "zoom-out")
    if abs(pan) >= (5 if abs(zoom) >= 2 else 3): lab.append("pan-right" if pan > 0 else "pan-left")
    if abs(tilt) >= (5 if abs(zoom) >= 2 else 3): lab.append("tilt-down" if tilt > 0 else "tilt-up")
    if abs(R) >= 1.5: lab.append("rotate")
    if shake >= 0.25: lab.append("shake")
    if loc >= 0.25: lab.append("local-motion")
    rows.append([k + 1, round(a.start + s / FPS, 2), round(dur, 2), round(zoom, 1), round(pan, 1), round(tilt, 1), round(R, 1), round(shake, 2), round(loc, 2), "+".join(lab) or "static"])
with open(a.out, "w", newline="", encoding="utf-8") as f:
    wr = csv.writer(f); wr.writerow(["shot", "t", "dur", "zoom%", "pan%", "tilt%", "rot", "shake", "local", "label"]); wr.writerows(rows)
print(a.out, "shots", len(rows))
