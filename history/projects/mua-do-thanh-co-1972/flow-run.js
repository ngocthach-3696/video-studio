async (page) => {
  const ITEMS = [{"id":"s063","prompt":"Two old history books open side by side, red ink circles drawn around different paragraphs of blurred illegible handwriting, a candle between them, no digits, no numbers, no readable text. 2D animated illustration, semi-realistic characters with normal adult human proportions (not chibi), clean ink outlines, painterly cel shading, muted palette of olive green, ash grey and earth brown with deep red accents and dusky orange skies, solemn cinematic mood, respectful, no gore, no visible wounds or blood on people, no text, keep the upper fifth and the lower-middle area free of important details. vertical 9:16 composition, subject centered. Historically accurate for the era: no modern national flags, no modern objects. No text, no letters, no captions, no watermark. Generate exactly 1 image, vertical 9:16."}];
  const DIR = 'C:/video-studio/history/projects/mua-do-thanh-co-1972';
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
  return log.join('\n');
}