---
name: history-video
description: Tạo video kể chuyện lịch sử kiểu "faceless documentary" — ảnh AI minh hoạ từng cảnh + hiệu ứng zoom/pan Ken Burns + chuyển cảnh mờ dần + giọng đọc Edge TTS + phụ đề + nhạc nền. Hỗ trợ dọc 9:16 (TikTok/Reels, 60-90s) và ngang 16:9 (YouTube, 5-15 phút). Dùng khi người dùng nói "làm video lịch sử về X", "kể chuyện trận/nhân vật/triều đại X", "video lịch sử kiểu epic", "/history-video X". Project nằm ở C:\video-studio\history.
---

# History Video

**Project:** `C:\video-studio\history` · **Lệnh:** `node src/make.mjs projects/<slug> [--images-only] [--redo s003,s007] [--no-subs]`. Chạy **mọi lệnh với cwd = `C:\video-studio\history`**.

Shell là Windows PowerShell 5.1 (không `&&`, không `mkdir -p`). Nếu không thấy `node`/`ffmpeg`: `$env:Path = "C:\video-studio\tools\node;C:\video-studio\tools\ffmpeg\bin;" + $env:Path`.

## Quy trình

### 1. Chốt yêu cầu
Đọc `C:\video-studio\history\.env` để biết `IMAGE_PROVIDER`. Nếu người dùng chưa nói, mặc định: **9:16, 60-90s, 10-15 cảnh**. Video ngang 16:9 dài: ~6s/cảnh → 10 phút ≈ 100 cảnh (báo trước thời gian/chi phí ảnh).

### 2. Nghiên cứu — bắt buộc, lịch sử không được bịa
- Dùng WebSearch/WebFetch: Wikipedia tiếng Việt + tiếng Anh + ít nhất 1 nguồn khác.
- Ghi `projects/<slug>/sources.md`: danh sách sự kiện, năm, tên người, con số + URL nguồn.
- Chỉ đưa vào lời đọc chi tiết có nguồn. Nguồn mâu thuẫn → dùng cách nói thận trọng ("theo sử cũ", "khoảng"). Không thêm số liệu cụ thể (số quân, số thuyền) nếu nguồn không có.

### 3. Viết `projects/<slug>/project.json`
```json
{
  "title": "Tên video",
  "format": "9:16",
  "style": "cinematic photorealistic historical film still, <thời đại + vùng>, dramatic natural lighting, rich detail, 35mm lens",
  "music": "auto",
  "scenes": [
    { "narration": "Lời đọc tiếng Việt.", "image": "English image prompt", "motion": "zoom-in" }
  ]
}
```
Trường tuỳ chọn: `voice`, `rate` (vd "-5%"), `imageProvider`, `animate` (`"fal"`/`"none"`, ghi đè `ANIMATE` trong .env), `subtitles` (false để tắt), `musicVolume`, và mỗi cảnh: `motion` (`zoom-in|zoom-out|pan-left|pan-right|pan-up|pan-down`, dùng khi không có video AI) và **`video`** — prompt chuyển động tiếng Anh cho bước ảnh → video AI.

**Prompt chuyển động (`video`, mức 3):** mô tả *chuyển động* chứ không tả lại cảnh — 1 câu, chậm, ít biến đổi để clip 5s không bị méo: "banners flutter, mist drifts across the river, ships glide slowly forward, slow camera push-in". Tránh hành động phức tạp (đánh nhau, nhiều người chạy) — AI video dễ biến dạng. Bỏ trống = prompt mặc định (gió, sương, máy quay đẩy chậm). Mỗi clip dài 5s: giữ lời đọc mỗi cảnh ≤ ~6s (clip được kéo chậm tối đa 1.35×, phần thiếu giữ khung cuối).

**Lời đọc (`narration`):**
- Cảnh 1 là hook: xung đột, nghịch lý hoặc câu hỏi trong 1 câu. Không mở bằng "Hôm nay chúng ta…".
- Mỗi cảnh 12-25 từ (~4-7 giây) — 1 ý/1 hình. Văn kể chuyện, văn nói, có nhịp căng-chùng.
- Năm viết "năm 938" được. Không dùng ký hiệu `% & / → #`, không viết tắt, không emoji, không URL. Số phức tạp viết bằng chữ ("hai mươi vạn quân"). Kết câu bằng `.` hoặc `?`.
- Cảnh cuối: chốt ý nghĩa lịch sử; CTA ngắn tuỳ chọn ("Theo dõi để nghe thêm chuyện sử Việt.").

**Prompt ảnh (`image`, tiếng Anh):**
- Cụ thể: chủ thể + hành động + bối cảnh + ánh sáng + góc máy. Xen kẽ cỡ cảnh như phim tài liệu: toàn cảnh (establishing) → trung cảnh nhân vật → cận cảnh chi tiết (bàn tay, binh thư, ấn tín, bản đồ, vũ khí).
- **Đúng thời đại, ghi rõ và kèm phủ định**: trang phục/giáp/kiến trúc/thuyền của đúng triều đại và vùng (vd "10th century Chinese junk ships with batten sails, no European galleons"). AI rất hay nhầm Việt ↔ Trung ↔ Nhật và đưa vật hiện đại vào.
- Cờ: "plain banners without symbols" — tuyệt đối không cờ quốc gia hiện đại.
- Nhân vật lặp lại: viết 1 mô tả cố định (tuổi, râu, giáp, màu áo) và lặp **nguyên văn** ở mọi cảnh có người đó.
- Bạo lực chỉ ngụ ý (khói, lửa, đổ vỡ), không máu me — tránh bị nền tảng hạn chế.
- Không cần thêm "no text/no watermark/no modern flags" — code tự nối vào cuối prompt.

### 4. Xác nhận kịch bản
Trình bày danh sách lời đọc theo cảnh + tổng số từ, hỏi người dùng duyệt trước khi tạo ảnh (tốn thời gian/tiền) — trừ khi họ đã bảo chạy thẳng.

### 5. Tạo giọng + ảnh, rồi duyệt ảnh
```powershell
node src/make.mjs projects/<slug> --images-only
```
- Pollinations miễn phí giới hạn ~1 ảnh/phút → >8 ảnh thì chạy nền (`run_in_background`), chờ thông báo.
- Read từng `projects/<slug>/sheets/sheet-XX.jpg` (lưới ảnh theo thứ tự s001, s002… từ trái sang phải, trên xuống dưới). Soi: sai thời đại/văn hoá, cờ hiện đại, người dị dạng, chữ lạ trong ảnh.
- Sửa: đổi prompt trong `project.json` (ảnh tự tạo lại) hoặc `--redo s004,s009` (giữ prompt, đổi seed). Tối đa 2 vòng; còn lỗi thì báo người dùng kèm số cảnh.
- **Chế độ `manual`**: lệnh dừng với exit code 2 và liệt kê ảnh thiếu. Hướng dẫn người dùng mở `projects/<slug>/images/prompts.txt`, tạo ảnh bằng ChatGPT/Gemini web, lưu thành `images/s001.png` (hoặc .jpg)… rồi chạy lại.

### 6. Render
Nếu `ANIMATE=fal` (mức 3, **tốn tiền thật**): trước tiên render bản xem trước miễn phí bằng `--no-animate`, rồi **báo chi phí ước tính** (số cảnh × 5s × `FAL_VIDEO_PRICE_PER_SEC`, mặc định ~$0.35/cảnh) và **hỏi người dùng đồng ý** trước khi chạy bản có video AI. Không bao giờ tự chạy bước video AI mà chưa được xác nhận chi phí trong cuộc trò chuyện hiện tại.
```powershell
node src/make.mjs projects/<slug> --no-animate   # xem trước, miễn phí
node src/make.mjs projects/<slug>                # bản cuối, có video AI
```
Các bước đã xong được cache (sửa 1 cảnh chỉ làm lại — và chỉ tính tiền lại — cảnh đó). Video AI chạy song song `FAL_CONCURRENCY` clip, mỗi clip ~1-3 phút → luôn chạy nền khi có video AI hoặc 100+ cảnh. Lỗi 401/402/403 từ fal = sai key hoặc hết tiền → báo người dùng, không thử lại.

### 7. Kiểm tra & bàn giao
- Cắt vài khung hình: `ffmpeg -v error -y -i final.mp4 -vf "fps=1/8,scale=270:-1,tile=6x2" -frames:v 1 check.jpg` (cwd = thư mục dự án) rồi Read — kiểm tra phụ đề, khung hình.
- Viết `projects/<slug>/caption.txt`: 1 câu hook ngắn + 4-6 hashtag (`#lichsu #lichsuvietnam #<chủ đề> #xuhuong`…).
- Báo: đường dẫn tuyệt đối `final.mp4`, thời lượng, nguồn ảnh đã dùng, các cảnh còn điểm chưa ưng (nếu có), và nhắc người dùng soát lại `sources.md`.

## Ghi chú
- Nguồn ảnh (`IMAGE_PROVIDER` trong `.env`): `fal` (mặc định, Nano Banana ~$0.04/ảnh); `pollinations` miễn phí nhưng **chỉ đủ để thử** (576px, bám prompt kém, hay sai thời đại); `openai` / `gemini` cần API key riêng; `manual` cho ảnh tự tạo. Phần gọi fal/openai/gemini đã viết theo tài liệu nhưng **chưa chạy thật với key** — lần đầu dùng, theo dõi kỹ log; nếu lỗi schema, đọc thông báo HTTP và sửa `src/images.mjs` / `src/animate.mjs` (tài liệu: `https://fal.ai/models/<model-id>/llms.txt`).
- Ảnh → video: `ANIMATE=fal`, model `FAL_VIDEO_MODEL` (mặc định Kling 2.6 Pro, $0.07/s, tắt audio). Đổi model khác có thể phải đổi `FAL_VIDEO_IMAGE_FIELD` (tên trường ảnh đầu vào).
- Nhạc nền: chỉ dùng file người dùng bỏ vào `assets/music/` (nhạc miễn phí bản quyền: YouTube Audio Library, Pixabay Music). Không tự tải nhạc có bản quyền.
- Edge TTS chạy qua shim `C:\video-studio\shared\edge-tts-shim` — không `npm update` gói `edge-tts-universal`.
- Không sao chép kịch bản/hình của kênh khác; video tham khảo chỉ dùng để học phong cách.
