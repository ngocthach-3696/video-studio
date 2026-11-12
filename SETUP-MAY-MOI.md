# Cài video-studio trên máy mới — hướng dẫn cho Claude

> Người dùng sẽ nhờ Claude Code làm theo file này trên máy mới. Trả lời người dùng bằng **tiếng Việt**.
> Shell: Windows PowerShell 5.1 (không có `&&`; dùng `;` hoặc `if ($?) { }`).
> `<ROOT>` = thư mục repo (mặc định `C:\video-studio`). Làm lần lượt; bước nào lỗi thì dừng lại báo người dùng.

## 0. Yêu cầu sẵn có (người dùng tự cài nếu thiếu)
- **Git for Windows** — `git --version`
- **Claude Code** (VS Code extension hoặc CLI) — đang dùng để đọc file này
- **Google Chrome** đã đăng nhập tài khoản Google dùng Google Flow
- **Python 3.12** (không bắt buộc — chỉ cho edge-tts dự phòng, yt-dlp, `yt-audio-gui`). Cài từ python.org, tick "Add to PATH".

## 1. Clone repo
```powershell
git clone <link-repo-private> C:\video-studio
```
Lần đầu Windows hiện cửa sổ đăng nhập GitHub → người dùng đăng nhập. Sau đó mở Claude Code tại `C:\video-studio`.

## 2. Chạy script cài đặt
```powershell
powershell -ExecutionPolicy Bypass -File C:\video-studio\setup.ps1
```
Script làm: tải Node.js 22 + FFmpeg portable vào `<ROOT>\tools\` và thêm vào User PATH → `npm install` cho
`shared\edge-tts-shim`, `explainer`, `news`, `history` → tạo venv `tools\pyedge` (edge-tts) + `pip install yt-dlp`
nếu có Python → tạo các file `.env` từ `.env.example`.

Kiểm tra (mở terminal MỚI để có PATH):
```powershell
node -v; ffmpeg -version | Select-Object -First 1
Test-Path C:\video-studio\news\node_modules, C:\video-studio\history\node_modules, C:\video-studio\explainer\node_modules
```
Nếu terminal cũ chưa thấy `node`/`ffmpeg`: `$env:Path = "C:\video-studio\tools\node;C:\video-studio\tools\ffmpeg\bin;" + $env:Path`

**Không** chạy `npm update` cho gói `edge-tts-universal` — nó trỏ tới `shared/edge-tts-shim` (bản sửa lỗi 403 của Microsoft).

## 3. Điền file .env (không có trên GitHub)
Cách nhanh nhất: người dùng **chép 4 file này từ máy cũ** (USB / Drive riêng tư), đè lên file vừa tạo:

| File | Dùng cho | Biến quan trọng |
|---|---|---|
| `explainer\.env` | /remotion-topic-explainer | `CHANNEL_NAME`, giọng `EDGE_TTS_VOICE` |
| `compare\.env` | /create-video | `CHANNEL`, `TTS_PROVIDER`, `EDGE_VOICE` |
| `news\.env.local` | /create-news-video | `TIKTOK_DISPLAY_NAME`, `TIKTOK_HANDLE`, `ELEVENLABS_API_KEY` (nếu dùng) |
| `history\.env` | /cartoon-history-video | `VIBI_API_KEY` (giọng Tuấn Anh — key xem ở vibi.pro/docs khi đã đăng nhập), `IMAGE_PROVIDER`, `ELEVENLABS_API_KEY`, `FAL_KEY` (nếu dùng fal) |

Nếu không có file cũ: hỏi người dùng từng giá trị; tên kênh/giọng xem trong `README.md` và `.claude/memory/`.
Không bao giờ commit các file `.env`.

### Hiệu ứng local `"fx"` (tuỳ chọn, history/src/fx.py)
```powershell
pip install opencv-python-headless onnxruntime
```
Tải model `onnx/model.onnx` từ Hugging Face `onnx-community/depth-anything-v2-small` → lưu thành `tools\models\depth_anything_v2_small.onnx` (thư mục này không có trên GitHub).

## 4. Playwright MCP (để điều khiển Google Flow / ElevenLabs trên Chrome)
```powershell
claude mcp add --scope user playwright -- C:/video-studio/tools/node/npx.cmd -y @playwright/mcp@0.0.83 --extension
```
- Người dùng cài extension **"Playwright MCP Bridge"** trên Chrome (Chrome Web Store).
- Khởi động lại Claude Code → `claude mcp list` phải thấy `playwright ... Connected`.
- Lần gọi tool đầu tiên Chrome hiện hộp thoại → người dùng chọn tab và bấm "Allow & select".
- Quy tắc: chỉ dùng Chrome thật đã đăng nhập của người dùng; gặp captcha thì để người dùng tự giải.
- Extension chỉ phục vụ 1 phiên Claude Code tại một thời điểm.

## 5. Tài khoản web người dùng tự đăng nhập trên Chrome
- **Google Flow** (flow.google.com) — tạo ảnh Nano Banana.
- **ElevenLabs** (elevenlabs.io) — giọng "Tung Dang" (voice id `3VnrjnYrskPMDsapTr8X`, model Eleven v4).
- **Facebook / Business Suite** — trang "Vy kể chuyện Sử" (người dùng tự đăng bài).

## 6. Kiểm tra cuối
- Trong Claude Code gõ `/` → thấy 4 skill: `cartoon-history-video`, `create-news-video`,
  `create-video`, `remotion-topic-explainer` (nằm ở `<ROOT>\.claude\skills\`).
- `CLAUDE.md` tự nạp rule/style của người dùng từ `.claude/memory/` — hỏi thử "style video lịch sử của tôi là gì?".
- Thử render nhanh không tốn tiền:
  ```powershell
  cd C:\video-studio\history; node src/make.mjs projects/mua-do-thanh-co-1972
  ```
  (ảnh, audio, nhạc của project đều nằm trong repo; render lại từ đầu có thể mất 10+ phút). Ra `final.mp4` là OK.

## 7. Những thứ KHÔNG có trên GitHub (cố ý)
- `node_modules/`, `tools/node`, `tools/ffmpeg`, `tools/pyedge` → `setup.ps1` cài lại.
- File `.env*` (bí mật) → bước 3.
- Video thành phẩm `*.mp4`, `*.wav`, thư mục `clips/`, `news/output/`, `explainer/out/` → render lại.
- `.playwright-mcp/` (snapshot chứa email Google).
- Thư viện SFX lớn của news (`news/SFX/`) → `cd C:\video-studio\news; npm run sfx:download` nếu cần.

## 8. Giữ đồng bộ giữa 2 máy
- Trước khi làm: `git pull`. Làm xong: `git add -A; git commit -m "..."; git push`.
- Khi Claude ghi nhớ rule/style mới vào auto-memory, cập nhật luôn file trong `.claude/memory/` (xem `CLAUDE.md`)
  để lần push sau máy kia cũng có.
