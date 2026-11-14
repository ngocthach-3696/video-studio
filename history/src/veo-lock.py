# lock a Veo clip to its first frame using background features (top part of frame)
import cv2, numpy as np, sys
src, dst, top = sys.argv[1], sys.argv[2], float(sys.argv[3])
cap = cv2.VideoCapture(src); fps = cap.get(cv2.CAP_PROP_FPS)
ok, f0 = cap.read(); H, W = f0.shape[:2]
g0 = cv2.cvtColor(f0, cv2.COLOR_BGR2GRAY)
mask = np.zeros_like(g0); mask[:int(H*top), :] = 255
orb = cv2.ORB_create(3000); k0, d0 = orb.detectAndCompute(g0, mask)
bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
out = cv2.VideoWriter(dst, cv2.VideoWriter_fourcc(*"mp4v"), fps, (W, H)); out.write(f0)
log=[]
while True:
    ok, f = cap.read()
    if not ok: break
    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY); k, d = orb.detectAndCompute(g, mask)
    m = sorted(bf.match(d, d0), key=lambda x: x.distance)[:600]
    a = np.float32([k[x.queryIdx].pt for x in m]); b = np.float32([k0[x.trainIdx].pt for x in m])
    M, inl = cv2.estimateAffinePartial2D(a, b, method=cv2.RANSAC, ransacReprojThreshold=2.0)
    s = np.hypot(M[0,0], M[1,0]); log.append((s, M[0,2], M[1,2]))
    out.write(cv2.warpAffine(f, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE))
out.release()
ss=[l[0] for l in log]; print("scale range %.3f-%.3f, tx %.1f..%.1f, ty %.1f..%.1f" % (min(ss), max(ss), min(l[1] for l in log), max(l[1] for l in log), min(l[2] for l in log), max(l[2] for l in log)))
