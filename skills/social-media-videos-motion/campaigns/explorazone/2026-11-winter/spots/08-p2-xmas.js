// =====================================================================
// Period 2, Christmas run-up (run 30 Nov to 20 Dec): W71 to W92 (7 grandparents, 15 families)
// =====================================================================
function xmasFront(t) {
  vgrad([[0, '#14532d'], [1, '#052e16']]); snow(t, { n: 60, alpha: 0.5 });
  ctx.save(); ctx.strokeStyle = '#e9b949'; ctx.lineWidth = 8; ctx.strokeRect(80, 320, W - 160, 1300); ctx.restore();
  T('Merry', 540, 640, { size: 190, w: 700, fam: SCRIPT, color: '#ffe9a8', shadow: 'rgba(0,0,0,0.3)' });
  T('Christmas', 540, 840, { size: 170, w: 700, fam: SCRIPT, color: '#ffe9a8', shadow: 'rgba(0,0,0,0.3)' });
  [[240, 480], [850, 500], [280, 1000], [820, 1020]].forEach(([x, y], i) => star(x, y, 36 + (i % 2) * 14, '#e9b949', 1, i));
}

spot({ id: 'W71', title: 'My Christmas list', slug: 'my-christmas-list', dur: 12, run: 'xmas', series: 'Notebook', music: 1035, ring: true,
  persona: 'Parents 25 to 44 with children aged 5 to 10', angle: 'A child’s Christmas list where the best thing on it is a day out', style: 'Yellow notepad list in a child’s print, last line circled, polaroids',
  hook: '"My Christmas list: 1. a robot (a real one)"',
  meta: { headline: 'Top of their Christmas list', primary: primary('My Christmas list: 1. a robot (a real one). 2. lasers. 3. a floor that never ends.', 'All three are at Explorazone: robot waiters, the laser room and the infinity floor, indoors in Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'notepad', end: ['Top of their list:', '_a day out._'], endKind: 'red', accent: P.yellow, strip: ['robot2', 'laser_room', 'infinity_floor', 'roses', 'heat', 'sky_maze2'], items: [
    { type: 'w', text: 'My Christmas list', x: 180, y: 430, at: 0.05, b: 0.7, fam: PRINT, size: 80, color: '#b91c1c' },
    { type: 'w', text: '1. a robot (a real one)', x: 180, y: 560, at: 0.7, b: 1.6, fam: PRINT, size: 64 },
    { type: 'w', text: '2. lasers', x: 180, y: 656, at: 1.8, fam: PRINT, size: 64 },
    { type: 'w', text: '3. a floor that never ends', x: 180, y: 752, at: 2.6, fam: PRINT, size: 64 },
    { type: 'w', text: '4. ALL OF THEM = Explorazone', x: 180, y: 880, at: 3.8, fam: PRINT, size: 60, color: RED },
    { type: 'circle', x: 540, y: 860, rx: 440, ry: 80, at: 5.0, d: 0.5 }, { type: 'star', x: 960, y: 760, r: 34, at: 5.4 },
    { type: 'pol', key: 'robot2', x: 250, y: 1400, w: 340, rot: -0.07, label: 'real robot', at: 5.6, fam: PRINT },
    { type: 'pol', key: 'laser_room', x: 570, y: 1460, w: 340, rot: 0.05, label: 'lasers', at: 6.1, fam: PRINT },
    { type: 'pol', key: 'infinity_floor', x: 880, y: 1400, w: 340, rot: 0.09, label: 'the floor', at: 6.6, fam: PRINT },
  ] });

spot({ id: 'W72', title: 'Christmas shopping? Brave.', slug: 'christmas-shopping-brave', dur: 8, run: 'xmas', series: 'Maps and places', music: 87, ring: true,
  persona: 'Parents 25 to 44 dreading town in December', angle: 'Town is rammed with Christmas shoppers; go round it', style: 'Night map with a jammed ring road and a route round to Bowthorpe, then a photo grid',
  hook: 'Map: "Christmas shopping in town? Brave."',
  meta: { headline: 'Christmas shopping? Go round it', primary: primary('Christmas shopping in town with the kids? Brave.', 'Go round it instead: the garden of light, infinity lights, the laser room and robot waiters, all indoors in Bowthorpe, Norwich.') } },
  mapFmt, { seed: 7, hook2At: 1.8, hook: ['Christmas shopping', 'in town? _Brave._'], hook2: ['Or go', '_round it._'], mid: ['Outside the', '_ring road._'], cards: ['roses', 'dodeca', 'laser_room', 'robot2'], end: ['Skip the', '_Christmas crowds._'], strip: ['roses', 'dodeca', 'laser_room', 'robot2', 'heat', 'tunnel'] });

spot({ id: 'W73', title: 'Operation: Christmas Shopping', slug: 'operation-christmas-shopping', dur: 12, run: 'xmas', series: 'Missions', music: 511, ring: true,
  persona: 'Grandparents 55+ helping parents in December', angle: 'Parents shop in town; Nan and Grandad keep the children busy and happy', style: 'Typed top-secret dossier with stamps and clipped photos (director favourite format)',
  hook: '"TOP SECRET: Operation Christmas Shopping"',
  meta: { headline: 'Grandparents: one more mission', primary: primary('Top secret. Operation Christmas Shopping. Parents: in town. Agents Nan and Grandad: keep the children busy all day.', 'Location: Explorazone, Bowthorpe, Norwich. Garden of light, robot waiters, all indoors.') } },
  dossierFmt, { lines: [['OP: CHRISTMAS SHOPPING', 0.4, 54, '#7a160c'], ['PARENTS: in town (brave)', 1.3], ['AGENTS: Nan & Grandad', 2.2], ['MISSION: keep kids busy', 3.1], ['LOCATION: Bowthorpe', 4.0], ['3rd AGENT: free', 4.8, 44, '#1a34bf']], stamps: [['TOP SECRET', 800, 300, 0.1, 0.1, '#c0271b'], ['ACCEPTED', 760, 1090, -0.15, 6.0, '#1f7a3e']], pics: [['roses', 280, 1460, -0.06, 3.4], ['robot2', 780, 1500, 0.07, 4.2]], end: ['Grandparents:', '_mission accepted._'], strip: ['roses', 'robot2', 'heat', 'laser_room', 'dodeca', 'telephones'] });

spot({ id: 'W74', title: 'In my day: letters to Santa', slug: 'in-my-day-letters-to-santa', dur: 15, run: 'xmas', series: 'In my day', music: 1022,
  persona: 'Grandparents 55+, nostalgic at Christmas', angle: 'Christmas then and now: show the grandchildren both', style: 'Sepia film strip over the typewriters, telephones and cameras, bursting into colour (director favourite format)',
  hook: '"In my day, Santa got a letter." on sepia film',
  meta: { headline: 'In my day, Santa got a letter', primary: primary('In my day, Santa got a typed letter and phone calls cost a fortune.', 'Show the grandchildren the typewriters, rotary phones and old cameras at Explorazone, then the garden of light and robot waiters. All indoors in Bowthorpe, Norwich.') } },
  filmFmt, { segs: [['typewriters', ['In my day,', 'Santa got _a letter._'], 0, true], ['telephones', ['Calls cost', '_a fortune._'], 2.3, true], ['cameras', ['Photos took', '_a week._'], 4.3, true], ['roses', ['Now?', '_A garden of light._'], 6.3, false], ['robot2', ['And _robot waiters._'], 8.0, false], ['radios', ['Show them', '_both._'], 9.7, true]], end: ['Christmas then...', '_and now._'], strip: ['typewriters', 'telephones', 'cameras', 'roses', 'robot2', 'radios'] });

spot({ id: 'W75', title: 'Stuck for a present?', slug: 'stuck-for-a-present', dur: 12, run: 'xmas', series: 'Christmas', music: 897, ring: true,
  persona: 'Parents 25 to 44 buying for the family', angle: 'Stuck for a present? Make it a day out together over the holidays', style: 'A present shakes, the lid flies off and polaroids burst out',
  hook: '"Stuck for a present?" over a shaking box',
  meta: { headline: 'Stuck for a present?', primary: primary('Stuck for a family present? Make it a day out together over the holidays.', 'The laser room, the infinity floor, the plasma ball and the sky maze, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  giftFmt, { hook: ['Stuck for', '_a present?_'], hook2: ['Give them', '_a day out._'], pops: [['laser_room', 260, 760, -0.12, 'lasers!'], ['infinity_floor', 820, 740, 0.1, 'the floor'], ['plasma', 250, 1480, 0.08, 'plasma ball'], ['sky_maze2', 830, 1500, -0.08, 'sky maze']], end: ['Stuck for a present?', '_A day out._'], strip: ['laser_room', 'infinity_floor', 'plasma', 'sky_maze2', 'heat', 'roses'] });

spot({ id: 'W76', title: 'Christmas jumper: itchy', slug: 'christmas-jumper-itchy', dur: 8, run: 'xmas', series: 'Christmas', music: 1004,
  persona: 'Parents 25 to 44, December weekends', angle: 'The jumper is itchy; the laser jungle is not', style: 'Knitted Christmas jumper pattern with stitched photo patches',
  hook: '"Christmas jumper: itchy." on a knitted background',
  meta: { headline: 'Itchy jumper? Lasers next.', primary: primary('Christmas jumper: itchy. Laser jungle: not itchy.', 'The laser jungle and the sky maze in red light, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  knitFmt, { hook: ['Christmas jumper:', '_itchy._'], hook2: ['Laser jungle:', '_not itchy._'], patches: [['jungle2', 70, 740, 560, 440, -0.05], ['red_lasers', 500, 820, 520, 400, 0.06]], end: ['Itchy jumper?', '_Lasers next._'], strip: ['jungle2', 'red_lasers', 'laser_room', 'heat', 'robot2', 'roses'] });

spot({ id: 'W77', title: 'Christmas food-shop receipt', slug: 'christmas-food-receipt', dur: 12, run: 'xmas', series: 'Christmas', music: 902, ring: true,
  persona: 'Parents 25 to 44 doing the big Christmas shop', angle: 'Sprouts nobody eats cost money; the 3rd ticket does not', style: 'A till receipt prints; "Ticket 3 £0.00" is circled',
  hook: 'Receipt: "Sprouts (nobody eats them) £1.20"',
  meta: { headline: 'The best line on the receipt', primary: primary('Christmas food shop: sprouts nobody eats, pigs in blankets, crackers. One line costs nothing: the 3rd ticket.', 'Molecule building in the science lab and rocks and crystals, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  receiptFmt, { hook: ['The Christmas', '_food shop._'], mid: ['Best line:', '_£0.00._'], lines: [['FOOD SHOP', '', 0.2], ['Sprouts (nobody eats)', '£1.20', 0.5], ['Pigs in blankets x4', '£12.00', 0.9], ['Crackers', '£8.00', 1.3], ['Mince pies', '£2.50', 1.7], ['- - - - - - - - - - - - -', '', 2.1], ['EXPLORAZONE', '', 2.4], ['Ticket 1', '£18.00', 2.8], ['Ticket 2', '£18.00', 3.2], ['Ticket 3', '£0.00', 3.6, true], ['3 TICKETS', '£36.00', 4.2]], circle: [9, 4.6], cards: ['test_tubes', 'crystals'], end: ['The best line', '_on the receipt._'], strip: ['test_tubes', 'crystals', 'laser_room', 'roses', 'infinity_floor', 'robot2'] });

spot({ id: 'W78', title: 'Nan’s snow globe', slug: 'nans-snow-globe', dur: 12, run: 'xmas', series: 'Christmas', music: 985,
  persona: 'Three generations, Christmas run-up', angle: 'Nan’s snow globe shows the day out she has planned', style: 'A snow globe shakes; the room inside changes each time',
  hook: '"Nan’s snow globe" shaking',
  meta: { headline: 'Nan has a plan this Christmas', primary: primary('Nan’s snow globe, shaken: a garden of light, a forest of light, heat vision.', 'A day out for Nan, Mum and the children, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  globeFmt, { shakes: [0.2, 2.9, 5.6], scenes: ['found_room', 'light_pillars', 'heat'], hooks: [[0.1, ['Nan’s', '_snow globe._']], [2.8, ['Shake it,', '_find a day out._']], [5.5, ['All of us,', '_one day._']]], end: ['Nan has', '_a plan._'], strip: ['found_room', 'light_pillars', 'heat', 'roses', 'laser_room', 'robot2'] });

spot({ id: 'W79', title: 'Cracker joke 2', slug: 'cracker-joke-2', dur: 8, run: 'xmas', series: 'Christmas', music: 907,
  persona: 'Friends and family groups of six', angle: 'Christmas maths for bigger families: six for £72', style: 'A Christmas cracker snaps, the paper joke unfolds',
  hook: 'A cracker snaps: "Cracker joke number two:"',
  meta: { headline: 'Six of you? £72.', primary: primary('Cracker joke number two. What do you call 6 tickets for £72? A family Christmas.', 'Robot waiters and the sky maze, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  crackerFmt, { hook: ['Cracker joke', '_number two:_'], q: 'Q: What do you call 6 tickets for £72?', a: 'A: A family Christmas.', answerAt: 2.6, cards: ['robot2', 'sky_maze2'], end: ['Six of you?', '_£72._'], strip: ['robot2', 'sky_maze2', 'laser_room', 'roses', 'heat', 'infinity_floor'] });

spot({ id: 'W80', title: 'The nice list', slug: 'the-nice-list', dur: 12, run: 'xmas', series: 'Notebook', music: 533, ring: true,
  persona: 'Parents 25 to 44 with children aged 5 to 10', angle: 'Made the nice list? The treat is a day out', style: 'Candy-stripe paper list with ticks and a circled treat, then polaroids',
  hook: '"The NICE list" with ticks going down',
  meta: { headline: 'Nice list? Treat sorted.', primary: primary('The nice list: homework done, sweets shared, kind to my sister (mostly).', 'The treat: heat vision, the AR sandbox and robot waiters at Explorazone, all indoors in Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'santa', end: ['Made the nice list?', '_Treat sorted._'], endKind: 'red', accent: P.yellow, strip: ['heat', 'sandbox', 'robots', 'laser_room', 'roses', 'infinity_floor'], items: [
    { type: 'w', text: 'The NICE list', x: 150, y: 450, at: 0.05, b: 0.7, fam: PRINT, size: 84, color: RED },
    { type: 'w', text: 'Did my homework', x: 150, y: 570, at: 0.8, b: 1.4, fam: PRINT, size: 64 }, { type: 'tick', x: 900, y: 545, s: 56, at: 1.5 },
    { type: 'w', text: 'Shared my sweets', x: 150, y: 670, at: 1.7, fam: PRINT, size: 64 }, { type: 'tick', x: 900, y: 645, s: 56, at: 2.5 },
    { type: 'w', text: 'Kind to my sister', x: 150, y: 770, at: 2.7, fam: PRINT, size: 64 }, { type: 'w', text: '(mostly)', x: 700, y: 840, at: 3.5, fam: PRINT, size: 48, color: PENCIL }, { type: 'tick', x: 900, y: 745, s: 56, at: 3.8 },
    { type: 'w', text: 'Treat: Explorazone!', x: 150, y: 960, at: 4.1, fam: PRINT, size: 70, color: RED },
    { type: 'circle', x: 470, y: 940, rx: 360, ry: 75, at: 5.0, d: 0.5 },
    { type: 'pol', key: 'heat', x: 240, y: 1450, w: 330, rot: -0.07, label: 'heat vision', at: 5.4, fam: PRINT },
    { type: 'pol', key: 'sandbox', x: 560, y: 1510, w: 330, rot: 0.05, label: 'sandbox', at: 5.9, fam: PRINT },
    { type: 'pol', key: 'robots', x: 870, y: 1450, w: 330, rot: 0.09, label: 'robots', at: 6.4, fam: PRINT },
  ] });

spot({ id: 'W81', title: 'Six for £72', slug: 'six-for-72', dur: 8, run: 'xmas', series: 'More concepts', music: 303,
  persona: 'Friends and family groups of six', angle: 'A Christmas get-together for six: £72', style: 'Giant £72 filled with the garden of light, price chips, two photo cards',
  hook: 'Giant "£72" filled with the garden of light',
  meta: { headline: 'Six of you? £72.', primary: primary('Christmas get-together for six? £72 gets you all in.', 'The garden of light and the laser room, all indoors at Explorazone, Bowthorpe, Norwich. Up to nine per group.') } },
  bigNumFmt, { num: '£72', fillKey: 'roses', beats: [[['Six of you?'], 0.1, 0.9], [['Christmas get-together:', '_£72._'], 0.9, 3.0]], chips: ['6 for £72', '9 for £108'], mid: ['Six of you.', '_Sorted._'], cards: ['roses', 'laser_room'], end: ['Six of you?', '_£72._'], strip: ['roses', 'laser_room', 'robot2', 'heat', 'infinity_floor', 'dodeca'] });

spot({ id: 'W82', title: 'Grandparents’ Christmas card', slug: 'grandparents-christmas-card', dur: 15, run: 'xmas', series: 'Notebook', music: 926,
  persona: 'Grandparents 55+ choosing Christmas presents', angle: 'The card says it: this year’s present is a day out with Nan and Grandad', style: 'Green and gold "Merry Christmas" card opens to a handwritten message with photo corners',
  hook: '"Merry Christmas from Nan & Grandad" card opening',
  meta: { headline: 'This year’s present: a day out', primary: primary('To our grandchildren: this year’s present is a day out with us.', 'Lasers, robot waiters and Nan on the sky maze, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'card', zoom: 1.05, flip: 2.2, front: xmasFront, end: ['This year’s present:', '_a day out._'], endKind: 'green', accent: P.yellow, strip: ['sky_maze2', 'robot2', 'laser_room', 'roses', 'heat', 'infinity_floor'],
    over: (t) => { if (t < 2.2) hook(['From', '_Nan & Grandad..._'], 1080, 92, 0.3, t, { hl: '#ffe9a8' }); }, items: [
    { type: 'w', text: 'To our grandchildren,', x: 140, y: 440, at: 2.9, b: 3.7, fam: SCRIPT, size: 66, color: '#14532d' },
    { type: 'w', text: "This year's present", x: 140, y: 550, at: 3.8, fam: SCRIPT, size: 64, color: INK },
    { type: 'w', text: 'is a day out with us.', x: 140, y: 646, at: 4.8, fam: SCRIPT, size: 64, color: INK },
    { type: 'w', text: 'Lasers, robots,', x: 140, y: 742, at: 5.8, fam: SCRIPT, size: 64, color: INK },
    { type: 'w', text: 'and Nan on the sky maze.', x: 140, y: 838, at: 6.7, fam: SCRIPT, size: 64, color: RED },
    { type: 'w', text: 'Love, Nan & Grandad xx', x: 300, y: 960, at: 7.9, fam: SCRIPT, size: 64, color: INK },
    { type: 'heart', x: 940, y: 940, s: 38, at: 8.8 },
    { type: 'corners', key: 'sky_maze2', x: 310, y: 1440, w: 390, rot: -0.06, at: 9.0 },
    { type: 'corners', key: 'robot2', x: 770, y: 1470, w: 390, rot: 0.06, at: 9.5 },
  ] });

spot({ id: 'W83', title: 'POV: last day of term', slug: 'pov-last-day-of-term', dur: 12, run: 'xmas', series: 'Screens and phones', music: 1048, ring: true,
  persona: 'Parents 25 to 44, end of the autumn term', angle: 'POV: the holidays start with lasers', style: 'Handheld punch-in cuts with POV captions over whole photos',
  hook: '"POV: it’s the last day of term"',
  meta: { headline: 'POV: holidays start here', primary: primary('POV: it is the last day of term and the first day of the holidays is already planned.', 'The laser room, infinity lights, heat vision and robot waiters, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  povFmt, { seed: 21, segs: [['red_lasers', "POV: it's the last day of term", 0, 'brightness(0.8)'], ['laser_room', 'holidays start with lasers', 2.2], ['dodeca', 'infinity lights: done', 4.0], ['heat', 'heat vision: obsessed', 5.6], ['robot2', 'the robots said hi', 7.0]], end: ['Holidays', '_start here._'], strip: ['red_lasers', 'laser_room', 'dodeca', 'heat', 'robot2', 'roses'] });

spot({ id: 'W84', title: 'Search: Christmas holidays', slug: 'search-christmas-holidays', dur: 12, run: 'xmas', series: 'Screens and phones', music: 743, ring: true,
  persona: 'Parents 25 to 44 planning the Christmas holidays', angle: 'The search for Christmas holiday ideas lands on Explorazone', style: 'Search bar typing with autocomplete in green, then a result card',
  hook: 'Typing: "christmas holiday ideas"',
  meta: { headline: 'Christmas holiday ideas?', primary: primary('Christmas holiday ideas in Norfolk, indoors, for kids. Done.', 'Robot waiters, the plasma ball and the light-up floor, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  searchFmt, { top: '#15803d', query: 'christmas holiday ideas', suggest: ['norwich', 'norfolk indoors', 'for kids', 'when it rains'], pick: 1, cards: ['robot2', 'plasma', 'floor2'], end: ['Holiday ideas?', '_Found one._'], endKind: 'green', strip: ['robot2', 'plasma', 'floor2', 'laser_room', 'roses', 'heat'] });

spot({ id: 'W85', title: 'Dear Santa, from Grandad', slug: 'dear-santa-from-grandad', dur: 15, run: 'xmas', series: 'Notebook', music: 909,
  persona: 'Grandparents 55+ at Christmas', angle: 'Grandad writes to Santa: a day out with the grandchildren, and a sit-down after', style: 'Candy-stripe letter to Santa in Grandad’s joined-up writing, with photo corners',
  hook: '"Dear Santa, all I want this year..." in Grandad’s hand',
  meta: { headline: 'What Grandad wants this year', primary: primary('Dear Santa, all I want this year is a day out with the grandchildren. And a sit-down in the café after.', 'Lasers, robot waiters and a café for the grown-ups, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'santa', end: ['What Grandad', '_wants this year._'], endKind: 'red', accent: P.yellow, strip: ['cafe', 'laser_room', 'robots', 'roses', 'heat', 'telephones'], items: [
    { type: 'w', text: 'Dear Santa,', x: 150, y: 450, at: 0.1, b: 0.8, fam: SCRIPT, size: 80, color: RED },
    { type: 'w', text: 'All I want this year', x: 150, y: 560, at: 0.9, b: 1.7, fam: SCRIPT, size: 66, color: INK },
    { type: 'w', text: 'is a day out with', x: 150, y: 660, at: 1.9, fam: SCRIPT, size: 66, color: INK },
    { type: 'w', text: 'the grandchildren.', x: 150, y: 760, at: 2.9, fam: SCRIPT, size: 66, color: INK },
    { type: 'w', text: '(And a sit-down in', x: 150, y: 860, at: 4.0, fam: SCRIPT, size: 60, color: PENCIL },
    { type: 'w', text: 'the café after.)', x: 150, y: 950, at: 4.9, fam: SCRIPT, size: 60, color: PENCIL },
    { type: 'w', text: 'Grandad', x: 620, y: 1070, at: 6.0, fam: SCRIPT, size: 70, color: RED },
    { type: 'corners', key: 'cafe', x: 310, y: 1440, w: 390, rot: -0.06, at: 6.8 },
    { type: 'corners', key: 'laser_room', x: 770, y: 1470, w: 390, rot: 0.06, at: 7.3 },
  ] });

spot({ id: 'W86', title: 'The neighbours’ lights', slug: 'the-neighbours-lights', dur: 12, run: 'xmas', series: 'Rain and winter weather', music: 537, ring: true,
  persona: 'Parents 25 to 44, Christmas run-up', angle: 'The house down the road has thousands of lights; we have a whole garden of them', style: 'A droopy string of bulbs, then the garden of light with bokeh',
  hook: '"The house down the road: 10,000 lights."',
  meta: { headline: 'Want lights? A whole garden', primary: primary('The house down the road: thousands of lights. Ours: half a string.', 'Want proper lights? The garden of light, infinity lights and the light forest, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  fairyFmt, { hook: ['The house down the road:', '_10,000 lights._'], hook2: ['Ours?', '_Half a string._'], mid: ['Want lights?', '_A whole garden._'], cards: ['found_room', 'dodeca', 'light_pillars'], end: ['Want lights?', '_Come here._'], strip: ['found_room', 'dodeca', 'light_pillars', 'roses', 'infinity_floor', 'tunnel'] });

spot({ id: 'W87', title: 'Dark before 4', slug: 'dark-before-4', dur: 8, run: 'xmas', series: 'Rain and winter weather', music: 502, ring: true,
  persona: 'Parents 25 to 44, shortest days', angle: 'The shortest days of the year; the brightest plan', style: 'Sunset time-lapse with a ticking clock, rooms switching on',
  hook: '"Dark before 4pm." with the clock ticking',
  meta: { headline: 'Shortest days, brightest plan', primary: primary('The shortest days of the year: dark before 4pm.', 'The brightest plan: the space-time tunnel and infinity lights, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  duskFmt, { hook: ['Dark', 'before _4pm._'], hook2: ['Shortest days.', '_Brightest plan._'], mid: ['Lights on.', '_All day._'], cards: ['tunnel', 'dodeca'], end: ['Shortest days?', '_Bright in here._'], strip: ['tunnel', 'dodeca', 'roses', 'light_pillars', 'laser_room', 'infinity_floor'] });

spot({ id: 'W88', title: 'Then and now: Christmas', slug: 'then-and-now-christmas', dur: 12, run: 'xmas', series: 'Then and now', music: 509,
  persona: 'Grandparents 55+ and their grandchildren at Christmas', angle: 'Christmas then: a new radio. Christmas now: a garden of light', style: 'Sepia old-tech photo wiped into a full-colour room, with year tags',
  hook: '"Christmas then: a new radio." in sepia',
  meta: { headline: 'Christmas then, Christmas now', primary: primary('Christmas then: a new radio and a camera with film. Christmas now: a garden of light and robot waiters.', 'Share both with the grandchildren at Explorazone, all indoors in Bowthorpe, Norwich.') } },
  thenNowFmt, { pairs: [['radios', 'THEN', 'roses', 'NOW', ['Christmas then:', '_a new radio._'], ['Christmas now:', '_a garden of light._']], ['cameras', 'THEN', 'robot2', 'NOW', ['Then:', '_a camera with film._'], ['Now:', '_robot waiters._']]], end: ['Christmas then...', '_and now._'], strip: ['radios', 'roses', 'cameras', 'robot2', 'laser_room', 'heat'] });

spot({ id: 'W89', title: 'Tickets in a stocking', slug: 'tickets-in-a-stocking', dur: 12, run: 'xmas', series: 'Christmas', music: 512,
  persona: 'Parents 25 to 44, families of three or more', angle: 'Three tickets, one stocking, the third one free', style: 'Three tickets tumble in through falling snow; the third flips to FREE',
  hook: 'Tickets fly in: "Three tickets. One stocking."',
  meta: { headline: 'Three tickets, one free', primary: primary('Three tickets, one stocking. The third one is free.', 'Heat vision, the infinity floor and the sky maze, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  snowTicketsFmt, { hook: ['Three tickets.', '_One stocking._'], hook2: ['The third?', '_Free._'], mid: ['Holiday plan:', '_sorted._'], cards: ['heat', 'infinity_floor', 'sky_maze'], end: ['Three tickets.', '_One free._'], strip: ['heat', 'infinity_floor', 'sky_maze', 'laser_room', 'robot2', 'roses'] });

spot({ id: 'W90', title: 'Town is gridlocked', slug: 'town-is-gridlocked', dur: 12, run: 'xmas', series: 'Rain and winter weather', music: 1131, ring: true,
  persona: 'Grandparents 55+ driving the grandchildren in December', angle: 'Town is gridlocked; turn round and head to Bowthorpe', style: 'Rainy windscreen from the driver’s seat; each wiper pass reveals a room',
  hook: '"Wipers on. Town is gridlocked."',
  meta: { headline: 'Gridlocked? Turn round.', primary: primary('Wipers on, grandchildren in the back, and town is gridlocked.', 'Turn round: robot waiters, the old telephones and the garden of light, all indoors at Explorazone, Bowthorpe, outside the ring road.') } },
  wipersFmt, { hook: ['Wipers on.', 'Town is _gridlocked._'], mid: ['U-turn.', '_Bowthorpe._'], wipes: [[3.0, 'robots'], [4.8, 'telephones'], [6.6, 'roses']], end: ['Gridlocked?', '_Turn round._'], strip: ['robots', 'telephones', 'roses', 'heat', 'laser_room', 'sky_maze2'] });

spot({ id: 'W91', title: 'True or false: Christmas', slug: 'true-or-false-christmas', dur: 12, run: 'xmas', series: 'Games and puzzles', music: 506,
  persona: 'Families with children aged 6 to 11', angle: 'A Christmas quiz that proves science is not only for school', style: 'Swipe quiz cards with answer stamps and photos',
  hook: 'Quiz: "True or false: robots can be waiters."',
  meta: { headline: 'True or false: robot waiters', primary: primary('True or false: robots can be waiters. True. Lights can grow in a garden. True. Science is only for school. False.', 'All indoors at Explorazone, Bowthorpe, Norwich.') } },
  quizFmt, { hook: ['Christmas', '_quiz._'], qs: [['Robots can be waiters.', 'TRUE', 'robot2'], ['Lights can grow in a garden.', 'TRUE', 'roses'], ['Science is only for school.', 'FALSE', 'lab3']], end: ['Quiz done.', '_Day out next._'], strip: ['robot2', 'roses', 'lab3', 'laser_room', 'heat', 'infinity_floor'] });

spot({ id: 'W92', title: 'Holiday plan on the fridge', slug: 'holiday-plan-fridge', dur: 8, run: 'xmas', series: 'Notebook', music: 505, ring: true,
  persona: 'Parents 25 to 44, Christmas holiday planners', angle: 'Day 1 of the holidays is already on the fridge', style: 'Sticky notes and magnet photos on a fridge door',
  hook: 'Sticky note: "HOLIDAYS: DAY 1?"',
  meta: { headline: 'Holidays day 1: sorted', primary: primary('Christmas holidays, day 1: sorted before term even ends.', 'The laser room, the space zone and the light-up floor, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'fridge', zoom: 1.05, end: ['Holidays day 1:', '_sorted._'], endKind: 'red', accent: P.yellow, strip: ['laser_room', 'astro', 'floor2', 'heat', 'roses', 'robot2'], items: [
    { type: 'sticky', x: 330, y: 560, rot: -0.05, color: '#ffe873', at: 0.05, d: 0.3 },
    { type: 'w', text: 'HOLIDAYS', x: 170, y: 560, at: 0.15, b: 0.6, fam: '"Permanent Marker", cursive', size: 62, color: '#b91c1c', w: 400 },
    { type: 'w', text: 'Day 1: ???', x: 170, y: 650, at: 0.6, b: 1.1, fam: KALAM, size: 58, color: '#222' },
    { type: 'sticky', x: 760, y: 700, rot: 0.07, color: '#bbf7d0', w: 380, h: 300, at: 1.2, d: 0.3 },
    { type: 'w', text: 'Day 2: leftovers', x: 590, y: 720, at: 1.4, b: 2.0, fam: KALAM, size: 50, color: '#222' },
    { type: 'strike', x: 160, y: 630, w: 280, at: 2.1 },
    { type: 'w', text: 'Explorazone!', x: 180, y: 730, at: 2.3, b: 2.9, fam: KALAM, size: 58, color: RED },
    { type: 'magnet', key: 'laser_room', x: 300, y: 1000, w: 420, h: 300, rot: -0.05, at: 2.8, label: true },
    { type: 'magnet', key: 'astro', x: 780, y: 1080, w: 400, h: 290, rot: 0.06, at: 3.2, mag: '#1a34bf', label: true },
    { type: 'magnet', key: 'floor2', x: 520, y: 1460, w: 520, h: 360, rot: 0.02, at: 3.6, mag: '#00a884' },
  ] });
