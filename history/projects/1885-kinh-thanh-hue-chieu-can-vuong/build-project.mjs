// usage: node build-project.mjs  -> writes project.json from kich-ban.md (narration + titles) + the image prompts below.
// Line N of the script = scene sNNN. Style = preset cartoon-bold (approved 2026-11-13: composition of the reference video), no STYLE override.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const DIR = fileURLToPath(new URL(".", import.meta.url));

const characters = {
  "ham-nghi": {
    name: "Vua Hàm Nghi",
    look: "a young Vietnamese emperor, short and slim, youthful round face, calm serious eyes, bright yellow imperial robe with a simple round dragon outline on the chest (no characters), small yellow wrapped turban, black cloth shoes",
  },
  "ton-that-thuyet": {
    name: "Tôn Thất Thuyết",
    look: "a stern Vietnamese Nguyen dynasty regent and general aged about 46, big sturdy body, dark tanned square face, thick black eyebrows, short black mustache and short black beard, fierce eyes, black wrapped turban, vermilion red silk court robe with wide sleeves, wide black belt, a sheathed sword at his side",
  },
  "nguyen-van-tuong": {
    name: "Nguyễn Văn Tường",
    look: "a Vietnamese Nguyen dynasty regent mandarin aged about 59, thin, long narrow face, thin grey mustache and small grey goatee, narrow cautious eyes, black wrapped turban, teal blue silk court robe with wide sleeves, holding a closed folding fan",
  },
  harmand: {
    name: "Hác-măng (Harmand)",
    look: "a French colonial civil commissioner aged about 38, slim, pale face, neat brown mustache and small pointed brown beard, arrogant smug expression, black frock coat, white shirt, black bow tie, black top hat",
  },
  "de-courcy": {
    name: "Đờ Cuốc-xi (De Courcy)",
    look: "a French army general aged about 58, stout with a round belly, red cheeks, big bushy white walrus mustache, dark navy blue general's tunic with gold buttons and gold embroidered cuffs, dark blue kepi with gold braid, red trousers, a sword at his side",
  },
  "tu-duc": {
    name: "Vua Tự Đức",
    look: "a frail elderly Vietnamese emperor aged about 54, pale thin face, thin black mustache, tired kind eyes, pale yellow imperial robe, pale yellow wrapped turban",
  },
  "truong-quang-ngoc": {
    name: "Trương Quang Ngọc",
    look: "a Vietnamese mountain chieftain aged about 30, lean, shifty eyes glancing sideways, thin black mustache, dark indigo tunic, black head wrap, red waist sash, a short knife at his belt",
  },
  "linh-phap": {
    name: "Lính Pháp 1880 (hình tượng)",
    look: "a French marine soldier of the 1880s, European man with a brown mustache, white cork sun helmet, dark navy blue tunic with brass buttons, white trousers, rifle with a long bayonet",
  },
  "quan-ta": {
    name: "Lính triều Nguyễn (hình tượng)",
    look: "a Vietnamese Nguyen dynasty soldier of the 1880s, slim young man, small pointed lacquered conical hat with a brass tip, short red tunic with dark blue borders and a plain round white patch on the chest without characters, black trousers, barefoot, holding a long spear",
  },
};

const CUA_HUU = "the Cua Huu (south-west gate) of the Hue citadel: a thick old brick and stone citadel wall with ONE big round-arched gate tunnel, on top of the wall above the arch a small single-storey wooden watchtower pavilion with a curved yellow tiled roof, and set into the wall directly above the arch a large horizontal dark red wooden name plaque with a gold border that is COMPLETELY BLANK";
const NGO_MON = "the Ngo Mon gate of the Hue imperial citadel: a massive brick gate base with a big arched middle door and smaller side doors, topped by a two-storey wooden pavilion with yellow glazed tiled curved roofs, and directly above the middle door a large horizontal dark red wooden name plaque with a gold border that is COMPLETELY BLANK";
const HALL = "a Hue palace hall with red lacquered pillars, carved golden wooden screens, hanging red paper lanterns and a polished tiled floor in perspective";
const JUNGLE_FORT = "a jungle mountain fortress: a tall wooden palisade gate with two small watchtowers, thatched barracks and earthen walls among dense green jungle, misty mountains behind";
const MAP = "an aged parchment map in flat cartoon style filling the whole frame, lying on a dark wooden table, simple ink coastline and rivers, green hills, an oil lamp and an ink brush at the edges, no labels, no text, no letters";
const ENVOY = "a French diplomat in a black frock coat, white shirt and black bow tie, grey mustache, bare head (no hat)";

// 2026-11-15: rewritten for the 85-line script that follows history/styles/quy-chuan-dao-dien.md.
// One sentence = one literal picture; shot sizes alternate (close-up / insert / medium / wide / map / metaphor);
// colour moods per act: storm grey-blue (act 1) → dim palace red-gold (act 2) → warm day then secret night (act 3)
// → night blue + fire orange (act 4) → jungle green and dawn gold (act 5) → rain grey, then harsh North African sun (act 6) → dusk.
const TOP = ". Keep the top quarter of the frame calm and simple (dark sky, smoke or plain wall) with no important details, room for a big title";
const PDP = "an old Vietnamese scholar-general aged about 50 with a long thin white beard, black wrapped turban, dark blue scholar robe, a sword at his belt";
const SCHOLAR = "a thin Vietnamese young scholar, sharp bright eyes, determined face, black wrapped turban, plain dark indigo scholar robe";
const BOARD = "a large horizontal plain wooden board that is COMPLETELY BLANK (no writing)";

// [image prompt, characters[]] for each script line, in order. "KEEP" = reuse an existing image (see KEEP below).
const S = [
  // ── Mở đầu
  /* 1 */ ["Wide high view before dawn: the Hue imperial citadel engulfed in fire, the Ngo Mon gate pavilion silhouetted against a huge orange glow, black smoke columns rising, tiny flashes of gunfire along the walls, the Perfume River reflecting the flames in the foreground" + TOP, []],
  /* 2 */ [`Pre-dawn, medium-wide view in front of ${CUA_HUU}: a small column of people in dark robes slips quietly out of the arch toward the viewer, bent low, some carrying bundles; burning torches on both sides of the arch, orange fire glow and smoke behind the wall, gunfire flashes in the sky, wet dark stone road in the foreground`, []],
  /* 3 */ ["Close-up: a big strong hand in a vermilion red silk sleeve grips the thin wrist of the young emperor and pulls him forward; the young emperor, waist-up and large, is dragged along but looks back over his shoulder with frightened wide eyes; orange firelight and smoke behind, sparks in the air", ["ham-nghi"]],
  /* 4 */ ["Insert, low angle inside a dark abandoned throne hall: a big empty golden throne on red lacquered steps, an open wooden chest of gold ingots left on the steps in the foreground, a fallen yellow silk parasol, cold moonlight beams through the open doors, orange fire glow behind the lattice windows", []],
  /* 5 */ ["Extreme close-up insert: a small hand in a bright yellow silk sleeve holds one rolled paper scroll tied with a red cord in the centre of the frame, the scroll lit by a soft warm glow; dark blurred palace corridor with red lanterns behind", []],
  /* 6 */ ["Close-up portrait: the young emperor's face fills most of the frame, calm and serious beyond his age, soot on one cheek, orange firelight on one side of his face and cold blue dawn light on the other, smoke drifting behind", ["ham-nghi"]],
  /* 7 */ ["Visual metaphor, low camera angle in a jungle clearing at dusk: the young emperor (in a plain brown tunic) stands small in the centre holding up one rolled paper scroll toward a gigantic black French cannon that towers over him and fills the right half of the frame; bamboo and banana leaves frame the edges, orange dusk light" + TOP, ["ham-nghi"]],
  /* 8 */ ["Grand view of the Hue citadel at sunrise: the Ngo Mon gate with its two-storey pavilion and yellow tiled roofs, the wide Perfume River with small sampans in front, flowering trees in the foreground; heavy dark storm clouds rolling in from the sea over the golden sunrise, birds flying away", []],
  // ── Hồi 1 – Hai mươi bốn giờ (storm grey-blue)
  /* 9 */ ["Inside a dim imperial bedchamber: the frail old emperor lies in bed under a yellow silk canopy, large in the frame, eyes peacefully closed; in the foreground the backs of kneeling mandarins in black turbans with bowed heads; tall red candles, incense smoke, cold grey light from a window with rain", ["tu-duc"]],
  /* 10 */ ["KEEP", []],
  /* 11 */ ["A Vietnamese soldier large in the foreground runs back across a smoking earthen fort on grey sand dunes, looking back in fear; behind him French marines climb over the broken wall; smoke, small fires, a toppled old bronze cannon; on a wooden post in the foreground three fresh knife tally marks", ["quan-ta", "linh-phap"]],
  /* 12 */ [`Medium shot inside ${HALL}, grey storm light: the French commissioner, large on the right, holds out a sealed letter with a red wax seal; a nervous Vietnamese mandarin in a black turban on the left with sweat drops; on the table in the foreground between them a big hourglass with the sand running out fast` + TOP, ["harmand"]],
  /* 13 */ ["Close-up of the French commissioner, his face filling half the frame, smug arrogant smile, pointing his finger at the viewer; behind him on the wall an old parchment map of an S-shaped coastline with a big pink eraser rubbing at it, lit from below by an oil lamp", ["harmand"]],
  /* 14 */ [`Signing scene inside ${HALL}: in the foreground sad Vietnamese mandarins sign a long treaty document at a red lacquered table with brush and ink; the French commissioner stands large behind them with arms crossed, smug; two French soldiers guard the door; grey rain light from the windows`, ["nguyen-van-tuong", "harmand"]],
  /* 15 */ ["Extreme close-up insert, top-down: a sheet of old treaty paper fills the whole frame, covered with neat rows of small grey scribble lines that are not readable; in the middle a large clean empty rectangle of paper with nothing written in it, circled by a thick red ink brush circle; a brush tip and an ink stone at the bottom edge. No readable text anywhere", []],
  /* 16 */ ["Gag at a red lacquered table in a palace pavilion: a Vietnamese mandarin in a black turban on the left holds out a sealed letter toward a Qing Chinese envoy in a round hat on the right, but a smug French official in a black frock coat leans in between them, large in the centre, and snatches the letter in mid-air; both envoys look shocked", []],
  /* 17 */ [`Gag: a traditional Vietnamese wooden house with a curved tiled roof, ${BOARD} above the door; the Vietnamese owner in a black turban stands large in the left foreground looking at it sadly; a French officer leans in the doorway twirling a big iron key ring, smug; potted bonsai, lanterns, grey afternoon light`, ["linh-phap"]],
  // ── Hồi 2 – Một năm, bốn vua (dim palace red-gold)
  /* 18 */ ["Inside a dim palace throne hall: a golden throne on red steps in the centre, long dark shadows of grasping hands reach toward it from both sides across the floor, cracks in the floor tiles, red pillars framing the shot, one beam of cold moonlight; outside the window far away a stormy sea", []],
  /* 19 */ ["Gag still life in a palace dressing room: four bright yellow imperial robes on four wooden clothes stands in a row; the first three stands are knocked over with their yellow robes crumpled on the floor, only the fourth stand is still upright with its robe; red pillars and one lantern behind" + TOP, []],
  /* 20 */ ["A young Vietnamese emperor of about 30 in a yellow robe, large in the frame, is escorted out of the throne hall by two palace guards gripping his arms, surprised face; on a side table in the foreground three short burnt-out candles", []],
  /* 21 */ ["Night in a dim palace room: a middle-aged Vietnamese emperor in a yellow robe sits slumped and frightened, large in the frame, while a stern official's arm in a dark sleeve holds out a small cup on a lacquered tray toward him in the foreground; one oil lamp casting long shadows on the wall", []],
  /* 22 */ ["A pale thin young Vietnamese emperor in a yellow robe lies sick in bed under a canopy, large in the frame, an old physician kneels feeling his pulse; a steaming medicine bowl in the foreground, dim candlelight, worried servants behind", []],
  /* 23 */ [`Low angle: the two regents stand side by side, knee-up and large, behind an empty golden throne, one in teal and one in red, looking down sternly at the viewer, inside ${HALL}`, ["nguyen-van-tuong", "ton-that-thuyet"]],
  /* 24 */ ["Gag, high angle: two giant hands from above, one in a red silk sleeve and one in a teal silk sleeve, move small emperor figurines in yellow robes on a big chessboard that fills the frame; two figurines already knocked over; candle light on a palace floor", []],
  /* 25 */ ["The red-robed regent stands large in the foreground at an open palace window, seen over his shoulder, fist clenched, determined angry eyebrows, watching French warships with smoking funnels on the river outside; wooden lattice frames the shot", ["ton-that-thuyet"]],
  /* 26 */ [`Wide view of a palace pavilion: Vietnamese mandarins in black turbans sign papers at a red lacquered table, reluctant; ${ENVOY} stands over them pointing at the paper; French soldiers along the walls, red pillars and lanterns`, ["nguyen-van-tuong"]],
  /* 27 */ [`Close-up: a square metal seal with a small crouching lion on top (no characters on it) melts in a small glowing furnace in the foreground, flames and sparks; ${ENVOY} watches smugly with arms crossed; mandarins in black turbans watch sadly in the background`, []],
  /* 28 */ [`High angle wide view of a palace courtyard: a long row of Vietnamese mandarins in black turbans and colourful robes bow deeply toward ${ENVOY} and French officers standing at the top of the stairs; yellow tiled roofs, grey sky`, []],
  // ── Hồi 3 – Cậu bé ngoài cung (warm day, then secret night)
  /* 29 */ ["Coronation, low angle: the young emperor sits on a huge golden throne, his feet not touching the floor, looking small and serious; rows of mandarins kneeling below in the foreground; warm golden light, red pillars, incense smoke, yellow parasols", ["ham-nghi"]],
  /* 30 */ ["Warm sunny flashback: the young emperor (wearing plain brown commoner clothes instead of the robe) eats a simple bowl of rice with a pair of chopsticks, sitting on a bamboo bench in front of a humble thatched village house, chickens and banana trees around, large in the frame", ["ham-nghi"]],
  /* 31 */ ["The young emperor in his yellow robe stands large in front of a tall bronze mirror in a palace room, looking at it in wonder; in the mirror his reflection wears plain brown commoner clothes; warm lantern light", ["ham-nghi"]],
  /* 32 */ [`The red-robed regent stands large beside the young emperor's golden throne with his hand on his sword hilt, protective and stern, the young emperor seated; inside ${HALL}`, ["ton-that-thuyet", "ham-nghi"]],
  /* 33 */ [`Split composition: the red-robed regent bows politely to ${ENVOY}, but behind his back his hand grips his sword hilt, shown clearly in the foreground; palace courtyard with red pillars`, ["ton-that-thuyet"]],
  /* 34 */ ["Training ground in front of palace walls: the red-robed regent stands large in the foreground with arms crossed; behind him rows of young Vietnamese soldiers practise thrusting spears in unison, dust, morning sun", ["ton-that-thuyet", "quan-ta"]],
  /* 35 */ ["Night: workers carry wooden chests and sacks of rice onto ox carts out of a palace side gate, lit by red lanterns; one worker large in the foreground puts a finger to his lips, secretive", []],
  /* 36 */ [`${JUNGLE_FORT}, seen from the path in front of the gate; above the gate hangs ${BOARD}; soldiers carry supplies in through the gate, morning mist`, []],
  /* 37 */ ["Extreme close-up insert: the tip of a fine ink brush draws a red circle around a tiny hidden fort among green mountains on an aged parchment map; the map fills the frame, an oil lamp glow at the edge; no labels, no letters", []],
  // ── Hồi 4 – Đêm 23 tháng Năm (night blue + fire orange)
  /* 38 */ ["The French general on horseback, large in the foreground, leads a long column of French marines along the Perfume River toward the walls of the Hue citadel; banana trees and the riverbank, hot afternoon light", ["de-courcy", "linh-phap"]],
  /* 39 */ ["The French general sits smugly in a carved armchair, large in the frame, hiding a pair of iron handcuffs behind his back, shown clearly; a French colonial office with a desk, papers and a tricolour-free plain wall", ["de-courcy"]],
  /* 40 */ [`Symmetrical frontal view of ${NGO_MON}, warm late afternoon light. In front of the middle door the French general on a horse points his riding crop at the middle door, while a Vietnamese palace guard stands in the doorway blocking it with his spear crossed, shocked`, ["de-courcy"]],
  /* 41 */ ["The red-robed regent lies in bed pretending to be sick, large in the frame, a wet cloth on his forehead, one eye open slyly; his sword leaning on the bed, a teapot on a side table, wooden room", ["ton-that-thuyet"]],
  /* 42 */ ["Extreme close-up: the regent's face fills more than half the frame, split lighting, the left half lit warm red-orange by a lantern at the frame edge, the right half in deep blue shadow, eyes narrowed in a hard decision" + TOP, ["ton-that-thuyet"]],
  /* 43 */ ["Night: the red-robed regent stands up and draws his sword, knee-up and large in the frame, determined; a lantern glowing behind him, an open door to the dark courtyard", ["ton-that-thuyet"]],
  /* 44 */ ["Night on the citadel wall: a big signal cannon in the foreground fires into the dark blue sky, a bright yellow flash and white smoke; a Vietnamese gunner covers his ears; a crescent moon; a plain red flag without writing", ["quan-ta"]],
  /* 45 */ ["Night attack, camera placed BEHIND the whole Vietnamese army: EVERY soldier is seen from the back, we only see their backs, red tunics and the backs of their conical hats, NO faces visible; they wade across the river and charge toward a two-storey French colonial residence building with arched windows on the far bank, fire arrows flying toward it", []],
  /* 46 */ ["Night: fires burning along both banks of the Perfume River, roofs of houses aflame, orange reflections on the dark blue water, a small empty sampan in the foreground, black smoke, no bridge", []],
  /* 47 */ ["Grey dawn: French marines kneel behind sandbag barricades firing rifles toward the viewer, the front marine large in the foreground, gun smoke and pale morning light", ["linh-phap"]],
  /* 48 */ ["Dawn inside the Hue citadel, camera placed BEHIND a French field cannon: the cannon is large in the lower foreground seen from behind, its barrel pointing STRAIGHT AWAY from the viewer, firing at a burning citadel wall far ahead, a white muzzle blast; far ahead, small Vietnamese soldiers retreat AWAY from the viewer toward that wall: EVERY Vietnamese soldier is seen from the back, NO faces visible", ["linh-phap"]],
  /* 49 */ ["Palace buildings burning with black smoke; French soldiers in the foreground carry away golden vases and wooden chests, one grinning; broken lanterns and scattered papers on the ground", ["linh-phap"]],
  /* 50 */ [`Smoky dawn in front of ${CUA_HUU}: the red-robed regent, large in the frame, leads the young emperor and three royal ladies in long robes out of the arch, carrying bundles; a few soldiers with spears behind; grey-orange light`, ["ton-that-thuyet", "ham-nghi"]],
  /* 51 */ ["KEEP", []],
  /* 52 */ ["Seen from behind over his shoulder: the young emperor walks out through a dark citadel gate tunnel toward a misty road, looking back once; through the arch behind him the palace glows orange with fire", ["ham-nghi"]],
  // ── Hồi 5 – Tờ giấy (jungle green, dawn gold)
  /* 53 */ ["KEEP", []],
  /* 54 */ ["Inside a jungle fortress hall made of wood and bamboo: the red-robed regent stands large in the frame reading aloud from an unrolled yellow edict, the young emperor seated behind him; in the foreground the backs of kneeling officials and soldiers; torchlight" + TOP, ["ton-that-thuyet", "ham-nghi"]],
  /* 55 */ ["Close-up still life, no people, no hands: a long yellow silk imperial edict scroll unrolled on a red lacquered table, its surface completely plain and blank (no writing, no characters, no marks), only one red square seal stamp near the end, rays of golden light falling on it" + TOP, []],
  /* 56 */ [`Messengers on horseback gallop out of the gate of ${JUNGLE_FORT}, toward the viewer and in different directions, the front rider large in the foreground holding a rolled scroll; dust and golden morning light`, []],
  /* 57 */ ["Three villagers step forward together, large in the frame: a strong farmer raising a hoe, a merchant offering a cloth bag of coins, a scholar in a black turban holding a brush and paper; a village market and a banyan tree behind, crowds watching", []],
  /* 58 */ ["Comical contrast on a grassy hill, low camera angle: a tiny rolled paper scroll lies in the foreground next to a neat pyramid of black cannonballs, beside a huge black cannon that fills most of the frame; clouds behind", []],
  /* 59 */ ["Close-up: a tiny glowing ember falls onto a field of dry golden straw filling the frame, small flames starting to spread, sparks, dusk sky", []],
  /* 60 */ [`Hilltop at dawn: the young emperor (in a plain brown tunic) stands among ordinary peasants with hoes and soldiers with spears, all large in the frame; the people look at him surprised and moved; at the side of the path a wooden signpost with ${BOARD}; golden sunrise behind`, ["ham-nghi"]],
  /* 61 */ ["Split composition divided vertically: on the left half, in cold grey light, a small puddle of melted metal with a broken lion-shaped knob in a dead furnace; on the right half, in warm golden light, a long yellow edict scroll with one red square seal stamp and no writing", []],
  /* 62 */ [`A wide dry field of golden straw under a scorching sun, cracked earth, villagers in conical hats standing at the edge watching the sky; at the edge of the field a wooden signpost with ${BOARD}; dry heat haze`, []],
  /* 63 */ ["Sunrise over mountains and rice fields: a crowd of scholars in black turbans and peasants with spears and hoes march toward the viewer under plain red banners without writing, the front marchers large in the foreground, more groups on the hills behind", []],
  /* 64 */ [`${PDP}, waist-up and large in the frame, commands his troops in a misty mountain forest, pointing ahead; soldiers with old guns and spears behind him among big trees`, []],
  /* 65 */ [`A fortified village surrounded by flooded rice fields, thick bamboo hedges and earthen walls; at the village gate ${BOARD}; defenders with spears and old guns on the walls; the front defender large in the foreground`, []],
  // ── Hồi 6 – Vị vua không trở về (rain grey, then harsh sun)
  /* 66 */ ["The young emperor (wearing a brown jungle tunic and a headscarf instead of the robe) sits large in the frame with a small band of loyal soldiers in a thatched hut deep in a rainy jungle; rain falls outside the open side, a small cooking fire", ["ham-nghi"]],
  /* 67 */ ["Night jungle path: the shifty traitor, large in the foreground, leads French soldiers with lanterns along the path, pointing ahead and looking back nervously; big leaves frame the shot, moonlight", ["truong-quang-ngoc", "linh-phap"]],
  /* 68 */ ["The young emperor (in a brown jungle tunic instead of the robe) stands defiantly and points angrily at the traitor, who flinches and looks away in shame; both large in the frame, jungle clearing at night with torches, French soldiers in the background", ["ham-nghi", "truong-quang-ngoc"]],
  /* 69 */ ["An old steamship arrives at a white North African harbour city with domes, minarets and palm trees under a harsh bright sun; on the deck in the foreground the young emperor in a dark tunic looks at the strange city with a sad face", ["ham-nghi"]],
  /* 70 */ ["Split-screen composition divided horizontally into two panels: the upper panel shows a green Vietnamese river landscape with a thatched village and a boy in brown clothes; the lower panel shows a sunny North African garden with white houses and palm trees and an old Vietnamese man in a dark Western suit with a grey beard; a thin dark line between the panels" + TOP, []],
  /* 71 */ ["An older Vietnamese man with a neat black beard, wearing a dark Western suit, paints at an easel, knee-up and large in the frame, in a sunny garden with palm trees, white houses and bougainvillea", []],
  /* 72 */ ["Close-up: a painting on an easel showing sky, clouds, green mountains and a river fills the frame, an old man's hand holding a brush in front of it, a single tear drop falling; window light", []],
  // ── Kết
  /* 73 */ ["The young emperor stands at a fork in the road, large in the frame: one way leads to a golden palace with a throne, the other way into a dark jungle path; he looks toward the jungle", ["ham-nghi"]],
  /* 74 */ ["Symbolic still life: an empty golden throne half transformed into a plain old wooden chair, in the centre of an empty dark palace hall, one beam of light from above, dust in the air", []],
  /* 75 */ ["Close-up: a small flame in an old lantern in the centre, protected from wind and rain by the cupped hands of four Vietnamese people around it: a farmer in a conical hat, a scholar in a black turban, an old woman in a brown headscarf, and a Nguyen dynasty soldier in a short red tunic and a small pointed conical hat (NO armour, NO helmet); rain falling, warm glow on the hands and faces", []],
  /* 76 */ ["Present day evening in an old street of Hue: families in modern clothes kneel at small altar tables set in front of their houses, lighting incense, soft smoke curling, offerings of fruit and rice, motorbikes parked, warm lanterns, solemn", []],
  /* 77 */ ["Gag still life, top-down view, no people, no hands: a big pink rubber eraser broken into two pieces with small crumbs, lying on an old parchment map of an S-shaped coastline on a wooden desk filling the frame; the map is completely intact, nothing erased, no labels", []],
  /* 78 */ ["Dusk on a lonely hilltop: a big beacon fire burning down to low glowing embers and thin smoke fills the lower half of the frame, a broken plain red banner without writing lying beside it, misty mountains and a fading orange sky behind", []],
  /* 79 */ [`Night in a humble thatched village house: ${SCHOLAR} sits large in the frame at a low wooden table reading a copy of a long yellow edict scroll by the light of one oil lamp, his eyes burning with determination; the scroll surface is plain with no writing; old books and a brush on the table, a bamboo window with a dark village outside`, []],
  /* 80 */ [`Rainy hillside at dawn: ${SCHOLAR} stands alone, knee-up and large in the frame, soaked, fists clenched, staring at the horizon with unbroken determination; behind him on the ground lie abandoned bamboo spears and a torn plain red banner without writing, his fellow students walking away in the distance`, []],
  /* 81 */ [`Mysterious close-up: the face of ${SCHOLAR} fills the frame, half lit warm by an oil lamp at the frame edge and half in deep shadow, eyes looking straight at the viewer, serious and thoughtful; dark background with a faint glow` + TOP, []],
  /* 82 */ ["Village volunteer camp at dawn among coconut palms: a young Vietnamese boy in plain brown clothes and a black head wrap practises with a long wooden staff, large in the frame, watched proudly by his father, a stern middle-aged Vietnamese commander in a dark blue robe and black turban with a sword; villagers train with spears behind, plain red banners without writing", []],
  /* 83 */ ["Close-up: an old weathered hand passes a small glowing old lantern to two young hands reaching from opposite sides, one hand in a dark indigo sleeve, the other in a white sleeve; warm golden glow on the hands, dark blue night background, symbolic", []],
  /* 84 */ ["A road splits into two at dawn on a hill: two young Vietnamese scholars seen from behind, large in the foreground, faces not visible, each walks down a different path: the one on the left in a dark indigo robe carries a sword toward a distant battlefield with smoke and dark mountains, the one on the right in a white robe carries a book toward a sunny village with a small school house; big dawn sky", []],
  /* 85 */ ["Dusk on the Perfume River: an empty small wooden sampan and a glowing paper lantern drift in the foreground, the silhouette of the Ngo Mon gate with its two-storey pavilion far behind, orange and purple sky, calm and melancholic", []],
];

// Reused pictures: the two animated route maps the user approved (layers coordinates are tied to these images),
// and scene 51 = callback, the same frame as scene 3 (made sepia, "memory" look) — copied by hand, not generated.
const KEEP = { 10: "map: French warships to Thuan An (old s007)", 51: "callback = s003 in sepia", 53: "map: Hue → Tan So (old s054)" };
// still lifes / landscapes: the style asks for "small extras", so say explicitly that nobody is there
const NO_PEOPLE = [1, 4, 8, 15, 18, 19, 37, 55, 58, 59, 61, 74, 77, 78, 85];

const lines = fs.readFileSync(DIR + "kich-ban.md", "utf8").split("\n").filter((l) => /^\d+\. /.test(l));
if (lines.length !== S.length) throw new Error(`kich-ban.md có ${lines.length} câu nhưng có ${S.length} prompt ảnh`);
const scenes = lines.map((l, i) => {
  let text = l.replace(/^\d+\.\s*/, "").replace(/★\s*/g, "");
  let title;
  const m = text.match(/^`\[([^\]]+)\]`\s*/);
  if (m) { title = m[1]; text = text.slice(m[0].length); }
  const narration = text.replace(/\s*\((cũ|bản đã chốt)[^)]*\)/g, "").replace(/\s*⚠/g, "").trim();
  const [image, chars] = S[i];
  const s = { narration, image: image === "KEEP" ? `(ảnh giữ lại: ${KEEP[i + 1]})` : NO_PEOPLE.includes(i + 1) ? image + ". Nobody in the scene: no people, no figures, no soldiers, no faces" : image };
  if (title) s.title = title;
  if (chars.length) s.characters = chars;
  return s;
});

// Animated route maps (layers.py, the style the user approved).
scenes[9].layers = "layers/s010.json";
scenes[52].layers = "layers/s053.json";
// "dừng lại để nhìn" shots hold still (quy chuẩn 3.3)
for (const n of [15, 51]) scenes[n - 1].motion = "still";
// Veo clips (2026-11-15, quy chuẩn 3.5: ~15% động, dồn ở đầu và giữa, tối đa 2 ở cuối).
// Prompt đầy đủ: videos/v2/veo-prompts.json; clip gốc: videos/v2/sNNN-veo.mp4; videos/sNNN.mp4 = bản dùng
// (s003 = lần 2, 15:37; bản lần 1 giữ hình ở videos/v2/s003-giu-hinh-lan1.mp4).
const VEO = JSON.parse(fs.readFileSync(DIR + "videos/v2/veo-prompts.json", "utf8"));
for (const id of ["s001", "s003", "s006", "s007", "s013", "s027", "s042", "s044", "s046", "s052", "s059", "s075", "s076"])
  scenes[Number(id.slice(1)) - 1].video = VEO[id];

const SLUG = "1885-kinh-thanh-hue-chieu-can-vuong";
const project = {
  title: "1885 – Kinh thành Huế và chiếu Cần Vương",
  series: "Ngược dòng trăm năm – Tập 3",
  preset: "cartoon-bold",
  format: "9:16",
  imageProvider: "manual",
  animate: "flow",
  animateScope: "marked",
  veoAudio: { volume: 1, lufs: -24 },
  motion: "alternate",
  tts: "manual",
  voiceNote: "vibi.pro, giọng Tuấn Anh = ElevenLabs HG0MlJIknmaXREpTckfK, eleven_v3, stability 0.5, speed 1, lời từ tts-ngat-nhip.txt",
  brand: { logo: "auto", watermark: null, logoWidth: 0.18, logoOpacity: 0.7, logoBlur: 0.8, logoMarginX: 0.06 },
  loudnorm: -16,
  music: `projects/${SLUG}/music/bgm.wav`,
  musicStart: 0,
  musicVolume: 1.0,
  subtitles: false,
  characters,
  scenes,
};
fs.writeFileSync(DIR + "project.json", JSON.stringify(project, null, 1) + "\n");
console.log(`project.json: ${scenes.length} cảnh, ${Object.keys(characters).length} nhân vật`);
