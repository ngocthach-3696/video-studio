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
- [ ] Chạy thêm checklist mục 7.4 (bổ sung từ mẫu 3 và 4).

---

## 7. Bổ sung từ video mẫu 3 và 4 (2026-11-18, người dùng: "học hỏi để áp dụng vào các video sau")

Nguồn: Downloads, đo cùng cách như trên (Whisper + tách cảnh + khớp điểm ảnh). Tờ khung hình và lời thoại lưu ở `styles/ref-mau-3-4/`.
- **Mẫu 3** = `Video mau 3.mp4`: ngang, 41:21, 510 cảnh. Hội VN Cách mạng Thanh niên ở Quảng Châu 1924–1929. Cùng kênh với video B (giọng "tập này", "lý do thứ N").
- **Mẫu 4** = `Video mau 4.mp4`: **dọc 9:16, 5:36, 145 cảnh**, kênh "Lịch sử ngoại truyện Á Châu". Triệu Cấu gọi Nhạc Phi về rồi giết. **Đây là mẫu gần kênh mình nhất** (dọc, 5 phút, nhịp nhanh).

Chỉ ghi điều MỚI so với mục 0–6. Quy tắc riêng của người dùng vẫn thắng: không phụ đề, logo nhỏ, không câu khuôn "lý do thứ nhất/thứ hai", tối đa 1–2 câu meta, giữ nhịp đọc cũ (mẫu 3 và 4 đọc khoảng 190–200 từ/phút, −14 LUFS; chỉ ghi để biết, không đổi).

### 7.1 Kể chuyện

**Mở đầu "đủ mọi lý do → làm ngược lại" (mẫu 4, 0:00–0:30).** Liệt kê nhanh mọi lý do để làm X, mỗi lý do một cảnh 2 giây có chữ lớn 2–3 chữ ("ANH VUA" → "MẸ VUA" → "CẢ QUAN TÀI" → kinh đô cũ → tướng giỏi nhất đang thắng, cách kinh đô 20 cây số → dân ra đường đón). Chốt: "Nghĩa là chỉ còn một việc: đi tiếp." Rồi lật: "Thế mà vua Tống làm ngược lại. Ông gọi Nhạc Phi về, rồi giết." → "Vì sao?" (0:26). Đây là một dạng nghịch lý mở đầu, dùng khi nhân vật chọn điều trái với mọi lẽ thường.

**Câu đầu là một câu tóm cả tập (mẫu 3, 0:00).** "Đây là câu chuyện về một lớp học mà người Pháp nhìn thấy từ đầu đến cuối và không làm gì được." Một câu, một nghịch lý, người xem biết ngay mình sẽ xem gì.

**Giữ câu trả lời đến câu cuối, và nói nó dưới dạng câu hỏi (mẫu 4).** Cả video chỉ trả lời từng mảnh. Câu cuối: "Vua Tống không đón anh về. Vì anh về thì ai làm vua?" Chữ lớn khung cuối cũng là "AI LÀM VUA?". Người xem tự nói ra đáp án trong đầu. Với kênh mình: đặt câu này ngay trước câu mồi tập sau của Vy.

**Suy động cơ từ việc làm, không đoán ý nghĩ.**
- "Mình không biết ông nghĩ gì. Mình chỉ biết ông làm gì." (mẫu 4, 3:16); "Ông em có hiểu điều đó không? Việc ông làm trả lời thay." (1:28).
- **Chỗ sử im lặng cũng là bằng chứng:** "Sử ghi là xin mẹ, xin cha. Không ghi xin anh." (1:40). Hình: hai bong bóng nghĩ có mặt mẹ và cha, cảnh sau là bong bóng chỉ có dấu "?".
- **Nói rõ mức chắc chắn, mỗi câu một mức:** "Sử không chép ông nói thế." / "Con số 12 là do cháu Nhạc Phi chép lại, sử gia còn nghi." / "Có thật Kim nhắn thế không, sử gia còn cãi." / "Cái chắc là chuyện sau đó." Cách này thay cho giọng "tập này không đoán" của mẫu B, ngắn và tự nhiên hơn.

**Giải mã nghĩa đen của tên gọi, chức tước, câu nói (có chút hài).** "Hôn Đức Công, nghĩa đen là ông công lú lẫn." "Trùng Hôn Hầu, ông hầu lú lẫn gấp đôi." "Mạc tu hữu, nghĩa là: có lẽ có." Tên Hán Việt khô khan thành một cú đấm.

**Câu mỉa ngắn kiểu đời thường:** "Khổ nỗi, Kim không bán lẻ." (muốn mẹ về thì phải ký hòa, mà ký hòa thì không được đánh). "Một tấm là đủ, ông gửi mười hai." "Có một ông vua sợ thắng."

**Gỡ logic từng bước cho người xem tự hiểu:** "Hai vua là ông cha và ông anh. Ông cha chết rồi, nên đón hai vua nghĩa là đón ông anh." (mẫu 4, 3:07). Không nói thẳng kết luận; để người xem ghép.

**Lặp lại danh sách mở đầu ở cuối, có biến tấu.** Mở: anh vua, mẹ vua, quan tài cha đều ở trong tay giặc. Cuối: "Đổi lại Kim trả người. Trả bà mẹ. Trả quan tài ông cha." → "Một bà mẹ, một cỗ quan tài, không có ông anh." Hình cũng lặp từng món một.

**Một cảnh soi chiếu ngang thời (mẫu 4, 4:53).** "Cuối năm 1127, lúc Triệu Cấu vừa lên ngôi, ở Đại Việt có một ông vua mất, là Lý Nhân Tông. Ông cũng không có con trai, ông cũng chọn một đứa cháu nối ngôi. Khác ở chỗ, ông chọn khi còn sống, chọn công khai, và nhà ông không có ai đang ở trong tay nước khác." Kênh mình làm chiều ngược lại: khi kể sử Việt, có thể đặt **một** cảnh "cùng năm ấy ở nước khác…" để làm nổi bật lựa chọn của người Việt. Tối đa một lần mỗi tập.

**Nối với hôm nay ngay trong mạch truyện.** "Phim thường bỏ câu đó." (hình trường quay). "Tượng Tần Cối thì đến nay vẫn quỳ bằng sắt trước mộ Nhạc Phi." Mẫu 3 kết bằng hiện trạng cụ thể: số nhà ngày nay, năm xếp hạng di tích, bảo vật quốc gia năm 2012, tờ báo bị cấm nay lại được giữ kỹ nhất "bởi chính người đã cấm nó".

**Lấy một đồ vật hoặc một nơi chốn làm xương sống (mẫu 3).**
- Nơi chốn: "căn nhà số 13" được nhắc hàng chục lần, có hẳn một đoạn "đi một vòng" (mặt cắt kiểu nhà búp bê: tầng dưới lớp học, phòng in, tầng trên chỗ ngủ, lối thoát sang nhà bên).
- Đồ vật: **tấm ảnh trong hồ sơ mật thám**. Gieo ở 0:46 → "Hãy dừng ở tấm ảnh ấy" (19:13) → người trong ảnh xuống mỏ, "không còn giống người trong ảnh" (32:04) → tấm ảnh nằm trên bàn công tố (35:09) → "tấm ảnh trẻ nhất của họ" (39:33) → câu kết: "Người Pháp có ảnh của tất cả những người trong phòng ấy. Thứ họ không chụp được là cái đang được viết lên bảng."
- **Đổi góc nhìn so với sách giáo khoa:** "Sách giáo khoa gọi nó là cơ quan ngôn luận của Hội. Nhìn từ căn nhà số 13, nó là cánh tay dài nhất của căn nhà ấy, vươn về nước trước cả học trò." Dùng tối đa 1–2 lần mỗi tập.

**Kể qua bàn giấy của phe kia (mẫu 3).** Viên mật thám Pháp có một bàn giấy và một bảng ảnh xuất hiện lặp lại suốt video; bảng được cập nhật theo truyện (thêm ảnh, gạch chéo, ô trống cho người chưa biết mặt, cuối cùng ông ta già đi). Đó là một "bảng tỉ số" cho người xem thấy phe kia đang hiểu đến đâu.

**Gieo một bí ẩn về con người, rất lâu sau mới gọi tên.** "Trong phòng này có một người của họ" (0:49) → tên Lâm Đức Thụ mãi đến 19:02. Trong lúc chưa có tên, người này được vẽ đầu đội túi giấy (xem 7.2).

**Câu tóm có nhịp đếm:** "3 năm, 1 căn nhà, 3 khóa, 1 tờ báo, 1 cuốn sách. Rồi hết." "Ngày, ông là phiên dịch. Chiều, ông là thầy. Đêm, ông là người viết." "Ngả có súng kết thúc ngoài phố Quảng Châu trong 3 ngày. Ngả có vở về đến làng và còn đi tiếp."

**Câu chỉ chỗ cho người xem:** "Các bạn để ý chỗ này." (mẫu 4, 1:13), hình là đèn chiếu + vòng tròn đỏ quanh nhân vật. Dùng một lần cho mắt xích quan trọng nhất của truyện.

### 7.2 Hình ảnh

**Chữ lớn (mẫu 4) có 4 loại, ngắn 1–4 chữ:** câu hỏi ("ĐANG THẮNG, SAO BỊ GIẾT?" từ khung 0, "VÌ SAO?", "THIẾU MỘT NGƯỜI?", "TẦN CỐI LÀ AI?", "TỘI GÌ?", "AI LÀM VUA?"); tên người lúc mới xuất hiện ("TRIỆU CẤU", "LÝ NHÂN TÔNG"); năm, tuổi, con số ("1137", "20 TUỔI", "38 TUỔI", "250.000 LƯỢNG BẠC", "5 NĂM"); từ khóa của danh sách mở đầu ("ANH VUA", "MẸ VUA"). Kênh mình vẫn theo luật cũ: không đặt mảnh trích dẫn làm chữ lớn.

**Cho thấy SỰ VẮNG MẶT bằng đồ vật, không vẽ xác người:**
- Hàng tù binh bị giải đi có **một hình người bằng nét chấm trống** ở giữa: người đã thoát (mẫu 4, 0:58, "THIẾU MỘT NGƯỜI?").
- Ông cha chết: tấm đệm trống có cây bút lông. Ông anh chết: gối trống, mũ, đèn dầu, cửa sổ đầy sao.
- "Một trong ba người": ba ngọn nến, một ngọn tắt dần.
- Nhạc Phi chết trong ngục: mũ trụ có chùm tua đỏ nằm trên rơm. "38 tuổi": cây giáo dựng tường buộc khăn trắng.
- Cảnh cuối: vua già ngồi cạnh một chiếc ghế phủ khăn trắng (chỗ ông anh không bao giờ ngồi).
- Mẫu 3: chiếc mũ nổi giữa các vòng sóng (người ném bom nhảy sông). Mỗi người học trò ở đoạn kết là một bàn gỗ trống có cuốn sách ghi tên.

**Ẩn dụ được vẽ thành đồ vật thật:** ngai vàng dựng trên cột biển chỉ đường ghi "ANH KHÔNG VỀ" ("ngai của ông đứng trên đúng một việc"); bà mẹ và ông anh bị buộc chung bằng nơ đỏ ở sạp chợ có biển "KHÔNG BÁN LẺ"; nơ hồng buộc lên ngọn giáo ("ký hòa thì không được đánh"); vạch đếm thắng trận khắc lên cột; ông tướng bị vùi dưới đống 12 tấm kim bài; con ốc sên bò trên trang sử ("Vì sao chậm thế?"); chồng giấy cao "5 NĂM"; mạng nhện trên mũ ông già (tin đến quá muộn); quả đào tiên ("sống đến 80 tuổi"). Mẫu 3: tờ báo bay thành một dải dài vươn qua mái nhà ("cánh tay dài nhất"); tổ ong ("bắt một ô không sập cả hàng"); bánh răng trong căn nhà ("cái máy cậu sắp đi vào"); tháp hộp gỗ ghi TỔNG BỘ / KỲ BỘ / TỈNH BỘ / HUYỆN BỘ / CHI BỘ; áo sơ mi trắng → mũi tên → áo thợ ("vô sản hóa").

**Các thủ pháp vẽ khác:**
- Nhìn vào gương thấy chính mình hồi trẻ = quay ngược thời gian ("phải lùi về lúc ông chưa phải vua").
- Mặt chia đôi sáng/tối, bóng đen lớn đổ sau lưng = nhân vật mập mờ (Tần Cối).
- Bong bóng nghĩ có mặt người (nhớ ai), bong bóng chỉ có "?" (không nghĩ tới ai), mây xám trên đầu (lo).
- Phóng đại hài: mắt xoắn ốc + lè lưỡi ("lú lẫn"), giọt mồ hôi to, tay lắc lia lịa.
- **Một con vật lặp lại làm điểm nghỉ:** con mèo cam ngủ trong điện của Triệu Cấu, xuất hiện 4 lần, kể cả cảnh cuối.
- **Cảnh hiện đại chen vào đúng câu:** sử gia cầm kính lúp trong bảo tàng ("sử gia còn nghi"), hai nhà nghiên cứu cãi nhau ("còn cãi"), trường quay ("phim thường bỏ câu đó"), học sinh khăn quàng đỏ đọc sách giáo khoa ("sách giáo khoa gọi…"), khách tham quan di tích hôm nay.
- **Người chưa biết tên = đầu đội túi giấy/hộp giấy có hai mắt** (mẫu 3, gián điệp; cũng là hình "người kể chuyện" lục hồ sơ ở đoạn nguồn cuối video).
- ~~Nhân vật được tôn kính chỉ vẽ từ sau lưng hoặc qua vai~~ (mẫu 3 làm thế với Nguyễn Ái Quốc). **Người dùng KHÔNG chọn cách này (2026-11-19, tập "Anh Ba"): "cứ vẽ giống bác nhất có thể. Mình tự hào mà, có gì phải che?"** Vẽ rõ mặt, giống ảnh thật nhất có thể (đối chiếu ảnh tư liệu), biểu cảm đàng hoàng, không phóng đại kiểu hài.
- Tóm ý then chốt bằng **bảng đen nhỏ nhân vật cầm trước ngực** (mẫu 3 cầm bảng ghi lý do). Kênh mình chỉ mượn hình thức: bảng ghi một kết luận ngắn, không ghi chữ "lý do thứ N".
- Chia khung 2–3 ô để cho thấy nhiều nơi cùng lúc (Nam Định / Hải Phòng / Mạo Khê).
- Đoạn tóm tắt cuối dùng lại đúng những hình đã xuất hiện, để người xem nhận ra.
- Mẫu 4 có một nhân vật người dẫn chuyện (đội nón, cầm cuộn bản đồ) đứng góc dưới phải suốt video. Kênh mình đã có logo nên chưa dùng; nếu người dùng muốn có "Vy" xuất hiện trên hình thì đây là cách làm.

### 7.3 Chuyển động (đo được)

| | Mẫu 4 (dọc, 5:36) | Mẫu 3 (ngang, 41:21) |
|---|---|---|
| Số cảnh, độ dài | 145 cảnh, trung bình 2,3 s, trung vị 2,0 s | 510 cảnh, trung bình 4,9 s, trung vị 4,7 s |
| Đẩy/kéo xen kẽ | 69%, xen kẽ tuyệt đối (0 cặp cùng chiều), **phóng vào tâm khung** | 85%, 6 cặp cùng chiều trên 436 |
| Tốc độ phóng | **≈ 2%/giây**: cảnh 1,9 s phóng 4%, cảnh 3,4 s phóng 7%; trần khoảng 7% | ≈ 1,6%/giây, tổng trung vị 7%, tối đa 11% |
| Cảnh đứng yên hẳn | ~18%: cảnh chốt một chữ dài 0,7–1,2 s ("Thoát.", "Anh thì không.", "Ông gửi mười hai.") | ~3%, chủ yếu cảnh giữ lâu để liệt kê (đến 20 s) |
| Clip AI | ~5% (7 cảnh): khói và áo choàng bay ở khung 0, khói bốc từ đống lửa, cổng thành cháy, sao lấp lánh | ~2%: khói tràn lớp học ở khung 0, lính chào, búa đóng dấu |
| Lia dọc ảnh cao | 3 cảnh 4–6 s, trượt khoảng 1/3 chiều cao: đường quân Tống → lên khói phía bắc; núi sương → xuống biển "HÀNG CHÂU"; đường quanh co → lên đỉnh tuyết | ít |
| Chuyển cảnh | cắt thẳng; ~6 lần vệt nhòe lướt; 1 lần hòa tan giữa hai ảnh cùng nơi (toàn → cận); hiện từ đen ở các nhịp chết chóc | cắt thẳng; vệt nhòe lướt khoảng mỗi phút một lần (41 lần) khi đổi đoạn |

**Điều rút ra cho engine của mình** (`"motion": "alternate"` hiện phóng cố định 7% cho mọi cảnh, có easing, điểm neo lệch):
1. Mức phóng nên **tỉ lệ theo độ dài cảnh** (khoảng 2%/giây, trần 7%) để cảnh ngắn không bị giật mạnh. *(Đề xuất, chưa sửa code; chờ người dùng đồng ý.)*
2. Cảnh chốt một chữ hoặc một câu rất ngắn: để đứng yên (`"motion": "still"`), dài khoảng 1 giây.
3. Cảnh mở chương hoặc cảnh địa lý: ảnh dọc cao hơn khung, `pan-up`/`pan-down` 4–6 giây để "lộ" nơi chốn (tên đất trên biển gỗ hiện ra cuối cú lia).
4. Clip Veo ở mẫu 4 chỉ ~5%, toàn là khói, lửa, sao, áo choàng: kênh mình (10–13 clip) đã dùng nhiều hơn mẫu, không cần tăng.

**Cấu trúc chương (mẫu 3):** chữ lớn câu hỏi ("CHUYỆN GÌ ĐÃ XẢY RA?", "AI ĐÚNG?", "CUỐN SÁCH NÀY LÀM GÌ?") → tối đen → **tên chương viết trên một đạo cụ trong cảnh** (thực đơn bữa tiệc "TỪ TIẾNG BOM ĐẾN LỚP HỌC", tấm biển ở chợ "SÁU TUẦN VÀ MỘT TẤM ẢNH", tờ giấy dán cửa "MỘT HỘI THÀNH BA ĐẢNG"). Video 5–8 phút của kênh mình có thể dùng 2–3 tên chương kiểu này nếu tập có nhiều hồi.

### 7.4 Checklist bổ sung khi viết tập mới
- [ ] Câu đầu tóm cả tập thành một nghịch lý, HOẶC mở bằng "đủ mọi lý do → làm ngược lại".
- [ ] Câu trả lời câu hỏi trung tâm để đến câu cuối, nói bằng một câu hỏi ngược, rồi mới đến câu mồi tập sau của Vy.
- [ ] Ít nhất một chỗ suy ra từ việc làm hoặc từ chỗ sử im lặng ("Sử ghi… Không ghi…").
- [ ] Mỗi chi tiết không chắc có một câu ngắn nói rõ mức chắc chắn.
- [ ] Một đồ vật hoặc nơi chốn xuyên suốt, xuất hiện lại ở cảnh cuối.
- [ ] Danh sách hoặc hình mở đầu được lặp lại ở cuối có biến tấu.
- [ ] Mỗi cái chết, sự mất mát, sự vắng mặt = một đồ vật (ghế trống, nến tắt, mũ, hình nét chấm), không vẽ xác.
- [ ] Mỗi ẩn dụ trong lời = một đồ vật vẽ được (biển, nơ, cột, đống, ốc sên…).
- [ ] 1–2 cảnh hiện đại (học sinh đọc sách, di tích hôm nay, sử gia) đúng câu nói về sách vở, nguồn hay hôm nay.
- [ ] Cân nhắc một cảnh soi chiếu ngang thời với nước khác (tối đa một lần).

---

## 8. Hook — đoạn mở 30–40 giây đầu (2026-11-18, người dùng: "tôi cần đoạn Hook để tạo điểm nhấn")

Đo trên 4 mẫu (A, B, 3, 4) và 2 tập của mình (1885, 1905): lời có mốc thời gian từng từ, cắt cảnh, khung hình từng giây. Ảnh lưới và lời ở `styles/ref-mau-3-4/hook-*`.

### 8.1 Số đo

| | Mẫu 4 (dọc) | Mẫu A (dọc) | Mẫu B | Mẫu 3 | **Tập 1885** | **Tập 1905** |
|---|---|---|---|---|---|---|
| Số cảnh trong 30 s đầu | **11** | **12** | 8 | 9 | 7 | **5** |
| Cảnh dài nhất trong 30 s đầu | 4,9 s | 5,5 s | 5,1 s | 7,4 s | 5,8 s | **10,7 s** |
| Số cảnh có chữ lớn trong 30 s đầu | **9** | 2 | 2 | 1 | 2 | 2 |
| Câu hỏi trung tâm ở giây | **26** | 43 | 42 | 57 | 23 | 18 |
| "Cửa vào" truyện (sau câu hỏi) | "Chuyện là…" 37 s | "Bạn không đi một mình." 47 s | báo trước 4 cảnh, 47–72 s | báo trước 5 việc, 62–95 s | "Hôm nay hãy cùng Vy…" 29 s | "Hôm nay hãy cùng Vy…" 45 s |
| Khoảng lặng trước/sau câu đinh | 1,3 s trước "Vì sao?" | 1,9 s sau "không phải là giặc" | ~1 s trước câu hỏi | 1,1 s trước câu hỏi | không có | không có |

Giọng đọc cả 6 video đều vào ngay 0,00 s (không mở bằng nhạc hay im lặng). Mẫu 4 và mẫu 3 hiện từ đen trong khoảng 0,1–0,5 s.

**Điểm yếu của mình:** hình đổi chậm (1905: 30 giây đầu chỉ 5 cảnh, cảnh đầu đứng 10,7 s); ít chữ lớn; không có khoảng lặng nhấn trước cú lật; tập 1905 chen tóm tắt tập trước ("Ở cuối tập trước, bạn đã gặp họ", 20 s) vào giữa hook. **Điểm mạnh nên giữ:** chữ lớn khung 0 dạng hai vế đối nhau ("VUA BỎ NGAI, VÀO RỪNG?", "CÙNG CỨU NƯỚC, CÃI NHAU CẢ ĐỜI"), câu hỏi trung tâm sớm (18–23 s), lộ tên từng lớp ("Cậu bé ấy là một vị vua. Vị vua ấy là… Hàm Nghi"), vòng mở "con tàu thứ ba, Vy để dành đến cuối video".

### 8.2 Chữ lớn khung 0
Cả bốn mẫu đều có cùng một dạng: **hai vế đối nhau, ngăn bằng dấu phẩy, tối đa 6–7 chữ**: "ĐANG THẮNG, SAO BỊ GIẾT?" (4), "CHƯA ĐÁNH TRẬN NÀO, ĐÃ CHẾT" (A), "CHO 24 GIỜ, GIỮ 60 NGÀY?" (B, con số đối con số), "…VÀ KHÔNG LÀM GÌ ĐƯỢC?" (3). Chữ đứng suốt cảnh đầu (4–5 s). Ở mẫu 4 chữ cao khoảng 7% chiều cao khung, chiếm khoảng 80% chiều ngang; chữ của mình khoảng 4,5%, nhỏ hơn rõ. Hình khung 0 là khoảnh khắc mạnh nhất của truyện (mẫu 4: Nhạc Phi quay lưng nhìn về phía bắc giữa khói và cờ; A: người nông dân bị khoanh tròn đỏ giữa mưa), thường là clip Veo.

### 8.3 Năm kiểu hook (chọn MỘT cho mỗi tập, đổi kiểu giữa các tập)
1. **Đủ mọi lý do → làm ngược lại** (mẫu 4). 3–6 lý do, mỗi lý do một câu ngắn + một cảnh + một chữ lớn 2–3 chữ → "Nghĩa là chỉ còn một việc: …" → "Thế mà…" → câu đinh.
2. **Kết quả nghịch lý** (A, mẫu 3): nói kết cục trước, kết cục trái lẽ thường ("chưa đánh trận nào đã chết"; "nhìn thấy từ đầu đến cuối và không làm gì được"), rồi quay về đầu chuyện.
3. **Đồng hồ + chênh lệch** (B): giờ phút chính xác, một tín hiệu đang chờ ("điện tắt, đó là lệnh tấn công"), so lực lượng hai bên từng món, kỳ vọng thấp ("chỉ mong giữ được 1 tháng") → kết quả cao ("60 ngày").
4. **Lộ danh tính từng lớp** (tập 1885): tả một người bình thường làm một việc lạ → "Người ấy là… / Người ấy là…" → tên thật.
5. **Nhập vai "bạn"** (A): "Bạn không chọn được nơi mình sinh ra. Lần này, bạn là…" → cái tên được khoanh trong sổ là tên bạn.

### 8.4 Khung thời gian cho hook dọc 5–8 phút
| Giây | Lời | Hình |
|---|---|---|
| 0–3 | Câu 1 ≤ 12 chữ: neo năm/nơi + mâu thuẫn, hoặc câu tóm cả tập | Hình mạnh nhất (ưu tiên Veo), chữ lớn khung 0 hai vế, hiện từ đen ~0,3 s |
| 3–20 | 3–6 câu ngắn dựng tình thế bằng chi tiết cụ thể (con số, đồ vật, người) | Mỗi câu một cảnh 2–3 s; 3–5 cảnh có chữ lớn từ khóa 2–3 chữ |
| ~20 | Cú lật ≤ 8 chữ ("Thế mà…", "Nhưng…", "Ông gọi Nhạc Phi về, rồi giết.") | Một cảnh đồ vật biểu tượng, chữ lớn tóm cú lật ("GỌI VỀ, RỒI GIẾT") |
| | **Lặng ~1–1,5 s** (một khoảng duy nhất trong hook) | Hình đứng |
| ~22–30 | Câu hỏi ngắn ("Vì sao?") → câu hỏi đủ → một vế xoáy thêm ("Và dừng xong còn ký giấy xưng bề tôi với người đang giữ mẹ mình.") | Cận mặt có giọt mồ hôi/mắt liếc + chữ lớn câu hỏi |
| 30–40 | Cửa vào: "Hôm nay, hãy cùng Vy…" (hoặc "Chuyện là…") + có thể thêm một vòng mở ("…Vy để dành đến cuối video") | Đổi bối cảnh, bắt đầu hồi 1 |

### 8.5 Luật hook (kiểm trước khi chốt kịch bản)
- [ ] Giọng vào ở 0,00 s; câu 1 ≤ 12 chữ.
- [ ] Trong 30 s đầu: **≥ 10 cảnh, không cảnh nào > 4 s**, ≥ 4 cảnh có chữ lớn (câu hỏi, từ khóa, con số).
- [ ] Chữ lớn khung 0 dạng hai vế đối nhau, ≤ 7 chữ, cỡ chữ lớn hơn hiện tại (~7% chiều cao khung).
- [ ] Mọi câu trong hook đều là sự việc cụ thể, không câu dẫn chung chung ("Lịch sử dân tộc ta…").
- [ ] Có một cú lật rõ ràng và câu hỏi trung tâm trước giây 30.
- [ ] Đúng **một** khoảng lặng ~1–1,5 s ở cú lật. *(Chỉ trong hook; người dùng đã bỏ kiểu ngắt nhịp khắp video ở tập 1867. Làm bản nghe thử có/không có khoảng lặng để người dùng chọn trước khi áp dụng.)*
- [ ] Không tóm tắt tập trước trong 40 s đầu; nếu cần nối tập trước thì đặt sau câu "Hôm nay, hãy cùng Vy…", tối đa một câu.
- [ ] Câu trả lời của câu hỏi trong hook để đến cuối video (xem 7.1).
- [ ] Hook dài 30–40 s; "Hôm nay, hãy cùng Vy…" không muộn hơn giây 40.

---

## 9. Nhân vật "diễn" thế nào (2026-11-18, người dùng hỏi về di chuyển nhân vật)

Đo bằng cách bù chuyển động camera rồi tìm vùng điểm ảnh tự chuyển động trong từng cảnh, sau đó xem dải khung hình của mọi cảnh tìm được.

### 9.1 Số đo: nhân vật hầu như KHÔNG được làm chuyển động bằng AI
| | Clip có chuyển động trong khung | Trong đó nhân vật cử động | Vị trí |
|---|---|---|---|
| Mẫu 4 (dọc, 145 cảnh) | 8 (5,5%) | **1**: sử quan ngậm bút nhún vai, mắt đảo (2:16) | 5/8 clip nằm trong 2 phút đầu |
| Mẫu 3 (510 cảnh) | 8 (1,6%) | 5: thầy giáo quay lưng đi dọc lối giữa lớp; thợ in kéo cần máy in; thủy thủ chào, học trò đi thành hàng; chàng trai quay lưng đi vào chợ; đám đông đi trên phố nhìn từ xa | **6/8 clip nằm trong 75 giây đầu** |
| Mẫu A (mục 3.5) | ~20% | run dưới chăn, buông ống tre, muỗi cắn tay | rải đều |

Các clip còn lại chỉ có môi trường chuyển động: khói, lửa đuốc, áo choàng bay, quạt trần quay, ánh lóe chạy qua tấm kim bài.

### 9.2 Những kiểu cử động nhân vật mà mẫu dám dùng (an toàn với AI)
1. **Đi xa khỏi camera, nhìn từ sau lưng** (không thấy mặt nên mặt không bị méo): thầy giáo đi dọc lớp, người đi vào chợ.
2. **Động tác lao động lặp lại tại chỗ**: kéo cần máy in, đóng dấu, gõ búa, viết.
3. **Một cử chỉ ngắn**: chào, nhún vai, mắt đảo, run.
4. **Đám đông đi lại nhìn từ xa hoặc từ trên cao.**
Không có cảnh đánh nhau, chạy về phía camera, quay người, nói chuyện mở miệng.

### 9.3 Cảm giác "nhân vật đang diễn" thực ra đến từ cắt cảnh theo tư thế (miễn phí, chỉ tốn ảnh Flow)
- **Mỗi câu thoại là một ảnh mới, cùng nhân vật, cùng bối cảnh, đổi tư thế và góc máy.** Mẫu 4, 3:52–3:58, một câu hỏi và một câu đáp được kể bằng 5 ảnh: toàn cảnh (tướng chỉ tay vào Tần Cối) → cận mặt tướng giận, chữ "TỘI GÌ?" → đổi góc, Tần Cối giơ **3 ngón tay** đúng lúc nói "ba chữ" → cận Tần Cối nhếch mép, chữ "MẠC TU HỮU" → tướng mắt xoắn ốc, chữ "CÓ LẼ CÓ".
- **Cử chỉ minh họa đúng nghĩa đen của lời:** giơ 3 ngón cho "ba chữ"; ôm hoa và trái tim bay cho "mẹ thì muốn đón" → quay mặt huýt sáo (nốt nhạc bay) cho "anh thì không"; cột biển mũi tên chỉ ngược cho "làm ngược lại".
- **Chuyển động vẽ sẵn trong ảnh tĩnh (kiểu truyện tranh):** vệt gió, ghế lắc có nét rung, giấy bay, bụi phụt, giọt mồ hôi văng ("ngồi xuống nói chuyện", mẫu 4, 2:04); tim, nốt nhạc, bong bóng "?", mây xám trên đầu.
- **Biểu cảm phóng đại theo từng câu:** mồ hôi, mắt xoắn ốc, mắt liếc, nhếch mép, mặt xìu.
- Camera đẩy/kéo xen kẽ (mục 7.3) cộng với ảnh đổi mỗi 2 giây làm chuỗi tư thế trông như hoạt hình giật nhịp chậm.

### 9.4 Áp dụng cho kênh
- Giữ số clip Veo người dùng đã chốt (10–13), nhưng **dồn 3–5 clip vào hook** (40 s đầu) như mẫu 3 và 4; phần còn lại ở nửa đầu và giữa, cuối tối đa 2.
- Clip có nhân vật: chọn theo 4 kiểu ở 9.2; ưu tiên **nhìn từ sau lưng** hoặc **động tác lặp lại tại chỗ**; không mở miệng.
- **Mỗi đoạn đối thoại hoặc đối đầu quan trọng = một chuỗi 3–5 ảnh cùng bối cảnh** (toàn → cận người nói → đổi góc → cận người nghe phản ứng). Mỗi tập nên có 2–3 chuỗi như vậy, nghĩa là thêm khoảng 6–10 ảnh Flow (miễn phí, nhưng tính thêm thời gian chờ giới hạn của Flow).
- Prompt ảnh cho chuỗi tư thế: "Same two characters, same courtyard and lighting as the previous image; now [character] raises three fingers, smug half-smile; [other] glares, sweat drop" + khi cần: "comic motion lines, small dust puff, flying sweat drops, papers flying".
- Prompt Veo cho người đi xa: "Seen from behind, the man walks slowly away down the classroom aisle; his face is never shown; locked-off static camera; students stay seated, only small head movements."

**Thử Veo đổi tư thế (2026-11-18, s001 tập 1905, `projects/1905-hai-con-duong/videos/test-tu-the/s001-tu-the-veo.mp4`):** nhổm dậy + đập bàn + giấy bay làm được, camera đứng yên, mặt và tay giữ tốt, nhưng người dùng thấy "giống hoạt hình quá". Đo: lúc đỉnh 9,6% điểm ảnh đổi mỗi khung, gấp 2–3 lần clip nhân vật của mẫu (1,6–4,8%). Veo tự thêm nhòe chuyển động, giấy bay, nhún bật. Bài học: động tác lớn trên ảnh bán tả thực thì vênh; nếu dùng Veo đổi tư thế thì động tác chậm, có trọng lượng ("slow, restrained movement with real weight; no cartoon smear, no squash and stretch, no motion blur").

---

## 9b. Khung kịch bản toàn bài (mẫu 4, đo 2026-11-18)

Mẫu 4 (5:36, 1.050 từ, 101 câu) không bao giờ nói thẳng luận điểm "vua giết Nhạc Phi để giữ ngai". Nó chứng minh bằng bằng chứng tăng dần rồi để người xem tự kết luận ở câu cuối. Bản đồ nhịp (tính theo % thời lượng):

| % | Thời điểm | Nhịp | Nội dung |
|---|---|---|---|
| 0–10 | 0:00–0:35 | Hook | 6 lý do → làm ngược lại → "Vì sao?" + vế xoáy (ký giấy xưng bề tôi với người đang giữ mẹ mình) |
| 10–13 | 0:35–0:43 | Cửa vào | "Chuyện là ông vua ấy tên là Triệu Cấu. Muốn hiểu ông phải lùi về lúc ông chưa phải vua." |
| 13–22 | 0:43–1:12 | Gốc rễ | Biến cố 1127 tạo ra cả câu chuyện: cha và anh bị bắt, ông thoát, thành vua "vì không còn ai khác" |
| 22–27 | 1:13–1:32 | **Chìa khóa** | "Các bạn để ý chỗ này." Gieo luận điểm ngầm: ngai của ông đứng trên đúng một việc, ông anh không về |
| 27–41 | 1:32–2:18 | Bằng chứng 1–2 | 13 đoàn sứ xin mẹ, xin cha, không xin anh; Kim dùng ông anh làm con tin → "một ông vua sợ thắng" + "Sử không chép ông nói thế" |
| 41–51 | 2:19–2:52 | **Giữa bài: đổi thế** | Ông cha chết → còn mẹ và anh; "Kim không bán lẻ"; nhân vật phản diện thứ hai (Tần Cối) xuất hiện |
| 51–71 | 2:52–3:59 | Cao trào | Nhạc Phi thắng, xin "đón hai vua" (= đón ông anh) → 12 kim bài trong một ngày → bắt, "mạc tu hữu" |
| 71–87 | 3:59–4:52 | Hệ quả | Nhạc Phi chết; hòa ước nhục; mẹ về, quan tài về, **anh không về** (callback danh sách mở đầu); câu Tần Cối đổ trách nhiệm; tượng quỳ hôm nay |
| 87–92 | 4:53–5:10 | Soi chiếu | Lý Nhân Tông ở Đại Việt cùng năm, chọn người nối ngôi công khai |
| 92–100 | 5:10–5:36 | Kết | Ông anh chết, tin về chậm 5 năm "sử không nói vì sao"; vua sống đến 80, "không còn ai để đón" → "Vì anh về thì ai làm vua?" |

**Quy luật rút ra:**
1. **Một luận điểm ngầm duy nhất**, gieo ở khoảng 25% ("để ý chỗ này"), chứng minh bằng 3–4 bằng chứng **tăng dần độ nặng** (xin sứ → sợ thắng → 12 kim bài → giết), nói ra bằng câu hỏi ở câu cuối.
2. **Đổi thế ở giữa bài (~45%)**: một sự kiện làm bàn cờ thay đổi (một người chết, một phe mới), kèm nhân vật mới.
3. **Cao trào ở 50–70%**, không phải ở cuối. 30% sau dành cho hệ quả, callback, soi chiếu, kết.
4. **Neo năm dày đặc:** 16 lần nhắc năm trong 5,6 phút (khoảng 20 giây một lần), gần như mỗi đoạn mở bằng năm.
5. **Câu ngắn hơn của mình:** trung bình 10,4 từ/câu (tập 1905: 13,7; 1885: 12,4). Mẫu tách ý phụ thành câu riêng ("Kim không trả lời đoàn nào." / "Kim bận làm việc khác.").
6. **Nhân vật phụ chỉ có khi có việc:** Tần Cối vào ở 41%, giới thiệu bằng câu hỏi "Tần Cối là ai?" + một chi tiết đáng ngờ ("nói là trốn được. Nhiều người thời đó không tin.").
7. Mỗi tập chỉ một mạch chính; không kể song song nhiều tuyến.

**Checklist khi dựng dàn ý tập mới:** viết luận điểm ngầm thành 1 câu (không đọc lên) → chọn 3–4 bằng chứng xếp tăng dần → chọn sự kiện đổi thế cho mốc 45% → đặt cao trào trong 50–70% → kiểm 30% cuối có hệ quả + callback + câu hỏi cuối → câu trung bình ≤ 11 từ → mỗi đoạn mở bằng năm hoặc nơi.

---

## 10. STYLE HÌNH MỚI (người dùng chốt 2026-11-18, thay style của tập 1885/1905)

Người dùng hỏi "có áp dụng được style của 4 video mẫu không?", xem các bản thử và **chốt bản A**. Ảnh mẫu style: `styles/style-2026-11-18/anh-mau-style.jpg` (cảnh cụ Phan Bội Châu dẫn du học sinh đến trường ở Tokyo). Thay cho đoạn "Prompt style hình" trong `ke-chuyen-cuon-hut.md` và cho kiểu ảnh đậm, nhiều đổ bóng, ánh sáng điện ảnh của 1885/1905 (mục 2 "Bố cục khung hình" về nhân vật lớn, nhiều đồ vật, 3 lớp chiều sâu vẫn giữ).

**Đặc điểm:** hoạt hình 2D rất phẳng; viền đen dày đều; màu tô phẳng, gần như không đổ bóng, không chuyển màu, không vân; đầu to, mắt tròn đồng tử chấm đen, lông mày đậm, biểu cảm phóng đại dễ đọc; ánh sáng đều; **màu tươi nhưng không gắt**: trời xanh có mây trắng, gỗ nâu đỏ ấm, cỏ xanh tươi, hồng, cam.

**Quy trình mỗi ảnh (bắt buộc, để cả tập đồng đều):**
1. Trên Flow, gắn `anh-mau-style.jpg` vào ô tác nhân làm **ảnh tham chiếu style** (cách gắn: `src/flow-veo/veo3-up.js` + `veo2-go.js`, tên ô `veo2-<id>.jpg`). Không gắn thì style trôi (ảnh tàu và ảnh đêm mưa thử không gắn ra đổ bóng nhiều, mặt kém tròn).
2. Prompt mở đầu bằng đoạn style dưới đây, rồi đến cảnh.
3. Sau khi tải ảnh về: **giảm độ bão hòa 15%** cho mọi ảnh: `ffmpeg -i in.jpg -vf "eq=saturation=0.85" -q:v 2 out.jpg` (Flow vẽ theo prompt "vivid" ra hơi đậm; người dùng chọn mức −15%, không chọn −28%/−40%). Giữ bản gốc chưa giảm trong `images/_goc-chua-giam/`.

**Đoạn style đầu prompt:**
> Create a NEW image. Use the attached image ONLY as the art-style reference: copy its exact drawing style: very flat solid colours, thick uniform black outlines, no shading, no gradients, no texture, big heads, round simple eyes with black dot pupils, bold expressive eyebrows, simple mouths, exaggerated readable expressions, bright even light. Colours vivid and eye-catching like a bright TV cartoon: clear blue sky with white clouds (for day scenes), rich warm wood brown and red-brown, fresh green, strong pink/orange accents, pure black, strong clean contrast, no pale or washed-out areas.

**Cảnh đêm, cảnh buồn:** vẫn phẳng và đậm màu: trời xanh navy phẳng, mưa là vạch trắng thẳng, đèn là mảng vàng phẳng, vũng nước phẳng (thử ở s040: giữ được không khí buồn nhờ biểu cảm mặt). Không dùng sương, khói mờ, ánh sáng lan.

**Lưu ý khi làm tập mới:** thiết kế lại toàn bộ nhân vật theo style này (ảnh tham chiếu nhân vật mới); chỉnh khung để nhân vật chiếm ~60% khung (Flow hay để phần trời trống quá rộng); ghi rõ số người ("exactly four students") vì Flow hay vẽ thiếu.
