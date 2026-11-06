# Video Studio (local)

Hệ thống tạo video ngắn 9:16 chạy local, gộp từ 3 repo của Cuongyd196.

| Thư mục | Repo gốc | Engine | Loại video | Skill (Claude Code) |
|---|---|---|---|---|
| `explainer/` | remotion-cuongit-template | Remotion (React) | Giải thích 1 chủ đề, 50-60s, 6 cảnh | `/remotion-topic-explainer <chủ đề>` |
| `news/` | auto-video-gen | HyperFrames (HTML+GSAP) | Từ URL / file .txt → video ~60s + caption | `/create-news-video <url hoặc file.txt>` |
| `compare/` | auto-compare-video | HyperFrames | So sánh X vs Y, 30-40s, robot MC | `/create-video <X> và <Y>` |
| `history/` | (tự xây) | FFmpeg | Kể chuyện lịch sử bằng ảnh AI + Ken Burns + phụ đề, 9:16 hoặc 16:9 | `/history-video <chủ đề>` |
| `history/` (preset `cartoon`) | (tự xây) | FFmpeg | Hoạt hình 2D chibi kể chính sử, cắt nhanh, nhân vật cố định, tiêu đề cảnh, logo | `/cartoon-history-video <chủ đề>` |

### history/
- `node src/make.mjs projects/<slug>` — đọc `projects/<slug>/project.json` → `final.mp4`. `--images-only` để duyệt ảnh trước, `--redo s003` để tạo lại 1 ảnh.
- Nguồn ảnh trong `history/.env` (`IMAGE_PROVIDER`): `fal` (mặc định, cần `FAL_KEY`), `pollinations` (miễn phí, chỉ đủ thử — ~1 ảnh/phút, bám prompt kém), `openai`, `gemini` (cần key), `manual` (tự tạo theo `images/prompts.txt`).
- Mức 3 — ảnh → clip video AI: `ANIMATE=fal` (Kling 2.6 Pro qua fal.ai, ~$0.35/cảnh). `--no-animate` để xem trước miễn phí bằng hiệu ứng zoom/pan.
- Nhạc nền: bỏ file nhạc miễn phí bản quyền vào `history/assets/music/`.
- Ví dụ: `history/projects/bach-dang-938/`.
- Preset `cartoon` (`"preset": "cartoon"`): xem `history/styles/hoat-hinh-su-viet.md` và `history/src/presets.mjs`. `--characters-only` tạo ảnh tham chiếu nhân vật (`characters/<key>.jpg`). Logo kênh: `history/assets/brand/logo.png`. Bản sao lưu code trước khi thêm preset: `history/src.bak-20261104`.

Skill được cài ở mức user (`C:\Users\Admin\.claude\skills\`), gọi được từ mọi workspace trong Claude Code. Bản sao nằm trong repo ở `.claude/skills/` (dùng được khi mở Claude Code ở `C:\video-studio`).

## Cài trên máy mới

1. Clone repo về **đúng** `C:\video-studio` (skill ghi đường dẫn tuyệt đối).
2. `powershell -ExecutionPolicy Bypass -File C:\video-studio\setup.ps1` — tải Node 22 + FFmpeg portable vào `tools/`, thêm vào PATH, `npm install` các project, tạo venv edge-tts + yt-dlp (nếu có Python), tạo file `.env` từ `.env.example`.
3. Điền lại key / tên kênh trong các file `.env` (không có trên GitHub).
4. Video thành phẩm (`*.mp4`, `*.wav`) và `clips/` không được đẩy lên — render lại nếu cần.

## Thành phần khác

- `tools/node` — Node.js 22 portable · `tools/ffmpeg` — FFmpeg 9 · `tools/pyedge` — Python edge-tts (dự phòng, CLI `edge-tts.exe`). `node` + `ffmpeg` đã thêm vào User PATH (mở terminal mới để có hiệu lực).
- `shared/edge-tts-shim` — thay thế `edge-tts-universal@1.4.0` (bị Microsoft trả 403 do đổi thuật toán token Sec-MS-GEC v2). Chạy trên `msedge-tts@2.1.1`, tự retry vì endpoint Edge hay đứt. Cả 3 project trỏ tới nó qua `file:` dependency — **đừng `npm update` gói này**.

## Cấu hình

- Thương hiệu "Tạp hóa nhà bơ": `explainer/.env` (`CHANNEL_NAME`), `compare/.env` (`CHANNEL`), `news/.env.local` (`TIKTOK_*`).
- `news/.env.local` có `TIKTOK_HANDLE=@taphoanhabo` — **placeholder, sửa thành handle thật**. Avatar ở `news/assets/avatar.jpg`.
- Giọng đọc: `vi-VN-HoaiMyNeural` (nữ) / `vi-VN-NamMinhNeural` (nam) trong từng file env.

## Lệnh thủ công

```powershell
# explainer
cd C:\video-studio\explainer; npm run dev                       # Remotion Studio http://localhost:3000
npx remotion render DockerExplainer out/DockerExplainer.mp4

# news
cd C:\video-studio\news; npm run pipeline -- output/<slug>/script.json
npm run rerender -- output/<slug>                                # render lại, giữ voice

# compare
cd C:\video-studio\compare\videos\dev-vs-devops; npm run dev     # preview
npm run check; npm run render
```
