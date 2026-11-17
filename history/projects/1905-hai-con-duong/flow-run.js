async (page) => {
  const T = [" bold 2D cartoon like a Vietnamese YouTube history animation. Clean thick smooth black outlines, flat colours with two-tone cel shading (one darker shadow tone), simple wood grain and fabric patterns on props. Characters: big rounded heads, stocky simplified bodies, simple hands, expressive faces with small almond-shaped eyes and black dot pupils, simple eyebrows, tiny line nose, slightly comical deadpan, smug or worried expressions. Cinematic storyboard composition: the main characters are LARGE, filling 60-80% of the frame height (knee-up, waist-up or close-up); the frame is FULL edge to edge with rich detailed background architecture, nature and props, no empty sky or empty ground; three depth layers (a foreground prop or frame edge, the characters, a detailed background with small extras); clear perspective. Bold saturated colours with strong contrast: vermilion red, black, gold, warm wood brown, jungle green, deep night blue; visible light sources (torches, lanterns, candles, fire, sunrise) casting a warm glow. Respectful, no gore. vertical 9:16 composition. Historically accurate for the era: no modern national flags, no modern objects. No text, no letters, no captions, no watermark. Generate exactly 1 image, vertical 9:16."];
  const ITEMS = [["t3","Poster for a cover: the TOP 45% of the image is an almost black, empty dark sky (plain, nothing important there, room for big text); the two men fill the BOTTOM 55% of the frame, large, waist-up, faces clearly visible, their heads in the middle of the frame height. An old harbour wharf at dusk, the last red glow on the horizon: on the left Phan Boi Chau: a Vietnamese Confucian scholar aged about 38, lean and strong, broad forehead, intense burning eyes, thick black eyebrows, black mustache and short black goatee, black wrapped khan dong turban, earth-brown long Vietnamese tunic (ao dai), a worn cloth shoulder bag, looking to the LEFT; on the right Phan Chau Trinh: a Vietnamese reformist scholar aged about 34, slim, long oval face, calm clever eyes, thin black mustache, SHORT neatly cropped black hair (no bun, no turban, no hat), teal blue long Vietnamese tunic (ao dai), holding a closed book, looking to the RIGHT; they stand a little apart, not looking at each other; behind them on the sea two black steamships with smoke sail away in opposite directions, one to the left and one to the right, their wakes splitting apart; wooden pier posts and ropes in the foreground",0],["t4","Poster for a cover: the TOP 45% of the image is an almost black, empty dark sky (plain, nothing important there, room for big text); the two men fill the BOTTOM 55% of the frame, large, waist-up, faces clearly visible, their heads in the middle of the frame height. Symbolic split portrait: the frame is divided down the middle; LEFT half Phan Boi Chau: a Vietnamese Confucian scholar aged about 38, lean and strong, broad forehead, intense burning eyes, thick black eyebrows, black mustache and short black goatee, black wrapped khan dong turban, earth-brown long Vietnamese tunic (ao dai), a worn cloth shoulder bag, close-up from the chest up, lit by red-orange firelight, embers floating, an old rifle held upright in front of his chest; RIGHT half Phan Chau Trinh: a Vietnamese reformist scholar aged about 34, slim, long oval face, calm clever eyes, thin black mustache, SHORT neatly cropped black hair (no bun, no turban, no hat), teal blue long Vietnamese tunic (ao dai), close-up from the chest up, lit by a cool blue-white oil lamp, an open book held in front of his chest; both look straight at the viewer, serious; the two halves meet in the centre with a thin glowing line",0],["t5","Poster for a cover: the TOP 45% of the image is an almost black, empty dark sky (plain, nothing important there, room for big text); the two men fill the BOTTOM 55% of the frame, large, waist-up, faces clearly visible, their heads in the middle of the frame height. A Vietnamese village crossroads at dawn: a dirt road splits into two paths, one going left toward misty mountains and the rising sun, one going right toward a distant small school house; a wooden signpost with two BLANK arrow boards (no writing) pointing left and right stands between them; on the left Phan Boi Chau: a Vietnamese Confucian scholar aged about 38, lean and strong, broad forehead, intense burning eyes, thick black eyebrows, black mustache and short black goatee, black wrapped khan dong turban, earth-brown long Vietnamese tunic (ao dai), a worn cloth shoulder bag, a rifle on his shoulder, stepping toward the left path; on the right Phan Chau Trinh: a Vietnamese reformist scholar aged about 34, slim, long oval face, calm clever eyes, thin black mustache, SHORT neatly cropped black hair (no bun, no turban, no hat), teal blue long Vietnamese tunic (ao dai), a stack of books under his arm, stepping toward the right path; both glance back over their shoulder at each other; a big banyan tree and a temple roof far behind",0]].map(([id, p, t]) => ({ id, prompt: p + T[t] }));
  const PROJECT = 'https://flow.google.com/project/009cda43-9f52-4dd9-93ae-418abdc3a41d';
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
}