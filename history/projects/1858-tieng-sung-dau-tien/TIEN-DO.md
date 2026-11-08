# Tiến độ – Tập 1 "1858 – Tiếng súng đầu tiên" (series Ngược dòng trăm năm)

Cập nhật 2026-11-07. File này để phiên Claude sau đọc và làm tiếp. Kế hoạch series: history/series/nguoc-dong-tram-nam.md

## Đã chốt với người dùng
- Kịch bản: kich-ban.md (73 câu, khoảng 4 phút; người dùng muốn 4–5 phút, KHÔNG rút gọn). Nguồn: sources.md.
- Câu 5: "Hôm nay, hãy cùng Vy ngược dòng trăm năm, đi tìm nơi mọi chuyện bắt đầu nhé." Câu kết: "Cảm ơn bạn đã cùng Vy đi qua những năm tháng ấy. Hẹn gặp lại bạn ở tập sau nhé."
- Trích dẫn (Hỏa hồng Nhật Tảo, Phan Lâm mãi quốc, câu Trương Định) do chính giọng Anh Nghĩa đọc, không dùng giọng khác.
- Giọng: Anh Nghĩa (MiniMax Vietnamese_Serene_Man) qua history/src/vibi-tts.mjs.
- Style hình: A = bán thực tế như Mưa đỏ (preset "cartoon-solemn": người tỉ lệ thật, nét mực, màu trầm), bối cảnh giữa thế kỷ 19.

## Việc người dùng giao khi đi vắng (đang làm)
1. Viết project.json (format giống projects/mua-do-thanh-co-1972/project.json): mỗi câu kịch bản = 1 scene {narration, title, image, characters}.
   Bỏ dấu ⚠ khỏi narration. Cảnh 1–2 có thể dùng lại ảnh Mưa đỏ (copy images/s001.jpg… từ project mua-do).
   Bảng màu nên đổi cho thế kỷ 19 (chàm, nâu đất, đỏ gạch, xám biển, trời vàng sẫm) thay cho màu xanh lính 1972.
2. Nhân vật tham chiếu (characters): Nguyễn Tri Phương (~58 tuổi, quan võ triều Nguyễn), Nguyễn Trung Trực (~23 tuổi, xuất thân dân chài),
   Trương Định (~42 tuổi, thủ lĩnh nghĩa quân Gò Công), lính Pháp/Tây Ban Nha 1858, quân triều Nguyễn (nón dấu).
3. Tạo project Google Flow MỚI tên "1858 – Tiếng súng đầu tiên"; cài đặt: ảnh 9:16, x1, Nano Banana 2.1, video 9:16, Lưu.
   Gen ảnh nhân vật trước, rồi ảnh cảnh (dùng flow-gen.mjs / flow-run.js / flow-collect.ps1 của project mua-do làm mẫu; sửa PROJECT URL và DIR).
4. Kiểm tra từng ảnh (sai thời đại, có chữ, cờ hiện đại…) và gen lại ảnh hỏng.
- CHỈ ảnh tĩnh (miễn phí). KHÔNG tạo clip video Veo (10 tín dụng/clip), KHÔNG tạo giọng vibi (~4.000 credits): chờ người dùng về duyệt.
- Gặp captcha / Google đăng xuất / Flow hết lượt: dừng, ghi vào mục "Trạng thái" dưới đây.

## Trạng thái (2026-11-07 19:00) – ẢNH TĨNH XONG, chờ người dùng duyệt
- [x] project.json: 73 cảnh (s001–s073, theo đúng thứ tự kịch bản, 58a–58d thành s059–s062), đã bỏ ⚠,
  style riêng thế kỷ 19 (chàm, nâu đất, đỏ gạch, xám biển, trời vàng sẫm), preset cartoon-solemn, tts manual,
  subtitles false, loudnorm -16, logo nhỏ mờ. 5 nhân vật: nguyen-tri-phuong, nguyen-trung-truc, truong-dinh,
  linh-phap, quan-trieu-nguyen. Nguồn sinh project.json: prompt từng cảnh nằm trong project.json (sửa trực tiếp ở đó).
- [x] Project Flow "1858 – Tiếng súng đầu tiên": https://flow.google.com/project/bd599a7a-e106-42ab-8785-bd163164697c
  (ảnh 9:16, x1, Nano Banana 2.1, video 9:16, xác nhận trước khi tạo = Không bao giờ).
- [x] characters/*.jpg: đủ 5 ảnh tham chiếu.
- [x] images/s001–s073.jpg: đủ 73 ảnh, TẤT CẢ gen mới trong project này (người dùng 2026-11-07: không thừa kế gì của Mưa đỏ; ảnh Mưa đỏ cũ ở images/rejected/). s002 gen lại vì lần đầu ra người châu Âu. Flow không hết lượt, không gặp captcha.
- [x] Đã soát toàn bộ (sheets/*.jpg = bảng xem nhanh). Đã gen lại 3 ảnh: s016 (vết ghép ngang), s052 (ông đồ mặc kiểu Nhật),
  s070 (người đội mũ phớt, đeo ba lô trông hiện đại). Ảnh bị loại để ở images/rejected/.
- Lưu ý để người dùng xem: s009, s038, s047 có cờ Tây Ban Nha / cờ tam tài Pháp (đúng thời 1858–1861, không phải cờ hiện đại);
  s062 cuộn chiếu chỉ có nét chữ mờ; s069 ghép tàu 1858 với Thành cổ 1972 (cảnh nối với Mưa đỏ).

## Bước tiếp theo (cần người dùng)
1. Duyệt ảnh (xem sheets/). Muốn đổi ảnh nào: sửa "image" trong project.json → `node flow-batch-build.mjs` →
   xóa images/sNNN.jpg → `node flow-gen.mjs 0 0 sNNN,...` → chạy flow-run.js qua Playwright → `flow-collect.ps1 -Ids ... -Since ...`.
2. [đang/đã làm 2026-11-07 21:45, người dùng đồng ý] Giọng Anh Nghĩa cho 73 câu: `node tts-all.mjs` → audio/sNNN.mp3 (4.343 ký tự ≈ 4.343 credits, log ở audio/tts-log.txt). Tạo lại câu nào: `node tts-all.mjs s005,s010`.
3. Nhạc nền (người dùng tự đưa vào music/), ambience mở đầu; quyết định có làm clip chuyển động (Veo tốn tín dụng) hay chỉ dùng fx/Ken Burns.
4. Render: `node src/make.mjs projects/1858-tieng-sung-dau-tien`.

## Công cụ trong thư mục này
- flow-batch-build.mjs: sinh flow-batch.json (nhân vật + cảnh) từ project.json.
- flow-gen.mjs FROM TO [ids]: sinh flow-run.js (chạy bằng browser_run_code_unsafe filename=...). Bỏ qua ảnh đã có. Gửi prompt bằng Enter + click force vì tab Flow hay bị ẩn (document hidden → click thường bị treo).
- flow-collect.ps1 -Ids ... -Since "...": chuyển ảnh tải về từ Downloads vào images/ hoặc characters/ theo thứ tự thời gian.
- sheet.sh out.jpg img...: ghép bảng xem nhanh (cần ffmpeg trong PATH).

## 2026-11-08 – Bỏ kịch bản bản 2, quay về bản 1
- Người dùng thử kịch bản bản 2 (84 câu, xoay quanh "Đánh được, sao lại mất?"), xem xong thấy không ổn, CHỌN LẠI kich-ban.md (bản 1).
- Đã xóa hết bản 2 (kich-ban-v2.md, build-v2.mjs, ảnh/giọng/render bản 2). project.json, images/, audio/, clips/, final.mp4 hiện là bản 1 (73 cảnh, đủ ảnh + giọng).
- Đừng đề xuất viết lại kịch bản kiểu bản 2 nữa trừ khi người dùng yêu cầu.
- Còn lại: nhạc nền (người dùng đưa vào music/), ambience mở đầu, thumbnail, caption.

## 2026-11-08 – Bỏ nhạc nền, dùng hiệu ứng âm thanh (sound design)
- Người dùng không dùng nhạc nền (đã xóa 6 bài ứng viên Pixabay). Thay bằng hiệu ứng: 18 file Pixabay trong sfx/ (nguồn ở sfx/NGUON.txt).
- Engine mới: src/soundscape.mjs + "soundscape" trong project.json: beds (lớp nền theo dải cảnh, tự hạ dưới giọng) + hits (tiếng điểm theo cảnh: "start" / "end" = hết giọng / số giây sau khi giọng bắt đầu). db = so với giọng.
- Đã render final.mp4 (267.5s, -15.9 LUFS) có sound design, chờ người dùng nghe. Sửa mức to/nhỏ: đổi db trong project.json rồi render lại (không tốn credit vibi).
- Còn lại: thumbnail, caption.

## 2026-11-08 – Đã duyệt âm thanh, logo, bìa
- Âm thanh: người dùng duyệt (bỏ tiếng pháo 1:14 và mọi tiếng chiêng). Logo dịch trái: brand.logoMarginX 0.06.
- Bìa: người dùng chọn E (Nguyễn Tri Phương trên đồi, thumbnail/bia-E-nguyen-tri-phuong.jpg, bản sao BIA-CHON.jpg). Nền gen riêng trên Flow (thumbnail/t02.jpg, prompt ở thumbnail/prompts.mjs; chữ bằng thumbnail/make-bia.sh).
- Caption: caption.txt (theo mẫu Mưa đỏ, thơ "Chạy giặc" của Nguyễn Đình Chiểu). Chờ người dùng duyệt.

- 2026-11-08: Caption (caption.txt) ĐÃ DUYỆT. Tập 1 hoàn tất, sẵn sàng đăng (final.mp4 + thumbnail/bia-E-nguyen-tri-phuong.jpg).
