// usage: node flow-batch-build.mjs  -> writes flow-batch.json (characters first, then scenes) + characters/prompts.txt
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { fullPrompt } from "../../src/images.mjs";
import { applyPreset } from "../../src/presets.mjs";
const DIR = fileURLToPath(new URL(".", import.meta.url));
const p = applyPreset(JSON.parse(fs.readFileSync(DIR + "project.json", "utf8")));
p.scenes.forEach((s, i) => (s.id = `s${String(i + 1).padStart(3, "0")}`));
const tail = " Generate exactly 1 image, vertical 9:16.";
const chars = Object.entries(p.characters).map(([id, c]) => ({
  id,
  name: c.name,
  prompt:
    `Character reference sheet of one person: ${c.look.trim().replace(/\.$/, "")}. ` +
    "Full body, standing, front view, calm neutral expression, plain light beige background, vertical 9:16, nothing else in the frame. " +
    `${p.style}. No text, no letters, no watermark.` + tail,
}));
fs.mkdirSync(DIR + "characters", { recursive: true });
fs.writeFileSync(DIR + "characters/prompts.txt", chars.map((c) => `${c.id} (${c.name}):\n${c.prompt}`).join("\n\n") + "\n");
const scenes = p.scenes.map((s) => ({ id: s.id, prompt: fullPrompt(p, s) + tail }));
fs.writeFileSync(DIR + "flow-batch.json", JSON.stringify([...chars.map(({ id, prompt }) => ({ id, prompt })), ...scenes], null, 1));
console.log(chars.length, scenes.length);
