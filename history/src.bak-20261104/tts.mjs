import fs from "node:fs";
import path from "node:path";
import { EdgeTTS } from "edge-tts-universal";
import { log, probeDuration, readJson, sha1 } from "./util.mjs";

// Synthesizes one narration clip per scene (sequentially — Edge throttles
// parallel requests). Cached by voice/rate/text, so editing one scene's
// narration only regenerates that scene.
export async function synthesizeScenes(project, dir, env) {
  const audioDir = path.join(dir, "audio");
  fs.mkdirSync(audioDir, { recursive: true });
  const voice = project.voice || env.EDGE_TTS_VOICE || "vi-VN-NamMinhNeural";
  const rate = project.rate || env.EDGE_TTS_RATE || "+0%";

  const results = [];
  for (const scene of project.scenes) {
    const mp3 = path.join(audioDir, `${scene.id}.mp3`);
    const metaPath = path.join(audioDir, `${scene.id}.json`);
    const key = sha1(`${voice}|${rate}|${scene.narration}`);
    let meta = readJson(metaPath);
    if (!meta || meta.key !== key || !fs.existsSync(mp3)) {
      log(`  TTS ${scene.id}: ${scene.narration.slice(0, 70)}${scene.narration.length > 70 ? "…" : ""}`);
      const r = await new EdgeTTS(scene.narration, voice, { rate }).synthesize();
      fs.writeFileSync(mp3, Buffer.from(await r.audio.arrayBuffer()));
      meta = {
        key,
        duration: await probeDuration(mp3),
        words: r.subtitle.map((w) => ({ start: w.offset / 1e7, end: (w.offset + w.duration) / 1e7, text: w.text })),
      };
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 1));
    }
    results.push({ id: scene.id, file: mp3, ...meta });
  }
  return results;
}
