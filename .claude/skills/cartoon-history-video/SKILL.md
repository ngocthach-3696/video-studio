---
name: cartoon-history-video
description: Tạo video lịch sử Việt dạng HOẠT HÌNH 2D chibi kể chuyện chính sử — dọc 9:16, cắt thẳng mỗi 2-3 giây, nhân vật cố định có ảnh tham chiếu, tiêu đề cảnh lớn ("10 NĂM SAU"), phụ đề giữa màn hình, logo + chữ chìm kênh, giọng Edge TTS nhanh, chuẩn −14 LUFS. Dài 1-8 phút, có thể làm series nhiều tập. Dùng khi người dùng nói "video hoạt hình lịch sử", "kể sử kiểu hoạt hình/chibi", "làm tập X series lịch sử", "/cartoon-history-video <chủ đề>". Video lịch sử kiểu phim tài liệu ảnh thật/ken burns → dùng history-video. Project nằm ở C:\video-studio\history.
---

# Cartoon History Video

Chạy trên engine `C:\video-studio\history` với `"preset": "cartoon"`.
**Đọc trước:** `C:\video-studio\history\styles\hoat-hinh-su-viet.md` (style bible: thông số đo được, cấu trúc kịch bản, quy tắc hình, chữ, âm thanh).

**Lệnh** (cwd = `C:\video-studio\history`; PowerShell 5.1, không `&&`):
```
node src/make.mjs projects/<slug> --characters-only     # B1: ảnh tham chiếu nhân vật
node src/make.mjs projects/<slug> --images-only         # B2: ảnh toàn bộ cảnh
node src/make.mjs projects/<slug> --no-animate          # B3: bản xem trước (miễn phí)
node src/make.mjs projects/<slug>                       # B4: bản có clip AI (tốn tiền)
--redo s004,phung-hung   # tạo lại ảnh cảnh / nhân vật với seed mới
```
Không thấy `node`/`ffmpeg`: `$env:Path = "C:\video-studio\tools\node;C:\video-studio\tools\ffmpeg\bin;" + $env:Path`.

## Quy trình

### 1. Chốt yêu cầu
Đọc `history/.env` (`IMAGE_PROVIDER`, `FAL_KEY` có chưa). Hỏi nếu thiếu: chủ đề + góc kể (câu hỏi trung tâm của tập), độ dài, lẻ hay series (số tập, tóm tắt tập trước), giọng nam/nữ.
Mặc định: 9:16, 3-4 phút. **Số cảnh ≈ số giây / 2,7** (3 phút ≈ 65 cảnh, 4 phút ≈ 90). Báo trước chi phí ảnh: số cảnh × ~$0,04 + số nhân vật × ~$0,04.
Logo kênh: `history/assets/brand/logo.png` (PNG nền trong, tròn). Chưa có → hỏi người dùng; không có thì chạy không logo. **Không bao giờ dùng logo/mascot/tên kênh của người khác.**

### 2. Nghiên cứu — bắt buộc
WebSearch/WebFetch: Wikipedia vi + en, và tìm đoạn tương ứng trong Đại Việt sử ký toàn thư / Khâm định Việt sử thông giám cương mục / sử Trung Quốc nếu có. Ghi `projects/<slug>/sources.md`: từng chi tiết + nguồn + chỗ các nguồn **lệch nhau** (đây là chất liệu kể chuyện, không phải thứ cần giấu).

### 3. Kịch bản — theo khung trong style bible mục 2
- 1 câu đọc = 1 cảnh. 6-15 từ/câu, nhịp nhanh. Câu dài → tách thành 2 cảnh.
- Mở: nghịch lý / câu hỏi trong ≤ 2 câu (≤ 8 giây). Series: "Tập trước… Tập này…".
- Có: chia hồi rõ ("Đó là hết hồi một"), "Thứ nhất / Thứ hai / Thứ ba", 3-4 lần "Mình thêm một ý, …", gắn nguồn ("Toàn thư chép…", "Sách giáo khoa dạy…"), giải nghĩa từ Hán Việt, 1-2 callback, 1 khoảnh khắc chốt bằng một chữ/một con số.
- Nguồn lệch: "Chỗ này sử chép khác nhau, mình nói cả hai."
- Kết: trả lời câu hỏi đầu tập trong 1-2 câu → cliffhanger (series) hoặc CTA ngắn.
- Văn tự viết, không sao chép kịch bản kênh khác. Quy tắc TTS: không ký hiệu `% & / → #`, không viết tắt; số phức tạp viết bằng chữ; năm viết số được.

### 4. Nhân vật
Liệt kê nhân vật xuất hiện ≥ 2 cảnh. Mỗi người 1 `look` tiếng Anh cố định, cụ thể: tuổi, dáng (chibi), mặt, râu tóc, mũ, áo + màu, đạo cụ đặc trưng. Phân biệt rõ phe bằng trang phục (VD quan nhà Đường: black futou hat with two long flaps, purple robe; hào trưởng Việt: bare-chested, blue headband, tiger-skin cape; dân: brown tunic, conical hat).

### 5. Viết `projects/<slug>/project.json`
```json
{
  "title": "Phùng Hưng — vị vua tên Bố Cái",
  "preset": "cartoon",
  "format": "9:16",
  "voice": "vi-VN-NamMinhNeural",
  "music": "auto",
  "brand": { "logo": "auto", "watermark": "TÊN KÊNH" },
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
Ghi đè được ở cấp project: `rate` (mặc định "+15%"), `pace`, `subtitleStyle`, `titleStyle`, `transition`, `fadeIn`, `loudnorm` — xem `src/presets.mjs`.

**Phân bổ cỡ cảnh (style bible mục 3):** ~30% cận mặt biểu cảm mạnh (giọt mồ hôi, run, trợn mắt) · ~35% trung cảnh hành động · ~15% toàn cảnh · ~5% bản đồ giấy cũ khi nói địa danh · ~15% **gag ẩn dụ minh hoạ đúng câu nói** (lớp học giơ tay khi nói "sách giáo khoa", chồng giấy cao khi nói "15 năm", tấm biển đổi tên…). Không lặp cùng bố cục 2 cảnh liền nhau.
Chữ trong ảnh: tránh. Cần chữ thì đưa vào `title`.

### 6. Duyệt kịch bản
Trình bày bảng: số cảnh · lời đọc · title · nhân vật, cộng tổng từ và thời lượng ước tính (từ / 3,3 giây). Chờ người dùng duyệt trước khi tạo ảnh — trừ khi họ đã bảo chạy thẳng.

### 7. Ảnh
1. `--characters-only` → Read từng `characters/<key>.jpg`. Người dùng duyệt (đây là "gương mặt" cả series — lưu lại dùng cho tập sau bằng cách chép file sang project mới). Sửa `look` hoặc `--redo <key>`.
2. `--images-only` (chạy nền nếu > 20 cảnh) → Read `sheets/sheet-XX.jpg`. Soi: nhân vật lệch so với tham chiếu, sai thời đại, chữ lạ trong ảnh, dị dạng, 2 cảnh liền nhau giống nhau. Sửa prompt hoặc `--redo`. Tối đa 2 vòng.
- **Google Flow qua Playwright MCP** (miễn phí, Nano Banana 2.1; MCP `playwright` chế độ `--extension`, dùng Chrome thật đã đăng nhập của người dùng): đặt `"imageProvider": "manual"`. **Mỗi chủ đề = 1 dự án Flow mới, tên trùng `title` của project.json**; mọi ảnh nhân vật + cảnh của chủ đề nằm trong dự án đó. Video đăng Facebook → **luôn 9:16**. Cài đặt tác nhân Flow lưu **theo từng dự án**: với dự án mới, mở nút Cài đặt (tune) cạnh ô prompt → ảnh 9:16, **x1**, 🍌 Nano Banana 2.1, video 9:16 → Lưu. Cuối mỗi prompt thêm "Generate exactly 1 image, vertical 9:16.". Mỗi prompt ~45s → tải bản "1K Kích thước gốc" (768x1376) → file vào `Downloads` → chép thành `characters/<key>.jpg` / `images/sNNN.jpg`. Không dùng công cụ giải captcha/lách chặn bot; gặp captcha thì dừng, báo người dùng tự giải. Nhắc người dùng: không thao tác trong tab Flow, không đóng tab, không bấm Cancel trên thanh "đang gỡ lỗi".
- `IMAGE_PROVIDER=manual`: hướng dẫn người dùng tạo ảnh theo `characters/prompts.txt` và `images/prompts.txt` (Gemini/ChatGPT web, đính kèm ảnh nhân vật khi tạo cảnh), lưu đúng tên rồi chạy lại.
- Ảnh tham chiếu chỉ dùng được với `fal` (model `<FAL_IMAGE_MODEL>/edit`) và `gemini`. Lần đầu chạy fal edit: theo dõi log; nếu lỗi schema thì đọc `https://fal.ai/models/fal-ai/nano-banana/edit/llms.txt` và sửa `src/images.mjs`. Nếu ảnh ra sai tỉ lệ 9:16, báo người dùng.

### 8. Render
1. `--no-animate` → bản xem trước miễn phí. Kiểm tra (bước 9).
2. Clip AI (tuỳ chọn, **tốn tiền**): preset cartoon chỉ animate cảnh **có trường `video`** (`animateScope: "marked"`); cảnh khác giữ ảnh tĩnh. Chọn 10-20% cảnh đáng giá (khói, lửa, nước, cờ bay, nhân vật run/đổ mồ hôi), ghi `video` cho chúng, đặt `"animate": "fal"`. Báo chi phí (số cảnh có `video` × ~$0,35) và **chờ người dùng đồng ý** trong cuộc trò chuyện hiện tại trước khi chạy B4. Chạy nền.
- Prompt `video`: chuyển động nhỏ, 1 câu: "steam rises from the tea cup, the official blinks and sweats nervously, slight head shake". Không hành động lớn. Clip 5s nhưng cảnh chỉ ~2-3s → chỉ phần đầu clip được dùng, nên chuyển động phải bắt đầu ngay.
- Thay fal bằng Google Flow (tự tay): `"animate": "flow"`, lưu `videos/<id>.mp4` cho các cảnh có `video`.

### 9. Kiểm tra & bàn giao
- Khung hình: `ffmpeg -v error -y -i final.mp4 -vf "fps=1/6,scale=270:-1,tile=6x3" -frames:v 1 check.jpg` (cwd = thư mục dự án) → Read. Soi phụ đề che mặt nhân vật, title tràn, logo che chi tiết.
- Loudness: `ffmpeg -i final.mp4 -af ebur128 -f null -` → I ≈ −14 LUFS.
- Viết `caption.txt`: câu hook + 4-6 hashtag. Series: thêm "Tập N".
- Báo: đường dẫn `final.mp4`, thời lượng, số cảnh, chi phí đã dùng, cảnh còn chưa ưng, nhắc soát `sources.md`.

## Ghi chú
- Nhạc nền: chỉ file người dùng bỏ vào `assets/music/` (nhạc miễn phí bản quyền). Video mẫu: nhạc nhẹ chạy liên tục.
- Edge TTS hay đứt kết nối ("Stream closed before the synthesis completed") → chạy lại lệnh, phần đã xong được cache.
- Font phụ đề/tiêu đề: `assets/fonts/NotoSans-CondensedBold.ttf` (có dấu tiếng Việt).
- Không `npm update` gói `edge-tts-universal` (shim ở `C:\video-studio\shared\edge-tts-shim`).
