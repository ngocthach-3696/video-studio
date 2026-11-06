// Drop-in replacement for the parts of edge-tts-universal@1.4.0 used by the
// explainer / news / compare projects:
//   - new EdgeTTS(text, voice, { rate, pitch, volume }).synthesize()
//       -> { audio: Blob, subtitle: [{ offset, duration, text }] }   (100-ns ticks)
//   - createSRT(subtitle), createVTT(subtitle)
//   - new IsomorphicCommunicate(text, { voice, rate, pitch, volume }).stream()
//       -> async iterable of { type: "audio", data } | { type: "WordBoundary", offset, duration, text }
// Backed by msedge-tts, which implements Edge's current (v2) Sec-MS-GEC auth.
import msedge from "msedge-tts";

const { MsEdgeTTS, OUTPUT_FORMAT } = msedge;
const DEFAULT_VOICE = "en-US-EmmaMultilingualNeural";

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function unescapeXml(s) {
  return String(s)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

// Metadata chunks are pretty-printed JSON objects that may arrive merged, so
// split on balanced top-level braces instead of trusting chunk boundaries.
function splitJsonObjects(raw) {
  const out = [];
  let depth = 0;
  let start = -1;
  let inStr = false;
  let esc = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (c === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        out.push(raw.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return out;
}

function parseWordBoundaries(raw) {
  const words = [];
  for (const obj of splitJsonObjects(raw)) {
    let parsed;
    try {
      parsed = JSON.parse(obj);
    } catch {
      continue;
    }
    for (const m of parsed.Metadata || []) {
      if (m.Type !== "WordBoundary" || !m.Data) continue;
      words.push({
        offset: m.Data.Offset,
        duration: m.Data.Duration,
        text: unescapeXml(m.Data.text?.Text ?? ""),
      });
    }
  }
  return words;
}

// Edge's endpoint intermittently closes the socket before turn.end (~40% of
// requests as of 2026-11), so retry each request on a fresh connection. After a
// few failures, drop word-boundary metadata (subtitles are optional for callers).
const RETRY_DELAYS_MS = [1000, 2000, 2000, 3000, 3000, 5000, 5000];
const WORD_BOUNDARY_ATTEMPTS = 3;

async function synthesizeRaw(text, voice, prosody) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await synthesizeOnce(text, voice, prosody, attempt < WORD_BOUNDARY_ATTEMPTS);
    } catch (e) {
      if (attempt >= RETRY_DELAYS_MS.length) throw e;
      await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
    }
  }
}

async function synthesizeOnce(text, voice, prosody, wordBoundaryEnabled) {
  const tts = new MsEdgeTTS();
  try {
    await tts.setMetadata(voice || DEFAULT_VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, {
      wordBoundaryEnabled,
    });
    const { audioStream, metadataStream } = tts.toStream(escapeXml(text), {
      rate: prosody.rate ?? "+0%",
      pitch: prosody.pitch ?? "+0Hz",
      volume: prosody.volume ?? "+0%",
    });
    const audio = [];
    let meta = "";
    metadataStream?.on("data", (c) => (meta += c.toString()));
    await new Promise((resolve, reject) => {
      audioStream.on("data", (c) => audio.push(Buffer.from(c)));
      audioStream.on("end", resolve);
      audioStream.on("error", reject);
      metadataStream?.on("error", reject);
    });
    const buffer = Buffer.concat(audio);
    if (buffer.length === 0) throw new Error("Edge TTS returned no audio");
    return { buffer, words: parseWordBoundaries(meta) };
  } finally {
    tts.close();
  }
}

export class EdgeTTS {
  constructor(text, voice = DEFAULT_VOICE, options = {}) {
    this.text = text;
    this.voice = voice;
    this.options = options;
  }

  async synthesize() {
    const { buffer, words } = await synthesizeRaw(this.text, this.voice, this.options);
    return { audio: new Blob([buffer], { type: "audio/mpeg" }), subtitle: words };
  }
}

export class Communicate {
  constructor(text, options = {}) {
    this.text = text;
    this.options = options;
  }

  async *stream() {
    const { voice, ...prosody } = this.options;
    const { buffer, words } = await synthesizeRaw(this.text, voice, prosody);
    yield { type: "audio", data: buffer };
    for (const w of words) yield { type: "WordBoundary", ...w };
  }
}

export const IsomorphicCommunicate = Communicate;

function formatTimestamp(timeIn100ns, sep) {
  const totalSeconds = Math.floor(timeIn100ns / 1e7);
  const pad = (n, l = 2) => n.toString().padStart(l, "0");
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const ms = Math.floor((timeIn100ns % 1e7) / 1e4);
  return `${pad(h)}:${pad(m)}:${pad(s)}${sep}${pad(ms, 3)}`;
}

export function createSRT(wordBoundaries) {
  return wordBoundaries
    .map((w, i) => `${i + 1}\n${formatTimestamp(w.offset, ",")} --> ${formatTimestamp(w.offset + w.duration, ",")}\n${w.text}\n\n`)
    .join("");
}

export function createVTT(wordBoundaries) {
  return (
    "WEBVTT\n\n" +
    wordBoundaries
      .map((w, i) => `${i + 1}\n${formatTimestamp(w.offset, ".")} --> ${formatTimestamp(w.offset + w.duration, ".")}\n${w.text}\n\n`)
      .join("")
  );
}

export default { EdgeTTS, Communicate, IsomorphicCommunicate, createSRT, createVTT };
