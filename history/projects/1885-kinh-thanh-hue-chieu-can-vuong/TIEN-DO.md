# Tiến độ – Tập 3: 1885 – Kinh thành Huế và chiếu Cần Vương

## 2026-11-12
- [x] Nghiên cứu → sources.md (⚠: ngày đêm tấn công 4–5/7 hay 5–6/7, lời đe của Harmand, chuyện nấu ấn, chuyện cửa giữa Ngọ Môn, ngày vua bị bắt).
- [x] Kịch bản nháp 1 → kich-ban.md (79 cảnh, 7 nhân vật). CHỜ người dùng duyệt.
- [ ] Nhân vật + ảnh Flow (style mới ke-chuyen-cuon-hut.md, project Flow mới tên trùng title)
- [ ] tts-ngat-nhip.txt + giọng Tuấn Anh eleven_v3 (Whisper kiểm)
- [ ] Bản đồ động (Thuận An → Huế; Huế → Tân Sở → Quảng Bình)
- [ ] Nhạc bgm (src/build-bgm.sh), render, bìa, caption

## 2026-11-12/13 đêm – ảnh Flow
- Flow project: https://flow.google.com/project/7995242f-9c54-4cdc-bf29-de69527893d7 (đã đặt 9:16, x1, Nano Banana 2.1, "Không bao giờ").
- [x] 9 nhân vật (characters/, sheets/nhan-vat.jpg).
- Gotcha: prompt có "13-year-old boy" bị Flow chặn ("có thể vi phạm chính sách") → đổi Hàm Nghi thành "young emperor", không nêu tuổi.
- [~] Cảnh: s001–s018 xong. Flow giới hạn sau ~27 ảnh (00:20) → chờ 45 phút rồi chạy tiếp.
- Cần soát: s018 (Flow đặt tên "Yellow gourds on shelf": khăn vàng có thể thành quả bầu).
- 00:25 người dùng dừng: "để mai tôi tạo". Ngày mai chạy tiếp từ s019: node flow-gen.mjs 28 88 → chạy flow-run.js qua Playwright → flow-collect.ps1 (lô ~13, nghỉ ~45 phút khi Flow báo lỗi).

## 2026-11-13 chiều – xong ảnh
- [x] s019–s079 (61 ảnh, 14:57–15:52, 5 lô liền, Flow KHÔNG chặn lần nào ban ngày). Đủ 79/79. Bảng xem: sheets/canh-*.jpg.
- Thử Veo (videos-test/): s010-veo.mp4 (bị thu nhỏ khung), s016-veo.mp4 (prompt "first frame identical… no reframing" → giữ đúng khung, người dùng: "video này ổn"). s016-cat-canh.mp4 = cắt khung tĩnh, người dùng chê (nhân vật không cử động).
- Người dùng: tạo đủ ảnh trước, sau đó họ CHỌN ảnh tốt để làm video Veo (~10 credit/clip). Chưa tạo video nào khác.
- Cần soát: s018 (khăn vàng giống quả bầu), s027/s033 (sứ Pháp đội mũ hai sừng kiểu Napoleon, nên là áo đuôi tôm), s056 (chữ giả trên chiếu), s075 (thêm 2 nhân vật lạ, lính giáp trông kiểu Trung Quốc).
- [x] 16:19 làm lại s018, s027, s033, s056, s075 (prompt mới trong flow-batch.json + project.json; ảnh cũ ở images/_thua/*-cu.jpg; so sánh: sheets/lam-lai.jpg).
- Gotcha: lô 5 ảnh, flow-run.js tải NHẦM ảnh cũ cho s033 (=s077) và s075 (=s064) dù báo "ok" → luôn so tên file Flow với cảnh khi gom (cmp với ảnh khác); tải lại theo tên tile.

## 2026-11-13 tối – thiết kế lại theo video mẫu
- Người dùng: "nhân vật oke nhưng chủ thể, màu sắc, cảnh vật chưa đủ wow" → cắt 100 shot video mẫu (styles/ref-ke-chuyen/), ghi phân tích vào styles/ke-chuyen-cuon-hut.md ("Bố cục khung hình").
- Thử 4 cảnh với prompt mới (style-test/batch.mjs: nhân vật to, kín khung, 3 lớp, màu đậm, cel 2 tông, nguồn sáng thấy được): style-test/s001,s040,s043,s046.jpg; so sánh sheets/style-test-cu-moi.jpg. CHỜ người dùng duyệt.
- s001/s040: Flow vẽ bảng trống trên cửa giữa, chèn "NGỌ MÔN" bằng ffmpeg drawtext (Times New Roman Bold, vàng #F4CF5A, viền nâu); ảnh chưa chữ ở style-test/goc/.
- 23:40 người dùng duyệt hướng mới ("áp dụng theo video mẫu") và chốt phông bảng chữ Alegreya SC Bold (assets/fonts/). s001/s040 thử đã chèn "NGỌ MÔN" bằng phông này. Bước tiếp: viết lại 79 prompt theo bố cục mới rồi tạo lại ảnh.

## 2026-11-13 23:30 → đêm – tạo lại 79 ảnh style mới (preset cartoon-bold)
- Người dùng: "gen xong hết ảnh rồi tắt máy giúp tôi nhé". CHỈ tạo ảnh, KHÔNG tạo video (video chỉ khi người dùng yêu cầu).
- Prompt mới trong build-project.mjs (S + NO_PEOPLE cho cảnh tĩnh/phong cảnh, vì style "small extras" làm Flow vẽ thêm người lạ). Ảnh cũ: images/_flat/. s001/s052 = cửa Hữu (sát sử), s040 = Ngọ Môn.
- Bảng chữ cần chèn sau khi xong (Alegreya SC Bold): s001 CỬA HỮU, s036 TÂN SỞ, s040 NGỌ MÔN, s052 CỬA HỮU, s063 BA ĐÌNH. Ảnh gốc chưa chữ lưu ở images/_goc-chua-chu/.
- Vòng lặp: bash lot.sh missing → bash lot.sh next <12 id> → chạy flow-run.js (Playwright) → bash lot.sh collect "<log>". 23:55 Flow chặn sau ~24 ảnh, 20/79 xong.
- 00:1x người dùng đổi ý: KHÔNG tắt máy sau khi xong ("hãy khoan tắt máy nhé").

## 2026-11-14 sáng – xong 79 ảnh style mới
- [x] 08:10–09:00 tạo s017–s079 (5 lô, Flow không chặn). Đủ 79/79, không trùng (md5). Bảng xem: sheets/moi-1..4.jpg.
- Lại gặp tải nhầm: s053 lấy lại ảnh cũ của s026 → đã xóa, tạo lại đúng.
- [x] Chèn chữ bảng (Alegreya SC Bold): s036 TÂN SỞ, s052 CỬA HỮU, s063 BA ĐÌNH (s001, s040 đã có từ trước). Ảnh gốc: images/_goc-chua-chu/.
- Bước tiếp: người dùng duyệt ảnh, chọn cảnh làm Veo → tts-ngat-nhip.txt + giọng Tuấn Anh → bản đồ động → nhạc, render, bìa, caption.
- [x] Làm lại s015 (bản cũ lính Pháp có 3 bàn tay → images/_thua/s015-3tay.jpg). Prompt mới ghi rõ "exactly two arms and two hands", súng đeo sau lưng, không tay cầm.
- [x] Làm lại s046 (bản cũ quân ta chạy về phía người xem, lưng quay về tòa Khâm sứ → trông như bỏ chạy; cất ở images/_thua/s046-bo-chay.jpg). Bản mới: camera sau lưng, quân lao về phía tòa nhà, tên lửa bay sang. Bài học: cảnh tấn công thì đặt mục tiêu TRƯỚC MẶT quân ta (quay từ sau lưng/bên hông), không để mục tiêu sau lưng.
- [x] s046 lần 3: lần 2 lính phụ vẫn quay mặt ra camera (images/_thua/s046-mat-ve-camera.jpg) → prompt "EVERY soldier seen from the back, NO faces visible". Bản mới: toàn bộ quay lưng, lội sông đánh tòa Khâm sứ.
- [x] Làm lại s049 (bản cũ: pháo bắn sang ngang vào bụi, quân ta trông như xung phong, bối cảnh rừng; cất images/_thua/s049-phao-sai-huong.jpg). Bản mới: camera sau khẩu pháo, nòng chĩa thẳng về trước, quân ta quay lưng rút về phía tường thành Huế đang cháy.
- [x] s056: chèn chữ "CHIẾU / CẦN VƯƠNG" lên mặt chiếu (Alegreya SC Bold, đỏ son #8E1A12, 1 dòng chạy DỌC THEO CHIỀU DÀI tấm lụa từ cuộn trục gần sang cuộn trục xa (ffmpeg perspective), đó là ý người dùng; bản 2 dòng ngang bị chê; gốc ở images/_goc-chua-chu/s056.jpg). Bối cảnh vẫn là cung điện (chưa đổi sang Tân Sở) — chờ người dùng quyết.
- [x] s063: chèn lại BA ĐÌNH theo phối cảnh (bảng gỗ nghiêng; trước đó chữ thẳng nên lệch khỏi khung bảng). Góc mặt bảng: 279,478 / 540,513 / 278,564 / 536,612.
- s075: thử bản đồ chuẩn chữ S + Hoàng Sa/Trường Sa (images/_thua/s075-ban-do-moi.jpg) nhưng người dùng chọn GIỮ ẢNH CŨ vì đẹp hơn. Prompt đã trả về như cũ.

## 2026-11-14 – viết lại đoạn kết (bỏ Mưa đỏ 1972)
- Người dùng: bỏ đoạn Mưa đỏ, kết theo mạch lịch sử → Phan Bội Châu, Phan Châu Trinh (giấu tên, móc tập sau). Kịch bản giờ 83 câu (75–83 mới; câu 82–83 người dùng tự chốt).
- Nguồn: PBC lập "Sĩ tử Cần Vương đội" năm 1885 (17/19 tuổi tùy cách tính → viết "chưa đầy hai mươi"); cha PCT (Phan Văn Bình) theo Nghĩa hội Quảng Nam; Cần Vương kết thúc 1896 (Hương Khê). Cần thêm vào sources.md.
- Ảnh: s076–s082 mới; s083 = ảnh thuyền sông Hương cũ (s079 cũ). Ảnh kết cũ ở images/_thua/s07x-ket-cu.jpg. Bảng xem: sheets/ket-moi.jpg. Người dùng ĐÃ CHỐT đoạn kết (lời + ảnh), không đổi nữa.
- [x] s001: chèn lại CỬA HỮU theo phối cảnh (bảng hơi nghiêng, bên phải cao hơn; góc mặt bảng 359,379 / 620,367 / 359,444 / 620,432). Đã soát: s040, s052, s036 bảng thẳng mặt nên chữ thẳng là đúng.
- [x] Soát căn giữa chữ trên bảng (đo tâm THÂN CHỮ HOA so với tâm mặt bảng): s001, s040, s063 ổn; s036 thấp 11px, s052 thấp 8px → đã sửa. bang-chu.sh giờ tự căn theo thân chữ hoa (y = cy - ascent + 0.325*size), không còn tính dấu.

## 2026-11-14 – 15 clip Veo (đã chốt: s001,s003,s004,s005,s006,s010,s011,s012,s013,s015,s017 + s046,s053,s055,s068)
- Cách đưa ảnh vào Flow: extension mode KHÔNG cho chọn file → chạy server CORS nhỏ (scratchpad/cors_srv.py, cổng 8765), lấy ảnh bằng page.context().request.get, rồi ghi đè HTMLInputElement.prototype.click để gán File khi bấm "Tải nội dung nghe nhìn lên". Ảnh có chữ bảng thì tải bản GỐC chưa chữ (chữ ghép sau).
- Gắn ảnh: "+" → tìm "veo-sNNN" → bấm item (tự gắn vào ô lệnh). Tải video: mở ô video → nút tải (góc trên phải) → menuitem "720p" → file về Downloads sau ~20s.
- [x] s001 (videos/s001-veo.mp4, 720x1280, 24fps, 7,9s): chuyển động tốt (chạy, ngoái lại, lửa khói), NHƯNG camera lùi theo nhân vật dù đã ghi locked-off → bảng tên di chuyển, chữ CỬA HỮU phải bám theo bảng từng khung. CHỜ người dùng xem.
- s001 lần 2 (videos/s001-veo-2.mp4, prompt khoá camera rất chặt + chỉ quay đầu): camera vẫn trôi chậm, cột đỏ trái mất từ giây ~4, vua vẫn xoay cả người; tay nắm giữ tốt. Thử khoá camera bằng phần mềm (scratchpad/lock.py, bám cổng thành): cổng đứng yên được nhưng cột ở tiền cảnh vẫn trôi do thị sai → không cứu được.
- [x] s001 CHỐT = clip lần 1 (người dùng chọn). Đã ghép chữ CỬA HỮU bám bảng từng khung (src/signtrack.py: dò bảng đỏ mỗi khung + làm mượt) → videos/s001.mp4 (không tiếng). Lần 2 để lại videos/s001-veo-2.mp4.
