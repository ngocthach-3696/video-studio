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

export const FPS = 30;
const UPSCALE = 4; // zoompan on an upscaled frame to avoid sub-pixel jitter
const ZOOM = 0.18;
const BREATHE = 0.04; // "breathe": barely-there push-in for near-still cartoon frames
const GROUP = 12; // clips per xfade pass (keeps decoder count / RAM bounded)
const MOTIONS = ["zoom-in", "pan-right", "zoom-out", "pan-left", "pan-up", "zoom-in", "pan-down", "zoom-out"];

// Scene k is on screen for `dur`, overlapping the next scene by xf (0 = hard
// cut). Its voice starts at start+lead and owns an audio segment that ends
// exactly where the next scene's voice begins, so narration and pictures stay
// locked together. pace = { xf, lead, pad, tail } in seconds (see presets.mjs).
export function buildTimeline(tts, pace) {
  const { xf, lead, pad, tail } = pace;
  let t = 0;
  const scenes = tts.map((a, i) => {
    const last = i === tts.length - 1;
    const frames = Math.ceil((last ? lead + a.duration + tail : a.duration + pad + xf) * FPS);
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

function kenBurns(motion, frames, W, H, cropBottom, fit = "cover") {
  const M = Math.max(frames - 1, 1);
  const p = `(on/${M})`;
  const e = `(${p}*${p}*(3-2*${p}))`; // smoothstep easing
  const cx = "iw/2-(iw/zoom/2)";
  const cy = "ih/2-(ih/zoom/2)";
  const Z = fit === "contain" ? CONTAIN_ZOOM : ZOOM;
  const zf = `${1 + Z}`;
  const spec = {
    still: ["1", cx, cy],
    breathe: [`1+${BREATHE}*${e}`, cx, cy],
    "zoom-in": [`1+${Z}*${e}`, cx, cy],
    "zoom-out": [`${1 + Z}-${Z}*${e}`, cx, cy],
    "pan-right": [zf, `(iw-iw/zoom)*${e}`, cy],
    "pan-left": [zf, `(iw-iw/zoom)*(1-${e})`, cy],
    "pan-down": [zf, cx, `(ih-ih/zoom)*${e}`],
    "pan-up": [zf, cx, `(ih-ih/zoom)*(1-${e})`],
  }[motion];
  if (!spec) throw new Error(`motion không hợp lệ: ${motion} (dùng still, breathe, zoom-in, zoom-out, pan-left, pan-right, pan-up, pan-down)`);
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

// A still frame needs no zoompan: scale once and repeat it.
const stillFilter = (W, H, cropBottom) =>
  `${cropBottom ? `crop=iw:ih*${(1 - cropBottom).toFixed(3)}:0:0,` : ""}scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1`;

export async function renderClips(project, dir, timeline, { W, H, animated }) {
  const clipsDir = path.join(dir, "clips");
  fs.mkdirSync(clipsDir, { recursive: true });
  const manifest = readJson(path.join(dir, "images", "manifest.json"), {});
  for (const [i, s] of timeline.scenes.entries()) {
    const aiVideo = path.join(dir, "videos", `${s.id}.mp4`);
    const marked = project.animateScope !== "marked" || !!project.scenes[i].video?.trim();
    const useVideo = animated && marked && fs.existsSync(aiVideo);
    const src = useVideo ? aiVideo : path.join(dir, "images", `${s.id}.jpg`);
    const cropBottom = useVideo ? 0 : manifest[s.id]?.cropBottom || 0;
    const defaultFit = manifest[s.id]?.provider === "commons" ? "auto" : "cover";
    const fit = useVideo ? "cover" : await resolveFit(project.scenes[i].fit || defaultFit, src, W, H);
    const fxSpec = "fx" in project.scenes[i] ? project.scenes[i].fx : project.fx;
    const useFx = !useVideo && fit === "cover" && !!fxSpec;
    const motion = useVideo ? "ai-video" : useFx ? "fx" : project.scenes[i].motion || project.motion || MOTIONS[i % MOTIONS.length];
    const st = fs.statSync(src);
    const key = sha1([st.size, st.mtimeMs, s.frames, motion, W, H, cropBottom, fit, useFx ? JSON.stringify(fxSpec) : ""].join("|"));
    const out = path.join(clipsDir, `${s.id}.mp4`);
    const keyFile = `${out}.key`;
    if (fs.existsSync(out) && fs.existsSync(keyFile) && fs.readFileSync(keyFile, "utf8") === key) continue;
    log(`  clip ${s.id} (${motion}${fit === "contain" ? ", contain" : ""}, ${s.dur.toFixed(1)}s)`);
    if (useFx) {
      await renderFx(src, out, fxSpec, s.frames, W, H, cropBottom, i + 1);
    } else if (motion === "still" && fit === "cover") {
      await ffmpeg(["-loop", "1", "-framerate", String(FPS), "-i", src, "-vf", stillFilter(W, H, cropBottom), "-frames:v", String(s.frames), ...X264, out]);
    } else {
      const vf = useVideo ? fitVideo(await probeDuration(src), s.dur, W, H) : kenBurns(motion, s.frames, W, H, cropBottom, fit);
      await ffmpeg(["-i", src, "-an", "-vf", vf, "-frames:v", String(s.frames), ...X264, out]);
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
    .map((s, i) => ({ s, text: project.scenes[i].title }))
    .filter((x) => x.text?.trim())
    .map(({ s, text }) => `Dialogue: 1,${assTime(s.start)},${assTime(s.start + s.dur)},Title,,0,0,0,,{\\fad(120,0)}${assText(text)}`);

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
export async function finalize(dir, { subs, music, musicVolume, musicDelay = null, musicTrim = 0, ambience = null, total, fontsDir, logo, fadeIn = 0, loudnorm = false, W }) {
  const args = ["-i", "video.mp4", "-i", "narration.wav"];
  // musicDelay === null → loop the track from t=0 (old behaviour); a number →
  // play once, starting at that second (used to land the track's ending on the video's end).
  if (music) args.push(...(musicDelay === null ? ["-stream_loop", "-1"] : []), "-i", music);
  // ambience: { file, volume } — a sound bed (rain, rumble…) from t=0, NOT ducked under the voice.
  const ambIdx = music ? 3 : 2;
  if (ambience) args.push("-i", ambience.file);
  const logoIdx = ambIdx + (ambience ? 1 : 0);
  if (logo) args.push("-i", logo.file);

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
    parts.push(`[${logoIdx}:v]scale=${lw}:-1,format=rgba${soft}${alpha}[lg]`, `[0:v][lg]overlay=W-w-${Math.round(W * (logo.marginX ?? 0.02))}:H-h-${m}[vl]`);
    v = "[vl]";
  }
  parts.push(subs ? `${v}subtitles=${subs}${fd}${fade}[v]` : `${v}null${fade}[v]`);
  const aOut = loudnorm ? "[a0]" : "[a]";
  if (music) {
    const fadeOut = Math.max(total - 3, 0).toFixed(2);
    parts.push(
      "[1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,asplit=2[n1][n2]",
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
    parts.push("[1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[n1]");
  }
  const mix = ["[n1]", ...(music ? ["[md]"] : [])];
  if (ambience) {
    parts.push(`[${ambIdx}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=${ambience.volume ?? 1},apad[amb]`);
    mix.push("[amb]");
  }
  parts.push(mix.length > 1 ? `${mix.join("")}amix=inputs=${mix.length}:duration=first:normalize=0${aOut}` : `[n1]anull${aOut}`);
  if (loudnorm) parts.push(`[a0]loudnorm=I=${typeof loudnorm === "number" ? loudnorm : -14}:LRA=7:TP=-1,aresample=48000[a]`);
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
