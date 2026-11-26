// usage: node mk-bia.cjs [name]  -> renders cover variants with headless Chrome (1080x1920 PNG). Episode 1941.
const { execFileSync } = require("child_process");
const path = require("path");
const os = require("os");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const here = __dirname.split(path.sep).join("/");
// chosen by the user 2026-11-26: background 2 (stream desk, inkstone removed), BƯỚC CHÂN TRỞ VỀ / MÙA XUÂN PÁC BÓ + the 1911/1931 subtitle
const T1 = "BƯỚC CHÂN TRỞ VỀ", T2 = "MÙA XUÂN PÁC BÓ", SUB = "Hành trình hy vọng<br>của người thanh niên yêu nước.";
// [file, background, shift px, size, size line 2, text top px, seam fade %, soft fade %]
const V = [
  ["BIA-2", "nen-2-sach.jpg", 0, 82, 82, 190, "", 40],
];
const ONLY = process.argv.slice(2);
for (const [out, bg, shift, fs, fs2, top, fade, soft] of V) {
  if (ONLY.length && !ONLY.includes(out)) continue;
  const q = new URLSearchParams({ bg, t1: T1, t2: T2, sub: SUB, shift, fs, fs2, top, fade, soft }).toString();
  execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
    `--user-data-dir=${path.join(os.tmpdir(), "bia-chrome")}`, `--screenshot=${here}/${out}.png`,
    "--window-size=1080,1920", "--virtual-time-budget=3000", `file:///${here}/bia.html?${q}`], { stdio: "ignore" });
  console.log(out);
}
