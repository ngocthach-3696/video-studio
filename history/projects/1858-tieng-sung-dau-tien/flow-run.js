async (page) => {
  const T = [" 2D animated illustration, semi-realistic characters with normal adult human proportions (not chibi), clean ink outlines, painterly cel shading, muted mid-19th century palette of indigo blue, earth brown, brick red and sea grey with deep ochre-gold and dusky amber skies, solemn cinematic mood, respectful, no gore, no visible wounds or blood on people, no text, keep the upper 40% of the frame as dark dramatic amber sky with no important details (space for a big title), main subject in the lower 60%, strong contrast, eye-catching thumbnail. vertical 9:16 composition, subject centered. Historically accurate for the era: no modern national flags, no modern objects. No text, no letters, no captions, no watermark. Generate exactly 1 image, vertical 9:16."];
  const ITEMS = [["t02","Movie-poster composition, wide shot: the general standing on a coastal hilltop, his whole figure small in the lower half of the frame and his head clearly below the middle of the image, robe and sash blowing in strong wind, hand on his sword hilt, stern determined face turned toward the sea where several distant warships fire cannons with small flashes and smoke on the horizon. Characters: a dignified Vietnamese Nguyen dynasty general aged about 58, lean weathered face, long thin grey beard and grey mustache, calm stern eyes, black wrapped turban (khan van), dark indigo blue silk military robe with subtle embroidered cloud patterns, wide red sash, a sheathed long sword at his side.",0]].map(([id, p, t]) => ({ id, prompt: p + T[t] }));
  const PROJECT = 'https://flow.google.com/project/bd599a7a-e106-42ab-8785-bd163164697c';
  const log = [];
  const busyCount = async () => (await page.getByText('Đang tư duy').count()) + (await page.getByText(/^[0-9]+%$/).count());
  const idle = async (maxSec) => { for (let i = 0; i < maxSec / 2; i++) { if (!(await busyCount())) return true; await page.waitForTimeout(2000); } return false; };
  for (const item of ITEMS) {
    if (page.url() !== PROJECT) { await page.goto(PROJECT); await page.waitForTimeout(3000); }
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