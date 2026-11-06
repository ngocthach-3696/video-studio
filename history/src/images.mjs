import fs from "node:fs";
import path from "node:path";
import { downloadCommons } from "./commons.mjs";
import { dataUri, download, falRun } from "./fal.mjs";
import { ffmpeg, log, readJson, sha1, withRetry } from "./util.mjs";

const DEFAULT_STYLE =
  "cinematic photorealistic historical film still, dramatic natural lighting, rich detail, 35mm lens, shallow depth of field";

// ---------- recurring characters ----------
// project.characters = { "<key>": { "name": "Phùng Hưng", "look": "English description" } }
// scene.characters = ["<key>", ...]. Each character gets a reference image at
// characters/<key>.jpg (generated, or dropped in by hand); scenes that list it
// are drawn from that reference so the face and costume stay the same.

function sceneCharacters(project, scene) {
  return (scene.characters ?? []).map((k) => {
    const c = project.characters?.[k];
    if (!c?.look) throw new Error(`Cảnh ${scene.id} dùng nhân vật "${k}" nhưng project.characters["${k}"].look chưa có`);
    return { key: k, ...c };
  });
}

const refPath = (dir, key) => path.join(dir, "characters", `${key}.jpg`);

export function fullPrompt(project, scene, { withRefs = false } = {}) {
  const frame = project.format === "16:9" ? "wide 16:9 composition" : "vertical 9:16 composition, subject centered";
  const chars = sceneCharacters(project, scene);
  const cast = chars.length ? ` Characters: ${chars.map((c) => c.look.trim().replace(/\.$/, "")).join("; ")}.` : "";
  const refs = withRefs
    ? " Draw these characters exactly as they appear in the reference images (same face, hair, costume and colours), placed in this new scene."
    : "";
  return (
    `${scene.image.trim().replace(/\.$/, "")}.${cast}${refs} ${project.style || DEFAULT_STYLE}. ${frame}. ` +
    "Historically accurate for the era: no modern national flags, no modern objects. " +
    "No text, no letters, no captions, no watermark."
  );
}

const characterPrompt = (project, c) =>
  `Character reference sheet of one person: ${c.look.trim().replace(/\.$/, "")}. ` +
  "Full body, standing, front view, calm neutral expression, plain light beige background, nothing else in the frame. " +
  `${project.style || DEFAULT_STYLE}. No text, no letters, no watermark.`;

const dims = (format) => (format === "16:9" ? [1920, 1080] : [1080, 1920]);

// ---------- providers: (prompt, format, env, seed) -> { buffer, cropBottom } ----------

async function pollinations(prompt, format, env, seed) {
  const [w, h] = dims(format);
  const model = env.POLLINATIONS_MODEL || "flux";
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=${w}&height=${h}&model=${model}&seed=${seed}&nologo=true&enhance=false`;
  const headers = env.POLLINATIONS_TOKEN ? { Authorization: `Bearer ${env.POLLINATIONS_TOKEN}` } : {};
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(180_000) });
  if (!res.ok) throw new Error(`pollinations HTTP ${res.status}`);
  // Anonymous requests carry a "pollinations.ai" badge in the bottom-right corner.
  return { buffer: Buffer.from(await res.arrayBuffer()), cropBottom: env.POLLINATIONS_TOKEN ? 0 : 0.06 };
}

async function openai(prompt, format, env) {
  if (!env.OPENAI_API_KEY) throw new Error("Thiếu OPENAI_API_KEY trong history/.env");
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: env.OPENAI_IMAGE_MODEL || "gpt-image-1",
      prompt,
      size: format === "16:9" ? "1536x1024" : "1024x1536",
      quality: env.OPENAI_IMAGE_QUALITY || "medium",
      n: 1,
    }),
    signal: AbortSignal.timeout(300_000),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`openai HTTP ${res.status}: ${j.error?.message ?? JSON.stringify(j)}`);
  return { buffer: Buffer.from(j.data[0].b64_json, "base64") };
}

async function gemini(prompt, format, env, seed, refs = []) {
  if (!env.GEMINI_API_KEY) throw new Error("Thiếu GEMINI_API_KEY trong history/.env");
  const model = env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [
        { parts: [...refs.map((b) => ({ inlineData: { mimeType: "image/jpeg", data: b.toString("base64") } })), { text: prompt }] },
      ],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: format } },
    }),
    signal: AbortSignal.timeout(300_000),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`gemini HTTP ${res.status}: ${j.error?.message ?? JSON.stringify(j)}`);
  const part = j.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error(`gemini không trả ảnh: ${JSON.stringify(j).slice(0, 300)}`);
  return { buffer: Buffer.from(part.inlineData.data, "base64") };
}

async function fal(prompt, format, env, seed, refs = []) {
  const base = env.FAL_IMAGE_MODEL || "fal-ai/nano-banana";
  // With reference images use the edit endpoint, which takes image_urls.
  const model = refs.length ? env.FAL_EDIT_MODEL || `${base}/edit` : base;
  const input = { prompt, aspect_ratio: format, num_images: 1, output_format: "jpeg", seed };
  if (refs.length) input.image_urls = refs.map((b) => dataUri(b));
  const r = await falRun(model, input, env, { timeoutMs: 5 * 60_000 });
  const url = r.images?.[0]?.url;
  if (!url) throw new Error(`fal ${model} không trả ảnh: ${JSON.stringify(r).slice(0, 300)}`);
  return { buffer: await download(url) };
}

const PROVIDERS = { pollinations, openai, gemini, fal, manual: null };
const TAKES_REFS = new Set(["fal", "gemini"]);

// Anonymous Pollinations answers 402 after ~1 image/minute, so it gets long backoffs.
const RETRY_DELAYS = {
  pollinations: [20000, 40000, 60000, 60000, 90000, 90000, 120000],
  fal: [5000, 15000],
  openai: [5000, 15000],
  gemini: [5000, 15000],
};

// ---------- saving ----------

function sniff(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
  if (buf.subarray(0, 8).toString("hex") === "89504e470d0a1a0a") return "png";
  if (buf.subarray(8, 12).toString() === "WEBP") return "webp";
  throw new Error(`Dữ liệu trả về không phải ảnh: ${buf.subarray(0, 120).toString()}`);
}

async function saveAsJpg(buf, target) {
  const ext = sniff(buf);
  if (ext === "jpg") return fs.writeFileSync(target, buf);
  const tmp = target.replace(/\.jpg$/, `.tmp.${ext}`);
  fs.writeFileSync(tmp, buf);
  await ffmpeg(["-i", tmp, "-q:v", "2", target]);
  fs.rmSync(tmp);
}

// A user can drop s003.png / .jpeg / .webp into images/ — normalize it to s003.jpg.
async function adoptDroppedImage(imgDir, id, target) {
  if (fs.existsSync(target)) return;
  for (const ext of ["png", "jpeg", "webp"]) {
    const f = path.join(imgDir, `${id}.${ext}`);
    if (fs.existsSync(f)) {
      await ffmpeg(["-i", f, "-q:v", "2", target]);
      fs.rmSync(f);
      return;
    }
  }
}

const seedFor = (prompt, attempt) => parseInt(sha1(`${prompt}#${attempt}`).slice(0, 8), 16) % 2147483647;

export async function generateImages(project, dir, env, { redo = [] } = {}) {
  const provider = (project.imageProvider || env.IMAGE_PROVIDER || "pollinations").toLowerCase();
  if (!(provider in PROVIDERS)) throw new Error(`IMAGE_PROVIDER không hợp lệ: ${provider}`);
  const imgDir = path.join(dir, "images");
  fs.mkdirSync(imgDir, { recursive: true });
  const manifestPath = path.join(imgDir, "manifest.json");
  const manifest = readJson(manifestPath, {});
  fs.writeFileSync(
    path.join(imgDir, "prompts.txt"),
    project.scenes
      .filter((s) => s.image && !s.commons)
      .map((s) => `${s.id}:\n${fullPrompt(project, s)}`)
      .join("\n\n") + "\n",
  );

  const missing = [];
  for (const s of project.scenes) {
    const target = path.join(imgDir, `${s.id}.jpg`);
    await adoptDroppedImage(imgDir, s.id, target);

    if (s.commons) {
      const key = sha1(`commons|${s.commons}`);
      if (fs.existsSync(target) && manifest[s.id]?.key === key && !redo.includes(s.id)) continue;
      log(`  ảnh ${s.id} (Commons: ${s.commons})`);
      const { buffer, info } = await withRetry(() => downloadCommons(s.commons), [5000, 15000]);
      await saveAsJpg(buffer, target);
      manifest[s.id] = {
        provider: "commons",
        key,
        credit: { title: info.title, author: info.author, license: info.license, url: info.url },
      };
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
      continue;
    }

    const refFiles = TAKES_REFS.has(provider)
      ? sceneCharacters(project, s).map((c) => refPath(dir, c.key)).filter((f) => fs.existsSync(f))
      : [];
    const prompt = fullPrompt(project, s, { withRefs: refFiles.length > 0 });
    const refSig = refFiles.map((f) => `${fs.statSync(f).size}:${fs.statSync(f).mtimeMs}`).join(",");
    const key = sha1(`${provider}|${project.format}|${prompt}${refSig ? `|${refSig}` : ""}`);
    const entry = manifest[s.id];
    const forced = redo.includes(s.id);

    if (fs.existsSync(target) && !forced) {
      if (!entry) manifest[s.id] = { provider: "manual" };
      if (!entry || entry.provider === "manual" || entry.key === key) continue;
    }
    if (provider === "manual") {
      missing.push(s.id);
      continue;
    }

    const attempt = forced ? (entry?.attempt ?? 0) + 1 : 0;
    log(`  ảnh ${s.id} (${provider}${attempt ? `, lần ${attempt + 1}` : ""}${refFiles.length ? `, ${refFiles.length} ảnh tham chiếu` : ""})`);
    const refs = refFiles.map((f) => fs.readFileSync(f));
    const { buffer, cropBottom = 0 } = await withRetry(
      () => PROVIDERS[provider](prompt, project.format, env, seedFor(prompt, attempt), refs),
      RETRY_DELAYS[provider],
    );
    await saveAsJpg(buffer, target);
    manifest[s.id] = { provider, key, attempt, cropBottom };
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  writeCredits(dir, project, manifest);

  if (missing.length) {
    const e = new Error(
      `Thiếu ảnh cho: ${missing.join(", ")}.\n` +
        `Tạo ảnh theo ${path.join(imgDir, "prompts.txt")} rồi lưu thành images/<id>.jpg (hoặc .png).`,
    );
    e.code = "MISSING_IMAGES";
    throw e;
  }
}

// Generates characters/<key>.jpg for every character that has no reference
// yet (or whose "look" changed). A hand-made characters/<key>.png/.jpg is kept.
// redo: keys to regenerate with a new seed. Returns the reference file paths.
export async function generateCharacters(project, dir, env, { redo = [] } = {}) {
  const chars = Object.entries(project.characters ?? {});
  if (!chars.length) return [];
  const provider = (project.imageProvider || env.IMAGE_PROVIDER || "pollinations").toLowerCase();
  const cDir = path.join(dir, "characters");
  fs.mkdirSync(cDir, { recursive: true });
  const manifestPath = path.join(cDir, "manifest.json");
  const manifest = readJson(manifestPath, {});
  fs.writeFileSync(
    path.join(cDir, "prompts.txt"),
    chars.map(([k, c]) => `${k}${c.name ? ` (${c.name})` : ""}:\n${characterPrompt(project, c)}`).join("\n\n") + "\n",
  );
  const missing = [];
  for (const [k, c] of chars) {
    if (!c.look?.trim()) throw new Error(`project.characters["${k}"] thiếu "look" (mô tả ngoại hình tiếng Anh)`);
    const target = refPath(dir, k);
    await adoptDroppedImage(cDir, k, target);
    const prompt = characterPrompt(project, c);
    const key = sha1(`${provider}|${prompt}`);
    const entry = manifest[k];
    const forced = redo.includes(k);
    if (fs.existsSync(target) && !forced) {
      if (!entry) manifest[k] = { provider: "manual" };
      if (!entry || entry.provider === "manual" || entry.key === key) continue;
    }
    if (provider === "manual") {
      missing.push(k);
      continue;
    }
    const attempt = forced ? (entry?.attempt ?? 0) + 1 : 0;
    log(`  nhân vật ${k} (${provider}${attempt ? `, lần ${attempt + 1}` : ""})`);
    const { buffer } = await withRetry(
      () => PROVIDERS[provider](prompt, "9:16", env, seedFor(prompt, attempt)),
      RETRY_DELAYS[provider],
    );
    await saveAsJpg(buffer, target);
    manifest[k] = { provider, key, attempt };
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  if (missing.length) {
    const e = new Error(
      `Thiếu ảnh nhân vật: ${missing.join(", ")}.\n` +
        `Tạo theo ${path.join(cDir, "prompts.txt")} rồi lưu thành characters/<key>.jpg (hoặc .png).`,
    );
    e.code = "MISSING_IMAGES";
    throw e;
  }
  return chars.map(([k]) => refPath(dir, k));
}

// CC BY / BY-SA require attribution: paste credits.txt into the video description.
function writeCredits(dir, project, manifest) {
  const lines = project.scenes
    .map((s) => manifest[s.id])
    .filter((m) => m?.provider === "commons")
    .map((m) => `- ${m.credit.title.replace(/^File:/, "")} — ${m.credit.author} — ${m.credit.license} — ${m.credit.url}`);
  const file = path.join(dir, "credits.txt");
  if (!lines.length) return fs.rmSync(file, { force: true });
  fs.writeFileSync(file, `Ảnh tư liệu: Wikimedia Commons\n${[...new Set(lines)].join("\n")}\n`);
}

// Grid of all scene images (row-major s001, s002, ...) for a quick visual review.
export async function contactSheet(project, dir) {
  const [tw, th, cols, rows] = project.format === "16:9" ? [480, 270, 4, 3] : [270, 480, 6, 2];
  const outDir = path.join(dir, "sheets");
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  await ffmpeg([
    "-framerate", "1",
    "-i", path.join(dir, "images", "s%03d.jpg"),
    "-vf", `scale=${tw}:${th}:force_original_aspect_ratio=decrease,pad=${tw}:${th}:(ow-iw)/2:(oh-ih)/2,tile=${cols}x${rows}:padding=6:color=white`,
    "-q:v", "3",
    path.join(outDir, "sheet-%02d.jpg"),
  ]);
  return fs.readdirSync(outDir).map((f) => path.join(outDir, f));
}
