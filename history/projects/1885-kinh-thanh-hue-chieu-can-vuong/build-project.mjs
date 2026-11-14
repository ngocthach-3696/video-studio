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

// [image prompt, characters[]] for each script line, in order.
const S = [
  /* 1 */ [`Night before dawn, low camera angle in front of ${CUA_HUU}. Behind the wall the sky glows orange with fire, gunfire flashes and grey smoke rise. Out of the arch, large in the frame and walking toward the viewer, the red-robed regent firmly leads the young emperor by the hand, both glancing back worried. Burning torches on both sides of the arch, a few small palace guards with spears in the background, dark stone pavement with orange reflections in the foreground, the edge of a red lacquered pillar framing the left side`, ["ton-that-thuyet", "ham-nghi"]],
  /* 2 */ [`Low angle inside a dark Hue throne hall at night: a big empty golden throne on red lacquered steps fills the centre, moonlight beams falling through the open doors, red lacquered pillars framing both sides, orange fire glow through the lattice windows; in the foreground on the steps an open wooden chest of gold ingots left behind and a fallen yellow silk parasol, nobody there`, []],
  /* 3 */ ["Big close-up: a small hand in a bright yellow silk sleeve holds a single rolled paper scroll tied with a red cord, filling the centre of the frame, the scroll glowing softly; behind it a dark palace corridor with red lanterns and pillars, gunfire glow far away", []],
  /* 4 */ [`Waist-up portrait of the young emperor facing the viewer, filling most of the frame, calm serious face, inside ${HALL}, a golden throne and golden screen behind him, warm candlelight from both sides`, ["ham-nghi"]],
  /* 5 */ ["The young emperor (now wearing a plain dark brown tunic instead of the robe), waist-up and large in the foreground, holds the wet rail of an old steamship and looks back sadly; ropes, a lifebuoy and a smoking black funnel frame the shot; behind him a stormy grey-green sea and a misty coastline with mountains far away, seagulls", ["ham-nghi"]],
  /* 6 */ ["Comical contrast in a jungle clearing at sunset: the young emperor stands in the centre, puzzled, with a sweat drop; on his left on a tree stump lies a tiny rolled paper scroll, on his right a huge black French cannon towers over him; dense bamboo and banana trees behind, orange sunset light", ["ham-nghi"]],
  /* 7 */ [`${MAP}: the coast of central Vietnam with a lagoon river mouth and a square walled citadel a little inland, several small French steam warships with black smoke drawn at sea in the lower right`, []],
  /* 8 */ ["Grand view of the Hue citadel at sunrise: the Ngo Mon gate with its two-storey pavilion and yellow tiled roofs fills the upper half, in front the wide Perfume River with small sampans and a dragon boat, flowering trees and a stone embankment in the foreground; heavy dark storm clouds rolling in from the sea over the golden sunrise, birds flying away", []],
  /* 9 */ ["Inside a dim imperial bedchamber: the frail old emperor lies in bed under a yellow silk canopy, large in the frame, eyes peacefully closed; in the foreground the backs of kneeling mandarins in black turbans with bowed heads; tall red candles, incense smoke, gold and deep red tones, sad and solemn", ["tu-duc"]],
  /* 10 */ ["Low angle from the sand dunes at a river mouth: big French steam warships with tall black funnels fire their cannons, huge white smoke clouds and orange muzzle flashes; in the foreground an earthen Vietnamese fort wall with an old bronze cannon and sand flying from explosions", []],
  /* 11 */ ["A Vietnamese soldier large in the foreground runs back across a smoking earthen fort on the sand dunes, looking back in fear; behind him French marines climb over the broken wall with rifles; smoke, small fires, broken sandbags and a toppled old cannon", ["quan-ta", "linh-phap"]],
  /* 12 */ [`Inside ${HALL}: the French commissioner, large on the right, holds out a sealed letter with a red wax seal; a nervous Vietnamese mandarin in a black turban on the left with sweat drops; on the table in the foreground between them a big hourglass with sand running out`, ["harmand"]],
  /* 13 */ ["Close-up of the French commissioner, his face filling half the frame, smug arrogant smile, pointing his finger at the viewer; behind him on the wall a big pink eraser rubbing out part of an old parchment map, lit from below by an oil lamp", ["harmand"]],
  /* 14 */ [`Signing ceremony inside ${HALL}: in the foreground Vietnamese mandarins with sad faces sign a long document at a red lacquered table with brush and ink; the French commissioner stands large behind them with arms crossed, smug; two French soldiers guard the door`, ["nguyen-van-tuong", "harmand"]],
  /* 15 */ ["Gag in a palace courtyard in heavy rain: a big French soldier, large in the frame, with exactly two arms and two hands: his right hand holds a black umbrella tilted fully over the head of a small worried Vietnamese mandarin standing beside him, as if protecting him from the rain, while his left hand grips the back of the mandarin's collar firmly; his rifle is slung across his back with no hand on it; the soldier himself gets wet, smug smile; puddles, red pillars and a tiled roof behind", ["linh-phap"]],
  /* 16 */ ["Gag: a traditional Vietnamese wooden house with a curved tiled roof fills the frame, a blank wooden name board above the door; the Vietnamese owner in a black turban stands large in the left foreground looking at it sadly; a French officer leans in the doorway twirling a big iron key ring, smug; potted bonsai, lanterns, warm afternoon light", ["linh-phap"]],
  /* 17 */ ["Inside a dim palace throne hall: a golden throne on red steps in the centre wobbles (small motion lines), long dark shadows of grasping hands reach toward it from both sides across the floor, red pillars framing the shot, a single beam of cold moonlight", []],
  /* 18 */ ["Gag still life, no people: four small yellow silk imperial turbans (soft wrapped cloth head bands with visible fabric folds, clearly cloth headwear, not fruit, not pots) each on its own small wooden hat stand on a long red lacquered shelf filling the frame; three stands knocked over with their turbans fallen, only one still upright; palace background with red pillars and a lantern", []],
  /* 19 */ ["A young Vietnamese emperor of about 30 in a yellow robe, large in the frame, is escorted out of the throne hall by two palace guards gripping his arms, surprised face; on a side table in the foreground three burnt-out candles; the empty throne behind", []],
  /* 20 */ ["Night in a dim palace room: a middle-aged Vietnamese emperor in a yellow robe sits slumped and frightened, large in the frame, while a stern official's arm holds out a small cup on a lacquered tray toward him in the foreground; one oil lamp casting long shadows", []],
  /* 21 */ ["A pale thin young Vietnamese emperor in a yellow robe lies sick in bed under a canopy, large in the frame, an old physician kneels feeling his pulse; a steaming medicine bowl in the foreground, dim candlelight, worried servants in the background", []],
  /* 22 */ [`Low angle: the two regents stand side by side, knee-up and large, behind an empty golden throne, one in teal and one in red, looking down sternly at the viewer, inside ${HALL}`, ["nguyen-van-tuong", "ton-that-thuyet"]],
  /* 23 */ ["An open old book with blank pages fills the frame, lying on a scholar's desk; the left half of the background is sunny and calm with blossoms, the right half dark and stormy with lightning; an ink brush and ink stone in the foreground", []],
  /* 24 */ ["Gag: two giant hands from above, one in a red sleeve and one in a teal sleeve, place small emperor figurines in yellow robes on a big chessboard that fills the frame like chess pieces; one figurine already knocked over; palace floor around", []],
  /* 25 */ ["The red-robed regent stands large in the foreground at an open palace window seen from behind his shoulder, fist clenched, determined angry eyebrows, watching French warships with smoking funnels on the Perfume River outside; wooden lattice frames the shot", ["ton-that-thuyet"]],
  /* 26 */ [`Inside a palace pavilion: Vietnamese mandarins in black turbans sign papers at a red lacquered table in the foreground, reluctant; ${ENVOY} stands over them pointing at the paper; red pillars and lanterns`, ["nguyen-van-tuong"]],
  /* 27 */ [`A square metal seal with a small crouching lion on top (no characters on it) melts in a small glowing furnace in the foreground, flames and sparks; ${ENVOY} watches smugly with arms crossed; Vietnamese mandarins in black turbans watch sadly in the background`, []],
  /* 28 */ ["Gag: a huge dark silhouette of a French officer in a kepi stands behind a small golden Vietnamese throne, holding puppet strings attached to it, inside a red palace hall lit by a single lamp", []],
  /* 29 */ ["Coronation: low angle, the young emperor sits on a big golden throne, large in the frame, his feet not touching the floor, looking small and serious; rows of mandarins kneeling below in the foreground; golden light, red pillars, incense smoke, yellow parasols", ["ham-nghi"]],
  /* 30 */ ["Warm sunny flashback: the young emperor (wearing plain brown commoner clothes instead of the robe) carries a bucket of water, large in the frame, in front of a humble village house with a thatched roof, a bamboo fence, chickens and banana trees", ["ham-nghi"]],
  /* 31 */ [`The red-robed regent stands large beside the young emperor's golden throne with his hand on his sword hilt, protective and stern, the young emperor seated; inside ${HALL}`, ["ton-that-thuyet", "ham-nghi"]],
  /* 32 */ ["War council at night: the red-robed regent leans over a big map spread on a table in the foreground, pointing; mandarins in black turbans lean in around the table and nod; one oil lamp lights their faces from below, dark room", ["ton-that-thuyet"]],
  /* 33 */ [`Split composition: the red-robed regent bows politely to ${ENVOY}, but behind his back his hand grips his sword hilt (shown clearly in the foreground); palace courtyard with red pillars`, ["ton-that-thuyet"]],
  /* 34 */ ["Training ground in front of palace walls: the red-robed regent stands large in the foreground with arms crossed; behind him rows of young Vietnamese soldiers practise thrusting spears in a diagonal line, dust, flags without writing", ["ton-that-thuyet", "quan-ta"]],
  /* 35 */ ["Night: workers carry wooden chests and sacks of rice onto ox carts out of a palace side gate, lit by red lanterns; one worker large in the foreground puts a finger to his lips, secretive mood", []],
  /* 36 */ [`${JUNGLE_FORT}, seen from the path in front of the gate; the gate fills the upper half and above the gate hangs a large horizontal wooden name board that is COMPLETELY BLANK; soldiers with spears at the gate, torches, ferns in the foreground`, []],
  /* 37 */ ["The red-robed regent kneels, large in the frame, with his head bowed politely, but his eyes glance up sideways sharply with a small secret smile; palace floor and red pillars behind", ["ton-that-thuyet"]],
  /* 38 */ ["The French general on horseback, large in the foreground, leads a long column of French marines along the Perfume River toward the walls of the Hue citadel; banana trees and the riverbank, afternoon light", ["de-courcy", "linh-phap"]],
  /* 39 */ ["The French general sits smugly in a carved armchair, large in the frame, hiding a pair of iron handcuffs behind his back (shown clearly); a French colonial office with a desk, papers and a French flag", ["de-courcy"]],
  /* 40 */ [`Symmetrical frontal view of ${NGO_MON}; the gate fills the upper half of the frame, warm late afternoon light. In front of the middle door, large in the frame, the French general on a horse arrogantly points at the big middle door, which glows golden. In the foreground lower corners Vietnamese mandarins in teal and red robes turn their heads, shocked, sweat drops. Red flags and bronze cauldrons along the stone courtyard`, ["de-courcy"]],
  /* 41 */ ["The red-robed regent lies in bed pretending to be sick, large in the frame, a wet cloth on his forehead, one eye open slyly; his sword leaning on the bed, a teapot on a side table, wooden bedroom", ["ton-that-thuyet"]],
  /* 42 */ ["Night: the red-robed regent sits up in bed, large in the frame, a thought bubble above him showing French soldiers coming with handcuffs; lantern light, dark wooden room", ["ton-that-thuyet"]],
  /* 43 */ ["Extreme close-up: the regent's face fills more than half the frame, split lighting, the left half lit warm red-orange by a red paper lantern at the frame edge, the right half in deep blue shadow, a single drop of sweat, hard determined eyes; dark palace pillars behind", ["ton-that-thuyet"]],
  /* 44 */ ["Night: the red-robed regent stands up and draws his sword, knee-up and large in the frame, determined; a lantern glowing behind him, an open door to the dark courtyard", ["ton-that-thuyet"]],
  /* 45 */ ["Night on the citadel wall: a big signal cannon in the foreground fires into the dark sky, a bright yellow flash and white smoke; a Vietnamese gunner covers his ears; a red flag without writing on the battlement", ["quan-ta"]],
  /* 46 */ ["Night attack, camera placed BEHIND the whole Vietnamese army: EVERY soldier is seen from the back, we only see their backs, red tunics and the backs of their conical hats, NO faces visible at all, nobody looks back or turns toward the camera; all of them run in the same direction, away from the viewer, toward a burning enemy building across a river; the nearest soldier, large in the lower foreground seen from behind, raises a blazing torch and thrusts his spear forward; in front of him a crowd of soldiers (all backs) rushes down the riverbank and wades into the shallow water, torches and spears raised, fire arrows arcing through the night sky toward the building; in the upper part of the frame, across the river, a two-storey European colonial building with a French flag is on fire, orange smoke rising into a deep blue night sky; torchlight reflected on the water; aggressive forward attack", ["quan-ta"]],
  /* 47 */ ["Night: fires burning along both banks of the Perfume River, roofs of houses aflame, orange reflections on the water, a small sampan in the foreground, black smoke, no bridge", []],
  /* 48 */ ["Dawn: French marines kneel behind sandbag barricades firing rifles toward the viewer, the front marine large in the foreground, smoke and pale morning light", ["linh-phap"]],
  /* 49 */ ["Dawn, inside the Hue citadel, camera placed BEHIND a French field cannon: the cannon is large in the lower foreground seen from behind, its barrel pointing STRAIGHT AWAY from the viewer into the distance, a bright muzzle flash and a big white smoke cloud bursting from the FRONT end of the barrel; two French gunners beside it seen from behind and the side, one covering his ears, one holding the rammer; in the distance ahead, beyond the smoke, a thick old brick citadel wall and palace roofs burning with black smoke; small Vietnamese soldiers far away retreat and run AWAY from the cannon toward the wall, their backs to the viewer, some carrying a wounded comrade, no blood; pale grey-orange dawn sky; the French clearly winning", ["linh-phap", "quan-ta"]],
  /* 50 */ ["Palace buildings burning with black smoke; French soldiers in the foreground carry away golden vases and wooden chests, one grinning; broken lanterns on the ground", ["linh-phap"]],
  /* 51 */ ["Evening in an old Hue street: a family kneels in the foreground at their home altar lighting incense, soft smoke curling; other houses with lit altars down the street, lanterns, solemn warm light", []],
  /* 52 */ [`Smoky dawn, in front of ${CUA_HUU}: the red-robed regent, large in the frame, leads the young emperor and three royal ladies in long robes out of the arch, carrying bundles; soldiers with torches behind, fire glow over the wall`, ["ton-that-thuyet", "ham-nghi"]],
  /* 53 */ ["Seen from behind, over his shoulder: the young emperor walks out through a dark citadel gate tunnel toward a misty road, looking back once; through the arch behind him the palace glows orange with fire; brick tunnel walls frame the shot", ["ham-nghi"]],
  /* 54 */ [`${MAP}: central Vietnam with a square walled citadel beside a river near the coast, and green mountains to the north-west with a small hidden fort among them`, []],
  /* 55 */ ["Inside a jungle fortress hall made of wood and bamboo: the red-robed regent stands large in the frame reading aloud from an unrolled yellow edict, the young emperor seated behind him; in the foreground the backs of kneeling officials and soldiers; torchlight", ["ton-that-thuyet", "ham-nghi"]],
  /* 56 */ ["Close-up still life, no people, no hands: a long yellow silk imperial edict scroll unrolled on a red lacquered table filling the frame, its surface completely plain and blank (no writing, no characters, no marks), only one red square seal stamp near the end, rays of golden light falling on it", []],
  /* 57 */ [`Messengers on horseback gallop out of the gate of ${JUNGLE_FORT}, toward the viewer and in different directions, the front rider large in the foreground holding a rolled scroll; dust and morning light`, []],
  /* 58 */ ["Three villagers step forward together, large in the frame: a strong farmer raising a hoe, a merchant offering a cloth bag of coins, a scholar in a black turban holding a brush and paper; a village market and a banyan tree behind, crowds watching", []],
  /* 59 */ ["Comical contrast on a grassy hill: a tiny rolled paper scroll lies in the foreground beside a huge black cannon that fills most of the frame, low camera angle, clouds behind", []],
  /* 60 */ ["Close-up: a tiny glowing ember falls onto a field of dry golden straw filling the frame, small flames starting to spread, sparks, dusk sky", []],
  /* 61 */ ["Sunrise over mountains and rice fields: a crowd of scholars in black turbans and peasants with spears and hoes rise up and march toward the viewer under plain red banners without writing, the front marchers large in the foreground, more groups on the hills behind", []],
  /* 62 */ ["An old scholar-general with a long white beard, black turban and dark blue robe, waist-up and large in the frame, commands his troops in a mountain forest, pointing ahead; soldiers with old guns and spears behind him among big trees, mist", []],
  /* 63 */ ["A fortified village surrounded by flooded rice fields, thick bamboo hedges and earthen walls; at the village gate a large horizontal wooden name board that is COMPLETELY BLANK; defenders with spears and old guns on the walls; the front defender large in the foreground", []],
  /* 64 */ ["Night: many beacon fires lighting up one after another on hills across a long landscape; in the foreground a watchman lights a big beacon fire with a torch, sparks flying", []],
  /* 65 */ ["The young emperor (wearing a brown jungle tunic and a headscarf instead of the robe) sits large in the frame with a small band of loyal soldiers in a thatched hut deep in a rainy jungle; rain falls outside the open side, a small cooking fire", ["ham-nghi"]],
  /* 66 */ ["Night: French soldiers with lanterns surround a small thatched hut in the jungle, the front soldier large in the foreground raising his rifle; big leaves frame the shot, moonlight", ["linh-phap"]],
  /* 67 */ ["Night jungle path: the shifty traitor, large in the foreground, leads French soldiers along the path, pointing ahead and looking back nervously; lanterns and big leaves", ["truong-quang-ngoc", "linh-phap"]],
  /* 68 */ ["The young emperor (in a brown jungle tunic instead of the robe) stands defiantly and points angrily at the traitor, who flinches and looks away in shame; both large in the frame, jungle clearing, French soldiers in the background", ["ham-nghi", "truong-quang-ngoc"]],
  /* 69 */ ["An old steamship arrives at a white North African harbour city with domes, minarets and palm trees, bright sun; on the deck in the foreground a young Vietnamese man in a dark tunic looks at the strange city with a sad face", []],
  /* 70 */ ["An older Vietnamese man with a neat black beard, wearing a dark Western suit, paints at an easel, knee-up and large in the frame, in a sunny garden with palm trees, white houses and bougainvillea", []],
  /* 71 */ ["Close-up: a painting on an easel showing sky, clouds, mountains and a river fills the frame, an old man's hand holding a brush in front of it, a single tear drop falling; window light", []],
  /* 72 */ ["The young emperor stands at a fork in the road, large in the frame: one way leads to a golden palace with a throne, the other way into a dark jungle path; he looks toward the jungle", ["ham-nghi"]],
  /* 73 */ ["Symbolic still life: an empty golden throne half transformed into a plain old wooden chair, in the centre of an empty dark palace hall, one beam of light from above, dust in the air", []],
  /* 74 */ ["Close-up: a small flame in an old lantern in the centre, protected from wind and rain by many hands of different people around it (farmer, scholar, soldier, old woman), rain falling, warm glow on the hands", []],
  /* 75 */ ["Gag still life, top-down view, no people, no hands: a big pink rubber eraser broken into two pieces with small crumbs, lying on an old parchment map of an S-shaped coastline on a wooden desk filling the frame; the map is completely intact, nothing erased, no labels", []],
  /* 76 */ ["Dusk on a lonely hilltop: a big beacon fire that once blazed is burning down to low glowing embers and thin smoke, fills the lower half of the frame, a broken plain red banner without writing lying beside it, misty mountains and a fading orange sky behind",[]],
  /* 77 */ ["Night in a humble thatched village house in Nghe An: a a thin Vietnamese young scholar aged about 19, sharp bright eyes, determined face, black wrapped turban, plain dark indigo scholar robe sits large in the frame at a low wooden table reading a copy of a long yellow edict scroll by the light of one oil lamp, his eyes burning with determination; the scroll surface is plain with no writing; old books and a brush on the table, a bamboo window with a dark village outside",[]],
  /* 78 */ ["Rainy hillside at dawn: the a thin Vietnamese young scholar aged about 19, sharp bright eyes, determined face, black wrapped turban, plain dark indigo scholar robe stands alone, knee-up and large in the frame, soaked, fists clenched, staring at the horizon with unbroken determination; behind him on the ground lie abandoned bamboo spears and a torn plain red banner without writing, his fellow students walking away in the distance",[]],
  /* 79 */ ["Mysterious close-up: the face of a a thin Vietnamese young scholar aged about 19, sharp bright eyes, determined face, black wrapped turban, plain dark indigo scholar robe fills the frame, half lit warm by an oil lamp at the frame edge and half in deep shadow, eyes looking straight at the viewer, serious and thoughtful; dark background with a faint glow",[]],
  /* 80 */ ["Quang Nam village insurgent camp at dawn: a young Vietnamese boy in plain brown clothes, a black head wrap, practises with a long wooden staff, large in the frame, watched proudly by his father, a stern middle-aged Vietnamese commander in a dark blue robe and black turban with a sword; behind them village volunteers train with spears among coconut palms and thatched huts, plain red banners without writing",[]],
  /* 81 */ ["Close-up: an old weathered hand passes a small glowing old lantern to two young hands reaching from opposite sides, one hand in a dark indigo sleeve, the other in a white sleeve; warm golden glow on the hands, dark blue night background, symbolic",[]],
  /* 82 */ ["A road splits into two at dawn on a hill: two young Vietnamese scholars seen from behind, large in the foreground, their faces not visible, each walks down a different path: the one on the left in a dark indigo robe and black turban carries a sword and walks toward a distant battlefield with smoke and dark mountains, the one on the right in a white robe carries a book and walks toward a sunny village with a small school house; big dawn sky",[]],
  /* 83 */ ["Dusk on the Perfume River: an empty small wooden sampan and a glowing paper lantern drift in the foreground, the silhouette of the Ngo Mon gate with its two-storey pavilion far behind, orange and purple sky, calm and melancholic",[]],
];

// extra per-scene settings (1-based line number)
const EXTRA = {};
// still lifes / landscapes: the style asks for "small extras", so say explicitly that nobody is there
const NO_PEOPLE = [7, 8, 17, 54, 59, 60, 73, 76, 83];

const lines = fs.readFileSync(DIR + "kich-ban.md", "utf8").split("\n").filter((l) => /^\d+\. /.test(l));
if (lines.length !== S.length) throw new Error(`kich-ban.md có ${lines.length} câu nhưng có ${S.length} prompt ảnh`);
const scenes = lines.map((l, i) => {
  let text = l.replace(/^\d+\.\s*/, "");
  let title;
  const m = text.match(/^`\[([^\]]+)\]`\s*/);
  if (m) { title = m[1]; text = text.slice(m[0].length); }
  const narration = text.replace(/\s*⚠/g, "").trim();
  const [image, chars] = S[i];
  const s = { narration, image: NO_PEOPLE.includes(i + 1) ? image + ". Nobody in the scene: no people, no figures, no soldiers, no faces" : image };
  if (title) s.title = title;
  if (chars.length) s.characters = chars;
  Object.assign(s, EXTRA[i + 1] || {});
  return s;
});

const SLUG = "1885-kinh-thanh-hue-chieu-can-vuong";
const project = {
  title: "1885 – Kinh thành Huế và chiếu Cần Vương",
  series: "Ngược dòng trăm năm – Tập 3",
  preset: "cartoon-bold",
  format: "9:16",
  imageProvider: "manual",
  animate: "none",
  tts: "manual",
  voiceNote: "vibi.pro, giọng Tuấn Anh = ElevenLabs HG0MlJIknmaXREpTckfK, eleven_v3, stability 0.5, speed 1, lời từ tts-ngat-nhip.txt",
  brand: { logo: "auto", watermark: null, logoWidth: 0.18, logoOpacity: 0.7, logoBlur: 0.8, logoMarginX: 0.06 },
  loudnorm: -16,
  music: `projects/${SLUG}/music/bgm.wav`,
  musicStart: 0,
  musicVolume: 0.7,
  subtitles: false,
  characters,
  scenes,
};
fs.writeFileSync(DIR + "project.json", JSON.stringify(project, null, 1) + "\n");
console.log(`project.json: ${scenes.length} cảnh, ${Object.keys(characters).length} nhân vật`);
