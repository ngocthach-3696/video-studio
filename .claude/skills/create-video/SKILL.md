---
name: create-video
description: Tạo video MỚI dạng "so sánh / phân biệt X vs Y" — clip dọc 30-40s, layout 3-zone (2 card khái niệm, caption chạy chữ, robot MC), kịch bản 12 dòng, giọng Edge TTS, dựng bằng HyperFrames. Dùng khi người dùng nói "làm video so sánh X vs Y", "phân biệt X và Y", "/create-video X và Y". KHÔNG dùng cho video từ URL (→ create-news-video) hay video giải thích 1 chủ đề (→ remotion-topic-explainer). Project nằm ở <ROOT>\compare.
---

> `<ROOT>` = thư mục gốc repo video-studio (thư mục chứa `CLAUDE.md`, ví dụ `C:\video-studio` hoặc `D:\video-studio`). Thay bằng đường dẫn thực tế khi chạy lệnh.

# Create Comparison Video (bản local)

**Project:** `<ROOT>\compare` (bản sao của github.com/Cuongyd196/auto-compare-video).

## Bước 0 — bắt buộc

1. Đọc toàn bộ `<ROOT>\compare\.claude\skills\create-video\SKILL.md` và làm theo bước 1 → 9 trong đó. Các file `references/*.md` nó nhắc tới nằm ở `<ROOT>\compare\.claude\skills\create-video\references\`.
2. "Root repo" trong skill gốc = `<ROOT>\compare` (chứa `DESIGN.md`, `AGENTS.md`, `.env`, `videos/`). Đọc `DESIGN.md` và `AGENTS.md` trước khi dựng `index.html`.
3. Scaffold (bước 2) chạy với cwd = `<ROOT>\compare`:
   `node .claude/skills/create-video/scripts/scaffold.mjs <slug>`
   Các lệnh `npm run *` và `node scripts/generate-vo.mjs` chạy với cwd = `<ROOT>\compare\videos\<slug>`.

## Ghi đè cho máy này

- **Shell là Windows PowerShell 5.1**: không dùng `&&` (dùng `;`), không `mkdir -p`/`cp`.
- Node 22 + FFmpeg nằm ở `<ROOT>\tools` (đã có trong User PATH). Nếu shell báo không thấy `node`/`npx`, chạy trước: `$env:Path = "<ROOT>\tools\node;<ROOT>\tools\ffmpeg\bin;" + $env:Path`.
- `.env` ở `<ROOT>\compare\.env`: `TTS_PROVIDER=edge`, `CHANNEL=Tạp hóa nhà bơ`, `AUTO_CREATE_VIDEO=0` (dừng xác nhận kịch bản + trước khi render). Tôn trọng giá trị này.
- **Edge TTS** chạy qua shim `<ROOT>\shared\edge-tts-shim`. Video mới được scaffold tự kế thừa dependency `edge-tts-universal: file:../../../shared/edge-tts-shim` từ `videos/dev-vs-devops/package.json` — giữ nguyên, không đổi sang bản npm (bị Microsoft chặn 403).
- Không sinh lại VO của `videos/dev-vs-devops` hay `videos/thien-thach-vs-sao-bang` (timeline của chúng khớp với audio gốc).
- Báo kết quả bằng đường dẫn tuyệt đối tới MP4 trong `<ROOT>\compare\videos\<slug>\renders\`.
