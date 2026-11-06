#!/usr/bin/env node
// Wikimedia Commons helper: search free-licensed historical images, preview
// candidates as a numbered contact sheet, and download a chosen file.
//
// CLI:
//   node src/commons.mjs search "<query>" [--limit 12] [--out <dir>]
//     → prints numbered candidates (title, size, license, author) and writes
//       <dir>/<slug>.jpg — a numbered grid of thumbnails to review.
//   node src/commons.mjs info "File:Example.jpg"
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ffmpeg, sha1 } from "./util.mjs";

const API = "https://commons.wikimedia.org/w/api.php";
// Wikimedia asks API clients to identify themselves.
const HEADERS = { "User-Agent": "HistoryVideoPipeline/1.0 (personal, non-commercial research tool)" };
const FREE_LICENSE = /^(public domain|pd\b|pd-|cc0|cc[ -]by(?![ -]?n[cd])(-sa)?)/i;

function stripHtml(s = "") {
  return s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function toCandidate(page) {
  const ii = page.imageinfo?.[0];
  if (!ii) return null;
  const m = ii.extmetadata || {};
  const license = stripHtml(m.LicenseShortName?.value) || "unknown";
  return {
    title: page.title,
    width: ii.width,
    height: ii.height,
    mime: ii.mime,
    license,
    free: FREE_LICENSE.test(license),
    author: stripHtml(m.Artist?.value).slice(0, 120) || "unknown",
    description: stripHtml(m.ImageDescription?.value).slice(0, 200),
    date: stripHtml(m.DateTimeOriginal?.value).slice(0, 40),
    url: ii.descriptionurl,
    thumb: ii.thumburl,
  };
}

async function api(params) {
  const qs = new URLSearchParams({ format: "json", formatversion: "2", ...params });
  const res = await fetch(`${API}?${qs}`, { headers: HEADERS, signal: AbortSignal.timeout(60_000) });
  if (!res.ok) throw new Error(`Commons API HTTP ${res.status}`);
  return res.json();
}

const IIPROP = { prop: "imageinfo", iiprop: "url|size|mime|extmetadata" };

export async function searchCommons(query, limit = 12, thumbWidth = 400) {
  const j = await api({
    action: "query",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: String(limit),
    iiurlwidth: String(thumbWidth),
    ...IIPROP,
  });
  const pages = (j.query?.pages || []).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  return pages.map(toCandidate).filter(Boolean);
}

export async function fileInfo(title, thumbWidth = 2400) {
  const t = title.startsWith("File:") ? title : `File:${title}`;
  const j = await api({ action: "query", titles: t, iiurlwidth: String(thumbWidth), ...IIPROP });
  const page = j.query?.pages?.[0];
  if (!page || page.missing) throw new Error(`Không thấy trên Commons: ${t}`);
  return toCandidate(page);
}

// Downloads a scaled rendition (≤2400px wide) — originals can be 100+ MB TIFFs.
export async function downloadCommons(title) {
  const info = await fileInfo(title);
  if (!info.free) throw Object.assign(new Error(`${info.title}: giấy phép "${info.license}" không tự do — chọn ảnh khác`), { fatal: true });
  const res = await fetch(info.thumb, { headers: HEADERS, signal: AbortSignal.timeout(180_000) });
  if (!res.ok) throw new Error(`Tải ${info.title} lỗi HTTP ${res.status}`);
  return { buffer: Buffer.from(await res.arrayBuffer()), info };
}

async function contactSheet(cands, outFile) {
  const tmp = `${outFile}.tmp`;
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  let n = 0;
  for (const c of cands) {
    n++;
    const raw = path.join(tmp, `raw${n}`);
    const res = await fetch(c.thumb, { headers: HEADERS });
    fs.writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
    await ffmpeg([
      "-i", raw,
      "-vf",
      "scale=400:300:force_original_aspect_ratio=decrease,pad=400:300:(ow-iw)/2:(oh-ih)/2:color=gray," +
        `drawtext=fontfile='C\\:/Windows/Fonts/arialbd.ttf':text='${n}${c.free ? "" : " NONFREE"}':x=8:y=8:fontsize=34:fontcolor=yellow:box=1:boxcolor=black@0.7`,
      "-frames:v", "1",
      path.join(tmp, `c${String(n).padStart(2, "0")}.jpg`),
    ]);
  }
  const cols = 4;
  const rows = Math.ceil(n / cols);
  await ffmpeg(["-framerate", "1", "-i", path.join(tmp, "c%02d.jpg"), "-vf", `tile=${cols}x${rows}:padding=4:color=white`, "-frames:v", "1", outFile]);
  fs.rmSync(tmp, { recursive: true, force: true });
}

async function cli() {
  const [cmd, query, ...rest] = process.argv.slice(2);
  const flag = (name, def) => {
    const i = rest.indexOf(name);
    return i === -1 ? def : rest[i + 1];
  };
  if (cmd === "search" && query) {
    const cands = await searchCommons(query, Number(flag("--limit", 12)));
    if (!cands.length) return console.log("Không có kết quả.");
    cands.forEach((c, i) =>
      console.log(
        `${String(i + 1).padStart(2)}. ${c.title}\n    ${c.width}x${c.height} · ${c.license}${c.free ? "" : " (KHÔNG TỰ DO)"} · ${c.author}` +
          `${c.date ? ` · ${c.date}` : ""}\n    ${c.description}`,
      ),
    );
    const outDir = path.resolve(flag("--out", "candidates"));
    fs.mkdirSync(outDir, { recursive: true });
    const slug = query.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || sha1(query);
    const sheet = path.join(outDir, `${slug}.jpg`);
    await contactSheet(cands, sheet);
    console.log(`\nLưới ảnh (đánh số theo danh sách): ${sheet}`);
  } else if (cmd === "info" && query) {
    console.log(JSON.stringify(await fileInfo(query), null, 1));
  } else {
    console.log('Usage: node src/commons.mjs search "<query>" [--limit 12] [--out <dir>] | info "File:..."');
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  cli().catch((e) => {
    console.error(`✖ ${e.message}`);
    process.exit(1);
  });
}
