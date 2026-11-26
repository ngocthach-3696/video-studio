---
name: no-pink-blossoms
description: Never draw pink/white blossom trees (cherry or Tet peach) in scene images; add the ban to every Flow prompt
metadata:
  node_type: memory
  type: feedback
  originSessionId: cee3abc3-f58a-491a-a273-d14c5da04d22
  modified: 2026-11-24T18:47:18.175Z
---

No pink or white blossom trees in any scene image: no cherry blossoms and no Tết peach blossoms either (they read as cherry blossoms). User 2026-11-25, episode 1941: "các hình có hoa anh đào cũng nên bỏ đi. hãy ghi nhớ điều này để ko mất công sửa nhé". Episode 1931 already had 3 images redone for the same reason.

**Why:** cherry blossoms look Japanese, out of place in Vietnamese history; Flow adds them on its own (also copied from the pink trees in anh-mau-style.jpg).
**How to apply:** never write peach/cherry/blossom in prompts; put "no pink or white blossoms, no cherry or peach trees, no flowering trees" in the shared END text of build-project.mjs; check every sheet for pink trees before showing it. For Tết/spring, use other cues (green leaves, mist, red paper, bánh chưng). See [[history-video-style-prefs]].
