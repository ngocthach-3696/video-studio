# usage: python persp.py sNNN "LINE1|LINE2" color x1 y1 x2 y2 x3 y3 x4 y4 [fill]
# draws text (Alegreya SC Bold) on the quad TL,TR,BL,BR of images/_goc-chua-chu/sNNN.jpg -> images/sNNN.jpg
# fill = fraction of the board height the text block uses (default 0.6). Text is centred on the cap-height body.
import cv2, numpy as np, subprocess, sys, os, shutil, tempfile
sid, text, color = sys.argv[1], sys.argv[2], sys.argv[3]
q = np.float32(list(map(float, sys.argv[4:12]))).reshape(4, 2)
fill = float(sys.argv[12]) if len(sys.argv) > 12 else 0.6
os.makedirs("images/_goc-chua-chu", exist_ok=True)
src = f"images/_goc-chua-chu/{sid}.jpg"
if not os.path.exists(src): shutil.copy(f"images/{sid}.jpg", src)
im = cv2.imread(src)
W = int(max(np.linalg.norm(q[1]-q[0]), np.linalg.norm(q[3]-q[2]))) * 2
H = int(max(np.linalg.norm(q[2]-q[0]), np.linalg.norm(q[3]-q[1]))) * 2
lines = text.split("|"); n = len(lines)
size = int(H * fill / (n * 0.65 + (n - 1) * 0.45))
font = "C\:/Users/huynh.ngoc.thach/Desktop/video-studio/history/assets/fonts/AlegreyaSC-Bold.ttf"
# shrink so the longest line fits 88% of the width (Alegreya SC caps ~0.62 em each)
size = min(size, int(W * 0.88 / (max(len(l) for l in lines) * 0.62)))
dt = []
for i, l in enumerate(lines):
    yc = H / 2 + (i - (n - 1) / 2) * size * 1.1
    dt.append(f"drawtext=fontfile='{font}':text='{l}':fontsize={size}:fontcolor={color}:borderw={max(2,size//18)}:bordercolor=#3A1A0A@0.85:x=(w-text_w)/2:y={yc:.0f}-ascent+0.325*{size}")
tmp = tempfile.mktemp(suffix=".png")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=black@0:s={W}x{H},format=rgba", "-vf", ",".join(dt), "-frames:v", "1", tmp], check=True)
t = cv2.imread(tmp, cv2.IMREAD_UNCHANGED)
M = cv2.getPerspectiveTransform(np.float32([[0, 0], [W, 0], [0, H], [W, H]]), q)
w = cv2.warpPerspective(t, M, (im.shape[1], im.shape[0]), flags=cv2.INTER_AREA)
a = w[..., 3:4].astype(np.float32) / 255
out = (im * (1 - a) + w[..., :3] * a).astype(np.uint8)
cv2.imwrite(f"images/{sid}.jpg", out, [cv2.IMWRITE_JPEG_QUALITY, 95]); os.remove(tmp)
print(sid, "size", size)
