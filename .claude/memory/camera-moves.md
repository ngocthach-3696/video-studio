---
name: camera-moves
description: Camera engine approved 2026-11-20 — scene "camera"/"shots" (src/camera.py): punch zoom, tilt/pan, whip, black beat, shake; shorter shots
metadata:
  type: project
---

2026-11-20 the user said the camera was boring ("chỉ có mỗi zoom in/out"). Measured 6 refs (src/cam-motion.py, styles/quy-chuan-dao-dien.md section 12): refs also zoom ~90%, but shots average ~2.5 s (ours 3.8 s, 35% > 4 s) and 2–7% of shots are accent moves. Built src/camera.py + render.mjs scene fields: "camera": {path:[{t,x,y,z}], ease, shake, whip, black} and "shots": [{image, at, camera}] (several pictures inside one narration line). Test camera-test/thu-camera.mp4 (punch on dossier + shake, tilt up, whip into the port, black beat) — user: "camera ok nhé".

**Why:** user wants more lively camera than plain push/pull.
**How to apply:** new episodes: average shot ≤3 s (split long lines with "shots"), 6–10 accent moves per episode (2–3 pans on 16:9 Flow images, 2–3 punch zooms 25–45% on key details, 2–3 whips at act changes, 1–2 shakes, 1–2 black beats), mostly in the hook and big beats. See [[history-video-style-prefs]].
