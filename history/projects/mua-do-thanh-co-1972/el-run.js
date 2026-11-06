async (page) => {
  const ITEMS = [{"id":"s018","text":"Trên bàn đàm phán, ai giữ được đất, người đó có tiếng nói."},{"id":"s052","text":"Người ta gọi họ là thế hệ xếp bút nghiên."}];
  const log = [];
  const credits = async () => { const t = await page.locator('body').innerText(); const m = t.match(/([0-9,]+) credits remaining/); return m ? m[1] : '?'; };
  for (const it of ITEMS) {
    if (await page.getByText(/captcha/i).count()) { log.push(it.id + ' STOP captcha'); break; }
    const box = page.getByRole('textbox').first();
    await box.focus();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Delete');
    await page.waitForTimeout(400);
    await page.keyboard.insertText(it.text);
    await page.waitForTimeout(600);
    const gen = page.getByRole('button', { name: /generate speech/i }).first();
    await gen.click({ force: true, timeout: 10000 }).catch(() => page.keyboard.press('Control+Enter'));
    // wait until the bottom player shows this text (new generation ready)
    const head = it.text.slice(0, 18);
    let ready = false;
    for (let i = 0; i < 60; i++) {
      await page.waitForTimeout(2000);
      const n = await page.getByRole('paragraph').filter({ hasText: head }).count();
      const busy = await page.getByText(/Generating/i).count();
      if (n >= 1 && !busy && (await page.getByRole('button', { name: 'Download', exact: true }).count())) { ready = true; break; }
      if (await page.getByText(/not enough credits|quota|limit reached|unusual activity/i).count()) break;
    }
    if (!ready) { log.push(it.id + ' FAIL not ready; credits=' + (await credits())); break; }
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Download', exact: true }).first().click({ force: true });
    await page.waitForTimeout(4000);
    log.push(it.id + ' ok ' + (await credits()));
  }
  return log.join(" | ");;
}