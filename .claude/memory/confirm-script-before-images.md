---
name: confirm-script-before-images
description: Do not regenerate images or edit project files for a script change until the user explicitly approves the final text
metadata:
  type: feedback
---

Khi đề xuất sửa kịch bản (lời đọc), chỉ đưa bản nháp và CHỜ người dùng chốt rõ ràng. Không ghi vào kich-ban.md/build-project.mjs, không dời ảnh, không chạy Flow tạo ảnh.

**Why:** 2026-11-14 tập 1885: người dùng mới góp ý từng câu đoạn kết (câu 79, câu chào) thì tôi đã ghi kịch bản và bắt đầu tạo ảnh. Người dùng phải ngắt: "khoan đã, tôi chưa chốt đoạn kết mà".

**How to apply:** Một góp ý lẻ (sửa một câu) KHÔNG phải là chốt. Sau mỗi lượt sửa, trình bày bản đầy đủ và hỏi "chốt chưa?". Chỉ làm tiếp khi người dùng nói rõ là chốt/ok/làm đi. Xem thêm [[history-video-style-prefs]].
