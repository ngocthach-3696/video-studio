import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ffmpeg, log, probeDuration, probeSize, readJson, run, sha1 } from "./util.mjs";

// Local "living still" effects (src/fx.py): 2.5D parallax drift, water ripple,
// fog, rain/ash/embers/dust, flicker. Free, no AI video. Enabled per scene with
// "fx": {...} (or project-level "fx" as the default; scene "fx": null opts out).
const HERE = path.dirname(fileURLToPath(import.meta.url));
const FX_PY = path.join(HERE, "fx.py");
const DEPTH_MODEL = path.resolve(HERE, "../../tools/models/depth_anything_v2_small.onnx");
const PYTHON = process.env.PYTHON || "python";

async function renderFx(src, out, spec, frames, W, H, cropBottom, seed) {
  if (!fs.existsSync(DEPTH_MODEL)) {
    throw new Error(`Thiếu model chiều sâu: ${DEPTH_MODEL}\nChạy setup.ps1 hoặc tải onnx-community/depth-anything-v2-small (onnx/model.onnx) về đó.`);
  }
  await run(PYTHON, [
    "-I", FX_PY, "--image", src, "--out", out, "--dur", (frames / FPS).toFixed(4), "--fps", String(FPS),
    "--size", `${W}x${H}`, "--fx", JSON.stringify(spec), "--model", DEPTH_MODEL, "--ffmpeg", "ffmpeg",
    "--seed", String(seed), "--crop-bottom", String(cropBottom || 0),
  ]);
}

// Layered cut-out animation (src/layers.py): scene "layers": "layers/s012.json" (path relative to the
// project) or an inline spec object. Background, cut-out characters and props move on keyframes.
const LAYERS_PY = path.join(HERE, "layers.py");
async function renderLayers(spec, dir, out, frames, W, H, seed) {
  const arg = typeof spec === "string" ? path.resolve(dir, spec) : JSON.stringify(spec);
  await run(PYTHON, [
    "-I", LAYERS_PY, "--spec", arg, "--base", dir, "--out", out, "--dur", (frames / FPS).toFixed(4),
    "--fps", String(FPS), "--size", `${W}x${H}`, "--ffmpeg", "ffmpeg", "--seed", String(seed),
  ]);
}
// Camera moves + several shots per line (src/camera.py, styles/quy-chuan-dao-dien.md section 12).
// scene "camera": {path, ease, shake, whip, black} on the scene image; scene "shots": [{image: "s005b",
// at: 0.5, camera: {...}}, ...] cuts to more pictures inside the same line (at = fraction of the scene).
// A shot with no camera gets the "alternate" push/pull so it matches the other scenes.
const CAMERA_PY = path.join(HERE, "camera.py");
function defaultCamera(k) {
  const [ax, ay] = ANCHORS[k % ANCHORS.length];
  const a = { t: 0, x: 0.5, y: 0.5, z: 1 };
  const b = { t: 1, x: 0.5 + (ax - 0.5) * 0.5, y: 0.5 + (ay - 0.5) * 0.5, z: 1 + PUSH };
  return { path: k % 2 ? [{ ...b, t: 0 }, { ...a, t: 1 }] : [a, b] };
}
// A shot whose picture has an AI clip videos/<picture>.mp4 plays that clip instead of the camera move
// (only when animation is on). Used for scenes with several pictures ("shots").
const shotVideo = (dir, image, animated) => {
  const f = path.join(dir, "videos", `${path.basename(image, path.extname(image))}.mp4`);
  return animated && fs.existsSync(f) ? f : null;
};
function cameraShots(scene, dir, id, i, animated = false) {
  const first = path.join(dir, "images", `${id}.jpg`);
  const list = [{ image: first, at: 0, camera: scene.camera || defaultCamera(i), video: shotVideo(dir, first, animated) }];
  for (const [k, sh] of (scene.shots || []).entries()) {
    const f = sh.image.includes(".") ? path.resolve(dir, sh.image) : path.join(dir, "images", `${sh.image}.jpg`);
    list.push({ image: f, at: Number(sh.at), camera: sh.camera || defaultCamera(i + k + 1), video: shotVideo(dir, f, animated) });
  }
  return list.sort((a, b) => a.at - b.at);
}
// Start time and length (s) of every AI clip shown inside a shots scene, relative to the scene start.
function shotVideoSegments(shots, frames) {
  return shots.flatMap((sh, k) => {
    if (!sh.video) return [];
    const f0 = Math.round(sh.at * frames);
    const f1 = k + 1 < shots.length ? Math.round(shots[k + 1].at * frames) : frames;
    return [{ file: sh.video, offset: f0 / FPS, dur: (f1 - f0) / FPS }];
  });
}
async function renderCamera(shots, out, frames, W, H, tmpDir) {
  const parts = [];
  for (const [k, sh] of shots.entries()) {
    const f0 = Math.round(sh.at * frames);
    const f1 = k + 1 < shots.length ? Math.round(shots[k + 1].at * frames) : frames;
    const part = shots.length === 1 ? out : path.join(tmpDir, `${path.basename(out, ".mp4")}_${k}.mp4`);
    if (sh.video) {
      const vf = fitVideo(await probeDuration(sh.video), (f1 - f0) / FPS, W, H);
      await ffmpeg(["-i", sh.video, "-an", "-vf", vf + NORM, "-frames:v", String(f1 - f0), ...X264, part]);
    } else {
      await run(PYTHON, ["-I", CAMERA_PY, sh.image, part, String(f1 - f0), String(W), String(H), JSON.stringify(sh.camera)]);
    }
    parts.push(part);
  }
  if (parts.length > 1) {
    const list = path.join(tmpDir, `${path.basename(out, ".mp4")}_list.txt`);
    fs.writeFileSync(list, parts.map((p) => `file '${p.replace(/\\/g, "/")}'`).join("\n") + "\n");
    await ffmpeg(["-f", "concat", "-safe", "0", "-i", list, "-c", "copy", out]);
    for (const p of [...parts, list]) fs.rmSync(p);
  }
}
const camKey = (shots) => JSON.stringify(shots.map((s) => [s.image, fs.existsSync(s.image) ? fs.statSync(s.image).mtimeMs : 0, s.at, s.camera, s.video ? fs.statSync(s.video).mtimeMs : 0]));

const layersKey = (spec, dir) => {
  const txt = typeof spec === "string" ? fs.readFileSync(path.resolve(dir, spec), "utf8") : JSON.stringify(spec);
  const files = [...txt.matchAll(/"path"\s*:\s*"([^"]+)"/g)].map((m) => {
    const f = path.resolve(dir, m[1]);
    return fs.existsSync(f) ? `${m[1]}:${fs.statSync(f).mtimeMs}` : m[1];
  });
  return txt + files.join(",");
};

export const FPS = 30;
const UPSCALE = 4; // zoompan on an upscaled frame to avoid sub-pixel jitter
const ZOOM = 0.18;
const BREATHE = 0.04; // "breathe": barely-there push-in for near-still cartoon frames
const GROUP = 12; // clips per xfade pass (keeps decoder count / RAM bounded)
// "alternate": the reference-video camera (2026-11-15, styles/quy-chuan-dao-dien.md):
// slow 7% push-in / pull-out, alternating scene by scene, drifting toward a varying anchor.
const PUSH = 0.07;
const ANCHORS = [[0.5, 0.5], [0.35, 0.4], [0.65, 0.35], [0.5, 0.3], [0.4, 0.6], [0.6, 0.55]];
const MOTIONS = ["zoom-in", "pan-right", "zoom-out", "pan-left", "pan-up", "zoom-in", "pan-down", "zoom-out"];

// Scene k is on screen for `dur`, overlapping the next scene by xf (0 = hard
// cut). Its voice starts at start+lead and owns an audio segment that ends
// exactly where the next scene's voice begins, so narration and pictures stay
// locked together. pace = { xf, lead, pad, tail } in seconds (see presets.mjs).
// pauseAfter = { sceneId: seconds } adds a silence after that scene's line (the
// picture holds), used for dramatic pauses before a turn in the story.
export function buildTimeline(tts, pace, pauseAfter = {}) {
  const { xf, lead, pad, tail } = pace;
  let t = 0;
  const scenes = tts.map((a, i) => {
    const last = i === tts.length - 1;
    const extra = Number(pauseAfter[a.id] ?? 0);
    const frames = Math.ceil((last ? lead + a.duration + tail : a.duration + pad + extra + xf) * FPS);
    const dur = frames / FPS;
    const s = { id: a.id, start: t, dur, frames, voiceStart: t + lead, audioSeg: last ? dur - lead : dur - xf };
    t += dur - xf;
    return s;
  });
  const lastScene = scenes[scenes.length - 1];
  return { scenes, total: lastScene.start + lastScene.dur, xf, lead };
}

// "contain" keeps the whole picture (maps, paintings, archival photos) on a
// blurred, darkened copy of itself instead of cropping it to the frame.
const CONTAIN_ZOOM = 0.08;

async function resolveFit(fit, img, W, H) {
  if (fit !== "auto") return fit;
  const { w, h } = await probeSize(img);
  return Math.abs(Math.log(w / h / (W / H))) > 0.25 ? "contain" : "cover";
}

export function resolveMotion(m, i) {
  if (m === "alternate") return `${i % 2 ? "pull" : "push"}:${i % ANCHORS.length}`;
  if (m === "push" || m === "pull") return `${m}:${i % ANCHORS.length}`;
  return m;
}

export function kenBurns(motion, frames, W, H, cropBottom, fit = "cover") {
  const M = Math.max(frames - 1, 1);
  const p = `(on/${M})`;
  const e = `(${p}*${p}*(3-2*${p}))`; // smoothstep easing
  const cx = "iw/2-(iw/zoom/2)";
  const cy = "ih/2-(ih/zoom/2)";
  const Z = fit === "contain" ? CONTAIN_ZOOM : ZOOM;
  const zf = `${1 + Z}`;
  const pp = /^(push|pull):(\d+)$/.exec(motion);
  const [ax, ay] = pp ? ANCHORS[Number(pp[2]) % ANCHORS.length] : [0.5, 0.5];
  const spec = pp ? [
    pp[1] === "push" ? `1+${PUSH}*${e}` : `${1 + PUSH}-${PUSH}*${e}`,
    `(iw-iw/zoom)*${ax}`,
    `(ih-ih/zoom)*${ay}`,
  ] : {
    still: ["1", cx, cy],
    breathe: [`1+${BREATHE}*${e}`, cx, cy],
    "zoom-in": [`1+${Z}*${e}`, cx, cy],
    "zoom-out": [`${1 + Z}-${Z}*${e}`, cx, cy],
    "pan-right": [zf, `(iw-iw/zoom)*${e}`, cy],
    "pan-left": [zf, `(iw-iw/zoom)*(1-${e})`, cy],
    "pan-down": [zf, cx, `(ih-ih/zoom)*${e}`],
    "pan-up": [zf, cx, `(ih-ih/zoom)*(1-${e})`],
  }[motion];
  if (!spec) throw new Error(`motion không hợp lệ: ${motion} (dùng still, breathe, push, pull, alternate, zoom-in, zoom-out, pan-left, pan-right, pan-up, pan-down)`);
  const [z, x, y] = spec;
  const UW = W * UPSCALE;
  const UH = H * UPSCALE;
  const pre = cropBottom ? `crop=iw:ih*${(1 - cropBottom).toFixed(3)}:0:0,` : "";
  const zoompan = `zoompan=z='${z}':x='${x}':y='${y}':d=${frames}:s=${W}x${H}:fps=${FPS},setsar=1`;
  if (fit === "contain") {
    const bw = Math.round(W / 4);
    const bh = Math.round(H / 4);
    return (
      `${pre}split[a][b];` +
      `[a]scale=${bw}:${bh}:force_original_aspect_ratio=increase,crop=${bw}:${bh},boxblur=12:3,scale=${UW}:${UH},eq=brightness=-0.18[bg];` +
      `[b]scale=${UW}:${UH}:force_original_aspect_ratio=decrease[fg];` +
      `[bg][fg]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2,${zoompan}`
    );
  }
  return `${pre}scale=${UW}:${UH}:force_original_aspect_ratio=increase,crop=${UW}:${UH},${zoompan}`;
}

const X264 = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", String(FPS)];
// Every clip must come out as limited-range yuv420p: JPEG stills otherwise stay yuvj420p, and a
// format switch inside video.mp4 makes ffmpeg re-init the final filtergraph, which drops the
// logo overlay for a few frames at each still <-> Veo cut (seen 2026-11-15). Colour tags still differ
// (Veo smpte170m vs stills bt470bg), so finalize also reads video.mp4 with -reinit_filter 0.
const NORM = ",scale=out_range=tv,format=yuv420p";

// An AI clip is usually shorter than its scene: slow it down a little, then
// hold the last frame for whatever is still missing.
const MAX_SLOWDOWN = 1.35;

function fitVideo(clipDur, sceneDur, W, H) {
  const k = Math.min(Math.max(sceneDur / clipDur, 1), MAX_SLOWDOWN);
  return [
    `setpts=${k.toFixed(4)}*PTS`,
    `fps=${FPS}`,
    `scale=${W}:${H}:force_original_aspect_ratio=increase`,
    `crop=${W}:${H}`,
    `tpad=stop_mode=clone:stop_duration=${Math.ceil(sceneDur)}`,
    "setsar=1",
  ].join(",");
}

// A still frame needs no zoompan: scale once and repeat it.
const stillFilter = (W, H, cropBottom) =>
  `${cropBottom ? `crop=iw:ih*${(1 - cropBottom).toFixed(3)}:0:0,` : ""}scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1`;

// True when scene i is shown with its AI clip videos/<id>.mp4 (not the still image).
// Scenes with several pictures ("shots") go through the camera path, which plays clips per picture.
export function sceneUsesVideo(project, dir, i, id, animated) {
  const marked = project.animateScope !== "marked" || !!project.scenes[i].video?.trim();
  if (project.scenes[i].shots?.length) return false;
  return animated && marked && fs.existsSync(path.join(dir, "videos", `${id}.mp4`));
}

// project.veoAudio: { volume: 1, lufs: -24 } — keep the clips' own ambience (Veo sound):
// each used clip's audio is cut to its scene, levelled to `lufs`, faded at the cuts and
// placed at the scene start. Writes veo-audio.wav (or returns null when nothing to mix).
export async function buildVeoAudio(project, dir, timeline, animated) {
  const cfg = project.veoAudio;
  if (!cfg || cfg.enabled === false) return null;
  // whole-scene clips + clips inside shots scenes: {file, start, dur, id}
  const items = [];
  timeline.scenes.forEach((s, i) => {
    const sc = project.scenes[i];
    if (sc.veoAudio === false) return;
    if (sceneUsesVideo(project, dir, i, s.id, animated)) {
      items.push({ file: path.join(dir, "videos", `${s.id}.mp4`), start: s.start, dur: s.dur, id: s.id });
    } else if (sc.shots?.length) {
      for (const g of shotVideoSegments(cameraShots(sc, dir, s.id, i, animated), s.frames))
        items.push({ file: g.file, start: s.start + g.offset, dur: g.dur, id: path.basename(g.file, ".mp4") });
    }
  });
  if (!items.length) return null;
  const lufs = Number(cfg.lufs ?? -24);
  const fade = 0.12;
  const args = [];
  const parts = [];
  items.forEach(({ file, start, dur: d }, k) => {
    args.push("-i", path.relative(dir, file));
    parts.push(
      `[${k}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,atrim=0:${d.toFixed(3)},asetpts=PTS-STARTPTS,` +
        `loudnorm=I=${lufs}:LRA=11:TP=-6,aresample=48000,` +
        `afade=t=in:d=${fade},afade=t=out:st=${Math.max(d - fade, 0).toFixed(3)}:d=${fade},` +
        `adelay=${Math.round(start * 1000)}:all=1[v${k}]`,
    );
  });
  const total = timeline.total ?? timeline.scenes.at(-1).start + timeline.scenes.at(-1).dur;
  parts.push(
    `${items.map((_, k) => `[v${k}]`).join("")}amix=inputs=${items.length}:duration=longest:normalize=0,` +
      `apad,atrim=0:${total.toFixed(3)}[out]`,
  );
  const graph = path.join(dir, "veo-audio.graph.txt");
  fs.writeFileSync(graph, parts.join(";"));
  await ffmpeg([...args, "-/filter_complex", "veo-audio.graph.txt", "-map", "[out]", "-ar", "48000", "-ac", "2", "veo-audio.wav"], { cwd: dir });
  fs.rmSync(graph);
  log(`  tiếng Veo: ${items.length} clip (${items.map((it) => it.id).join(" ")})`);
  return { file: path.join(dir, "veo-audio.wav"), volume: Number(cfg.volume ?? 1) };
}

export async function renderClips(project, dir, timeline, { W, H, animated }) {
  const clipsDir = path.join(dir, "clips");
  fs.mkdirSync(clipsDir, { recursive: true });
  const manifest = readJson(path.join(dir, "images", "manifest.json"), {});
  for (const [i, s] of timeline.scenes.entries()) {
    const aiVideo = path.join(dir, "videos", `${s.id}.mp4`);
    const useVideo = sceneUsesVideo(project, dir, i, s.id, animated);
    const src = useVideo ? aiVideo : path.join(dir, "images", `${s.id}.jpg`);
    const cropBottom = useVideo ? 0 : manifest[s.id]?.cropBottom || 0;
    const defaultFit = manifest[s.id]?.provider === "commons" ? "auto" : "cover";
    const fit = useVideo ? "cover" : await resolveFit(project.scenes[i].fit || defaultFit, src, W, H);
    const fxSpec = "fx" in project.scenes[i] ? project.scenes[i].fx : project.fx;
    const layersSpec = project.scenes[i].layers;
    const useLayers = !useVideo && !!layersSpec;
    const useFx = !useVideo && !useLayers && fit === "cover" && !!fxSpec;
    const sc = project.scenes[i];
    const useCamera = !useVideo && !useLayers && !useFx && (!!sc.camera || !!sc.shots?.length);
    const shots = useCamera ? cameraShots(sc, dir, s.id, i, animated) : null;
    const motion = useVideo ? "ai-video" : useLayers ? "layers" : useFx ? "fx" : useCamera ? `camera x${shots.length}` : resolveMotion(sc.motion || project.motion || MOTIONS[i % MOTIONS.length], i);
    const st = fs.statSync(src);
    const key = sha1([st.size, st.mtimeMs, s.frames, motion, W, H, cropBottom, fit, useFx ? JSON.stringify(fxSpec) : "", useLayers ? layersKey(layersSpec, dir) : "", useCamera ? camKey(shots) : "", "tv-range"].join("|"));
    const out = path.join(clipsDir, `${s.id}.mp4`);
    const keyFile = `${out}.key`;
    if (fs.existsSync(out) && fs.existsSync(keyFile) && fs.readFileSync(keyFile, "utf8") === key) continue;
    log(`  clip ${s.id} (${motion}${fit === "contain" ? ", contain" : ""}, ${s.dur.toFixed(1)}s)`);
    if (useCamera) {
      await renderCamera(shots, out, s.frames, W, H, clipsDir);
    } else if (useLayers) {
      await renderLayers(layersSpec, dir, out, s.frames, W, H, i + 1);
    } else if (useFx) {
      await renderFx(src, out, fxSpec, s.frames, W, H, cropBottom, i + 1);
    } else if (motion === "still" && fit === "cover") {
      await ffmpeg(["-loop", "1", "-framerate", String(FPS), "-i", src, "-vf", stillFilter(W, H, cropBottom) + NORM, "-frames:v", String(s.frames), ...X264, out]);
    } else {
      const vf = useVideo ? fitVideo(await probeDuration(src), s.dur, W, H) : kenBurns(motion, s.frames, W, H, cropBottom, fit);
      await ffmpeg(["-i", src, "-an", "-vf", vf + NORM, "-frames:v", String(s.frames), ...X264, out]);
    }
    fs.writeFileSync(keyFile, key);
  }
}

// Chains clips with xfade. Large sets are joined in groups first (each group
// output is itself a clip), which keeps the timeline identical.
async function xfadeJoin(items, out, tmpDir, tag, XF) {
  if (items.length === 1) {
    fs.copyFileSync(items[0].file, out);
    return items[0].dur;
  }
  if (items.length > GROUP) {
    const joined = [];
    for (let i = 0; i < items.length; i += GROUP) {
      const f = path.join(tmpDir, `${tag}_${i / GROUP}.mp4`);
      joined.push({ file: f, dur: await xfadeJoin(items.slice(i, i + GROUP), f, tmpDir, `${tag}_${i / GROUP}`, XF) });
    }
    return xfadeJoin(joined, out, tmpDir, `${tag}_g`, XF);
  }
  let graph = "";
  let prev = "[0:v]";
  let offset = 0;
  for (let k = 1; k < items.length; k++) {
    offset += items[k - 1].dur - XF;
    graph += `${prev}[${k}:v]xfade=transition=fade:duration=${XF}:offset=${offset.toFixed(3)}[v${k}];`;
    prev = `[v${k}]`;
  }
  const graphFile = path.join(tmpDir, `${tag}.graph.txt`);
  fs.writeFileSync(graphFile, graph.replace(/;$/, ""));
  await ffmpeg([...items.flatMap((it) => ["-i", it.file]), "-/filter_complex", graphFile, "-map", prev, ...X264, out]);
  return items.reduce((a, it) => a + it.dur, 0) - (items.length - 1) * XF;
}

// Hard cuts: every clip shares codec settings, so the concat demuxer joins
// them without re-encoding.
async function cutJoin(items, out, tmpDir) {
  const list = path.join(tmpDir, "list.txt");
  fs.writeFileSync(list, items.map((it) => `file '${it.file.replace(/\\/g, "/").replace(/'/g, "'\\''")}'`).join("\n") + "\n");
  await ffmpeg(["-f", "concat", "-safe", "0", "-i", list, "-c", "copy", out]);
  return items.reduce((a, it) => a + it.dur, 0);
}

export async function joinClips(dir, timeline) {
  const tmpDir = path.join(dir, "clips", "_join");
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir, { recursive: true });
  const items = timeline.scenes.map((s) => ({ file: path.join(dir, "clips", `${s.id}.mp4`), dur: s.dur }));
  const out = path.join(dir, "video.mp4");
  const dur = timeline.xf > 0 ? await xfadeJoin(items, out, tmpDir, "j", timeline.xf) : await cutJoin(items, out, tmpDir);
  fs.rmSync(tmpDir, { recursive: true, force: true });
  return dur;
}

export async function buildNarration(dir, timeline, tts) {
  const n = timeline.scenes.length;
  const segs = timeline.scenes
    .map(
      (s, i) =>
        `[${i}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=mono,apad,atrim=0:${s.audioSeg.toFixed(3)},asetpts=N/SR/TB[a${i}]`,
    )
    .join(";");
  const graph = `${segs};${timeline.scenes.map((_, i) => `[a${i}]`).join("")}concat=n=${n}:v=0:a=1,adelay=delays=${Math.round(timeline.lead * 1000)}:all=1[out]`;
  const graphFile = path.join(dir, "audio", "narration.graph.txt");
  fs.writeFileSync(graphFile, graph);
  await ffmpeg([
    ...tts.flatMap((a) => ["-i", a.file]),
    "-/filter_complex", graphFile,
    "-map", "[out]",
    "-c:a", "pcm_s16le",
    path.join(dir, "narration.wav"),
  ]);
}

// ---------- subtitles (ASS, burned in) ----------

function proportional(tokens, dur) {
  const total = tokens.reduce((a, t) => a + t.length + 1, 0);
  let t = 0;
  return tokens.map((text) => {
    const d = (dur * (text.length + 1)) / total;
    const r = { text, start: t, end: t + d };
    t += d;
    return r;
  });
}

function chunkTokens(timed, max) {
  const out = [];
  let cur = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ text: cur.map((c) => c.text).join(" "), start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  for (const t of timed) {
    cur.push(t);
    if (cur.length >= max || (/[,.!?;:…]$/.test(t.text) && cur.length >= 2)) flush();
  }
  flush();
  return out;
}

function assTime(t) {
  const cs = Math.max(0, Math.round(t * 100));
  const h = Math.floor(cs / 360000);
  const m = Math.floor(cs / 6000) % 60;
  const s = Math.floor(cs / 100) % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs % 100).padStart(2, "0")}`;
}

// "#RRGGBB" + alpha (0 = opaque) -> ASS "&HAABBGGRR"
function assColor(hex, alpha = 0) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  if (!m) throw new Error(`màu không hợp lệ: ${hex} (dùng dạng #RRGGBB)`);
  const [r, g, b] = [0, 2, 4].map((k) => m[1].slice(k, k + 2));
  return `&H${alpha.toString(16).padStart(2, "0")}${b}${g}${r}`.toUpperCase();
}

const assText = (s) => String(s).replace(/[{}]/g, "").replace(/\r?\n/g, "\\N");

export function buildSubtitles(project, dir, timeline, tts, { W, H }, env, { subs = true } = {}) {
  const vertical = H > W;
  const st = project.subtitleStyle ?? {};
  const maxWords = st.maxWords ?? (vertical ? 6 : 9);
  const events = [];
  timeline.scenes.forEach((s, i) => {
    // Display the script's own tokens (with punctuation); take timings from
    // Edge word boundaries when they line up 1:1, else spread by length.
    const tokens = project.scenes[i].narration.trim().split(/\s+/);
    const words = tts[i].words || [];
    const timed =
      words.length === tokens.length
        ? tokens.map((text, k) => ({ text, start: words[k].start, end: words[k].end }))
        : proportional(tokens, tts[i].duration);
    for (const c of chunkTokens(timed, maxWords)) {
      events.push({ start: s.voiceStart + c.start, end: s.voiceStart + c.end, text: c.text });
    }
  });
  events.forEach((e, k) => {
    const next = events[k + 1];
    if (next && next.start - e.end < 0.4) e.end = next.start;
  });

  const [fs_, outline, mv] = [
    st.size ?? (vertical ? 66 : 52),
    st.outline ?? (vertical ? 5 : 4),
    st.marginV ?? (vertical ? 400 : 70),
  ];
  const font = st.font || env.SUB_FONT || "Arial";

  // Scene titles: big text at the top for the whole scene ("10 NĂM SAU", "776").
  const tt = project.titleStyle;
  const titles = timeline.scenes
    .map((s, i) => ({ s, text: project.scenes[i].title, size: project.scenes[i].titleSize }))
    .filter((x) => x.text?.trim())
    // scene "titleSize": smaller font for one long title so a line does not wrap on its own
    .map(({ s, text, size }) => `Dialogue: 1,${assTime(s.start)},${assTime(s.start + s.dur)},Title,,0,0,0,,{\\fad(120,0)${size ? `\\fs${size}` : ""}}${assText(text)}`);

  // Channel watermark: one word per line, small, faint, right edge, whole video.
  const wm = project.brand?.watermark?.trim();
  const watermark = wm
    ? [`Dialogue: 2,${assTime(0)},${assTime(timeline.total)},Watermark,,0,0,0,,${assText(wm).split(/\s+/).join("\\N")}`]
    : [];

  const ass = [
    "[Script Info]",
    "ScriptType: v4.00+",
    `PlayResX: ${W}`,
    `PlayResY: ${H}`,
    "WrapStyle: 0",
    "ScaledBorderAndShadow: yes",
    "",
    "[V4+ Styles]",
    "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
    `Style: Default,${font},${fs_},${assColor(st.color ?? "#FFFFFF")},&H000000FF,&H00000000,&H78000000,-1,0,0,0,100,100,0,0,1,${outline},${st.shadow ?? 2},2,${st.marginH ?? 70},${st.marginH ?? 70},${mv},1`,
    `Style: Title,${tt.font},${tt.size},${assColor(tt.color)},&H000000FF,${assColor(tt.outlineColor)},&H64000000,-1,0,0,0,100,100,0,0,1,${tt.outline},${tt.shadow},8,60,60,${tt.marginV},1`,
    `Style: Watermark,${font},${Math.round(W * 0.034)},&H50E0E0E0,&H000000FF,&H70000000,&H00000000,-1,-1,0,0,100,100,0,0,1,2,0,6,0,${Math.round(W * 0.15)},0,1`,
    "",
    "[Events]",
    "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ...(subs ? events.map((e) => `Dialogue: 0,${assTime(e.start)},${assTime(e.end)},Default,,0,0,0,,${assText(e.text)}`) : []),
    ...titles,
    ...watermark,
    "",
  ].join("\n");
  if (!subs && !titles.length && !watermark.length) return null;
  fs.writeFileSync(path.join(dir, "subs.ass"), ass);
  return "subs.ass";
}

// ---------- final mux ----------

// fontsDir: bundled fonts for libass. logo: { file, width } overlaid
// bottom-right. fadeIn: seconds of fade from black. loudnorm: -14 LUFS.
export async function finalize(dir, { subs, music, musicVolume, musicDelay = null, musicTrim = 0, ambience = null, veo = null, total, fontsDir, logo, fadeIn = 0, loudnorm = false, W }) {
  const args = ["-i", "video.mp4", "-i", "narration.wav"];
  // musicDelay === null → loop the track from t=0 (old behaviour); a number →
  // play once, starting at that second (used to land the track's ending on the video's end).
  if (music) args.push(...(musicDelay === null ? ["-stream_loop", "-1"] : []), "-i", music);
  // ambience: { file, volume } — a sound bed (rain, rumble…) from t=0, NOT ducked under the voice.
  const ambIdx = music ? 3 : 2;
  if (ambience) args.push("-i", ambience.file);
  // veo: { file, volume } — clip ambience track (buildVeoAudio), ducked under the voice like the music.
  const veoIdx = ambIdx + (ambience ? 1 : 0);
  if (veo) args.push("-i", veo.file);
  // Two passes (2026-11-15): mixing the audio in the same ffmpeg run as the video filters dropped
  // ~3 s chunks of audio (AAC packets with gaps; players jumped 0:04 → 0:11) once the Veo branch
  // was added. Pass 1 mixes the audio alone into final-audio.wav; pass 2 encodes the picture.
  const logoIdx = 2; // pass 2 inputs: video.mp4, final-audio.wav, logo

  const vparts = [];
  const parts = [];
  // Relative path + forward slashes: Windows drive colons break the filter syntax.
  const fd = fontsDir ? `:fontsdir='${path.relative(dir, fontsDir).replace(/\\/g, "/")}'` : "";
  const fade = fadeIn > 0 ? `,fade=t=in:st=0:d=${fadeIn}` : "";
  let v = "[0:v]";
  if (logo) {
    const lw = Math.round(W * logo.width);
    const m = Math.round(W * 0.02);
    const soft = logo.blur > 0 ? `,gblur=sigma=${logo.blur}` : "";
    const alpha = logo.opacity < 1 ? `,colorchannelmixer=aa=${logo.opacity}` : "";
    vparts.push(`[${logoIdx}:v]scale=${lw}:-1,format=rgba${soft}${alpha}[lg]`, `[0:v][lg]overlay=W-w-${Math.round(W * (logo.marginX ?? 0.02))}:H-h-${m}[vl]`);
    v = "[vl]";
  }
  vparts.push(subs ? `${v}subtitles=${subs}${fd}${fade}[v]` : `${v}null${fade}[v]`);
  const aOut = loudnorm ? "[a0]" : "[a]";
  if (music) {
    const fadeOut = Math.max(total - 3, 0).toFixed(2);
    parts.push(
      `[1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,asplit=${veo ? 3 : 2}[n1][n2]${veo ? "[n3]" : ""}`,
      `[2:a]atrim=start=${musicTrim},asetpts=PTS-STARTPTS,` +
        "aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo," +
        // carve room for the voice: drop rumble, dip the 2-4 kHz speech band a little
        `highpass=f=60,equalizer=f=3000:t=q:w=1.2:g=-4,volume=${musicVolume},afade=t=in:d=3` +
        (musicDelay ? `,adelay=${Math.round(musicDelay * 1000)}:all=1` : "") +
        `,apad,afade=t=out:st=${fadeOut}:d=3[m]`,
      // duck under narration; slow release so the piano doesn't pump between short lines
      "[m][n2]sidechaincompress=threshold=0.03:ratio=4:attack=60:release=900[md]",
    );
  } else {
    parts.push(`[1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo${veo ? ",asplit=2[n1][n3]" : "[n1]"}`);
  }
  const mix = ["[n1]", ...(music ? ["[md]"] : [])];
  if (veo) {
    parts.push(
      `[${veoIdx}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=${veo.volume ?? 1},apad[vo]`,
      // dip (not mute) under the voice so fire/rain/cannon still read between and under lines
      "[vo][n3]sidechaincompress=threshold=0.03:ratio=3:attack=40:release=600[vd]",
    );
    mix.push("[vd]");
  }
  if (ambience) {
    parts.push(`[${ambIdx}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=${ambience.volume ?? 1},apad[amb]`);
    mix.push("[amb]");
  }
  parts.push(mix.length > 1 ? `${mix.join("")}amix=inputs=${mix.length}:duration=first:normalize=0${aOut}` : `[n1]anull${aOut}`);
  if (loudnorm) parts.push(`[a0]loudnorm=I=${typeof loudnorm === "number" ? loudnorm : -14}:LRA=7:TP=-1,aresample=48000[a]`);
  const graphFile = path.join(dir, "final.graph.txt");
  // pass 1: audio only (input 0 = video.mp4 is listed only to keep the input indices; it is not decoded)
  fs.writeFileSync(graphFile, parts.join(";"));
  await ffmpeg([...args, "-/filter_complex", "final.graph.txt", "-map", "[a]", "-t", total.toFixed(3), "-c:a", "pcm_s16le", "-ar", "48000", "final-audio.wav"], { cwd: dir });
  // pass 2: picture (logo, subtitles, fade) + the mixed audio
  fs.writeFileSync(graphFile, vparts.join(";"));
  await ffmpeg(
    [
      "-reinit_filter", "0", "-i", "video.mp4", "-i", "final-audio.wav", ...(logo ? ["-loop", "1", "-framerate", String(FPS), "-i", logo.file] : []),
      "-/filter_complex", "final.graph.txt",
      "-map", "[v]",
      "-map", "1:a",
      "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "192k",
      "-t", total.toFixed(3),
      "-movflags", "+faststart",
      "final.mp4",
    ],
    { cwd: dir },
  );
  fs.rmSync(graphFile);
  return path.join(dir, "final.mp4");
}
