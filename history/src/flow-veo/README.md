# Tạo clip Veo trong Google Flow (Playwright MCP, chế độ extension)

Dùng cho bước ảnh → clip Veo của một tập (đã chạy được ở tập 1885, 2026-11-15).

Chuẩn bị:
1. Thư mục phục vụ `$SP/up/` chứa: `veo2-sNNN.jpg` (ảnh gốc, bản CHƯA chèn chữ nếu có bảng tên), `prompts.json` (= `<project>/videos/v2/veo-prompts.json`), `id.txt` (id cảnh đang làm, vd `s027`), `old.txt` (nhãn ô mới nhất trên Flow trước khi gửi, chỉ cần khi KHÔNG tải ảnh mới lên).
2. `python -I cors_srv.py "$SP/up"` chạy nền (cổng 8765). Extension không cho chọn file, nên ảnh được lấy qua server này.
3. Chép các file `veo2-*.js` vào `<repo>/.playwright-mcp/` (MCP chỉ đọc file trong workspace).

Mỗi cảnh (CHẠY TỪNG BƯỚC, mỗi bước một lần gọi MCP):
1. `browser_run_code_unsafe` filename `.playwright-mcp/veo2-prep.js`: nạp ảnh, chặn hộp chọn file.
2. `browser_take_screenshot`: BẮT BUỘC. Tab nền không chạy animation, nên menu "+" chỉ mở được sau khi chụp màn hình.
3. `veo2-menu.js`: "+" → "Tải lên" (kiểm ô `veo2-sNNN.jpg` xuất hiện). Nếu URL thành `/edit/…` thì navigate về trang project.
4. `veo2-go.js`: "+" thành phần → tìm `veo2-sNNN` → "Thêm vào câu lệnh" → dán prompt → Enter.
5. `veo2-dl.js`: chờ ô video mới (~1,5 phút), tải 720p (về Downloads).
6. `P=<project> SP=<served dir> bash collect.sh sNNN sNNN-tiep`: chuyển file mới nhất trong Downloads → `videos/v2/sNNN-veo.mp4`, đặt id kế tiếp.

Sau đó soát từng clip (khung ở 0, 1/3, 2/3, cuối đoạn dùng) rồi chép sang `videos/sNNN.mp4`.
