// =====================================================================
// Period 3, Christmas holidays (run 19 Dec to 4 Jan; after-Christmas ones from 26 Dec): W93 to W106 (4 grandparents, 10 families)
// =====================================================================
spot({ id: 'W93', title: 'Still in pyjamas', slug: 'still-in-pyjamas', dur: 8, run: 'hols', series: 'Screens and phones', music: 5,
  persona: 'Parents 25 to 44, mid-holiday slump', angle: 'Day 3, 2pm, still in pyjamas; a reminder fixes the afternoon', style: 'Phone mockup lock screen with reminders sliding in, then a zoom through the screen into the laser room',
  hook: 'Lock screen at 14:00: "Day 3. Still in pyjamas."',
  meta: { headline: 'Day 3. Still in pyjamas?', primary: primary('Christmas holidays, day 3, 2pm, and everyone is still in pyjamas.', 'Get dressed for the laser room, the sky maze and heat vision, all indoors in Bowthorpe, Norwich.') } },
  phoneFmt, { mode: 'reminder', time: '14:00', date: 'Holidays, day 3', shots: ['laser_room'], reminders: [['Reminder', 'Get dressed?', 0.6], ['Explorazone', 'Lasers at 3? 3rd ticket free', 1.5]], zoomAt: 2.8, cards: [], hook: ['Day 3.', 'Still in _pyjamas._'], mid: ['Get dressed.', '_Lasers at 3._'], end: ['Pyjama day?', '_Lasers instead._'], strip: ['laser_room', 'sky_maze', 'heat', 'infinity_floor', 'roses', 'robot2'] });

spot({ id: 'W94', title: 'Grandparent holiday bingo', slug: 'grandparent-holiday-bingo', dur: 12, run: 'hols', series: 'Games and puzzles', music: 6,
  persona: 'Grandparents 55+ minding grandchildren over the holidays', angle: 'Holiday bingo every grandparent can fill in; the prize is a day out', style: 'Bingo card with dabber marks, FULL HOUSE, then a photo grid',
  hook: 'Bingo card: "Grandparent holiday bingo"',
  meta: { headline: 'Grandparents: holiday bingo', primary: primary('Grandparent holiday bingo: leftovers, "I’m bored", a grey sky and a new toy already broken. Full house?', 'The prize is a day out at Explorazone: robots, the sky maze and a café for the grown-ups, all indoors in Bowthorpe, Norwich.') } },
  bingoFmt, { title: 'HOLIDAY BINGO', cells: ['Leftovers', '"I\'m bored"', 'Grey sky', 'New toy: broken', 'Free square', 'Lost remote', '"What day is it?"', 'Wet coats', 'Board game row'], dabs: [0, 1, 2, 3, 4, 5, 6, 7, 8], dabAt: 1.0, houseAt: 5.6, hook: ['Grandparent', '_holiday bingo._'], mid: ['The prize:', '_a day out._'], cards: ['robots', 'sky_maze2', 'cafe', 'laser_room'], end: ['Full house:', '_Explorazone._'], strip: ['robots', 'sky_maze2', 'cafe', 'laser_room', 'heat', 'roses'] });

spot({ id: 'W95', title: 'Turkey sandwich, day 4', slug: 'turkey-sandwich-day-4', dur: 8, run: 'post', series: 'More concepts', music: 613, ring: true,
  persona: 'Parents 25 to 44, after Christmas', angle: 'Day 4 of turkey sandwiches; today’s special is a day out', style: 'Chalkboard café menu of leftovers with the special written last',
  hook: 'Chalkboard: "Today’s menu: turkey sandwich (day 4)"',
  meta: { headline: 'Turkey sandwich, day 4?', primary: primary('Today’s menu: turkey sandwich, day 4. Again.', 'Today’s special: the sky maze, robot waiters and a proper café, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  chalkFmt, { lines: [["Today's menu", 0.05, 76, '#ffe14d'], ['Turkey sandwich (day 4)', 0.7], ['Turkey curry', 1.3], ['Turkey soup', 1.9], ['SPECIAL: Explorazone', 2.6, 70, '#b6f542']], pics: [['sky_maze', 1.0], ['robot2', 1.8], ['cafe', 2.6]], end: ['Leftovers again?', '_Get out._'], strip: ['sky_maze', 'robot2', 'cafe', 'laser_room', 'heat', 'infinity_floor'] });

spot({ id: 'W96', title: 'POV: new toys, already bored', slug: 'pov-new-toys-bored', dur: 12, run: 'post', series: 'Screens and phones', music: 1089,
  persona: 'Parents 25 to 44, native Reels viewers', angle: 'POV: two days after Christmas and the new toys are already boring', style: 'Handheld punch-in cuts with POV captions over whole photos',
  hook: '"POV: the new toys are already boring."',
  meta: { headline: 'New toys already boring?', primary: primary('POV: two days after Christmas and the new toys are already boring.', 'Lightning in a ball, a maze in the sky and a laser jungle are not. All indoors at Explorazone, Bowthorpe, Norwich.') } },
  povFmt, { seed: 21, segs: [['sandbox2', 'POV: new toys. Already boring.', 0, 'brightness(0.75) saturate(0.6)'], ['plasma', 'lightning in a ball?', 2.2], ['sky_maze2', 'a maze in the sky?', 4.0], ['jungle2', 'a laser jungle?', 5.6], ['robot2', 'not boring.', 7.0]], end: ['Bored of the toys?', '_Not of this._'], strip: ['plasma', 'sky_maze2', 'jungle2', 'robot2', 'sandbox2', 'heat'] });

spot({ id: 'W97', title: 'Operation: Sleepover', slug: 'operation-sleepover', dur: 12, run: 'hols', series: 'Missions', music: 495,
  persona: 'Grandparents 55+ hosting grandchildren in the holidays', angle: 'Top-secret plan for day 2 of the grandchildren’s sleepover', style: 'Typed top-secret dossier with stamps and clipped photos (director favourite format)',
  hook: '"TOP SECRET: Operation Sleepover"',
  meta: { headline: 'Grandparents: Operation Sleepover', primary: primary('Top secret. Operation Sleepover. Agents: Nan and Grandad. Guests: three grandchildren. Problem: day 2, and it is raining.', 'Solution: Explorazone, Bowthorpe, Norwich. Robots, heat vision and the sky maze, all indoors.') } },
  dossierFmt, { lines: [['OPERATION SLEEPOVER', 0.4, 54, '#7a160c'], ['AGENTS: Nan & Grandad', 1.3], ['GUESTS: 3 grandchildren', 2.2], ['PROBLEM: day 2. Raining.', 3.1], ['SOLUTION: 2 tickets', 4.0], ['BONUS: 3rd agent free', 4.8, 44, '#1a34bf']], stamps: [['TOP SECRET', 800, 300, 0.1, 0.1, '#c0271b'], ['MISSION GO', 740, 1090, -0.15, 6.0, '#1f7a3e']], pics: [['robots', 280, 1460, -0.06, 3.4], ['heat', 780, 1500, 0.07, 4.2]], end: ['Sleepover day 2:', '_mission ready._'], strip: ['robots', 'heat', 'sky_maze2', 'laser_room', 'roses', 'cafe'] });

spot({ id: 'W98', title: 'Holiday patience levels', slug: 'holiday-patience-levels', dur: 12, run: 'post', series: 'More concepts', music: 1042, ring: true,
  persona: 'Parents 25 to 44, worn out by day 5', angle: 'A very scientific chart of parent patience over the holidays, rescued on day 6', style: 'Growth-curve chart drawing itself down to 3%, then a zoom through the peak into the photos',
  hook: 'Chart: "Holiday patience: 3%"',
  meta: { headline: 'Holiday patience at 3%?', primary: primary('Holiday patience levels: day 1, full. Day 5, 3%.', 'Day 6: recharged in the laser room, the sky maze and heat vision, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  chartFmt, { title: 'Parent patience', yLabel: 'PATIENCE', xLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'], points: [0.92, 0.7, 0.45, 0.24, 0.05, 0.96], peak: 5, notes: [[3, 'Board game row', '#ef4444'], [4, '3% left', '#ef4444'], [5, 'Explorazone', '#16a34a']], hook: ['Holiday patience:', '_3%._'], mid: ['Recharged', '_in Bowthorpe._'], cards: ['laser_room', 'sky_maze', 'heat'], end: ['Patience at 3%?', '_Recharge here._'], strip: ['laser_room', 'sky_maze', 'heat', 'robot2', 'infinity_floor', 'roses'] });

spot({ id: 'W99', title: 'Search: between Christmas and New Year', slug: 'search-between-christmas-new-year', dur: 12, run: 'post', series: 'Screens and phones', music: 1127, ring: true,
  persona: 'Parents 25 to 44 searching for plans', angle: 'Everyone searches for the in-between days; here is the answer', style: 'Search bar typing with autocomplete, then three photo results',
  hook: 'Search: "things to do in norwich between christmas and new year"',
  meta: { headline: 'Those in-between days, sorted', primary: primary('Things to do in Norwich between Christmas and New Year? Searched it.', 'Found it: the space-time tunnel, the infinity lights and the space zone, all indoors at Explorazone, Bowthorpe.') } },
  searchFmt, { top: '#0f766e', query: 'things to do in norwich between', suggest: ['christmas and new year', 'christmas and new year with kids', 'christmas and new year indoors', 'christmas and new year in the rain'], pick: 1, cards: ['tunnel', 'dodeca', 'astro'], end: ['The in-between days:', '_sorted._'], endKind: 'royal', strip: ['tunnel', 'dodeca', 'astro', 'laser_room', 'heat', 'robot2'] });

spot({ id: 'W100', title: 'Thank you, Grandad', slug: 'thank-you-grandad-scrapbook', dur: 12, run: 'post', series: 'Notebook', music: 513,
  persona: 'Grandparents 55+ who treated the grandchildren', angle: 'A grandchild’s cut-and-stick thank-you page for a day out with Grandad', style: 'Paper-cutout scrapbook: ransom-note letters and torn photos taped on kraft paper, stop-motion timing',
  hook: 'Cut-out letters: "THANK YOU GRANDAD"',
  meta: { headline: 'Thank you, Grandad', primary: primary('Thank you Grandad for the sky maze, the robots, the lasers and the café.', 'Same again? Explorazone, Bowthorpe, Norwich. All indoors, whatever the weather.') } },
  scrapbookFmt, { titleSize: 110, titles: [['THANK YOU', 440, 0.1], ['GRANDAD', 570, 0.8], ['SAME AGAIN?', 1010, 5.4]], pieces: [['sky_maze2', 300, 800, 420, 270, -0.08, 1.6, 'the sky maze!'], ['robots', 780, 820, 380, 250, 0.07, 2.5, 'robots!!'], ['laser_room', 310, 1130, 400, 250, 0.05, 3.4, 'lasers'], ['cafe', 790, 1140, 360, 230, -0.06, 4.3, 'the café']], stickers: [[970, 660, 2.0], [130, 1000, 3.8], [990, 1000, 4.6]], end: ['Thank you,', '_Grandad._'], strip: ['sky_maze2', 'robots', 'laser_room', 'cafe', 'heat', 'roses'] });

spot({ id: 'W101', title: 'Raindrop race, day 5', slug: 'raindrop-race-day-5', dur: 12, run: 'post', series: 'Rain and winter weather', music: 1064, ring: true,
  persona: 'Parents 25 to 44, rainy holiday days', angle: 'Day 5 of the holidays: we are racing raindrops; day 6 should be better', style: 'Raindrops racing down a grey window with name tags, then the photos',
  hook: '"Holidays, day 5: raindrop racing."',
  meta: { headline: 'Day 5: raindrop racing?', primary: primary('Christmas holidays, day 5: the family is racing raindrops down the window.', 'Day 6 could be the heat-vision camera, the light-up floor and the AR sandbox, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  raceFmt, { hook: ['Holidays, day 5:', '_raindrop racing._'], hook2: ['Day 6?', '_Something better._'], racers: [['Me', [[0.8, 0], [1.5, 0.25], [2.0, 0.3], [2.7, 0.72], [3.4, 1]], P.lime], ['Gran', [[0.8, 0], [1.7, 0.18], [2.3, 0.5], [2.9, 0.6], [3.7, 1]], P.cream], ['Dad', [[0.8, 0], [1.4, 0.1], [2.2, 0.36], [3.0, 0.66], [4.0, 1]], P.yellow]], mid: ['Day 6:', '_much better._'], reveal: 'heat', cards: ['heat', 'floor2', 'sandbox'], end: ['Day 6:', '_sorted._'], strip: ['heat', 'floor2', 'sandbox', 'laser_room', 'robot2', 'roses'] });

spot({ id: 'W102', title: 'Holiday camera roll', slug: 'holiday-camera-roll', dur: 12, run: 'hols', series: 'Screens and phones', music: 963,
  persona: 'Parents 25 to 44 who photograph everything', angle: 'The holiday camera roll: the best photos are from the day out', style: 'Phone gallery grid; three photos open full screen with captions',
  hook: 'Gallery: "Holidays · 418 photos"',
  meta: { headline: 'The best photos of the holidays', primary: primary('418 photos from the holidays, and the best ones are all from one day.', 'The sky maze, heat vision and the laser jungle at Explorazone, all indoors in Bowthorpe, Norwich.') } },
  rollFmt, { sub: 'Holidays · 418 photos', grid: ['sky_maze', 'heat', 'jungle2', 'plasma', 'dodeca', 'robots', 'astro', 'crystals', 'light_pillars', 'floor2', 'lava_lamp', 'red_lasers'], open: [['sky_maze', 4.0, 'the sky maze. scary.'], ['heat', 5.7, 'heat vision. lol'], ['jungle2', 7.0, 'laser jungle. again.']], end: ['Best photos', '_of the holidays._'], strip: ['sky_maze', 'heat', 'jungle2', 'plasma', 'dodeca', 'robots'] });

spot({ id: 'W103', title: 'Grandad, Dad and me', slug: 'grandad-dad-and-me-magazine', dur: 12, run: 'hols', series: 'Three generations', music: 31,
  persona: 'Grandparents 55+, three generations out together', angle: 'A magazine cover special on Grandad, Dad and me', style: 'Magazine cover with cover lines popping on, then a zoom through the cover photo into the venue',
  hook: 'Magazine cover: "Grandad, Dad and me: the holiday special"',
  meta: { headline: 'Grandad, Dad and me', primary: primary('The holiday special: Grandad, Dad and me. Who gets through the sky maze first?', 'Three generations, heat vision and robot waiters, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  magazineFmt, { mast: ['FAMILY WEEKLY', '#1a34bf'], mastSize: 84, issue: 'HOLIDAY SPECIAL', photo: 'sky_maze2', tags: [['Grandad v Dad: sky maze', 1.4], ['Who glows hottest?', 1.9], ['Robot waiters!', 2.4], ['3rd ticket FREE', 2.9]], cover: ['Grandad, Dad', '_and me._'], price: 'BUY 2, GET THE 3RD FREE', cards: ['heat', 'robot2'], mid: ['Three generations.', '_One day out._'], end: ['Grandad, Dad', '_and me._'], strip: ['sky_maze2', 'heat', 'robot2', 'laser_room', 'roses', 'cafe'] });

spot({ id: 'W104', title: 'Myth: nothing to do', slug: 'myth-nothing-to-do-holidays', dur: 8, run: 'post', series: 'More concepts', music: 868, ring: true,
  persona: 'Parents 25 to 44, holiday boredom', angle: 'The holidays are not boring if you know where to go', style: 'Myth statement stamped BUSTED, then a 2x2 grid',
  hook: '"Myth: there’s nothing to do till term starts."',
  meta: { headline: 'Nothing to do? Busted.', primary: primary('Myth: there is nothing to do until term starts.', 'Busted: the laser jungle, the AR sandbox, crystals and the light forest, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  mythFmt, { myth: 'Nothing to do till term starts.', hook: ['Myth _buster:_'], mid: ['Holidays:', '_busted._'], cards: ['red_lasers', 'sandbox', 'flags_crystals', 'light_pillars'], end: ['Nothing to do?', '_Busted._'], strip: ['red_lasers', 'sandbox', 'flags_crystals', 'light_pillars', 'heat', 'robot2'] });

spot({ id: 'W105', title: 'Cousins’ chat: six for £72', slug: 'cousins-chat-six', dur: 12, run: 'hols', series: 'Screens and phones', music: 1109,
  persona: 'Parents 25 to 44 organising the cousins', angle: 'The cousins’ chat explodes when someone posts six tickets for £72', style: 'Group chat that floods with replies until it fills the screen, then the photo takes over',
  hook: 'Chat: "Cousins day out this week?"',
  meta: { headline: 'Six cousins? £72.', primary: primary('The cousins’ chat: day out this week? Six of us is £72, so two go free.', 'The sky maze, the laser room and robot waiters, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  chatTakeoverFmt, { title: 'The cousins', members: 'Mum, Auntie Jo, Uncle Sam, Gran', msgs: [
    { who: 'Auntie Jo', text: 'Cousins day out this week?', at: 0.2, col: '#be185d' },
    { who: 'Uncle Sam', text: 'Indoors. It’s grey again', at: 1.0, col: '#047857' },
    { me: true, key: 'sky_maze2', text: '6 of us = £72. 2 go free', at: 1.8 },
  ], flood: ['YES', 'In!', 'Sky maze!!', 'Booking now', 'Lasers?', 'Count us in', 'Gran too?', 'Wednesday?'], floodAt: 3.0, zoomAt: 4.6, photo: 'sky_maze2', cards: ['laser_room', 'robot2'], mid: ['Six of you?', '_£72._'], end: ['Cousins day out:', '_6 for £72._'], strip: ['sky_maze2', 'laser_room', 'robot2', 'heat', 'roses', 'infinity_floor'] });

spot({ id: 'W106', title: 'Holiday diary', slug: 'holiday-diary', dur: 15, run: 'hols', series: 'Notebook', music: 852, ring: true,
  persona: 'Parents 25 to 44 with children aged 6 to 11', angle: 'A child’s holiday diary: rain, rain, then the best day', style: 'Diary page in a child’s handwriting, the best day circled, polaroids',
  hook: 'Diary: "Holiday diary. Monday: rain."',
  meta: { headline: 'The best day of the holidays', primary: primary('Holiday diary. Monday: rain. Tuesday: rain. Wednesday: board games. Thursday: Explorazone, best day ever.', 'Heat vision, the infinity floor and the space-time tunnel, all indoors in Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'diary', end: ['The best day', '_of the holidays._'], endKind: 'navy', accent: P.yellow, strip: ['heat', 'infinity_floor', 'tunnel', 'laser_room', 'robot2', 'roses'], items: [
    { type: 'w', text: 'Holiday diary', x: 180, y: 556, at: 0.1, b: 0.9, fam: KALAM, size: 74, color: INK },
    { type: 'w', text: 'Monday: rain', x: 180, y: 664, at: 1.2, fam: KALAM, size: 60, color: INK },
    { type: 'w', text: 'Tuesday: rain', x: 180, y: 756, at: 2.1, fam: KALAM, size: 60, color: INK },
    { type: 'w', text: 'Wednesday: board games', x: 180, y: 848, at: 3.0, fam: KALAM, size: 60, color: INK },
    { type: 'w', text: 'Thursday: EXPLORAZONE', x: 180, y: 940, at: 4.0, fam: KALAM, size: 62, color: RED },
    { type: 'w', text: 'best day ever!!', x: 180, y: 1032, at: 5.0, fam: KALAM, size: 60, color: INK },
    { type: 'circle', x: 520, y: 920, rx: 420, ry: 72, at: 5.8, d: 0.5 }, { type: 'star', x: 900, y: 1010, r: 34, at: 6.2 },
    { type: 'pol', key: 'heat', x: 250, y: 1400, w: 340, rot: -0.07, label: 'heat vision', at: 6.5, fam: KALAM },
    { type: 'pol', key: 'infinity_floor', x: 570, y: 1460, w: 340, rot: 0.05, label: 'endless floor', at: 7.0, fam: KALAM },
    { type: 'pol', key: 'tunnel', x: 880, y: 1400, w: 340, rot: 0.09, label: 'the tunnel', at: 7.5, fam: KALAM },
  ] });
