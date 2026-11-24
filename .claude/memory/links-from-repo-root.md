---
name: links-from-repo-root
description: "File links in replies must be relative to the repo root (video-studio), never to the shell's current directory"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 8447c105-a050-4bdc-ac20-43d1f09b2475
  modified: 2026-11-21T17:47:14.968Z
---

Markdown file links in replies must start from the repo root, e.g. `[kich-ban.md](history/projects/<slug>/kich-ban.md)`, regardless of where the shell `cd`'d. 2026-11-22 I wrote `(kich-ban.md)` / `(../projects/...)` relative to the Bash cwd and the user said: "path sai rồi, sao lần nào bạn gửi path cũng sai vậy" (it has happened repeatedly).

**Why:** the IDE resolves links from the workspace root, so cwd-relative links open nothing.
**How to apply:** before sending, check every link begins with `history/`, `.claude/`, etc. (a top-level folder of video-studio). Never use `../` or bare file names.
