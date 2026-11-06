---
name: remotion-topic-explainer
description: Tạo video ngắn 50-60s dọc 9:16 (1080x1920 @ 30fps) giải thích một chủ đề (công nghệ, mẹo gia dụng, kiến thức...) bằng Remotion + giọng đọc Edge TTS, 6 phân cảnh Hook → Pain → Solution → Flow → Benefits → CTA. Dùng khi người dùng nói "tạo video giải thích X", "làm video explainer về X", "/remotion-topic-explainer X". Project nằm ở <ROOT>\explainer.
---

> `<ROOT>` = thư mục gốc repo video-studio (thư mục chứa `CLAUDE.md`, ví dụ `C:\video-studio` hoặc `D:\video-studio`). Thay bằng đường dẫn thực tế khi chạy lệnh.

# Remotion Topic Explainer (bản local)

**Project:** `<ROOT>\explainer` (bản sao của github.com/Cuongyd196/remotion-cuongit-template).

## Bước 0 — bắt buộc

1. Đọc toàn bộ `<ROOT>\explainer\.claude\skills\remotion-topic-explainer\SKILL.md` và làm theo quy trình 5 bước trong đó.
2. Mọi đường dẫn tương đối trong skill gốc (`src/`, `scripts/`, `public/audio/`, `src/Root.tsx`...) tính từ `<ROOT>\explainer`. Chạy **mọi lệnh với cwd = `<ROOT>\explainer`**.
3. Tham khảo composition mẫu đã chạy được: `src/DockerExplainer/` (6 scene) trước khi viết scene mới.

## Ghi đè cho máy này

- **Shell là Windows PowerShell 5.1**: không dùng `&&`, `mkdir -p`, `cp`. Dùng `;` / `New-Item -ItemType Directory -Force` / `Copy-Item`.
- Node 22 + FFmpeg nằm ở `<ROOT>\tools` (đã có trong User PATH). Nếu shell báo không thấy `node`/`npx`, chạy trước: `$env:Path = "<ROOT>\tools\node;<ROOT>\tools\ffmpeg\bin;" + $env:Path`.
- **Thương hiệu**: lấy từ `CHANNEL_NAME` trong `<ROOT>\explainer\.env` (hiện là `TẠP HÓA NHÀ BƠ`). Không hardcode "CƯỜNG IT" trong component mới — đọc từ prop/const lấy theo `.env`.
- **Edge TTS** chạy qua shim `<ROOT>\shared\edge-tts-shim` (gói `edge-tts-universal` gốc bị Microsoft chặn 403). Không chạy `npm update`/`npm install edge-tts-universal@latest` — sẽ thay mất shim. Shim tự retry vì endpoint Edge hay đứt kết nối; mỗi câu có thể mất vài giây.
- Không chạy song song nhiều job TTS cùng lúc (Edge throttle).
- Render: `npx remotion render <TopicName> out/<TopicName>.mp4`; kiểm tra nhanh bằng `npx remotion still <TopicName> out/preview.png --frame 200` rồi dùng Read để xem ảnh trước khi render full.
- Báo kết quả bằng đường dẫn tuyệt đối tới file MP4 trong `<ROOT>\explainer\out\`.
