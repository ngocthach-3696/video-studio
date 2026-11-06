import fs from "node:fs";
import path from "node:path";
import { ffmpeg, log, probeDuration, probeSize, readJson, sha1 } from "./util.mjs";

export const FPS = 30;
const XF = 0.5; // crossfade between scenes (s)
const LEAD = 0.3; // narration starts this long after its scene starts fading in
const PAD = 0.35; // silence after each narration before the next scene's voice
const TAIL = 1.5; // hold on the last scene after the final line
const UPSCALE = 4; // zoompan on an upscaled frame to avoid sub-pixel jitter
const ZOOM = 0.18;
const GROUP = 12; // clips per xfade pass (keeps decoder count / RAM bounded)
const MOTIONS = ["zoom-in", "pan-right", "zoom-out", "pan-left", "pan-up", "zoom-in", "pan-down", "zoom-out"];

// Scene k is on screen for `dur`, overlapping the next scene by XF. Its voice
// starts at start+LEAD and owns an audio segment that ends exactly where the
// next scene's voice begins, so narration and pictures stay locked together.
export function buildTimeline(tts) {
  let t = 0;
  const scenes = tts.map((a, i) => {
    const last = i === tts.length - 1;
    const frames = Math.ceil((last ? LEAD + a.duration + TAIL : a.duration + PAD + XF) * FPS);
    const dur = frames / FPS;
    const s = { id: a.id, start: t, dur, frames, voiceStart: t + LEAD, audioSeg: last ? dur - LEAD : dur - XF };
    t += dur - XF;
    return s;
  });
  const lastScene = scenes[scenes.length - 1];
  return { scenes, total: lastScene.start + lastScene.dur };
}

// "contain" keeps the whole picture (maps, paintings, archival photos) on a
// blurred, darkened copy of itself instead of cropping it to the frame.
const CONTAIN_ZOOM = 0.08;

async function resolveFit(fit, img, W, H) {
  if (fit !== "auto") return fit;
  const { w, h } = await probeSize(img);
  return Math.abs(Math.log(w / h / (W / H))) > 0.25 ? "contain" : "cover";
}

function kenBurns(motion, frames, W, H, cropBottom, fit = "cover") {
  const M = Math.max(frames - 1, 1);
  const p = `(on/${M})`;
  const e = `(${p}*${p}*(3-2*${p}))`; // smoothstep easing
  const cx = "iw/2-(iw/zoom/2)";
  const cy = "ih/2-(ih/zoom/2)";
  const Z = fit === "contain" ? CONTAIN_ZOOM : ZOOM;
  const zf = `${1 + Z}`;
  const spec = {
    "zoom-in": [`1+${Z}*${e}`, cx, cy],
    "zoom-out": [`${1 + Z}-${Z}*${e}`, cx, cy],
    "pan-right": [zf, `(iw-iw/zoom)*${e}`, cy],
    "pan-left": [zf, `(iw-iw/zoom)*(1-${e})`, cy],
    "pan-down": [zf, cx, `(ih-ih/zoom)*${e}`],
    "pan-up": [zf, cx, `(ih-ih/zoom)*(1-${e})`],
  }[motion];
  if (!spec) throw new Error(`motion không hợp lệ: ${motion} (dùng zoom-in, zoom-out, pan-left, pan-right, pan-up, pan-down)`);
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

export async function renderClips(project, dir, timeline, { W, H, animated }) {
  const clipsDir = path.join(dir, "clips");
  fs.mkdirSync(clipsDir, { recursive: true });
  const manifest = readJson(path.join(dir, "images", "manifest.json"), {});
  for (const [i, s] of timeline.scenes.entries()) {
    const aiVideo = path.join(dir, "videos", `${s.id}.mp4`);
    const useVideo = animated && fs.existsSync(aiVideo);
    const src = useVideo ? aiVideo : path.join(dir, "images", `${s.id}.jpg`);
    const motion = useVideo ? "ai-video" : project.scenes[i].motion || MOTIONS[i % MOTIONS.length];
    const cropBottom = useVideo ? 0 : manifest[s.id]?.cropBottom || 0;
    const defaultFit = manifest[s.id]?.provider === "commons" ? "auto" : "cover";
    const fit = useVideo ? "cover" : await resolveFit(project.scenes[i].fit || defaultFit, src, W, H);
    const st = fs.statSync(src);
    const key = sha1([st.size, st.mtimeMs, s.frames, motion, W, H, cropBottom, fit].join("|"));
    const out = path.join(clipsDir, `${s.id}.mp4`);
    const keyFile = `${out}.key`;
    if (fs.existsSync(out) && fs.existsSync(keyFile) && fs.readFileSync(keyFile, "utf8") === key) continue;
    log(`  clip ${s.id} (${motion}${fit === "contain" ? ", contain" : ""}, ${s.dur.toFixed(1)}s)`);
    const vf = useVideo ? fitVideo(await probeDuration(src), s.dur, W, H) : kenBurns(motion, s.frames, W, H, cropBottom, fit);
    await ffmpeg(["-i", src, "-an", "-vf", vf, "-frames:v", String(s.frames), ...X264, out]);
    fs.writeFileSync(keyFile, key);
  }
}

// Chains clips with xfade. Large sets are joined in groups first (each group
// output is itself a clip), which keeps the timeline identical.
async function xfadeJoin(items, out, tmpDir, tag) {
  if (items.length === 1) {
    fs.copyFileSync(items[0].file, out);
    return items[0].dur;
  }
  if (items.length > GROUP) {
    const joined = [];
    for (let i = 0; i < items.length; i += GROUP) {
      const f = path.join(tmpDir, `${tag}_${i / GROUP}.mp4`);
      joined.push({ file: f, dur: await xfadeJoin(items.slice(i, i + GROUP), f, tmpDir, `${tag}_${i / GROUP}`) });
    }
    return xfadeJoin(joined, out, tmpDir, `${tag}_g`);
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

export async function joinClips(dir, timeline) {
  const tmpDir = path.join(dir, "clips", "_join");
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir, { recursive: true });
  const items = timeline.scenes.map((s) => ({ file: path.join(dir, "clips", `${s.id}.mp4`), dur: s.dur }));
  const dur = await xfadeJoin(items, path.join(dir, "video.mp4"), tmpDir, "j");
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
  const graph = `${segs};${timeline.scenes.map((_, i) => `[a${i}]`).join("")}concat=n=${n}:v=0:a=1,adelay=delays=${Math.round(LEAD * 1000)}:all=1[out]`;
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

export function buildSubtitles(project, dir, timeline, tts, { W, H }, env) {
  const vertical = H > W;
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
    for (const c of chunkTokens(timed, vertical ? 6 : 9)) {
      events.push({ start: s.voiceStart + c.start, end: s.voiceStart + c.end, text: c.text });
    }
  });
  events.forEach((e, k) => {
    const next = events[k + 1];
    if (next && next.start - e.end < 0.4) e.end = next.start;
  });

  const [fs_, outline, mv] = vertical ? [66, 5, 400] : [52, 4, 70];
  const font = env.SUB_FONT || "Arial";
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
    `Style: Default,${font},${fs_},&H00FFFFFF,&H000000FF,&H00000000,&H78000000,-1,0,0,0,100,100,0,0,1,${outline},2,2,70,70,${mv},1`,
    "",
    "[Events]",
    "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ...events.map((e) => `Dialogue: 0,${assTime(e.start)},${assTime(e.end)},Default,,0,0,0,,${e.text.replace(/[{}]/g, "")}`),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(dir, "subs.ass"), ass);
  return "subs.ass";
}

// ---------- final mux ----------

export async function finalize(dir, { subs, music, musicVolume, total }) {
  const args = ["-i", "video.mp4", "-i", "narration.wav"];
  if (music) args.push("-stream_loop", "-1", "-i", music);

  const parts = [];
  parts.push(subs ? `[0:v]subtitles=${subs}[v]` : "[0:v]null[v]");
  if (music) {
    const fadeOut = Math.max(total - 3, 0).toFixed(2);
    parts.push(
      "[1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,asplit=2[n1][n2]",
      `[2:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=${musicVolume},afade=t=in:d=2,afade=t=out:st=${fadeOut}:d=3[m]`,
      "[m][n2]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=500[md]",
      "[n1][md]amix=inputs=2:duration=first:normalize=0[a]",
    );
  } else {
    parts.push("[1:a]aformat=channel_layouts=stereo[a]");
  }
  const graphFile = path.join(dir, "final.graph.txt");
  fs.writeFileSync(graphFile, parts.join(";"));
  await ffmpeg(
    [
      ...args,
      "-/filter_complex", "final.graph.txt",
      "-map", "[v]",
      "-map", "[a]",
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
