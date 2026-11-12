// usage: node tts-all.mjs [s005,s010]  -> audio/sNNN.mp3 for every scene (skips existing files)
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { vibiTTS } from "../../src/vibi-tts.mjs";
const DIR = fileURLToPath(new URL(".", import.meta.url));
const only = process.argv[2]?.split(",");
const p = JSON.parse(fs.readFileSync(DIR + "project.json", "utf8"));
let total = 0;
for (const [i, s] of p.scenes.entries()) {
  const id = `s${String(i + 1).padStart(3, "0")}`;
  const out = `${DIR}audio/${id}.mp3`;
  if (s.skip || (only ? !only.includes(id) : fs.existsSync(out))) continue;
  for (let a = 1; ; a++) {
    try { const r = await vibiTTS(s.narration, out); total += r.credits ?? 0; console.log(id, "ok", r.credits); break; }
    catch (e) { console.log(id, "lỗi lần", a, e.message); if (a >= 3) process.exit(1); await new Promise((r) => setTimeout(r, 5000)); }
  }
}
console.log("xong, credits:", total);
