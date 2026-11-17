async (page) => { await page.bringToFront().catch(()=>{});
  // wait until the newest tile (first in grid) is a finished video that is not an uploaded veo2 image, then download 720p
  const id = (await (await page.context().request.get('http://127.0.0.1:8765/id.txt')).text()).trim();
  const skip = /Yêu thích|Sử dụng lại|Tuỳ chọn|Trang chủ|Tìm|lọc|Trình đơn|Trợ giúp|Cài đặt|Lựa chọn|Thu gọn|Tạo bộ|Tất cả|Hình ảnh|^Video$|Nhân vật|^Cảnh$|Tệp|Các lựa|Thêm|Bắt đầu|Đóng|Câu trả lời|Sao chép|Gắn cờ|Mở nhật|Chỉ dẫn|Điều kiện|quay lại|Nội dung nghe nhìn/;
  let label = null;
  const old = (await (await page.context().request.get('http://127.0.0.1:8765/old.txt').catch(()=>null))?.text().catch(()=>'')) || '';
  for (let i = 0; i < 16; i++) {
    const fail = await page.$$eval('p', a => a.map(x => x.innerText.trim()).filter(s => /không thành công|hoàn tiền|vi phạm|couldn.t|unable to/i.test(s)).slice(-1));
    const labels = await page.$$eval('button', a => a.map(b => (b.getAttribute('aria-label')||'').trim()).filter(Boolean));
    const first = labels.filter(s => !skip.test(s))[0];
    if (first && !first.startsWith('veo2-') && first !== old.trim()) { label = first; break; }
    if (fail.length && i > 2) return {id, fail};
    await page.waitForTimeout(15000);
  }
  if (!label) return {id, err: 'timeout'};
  await page.waitForTimeout(8000);
  const r = await page.evaluate((lab) => { const b = [...document.querySelectorAll('button')].find(x => (x.getAttribute('aria-label')||'') === lab); let el = b; for (let i=0;i<8 && el;i++){ el = el.parentElement; if (el && el.querySelector('img,video')) { const m = el.querySelector('img,video'); const rc = m.getBoundingClientRect(); return {x: rc.x+rc.width/2, y: rc.y+rc.height/2}; } } return null; }, label);
  if (!r) return {id, label, err: 'tile not found'};
  await page.mouse.click(r.x, r.y); await page.waitForTimeout(5000);
  const b = await page.getByRole('button', {name: 'Tải nội dung nghe nhìn xuống'}).boundingBox();
  if (!b) return {id, label, err: 'no dl btn'};
  await page.mouse.click(b.x+b.width/2, b.y+b.height/2); await page.waitForTimeout(2000);
  const items = await page.$$eval('[role=menuitem]', a => a.map(x => { const r = x.getBoundingClientRect(); return {t: x.innerText.trim(), x: r.x+r.width/2, y: r.y+r.height/2, w: r.width}; }));
  const it = items.find(i => /720p/.test(i.t) && i.w > 0);
  if (!it) return {id, label, items: items.map(i => i.t), err: 'not a video'};
  await page.mouse.click(it.x, it.y); await page.waitForTimeout(20000);
  await page.goto('https://flow.google.com/project/__PROJECT_ID__'); await page.waitForTimeout(6000);
  return {id, label, ok: new Date().toLocaleTimeString()};
}
