# Tiến độ – Tập 2 "1867 – Từ Nam Kỳ đến thành Hà Nội" (series Ngược dòng trăm năm)

Kế hoạch series: history/series/nguoc-dong-tram-nam.md. Mẫu quy trình: projects/1858-tieng-sung-dau-tien/TIEN-DO.md.

## 2026-11-11
- [x] Bản nháp 1 (73 câu, đã ghi đè) → người dùng nhờ review kiểu chuyên gia sử/biên kịch → đồng ý áp toàn bộ đề xuất.
- [x] Bản nháp 2: kich-ban.md (74 câu): mở đầu bằng 3 cái chết + câu hỏi "vì sao"; Phan Thanh Giản kể hai phía + hỏi khán giả;
  thêm Phan Liêm/Phan Tôn dấy binh, nghịch lý 7.000 quân vs 200 lính, giờ tối hậu thư 1882; bỏ "hắn", "giặc" chỉ theo góc nhìn nhân vật;
  gỡ lặp "Nhưng…"/"quyết"; kết quay lại 3 người.
- [x] 2026-11-12 người dùng sửa từng câu (nối tập 1, cớ vụ Đuy-puy, Hiệp ước Giáp Tuất, Cầu Giấy cụ thể, kết "giữ trọn khí tiết",
  câu nhử tập 3 về cậu bé 13 tuổi "ở lại, hay ra đi") → **KỊCH BẢN ĐÃ CHỐT**: 75 câu, 5.778 ký tự (giọng Tuấn Anh ≈ 2.900 credit).
  Người dùng thích câu văn gần gũi, mượt, có điểm "wow", không cụt lủn; không dùng "không ăn" (dùng "tuyệt thực").
- [x] project.json: sinh bằng `node build-project.mjs` (lời + chữ lớn lấy từ kich-ban.md, prompt ảnh + 9 nhân vật nằm trong build-project.mjs).
  `node flow-batch-build.mjs` → flow-batch.json + characters/prompts.txt. flow-gen.mjs còn PROJECT = 'FLOW_PROJECT_URL' (điền khi tạo project Flow).
- **Phạm vi người dùng giao (2026-11-12):** ảnh → soát ảnh → giọng (hỏi trước) → bản đồ động → render. KHÔNG làm âm thanh/SFX,
  ảnh bìa + caption, đăng bài cho đến khi người dùng bảo.
- [~] Flow project: https://flow.google.com/project/55fe131c-f3aa-43d4-ad8b-57de2bcedb80 (cài đặt xong). characters/ đủ 9.
  images/: s001–s025, s027–s039 xong; s026 bị loại (tàu Mississippi) → gen lại; còn s040–s075.
  GOTCHA 2026-11-12: Flow chỉ cho ~13–14 ảnh liên tục rồi báo "Đã xảy ra lỗi. Hãy thử lại." với MỌI prompt; nghỉ ~20–40 phút mới chạy tiếp.
  Lệnh: `node flow-gen.mjs 0 0 s040,...` → chạy flow-run.js qua browser_run_code_unsafe → `flow-collect.ps1 -Ids ... -Since (Get-Content .since)`.
- [x] Bản đồ động: layers.py thêm head "arrow", icon ship/banner (vẽ sẵn, hoặc ảnh), target (vòng nhấp nháy). s008 dùng layers/s008.json (khai báo trong EXTRA của build-project.mjs).
- 03:16 12/11: Flow gần như hết lượt (40 phút chờ chỉ ra 1 ảnh). Có 39/75 ảnh (s001–s025, s027–s040).
  Kế hoạch đêm: thử Flow mỗi 30 phút; hạn 07:30 12/11 → render bản NHÁP (cảnh thiếu tạm dùng ảnh cảnh trước), ghi tiến độ, tắt máy.
- [ ] (cũ) Project Flow mới "1867 – Từ Nam Kỳ đến thành Hà Nội" → ảnh nhân vật (Phan Thanh Giản, Nguyễn Trung Trực, Nguyễn Tri Phương, Hoàng Diệu, lính Pháp 1870–1880, quân Cờ Đen) → ảnh cảnh
- [~] Giọng Tuấn Anh: người dùng cho chạy không cần hỏi (2026-11-12). `node tts-all.mjs` → audio/sNNN.mp3, log audio/tts-log.txt (~2.900 credit).
- [ ] Cảnh bản đồ: layers + path (thêm icon / target / arrow vào layers.py). Người dùng (2026-11-12): làm luôn, KHÔNG cần hỏi/duyệt khung thử.
- [ ] Sound design, render, thumbnail, caption

## 2026-11-12 07:23 – XONG BƯỚC 1–5
- Ảnh: đủ 75/75 + 9 nhân vật (sheets/batch1..5.jpg, last.jpg). Đã gen lại: s026 (tàu Mississippi → thuyền buồm), s059 (lâu đài gothic),
  s063 + s066 (Cột cờ kiểu châu Âu → tháp lục giác 3 tầng đế), s075 (người đội mũ phớt → không người). Ảnh loại ở images/rejected/.
- Giọng Tuấn Anh: 75 câu, 2.871 credit.
- Bản đồ động: s008 (layers/s008.json).
- Render: final.mp4 = 335.3s (5:35), -16.0 LUFS, chưa có SFX/nhạc (người dùng hoãn), không phụ đề, logo nhỏ mờ.
- CHỜ người dùng xem final.mp4. Còn hoãn: âm thanh, ảnh bìa + caption, đăng bài.
- (Đã xoá 2026-11-12) thư mục history/projects/_test2 (lệnh xóa bị chặn vì đang là thư mục làm việc).

## 2026-11-12 (chiều) – style mới
- Người dùng đưa video mẫu thứ 2 → học thành history/styles/ke-chuyen-cuon-hut.md.
- Đã hỏi có áp style mới cho tập 1867 không (3 mức: nhẹ = khoảng lặng + chữ hỏi lớn; vừa = sửa ~10–15 câu + ~30 ảnh; làm lại toàn bộ).
  Người dùng: "hiện tại chưa cần làm" → giữ nguyên tập 1867. Áp dụng từ tập 3, hoặc khi người dùng bảo.
- [x] 14:59 ngắt nhịp theo video mẫu: engine thêm `pauseAfter` + project `pace.pad 0.3`; 15 khoảng lặng 1–2s (PAUSE trong build-project.mjs).
  Render lại: final.mp4 = 367.3s (6:07), -16.0 LUFS. Bản cũ: final-truoc-ngat-nhip.mp4 (335s). Giọng/ảnh/kịch bản không đổi, 0 credit.
  → Người dùng nghe xong: "bản cũ vẫn hay hơn" → ĐÃ KHÔI PHỤC final.mp4 (335.3s), project.json và build-project.mjs như cũ.
- [~] 2026-11-12 người dùng review bản 5:35 (CHƯA render lại, gom góp ý rồi render 1 lần):
  - s006 chữ lớn "NGƯỢC DÒNG TRĂM NĂM" → "TỪ NAM KỲ ĐẾN THÀNH HÀ NỘI" (kich-ban.md).
  - s017 (1:15) ảnh cũ bị cắt ngang đầu (images/rejected/s017-cat-dau.jpg) → gen lại có mặt Phan Thanh Giản bên chén thuốc, ánh nến.
  - Giọng "hơi nhanh, chưa nhấn nhá" → thử 4 bản (voice-test/, 502 credit). Người dùng chọn A: giữ giọng cũ, làm chậm 8% (ffmpeg atempo=0.92).
    Đã áp cho 75 câu: audio/sNNN.mp3 (bản gốc ở audio/goc-toc-do-1/). Tổng giọng 321,6s → 348,5s.
  - 1:43 (s023) chữ cuối "dân" bị nuốt → đọc lại 3 lần (108 credit), dùng take1 (Whisper nghe rõ "dân"), đã làm chậm 8%. Bản cũ: audio/rejected/.
  - 3:07 (s043) ảnh cũ 2 phe cùng nhìn 1 hướng (images/rejected/s043-cung-huong.jpg) → gen lại: quân ta trên mặt thành bắn xuống, lính Pháp tiền cảnh quay lưng bắn lên, tàu chiến trên sông.
  - 3:25 (s046) ảnh cũ lính Pháp như đang đỡ/giúp (images/rejected/s046-giong-giup-do.jpg) → gen lại: 2 lính ghì tay bắt quỳ, 1 lính chĩa lưỡi lê, kiếm văng xuống đất.
  - Âm thanh giống video mẫu: nhạc Pixabay em-A (pizzicato) / căng-A (trận đánh) ghép sẵn theo cảnh → music/bgm-1867.wav (script ghép: tính từ timeline),
    tắt nhạc + tiếng "bùm" (sfx/boomfar) ở s017, s035, s048, s065. Nhạc thấp hơn giọng 18,7 dB (mẫu 19,2).
  - 15:59 RENDER: final.mp4 = 362.5s (6:03), -16.1 LUFS, gồm 6 sửa đổi + nhạc. Bản trước: final-ban-cu.mp4. CHỜ người dùng xem.
  - Người dùng bỏ hết nhạc em/căng + tiếng bùm → dùng 1 bài Pixabay "Historical History Documentary Music" (music/historical-documentary.mp3, 204s), ghép 2 lần crossfade 3s, đoạn kết trùng cuối video → music/bgm-1867.wav. Nhạc cũ ở music/cu/.
  - 16:21 RENDER: final.mp4 = 362.5s, -16.1 LUFS, nhạc documentary thấp hơn giọng 14,7 dB. CHỜ người dùng xem.
  - Người dùng bỏ giọng chậm 8% (audio/ trả về goc-toc-do-1), ẩn chữ "NHỔ HẾT CỎ" (s034). Sửa ngắt nhịp: tts-ngat-nhip.txt (chỉ đổi dấu câu). Thử turbo vs v3 (voice-test/NGHE-*.mp3) → người dùng chọn v3. Đang đọc lại 75 câu → audio-v3/ (log.txt), rồi thay vào audio/ và render.
  - 17:42 RENDER giọng v3 + ngắt nhịp mới: final.mp4 = 340.2s (5:40). Giọng turbo cũ ở audio/turbo-goc/. Nhạc: bash src/build-bgm.sh <giây> projects/1867-tu-nam-ky-den-thanh-ha-noi/music/bgm-1867.wav (đã dựng lại cho 340.17s). CHỜ người dùng xem.
  - Dọn file thử (người dùng đồng ý): xoá voice-test/, audio-v3/*.mp3, audio/goc-toc-do-1, audio/rejected, music/cu, final-ban-cu.mp4. Giữ audio-v3/txt + log.txt, audio/turbo-goc (giọng turbo cũ).
  - Dọn repo (người dùng đồng ý): xoá videos-test, soundscape.wav, music/historical-documentary.mp3 (bản chung ở history/assets/music) và music/build-bgm.sh (thay bằng src/build-bgm.sh).
  - Caption CHỐT (caption.txt, kiểu mới: hỏi người xem + gạch đầu dòng). Bìa: 3 nền gen Flow (thumbnail/t01-t03, prompt ở thumbnail/prompts.mjs), chữ bằng thumbnail/make-bia.sh → bia-A/B/C. CHỜ người dùng chọn bìa.
  - Bìa CHỐT: F1 (nền t06 thanh gươm + khăn đóng trên bậc Võ Miếu, chữ 1867 – 1882 / BA CÁI CHẾT / MỘT LỰA CHỌN) → thumbnail/BIA-CHON.jpg. Tập 2 sẵn sàng đăng: final.mp4 + BIA-CHON.jpg + caption.txt.
  - 18:37 Người dùng tự đăng/hẹn giờ trên Facebook (19:00 12/11/2026). Đã xoá bìa thử (giữ BIA-CHON.jpg, t06.jpg). TẬP 2 HOÀN TẤT.
