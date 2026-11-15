async (page) => {
  let items = await page.$$eval('[role=menuitem]', a => a.filter(x => x.getBoundingClientRect().width > 0).map(x => { const r = x.getBoundingClientRect(); return {t: x.innerText.trim(), x: r.x+r.width/2, y: r.y+r.height/2}; }));
  if (!items.length) { await page.mouse.move(900, 500); await page.waitForTimeout(500); await page.mouse.click(1611, 37); await page.waitForTimeout(2500);
    items = await page.$$eval('[role=menuitem]', a => a.filter(x => x.getBoundingClientRect().width > 0).map(x => { const r = x.getBoundingClientRect(); return {t: x.innerText.trim(), x: r.x+r.width/2, y: r.y+r.height/2}; })); }
  const it = items.find(i => /Tải lên/.test(i.t));
  if (!it) return {err: 'no menu'};
  await page.mouse.click(it.x, it.y); await page.waitForTimeout(15000);
  return await page.$$eval('button', a => a.map(b => (b.getAttribute('aria-label')||'').trim()).filter(s => /veo2/.test(s)).slice(0,2));
}
