# Style — "Hoạt hình sử Việt, chuyển động AI" (video mẫu Facebook.mp4)

Người dùng chọn style này ngày 2026-11-06 ("tôi muốn style như này"). Video mẫu là `Facebook.mp4`
(file nằm trong Downloads của người dùng, không có trong repo): hoạt hình lịch sử Việt, 8,4 phút.
Chỉ học **phong cách và cách chuyển động**. Không chép kịch bản, nhân vật, logo hay tên kênh của họ.
Cấu trúc kịch bản, chữ và âm thanh dùng chung với [hoat-hinh-su-viet.md](hoat-hinh-su-viet.md).

## Thông số đo được

| Thông số | Video mẫu |
|---|---|
| Khung | 1920x1080 (16:9), 30fps. Kênh của mình đăng Facebook nên vẫn làm **9:16** trừ khi người dùng nói khác |
| Thời lượng | 504s |
| Số cảnh | ~194 |
| Độ dài cảnh | TB 2,6s · trung vị 2,3s · 80% trong 1,3–4,3s · dài nhất 7,3s |
| Chuyển cảnh | Cắt thẳng |
| Âm lượng | −14 LUFS (kênh mình đang dùng −16 theo góp ý của người dùng) |
| Chữ | Tiêu đề cảnh lớn ở trên ("TRƯỚC NĂM 43", "NĂM 40"), phụ đề trắng viền đen ở giữa phía dưới, logo tròn góc phải dưới |

## Hình ảnh
- 2D, nét viền đen rõ, màu phẳng tươi, nhân vật kiểu hoạt hình đầu hơi to (gần chibi), biểu cảm phóng đại
  (mồ hôi, mắt trợn, nhăn mày).
- Nhiều cận mặt nhân vật xen với toàn cảnh làng, thành, chiến trường.

## Chuyển động (quan trọng nhất)
Mỗi cảnh là **clip AI tạo từ ảnh** (image-to-video, kiểu Veo/Kling), không phải Ken Burns và không phải hiệu ứng ghép:
- **Nhân vật:** mắt liếc qua lại, mặt hơi quay, chớp mắt, thở. Cử động nhỏ, không đi lại nhiều.
- **Vật thể:** cờ phấp phới, giấy bay lả tả, bó tre bay, bụi tung, khói bếp bốc, đuốc cháy.
- **Hiệu ứng hoạt hình:** vệt gió trắng lướt ngang khung, bụi li ti.
- **Camera:** gần như đứng yên, hoặc đẩy vào rất nhẹ.
- Cảnh phong cảnh hay đông người: gần như tĩnh, chỉ có lửa và khói cử động.

## Cách làm ở repo này
- Cảnh có nhân vật hoặc vật cần cử động thật (mắt, cờ, giấy): cần **clip AI** (Flow/Veo, Kling hoặc Wan qua fal.ai,
  hoặc gói miễn phí). Prompt theo mẫu: "Animate this exact illustration, keep the same 2D style, outlines, colors
  and faces. Subtle motion only: <mắt liếc / cờ bay / giấy bay…>. Static camera. No new characters, no text."
  Mỗi clip chỉ lấy 2–4 giây đẹp nhất.
- Cảnh tĩnh (phong cảnh, bản đồ, làng): dùng hiệu ứng local miễn phí `"fx"` (src/fx.py), gồm lửa nhấp nháy,
  khói hoặc sương, bụi, nước gợn, camera trôi 2.5D.
- Chi phí cho mỗi clip AI phải hỏi người dùng trước khi chạy.
