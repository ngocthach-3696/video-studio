// usage: node flow-gen.mjs FROM TO  -> writes flow-run.js with the prompts inlined
import fs from "node:fs";
const [FROM, TO] = process.argv.slice(2).map(Number);
const DIR = "C:/video-studio/history/projects/mua-do-thanh-co-1972";
const batch = JSON.parse(fs.readFileSync(DIR + "/flow-batch.json", "utf8"))
  .slice(FROM - 1, TO).filter((b) => !fs.existsSync(`${DIR}/images/${b.id}.jpg`));
fs.mkdirSync(DIR + "/images", { recursive: true });
const code = `async (page) => {
  const ITEMS = ${JSON.stringify(batch)};
  const DIR = '${DIR}';
  const PROJECT = 'https://flow.google.com/project/c2872d3e-de3a-4c5f-9041-a2e336269a21';
  const log = [];
  const idle = async (maxSec) => {
    for (let i = 0; i < maxSec / 2; i++) { if (!(await page.getByText('Đang tư duy').count()) && !(await page.getByText(/^[0-9]+%$/).count())) return true; await page.waitForTimeout(2000); }
    return false;
  };
  for (const item of ITEMS) {
    if (page.url() !== PROJECT) { await page.goto(PROJECT); await page.waitForTimeout(3000); }
    await idle(120);
    if (!(await page.getByRole('button', { name: 'Tác nhân' }).count())) { log.push(item.id + ' STOP (agent mode lost - window too narrow?)'); break; }
    const tiles = page.getByAltText('Ô hiển thị hình ảnh của người dùng');
    const before = (await tiles.count()) ? await tiles.nth(0).getAttribute('src') : '';
    const box = page.getByRole('textbox', { name: 'Bạn muốn tạo gì?' });
    await box.click(); await box.fill(item.prompt); await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Bắt đầu tạo' }).click();
    await page.waitForTimeout(8000);
    let ok = false, after = before;
    for (let i = 0; i < 80; i++) {
      const busy = (await page.getByText('Đang tư duy').count()) + (await page.getByText(/^[0-9]+%$/).count());
      after = (await tiles.count()) ? await tiles.nth(0).getAttribute('src') : '';
      if (!busy && after !== before) { ok = true; break; }
      await page.waitForTimeout(3000);
    }
    await page.waitForTimeout(1500);
    if (!ok || after === before) { log.push(item.id + ' FAIL (no new image, idle=' + ok + ')'); break; }
    await tiles.nth(0).click();
    await page.waitForTimeout(2500);
    await page.getByRole('button', { name: 'Tải nội dung nghe nhìn xuống' }).click();
    await page.waitForTimeout(800);
    await page.getByRole('menuitem').filter({ hasText: '1K' }).click();
    await page.waitForTimeout(5000);
    log.push(item.id + ' ok');
    await page.goto(PROJECT); await page.waitForTimeout(3000);
  }
  return log.join('\\n');
}`;
fs.writeFileSync(DIR + "/flow-run.js", code);
console.log("items:", batch.map((b) => b.id).join(","));
