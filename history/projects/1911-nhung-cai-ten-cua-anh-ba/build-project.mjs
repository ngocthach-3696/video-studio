// usage: node build-project.mjs  -> writes project.json (narration + titles from kich-ban.md, image prompts below)
//        and flow-jobs.json (one Flow job per scene: refs to attach + full prompt).
// Line N of kich-ban.md = scene sNNN. Style 2026-11-18 (quy-chuan-dao-dien.md mục 10): every image attaches
// ref-style.jpg + the approved character sheets (characters/*.jpg, uploaded to Flow as ref-<key>.jpg).
// Bác: face = bản B (người dùng chọn 2026-11-19), drawn clearly, dignified (draw-revered-figures-face memory).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const DIR = fileURLToPath(new URL(".", import.meta.url));

const characters = {
  "anh-ba": { name: "Anh Ba – Nguyễn Tất Thành 1911 (phụ bếp)", look: "young Vietnamese kitchen helper, white shirt with rolled sleeves, long white apron, brown trousers" },
  "nguyen-ai-quoc": { name: "Nguyễn Ái Quốc 1919–1923 (âu phục đen)", look: "black Western suit, white high rounded collar, thin black tie" },
  "naq-gile": { name: "Nguyễn Ái Quốc – thợ sửa ảnh (gi-lê nâu)", look: "white shirt sleeves rolled up, dark brown waistcoat, loosened black tie" },
  "naq-ao-len": { name: "Nguyễn Ái Quốc – phòng lạnh 1920 (áo len)", look: "worn grey knitted sweater over white shirt, shabby brown overcoat with a patch" },
  "naq-mang-to": { name: "Nguyễn Ái Quốc – rời Pa-ri 1923 (măng tô, mũ phớt)", look: "long dark navy overcoat, grey felt fedora, small brown suitcase" },
  "phan-chau-trinh": { name: "Phan Châu Trinh ở Pa-ri", look: "slim, greying short hair, thin mustache, grey three-piece suit, black bow tie" },
  "phan-van-truong": { name: "Luật sư Phan Văn Trường", look: "round face, round wire glasses, small mustache, grey suit, leather briefcase" },
  "mat-tham": { name: "Mật thám Pháp (hình tượng)", look: "stocky French detective, bushy brown mustache, black bowler hat, brown overcoat, small notebook" },
};
const REF = (k) => (k === "nguyen-ai-quoc" ? "ref-naq-b.jpg" : `ref-${k}.jpg`);
const BAC = ["anh-ba", "nguyen-ai-quoc", "naq-gile", "naq-ao-len", "naq-mang-to"];

const STYLE = "Create a NEW image. Use the attached cartoon image of a school gate ONLY as the art-style reference: copy its exact drawing style: a simple TV-cartoon look, big heads, simplified bodies, round white eyes with black dot pupils, bold simple eyebrows, simple line nose, simple mouth, very flat solid colours, thick uniform black outlines, no shading, no gradients, no texture, bright even light. Colours vivid and eye-catching like a bright TV cartoon (blue sky with white clouds for day scenes, rich warm wood browns, fresh green, pink/orange accents, pure black), strong clean contrast, no pale or washed-out areas. Night and sad scenes stay flat too: flat navy sky, flat yellow lamp light. ";
const CAST = "The other attached images are APPROVED character sheets: draw those characters with EXACTLY the same face, hair and clothes as in their sheets (do not copy the sheet layout or the beige background). ";
const RESPECT = " The Vietnamese man from the character sheets is a revered national leader: draw his face clearly and recognisably, calm and dignified, no sweat drops, no silly or comic faces.";
const END = " Characters large in the frame (about 60% of the frame height) unless the shot is a wide view; frame full edge to edge with period details, three depth layers. Historically accurate for 1911-1923: no modern objects (except in a scene explicitly set today), no national flags. No text, no letters, no numbers, no captions, no watermark anywhere; any sign, board, paper or document is BLANK; handwriting or print on any paper is drawn ONLY as plain wavy grey lines, never as letters or words (no Latin letters, no 'Lorem', no fake words). Generate exactly 1 image, vertical 9:16.";
const TOP = " Keep the top quarter of the frame simple (sky or plain wall), room for a big title.";
const NOBODY = " Nobody in the scene: no people, no figures, no faces.";
const SHIP = "an early-1900s French cargo steamship with a black hull, white superstructure, one tall black-and-red funnel and two masts";
const ATTIC = "a tiny poor attic room in an old Paris building: sloping ceiling, one small window with a thin curtain, a narrow iron bed with a grey blanket, a small wooden table and chair, a coat hook on the wall, worn floorboards";
const ALLEY = "a narrow cobbled Paris cul-de-sac (impasse) in 1923 lined with old four-storey grey stone buildings with shutters and iron balconies, gas street lamps";
const MAP = "an aged parchment map of Europe in flat cartoon style filling the whole frame, simple ink coastlines, pale blue sea, no labels, no text, no letters";

// [image prompt, characters[]] of the FIRST script (78 lines, 2026-11-19). Images were made from these; the
// rewritten script (2026-11-20, 90 lines) reuses them via OLD() below (files moved to the new ids, old set in images/_v1/).
const S_OLD = [
  // ── Hook: Paris 1923, the empty room
  /* 1 */ [`Dusk in ${ALLEY}: two French plain-clothes detectives hide behind a gas lamp post in the foreground, large, both staring up at a single lit attic window high on the building; long evening shadows, warm lamp glow.` + TOP, ["mat-tham"]],
  /* 2 */ [`Medium shot: the detective stands across the street from the arched wooden front door of an old Paris building (a small BLANK house-number plate beside the door), pretending to read a newspaper held up high, peeking over the top with narrowed eyes; a café table and a bicycle nearby.`, ["mat-tham"]],
  /* 3 */ [`Comic time-passing shot: the detective sits on a stool at the same street corner, yawning, while dozens of calendar pages fly off a wall calendar beside him in a long swirl; around him the seasons change in four slices of the background (spring blossoms, summer sun, autumn leaves, winter snow).`, ["mat-tham"]],
  /* 4 */ [`Close-up insert from above: an open beige police dossier lying on a dark wooden desk; clipped to the first page a small square portrait photo of the Vietnamese man in his black suit (drawn in the same cartoon style); beside it a small drawing of a height scale, many lines of plain wavy lines (no letters), a list of several short wavy lines in a column, a red round rubber stamp mark with nothing inside, a fountain pen and a desk lamp.`, ["nguyen-ai-quoc"]],
  /* 5 */ [`The detective crouches on a dark narrow wooden staircase, scribbling in his notebook, peeking through a half-open attic door at a small table that holds only a piece of baguette bread, one sausage and a glass of milk under a weak lamp.`, ["mat-tham"]],
  /* 6 */ [`The detective stands frozen in the open doorway of ${ATTIC}, his mouth wide open in shock, his notebook dropping from his hand; the room is EMPTY: the bed is neatly made, the coat hook is empty, the window is wide open and the thin curtain flutters in the wind, morning light.`, ["mat-tham"]],
  /* 7 */ [`Berlin, June 1923: inside an old government office with tall windows showing Berlin rooftops and a green copper dome, close-up of a clerk's hand bringing down a big rubber stamp onto a folded travel document on the desk; ink pad, papers, a brass desk lamp; no face visible, only the hand and sleeve.`, []],
  /* 8 */ [`Close-up insert: an old folded travel document (laissez-passer) lying open on a desk under lamp light; glued on its left page a small photo of the Vietnamese man wearing his felt fedora and navy overcoat (cartoon style); the rest of the page has BLANK printed lines and a round stamp mark with nothing inside.` + TOP, ["naq-mang-to"]],
  /* 9 */ [`Split frame down the middle: LEFT half the empty Paris attic room with the open window and fluttering curtain; RIGHT half the Vietnamese man in his fedora and navy overcoat holding a small suitcase, walking calmly on a sunny Berlin street with tram lines, glancing back over his shoulder at the viewer with a quiet look.`, ["naq-mang-to"]],
  /* 10 */ [`Wide shot of a crowded French police office of the 1920s: many detectives in bowler hats at wooden desks covered in files, all turning to stare at a big cork board on the wall where ONE portrait photo of the Vietnamese man in his black suit is pinned in the centre, circled with red string and pins; a big red question mark floats above the board.`, ["mat-tham", "nguyen-ai-quoc"]],
  /* 11 */ [`A big old brass clock face fills the top of the frame with its hands spinning backwards (motion lines); below it the scene melts into a sunny Saigon river harbour of 1911 with ${SHIP} at a stone quay, coconut palms, small sampans.` + NOBODY, []],
  /* 12 */ [`Warm symbolic shot: three BLANK paper name tags hang on strings in a row in front of a big old world map pinned to a wooden wall, a warm yellow lamp lights them; a small model steamship sits on the shelf below; inviting, mysterious mood.` + NOBODY, []],
  // ── Hồi 1: 1911, kitchen helper Văn Ba
  /* 13 */ [`Morning at Nha Rong wharf, Saigon, June 1911: ${SHIP} pulls away from the stone quay into the brown Saigon river, white steam from its funnel; on the quay the long two-storey colonial Nha Rong building with a pale yellow facade, arched windows with green shutters and a pair of small green dragons on the roof ridge; coolies in conical hats with sacks, crates and coiled ropes in the foreground, bright blue sky.` + TOP, []],
  /* 14 */ [`Inside the hot cramped ship's galley: the young Vietnamese kitchen helper in his white apron, waist-up and large, carries a heavy pot of potatoes; a small BLANK name card is pinned on his apron; behind him a fat French head cook in a tall white toque shouts and points with a ladle; steam, hanging pans, a round porthole showing the sea.`, ["anh-ba"]],
  /* 15 */ [`Close-up portrait: the young kitchen helper looks out of a round brass porthole at the open sea, calm, bright determined eyes, a soft hopeful smile; sunlight on his face, the blue sea and a seagull outside.`, ["anh-ba"]],
  /* 16 */ [`Wide sea view at sunset: three black steamships on the ocean; two of them are small and far away sailing in opposite directions (one to the left, one to the right); the third one is big in the foreground heading straight to the horizon, and on its deck the young kitchen helper stands at the railing looking ahead.` + TOP, ["anh-ba"]],
  /* 17 */ [`Flashback in Saigon 1911, a riverside street: the young man (same face, wearing a plain white shirt and brown trousers, WITHOUT the apron) holds up both of his open empty hands with a warm confident smile; facing him a puzzled young Vietnamese friend in a brown tunic and conical hat asks with one hand raised; a market and boats behind.`, ["anh-ba"]],
  /* 18 */ [`Close-up insert: an old ship's pay ledger open on a wooden table, columns of plain wavy lines (no letters), a quill pen, and next to it a small neat stack of silver coins under a hanging oil lamp.` + TOP + NOBODY, []],
  /* 19 */ [`On the galley table a stack of coins sits in front of the young kitchen helper; three big hands reach in from the edges of the frame (the head cook's fat hand, a clerk's hand with a pen, a ship officer's gloved hand) and sweep most of the coins away, leaving only a tiny pile; the helper looks at the small pile with a calm, quietly sad face.`, ["anh-ba"]],
  /* 20 */ [`Visual metaphor on the ship's deck in the rain: a big umbrella marked only with a flat red band shelters three relaxed French sailors in blue-and-white striped shirts and berets, dry and smiling; the young kitchen helper stands just outside the umbrella in the rain, rain lines falling on him, holding a coin he has just paid into a small box under the umbrella.`, ["anh-ba"]],
  /* 21 */ [`Side by side in the galley, peeling potatoes at the same table: a young French kitchen helper on the left with THREE tall stacks of coins beside him, and the young Vietnamese kitchen helper on the right with only ONE small stack; both do exactly the same work; the Vietnamese helper keeps peeling calmly.`, ["anh-ba"]],
  /* 22 */ [`The harbour of Marseille, autumn 1911: the hilltop basilica Notre-Dame de la Garde with its golden statue on top above the old port, sailing ships and steamers; in the foreground the young man (same face, now wearing a plain dark jacket over his white shirt, no apron) sits on a wooden crate on the quay, writing a letter on his knee with a pencil.`, ["anh-ba"]],
  /* 23 */ [`The young man (dark jacket over white shirt) stands small in front of the tall closed iron gate of a grand French school building with oriental-style arches and a dome, looking up at it with hope, holding his letter; the gate's plaque is BLANK; blue sky, Paris chestnut trees.`, ["anh-ba"]],
  /* 24 */ [`Night in a tiny rented room: the young man writes a letter by candlelight at a small table, serious and gentle; above his head a big thought bubble shows Vietnamese village children in a simple school reading books together under a banyan tree.`, ["anh-ba"]],
  /* 25 */ [`Close-up on a French official's big wooden desk: a gloved hand slams a large red rubber stamp onto the young man's letter, leaving a big red X mark (no letters); piles of files, an inkwell, a blue-white-red ribbon around a folder.` + NOBODY.replace("no faces", "only the hand"), []],
  /* 26 */ [`A fat French official with a pince-nez and big mustache sits behind his desk and points lazily over his shoulder at a very long chain of paper forms that stretches out of his window, across the sea, all the way to a tiny figure of a colonial Governor-General in a white uniform and pith helmet sitting far away in a tropical palace.`, []],
  /* 27 */ [`Ironic composition: the young man (dark jacket over white shirt) stands small at the bottom of the frame holding up his letter politely; towering above him sits a huge French colonial Governor-General in a white uniform with gold epaulettes and a white pith helmet, on a tall chair set on top of a map of Vietnam, looking down at him without interest.`, ["anh-ba"]],
  /* 28 */ [`TODAY, a modern archive room in the south of France: long rows of grey metal shelves with numbered grey archive boxes, bright neon light; a modern woman archivist in a cardigan and white cotton gloves holds an old yellowed handwritten letter and looks at it through a magnifying glass; a laptop on the table.`, []],
  // ── Hồi 2: at sea, New York, London
  /* 29 */ [`The young man (dark jacket over white shirt, a small cloth bag on his shoulder) walks up a wooden gangway onto ${SHIP}; behind him on the hill the closed iron school gate is drawn small and grey; he looks forward, determined.`, ["anh-ba"]],
  /* 30 */ [`New York, winter 1912: through a small window behind him, 1910s skyscrapers and the Statue of Liberty in the harbour; the young man (same face, wearing a brown overcoat and a flat cap) sits at a small wooden table writing a letter by an oil lamp, worried eyes, an envelope beside him.`, ["anh-ba"]],
  /* 31 */ [`Thought-image: far away in the Vietnamese countryside, a thin elderly Vietnamese scholar in a faded brown long tunic and black turban walks alone down a long dusty road between rice fields at sunset, carrying a small cloth bundle; his back to the viewer, small in the frame, lonely.`, []],
  /* 32 */ [`Close-up insert: a single sealed envelope with a postage stamp (no writing) lying on a big old map of North America on a table; only the city of New York is marked with a small red dot; empty map around it.` + NOBODY, []],
  /* 33 */ [`London 1914, a busy hotel kitchen in the suburbs: the young man (same face, wearing a white kitchen jacket and white apron) washes a mountain of plates at a deep sink; through the steamy window, foggy London rooftops with chimneys and red double-decker horse buses.`, ["anh-ba"]],
  /* 34 */ [`Close-up: the young man's hand writes on an old picture postcard of London on the kitchen table; above it a thought bubble shows five giant soldiers in different 1914 uniforms fighting over a big globe; a teacup beside the postcard.`, ["anh-ba"]],
  /* 35 */ [`Visual metaphor: the young kitchen helper (apron) stands at the kitchen table and studies a big chessboard placed among pots and vegetables; the chess pieces are small warships, cannons and soldiers of five different armies; he rests his chin on his hand, thinking deeply, a calm clever look.`, ["anh-ba"]],
  // ── Hồi 3: Paris 1919, the new name
  /* 36 */ [`Paris: the Vietnamese man in his black suit (now about 29) walks with a small suitcase along a Paris street with the Eiffel Tower behind; above his head three old calendar pages float in the air with big question marks.`, ["nguyen-ai-quoc"]],
  /* 37 */ [`A small quiet Paris cul-de-sac with old houses and ivy (Villa des Gobelins): at the door of number six stand three Vietnamese men, waist-up and large: in the middle the man in the black suit, on his left the older scholar Phan Chau Trinh in a grey three-piece suit and bow tie, on his right the lawyer Phan Van Truong with round glasses and a briefcase; on the wall beside the door a horizontal enamel street-name plate that is COMPLETELY BLANK (blue with a white border, no writing).`, ["nguyen-ai-quoc", "phan-chau-trinh", "phan-van-truong"]],
  /* 38 */ [`A photo retouching workshop by a bright window: the Vietnamese man in his brown waistcoat leans over a slanted desk retouching a portrait photograph with a very fine brush and a magnifying glass; beside him the older scholar Phan Chau Trinh in a grey suit does the same work; jars of brushes, small bottles of ink, a pile of portrait photos.`, ["naq-gile", "phan-chau-trinh"]],
  /* 39 */ [`Versailles, June 1919, inside the gilded Hall of Mirrors with crystal chandeliers: around a long table, cartoon statesmen of the great powers (an American with round glasses, a British man with a white mustache, a French old man with a white walrus mustache and grey gloves, an Italian) cut a big world map like a cake with a huge knife and fork, smug faces.` + TOP, []],
  /* 40 */ [`At the gilded gate of the Palace of Versailles, the Vietnamese man in his black suit politely hands a rolled-up document tied with a ribbon to a tall bored doorman in a red-and-gold uniform; motor cars and diplomats in top hats behind.`, ["nguyen-ai-quoc"]],
  /* 41 */ [`Close-up insert: a printed petition sheet with eight short numbered paragraphs (all plain wavy lines (no letters)) lies on a desk; a big magnifying glass hovers over the page and shows an EMPTY gap where something is missing; a small red question mark beside it.` + NOBODY, []],
  /* 42 */ [`The man in the black suit stands waist-up and presents, with both hands open, three small floating icons above his palms: a folded newspaper, a pair of walking shoes, and the scales of justice; calm hopeful face, plain warm background of a Paris room.`, ["nguyen-ai-quoc"]],
  /* 43 */ [`Back in the Hall of Mirrors: under the long conference table the rolled petition lies forgotten in an overflowing wastepaper basket, while the statesmen above keep talking and laughing with cigars, not looking down.` + NOBODY.replace("no people, no figures, no faces", "only the statesmen's legs and shoes are visible under the table"), []],
  /* 44 */ [`The man in the black suit holds the petition sheet up to his chest, waist-up, looking straight at the viewer with quiet determination; at the bottom of the sheet a single handwritten signature line (plain wavy line); a quill pen in an inkwell beside him.` + TOP, ["nguyen-ai-quoc"]],
  /* 45 */ [`TODAY, a modern library reading room: two modern historians (a woman with glasses and a man with a grey beard, modern clothes) sit at a table and argue in a friendly way over an old yellowed document, each pointing at it, question marks floating above their heads; laptops, books.`, []],
  /* 46 */ [`A busy Paris street in 1919 with cafés, trams and horse carts: the man in the black suit hands printed leaflets to passers-by (a worker in a flat cap, a lady with a parasol, a Vietnamese soldier in uniform); a thick bundle of leaflets under his arm; papers flying in the breeze.`, ["nguyen-ai-quoc"]],
  /* 47 */ [`Two detectives hide behind a round green Paris advertising column (Morris column, posters BLANK), one reads a leaflet with a frown, the other looks left and right with a magnifying glass, searching the crowd; comic sneaky poses.`, ["mat-tham"]],
  /* 48 */ [`Close-up insert on a police desk: a typed letter with plain wavy line lines; above it two simple floating cartoon icons joined by a plus sign: a red heart and a small map of Vietnam in an S shape, with an equal sign leading to a glowing light bulb.` + NOBODY, []],
  /* 49 */ [`The detective sits at his desk holding a big magnifying glass over a paper, a light bulb glowing above his head, eyes wide with surprise as he finally understands; papers and coffee cup on the desk.` + TOP, ["mat-tham"]],
  /* 50 */ [`A 1919 police identification room: the man in the black suit stands straight and calm against a wall painted with a height scale (horizontal lines, no numbers), while a detective behind an old wooden box camera on a tripod takes his picture under a flash pan; the man keeps a dignified steady look.`, ["nguyen-ai-quoc", "mat-tham"]],
  /* 51 */ [`Transformation shot: a tall standing mirror in the middle of the frame; on the left stands the young kitchen helper in his white apron looking into it, and inside the mirror the reflection is the man in the black suit and tie, the same face, looking back at him; warm light.`, ["anh-ba", "nguyen-ai-quoc"]],
  /* 52 */ [`A Paris street at dusk: the man in the black suit walks calmly toward the viewer, large in the foreground; behind him three detectives in bowler hats follow and hide comically, one behind a lamp post, one behind a tree, one behind an open newspaper.`, ["nguyen-ai-quoc", "mat-tham"]],
  // ── Hồi 4: 1920, the road
  /* 53 */ [`In the workshop, the man in his brown waistcoat carefully paints blue Chinese dragon patterns on a white porcelain vase with a fine brush, a calm little smile; on the shelf behind him a row of finished "antique" Chinese vases and lacquer boxes.`, ["naq-gile"]],
  /* 54 */ [`July 1920, night, the tiny attic room: the man in his grey sweater and shabby brown coat sits on the edge of the iron bed reading a newspaper (masthead BLANK) under a small oil lamp, leaning in closely, totally absorbed.`, ["naq-ao-len"]],
  /* 55 */ [`Close-up of the man's face (grey sweater) holding the newspaper, a single tear running down his cheek, eyes shining with deep emotion and hope, lamplight on his face; dignified, moved.`, ["naq-ao-len"]],
  /* 56 */ [`In the same tiny attic room at dawn, the man in his grey sweater stands up alone, one arm raised and his hand open, speaking out loud to the empty room as if to a great crowd; through the small window the sky glows orange with sunrise; the newspaper lies on the bed.`, ["naq-ao-len"]],
  /* 57 */ [`Symbolic crossroads at sunrise: a road splits into three; the left road (toward the east, with an old rifle lying by it) and the middle road (toward the west, with a pile of books by it) fade into grey mist; the third road shines bright gold and red toward a huge rising sun; the man in the black suit stands at the start of the third road, seen from behind at three-quarter view, his face turned slightly toward us.`, ["nguyen-ai-quoc"]],
  /* 58 */ [`Tours, France, December 1920, winter: a big crowded congress hall with a high wooden ceiling, hundreds of French delegates with beards and mustaches in dark coats on wooden benches, long tables, red banners hanging from the balcony (all BLANK), snow visible through tall windows.` + TOP, []],
  /* 59 */ [`Inside the congress hall: the Vietnamese man in his black suit stands up tall among seated older French delegates with beards and mustaches, speaking with a calm firm face, one hand slightly raised; the delegates turn their heads to look at him.`, ["nguyen-ai-quoc"]],
  /* 60 */ [`The man in the black suit speaks at a wooden lectern, waist-up on the right; behind him on the left a huge visual comparison: a giant grey prison building with many barred windows next to a tiny thatched village school hut with one small door.`, ["nguyen-ai-quoc"]],
  /* 61 */ [`Split frame: TOP half, in a sepia memory tone, the young man in a dark jacket standing small outside the closed iron gate of the French school in 1911; BOTTOM half, in full colour, the man in the black suit speaking at the congress lectern in 1920 with the crowd listening.`, ["anh-ba", "nguyen-ai-quoc"]],
  /* 62 */ [`In the congress hall a bearded French delegate stands up and interrupts, raising his hand and opening his mouth; the man in the black suit keeps speaking calmly and firmly, one hand on the lectern, unshaken.`, ["nguyen-ai-quoc"]],
  /* 63 */ [`The vote in the Tours congress hall, France 1920: hundreds of FRENCH delegates (white European men with beards and mustaches, dark coats; NO Asian people, no turbans) raise their hands; on the long table at the front two piles of paper ballots, one very tall pile and one much smaller pile, and a wooden ballot box.` + TOP, []],
  /* 64 */ [`After the vote, the man in the black suit shakes hands warmly with older French comrades with beards, everyone smiling, a big red banner (BLANK) behind them, confetti of paper in the air.`, ["nguyen-ai-quoc"]],
  // ── Hồi 5: 1921-1923, Chen Vang
  /* 65 */ [`Three panels in one vertical image, top to bottom: (1) the man in his brown waistcoat writes an article at a small desk; (2) he draws a cartoon on a large sheet with a pen; (3) he sells a small newspaper (masthead BLANK) on a Paris street corner, holding a bundle of copies.`, ["naq-gile"]],
  /* 66 */ [`The detective writes his report at a desk; above him a big thought bubble shows what he saw: the man in his grey sweater shivering in a cold attic room with a broken stove, eating baguette bread with a small glass of milk.`, ["mat-tham", "naq-ao-len"]],
  /* 67 */ [`${ATTIC}, EMPTY, at dawn: the bed neatly made, the coat hook empty, the window wide open, the thin curtain blowing in, a single fine paintbrush left on the table.` + TOP + NOBODY, []],
  /* 68 */ [`Paris 1923, an old cinema with a glowing marquee and BLANK film posters: the man in his felt fedora and navy overcoat enters through the front doors among the crowd; in the narrow side alley a back door stands slightly open in the shadows; a detective waits at the front, looking the other way.`, ["naq-mang-to", "mat-tham"]],
  /* 69 */ [`Close-up: a hand holds the open travel document showing the small photo of the man in his fedora and a round stamp mark (nothing inside); behind it a blurred train window with German countryside.`, ["naq-mang-to"]],
  /* 70 */ [`A steaming railway platform in 1923: the man in his fedora and navy overcoat walks with his small suitcase toward a black steam train, a fine paintbrush sticking out of his breast pocket; porters and steam clouds around.`, ["naq-mang-to"]],
  /* 71 */ [`${MAP}; a red dashed route runs from Paris east to Berlin, north to Hamburg, then across the Baltic Sea to Petrograd, with a tiny steamship drawn on the sea part of the route.` + NOBODY, []],
  // ── Kết
  /* 72 */ [`Callback: Nha Rong wharf, Saigon 1911, bright morning: the young man in his white shirt (no apron) stands on the deck of the steamship and holds up both open empty hands, a warm brave smile; the yellow Nha Rong building with its two small roof dragons behind.`, ["anh-ba"]],
  /* 73 */ [`On the deck of a steamship crossing the cold northern sea, 1923: the man in his fedora and navy overcoat stands at the railing, his suitcase at his feet, both hands open, looking calmly at the horizon where a bright gold-and-red road of light shines on the water toward the rising sun.`, ["naq-mang-to"]],
  /* 74 */ [`A police cork board: three portrait photos pinned in a row and connected with red string: the young kitchen helper in his apron, the man in the black suit, and the man in the fedora; under each photo a small BLANK card; pins, notes with plain wavy lines.`, ["anh-ba", "nguyen-ai-quoc", "naq-mang-to"]],
  /* 75 */ [`Callback: the young man in a dark jacket stands small in front of the tall CLOSED iron gate of the grand French school, 1911, holding his letter; a big padlock on the gate; grey sky.`, ["anh-ba"]],
  /* 76 */ [`Comic contrast: three detectives in bowler hats stand guard in front of a narrow attic door in a snowy Paris stairwell, shivering, noses red, snow on their hats, calendar pages flying past them.`, ["mat-tham"]],
  /* 77 */ [`Symbolic: in a dark space two doors stand side by side; on the left a grand ornate door wide open but leading only to darkness; on the right a heavy closed and padlocked iron gate; a line of footprints leads away from the closed gate, around it, and onto a glowing gold road that rises toward a bright sunrise.` + TOP + NOBODY, []],
  /* 78 */ [`Night, candlelight: on a wooden table lies a newspaper (masthead BLANK) with a small black-bordered portrait photo of the man in the black suit; a big question mark of smoke rises from the candle; through the window behind, the lights of a 1930s Asian harbour city with junk boats.`, ["nguyen-ai-quoc"]],
];

// ── Rewritten script (2026-11-20): line N -> old image number (OLD_OF) or a new prompt (NEW).
const OLD_OF = {1:5,2:4,3:1,4:6,5:7,6:8,7:9,8:10,9:11,10:12,11:13,12:14,13:15,14:16,15:17,16:18,17:19,18:21,19:22,20:23,21:24,22:25,23:26,24:27,25:28,30:31,31:33,32:34,33:34,34:35,36:37,37:38,38:39,39:40,40:41,41:42,42:43,43:44,45:46,46:47,48:48,49:49,52:50,53:51,54:52,56:53,57:54,58:55,59:56,60:57,61:58,62:59,63:60,64:61,65:62,66:63,67:64,68:65,72:66,73:5,76:67,77:68,78:69,79:70,80:71,83:72,84:73,85:74,86:67,87:75,88:76,89:77,90:78};
const SIL = "a Vietnamese informant drawn as a flat dark charcoal-grey silhouette figure with only two white dot eyes visible (no other facial features), wearing a 1920s flat cap and a plain jacket";
const NEW = {
  26: [`Waist-up close shot on the windy Marseille quay at dusk, 1911: the young man (dark jacket over white shirt) holds his rejected letter marked with a big red X and turns his head to look straight at the viewer, thoughtful and calm, as if asking us what we would do; ships and the hilltop basilica behind.`, ["anh-ba"]],
  27: [`Visual dilemma on the Marseille quay: the young man (dark jacket over white shirt) stands at a fork in the path, seen from the front, looking left and right; on the LEFT path the open door of a steamy ship's galley with a tiny pile of coins on a stool; on the RIGHT path, right in front of him, a tall iron school gate slammed shut with a big padlock.`, ["anh-ba"]],
  28: [`On the windy Marseille quay at dusk, 1911: the young man (dark jacket over white shirt, a small cloth bag on his shoulder) stands at a fork in the path, seen from the front, large in the frame; the LEFT path leads to a small round thought-image far away across the sea of a Vietnamese village with bamboo, a thatched house and rice fields (the way home); the RIGHT path leads to a wooden gangway up to a big steamship with smoke rising, ready to sail (the way onward); he turns his head toward the ship, thoughtful and determined.`, ["anh-ba"]],
  29: [`Three panels in one vertical image, top to bottom, the same young Vietnamese man (same face) in three different jobs in the 1910s: (1) in a ship's galley in a white apron peeling a big basket of potatoes; (2) in a French villa garden by the sea in work clothes, raking leaves with a rake; (3) on a snowy London street in a brown overcoat and flat cap, shovelling snow; each panel bright and simple.`, ["anh-ba"]],
  35: [`Paris, about 1918-1919: the Vietnamese man in his black suit (now about 28) walks with a small suitcase along a grand Paris boulevard, large in the frame, looking up with calm determination at the city; behind him the Eiffel Tower, grand stone government buildings with columns, cafés and a tram; blue sky; nothing floating in the air.`, ["nguyen-ai-quoc"]],
  44: [`Close-up insert, night, a desk lit by one lamp: the bottom of a petition sheet with a single handwritten signature line (plain wavy line) and a quill pen in an inkwell; on the plain wall behind the desk fall the soft dark cast SHADOWS of three men standing side by side (one with round glasses, one older and slim, one young), the men themselves are not visible; mysterious mood.` + NOBODY.replace("no faces", "only shadows on the wall"), []],
  47: [`Close-up in a French judicial records office, 1919: a long wooden card-index drawer pulled open, full of BLANK index cards; a detective's hand in a brown coat sleeve flips to an empty gap between the cards where nothing is filed; a red question mark floats above the gap; a typed report with plain wavy lines lies beside the drawer.` + NOBODY.replace("no faces", "only the hand"), []],
  50: [`A dim Paris alley at night, 1919: three informants stand in a row facing the viewer, each is ${SIL}; each wears a small BLANK paper tag hanging on a string around the neck; a gas lamp throws yellow light, long shadows; mysterious mood.` + TOP, []],
  51: [`The detective at his desk reads a typed report with a small simple map of Vietnam drawn on it (S shape, a single red dot on the central coast); in the foreground a huge red rubber-stamp mark shaped like a big X slams across the report; the detective's eyebrows jump in surprise.`, ["mat-tham"]],
  55: [`Cutaway view of a thin attic wall in a Paris building, 1920: on the RIGHT side of the wall the Vietnamese man in his grey sweater writes quietly at his small table by lamplight; on the LEFT side, pressed against the other face of the same wall, the detective listens through a big brass ear trumpet, scribbling in his notebook; a small pay envelope with a coin peeking out sticks from the detective's coat pocket.`, ["naq-ao-len", "mat-tham"]],
  69: [`A busy French police office in 1920: a big round wall clock (simple ticks, no numbers) above; the detective writes reports at top speed; a tall stack of reports on his desk grows like a tower; a messenger boy in a cap runs out of the door with an armful of envelopes; motion lines of hurry.`, ["mat-tham"]],
  70: [`A French police chief's office, 1920: a whole wall covered with a neat grid of about 250 small BLANK index cards; ONE card in the centre is circled in red, has a red pin and a red ribbon, and glows; a grey-haired French police chief in a dark uniform with a big white mustache points at it sternly with a pointer stick; the detective stands beside him nodding.` + TOP, ["mat-tham"]],
  71: [`Night, ${ATTIC} lit only by moonlight and the beam of an old 1920s electric torch: two detectives secretly copy documents at the small table; one holds the torch over a stack of the man's papers, the other copies them fast into a notebook; they glance nervously at the door; nobody else in the room.`, ["mat-tham"]],
  74: [`Extreme close-up seen over the detective's shoulder through a gap in a door: very close in front of us, on a small wooden table, a plate with a piece of baguette bread and one sausage, and a glass of milk, under a weak lamp; the detective's big eye and mustache are in the near foreground edge, peering.`, ["mat-tham"]],
  75: [`Symbolic wide view: dozens of small folded newspapers (mastheads BLANK) fly like a flock of white birds across a blue sea from the coast of France on the LEFT (a tiny Eiffel Tower) toward the coast of Vietnam on the RIGHT (palm trees, green rice fields, a small village); on the French shore the detective jumps and reaches out with both arms in alarm, too late.`, ["mat-tham"]],
  81: [`A Paris café in autumn 1923: an informant, ${SIL}, sits at a small table writing a report and shrugs with both hands; behind him on the wall a simple map of Europe where two small countries in the middle are circled with big question marks; falling yellow leaves outside the window.`, []],
  82: [`Moscow, summer 1923: the Vietnamese man in his felt fedora and navy overcoat stands calmly on a wide cobbled square, holding his small suitcase, a quiet confident look; behind him the colourful onion domes of Saint Basil's Cathedral and red brick walls; blue sky, no flags.`, ["naq-mang-to"]],
};
// extra shots inside a line (scene "shots"): new pictures to generate (copies of old ones are made by remap)
const EXTRA_NEW = {
  s001b: [`Close-up insert in a poor Paris attic room of 1920, on a small wooden table under a weak lamp: one piece of baguette bread on a plain plate, flat cartoon style, filling the frame.` + NOBODY, []],
  s001c: [`Close-up insert in the same poor Paris attic room of 1920 (plain plaster wall, sloping ceiling, European furniture, NOT Asian, no paper screens, no blossoms): on a small wooden table one plain sausage on a plain plate next to a knife, flat cartoon style, filling the frame.` + NOBODY, []],
  s001d: [`Close-up insert in the same poor Paris attic room of 1920 (plain plaster wall, sloping ceiling, European furniture, NOT Asian, no paper screens, no blossoms): on a small wooden table one simple glass of milk, a little steam, flat cartoon style, filling the frame.` + NOBODY, []],
  s015b: [`Close-up: two young open empty hands held out palms up toward the viewer, white shirt sleeves rolled up, nothing in the hands; behind them, softly simplified, a Saigon riverside with boats in 1911.` + NOBODY.replace("no faces", "only the hands and sleeves"), []],
  s018b: [`Waist-up close shot in the hot ship's galley after work: the young kitchen helper (white apron) sits alone at the table and looks down quietly at one small stack of coins in his open palm; steam, hanging pans, a round porthole with the evening sea; calm, dignified, a little sad.`, ["anh-ba"]],
  s052b: [`Close-up insert on a police desk: two different 1919 police papers lie side by side, each with a small square photo of the man in the black suit and a small drawn vertical height bar beside the photo; the two height bars are clearly of different heights; a red question mark floats between the papers; the rest is plain wavy grey lines, no numbers.`, ["nguyen-ai-quoc"]],
  s057b: [`Close-up insert: a hand in a worn grey sweater sleeve holds a newspaper page with dense columns of plain wavy grey lines under the warm light of a small oil lamp; a single tear drop has fallen on the paper and made a small wet circle.` + NOBODY.replace("no faces", "only the hand and sleeve"), []],
};
// camera (src/camera.py, quy-chuan-dao-dien.md mục 12, người dùng duyệt 2026-11-20)
const Z = (x, y, z, t = 0) => ({ t, x, y, z });
const PUNCH = (x, y, z, shake) => ({ path: [Z(0.5, 0.5, 1), Z(x, y, z, 0.45), Z(x, y, z * 1.03, 1)], ease: "out", ...(shake ? { shake: { at: shake, dur: 0.4, amp: 0.006 } } : {}) });
const TILT = (y0, y1, z = 1.35) => ({ path: [Z(0.5, y0, z), Z(0.5, y1, z, 1)] });
const PAN = (x0, x1, z = 1.35, y = 0.5) => ({ path: [Z(x0, y, z), Z(x1, y, z, 1)] });
const HOLD = (x, y, z, dz = 0.05) => ({ path: [Z(x, y, z), Z(x, y, z + dz, 1)] });
const WHIP = (dir) => ({ whip: { dir, dur: 0.3 }, path: [Z(0.5, 0.5, 1.07), Z(0.5, 0.5, 1, 1)] });
const BLACK = (s) => ({ black: s, path: [Z(0.5, 0.5, 1), Z(0.5, 0.5, 1.06, 1)] });
const CAMERA = {
  2: PUNCH(0.42, 0.45, 1.45, 1.6), 3: TILT(0.75, 0.3, 1.3), 4: BLACK(0.4), 6: PUNCH(0.23, 0.55, 1.5), 9: WHIP("left"),
  29: WHIP("right"), 32: { path: [Z(0.5, 0.5, 1), Z(0.5, 0.535, 1.08, 1)] }, 35: WHIP("left"), 36: PUNCH(0.51, 0.43, 1.6),
  51: { ...PUNCH(0.5, 0.55, 1.15), shake: { at: 0.3, dur: 0.5, amp: 0.012 } }, 56: WHIP("right"), 61: PAN(0.3, 0.7), 68: WHIP("left"),
  70: PUNCH(0.5, 0.45, 1.35, 1.2), 71: { path: [Z(0.5, 0.5, 1.05), Z(0.5, 0.5, 1, 1)], shake: { at: 0.2, dur: 0.4, amp: 0.006 } },
  73: PUNCH(0.6, 0.55, 1.35), 76: BLACK(0.4), 78: PUNCH(0.31, 0.63, 1.5), 80: PAN(0.25, 0.75, 1.3), 83: BLACK(0.3),
};
const SHOTS = {
  1: [{ image: "s001b", at: 0.55 }, { image: "s001c", at: 0.7 }, { image: "s001d", at: 0.84 }],
  3: [{ image: "s003b", at: 0.55 }], 15: [{ image: "s015b", at: 0.52 }], 17: [{ image: "s017b", at: 0.55 }],
  18: [{ image: "s018b", at: 0.66 }], 28: [{ image: "s028b", at: 0.35 }], 29: [{ image: "s029c", at: 0.4 }, { image: "s029b", at: 0.78 }],
  44: [{ image: "s044b", at: 0.45 }], 52: [{ image: "s052b", at: 0.4 }], 57: [{ image: "s057b", at: 0.6 }], 85: [{ image: "s085b", at: 0.35 }],
};
const STILL = [42];

// review 2026-11-20 (lần 3): sub-lines "15a.", "15b." are merged into scene 15 (one voice clip, extra pictures via SHOTS);
// a missing number (33) becomes a skipped scene so ids stay aligned with images/ and audio/.
const byNum = {};
for (const l of fs.readFileSync(DIR + "kich-ban.md", "utf8").split("\n")) {
  const m = l.match(/^(\d+)[a-z]?\.\s+(.*)$/);
  if (m) (byNum[+m[1]] ??= []).push(m[2]);
}
const SKIP = [33];
const lines = [];
for (let n = 1; n <= 90; n++) {
  if (!byNum[n] && !SKIP.includes(n)) throw new Error(`thiếu câu ${n}`);
  lines.push(byNum[n] ? n + ". " + byNum[n].join(" ") : null);
}
const job = (id, [image, chars]) => ({ id, refs: ["ref-style.jpg", ...chars.map(REF)], prompt: STYLE + (chars.length ? CAST : "") + image + (chars.some((c) => BAC.includes(c)) ? RESPECT : "") + END });
const jobs = [];
const scenes = lines.map((l, i) => {
  const n = i + 1;
  if (l === null) return { narration: "", image: "", skip: true };
  let text = l.replace(/^\d+\.\s*/, "");
  let title;
  const m = text.match(/`\[([^\]]+)\]`\s*/);
  if (m) { title = m[1].replace(/\s*\|\s*/g, "\n"); text = text.replace(m[0], ""); }
  const narration = text.replace(/\{[^}]*\}\s*/g, "").replace(/\*\([^)]*\)\*/g, "").replace(/\s*[⚠💬⚖️]+/gu, "").trim();
  const [image, chars] = OLD_OF[n] ? S_OLD[OLD_OF[n] - 1] : NEW[n];
  const s = { narration, image };
  if (title) s.title = title;
  if (chars.length) s.characters = chars;
  if (CAMERA[n]) s.camera = CAMERA[n];
  if (SHOTS[n]) s.shots = SHOTS[n];
  if (STILL.includes(n)) s.motion = "still";
  const id = "s" + String(n).padStart(3, "0");
  if (!OLD_OF[n]) jobs.push(job(id, NEW[n]));
  return s;
});
for (const [id, v] of Object.entries(EXTRA_NEW)) jobs.push(job(id, v));

// AI clips (2026-11-21, Omni 1.2 Flash 4 s, 13 clip): prompt videos/v2/veo-prompts.json, clip gốc videos/v2/<id>-omni.mp4,
// videos/<id>.mp4 = bản dùng. s001, s028 (ảnh đầu của cảnh nhiều ảnh) và s017b (ảnh phụ câu 17) chạy qua "shots"
// (render.mjs tự dùng videos/<ảnh>.mp4), nên chỉ đánh dấu "video" cho các cảnh một ảnh.
const VEO = JSON.parse(fs.readFileSync(DIR + "videos/v2/veo-prompts.json", "utf8"));
for (const id of ["s004", "s009", "s011", "s013", "s030", "s046", "s055", "s058", "s071", "s079"])
  scenes[Number(id.slice(1)) - 1].video = VEO[id];

const SLUG = "1911-nhung-cai-ten-cua-anh-ba";
const project = {
  title: "1911 – Những cái tên của anh Ba",
  series: "Loạt Bác Hồ – Tập 1",
  preset: "cartoon-flat",
  format: "9:16",
  imageProvider: "manual",
  animate: "flow",
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
fs.writeFileSync(DIR + "flow-jobs.json", JSON.stringify(jobs, null, 1) + "\n");
console.log(`project.json: ${scenes.length} cảnh, ${Object.keys(characters).length} nhân vật; flow-jobs.json: ${jobs.length} job`);
