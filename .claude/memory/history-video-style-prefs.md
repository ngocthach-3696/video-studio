---
name: history-video-style-prefs
description: "All review feedback the user gave while making \"Vy kể chuyện Sử\" history videos: visuals, audio, narration, hook, thumbnail, caption, workflow"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 91b33aab-ab1d-4ea1-8969-c20bb1b7dcdb
  modified: 2026-11-05T13:42:42.813Z
---

The user asked (2026-11-05) to remember ALL of their review and feedback for future videos. Collected during "Mưa đỏ – Thành cổ 1972" (history/projects/mua-do-thanh-co-1972, use it as the reference project.json):

**Visuals**
- No burned-in narration subtitles (`"subtitles": false`). Keep the big scene titles ("81 NGÀY ĐÊM", years…).
- No text watermark "Vy kể chuyện Sử" (`brand.watermark: null`); the logo is enough.
- Logo small and soft, not bright: `brand.logoWidth 0.18, logoOpacity 0.7, logoBlur 0.8, logoMarginX 0.06` (bottom-right; 2026-11-08 the user asked to move it a little left, logoMarginX = gap to the right edge as a fraction of width, default 0.02).
- Re-check images and replace bad ones (wrong era, text in the image, wrong map) before rendering.

**Audio**
- Male voice: ElevenLabs "Tung Dang – Deep, Warm and Resonant" (3VnrjnYrskPMDsapTr8X), Eleven v4 (used for Mưa đỏ).
- **From 2026-11-07 (series "Ngược dòng trăm năm"): voice "Anh Nghĩa" on vibi.pro** = official MiniMax system voice `Vietnamese_Serene_Man` ("Serene Man – Solemn, Cinematic": deep, warm, for historical documentaries). Provider `minimax`, model `speech-2.8-hd`, speed 1, pitch 0, vol 1. API: POST /v1/text-to-speech/Vietnamese_Serene_Man {text, model_id:"speech-2.8-hd", provider:"minimax", language_code:"Vietnamese", voice_settings:{speed,pitch,vol}}; costs 1 credit/char. Generate with history/src/vibi-tts.mjs. Confirmed by ear on 2026-11-07 ("nghe chuẩn rồi, chốt giọng Anh Nghĩa"); do not use the "Minh Khang" voice.
- Overall loudness -16 LUFS (`"loudnorm": -16`); -14 felt too loud ("giọng hơi to").
- The user wants background music ("âm thanh sống động"). Music sits about 15 dB under the voice (musicVolume ≈ 0.85 for a piano at -18 LUFS), ducked under narration, voice band EQ'd out of the music. Measure music versus voice stems; don't guess.
- If the track is about as long as the video, use `musicStart: "end"` so its ending lands on the video's ending, plus `musicTrim` for leading silence.
- Sound from second 0: an intro ambience bed (rain, rumble, distant booms) via `ambience`, with a boom timed to the "mưa bom" line.

**Narration**
- Open with the strongest line (a shocking number or question), and a big title from frame 0.
- (2026-11-07) Do NOT use the stiff self-intro "Mình là Vy." at the start or end. Bring Vy in warmly instead: "Hôm nay, hãy cùng Vy … nhé." Close with "Cảm ơn bạn đã cùng Vy đi qua những năm tháng ấy. Hẹn gặp lại bạn ở tập sau nhé." (picked by the user 2026-11-07). Avoid repeating the same idea in neighbouring lines (e.g. "quay ngược trăm năm" twice); the series name can appear as on-screen title only.
- Cut meta or filler lines: "Đó là hết hồi một/hai/ba", "Mình thêm một ý,". Keep "sử chép khác nhau" disclaimers, the callback to the opening question, and Vy's intro/outro. Remove scenes with `"skip": true` (keeps ids aligned).
- (2026-11-12, script review of episode 2) Writing taste: warm, conversational sentences that flow ("gần gũi, thân thiện", "mượt"), not clipped fragments ("đừng ngắn cụt ngủn"), but also not wordy; each key beat needs a "wow" (a twist, contrast or callback). Explain the context the viewer needs (the pretext for each French attack, how a hero died, the treaty name). Avoid repeating a word inside a sentence ("chữa… cứu chữa"). Say "tuyệt thực", not "không ăn". No rhetorical "Còn bạn, bạn nghĩ sao?" ending. Keep the closing line "Cảm ơn bạn đã cùng Vy đi qua những năm tháng ấy. Hẹn gặp lại bạn ở tập sau nhé."

**Thumbnail**
- 1080x1920, short big title in the upper-middle (safe for 4:5/1:1 crops, away from the bottom 20%), NO logo. Offer about 3 variants; the user picked the burning-citadel image.

**Caption**
- Short. Storytelling opener ("Chắc hẳn chúng ta không ai quên được…"), a bold title line, one question to the audience, one-line credits (AI images · ElevenLabs voice · music credit), about 5 hashtags (#VyKeChuyenSu…). Remind the user to enable the "AI info" label. The APPROVED Mưa đỏ caption (history/projects/mua-do-thanh-co-1972/caption.txt, approved 2026-11-05 after many rounds) is the template: 🔥 TITLE 🔥 → a short poem by a real witness at the top, with author credit (it shows before "Xem thêm") → "Chắc hẳn trong chúng ta không ai quên được…", a short literary and respectful paragraph → one short line of gratitude 🕯️ → "Cùng Vy tìm hiểu về … để hiểu rõ hơn về lịch sử dân tộc mình nhé!" → 5 hashtags. The user REMOVED the audience question and the credits line. Keep it short. Always save the caption to <project>/caption.txt.
- The user posts to Facebook themselves (Business Suite → upload the cover as the thumbnail).

**Workflow**
- When the user says "tiếp tục", proceed on your own and report state; batch long jobs (Flow images, ElevenLabs clips) and verify the files.
- Music: the user supplies the file (they put it in the project); I don't download copyrighted music from YouTube for them. Put music files in `<project>/music/`, not in `audio/` (that's TTS only).
- Script revisions (2026-11-11, user: "lần sau ko cần tách ra làm 2 file, ghi đè lên là đc"): when revising a script (kich-ban.md) or similar draft, OVERWRITE the file in place; do not keep kich-ban-v1.md / v2 copies side by side. (git history and the conversation keep the old version.)

**Why:** these are direct corrections from the user's review.
**How to apply:** use these as the defaults for every new history episode (project.json + scripts); see [[video-studio]] and [[flow-project-per-topic]].

**Motion (2026-11-06)**
- The user wants motion like the reference cartoon video (see history/styles/hoat-hinh-su-viet.md): short AI image-to-video clips (Google Flow/Veo) with SUBTLE, minimal motion: water ripples, smoke, candle flicker, cloth or leaves swaying, a character blinking, breathing, trembling, tightening a grip. Static camera or an extremely slow push-in, no cuts inside a clip, keep the exact 2D style and faces ("Animate this exact illustration…"). Use only about 2–4 s of each clip, with hard cuts. Do not use big actions (rowing, turning, walking) or strong camera moves. Veo sound: ambience only, no dialogue or music (muted or replaced in the mix).

**Preferred style (2026-11-06): history/styles/hoat-hinh-chuyen-dong-ai.md**
- The user picked the reference Facebook.mp4 (their Downloads, a Vietnamese 2D cartoon history video, 504s, about 2.6 s per shot, hard cuts, -14 LUFS) as THE style: "tôi muốn style như này". Each shot is an AI image-to-video clip with small, local motion (eyes darting, a slight head turn, flags waving, papers or dust flying, smoke, torches, cartoon wind streaks) and an almost static camera. Local `"fx"` effects (src/fx.py) cannot animate eyes, flags or papers, so use them only for static shots (landscapes, maps, villages). Shots with characters need AI clips (Flow/Veo, Kling/Wan via fal, or free tiers). Always confirm the cost with the user first.

**Each episode stands alone (2026-11-07)**
- Do NOT reuse images (or other assets) from a previous episode, even when the narration refers back to it ("ko thừa kế gì của Mưa đỏ hết"). Generate every scene image fresh in the episode's own Flow project and style.

**Sound design (2026-11-08)**
- For 1858 the user chose scene-timed sound effects (`soundscape`) instead of background music. They removed every gong/bell ("tiếng chuông") and an extra cannon shot right after another: do not use gongs, and keep cannon hits sparse (no back-to-back booms).

**Style decision (2026-11-12, replaces 2026-11-11)**
- 2026-11-11 the user rejected the Western big-nosed sitcom caricature style. 2026-11-12 they sent 3 sample frames of a Vietnamese YouTube history cartoon (simple flat 2D, thick smooth outlines, no shading/wrinkles, small almond eyes with dot pupils, deadpan/smug faces, muted teal/mustard/red/beige) and approved Flow tests t3/t4 (projects/1867-tu-nam-ky-den-thanh-ha-noi/style-test/): "oke đấy, hãy áp dụng style này cho các video sau". From episode 3 on, use the style prompt in history/styles/ke-chuyen-cuon-hut.md (section "Prompt style hình") instead of the painterly semi-realistic STYLE of 1858/1867. Episode 1867 stays as rendered. User 2026-11-12: "không cần phải giữ, từ tập sau trở đi làm mới hoàn toàn": from the next episode START FRESH: new storytelling (ke-chuyen-cuon-hut.md), new image style, new character designs; do NOT carry over the old STYLE string, character refs, prompts or script structure from 1858/1867 (build-project.mjs there is only a code template).
- **From 2026-11-11: voice "Tuấn Anh"** (the user chose it in vibi.pro's Community tab) = ElevenLabs shared voice `HG0MlJIknmaXREpTckfK` ("Tuan Anh - Deep & Narrative"), model `eleven_turbo_v2_5` (the model ElevenLabs verifies for this voice in Vietnamese), about 0.5 credit per character. It is now the default of history/src/vibi-tts.mjs; a 46-character test cost 23 credits. Use it for every new video. Anh Nghĩa stays only for episode 1858 (re-generate with `--voice Vietnamese_Serene_Man`). Settings chosen by ear on 2026-11-11: stability 0.35 (picked doan-2-turbo-stab0.35.mp3 over stability 0.5 and eleven_v4), similarity_boost 0.75, speed 1; this is the script default. vibi ignores `style`/`use_speaker_boost`.
**Motion: animated map routes (2026-11-11, user: "tôi thích style này")**
- The user likes the layered map shot (1858 s012): a red dashed route drawn progressively from the bay up to the citadel gate, with the camera slowly panning up along it. Use it by default for map, route, fleet or territory scenes, via `"layers"` + `path` (history/src/layers.py, template projects/1858-tieng-sung-dau-tien/layers/s012.json). It is free (no AI video). The user DISLIKED the other two layered test shots: the cut-out character on a new background (s024) and the flying paper sheets (s068). Do NOT use cut-out characters or flying cut-out props in future videos; use layers only for map routes.
- Map extras the user wants in future videos (2026-11-11), all free and local: (1) an icon riding at the tip of the route (a small ship for sea routes, a plain banner for land routes, Flow stickers on green, no symbols or text); (2) a pulsing target ring at the destination once the line arrives; (3) several routes at once with arrowheads, brick red = invaders, indigo blue = Vietnamese forces. NOT implemented yet in layers.py (it only has dashed path + dot head): add `icon`, `target`, `head:"arrow"` options to the path layer the first time a new episode needs a map shot, then show the user test frames. Option 4 (spreading territory stain) was dropped by the user.

**Storytelling + visual style (2026-11-12): history/styles/ke-chuyen-cuon-hut.md**
- The user showed a second reference (Downloads\Facebook (1).mp4, Chinese-history 2D cartoon, 278 s, ~2.5 s/shot) and said they like its images, character motion AND storytelling. Key points: open with a paradox revealed piece by piece ("Bệnh nhân ấy là hoàng đế. Hoàng đế ấy là …"), central question on screen by ~30 s, source cues ("Sử chép:"), characters speak in quoted dialogue, a misdirect-then-twist per act, one everyday metaphor, callbacks, end on the opening question + a cliffhanger to the next episode (before Vy's outro). ~240 wpm while speaking, long 1.5–2.3 s silences only before big turns. One image per sentence that literally illustrates it; text inside the picture (name boards, signposts, hanging time signs; generate blank boards and add Vietnamese text ourselves); thought bubbles, foreshadowing shadows, colour-coded characters, mood lighting; big on-screen text only for questions. Use it for new episodes together with hoat-hinh-chuyen-dong-ai.md; the user's earlier rules (no subtitles, small logo, -16 LUFS, Vy outro) still win.

**Motion on hold (2026-11-12)**
- The user: "chuyển động nhân vật tạm để qua 1 bên… hiện tại tôi đang dùng ảnh tĩnh… khi nào có tài khoản pro tôi sẽ yêu cầu dùng". For now new episodes use STATIC images (no Veo/Kling clips, no character-motion tests); keep the motion notes (hoat-hinh-chuyen-dong-ai.md, ke-chuyen-cuon-hut.md "Chuyển động", Flow Veo notes) for later. Only start AI motion when the user says they have a Pro account and asks for it. Free local moves (map routes via layers, breathe/Ken Burns) are still fine.

**Voice pacing stays as before (2026-11-12)**
- I tried the reference video's pacing on episode 1867 (pace.pad 0.3 + 15 dramatic pauses via scene `pauseAfter`, engine feature kept). The user preferred the old version: "bản cũ vẫn hay hơn… giọng đọc, nhấn nhá, ngắt nhịp cứ giữ như video cũ… hiện tại chưa cần học thêm gì". Keep the old narration pacing (preset default pace, no pauseAfter, Tuấn Anh speed 1). Do not propose more reference-video learning unless the user asks.

**Narration voice & phrasing (2026-11-12, replaces the 8% slow-down)**
- On 1867 the user first picked "slow 8% with atempo", then rejected it: "bỏ giọng chậm 8%… giọng đọc chưa nhấn nhá, ngắt nhịp chưa chuẩn". Fix chosen by ear (voice-test/NGHE-v3.mp3 over NGHE-turbo.mp3): same voice Tuấn Anh (HG0MlJIknmaXREpTckfK) on model **eleven_v3**, stability 0.5, speed 1 (≈1 credit/char), AND a separate TTS text with phrasing punctuation (same words as the script, checked by script): drop commas that split a phrase ("Đánh, thì" → "Đánh thì"), "…" before a reveal, a full stop to isolate a punch line ("Và không trở ra."), "…" mid-quote. Template: projects/1867-tu-nam-ky-den-thanh-ha-noi/tts-ngat-nhip.txt. Check every clip with faster-whisper and retry bad takes (v3 sometimes slips: "già"→"gia", "Vĩnh"→"vích"). No atempo slow-down.

**Music (2026-11-12, episode 1867)**
- I tried reference-style sound (pizzicato "em" + tense "cang" tracks switched per act, music cut + low boom before each death). The user rejected it all ("bỏ hết đi") and picked ONE track: Pixabay "Historical History Documentary Music" by ViacheslavStarostin (https://pixabay.com/music/main-title-historical-history-documentary-music-366065/, 204 s). Use a single solemn documentary track for the whole video, looped with a crossfade so its ending lands on the video end, ducked under the voice (~19 dB under). No mood switching, no boom hits. Free Pixabay music (Pixabay Content License) is OK to download; note the source in <project>/music/NGUON.txt.

**APPROVED final of episode 1867 (2026-11-12, user: "ok rồi đấy, hãy ghi nhớ để áp dụng vào các video sau")**
- Voice: Tuấn Anh on eleven_v3 (stability 0.5, speed 1) read from tts-ngat-nhip.txt (phrasing punctuation), every clip Whisper-checked (src/whisper-score.py, batch template projects/1867…/tts-v3.sh). vibi-tts.mjs now defaults to eleven_v3/0.5.
- Music: one solemn documentary track (Pixabay) for the whole video, built to the video length with music/build-bgm.sh, ~14–15 dB under the voice. No SFX/booms.
- Big on-screen titles must say something about the line being read: the user replaced the series name "NGƯỢC DÒNG TRĂM NĂM" with the episode title, and removed "NHỔ HẾT CỎ" (a quote fragment). Don't put the series name or quote fragments as titles.
- Image review checklist (mistakes the user caught): no figure cut off by a hard seam or a dark block (a "no face" prompt produced that: show the face instead); opposing armies must FACE each other (not aim the same way); a capture must look hostile (soldiers seizing arms, bayonet), not like helping; Flow-written Vietnamese text is avoided.
- Review loop: the user reviews by timestamp; collect fixes and render once; if the audio length changes, rebuild bgm before rendering.

**Default music for ALL future videos (2026-11-12, user: "hãy ghi nhớ nhạc nền và sử dụng cho các video sau luôn")**
- Always use the same track: history/assets/music/historical-documentary.mp3 (Pixabay, ViacheslavStarostin, source in assets/music/NGUON.txt). This is an explicit exception to "each episode stands alone". Fit it per video with `bash src/build-bgm.sh <video_seconds> projects/<slug>/music/bgm.wav` (rebuild whenever the video length changes), project.json: "music": "projects/<slug>/music/bgm.wav", "musicStart": 0, "musicVolume": 0.7; measure ≈14–15 dB under the voice. Don't search for other music unless the user asks.

**Caption style (2026-11-12, replaces the poem-first template)**
- The user tried many versions on 1867 and CHOSE this shape (saved as projects/1867-tu-nam-ky-den-thanh-ha-noi/caption.txt): (1) Vy asks the viewer a personal question with 🤔 ("Có bao giờ bạn tự hỏi, nếu đứng trước…, mình sẽ…?"); (2) one sentence leading into a bullet list, 🔸 one bullet per key person/event with place and year; (3) one intriguing line ("Mỗi người một hoàn cảnh, nhưng câu trả lời của họ lại giống nhau đến lạ."); (4) call to watch: "Cùng Vy xem đến cuối để hiểu … nhé! 🕯️"; (5) 5 hashtags. No poem, no title line with 🔥, no credits. Avoid "kể hơi buồn" type lines. The user likes bullet points; offer 2–3 options when they ask for another style.

**Thumbnail 1867 (2026-11-12)**
- After 3 rounds the user picked a SYMBOLIC still life (sword + folded turban on Võ Miếu steps, ancient tree, smoke far behind, no people) with "1867 – 1882 / BA CÁI CHẾT / MỘT LỰA CHỌN". They rejected the first scene-like backgrounds ("ảnh khác đi") and the first title sets ("chủ đề hay hơn"). Offer varied concepts (close-up face, dramatic action, symbolic object) and title options as small comparison sheets; script template thumbnail/make-bia.sh (args: bg, out, sub, big, red, redSize, bigSize — shrink sizes so lines fit 1080 px).

**Motion back on, with Veo (2026-11-13, episode 1885)**
- The user pointed out a Flow Veo clip costs only ~10 credits, so AI motion is back (replaces "Motion on hold"). Test s016-veo.mp4 approved ("video này ổn"): officer twirling keys, old man sighing, static camera. They REJECTED the free alternative of cutting one still into several cropped shots ("vẫn là chuyển ảnh, nhân vật không chuyển động").
- Workflow: generate ALL scene images first; the user then picks the good images to animate. Don't make clips before they choose.
- Prompt must say "The first frame must be identical to the attached image: same framing, same size and position of every character, no reframing, no crop, no zoom out" + "Locked-off static camera"; without it Veo zoomed out (s010). Attach the image via the agent box "+" search (Flow caption), Veo 3.1 Lite, 8 s 720p; download lands in Downloads (extension mode does not fire Playwright download events).

**Image redesign + sign font (2026-11-13, episode 1885)**
- The user: "nhân vật oke, nhưng chủ thể, màu sắc, cảnh vật chưa đủ wow" → "ok hãy áp dụng theo video mẫu". Follow history/styles/ke-chuyen-cuon-hut.md section "Bố cục khung hình" (100 shots of Facebook (1).mp4 in styles/ref-ke-chuyen/): characters LARGE (60–80% of frame height, knee/waist-up, many close-ups), frame full edge to edge with detailed architecture/props, 3 depth layers, one-point perspective, bold saturated colours (vermilion, black, gold, wood brown, night blue), two-tone cel shading, visible light sources (torches, lanterns, fire). Test prompts: projects/1885-kinh-thanh-hue-chieu-can-vuong/style-test/batch.mjs; character looks unchanged.
- Place names go on a sign INSIDE the picture (user: s001 escape scene needs a "Ngọ Môn" plaque above the gate "cho khán giả biết"). Flow draws a COMPLETELY BLANK plaque; we add the Vietnamese text with ffmpeg drawtext. Font chosen by the user ("chốt kiểu 8", wanted "chữ hồi xưa", old-style): **Alegreya SC Bold** (history/assets/fonts/AlegreyaSC-Bold.ttf, OFL), gold #F4CF5A, 3 px dark-brown border #3A1A0A, soft shadow, size ~54 on a 768 px image. Rejected/not chosen: Times, Old Standard, Playfair SC, Pattaya, Lobster, Prata, Charm, Charmonman and other Google Fonts.
- Ảnh cảnh tấn công: mục tiêu phải nằm TRƯỚC MẶT quân ta (camera sau lưng/bên hông). Nếu quân chạy về phía người xem mà mục tiêu ở sau lưng thì trông như bỏ chạy. Phải ghi rõ "EVERY soldier seen from the back, NO faces visible", nếu không Flow vẫn vẽ lính phụ quay mặt ra camera (người dùng chê s046 tập 1885 hai lần, 2026-11-14).
- Chữ trên cuộn chiếu/băng lụa: viết 1 dòng chạy DỌC THEO CHIỀU DÀI tấm lụa, từ cuộn trục này sang cuộn trục kia, nắn theo phối cảnh (ffmpeg drawtext trên canvas trong suốt → perspective sense=destination → overlay), đỏ son #8E1A12, Alegreya SC Bold. KHÔNG viết ngang theo màn hình (người dùng chốt ở s056 tập 1885, 2026-11-14). Bảng tên nằm nghiêng (vd s063) cũng vậy: đo 4 góc mặt bảng rồi nắn chữ theo, không dùng drawtext thẳng.
- Bản đồ Việt Nam trong ảnh: mô tả kỹ hình chữ S (bắc rộng, giữa rất hẹp, nam là mũi Cà Mau), nước láng giềng để trơn màu be, LUÔN có 2 cụm đảo nhỏ Hoàng Sa + Trường Sa, KHÔNG vẽ đảo Hải Nam. NHƯNG ở s075 tập 1885 (2026-11-14) người dùng thấy bản đồ chuẩn kiểu này phẳng, xấu hơn và GIỮ ẢNH CŨ (bản đồ giấy da nhiều chi tiết, hình chưa chuẩn). Vậy: ưu tiên bản đồ đẹp, nhiều chi tiết, đúng style; chỉ nêu lỗi địa lý để người dùng quyết, không tự làm lại.
- Căn chữ trên bảng tên: căn theo THÂN CHỮ HOA (bỏ dấu hỏi/ngã/mũ), không căn theo cả khối chữ có dấu. Nếu căn cả khối thì dấu kéo khối lên, thân chữ tụt xuống 8–11 px (người dùng bắt lỗi s001 tập 1885). bang-chu.sh đã tự làm việc này (y = cy - ascent + 0.325*size, cap-height của Alegreya SC Bold ≈ 0.65*size). Bảng nghiêng: đo 4 góc mặt bảng rồi nắn bằng perspective, cũng căn theo thân chữ. Sau khi chèn LUÔN đo kiểm: diff ảnh gốc/ảnh mới, hàng có ≥35% điểm chữ = thân chữ, so tâm với tâm mặt bảng (lệch ≤2 px).
