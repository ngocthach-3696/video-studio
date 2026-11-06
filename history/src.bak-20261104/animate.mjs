import fs from "node:fs";
import path from "node:path";
import { dataUri, download, falRun } from "./fal.mjs";
import { ffmpeg, log, readJson, sha1, withRetry } from "./util.mjs";

const DEFAULT_MOTION =
  "subtle cinematic motion: banners and clothing move in the wind, mist and smoke drift slowly, people move naturally, slow steady camera push-in";
const NEGATIVE = "blur, distortion, morphing faces, extra limbs, text, watermark, low quality, sudden scene change";

export const animateMode = (project, env) => String(project.animate ?? env.ANIMATE ?? "none").toLowerCase();

export function animationEnabled(project, env) {
  const mode = animateMode(project, env);
  return mode === "fal" || mode === "true" || mode === "flow";
}

// Flow mode: clips are made by hand in Google Flow and saved as videos/<id>.mp4.
// Writes the prompts to paste into Flow, then pulls each clip's first frame into
// images/<id>.jpg (only when no image exists) so the manual image step and contact
// sheet work unchanged. Scenes with an image but no clip fall back to Ken Burns.
export async function importFlowClips(project, dir) {
  const vidDir = path.join(dir, "videos");
  const imgDir = path.join(dir, "images");
  fs.mkdirSync(vidDir, { recursive: true });
  fs.mkdirSync(imgDir, { recursive: true });
  fs.writeFileSync(
    path.join(vidDir, "flow-prompts.txt"),
    project.scenes
      .map((s) => `${s.id}:\n${[project.style, s.image, s.video].filter(Boolean).join(". ")}`)
      .join("\n\n") + "\n",
  );
  const missing = [];
  for (const s of project.scenes) {
    const clip = path.join(vidDir, `${s.id}.mp4`);
    const img = path.join(imgDir, `${s.id}.jpg`);
    if (fs.existsSync(img) || fs.existsSync(path.join(imgDir, `${s.id}.png`))) continue;
    if (!fs.existsSync(clip)) {
      missing.push(s.id);
      continue;
    }
    await ffmpeg(["-i", clip, "-frames:v", "1", "-q:v", "2", img]);
  }
  if (missing.length) {
    const e = new Error(
      `Thiếu clip Flow cho: ${missing.join(", ")}.\n` +
        `Tạo clip theo ${path.join(vidDir, "flow-prompts.txt")} rồi lưu thành videos/<id>.mp4.`,
    );
    e.code = "MISSING_IMAGES";
    throw e;
  }
}

export function estimateCost(project, env) {
  const perSec = Number(env.FAL_VIDEO_PRICE_PER_SEC || 0.07);
  return project.scenes.length * 5 * perSec;
}

// Turns each scene image into a ~5s AI video clip (image-to-video via fal).
// Cached per image + motion prompt, so only changed scenes are re-billed.
export async function animateScenes(project, dir, env) {
  const model = env.FAL_VIDEO_MODEL || "fal-ai/kling-video/v2.6/pro/image-to-video";
  const imageField = env.FAL_VIDEO_IMAGE_FIELD || "start_image_url";
  const concurrency = Math.max(1, Number(env.FAL_CONCURRENCY || 3));
  const vidDir = path.join(dir, "videos");
  fs.mkdirSync(vidDir, { recursive: true });
  const manifestPath = path.join(vidDir, "manifest.json");
  const manifest = readJson(manifestPath, {});

  const jobs = project.scenes.filter((s) => {
    const img = path.join(dir, "images", `${s.id}.jpg`);
    const st = fs.statSync(img);
    s._videoKey = sha1([model, st.size, st.mtimeMs, s.video || DEFAULT_MOTION].join("|"));
    return !(fs.existsSync(path.join(vidDir, `${s.id}.mp4`)) && manifest[s.id]?.key === s._videoKey);
  });
  if (!jobs.length) return;
  log(`  ${jobs.length} clip cần tạo (${model}), ~$${(jobs.length * 5 * Number(env.FAL_VIDEO_PRICE_PER_SEC || 0.07)).toFixed(2)}`);

  let next = 0;
  const worker = async () => {
    while (next < jobs.length) {
      const s = jobs[next++];
      const t0 = Date.now();
      const input = {
        prompt: s.video || DEFAULT_MOTION,
        [imageField]: dataUri(fs.readFileSync(path.join(dir, "images", `${s.id}.jpg`))),
        duration: "5",
        negative_prompt: NEGATIVE,
        generate_audio: false,
      };
      const r = await withRetry(() => falRun(model, input, env, { timeoutMs: 20 * 60_000 }), [10000, 30000]);
      const url = r.video?.url;
      if (!url) throw new Error(`fal không trả video cho ${s.id}: ${JSON.stringify(r).slice(0, 300)}`);
      fs.writeFileSync(path.join(vidDir, `${s.id}.mp4`), await download(url));
      manifest[s.id] = { key: s._videoKey, model };
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
      log(`  video ${s.id} xong (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, worker));
}
