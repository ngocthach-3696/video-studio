// usage: node thumbnail/prompts.mjs -> thêm prompt bìa t01..t03 vào flow-batch.json (gen trên Flow)
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { fullPrompt } from "../../../src/images.mjs";
import { applyPreset } from "../../../src/presets.mjs";
const DIR = fileURLToPath(new URL("..", import.meta.url));
const p = applyPreset(JSON.parse(fs.readFileSync(DIR + "project.json", "utf8")));
const COVERS = {
  // round 2 (2026-11-12): the user wanted different images
  t04: ["Movie-poster composition, close-up: the elderly mandarin's sorrowful gaunt face lit warmly by a single candle flame, a small white porcelain cup on the dark table in front of him, eyes looking down at the cup, his head and shoulders filling the lower half of the frame with his eyes clearly below the middle of the image, deep shadows, quiet and dignified", ["phan-thanh-gian"]],
  t05: ["Movie-poster composition: the old general sits proudly on a wooden bench, in the lower half of the frame with his head clearly below the middle of the image, firmly pushing away a French army doctor who offers bandages, his face stern and unbroken, two French marines watching uneasily behind, dim lantern light, tense and defiant, no blood", ["nguyen-tri-phuong", "linh-phap"]],
  t06: ["Movie-poster composition, symbolic still life at dawn: in the courtyard of an old Vietnamese temple (Võ Miếu) a sheathed sword and a folded black turban lie on worn stone steps in the lower part of the frame, an ancient banyan tree, falling leaves, golden morning light breaking through mist, smoke from the burning citadel far behind, no people, solemn"],
};
const tail = " Generate exactly 1 image, vertical 9:16.";
const cover = (prompt) =>
  prompt.replace("keep the upper fifth and the lower-middle area free of important details", "keep the upper 40% of the frame as dark dramatic amber sky with no important details (space for a big title), main subject in the lower 60%, strong contrast, eye-catching thumbnail");
const items = Object.entries(COVERS).map(([id, [image, characters]]) => ({ id, prompt: cover(fullPrompt(p, { image, characters })) + tail }));
const batch = JSON.parse(fs.readFileSync(DIR + "flow-batch.json", "utf8")).filter((b) => !/^t\d+$/.test(b.id));
fs.writeFileSync(DIR + "flow-batch.json", JSON.stringify([...batch, ...items], null, 1));
for (const i of items) console.log(i.id, i.prompt.length, i.prompt.includes("upper 40%"));

