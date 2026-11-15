async (page) => { await page.bringToFront().catch(()=>{});
  const id = (await (await page.context().request.get('http://127.0.0.1:8765/id.txt')).text()).trim();
  const P = JSON.parse(await (await page.context().request.get('http://127.0.0.1:8765/prompts.json')).text());
  if (!(await page.getByRole('textbox', {name: 'Tìm kiếm thành phần'}).isVisible().catch(()=>false))) await page.getByRole('button', {name: /Thêm thành phần/}).first().click({force:true});
  await page.waitForTimeout(1500);
  const box = page.getByRole('textbox', {name: 'Tìm kiếm thành phần'});
  let found = [];
  for (let k=0;k<6;k++){ await box.fill(''); await page.waitForTimeout(300); await box.fill('veo2-' + id); await page.waitForTimeout(3000); found = await page.locator('[role=dialog] button, [role=option]').allInnerTexts(); if (found.some(x => x.includes('veo2-' + id + '.jpg'))) break; await page.waitForTimeout(5000); }
  if (!found.some(x => x.includes('veo2-' + id + '.jpg'))) return {id, found, note: 'not found, not sent'};
  await page.locator('[role=dialog] button, [role=option]').filter({hasText: 'veo2-' + id + '.jpg'}).first().click({force:true}); await page.waitForTimeout(1500);
  const add = page.getByRole('button', {name: 'Thêm vào câu lệnh'});
  if (await add.isVisible().catch(()=>false)) { await add.click({force:true}); await page.waitForTimeout(1000); }
  const tb = page.getByRole('textbox', {name: /Bạn muốn tạo gì/});
  await tb.click({force:true}); await page.keyboard.insertText(P[id]); await page.waitForTimeout(800);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(12000);
  const msgs = await page.$$eval('p', a => a.map(x => x.innerText.trim()).filter(s => s.length > 20).slice(-2));
  return {id, sent: new Date().toLocaleTimeString(), msgs};
}
