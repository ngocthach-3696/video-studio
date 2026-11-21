# Tiến độ – Loạt Bác Hồ, Tập 1: 1911–1923

- [x] 2026-11-19 nghiên cứu nền: history/series/ho-chi-minh/nghien-cuu.md. Người dùng chọn hướng A (giữ 1911–1923, nhấn hoạt động cách mạng ở Pa-ri; tập 2 = Tống Văn Sơ).
- [x] 2026-11-19 NGƯỜI DÙNG CHỐT kịch bản bản nháp 2 ("ok chốt"): kich-ban.md, 78 cảnh, ~820 từ (~4,5–5 phút). Hook mở bằng vụ biến mất 1923; lá đơn Trường Thuộc địa để ở Hồi 1; xưng "anh" → "Người" từ câu 51.
- [x] sources.md: tra thêm ⚠. Còn mở: câu 18 (45 franc, 1 nguồn), câu 52 đã sửa thành "Từ đây, các chỉ điểm bắt đầu thay nhau bám theo Người." (người dùng đồng ý; không thêm câu tàu điện ngầm). Câu 18 giữ.
- [ ] Tên tập + tts-ngat-nhip.txt + đọc giọng (báo số ký tự/credit trước).
- [ ] Thiết kế nhân vật (style 2026-11-18, ảnh mẫu anh-mau-style.jpg; Bác vẽ rõ mặt, đối chiếu ảnh thật) → người dùng duyệt.
- [ ] Flow project mới tên = title; ảnh 78 cảnh.
- [x] 2026-11-19 18:05 Flow project: https://flow.google.com/project/125983bd-0dcc-49b6-b1ac-9140d078e921 ("1911 – Những cái tên của anh Ba"; 9:16, x1, Nano Banana 2.1, "Không bao giờ"). Đã tải lên ref-style.jpg (= anh-mau-style.jpg) và ref-naq-1921.jpg (ảnh thật Marseille 1921, Meurisse/BnF qua Wikimedia Commons). Script: .playwright-mcp/up.js (tải lên), gen.js (gắn ref + prompt + tải về), job từ characters/make-jobs.mjs, server cors_srv.py ở scratchpad/up.
- [x] 18:13 Nguyễn Ái Quốc 3 bản A/B/C (characters/_v1/, bảng so sánh characters/so-sanh-bac-v1.jpg). CHỜ người dùng chọn rồi mới làm anh Ba 1911 và nhân vật phụ.
- [x] 2026-11-19 người dùng CHỌN bản B cho Bác (mắt tròn chấm đen, đúng style mẫu) → characters/nguyen-ai-quoc.jpg; DUYỆT anh Ba 1911 → characters/anh-ba.jpg. Trang phục đổi theo cảnh, mặt giữ theo B (ref-naq-b.jpg trên Flow).
- [x] 18:50 đã tạo: naq-gile (sửa ảnh), naq-ao-len (phòng lạnh 1920), naq-mang-to (ra đi 1923), phan-chau-trinh, phan-van-truong, mat-tham → characters/*.jpg, bảng characters/so-sanh-tat-ca.jpg. CHỜ người dùng xem.
- [x] 2026-11-19 build-project.mjs → project.json + flow-jobs.json (78 prompt; mỗi ảnh gắn ref-style + ảnh nhân vật). Script lô: .playwright-mcp/batch.js + lot.sh (next/collect/missing; collect giảm bão hòa 0.85, gốc ở images/_goc-chua-giam/).
- [x] 2026-11-19 ~20:30 ĐỦ 78/78 ảnh cảnh (tài khoản PRO, không bị giới hạn). Làm lại: s004 (Flow viết chữ "Lorem" → thêm luật chữ = nét gợn sóng), s063 (đại biểu Tours ra người châu Á → ghi rõ người Pháp). Ảnh loại ở images/_loai/. Lưu ý: tải về đôi khi hụt (s023, s046, s047) → luôn so tên file Flow với id trước khi collect.
- [ ] Bảng duyệt: bang-anh-01-39.jpg, bang-anh-40-78.jpg. Ảnh cần người dùng quyết: s027 (bản đồ VN do Flow vẽ), s046 (chữ "CAFE" trên mái hiên), s055 (nền phố đêm thay vì căn gác), s078 (vẽ cả Bác ngồi đọc tin mình "đã chết"), s017 (cử chỉ hai bàn tay chưa rõ). Bảng/biển trống cần chèn chữ: s037 (VILLA DES GOBELINS), s008/s069 (giấy thông hành).

## 2026-11-19 (tiếp)
- Người dùng duyệt 78 ảnh ("ok tôi thấy được rồi"), giữ nguyên s017/s027/s046/s055/s078.
- s037: chèn biển "VILLA DES / GOBELINS" (Alegreya SC Bold, trắng ngà, nắn phối cảnh). Gốc ở images/_goc-chua-chu/.
- s008/s069: không chèn chữ (cảnh 8 đã có chữ lớn CHEN VANG?).
- tts-ngat-nhip.txt: 78 dòng, khớp chữ kịch bản + project.json, 4.844 ký tự (≈4.844 credit eleven_v3). Số dư vibi: 84.026. CHỜ người dùng duyệt trước khi chạy TTS.
- TTS xong (tts-v3.sh): 78 clip trong audio/ (bản chọn), các bản thử trong audio-v3/. Đọc lại s001/s008/s018/s066/s072/s073 thêm 2 bản, chọn t5/t4/t1/t4/t1/t5. Tổng giọng 295 s. Soát chữ cuối + khoảng lặng: audio-v3/soat.txt.
- NGHE-ten-rieng.mp3: 10 câu có tên riêng để người dùng nghe duyệt (s001 s002 s007 s008 s037 s039 s054 s071 s074 s078).
- 2026-11-19 23:48 bản tĩnh final.mp4 (309 s, 124.7 MB, --no-animate). Soát: hình 309.03 s = tiếng 308.96 s, 0 khoảng hở tiếng, -16.0 LUFS, logo có ở mọi mẫu (1 khung/10 s), Whisper 3 đoạn (0, 150, 290 s) đủ lời. bgm 309 s (src/timeline-len.mjs tính độ dài trước khi dựng nhạc).
- CHỜ: người dùng xem bản tĩnh + nghe NGHE-ten-rieng.mp3; sau đó chọn 10–13 cảnh Veo.

## 2026-11-20 – Kịch bản viết lại (90 câu) + camera mới
- Người dùng "ok chốt" bản viết lại (review sử học + mẫu 5, 6): sửa câu 3/31/49 cũ, "theo một nghiên cứu" cho 45 franc, "Quốc tế thứ ba", trả lời câu hỏi trung tâm (69–75: báo cáo từng giờ, "nguy hiểm nhất", 67 tài liệu), Désiré/Mát-xcơ-va (81–82), kết bảng cân đối (85–86), hook mới.
- Câu 30 đổi cách đọc năm: "một nghìn chín trăm mười" (Whisper nghe "một chín mười" thành 1990 ở cả 3 bản).
- Ảnh: ảnh cũ chuyển sang số mới theo OLD_OF trong build-project.mjs (bộ cũ giữ ở images/_v1/, đã sửa lệch ảnh cũ s032–s034). 18 ảnh mới (13 cảnh + s001b/c/d, s015b, s057b); bản copy cảnh phụ s003b, s017b, s029b, s085b.
- Giọng: 62 câu dùng lại bản cũ (audio/_v1), 28 câu đọc mới (tts-lai.sh, log audio-v3/log2.txt); s028 lấy t5, s030 bản mới n4.
- Camera mới (src/camera.py): CAMERA/SHOTS trong build-project.mjs (punch 2,6,36,70,73,78; tilt 3; pan 61,80; whip 9,29,35,56,68; đen 4,76,83; rung 51,71; nhiều cảnh trong câu 1,3,15,17,29,57,85).
- Chưa làm: Veo (10–13 clip, duyệt từng clip), chèn chữ thẻ tên chỉ điểm s050 (tuỳ chọn), bìa, caption, tên tập.
- 2026-11-20 02:24 final.mp4 bản tĩnh mới: 374,3 s (6:14), 151 MB. Soát: hình 374,33 = tiếng 374,26, 0 khoảng hở tiếng, -16.0 LUFS, logo đủ ở mọi khung mẫu (2 khung/s), Whisper 3 đoạn (0, 180, 350 s) đủ lời. Chữ lớn câu 16 đổi "45 – 135 FRANC" (font không có "↔").
- Nhịp cắt đo được (styles/ref-camera/tap1911-v2.csv): 103 cảnh, TB 3,6 s (bản cũ 3,96), 8% ≤1,5 s, 33% >4 s; 30 giây đầu 14 cảnh. Vẫn dài hơn mẫu (~2,5 s): lần sau tách thêm câu dài bằng "shots".
- CHỜ người dùng: xem bản mới, nghe tên riêng (Giăng/Ê-đu-a/Đê-di-rê/Mát-xcơ-va ở s050/s051/s081/s082), rồi chọn Veo.

## 2026-11-20 tối – Review lần 3 (người dùng "chốt")
- kich-ban.md sửa câu 15–18b, 26–35, 44–45, 50–55 (câu phụ 15a/15b… gộp vào cùng cảnh, câu 33 bỏ = scene skip). build-project.mjs đã gộp câu phụ + SKIP=[33]; tts-ngat-nhip.txt sửa 20 dòng (bản trước: audio-v3/tts-ngat-nhip-truoc-review3.txt), khớp chữ 100%.
- Ảnh mới (Flow, xong): s028 (ngã rẽ về quê/con tàu), s029 (3 khung nghề), s035 (Pa-ri không tờ lịch), s044 (chữ ký + bóng 3 người), s018b (nhìn chồng tiền nhỏ), s052b (hai chiều cao). Ảnh cũ: images/_v2/; bản sao s028b (cầu tàu), s029c (Niu Oóc), s044b (hai nhà nghiên cứu). Flow đổi ô nhập thành "Tiếp theo là gì?" → đã sửa .playwright-mcp/batch.js (+ nút "Xoá câu lệnh").
- Giọng: CHƯA XONG. Chỉ s035 đọc mới được (audio-v3/s035.mp3, điểm 0.878, chưa chép sang audio/). vibi kẹt: các job eleven_v3 đứng "processing" từ 16:13Z (đã trừ ~966 credit cho job kẹt: s044×3, s045×2, s031, s016). Bản cũ của 20 cảnh sao lưu ở audio/_v2/. Cần: đọc lại 19 cảnh còn lại (IDS="15 16 17 18 26 27 28 29 30 31 32 34 44 45 50 51 52 53 55" bash tts-lai.sh), soát chữ cuối (scratchpad soat3.py), chép sang audio/, dựng bgm, render.

## 2026-11-21 00:25 – Đọc lại giọng (dừng giữa chừng)
- vibi chập chờn: lúc đầu báo 401 (key vẫn đúng, gọi lại thì được); s027 hỏng cả 3 lượt, gửi tay thì được nhưng mất 2,5 phút. Mất ~350 credit cho lượt hỏng. Số dư 70.717.
- XONG (audio-v3/, chưa chép sang audio/): s015 0.95, s016 0.929, s017 0.857, s018 0.952, s026 1.0, s027 0.933 (+ s035 0.878 từ trước).
- CÒN 13 cảnh (~1.590 ký tự): IDS="28 29 30 31 32 34 44 45 50 51 52 53 55". Người dùng hẹn chạy lại vibi vào ngày 21/11. Nên gửi mỗi cảnh 1 lượt, cảnh hỏng thì để cuối gửi lại.
- Sau đó: soát chữ cuối (soat3.py, bản sao trong scratchpad phiên này), chép sang audio/, dựng bgm, render, soát bản render.

## 2026-11-21 01:25 – Clip AI (Omni 1.2 Flash)
- Người dùng chọn model Omni 1.2 Flash (4 s, 12 tín dụng/clip) thay Veo cho tất cả clip. Thử so sánh s001 Omni/Veo: videos/v2/SO-SANH-s001.mp4.
- Giao diện Flow mới: ô nhập có chế độ Video → "Khung hình" (ô Bắt đầu/Kết thúc), tải ảnh lên qua "Tải nội dung nghe nhìn lên". Script: .playwright-mcp/omni-run.js (id/model/prompts qua cors_srv 8765) + .playwright-mcp/collect.sh.
- Xong 13 clip videos/v2/<id>-omni.mp4: s001 s004 s009 s011 s013 s017b s028 s030 s046 s055 s058 s071 s079. Prompt: videos/v2/veo-prompts.json.
- Cần xử lý: s009 kim đồng hồ quay XUÔI (đề xuất lật ngang clip + ảnh tĩnh, xoá dấu ✦); s058 mặt chuyển buồn rầu, nhiều nước mắt (ảnh gốc là xúc động mỉm cười) → đề xuất làm lại; s046 người đi đường bên trái biến mất; s013 dấu ✦ thành đốm lấp lánh góc phải dưới (kiểm tra logo che).
- Chưa chép sang videos/sNNN.mp4, chưa nối vào build-project.mjs.
- 01:45 Người dùng "chốt": giữ nguyên cả 13 clip (s009 quay xuôi, s058 bản buồn, s046 giữ). Lượt tạo lại s058 lỡ gửi (12 tín dụng) — không dùng.
- Engine: render.mjs cho phép clip trong cảnh nhiều ảnh (shots: ảnh nào có videos/<ảnh>.mp4 thì đoạn đó chạy clip, tiếng clip vào veoAudio); make.mjs bỏ qua kiểm tra cảnh skip. build-project.mjs: animate "flow", veoAudio, đánh dấu video cho 10 cảnh một ảnh.
- 01:39 final.mp4 bản có 13 clip (GIỌNG 13 CẢNH VẪN LÀ BẢN CŨ): 369,6 s, hình 369,60 = tiếng 369,53, 0 khoảng hở tiếng, -16,0 LUFS, logo đủ ở 26 điểm vào/ra clip.
- 01:44 Chạy lại vibi 13 câu (tts-1lan.sh, mỗi câu 1 lần, TAKE=5): 10 câu đầu đều lỗi 503 "provider_under_maintenance" (ElevenLabs bảo trì) → đã dừng. Số dư vibi 70.717 → 68.822 (−1.895) dù không có câu nào đọc được; tab Lịch sử web báo "unknown_tenant". Chưa rõ trừ vì đâu (job kẹt cũ hay lượt 503). Còn đủ 13 câu: IDS="28 29 30 31 32 34 44 45 50 51 52 53 55".

## 2026-11-21 09:20 – Tìm lại bản giọng "mất"
- Các job vibi tưởng lỗi tối 20/11 thật ra đã đọc xong (đã trừ credit). Lấy lại qua GET /v1/history (file vibi tự xoá sau 24 giờ) → audio-v3/vibi-ls/, chấm Whisper, chọn bản → audio-v3/sNNN.mp3: s028 s029 s031 s032 s034 s050 s051 s052 s053 s055.
- Đã đủ 17/20 câu (cùng s015 s016 s017 s018 s026 s027 s035). File nghe: NGHE-giong-moi.mp3 (17 câu theo thứ tự).
- CÒN 3 câu: s030, s044, s045. vibi trả 503 provider_under_maintenance chỉ với giọng cộng đồng Tuấn Anh (giọng mặc định Adam vẫn đọc được).
- Bài học: khi vibi-tts.mjs báo lỗi hoặc hết giờ chờ, kiểm tra /v1/history trước khi gửi lại (job vẫn có thể xong và bị trừ credit).
- 09:50 Người dùng: "3 câu kia tạm để lại". Đã chép 17 câu mới sang audio/ (xoá sNNN.json cũ để engine tính lại mốc chữ). s030/s044/s045 trong audio/ vẫn là BẢN CŨ (lời trước review 3), chờ vibi mở lại giọng Tuấn Anh.
- 10:05 Nhạc nền: người dùng chọn bài 3 (inspirational-nastelbom.mp3, NastelBom). music/bgm.wav dựng lại 414,0 s (3 bản nối, nguồn ghi ở music/NGUON.txt). Video dài 414 s (trước 369,6 s) vì 17 câu mới dài hơn (68,6 → 113 s, câu phụ đã gộp). Khi có 3 câu s030/s044/s045 phải tính lại độ dài và dựng lại bgm.
- 09:49 final.mp4 bản nháp (17 câu mới + nhạc bài 3; s030/s044/s045 còn giọng cũ): 414,0 s, 168 MB. Soát: hình 414,000 = tiếng 413,995, 0 khoảng hở tiếng, -16,1 LUFS, logo đủ ở 26 điểm vào/ra clip (10 khung/điểm), Whisper 5 đoạn (0, 70, 113, 238, 395 s) đủ lời. Nhạc sau duck ≈12,6 dB dưới giọng (mục tiêu 13–14; bài 3 hơi to hơn bài 1). Bản trước: final-truoc.mp4.

## 2026-11-21 – Đủ giọng 3 câu cuối
- vibi mở lại giọng Tuấn Anh. Đọc s030/s044/s045 (tts-1lan.sh TAKE=6, mỗi câu 1 lần): điểm 0.966 / 0.925 / 0.936, chữ cuối đủ, khoảng lặng cuối 0,12–0,24 s. Chép sang audio/ (bản cũ ở audio/_v2/*-cu-truoc-review3.mp3). File nghe: NGHE-3-cau.mp3.
- Whisper nghe "Chào anh" (Cha anh) ở s030, "Cây tên" (cái tên) ở s044: có thể chỉ nghe nhầm, chờ người dùng nghe.
- Độ dài mới 428,8 s → dựng lại music/bgm.wav (bài 3) 428,8 s. Render lại final.mp4 (bản trước: final-truoc.mp4).
- 11:40 final.mp4 bản đủ giọng mới: 428,8 s (7:09), 172 MB. Soát cả file: hình 428,800 = tiếng 428,795, 0 khoảng hở tiếng, -16,1 LUFS, logo đủ ở 26 điểm vào/ra clip (10 khung/điểm), Whisper 5 đoạn (0, 133, 195, 300, 410 s) đủ lời; trên bản render Whisper nghe đúng "Cha anh", "Cái tên", "tên chung mà" (lần soát clip trước là nghe nhầm).
- Chưa làm: tên tập, bìa, caption, chữ thẻ tên chỉ điểm s050 (tuỳ chọn).

## 2026-11-21 trưa – Review bản 7:09
- Người dùng: 1:52 (s027), 2:28 (s032), 4:07 (s052) nghe như GIỌNG KHÁC. Cả 3 là bản lấy lại từ lịch sử vibi sáng nay (eleven_v3 đôi khi đổi chất giọng). Đọc lại s027 (0.933) và s032 (1.0) bằng Tuấn Anh (take 7), đã chép sang audio/ (bản lạ ở audio/_v2/*-giong-la.mp3). File nghe: NGHE-s027-s032.mp3.
- s052: người dùng chọn C ("giấy tờ tùy thân") rồi đổi ý: GIỮ "thẻ căn cước". Lượt đọc bản C đã chạy xong (audio-v3/s052-t7-giay-to-tuy-than.mp3, ~120 credit, không dùng). Kịch bản/TTS/project.json đã trả về "thẻ căn cước". s052 trong audio/ vẫn là bản giọng lạ.
- s041 (3:05) có 3 bàn tay → sửa trên Flow (chế độ sửa ảnh, bỏ bàn tay giữa), ảnh mới images/s041.jpg; ảnh lỗi ở images/_loai/s041-3-tay*.jpg.
- Chưa render lại (gom sửa, render 1 lần sau khi xong s052).
- 12:21 s052 đọc lại với "thẻ căn cước": vibi-tts.mjs báo lỗi nhưng job trên vibi đã xong (115 credit) → tải từ /v1/history (audio-v3/s052-t8.mp3), Whisper đủ lời (nghe "thể căn cước" = nghe nhầm), chép sang audio/. File nghe 3 câu: NGHE-s027-s032-s052.mp3.
- Sửa src/vibi-tts.mjs: chỉ coi là hỏng khi job có status 'failed'; lỗi tạm lúc hỏi trạng thái thì hỏi lại (trước đây script dừng sớm trong khi vibi vẫn đọc và trừ credit).
- Render lại (gồm s027/s032/s052 + ảnh s041).
- 12:26 final.mp4 (đủ 3 câu giọng mới + ảnh s041 2 tay): 426,4 s (7:06), 171,8 MB. Soát cả file: hình 426,400 = tiếng 426,395 = bgm, 0 khoảng hở tiếng, -16,1 LUFS, logo đủ ở 26 điểm vào/ra clip, s041 trong video đã 2 tay, Whisper 6 đoạn (0, 108, 146, 200, 244, 410 s) đủ lời. Bản trước: final-truoc.mp4.

## 2026-11-21 chiều – Review bản 7:06
- Người dùng: 2:28 (s032) zoom quá, mất quả địa cầu/5 người lính (người dùng ghi 0:28) → camera cảnh 32 trong build-project.mjs đổi từ HOLD(0.5,0.72,1.3) sang toàn ảnh rồi đẩy chậm z 1→1.08 về tay viết (câu 33 dùng chung ảnh đã bỏ nên không cần chia nửa nữa). project.json dựng lại, chỉ cảnh 32 đổi.
- 2:38 (s035) và 4:13 (s053) giọng khác → đọc lại. s035 take 9: điểm 0.81, Whisper nghe "cài trị" (cần người dùng nghe). s053: vibi trả lỗi khi gửi nhưng VẪN tạo job de131fe1 (102 credit), treo "pending" > 7 phút, đang chờ.
- vibi-tts.mjs: khi POST báo lỗi, tìm job cùng câu tạo trong 2 phút trong /v1/history và chờ job đó; chờ tối đa 6 phút.
- 12:51 job s053 de131fe1 vẫn pending, progress 0 sau 10 phút. Số dư vibi 67.852. Hỏi người dùng: chờ hay gửi lại.
- 13:10 Người dùng khẳng định s035/s053 nghe khác giọng. Đo thật (scratchpad voicefp.py, cao độ + độ sáng 90 câu): s035 cũ f0 219 Hz (trung vị 170) = lệch nhất; s042 (bản 19/11) 222 Hz cũng lệch, chưa ai báo. s053 không lệch cao độ nhưng phát âm lạ (Whisper: "phan ba", "nguyện ai quốc", "mật tham"). Metadata vibi đều ghi HG0MlJIknmaXREpTckfK → eleven_v3 tự trôi giọng từng lượt; KHÔNG được kết luận "đúng giọng" chỉ từ metadata.
- s035 take 10: f0 172 Hz, Whisper 0.927 (bản tốt, chưa chép vào audio/). s053: 2 job kẹt trên vibi (de131fe1 pending, 65b85d88 processing), chưa có file.
- File nghe NGHE-so-sanh.mp3: s041 (giọng chuẩn) → s035 take 10 → s042 hiện tại.

## 2026-11-21 13:20 – LÀM LẠI TOÀN BỘ GIỌNG
- Người dùng: xoá hết mp3 của tập, làm lại từ s001, CHỈ làm s001, duyệt rồi mới làm tiếp. Đã xoá 320 mp3 (audio/, audio/_v1, audio/_v2, audio-v3/, vibi-ls, NGHE-*) + 90 audio/*.json.
- s001 take 1 (87 credit): 7,2 s, f0 195 Hz (các bản cũ trung vị 170 Hz), Whisper 0.81: nghe "mật tham", "bự tối", "chúc sữa". File: NGHE-s001.mp3. CHỜ người dùng duyệt.
- Thử hạ cao độ s001 trên máy (ffmpeg rubberband, giữ formant): -2 cung (f0 176 Hz), -2,4 cung (f0 172 Hz). vibi/ElevenLabs không có tham số pitch. File nghe: NGHE-s001-ha-cao-do.mp3 (gốc → -2 → -2,4). CHỜ người dùng nghe.
- s001 thử Tuấn Anh eleven_turbo_v2_5 stab 0.35 (44 credit): 6,2 s, f0 195 Hz, độ sáng thấp hơn v3. MiniMax Serene Man: vibi báo bảo trì (503), chưa tạo. File nghe: NGHE-s001-mau-v3-turbo.mp3 (mẫu vibi → v3 → turbo).
- 15:45 Người dùng duyệt s001 bản turbo (eleven_turbo_v2_5, stab 0.35, job 15:40, 44 credit): "bản này đang ok". Đã chép sang audio/s001.mp3. Chờ lệnh đọc các câu còn lại.
- 16:10 TẠM DỪNG giọng, chờ vibi ổn định lại (người dùng: "đợi vibi ổn lại tôi làm sau").
  - Đã chốt: s001 = turbo v2.5 stab 0.35 (audio/s001.mp3).
  - Thử thêm: nhấn nhá trên máy (chèn ngừng 0,6 s sau "Bốn năm…", 0,15 s sau "bánh mì"): NGHE-s001-ngat-nhip-nhac.mp3, chưa duyệt. Hạ cao độ trên máy: NGHE-s001-ha-cao-do.mp3, chưa duyệt.
  - Job vibi s001 turbo stab 0.5 (dbb1c8e8-70ab-4899-a271-9b2ca1cab041, 44 credit) kẹt "processing" 0% từ 15:53; nếu xong sẽ ở audio-v3/s001-turbo-stab05.mp3. MiniMax (Serene Man) báo bảo trì 503.
  - Việc tiếp: chọn stab 0.35/0.5 + cách nhấn nhá, rồi đọc theo nhóm ~10 câu (s002–s011 trước), không gửi lại job kẹt.

## 2026-11-21 18:55 – vibi ổn lại, quay về eleven_v3
- Người dùng: dùng lại Tuấn Anh eleven_v3. Đọc s001 (take v3b, stab 0.5, 87 credit): 5,8 s, Whisper 1.0, lặng cuối 0,23 s, f0 ~186 Hz (bản turbo đã duyệt ~198 Hz cùng cách đo). File: audio-v3/s001-tv3b.mp3. File nghe: NGHE-s001-v3-moi.mp3 (v3 mới → 1 s lặng → turbo đã duyệt). CHỜ người dùng duyệt rồi mới đọc s002–s011.
- Người dùng: "cứ dùng như các tập trước" → đọc cả tập bằng v3 (tts-1lan.sh TAKE=1, bỏ câu 33 đã gộp). s001: audio/s001.mp3 = bản v3 (bản turbo cất ở audio-v3/s001-turbo-da-duyet.mp3).
- Người dùng bảo DỪNG sau vài câu. Đã đọc: xem audio-v3/log2.txt (s002–s009…). Đáng ngờ: s003 (0.78, f0 222 Hz, không lặng cuối), s006 (0.17, tên "Chen Vang"), s009 (0.80). Chưa chép gì sang audio/ ngoài s001.
- 19:30 KHÔI PHỤC giọng cũ (người dùng ok): cắt lại 89 câu từ narration.wav (render 12:26 = final.mp4 7:06) theo timeline.json (voiceStart/audioSeg, bỏ phần đệm 0 tuyệt đối) → audio/sNNN.mp3 (mp3 q0). Soát: Whisper s001 1.0, s010 0.92, s027 0.93, s050 0.79, s090 0.82; độ dài khớp. Còn lỗi cũ: s035 (f0 222 Hz), s042 (221 Hz), s090 (205 Hz, trung vị cả tập ~170), s053 phát âm lạ.
- vibi chỉ còn lịch sử 21/11 (không còn 18–20/11). Job kẹt s053 (65b85d88) đã xong → audio-v3/s053-vibi-ket.mp3.
- Các bản v3 tối nay: audio-v3/s001-v3-toi-nay.mp3, s002–s009-t1.mp3 (chưa dùng).
- 19:45 Đọc lại s035/s042/s053/s090 (take r1, 346 credit): Whisper 0.88/1.0/0.91/0.86, f0 174/205/174/209 Hz. Chưa chép sang audio/. File nghe NGHE-4-cau.mp3 (mỗi câu: cũ → mới).
- 19:13 Người dùng duyệt 4 câu mới → chép s035/s042/s053/s090 (take r1) sang audio/ (bản khôi phục cũ: audio-v3/*-cu-khoi-phuc.mp3). Độ dài 420,3 s → dựng lại bgm (bài 3) 420,3 s. Render final.mp4 (7:00, 169,9 MB; bản trước: final-truoc.mp4), gồm cả camera mới cảnh 32.
- Soát cả file: hình 420,333 / tiếng 420,267 (thiếu 2 khung tiếng ở cuối, sau câu kết), 0 khoảng hở tiếng, -16,0 LUFS, logo đủ ở 25 điểm cắt clip (8 khung/điểm, xem ảnh ghép), Whisper trên bản render s001 1.0, s035 0.88, s042 1.0, s053 0.96, s090 0.86; s032 thấy đủ quả địa cầu + 5 lính, đẩy chậm vào tay viết.
- 19:50 Bìa: tiêu đề của người dùng "HÀNH TRÌNH HY VỌNG / của người thanh niên yêu nước", không phụ đề, nền I (Flow, ref-style tải lại lên + ref-naq-gile + ref-mat-tham; thumbnail/nen-1-goc.jpg 2K, nen-1-sach.jpg = xoá dấu ✦ + bão hoà 0.85). thumbnail/bia.html + mk-bia.cjs (thêm top/fade/fs2: che đường ngang trời–phố ở 35,05%). Bản nháp: thumbnail/BIA-1.png. Chờ người dùng duyệt.
- 19:45 Người dùng: các tập trước có 3 ảnh mẫu để chọn, chữ chưa giống tập trước → bố cục chữ như 1905 (2 dòng cùng cỡ 82, dòng 2 xuống dòng thành 3 dòng: HÀNH TRÌNH HY VỌNG / CỦA NGƯỜI THANH NIÊN / YÊU NƯỚC), 3 nền: 1 ngõ Pa-ri + mật thám, 2 boong tàu 1911 lúc hoàng hôn (ref-anh-ba), 3 sân ga đêm 1923 măng tô + vali (ref-naq-mang-to). thumbnail/BIA-1..3.png, bảng so sánh SO-SANH-3-BIA.jpg. Chờ người dùng chọn.
- 19:55 Người dùng chỉ ra bìa thiếu TÊN TẬP (format 1905 = tên tập 2 dòng + câu phụ). Chốt tên tập B: "TỪ VĂN BA / ĐẾN NGUYỄN ÁI QUỐC"; câu phụ = câu của người dùng "Hành trình hy vọng / của người thanh niên yêu nước." Đã ghép 3 nền: thumbnail/BIA-1..3.png, SO-SANH-3-BIA.jpg. Chờ chọn nền.
- 20:00 Người dùng chọn nền 1, giữ tên B; đổi ảnh theo hướng 2+3 (mật thám kín đáo, nghiêm; sương, đường ướt, bóng dài). 3 biến thể: 1B nấp góc tường, 1C sau cột đèn giả đọc báo, 1D ô cửa vòm. thumbnail/BIA-1B..1D.png, so sánh SO-SANH-BIA-1.jpg (cùng bản 1 cũ). Chờ chọn.
- 20:05 CHỐT bìa: BIA-1B → thumbnail/BIA-CHON.png (+ .jpg). Còn: caption.
- 20:15 CHỐT caption: người dùng chỉ giữ 1 câu "Hành trình hy vọng của người thanh niên yêu nước." + 3 hashtag (caption.txt). Tập xong: final.mp4 + BIA-CHON + caption. Việc còn lại tùy người dùng: đăng FB (bật nhãn AI), dọn file sau khi duyệt.
- 20:25 DỌN DẸP (người dùng ok): 1108 MB → ~345 MB. Xoá clips/, audio-v3/, camera-test/, antigravity-test/, sheets/, images/_loai,_v1,_v2, characters/_v1 + so-sanh-*, videos/v2 SO-SANH + s001-veo, NGHE-*, final-audio/veo-audio/narration.wav, video.mp4, final-truoc.mp4, subs.ass, bang-anh-*, các bìa/nền không chọn. Giữ: final.mp4, images/sNNN.jpg + images/_goc-chua-giam, videos/ (13 clip + v2 nguồn + prompts), audio/ (89 câu), music/bgm.wav, characters/, kịch bản, TTS, project/build, scripts, thumbnail/BIA-CHON + nen-1b + bia.html/mk-bia.cjs, caption.txt. Soát: project.json đủ ảnh, 13 clip, 89 mp3.
