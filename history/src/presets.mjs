// Style presets. A project opts in with "preset": "<name>"; any field the
// project sets itself wins (nested objects are merged key by key).
//
// "default" reproduces the original documentary look (crossfades, Ken Burns).
// "cartoon" comes from analysing a reference chibi-history video
// (styles/hoat-hinh-su-viet.md): hard cuts every ~2-3s, near-still frames,
// fast narration, condensed subtitles mid-screen, big scene titles on top,
// channel logo + watermark, loudness normalised to -14 LUFS.

const DEFAULT = {
  transition: "fade",
  motion: null, // null = rotate through Ken Burns moves
  fadeIn: 0,
  loudnorm: false,
  pace: { xf: 0.5, lead: 0.3, pad: 0.35, tail: 1.5 },
  subtitleStyle: {
    font: null, // null = SUB_FONT from .env, else Arial
    size: null, // null = 66 (9:16) / 52 (16:9)
    outline: null,
    shadow: 2,
    marginV: null, // null = 400 (9:16) / 70 (16:9)
    maxWords: null, // null = 6 (9:16) / 9 (16:9)
    color: "#FFFFFF",
  },
  titleStyle: { font: "Noto Sans Condensed", size: 120, color: "#F5E6C8", outline: 7, outlineColor: "#3A2414", shadow: 4, marginV: 90 },
  brand: { logo: null, logoWidth: 0.26, watermark: null },
};

const CARTOON = {
  style:
    "2D cartoon illustration in a clean educational webcomic style, bold uniform black outlines, " +
    "flat cel shading with one soft shadow layer, chibi characters with large heads and big expressive round eyes, " +
    "manga emotion symbols such as sweat drops and shaking lines, warm earthy palette of tan, brown, brick red and muted teal, " +
    "detailed but uncluttered background, keep the upper fifth and the lower-middle area free of important details",
  rate: "+15%",
  transition: "cut",
  motion: "breathe",
  animateScope: "marked", // AI clips only for scenes with a "video" prompt
  fadeIn: 0.5,
  loudnorm: true,
  pace: { xf: 0, lead: 0.05, pad: 0.15, tail: 1.2 },
  subtitleStyle: { font: "Noto Sans Condensed", size: 82, outline: 6, shadow: 3, marginV: 420, marginH: 110, maxWords: 6 },
  brand: { logo: "auto" },
};

// Same editing grammar as "cartoon" (hard cuts, titles, logo) but for
// war / sacrifice topics: normal human proportions, muted palette, no gags,
// no gore, slightly slower narration.
const CARTOON_SOLEMN = {
  ...CARTOON,
  style:
    "2D animated illustration, semi-realistic characters with normal adult human proportions (not chibi), " +
    "clean ink outlines, painterly cel shading, muted palette of olive green, ash grey and earth brown " +
    "with deep red accents and dusky orange skies, solemn cinematic mood, respectful, no gore, no visible wounds or blood on people, " +
    "no text, keep the upper fifth and the lower-middle area free of important details",
  rate: "+10%",
};

export const PRESETS = { default: DEFAULT, cartoon: CARTOON, "cartoon-solemn": CARTOON_SOLEMN };

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

function merge(base, over) {
  const out = { ...base };
  for (const [k, v] of Object.entries(over ?? {})) {
    if (v === undefined) continue;
    out[k] = isObj(v) && isObj(base[k]) ? merge(base[k], v) : v;
  }
  return out;
}

// Resolves project fields as DEFAULT <- preset <- project.
export function applyPreset(project) {
  const name = project.preset ?? "default";
  const preset = PRESETS[name];
  if (!preset) throw new Error(`preset không hợp lệ: "${name}" (có: ${Object.keys(PRESETS).join(", ")})`);
  const resolved = merge(merge(DEFAULT, preset), project);
  if (!["fade", "cut"].includes(resolved.transition)) throw new Error(`transition phải là "fade" hoặc "cut"`);
  if (resolved.transition === "cut") resolved.pace = { ...resolved.pace, xf: 0 };
  return resolved;
}
