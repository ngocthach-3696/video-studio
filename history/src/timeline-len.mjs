// usage: node src/timeline-len.mjs projects/<slug>  -> prints the video length (s) the render will have (for build-bgm.sh)
import fs from "node:fs"; import path from "node:path";
import { synthesizeScenes } from "./tts.mjs"; import { applyPreset } from "./presets.mjs"; import { buildTimeline } from "./render.mjs";
const dir = process.argv[2]; const p = JSON.parse(fs.readFileSync(path.join(dir, "project.json"), "utf8"));
p.scenes.forEach((s, i) => (s.id = `s${String(i + 1).padStart(3, "0")}`)); p.scenes = p.scenes.filter((s) => !s.skip);
const project = applyPreset(p); const tts = await synthesizeScenes(project, dir, process.env);
const pa = Object.fromEntries(project.scenes.filter((s) => s.pauseAfter).map((s) => [s.id, s.pauseAfter]));
console.log(buildTimeline(tts, project.pace, pa).total.toFixed(2));
