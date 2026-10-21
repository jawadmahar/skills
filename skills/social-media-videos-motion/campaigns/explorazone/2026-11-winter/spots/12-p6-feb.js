// =====================================================================
// Period 6, February, last chance (run 1 to 12 Feb): W137 to W150 (4 grandparents, 10 families)
// =====================================================================
spot({ id: 'W137', title: 'February calendar', slug: 'february-calendar', dur: 8, run: 'feb', series: 'More concepts', music: 1137, ring: true,
  persona: 'Parents 25 to 44, last-chance planners', angle: 'Friday 12 February is circled: the last day for the free third ticket', style: 'Wall calendar with the 12th circled in red pen, then a photo grid',
  hook: 'Calendar: "February" with the 12th circled',
  meta: { headline: 'Circle Friday 12 February', primary: primary('Circle Friday 12 February: the last day for the free third ticket.', 'The laser room, the sky maze, heat vision and robot waiters, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  calendarFmt, { month: 'FEBRUARY 2027', days: 28, firstDow: 0, mark: 12, note: 'Last day: 3rd ticket free!', hook: ['Circle', '_Friday 12th._'], mid: ['Go before', '_Friday._'], cards: ['laser_room', 'sky_maze2', 'heat', 'robot2'], end: ['Go before', '_Friday._'], strip: ['laser_room', 'sky_maze2', 'heat', 'robot2', 'roses', 'infinity_floor'] });

spot({ id: 'W138', title: 'Reminder: ends Friday', slug: 'reminder-ends-friday', dur: 8, run: 'feb', series: 'Screens and phones', music: 1152,
  persona: 'Parents 25 to 44 who meant to book', angle: 'The reminder you set in January: the free third ticket ends Friday', style: 'Phone mockup lock screen with reminders sliding in, then a zoom through the screen',
  hook: 'Lock screen: "Free 3rd ticket. Ends Fri 12 Feb."',
  meta: { headline: 'Reminder: ends Friday 12 Feb', primary: primary('Reminder: the free third ticket ends on Friday 12 February.', 'The infinity floor, the laser room and the space-time tunnel, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  phoneFmt, { mode: 'reminder', time: '08:30', date: 'This week', shots: ['infinity_floor'], reminders: [['Reminder', 'Book Explorazone', 0.6], ['Free 3rd ticket', 'Ends Fri 12 Feb', 1.5]], zoomAt: 2.8, cards: [], hook: ['Reminder:', '_ends Friday._'], mid: ['Don’t miss', '_the free ticket._'], end: ['Ends Friday.', '_Go now._'], strip: ['infinity_floor', 'laser_room', 'tunnel', 'heat', 'robot2', 'roses'] });

spot({ id: 'W139', title: 'Operation: Last Chance', slug: 'operation-last-chance', dur: 12, run: 'feb', series: 'Missions', music: 167,
  persona: 'Grandparents 55+ planning one more day out', angle: 'Mission: one more day out with the grandchildren before the offer ends', style: 'Typed top-secret dossier with stamps and clipped photos (director favourite format)',
  hook: '"TOP SECRET: Operation Last Chance"',
  meta: { headline: 'Grandparents: Operation Last Chance', primary: primary('Top secret. Operation Last Chance. Agents: Nan and Grandad. Deadline: Friday 12 February. Mission: one more day out with the grandchildren.', 'Location: Explorazone, Bowthorpe, Norwich. All indoors.') } },
  dossierFmt, { lines: [['OPERATION LAST CHANCE', 0.4, 52, '#7a160c'], ['AGENTS: Nan & Grandad', 1.3], ['DEADLINE: Fri 12 Feb', 2.2], ['MISSION: one more day out', 3.1], ['EQUIPMENT: 2 tickets', 4.0], ['BONUS: 3rd agent free', 4.8, 44, '#1a34bf']], stamps: [['TOP SECRET', 800, 300, 0.1, 0.1, '#c0271b'], ['URGENT', 760, 1090, -0.15, 6.0, '#c0271b']], pics: [['sky_maze2', 280, 1460, -0.06, 3.4], ['robot2', 780, 1500, 0.07, 4.2]], end: ['Last chance:', '_mission ready._'], strip: ['sky_maze2', 'robot2', 'heat', 'roses', 'laser_room', 'cafe'] });

spot({ id: 'W140', title: 'Roses are red, lasers are green', slug: 'roses-are-red-lasers-green', dur: 12, run: 'feb', series: 'Notebook', music: 182, ring: true,
  persona: 'Parents 25 to 44, February family plans', angle: 'A four-line poem about the garden of light, the lasers and the free ticket', style: 'Handwritten poem on a yellow notepad with hearts and polaroids',
  hook: '"Roses are red, lasers are green..."',
  meta: { headline: 'Roses are red, lasers are green', primary: primary('Roses are red, lasers are green, the third ticket’s free, the best deal we’ve seen.', 'The garden of light and the laser room, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'notepad', end: ['The best deal', '_we’ve seen._'], endKind: 'red', accent: P.yellow, strip: ['roses', 'laser_room', 'red_lasers', 'heat', 'robot2', 'sky_maze2'], items: [
    { type: 'w', text: 'Roses are red,', x: 180, y: 520, at: 0.1, b: 1.0, fam: SCRIPT, size: 82, color: '#b91c1c' },
    { type: 'w', text: 'lasers are green,', x: 180, y: 640, at: 1.2, b: 2.1, fam: SCRIPT, size: 82, color: '#15803d' },
    { type: 'w', text: 'the third ticket’s free,', x: 180, y: 760, at: 2.4, b: 3.3, fam: SCRIPT, size: 76, color: INK },
    { type: 'w', text: 'best deal we’ve seen.', x: 180, y: 880, at: 3.6, b: 4.5, fam: SCRIPT, size: 76, color: INK },
    { type: 'heart', x: 900, y: 500, s: 40, at: 1.0 }, { type: 'heart', x: 960, y: 880, s: 34, at: 4.6 },
    { type: 'pol', key: 'roses', x: 300, y: 1360, w: 380, rot: -0.06, label: 'garden of light', at: 5.0, fam: KALAM },
    { type: 'pol', key: 'laser_room', x: 780, y: 1380, w: 380, rot: 0.06, label: 'laser room', at: 5.5, fam: KALAM },
  ] });

spot({ id: 'W141', title: 'In my day: phones', slug: 'in-my-day-phones', dur: 15, run: 'feb', series: 'In my day', music: 310,
  persona: 'Grandparents 55+, nostalgic', angle: 'One phone in the hall, dialled by hand; now there is lightning in a ball', style: 'Sepia film strip over the old phones and radios, bursting into colour (director favourite format)',
  hook: '"In my day, the phone lived in the hall." on sepia film',
  meta: { headline: 'In my day, the phone was in the hall', primary: primary('In my day, there was one phone, it lived in the hall, and you dialled every number.', 'Show the grandchildren the old phones at Explorazone, then plasma lightning and the infinity lights. All indoors in Bowthorpe, Norwich.') } },
  filmFmt, { segs: [['telephones', ['In my day,', 'the phone was _in the hall._'], 0, true], ['phones', ['You _dialled_', 'every number.'], 2.3, true], ['radios', ['Music came', 'on _the radio._'], 4.3, true], ['plasma', ['Now? Lightning', '_in a ball._'], 6.3, false], ['dodeca', ['And lights that', '_never end._'], 8.0, false], ['cameras', ['Show them', '_both._'], 9.7, true]], end: ['In my day...', '_and theirs._'], strip: ['telephones', 'phones', 'radios', 'plasma', 'dodeca', 'cameras'] });

spot({ id: 'W142', title: 'February: still grey', slug: 'february-still-grey', dur: 12, run: 'feb', series: 'Rain and winter weather', music: 476, ring: true,
  persona: 'Parents 25 to 44, tired of grey weekends', angle: 'February is still grey: the park and the beach are out, Explorazone is in', style: 'Grey plan list with crosses, one green tick, then glowing rooms',
  hook: '"February: still grey."',
  meta: { headline: 'February: still grey', primary: primary('February: still grey. The park is muddy and the beach is freezing.', 'Explorazone is glowing: the light forest, the garden of light and the infinity lights, all indoors in Bowthorpe, Norwich.') } },
  snowPlanFmt, { grey: true, hook: ['February:', '_still grey._'], list: [['Park (muddy)', 'x'], ['Beach (freezing)', 'x'], ['Explorazone', 'v']], mid: ['Grey outside:', '_glowing inside._'], cards: ['light_pillars', 'roses', 'dodeca'], end: ['Still grey?', '_Still glowing._'], endKind: 'rain', strip: ['light_pillars', 'roses', 'dodeca', 'infinity_floor', 'laser_room', 'heat'] });

spot({ id: 'W143', title: 'POV: you went before Friday', slug: 'pov-went-before-friday', dur: 8, run: 'feb', series: 'Screens and phones', music: 1141,
  persona: 'Parents 25 to 44, native Reels viewers', angle: 'POV: you booked before the offer ended and the third ticket was free', style: 'Handheld punch-in cuts with POV captions over whole photos',
  hook: '"POV: you went before Friday."',
  meta: { headline: 'POV: you went before Friday', primary: primary('POV: you went before Friday 12 February, and the third ticket was free.', 'The sky maze, heat vision and robot waiters, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  povFmt, { seed: 37, segs: [['laser_room', 'POV: you went before Friday', 0], ['sky_maze2', '3rd ticket: free', 1.2], ['heat', 'no regrets', 2.2], ['robot2', 'smart move', 3.2]], end: ['Go before', '_Friday._'], strip: ['laser_room', 'sky_maze2', 'heat', 'robot2', 'roses', 'infinity_floor'] });

spot({ id: 'W144', title: 'Nan’s chat: before Friday', slug: 'nans-chat-before-friday', dur: 12, run: 'feb', series: 'Screens and phones', music: 639,
  persona: 'Grandparents 55+ in the family group chat', angle: 'Nan spots the free ticket is ending and books the grandchildren in', style: 'Messaging app with typing dots, a photo message and heart reactions',
  hook: 'Chat: "Free 3rd ticket ends Fri 12 Feb"',
  meta: { headline: 'Nan’s booked it', primary: primary('Family chat. Nan: the free third ticket ends Friday 12 February. Grandkids: can we go before then?', 'Nan plus two grandchildren is £36. The sky maze, heat vision and the café, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  chatFmt, { title: 'Family', members: 'Nan, Mum, Ellie, Josh', msgs: [
    { who: 'Nan', text: 'Free 3rd ticket ends Fri 12 Feb', at: 0.2, col: '#be185d' },
    { who: 'Ellie', text: 'Can we go before then??', at: 1.4, col: '#1d4ed8' },
    { me: true, key: 'sky_maze2', text: 'Nan + 2 of us = £36', at: 2.6 },
    { who: 'Josh', text: 'SKY MAZE', at: 4.0, col: '#047857', react: 4.4 },
    { who: 'Nan', text: 'Booked. Bring coats', at: 5.2, col: '#be185d' },
  ], end: ['Nan’s', '_booked it._'], strip: ['sky_maze2', 'heat', 'cafe', 'robot2', 'laser_room', 'roses'] });

spot({ id: 'W145', title: 'Before Friday checklist', slug: 'before-friday-checklist', dur: 12, run: 'feb', series: 'Notebook', music: 1145, ring: true,
  persona: 'Parents 25 to 44 ready to book', angle: 'Four steps to the free third ticket before it ends', style: 'Checklist ticking off the claim steps; the last item opens into the photos with a zoom-through cut',
  hook: 'Checklist: "Before Fri 12 Feb"',
  meta: { headline: 'Four steps to a free ticket', primary: primary('Before Friday 12 February: sign up online, pick your day, buy two tickets, and the third is free.', 'The laser room, the sky maze and heat vision, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  checklistFmt, { title: 'Before Fri 12 Feb', bg: ['#b91c1c', '#7f1d1d'], items: [['Sign up online', 0.6], ['Pick your day', 1.3], ['Buy 2 tickets', 2.0], ['3rd ticket: free', 2.8, 'laser_room']], zoomAt: 4.4, hook: ['Before Friday:', '_your checklist._'], mid: ['Third ticket:', '_free._'], cards: ['sky_maze', 'heat'], end: ['Third ticket free', '_till Friday._'], strip: ['laser_room', 'sky_maze', 'heat', 'robot2', 'roses', 'infinity_floor'] });

spot({ id: 'W146', title: 'Last quiz', slug: 'last-quiz', dur: 12, run: 'feb', series: 'Games and puzzles', music: 706,
  persona: 'Parents 25 to 44 with curious children', angle: 'A last true-or-false before the offer ends', style: 'Quiz cards with TRUE and FALSE stamps over photos',
  hook: '"Last quiz: true or false?"',
  meta: { headline: 'Last quiz: true or false?', primary: primary('Last quiz. The free third ticket ends Friday 12 February: true. You need sunshine for a good day out: false. Nine of you is £108: true.', 'All indoors at Explorazone, Bowthorpe, Norwich.') } },
  quizFmt, { hook: ['Last quiz:', '_true or false?_'], qs: [['The free 3rd ticket ends Fri 12 Feb.', 'TRUE', 'laser_room'], ['You need sunshine for a good day out.', 'FALSE', 'roses'], ['Nine of you is £108.', 'TRUE', 'sky_maze2']], end: ['Ends Friday:', '_true._'], strip: ['laser_room', 'roses', 'sky_maze2', 'heat', 'robot2', 'infinity_floor'] });

spot({ id: 'W147', title: 'Then and now: gadgets', slug: 'then-and-now-gadgets', dur: 12, run: 'feb', series: 'In my day', music: 655,
  persona: 'Grandparents 55+ with gadget-mad grandchildren', angle: 'Gadgets then and now: a crackly radio vs lightning in a ball', style: 'Split then-and-now photo pairs with sepia on the left',
  hook: '"Then: a radio crackled."',
  meta: { headline: 'Gadgets then and now', primary: primary('Then: a radio that crackled. Now: lightning in a ball.', 'Show the grandchildren the old radios and phones at Explorazone, then plasma lightning and the robot waiters. All indoors in Bowthorpe, Norwich.') } },
  thenNowFmt, { pairs: [['radios', 'THEN', 'plasma', 'NOW', ['Then: a radio', '_crackled._'], ['Now: lightning', '_in a ball._']], ['telephones', 'THEN', 'robot2', 'NOW', ['Then: a phone', '_on the wall._'], ['Now: a robot', '_waiter._']]], end: ['Your gadgets', '_meet theirs._'], strip: ['radios', 'plasma', 'telephones', 'robot2', 'heat', 'laser_room'] });

spot({ id: 'W148', title: 'February receipt', slug: 'february-receipt', dur: 12, run: 'feb', series: 'More concepts', music: 858, ring: true,
  persona: 'Parents 25 to 44, February budgets', angle: 'The February receipt; the best line is £0.00', style: 'Till receipt printing line by line; the free ticket line circled',
  hook: 'Receipt: "February"',
  meta: { headline: 'The best line on the receipt', primary: primary('February receipts: a new umbrella, wellies they’ve outgrown, hot chocolate. And one line at £0.00.', 'The third ticket, free until Friday 12 February. All indoors at Explorazone, Bowthorpe, Norwich.') } },
  receiptFmt, { hook: ['February', '_receipts._'], mid: ['Best line:', '_£0.00._'], lines: [['FEBRUARY', '', 0.2], ['Umbrella (new)', '£8.00', 0.5], ['Wellies (outgrown)', '£15.00', 0.9], ['Hot chocolate', '£3.50', 1.3], ['Plasters', '£2.00', 1.7], ['- - - - - - - - - - - - -', '', 2.1], ['EXPLORAZONE', '', 2.4], ['Ticket 1', '£18.00', 2.8], ['Ticket 2', '£18.00', 3.2], ['Ticket 3', '£0.00', 3.6, true], ['3 TICKETS', '£36.00', 4.2]], circle: [9, 4.6], cards: ['infinity_floor', 'red_lasers'], end: ['The best line', '_on the receipt._'], strip: ['infinity_floor', 'red_lasers', 'laser_room', 'roses', 'heat', 'robot2'] });

spot({ id: 'W149', title: 'Ticket 3: £0', slug: 'ticket-three-zero', dur: 8, run: 'feb', series: 'More concepts', music: 1135,
  persona: 'Parents 25 to 44, price-conscious families of three', angle: 'Ticket one £18, ticket two £18, ticket three £0, until Friday', style: 'Split-flap board flipping £18, £18, £0, then a photo grid',
  hook: 'Split-flap board: "£18, £18, £0"',
  meta: { headline: 'Ticket 3: £0 until Friday', primary: primary('Ticket 1: £18. Ticket 2: £18. Ticket 3: £0, until Friday 12 February.', 'The sky maze, the laser room and robot waiters, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  flapFmt, { nums: ['£18', '£18', '£0'], label: 'TICKET 3', hook: ['Ticket 3:', '_£0._'], mid: ['Until', '_Fri 12 Feb._'], cards: ['sky_maze2', 'laser_room', 'robot2', 'heat'], end: ['Ticket 3:', '_£0._'], strip: ['sky_maze2', 'laser_room', 'robot2', 'heat', 'roses', 'infinity_floor'] });

spot({ id: 'W150', title: 'Last-chance portals', slug: 'last-chance-portals', dur: 12, run: 'feb', series: 'More concepts', music: 1167, ring: true,
  persona: 'Parents 25 to 44, last-chance planners', angle: 'Step through four worlds before the free third ticket ends', style: 'Portal rings opening into the laser room, sky maze, garden of light and tunnel',
  hook: '"Last chance: step in."',
  meta: { headline: 'Last chance: step in', primary: primary('Last chance to step in with a free third ticket: the laser room, the sky maze, the garden of light and the space-time tunnel.', 'All indoors at Explorazone, Bowthorpe, Norwich.') } },
  portalFmt, { worlds: [['laser_room', P.yellow], ['sky_maze2', P.lime], ['roses', '#f472b6'], ['tunnel', P.teal]], hooks: [[0.05, ['Last chance:', '_step in._']], [5.6, ['Third ticket free', '_till Fri 12 Feb._']]], end: ['Last chance:', '_step in._'], strip: ['laser_room', 'sky_maze2', 'roses', 'tunnel', 'heat', 'robot2'] });
