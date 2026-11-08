// usage: node flow-batch-build.mjs  -> writes flow-batch.json (characters first, then scenes)
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { fullPrompt } from "../../src/images.mjs";
import { applyPreset } from "../../src/presets.mjs";
const DIR = fileURLToPath(new URL(".", import.meta.url));
const p = applyPreset(JSON.parse(fs.readFileSync(DIR + "project.json", "utf8")));
p.scenes.forEach((s, i) => (s.id = `s${String(i + 1).padStart(3, "0")}`));
const tail = " Generate exactly 1 image, vertical 9:16.";
const chars = fs.readFileSync(DIR + "characters/prompts.txt", "utf8").trim().split(/\n\n/).map((b) => {
  const [head, ...rest] = b.split("\n");
  return { id: head.split(" ")[0].replace(/:$/, ""), prompt: rest.join(" ").replace("plain light beige background", "plain light beige background, vertical 9:16") + tail };
});
const scenes = p.scenes.map((s) => ({ id: s.id, prompt: fullPrompt(p, s) + tail }));
fs.writeFileSync(DIR + "flow-batch.json", JSON.stringify([...chars, ...scenes], null, 1));
console.log(chars.length, scenes.length);
