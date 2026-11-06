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
