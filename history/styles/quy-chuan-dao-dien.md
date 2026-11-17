# Quy chuẩn đạo diễn — học từ 2 video mẫu (2026-11-15)

Nguồn: hai file trong Downloads, tải ngày 2026-11-15.
- **Video A** = `Facebook.mp4`: dọc 1080x1920, 5:32, 95 cảnh. Chủ đề: lính Quảng Ngãi đi đồn thú Trấn Tây (1835–1841). Kể ở ngôi "bạn".
- **Video B** = `Facebook (1).mp4`: ngang 1920x1080, 29:54, khoảng 400 cảnh. Chủ đề: 60 ngày đêm giữ Hà Nội (19/12/1946 – 17/2/1947), nhân vật trung tâm Vương Thừa Vũ.

Cách đo: lời thoại chép bằng faster-whisper (mốc thời gian lấy từ đó, chính tả Whisper có thể sai vài chữ). Tách cảnh bằng ffmpeg scene > 0.25. Chuyển động camera đo bằng cách khớp điểm ảnh giữa khung đầu và khung cuối mỗi cảnh (tỉ lệ phóng, độ trượt, phần trăm điểm ảnh tự chuyển động sau khi bù camera). Mọi nhận xét dưới đây đều dựa trên khung hình hoặc lời thoại xem được; chỗ nào là suy luận thì có ghi rõ.

---

## 0. Năm điểm chung quan trọng nhất (nên kế thừa trước tiên)

1. **Một câu hỏi trung tâm, đặt sớm, trả lời muộn.** A: "thứ đáng sợ nhất lại không phải là giặc" (0:43) → mãi 2:57 mới lộ ra là "lam chướng", rồi 3:04 là "đàn muỗi kia". B: "Vì sao Pháp có xe tăng mà Vương Thừa Vũ giữ được Hà Nội 60 ngày?" (0:42), trả lời từng phần ở 11:24, 14:24, 18:24, 24:12, trả lời trọn ở 24:30.
2. **Gieo rồi gặt (callback).** A: "Sổ ấy dùng để thu thuế và cũng dùng để bắt lính" (0:10) quay lại thành câu kết đau nhất: "lần hiếm hoi… được triều đình nhắc tới, mà không phải để thu thuế hay bắt lính" (5:13). B: cầu Long Biên ở 1:13 ("đi dưới nó để ra… đi trên nó để đi") được gặt ở 21:43 ("Không phải trên cầu, dưới cầu") và 25:46 (lính Pháp rút qua chính cây cầu ấy).
3. **Lịch sử kể bằng con số cụ thể và chi tiết đời thường, không bằng tính từ.** "1 quan tiền, 1 phương gạo" (A 0:30), "đề đốc 120, gấp 10 lần bạn" (A 2:15), "mỗi khẩu súng còn trung bình 4–5 viên đạn" (B 20:31), "44 chiếc thuyền" (B 22:08). Không có câu nào kiểu "vô cùng gian khổ", "hết sức anh dũng".
4. **Mỗi câu = một hình minh họa đúng nghĩa đen của câu đó**, nhân vật chính lặp lại xuyên suốt với cùng thiết kế, chữ đặt ngay trong cảnh (biển gỗ, bảng đen, sổ sách), chữ lớn trên màn hình chỉ dành cho câu hỏi và con số then chốt.
5. **Ảnh tĩnh được "thở" bằng hai lớp:** camera đẩy hoặc kéo rất chậm, khoảng 7%, cảnh vào cảnh ra xen kẽ (A 57%, B 83% số cảnh), và chuyển động cục bộ (khói, bụi, mưa, sương, cờ bay, nhân vật run, chớp mắt, giơ tay). Không có cú máy mạnh. Cảnh được đổi liên tục, cứ 2,5–4,5 giây lại sang hình mới.

Điểm khác nhau (để biết chọn cái gì cho video dọc ngắn của mình):

| | A (dọc, 5 phút) | B (ngang, 30 phút) |
|---|---|---|
| Ngôi kể | "bạn", người xem nhập vai một người lính vô danh | ngôi thứ ba, người dẫn chuyện tự gọi mình là "tập này" |
| Thời lượng một cảnh | trung vị khoảng 2,6 s, trung bình 3,5 s | trung bình khoảng 4,4 s |
| Cỡ cảnh chủ đạo | trung cảnh và cận cảnh nhân vật | toàn cảnh, cảnh nhìn từ trên cao xuống phố, bản đồ |
| Chuyển chương | cắt thẳng, lúc xúc động thì mờ qua đen | vệt nhòe lướt ngang (whip-pan) hoặc mờ qua đen |

Với video dọc 9:16 của kênh, **xương sống nên theo A** (nhập vai, nhịp nhanh, cận nhân vật). Từ B học **kiến trúc câu chuyện** (câu hỏi lớn, gieo và gặt, ẩn dụ giải thích cơ chế, sự trung thực với nguồn). (2026-11-17: KHÔNG lặp câu khuôn "Lý do thứ nhất/thứ hai" từ tập này sang tập khác, người dùng chê bắt chước; mỗi tập tự nghĩ cách lật riêng.)

---

## 1. Cách kể chuyện và lời thoại

### 1.1 Mở đầu
**A, 0:00–0:22:** chữ lớn "CHƯA ĐÁNH TRẬN NÀO, ĐÃ CHẾT" hiện ngay khung đầu, trên hình người nông dân bị khoanh vòng đỏ (một nghịch lý). Câu đầu: "Bạn không chọn được nơi mình sinh ra." (câu triết lý ngắn, chạm vào người xem). Tiếp theo đặt người xem vào thân phận cụ thể: "Lần này, bạn là một nông dân ở Quảng Ngãi năm 1835, đời vua Minh Mệnh." Chỉ ba câu sau đã có biến cố: "và cái tên được khoanh trong sổ làng bạn là tên bạn" (0:19).

**B, 0:00–1:22:** mở bằng **giờ phút chính xác** "8 giờ 3 phút tối ngày 19 tháng 12 năm 1946", một người đang chờ một tín hiệu: "điện tắt, đó là lệnh tấn công" (0:08). Tiếp theo là **so sánh lực lượng chênh lệch**: Pháp có xe tăng, pháo, máy bay; ta có súng trường và "bom ba càng… ôm quả bom ấy chạy vào xe tăng thì không trở ra" (0:35). Sau đó là **kỳ vọng đối lập với kết quả**: "chỉ mong giữ được 1 tháng" (0:38), đẩy thẳng vào câu hỏi trung tâm (0:42). Rồi **trailer hứa hẹn 4 cảnh** sẽ thấy (0:47–1:12). Cuối cùng là **khung chủ đề hình gương**: "câu chuyện về 1 cây cầu. Người giữ thành phố đi dưới nó để ra. Gần 8 năm sau, người chiếm thành phố đi trên nó để đi." (1:13).

**Công thức mở đầu chung:** (1) một hình ảnh hoặc câu nghịch lý ngay khung 0; (2) neo thời gian và địa điểm thật cụ thể; (3) chênh lệch hoặc mâu thuẫn; (4) câu hỏi trung tâm trong khoảng 45 giây đầu (với video 5 phút thì trong 20 giây đầu); (5) hứa hẹn điều người xem sẽ được thấy.

### 1.2 Dẫn dắt, tiết lộ, cao trào
- **Gieo mối nguy giấu tên.** A 0:39–0:45: "Người trong làng dặn bạn cẩn thận giặc Xiêm… nhưng không ai nói… thứ đáng sợ nhất lại không phải là giặc." Đến 2:33 nhắc lại theo kiểu đố: "có 1 thứ được chia rất đều, không kể phẩm hàm" (chữ trên màn hình: "THỨ GÌ CHIA ĐỀU?"). Sau đó mới tả triệu chứng trước khi gọi tên (2:37–2:57: mùa mưa, muỗi, người nằm cạnh run cầm cập, điểm danh không ai thưa) → tên cổ "lam chướng" → tên hiện đại "sốt rét" → thủ phạm "đàn muỗi kia". Tiết lộ theo **ba lớp**, mỗi lớp gần người xem hơn.
- **Thế lưỡng nan có ba cửa, đóng từng cửa một.** A 3:31–3:58: "Vậy thì trốn? Bạn tính thử." → không biết bao giờ được về; trốn thì làng phải bắt người khác thế, "có thể là em bạn, là hàng xóm của bạn" → "Còn một đường về nữa, và là đường chắc chắn nhất. Nếu bạn chết trận, sổ sách có sẵn một khoản tiền đưa hài cốt bạn về quê." Cao trào bằng **sự mỉa mai lạnh**, không bằng cảm thán.
- **Đếm lý do.** B chia câu trả lời thành "lý do thứ nhất… thứ hai… thứ ba… thứ tư và là lý do cuối" (11:24, 14:24, 18:24, 24:12). Mỗi lý do kết bằng một câu tóm gọn như châm ngôn: "Người chọn giờ không phải là người có xe tăng." (11:38). Đến 14:39 trả lời nửa câu hỏi, 24:30 trả lời trọn bằng cách đọc lại cả bốn lý do.
- **Lật lại chính câu hỏi.** B 25:02: "Nhưng câu hỏi ấy có 1 chỗ không đúng hẳn… Cái được giữ 60 ngày không phải cả thành phố, nó là 1 khu phố cổ, 1 trung đoàn và 1 lời thề trở lại." Đây là cú twist cuối, nâng câu chuyện từ quân sự lên ý nghĩa.
- **Giảm tốc có báo trước** khi cần giải thích một cơ chế: "Hãy nhìn vào một bức tường." (B 12:02), "Bây giờ nhìn rộng ra." (B 12:52). Câu ngắn ra lệnh cho mắt người xem, hình đi theo đúng lệnh đó.

### 1.3 Kể sinh động, không giống sách giáo khoa
- **Nhập vai bằng ngôi "bạn" (A):** mọi chi tiết hành chính khô khan đều được biến thành chuyện của "bạn": lương, cấp bậc, lệ thưởng. "Bạn 12 quan 1 năm, suất thập 18 quan, cai đội 30, lãnh binh 90, đề đốc 120, gấp 10 lần bạn." (2:08–2:18).
- **Sự mỉa mai của bộ máy:** "triều đình phát vải, còn may có vừa hay không là việc của bạn" (A 0:27); "phát lương ăn đường cho đúng 4 ngày, đi chậm hơn thì tự lo" (A 1:06); "Nơi nào khổ hơn, sổ sách đã định giá sẵn" (A 2:30).
- **Ẩn dụ đời thường để giải thích chiến lược (B):** "một bàn cờ có người khác đã đặt quân sẵn" (2:42); "đánh trong nhà mình với kẻ địch đã ở trong nhà" (5:12); xe tăng trong phố cổ là "một cái hộp sắt đi chậm" (14:30); "một cái vòng bên trong một cái vòng" (14:37); "Hà Nội đọc những việc ở Hải Phòng như đọc trước bản của mình" (6:04).
- **Một chi tiết người thật nhỏ giữa sự kiện lớn:** chiến sĩ Phạm Ngọc Trương xin 15 phút, chui qua các lỗ tường về nhà lấy tấm ảnh người mẹ mới mất (B 21:26–21:37). Đặt ngay trước cuộc rút quân để tạo nhịp thở cảm xúc.
- **Nối quá khứ với hôm nay:** "Đây là Nam Vang, tức Phnôm Pênh ngày nay" (A 1:13); "Người Hà Nội vẫn đi bộ dưới gầm cầu ra bãi giữa, phần nhiều không biết đêm ấy" (B 26:42).

### 1.4 Câu chữ và nhịp
- Câu khẳng định ngắn, chủ ngữ rõ, động từ cụ thể. Rất nhiều câu 3–8 chữ đứng riêng: "Bạn không đi một mình." (A 0:45), "Rồi sốt, rồi mê man." (A 2:45), "Họ không rút ra. Đó là kế hoạch." (B 11:46).
- **Liệt kê ba nhịp** để dồn: "Ông làm thợ nề, thợ mộc, thợ nguội…" (B 1:56); "Pháp giữ phố, giữ cầu, giữ vòng cung, Pháp không giữ được con sông." (B 24:15).
- **Đối xứng:** "Người ta tắt đèn để đánh. Hai tháng sau, người ta đi dưới gầm một cây cầu trong bóng tối ấy để ra." (B 27:53).
- **Neo đầu chương bằng thời gian + địa điểm:** "Tối 19 tháng 12 năm 1946, ở Hà Nội…" (8:56), "Cuối tháng 12 năm 1946, ở Hà Nội…" (11:50), "Tháng 1 năm 1947, ở Hà Nội…" (15:02), "Đêm 17 tháng 2 năm 1947, mưa phùn, gió bấc." (21:01).
- Không dùng tính từ cảm xúc to tát. Cảm xúc đến từ sự việc, như "Và ngày càng nhiều lần, không ai thưa." (A 2:54).

### 1.5 Bí ẩn, kịch tính, cảm xúc, nhưng vẫn trung thực với nguồn
- Ghi nguồn ngay trong lời: "Đại Nam thực lục chép…" (A 3:06), "Người đếm là Trần Ngọc Long…" (B 6:14).
- Nói rõ chỗ sử chép khác nhau, và không đoán: "Tập này không biết người trong ảnh có trở về hay không và không đoán." (B 10:36); "Tập này không nói không mất một ai, vì chưa có nguồn nào nói thế." (B 23:05).
- **Lưu ý cho kênh:** B dùng giọng "Tập này…" rất dày, và có câu dẫn dắt thuần kỹ thuật ("Đây là lần thứ hai và cuối cùng tập này dừng lại để nhìn", 12:04). Người dùng đã từng yêu cầu cắt các câu meta kiểu "Đó là hết hồi một". Vì vậy chỉ giữ tinh thần "sử chép khác nhau / không đoán", mỗi video tối đa 1–2 câu, không dùng xưng hô "tập này".

### 1.6 Kết
- **A, 4:46–5:31:** từ cá nhân lùi ra thành thống kê ("sử chép chuyện Trấn Tây bằng tên các tướng… Còn về bạn, sử chỉ có con số", 4:50 → "6.137 người", "hơn 14.600 người" → "Bạn là một trong số ấy."). Sau đó là một câu hỏi không có lời đáp ("Không tờ sớ nào ghi bạn có về lại được Quảng Ngãi hay không"), callback cuối (5:13), rồi **mồi tập sau**: "Lần sau, bạn không cầm giáo nữa. Bạn cầm bút, vác lều chõng đi thi… chỉ có vài chục chỗ đỗ." (5:20).
- **B, 25:02–28:03:** lật câu hỏi → "họ bây giờ ở đâu" (tên phố, ngày giỗ làng Tứ Tổng, Pháo đài Láng còn đó) → **kết vòng tròn**: "câu chuyện này kết thúc ở chỗ nó bắt đầu. Một đêm tháng chạp… cả thành phố tắt đèn cùng một lúc." (27:45).

---

## 2. Phong cách hình ảnh

### 2.1 Chất liệu chung
Cả hai video dùng cùng một kiểu hoạt hình 2D phẳng: viền đen dày đều, mảng màu phẳng với bóng hai tông rất nhẹ, mặt người tối giản (mắt hạnh nhân, đồng tử chấm, miệng một nét), nền rất nhiều chi tiết (mái ngói, cột gỗ, dây điện, biển hiệu, đồ vật). "Chân thực" ở đây là **chân thực về đạo cụ và bối cảnh**: nón chóp có chỏm và áo nẹp đỏ có bổ tử tròn trắng (A), khố xà rông và nhà sàn của người Chân Lạp (A 1:39, 1:42), nhà ống phố cổ, tàu điện, cầu Long Biên đúng kết cấu dầm thép (B 3:04–3:14), mũ sắt và xe tăng Pháp (B 0:13). Nét vẽ vẫn là hoạt hình.

### 2.2 Nhân vật và màu nhận diện
- A: "bạn" luôn mặc áo đỏ có vòng tròn trắng và nón chóp đen, đứng giữa khung. Quan trên mặc áo đỏ có bổ tử hình thú (2:15), quan văn mặc lam hoặc đen. Người Chân Lạp có màu da và trang phục khác hẳn, để phân biệt ngay.
- B: Pháp mặc kaki, đội mũ sắt hoặc mũ kê-pi, luôn có cờ tam tài trong khung (0:13, 1:29, 5:29). Tự vệ mặc áo sơ mi trắng, đeo băng tay đỏ, khăn đỏ. Vương Thừa Vũ có ria mép, mặc áo kaki, xuất hiện lặp lại ở cận cảnh mặt (1:42, 4:21, 4:57, 5:25, 11:46, 14:38).

### 2.3 Cỡ cảnh và vai trò kể chuyện
| Cỡ cảnh | Dùng khi | Ví dụ |
|---|---|---|
| **Cận mặt, chiếm gần hết khung** | câu hỏi, quyết định, sợ hãi; thường có chữ lớn | A 1:31 "TRỐN?", A 0:40, A 3:53; B 0:44 "GIỮ ĐƯỢC 60 NGÀY?", 3:22, 5:25 "AI ĐÚNG?", 11:46 |
| **Cận đạo cụ (insert)** | chi tiết then chốt, con số, giấy tờ | A 0:19 (sổ đinh bị khoanh đỏ), A 4:21 (sổ khoanh nhiều tên), A 5:14 (mâm cúng với nón lính); B 0:38 (dải băng đỏ trên phố), 3:27 (chữ ký), 7:18 (đóng dấu), 10:34 (khăn đỏ trên ảnh) |
| **Trung cảnh 2–3 người** | đối thoại, quan hệ quyền lực | A 1:56, 2:18; B 4:19, 7:49 |
| **Toàn cảnh / nhìn từ cao** | địa lý, quy mô quân, thành phố | A 0:49 (đoàn quân dài), 1:10 (thành Nam Vang); B 0:18, 2:51, 5:03, 14:32 |
| **Bản đồ giấy cũ có nhãn** | chia khu, vị trí địch | B 4:35, 4:39, 5:00, 12:58, 13:56 |
| **Mặt cắt (cutaway)** | giải thích cơ chế | B 12:12, 12:20 (dãy nhà ống bổ dọc, người đi qua lỗ tường) |
| **Ẩn dụ thị giác** | khái niệm trừu tượng | A 2:06 (tháp tiền), 2:15 (quan ngồi trên đống tiền), 4:50 (biển người tí hon), 4:57 (sóng người đỏ tràn qua), 4:54 (bảng ô đầy hình lính "6.137 NGƯỜI"); B 2:42 (Hà Nội là bàn cờ), 13:23 và 14:51 (vòng trong vòng ngoài), 14:17 (dây thừng kéo co), 16:17 (hai tờ lịch 6 và 12) |
| **Đạo cụ biến đổi để chốt ý** | trả lời câu hỏi, kết quả so với kỳ vọng | B 24:07 (bảng "~~1 THÁNG~~ 60 NGÀY"), B 24:38 (sợi dây + đồng hồ quả quýt), B 17:46 (hai tờ lịch 14 / 15) |
| **Bóng đen (silhouette)** | ký ức, kết vòng tròn | B 27:56 (đoàn quân đen đi dưới gầm cầu) |
| **Đối chiếu hai khung (split-screen)** | xưa và nay, hai nơi cùng lúc | A 1:14 (Nam Vang 1835 / Phnôm Pênh nay), A 5:05 (mùa xuân ở Huế / mưa ở Trấn Tây) |

### 2.4 Bố cục và phối cảnh
- Phối cảnh một điểm tụ hút vào giữa: đường làng, dãy phố, đoàn quân (A 0:49, 1:00, 1:36; B 0:38, 3:00, 12:37).
- Nhiều tầng chiều sâu: nhân vật lớn ở tiền cảnh, đám đông ở trung cảnh, kiến trúc ở hậu cảnh (A 0:28, 0:34; B 0:58).
- Video dọc (A): nhân vật đặt ở giữa, khoảng 50–75% chiều cao khung. Phần trên chừa trời hoặc tường để đặt chữ lớn, phần dưới chừa chỗ cho phụ đề và logo.
- Chữ nằm trong cảnh: biển gỗ "QUẢNG NGÃI / 1835" (A 0:02), cột biển chỉ đường liệt kê tỉnh (A 0:52, 4:17), cổng "TRẤN TÂY" (A 1:18), bảng đen "HAI CON SỐ", "TRONG ĐÁNH NGOÀI VÂY" (B 6:08, 13:28), biển "LIÊN KHU 3", "HẢI PHÒNG", "ĐƯỜNG SỐ 5" (B 4:43, 3:15, 15:24), chữ viết lên tường "20 GIỜ" (B 8:48).

### 2.5 Ánh sáng, màu, không khí
- Ban ngày bình thường: nền be, nâu đất, xanh lúa, trời xanh nhạt, độ tương phản vừa phải.
- **Đổi bảng màu theo cảm xúc:** đoạn bệnh tật trong A chuyển sang xanh rêu và tối, có sương xanh độc (2:52–3:02). Cái chết của vua là căn phòng tối có nến (4:41). Đêm khởi sự trong B dùng xanh đêm, đèn vàng, trăng (0:07, 8:56, 9:10), đêm rút quân có mưa phùn, đèn pha, sương (21:40–22:10). Đoạn kết sáng lên rực rỡ với hoa, cờ và cầu dưới nắng (B 28:00).
- Nguồn sáng thấy được trong cảnh: đèn dầu, nến, đuốc, đèn pha gác (A 1:32; B 0:05, 21:45, 27:45).
- Có nhiều thời tiết: mưa (A 2:37, 3:18; B 21:40), bụi, khói, sương.

---

## 3. Biến hình ảnh thành video

### 3.1 Số liệu đo được ở A (95 cảnh)
- **54 cảnh (57%) đẩy hoặc kéo camera rất chậm:** 28 cảnh đẩy vào, 26 cảnh kéo ra, **xen kẽ gần như đều đặn** (cảnh này vào thì cảnh sau ra). Biên độ khoảng 5–7% trong 2–4 giây, có trượt chéo nhẹ khoảng 3% về một góc. Độ dài trung vị của các cảnh này là 2,6 s.
- **19 cảnh (20%) camera đứng yên, chỉ có chuyển động cục bộ** (clip AI từ ảnh), ví dụ: khói nhang bốc lên từ bàn quan (0:10–0:13), hai quan đi trên đường có bụi bay và chó chạy (0:14–0:19), lính run rẩy trong vạt nắng có bụi (2:41–2:45), quan giơ ngón tay rồi buông ống tre xuống, mặt xìu (2:52–2:57), muỗi đậu và cắn tay (3:04–3:06), hoa mai rơi ở Huế (5:05), khói lễ tế và cờ bay (5:09–5:13).
- **18 cảnh dài có chuyển động lớn trong cảnh:** lia hoặc tilt dọc theo đoàn quân, pan sang rồi cắt cảnh mờ, ví dụ 1:00–1:03 (đoàn quân dọc kênh An Giang, camera lùi theo), 4:50 (biển người).
- **Chuyển cảnh:** gần như toàn bộ là cắt thẳng. Mờ qua đen chỉ dùng ở hai nhịp nặng nhất: 4:53 (sau "sử chỉ có con số") và 5:01 (sau "Bạn là một trong số ấy").

### 3.2 Số liệu đo được ở B (398 cảnh)
- Mỗi cảnh trung bình 4,5 s, trung vị 4,2 s.
- **331 cảnh (83%) đẩy hoặc kéo camera chậm:** 163 cảnh đẩy vào, 168 cảnh kéo ra, cũng xen kẽ. Tỉ lệ phóng trung vị 1,074, tức khoảng 7%, giống hệt A. Đây là "chữ ký" chung của cả hai video: **ảnh tĩnh + đẩy/kéo 7% xen kẽ + cắt thẳng**.
- Chỉ khoảng 27 cảnh (7%) camera đứng yên. Clip AI có chuyển động cục bộ ít hơn A rõ rệt, dồn vào các cảnh then chốt: đoàn quân đi dưới gầm cầu trong sương xoáy (21:42–21:54), đèn pha quét, mưa (21:40), dân bến sông cầm đèn lồng lên thuyền (22:02–22:10), lửa nhà máy điện (9:07).
- **Chuyển chương bằng vệt nhòe lướt ngang** (khung bị nhòe chuyển động ở 2:38, 7:03, 11:01, 11:38, 14:09, 16:21) hoặc mờ qua đen (0:00, 15:02).
- Một số cảnh "đứng hình" để đọc: bức tường gạch có dấu X trắng giữ nguyên khoảng 8 giây (12:04–12:12) khi lời nói "Hãy nhìn vào một bức tường".

### 3.3 Chọn chuyển động theo câu thoại
| Câu thoại là… | Chuyển động | Ví dụ |
|---|---|---|
| Thông tin trung tính, liệt kê | đẩy hoặc kéo chậm, xen kẽ vào/ra | phần lớn A 0:23–1:00 |
| Câu hỏi, nỗi sợ, quyết định | cận mặt + đẩy vào + chữ lớn; mặt có giọt mồ hôi hoặc mắt liếc | A 1:31, 3:53; B 0:44 |
| Quy mô (bao nhiêu người, đường dài) | lùi hoặc lia dọc theo đoàn quân, nhìn từ cao | A 0:47, 1:00; B 2:51 |
| Thời tiết, bệnh tật, cái chết | camera gần như đứng yên, cho môi trường chuyển động (mưa, sương, khói) | A 2:37–3:02; B 21:40 |
| Hành động nhỏ của nhân vật | clip AI: một động tác duy nhất (giơ tay, buông vật, run, cắn) | A 2:52, 3:04 |
| Câu kết một chương, câu đau | đứng yên hoặc mờ qua đen | A 4:53, 5:01 |
| Giải thích cơ chế | giữ hình lâu, đổi sang mặt cắt hoặc bản đồ | B 12:02–12:32 |

### 3.4 Tạo cảm giác "đang diễn ra"
- Luôn có ít nhất **một thứ tự chuyển động** trong khung: khói, bụi, mưa, lá, cờ, ánh đèn, hoặc nhân vật thở và chớp mắt.
- Nhiều câu liền nhau về cùng một khoảnh khắc thì **đổi góc trong cùng bối cảnh**: rộng → trung → cận (A 0:02–0:13: ruộng → bàn quan nhìn rộng → cảnh quan ghi sổ). Không giữ một hình qua nhiều câu.
- Hướng di chuyển nhất quán: đoàn quân đi "vào Nam" luôn tiến về phía người xem hoặc xuống phía dưới khung (A 0:47, 1:00).

### 3.5 Cảnh động (clip AI) gồm những gì, chiếm bao nhiêu (người dùng chốt 2026-11-15: "học hỏi và ghi nhớ cách làm này")
Tỉ lệ đo được: A khoảng 60% tĩnh / 40% động (20% chắc chắn là clip AI, 19% là cảnh lia đông người chưa rõ cách làm), B khoảng 85–90% tĩnh / 10–15% động. **Kênh mình (người dùng chốt 2026-11-15): 10–13 clip Veo mỗi tập (≈15% với tập ~85 cảnh)**, dồn ở đầu và giữa video, phần cuối tối đa 2 clip. (Đề xuất ban đầu của tôi là 25% ≈ 20 clip; người dùng giảm xuống "nên lọc 10-13 cảnh thôi".) (video dọc ngắn giống A, nhưng tiết kiệm credit Veo). Bản đồ động (layers) tính riêng, miễn phí.

Cảnh động chủ yếu thuộc 4 nhóm (xếp theo mức ưu tiên):
1. **Môi trường chuyển động, nhân vật gần như yên** (nhiều nhất, ít lỗi): khói nhang, lửa cháy, mưa, sương xoáy, cờ bay, hoa rơi, đèn pha quét (A 0:10, 5:05–5:13; B 9:07, 21:40–21:54). Dùng cho cảnh buồn, chết chóc, chờ đợi, cảnh mở chương.
2. **Một động tác nhỏ của nhân vật** trong 2–3 s: run dưới chăn, giơ ngón tay rồi buông vật, muỗi đậu cắn tay (A 2:41, 2:52, 3:04). Một động tác duy nhất; không đi, không quay người, không đánh nhau.
3. **Biểu cảm ở cảnh cận**: mắt liếc, chớp mắt, giọt mồ hôi chảy, thở (A 1:31, 3:53; B 0:44). Dùng cho câu hỏi, nỗi sợ, quyết định.
4. **Đám đông di chuyển nhìn từ xa hoặc từ cao**: quan đi đường có bụi và chó chạy, đoàn quân dọc kênh, dân cầm đèn lồng lên thuyền (A 0:14, 1:00; B 22:02). Dùng để cho thấy quy mô.

Không có cảnh hành động lớn (đánh nhau, chạy dài, camera bay). Mỗi clip chỉ dùng 2–4 s rồi cắt thẳng; camera trong clip đứng yên.

**Quy trình chọn cảnh động cho một tập:** tạo đủ ảnh trước → tôi lọc toàn bộ cảnh theo 4 nhóm trên + bảng 3.3, ưu tiên cảnh then chốt (mở đầu, cú ngoặt, cao trào, cái chết, kết) → đưa danh sách 10–13 cảnh kèm "chuyển động chính + lớp môi trường" từng cảnh và tổng credit → người dùng duyệt → làm thử 1–2 clip → chỉ gửi tiếp khi người dùng đồng ý (không gửi hàng loạt). Cảnh nhân vật nói/quát hay lỗi "không tạo được âm thanh": ưu tiên động tác không nói.

---

## 4. Ghép câu thoại với hình

1. **Một câu (hoặc nửa câu dài) = một cảnh.** A trung bình khoảng 1,1 cảnh/câu, cắt ngay ở dấu phẩy khi câu có hai ý (0:27 "Ngày nhập ngũ," | "Quân phục?").
2. **Minh họa nghĩa đen, rồi mới đến ẩn dụ.** Câu nói "đếm được bằng tiền" thì vẽ tháp tiền (A 2:06). Câu nói "bàn cờ" thì vẽ bàn cờ thật trên phố (B 2:42).
3. **Con số thì hiện chữ lớn** trên hình minh họa con số đó ("1 QUAN TIỀN, 1 PHƯƠNG GẠO" A 0:31, "MỖI CƠ 500 NGƯỜI" A 0:55, "6.137 NGƯỜI" A 4:54).
4. **Câu hỏi thì dùng cận mặt + chữ lớn** ("THỨ ĐÁNG SỢ NHẤT LÀ GÌ?" A 0:40, "ĐƯỜNG VỀ NÀO?" A 3:50).
5. **Tên người và tên đất thì đặt trên biển hoặc bảng trong cảnh**, không dùng chữ dưới chân.
6. **Callback thì lặp lại hình cũ** có biến tấu: sổ đinh khoanh một tên (A 0:19) → sổ khoanh nhiều tên (A 4:21); cầu Long Biên đêm (B 1:15) → cầu Long Biên ngày rút quân (B 28:00).

---

## 5. Viết prompt

### 5.1 Image prompt (Flow / Nano Banana), khung mẫu
```
[STYLE] Flat 2D Vietnamese history cartoon, thick even black outlines, flat colours with soft two-tone cel shading, simple faces (almond eyes with dot pupils, one-line mouth), highly detailed background props and architecture, muted earthy palette (beige, wood brown, rice green, faded red) + one accent colour.
[SHOT] <close-up face filling 70% of frame | medium shot of 2-3 people waist-up | wide high-angle view | insert close-up of an object | cutaway cross-section | aged paper map>
[SUBJECT] <who, outfit details for colour-coding, ONE clear action or expression that matches the sentence>
[SETTING] <exact place + year, period-accurate architecture and props, foreground / midground / background layers, one-point perspective>
[LIGHT/MOOD] <time of day, weather (rain, fog, dust, smoke), visible light source>
[TEXT AREA] Leave the top 25% of the frame as plain sky or wall for a big title. Any sign or board in the scene is COMPLETELY BLANK (text added later).
Vertical 9:16. Generate exactly 1 image.
```
Ví dụ, viết theo câu A 2:41 "Một buổi trưa nắng gắt, người nằm cạnh bạn bỗng run cầm cập…":
> Medium shot inside a bamboo barracks hut, harsh midday sunbeams through the thatch, a soldier in red tunic with white round badge sitting on a bamboo bed, worried, sweat drop; beside him a comrade wrapped in a dark blanket shivering violently, eyes shut; dust motes in the light beams; spear and conical hats on the wall…

### 5.2 Video prompt (Veo, từ ảnh đầu)
Theo đúng luật đã chốt của kênh (khung đầu giữ nguyên, camera đứng yên), cộng thêm điều học được: **chỉ một chuyển động chính + một lớp môi trường**.
```
The first frame must be identical to the attached image: same framing, same size and position of every character, no reframing, no crop, no zoom out. Locked-off static camera.
Animate this exact 2D illustration, keep the flat cartoon style and faces unchanged.
Main motion: <ONE small action: the man shivers under the blanket / the official lowers his raised finger and drops the bamboo tube / a mosquito lands and bites the arm>.
Ambient motion: <dust motes drifting in the sunbeams / incense smoke rising / light rain / fog swirling at their feet / flags fluttering>.
No new objects, no text, no camera move. Ambience sound only, no music, no dialogue.
```
Chuyển động camera (đẩy/kéo xen kẽ 5–7%, lia dọc đoàn quân) làm bằng engine của mình ở bước dựng, **không** bảo Veo làm. Đo được ở cả hai video: camera đẩy/kéo nằm ở ảnh tĩnh, còn các cảnh có chuyển động cục bộ thì camera đứng yên. Hai thứ không chồng lên nhau.

---

## 6. Checklist khi viết một tập mới
- [ ] Khung 0 là một nghịch lý bằng chữ lớn + hình; câu 1 chạm vào người xem.
- [ ] Neo thời gian và địa điểm cụ thể trong 2 câu đầu.
- [ ] Câu hỏi trung tâm trong 20 giây (video ngắn) / 45 giây (video dài).
- [ ] Gieo ít nhất 2 chi tiết để gặt ở cuối (một câu hoặc vật, một địa điểm).
- [ ] Mỗi khái niệm khô = con số cụ thể + so sánh ("gấp 10 lần bạn").
- [ ] Mỗi hồi có một ẩn dụ đời thường hoặc một cú lật.
- [ ] Một chi tiết người thật nhỏ trước cao trào.
- [ ] Tiết lộ theo lớp (triệu chứng → tên cũ → tên nay → thủ phạm).
- [ ] Một câu "sử chép khác nhau / không đoán", không dùng giọng "tập này".
- [ ] Kết bằng callback + câu hỏi mở + mồi tập sau, rồi lời chào của Vy.
- [ ] Mỗi câu một hình đúng nghĩa đen; xen kẽ cỡ cảnh; chữ trong cảnh.
- [ ] Camera đẩy/kéo xen kẽ cho ảnh tĩnh; clip AI chỉ một động tác + môi trường; mờ qua đen chỉ ở 1–2 nhịp nặng nhất.
