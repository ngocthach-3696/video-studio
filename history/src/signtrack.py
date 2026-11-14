# per-frame plaque detection (red wide rectangle) + smoothing, then warp the sign text PNG onto it
import cv2, numpy as np, sys, json
src, txtpng, dst, y0f, y1f = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4]), float(sys.argv[5])
cap = cv2.VideoCapture(src); fps = cap.get(cv2.CAP_PROP_FPS); frames=[]
while True:
    ok, f = cap.read()
    if not ok: break
    frames.append(f)
H, W = frames[0].shape[:2]
def detect(f, prev):
    hsv = cv2.cvtColor(f, cv2.COLOR_BGR2HSV)
    m = (((hsv[:,:,0] < 8) | (hsv[:,:,0] > 170)) & (hsv[:,:,1] > 110) & (hsv[:,:,2] > 50) & (hsv[:,:,2] < 175)).astype(np.uint8)
    m[:int(H*y0f)] = 0; m[int(H*y1f):] = 0; m[:, :int(W*0.15)] = 0; m[:, int(W*0.9):] = 0
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5,5),np.uint8))
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    best=None
    for c in cs:
        x,y,w,h = cv2.boundingRect(c)
        if w < 2.2*h or cv2.contourArea(c) < 0.6*w*h or w < 80: continue
        if prev is not None:
            pw = prev[1][0]-prev[0][0]
            if abs(w-pw) > 0.15*pw or abs(x-prev[0][0]) > 25: continue
        if best is None or w*h > best[2]*best[3]: best=(x,y,w,h,c)
    if best is None: return None
    x,y,w,h,c = best
    pts=c.reshape(-1,2).astype(np.float32); s=pts.sum(1); d=pts[:,0]-pts[:,1]
    return np.float32([pts[s.argmin()], pts[d.argmax()], pts[s.argmax()], pts[d.argmin()]])
Qs=[]; prev=None; miss=0
for f in frames:
    q = detect(f, prev)
    if q is None: q = prev; miss+=1
    Qs.append(q); prev=q
Qs=np.array(Qs); K=9; pad=np.pad(Qs,((K//2,K//2),(0,0),(0,0)),mode="edge")
Qsm=np.array([np.median(pad[i:i+K],0) for i in range(len(Qs))])
pad=np.pad(Qsm,((2,2),(0,0),(0,0)),mode="edge"); Qsm=np.array([pad[i:i+5].mean(0) for i in range(len(Qs))])
txt=cv2.imread(txtpng, cv2.IMREAD_UNCHANGED); th,tw=txt.shape[:2]; srcQ=np.float32([[0,0],[tw,0],[tw,th],[0,th]])
out=cv2.VideoWriter(dst, cv2.VideoWriter_fourcc(*"mp4v"), fps, (W,H))
for f,Q in zip(frames,Qsm):
    M=cv2.getPerspectiveTransform(srcQ, np.float32(Q)); t=cv2.warpPerspective(txt,M,(W,H),flags=cv2.INTER_CUBIC)
    a=t[:,:,3:4].astype(np.float32)/255; out.write((f*(1-a)+t[:,:,:3]*a).astype(np.uint8))
out.release(); print("frames",len(frames),"missed",miss,"first",Qsm[0].round(0).tolist(),"last",Qsm[-1].round(0).tolist())
