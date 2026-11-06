# Style bible — "Hoạt hình sử Việt" (chibi 2D, kể chuyện chính sử)

Rút ra từ phân tích 1 video mẫu (8 phút, 9:16) ngày 2026-11-04. Chỉ học **cấu trúc và phong cách** —
không chép kịch bản, nhân vật, mascot, logo hay tên kênh của họ.

---

## 1. Thông số kỹ thuật đo được

| Thông số | Video mẫu | Đặt cho mình |
|---|---|---|
| Khung | 1080x1920, 30fps | `format: "9:16"`, 30fps |
| Thời lượng | 482s (tập dài trong series) | Tập dài 5–8 phút, hoặc bản ngắn 60–90s |
| Số cảnh | 176 cảnh | ≈ **1 cảnh / 1 câu đọc** |
| Độ dài cảnh | TB 2,7s · trung vị 2,3s · 80% nằm trong 1,4–4,8s · dài nhất 10,6s | Cảnh 1,5–4s; cảnh "khoảnh khắc" (VD chữ LO) được giữ lâu |
| Mật độ cắt | 22–25 cắt/phút, đều từ đầu tới cuối | Không có đoạn chậm |
| Chuyển cảnh | **Cắt thẳng** (hard cut), chỉ fade-from-black 0,5s ở đầu | Bỏ crossfade |
| Chuyển động | Clip AI ngắn, chuyển động nhỏ: khói bay, nến lay, rèm bay, nhân vật run/đổ mồ hôi/chớp mắt | Không zoom/pan Ken Burns |
| Tốc độ đọc | ~223 từ/phút lúc nói (1.599 từ / 430s) | Edge TTS `rate: "+15%"` → `+20%` |
| Ngắt giữa câu | 76 lần ngắt > 0,25s, trung vị 0,33s | Ngắt ngắn, gần như liền mạch |
| Âm lượng | −14 LUFS, LRA 2,8 LU, true peak −0,9 dBFS | Chuẩn hoá `loudnorm=I=-14:LRA=3:TP=-1` |
| Nhạc nền | Chạy liên tục, không lúc nào im (< −40dB = 0 lần) | `musicVolume` thấp, duck dưới giọng |
| Cao độ giọng | Trung vị F0 ≈ 187 Hz (chưa xác nhận nam/nữ) | Giọng kể chuyện, nhịp nhanh, rõ chữ |

## 2. Kịch bản — cấu trúc

**Giọng văn:** người kể ngôi thứ nhất ("mình"), nói với khán giả ("các bạn"), câu cực ngắn,
mỗi câu một ý. Kể như nói chuyện, không văn sách.

**Khung một tập:**
1. **Hook (0–18s):** một nghịch lý tò mò ("tất cả vua đều xưng chữ Hán — có một người được gọi bằng tiếng Việt"),
   giới thiệu nhân vật bằng **một thành tích lạ** trong một câu.
2. **Nối series (18–28s):** "Tập trước… Tập này…" — đặt câu hỏi cho tập.
3. **Bối cảnh (~1 phút):** chuyện phía đối thủ / thời đại, gieo một cái tên "còn quay lại".
4. **Giới thiệu nhân vật:** quê, xuất thân, chi tiết đời thường dễ nhớ (vật trâu, đánh hổ).
5. **Hồi 1 → Hồi 2:** nói rõ "Đó là hết hồi một. Hồi hai là câu hỏi…".
6. **Phân tích "Thứ nhất / Thứ hai / Thứ ba":** giải thích *vì sao*, so với các nhân vật tập trước.
7. **Cao trào:** một khoảnh khắc chốt bằng **một chữ** (VD hai bộ sử cùng chép một chữ → chữ hiện to giữa màn hình).
8. **Hệ quả + vì sao di sản còn lại.**
9. **Quay lại câu hỏi đầu tập** và trả lời gọn trong 1–2 câu.
10. **Cliffhanger** sang tập sau (giới thiệu nhân vật mới, dừng giữa hành động).

**Kỹ thuật lặp lại (dùng có chủ đích):**
- "Mình thêm một ý, …" — chèn bình luận của người kể (3–4 lần/tập).
- "Toàn thư chép…" / "Sách giáo khoa dạy…" / "Sách đời sau bảo…" — luôn gắn nguồn cho từng chi tiết.
- Khi nguồn lệch nhau: "Chỗ này sử chép khác nhau, mình nói cả hai… Nếu các bạn học là X thì không sai."
- Giải nghĩa ngay từ Hán Việt: "Trấn là đè xuống, như trong chữ trấn áp."
- Callback: "Cái tên này còn quay lại", "lát nữa quay lại", "Tập ba, mình nói một quy luật".
- Đối xứng câu: "Người cứu An Nam, nay cai trị An Nam."; "Xưng đế là gửi một bức thư lên kinh đô. Xưng đô quân là không gửi gì cả."
- Mốc năm đứng một mình thành câu ("Rồi năm 767, …", "15 năm như thế.").

**Quy tắc câu cho TTS + phụ đề:** 6–15 từ/câu; câu dài tách bằng dấu phẩy thành cụm 3–6 từ (= 1 dòng phụ đề).

## 3. Hình ảnh

**Phong cách:** hoạt hình 2D vector kiểu webcomic giáo dục — nét viền đen đậm đều, tô màu phẳng
có 1 lớp đổ bóng mềm, nhân vật chibi đầu to (tỉ lệ ~1:3), mắt tròn to biểu cảm, biểu tượng cảm xúc
manga (giọt mồ hôi, vạch run, mặt đỏ). Nền chi tiết vừa phải, phối cảnh rõ.

**Prompt nền (dán vào `style` của project.json):**
```
2D cartoon illustration in a clean educational webcomic style, bold uniform black outlines,
flat cel shading with one soft shadow layer, chibi characters with large heads and big expressive
round eyes, manga emotion symbols (sweat drops, shaking lines), warm earthy palette of tan, brown,
brick red and muted teal, detailed but uncluttered background, 8th century Vietnam and Tang dynasty
setting, vertical composition with empty space in the upper third and the lower middle for text
```

**Bảng màu đo được (k-means, tỉ lệ diện tích):**
`#a78157` 12% · `#63452f` 11% · `#746a4b` 11% · `#3a2d25` 10% · `#cda06a` 9% · `#dec09c` 8% ·
`#9aa39e` 8% · `#cbdfe2` 8% · `#9b5733` 7% · `#191918` 7% — độ bão hoà TB 0,39, độ sáng TB 0,56.
→ Tông đất ấm + xanh xám nhạt; đỏ (cột cung điện, ghế) làm điểm nhấn; cảnh đêm/căng thẳng dùng xanh đen.

**Ngôn ngữ cảnh (xen kẽ đều):**
- Cận mặt nhân vật biểu cảm mạnh (≈30%) — gánh phần cảm xúc/hài.
- Trung cảnh hành động (≈35%).
- Toàn cảnh thành, làng, núi, biển (≈15%).
- **Bản đồ giấy cũ** khi nói địa danh/khoảng cách (≈5%).
- **Gag ẩn dụ** minh hoạ đúng câu nói (≈15%): lớp học giơ tay khi nói "sách giáo khoa dạy",
  hai cuốn sách mở cùng một chữ, tấm biển treo đổi tên, chồng giấy cao "15 năm".
- Vật/chữ trong ảnh được phép khi là chi tiết kể chuyện (biển tên, sách) — AI sinh chữ tiếng Việt hay sai dấu,
  nên ưu tiên để chữ đó ở lớp overlay thay vì trong ảnh.

**Nhân vật lặp lại** (giữ đồng nhất): mỗi nhân vật có 1 câu mô tả cố định + 1 ảnh tham chiếu.
Quy ước trang phục trong mẫu: quan nhà Đường = mũ phốc đầu đen hai cánh, áo tím; sử gia = khăn đen, áo xanh than,
râu bạc; hào trưởng Việt = cởi trần, khăn quấn đầu xanh, khoác da hổ; dân = áo nâu, nón lá.

## 4. Chữ trên màn hình (3 lớp)

| Lớp | Vị trí | Kiểu | Khi nào |
|---|---|---|---|
| Phụ đề | Giữa, ~70% chiều cao (y≈1350–1500), rộng tối đa ~75% | Sans **condensed bold** (Roboto Condensed / Oswald), trắng, viền đen ~4px + bóng nhẹ, 2 dòng tối đa | Luôn bật, cụm 3–6 từ, đổi theo nhịp giọng |
| Tiêu đề cảnh | Trên cùng, y≈80–200 | Condensed bold rất to, màu **kem `#f5e6c8`**, viền nâu đậm + bóng | Câu hỏi hook, mốc thời gian ("10 NĂM SAU", "776", "776 – 791"), từ khoá ("NGHÌN CÂN"), tên người lần đầu xuất hiện |
| Thương hiệu | Logo tròn góc dưới phải (~280px, viền đỏ); chữ chìm dọc cạnh phải giữa màn hình, xám mờ | Logo/mascot **của kênh mình** | Suốt video (chống reup) |

## 5. Âm thanh

- Giọng đọc nhanh, đều, rõ chữ; không kéo dài cuối câu. Câu hỏi tu từ đọc lên giọng nhẹ.
- Nhạc nền nhẹ, liên tục, không cao trào lớn; âm lượng thấp dưới giọng.
- Toàn bộ mix nén chặt, −14 LUFS.
- (Chưa xác nhận bằng tai) hiệu ứng âm thanh ngắn ở chuyển cảnh/tiêu đề — dùng thư viện `news\SFX` (trong thư mục gốc repo).

## 6. Đã hiện thực trong engine (2026-11-04)

`"preset": "cartoon"` trong project.json (xem `src/presets.mjs`) bật: cắt thẳng, nhịp cảnh ngắn
(lead 0,05s / pad 0,15s), motion `breathe`, tốc độ đọc +15%, phụ đề Noto Sans Condensed Bold 82px,
tiêu đề cảnh (`title`), logo `assets/brand/logo.png` + chữ chìm (`brand.watermark`), fade-in 0,5s,
loudnorm −14 LUFS, nhân vật cố định (`characters` + ảnh tham chiếu), clip AI chỉ cho cảnh có `video`.
Skill: `/cartoon-history-video`.
