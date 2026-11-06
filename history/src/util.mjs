import fs from "node:fs";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const sha1 = (s) => createHash("sha1").update(String(s)).digest("hex").slice(0, 12);
export const log = (...a) => console.log(`[${new Date().toLocaleTimeString("vi-VN")}]`, ...a);

export function readJson(file, fallback = null) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

export function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { cwd: opts.cwd, windowsHide: true });
    let out = "";
    let err = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.on("error", reject);
    p.on("close", (code) =>
      code === 0 ? resolve(out) : reject(new Error(`${cmd} exited ${code}\n${err.slice(-3000)}`)),
    );
  });
}

export const ffmpeg = (args, opts) => run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], opts);

export async function probeDuration(file) {
  const out = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]);
  return parseFloat(out.trim());
}

export async function probeSize(file) {
  const out = await run("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", file]);
  const [w, h] = out.trim().split(",").map(Number);
  return { w, h };
}

export async function withRetry(fn, delays = [4000, 10000]) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (e.fatal || attempt >= delays.length) throw e;
      log(`    lỗi (${e.message.split("\n")[0]}), thử lại sau ${delays[attempt] / 1000}s`);
      await sleep(delays[attempt]);
    }
  }
}
