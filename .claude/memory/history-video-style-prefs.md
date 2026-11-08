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

**Thumbnail**
- 1080x1920, short big title in the upper-middle (safe for 4:5/1:1 crops, away from the bottom 20%), NO logo. Offer about 3 variants; the user picked the burning-citadel image.

**Caption**
- Short. Storytelling opener ("Chắc hẳn chúng ta không ai quên được…"), a bold title line, one question to the audience, one-line credits (AI images · ElevenLabs voice · music credit), about 5 hashtags (#VyKeChuyenSu…). Remind the user to enable the "AI info" label. The APPROVED Mưa đỏ caption (history/projects/mua-do-thanh-co-1972/caption.txt, approved 2026-11-05 after many rounds) is the template: 🔥 TITLE 🔥 → a short poem by a real witness at the top, with author credit (it shows before "Xem thêm") → "Chắc hẳn trong chúng ta không ai quên được…", a short literary and respectful paragraph → one short line of gratitude 🕯️ → "Cùng Vy tìm hiểu về … để hiểu rõ hơn về lịch sử dân tộc mình nhé!" → 5 hashtags. The user REMOVED the audience question and the credits line. Keep it short. Always save the caption to <project>/caption.txt.
- The user posts to Facebook themselves (Business Suite → upload the cover as the thumbnail).

**Workflow**
- When the user says "tiếp tục", proceed on your own and report state; batch long jobs (Flow images, ElevenLabs clips) and verify the files.
- Music: the user supplies the file (they put it in the project); I don't download copyrighted music from YouTube for them. Put music files in `<project>/music/`, not in `audio/` (that's TTS only).

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
