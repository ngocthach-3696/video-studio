// usage: node build-project.mjs  -> writes project.json from kich-ban.md (narration + titles) + the image prompts below.
// Line N of the script = scene sNNN. Style = preset cartoon-bold (approved 2026-11-13), composition rules from
// history/styles/quy-chuan-dao-dien.md. Everything here is NEW for this episode (no assets reused from 1858–1885).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const DIR = fileURLToPath(new URL(".", import.meta.url));

// Colour identity: Phan Bội Châu = earth brown + black turban (fire, guns, the East);
// Phan Châu Trinh = teal blue, short hair, later a white Western suit (books, schools, the West).
const characters = {
  "phan-boi-chau": {
    name: "Phan Bội Châu (1905)",
    look: "a Vietnamese Confucian scholar and revolutionary aged about 38, lean and strong, broad forehead, intense burning eyes, thick black eyebrows, black mustache and short black goatee, black wrapped khan dong turban, earth-brown long Vietnamese tunic (ao dai) over white trousers, a worn cloth shoulder bag",
  },
  "phan-boi-chau-gia": {
    name: "Phan Bội Châu (già, 1925–1940)",
    look: "an elderly Vietnamese Confucian scholar aged about 60, thin, long white beard and white mustache, simple face with tired but proud eyes, black wrapped khan dong turban, faded earth-brown long Vietnamese tunic (ao dai), a bamboo walking cane",
  },
  "phan-chau-trinh": {
    name: "Phan Châu Trinh (1906)",
    look: "a Vietnamese reformist scholar aged about 34, slim, long oval face, calm clever eyes, thin black mustache, SHORT neatly cropped black hair (no hair bun, no turban, no hat), teal blue long Vietnamese tunic (ao dai) over white trousers, often holding a book",
  },
  "phan-chau-trinh-gia": {
    name: "Phan Châu Trinh (Pa-ri và 1925)",
    look: "a Vietnamese reformist aged about 50, thin, long oval face, short grey hair, grey mustache, calm sad eyes, white Western three-piece suit, white shirt with a black bow tie",
  },
  "luong-khai-sieu": {
    name: "Lương Khải Siêu",
    look: "a Chinese reformist scholar aged about 32, round face, short black hair combed back, small round glasses, thin mustache, grey long Chinese changshan robe",
  },
  "toan-quyen": {
    name: "Toàn quyền Pháp (hình tượng)",
    look: "a French colonial governor-general aged about 55, stout, pink face, big curled grey mustache, white colonial dress uniform with gold epaulettes and gold buttons, a white cork sun helmet with a gold band",
  },
  "linh-phap": {
    name: "Lính / mật thám Pháp 1905–1925 (hình tượng)",
    look: "a French colonial gendarme of the early 1900s, European man with a brown mustache, white cork sun helmet, dark navy blue tunic with brass buttons, white trousers, black boots",
  },
  "du-hoc-sinh": {
    name: "Du học sinh Đông Du (hình tượng)",
    look: "a young Vietnamese student, slim, short black hair, eager bright eyes, black Japanese-style school uniform with a high collar and brass buttons, black peaked student cap",
  },
};

const TOP = ". Keep the top quarter of the frame calm and simple (sky, smoke or plain wall) with no important details, room for a big title";
const BOARD = "a horizontal plain wooden name board that is COMPLETELY BLANK (no writing)";
const STEAMER = "an early-1900s black-hulled steamship with one tall smokestack and two masts";
const SCHOOL = "a two-storey old Hanoi shophouse turned school, wooden shutters, tiled roof, a long horizontal dark red wooden name plaque with a gold border above the entrance that is COMPLETELY BLANK";
const MAP = "an aged parchment map in flat cartoon style filling the whole frame on a dark wooden table, simple ink coastlines, sea painted pale blue, no labels, no text, no letters";

// [image prompt, characters[]] for each script line, in order.
const S = [
  // ── Mở đầu (night, warm lamplight)
  /* 1 */ ["Night inside a small Japanese tatami room lit by one paper lantern: two Vietnamese scholars sit facing each other across a low table, large in the frame, in heated debate, the left one leaning forward with a clenched fist, the right one calm with a book; teacups, scattered papers, shoji screens with a pine tree shadow outside" + TOP, ["phan-boi-chau", "phan-chau-trinh"]],
  /* 2 */ ["Close-up waist-up: the scholar slams his fist on the low table, eyes blazing; behind him on the wall a hanging scroll of a painted tiger and an old rifle leaning in the corner; warm orange lamplight, papers jump from the table", ["phan-boi-chau"]],
  /* 3 */ ["Close-up waist-up: the scholar calmly shakes his head with one hand raised, palm out, a book in his other hand; soft blue-white moonlight from a window on him, a small bookshelf behind; deadpan serious face", ["phan-chau-trinh"]],
  /* 4 */ ["Split composition: the two scholars stand back to back in the middle of the frame, each looking away to the opposite side; the left half of the background is a red-orange sky with smoke and rifles, the right half is a calm blue sky with books and a small school house" + TOP, ["phan-boi-chau", "phan-chau-trinh"]],
  /* 5 */ ["Two small memory vignettes side by side in a sepia tone like an old photo album page: left, a young thin scholar in an indigo robe standing alone in the rain on a hillside with abandoned bamboo spears; right, a little Vietnamese boy in brown clothes practising with a wooden staff in a jungle camp, his father in a dark blue robe watching", []],
  /* 6 */ [`The two scholars stand side by side, waist-up, large in the frame, looking at the viewer; above each man's head hangs ${BOARD}; an old Vietnamese village gate and banyan tree behind, warm morning light`, ["phan-boi-chau", "phan-chau-trinh"]],
  /* 7 */ [`A busy early-1900s harbour at dawn seen from a wooden pier: ${STEAMER} at the dock blowing steam, coolies carrying sacks, sampans in the water, ropes and crates in the foreground, gulls in the sky`, []],
  /* 8 */ [`${STEAMER} sails toward a huge rising sun on the open sea, seen from behind, a small figure in an earth-brown tunic standing at the stern rail looking forward; golden morning light, waves, gulls`, []],
  /* 9 */ [`${STEAMER} sails toward a red sunset on the open sea, seen from behind, a small figure in a white Western suit standing at the stern rail; purple and orange sky, long reflections on the water`, []],
  /* 10 */ [`Thick grey sea fog at a harbour: the dark silhouette of a third ${STEAMER} barely visible behind the fog, only its smokestack and a single warm yellow lantern on the deck glowing; wooden bollards and coiled ropes on the pier in the foreground, mysterious and quiet`, []],
  /* 11 */ ["Wide warm view: an old Vietnamese country road at sunrise splits into two paths in front of a big banyan tree, one path leading to a misty harbour with ships on the left, the other to a small town with a school on the right; rice fields, buffalo, a wooden signpost with two blank arrow boards (no writing)", []],
  // ── Hồi 1 – Con tàu về phía Đông (sea blue, red, cherry pink)
  /* 12 */ ["Sepia memory: a small group of young Vietnamese students with bamboo spears scatter and run away across a rice field at dusk, torn plain red banner without writing on the ground in the foreground; then in the corner a faded hint of time passing (falling leaves)", []],
  /* 13 */ ["The scholar walks away from a grand Vietnamese mandarin office gate with red pillars, waving off an official who offers him a black mandarin hat on a tray; he walks toward the viewer along a country road with his shoulder bag, determined", ["phan-boi-chau"]],
  /* 14 */ ["Secret meeting at night in a bamboo village house: the scholar, large in the foreground, leans over a low table with an oil lamp, five other men in turbans whisper around him, a young prince in a yellow robe sits at the head of the table; window shutters closed, dark blue night outside", ["phan-boi-chau"]],
  /* 15 */ ["Visual metaphor, close-up: the scholar holds up three fingers; floating thought bubbles beside his head show a rifle, a pile of silver coins, and a big strong friendly hand reaching down from the clouds; warm lamplight", ["phan-boi-chau"]],
  /* 16 */ ["Visual metaphor, flat cartoon: a small Japanese samurai-styled warship flying a plain white flag with a red disc defeats a gigantic dark grey battleship on a stormy sea, the big ship tilting and smoking; a small Japanese sailor raising a fist on the bow; dramatic sky", []],
  /* 17 */ [`${MAP}: the coast of Vietnam on the left side, the south of China, and the islands of Japan in the upper right; a small toy steamship on the paper near the north of Vietnam; an oil lamp and a brush at the edges`, []],
  /* 18 */ [`On the deck of ${STEAMER} at sea: the scholar, waist-up and large, grips the rail and looks toward the horizon with hope; a thought bubble shows a Vietnamese hand and a Japanese hand shaking; blue sea and white clouds`, ["phan-boi-chau"]],
  /* 19 */ ["Inside a Japanese study with tall bookshelves and a round window with a pine tree: the Chinese reformer, large on the right, sits at a desk and speaks gently, one finger raised; the Vietnamese scholar sits across, listening carefully; tea steam, warm light", ["luong-khai-sieu", "phan-boi-chau"]],
  /* 20 */ ["Visual metaphor: the Chinese reformer pushes a rifle away on the table and instead places a stack of books in front of the viewer; behind him a chalkboard with a simple chalk drawing of a small seedling growing into a big tree (no text)", ["luong-khai-sieu"]],
  /* 21 */ ["Night writing: the scholar writes fast with a brush by candlelight, sheets of paper piling up; through the window a smuggler's hand takes a bundle of booklets tied with string through the window; ink stones, candle smoke", ["phan-boi-chau"]],
  /* 22 */ ["Bright Japanese scene: a group of young Vietnamese students in black school uniforms walk through a gate of a Japanese school yard under pink cherry blossom trees, carrying books, smiling; a wooden school building with tiled roof behind, petals falling", ["du-hoc-sinh"]],
  /* 23 */ ["Night inside the cramped cargo hold of a steamship: two young Vietnamese men hide between rice sacks and wooden crates, one dressed as a dock coolie with a carrying pole, a sailor's lantern swinging above, they hold their breath; dark blue with yellow lantern light", ["du-hoc-sinh"]],
  /* 24 */ ["Group photo moment in a Japanese school yard: many young Vietnamese students in black uniforms and caps stand in rows smiling, filling the frame from edge to edge, cherry blossoms and a wooden school building behind" + TOP, ["du-hoc-sinh"]],
  // ── Hồi 2 – Người đi ngược chiều (bright daylight, teal and warm yellow)
  /* 25 */ ["The reformist scholar walks the opposite way of a crowd of travellers heading to a harbour; he walks toward a town with a school, seen from the front, calm and resolute; sunlit Quang Nam village street, coconut palms", ["phan-chau-trinh"]],
  /* 26 */ ["Inside the Hue Ministry of Rites hall with red lacquered pillars: the reformist scholar, large in the frame, takes off his black mandarin hat and places it on a desk in front of a surprised old mandarin, then turns to leave; dusty piles of documents", ["phan-chau-trinh"]],
  /* 27 */ ["Japan street view: the reformist scholar stands large in the foreground, amazed, looking at a busy modern school with children in uniforms entering, a newspaper stand, telegraph poles and a tram; a Japanese army parade in the far background he is turning his back to", ["phan-chau-trinh"]],
  /* 28 */ ["The French governor-general at a big desk in a colonial palace office opens a long letter, his eyes popping and mustache bristling in shock; a ceiling fan, a French tricolour flag, a portrait frame without face details behind", ["toan-quyen"]],
  /* 29 */ ["Visual of the letter's content: in the foreground a fat greedy Vietnamese mandarin in a black hat and purple robe takes bags of rice from thin poor farmers who bow; the reformist scholar stands to the side pointing at the scene with an angry frown; village market background", ["phan-chau-trinh"]],
  /* 30 */ ["Visual metaphor: a hand opens the door of a bamboo bird cage on a table; inside, a tiny bird without feathers on its wings looks out, scared, unable to fly; the reformist scholar watches with a worried face; soft window light, books on the table", ["phan-chau-trinh"]],
  /* 31 */ ["The reformist scholar stands on a low wooden stage speaking to a crowd of villagers and young people, one arm raised, a book in the other hand; three plain red banners without writing hang behind him; bright morning light" + TOP, ["phan-chau-trinh"]],
  /* 32 */ ["Three small panels side by side like a triptych: left, a child reading a book by a lamp; middle, villagers standing tall and proud together; right, a farmer family eating a full bowl of rice; warm colours, simple and clear", []],
  /* 33 */ [`Street view of Hang Dao street in old Hanoi, morning: ${SCHOOL}; people in ao dai and young men with short hair enter the open door, a street vendor with a carrying pole in the foreground, shop signs without writing`, []],
  /* 34 */ ["Inside a lively classroom of the free school: a teacher in a teal tunic writes on a blackboard with simple shapes of numbers and a map drawn on it (no readable letters), students of all ages from boys to old men sit on benches writing, an abacus and a globe on the teacher's desk", []],
  /* 35 */ ["A village barber scene: a young Vietnamese man laughs as a friend cuts off his long hair bun with big scissors, the cut bun falling; other young men in short tunics with short hair wait in line and cheer; old men watching shocked in the background", []],
  /* 36 */ ["Split-screen composition with a clear vertical line: left half, the scholar in earth brown in a dark harbour at night handing a bag of money to a shadowy foreign arms dealer with crates of rifles; right half, the reformist in teal in a sunny classroom handing a book to a child", ["phan-boi-chau", "phan-chau-trinh"]],
  // ── Hồi 3 – Hai bức tường (storm grey, harsh sun)
  /* 37 */ ["Visual metaphor: two roads seen from above run side by side and both end at a giant grey brick wall that blocks the horizon; on the left road a small figure in an earth-brown tunic, on the right road a small figure in a teal tunic, both stopped at the wall; grey storm sky", []],
  /* 38 */ ["A Japanese diplomat in a black frock coat and a French diplomat in a black frock coat with a grey mustache shake hands over a polished table, smiling politely; a treaty document with a red seal between them, flags of Japan and France on poles behind, tall Western windows", []],
  /* 39 */ ["Close-up: the French diplomat whispers into the Japanese diplomat's ear while pointing with his thumb at a small group of Vietnamese students in black uniforms visible through the window, the Japanese diplomat nods; smug cold expressions", ["du-hoc-sinh"]],
  /* 40 */ ["Rainy Japanese port: Vietnamese students in black uniforms with suitcases walk up a ship's gangway sadly, Japanese policemen in black uniforms escorting; the scholar in earth brown stands last at the bottom of the gangway, looking back at the city, soaked by rain", ["phan-boi-chau", "du-hoc-sinh"]],
  /* 41 */ ["Visual metaphor: a small Vietnamese man holds out empty hands toward a giant hand that is turning away and instead shaking hands with a French hand in a white cuff; grey background, simple and clear", []],
  /* 42 */ [`Front of the free school: ${SCHOOL}; French gendarmes nail two wooden planks across the door in an X, a gendarme carries away a crate of books; sad students watching across the street`, ["linh-phap"]],
  /* 43 */ ["Wide view: a long crowd of Vietnamese farmers with short hair, conical hats and walking sticks march along a dusty road in central Vietnam toward a provincial office, angry faces, raising fists; hot sun, dry fields, mountains behind", []],
  /* 44 */ ["Night arrest in a Hanoi street: two French gendarmes grip the arms of the reformist scholar, who stays calm and upright; a lamp post light, a police carriage waiting, scared onlookers behind shutters", ["phan-chau-trinh", "linh-phap"]],
  /* 45 */ ["Con Dao island prison quarry under a harsh white sun: the reformist scholar in grey prisoner clothes with a chain on one ankle raises a big hammer to break a large rock, chin high, proud smile; other prisoners breaking stones, guards with rifles, turquoise sea and rocky cliffs behind", ["phan-chau-trinh"]],
  /* 46 */ ["Visual metaphor: a smug French colonial official pulls a black cloth blindfold over the eyes of a Vietnamese farmer, while in the background the reformist scholar's book lies trampled in the dust; harsh grey light", []],
  /* 47 */ ["Diptych with a vertical divide: left, the scholar in earth brown alone on a ship deck in the rain with a suitcase, head lowered; right, the reformist scholar in grey prisoner clothes sitting on a rock on a prison island at dusk, head lowered; both small and lonely" + TOP, ["phan-boi-chau", "phan-chau-trinh"]],
  // ── Hồi 4 – Những năm lưu lạc (autumn and grey Paris)
  /* 48 */ ["Inside a modest Japanese doctor's house: a kind Japanese doctor aged about 40 in a dark kimono with a short mustache bows slightly and hands a white paper envelope with both hands to the Vietnamese scholar, who bows back with tears in his eyes; shoji doors, a medicine cabinet, warm light", ["phan-boi-chau"]],
  /* 49 */ ["Autumn in a Japanese village: the scholar, now with a few grey hairs, stands frozen at the open gate of a quiet house holding a gift box; a Japanese villager bows apologetically, pointing toward a small cemetery on the hill; red maple leaves falling", ["phan-boi-chau"]],
  /* 50 */ ["Japanese temple courtyard: a tall grey stone memorial stele with a blank smooth face (no carved writing) stands in the centre, large; the Vietnamese scholar and several Japanese villagers bow before it, incense smoke; pine trees, a small temple roof behind", ["phan-boi-chau"]],
  /* 51 */ [`${MAP}, a stylised map of the whole sea route from Asia to Europe arranged diagonally to fit the tall frame: the S-shaped coast of Vietnam at the BOTTOM RIGHT, then the Malay peninsula, the Indian Ocean with the tip of India in the middle, the Arabian sea and the narrow Red Sea, the Mediterranean, and France at the TOP LEFT; continents in warm beige, small mountain and tree doodles, a compass rose in a corner; open sea along the route left clear, NO ships, NO lines, NO routes drawn on the map`, []],
  /* 52 */ ["A tiny photo studio in an old Paris attic: the reformist, in his white suit, bends over a desk retouching a photograph with a fine brush under a lamp, stacks of photos and a tall letter beside him; rooftops and a grey sky through the slanted window", ["phan-chau-trinh-gia"]],
  /* 53 */ ["The reformist, in his white suit, writes a long letter at a Paris café table, frowning; a newspaper beside him shows a simple drawing of a Vietnamese emperor in a yellow robe visiting France (no readable text); seven small ink dots in a column in the margin", ["phan-chau-trinh-gia"]],
  /* 54 */ ["The scholar in earth brown, a bit older with grey in his goatee, walks fast through a crowded Chinese street with lanterns and signboards without writing, holding a cloth bundle; a long road behind; a shadowy man watching him from an alley", ["phan-boi-chau"]],
  /* 55 */ ["Split-screen with a vertical line: left, the scholar alone at a window in a Chinese inn at night under a red lantern; right, the reformist in a white suit alone at a Paris attic window at night; the same moon in both halves", ["phan-boi-chau", "phan-chau-trinh-gia"]],
  // ── Hồi 5 – Lật ngược (1925: sepia, then funeral white)
  /* 56 */ ["Visual of time: a big wall calendar page in the centre of the frame showing a plain blank page with a red circle drawn on it, next to it an old pocket watch; a dusty table, warm light" + TOP, []],
  /* 57 */ ["A busy Shanghai street by the Bund: the old scholar with a white beard is grabbed from behind by two men in dark Western suits and fedora hats and pushed into a black car; foreign buildings, rickshaws, passers-by turning", ["phan-boi-chau-gia"]],
  /* 58 */ ["Saigon harbour in 1925: the thin old reformist in a white suit walks down a ship's gangway slowly with a cane, looking at the city with emotion; a small crowd of young people in white ao dai waving hats to welcome him; palm trees and colonial buildings", ["phan-chau-trinh-gia"]],
  /* 59 */ ["Colonial courtroom: French judges in black robes at a high bench, one striking a gavel; the old scholar with a white beard stands in the dock, chin high, unafraid; French gendarmes on both sides; dark wood and harsh light" + TOP, ["phan-boi-chau-gia", "linh-phap"]],
  /* 60 */ ["Close-up insert: a rack of rifles in a guardhouse stands untouched and dusty, while in front of it on a table lies a big pile of handwritten letters and newspapers; quiet afternoon light", []],
  /* 61 */ ["Wide view of a Hanoi street: crowds of students in white, journalists with notebooks, shopkeepers and farmers hold up papers and petitions toward the French Residence gate peacefully; no weapons; banners without writing; morning light", []],
  /* 62 */ ["The French governor-general, sweating and annoyed, signs a document with a fountain pen at his desk, a tall pile of petition letters towering over him and spilling onto the floor", ["toan-quyen"]],
  /* 63 */ ["The old scholar with a white beard stands at the open gate of a prison, a gentle surprised smile, while a crowd of young students outside hold up letters; one student puts a flower garland around his neck; warm light", ["phan-boi-chau-gia"]],
  /* 64 */ ["Quiet room in Saigon: a narrow bed with white sheets, the thin old reformist lies with eyes peacefully closed, his white suit jacket hanging on a chair, a stack of books and a desk lamp; pale morning light through shutters, mourners' shadows at the door", ["phan-chau-trinh-gia"]],
  /* 65 */ ["Symbolic: a small oil lamp on a desk beside closed books has just gone out, a thin line of smoke rising; through the window, the first light of dawn appears over the rooftops", []],
  /* 66 */ ["Huge funeral procession in a Saigon boulevard: a funeral carriage decorated with white flowers, thousands of people in white mourning clothes walking behind, shops closed with shutters down, students in uniform walking in rows, white banners without writing; trees along the street", []],
  /* 67 */ ["High wide view of the same funeral: an endless river of people in white fills the boulevard from edge to edge into the distance, tiny white umbrellas and banners, colonial buildings on both sides" + TOP, []],
  /* 68 */ ["A Vietnamese school classroom: students sit at desks each with a black mourning armband on the sleeve, heads up and serious, while an angry French school inspector at the door points at them; sunlight through tall windows", []],
  /* 69 */ ["Symbolic sunrise: a field of young rice seedlings standing up straight in golden morning light; in the foreground an old book lies open on the earth; birds flying up", []],
  /* 70 */ ["Wide view: people across Vietnam stand up together, a student in Hanoi, a farmer in central Vietnam, a shopkeeper in Saigon, each in a small vignette, all looking at the same bright sunrise; warm hopeful colours", []],
  // ── Kết (dusk, then dawn)
  /* 71 */ ["Callback: the same Japanese tatami room from the opening, now empty: two empty cushions face each other across the low table, two cold teacups, the paper lantern glowing; quiet night", []],
  /* 72 */ ["Visual metaphor: on a dark wooden desk lit by an oil lamp, an old brass balance scale stands perfectly LEVEL; on the left pan a closed old book with a plain red cover, on the right pan a closed old book with a plain blue cover, both the same size, neither pan lower; ink stone, brush, scattered blank papers; no people, no hands; blank covers with no text", []],
  /* 73 */ ["Two halves of one round old bronze coin lying on a wooden table, about to be joined: on the left half a small engraved rifle, on the right half a small engraved open book (no writing); a warm lamp lights them", []],
  /* 74 */ [`A small wooden house in Ben Ngu, Hue, by the Perfume River at dusk: the very old scholar with a long white beard sits on the porch, a French gendarme standing guard at the gate; over the gate ${BOARD}; a hammock, a pot of tea, river and boats behind`, ["phan-boi-chau-gia", "linh-phap"]],
  /* 75 */ ["The very old scholar sits alone on his porch at night, looking at a cloudy sky with no stars, a candle almost burned down beside him; calm, melancholic", ["phan-boi-chau-gia"]],
  /* 76 */ ["Callback in sepia: the two scholars, young again, argue across the low table in the Japanese room, fists and books, a lantern between them", ["phan-boi-chau", "phan-chau-trinh"]],
  /* 77 */ [`Modern Vietnamese city street corner today, bright daylight: two tall blue street-name sign posts stand side by side at a crossroads (both signs COMPLETELY BLANK, no writing), motorbikes, trees, shophouses, people walking`, []],
  /* 78 */ [`Callback: the third ${STEAMER} waits in the grey fog at the harbour, closer now, its warm yellow lantern glowing on deck; an EMPTY wooden pier in the foreground with one small lantern on a post and a coiled rope, NO people anywhere, no figures on the pier or on the ship` + TOP, []],
  /* 79 */ [`Saigon harbour in June 1911: a large French ${STEAMER} at the dock in front of an old two-storey colonial building with dragon ornaments on its roof ridge (the Nha Rong wharf building); a young Vietnamese man in a plain white shirt and dark trousers seen ONLY from behind, faces not visible, carrying a small suitcase, walks up the gangway`, []],
  /* 80 */ ["Inside the cramped galley kitchen of an early-1900s steamship: a young Vietnamese man in a plain white shirt with rolled sleeves and a simple apron, seen ONLY from behind, face not visible, stands at a big coal stove stirring a large pot, steam rising; copper pots and pans hanging, sacks of rice and onions, a round porthole showing the open sea, warm orange glow from the stove fire; a stout French cook in a white cap in the background points at him", []],
  /* 81 */ ["Saigon, a busy morning at Nha Rong wharf in June 1911, seen from a high three-quarter side angle: a slim young Vietnamese man of 1911 in three-quarter back view, face not visible (turned away toward the ship): short neatly cropped black hair (no bun, no headscarf), a plain white long-sleeved Western shirt with a small stand collar tucked into loose dark trousers, a thin belt, simple brown leather shoes, LARGE in the left foreground (knee-up, 60% of frame height), a small suitcase beside him, standing still in the bustle and looking at the ship; in the middle ground the WHOLE real Nha Rong building clearly visible: a long two-storey French colonial building with a pale yellow facade, rows of tall arched windows with green shutters, a wide grey-tiled roof, and on the CENTRE of the roof ridge a pair of small green ceramic dragons facing a round moon disc (Vietnamese \"two dragons facing the moon\" ornament); in front of it a wide stone quay along the brown Saigon RIVER (a river, not the sea: the opposite bank is close, flat, with coconut palms, mangroves and low tile-roofed houses); a big black-hulled French cargo steamship with one tall black-and-red funnel and white steam is docked right against the quay with a wooden gangway; around them small figures of coolies in conical hats carrying sacks on shoulder poles, a rickshaw, a French customs officer in a white uniform and pith helmet with a clipboard, stacked wooden crates, barrels and coiled ropes in the foreground; light morning haze, three depth layers, bright warm sunlight with long shadows.", []],
  /* 82 */ ["Dawn at sea, seen from the stern deck of an early-1900s black-hulled steamship (iron railing, coiled ropes, a lifebuoy without text, a tall black smokestack trailing smoke): a slim young Vietnamese man of 1911 seen ONLY from behind, face not visible: short neatly cropped black hair (no bun, no headscarf), a plain white long-sleeved Western shirt with a small stand collar tucked into loose dark trousers, a thin belt, simple brown leather shoes, seen from behind at the railing, filling about half the frame height, gazes at the vast horizon; the ship's white wake draws a single straight line across the sea toward a huge rising sun" + TOP, []],
  /* 83 */ ["Peaceful ending: a big banyan tree on a hill at golden sunset, two roads below it meet into one road leading toward the sea where a small ship sails away; warm and hopeful", []],
];

// still lifes / landscapes: the style asks for "small extras", so say explicitly that nobody is there
const NO_PEOPLE = [17, 51, 56, 60, 65, 69, 71, 73, 83];

const lines = fs.readFileSync(DIR + "kich-ban.md", "utf8").split("\n").filter((l) => /^\d+\. /.test(l));
if (lines.length !== S.length) throw new Error(`kich-ban.md có ${lines.length} câu nhưng có ${S.length} prompt ảnh`);
const scenes = lines.map((l, i) => {
  let text = l.replace(/^\d+\.\s*/, "");
  // a struck-out line "~~…~~ (BỎ …)" is a removed scene: keep its number, render nothing
  const skip = text.startsWith("~~");
  if (skip) text = text.replace(/^~~(.*?)~~.*$/, "$1");
  let title;
  const m = text.match(/^`\[([^\]]+)\]`\s*/);
  // "|" in a title = forced line break
  if (m) { title = m[1].replace(/\s*\|\s*/g, "\n"); text = text.slice(m[0].length); }
  const narration = text.replace(/\{[^}]*\}\s*/g, "").replace(/\s*⚠/g, "").trim();
  const [image, chars] = S[i];
  const s = { narration, image: NO_PEOPLE.includes(i + 1) ? image + ". Nobody in the scene: no people, no figures, no faces" : image };
  if (title) s.title = title;
  if (skip) s.skip = true;
  if (chars.length) s.characters = chars;
  return s;
});

// "dừng lại để nhìn" shots hold still (quy chuẩn 3.3)
for (const n of [36, 47, 55, 73]) scenes[n - 1].motion = "still";

const SLUG = "1905-hai-con-duong";
// Veo clips (2026-11-17, 13 clip): prompt videos/v2/veo-prompts.json, clip gốc videos/v2/sNNN-veo.mp4,
// videos/sNNN.mp4 = bản dùng (s035, s028 = lần 2; bản lần 1 lỗi đã xoá khi dọn dẹp 2026-11-17).
const VEO = JSON.parse(fs.readFileSync(DIR + "videos/v2/veo-prompts.json", "utf8"));
for (const id of ["s001", "s008", "s010", "s015", "s016", "s022", "s023", "s028", "s035", "s040", "s066", "s078", "s082"])
  scenes[Number(id.slice(1)) - 1].video = VEO[id];

const project = {
  title: "1905 – Hai con đường",
  series: "Ngược dòng trăm năm – Tập 4",
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
// Animated route map (layers.py): Saigon -> Marseille
scenes[50].layers = "layers/s051.json";
// the opening title is long: smaller font so "CÙNG CỨU NƯỚC," stays on one line
scenes[0].titleSize = 100;
fs.writeFileSync(DIR + "project.json", JSON.stringify(project, null, 1) + "\n");
console.log(`project.json: ${scenes.length} cảnh, ${Object.keys(characters).length} nhân vật`);
