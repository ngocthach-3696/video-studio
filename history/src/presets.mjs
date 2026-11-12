// Style presets. A project opts in with "preset": "<name>"; any field the
// project sets itself wins (nested objects are merged key by key).
//
// DEFAULT is only the base config every preset builds on (crossfades, Ken Burns);
// it is not an image style any more. Image styles (2026-11-12, the user kept only these two):
// "cartoon-solemn" = semi-realistic painterly 2D (episodes Mua do 1972, 1858, 1867);
// "cartoon-flat"   = simple flat 2D Vietnamese-YouTube cartoon, the style for new episodes
//                    (styles/ke-chuyen-cuon-hut.md, section "Prompt style hinh").

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

// Shared cartoon editing grammar: hard cuts every ~2-3s, near-still frames,
// big scene titles on top, channel logo, loudness normalised.
const CARTOON_EDIT = {
  rate: "+10%",
  transition: "cut",
  motion: "breathe",
  animateScope: "marked", // AI clips only for scenes with a "video" prompt
  fadeIn: 0.5,
  loudnorm: true,
  pace: { xf: 0, lead: 0.05, pad: 0.15, tail: 1.2 },
  subtitleStyle: { font: "Noto Sans Condensed", size: 82, outline: 6, shadow: 3, marginV: 420, marginH: 110, maxWords: 6 },
  brand: { logo: "auto" },
};

const CARTOON_SOLEMN = {
  ...CARTOON_EDIT,
  style:
    "2D animated illustration, semi-realistic characters with normal adult human proportions (not chibi), " +
    "clean ink outlines, painterly cel shading, muted palette of olive green, ash grey and earth brown " +
    "with deep red accents and dusky orange skies, solemn cinematic mood, respectful, no gore, no visible wounds or blood on people, " +
    "no text, keep the upper fifth and the lower-middle area free of important details",
};

// Approved by the user 2026-11-12 (Flow tests style-test/t3, t4 in the 1867 project).
const CARTOON_FLAT = {
  ...CARTOON_EDIT,
  style:
    "simple flat 2D cartoon like a Vietnamese YouTube history animation. Very clean smooth thick black outlines, " +
    "flat solid colors, almost no shading (at most one flat soft shadow tone), no texture, no wrinkles, no hatching, no painterly lighting. " +
    "Characters: big rounded heads (about one quarter of body height), stocky simplified bodies and simple hands, smooth simple faces " +
    "with small almond-shaped eyes and black dot pupils, simple line eyebrows, a tiny line nose, small mouth, slightly comical deadpan " +
    "or smug expressions, plain skin. Simple clean background made of flat shapes. Muted palette of teal, mustard yellow, warm red, " +
    "light beige and soft grey-blue. Respectful, no gore, no text, keep the upper fifth and the lower-middle area free of important details",
};

export const PRESETS = { default: DEFAULT, "cartoon-solemn": CARTOON_SOLEMN, "cartoon-flat": CARTOON_FLAT };

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
