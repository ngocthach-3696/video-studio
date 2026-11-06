import fs from "node:fs";
import path from "node:path";
import { EdgeTTS } from "edge-tts-universal";
import { log, probeDuration, readJson, sha1 } from "./util.mjs";

// Synthesizes one narration clip per scene (sequentially — Edge throttles
// parallel requests). Cached by engine/voice/rate/text, so editing one scene's
// narration only regenerates that scene.
//
// project.tts = "edge" (default) | "elevenlabs".
// ElevenLabs: project.voice = voice id, env ELEVENLABS_API_KEY,
// optional project.elevenModel (default eleven_multilingual_v2) and
// project.elevenSpeed (0.7–1.2, default 1.0).
export async function synthesizeScenes(project, dir, env) {
  const audioDir = path.join(dir, "audio");
  fs.mkdirSync(audioDir, { recursive: true });
  const engine = project.tts || env.TTS_ENGINE || "edge";
  const eleven = engine === "elevenlabs";
  const voice = project.voice || (eleven ? env.ELEVENLABS_VOICE_ID : env.EDGE_TTS_VOICE) || "vi-VN-NamMinhNeural";
  const rate = eleven
    ? `${project.elevenModel || "eleven_multilingual_v2"}@${project.elevenSpeed ?? 1}`
    : project.rate || env.EDGE_TTS_RATE || "+0%";
  if (eleven && !env.ELEVENLABS_API_KEY) throw new Error("Thiếu ELEVENLABS_API_KEY trong history/.env");

  const results = [];
  const scenes = project.scenes;
  if (engine === "manual") {
    // Clips recorded outside the pipeline (e.g. ElevenLabs web UI) saved as
    // audio/sNNN.mp3. No word timings available → estimate them.
    for (const scene of scenes) {
      const mp3 = path.join(audioDir, `${scene.id}.mp3`);
      const metaPath = path.join(audioDir, `${scene.id}.json`);
      if (!fs.existsSync(mp3)) throw new Error(`tts manual: thiếu ${mp3}`);
      const key = sha1(`manual|${fs.statSync(mp3).size}|${scene.narration}`);
      let meta = readJson(metaPath);
      if (!meta || meta.key !== key) {
        const duration = await probeDuration(mp3);
        const [s, e] = await speechBounds(mp3, duration);
        meta = { key, duration, words: estimateWords(scene.narration, s, e) };
        fs.writeFileSync(metaPath, JSON.stringify(meta, null, 1));
      }
      results.push({ id: scene.id, file: mp3, ...meta });
    }
    return results;
  }
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const mp3 = path.join(audioDir, `${scene.id}.mp3`);
    const metaPath = path.join(audioDir, `${scene.id}.json`);
    const key = sha1(`${engine}|${voice}|${rate}|${scene.narration}`);
    let meta = readJson(metaPath);
    if (!meta || meta.key !== key || !fs.existsSync(mp3)) {
      log(`  TTS ${scene.id}: ${scene.narration.slice(0, 70)}${scene.narration.length > 70 ? "…" : ""}`);
      let words;
      if (eleven) {
        const r = await elevenLabs(scene.narration, voice, project, env, scenes[i - 1]?.narration, scenes[i + 1]?.narration);
        fs.writeFileSync(mp3, r.audio);
        words = r.words;
      } else {
        const r = await new EdgeTTS(scene.narration, voice, { rate }).synthesize();
        fs.writeFileSync(mp3, Buffer.from(await r.audio.arrayBuffer()));
        words = r.subtitle.map((w) => ({ start: w.offset / 1e7, end: (w.offset + w.duration) / 1e7, text: w.text }));
      }
      meta = { key, duration: await probeDuration(mp3), words };
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 1));
    }
    results.push({ id: scene.id, file: mp3, ...meta });
  }
  return results;
}

// POST /v1/text-to-speech/{voice}/with-timestamps → mp3 + per-character
// timings, which we fold into per-word timings for the subtitles.
// previous_text / next_text keep intonation continuous across scene clips.
async function elevenLabs(text, voice, project, env, prev, next) {
  const body = {
    text,
    model_id: project.elevenModel || "eleven_multilingual_v2",
    language_code: "vi",
    voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: project.elevenSpeed ?? 1 },
    ...(prev ? { previous_text: prev } : {}),
    ...(next ? { next_text: next } : {}),
  };
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`;
  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const j = await res.json();
      return { audio: Buffer.from(j.audio_base64, "base64"), words: charsToWords(j.alignment || j.normalized_alignment) };
    }
    const msg = await res.text();
    lastErr = new Error(`ElevenLabs ${res.status}: ${msg.slice(0, 300)}`);
    if (res.status < 500 && res.status !== 429) throw lastErr; // auth / quota / bad voice: don't retry
    await new Promise((r) => setTimeout(r, 2000 * attempt));
  }
  throw lastErr;
}

function charsToWords(a) {
  const words = [];
  if (!a) return words;
  let cur = null;
  a.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) {
      if (cur) words.push(cur);
      cur = null;
      return;
    }
    if (!cur) cur = { start: a.character_start_times_seconds[i], end: a.character_end_times_seconds[i], text: "" };
    cur.text += ch;
    cur.end = a.character_end_times_seconds[i];
  });
  if (cur) words.push(cur);
  return words;
}

// Leading/trailing silence via ffmpeg silencedetect → [speechStart, speechEnd].
async function speechBounds(mp3, duration) {
  const { spawnSync } = await import("node:child_process");
  const r = spawnSync("ffmpeg", ["-hide_banner", "-i", mp3, "-af", "silencedetect=noise=-40dB:d=0.08", "-f", "null", "-"], { encoding: "utf8" });
  const log = r.stderr || "";
  const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
  const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
  let s = 0, e = duration;
  if (starts.length && starts[0] < 0.05 && ends.length) s = ends[0];
  const last = starts[starts.length - 1];
  if (last !== undefined && last > s && (ends.length < starts.length || ends[ends.length - 1] >= duration - 0.05)) e = last;
  return [s, Math.max(e, s + 0.2)];
}

// Spread words over [s, e] weighted by length; commas/periods add a short pause.
function estimateWords(text, s, e) {
  const toks = text.split(/\s+/).filter(Boolean);
  const w = toks.map((t) => t.length + 2 + (/[,;:]$/.test(t) ? 4 : /[.?!…]$/.test(t) ? 6 : 0));
  const total = w.reduce((a, b) => a + b, 0);
  let t = s;
  return toks.map((tok, i) => {
    const span = ((e - s) * w[i]) / total;
    const pause = /[,;:.?!…]$/.test(tok) ? span * 0.35 : 0;
    const word = { start: +t.toFixed(3), end: +(t + span - pause).toFixed(3), text: tok };
    t += span;
    return word;
  });
}
