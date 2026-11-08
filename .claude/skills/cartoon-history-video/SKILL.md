---
name: cartoon-history-video
description: Tạo video lịch sử Việt dạng HOẠT HÌNH 2D chibi kể chuyện chính sử — dọc 9:16, cắt thẳng mỗi 2-3 giây, nhân vật cố định có ảnh tham chiếu, tiêu đề cảnh lớn ("10 NĂM SAU"), KHÔNG phụ đề, logo nhỏ mờ (không chữ chìm), giọng "Anh Nghĩa" (vibi.pro/MiniMax), nhạc nền hoặc soundscape SFX theo cảnh, chuẩn −16 LUFS. Dài 1-8 phút, có thể làm series nhiều tập. Dùng khi người dùng nói "video hoạt hình lịch sử", "kể sử kiểu hoạt hình/chibi", "làm tập X series lịch sử", "/cartoon-history-video <chủ đề>". Video lịch sử kiểu phim tài liệu ảnh thật/ken burns → dùng history-video. Project nằm ở <ROOT>\history.
---

> `<ROOT>` = thư mục gốc repo video-studio (thư mục chứa `CLAUDE.md`, ví dụ `C:\video-studio` hoặc `D:\video-studio`). Thay bằng đường dẫn thực tế khi chạy lệnh.

# Cartoon History Video

Chạy trên engine `<ROOT>\history` với `"preset": "cartoon"`.
**Đọc trước:** `<ROOT>\history\styles\hoat-hinh-su-viet.md` (style bible: thông số đo được, cấu trúc kịch bản, quy tắc hình, chữ, âm thanh) và `hoat-hinh-chuyen-dong-ai.md` (style chuyển động người dùng chọn).

> **Quy tắc người dùng thắng mặc định của skill.** Xem `.claude/memory/history-video-style-prefs.md` (nạp qua CLAUDE.md). Project mẫu đã duyệt: `projects/1858-tieng-sung-dau-tien/project.json` (series "Ngược dòng trăm năm", ghi chú series ở `history/series/`) và `projects/mua-do-thanh-co-1972/`. Mỗi tập **độc lập**: không dùng lại ảnh/asset của tập trước. Tiến độ từng tập ghi ở `<project>/TIEN-DO.md`.

**Lệnh** (cwd = `<ROOT>\history`; PowerShell 5.1, không `&&`):
```
node src/make.mjs projects/<slug> --characters-only     # B1: ảnh tham chiếu nhân vật
node src/make.mjs projects/<slug> --images-only         # B2: ảnh toàn bộ cảnh
node src/make.mjs projects/<slug> --no-animate          # B3: bản xem trước (miễn phí)
node src/make.mjs projects/<slug>                       # B4: bản có clip AI (tốn tiền)
--redo s004,phung-hung   # tạo lại ảnh cảnh / nhân vật với seed mới
```
Không thấy `node`/`ffmpeg`: `$env:Path = "<ROOT>\tools\node;<ROOT>\tools\ffmpeg\bin;" + $env:Path`.

## Quy trình

### 1. Chốt yêu cầu
Đọc `history/.env` (`IMAGE_PROVIDER`, `FAL_KEY` có chưa). Hỏi nếu thiếu: chủ đề + góc kể (câu hỏi trung tâm của tập), độ dài, lẻ hay series (số tập, tóm tắt tập trước), âm thanh nền (nhạc người dùng đưa vào hay soundscape SFX). Giọng mặc định: Anh Nghĩa (xem bước 5b).
Mặc định: 9:16, 3-4 phút. **Số cảnh ≈ số giây / 2,7** (3 phút ≈ 65 cảnh, 4 phút ≈ 90). Báo trước chi phí ảnh: số cảnh × ~$0,04 + số nhân vật × ~$0,04.
Logo kênh: `history/assets/brand/logo.png` (PNG nền trong, tròn). Chưa có → hỏi người dùng; không có thì chạy không logo. **Không bao giờ dùng logo/mascot/tên kênh của người khác.**

### 2. Nghiên cứu — bắt buộc
WebSearch/WebFetch: Wikipedia vi + en, và tìm đoạn tương ứng trong Đại Việt sử ký toàn thư / Khâm định Việt sử thông giám cương mục / sử Trung Quốc nếu có. Ghi `projects/<slug>/sources.md`: từng chi tiết + nguồn + chỗ các nguồn **lệch nhau** (đây là chất liệu kể chuyện, không phải thứ cần giấu).

### 3. Kịch bản — theo khung trong style bible mục 2
- 1 câu đọc = 1 cảnh. 6-15 từ/câu, nhịp nhanh. Câu dài → tách thành 2 cảnh.
- Mở: câu mạnh nhất (con số gây sốc / câu hỏi) trong ≤ 2 câu (≤ 8 giây), có tiêu đề lớn từ khung 0. Series: "Tập trước… Tập này…".
- Giới thiệu Vy ấm áp: "Hôm nay, hãy cùng Vy … nhé." **KHÔNG** dùng "Mình là Vy." ở đầu hay cuối.
- Có: "Thứ nhất / Thứ hai / Thứ ba", gắn nguồn ("Toàn thư chép…", "Sách giáo khoa dạy…"), giải nghĩa từ Hán Việt, 1-2 callback (gọi lại câu hỏi mở đầu), 1 khoảnh khắc chốt bằng một chữ/một con số.
- **Bỏ** câu meta/đệm: "Đó là hết hồi một/hai/ba", "Mình thêm một ý,". Không lặp cùng một ý ở hai câu gần nhau (tên series chỉ để ở tiêu đề màn hình).
- Nguồn lệch: "Chỗ này sử chép khác nhau, mình nói cả hai." (giữ lại).
- Kết: trả lời câu hỏi đầu tập trong 1-2 câu → câu chào: "Cảm ơn bạn đã cùng Vy đi qua những năm tháng ấy. Hẹn gặp lại bạn ở tập sau nhé."
- Bỏ cảnh nào thì đặt `"skip": true` (giữ nguyên số thứ tự id).
- Văn tự viết, không sao chép kịch bản kênh khác. Quy tắc TTS: không ký hiệu `% & / → #`, không viết tắt; số phức tạp viết bằng chữ; năm viết số được.

### 4. Nhân vật
Liệt kê nhân vật xuất hiện ≥ 2 cảnh. Mỗi người 1 `look` tiếng Anh cố định, cụ thể: tuổi, dáng (chibi), mặt, râu tóc, mũ, áo + màu, đạo cụ đặc trưng. Phân biệt rõ phe bằng trang phục (VD quan nhà Đường: black futou hat with two long flaps, purple robe; hào trưởng Việt: bare-chested, blue headband, tiger-skin cape; dân: brown tunic, conical hat).

### 5. Viết `projects/<slug>/project.json`
```json
{
  "title": "Phùng Hưng — vị vua tên Bố Cái",
  "preset": "cartoon-solemn",
  "format": "9:16",
  "imageProvider": "manual",
  "animate": "none",
  "tts": "manual",
  "voiceNote": "vibi.pro, giọng Anh Nghĩa = MiniMax Vietnamese_Serene_Man, speech-2.8-hd, speed 1 pitch 0 vol 1",
  "subtitles": false,
  "loudnorm": -16,
  "brand": { "logo": "auto", "watermark": null, "logoWidth": 0.18, "logoOpacity": 0.7, "logoBlur": 0.8, "logoMarginX": 0.06 },
  "soundscape": { "dir": "sfx", "beds": [{ "sfx": "rain", "from": 1, "to": 3, "db": -14 }], "hits": [{ "sfx": "boomfar", "scene": 2, "at": "start", "db": -14 }] },
  "characters": {
    "phung-hung": { "name": "Phùng Hưng", "look": "a strong Vietnamese village chief in his 40s, chibi proportions, square face, short black beard, blue headband, bare muscular chest, tiger-skin cape, dark brown trousers" }
  },
  "scenes": [
    { "narration": "…", "image": "…", "title": "VUA TÊN LÀ BỐ CÁI?", "characters": ["phung-hung"], "video": "…" }
  ]
}
```
Trường mỗi cảnh:
- `image` (EN): chủ thể + hành động + bối cảnh + cảm xúc. KHÔNG mô tả lại ngoại hình nhân vật (code tự chèn `look`). Style chung đã có trong preset — không lặp lại.
- `characters`: key nhân vật có trong cảnh (tối đa 2-3).
- `title` (tuỳ chọn): chữ lớn trên cùng, IN HOA, ≤ 18 ký tự. Dùng cho: câu hỏi hook, mốc thời gian ("776", "10 NĂM SAU", "776 – 791"), từ khoá cao trào, tên nhân vật lần đầu. ~1 cảnh / 8-10 cảnh, không lạm dụng.
- `motion` (tuỳ chọn): mặc định `breathe` (đẩy vào 4%); `still` cho cảnh chữ/bản đồ.
- `video` (tuỳ chọn): prompt chuyển động cho cảnh được chọn animate (xem bước 8).
Ghi đè được ở cấp project: `rate`, `pace`, `subtitleStyle`, `titleStyle`, `transition`, `fadeIn`, `loudnorm` — xem `src/presets.mjs`.

**Âm thanh nền — chọn MỘT trong hai:**
- Nhạc: người dùng tự đưa file vào `<project>/music/` (không để trong `audio/`, đó là TTS; không tự tải nhạc có bản quyền). `"music": "projects/<slug>/music/<file>.mp3"`, `musicVolume` ≈ 0.85 (nhạc thấp hơn giọng ~15 dB — đo stem, đừng đoán), nhạc dài ≈ video thì `"musicStart": "end"` + `musicTrim` (cắt khoảng lặng đầu). Có thể thêm `"ambience": {file, volume}` cho tiếng nền từ giây 0.
- Soundscape SFX theo cảnh (`src/soundscape.mjs`, như tập 1858): `beds` (nền, tự hạ dưới giọng, `db` so với giọng) + `hits` (`scene`, `at`, `db`, `trim`). **Không dùng chiêng/chuông**, tiếng pháo thưa (không 2 phát liền nhau). File SFX để ở `<project>/sfx/`, ghi nguồn vào `sfx/NGUON.txt`.

Cảnh tĩnh (phong cảnh, bản đồ, làng) có thể thêm `"fx": {drift, ripple, fog, rain, ash, embers, dust, flicker}` (`src/fx.py`, chạy local); cảnh có nhân vật cần chuyển động thì dùng clip AI.

### 5b. Giọng đọc (Anh Nghĩa, vibi.pro)
Giọng chốt: **Anh Nghĩa** = MiniMax `Vietnamese_Serene_Man`, model `speech-2.8-hd`, speed 1 / pitch 0 / vol 1 (không dùng "Minh Khang"). Key `VIBI_API_KEY` trong `history/.env`. ~1 credit/ký tự → báo số ký tự trước khi chạy.
```
node src/vibi-tts.mjs <file.txt> <out.mp3> [--voice Vietnamese_Serene_Man] [--model speech-2.8-hd]
```
Mỗi cảnh → `audio/sNNN.mp3` (`"tts": "manual"` sẽ đọc file này và ước lượng thời điểm từ). Chạy hàng loạt: chép mẫu `projects/1858-tieng-sung-dau-tien/tts-all.mjs`. **Không** gửi tiếng Việt bằng curl từ Git Bash/PowerShell (mất dấu) — luôn dùng script Node đọc file UTF-8.

**Phân bổ cỡ cảnh (style bible mục 3):** ~30% cận mặt biểu cảm mạnh (giọt mồ hôi, run, trợn mắt) · ~35% trung cảnh hành động · ~15% toàn cảnh · ~5% bản đồ giấy cũ khi nói địa danh · ~15% **gag ẩn dụ minh hoạ đúng câu nói** (lớp học giơ tay khi nói "sách giáo khoa", chồng giấy cao khi nói "15 năm", tấm biển đổi tên…). Không lặp cùng bố cục 2 cảnh liền nhau.
Chữ trong ảnh: tránh. Cần chữ thì đưa vào `title`.

### 6. Duyệt kịch bản
Trình bày bảng: số cảnh · lời đọc · title · nhân vật, cộng tổng từ và thời lượng ước tính (từ / 3,3 giây). Chờ người dùng duyệt trước khi tạo ảnh — trừ khi họ đã bảo chạy thẳng.

### 7. Ảnh
1. `--characters-only` → Read từng `characters/<key>.jpg`. Người dùng duyệt (đây là "gương mặt" cả series — lưu lại dùng cho tập sau bằng cách chép file sang project mới). Sửa `look` hoặc `--redo <key>`.
2. `--images-only` (chạy nền nếu > 20 cảnh) → Read `sheets/sheet-XX.jpg`. Ảnh xấu (sai thời đại, có chữ, sai bản đồ) phải thay trước khi render. Soi: nhân vật lệch so với tham chiếu, sai thời đại, chữ lạ trong ảnh, dị dạng, 2 cảnh liền nhau giống nhau. Sửa prompt hoặc `--redo`. Tối đa 2 vòng.
- **Google Flow qua Playwright MCP** (miễn phí, Nano Banana 2.1; MCP `playwright` chế độ `--extension`, dùng Chrome thật đã đăng nhập của người dùng): đặt `"imageProvider": "manual"`. **Mỗi chủ đề = 1 dự án Flow mới, tên trùng `title` của project.json**; mọi ảnh nhân vật + cảnh của chủ đề nằm trong dự án đó. Video đăng Facebook → **luôn 9:16**. Cài đặt tác nhân Flow lưu **theo từng dự án**: với dự án mới, mở nút Cài đặt (tune) cạnh ô prompt → ảnh 9:16, **x1**, 🍌 Nano Banana 2.1, video 9:16 → Lưu. Cuối mỗi prompt thêm "Generate exactly 1 image, vertical 9:16.". Trong Cài đặt cũng đặt "Xác nhận trước khi tạo" = "Không bao giờ" khi chạy hàng loạt; đợi một chút sau khi Lưu rồi mới gửi prompt đầu. Script mẫu chạy lô: `projects/1858-tieng-sung-dau-tien/flow-gen.mjs` (+ `flow-collect.ps1`, `sheet.sh`). Mỗi prompt ~45s → tải bản "1K Kích thước gốc" (768x1376) → file vào `Downloads` → chép thành `characters/<key>.jpg` / `images/sNNN.jpg`. Không dùng công cụ giải captcha/lách chặn bot; gặp captcha thì dừng, báo người dùng tự giải. Nhắc người dùng: không thao tác trong tab Flow, không đóng tab, không bấm Cancel trên thanh "đang gỡ lỗi".
- `IMAGE_PROVIDER=manual`: hướng dẫn người dùng tạo ảnh theo `characters/prompts.txt` và `images/prompts.txt` (Gemini/ChatGPT web, đính kèm ảnh nhân vật khi tạo cảnh), lưu đúng tên rồi chạy lại.
- Ảnh tham chiếu chỉ dùng được với `fal` (model `<FAL_IMAGE_MODEL>/edit`) và `gemini`. Lần đầu chạy fal edit: theo dõi log; nếu lỗi schema thì đọc `https://fal.ai/models/fal-ai/nano-banana/edit/llms.txt` và sửa `src/images.mjs`. Nếu ảnh ra sai tỉ lệ 9:16, báo người dùng.

### 8. Render
1. `--no-animate` → bản xem trước miễn phí. Kiểm tra (bước 9).
2. Clip AI (tuỳ chọn, **tốn tiền**): preset cartoon chỉ animate cảnh **có trường `video`** (`animateScope: "marked"`); cảnh khác giữ ảnh tĩnh. Chọn 10-20% cảnh đáng giá (khói, lửa, nước, cờ bay, nhân vật run/đổ mồ hôi), ghi `video` cho chúng, đặt `"animate": "fal"`. Báo chi phí (số cảnh có `video` × ~$0,35) và **chờ người dùng đồng ý** trong cuộc trò chuyện hiện tại trước khi chạy B4. Chạy nền.
- Prompt `video`: chuyển động nhỏ, cục bộ, 1 câu, bắt đầu bằng "Animate this exact illustration…": nước gợn, khói, nến lay, vải/lá đung đưa, nhân vật chớp mắt/thở/run/siết tay. Máy quay đứng yên hoặc đẩy cực chậm, không cắt trong clip, giữ nguyên nét 2D và gương mặt. **Không** hành động lớn (chèo, quay người, đi bộ) hay máy quay mạnh. Chỉ dùng ~2-4s mỗi clip, cắt thẳng; tiếng Veo chỉ giữ ambience (không thoại/nhạc). Luôn xác nhận chi phí với người dùng trước.
- Thay fal bằng Google Flow (tự tay): `"animate": "flow"`, lưu `videos/<id>.mp4` cho các cảnh có `video`.

### 9. Kiểm tra & bàn giao
- Khung hình: `ffmpeg -v error -y -i final.mp4 -vf "fps=1/6,scale=270:-1,tile=6x3" -frames:v 1 check.jpg` (cwd = thư mục dự án) → Read. Soi title tràn, logo che chi tiết, ảnh sai.
- Loudness: `ffmpeg -i final.mp4 -af ebur128 -f null -` → I ≈ −16 LUFS (−14 bị chê "giọng hơi to").
- Ảnh bìa: 1080x1920, tiêu đề ngắn chữ lớn ở khoảng giữa-trên (an toàn khi cắt 4:5/1:1, tránh 20% dưới), **không logo**; đưa ~3 phương án vào `thumbnail/`.
- Viết `caption.txt` theo mẫu đã duyệt `projects/mua-do-thanh-co-1972/caption.txt`: 🔥 TIÊU ĐỀ 🔥 → vài câu thơ/lời của nhân chứng thật (ghi tác giả) → "Chắc hẳn trong chúng ta không ai quên được…" + đoạn ngắn trang trọng → 1 dòng tri ân 🕯️ → "Cùng Vy tìm hiểu về … để hiểu rõ hơn về lịch sử dân tộc mình nhé!" → 5 hashtag (#VyKeChuyenSu…). **Không** câu hỏi khán giả, **không** dòng credit. Ngắn. Nhắc người dùng bật nhãn "Thông tin AI" khi đăng Facebook (họ tự đăng qua Business Suite, tải ảnh bìa làm thumbnail).
- Báo: đường dẫn `final.mp4`, thời lượng, số cảnh, chi phí đã dùng, cảnh còn chưa ưng, nhắc soát `sources.md`.

## Ghi chú
- Nhạc nền: chỉ file người dùng đưa vào `<project>/music/`. Không tự tải nhạc có bản quyền từ YouTube.
- Edge TTS (chỉ dùng khi người dùng muốn bản nháp miễn phí): hay đứt kết nối → chạy lại; không `npm update` gói `edge-tts-universal` (shim ở `<ROOT>\shared\edge-tts-shim`).
- Font tiêu đề: `assets/fonts/NotoSans-CondensedBold.ttf` (có dấu tiếng Việt).
- Khi người dùng nói "tiếp tục": tự làm tiếp, chạy lô các việc dài (ảnh Flow, TTS), kiểm tra file và báo trạng thái.
