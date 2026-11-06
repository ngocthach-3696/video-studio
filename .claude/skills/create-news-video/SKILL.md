---
name: create-news-video
description: Tạo video tin ngắn 9:16 (~60s, 60fps) từ một URL (bài báo, repo GitHub, trang sản phẩm) hoặc file .txt/.md tiếng Việt — viết kịch bản script.json, sinh giọng Edge TTS, render HyperFrames, mix SFX, xuất video.mp4 + caption.txt. Dùng khi người dùng nói "làm video từ link này", "tạo video tin tức", "biến bài viết thành video", "/create-news-video <url|file>". Project nằm ở <ROOT>\news.
---

> `<ROOT>` = thư mục gốc repo video-studio (thư mục chứa `CLAUDE.md`, ví dụ `C:\video-studio` hoặc `D:\video-studio`). Thay bằng đường dẫn thực tế khi chạy lệnh.

# Create News Video (bản local)

**Project:** `<ROOT>\news` (bản sao của github.com/Cuongyd196/auto-video-gen).

## Bước 0 — bắt buộc

1. Đọc toàn bộ `<ROOT>\news\.claude\skills\create-news-video\SKILL.md` và làm theo Step 1 → 9 trong đó.
2. Đọc schema ở `<ROOT>\news\docs\superpowers\specs\2026-04-29-auto-news-video-design.md` (Section 4) trước khi viết `script.json`. Ví dụ hợp lệ: `<ROOT>\news\tests\fixtures\sample-script-*.json`.
3. Mọi đường dẫn tương đối (`output/`, `assets/sfx/`, `npm run pipeline`...) tính từ `<ROOT>\news`. Chạy **mọi lệnh với cwd = `<ROOT>\news`**.

## Ghi đè cho máy này

- **Shell là Windows PowerShell 5.1**: Step 3 dùng `New-Item -ItemType Directory -Force output\<slug>-<timestamp>` thay cho `mkdir -p`. Không dùng `&&`.
- Node 22 + FFmpeg nằm ở `<ROOT>\tools` (đã có trong User PATH). Nếu shell báo không thấy `node`/`npx`, chạy trước: `$env:Path = "<ROOT>\tools\node;<ROOT>\tools\ffmpeg\bin;" + $env:Path`.
- **Thương hiệu kênh là "Tạp hóa nhà bơ"**, KHÔNG phải CườngIT:
  - `metadata.channel` = `"Tạp hóa nhà bơ"`.
  - Outro `voiceText`: `"Theo dõi Tạp hóa nhà bơ để xem thêm mẹo hay mỗi ngày."` (hoặc biến thể phù hợp chủ đề).
  - Outro line `emphasis: "channel"` = `"Tạp hóa nhà bơ"`.
  - Hashtag kênh trong caption.txt: `#taphoanhabo` thay cho `#cuongit`.
  - Bỏ qua dòng phiên âm "Cường ai ti" trong bảng TTS của skill gốc.
- `voice.provider` trong script.json: dùng `"edge-tts"` (miễn phí, đã cấu hình trong `.env.local`). Chỉ dùng lucylab/vbee/elevenlabs nếu người dùng đã điền key.
- **Edge TTS** chạy qua shim `<ROOT>\shared\edge-tts-shim` (gói `edge-tts-universal` gốc bị Microsoft chặn 403). Không `npm update` gói này. Shim tự retry; mỗi scene có thể mất vài giây.
- **Render chậm**: ~8 phút cho 27s video (60fps). Chạy pipeline foreground với timeout 10 phút; nếu video ~60s, chạy nền (`run_in_background`) và chờ thông báo thay vì poll.
- Nếu URL là trang sản phẩm Shopee (render bằng JS, WebFetch thường không đọc được): yêu cầu người dùng dán mô tả sản phẩm vào file .txt, hoặc dùng `post_manual.py`/dữ liệu sản phẩm sẵn có trong `C:\Users\Admin\OneDrive\Desktop\Shopee affiliate bot`.
- Báo kết quả bằng đường dẫn tuyệt đối trong `<ROOT>\news\output\<slug>-<timestamp>\`.
