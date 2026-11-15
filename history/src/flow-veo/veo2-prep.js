async (page) => { await page.bringToFront().catch(()=>{});
  const id = (await (await page.context().request.get('http://127.0.0.1:8765/id.txt')).text()).trim();
  if (page.url().includes('/edit/')) { await page.goto('https://flow.google.com/project/7995242f-9c54-4cdc-bf29-de69527893d7'); await page.waitForTimeout(6000); }
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
  return {id, prepared: true};
}
