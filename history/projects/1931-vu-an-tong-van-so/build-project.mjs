// usage: node build-project.mjs  -> project.json (narration + titles from kich-ban.md, image prompts below)
//        and flow-jobs.json (one Flow job per scene: refs to attach + full prompt).
// Scene k = k-th numbered line of kich-ban.md ("35b" counts as its own scene) = line k of tts-ngat-nhip.txt.
// Style 2026-11-18: every image attaches ref-style.jpg + approved character sheets (uploaded as ref-<key>.jpg).
// Bác: face = bản B tập 1911, drawn clearly and dignified (draw-revered-figures-face).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const DIR = fileURLToPath(new URL(".", import.meta.url));

const characters = {
  "tong-van-so": { name: "Nguyễn Ái Quốc – Tống Văn Sơ 1931 (áo dài Hoa xanh đậm)", look: "thin Vietnamese man about 41, hollow cheeks, dark navy Chinese long gown" },
  "ly-thuy": { name: "Lý Thụy – Quảng Châu 1924–27", look: "light grey Sun Yat-sen tunic suit, thin notebook" },
  "thau-chin": { name: "Thầu Chín – Xiêm 1928", look: "sun-tanned, faded brown peasant shirt, rolled-up trousers, cloth shoulder bag" },
  "loseby": { name: "Luật sư Frank Loseby", look: "English solicitor about 48, round dark-rimmed glasses, light grey three-piece suit, leather briefcase" },
  "ba-loseby": { name: "Bà Loseby", look: "English woman about 40, wavy brown hair, floral 1930s dress, pearls" },
  "mat-tham": { name: "Mật thám Pháp ở Hà Nội", look: "stocky, curled black mustache, white colonial uniform, pith helmet, dossier" },
  "canh-sat-anh": { name: "Thanh tra cảnh sát Anh (Hồng Kông)", look: "tall, ginger mustache, khaki tunic and shorts, peaked cap, cane" },
  "canh-sat-anh-2": { name: "Cảnh sát Anh trẻ (thay cảnh sát Ấn, người dùng 2026-11-22)", look: "young British constable, clean-shaven, khaki tunic and shorts, khaki peaked cap, wooden baton" },
  "ly-phuong-thuan": { name: "Lý Phương Thuận", look: "young Vietnamese woman, low bun, light blue mandarin-collar blouse, dark skirt" },
};
const REF = (k) => `ref-${k}.jpg`;
const BAC = ["tong-van-so", "ly-thuy", "thau-chin"];

const STYLE = "Create a NEW image. Use the attached cartoon image of a school gate ONLY as the art-style reference: copy ONLY its drawing style, NEVER its content: do not copy any people, children, buildings, gates, trees or pink blossoms from it. Drawing style: a simple TV-cartoon look, big heads, simplified bodies, round white eyes with black dot pupils, bold simple eyebrows, simple line nose, simple mouth, very flat solid colours, thick uniform black outlines, no shading, no gradients, no texture, bright even light. Colours vivid and eye-catching like a bright TV cartoon (blue sky with white clouds for day scenes, rich warm wood browns, fresh green, pink/orange accents, pure black), strong clean contrast, no pale or washed-out areas. Night and sad scenes stay flat too: flat navy sky, flat yellow lamp light. ";
const CAST = "The other attached images are APPROVED character sheets: draw those characters with EXACTLY the same face, hair and clothes as in their sheets (do not copy the sheet layout or the beige background). ";
const RESPECT = " The thin Vietnamese man is always bare-headed with his short black hair (no turban, no head cloth) unless a hat is asked for, and clean-shaven (no beard, no mustache) unless a beard is asked for. The thin Vietnamese man from the character sheets is a revered national leader: draw his face clearly and recognisably, calm and dignified, mouth closed, no sweat drops, no silly or comic faces.";
const END = " Characters large in the frame (about 60% of the frame height) unless the shot is a wide view; frame full edge to edge with period details, three depth layers. Historically accurate for 1923-1933: no modern objects (except in a scene explicitly set today), no national flags, no badges with letters. No text, no letters, no numbers, no captions, no watermark anywhere; any sign, board, paper or document is BLANK; handwriting or print on any paper is drawn ONLY as plain wavy grey lines, never as letters or words (no Latin letters, no Chinese characters, no 'Lorem', no fake words). Generate exactly 1 image, vertical 9:16.";
const TOP = " Keep the top quarter of the frame simple (sky or plain wall), room for a big title.";
const NOBODY = " Nobody in the scene: no people, no figures, no faces.";
const STREET = "Tam Kung Road in Kowloon City, Hong Kong, 1931: a row of three-storey Chinese shophouses with arcaded verandas, wooden shutters, hanging BLANK shop signboards, a rickshaw";
const STAIR = "a narrow steep dark wooden staircase inside an old Kowloon shophouse, peeling plaster walls, a small window with pale blue dawn light";
const DESK = "the office of a French colonial police officer in Hanoi 1931: heavy dark wooden desk with a green-shaded lamp, piles of beige dossiers, a slow ceiling fan, tall green shutters with tropical light, a big wall map of Asia (no labels) with red pins";
const CELL = "a cell in Victoria Gaol, Hong Kong: thick grey granite walls, one small high barred window with a beam of light, a wooden plank bed, a heavy iron door";
const COURT = "a 1931 British colonial courtroom in Hong Kong: dark wood panels, high ceiling with slow ceiling fans, tall windows, a judge in a red robe and white wig on a high bench, barristers in black gowns and white wigs, a young British constable in khaki at the door";
const WALL = "a tall old stone wall standing alone like a stage set, with TWO doors: on the left a big grand front door of heavy dark wood with brass studs; on the right a small plain narrow back door";
const OFFICER = "a French colonial police officer (stocky, curled black mustache, white uniform)";
const MAP = "an aged parchment map of East and South-East Asia in flat cartoon style filling the whole frame, simple ink coastlines, pale blue sea, no labels, no text";
const SHIPFR = "a 1930s French passenger-cargo steamship with a black hull, white superstructure and one black-and-red funnel, no flag";

// [image prompt, characters[]] in script order (97 scenes)
const S = [
  // ── Hook
  /* 1 */ [`Dawn in ${STREET}; in the foreground two Hong Kong policemen, BOTH in khaki tunics, khaki shorts and khaki peaked caps exactly like their sheets (NOT dark blue), (the British inspector with a ginger mustache and the young clean-shaven British constable) walk quickly toward the dark arched doorway of one shophouse with a small BLANK house-number plate; flat blue dawn sky, the last street lamps still lit.` + TOP, ["canh-sat-anh", "canh-sat-anh-2"]],
  /* 2 */ [`Low angle looking up ${STAIR}: the British inspector climbs first holding an electric torch, the young British constable right behind him with a baton; long dramatic shadows on the wall.`, ["canh-sat-anh", "canh-sat-anh-2"]],
  /* 3 */ [`Inside a small bare upstairs room at dawn (wooden table, a thin mattress, papers): the British inspector grips the arm of the thin Vietnamese man in his dark navy Chinese gown; the man is bare-headed (short black hair, NO hat, NO turban, NO head cloth), exactly his approved face, calm and upright, looking straight ahead; the young British constable fills the doorway.`, ["tong-van-so", "canh-sat-anh", "canh-sat-anh-2"]],
  /* 4 */ [`Close-up insert: the inspector's hand holds open a small folded Chinese identity paper with a tiny photo of the thin man in his navy gown and a red BLANK square seal; plain wavy lines only, no characters; dawn light from the window.` + NOBODY.replace("no faces", "only the hand and sleeve"), []],
  /* 5 */ [`In ${DESK}: the French officer leans over his desk grinning widely, slamming a red pin into the wall map exactly at Hong Kong; a telegram paper in his other hand.`, ["mat-tham"]],
  /* 6 */ [`Dark symbolic still life under a single hanging lamp: a thick beige dossier on a table with a small portrait photo of the thin Vietnamese man clipped on it, a big blood-red BLANK stamp mark across the cover, and a black judge's gavel beside it; deep shadows, solemn mood.` + NOBODY.replace("no faces", "no faces except the small photo"), []],
  /* 7 */ [`Two officials shake hands over a desk in a colonial office: on the left the British inspector with a ginger mustache, on the right the French officer with a curled black mustache; on the wall behind them an old framed painting of British and French soldiers of the Great War marching side by side.`, ["canh-sat-anh", "mat-tham"]],
  /* 8 */ [`${MAP}: a short dotted red sea route runs from Hong Kong along the coast to Haiphong in northern Vietnam, with a tiny cartoon steamship sailing on it; two small round pins mark the two ports.` + NOBODY, []],
  /* 9 */ [`Hong Kong harbour 1931, a busy quay: ${SHIPFR} waits with steam rising from its funnel; in the foreground the French officer stands with his hands on his hips, smugly pointing at the ship with his chin.`, ["mat-tham"]],
  /* 10 */ [`Sunny day at sea: the thin Vietnamese man in his navy gown stands free at the railing of a ship, the sea wind moving his gown, a calm quiet smile, seagulls and white clouds; bright and open.`, ["tong-van-so"]],
  /* 11 */ [`Close-up portrait: the thin Vietnamese man seen through the iron bars of a prison cell window, calm, dignified, determined eyes looking at the viewer; a beam of light on his face.`, ["tong-van-so"]],
  /* 12 */ [`Mysterious still life on a dark wooden table under a warm lamp, three objects in a row: a judge's wooden gavel, a folded newspaper with a black-bordered BLANK box on its front page, and a small toy steamship next to a red paper lantern with a gold tassel.` + NOBODY, []],
  /* 13 */ [`Close-up from above: two hands untie the string of a thick old dossier tied with red tape, dust rising in the lamp light, the cover BLANK with a faded round stamp mark; inviting, mysterious mood.` + NOBODY.replace("no faces", "only the hands"), []],
  // ── Hồi 1
  /* 14 */ [`A 1923 steam train crosses a wide snowy plain toward a far city with onion-domed church towers, black smoke trailing; cold blue sky.` + NOBODY, []],
  /* 15 */ [`In ${DESK}: the French officer pushes another red pin into the wall map with a frown, a red string already linking several pins across Asia and Europe.`, ["mat-tham"]],
  /* 16 */ [`Canton (Guangzhou), 1924: a busy street of arcaded qilou shophouses with BLANK signboards, rickshaws and the Pearl River with junks behind; in the foreground the Vietnamese man in a light grey Sun Yat-sen tunic walks briskly holding a thin notebook.` + TOP, ["ly-thuy"]],
  /* 17 */ [`Inside a meeting room in Canton: the Vietnamese man in a grey tunic sits between a tall Russian adviser (thick dark wavy hair, big dark mustache, dark suit) and two Chinese officials in tunics, translating with one hand raised; teacups and papers on the table.`, ["ly-thuy"]],
  /* 18 */ [`Night, a small rented room in Canton lit by an oil lamp: the Vietnamese man in his grey tunic teaches eight young Vietnamese men sitting on benches, pointing at a BLANK blackboard with a stick; eager young faces.`, ["ly-thuy"]],
  /* 19 */ [`Dawn on a narrow mountain path at the border: three young Vietnamese men with cloth bags walk home in a line, one hides a thin booklet with a BLANK cover inside his shirt; misty green hills of northern Vietnam ahead.`, []],
  /* 20 */ [`The same night class from the back of the room: in the last row a sly young man with narrow shifty eyes secretly writes in a tiny notebook hidden under the bench, while the others listen to the teacher in the grey tunic at the far end (small).`, ["ly-thuy"]],
  /* 21 */ [`A river border: on the near bank the French officer peers through binoculars across a wide river at the Canton skyline; he stretches one arm out uselessly over the water, frustrated; a Chinese guard post on the far bank; river banks with reeds and banyan trees only, NO pink or white blossoms, no cherry trees.`, ["mat-tham"]],
  /* 22 */ [`Canton, April 1927, chaos in the street: soldiers with rifles run past, smoke rises behind the buildings; in the foreground the Vietnamese man in the grey tunic slips calmly into a narrow alley carrying a small suitcase, glancing back over his shoulder.`, ["ly-thuy"]],
  /* 23 */ [`A Vietnamese emigrant village in north-east Siam, 1928: wooden houses on stilts, banana trees, a dirt road and a pond; smiling Vietnamese villagers in brown clothes and conical hats welcome a sun-tanned man in a faded brown shirt with a cloth shoulder bag.` + TOP, ["thau-chin"]],
  /* 24 */ [`Under a big shady tree in the Siam village: the sun-tanned man in the brown shirt kneels beside a small BLANK wooden board, teaching six village children who sit on mats and copy wavy lines on slates; warm afternoon light.`, ["thau-chin"]],
  /* 25 */ [`A border checkpoint with a simple wooden barrier: a Siamese guard in a 1920s Siamese police uniform raises his palm firmly to stop the French officer, who stands holding up a document, furious and red-faced.`, ["mat-tham"]],
  /* 26 */ [`Early 1930, a small secret room in Kowloon with closed shutters: the thin Vietnamese man in his navy gown sits at the head of a round table with five young Vietnamese men in shirts, all leaning in seriously over a single sheet of paper; a teapot, an oil lamp.`, ["tong-van-so"]],
  /* 27 */ [`Autumn 1930, Nghe Tinh: a long column of Vietnamese peasants in brown clothes and conical hats marches along the dykes between golden rice fields carrying red flags, each with a small yellow hammer and sickle in the upper corner next to the pole (the 1930 Communist Party flag), no other symbols, no text, raising fists; sunset sky.`, []],
  /* 28 */ [`In ${DESK}: the wall map now has four pins (Paris, Moscow, Canton, Siam) joined by red string and each crossed out with a big black X; the French officer stands in front of it scratching his head, confused.`, ["mat-tham"]],
  /* 29 */ [`The French officer almost buried behind a mountain of dossiers, telegrams and photos piled on his desk, only his eyes and mustache visible over the pile.`, ["mat-tham"]],
  /* 30 */ [`Visual metaphor: the French officer stands at a tall border fence, reaching through the bars with an extra-long pair of handcuffs; on the other side, out of his reach, policemen in different uniforms (British, Chinese, Siamese) stand with their arms folded and their backs turned.`, ["mat-tham"]],
  // ── Hồi 2
  /* 31 */ [`Vinh, October 1929, a colonial tribunal room: a French judge in a black robe sits at a high bench flanked by two Vietnamese mandarins in dark ceremonial robes and hats; in front, a row of young Vietnamese defendants in white shirts stand with heads high; ceiling fans, tall shutters.` + TOP, []],
  /* 32 */ [`The same tribunal: in the centre one EMPTY wooden defendant's chair under a single spotlight, the other defendants on both sides turn to look at it; the French judge reads from a paper.`, []],
  /* 33 */ [`Close-up: one sheet of paper with a red BLANK seal lies alone on an empty dark table, its corner lifting in a draught from the window; dust in the light.` + NOBODY, []],
  /* 34 */ [`In a British colonial office, the French officer bows politely and holds out the sentence paper with both hands toward a British official in a white suit behind a desk, who raises an eyebrow.`, ["mat-tham"]],
  /* 35 */ [`Singapore harbour, 1 June 1931: police in white uniforms arrest a thin European man in a cream suit on the quay; one policeman opens his suitcase and pulls out a bundle of letters and papers; palm trees and ships behind.`, []],
  /* 36 */ [`Close-up insert: the seized papers fanned out on a police desk; one sheet shows a small hand-drawn street map (wavy lines only) with one tiny square house circled in red ink; a magnifying glass over it.` + NOBODY, []],
  /* 37 */ [`Side view inside ${STAIR}, a different angle from the previous staircase shot: the British inspector with a ginger mustache and the young British constable climb the steep wooden stairs, seen full body from head to boots with their faces clearly visible, determined; the inspector holds an electric torch whose beam lights a closed wooden door at the top with lamp light under it.`, ["canh-sat-anh", "canh-sat-anh-2"]],
  /* 38 */ [`On the shophouse veranda at dawn: the young British constable escorts the young Vietnamese woman in the light blue blouse; she walks calm and upright, chin raised.`, ["ly-phuong-thuan", "canh-sat-anh-2"]],
  /* 39 */ [`A bare interrogation room in the police station: the thin Vietnamese man in his navy gown sits upright on a wooden chair; across a table the British inspector leans forward with a notebook under a hanging lamp.`, ["tong-van-so", "canh-sat-anh"]],
  /* 40 */ [`Close-up in the interrogation room: the British inspector pushes a photo across the table of a young Vietnamese man in a black Western suit (same face, Paris 1920); the thin man in the navy gown looks at it calmly with a closed mouth, giving nothing away.`, ["tong-van-so", "canh-sat-anh"]],
  /* 41 */ [`In ${DESK}: the French officer stands at the tall window looking out at the harbour, tapping his foot impatiently, a pocket watch open in his hand.`, ["mat-tham"]],
  // ── Hồi 3: two doors
  /* 42 */ [`Wide symbolic shot: ${WALL}; both doors closed; a bright empty paved courtyard in front; dramatic and simple.` + TOP + NOBODY + ` No trees with pink or white blossoms anywhere, no cherry blossoms, no flowers; plain dusty ground, grey stone and blue sky only.`, []],
  /* 43 */ [`Closer on the big grand front door of heavy dark wood: above it hangs a BLANK brass plaque; two officials stand on either side of it, one in a French white uniform and one in a British khaki uniform, ready to pass a prisoner through.`, []],
  /* 44 */ [`Close-up insert: an old leather law book lies open; one line of plain wavy text is underlined by a bold red ribbon bookmark lying across the page.` + NOBODY, []],
  /* 45 */ [`The big front door is now wrapped in heavy iron chains with a huge padlock; the French officer tugs at the handle with both hands, straining, his pith helmet falling off.`, ["mat-tham"]],
  /* 46 */ [`The small plain back door in the stone wall: a hand in a white gloved sleeve with gold braid (the Governor's) pulls it open; warm light pours out; the wall is plain grey stone.` + ` No trees with pink or white blossoms anywhere, no cherry blossoms, no flowers; plain dusty ground, grey stone and blue sky only.` + NOBODY.replace("no faces", "only the gloved hand and sleeve"), []],
  /* 47 */ [`Through the open small back door: a wide harbour full of ships of many kinds, with big question marks floating above the water; the door frame and wall are plain grey stone.` + ` No trees with pink or white blossoms anywhere, no cherry blossoms, no flowers; plain dusty ground, grey stone and blue sky only.` + NOBODY, []],
  /* 48 */ [`The colonial Governor of Hong Kong in a white uniform with gold epaulettes and a white helmet with a plume on the desk beside him signs a document with a fountain pen at a grand desk; a large window shows the harbour.`, []],
  /* 49 */ [`Close-up insert: the signed document; in the middle of the wavy lines a small drawing of a steamship with two tiny soldiers on its deck; a red wax seal at the bottom.` + NOBODY, []],
  /* 50 */ [`Symbolic: the small back door opens directly onto the gangway of ${SHIPFR}; at the top of the gangway the French officer waits smiling innocently, hiding a pair of handcuffs behind his back.`, ["mat-tham"]],
  // ── Hồi 4: the lawyer
  /* 51 */ [`A 1931 solicitor's office in Hong Kong Central: tall windows, ceiling fan, shelves of law books; the English solicitor with round glasses looks up from his desk, listening with a serious face to a young Asian visitor in a Western suit seen from behind.`, ["loseby"]],
  /* 52 */ [`Waist-up portrait: the English solicitor with round dark-rimmed glasses and a light grey three-piece suit stands by his window, adjusting his glasses, calm and clever.` + TOP, ["loseby"]],
  /* 53 */ [`The prison visiting room of Victoria Gaol: the English solicitor sits across a plain wooden table from the thin Vietnamese man in his navy gown; both lean in, talking quietly; a young British constable by the iron door; light from a barred window.`, ["loseby", "tong-van-so"]],
  /* 54 */ [`Close-up: the solicitor's hand rests on a very old thick leather law book with a worn BLANK cover and brass corners, a candle and a quill beside it; golden light.` + NOBODY.replace("no faces", "only the hand and sleeve"), []],
  /* 55 */ [`Visual metaphor: a blindfolded old-fashioned bronze statue of Justice holding scales stands in the light; at her feet a small prisoner's chain lies broken.` + NOBODY, []],
  /* 56 */ [`In ${COURT}: two stiff British colonial officials in white suits sit at the government table, one points at the empty witness box, demanding; a big question mark floats above the judge.`, []],
  /* 57 */ [`Funny shot: the two stiff British officials in white suits sit squeezed together on a hard courtroom bench, sweating, fanning themselves with papers, uncomfortable at being made to explain.`, []],
  /* 58 */ [`Wide view of ${COURT}; on the wall a big tear-off calendar has its pages flying off one after another in a swirl.`, []],
  /* 59 */ [`A barrister in a black gown and white wig stands and points firmly at a document he holds up, arguing passionately before the judge; the thin Vietnamese man in his navy gown sits calmly in the dock behind him.`, ["tong-van-so"]],
  /* 60 */ [`Close-up insert: the deportation document with the small steamship drawing; a red dotted arrow runs from the steamship toward a dark stormy coastline under black clouds.` + NOBODY, []],
  /* 61 */ [`Visual metaphor: the small back door in the stone wall has a paper mask peeling off its face, revealing underneath the heavy padlock and chains of the big front door.` + NOBODY, []],
  /* 62 */ [`Night in the Governor's office lit by a single desk lamp: the Governor in his white uniform quickly and secretly signs a second document, glancing at the door.`, []],
  /* 63 */ [`In ${COURT}: the judge in red robe brings down his gavel; in the dock the thin Vietnamese man in his navy gown stands upright and calm. The front of the judge's high bench is ONE solid carved wooden panel with NO door, no opening and no gap underneath; the khaki constable stands beside the main entrance door in the far back wall of the room, well away from the bench.`, ["tong-van-so"]],
  /* 64 */ [`The judge leans forward and hands a rolled paper to the barrister; through the tall courtroom window, far away, the silhouette of London's Big Ben clock tower appears in a dreamy bubble.`, []],
  /* 65 */ [`Hong Kong harbour: ${SHIPFR} sails away with no prisoner; on the quay the French officer watches it go, his mouth open, his arms hanging down.`, ["mat-tham"]],
  // ── Hồi 5
  /* 66 */ [`Night in ${CELL}: the thin Vietnamese man in his navy gown sits on the plank bed coughing into a white handkerchief, very thin and tired but still upright; moonlight through the bars.`, ["tong-van-so"]],
  /* 67 */ [`A prison infirmary ward: plain white iron hospital beds; the thin Vietnamese man lies propped up in one bed under a grey blanket, a glass of water and a medicine bottle on a stool; the young British constable stands guard at the door.`, ["tong-van-so", "canh-sat-anh-2"]],
  /* 68 */ [`A Paris street newsstand in August 1932: a fresh newspaper hangs on the kiosk with a large black-bordered BLANK box on its front page; Parisians in hats stop and stare.` + TOP, []],
  /* 69 */ [`A London street corner in 1932 with red double-decker buses: a newsboy in a cap holds up a newspaper with a black-bordered BLANK box; a gentleman in a bowler hat reads it, shocked.`, []],
  /* 70 */ [`Close-up insert: a wall calendar page torn from a pad lies on a desk, one day circled with a thick black ring, a black ribbon laid across it; candle smoke.` + NOBODY, []],
  /* 71 */ [`In ${DESK}: the French officer reads the newspaper with the black-bordered box, one eyebrow raised high, half relieved and half doubtful; a big question mark floats above his head.`, ["mat-tham"]],
  /* 72 */ [`The prison infirmary at dawn: the thin Vietnamese man lies awake in the white iron bed, calm, looking at the soft light from the barred window, a slight peaceful smile; very much alive.`, ["tong-van-so"]],
  /* 73 */ [`London, June 1932, foggy morning: the grand stone government buildings of Whitehall with a black taxi and a red double-decker bus passing; pigeons.` + TOP + NOBODY.replace("no people, no figures, no faces", "only tiny distant passers-by"), []],
  /* 74 */ [`A long panelled corridor outside a London courtroom: two English barristers in black gowns and white wigs stand close together near the big closed courtroom door, talking in low voices and about to shake hands.`, []],
  /* 75 */ [`Close-up: a written agreement on a polished table, two fountain pens laid side by side on it, a wig resting nearby; plain wavy lines only.` + NOBODY, []],
  /* 76 */ [`${MAP}: from Hong Kong several dotted arrows fan out to different directions; the one arrow going to Indochina is crossed out with a bold red X; the others glow green.` + NOBODY, []],
  /* 77 */ [`Close-up insert: the deportation document again; a hand with a fountain pen draws one bold red line straight through the small steamship drawing, crossing it out.` + NOBODY.replace("no faces", "only the hand"), []],
  /* 78 */ [`Symbolic still life: on one side a single thin red ink line on white paper, on the other side a small candle flame burning bright and steady in the dark.` + NOBODY, []],
  /* 79 */ [`An ornate London council chamber: five elderly British judges in dark robes sit around a horseshoe table; one of them gently pushes away a big heavy BLANK book, shaking his head; the others nod.`, []],
  // ── Hồi 6
  /* 80 */ [`Night: a black 1930s car with dim headlights drives quietly out through the arched stone gate of Victoria Gaol; a lantern above the gate; the thin Vietnamese man's face visible through the back window.`, ["tong-van-so"]],
  /* 81 */ [`Singapore harbour, January 1933: at the top of a ship's gangway a colonial official in a white suit raises his palm firmly; the thin Vietnamese man in his navy gown stands below him on the gangway with a small bag, calm; palm trees on the quay.`, ["tong-van-so"]],
  /* 82 */ [`Hong Kong quay, 19 January 1933: the British inspector and the young British constable stop the thin Vietnamese man as he steps off a ship's gangway, the inspector holding up one hand; the thin man stays calm.`, ["tong-van-so", "canh-sat-anh", "canh-sat-anh-2"]],
  /* 83 */ [`In ${DESK}: the French officer reads a telegram and rubs his hands together gleefully, grinning, already reaching for his pith helmet.`, ["mat-tham"]],
  /* 84 */ [`The English solicitor with round glasses strides into the Governor's grand office holding a document high in one hand, firm and confident; the Governor in white uniform half-rises from his desk, surprised.`, ["loseby"]],
  /* 85 */ [`Close-up: on the Governor's desk an hourglass with sand running, and the Governor's gloved hand holding up three fingers.` + NOBODY.replace("no faces", "only the gloved hand"), []],
  /* 86 */ [`A cosy 1930s living room at night lit by a table lamp: the English woman with wavy brown hair sews a rich dark blue silk Chinese merchant's robe; the thin Vietnamese man stands nearby trying on a matching silk cap, a small smile; the English solicitor watches from the doorway.`, ["ba-loseby", "tong-van-so", "loseby"]],
  /* 87 */ [`Hong Kong harbour, late afternoon of 22 January 1933: the thin Vietnamese man, now dressed as a wealthy Chinese merchant in a rich dark blue silk robe and a round silk cap, walks up the gangway of a coastal steamship; a young Chinese secretary follows carrying a suitcase.`, ["tong-van-so"]],
  /* 88 */ [`Amoy (Xiamen) harbour at dusk on Lunar New Year's Eve: red lanterns glow along the waterfront, small firecracker sparks, junks with sails; the thin Vietnamese man in the silk merchant robe stands at the ship's railing looking at the town lights, calm and moved.`, ["tong-van-so"]],
  // ── Kết
  /* 89 */ [`In ${DESK}: the wall map with its crossed-out pins; the French officer slumps in his chair holding the empty pair of handcuffs, a big question mark above him.` + TOP, ["mat-tham"]],
  /* 90 */ [`The big grand front door from the stone wall, still wrapped in chains and padlocked, in cold light.` + NOBODY, []],
  /* 91 */ [`The English solicitor with round glasses pulls the small back door wide open into a bright courtroom full of light, the judge and barristers visible inside.`, ["loseby"]],
  /* 92 */ [`Close-up on an official deportation order on a desk: a typed document with blank wavy lines (no readable letters), one line has a small drawing of a steamship next to it; a hand holding a dip pen firmly draws a thick straight ink line across that ship line, crossing it out. Only the hand and sleeve, no faces.`, []],
  /* 93 */ [`Close-up portrait in the interrogation room: the thin Vietnamese man in his navy gown sits silent and calm, mouth closed, steady eyes, his hands resting quietly on the table.`, ["tong-van-so"]],
  /* 94 */ [`In ${DESK}: on the desk lie a thick dossier, a sentence paper with a red seal, a map with pins and a photo of two officials shaking hands; the French officer behind it grasps at empty air with both hands, the chair opposite him empty.`, ["mat-tham"]],
  /* 95 */ [`Hanoi, Lunar New Year 1960, a bright reception room with peach blossom branches in vases: an elderly Vietnamese leader with white hair and a thin white goatee (the same face as the thin man, thirty years older) in a plain khaki tunic warmly shakes hands with an elderly English couple (the solicitor now white-haired with round glasses, his wife) and their grown-up daughter, who hold bouquets of flowers; teacups on a low table.`, ["tong-van-so", "loseby"]],
  /* 96 */ [`Night, a French security police office: on the desk lies an open newspaper with a big black-bordered obituary box (blank wavy lines, no readable letters, no photo); next to it a thick dossier being closed with its strings tied, and a short candle almost burned out, its tiny flame about to go dark; a dark window behind with a flat navy night sky.` + NOBODY, []],
  /* 97 */ [`Misty dawn in the mountains of Cao Bang at the Vietnam-China border, January 1941: a small square stone border marker (BLANK, no carving) stands beside a narrow path, and next to the path a small plain BLANK wooden signboard on a post facing the viewer; the Vietnamese leader, now 51, walks toward it, face clearly visible in three-quarter view, calm and determined. Use the attached black-and-white PHOTO (taken in 1946) as the FACE LIKENESS reference translated into the cartoon style: very thin face, high cheekbones, hollow cheeks, a thin sparse goatee and a thin mustache (dark grey, not white), short hair with a high forehead, bright eyes. He wears simple dark indigo-blue clothes of the Nung ethnic people (a long-sleeved indigo shirt with cloth buttons, indigo trousers), a cloth shoulder bag, a walking stick, cloth shoes; green limestone peaks behind.`, ["tong-van-so"], ["ref-bac-1946.jpg"]],
];

// ── read script lines in order
const lines = [];
for (const l of fs.readFileSync(DIR + "kich-ban.md", "utf8").split("\n")) {
  const m = l.match(/^(\d+b?)\.\s+(.*)$/);
  if (m) lines.push(m[2]);
}
if (lines.length !== S.length) throw new Error(`kịch bản ${lines.length} câu, prompt ${S.length}`);
const tts = fs.readFileSync(DIR + "tts-ngat-nhip.txt", "utf8").trim().split("\n");
if (tts.length !== S.length) throw new Error(`tts ${tts.length} dòng`);

const job = (id, [image, chars, extra = []]) => ({ id, refs: ["ref-style.jpg", ...chars.map(REF), ...extra], prompt: STYLE + (chars.length ? CAST : "") + image + (chars.some((c) => BAC.includes(c)) ? RESPECT : "") + END });
const jobs = [];
const scenes = lines.map((text, i) => {
  let title;
  const m = text.match(/`\[([^\]]+)\]`\s*/);
  if (m) { title = m[1]; text = text.replace(m[0], ""); }
  const narration = text.replace(/\s*[⚠💬⚖️]+/gu, "").trim();
  const [image, chars] = S[i];
  const s = { narration, image };
  if (/^~~/.test(narration)) { s.skip = true; s.narration = narration.replace(/^~~(.*?)~~.*$/, "$1"); } // câu gạch = bỏ (giữ id)
  if (title) s.title = title;
  if (chars.length) s.characters = chars;
  const id = "s" + String(i + 1).padStart(3, "0");
  jobs.push(job(id, S[i]));
  return s;
});

// AI clips (2026-11-22, Omni 1.2 Flash 4 s, 12 clip, người dùng duyệt): prompt videos/v2/omni-prompts.json,
// clip gốc videos/v2/<id>-omni.mp4, bản dùng videos/<id>.mp4. Tốc độ gốc (clipSpeed "original"): câu dài hơn
// clip thì hình cắt sang cảnh sau sớm. s097 bị Flow chặn (chính sách người nổi tiếng) → ảnh tĩnh.
const OMNI = JSON.parse(fs.readFileSync(DIR + "videos/v2/omni-prompts.json", "utf8"));
for (const id of ["s001", "s002", "s003", "s006", "s009", "s010", "s011", "s027", "s046", "s058", "s070", "s088"]) {
  scenes[Number(id.slice(1)) - 1].video = OMNI[id];
  fs.copyFileSync(DIR + `videos/v2/${id}-omni.mp4`, DIR + `videos/${id}.mp4`);
}
// animated maps (src/layers.py, free): s008 route Hong Kong → Hai Phong, s076 X on Indochina + 3 free routes
scenes[0].titleSize = 88; // "HỒNG KÔNG · 6.6.1931" phải nằm trên 1 dòng
scenes[7].layers = "layers/s008.json";
scenes[75].layers = "layers/s076.json";

// camera accents (src/camera.py, mẫu tập 1911)
const Z = (x, y, z, t = 0) => ({ t, x, y, z });
const PUNCH = (x, y, z, shake) => ({ path: [Z(0.5, 0.5, 1), Z(x, y, z, 0.45), Z(x, y, z * 1.03, 1)], ease: "out", ...(shake ? { shake: { at: shake, dur: 0.4, amp: 0.006 } } : {}) });
const TILT = (y0, y1, z = 1.3) => ({ path: [Z(0.5, y0, z), Z(0.5, y1, z, 1)] });
const WHIP = (dir) => ({ whip: { dir, dur: 0.3 }, path: [Z(0.5, 0.5, 1.07), Z(0.5, 0.5, 1, 1)] });
const BLACK = (s) => ({ black: s, path: [Z(0.5, 0.5, 1), Z(0.5, 0.5, 1.06, 1)] });
const SHAKE = { path: [Z(0.5, 0.5, 1.05), Z(0.5, 0.5, 1, 1)], shake: { at: 0.2, dur: 0.5, amp: 0.01 } };
const CAMERA = {
  4: PUNCH(0.33, 0.42, 1.5), 12: PUNCH(0.45, 0.6, 1.35), 14: WHIP("left"), 22: SHAKE, 32: PUNCH(0.5, 0.6, 1.45),
  42: WHIP("right"), 49: PUNCH(0.5, 0.42, 1.5), 55: TILT(0.75, 0.3), 63: { ...PUNCH(0.62, 0.42, 1.3), shake: { at: 0.35, dur: 0.4, amp: 0.008 } },
  68: BLACK(0.4), 73: WHIP("left"), 77: PUNCH(0.45, 0.42, 1.45), 89: WHIP("right"), 96: TILT(0.3, 0.75),
};
for (const [n, c] of Object.entries(CAMERA)) scenes[n - 1].camera = c;

const SLUG = "1931-vu-an-tong-van-so";
const project = {
  title: "1931 – Vụ án Tống Văn Sơ",
  series: "Loạt Bác Hồ – Tập 2",
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
  characters,
  scenes,
};
fs.writeFileSync(DIR + "project.json", JSON.stringify(project, null, 1) + "\n");
fs.writeFileSync(DIR + "flow-jobs.json", JSON.stringify(jobs, null, 1) + "\n");
console.log(`project.json: ${scenes.length} cảnh, ${Object.keys(characters).length} nhân vật; flow-jobs.json: ${jobs.length} job`);
