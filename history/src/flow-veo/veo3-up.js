async (page) => { await page.bringToFront().catch(()=>{});
  const id = (await (await page.context().request.get('http://127.0.0.1:8765/id.txt')).text()).trim();
  if (page.url().includes('/edit/')) { await page.goto('https://flow.google.com/project/__PROJECT_ID__'); await page.waitForTimeout(6000); }
  const b64 = (await (await page.context().request.get('http://127.0.0.1:8765/veo2-' + id + '.jpg')).body()).toString('base64');
  await page.evaluate(([b64, name]) => {
    const bin = atob(b64); const u = new Uint8Array(bin.length); for (let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i);
    const file = new File([u], name, {type:'image/jpeg'});
    window.__veoOrig = window.__veoOrig || HTMLInputElement.prototype.click;
    const orig = window.__veoOrig;
    HTMLInputElement.prototype.click = function() {
      if (this.type === 'file') { const dt = new DataTransfer(); dt.items.add(file); this.files = dt.files; this.dispatchEvent(new Event('change', {bubbles:true})); HTMLInputElement.prototype.click = orig; return; }
      return orig.call(this);
    };
  }, [b64, 'veo2-' + id + '.jpg']);
  
  await page.waitForTimeout(1500);

  let items = await page.$$eval('[role=menuitem]', a => a.filter(x => x.getBoundingClientRect().width > 0).map(x => { const r = x.getBoundingClientRect(); return {t: x.innerText.trim(), x: r.x+r.width/2, y: r.y+r.height/2}; }));
  if (!items.length) { await page.screenshot(); await page.evaluate(() => { const b = [...document.querySelectorAll("button")].find(x => (x.getAttribute("aria-label")||"") === "Trình đơn thêm nội dung nghe nhìn"); ["pointerdown","mousedown","pointerup","mouseup","click"].forEach(e => b.dispatchEvent(new MouseEvent(e, {bubbles:true}))); }); await page.waitForTimeout(2500);
    items = await page.$$eval('[role=menuitem]', a => a.filter(x => x.getBoundingClientRect().width > 0).map(x => { const r = x.getBoundingClientRect(); return {t: x.innerText.trim(), x: r.x+r.width/2, y: r.y+r.height/2}; })); }
  const it = items.find(i => /Tải lên/.test(i.t));
  if (!it) return {err: 'no menu'};
  await page.mouse.click(it.x, it.y); await page.waitForTimeout(15000);
  return await page.$$eval('button', a => a.map(b => (b.getAttribute('aria-label')||'').trim()).filter(s => /veo2/.test(s)).slice(0,2));
}
