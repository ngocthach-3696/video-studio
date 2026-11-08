// Sound design track: ambience beds over scene ranges + one-shot hits timed to scenes.
// Writes <project>/soundscape.wav (same length as the video); make.mjs mixes it in like `ambience`.
//
// project.soundscape = {
//   dir: "sfx",                       // folder (relative to the project) with <name>.mp3/.wav
//   beds: [{ sfx, from, to, db, fadeIn?, fadeOut?, offset? }],
//        // plays sfx (looped) from the start of scene `from` to the end of scene `to` (1-based scene numbers);
//        // ducked under the narration. offset = seconds to skip into the file.
//   hits: [{ sfx, scene, at, db, trim? }],
//        // at: "start" (scene start), "end" (when that scene's voice ends), or a number of seconds after the voice starts.
//        // trim = max seconds of the file to keep (faded out).
// }
// db = loudness relative to the narration (e.g. beds -20, hits -6). Each file's loudness is measured, so the
// levels do not depend on how loud the source files are.
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { ffmpeg, log } from "./util.mjs";

function loudness(file) {
  return new Promise((resolve, reject) => {
    const p = spawn("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-af", "ebur128", "-f", "null", "-"], { windowsHide: true });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("error", reject);
    p.on("close", () => {
      const m = [...err.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop();
      resolve(m ? parseFloat(m[1]) : -23);
    });
  });
}

export async function buildSoundscape(project, dir, timeline, tts) {
  const sc = project.soundscape;
  if (!sc) return null;
  const sdir = path.join(dir, sc.dir ?? "sfx");
  const fileOf = (name) => {
    for (const ext of [".mp3", ".wav", ".ogg"]) if (fs.existsSync(path.join(sdir, name + ext))) return path.join(sdir, name + ext);
    throw new Error(`soundscape: không thấy file ${name} trong ${sdir}`);
  };
  const S = timeline.scenes;
  const sceneAt = (n) => {
    const s = S[n - 1];
    if (!s) throw new Error(`soundscape: không có cảnh ${n}`);
    return s;
  };
  const voiceEnd = (n) => sceneAt(n).voiceStart + tts[n - 1].duration;

  const narrI = await loudness(path.join(dir, "narration.wav"));
  const cache = {};
  const gainFor = async (name, db) => {
    cache[name] ??= await loudness(fileOf(name));
    return (narrI + db - cache[name]).toFixed(2);
  };

  const inputs = [];
  let nIn = 0; // ffmpeg input index (inputs[] holds several args per input)
  const parts = [];
  const bedLabels = [];
  const hitLabels = [];
  const fmt = "aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo";

  for (const b of sc.beds ?? []) {
    const t0 = sceneAt(b.from).start;
    const t1 = b.to >= S.length ? timeline.total : sceneAt(b.to).start + sceneAt(b.to).dur;
    const len = t1 - t0;
    const fi = b.fadeIn ?? 1.5;
    const fo = Math.min(b.fadeOut ?? 2, len / 2);
    const idx = nIn++;
    inputs.push("-stream_loop", "-1", "-i", fileOf(b.sfx));
    const l = `b${idx}`;
    parts.push(
      `[${idx}:a]${fmt},atrim=start=${b.offset ?? 0}:duration=${(len + (b.offset ?? 0)).toFixed(3)},asetpts=PTS-STARTPTS,` +
        `volume=${await gainFor(b.sfx, b.db)}dB,afade=t=in:d=${fi},afade=t=out:st=${(len - fo).toFixed(3)}:d=${fo.toFixed(3)},` +
        `adelay=${Math.round(t0 * 1000)}:all=1[${l}]`,
    );
    bedLabels.push(`[${l}]`);
  }

  for (const h of sc.hits ?? []) {
    const s = sceneAt(h.scene);
    const t = h.at === "start" ? s.start : h.at === "end" ? voiceEnd(h.scene) : s.voiceStart + Number(h.at);
    const idx = nIn++;
    inputs.push("-i", fileOf(h.sfx));
    const l = `h${idx}`;
    const trim = h.trim ? `,atrim=duration=${h.trim},afade=t=out:st=${Math.max(h.trim - 0.8, 0)}:d=0.8` : "";
    parts.push(`[${idx}:a]${fmt}${trim},volume=${await gainFor(h.sfx, h.db)}dB,adelay=${Math.round(t * 1000)}:all=1[${l}]`);
    hitLabels.push(`[${l}]`);
  }
  if (!bedLabels.length && !hitLabels.length) return null;

  // narration as the ducking key for the beds (hits stay as they are: they are short accents)
  const nIdx = nIn++;
  inputs.push("-i", path.join(dir, "narration.wav"));
  const total = timeline.total.toFixed(3);
  const mix = (labels, out) =>
    labels.length > 1
      ? `${labels.join("")}amix=inputs=${labels.length}:duration=longest:normalize=0,apad=whole_dur=${total}[${out}]`
      : `${labels[0]}apad=whole_dur=${total}[${out}]`;
  const outs = [];
  if (bedLabels.length) {
    parts.push(mix(bedLabels, "beds"), `[${nIdx}:a]${fmt}[key]`, "[beds][key]sidechaincompress=threshold=0.02:ratio=3:attack=80:release=700[bd]");
    outs.push("[bd]");
  }
  if (hitLabels.length) {
    parts.push(mix(hitLabels, "hits"));
    outs.push("[hits]");
  }
  parts.push(outs.length > 1 ? `${outs.join("")}amix=inputs=2:duration=longest:normalize=0,atrim=duration=${total}[out]` : `${outs[0]}atrim=duration=${total}[out]`);

  const graph = path.join(dir, "soundscape.graph.txt");
  fs.writeFileSync(graph, parts.join(";\n"));
  await ffmpeg([...inputs, "-/filter_complex", graph, "-map", "[out]", "-c:a", "pcm_s16le", path.join(dir, "soundscape.wav")]);
  fs.rmSync(graph);
  log(`  soundscape: ${bedLabels.length} lớp nền, ${hitLabels.length} tiếng điểm (giọng ${narrI} LUFS)`);
  return path.join(dir, "soundscape.wav");
}
