---
name: voice-clone-status
description: "History-video narrator voice cloning — what was tried, what was removed, next step (VieNeu-TTS)"
metadata:
  node_type: memory
  type: project
  originSessionId: 45692065-2e0e-4e3e-8fc2-4f2aebf1bbae
  modified: 2026-11-05T17:30:37.398Z
---

Goal (2026-11-05): give history videos the narrator style of a reference clip (another channel; user says they have the owner's permission — keep written proof).

- Reference material kept in C:\video-studio\voice-ref (part1-3.mp3 still contain music; ref20.mp3 = first 19.8s, transcript in kich-ban-thu.txt / conversation). Reference style: ~3.3 syl/s overall, ~4.3 articulation, ~6 words per phrase, hook = paradox → question → "Chuyện là thế này".
- Tried: ElevenLabs IVC (API key lacks voices_write; user then refused paid credits), viXTTS/OpenVoice local (aborted), VoiceStudio/OmniVoice (Vietnamese garbled on GTX 1060 3GB, CC-BY-NC) → app uninstalled + 18.6GB data deleted 2026-11-06; Colab session deleted.
- C:\video-studio\voice-clone (viXTTS/OpenVoice leftovers) deleted 2026-11-06 at user's request.
- Next: VieNeu-TTS (github pnnbao97/VieNeu-TTS, HF pnnbao-ump/VieNeu-TTS, Apache-2.0, Vietnamese, CPU real-time) — verify training-data terms before monetized use.

**Why:** user wants local + free + Vietnamese; machine is weak (GTX 1060 3GB, 8GB RAM).
**How to apply:** prefer Vietnamese-specific, commercially-licensed, CPU-capable models; check intelligibility with faster-whisper round-trip. Related: [[history-video-style-prefs]], [[video-studio]].

Narrator voice (2026-11-11): the user CHOSE "Tuấn Anh" from vibi.pro's Community tab = ElevenLabs shared voice HG0MlJIknmaXREpTckfK ("Tuan Anh - Deep & Narrative", young male, northern accent). Use it from episode 2 of the series on (episode 1858 stays Anh Nghĩa). ElevenLabs verifies its Vietnamese only on eleven_turbo_v2_5 / eleven_flash_v2_5, not v4, so test both before a full run. src/vibi-tts.mjs is still hard-coded to MiniMax and needs an ElevenLabs provider option. The vibi favourites list now holds only this voice; the user asked to remove the others. The API has no favourites endpoint (/v1/favourite-voices exists only for the web session), and the community list is /v1/community/voices. Sample: voice-ref/vibi-tuan-anh/.

Update 2026-11-12: for new videos Tuấn Anh runs on eleven_v3 (stability 0.5) with a phrasing-punctuation text; see history-video-style-prefs.
