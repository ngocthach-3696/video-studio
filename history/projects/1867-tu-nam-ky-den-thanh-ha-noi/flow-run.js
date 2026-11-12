async (page) => {
  const T = [" 2D animated illustration, semi-realistic characters with normal adult human proportions (not chibi), clean ink outlines, painterly cel shading, muted late-19th century palette of indigo blue, earth brown, brick red and river grey with deep ochre-gold and dusky amber skies, solemn cinematic mood, respectful, no gore, no visible wounds or blood on people, no text, keep the upper 40% of the frame as dark dramatic amber sky with no important details (space for a big title), main subject in the lower 60%, strong contrast, eye-catching thumbnail. vertical 9:16 composition, subject centered. Historically accurate for the era: no modern national flags, no modern objects. No text, no letters, no captions, no watermark. Generate exactly 1 image, vertical 9:16."];
  const ITEMS = [["t04","Movie-poster composition, close-up: the elderly mandarin's sorrowful gaunt face lit warmly by a single candle flame, a small white porcelain cup on the dark table in front of him, eyes looking down at the cup, his head and shoulders filling the lower half of the frame with his eyes clearly below the middle of the image, deep shadows, quiet and dignified. Characters: an elderly Vietnamese Nguyen dynasty high mandarin aged about 71, very thin and frail, gentle sorrowful eyes, long sparse white beard and thin white mustache, black wrapped turban (khan van), long dark indigo silk mandarin robe with wide sleeves and a plain embroidered square on the chest without any characters.",0],["t05","Movie-poster composition: the old general sits proudly on a wooden bench, in the lower half of the frame with his head clearly below the middle of the image, firmly pushing away a French army doctor who offers bandages, his face stern and unbroken, two French marines watching uneasily behind, dim lantern light, tense and defiant, no blood. Characters: an elderly Vietnamese Nguyen dynasty general aged about 73, lean weathered face, long thin white beard and white mustache, stern calm eyes, black wrapped turban (khan van), dark indigo blue silk military robe with subtle embroidered cloud patterns, wide red sash, a sheathed long sword at his side; a French marine infantry soldier in Indochina around 1873–1883, European man with a mustache, white cork sun helmet, dark navy blue wool tunic with brass buttons, white trousers, white cross belts, breech-loading rifle with a long bayonet.",0],["t06","Movie-poster composition, symbolic still life at dawn: in the courtyard of an old Vietnamese temple (Võ Miếu) a sheathed sword and a folded black turban lie on worn stone steps in the lower part of the frame, an ancient banyan tree, falling leaves, golden morning light breaking through mist, smoke from the burning citadel far behind, no people, solemn.",0]].map(([id, p, t]) => ({ id, prompt: p + T[t] }));
  const PROJECT = 'https://flow.google.com/project/55fe131c-f3aa-43d4-ad8b-57de2bcedb80';
  const log = [];
  const busyCount = async () => (await page.getByText('Đang tư duy').count()) + (await page.getByText(/^[0-9]+%$/).count());
  const idle = async (maxSec) => { for (let i = 0; i < maxSec / 2; i++) { if (!(await busyCount())) return true; await page.waitForTimeout(2000); } return false; };
  // a Flow agent session errors out after ~13 images: start a fresh session first and every 10 images
  const fresh = async () => { const b = page.getByRole('button', { name: 'Bắt đầu phiên mới' }); if (await b.count()) { await b.click({ force: true }); await page.waitForTimeout(2500); } };
  let k = 0;
  for (const item of ITEMS) {
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