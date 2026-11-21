# Camera moves on one still image (styles/quy-chuan-dao-dien.md section 12). Writes an H.264 clip.
# usage: python -I -X utf8 src/camera.py <image> <out.mp4> <frames> <W> <H> '<json spec>'
#
# spec (all optional):
#   path:  [{"t":0,"x":.5,"y":.5,"z":1}, {"t":1,"x":.5,"y":.3,"z":1.35}]  keyframes, t in 0..1 of the clip.
#          x,y = centre of the camera window on the image (0..1); z = zoom, 1 = the largest window of the
#          frame's aspect that fits in the image ("cover"). On a wide 16:9 image z=1 is a full-height
#          vertical slice, so x 0.2 -> 0.8 pans across it. The window is clamped inside the image.
#   ease:  "inout" (default) | "linear" | "out" (fast start, soft stop: punch-ins)
#   shake: {"at":0.2, "dur":0.5, "amp":0.012}   decaying jitter (amp = fraction of frame width), seconds
#   whip:  {"dir":"left"|"right"|"up"|"down", "dur":0.25}   the clip enters with a fast blurred slide
#   black: 0.3                                   seconds of black at the start (beat before a reveal)
import sys, json, subprocess, numpy as np, cv2
img_path, out, frames, W, H = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
spec = json.loads(sys.argv[6]) if len(sys.argv) > 6 and sys.argv[6] else {}
FPS = 30
img = cv2.imdecode(np.fromfile(img_path, np.uint8), cv2.IMREAD_COLOR)
ih, iw = img.shape[:2]
ar = W / H
# base window ("cover"): largest W:H window inside the image
bh = min(ih, iw / ar); bw = bh * ar
path = spec.get("path") or [{"t": 0, "x": .5, "y": .5, "z": 1}, {"t": 1, "x": .5, "y": .5, "z": 1.07}]
path = sorted(path, key=lambda k: k["t"])
ease = spec.get("ease", "inout")
def E(p):
    if ease == "linear": return p
    if ease == "out": return 1 - (1 - p) ** 3
    return p * p * (3 - 2 * p)
def at(p):
    if p <= path[0]["t"]: k = path[0]; return k.get("x", .5), k.get("y", .5), k.get("z", 1)
    for a, b in zip(path, path[1:]):
        if p <= b["t"]:
            q = E((p - a["t"]) / max(b["t"] - a["t"], 1e-6))
            L = lambda key, d: a.get(key, d) + (b.get(key, d) - a.get(key, d)) * q
            return L("x", .5), L("y", .5), L("z", 1)
    k = path[-1]; return k.get("x", .5), k.get("y", .5), k.get("z", 1)
sh = spec.get("shake"); wh = spec.get("whip"); black = float(spec.get("black", 0))
rng = np.random.default_rng(7)
jit = rng.normal(size=(frames + 1, 2))
proc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                         "-vf", "scale=out_range=tv,format=yuv420p", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-r", str(FPS), out],
                        stdin=subprocess.PIPE)
M = max(frames - 1, 1)
for f in range(frames):
    t = f / FPS
    if t < black:
        proc.stdin.write(np.zeros((H, W, 3), np.uint8).tobytes()); continue
    x, y, z = at(f / M)
    ww, wh_ = bw / z, bh / z
    cx = min(max(x * iw, ww / 2), iw - ww / 2); cy = min(max(y * ih, wh_ / 2), ih - wh_ / 2)
    s = W / ww
    dx = dy = 0.0
    if sh and sh.get("at", 0) <= t < sh.get("at", 0) + sh.get("dur", .5):
        k = 1 - (t - sh.get("at", 0)) / sh.get("dur", .5)
        dx, dy = jit[f] * sh.get("amp", .012) * W * k
    A = np.float32([[s, 0, W / 2 - cx * s + dx], [0, s, H / 2 - cy * s + dy]])
    fr = cv2.warpAffine(img, A, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    if wh and t - black < wh.get("dur", .25):
        p = (t - black) / wh.get("dur", .25)              # 0 -> 1
        off = (1 - E(p)) ** 2                              # remaining slide, fraction of the frame
        d = wh.get("dir", "left"); horiz = d in ("left", "right")
        sign = 1 if d in ("left", "up") else -1            # "left" = camera whips left: picture comes in from the left
        n = int(abs(off) * (W if horiz else H) * 0.9) | 1
        fr = np.roll(fr, int(sign * off * (W if horiz else H) * 0.6), axis=1 if horiz else 0)
        if n > 3:
            ker = np.zeros((1, n) if horiz else (n, 1), np.float32); ker[:] = 1 / n
            fr = cv2.filter2D(fr, -1, ker, borderType=cv2.BORDER_REFLECT)
    proc.stdin.write(fr.tobytes())
proc.stdin.close(); proc.wait()
sys.exit(proc.returncode)
