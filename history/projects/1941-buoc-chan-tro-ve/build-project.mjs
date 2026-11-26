// usage: node build-project.mjs  -> project.json (narration + titles from kich-ban.md, image prompts below)
//        and flow-jobs.json (one Flow job per scene: refs to attach + full prompt).
// Scene k = k-th numbered line of kich-ban.md = line k of tts-ngat-nhip.txt (94 scenes).
// Style 2026-11-18: every image attaches ref-style.jpg + approved character sheets (uploaded as ref-<key>.jpg).
// Bác (gia-thu): drawn clearly and dignified (draw-revered-figures-face). New designs for this episode only.
// Blank signs to letter later (Alegreya SC Bold, bang-chu): s012 PÁC BÓ, s024 CỐC BÓ, s029 SUỐI LÊ-NIN, s043 KHUỔI NẬM.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const DIR = fileURLToPath(new URL(".", import.meta.url));

const characters = {
  "gia-thu": { name: "Già Thu – Nguyễn Ái Quốc ở Pác Bó 1941–42", look: "very thin Vietnamese man about 50, thin sparse dark goatee and thin mustache, indigo Nung clothes, bamboo walking stick, cloth shoulder bag" },
  "ly-quoc-sung": { name: "Ông Lý Quốc Súng, nông dân Nùng", look: "adult Nung farmer about 45, indigo head cloth, indigo shirt, wicker back basket" },
  "can-bo-a": { name: "Cán bộ trẻ", look: "young Vietnamese cadre about 28, khaki-brown shirt with two pockets, shoulder bag" },
  "can-bo-b": { name: "Cán bộ lớn tuổi", look: "Vietnamese cadre about 38, thin mustache, dark brown peasant shirt, conical hat on his back" },
  "mat-tham-phap": { name: "Trùm mật thám Pháp ở Hà Nội 1941 (thiết kế mới)", look: "tall thin bald French officer about 50, round wire glasses, grey goatee, cream linen suit, black bow tie" },
};
const REF = (k) => (k === "gia-thu" ? "ref-bac-cao-bang-1941.jpg" : `ref-${k}.jpg`); // gia-thu = ảnh s097 tập 1931 (người dùng chọn 2026-11-25)
const BAC = ["gia-thu"];

const STYLE = "Create a NEW image. Use the first attached cartoon image ONLY as the art-style reference: copy ONLY its drawing style, NEVER its content: do not copy any people, children, buildings, gates, trees or pink blossoms from it. Drawing style: a simple TV-cartoon look, big heads, simplified bodies, round white eyes with black dot pupils, bold simple eyebrows, simple line nose, simple mouth, very flat solid colours, thick uniform black outlines, no shading, no gradients, no texture, bright even light. Colours vivid and eye-catching like a bright TV cartoon (blue sky with white clouds for day scenes, fresh green mountains, rich warm wood browns, indigo blue clothes, pink/orange accents, pure black), strong clean contrast, no pale or washed-out areas. Night and sad scenes stay flat too: flat navy sky, flat yellow lamp light. ";
const CAST = "The other attached images are APPROVED character sheets: draw those characters with EXACTLY the same face, hair and clothes as in their sheets (do not copy the sheet layout or the beige background). The attached picture of a thin man in indigo walking on a mountain path is his APPROVED look: copy ONLY that man (his face, eyes, thin goatee, hair, indigo clothes, bag, stick), NEVER that picture's mountains, path, stone marker or signboard. ";
const RESPECT = " The very thin Vietnamese man in indigo clothes with a thin sparse dark goatee is a revered national leader: draw his face clearly and recognisably like his sheet, calm and dignified, mouth closed, no sweat drops, no silly or comic faces; his goatee and hair stay dark grey-black, not white.";
const END = " Characters large in the frame (about 60% of the frame height) unless the shot is a wide view; frame full edge to edge with period details, three depth layers. Historically accurate for northern Vietnam 1940-1945: no modern objects (except in a scene explicitly set today), no national flags unless asked for, no badges with letters. NO pink or white blossoms anywhere: no cherry trees, no peach trees, no flowering trees, no falling petals (Vietnamese mountains: green trees, bamboo, banana plants). No text, no letters, no numbers, no captions, no watermark anywhere; any sign, board, paper, book page or document is BLANK; handwriting or print on any paper is drawn ONLY as plain wavy grey lines, never as letters or words (no Latin letters, no Chinese characters, no fake words). Generate exactly 1 image, vertical 9:16.";
const TOP = " Keep the top quarter of the frame simple (sky, mist or plain rock), room for a big title.";
const NOBODY = " Nobody in the scene: no people, no figures, no faces.";
const BOOK = "a thin small hand-printed booklet with a plain faded brown paper cover (BLANK cover)";
const CAVE = "the small Coc Bo cave at Pac Bo, Cao Bang: a low narrow limestone cave mouth half-hidden by green ferns and hanging vines, damp grey rock";
const STREAM = "the clear blue-green stream at Pac Bo flowing over round pebbles at the foot of green limestone peaks";
const SLAB = "a big flat grey stone slab on the stream bank used as a desk";
const VILLAGE = "a Nung mountain village in Cao Bang in early 1941 at Tet: earth-walled houses and wooden stilt houses with dark tile roofs, green limestone peaks, terraced fields, green bamboo groves and banana trees, morning mist";
const HUT = "a small hut of split bamboo walls and a palm-leaf thatch roof hidden in a dense green forest at Khuoi Nam";
const OFFICE = "a high-ceilinged French Surete office in Hanoi 1941: ochre-yellow walls, tall dark green shutters with tropical light, a heavy dark wooden desk with a black telephone and a brass lamp, grey metal filing cabinets";
const YEARS = "the last page of the booklet: a neat table of many short rows (wavy grey lines only), each row beginning with a small wavy mark";

// [image prompt, characters[], extra refs[]] in script order (94 scenes)
const S = [
  // ── Hook
  /* 1 */ [`Spring 1942 in the mountains of Cao Bang: close-up of ${BOOK} lying on ${SLAB} beside ${STREAM}, one small green leaf on its cover, morning mist on the peaks behind.` + TOP + NOBODY, []],
  /* 2 */ [`Close-up from above: ${BOOK} lies open on the stone; both pages are filled with short handwritten verse lines in two alternating lengths (a short line, then a longer line), drawn ONLY as wavy grey lines; a small ink brush beside it.` + NOBODY, []],
  /* 3 */ [`Close-up: ${YEARS}; a thin bamboo pointer stick rests on the page; warm light.` + NOBODY, []],
  /* 4 */ [`Extreme close-up of the very LAST row of the table in the booklet: that one row is underlined twice with bright red ink and glows softly, all other rows plain wavy grey lines; dramatic dark background around the page.` + TOP + NOBODY, []],
  /* 5 */ [`Hanoi 1941, a street crossroads with yellow colonial buildings and tamarind trees: two French colonial soldiers in white uniforms and pith helmets stand guard on one corner, two Japanese soldiers in khaki uniforms and caps with rifles stand on the other corner; Vietnamese people in brown clothes and conical hats pass between them with heads lowered.`, []],
  /* 6 */ [`Symbolic still life: a big old world globe on a dark wooden table, wrapped in grey war smoke clouds with tiny black silhouettes of warplanes and tanks around it; a huge black question-mark-shaped wisp of smoke above it (made of smoke, not a letter); tense mood.` + TOP + NOBODY, []],
  /* 7 */ [`${CAVE}; the very thin man in indigo clothes sits just inside the cave mouth on a rock, writing in a small booklet on his knee by the light of a tiny oil lamp, ferns framing the shot.`, ["gia-thu"]],
  /* 8 */ [`Inside the cave mouth: the very thin man in indigo eats from a simple bowl of yellow corn porridge with chopsticks, sitting at ${SLAB} covered with papers and a book; a gentle smile.`, ["gia-thu"]],
  /* 9 */ [`Dark symbolic still life under a single hanging lamp: an old yellowed 1932 newspaper on a table with a black-bordered BLANK box on its front page and a small portrait photo of the thin man inside the box; a burnt-out candle beside it.` + TOP + NOBODY.replace("no faces", "no faces except the small photo"), []],
  /* 10 */ [`Night at the cave mouth: the very thin man in indigo stands under a flat navy sky full of stars, looking far out over the dark mountains, one hand on his walking stick, thoughtful; the little lamp glows inside the cave behind him.` + TOP, ["gia-thu"]],
  /* 11 */ [`Three mysterious objects in a row on the stream bank, lit by a beam of morning sun: ${SLAB}, a small sheet of paper printed in purple ink (wavy lines only), and a rolled-up old world map tied with string.` + NOBODY, []],
  /* 12 */ [`Wide establishing view of Pac Bo in spring: ${STREAM}, green bamboo groves, mist, a small dark cave mouth in the cliff; in the foreground on the left a small plain BLANK wooden signboard on a post facing the viewer (completely blank, nothing written).` + TOP + NOBODY, []],
  // ── Hồi 1
  /* 13 */ [`Tet morning at the Vietnam-China border, 1941: a narrow mountain path through misty limestone peaks; far below, a Nung village with thin smoke rising from kitchens; small red paper firecracker scraps on the path.` + TOP + NOBODY, []],
  /* 14 */ [`Side view of six men walking in single file along the misty mountain path past a small square stone border marker (BLANK, no carving): the very thin man in indigo with his walking stick goes first, then the young cadre in khaki, the older cadre in brown, then three more men in brown peasant clothes with bags.`, ["gia-thu", "can-bo-a", "can-bo-b"]],
  /* 15 */ [`Close-up, three-quarter view: the very thin man in indigo walking through the mist, calm and determined eyes looking ahead, the walking stick in his hand, green bamboo soft in the background.`, ["gia-thu"]],
  /* 16 */ [`Flashback, Saigon harbour 1911: a slim young Vietnamese man of 21 in a simple white shirt stands at the railing of a big black-hulled steamship leaving the port, looking back at the shore with determination; the young man has EXACTLY the face of the young man in the second attached sheet (but in a white shirt); sepia-tinted warm colours, gulls.`, [], ["ref-naq-b.jpg"]],
  /* 17 */ [`Visual metaphor: an old world globe; a long red dotted line winds across three continents (Europe, Asia, Africa), and many small BLANK paper name tags hang along the line on tiny strings like a necklace.` + NOBODY, []],
  /* 18 */ [`Split image down the middle: on the LEFT half a huge steamship at a busy port quay in 1911 with smoke from its funnel; on the RIGHT half a tiny narrow footpath on a misty mountain in 1941 where the very thin man in indigo walks small with his stick.`, ["gia-thu"]],
  /* 19 */ [`${VILLAGE}: Nung families in indigo clothes celebrate Tet in a courtyard, square sticky-rice cakes wrapped in green leaves, children playing with a shuttlecock, an old woman pouring tea.`, []],
  /* 20 */ [`At the door of an earth-walled Nung house with a dark tile roof: the Nung farmer with an indigo head cloth warmly welcomes the very thin man in indigo with both hands, bowing slightly; a green bamboo grove behind the house.`, ["ly-quoc-sung", "gia-thu"]],
  /* 21 */ [`Inside the Nung house by a warm hearth fire: the very thin man in indigo sits chatting with Nung villagers who laugh and offer him a cup of tea; nobody pays special attention to him, a cosy everyday mood.`, ["gia-thu", "ly-quoc-sung"]],
  /* 22 */ [`In the village yard: the very thin man in indigo crouches among four laughing Nung children in indigo, pointing at a chicken and a basket as he learns their words, smiling warmly.` + TOP, ["gia-thu"]],
  // ── Hồi 2
  /* 23 */ [`${CAVE}; the very thin man in indigo walks toward the cave mouth carrying a small cloth bundle, the Nung farmer follows carrying a wicker basket of supplies; ferns and vines.` + TOP, ["gia-thu", "ly-quoc-sung"]],
  /* 24 */ [`Close-up of the place where the clear stream gushes out from under mossy rocks at the foot of the cliff, the source of the stream; above it the dark cave mouth; beside the water a small plain BLANK wooden signboard on a post facing the viewer (completely blank).` + NOBODY, []],
  /* 25 */ [`Cutaway cross-section diagram of a limestone mountain in flat cartoon style: a small cave on one side with a lamp, a narrow winding passage inside the rock leading out to the other side of the mountain, where a small square stone border marker stands; simple and clear.` + NOBODY, []],
  /* 26 */ [`High angle: far below on a winding path, two French colonial soldiers in white with rifles climb slowly; up in the foreground among ferns, the very thin man in indigo calmly watches from the cave mouth, half-hidden, one hand on the rock.`, ["gia-thu"]],
  /* 27 */ [`Inside the cramped damp cave: low rock ceiling, water drops on the grey walls, a small fire of twigs; the very thin man in indigo sits hunched with a thin blanket over his shoulders, still calm.`, ["gia-thu"]],
  /* 28 */ [`On the stream bank: the very thin man in indigo holds a bowl of yellow corn porridge; the Nung farmer kneels beside him and pours fresh bamboo shoots from his basket; morning sun.`, ["gia-thu", "ly-quoc-sung"]],
  /* 29 */ [`The very thin man in indigo stands on the bank of ${STREAM}, smiling and pointing at the water as if giving it a name; beside him a small plain BLANK wooden signboard on a post facing the viewer (completely blank).`, ["gia-thu"]],
  /* 30 */ [`Low angle: a tall green limestone peak rises beside the stream under a blue sky with white clouds; the very thin man in indigo, small at the bottom of the frame, points up at it with his walking stick, cheerful.`, ["gia-thu"]],
  /* 31 */ [`The very thin man in indigo sits on a rock at ${SLAB} beside ${STREAM}, translating a thick old book, writing with a pen on paper, sleeves rolled up, focused; sunlight through the leaves.`, ["gia-thu"]],
  /* 32 */ [`Three old postcards laid on the flat stone slab: one shows the Eiffel Tower in Paris, one shows Big Ben and the Thames in London, one shows the onion domes of Moscow; a pebble holds them down; the stream sparkles behind.` + NOBODY, []],
  /* 33 */ [`Contrast mood, inside the dark damp cave at night: the very thin man in indigo lies on a narrow plank by a dying small fire, an empty porridge bowl beside him; cold blue flat colours.`, ["gia-thu"]],
  /* 34 */ [`Bright morning by the stream: the very thin man in indigo sits on a rock, smiling, writing a short poem of four lines (wavy lines only) on a small sheet of paper on his knee.`, ["gia-thu"]],
  /* 35 */ [`Sunrise: the very thin man in indigo steps out of the cave mouth toward the sparkling stream, stretching gently, golden morning light on the limestone peaks.`, ["gia-thu"]],
  /* 36 */ [`Close-up: a bowl of steaming yellow corn porridge and a small dish of bamboo shoots on a stone, chopsticks across the bowl; the very thin man in indigo behind it, smiling with contentment.`, ["gia-thu"]],
  /* 37 */ [`The flat stone slab tilts a little on uneven pebbles; the very thin man in indigo steadies it with one hand while writing a translation with the other, a thick book open, a slight amused smile.`, ["gia-thu"]],
  /* 38 */ [`The very thin man in indigo stands proudly on a rock above the stream, the valley and green peaks spread out below under a bright blue sky, his walking stick in one hand, a warm proud smile, a light breeze in his clothes.` + TOP, ["gia-thu"]],
  /* 39 */ [`Close-up portrait: the very thin man in indigo, a gentle warm smile and kind bright eyes, the stream glittering softly behind him.`, ["gia-thu"]],
  /* 40 */ [`Visual metaphor: an old map of the world; a long chain of envelopes passed from hand to hand (only hands and sleeves visible) stretches from Europe across the sea toward a small Vietnam far away; a feeling of great distance.` + NOBODY.replace("no faces", "only hands"), []],
  /* 41 */ [`On a terraced rice field at the foot of the mountains: the very thin man in indigo stands barefoot in the earth among Nung and Tay farmers in indigo, holding an old farmer's hand warmly, everyone smiling.`, ["gia-thu"]],
  /* 42 */ [`At the cave mouth in soft evening light: the very thin man in indigo sits peacefully on a rock, an empty porridge bowl beside him, looking at the stream with a quiet contented smile.`, ["gia-thu"]],
  // ── Hồi 3
  /* 43 */ [`${HUT}, in misty morning light; tall trees, ferns, a thin path leading to the door; in the foreground a small plain BLANK wooden signboard on a post facing the viewer (completely blank).` + TOP + NOBODY, []],
  /* 44 */ [`A forest path: several Vietnamese cadres with walking sticks, cloth bags and rolled mats arrive at the bamboo hut after a long trek, wiping their brows; the young cadre in khaki and the older cadre in brown in front.`, ["can-bo-a", "can-bo-b"]],
  /* 45 */ [`Inside the bamboo hut: the very thin man in indigo leads a meeting at a low bamboo table, six cadres sitting on the floor around it, serious faces, papers and an oil lamp on the table; light through the bamboo walls.`, ["gia-thu", "can-bo-a", "can-bo-b"]],
  /* 46 */ [`Close-up on the bamboo table: the very thin man's hand places one single BLANK sheet of paper on top of all the other papers, a beam of light falling on it; the cadres lean in.` + TOP, ["gia-thu"]],
  /* 47 */ [`In the hut: the older cadre in brown carefully puts a bundle of papers, a small sickle and a rolled land map into a wooden box at the side, closing the lid gently, meaning "for later".`, ["can-bo-b"]],
  /* 48 */ [`Close-up: an old resolution paper on the bamboo table with wavy grey lines and one round red BLANK seal mark, lit by the oil lamp, solemn mood.` + NOBODY, []],
  /* 49 */ [`A long row of different Vietnamese people standing shoulder to shoulder, arms linked: a farmer in brown with a hoe, a factory worker in blue, a student in white, a woman trader with a basket, an old scholar in a black gown, a Tay woman and a Nung man in indigo; hopeful faces.`, []],
  /* 50 */ [`Inside the bamboo hut: all the cadres raise their hands in agreement around the low table, the very thin man in indigo nods with a satisfied smile; the young cadre in khaki beams.` + TOP, ["gia-thu", "can-bo-a", "can-bo-b"]],
  /* 51 */ [`After the meeting in the hut: the young cadre in khaki shyly offers the very thin man in indigo a small bunch of wild forest flowers on a leaf, the man laughs warmly and accepts it.`, ["gia-thu", "can-bo-a"]],
  /* 52 */ [`A Vietnamese messenger in brown clothes and a conical hat slips a rolled letter into a bamboo tube and runs down a mountain path; below him many small paths branch out to rice fields and villages in the plains.`, []],
  /* 53 */ [`A village square under a big banyan tree: a young man holds up an unrolled letter (wavy lines only) and reads it aloud; villagers in brown clothes and conical hats crowd around to listen, an old man cups his ear.` + TOP, []],
  /* 54 */ [`Close-up: the bottom of a handwritten letter (wavy lines only) on a bamboo table; a hand holding a pen finishes a signature drawn as a single wavy flourish; oil lamp light.` + NOBODY.replace("no faces", "only one hand"), []],
  /* 55 */ [`Close-up: the old yellowed 1932 newspaper again, its black-bordered BLANK box with the small photo of the thin man; dust and a cobweb on it in a dark archive drawer.` + NOBODY.replace("no faces", "no faces except the small photo"), []],
  /* 56 */ [`In ${OFFICE}: on the desk a thick dossier lies open with a small photo of the thin man clipped to it and a big blood-red BLANK stamp mark across the page; the tall thin bald French officer taps it smugly with his pen.`, ["mat-tham-phap"]],
  /* 57 */ [`In ${OFFICE}: a letter flutters down onto the desk; the tall thin bald French officer jumps up from his chair, eyes wide behind his round glasses which slip down his nose, his pen dropping, utterly shocked.`, ["mat-tham-phap"]],
  // ── Hồi 4
  /* 58 */ [`A Vietnamese village in the plains: an old woman and a farmer in brown hold a letter (wavy lines) upside down, puzzled, scratching their heads; a buffalo behind them.`, []],
  /* 59 */ [`By the stream: the very thin man in indigo sits on a rock with his chin in his hand, thinking hard, a stack of papers beside him.`, ["gia-thu"]],
  /* 60 */ [`Close-up in a forest clearing: a small freshly printed newspaper sheet in purple ink, a big blank title band at the top and a simple drawing of a farmer with a hoe, the rest wavy lines; sun dapples through the leaves.` + TOP + NOBODY, []],
  /* 61 */ [`Inside the bamboo hut: a smooth flat stone slab on a low bench with an ink roller and a pot of purple ink beside it; clearly no printing machine anywhere.` + NOBODY, []],
  /* 62 */ [`Inside the bamboo hut: the young cadre in khaki rolls purple ink over the flat stone slab, then presses a sheet of paper on it; several printed sheets hang drying on a string above.`, ["can-bo-a"]],
  /* 63 */ [`The very thin man in indigo writes an article on a sheet with a pen at a bamboo table, and on another sheet beside it draws a simple picture of a farmer with a hoe; focused, gentle.`, ["gia-thu"]],
  /* 64 */ [`Close-up of a printed sheet: a few short thick wavy lines (no letters) and a simple big drawing; a villager's finger points at the drawing with delight.` + NOBODY.replace("no faces", "only one finger"), []],
  /* 65 */ [`Two flat stone slabs side by side in the forest: on the left one an open book and a pen (a desk), on the right one an ink roller and fresh printed sheets (a press); morning light.` + NOBODY, []],
  /* 66 */ [`Spring 1942 at Pac Bo: fresh light-green spring leaves on the trees along ${STREAM}, the dark cave mouth in the cliff behind, blue sky with white clouds, fresh green.` + TOP + NOBODY, []],
  /* 67 */ [`The very thin man in indigo holds up ${BOOK}, fresh from printing, with both hands and a proud warm smile, fresh green leaves around him.` + TOP, ["gia-thu"]],
  /* 68 */ [`Close-up: the first page of the booklet (wavy lines only), a finger resting under the very first line, a small green leaf on the page.` + NOBODY.replace("no faces", "only one finger"), []],
  /* 69 */ [`Evening in a Nung village around a fire: the young cadre in khaki reads the booklet aloud, villagers of all ages sit listening, children repeating the verses with open eager faces.`, ["can-bo-a"]],
  /* 70 */ [`An illustrated booklet page made of four small framed vignettes in flat cartoon style: two Vietnamese heroines riding war elephants; a general with stakes in a river and wooden warships; a leader in armour raising a sword under a tree; a warrior king on horseback charging at dawn; no text.` + NOBODY.replace("no people, no figures, no faces", "people only inside the small vignettes"), []],
  /* 71 */ [`A Vietnamese farmer in brown ploughs a terraced field behind a water buffalo, singing happily with his mouth open and musical notes drawn as small simple swirls around him; mountains behind.`, []],
  /* 72 */ [`Close-up: four hands of different people (a farmer, a woman, a young man, an old man) placed one on top of another on the open booklet, warm light.` + NOBODY.replace("no faces", "only hands"), []],
  /* 73 */ [`Close-up: ${YEARS}, a finger moving down the rows toward the bottom.` + NOBODY.replace("no faces", "only one finger"), []],
  /* 74 */ [`Extreme close-up: the very last row of the table, underlined twice in bright red ink, glowing; the rest of the page dark.` + TOP + NOBODY, []],
  // ── Hồi 5
  /* 75 */ [`Inside the cave by lamp light: on the stone a fortune teller's crystal ball glows mysteriously, but the very thin man in indigo ignores it and studies a stack of newspapers and a world map instead.`, ["gia-thu"]],
  /* 76 */ [`Inside the cave: a big old world map (no labels) pinned to the rock wall, covered with small arrows and pins; the very thin man in indigo stands in front of it with a lamp, studying it closely.`, ["gia-thu"]],
  /* 77 */ [`Paris in June 1940, a sad grey day: the Eiffel Tower stands over an empty avenue with closed shutters and fallen leaves; far away a long column of small grey military trucks rolls down the avenue; a lone Parisian woman in a 1940 coat watches from a doorway with a worried face; no flags, no symbols, no emblems.` + TOP, []],
  /* 78 */ [`September 1940, a mountain border gate in northern Indochina: a column of Japanese soldiers in khaki with rifles and a few military trucks march in through the stone gate; French soldiers in white stand aside.`, []],
  /* 79 */ [`Visual metaphor: a thin Vietnamese farmer in brown bends under a bamboo shoulder pole; on one end sits a fat French colonial official in white with a pith helmet, on the other end a Japanese officer in khaki with a sword; the two masters glare at each other.`, []],
  /* 80 */ [`Visual metaphor: the French official in white and the Japanese officer in khaki pull hard on opposite ends of a long map of Indochina like a tug of war, the map tearing in the middle; dark storm clouds of war above them.`, []],
  /* 81 */ [`A Vietnamese farmer in brown sows seeds by hand in a freshly ploughed terraced field, while far away on the horizon dark rain clouds are gathering; calm and wise.`, []],
  /* 82 */ [`The very thin man in indigo kneels on the hillside at Pac Bo, planting a small seed in the dark earth with his hand, glancing up at the far rain clouds with a calm knowing look.`, ["gia-thu"]],
  /* 83 */ [`A hillside of small green seedlings; among them, as if they grew from the seeds, small things appear: a bamboo hut, a stack of printed sheets, a thin booklet, a small group of young cadres studying under a tree; rain clouds coming from afar.` + NOBODY.replace("no people, no figures, no faces", "only the small group of cadres far away"), []],
  /* 84 */ [`Night of 9 March 1945 at a colonial citadel in Hanoi: Japanese soldiers in khaki with rifles disarm French soldiers in white who raise their hands; searchlights, flat navy sky.` + TOP, []],
  /* 85 */ [`August 1945: a huge joyful crowd of Vietnamese people in brown, white and indigo flood a wide street, raising fists and red flags with one yellow five-pointed star in the centre; sunny sky.`, []],
  /* 86 */ [`The booklet lies open on the stone by the stream at the very last row, underlined twice in red, a beam of sunlight on it and one small green leaf.` + TOP + NOBODY, []],
  // ── Kết
  /* 87 */ [`Four objects arranged together on the stream bank: ${SLAB}, a printed sheet in purple ink, a rolled old world map and ${BOOK}; warm golden light.` + NOBODY, []],
  /* 88 */ [`View from the cave mouth: the small stream flows out and down the valley, growing into a wide shining river that winds far across green plains toward the horizon.` + NOBODY, []],
  /* 89 */ [`Today at Pac Bo: Vietnamese school pupils in white shirts and red scarves stand on the bank of the clear blue-green stream, one girl reading aloud from a small book, the others listening; modern but simple, limestone peaks behind.`, []],
  /* 90 */ [`August 1942: the very thin man in indigo with his walking stick and cloth bag sets off on a mountain path, turning his head to wave goodbye to the Nung farmer who waves back from the village gate.`, ["gia-thu", "ly-quoc-sung"]],
  /* 91 */ [`On a mountain road in Guangxi, China, 1942: the very thin man in indigo stands holding a small folded BLANK identity paper, looking ahead with calm resolve, a winding road and limestone hills behind.` + TOP, ["gia-thu"]],
  /* 92 */ [`A small market town street in Guangxi, China, 1942, with grey brick houses and BLANK shop signs: two Chinese soldiers in grey-blue 1940s Nationalist army uniforms and caps grab the arms of the very thin man in indigo; he stays calm and upright.`, ["gia-thu"]],
  /* 93 */ [`Pac Bo at dusk: by the cave mouth a bamboo walking stick leans alone against the rock and a small oil lamp glows on the flat stone slab; two Nung villagers in indigo stand nearby looking at it quietly, worried.`, []],
  /* 94 */ [`The very thin man in indigo sits calmly on a wooden bench in a small bare grey room with one small high window with iron bars, a beam of light falling on him, calm and dignified, determined eyes.`, ["gia-thu"]],
];

// ── read script lines in order
const lines = [];
for (const l of fs.readFileSync(DIR + "kich-ban.md", "utf8").split(/\r?\n/)) {
  const m = l.match(/^(\d+b?)\.\s+(.*)$/);
  if (m) lines.push(m[2]);
}
if (lines.length !== S.length) throw new Error(`kịch bản ${lines.length} câu, prompt ${S.length}`);
const tts = fs.readFileSync(DIR + "tts-ngat-nhip.txt", "utf8").trim().split(/\r?\n/);
if (tts.length !== S.length) throw new Error(`tts ${tts.length} dòng`);

const job = (id, [image, chars, extra = []]) => ({ id, refs: ["ref-style-2.jpg", ...chars.map(REF), ...extra], prompt: STYLE + (chars.length || extra.length ? CAST : "") + image + (chars.some((c) => BAC.includes(c)) ? RESPECT : "") + END });
const jobs = [];
const scenes = lines.map((text, i) => {
  let title;
  const m = text.match(/`\[([^\]]+)\]`\s*/);
  // " | " in a title tag = line break (ASS \N), e.g. `[VIẾT TRONG HANG | TRƯỚC NĂM 1945]`
  if (m) { title = m[1].replace(/\s*\|\s*/g, "\\N"); text = text.replace(m[0], ""); }
  const narration = text.replace(/\s*[⚠💬⚖️]+/gu, "").trim();
  const [image, chars] = S[i];
  const s = { narration, image };
  if (title) s.title = title;
  if (chars.length) s.characters = chars;
  jobs.push(job("s" + String(i + 1).padStart(3, "0"), S[i]));
  return s;
});

// AI clips (2026-11-25, Omni 1.2 Flash 4 s, 13 clip, người dùng duyệt "làm hết"): prompt videos/v2/omni-prompts.json,
// clip gốc videos/v2/<id>-omni.mp4, bản dùng videos/<id>.mp4. Tốc độ gốc (clipSpeed "original").
// s012 tạo từ ảnh chưa chữ; bản dùng = s012-omni-chu.mp4 (chèn PÁC BÓ lên video).
const OMNI = JSON.parse(fs.readFileSync(DIR + "videos/v2/omni-prompts.json", "utf8"));
fs.mkdirSync(DIR + "videos", { recursive: true });
for (const id of ["s001", "s002", "s004", "s006", "s007", "s010", "s012", "s016", "s039", "s062", "s069", "s085", "s088"]) {
  scenes[Number(id.slice(1)) - 1].video = OMNI[id];
  fs.copyFileSync(DIR + `videos/v2/${id}-omni${id === "s012" ? "-chu" : ""}.mp4`, DIR + `videos/${id}.mp4`);
}
// animated maps (src/layers.py, free): s013 đường về qua biên giới tới hang Cốc Bó, s017 hành trình 30 năm,
// s078 hai mũi tên Nhật vào Lạng Sơn / Hải Phòng 9.1940. Nền Flow: layers/map-sNNN.jpg (prompt layers/map-prompts.json).
for (const n of [13, 17, 78]) scenes[n - 1].layers = `layers/s${String(n).padStart(3, "0")}.json`;

// camera accents (src/camera.py, như tập 1931)
const Z = (x, y, z, t = 0) => ({ t, x, y, z });
const PUNCH = (x, y, z, shake) => ({ path: [Z(0.5, 0.5, 1), Z(x, y, z, 0.45), Z(x, y, z * 1.03, 1)], ease: "out", ...(shake ? { shake: { at: shake, dur: 0.4, amp: 0.006 } } : {}) });
const TILT = (y0, y1, z = 1.3) => ({ path: [Z(0.5, y0, z), Z(0.5, y1, z, 1)] });
const WHIP = (dir) => ({ whip: { dir, dur: 0.3 }, path: [Z(0.5, 0.5, 1.07), Z(0.5, 0.5, 1, 1)] });
const BLACK = (s) => ({ black: s, path: [Z(0.5, 0.5, 1), Z(0.5, 0.5, 1.06, 1)] });
const SHAKE = { path: [Z(0.5, 0.5, 1.05), Z(0.5, 0.5, 1, 1)], shake: { at: 0.2, dur: 0.5, amp: 0.01 } };
const CAMERA = {
  9: PUNCH(0.6, 0.7, 1.6), 30: TILT(0.7, 0.3), 43: WHIP("left"), 52: WHIP("right"), 55: PUNCH(0.58, 0.5, 1.5, 0.5),
  56: PUNCH(0.75, 0.78, 1.6), 66: WHIP("left"), 74: PUNCH(0.5, 0.82, 1.4), 75: PUNCH(0.68, 0.42, 1.5), 76: PUNCH(0.5, 0.28, 1.5),
  77: WHIP("right"), 80: SHAKE, 84: SHAKE, 93: BLACK(0.4),
};
for (const [n, c] of Object.entries(CAMERA)) scenes[n - 1].camera = c;

const SLUG = "1941-buoc-chan-tro-ve";
const project = {
  title: "1941 – Bước chân trở về – Mùa xuân Pác Bó",
  series: "Loạt Bác Hồ – Tập 3",
  preset: "cartoon-flat",
  format: "9:16",
  imageProvider: "manual",
  animate: "flow",
  animateScope: "marked",
  clipSpeed: "original",
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
  // 2026-11-26 người dùng: chữ lớn "cao quá, dời xuống 1 tí" → lề trên 90 → 190 px (khung 1920)
  titleStyle: { marginV: 190 },
  characters,
  scenes,
};
fs.writeFileSync(DIR + "project.json", JSON.stringify(project, null, 1) + "\n");
fs.writeFileSync(DIR + "flow-jobs.json", JSON.stringify(jobs, null, 1) + "\n");
console.log(`project.json: ${scenes.length} cảnh, ${Object.keys(characters).length} nhân vật; flow-jobs.json: ${jobs.length} job`);
