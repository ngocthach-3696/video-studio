// usage: node mk-bia.cjs  -> renders the cover variants below with headless Chrome (1080x1920 PNG)
const { execFileSync } = require("child_process");
const path = require("path");
const os = require("os");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const here = __dirname.split(path.sep).join("/");
// [tên file, nền, dòng tiêu đề 1, dòng 2, câu phụ, shift (đẩy ảnh xuống, px), cỡ chữ tiêu đề]
// CHỐT (2026-11-17): nền 5 (ngã ba làng), các phương án nền/chữ khác đã xoá khi dọn dẹp
const V = [
  ["BIA-CHON", "nen-5-sach.jpg", "HAI CON ĐƯỜNG", "MỘT LÒNG CỨU NƯỚC", "Hai người thầy, hai lối đi,<br>một khát vọng độc lập.", 60, 82],
];
const ONLY = process.argv.slice(2);
for (const [out, bg, t1, t2, sub, shift, fs] of V) {
  if (ONLY.length && !ONLY.includes(out)) continue;
  const q = new URLSearchParams({ bg, t1, t2, sub, shift, fs }).toString();
  execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
    `--user-data-dir=${path.join(os.tmpdir(), "bia-chrome")}`, `--screenshot=${here}/${out}.png`,
    "--window-size=1080,1920", "--virtual-time-budget=3000", `file:///${here}/bia.html?${q}`], { stdio: "ignore" });
  console.log(out);
}
