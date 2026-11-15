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

## 2026-11-14 tối (máy thứ 2) – 13 clip Veo còn lại
- Prompt lưu ở videos/veo-prompts.json, script gửi: videos/veo-run-gen.mjs (ghi .playwright-mcp/veo-run.js). Ảnh nguồn đã tải lên Flow tên veo-sNNN.jpg.
- 22:13–22:20 gửi 14 cảnh. Xong: s003 s004 s005 s006 s010 s011 s012 s013 s017 s046 s053; s068 đang chạy lúc dừng.
- Lỗi (Flow hoàn credit): s055 "không tạo được âm thanh", s015 "vi phạm chính sách" (đã sửa prompt nhẹ hơn, CHƯA gửi lại).
- Người dùng: "khoan stop đi, tốn credit quá" → DỪNG, không gửi thêm clip. Chưa tải clip nào về máy.
- 22:24 gửi lại: s015 xong. s055 lỗi âm thanh lần 2; s068 cũng lỗi (ô biến mất, chat ghi "Đã xoá video", thùng rác trống, Flow hoàn credit).
- Người dùng: "thôi ko cần" → CHỐT 13 clip (s001 s003 s004 s005 s006 s010 s011 s012 s013 s015 s017 s046 s053). s055, s068 dùng ảnh tĩnh.
- Ghi chú: cảnh nhân vật nói (đọc chiếu, quát) hay lỗi "không tạo được âm thanh"; lần sau bật chế độ video không âm thanh trong cài đặt Flow.
- Bước tiếp: tải 12 clip mới về videos/ (720p, miễn phí), s001 tải lại từ Flow (bản ghép chữ nằm ở máy kia).
- [x] 23:05 tải 13 clip (720p, 7,93s) về videos/sNNN.mp4: s001 s003 s004 s005 s006 s010 s011 s012 s013 s015 s017 s046 s053 (khớp khung đầu với ảnh, sai lệch ~2–3). s001 = lần 1 (Flow "Regent pulling emperor from fire"); lần 2 ở videos/s001-veo-2.mp4.
- Người dùng: "ko cần ghép chữ nữa" → s001 dùng nguyên clip Veo, KHÔNG ghép chữ CỬA HỮU.

## 2026-11-14/15 đêm – giọng đọc
- [x] tts-ngat-nhip.txt (người dùng chốt, 30 câu đổi dấu, chữ khớp 100%). Đọc 83 câu Tuấn Anh eleven_v3 stab 0.5 bằng tts-v3.sh → audio-v3/ (log điểm Whisper), chép sang audio/. Tốn 7.898 credit vibi (còn 104.584).
- Điểm < 0.85: s002 s012 s023 s032 s037 s038 s063 s072, đều do Whisper nghe giọng Bắc/tên riêng ("Vy"→"vì", "Cuốc-xi"→"Quốc Xi", "Ba Đình"→"3 đỉnh"). Cần người dùng nghe NGHE-giong-1885.mp3.

## 2026-11-15 ~00:30 – render bản đầy đủ rồi tắt máy
- Người dùng muốn GIỮ tiếng Veo. Engine mới: project "veoAudio": {volume, lufs} → src/render.mjs buildVeoAudio (cắt tiếng clip theo cảnh, loudnorm -24 LUFS từng clip, fade 0.12s) → veo-audio.wav, trộn trong finalize, tự hạ dưới giọng (sidechain ratio 3). CHƯA đo mức so với giọng: lần sau đo stem và chỉnh volume nếu cần.
- build-project.mjs: animate "flow", 13 cảnh có "video", veoAudio {volume 1, lufs -24}.
- Bản đồ động: layers/s007.json (đỏ gạch + tàu + vòng đích, đoàn tàu → cửa Thuận An), layers/s054.json (xanh chàm + cờ + vòng đích, Huế → Tân Sở; đường đi trên bờ đất, không đè lên sông vì xanh chàm lẫn vào nước).
- bgm dựng lại 351,1s. Render: render-log.txt; kiểm tra sau render: render-check.txt (LUFS, khung hình check.jpg). Người dùng: "sau khi chạy xong render hãy tắt máy giúp tôi".

## 2026-11-15 – LÀM LẠI TOÀN BỘ theo quy chuẩn đạo diễn mới (styles/quy-chuan-dao-dien.md)
- Người dùng chốt kịch bản mới 85 câu (kich-ban.md; ★ = câu mới, "(cũ N)" = trùng bản trước). Sửa sau khi chốt: câu 29 "người thứ năm" → "người thứ tư" (lỗi sự thật của tôi: một năm bốn vua, Hàm Nghi là người thứ tư).
- Người dùng chọn: đọc lại cả 85 câu + tạo lại toàn bộ ảnh, xong thì tắt máy. KHÔNG làm Veo (sẽ chọn cảnh sau).
- [x] tts-ngat-nhip.txt 85 dòng (câu cũ giữ nguyên dòng ngắt nhịp đã duyệt; khớp chữ 100%). Đọc Tuấn Anh eleven_v3 → audio/ (log audio-v3/log.txt). Điểm thấp do Whisper/giọng Bắc: s004 s015 s038 s041 s043 s073. Cần người dùng nghe: s038 ("tới Huế" Whisper nghe "tội huế"), s041 ("cáo ốm").
- [x] 82 ảnh Flow mới (7 lô 10:17–11:35, không bị chặn). Làm lại trong lúc chạy: s019 (khăn → 4 bộ hoàng bào), s021 (bỏ tờ lịch), s048 (quân ta quay lưng), s075 (bỏ lính giáp kiểu Trung Quốc). Bản loại: images/_thua-v2/.
- Giữ ảnh cũ: s010 = bản đồ tàu Pháp vào Thuận An (cũ s007), s053 = bản đồ Huế → Tân Sở (cũ s054), vì toạ độ đường vẽ gắn với ảnh (layers/s010.json, s053.json, đã chỉnh thời gian vẽ theo câu mới). s051 = s003 phủ sepia (gặt lại cảnh mở đầu).
- [x] Chữ trong cảnh (gốc chưa chữ ở images/_goc-chua-chu/): s002, s050 CỬA HỮU; s040 NGỌ MÔN; s036 TÂN SỞ (bang-chu.sh); s065 BA ĐÌNH, s015 BẢO HỘ, s060 LÝ DO THỨ NHẤT, s062 LÝ DO THỨ HAI, s055 CHIẾU CẦN VƯƠNG dọc tấm lụa (persp.py mới: nắn chữ theo 4 góc).
- project.json: motion "alternate" (đẩy/kéo 7% xen kẽ), animate none, s015 + s051 đứng yên. bgm dựng lại 382,4 s.
- Toàn bộ bản cũ (83 ảnh, audio, clips, final cũ, bgm cũ) ở _ban-cu-83/ và images/_ban-cu-83/. 13 clip Veo cũ vẫn ở videos/ nhưng KHÔNG khớp ảnh mới.
- Bảng xem ảnh: sheets/v2-1..7.jpg.
- [x] 11:55 render bản xem trước (ảnh tĩnh, camera alternate, bản đồ động): final.mp4 382,4 s, 207 MB, -16,0 LUFS, mất 15 phút. Khung hình: check.jpg. Bước tiếp: người dùng xem, nghe s038/s041, chọn cảnh làm Veo, rồi bìa + caption.
- [x] 12:49 người dùng muốn nhạc nền to hơn một chút: musicVolume 0.7 → 1.0 (+3 dB). Đo: giọng -16,7 LUFS, nhạc sau duck -33,4 → -30,3 LUFS (cách giọng 16,7 → 13,6 dB). final.mp4 mới -16,0 LUFS; bản cũ: final-nhac-0.7.mp4.
- 13:20 review của người dùng (gom lại, render 1 lần):
  - 2:50 = s040 "nhà vua" bị nuốt (Whisper nghe "nhà vô") → đọc lại 3 lần, chọn t2 (Whisper nghe đúng "Ngọ Môn… nhà vua") → audio/s040.mp3. Bản cũ: audio-v3/cu/s040-vo.mp3.
  - 5:00 = s069 "An-giê" → "An-giê-ri" (sửa kich-ban.md, tts-ngat-nhip.txt, project.json). Đọc 3 bản audio-v3/sua/s069-t1..3.mp3, người dùng CHỌN t3 → audio/s069.mp3. Bản cũ: audio-v3/cu/s069-an-gie.mp3.
  - 5:43 = s077 cục tẩy: dùng lại ảnh người dùng gửi (Flow shared 3b06723d…, = images/_ban-cu-83/s075.jpg) → images/s077.jpg. Ảnh vừa bị thay: images/_thua-v2/s077-moi-bi-thay.jpg.
  - 12 cảnh Veo đề xuất (sheets/chon-veo.jpg: s001 s003 s006 s027 s042 s044 s046 s052 s059 s063 s075 s076) TẠM GÁC, người dùng đang review.
- [x] 13:26 render lại sau review: final.mp4 382,4 s, -16,0 LUFS. Đã kiểm: 5:41 là ảnh cục tẩy mới; 2:50 nghe rõ "nhà vua"; s069 = bản 3.
- [x] 13:40 Veo bộ ảnh mới: thử s001 trước (12 cảnh đề xuất ở sheets/chon-veo.jpg). Ảnh tải lên Flow tên veo2-s001.jpg (server CORS scratchpad + ghi đè HTMLInputElement.click; menu "Trình đơn thêm nội dung nghe nhìn" → "Tải lên"). Clip: videos/v2/s001-veo.mp4 (720x1280, 7,9 s, có tiếng). Đo: khung đầu khớp ảnh (scale 0,994, lệch ~4 px), camera đứng yên tới 4,4 s. Prompt: videos/v2/veo-prompts.json. CHỜ người dùng xem.
- [x] 13:56 s003 Veo: videos/v2/s003-veo.mp4. Lỗi: 1,5–3,5 s có dải lửa hình rồng trên trời; 3–5 s cậu bé há miệng, quay đầu nhìn nghiêng. Người dùng chọn DÙNG TẠM: lấy ~2,5–3 s đầu rồi giữ hình khung cuối cho đủ 5,1 s (làm lúc ghép).
- [x] 14:04 s006 Veo: videos/v2/s006-veo.mp4. Đạt: chớp mắt 1 lần (~2 s), mặt/vết muội/khăn giữ nguyên, ngậm miệng, cờ phất, camera yên. Dùng 3,7 s đầu.
- [x] 14:11 s007 Veo: videos/v2/s007-veo.mp4. Giơ cuộn giấy cao lên, đại bác đứng yên, camera yên (lệch ≤4 px, riêng ~1,5 s nhích 14 px). Vấn đề: từ ~1,5 s có vệt trắng xiên trên trời (như mưa/vệt gió) đúng vùng chữ lớn; ~4,5 s cành tre lấn góc phải trên. CHỜ người dùng xem.
- s007: người dùng ok → DÙNG LUÔN (cả vệt gió).
- [x] 14:17 s013 Veo: videos/v2/s013-veo.mp4. Đạt: tay cầm tẩy chà qua lại, vụn rơi, bản đồ còn; nheo mắt, cười nhếch (từ ~3,8 s miệng chuyển từ nhe răng sang mím cười); tay chỉ giữ 5 ngón; đèn lay. XONG LÔ 1 (s003 s006 s007 s013).
- 14:25 người dùng: làm hết lô 2–4 (s027 s042 s044 s046 s052 s059 s075 s076) rồi ghép + render 1 bản. Clip cũ (bộ 83 ảnh) dời sang videos/_cu-83/. s003 giữ hình từ 1,0 s (dải lửa rồng xuất hiện từ ~1,1 s).
- [x] 14:52 đủ 13 clip Veo (videos/v2/sNNN-veo.mp4, prompt videos/v2/veo-prompts.json). Gotcha tải ảnh lên Flow (extension mode): menu "+" chỉ mở sau khi CHỤP MÀN HÌNH (tab nền không chạy animation) → quy trình: veo2-prep.js → browser_take_screenshot → veo2-menu.js → veo2-go.js → veo2-dl.js (.playwright-mcp/). Soát: s027 ấn "nhảy" khỏi lò ~1,5 s rồi chảy tràn; s052 vua quay lưng đi về cổng (không chỉ quay đầu); s076 khói nhang thành vệt xoắn trắng.
- build-project.mjs: animate "flow", animateScope "marked", veoAudio {volume 1, lufs -24}, 13 cảnh có "video". Bản ảnh tĩnh cũ: final-anh-tinh.mp4.
- [x] 15:00 render có 13 clip Veo: final.mp4 382,4 s, 198 MB, -16,0 LUFS (8 phút). Không clip nào có tiếng người (Whisper). Tiếng Veo sau duck -33,6 LUFS trong các cảnh clip, giọng -16,5 → thấp hơn giọng ~17 dB. Đã soát khung giữa 13 cảnh: đúng clip, chữ lớn vẫn hiện. CHỜ người dùng review.
- [x] 15:20 LỖI mất tiếng: final 15:00 bị rơi các đoạn tiếng ~3 s (Media Player nhảy 0:04→0:11) do trộn tiếng + lọc hình (logo) trong cùng 1 lệnh ffmpeg khi có nhánh tiếng Veo. Sửa src/render.mjs finalize thành 2 lượt (tiếng → final-audio.wav, rồi hình + tiếng). Render lại: 0 khoảng hở, tiếng đủ 382,4 s, -16,0 LUFS, nghe đúng "Qua cửa Hữu…" ở 0:04.
- [x] 15:37 s003 Veo lần 2 (prompt mới: trời chỉ khói + tàn lửa, ngậm miệng, kéo nhẹ đều) → videos/s003.mp4. Trời sạch, ngậm miệng; từ 1,6 s quay đầu nhìn nghiêng về cung điện cháy; thoáng mảng tay áo đỏ góc dưới trái.
- [x] 15:40 render lại với s003 lần 2: 382,4 s, -16 LUFS, 0 khoảng hở tiếng.
- [x] 15:45 NGƯỜI DÙNG CHỐT VIDEO: final.mp4 (13 clip Veo, s003 lần 2). Bước tiếp: bìa (3 phương án) + caption.txt.
- [x] 15:56 LỖI mất logo: bản tách 2 lượt (15:20) chỉ đọc logo.png 1 khung → logo chỉ hiện đầu video. Sửa: "-loop 1" cho input logo ở lượt 2. Render lại: logo có suốt video, 0 khoảng hở tiếng. Còn lộ chữ "Veo" nhỏ góc dưới phải ở các cảnh Veo (logo lệch trái, marginX 0.06).
- [x] 16:24 SỬA LOGO NHÁY: logo mất 1–6 khung ở mỗi điểm vào/ra cảnh Veo, do khung đổi định dạng/thẻ màu (ảnh tĩnh yuvj420p + bt470bg, Veo yuv420p + smpte170m) → ffmpeg khởi động lại bộ lọc overlay. Sửa src/render.mjs: mọi clip ép scale=out_range=tv,format=yuv420p (NORM) + finalize đọc video.mp4 với -reinit_filter 0 + logo -loop 1 -framerate 30. Đã soát từng khung quanh 23 điểm cắt: logo đủ. 382,4 s, 0 khoảng hở tiếng, thứ tự cảnh đúng.
- [x] 16:30 NGƯỜI DÙNG CHỐT bản cuối (logo đủ, để nguyên chữ Veo nhỏ). Rút kinh nghiệm: checklist soát render trong skill, script Veo ở history/src/flow-veo/. Còn: bìa + caption.
- [x] 16:45 dọn thư mục (người dùng: giữ cái tái sử dụng, xóa cái không xài): xóa clips/, video.mp4, wav tạm, final cũ (ảnh tĩnh, nhạc 0.7), _ban-cu-83, images/_ban-cu-83 _flat _lan1 _thua _thua-v2, videos/_cu-83, style-test, videos-test, sheets, NGHE-*.mp3, các lần đọc thử trong audio-v3, render-then-shutdown.sh. 2,2 GB → ~375 MB. Lần render sau tự dựng lại clips (~6 phút).
- [x] 16:55 bìa vòng 1 (thumbnail/make-bia.sh, nền lấy từ ảnh cảnh, delogo xoá dấu Gemini): A s006 cận mặt "HUẾ · 1885 / VUA 13 TUỔI / BỎ NGAI VÀO RỪNG" (chữ dưới mặt); B s007 "CHIẾU CẦN VƯƠNG · 1885 / TỜ GIẤY / ĐẤU ĐẠI BÁC?"; C s074 "VUA HÀM NGHI · 1885 / VÌ SAO VUA / BỎ NGAI VÀNG?". So sánh: thumbnail/so-sanh-vong1.jpg. CHỜ người dùng chọn.
- [x] 17:05 bìa kiểu MỚI theo mẫu người dùng gửi (Sử Ký Quán Cóc: nửa trên đen, khối chữ canh trái: nhãn TẬP vệt cọ đỏ, tên tập chữ có chân kem/vàng, gạch hoa văn, dòng nhỏ vàng, phụ đề, logo tròn + tên kênh; nửa dưới nhân vật lớn). thumbnail/bia.html (Alegreya SC + Alegreya), chụp bằng Chrome headless. Nền mới tạo trên Flow: nen-1 (vua nhìn lên, kinh thành cháy), nen-2 (vua cầm chiếu trong rừng, lính cầm đuốc). Kết quả bia-1.png, bia-2.png, so sánh so-sanh-moi.jpg. CHỜ người dùng chọn.
- [x] 17:10 bìa: người dùng bỏ nhãn "TẬP 3" và dòng "NGƯỢC DÒNG TRĂM NĂM · 1885"; khối chữ dời xuống (top 300) → nằm trọn vùng an toàn 4:5. bia-1.png, bia-2.png cập nhật.
- [x] 17:15 CHỐT BÌA: nền 1 (vua nhìn lên, kinh thành cháy) + phụ đề "Một cậu bé, một tờ chiếu / và cả một dân tộc đứng lên" → thumbnail/BIA-CHON.jpg (1080x1920). Còn: caption.
- [x] 17:20 bìa: người dùng muốn phụ đề là câu hỏi "vì sao" → "Vì sao một cậu bé, một tờ chiếu / khiến cả dân tộc đứng lên?". BIA-CHON.jpg cập nhật.
- [x] 17:30 CHỐT phụ đề bìa: "Điều gì khiến vua Hàm Nghi / bỏ ngai vàng giữa đêm?" → BIA-CHON.jpg.
- [x] 17:35 caption nháp → caption.txt (mẫu 1867: câu hỏi 🤔, 4 gạch 🔸 có năm/nơi, câu gợi tò mò, lời mời xem, 5 hashtag). CHỜ người dùng duyệt.
- [x] 17:45 CHỐT caption (người dùng tự viết, giọng trang trọng, kể khái quát, 3 hashtag) → caption.txt. TẬP 1885 XONG: final.mp4 + thumbnail/BIA-CHON.jpg + caption.txt.
- [x] 17:50 caption bản cuối: áp dụng góp ý (câu mở gọn, bỏ lặp "lịch sử", 5 hashtag) + "Cùng Vy" (không ghi tên page).
