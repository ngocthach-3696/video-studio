// usage: node flow-gen.mjs FROM TO [ids,...]  -> writes flow-run.js with the prompts inlined
// ids that are character keys are saved to characters/, sNNN to images/ (see flow-collect.ps1)
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const [FROM, TO, ONLY] = process.argv.slice(2);
const DIR = fileURLToPath(new URL(".", import.meta.url)).replaceAll(String.fromCharCode(92), "/").replace(/\/$/, "");
const target = (id) => `${DIR}/${/^s\d{3}$/.test(id) ? "images" : /^t\d+$/.test(id) ? "thumbnail" : "characters"}/${id}.jpg`;
let batch = JSON.parse(fs.readFileSync(DIR + "/flow-batch.json", "utf8"));
if (ONLY) batch = batch.filter((b) => ONLY.split(",").includes(b.id));
else batch = batch.slice(Number(FROM) - 1, Number(TO)).filter((b) => !fs.existsSync(target(b.id)));
// the long shared style suffix is sent once (keeps the echoed tool call short)
const SUF = " bold 2D cartoon";
const cut = (p) => (p.includes(SUF) ? p.indexOf(SUF) : p.length);
const tails = [...new Set(batch.map((b) => b.prompt.slice(cut(b.prompt))))];
const items = batch.map((b) => [b.id, b.prompt.slice(0, cut(b.prompt)), tails.indexOf(b.prompt.slice(cut(b.prompt)))]);
const code = `async (page) => {
  const T = ${JSON.stringify(tails)};
  const ITEMS = ${JSON.stringify(items)}.map(([id, p, t]) => ({ id, prompt: p + T[t] }));
  const PROJECT = 'https://flow.google.com/project/7995242f-9c54-4cdc-bf29-de69527893d7';
  const log = [];
  const busyCount = async () => (await page.getByText('Đang tư duy').count()) + (await page.getByText(/^[0-9]+%$/).count());
  const idle = async (maxSec) => { for (let i = 0; i < maxSec / 2; i++) { if (!(await busyCount())) return true; await page.waitForTimeout(2000); } return false; };
  // a Flow agent session errors out after ~13 images: start a fresh session first and every 10 images
  const fresh = async () => { const b = page.getByRole('button', { name: 'Bắt đầu phiên mới' }); if (await b.count()) { await b.click({ force: true }); await page.waitForTimeout(2500); } };
  let k = 0;
  for (const item of ITEMS) { try {
    if (page.url() !== PROJECT) { await page.goto(PROJECT); await page.waitForTimeout(3000); }
    if (k++ % 10 === 0) await fresh();
    await idle(120);
    const box = page.getByRole('textbox', { name: 'Bạn muốn tạo gì?' });
    if (!(await box.count())) { log.push(item.id + ' STOP (no prompt box)'); break; }
    const tiles = page.getByAltText('Ô hiển thị hình ảnh của người dùng');
    const before = (await tiles.count()) ? await tiles.nth(0).getAttribute('src') : '';
    await box.click({ force: true }); await box.fill(item.prompt); await page.waitForTimeout(400);
    // When the Flow tab is hidden (user on another tab), the page ignores input until it renders a frame:
    // a screenshot forces one. Then send with Enter (a forced click on the send button does nothing).
    await page.screenshot(); await box.press('Enter');
    await page.waitForTimeout(8000);
    for (let r = 0; r < 6 && (await box.innerText({ timeout: 5000 }).catch(() => "")).trim().length > 20; r++) { await page.screenshot(); await box.press('Enter'); await page.waitForTimeout(8000); }
    let ok = false, after = before;
    for (let i = 0; i < 80; i++) {
      after = (await tiles.count()) ? await tiles.nth(0).getAttribute('src') : '';
      if (!(await busyCount()) && after !== before) { ok = true; break; }
      await page.waitForTimeout(3000);
    }
    await page.waitForTimeout(1500);
    if (!ok || after === before) { log.push(item.id + ' FAIL (no new image, idle=' + ok + ')'); break; }
    await tiles.nth(0).click({ force: true });
    await page.waitForTimeout(2500);
    await page.getByRole('button', { name: 'Tải nội dung nghe nhìn xuống' }).click({ force: true });
    await page.waitForTimeout(800);
    await page.getByRole('menuitem').filter({ hasText: '1K' }).click({ force: true });
    await page.waitForTimeout(5000);
    log.push(item.id + ' ok');
    await page.goto(PROJECT); await page.waitForTimeout(3000);
  } catch (e) { log.push(item.id + ' ERR ' + String(e.message).slice(0, 60)); if (log.filter((l) => l.includes(' ERR')).length >= 3) break; await page.goto(PROJECT); await page.waitForTimeout(4000); await idle(120); } }
  return log.join(' | ');
}`;
fs.writeFileSync(DIR + "/flow-run.js", code);
console.log("items:", batch.map((b) => b.id).join(","));
