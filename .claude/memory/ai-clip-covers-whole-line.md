---
name: ai-clip-covers-whole-line
description: an AI clip must cover the whole narration line of its scene; no clip + leftover still image
metadata:
  type: feedback
---

When a scene gets an AI clip (Omni/Veo), the moving picture must last the WHOLE narration line (e.g. line 10 s → 10 s of motion), not "use 3 s of the clip, then the still image" (user, 2026-11-22, episode 1931: "câu s001 giọng 10s, thì video s001 cũng nên 10s cho đúng, chứ bạn bỏ ảnh tĩnh thì ko đc đúng cho lắm").

**Why:** the switch from motion back to a frozen still inside one line looks wrong.
**How to apply:** measure audio/sNNN.mp3 (+ pace padding) before planning clips. Omni = 4 s: lines up to ~4.6 s → slow the clip slightly (≤ ~15 %); longer lines → chain clips (next clip starts from the last frame of the previous one) or Veo 8 s, and state the extra credits in the per-clip plan. See [[history-video-style-prefs]].
