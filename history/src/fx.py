"""Free local "living still" effects for one image -> short MP4 (no AI video).

Layers (all optional, set per scene in project.json "fx"):
  drift    camera push/pan with 2.5D parallax from a depth map (near moves more)
  ripple   water wobble + moonlight shimmer, only on the water (not on people)
  fog      slow drifting mist, thicker far away
  rain / ash / embers / dust   particles, hidden behind nearer objects
  flicker  firelight / flare brightness flicker, optionally tinted
  grain, vignette

Depth: Depth Anything V2 Small (ONNX, Apache-2.0), cached as <image>.depth.png.

Usage:
  python -I fx.py --image s043.jpg --out s043.mp4 --dur 4 --fps 30 --size 1080x1920 \
      --fx '{"drift":{"push":0.06},"ripple":{"top":0.38},"fog":{}}' --model depth.onnx --ffmpeg ffmpeg
"""
import argparse, json, os, subprocess, sys

import cv2
import numpy as np

# ---------------------------------------------------------------- depth

def load_depth(image_path, img, model):
    cache = os.path.splitext(image_path)[0] + ".depth.png"
    if os.path.exists(cache) and os.path.getmtime(cache) >= os.path.getmtime(image_path):
        d = cv2.imread(cache, cv2.IMREAD_GRAYSCALE)
        if d is not None and d.shape == img.shape[:2]:
            return d.astype(np.float32) / 255
    import onnxruntime as ort
    sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
    h, w = img.shape[:2]
    # long side 924 (multiple of 14), keep aspect
    s = 924 / max(h, w)
    mh, mw = max(14, round(h * s / 14) * 14), max(14, round(w * s / 14) * 14)
    x = cv2.resize(img, (mw, mh), interpolation=cv2.INTER_AREA)[:, :, ::-1].astype(np.float32) / 255
    x = ((x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).transpose(2, 0, 1)[None].astype(np.float32)
    d = sess.run(None, {sess.get_inputs()[0].name: x})[0][0]
    d = (d - d.min()) / max(1e-6, d.max() - d.min())
    d = cv2.resize(d.astype(np.float32), (w, h), interpolation=cv2.INTER_CUBIC)
    d = np.clip(d, 0, 1)
    cv2.imwrite(cache, (d * 255).astype(np.uint8))
    return d


def cover(img, W, H, interp=cv2.INTER_CUBIC):
    h, w = img.shape[:2]
    s = max(W / w, H / h)
    r = cv2.resize(img, (round(w * s), round(h * s)), interpolation=interp)
    y0, x0 = (r.shape[0] - H) // 2, (r.shape[1] - W) // 2
    return r[y0:y0 + H, x0:x0 + W]


def smooth_noise(h, w, scale, rng, octaves=3):
    """Tileable-ish low-frequency noise in [0,1]."""
    acc = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        gh, gw = max(2, int(h / scale * 2 ** o)), max(2, int(w / scale * 2 ** o))
        g = rng.random((gh, gw)).astype(np.float32)
        acc += amp * cv2.resize(g, (w, h), interpolation=cv2.INTER_CUBIC)
        tot += amp
        amp *= 0.5
    acc /= tot
    acc = (acc - acc.min()) / max(1e-6, acc.max() - acc.min())
    return acc


def smoothstep(p):
    p = min(max(p, 0.0), 1.0)
    return p * p * (3 - 2 * p)

# ---------------------------------------------------------------- masks

def object_mask(D, top):
    """Things standing out from the water plane (people, boats): depth well above
    the per-row 'floor' of the scene."""
    H, W = D.shape
    floor = np.percentile(D, 25, axis=1).astype(np.float32)
    k = np.exp(-0.5 * (np.arange(-75, 76) / 25.0) ** 2)
    floor = np.convolve(np.pad(floor, 75, mode="edge"), k / k.sum(), mode="valid").astype(np.float32)
    m = np.clip((D - floor[:, None] - 0.03) / 0.05, 0, 1)
    m = cv2.dilate(m, np.ones((9, 9), np.uint8))
    return cv2.GaussianBlur(m, (0, 0), 4)


def water_mask(D, top, bottom=1.0):
    H, W = D.shape
    y = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    band = np.clip((y - top) / 0.03, 0, 1) * np.clip((bottom - y) / 0.03, 0, 1)
    return (band * (1 - object_mask(D, top))).astype(np.float32)

# ---------------------------------------------------------------- particles

class Particles:
    KINDS = {
        #        count  speed(px/s)          size     color(BGR)        alpha  dir
        "rain":   (500, (1400, 2200), (1.0, 2.2), (210, 210, 200), 0.35, "down"),
        "ash":    (140, (25, 70), (1.5, 4.0), (170, 175, 180), 0.55, "drift"),
        "embers": (70, (40, 110), (1.5, 3.5), (60, 150, 255), 0.9, "up"),
        "dust":   (90, (8, 25), (1.0, 2.5), (200, 215, 225), 0.35, "drift"),
    }

    def __init__(self, kind, cfg, W, H, rng, px=1.0):
        n, sp, sz, col, alpha, dirn = self.KINDS[kind]
        self.kind, self.dirn, self.W, self.H, self.px = kind, dirn, W, H, px
        n = int(n * cfg.get("density", 1.0))
        self.z = rng.random(n).astype(np.float32)               # 0 far .. 1 near
        k = 0.35 + 0.65 * self.z
        self.x0 = rng.random(n) * W
        self.y0 = rng.random(n) * H
        self.v = (sp[0] + rng.random(n) * (sp[1] - sp[0])) * k * cfg.get("speed", 1.0) * px
        self.size = (sz[0] + rng.random(n) * (sz[1] - sz[0])) * (0.5 + k) * px
        self.phase = rng.random(n) * 6.283
        self.wind = cfg.get("wind", 0.18 if kind == "rain" else 0.3)
        self.color = np.array(cfg.get("color", col), np.float32)
        self.alpha = cfg.get("alpha", alpha)

    def draw(self, t, D):
        W, H = self.W, self.H
        layer = np.zeros((H, W), np.float32)
        if self.dirn == "down":
            y = (self.y0 + self.v * t) % (H + 200) - 100
            x = (self.x0 + self.v * t * self.wind) % W
        elif self.dirn == "up":
            y = (self.y0 - self.v * t) % (H + 100) - 50
            x = (self.x0 + 18 * self.px * np.sin(self.phase + t * 1.7) + self.v * t * self.wind * 0.3) % W
        else:
            y = (self.y0 + self.v * t * 0.6 + 6 * self.px * np.sin(self.phase + t)) % H
            x = (self.x0 + self.v * t * self.wind * 3 + 10 * self.px * np.sin(self.phase * 2 + t * 0.8)) % W
        flick = 1.0
        for i in range(len(x)):
            xi, yi = int(x[i]), int(y[i])
            if not (0 <= xi < W and 0 <= yi < H):
                continue
            if D[yi, xi] > self.z[i] + 0.04:          # behind something nearer
                continue
            a = self.alpha * (0.4 + 0.6 * self.z[i])
            if self.kind == "embers":
                a *= 0.55 + 0.45 * np.sin(self.phase[i] * 3 + t * 9)
            if self.kind == "rain":
                ln = (18 + 40 * self.z[i]) * self.px
                x2, y2 = int(xi - ln * self.wind), int(yi - ln)
                cv2.line(layer, (xi, yi), (x2, y2), float(a), max(1, int(self.size[i] * 0.6)), cv2.LINE_AA)
            else:
                cv2.circle(layer, (xi, yi), max(1, int(self.size[i])), float(a), -1, cv2.LINE_AA)
        if self.kind == "embers":
            glow = cv2.GaussianBlur(layer, (0, 0), 5) * 1.6
            layer = np.clip(layer + glow, 0, 1)
        elif self.kind != "rain":
            layer = cv2.GaussianBlur(layer, (0, 0), 0.8)
        return layer

# ---------------------------------------------------------------- render

def render(args):
    fx = json.loads(args.fx) if args.fx else {}
    W, H = map(int, args.size.lower().split("x"))
    src = cv2.imread(args.image, cv2.IMREAD_COLOR)
    if src is None:
        sys.exit(f"cannot read {args.image}")
    if args.crop_bottom > 0:
        src = src[: int(src.shape[0] * (1 - args.crop_bottom))]
    D0 = load_depth(args.image, src, args.model)
    # Work at the source's own resolution when it is smaller than the output
    # (Flow images are 768x1376): same detail, ~2x fewer pixels; ffmpeg upscales.
    OW, OH = W, H
    s_up = max(W / src.shape[1], H / src.shape[0])
    if s_up > 1:
        W, H = int(round(W / s_up / 2) * 2), int(round(H / s_up / 2) * 2)
    kpx = W / OW                                   # output px -> work px
    B = cover(src, W, H).astype(np.float32)
    D = np.clip(cover(D0, W, H), 0, 1).astype(np.float32)
    rng = np.random.default_rng(args.seed)
    n = round(args.dur * args.fps)

    Y, X = np.mgrid[0:H, 0:W].astype(np.float32)
    U, V = X - W / 2, Y - H / 2
    yn = Y / H

    drift = fx.get("drift", {"push": 0.05})
    push = float(drift.get("push", 0.05))       # total zoom over the clip
    pan = np.array(drift.get("pan", [0.0, 0.0]), np.float32) * np.array([W, H], np.float32)
    par = float(drift.get("parallax", 1.0))     # how much near vs far differ
    margin = 1.0 + float(drift.get("margin", 0.03))
    Dn = D - 0.5

    rip = fx.get("ripple")
    if rip is not None:
        top = float(rip.get("top", 0.4))
        Wm = water_mask(D, top, float(rip.get("bottom", 1.0)))
        ramp = np.clip((yn - top) / max(1e-3, 1 - top), 0, 1)
        r_amp = float(rip.get("amp", 2.5)) * kpx * (0.35 + 0.65 * ramp) * Wm
        r_ph = (0.05 + 0.10 * (1 - ramp)) * (Y / kpx) * 6.283 / 6 + smooth_noise(H, W, 120 * kpx, rng) * 9
        lum = cv2.cvtColor(B.astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
        hl = np.clip((lum - float(rip.get("hl", 0.35))) / 0.3, 0, 1) * Wm
        sh_ph = smooth_noise(H, W, 40 * kpx, rng) * 12 + (X / kpx) * 0.03
        r_speed = float(rip.get("speed", 1.0))
        r_shine = float(rip.get("shimmer", 0.35))

    fog = fx.get("fog")
    if fog is not None:
        fN = smooth_noise(H // 4, W // 4, 60 * kpx, rng, octaves=4)
        fN = np.tile(fN, (1, 2))
        f_far = np.power(np.clip(1 - D, 0, 1), float(fog.get("falloff", 1.4)))
        f_band = 1.0
        if "band" in fog:                       # [y0, y1] vertical region of the mist
            b0, b1 = fog["band"]
            f_band = np.clip((yn - b0) / 0.06, 0, 1) * np.clip((b1 - yn) / 0.06, 0, 1)
        f_den = float(fog.get("density", 0.35))
        f_col = np.array(fog.get("color", [150, 150, 145]), np.float32)
        f_speed = float(fog.get("speed", 18)) * kpx / 4

    parts = [Particles(k, fx[k], W, H, rng, kpx) for k in Particles.KINDS if k in fx]

    fl = fx.get("flicker")
    if fl is not None:
        fl_amp = float(fl.get("amp", 0.08))
        fl_col = np.array(fl.get("color", [40, 120, 255]), np.float32) / 255
        fl_tint = float(fl.get("tint", 0.0))
        fl_speed = float(fl.get("speed", 1.0))
        fl_mask = 1.0
        if "region" in fl:                      # [x, y, radius] in 0..1, glow centre
            cx, cy, rr = fl["region"]
            dist = np.sqrt(((X / W - cx) * (W / H)) ** 2 + (Y / H - cy) ** 2)
            fl_mask = np.clip(1 - dist / rr, 0, 1)[..., None]
        k = rng.random(8) * 6.283

    vig = fx.get("vignette", 0.25)
    if vig:
        r2 = (U / (W / 2)) ** 2 * 0.6 + (V / (H / 2)) ** 2 * 0.4
        vmask = (1 - float(vig) * np.clip(r2 - 0.25, 0, 1))[..., None].astype(np.float32)
    grain = float(fx.get("grain", 0.025))

    cmd = [args.ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24",
           "-s", f"{W}x{H}", "-r", str(args.fps), "-i", "-", "-c:v", "libx264", "-preset", "veryfast",
           "-crf", "18", "-pix_fmt", "yuv420p",
           "-vf", f"scale={OW}:{OH}:flags=lanczos,setsar=1", args.out]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    # Smooth fields (warp maps, shimmer, fog) are computed at reduced size and
    # upscaled: they have no fine detail, and it is ~4-16x cheaper.
    h2, w2 = H // 2, W // 2
    half = lambda a: cv2.resize(a, (w2, h2), interpolation=cv2.INTER_AREA)
    up = lambda a: cv2.resize(a, (W, H), interpolation=cv2.INTER_LINEAR)
    U2, V2, X2, Dn2 = half(U), half(V), half(X), half(Dn)
    if rip is not None:
        r_amp2, r_ph2, sh_ph2 = half(r_amp), half(r_ph), half(sh_ph)
    if fog is not None:
        h4, w4 = H // 4, W // 4
        f_mul4 = cv2.resize((f_far * f_band * f_den).astype(np.float32), (w4, h4), interpolation=cv2.INTER_AREA)
    if vig:
        B *= vmask
    if grain:
        B += rng.normal(0, grain * 255, (H, W, 1)).astype(np.float32)

    for f in range(n):
        t = f / args.fps
        e = smoothstep(f / max(1, n - 1))
        # camera: zoom grows with nearness -> parallax
        s = margin * (1 + push * e * (1 + par * Dn2))
        off = pan * (e - 0.5)
        mx = W / 2 + U2 / s - off[0] - off[0] * par * Dn2 * 0.6
        my = H / 2 + V2 / s - off[1]
        if rip is not None:
            mx += r_amp2 * np.sin(r_ph2 - t * 2.2 * r_speed)
            my += r_amp2 * 0.35 * np.sin(r_ph2 * 0.7 + (X2 / kpx) * 0.02 - t * 1.6 * r_speed)
        mx, my = up(mx), up(my)
        img = cv2.remap(B, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        Dw = cv2.remap(D, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT) if parts else None

        if rip is not None and r_shine:
            hw = cv2.remap(hl, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
            tw = up(np.clip(np.sin(sh_ph2 - t * 3.0 * r_speed), -0.4, 1) * (r_shine * 255))
            img += (hw * tw)[..., None]

        if fog is not None:
            sx = int(t * f_speed) % w4
            a = np.clip(fN[:, sx:sx + w4] * 1.4 - 0.25, 0, 1) * f_mul4
            a = up(a)[..., None]
            img += (f_col - img) * a

        if fl is not None:
            ph = t * fl_speed
            nz = (np.sin(ph * 7.1 + k[0]) * 0.5 + np.sin(ph * 13.7 + k[1]) * 0.3 + np.sin(ph * 23.3 + k[2]) * 0.2)
            g = fl_amp * nz
            img *= (1 + g * fl_mask)
            if fl_tint:
                img += fl_col * 255 * fl_tint * (0.5 + 0.5 * nz) * fl_mask

        for p in parts:
            layer = p.draw(t, Dw)[..., None]
            img += (p.color - img) * layer

        np.clip(img, 0, 255, out=img)
        ff.stdin.write(img.astype(np.uint8).tobytes())
    ff.stdin.close()
    if ff.wait() != 0:
        sys.exit("ffmpeg failed")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--dur", type=float, default=4)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--size", default="1080x1920")
    ap.add_argument("--fx", default="")
    ap.add_argument("--model", required=True)
    ap.add_argument("--ffmpeg", default="ffmpeg")
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--crop-bottom", type=float, default=0.0)
    render(ap.parse_args())
