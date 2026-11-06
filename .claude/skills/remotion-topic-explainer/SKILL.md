---
name: remotion-topic-explainer
description: Tạo video ngắn 50-60s dọc 9:16 (1080x1920 @ 30fps) giải thích một chủ đề (công nghệ, mẹo gia dụng, kiến thức...) bằng Remotion + giọng đọc Edge TTS, 6 phân cảnh Hook → Pain → Solution → Flow → Benefits → CTA. Dùng khi người dùng nói "tạo video giải thích X", "làm video explainer về X", "/remotion-topic-explainer X". Project nằm ở C:\video-studio\explainer.
---

# Remotion Topic Explainer (bản local)

**Project:** `C:\video-studio\explainer` (bản sao của github.com/Cuongyd196/remotion-cuongit-template).

## Bước 0 — bắt buộc

1. Đọc toàn bộ `C:\video-studio\explainer\.claude\skills\remotion-topic-explainer\SKILL.md` và làm theo quy trình 5 bước trong đó.
2. Mọi đường dẫn tương đối trong skill gốc (`src/`, `scripts/`, `public/audio/`, `src/Root.tsx`...) tính từ `C:\video-studio\explainer`. Chạy **mọi lệnh với cwd = `C:\video-studio\explainer`**.
3. Tham khảo composition mẫu đã chạy được: `src/DockerExplainer/` (6 scene) trước khi viết scene mới.

## Ghi đè cho máy này

- **Shell là Windows PowerShell 5.1**: không dùng `&&`, `mkdir -p`, `cp`. Dùng `;` / `New-Item -ItemType Directory -Force` / `Copy-Item`.
- Node 22 + FFmpeg nằm ở `C:\video-studio\tools` (đã có trong User PATH). Nếu shell báo không thấy `node`/`npx`, chạy trước: `$env:Path = "C:\video-studio\tools\node;C:\video-studio\tools\ffmpeg\bin;" + $env:Path`.
- **Thương hiệu**: lấy từ `CHANNEL_NAME` trong `C:\video-studio\explainer\.env` (hiện là `TẠP HÓA NHÀ BƠ`). Không hardcode "CƯỜNG IT" trong component mới — đọc từ prop/const lấy theo `.env`.
- **Edge TTS** chạy qua shim `C:\video-studio\shared\edge-tts-shim` (gói `edge-tts-universal` gốc bị Microsoft chặn 403). Không chạy `npm update`/`npm install edge-tts-universal@latest` — sẽ thay mất shim. Shim tự retry vì endpoint Edge hay đứt kết nối; mỗi câu có thể mất vài giây.
- Không chạy song song nhiều job TTS cùng lúc (Edge throttle).
- Render: `npx remotion render <TopicName> out/<TopicName>.mp4`; kiểm tra nhanh bằng `npx remotion still <TopicName> out/preview.png --frame 200` rồi dùng Read để xem ảnh trước khi render full.
- Báo kết quả bằng đường dẫn tuyệt đối tới file MP4 trong `C:\video-studio\explainer\out\`.
