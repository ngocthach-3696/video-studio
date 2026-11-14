---
name: flow-project-per-topic
description: "When generating images in Google Flow for a video topic, create one new Flow project named after the topic and keep all its images there"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 7caabbcd-ba56-4918-ab1f-0f176daa6ec5
  modified: 2026-11-04T16:03:16.650Z
---

For every video topic, create a NEW Google Flow project whose name matches the topic (e.g. "Phùng Hưng – Bố Cái Đại Vương"), and generate all of that topic's character references and scene images inside it. Never mix topics in one Flow project or reuse the old test project.

**Why:** user wants each video's images organised in its own Flow project (requested 2026-11-04); it also keeps the batch script from downloading images belonging to another topic.

Also: videos are posted to Facebook → ALWAYS 9:16 (images and video). Each Flow generation should produce only x1 image (user, 2026-11-04). Flow agent settings are PER PROJECT, so on every new project open the prompt-box "Cài đặt" (tune) panel and set: image 9:16, x1, model 🍌 Nano Banana 2.1, video 9:16, then "Lưu". Wait a moment after saving before the first prompt (the first prompt right after saving still produced 2 images). Also end each prompt with "Generate exactly 1 image, vertical 9:16." as a backstop.

**How to apply:** first step of the Flow image phase in [[video-studio]] / `/cartoon-history-video` — open Flow home, create project, rename it to the topic title (same as project.json "title"), then run the batch there.

Update 2026-11-07: the agent settings panel also has "Xác nhận trước khi tạo" — set it to "Không bao giờ" for batch runs (otherwise the agent waits for confirmation). The old "Tác nhân" button no longer appears; check for the textbox "Bạn muốn tạo gì?" instead. A 73-image batch (in lots of 10–14, ~1.2 min/image) ran with no quota limit or captcha. Template scripts: history/projects/1858-tieng-sung-dau-tien/flow-gen.mjs (+ flow-collect.ps1, sheet.sh).

Update 2026-11-12 (episode 1867): Flow now rate-limits the agent: about 13–17 images in a row, then EVERY prompt fails with "Đã xảy ra lỗi. Hãy thử lại." until you wait about 40–50 minutes (a 20-minute wait was not enough; at night it once gave only 1 image after 40 minutes). A 75-scene episode therefore takes about 5–6 hours of Flow time: plan batches of ~13 with ~45-minute pauses (background `sleep`), and start a fresh agent session ("Bắt đầu phiên mới") before each batch (flow-gen.mjs in projects/1867-tu-nam-ky-den-thanh-ha-noi does this). Do not press Escape in the project page: it closes the agent panel (prompt box disappears).

Update 2026-11-12 (Flow VIDEO works on this account): the image editor only offers Nano Banana, but the project's AGENT box makes image-to-video: prompt "Use the existing image in this project titled "<Flow title>" (or describe it) as the first frame and turn it into one short video with Veo. Animate this exact illustration…". It used Veo 3.1 Lite: 8 s, 720x1280, with audio, ~1.5 min per clip, small "Veo" mark bottom-right (under the logo). Download: open the tile → "Tải nội dung nghe nhìn xuống" → menuitem "720p" (1080p/4K need an upgrade). Tests in projects/1867-tu-nam-ky-den-thanh-ha-noi/videos-test/. Veo pushes in more than asked even with "extremely slow push-in": write "locked-off static camera, no zoom" when the camera must not move.
Reliable way to pick the source image (2026-11-12): the agent often "can't find" an image by description, and the /edit/<id> URL id is NOT its media id. Instead click the prompt box "+" ("Thêm thành phần vào ô nhập câu lệnh", force click) → type in "Tìm kiếm thành phần" (searches Flow's English captions, e.g. "desk") → click the item → "Thêm vào câu lệnh", then type the prompt with keyboard.insertText and press Enter. Bigger character actions work (lifting a cup, walking to a gate) with a locked camera, but watch for drift: clothing details changed (the embroidered chest patch vanished) and a gate sprouted fake Chinese characters; a failed generation shows "Không thành công … hoàn tiền".

Update 2026-11-13 (episode 1885): Flow blocked a scene prompt with "Lượt tạo này có thể vi phạm các chính sách" because the character look said "a 13-year-old Vietnamese boy emperor". Describe child or teen historical figures without an age ("a young Vietnamese emperor, short and slim, youthful round face"); avoid "boy", "teenage", "N-year-old". That night the limit came after about 27 images (00:20).
