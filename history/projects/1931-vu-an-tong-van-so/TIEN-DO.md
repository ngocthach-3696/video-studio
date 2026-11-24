# Tiến độ – Loạt Bác Hồ, Tập 2: vụ án Tống Văn Sơ (1924–1933)

- [x] 2026-11-22 Người dùng chọn góc B (khung mẫu 7): mở bằng cảnh bắt người rạng sáng 6/6/1931 ở phố Tam Kung → lộ danh tính → gỡ lý do dễ đoán → câu hỏi trung tâm; ẩn dụ cửa trước (dẫn độ) / cửa sau (trục xuất ghi tên con tàu).
- Phải trả câu móc của tập 1911: "Chen Vang sẽ đi đâu, và vì sao chín năm sau, lại có tin Người đã chết?"
- Không kể lại 1911–1923 (tập 1 đã kể); 1924–1930 chỉ lướt (Lý Thụy, Thầu Chín, án tử 1929). Xưng "Người" như tập 1.
- Tạm mặc định (chưa hỏi lại): ~6 phút; kết = câu móc tập sau + "Vy hẹn bạn ở tập sau nhé". Nhạc: CHƯA chọn.
- [ ] Nghiên cứu → sources.md (trợ lý đang tra web → sources-web.md)
- [ ] Dàn ý + kịch bản → người dùng duyệt
- [x] 2026-11-22 sources.md (trợ lý tra web: Gunn APJJF 2022, HK Memory, Wikipedia…; ⚖️ ngày án tử, £250, ai tung tin chết). Không dùng: Lâm Đức Thụ chỉ điểm vụ 1931, lễ truy điệu Mát-xcơ-va, "xóa dòng tên tàu" (chỉ là: không tàu Pháp, không đất Pháp), "một mình" ở Hạ Môn (có thư ký đi cùng).
- [x] kich-ban.md bản nháp 2 (đã sửa theo nguồn). CHỜ người dùng duyệt.
- 2026-11-22 Câu kết đổi: "Hẹn gặp lại bạn ở chặng đường tiếp theo của Người." (bỏ câu cố định "Vy hẹn bạn ở tập sau nhé"). Người dùng: KHÔNG viết lại các câu sát mẫu 7, giữ nguyên bản nháp 2 ("cứ để nguyên như vậy"). Chưa nói "chốt" cả bản.
- [x] 2026-11-22 ~00:55 NGƯỜI DÙNG CHỐT kịch bản ("ok chốt kịch bản"); nhạc nền chốt sau.
- [x] tts-ngat-nhip.txt: 97 dòng, 6.302 ký tự (~6.300 credit eleven_v3). Số dư vibi 60.129. CHỜ người dùng đồng ý chạy TTS.
- [x] Flow project: https://flow.google.com/project/815cd640-2113-4302-821a-5495300f6dd5 ("1931 – Vụ án Tống Văn Sơ"; 9:16, x1, Nano Banana 2.1). Script: .playwright-mcp/open-picker.js (bước 1) + gen-img.js (bước 2, job từ http://127.0.0.1:8765/job.json, server scratchpad/cors_srv.py) + take.sh (gom file, xếp job kế). LƯU Ý: tab Flow phải đang HIỂN THỊ (document hidden → nút "+" không mở).
- [x] Nhân vật (characters/, bảng so-sanh-nhan-vat.jpg): tong-van-so (mặt bản B tập 1911, gầy hơn, áo dài Hoa xanh đậm), ly-thuy, thau-chin, loseby (ảnh thật 1960 blog FCDO, vẽ trẻ lại), ba-loseby, mat-tham (Sûreté Hà Nội). CÒN: canh-sat-anh, canh-sat-an, ly-phuong-thuan. CHỜ người dùng duyệt.
- [x] 01:37 Đủ 9 nhân vật (+ canh-sat-anh, canh-sat-an, ly-phuong-thuan; bảng so-sanh-nhan-vat-2.jpg). CHỜ người dùng duyệt.
- Mẹo: khi tab Flow báo document hidden (Chrome bị che) → MCP browser_tabs new cùng URL rồi đóng tab cũ, tab mới hiện ra; open-picker.js không cần nữa.
- [x] 2026-11-22 01:45–11:09 ĐỦ 97/97 ảnh cảnh (Flow, batch.js + lot.sh; gốc ở images/_goc-chua-giam, ảnh dùng đã giảm bão hòa 0.85). Làm lại trong lúc chạy: s003 (khăn quấn đầu), s016 (có râu), s045 (chép người trong ảnh mẫu style) → ảnh loại ở images/_loai/. Prompt chung thêm: đầu trần, không râu trừ khi ghi rõ, không chép nội dung ảnh mẫu style.
- Bảng duyệt: bang-anh-01-48.jpg, bang-anh-49-97.jpg. Cần người dùng quyết: s081 (Bác quay lưng, không thấy mặt), s087 (nhìn nghiêng sau), s001 (cảnh sát áo xanh, các cảnh sau kaki), s005 (mật thám mặc kaki), s037 (cầu thang nhìn từ trên khó hiểu), s042/s046/s047 (hoa anh đào lạc cảnh), s061 (mặt nạ tuồng Hoa), s097 (Bác 1941 có râu, chưa giống lắm).
- CHỜ: người dùng duyệt ảnh; đồng ý chạy TTS (~6.300 credit); chọn nhạc.
- [x] 11:26 Làm lại theo người dùng: s037 (cầu thang nhìn ngang), s042/s046/s047 (bỏ hoa anh đào). So sánh: so-sanh-lam-lai-1.jpg. Lưu ý: 1 file tải về bị thiếu làm lệch tên → lot.sh collect giờ dừng nếu thiếu file.
- 11:30 Người dùng đang review ảnh (bảng duyệt đã cập nhật bản mới). Chưa TTS, chưa nhạc.
- QUY TẮC TẬP NÀY (người dùng 2026-11-22): KHÔNG có cảnh sát người Ấn (Sikh) ở bất kỳ ảnh nào; mọi cảnh sát Hồng Kông là người Anh (đồng phục kaki). Áp dụng cho cả ảnh phụ, ảnh bìa về sau. Khi sửa: thay nhân vật canh-sat-an bằng cảnh sát Anh thứ hai, bỏ 'Sikh constable' khỏi COURT trong build-project.mjs.

## 2026-11-22 – Sửa ảnh sau review (xong 14/14)
- Đã làm lại: s001 s002 s003 s021 s027 s037 s038 s053 (sheets/sua-1.jpg), s056 s058 s063 s067 s082 s097 (sheets/sua-2.jpg). Bản cũ: images/_loai/*-truoc-sua.jpg.
- s097: Bác mặc áo chàm kiểu Nùng, mặt theo ảnh 1946; chữ "CAO BẰNG / 1941" chèn lên bảng gỗ (Alegreya SC Bold, nắn phối cảnh), ảnh chưa chữ ở images/_goc-chua-chu/s097.jpg.
- Tiếp theo: chờ người dùng duyệt ảnh → TTS (~6.300 credit) → nhạc nền.
- s063 làm lại lần 2 (bản trước có cửa dưới bàn thẩm phán, cất ở images/_loai/s063-loi-cua.jpg); prompt thêm "bench = one solid panel, no door".
- s097: chữ bảng gỗ to + nét hơn (vẽ chữ ở 4x rồi thu nhỏ lanczos), sheets/s097-bang-chu.png.
- 2026-11-22 TTS xong (tts-v3.sh, Tuấn Anh eleven_v3 stab 0.5): 97 clip trong audio/ (các bản thử ở audio-v3/), tổng giọng 372 s (6:12). vibi 60.129 → 51.487 (−8.642, do đọc lại câu điểm thấp). 16 câu Whisper < 0.85 đều đủ lời, chữ cuối đủ, lặng cuối 0,17–0,39 s; lệch do tên riêng (Hong Kong, Paris, Victoria, Loseby…). File nghe: NGHE-cau-diem-thap.mp3. Chờ người dùng nghe.
- 2026-11-22 Clip Omni (Omni 1.2 Flash, 4 s, 12 credit): 13 cảnh đã chốt s001 s002 s003 s006 s009 s010 s011 | s027 s046 s058 s070 | s088 s097 (s097 nối 3 clip từ khung cuối). Prompt: videos/v2/omni-prompts.json. Trước MỖI clip trình bày kế hoạch, chờ ok.
- s001: bản 1 bước tại chỗ (loại), bản 2 videos/v2/s001-omni.mp4 dùng. Người dùng chọn TỐC ĐỘ GỐC (không làm chậm); câu dài hơn clip thì cắt sang cảnh sau sớm, xem lại khi render.
- Đã tiêu: TTS 8.642 credit vibi; Flow 24 credit (s001 ×2).
- 15:22 Xong 12 clip Omni: videos/v2/sNNN-omni.mp4 (s001 s002 s003 s006 s009 s010 s011 s027 s046 s058 s070 s088). Xem chung: XEM-12-clip.mp4. Flow ~156 credit.
- s097: Flow TỪ CHỐI ("vi phạm chính sách … người nổi tiếng", ảnh Bác 1941 quá giống ảnh thật). Không lách bộ lọc. Chờ người dùng chọn cách thay.
- Script: .playwright-mcp/omni-batch-1931.js (danh sách id ở up/omni-ids.json); tải lại trang trước khi bấm ô video mới nhất (trước đó hay tải nhầm clip cũ); dl-by-title.js tải theo tên clip.
- s097: người dùng chọn GIỮ ẢNH TĨNH (camera đẩy chậm), không clip. Tổng 12 clip.
- Bản đồ động (layers.py, miễn phí): layers/s008.json (Hồng Kông → Hải Phòng, tàu + vòng đích), layers/s076.json (X đỏ lên Đông Dương, 3 mũi tên chàm từ Hồng Kông đi Hạ Môn / Thượng Hải / Xin-ga-po). Nền sạch: layers/map-s008.jpg, map-s076.jpg (Flow). Xem: XEM-ban-do-s008.mp4, XEM-ban-do-s076.mp4. Chờ duyệt.
- 15:51 final.mp4 bản xem trước đầy đủ: 389,7 s (6:30), 166,7 MB; 12 clip Omni (tốc độ gốc, engine mới project.clipSpeed "original": cắt sớm s001 −0,70 s, s002 −0,73, s011 −0,37, s046 −0,30, s058 −0,30, s070 −0,70, s088 −0,13), 2 bản đồ động, 14 camera nhấn, nhạc bài 4 Cinematic (music/bgm.wav 389,7 s).
  Soát: hình 389,70 = tiếng 389,63; 0 khoảng hở tiếng; −15,9 LUFS; logo đủ ở 20 điểm vào/ra clip (10 khung/điểm, sheets/kiem-logo.jpg); khung 6 s/lần sheets/kiem-final.jpg; Whisper 5 đoạn (0, 95, 200, 300, 375 s) đủ lời. Chưa đo riêng mức nhạc so với giọng.
- 19:23 Sửa sau bản xem trước: kịch bản (chữ lớn câu 1; câu 16,17,18,23,24,56,59,60,70,91,95,96; bỏ câu 78 = s079). Lưu ý: từ câu 36 trở đi số cảnh = số câu + 1 (có câu 35b). Ảnh mới s092 (gạch dòng có con tàu) và s096 (bàn mật thám, tờ cáo phó, nến) — ảnh cũ ở images/_loai/. Chưa đọc giọng lại, chưa render.
- 19:41 Bản 2 final.mp4 (bản 1 giữ ở final-ban1.mp4): đọc lại 12 câu (s016 s017(t3) s018 s023 s024 s057 s060 s061 s071 s092 s096 s097, ~950 credit), bỏ s079, ảnh mới s092/s096, chữ lớn s001 'HỒNG KÔNG · 6.6.1931' (titleSize 88, 1 dòng), nhạc dựng lại 390,3 s. Soát: hình 390,33 = tiếng 390,27; 0 hở tiếng; -16,0 LUFS; logo đủ ở 19 điểm cắt clip (sheets/kiem-logo-2.jpg); contact sheet kiem-final-2.jpg; Whisper 8 đoạn câu mới đủ lời.
- 2026-11-24 23:10 Bản 3 final.mp4 (bản 2 giữ ở final-ban2.mp4): đổi nhạc sang bài 2 "Documentary" NastelBom (assets/music/documentary-nastelbom.mp3, 111 s, ghép 4 lần crossfade 3 s; build-bgm.sh thêm nhánh N lần), musicVolume 1 → 1.3 (nhạc to hơn ~1,8 dB, ≈12 dB dưới giọng). Bgm cũ: music/bgm-cinematic-cu.wav. Soát: hình 390,33 = tiếng 390,27; 0 hở tiếng; −15,9 LUFS.
- 2026-11-24 23:35 Bìa: chữ người dùng chốt "VỤ ÁN / “TỐNG VĂN SƠ”" + câu phụ tập 1911 "Hành trình hy vọng / của người thanh niên yêu nước.". 3 nền Flow (thumbnail/nen-prompts.json; gốc nen-N-goc.jpg, sạch nen-N-sach.jpg = vá dấu ✦ bằng inpaint + bão hòa 0.85): 1 song sắt nhà tù, 2 cầu thang + 2 cảnh sát Anh, 3 phòng xử án + luật sư. thumbnail/BIA-1..3.png, SO-SANH-3-BIA.jpg (bia.html + mk-bia.cjs). Chờ người dùng chọn.
- 2026-11-24 23:45 CHỐT bìa: BIA-2 (cầu thang + 2 cảnh sát Anh) → thumbnail/BIA-CHON.png (+ .jpg). Còn: caption.
- 2026-11-24 23:55 CHỐT caption (bản 3, bỏ câu 'Cùng Vy…'): caption.txt. Tập xong: final.mp4 + thumbnail/BIA-CHON + caption. Còn tùy người dùng: đăng FB (bật nhãn AI), dọn file.
- 2026-11-25 DỌN DẸP (người dùng ok): 1,4 GB → 332 MB. Xoá clips/, audio-v3/, sheets/, images/_loai, characters/_loai, layers/_loai + test mp4, video.mp4, final-ban1/2, final-audio/veo-audio/narration.wav, subs.ass, NGHE/XEM, bang-anh, render-log, nhạc nghe thử + bgm cũ, s001-omni-v1, bìa/nền không chọn. Giữ: final.mp4, images/ (+ _goc-chua-giam, _goc-chua-chu), videos/ (12 clip + v2 nguồn + prompts), audio/, music/bgm.wav, characters/, layers/, kịch bản, TTS, project/build, scripts, thumbnail/BIA-CHON + nen-2 + bia.html/mk-bia.cjs, caption.txt.
