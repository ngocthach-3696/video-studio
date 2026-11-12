"""Layered "cut-out" animation for one shot -> short MP4 (no AI video).

A shot is a stack of layers, back to front. Each layer moves on keyframes, so
the motion is smooth and exact (nothing is "guessed" like AI video):

  image   a picture (background, character, prop). "cut" removes its plain
          background: "border" (flood-fill the flat colour touching the edges,
          e.g. Flow character sheets on beige) or "green" (chroma key).
          keys:  [{t, x, y, s, a, r}]  position (0..1 of frame), scale, alpha, rotation (deg)
          breathe: 0.006      tiny vertical scale pulse (a standing person breathing)
          sway: {deg, speed, pivot:[px,py]}   rotation wobble (flags, paper, a body leaning)
          flutter: {deg, speed}               fast irregular spin (paper in wind)
          parallax: 1.0       how strongly the camera move affects this layer (near > 1)
  path    a line drawn progressively (a route on a map): points (0..1), draw [t0, t1],
          color [b,g,r], width, dash, head (true = dot, "arrow" = arrowhead), glow,
          icon ("ship" | "banner" | {kind, size, color, lift} | {path, cut, size}) riding the tip,
          target (true | {radius, color, period}) = pulsing ring at the end once the line arrives.
          Several path layers = several routes (brick red [45,45,185] = invaders, indigo [130,60,40] = Vietnamese).
  camera  {"push": 0.04, "pan": [dx, dy]} over the whole shot, with per-layer parallax

Usage:
  python -I layers.py --spec spec.json --base <dir for relative paths> --out s012.mp4 \
      --dur 3.4 --fps 30 --size 1080x1920 --ffmpeg ffmpeg
"""
import argparse, json, math, os, subprocess, sys

import cv2
import numpy as np


def smooth(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)


def interp_keys(keys, t, dur):
    """keys: list of dicts with t (seconds, or 'end'); returns merged state."""
    st = {"x": 0.5, "y": 0.5, "s": 1.0, "a": 1.0, "r": 0.0}
    if not keys:
        return st
    ks = []
    for k in keys:
        k = dict(k)
        k["t"] = dur if k.get("t") == "end" else float(k.get("t", 0))
        ks.append(k)
    ks.sort(key=lambda k: k["t"])
    cur = dict(st)
    for k in ks:                       # fill missing fields forward
        for f in st:
            if f in k:
                cur[f] = float(k[f])
        k.update({f: cur[f] for f in st})
    if t <= ks[0]["t"]:
        return {f: ks[0][f] for f in st}
    for a, b in zip(ks, ks[1:]):
        if t <= b["t"]:
            e = smooth((t - a["t"]) / max(1e-6, b["t"] - a["t"]))
            return {f: a[f] + (b[f] - a[f]) * e for f in st}
    return {f: ks[-1][f] for f in st}


# ---------------------------------------------------------------- cutouts

def cut_border(img, tol=26, feather=1.2):
    """Remove the flat background colour connected to the image border."""
    h, w = img.shape[:2]
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    edge = np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])
    bg = np.median(edge, axis=0)
    dist = np.linalg.norm(lab - bg, axis=2)
    cand = (dist < tol).astype(np.uint8)
    # keep only background-coloured pixels connected to the border
    mask = np.zeros((h + 2, w + 2), np.uint8)
    fill = cand.copy()
    for (x, y) in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)] + [(x, 0) for x in range(0, w, 16)] + \
            [(x, h - 1) for x in range(0, w, 16)] + [(0, y) for y in range(0, h, 16)] + [(w - 1, y) for y in range(0, h, 16)]:
        if fill[y, x] == 1:
            cv2.floodFill(fill, mask, (x, y), 2)
    bgmask = (fill == 2).astype(np.uint8)
    # drop specks inside the figure, then soften the edge a little
    bgmask = cv2.morphologyEx(bgmask, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    alpha = 1.0 - bgmask.astype(np.float32)
    alpha = cv2.erode(alpha, np.ones((3, 3), np.uint8))   # drop the light fringe, keep the ink outline
    if feather:
        alpha = cv2.GaussianBlur(alpha, (0, 0), feather)
    return alpha


def cut_green(img, feather=1.0):
    f = img.astype(np.float32)
    b, g, r = f[..., 0], f[..., 1], f[..., 2]
    spill = g - np.maximum(r, b)
    alpha = 1.0 - np.clip((spill - 30) / 50, 0, 1)
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    if feather:
        alpha = cv2.GaussianBlur(alpha, (0, 0), feather)
    # de-spill green fringe
    out = img.copy()
    gg = np.minimum(g, np.maximum(r, b) + 10)
    out[..., 1] = gg.astype(np.uint8)
    return alpha, out


def load_layer_image(path, cut, crop=None):
    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if img is None:
        sys.exit(f"cannot read {path}")
    if img.ndim == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    if crop:                                     # [x0, y0, x1, y1] in 0..1
        h, w = img.shape[:2]
        img = img[int(crop[1] * h):int(crop[3] * h), int(crop[0] * w):int(crop[2] * w)]
    if img.shape[2] == 4:
        a = img[..., 3].astype(np.float32) / 255
        rgb = img[..., :3]
    elif cut == "border":
        rgb = img
        a = cut_border(img)
    elif cut == "green":
        a, rgb = cut_green(img)
    else:
        rgb, a = img, np.ones(img.shape[:2], np.float32)
    if cut:                                      # trim to the visible box
        ys, xs = np.where(a > 0.05)
        if len(xs):
            y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
            rgb, a = rgb[y0:y1, x0:x1], a[y0:y1, x0:x1]
    return rgb.astype(np.float32), a.astype(np.float32)


def split_parts(rgb, a, min_area=0.002):
    """Separate the connected pieces of a cut-out sheet (e.g. 3 papers in one image)."""
    n, lab, stats, _ = cv2.connectedComponentsWithStats((a > 0.3).astype(np.uint8))
    tot = a.shape[0] * a.shape[1]
    parts = []
    for i in range(1, n):
        x, y, w, h, area = stats[i]
        if area < min_area * tot:
            continue
        m = (lab[y:y + h, x:x + w] == i).astype(np.float32)
        m = cv2.dilate(m, np.ones((3, 3), np.uint8))
        parts.append((rgb[y:y + h, x:x + w], a[y:y + h, x:x + w] * m, x))
    parts.sort(key=lambda p: p[2])
    return [(p[0], p[1]) for p in parts]


# ---------------------------------------------------------------- render

def affine(cx, cy, s_x, s_y, rot_deg, tx, ty):
    """Matrix that maps layer pixels: centre (cx,cy) -> (tx,ty), scaled and rotated."""
    r = math.radians(rot_deg)
    c, s = math.cos(r), math.sin(r)
    A = np.array([[c * s_x, -s * s_y], [s * s_x, c * s_y]], np.float64)
    t = np.array([tx, ty]) - A @ np.array([cx, cy])
    return np.hstack([A, t[:, None]])


def compose(M2, M1):
    a = np.vstack([M2, [0, 0, 1]]) @ np.vstack([M1, [0, 0, 1]])
    return a[:2]


def blend(canvas, rgb, a, M, W, H):
    wa = cv2.warpAffine(a, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    if wa.max() <= 0:
        return
    wr = cv2.warpAffine(rgb, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    wa = wa[..., None]
    canvas *= (1 - wa)
    canvas += wr * wa


def catmull_rom(P, k=12):
    """Smooth curve through the given points."""
    P = np.vstack([P[0], P, P[-1]])
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for u in np.linspace(0, 1, k, endpoint=False):
            u2, u3 = u * u, u * u * u
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3))
    out.append(P[-2])
    return np.array(out)


def path_canvas(L, W, H, t, dur):
    pts = np.array(L["points"], np.float64) * [W, H]
    if L.get("smooth", True) and len(pts) > 2:
        pts = catmull_rom(pts)
    t0, t1 = L.get("draw", [0, dur])
    prog = smooth((t - t0) / max(1e-6, t1 - t0)) if t1 > t0 else 1.0
    seg = np.linalg.norm(np.diff(pts, axis=0), axis=1)
    cum = np.concatenate([[0], np.cumsum(seg)])
    total = cum[-1]
    upto = total * prog
    width = max(1, int(round(L.get("width", 0.009) * W)))
    dash = L.get("dash", 0.0) * W
    col = np.array(L.get("color", [40, 40, 190]), np.float32)
    rgb = np.zeros((H, W, 3), np.float32)
    a = np.zeros((H, W), np.float32)
    if upto <= 0:
        return rgb, a, None
    # resample along the path every ~2px so dashes and the tip are exact
    n = max(2, int(upto / 2))
    ds = np.linspace(0, upto, n)
    xs = np.interp(ds, cum, pts[:, 0]); ys = np.interp(ds, cum, pts[:, 1])
    P = np.stack([xs, ys], 1)
    on = np.ones(n, bool) if dash <= 0 else (np.floor(ds / dash) % 2 == 0)
    sh = 4  # sub-pixel precision for antialiased lines
    for i in range(n - 1):
        if on[i]:
            p0 = tuple(int(v * (1 << sh)) for v in P[i]); p1 = tuple(int(v * (1 << sh)) for v in P[i + 1])
            cv2.line(a, p0, p1, 1.0, width, cv2.LINE_AA, sh)
    # direction of travel at the tip (for arrowheads and icons)
    back = P[max(0, len(P) - 1 - max(3, int(width * 3)))]
    ang = math.atan2(P[-1][1] - back[1], P[-1][0] - back[0]) if len(P) > 1 else 0.0
    L["_tip"] = (float(P[-1][0]), float(P[-1][1]), ang, prog)
    head = L.get("head", True)
    if head == "arrow":                          # filled arrowhead pointing along the route
        s = width * 3.2
        c, s_ = math.cos(ang), math.sin(ang)
        tipx, tipy = P[-1] + np.array([c, s_]) * s * 0.6
        tri = np.array([[tipx, tipy],
                        [tipx - c * s * 1.6 - s_ * s, tipy - s_ * s * 1.6 + c * s],
                        [tipx - c * s * 1.6 + s_ * s, tipy - s_ * s * 1.6 - c * s]])
        cv2.fillPoly(a, [np.round(tri * (1 << sh)).astype(np.int32)], 1.0, cv2.LINE_AA, sh)
    elif head:
        tip = tuple(int(v * (1 << sh)) for v in P[-1])
        cv2.circle(a, tip, int(width * 1.6 * (1 << sh)), 1.0, -1, cv2.LINE_AA, sh)
    rgb[:] = col
    if L.get("glow", True):                      # soft dark halo keeps it readable on any map
        halo = cv2.GaussianBlur(cv2.dilate(a, np.ones((3, 3), np.uint8)), (0, 0), width * 0.9)
        return rgb, a, np.clip(halo * 1.4, 0, 1) * 0.45
    return rgb, a, None


def vector_icon(kind, size, color):
    """Small built-in map icons drawn as flat shapes (no text, no symbols): 'ship' or 'banner'.
    Returns (rgb, alpha) of a size x size square, icon pointing to the right (+x)."""
    S = int(size) * 4
    a = np.zeros((S, S), np.float32)
    rgb = np.zeros((S, S, 3), np.float32)
    dark = np.array([30, 35, 45], np.float32)
    col = np.array(color, np.float32)
    if kind == "ship":                           # hull + two masts + sails, side view
        hull = np.array([[0.08, 0.62], [0.92, 0.62], [0.78, 0.80], [0.20, 0.80]]) * S
        cv2.fillPoly(a, [hull.astype(np.int32)], 1.0, cv2.LINE_AA)
        hull_mask = a.copy()
        for mx, top in ((0.42, 0.14), (0.66, 0.24)):
            cv2.line(a, (int(mx * S), int(0.62 * S)), (int(mx * S), int(top * S)), 1.0, max(2, S // 40), cv2.LINE_AA)
            sail = np.array([[mx + 0.02, top + 0.04], [mx + 0.02, 0.56], [mx + 0.20, 0.52]]) * S
            cv2.fillPoly(a, [sail.astype(np.int32)], 1.0, cv2.LINE_AA)
        rgb[:] = np.array([235, 240, 245], np.float32)           # light sails
        rgb[hull_mask > 0.5] = dark
        rgb[(a > 0) & (hull_mask <= 0.5) & (np.abs(np.arange(S)[None, :] - 0.42 * S) < S / 50)] = dark
    else:                                        # banner on a pole, cloth flying to the right
        cv2.line(a, (int(0.25 * S), int(0.92 * S)), (int(0.25 * S), int(0.08 * S)), 1.0, max(2, S // 30), cv2.LINE_AA)
        pole = a.copy()
        cloth = np.array([[0.27, 0.10], [0.85, 0.20], [0.70, 0.32], [0.86, 0.44], [0.27, 0.48]]) * S
        cv2.fillPoly(a, [cloth.astype(np.int32)], 1.0, cv2.LINE_AA)
        rgb[:] = col
        rgb[pole > 0.5] = dark
    rgb = cv2.resize(rgb, (int(size), int(size)), interpolation=cv2.INTER_AREA)
    a = cv2.resize(a, (int(size), int(size)), interpolation=cv2.INTER_AREA)
    return rgb, a


def path_extras(L, W, H, t, dur, base):
    """Icon riding the tip of a path and a pulsing target ring at its end. Returns list of (rgb, a)."""
    out = []
    if "_tip" not in L:
        return out
    x, y, ang, prog = L["_tip"]
    col = L.get("color", [40, 40, 190])
    ic = L.get("icon")
    if ic and prog > 0:
        spec = ic if isinstance(ic, dict) else {"kind": ic}
        size = float(spec.get("size", 0.075)) * W
        if "_icon" not in L:
            if "path" in spec:
                p = spec["path"] if os.path.isabs(spec["path"]) else os.path.join(base, spec["path"])
                irgb, ia = load_layer_image(p, spec.get("cut", "green"))
                sc = size / max(ia.shape)
                irgb = cv2.resize(irgb, None, fx=sc, fy=sc, interpolation=cv2.INTER_AREA)
                ia = cv2.resize(ia, None, fx=sc, fy=sc, interpolation=cv2.INTER_AREA)
            else:
                irgb, ia = vector_icon(spec.get("kind", "ship"), size, spec.get("color", col))
            L["_icon"] = (irgb, ia)
        irgb, ia = L["_icon"]
        ih, iw = ia.shape
        flip = math.cos(ang) < 0                 # face the direction of travel, never upside down
        if flip:
            irgb, ia = irgb[:, ::-1].copy(), ia[:, ::-1].copy()
        lift = float(spec.get("lift", 0.55))      # sit slightly above the line
        bob = 0.04 * size * math.sin(2 * math.pi * 0.8 * t)
        fade = min(1.0, prog * 6)
        M = affine(iw / 2, ih / 2, 1, 1, 0, x, y - lift * ih + bob)
        cv = np.zeros((H, W, 3), np.float32); ca = np.zeros((H, W), np.float32)
        wa = cv2.warpAffine(ia, M, (W, H)) * fade
        wr = cv2.warpAffine(irgb, M, (W, H), borderMode=cv2.BORDER_REPLICATE)
        out.append((wr, wa))
    tg = L.get("target")
    t1 = L.get("draw", [0, dur])[1]
    if tg and t >= t1:
        spec = tg if isinstance(tg, dict) else {}
        R = float(spec.get("radius", 0.05)) * W
        tcol = np.array(spec.get("color", col), np.float32)
        pts = L["points"][-1]
        cx, cy = pts[0] * W, pts[1] * H
        a = np.zeros((H, W), np.float32)
        lw = max(2, int(W * 0.005))
        cv2.circle(a, (int(cx), int(cy)), int(R * 0.45), 0.9, lw, cv2.LINE_AA)        # steady inner ring
        period = float(spec.get("period", 1.2))
        for k in (0, 0.5):                                                            # two expanding pulses
            ph = ((t - t1) / period + k) % 1.0
            cv2.circle(a, (int(cx), int(cy)), int(R * (0.45 + 0.9 * ph)), (1 - ph) * 0.9, lw, cv2.LINE_AA)
        rgb = np.zeros((H, W, 3), np.float32); rgb[:] = tcol
        out.append((rgb, np.clip(a, 0, 1)))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--spec", required=True)
    ap.add_argument("--base", default=".")
    ap.add_argument("--out", required=True)
    ap.add_argument("--dur", type=float, default=4)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--size", default="1080x1920")
    ap.add_argument("--ffmpeg", default="ffmpeg")
    ap.add_argument("--seed", type=int, default=7)
    args = ap.parse_args()
    spec = json.loads(open(args.spec, encoding="utf8").read()) if os.path.exists(args.spec) else json.loads(args.spec)
    OW, OH = map(int, args.size.split("x"))
    work = float(spec.get("work", 0.72))         # render smaller, ffmpeg upscales (Flow images are 768px wide)
    W, H = int(round(OW * work / 2) * 2), int(round(OH * work / 2) * 2)
    dur, fps = args.dur, args.fps
    n = round(dur * fps)
    rng = np.random.default_rng(args.seed)

    layers = []
    for L in spec["layers"]:
        L = dict(L)
        if L.get("type", "image") == "image":
            p = L["path"] if os.path.isabs(L["path"]) else os.path.join(args.base, L["path"])
            rgb, a = load_layer_image(p, L.get("cut"), L.get("crop"))
            if "part" in L:                       # pick one piece of a multi-object sheet
                parts = split_parts(rgb, a)
                if not parts:
                    sys.exit(f"no parts found in {p}")
                rgb, a = parts[int(L["part"]) % len(parts)]
            L["_img"] = (rgb, a)
            L["_ph"] = rng.random(4) * 6.283
        layers.append(L)

    cam = spec.get("camera", {})
    push = float(cam.get("push", 0.03))
    pan = np.array(cam.get("pan", [0, 0]), np.float64) * [W, H]

    cmd = [args.ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24",
           "-s", f"{W}x{H}", "-r", str(fps), "-i", "-", "-c:v", "libx264", "-preset", "veryfast",
           "-crf", "18", "-pix_fmt", "yuv420p", "-vf", f"scale={OW}:{OH}:flags=lanczos,setsar=1", args.out]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    for f in range(n):
        t = f / fps
        e = smooth(f / max(1, n - 1))
        canvas = np.zeros((H, W, 3), np.float32)
        for L in layers:
            par = float(L.get("parallax", 1.0))
            z = 1 + push * e * par
            C = affine(W / 2, H / 2, z, z, 0, W / 2 + pan[0] * (e - 0.5) * par, H / 2 + pan[1] * (e - 0.5) * par)
            if L.get("type") == "path":
                rgb, a, halo = path_canvas(L, W, H, t, dur)
                if halo is not None:
                    blend(canvas, np.zeros_like(rgb), halo, C, W, H)
                blend(canvas, rgb, a, C, W, H)
                for xr, xa in path_extras(L, W, H, t, dur, args.base):
                    blend(canvas, xr, xa, C, W, H)
                continue
            rgb, a = L["_img"]
            ih, iw = a.shape
            if L.get("cover"):
                base = max(W / iw, H / ih)
                st = {"x": 0.5, "y": 0.5, "s": 1, "a": 1, "r": 0}
                st.update(interp_keys(L.get("keys"), t, dur) if L.get("keys") else {})
                ax, ay = 0.5, 0.5
            else:
                base = float(L.get("w", 0.5)) * W / iw if "w" in L else float(L.get("h", 0.5)) * H / ih
                st = interp_keys(L.get("keys") or [{"t": 0, "x": L.get("x", 0.5), "y": L.get("y", 0.5)}], t, dur)
                ax, ay = L.get("anchor", [0.5, 0.5])
            sx = sy = base * st["s"]
            rot = st["r"]
            ph = L.get("_ph", np.zeros(4))
            if L.get("breathe"):
                sy *= 1 + float(L["breathe"]) * math.sin(2 * math.pi * 0.28 * t + ph[0])
            if L.get("sway"):
                sw = L["sway"]
                rot += float(sw.get("deg", 1.5)) * math.sin(2 * math.pi * float(sw.get("speed", 0.5)) * t + ph[1])
            if L.get("flutter"):
                fl = L["flutter"]
                sp = float(fl.get("speed", 1.6))
                rot += float(fl.get("deg", 25)) * (0.6 * math.sin(2 * math.pi * sp * t + ph[2]) + 0.4 * math.sin(2 * math.pi * sp * 2.3 * t + ph[3]))
                sx *= 0.75 + 0.25 * abs(math.cos(2 * math.pi * sp * 0.7 * t + ph[0]))   # paper turning edge-on
            pivot = (L.get("sway") or {}).get("pivot")
            px, py = (pivot[0] * iw, pivot[1] * ih) if pivot else (ax * iw, ay * ih)
            # place anchor point at (x, y); rotate around the pivot
            M = affine(px, py, sx, sy, rot, st["x"] * W + (px - ax * iw) * sx, st["y"] * H + (py - ay * ih) * sy)
            if L.get("cover"):
                M = affine(iw / 2, ih / 2, sx, sy, rot, W / 2 + (st["x"] - 0.5) * W, H / 2 + (st["y"] - 0.5) * H)
            alpha = a * st["a"] if st["a"] < 1 else a
            if L.get("shadow"):                   # soft contact shadow under a cut-out figure
                sh = L["shadow"]
                Ms = M.copy(); Ms[:, 2] += np.array(sh.get("offset", [0.01, 0.004])) * [W, H]
                sa = cv2.GaussianBlur(alpha, (0, 0), 6) * float(sh.get("opacity", 0.35))
                blend(canvas, np.zeros_like(rgb), sa, compose(C, Ms), W, H)
            if "tint" in L:                       # match a cut-out to the scene light: [b,g,r], amount
                tc, amt = np.array(L["tint"][0], np.float32), float(L["tint"][1])
                rgb = rgb * (1 - amt) + rgb * (tc / 255) * amt
            if "shade" in L:                      # darker towards the feet / one side, like the scene light
                sh = L["shade"]
                if "_shade" not in L:
                    yy = np.linspace(0, 1, ih, dtype=np.float32)[:, None]
                    xx = np.linspace(0, 1, iw, dtype=np.float32)[None, :]
                    g = 1 - float(sh.get("bottom", 0.25)) * yy - float(sh.get("side", 0.0)) * xx
                    L["_shade"] = np.clip(g, 0, 1)[..., None]
                rgb = rgb * L["_shade"]
            blend(canvas, rgb, alpha, compose(C, M), W, H)

        g = float(spec.get("grain", 0.015))
        if g:
            canvas += rng.normal(0, g * 255, (H, W, 1)).astype(np.float32)
        np.clip(canvas, 0, 255, out=canvas)
        ff.stdin.write(canvas.astype(np.uint8).tobytes())
    ff.stdin.close()
    if ff.wait() != 0:
        sys.exit("ffmpeg failed")


if __name__ == "__main__":
    main()
