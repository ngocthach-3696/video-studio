"""Cắt 1 ảnh thành nhiều cảnh (cắt thẳng), mỗi cảnh đẩy/lia máy chậm.
python crop-shots.py <spec.json> <out.mp4>
spec: {"image": "...", "fps": 30, "w": 1080, "h": 1920,
       "shots": [{"dur": 1.8, "from": [cx, cy, width], "to": [cx, cy, width]}]}
Toạ độ theo pixel ảnh gốc; khung luôn 9:16, tự kẹp trong ảnh.
"""
import json, subprocess, sys
import cv2, numpy as np

spec = json.load(open(sys.argv[1], encoding="utf-8"))
out = sys.argv[2]
img = cv2.imread(spec["image"])
H0, W0 = img.shape[:2]
fps, W, H = spec.get("fps", 30), spec.get("w", 1080), spec.get("h", 1920)
ar = W / H

def rect(cx, cy, w):
    w = min(w, W0, H0 * ar)
    h = w / ar
    x = min(max(cx - w / 2, 0), W0 - w)
    y = min(max(cy - h / 2, 0), H0 - h)
    return x, y, w, h

ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24",
                       "-s", f"{W}x{H}", "-r", str(fps), "-i", "-", "-c:v", "libx264",
                       "-crf", "18", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
for s in spec["shots"]:
    n = round(s["dur"] * fps)
    a, b = np.array(s["from"], float), np.array(s.get("to", s["from"]), float)
    for i in range(n):
        t = i / max(n - 1, 1)
        t = t * t * (3 - 2 * t)  # ease in-out
        x, y, w, h = rect(*(a + (b - a) * t))
        k = W / w
        M = np.float32([[k, 0, -x * k], [0, k, -y * k]])
        ff.stdin.write(cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_LANCZOS4,
                                      borderMode=cv2.BORDER_REPLICATE).tobytes())
ff.stdin.close()
ff.wait()
print("ok", out)
