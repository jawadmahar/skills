// =====================================================================
// Period 4, New Year and back to school (run 1 to 10 Jan): W107 to W118 (4 grandparents, 8 families)
// =====================================================================
spot({ id: 'W107', title: '3, 2, 1: new year plan', slug: 'countdown-new-year-plan', dur: 8, run: 'jan', series: 'More concepts', music: 927,
  persona: 'Parents 25 to 44 starting the year', angle: 'Count down to the first plan of the new year', style: 'Split-flap board flipping 3, 2, 1, then a photo grid',
  hook: 'Split-flap board: "3, 2, 1"',
  meta: { headline: 'First plan of the new year', primary: primary('3, 2, 1: the first family plan of the new year.', 'The infinity floor, the space-time tunnel and the laser room, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  flapFmt, { nums: ['3', '2', '1'], label: 'FIRST PLAN OF THE YEAR', hook: ['New year.', '_First plan._'], mid: ['New year:', '_sorted._'], cards: ['infinity_floor', 'tunnel', 'laser_room', 'plasma'], end: ['First plan', '_of the year._'], strip: ['infinity_floor', 'tunnel', 'laser_room', 'plasma', 'heat', 'robot2'] });

spot({ id: 'W108', title: 'Resolution: try something new', slug: 'resolution-try-something-new', dur: 12, run: 'jan', series: 'Notebook', music: 1000, ring: true,
  persona: 'Parents 25 to 44 making resolutions', angle: 'The one New Year’s resolution the whole family will keep', style: 'Checklist ticking off resolutions; the last one opens into the photos with a zoom-through cut',
  hook: 'Checklist: "New Year’s resolutions"',
  meta: { headline: 'The resolution you’ll keep', primary: primary('New Year’s resolutions: drink more water, less screen time, read more. And try something new.', 'Try a maze in the sky, heat vision and robot waiters, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  checklistFmt, { title: 'New Year’s resolutions', items: [['Drink more water', 0.6], ['Less screen time', 1.3], ['Read more books', 2.0], ['Try something new', 2.8, 'sky_maze2']], zoomAt: 4.4, hook: ['The one', '_we’ll keep._'], mid: ['Something new:', '_ticked._'], cards: ['heat', 'robot2'], end: ['The resolution', '_you’ll keep._'], strip: ['sky_maze2', 'heat', 'robot2', 'laser_room', 'roses', 'infinity_floor'] });

spot({ id: 'W109', title: 'Operation: New Year', slug: 'operation-new-year', dur: 12, run: 'jan', series: 'Missions', music: 395,
  persona: 'Grandparents 55+ starting the year with the grandchildren', angle: 'Mission: show the grandchildren something new this year', style: 'Typed top-secret dossier with stamps and clipped photos (director favourite format)',
  hook: '"TOP SECRET: Operation New Year"',
  meta: { headline: 'Grandparents: Operation New Year', primary: primary('Top secret. Operation New Year. Agents: Nan and Grandad. Objective: show the grandchildren something new.', 'Location: Explorazone, Bowthorpe, Norwich. Plasma lightning, crystals and the laser jungle, all indoors.') } },
  dossierFmt, { lines: [['OPERATION NEW YEAR', 0.4, 54, '#7a160c'], ['AGENTS: Nan & Grandad', 1.3], ['TARGET: a grey Saturday', 2.2], ['OBJECTIVE: something new', 3.1], ['EQUIPMENT: 2 tickets', 4.0], ['BONUS: 3rd agent free', 4.8, 44, '#1a34bf']], stamps: [['TOP SECRET', 800, 300, 0.1, 0.1, '#c0271b'], ['APPROVED', 760, 1090, -0.15, 6.0, '#1f7a3e']], pics: [['plasma', 280, 1460, -0.06, 3.4], ['crystals', 780, 1500, 0.07, 4.2]], end: ['New year:', '_mission ready._'], strip: ['plasma', 'crystals', 'jungle2', 'robot2', 'heat', 'roses'] });

spot({ id: 'W110', title: 'School run in the dark', slug: 'school-run-dark', dur: 12, run: 'jan', series: 'Rain and winter weather', music: 853, ring: true,
  persona: 'Parents 25 to 44, back-to-school week', angle: 'Back to the school run in the dark and drizzle; Saturday can be bright', style: 'Rainy windscreen with wipers; each wipe reveals a bright room',
  hook: 'Wipers on: "School run. Pitch dark."',
  meta: { headline: 'Dark school run? Bright Saturday', primary: primary('Back to the school run: pitch dark, drizzle, wipers on full.', 'Saturday can be brighter: the light forest, the space-time tunnel and the infinity floor, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  wipersFmt, { hook: ['School run.', '_Pitch dark._'], mid: ['Saturday?', '_Lights on._'], wipes: [[3.0, 'light_pillars'], [4.8, 'tunnel'], [6.6, 'infinity_floor']], end: ['Dark mornings?', '_Bright Saturdays._'], strip: ['light_pillars', 'tunnel', 'infinity_floor', 'roses', 'laser_room', 'dodeca'] });

spot({ id: 'W111', title: 'In my day: cameras', slug: 'in-my-day-cameras', dur: 15, run: 'jan', series: 'In my day', music: 716,
  persona: 'Grandparents 55+, nostalgic', angle: 'Film cameras, 24 shots and a week to develop; now there is a camera that sees heat', style: 'Sepia film strip over the retro cameras, bursting into colour (director favourite format)',
  hook: '"In my day, 24 photos lasted all year." on sepia film',
  meta: { headline: 'In my day: 24 photos a year', primary: primary('In my day, a roll of film was 24 photos, and you waited a week to see them.', 'Show the grandchildren the old cameras at Explorazone, then the camera that sees heat and the laser room. All indoors in Bowthorpe, Norwich.') } },
  filmFmt, { segs: [['cameras', ['In my day,', '_24 photos_ a year.'], 0, true], ['typewriters', ['A week', 'to _develop._'], 2.3, true], ['radios', ['And the radio', 'was _the telly._'], 4.3, true], ['heat', ['Now? A camera', 'that _sees heat._'], 6.3, false], ['laser_room', ['And a room', 'of _lasers._'], 8.0, false], ['telephones', ['Show them', '_both._'], 9.7, true]], end: ['In my day...', '_and theirs._'], strip: ['cameras', 'typewriters', 'radios', 'heat', 'laser_room', 'telephones'] });

spot({ id: 'W112', title: 'January screen time', slug: 'january-screen-time', dur: 8, run: 'jan', series: 'Screens and phones', music: 764,
  persona: 'Parents 25 to 44 cutting screen time', angle: 'The weekly screen-time report lands; swap it for hands-on time', style: 'Screen-time report counting up, then hands-on photos',
  hook: '"January screen time. Ouch."',
  meta: { headline: 'Swap screen time for hands-on', primary: primary('The first screen-time report of the year has landed. Ouch.', 'Swap it for hands-on time: crystals, microscopes and the AR sandbox, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  screenTimeFmt, { hook: [''], hook2: ['January screen time. _Ouch._'], cards: ['crystals', 'microscope', 'sandbox2'], end: ['Less screen,', '_more science._'], strip: ['crystals', 'microscope', 'sandbox2', 'lab3', 'laser_room', 'heat'] });

spot({ id: 'W113', title: 'Scrolling for weekend ideas', slug: 'scrolling-weekend-ideas', dur: 12, run: 'jan', series: 'Screens and phones', music: 1138, ring: true,
  persona: 'Parents 25 to 44 planning January weekends', angle: 'Scrolling for weekend ideas; the feed answers itself', style: 'Phone mockup scrolling a feed of venue posts, then a zoom through the screen into the photos',
  hook: 'Phone feed: "January weekend ideas?"',
  meta: { headline: 'January weekend ideas', primary: primary('Scrolling for January weekend ideas? Stop here.', 'The infinity floor, the laser room and the sky maze, all indoors at Explorazone, Bowthorpe, Norwich, outside the ring road.') } },
  phoneFmt, { mode: 'feed', feedTitle: 'Weekend ideas', shots: ['infinity_floor', 'laser_room', 'sky_maze2'], zoomAt: 4.6, hook: ['January weekend', '_ideas?_'], mid: ['Stop scrolling.', '_Go here._'], cards: ['robot2', 'heat'], end: ['Weekend idea:', '_found._'], strip: ['infinity_floor', 'laser_room', 'sky_maze2', 'robot2', 'heat', 'roses'] });

spot({ id: 'W114', title: 'Saturday with Nan', slug: 'saturday-with-nan-scrapbook', dur: 12, run: 'jan', series: 'Three generations', music: 832,
  persona: 'Grandparents 55+ with grandchildren aged 5 to 10', angle: 'A grandchild’s scrapbook page of a Saturday with Nan', style: 'Paper-cutout scrapbook: ransom-note letters and torn photos taped on kraft paper, stop-motion timing',
  hook: 'Cut-out letters: "SATURDAY WITH NAN"',
  meta: { headline: 'Saturday with Nan', primary: primary('Saturday with Nan: coffee first, then robot waiters, heat vision and the sky maze.', 'Explorazone, Bowthorpe, Norwich. All indoors, with a café for the grown-ups.') } },
  scrapbookFmt, { paper: '#d6b48a', titleSize: 104, titles: [['SATURDAY', 440, 0.1], ['WITH NAN', 570, 0.8], ['BEST DAY!', 1010, 5.4]], pieces: [['cafe', 300, 800, 420, 270, -0.07, 1.6, 'coffee first'], ['robot2', 780, 820, 380, 250, 0.06, 2.5, 'robot waiters'], ['heat', 310, 1130, 400, 250, 0.05, 3.4, 'Nan glowing!'], ['sky_maze', 790, 1140, 360, 230, -0.07, 4.3, 'I did it!!']], stickers: [[970, 660, 2.0], [130, 1000, 3.8], [990, 1000, 4.6]], end: ['Saturday', '_with Nan._'], strip: ['cafe', 'robot2', 'heat', 'sky_maze', 'roses', 'laser_room'] });

spot({ id: 'W115', title: 'January sales? Go the other way', slug: 'january-sales-map', dur: 8, run: 'jan', series: 'Maps and places', music: 1060, ring: true,
  persona: 'Parents 25 to 44 avoiding the sales crowds', angle: 'Town is packed for the January sales; Explorazone is the other way', style: 'Night map with a jammed ring road and a route round to Bowthorpe, then a photo grid',
  hook: 'Map: "January sales in town? Packed."',
  meta: { headline: 'Skip the January sales crowds', primary: primary('January sales in the city centre? Packed, and parking is worse.', 'Go the other way: the light forest, the laser room and the space zone, all indoors in Bowthorpe, Norwich.') } },
  mapFmt, { seed: 11, hook2At: 1.8, hook: ['January sales', 'in town? _Packed._'], hook2: ['Go the', '_other way._'], mid: ['Outside the', '_ring road._'], cards: ['light_pillars', 'laser_room', 'astro', 'robot2'], end: ['Skip the', '_sales crowds._'], strip: ['light_pillars', 'laser_room', 'astro', 'robot2', 'heat', 'roses'] });

spot({ id: 'W116', title: '£0 for the third', slug: 'zero-for-the-third', dur: 8, run: 'jan', series: 'More concepts', music: 1147,
  persona: 'Parents 25 to 44, January budgets', angle: 'After Christmas, the best price is £0', style: 'Giant £0 filled with the laser room, then two photo cards',
  hook: 'Giant "£0" filled with the laser room',
  meta: { headline: 'January’s best price: £0', primary: primary('January budget? The best price this month is £0: the third ticket.', 'The laser room and the plasma ball, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  bigNumFmt, { num: '£0', fillKey: 'laser_room', beats: [[['The third ticket:'], 0.1, 0.9], [['January’s best', '_price._'], 0.9, 3.0]], chips: ['3 for £36', '6 for £72', '9 for £108'], mid: ['Third ticket:', '_£0._'], cards: ['laser_room', 'plasma'], end: ['Third ticket:', '_£0._'], strip: ['laser_room', 'plasma', 'heat', 'infinity_floor', 'robot2', 'roses'] });

spot({ id: 'W117', title: 'Then and now: school', slug: 'then-and-now-school', dur: 12, run: 'jan', series: 'In my day', music: 543,
  persona: 'Grandparents 55+, back-to-school week', angle: 'School then and now: typed homework and film cameras vs hands-on science', style: 'Split then-and-now photo pairs with sepia on the left',
  hook: '"Homework then: typed."',
  meta: { headline: 'School then and now', primary: primary('Homework then: typed. Science now: hands-on.', 'Show the grandchildren the typewriters and old cameras at Explorazone, then the science lab and heat vision. All indoors in Bowthorpe, Norwich.') } },
  thenNowFmt, { pairs: [['typewriters', 'THEN', 'lab3', 'NOW', ['Homework then:', '_typed._'], ['Science now:', '_hands-on._']], ['cameras', 'THEN', 'heat', 'NOW', ['Cameras then:', '_film._'], ['Cameras now:', '_heat vision._']]], end: ['Your school days', '_meet theirs._'], strip: ['typewriters', 'lab3', 'cameras', 'heat', 'radios', 'laser_room'] });

spot({ id: 'W118', title: 'New year quiz', slug: 'new-year-quiz', dur: 12, run: 'jan', series: 'Games and puzzles', music: 466,
  persona: 'Parents 25 to 44 with curious children', angle: 'A quick true-or-false to start the year', style: 'Quiz cards with TRUE and FALSE stamps over photos',
  hook: '"New year quiz: true or false?"',
  meta: { headline: 'New year quiz: true or false?', primary: primary('New year quiz. You can walk through a maze in the sky: true. Robots can be waiters: true. January weekends are boring: false.', 'All indoors at Explorazone, Bowthorpe, Norwich.') } },
  quizFmt, { hook: ['New year quiz:', '_true or false?_'], qs: [['You can walk through a maze in the sky.', 'TRUE', 'sky_maze'], ['Robots can be waiters.', 'TRUE', 'robot2'], ['January weekends are boring.', 'FALSE', 'infinity_floor']], end: ['January boring?', '_False._'], strip: ['sky_maze', 'robot2', 'infinity_floor', 'heat', 'laser_room', 'roses'] });
