// usage: node thumbnail/prompts.mjs -> adds/replaces cover prompts t01..t03 in flow-batch.json (ảnh bìa, gen trên Flow)
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { fullPrompt } from "../../../src/images.mjs";
import { applyPreset } from "../../../src/presets.mjs";
const DIR = fileURLToPath(new URL("..", import.meta.url));
const p = applyPreset(JSON.parse(fs.readFileSync(DIR + "project.json", "utf8")));
const COVERS = {
  t01: ["Movie-poster composition, dramatic low angle: a mid-19th century French steam-and-sail warship in the bay firing its cannons, huge orange muzzle flashes and billowing white smoke rolling over the water; in the foreground on an earthen coastal rampart a lone Nguyen dynasty soldier seen from behind, conical hat, holding a long spear, facing the ship", ["quan-trieu-nguyen"]],
  t02: ["Movie-poster composition, wide shot: the general standing on a coastal hilltop, his whole figure small in the lower half of the frame and his head clearly below the middle of the image, robe and sash blowing in strong wind, hand on his sword hilt, stern determined face turned toward the sea where several distant warships fire cannons with small flashes and smoke on the horizon", ["nguyen-tri-phuong"]],
  t03: ["Movie-poster composition: on a beach at dusk a Vietnamese fishing village woman holding her small child close, both looking out to sea in fear, a round basket boat beside them; far out at sea a row of foreign warships with cannon smoke and a single bright cannon flash, the first shot"],
};
const tail = " Generate exactly 1 image, vertical 9:16.";
const cover = (prompt) =>
  prompt.replace("keep the upper fifth and the lower-middle area free of important details", "keep the upper 40% of the frame as dark dramatic amber sky with no important details (space for a big title), main subject in the lower 60%, strong contrast, eye-catching thumbnail");
const items = Object.entries(COVERS).map(([id, [image, characters]]) => ({ id, prompt: cover(fullPrompt(p, { image, characters })) + tail }));
const batch = JSON.parse(fs.readFileSync(DIR + "flow-batch.json", "utf8")).filter((b) => !/^t\d+$/.test(b.id));
fs.writeFileSync(DIR + "flow-batch.json", JSON.stringify([...batch, ...items], null, 1));
for (const i of items) console.log(i.id, i.prompt.length, i.prompt.includes("upper 40%"));
