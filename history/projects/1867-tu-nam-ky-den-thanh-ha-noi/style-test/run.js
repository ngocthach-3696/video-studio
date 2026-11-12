async (page) => {
  const STYLE = " Art style: flat 2D cartoon illustration like a modern Vietnamese history webcomic, thick uniform black outlines, flat cel colors with minimal soft shading, clean bright palette of vermilion red, black, warm wood brown and cream, adult characters with slightly large heads, highly expressive exaggerated cartoon facial expressions, the main character fills most of the frame, detailed but simple background, not painterly, not realistic, not chibi, respectful. Historically accurate Vietnamese Nguyen dynasty costume and architecture, no Chinese characters, no letters. Generate exactly 1 image, vertical 9:16.";
  const HD = "Hoang Dieu, a Vietnamese Nguyen dynasty governor aged about 53, long calm face, black mustache and short black beard with a few grey hairs, black wrapped turban (khan van), deep blue silk mandarin robe with wide sleeves, a long sword at his waist";
  const ITEMS = [
    ["t1", "Close-up portrait of " + HD + ", standing on the brick rampart of Hanoi citadel at dawn, jaw clenched, fierce determined eyes, an angry vein on his forehead, one hand gripping the sword hilt, smoke rising behind him."],
    ["t2", "Medium shot inside a Vietnamese citadel hall: " + HD + " sits at a red lacquered desk and coldly looks at a rolled French ultimatum letter, while a nervous Vietnamese messenger kneels sweating with wide eyes. On the floor in front stands a small blank wooden name board on a stand (plain wood, no writing)."]
  ].map(([id, p]) => ({ id, prompt: p + STYLE }));
  const PROJECT = 'https://flow.google.com/project/55fe131c-f3aa-43d4-ad8b-57de2bcedb80';
  const log = [];
  const busyCount = async () => (await page.getByText('Đang tư duy').count()) + (await page.getByText(/^[0-9]+%$/).count());
  const idle = async (maxSec) => { for (let i = 0; i < maxSec / 2; i++) { if (!(await busyCount())) return true; await page.waitForTimeout(2000); } return false; };
  const fresh = async () => { const b = page.getByRole('button', { name: 'Bắt đầu phiên mới' }); if (await b.count()) { await b.click({ force: true }); await page.waitForTimeout(2500); } };
  let k = 0;
  for (const item of ITEMS) {
    if (page.url() !== PROJECT) { await page.goto(PROJECT); await page.waitForTimeout(3000); }
    if (k++ === 0) await fresh();
    await idle(120);
    const box = page.getByRole('textbox', { name: 'Bạn muốn tạo gì?' });
    if (!(await box.count())) { log.push(item.id + ' STOP (no prompt box)'); break; }
    const tiles = page.getByAltText('Ô hiển thị hình ảnh của người dùng');
    const before = (await tiles.count()) ? await tiles.nth(0).getAttribute('src') : '';
    await box.click({ force: true }); await box.fill(item.prompt); await page.waitForTimeout(400);
    await page.screenshot(); await box.press('Enter');
    await page.waitForTimeout(8000);
    for (let r = 0; r < 6 && (await box.innerText()).trim().length > 20; r++) { await page.screenshot(); await box.press('Enter'); await page.waitForTimeout(8000); }
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
  }
  return log.join(' | ');
}
