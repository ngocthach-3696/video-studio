---
name: confirm-script-before-images
description: During script review, write each agreed line into kich-ban.md right away, but don't re-voice, regenerate images or rebuild until the user explicitly approves the final text
metadata:
  type: feedback
---

Khi review kịch bản: mỗi câu người dùng đã đồng ý thì GHI NGAY vào kich-ban.md (ghi đè, đánh dấu "ĐANG SỬA" ở đầu file). Nhưng KHÔNG đọc giọng lại, không sửa build-project.mjs/tts-ngat-nhip.txt, không dời ảnh, không chạy Flow cho đến khi người dùng chốt rõ ràng.

**Why:** 2026-11-14 tập 1885: tôi đã ghi kịch bản và tạo ảnh khi người dùng mới góp ý một câu ("khoan đã, tôi chưa chốt đoạn kết mà"). 2026-11-20 tập 1911: người dùng muốn file kịch bản luôn phản ánh những gì đã thống nhất: "hiện tại mỗi lần tôi review cứ sửa lại kịch bản đi đã".

**How to apply:** Một góp ý lẻ chưa phải là chốt cả bản, nhưng câu đã được duyệt ("B nhé", "ok đc đấy") thì sửa kich-ban.md ngay trong lượt đó và báo đã sửa. Các bước tốn credit/thời gian (TTS, ảnh, render) chỉ chạy khi người dùng nói chốt/làm đi. Xem thêm [[history-video-style-prefs]].
