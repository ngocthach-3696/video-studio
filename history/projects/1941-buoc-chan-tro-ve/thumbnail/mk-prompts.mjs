// usage: node thumbnail/mk-prompts.mjs -> thumbnail/nen-prompts.json (3 cover backgrounds, Flow, episode 1941)
import fs from "node:fs";
const src = fs.readFileSync(new URL("../build-project.mjs", import.meta.url), "utf8");
const get = (k) => JSON.parse(src.match(new RegExp(`^const ${k} = (".*");$`, "m"))[1]);
const [STYLE, CAST, RESPECT, END] = ["STYLE", "CAST", "RESPECT", "END"].map(get);
const COVER = "This is a COVER image: the TOP 45% of the image must be EMPTY plain very dark night sky (almost black, deep navy-black), with NO objects, no stars, no moon, no peaks, no branches, no details at all, so text can be placed there; it blends softly into the scene below. The BOTTOM 55% holds the scene with the main character LARGE, seen from the waist up, his head starting just below the middle of the image, face turned toward the viewer. ";
const SC = {
  bia1: "Dusk at the mouth of the small Coc Bo cave at Pac Bo, Cao Bang: the very thin man in indigo stands in the low limestone cave mouth framed by ferns and hanging vines, holding a small glowing oil lamp at chest height, his bamboo stick leaning on the rock, looking calmly at the viewer; warm yellow lamplight on his face and the damp grey rock.",
  bia2: "Early morning by the clear blue-green Pac Bo stream: the very thin man in indigo sits at a big flat grey stone slab used as a desk, a thin hand-printed booklet with a BLANK brown cover open in front of him and an ink brush in his hand; he looks up from the page toward the viewer with a calm, confident look; round pebbles and the stream in the foreground.",
  bia3: "Night inside a small hut of split bamboo walls: the very thin man in indigo stands behind a rough wooden table, holding up one freshly printed small newspaper sheet in purple ink (only wavy lines and a tiny simple drawing of a farmer, no letters) and looking at the viewer with quiet pride; on the table a flat grey stone printing slab, a purple ink roller and a small oil lamp casting warm light on his face.",
};
const out = Object.entries(SC).map(([id, s]) => ({ id, refs: ["ref-style-2.jpg", "ref-bac-cao-bang-1941.jpg"], prompt: STYLE + CAST + COVER + s + RESPECT + END }));
fs.writeFileSync(new URL("nen-prompts.json", import.meta.url), JSON.stringify(out, null, 1));
console.log(out.map((o) => o.id + " " + o.prompt.length).join("\n"));
