// Tạo giọng đọc qua vibi.pro (mặc định: "Anh Nghĩa" = MiniMax Vietnamese_Serene_Man).
// Văn bản luôn đọc từ file UTF-8 và gửi bằng fetch, để không bị hỏng dấu tiếng Việt
// (curl trong Git Bash/PowerShell trên Windows làm mất dấu).
//
// Dùng:  node src/vibi-tts.mjs <file.txt> <out.mp3> [--voice ID] [--model speech-2.8-hd] [--speed 1] [--pitch 0] [--vol 1]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const API = 'https://api.vibi.pro/v1';

function loadKey() {
  if (process.env.VIBI_API_KEY) return process.env.VIBI_API_KEY;
  const env = path.join(here, '..', '.env');
  const m = fs.existsSync(env) && fs.readFileSync(env, 'utf8').match(/^VIBI_API_KEY=(.+)$/m);
  if (!m) throw new Error('Thiếu VIBI_API_KEY trong history/.env');
  return m[1].trim();
}

export async function vibiTTS(text, outFile, opts = {}) {
  const key = loadKey();
  const voice = opts.voice ?? 'Vietnamese_Serene_Man';
  const body = {
    text,
    model_id: opts.model ?? 'speech-2.8-hd',
    provider: 'minimax',
    language_code: 'Vietnamese',
    voice_settings: { speed: opts.speed ?? 1, pitch: opts.pitch ?? 0, vol: opts.vol ?? 1 },
  };
  const headers = { 'xi-api-key': key, 'Content-Type': 'application/json; charset=utf-8' };
  const res = await fetch(`${API}/text-to-speech/${encodeURIComponent(voice)}`, {
    method: 'POST', headers, body: JSON.stringify(body),
  });
  const job = await res.json();
  if (!job.id) throw new Error(`vibi lỗi ${res.status}: ${JSON.stringify(job)}`);
  for (let i = 0; i < 120; i++) {
    const r = await (await fetch(`${API}/history/${job.id}`, { headers })).json();
    if (r.status === 'completed') {
      if (r.text !== text) throw new Error('Văn bản trên vibi khác văn bản gửi đi (lỗi mã hoá?)');
      const audio = Buffer.from(await (await fetch(r.result.audio_url)).arrayBuffer());
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, audio);
      return { id: job.id, credits: r.credits_deducted, file: outFile };
    }
    if (r.status === 'failed' || r.error) throw new Error(`vibi thất bại: ${JSON.stringify(r.error ?? r.detail_error)}`);
    await new Promise((ok) => setTimeout(ok, 2000));
  }
  throw new Error('Hết thời gian chờ vibi');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [inFile, outFile, ...rest] = process.argv.slice(2);
  if (!inFile || !outFile) {
    console.error('Dùng: node src/vibi-tts.mjs <file.txt> <out.mp3> [--voice ID] [--speed 1] ...');
    process.exit(1);
  }
  const opts = {};
  for (let i = 0; i < rest.length; i += 2) {
    const k = rest[i].replace(/^--/, ''), v = rest[i + 1];
    opts[k] = ['speed', 'pitch', 'vol'].includes(k) ? Number(v) : v;
  }
  const text = fs.readFileSync(inFile, 'utf8').replace(/^﻿/, '').trim();
  const r = await vibiTTS(text, outFile, opts);
  console.log(`OK ${r.file} (${r.credits} credits)`);
}
