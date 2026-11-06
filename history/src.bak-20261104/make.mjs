#!/usr/bin/env node
// Build a history video from projects/<slug>/project.json.
//
// Usage:
//   node src/make.mjs projects/<slug>                 # full run (cached steps are skipped)
//   node src/make.mjs projects/<slug> --images-only   # stop after images + contact sheet (review step)
//   node src/make.mjs projects/<slug> --redo s003,s007  # regenerate those images with a new seed
//   node src/make.mjs projects/<slug> --no-subs       # no burned-in subtitles
//   node src/make.mjs projects/<slug> --no-animate    # skip paid image-to-video, use Ken Burns
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { animateMode, animateScenes, animationEnabled, estimateCost, importFlowClips } from "./animate.mjs";
import { synthesizeScenes } from "./tts.mjs";
import { contactSheet, generateImages } from "./images.mjs";
import { buildNarration, buildSubtitles, buildTimeline, finalize, joinClips, renderClips } from "./render.mjs";
import { log, probeDuration, sha1 } from "./util.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(ROOT, ".env"), quiet: true });
const env = process.env;

function parseArgs(argv) {
  const opts = { dir: null, imagesOnly: false, noSubs: false, noAnimate: false, redo: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--images-only") opts.imagesOnly = true;
    else if (a === "--no-subs") opts.noSubs = true;
    else if (a === "--no-animate") opts.noAnimate = true;
    else if (a === "--redo") opts.redo = (argv[++i] || "").split(",").map((s) => s.trim()).filter(Boolean);
    else if (!a.startsWith("--")) opts.dir = path.resolve(a);
  }
  if (!opts.dir) {
    console.error("Usage: node src/make.mjs projects/<slug> [--images-only] [--redo s003,s007] [--no-subs]");
    process.exit(1);
  }
  return opts;
}

function loadProject(dir) {
  const file = path.join(dir, "project.json");
  if (!fs.existsSync(file)) throw new Error(`Không thấy ${file}`);
  const p = JSON.parse(fs.readFileSync(file, "utf8"));
  p.format ??= "9:16";
  if (!["9:16", "16:9"].includes(p.format)) throw new Error(`format phải là "9:16" hoặc "16:9", đang là "${p.format}"`);
  if (!Array.isArray(p.scenes) || p.scenes.length === 0) throw new Error("project.json cần mảng scenes không rỗng");
  p.scenes.forEach((s, i) => {
    if (!s.narration?.trim()) throw new Error(`Cảnh ${i + 1} thiếu "narration"`);
    if (!s.image?.trim() && !s.commons?.trim()) throw new Error(`Cảnh ${i + 1} cần "image" (prompt AI) hoặc "commons" (File:... trên Wikimedia Commons)`);
    s.id = `s${String(i + 1).padStart(3, "0")}`;
  });
  return p;
}

function resolveMusic(project) {
  const choice = project.music ?? env.MUSIC ?? "auto";
  if (!choice || choice === "none") return null;
  if (choice === "auto") {
    const musicDir = path.join(ROOT, "assets", "music");
    const files = fs.existsSync(musicDir)
      ? fs.readdirSync(musicDir).filter((f) => /\.(mp3|m4a|wav|ogg)$/i.test(f)).sort()
      : [];
    if (!files.length) return null;
    return path.join(musicDir, files[parseInt(sha1(project.title || "").slice(0, 8), 16) % files.length]);
  }
  const f = path.isAbsolute(choice) ? choice : path.join(ROOT, choice);
  if (!fs.existsSync(f)) {
    log(`  ⚠ không thấy file nhạc ${f} — bỏ nhạc nền`);
    return null;
  }
  return f;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { dir } = opts;
  const project = loadProject(dir);
  const [W, H] = project.format === "16:9" ? [1920, 1080] : [1080, 1920];
  const t0 = Date.now();
  log(`Dự án: ${project.title ?? path.basename(dir)} — ${project.scenes.length} cảnh, ${project.format}`);

  log("[1/7] Giọng đọc (Edge TTS)");
  const tts = await synthesizeScenes(project, dir, env);
  const speech = tts.reduce((a, t) => a + t.duration, 0);
  log(`  tổng lời đọc ${speech.toFixed(1)}s`);

  const flow = animateMode(project, env) === "flow";
  if (flow) project.imageProvider = "manual";
  log(`[2/7] Ảnh (${flow ? "khung đầu của clip Google Flow" : project.imageProvider || env.IMAGE_PROVIDER || "pollinations"})`);
  if (flow) await importFlowClips(project, dir);
  await generateImages(project, dir, env, { redo: opts.redo });
  const sheets = await contactSheet(project, dir);
  log(`  contact sheet: ${sheets.join(" | ")}`);
  if (opts.imagesOnly) {
    log("Dừng sau bước ảnh (--images-only). Xem contact sheet, sửa prompt hoặc --redo rồi chạy lại.");
    return;
  }

  const timeline = buildTimeline(tts);
  fs.writeFileSync(path.join(dir, "timeline.json"), JSON.stringify(timeline, null, 1));

  const animated = !opts.noAnimate && animationEnabled(project, env);
  if (animated && flow) {
    log("[3/7] Ảnh → video AI: dùng clip Google Flow có sẵn");
  } else if (animated) {
    log(`[3/7] Ảnh → video AI (fal) — tối đa ~$${estimateCost(project, env).toFixed(2)} nếu tạo mới toàn bộ`);
    await animateScenes(project, dir, env);
  } else {
    log("[3/7] Ảnh → video AI: tắt (dùng Ken Burns)");
  }

  log("[4/7] Clip từng cảnh");
  await renderClips(project, dir, timeline, { W, H, animated });

  log("[5/7] Ghép clip (crossfade)");
  await joinClips(dir, timeline);

  log("[6/7] Âm thanh + phụ đề");
  await buildNarration(dir, timeline, tts);
  const subs = opts.noSubs || project.subtitles === false ? null : buildSubtitles(project, dir, timeline, tts, { W, H }, env);
  const music = resolveMusic(project);
  log(`  nhạc nền: ${music ?? "không"}`);

  log("[7/7] Xuất video");
  const out = await finalize(dir, {
    subs,
    music,
    musicVolume: Number(project.musicVolume ?? env.MUSIC_VOLUME ?? 0.25),
    total: timeline.total,
  });
  const dur = await probeDuration(out);
  log(`✔ Xong: ${out} — ${dur.toFixed(1)}s, ${(fs.statSync(out).size / 1e6).toFixed(1)} MB, mất ${((Date.now() - t0) / 60000).toFixed(1)} phút`);
}

main().catch((e) => {
  console.error(`\n✖ ${e.message}`);
  process.exit(e.code === "MISSING_IMAGES" ? 2 : 1);
});
