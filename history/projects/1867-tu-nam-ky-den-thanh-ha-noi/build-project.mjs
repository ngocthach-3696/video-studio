// usage: node build-project.mjs  -> writes project.json from kich-ban.md (narration + titles) + the image prompts below.
// Edit image prompts / characters here, then re-run. Line N of the script = scene sNNN.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const DIR = fileURLToPath(new URL(".", import.meta.url));

const STYLE =
  "2D animated illustration, semi-realistic characters with normal adult human proportions (not chibi), clean ink outlines, painterly cel shading, " +
  "muted late-19th century palette of indigo blue, earth brown, brick red and river grey with deep ochre-gold and dusky amber skies, solemn cinematic mood, " +
  "respectful, no gore, no visible wounds or blood on people, no text, keep the upper fifth and the lower-middle area free of important details";

const characters = {
  "phan-thanh-gian": {
    name: "Phan Thanh Giản",
    look: "an elderly Vietnamese Nguyen dynasty high mandarin aged about 71, very thin and frail, gentle sorrowful eyes, long sparse white beard and thin white mustache, black wrapped turban (khan van), long dark indigo silk mandarin robe with wide sleeves and a plain embroidered square on the chest without any characters",
  },
  "nguyen-trung-truc": {
    name: "Nguyễn Trung Trực",
    look: "a Vietnamese resistance leader aged about 30 from a fishing family, lean and strong, sun-tanned skin, determined sharp eyes, short black mustache, long black hair tied in a topknot under a dark brown headscarf, simple faded brown collarless tunic and loose black trousers, a red cloth band tied around his waist, barefoot, a long single-edged sword",
  },
  "nguyen-tri-phuong": {
    name: "Nguyễn Tri Phương",
    look: "an elderly Vietnamese Nguyen dynasty general aged about 73, lean weathered face, long thin white beard and white mustache, stern calm eyes, black wrapped turban (khan van), dark indigo blue silk military robe with subtle embroidered cloud patterns, wide red sash, a sheathed long sword at his side",
  },
  "hoang-dieu": {
    name: "Hoàng Diệu",
    look: "a Vietnamese Nguyen dynasty civil governor aged about 53, upright scholarly bearing, long calm face, black mustache and short black beard with a few grey hairs, firm eyes, black wrapped turban (khan van), deep blue silk mandarin robe with wide sleeves, a long sword at his waist",
  },
  "linh-phap": {
    name: "Lính Pháp 1870–1880 (hình tượng)",
    look: "a French marine infantry soldier in Indochina around 1873–1883, European man with a mustache, white cork sun helmet, dark navy blue wool tunic with brass buttons, white trousers, white cross belts, breech-loading rifle with a long bayonet",
  },
  "quan-trieu-nguyen": {
    name: "Lính triều Nguyễn (hình tượng)",
    look: "a Vietnamese Nguyen dynasty soldier of the 1870s, slim young man, small pointed lacquered conical hat (non dau) with a brass tip, short red tunic with dark blue borders and a plain round white patch on the chest without any characters, black trousers, bare feet, holding a long spear",
  },
  "quan-co-den": {
    name: "Quân Cờ Đen (hình tượng)",
    look: "a Black Flag Army soldier of the 1870s, a lean tough Chinese man from Guangxi, realistic dignified depiction, black cloth head wrap, loose black jacket and black trousers, straw sandals, a rifle on his shoulder and a broad saber at his belt, a small plain black triangular banner without any writing",
  },
  garnier: {
    name: "Francis Garnier",
    look: "a French naval lieutenant aged about 34, slim, short dark beard and mustache, dark navy blue naval officer frock coat with gold buttons, dark kepi with gold braid, a sword at his side",
  },
  riviere: {
    name: "Henri Rivière",
    look: "a French naval commander aged about 55, grey hair, thick grey mustache, dark navy blue naval officer frock coat with gold epaulettes, dark kepi with gold braid, a sword at his side",
  },
};

// [image prompt, characters[]] for each script line, in order.
const S = [
  /* 1 */ ["At night in a dim wooden room, the elderly mandarin sits alone and upright at a low desk, a small white porcelain cup in front of him, an oil lamp, rain on the lattice window, calm and sorrowful, he is not drinking", ["phan-thanh-gian"]],
  /* 2 */ ["In a dim room the wounded old general sits on a simple mat and calmly pushes away a European army doctor's hands offering white cloth bandages, defiant calm eyes, no blood", ["nguyen-tri-phuong"]],
  /* 3 */ ["Dawn mist, seen from behind: a mandarin in a blue robe walks alone toward the gate of an old Vietnamese temple with curved tiled roofs among ancient trees, smoke rising over a citadel far away", ["hoang-dieu"]],
  /* 4 */ ["Three elderly Vietnamese mandarins standing side by side on a riverbank at dusk, seen from behind in three-quarter view, long shadows, amber sky, solemn", ["phan-thanh-gian", "nguyen-tri-phuong", "hoang-dieu"]],
  /* 5 */ ["Still life, no people: an empty mandarin's desk with a folded black turban, a sheathed sword and a flickering oil lamp in the wind, dark background, questioning mood", []],
  /* 6 */ ["Wooden sailing warships firing cannons at a coastal fort on a green mountainous peninsula at dawn, white smoke over the sea, seen from the shore", []],
  /* 7 */ ["A long winding river seen from high above at sunrise, coconut palms and rice fields along the near banks, the river leading far away to the silhouette of an old brick citadel gate in the northern mist, sense of a long journey", []],
  /* 8 */ ["An aged parchment map of the Mekong delta painted in ink, rivers in indigo, the western part softly washed in warm ochre and the eastern part faded brick red, no labels, no text, no letters", []],
  /* 9 */ ["The elderly mandarin standing on the brick wall of a small riverside citadel among palm trees, looking far away, wind in his robe, dignified and weary", ["phan-thanh-gian"]],
  /* 10 */ ["Inside a grand European palace hall in the 1860s with chandeliers and gilded walls, a delegation of Vietnamese envoys in mandarin robes and turbans bowing politely before French officials in dark frock coats, the elderly mandarin in front", ["phan-thanh-gian"]],
  /* 11 */ ["French steam gunboats with tall funnels and cannons anchored on a wide brown river in front of a small Vietnamese brick citadel, a French officer in a rowing boat holding up a sealed letter with a red wax seal, tense morning", ["linh-phap"]],
  /* 12 */ ["The elderly mandarin on the citadel wall looking down at frightened villagers, mothers holding children, huddled in the narrow streets, while warship cannons on the river point at the town, painful dilemma", ["phan-thanh-gian"]],
  /* 13 */ ["The wooden gate of the citadel stands open, Vietnamese soldiers quietly lay their spears in a neat pile, French marines march in, the elderly mandarin stands aside with his head bowed, no fighting, grey sky", ["phan-thanh-gian", "linh-phap", "quan-trieu-nguyen"]],
  /* 14 */ ["A French tricolour flag of the 1860s being raised over a riverside fortress among palm trees, Vietnamese villagers watching sadly from small wooden boats", ["linh-phap"]],
  /* 15 */ ["An aged parchment map of the whole southern Mekong delta painted in ink, the entire land now washed in faded brick red, rivers in indigo, a small French tricolour pin, no labels, no text, no letters", []],
  /* 16 */ ["The elderly mandarin writing with a brush on a long paper scroll by candlelight, a square bronze official seal wrapped in yellow silk placed beside it, the writing is illegible soft strokes", ["phan-thanh-gian"]],
  /* 17 */ ["Medium close-up of the elderly mandarin sitting alone at a dark wooden table at night, his gaunt face lit by a low candle, eyes half closed looking down at a small white porcelain cup in front of him, an untouched bowl of rice pushed aside, calm and dignified sorrow, the whole head and turban fully visible inside the frame, quiet and respectful, no blood", ["phan-thanh-gian"]],
  /* 18 */ ["Two Vietnamese men in their thirties in dark tunics and turbans, the mandarin's sons, raising a plain red banner without writing and leading peasant militia with spears and machetes through coconut groves at dawn", []],
  /* 19 */ ["A painted portrait of the elderly mandarin hanging on an old wooden wall, half of it in warm candle light and half in deep shadow, symbol of a disputed judgement", ["phan-thanh-gian"]],
  /* 20 */ ["A stone stele of doctoral laureates on a stone turtle base in a temple courtyard, a workman with a hammer and chisel scraping away part of the worn inscription, all marks illegible, sorrowful grey light", []],
  /* 21 */ ["A Nguyen dynasty throne hall with red lacquered columns, officials in robes kneeling in rows, an official unrolling a yellow imperial edict with illegible marks, soft golden light", []],
  /* 22 */ ["Southern Vietnamese villagers in a market whispering and pointing with stern, angry faces toward a closed citadel gate, overcast sky", []],
  /* 23 */ ["Southern Vietnamese elders and women lighting incense at a small roadside shrine with a plain wooden tablet without writing, gentle grateful mood, evening", []],
  /* 24 */ ["Still life: an empty wooden chair with a folded indigo mandarin robe and a black turban on it, an oil lamp just blown out, a thin curl of smoke, dawn light", []],
  /* 25 */ ["The resistance leader standing at the bow of a wooden boat off a southern coast at sunset, holding his sword, fishing boats behind him, determined", ["nguyen-trung-truc"]],
  /* 26 */ ["At night on a wide river, a small 1860s European wooden two-masted sail-and-oar gunboat (lorcha) glows with a big orange fire on its deck, no paddle wheel, no tall riverboat decks, warm light reflecting on the dark water, small wooden rowing boats in the foreground among reeds, memory-like soft haze", []],
  /* 27 */ ["Night raid: Vietnamese militia with torches and swords climbing over the wooden palisade of a French fort, the leader in front, surprised guards, flames", ["nguyen-trung-truc", "linh-phap"]],
  /* 28 */ ["Several wooden sailing junks with patched sails leaving a coast at dawn toward a large green island on the horizon, calm sea", []],
  /* 29 */ ["French soldiers escorting an elderly Vietnamese woman and frightened villagers out of a riverside village, women crying, thatched houses, grey sky, no violence shown", ["linh-phap"]],
  /* 30 */ ["The resistance leader walks alone out of the mangrove forest onto a muddy riverbank toward waiting French soldiers and lays his sword down on the ground, calm and resolute", ["nguyen-trung-truc", "linh-phap"]],
  /* 31 */ ["In a colonial office a French officer behind a table offers a mandarin's hat and a folded robe, the resistance leader with bound hands stands upright and turns his face away", ["nguyen-trung-truc"]],
  /* 32 */ ["The resistance leader with bound hands standing in a prison courtyard guarded by French soldiers with rifles, grey heavy sky, he looks up calmly", ["nguyen-trung-truc", "linh-phap"]],
  /* 33 */ ["The resistance leader with bound hands speaking with dignity to a French officer, head held high, a crowd of villagers watching silently behind", ["nguyen-trung-truc"]],
  /* 34 */ ["A vast field of wild grass waving in strong wind under a dramatic amber sky, a lone sword stuck upright in the ground, no people, defiant mood", []],
  /* 35 */ ["A small market square of a southern riverside town at dawn, grieving villagers kneeling and bowing their heads, the resistance leader walking calmly between French guards, nothing violent shown", ["nguyen-trung-truc", "linh-phap"]],
  /* 36 */ ["French officers in a colonial office bent over a large table map lit by a lamp, one of them pointing north, cigars and papers, scheming mood, no readable text", ["linh-phap"]],
  /* 37 */ ["A great reddish-brown river winding north between misty limestone mountains, a small French steamboat pushing upstream, sense of a trade route into the far north", []],
  /* 38 */ ["A merchant steamboat loaded with wooden crates and rifles docked at a busy old Vietnamese riverside town with tiled roofs, the French naval lieutenant stepping ashore with a small group of marines", ["garnier", "linh-phap"]],
  /* 39 */ ["A small column of about two hundred French marines in white helmets marching along a raised dyke road between rice fields, seen from afar", ["linh-phap"]],
  /* 40 */ ["High view of a large square Vietnamese brick citadel with gate towers and a tall flag tower, thousands of Nguyen soldiers lining the walls, morning mist", ["quan-trieu-nguyen"]],
  /* 41 */ ["The elderly general standing on the gate tower of the brick citadel, white beard in the wind, hand on his sword, looking at the river, resolute", ["nguyen-tri-phuong"]],
  /* 42 */ ["The main gate of the brick citadel blown open, thick smoke and dust in the morning light, broken wooden doors, no people in focus", []],
  /* 43 */ ["Two opposing sides clearly FACING EACH OTHER across the frame: in the upper half, Vietnamese soldiers stand on top of a brick citadel wall facing toward the viewer, holding spears and old matchlock guns pointed down at the attackers; in the lower foreground, French marines are seen from behind (backs to the viewer), kneeling and firing modern breech-loading rifles up at the wall; on the river to the side a French gunboat fires its cannon at the wall, smoke, no blood", ["quan-trieu-nguyen", "linh-phap"]],
  /* 44 */ ["Dawn: French gunboats on the river firing cannons at the south gate of the brick citadel, bright muzzle flashes and smoke", []],
  /* 45 */ ["Amid smoke at the broken gate a young Vietnamese noble officer in an embroidered red robe falls backward, his sword slipping from his hand, soldiers around him, no blood", ["quan-trieu-nguyen"]],
  /* 46 */ ["The old general is CAPTURED: two French marines roughly seize him by both arms and force him down to his knees on the rubble by the citadel wall, a third French soldier points a bayonet at his chest, his sword lies kicked away on the ground, he presses one hand to his side as if wounded but keeps his head up with a stern, defiant, unbroken face, Vietnamese soldiers fleeing in panic in the background, smoke, hostile tense mood, no blood", ["nguyen-tri-phuong", "linh-phap"]],
  /* 47 */ ["The old general sitting on a mat raising his hand to refuse, turning his face away from a French army doctor holding medicine and bandages, dignified", ["nguyen-tri-phuong"]],
  /* 48 */ ["Still life: an untouched bowl of rice and a cup of water beside a simple sleeping mat, the old general's black turban and sheathed sword laid neatly beside, fading window light", []],
  /* 49 */ ["A small old brick and wood bridge over a canal among rice fields and bamboo groves west of a citadel, misty winter morning", []],
  /* 50 */ ["Black Flag soldiers marching along a mountain path with plain black triangular banners without writing, their leader, a bearded Chinese commander in his thirties, riding a horse", ["quan-co-den"]],
  /* 51 */ ["Black Flag and Vietnamese soldiers crouching hidden in bamboo groves and behind rice-field dykes near the small bridge, rifles and spears ready, tense silence", ["quan-co-den", "quan-trieu-nguyen"]],
  /* 52 */ ["The French naval lieutenant leading a handful of marines running eagerly along a narrow rice-field dyke, chasing distant Black Flag soldiers who seem to be fleeing", ["garnier", "linh-phap"]],
  /* 53 */ ["Ambush near the small bridge: Black Flag soldiers spring out of the bamboo, the French lieutenant stumbles on the dyke and drops his sword, chaos, no blood", ["garnier", "quan-co-den"]],
  /* 54 */ ["In a colonial governor's office French officials in white uniforms stand shocked, one holding a telegram paper, a ceiling fan, tense", []],
  /* 55 */ ["Vietnamese mandarins and French officers signing documents at a long table, while through the window French troops march out of the citadel gate", []],
  /* 56 */ ["An aged parchment map of the southern Mekong delta washed in faded brick red, a French tricolour pinned firmly on it and a brush laid beside, no labels, no text, no letters", []],
  /* 57 */ ["A line of French gunboats steaming up a wide river again under dark storm clouds, ominous", []],
  /* 58 */ ["Before dawn by lantern light, the French naval commander hands a sealed letter with a red wax seal to a messenger, a pocket watch open in his other hand", ["riviere"]],
  /* 59 */ ["Close-up of an old brass pocket watch without numbers, its hands near eight o'clock, the blurred silhouette of a Vietnamese citadel gate with a curved tiled roof pavilion behind, not a European castle, tense", []],
  /* 60 */ ["The governor standing on the citadel wall among his soldiers, holding his sword, calm and resolute, morning mist over the river", ["hoang-dieu", "quan-trieu-nguyen"]],
  /* 61 */ ["French gunboats on a wide red-brown river firing cannons at a brick citadel, smoke clouds, seen from the opposite bank", []],
  /* 62 */ ["Fire and black smoke rising inside the citadel, buildings burning, Vietnamese soldiers retreating in chaos, no blood", ["quan-trieu-nguyen"]],
  /* 63 */ ["A French tricolour flag being raised on top of the Hanoi Flag Tower (a tall hexagonal brick tower standing on three stacked square brick terraces, with a small octagonal lookout pavilion on top, Vietnamese 19th century architecture, not a European castle), smoke drifting around it, grey sky", []],
  /* 64 */ ["The governor writing a memorial with a brush by candlelight in a dim hall, smoke glowing through the window behind him, composed and sorrowful, illegible writing", ["hoang-dieu"]],
  /* 65 */ ["Still life at dawn: the courtyard of an old Vietnamese temple with a large ancient tree, a sheathed sword and a folded black turban laid on the stone steps, falling leaves, no people", []],
  /* 66 */ ["The Hanoi Flag Tower (a tall hexagonal brick tower standing on three stacked square brick terraces, with a small octagonal lookout pavilion on top, Vietnamese 19th century architecture, not a European castle) at sunset, a plain red banner without writing still fluttering in the wind, solemn and proud", []],
  /* 67 */ ["Black Flag soldiers waiting in ambush in bamboo groves near the small bridge again, rifles ready, early summer light", ["quan-co-den"]],
  /* 68 */ ["Ambush on a road near the small bridge: Black Flag soldiers firing from bamboo, the grey-haired French commander falling from his horse, French soldiers scattering, no blood", ["riviere", "quan-co-den"]],
  /* 69 */ ["The small bridge at dusk, two fallen French officer kepis lying in the grass beside it, empty and quiet", []],
  /* 70 */ ["A large fleet of French troop ships and gunboats arriving in a river delta, many soldiers disembarking with artillery, overwhelming force", ["linh-phap"]],
  /* 71 */ ["The three elderly mandarins standing together on a misty hilltop looking toward the horizon, three-quarter back view, amber dusk light, solemn", ["phan-thanh-gian", "nguyen-tri-phuong", "hoang-dieu"]],
  /* 72 */ ["An old brick citadel wall at sunset with three incense sticks burning before it, smoke curling upward, quiet reverence", []],
  /* 73 */ ["French warships approaching a sandy river mouth with low earthen forts at dawn, a lagoon behind, the distant walls of an imperial city far inland", []],
  /* 74 */ ["Night: the imperial citadel glowing with distant fire; seen from behind, a small boy king in a yellow robe stands in a palace doorway looking out at the flames", []],
  /* 75 */ ["A calm Vietnamese river at dusk with an empty small wooden sampan and a glowing paper lantern drifting, no people, bamboo on the banks, gentle and melancholic ending", []],
];

// extra per-scene settings (1-based line number)
const EXTRA = {
  8: { layers: "layers/s008.json" }, // route: river mouth -> Vĩnh Long -> An Giang -> Hà Tiên (ship icon, arrow, target ring)
};

const lines = fs.readFileSync(DIR + "kich-ban.md", "utf8").split("\n").filter((l) => /^\d+\. /.test(l));
if (lines.length !== S.length) throw new Error(`kich-ban.md có ${lines.length} câu nhưng có ${S.length} prompt ảnh`);
const scenes = lines.map((l, i) => {
  let text = l.replace(/^\d+\.\s*/, "");
  let title;
  const m = text.match(/^`\[([^\]]+)\]`\s*/);
  if (m) { title = m[1]; text = text.slice(m[0].length); }
  const narration = text.replace(/\s*⚠/g, "").trim();
  const [image, chars] = S[i];
  const s = { narration, image };
  if (title) s.title = title;
  if (chars.length) s.characters = chars;
  Object.assign(s, EXTRA[i + 1] || {});
  return s;
});

const project = {
  title: "1867 – Từ Nam Kỳ đến thành Hà Nội",
  series: "Ngược dòng trăm năm – Tập 2",
  preset: "cartoon-solemn",
  style: STYLE,
  format: "9:16",
  imageProvider: "manual",
  animate: "none",
  tts: "manual",
  voiceNote: "vibi.pro, giọng Tuấn Anh = ElevenLabs HG0MlJIknmaXREpTckfK, eleven_turbo_v2_5, stability 0.35, similarity 0.75, speed 1 (history/src/vibi-tts.mjs mặc định)",
  brand: { logo: "auto", watermark: null, logoWidth: 0.18, logoOpacity: 0.7, logoBlur: 0.8, logoMarginX: 0.06 },
  loudnorm: -16,
  // background music (user's choice 2026-11-12): Pixabay "Historical History Documentary Music" (ViacheslavStarostin),
  // played from 0 and crossfaded into a second copy whose ending lands on the video's end -> music/bgm-1867.wav
  music: "projects/1867-tu-nam-ky-den-thanh-ha-noi/music/bgm-1867.wav",
  musicStart: 0,
  musicVolume: 0.7,
  subtitles: false,
  characters,
  scenes,
};
// keep a hand-made soundscape if project.json already has one
if (fs.existsSync(DIR + "project.json")) {
  const old = JSON.parse(fs.readFileSync(DIR + "project.json", "utf8"));
  // (2026-11-12: the user removed the SFX booms; no soundscape carried over)
}
fs.writeFileSync(DIR + "project.json", JSON.stringify(project, null, 1) + "\n");
console.log(`project.json: ${scenes.length} cảnh, ${Object.keys(characters).length} nhân vật`);
