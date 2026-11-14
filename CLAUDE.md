# Video Studio — quy tắc cho Claude

Đây là bản sao bộ nhớ (rule, style, kinh nghiệm) của chủ repo, để dùng được trên mọi máy.
Xem tổng quan repo ở @README.md. Cài đặt trên máy mới: làm theo `SETUP-MAY-MOI.md`.

**Đường dẫn:** repo có thể nằm ở ổ khác (máy có thể không có ổ C:). Trong skill, README và ghi chú bên dưới,
`<ROOT>` hoặc `C:\video-studio` = thư mục gốc repo này (thư mục chứa file CLAUDE.md), và `C:\Users\Admin` = thư mục
người dùng hiện tại (`$env:USERPROFILE`). Luôn đổi sang đường dẫn thực tế trước khi chạy lệnh.
Node/FFmpeg portable nằm ở `<ROOT>\tools\node` và `<ROOT>\tools\ffmpeg\bin`.

## Quy tắc & style của người dùng
@.claude/memory/reply-in-vietnamese.md
@.claude/memory/history-video-style-prefs.md
@.claude/memory/flow-project-per-topic.md
@.claude/memory/confirm-dates.md
@.claude/memory/workspace-split.md
@.claude/memory/confirm-script-before-images.md

## Bối cảnh dự án & lưu ý kỹ thuật
@.claude/memory/video-studio.md
@.claude/memory/voice-clone-status.md

## Giữ đồng bộ
Khi ghi nhớ rule/style mới vào auto-memory, cập nhật luôn file tương ứng trong `.claude/memory/`
(và thêm dòng `@` ở trên nếu là file mới) để lần push sau mang theo.
