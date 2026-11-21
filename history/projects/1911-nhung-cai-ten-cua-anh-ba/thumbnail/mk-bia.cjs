// usage: node mk-bia.cjs [name]  -> renders cover variants with headless Chrome (1080x1920 PNG)
const { execFileSync } = require("child_process");
const path = require("path");
const os = require("os");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const here = __dirname.split(path.sep).join("/");
// 1911: user's own title, no subtitle (2026-11-21), background I (Paris alley + agent under the lamp)
// 1905 format: episode title 2 lines (user picked B, 2026-11-21) + the user's own line as the subtitle
// [file, background, t1, t2, sub, shift px, size, size line 2, text top px, seam fade %, soft fade %]
const V = [
  // CHỐT 2026-11-21 (variant 1B: agent hiding at a wall corner, mist, wet street, long shadow); other variants deleted at cleanup
  ["BIA-CHON", "nen-1b-sach.jpg", "TỪ VĂN BA", "ĐẾN NGUYỄN ÁI QUỐC", "Hành trình hy vọng<br>của người thanh niên yêu nước.", 0, 82, 82, 190, "", 40],
];
const ONLY = process.argv.slice(2);
for (const [out, bg, t1, t2, sub, shift, fs, fs2, top, fade, soft] of V) {
  if (ONLY.length && !ONLY.includes(out)) continue;
  const q = new URLSearchParams({ bg, t1, t2, sub, shift, fs, fs2, top, fade, soft }).toString();
  execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
    `--user-data-dir=${path.join(os.tmpdir(), "bia-chrome")}`, `--screenshot=${here}/${out}.png`,
    "--window-size=1080,1920", "--virtual-time-budget=3000", `file:///${here}/bia.html?${q}`], { stdio: "ignore" });
  console.log(out);
}
