// =====================================================================
// Period 5, late January (run 11 to 31 Jan): W119 to W136 (5 grandparents, 13 families)
// =====================================================================
spot({ id: 'W119', title: 'Blue Monday: shades of blue', slug: 'blue-monday-shades', dur: 12, run: 'latejan', series: 'More concepts', music: 1054, ring: true,
  persona: 'Parents 25 to 44, January blues', angle: 'A paint chart of January blues, and one blue worth going out for', style: 'Paint-swatch card of January blues; the last swatch is the space-time tunnel',
  hook: 'Paint chart: "Blue Monday: four shades of blue"',
  meta: { headline: 'Blue Monday? Try this blue', primary: primary('Blue Monday: rain blue, commute blue, inbox blue, Monday blue.', 'And one blue worth going out for: the space-time tunnel, the space zone and the infinity lights, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  swatchFmt, { card: 'JANUARY BLUES', swatches: [['Rain blue', '#64748b'], ['Commute blue', '#475569'], ['Inbox blue', '#334155'], ['Monday blue', '#1e293b']], hero: ['Explorazone blue', 'tunnel'], hook: ['Blue Monday:', '_4 shades._'], mid: ['One blue', '_worth seeing._'], cards: ['astro', 'dodeca'], end: ['Feeling blue?', '_See this one._'], strip: ['tunnel', 'astro', 'dodeca', 'laser_room', 'light_pillars', 'heat'] });

spot({ id: 'W120', title: 'Payday', slug: 'payday-banking-app', dur: 8, run: 'latejan', series: 'Screens and phones', music: 989,
  persona: 'Parents 25 to 44, end-of-January budgets', angle: 'January payday at last; the best line on the statement is the day out', style: 'Banking app transactions sliding in, the last one highlighted, then a photo grid',
  hook: 'Banking app: "PAYDAY"',
  meta: { headline: 'Payday. Finally.', primary: primary('January payday, finally. Bills, the food shop, and one line worth smiling at: three tickets for £36.', 'The sky maze, the laser room, robot waiters and heat vision, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  payFmt, { rows: [['Payday', 'Finally', 0.4], ['Gas and electric', 'Ouch', 0.9], ['Food shop', 'Ouch', 1.4], ['Explorazone x3', '£36', 2.0, true]], cardsAt: 3.0, hook: ['Payday.', '_Finally._'], mid: ['Best spend', '_this month._'], cards: ['sky_maze2', 'laser_room', 'robot2', 'heat'], end: ['Payday plan:', '_sorted._'], strip: ['sky_maze2', 'laser_room', 'robot2', 'heat', 'roses', 'infinity_floor'] });

spot({ id: 'W121', title: 'Operation: January Blues', slug: 'operation-january-blues', dur: 12, run: 'latejan', series: 'Missions', music: 892,
  persona: 'Grandparents 55+ cheering up the grandchildren', angle: 'A top-secret cure for the January blues', style: 'Typed top-secret dossier with stamps and clipped photos (director favourite format)',
  hook: '"TOP SECRET: Operation January Blues"',
  meta: { headline: 'Grandparents: Operation January Blues', primary: primary('Top secret. Operation January Blues. Agents: Nan and Grandad. Problem: grey, still. Cure: the garden of light.', 'Location: Explorazone, Bowthorpe, Norwich. All indoors, with a café for the grown-ups.') } },
  dossierFmt, { lines: [['OPERATION JANUARY BLUES', 0.4, 50, '#7a160c'], ['AGENTS: Nan & Grandad', 1.3], ['PROBLEM: grey. Still.', 2.2], ['CURE: garden of light', 3.1], ['EQUIPMENT: 2 tickets', 4.0], ['BONUS: 3rd agent free', 4.8, 44, '#1a34bf']], stamps: [['TOP SECRET', 800, 300, 0.1, 0.1, '#c0271b'], ['CURED', 760, 1090, -0.15, 6.0, '#1f7a3e']], pics: [['roses', 280, 1460, -0.06, 3.4], ['light_pillars', 780, 1500, 0.07, 4.2]], end: ['January blues:', '_mission ready._'], strip: ['roses', 'light_pillars', 'cafe', 'heat', 'robot2', 'laser_room'] });

spot({ id: 'W122', title: 'Forecast: grey, still', slug: 'forecast-grey-still', dur: 8, run: 'latejan', series: 'Rain and winter weather', music: 282, ring: true,
  persona: 'Parents 25 to 44 planning the weekend', angle: 'Late January: still grey; the Explorazone forecast is bright', style: 'Weather-app forecast that swipes to an Explorazone forecast',
  hook: '"January: grey. Still."',
  meta: { headline: 'Still grey? Not in here', primary: primary('Late January weekend forecast: grey, still.', 'The Explorazone forecast: bright spells in the infinity lights and a glow in the light forest, all indoors in Bowthorpe, Norwich.') } },
  forecastFmt, { hook: ['January:', 'grey. _Still._'], hook2: ['Our forecast:', '_bright._'], days: [['SAT', 'Grey', 'Drizzle'], ['SUN', 'Grey', 'Overcast']], good: [['SAT', 'dodeca', 'Bright spells'], ['SUN', 'light_pillars', 'Glowing']], end: ['Still grey?', '_Not in here._'], strip: ['dodeca', 'light_pillars', 'laser_room', 'heat', 'infinity_floor', 'roses'] });

spot({ id: 'W123', title: 'City centre vs Bowthorpe', slug: 'city-centre-vs-bowthorpe', dur: 8, run: 'latejan', series: 'Maps and places', music: 1105, ring: true,
  persona: 'Parents 25 to 44, weekend planners', angle: 'The city centre means queues; Bowthorpe has room to explore', style: 'Split screen: grey rainy city versus colourful rooms, the divider slides over',
  hook: '"City centre: queues. Bowthorpe:" on a split screen',
  meta: { headline: 'Skip the city-centre queues', primary: primary('City centre on a Saturday: queues for parking, queues for everything.', 'Bowthorpe: room to explore, with the sky maze, the light-up floor and the AR sandbox, all indoors.') } },
  splitFmt, { labels: ['CITY CENTRE', 'BOWTHORPE'], outside: 'Queues, grey', mergeAt: 1.8, hook: ['City centre:', '_queues._'], mid: ['Bowthorpe:', '_room to explore._'], inside: [['sky_maze', 0], ['floor2', 2.8], ['sandbox2', 3.6]], end: ['Skip the queues.', '_Come here._'], strip: ['sky_maze', 'floor2', 'sandbox2', 'laser_room', 'heat', 'robot2'] });

spot({ id: 'W124', title: 'In my day: typewriters', slug: 'in-my-day-typewriters', dur: 15, run: 'latejan', series: 'In my day', music: 717,
  persona: 'Grandparents 55+, nostalgic', angle: 'Homework was typed and mistakes meant starting again; now there are robot waiters', style: 'Sepia film strip over the typewriters and old phones, bursting into colour (director favourite format)',
  hook: '"In my day, homework was typed." on sepia film',
  meta: { headline: 'In my day, homework was typed', primary: primary('In my day, homework was typed, and one mistake meant starting again.', 'Show the grandchildren the typewriters at Explorazone, then the robot waiters and the sky maze. All indoors in Bowthorpe, Norwich.') } },
  filmFmt, { segs: [['typewriters', ['In my day,', 'homework was _typed._'], 0, true], ['cameras', ['One mistake?', '_Start again._'], 2.3, true], ['phones', ['Phones lived', 'in the _hall._'], 4.3, true], ['robot2', ['Now?', '_Robot waiters._'], 6.3, false], ['sky_maze2', ['And a maze', '_in the sky._'], 8.0, false], ['radios', ['Show them', '_both._'], 9.7, true]], end: ['In my day...', '_and theirs._'], strip: ['typewriters', 'cameras', 'phones', 'robot2', 'sky_maze2', 'radios'] });

spot({ id: 'W125', title: 'POV: you made it through January', slug: 'pov-made-it-through-january', dur: 8, run: 'latejan', series: 'Screens and phones', music: 1164,
  persona: 'Parents 25 to 44, native Reels viewers', angle: 'POV: you survived January and deserve a reward', style: 'Handheld punch-in cuts with POV captions over whole photos',
  hook: '"POV: you made it through January."',
  meta: { headline: 'You made it through January', primary: primary('POV: you made it through January. Reward unlocked.', 'The laser room, robot waiters and the infinity floor, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  povFmt, { seed: 29, segs: [['sky_maze', 'POV: you made it through January', 0], ['laser_room', 'reward: lasers', 1.2], ['robot2', 'robot waiters', 2.2], ['infinity_floor', 'you earned this', 3.2]], end: ['January done.', '_Reward time._'], strip: ['sky_maze', 'laser_room', 'robot2', 'infinity_floor', 'heat', 'roses'] });

spot({ id: 'W126', title: 'Day 47 of January', slug: 'day-47-of-january', dur: 8, run: 'latejan', series: 'More concepts', music: 429,
  persona: 'Parents 25 to 44, the longest month', angle: 'January feels like it has 47 days; end it with a day out', style: 'Wobbling tear-off calendar showing day 47, then a photo grid',
  hook: 'Calendar: "January 47"',
  meta: { headline: 'Day 47 of January?', primary: primary('Is it day 47 of January? It feels like it.', 'End it properly: the laser jungle, plasma lightning and the infinity lights, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  dayFmt, { days: ['JANUARY'], big: '47', planAt: 2.0, hook: ['Day 47', 'of _January._'], mid: ['End January', '_properly._'], cards: ['jungle2', 'plasma', 'dodeca', 'floor2'], end: ['Longest month?', '_End it here._'], strip: ['jungle2', 'plasma', 'dodeca', 'floor2', 'laser_room', 'heat'] });

spot({ id: 'W127', title: 'Crossword: Nan’s clue', slug: 'crossword-nans-clue', dur: 12, run: 'latejan', series: 'Games and puzzles', music: 652, ring: true,
  persona: 'Grandparents 55+ who love a puzzle', angle: 'Another clue every grandparent can solve', style: 'Newspaper crossword; the answer EXPLORAZONE is written in, then photos drop in',
  hook: '"12 across: bright day out for Nan and the grandkids (11)"',
  meta: { headline: '12 across: bright day out (11)', primary: primary('12 across: a bright day out for Nan and the grandkids (11).', 'Answer: Explorazone. The garden of light, robot waiters and a café, all indoors in Bowthorpe, Norwich.') } },
  crosswordFmt, { num: 12, clue: 'Bright day out for Nan and the grandkids (11)', hook: ['Nan’s', '_crossword._'], mid: ['Solved:', '_Saturday._'], cards: ['roses', 'robot2', 'cafe'], end: ['Puzzle solved:', '_Explorazone._'], strip: ['roses', 'robot2', 'cafe', 'heat', 'telephones', 'laser_room'] });

spot({ id: 'W128', title: 'From pebbles to crystals', slug: 'pebbles-to-crystals', dur: 12, run: 'latejan', series: 'More concepts', music: 577,
  persona: 'Parents 25 to 44 with young collectors', angle: 'Pockets full of pebbles? Time for an upgrade', style: 'Museum specimen labels: a pebble, then crystals, fossils and a microscope',
  hook: '"Pockets full of pebbles?"',
  meta: { headline: 'Pebbles? Try crystals', primary: primary('Pockets full of pebbles from the park?', 'Upgrade to crystals, fossils and real microscopes, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  specimenFmt, { hook: ['Pockets full', 'of _pebbles?_'], mid: ['Time for', 'an _upgrade._'], items: [['pebble', 'Pebble', 'the park', 'low'], ['flags_crystals', 'Crystals', 'Explorazone', 'VERY HIGH'], ['fossils', 'Fossils', 'Explorazone', 'VERY HIGH'], ['microscope', 'Microscope', 'Explorazone', 'OFF THE SCALE']], end: ['From pebbles', '_to crystals._'], strip: ['flags_crystals', 'fossils', 'microscope', 'lab3', 'laser_room', 'heat'] });

spot({ id: 'W129', title: 'Saturday checklist', slug: 'saturday-checklist', dur: 12, run: 'latejan', series: 'Notebook', music: 1001, ring: true,
  persona: 'Parents 25 to 44, weekend planners', angle: 'The Saturday checklist: lie-in, pancakes, then the best bit', style: 'Checklist ticking off a Saturday; the last item opens into the photos with a zoom-through cut',
  hook: 'Checklist: "Saturday"',
  meta: { headline: 'Saturday: ticked off', primary: primary('Saturday checklist: lie-in, pancakes, coats on. Then the best bit.', 'The laser room, the sky maze and heat vision, all indoors at Explorazone, outside the ring road in Bowthorpe.') } },
  checklistFmt, { title: 'Saturday', bg: ['#0f766e', '#134e4a'], items: [['Lie-in', 0.6], ['Pancakes', 1.3], ['Coats on', 2.0], ['Explorazone', 2.8, 'laser_room']], zoomAt: 4.4, hook: ['This Saturday:', '_ticked off._'], mid: ['Best bit:', '_ticked._'], cards: ['sky_maze2', 'heat'], end: ['Saturday:', '_ticked off._'], strip: ['laser_room', 'sky_maze2', 'heat', 'robot2', 'roses', 'infinity_floor'] });

spot({ id: 'W130', title: 'Grandad’s sums', slug: 'grandads-sums', dur: 15, run: 'latejan', series: 'Notebook', music: 595,
  persona: 'Grandparents 55+ taking two or more grandchildren', angle: 'Grandad does the maths: two tickets, three grandchildren', style: 'Squared maths paper with sums in pencil, ticks and polaroids',
  hook: 'Maths paper: "Grandad’s sums"',
  meta: { headline: 'Grandad’s sums', primary: primary('Grandad’s sums: £18 + £18 = £36. Plus one grandchild = free. Three grandchildren, one happy Grandad.', 'Robot waiters, heat vision and the sky maze, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'squared', end: ['Grandad’s sums:', '_3 for £36._'], endKind: 'navy', accent: P.yellow, strip: ['robot2', 'heat', 'sky_maze2', 'laser_room', 'roses', 'cafe'], items: [
    { type: 'w', text: 'Grandad’s sums', x: 170, y: 540, at: 0.1, b: 0.9, fam: PRINT, size: 76, color: INK },
    { type: 'w', text: '£18 + £18 = £36', x: 170, y: 660, at: 1.2, b: 2.0, fam: PRINT, size: 66, color: PENCIL },
    { type: 'w', text: '+ 1 grandchild = FREE', x: 170, y: 770, at: 2.4, b: 3.2, fam: PRINT, size: 66, color: RED },
    { type: 'w', text: '3 grandchildren', x: 170, y: 880, at: 3.6, b: 4.2, fam: PRINT, size: 66, color: PENCIL },
    { type: 'w', text: '= 1 happy Grandad', x: 170, y: 990, at: 4.5, b: 5.2, fam: PRINT, size: 66, color: INK },
    { type: 'tick', x: 920, y: 760, s: 70, at: 3.3 }, { type: 'circle', x: 470, y: 960, rx: 360, ry: 70, at: 5.5, d: 0.5 }, { type: 'star', x: 920, y: 980, r: 36, at: 6.0 },
    { type: 'pol', key: 'robot2', x: 250, y: 1400, w: 340, rot: -0.07, label: 'robot waiters', at: 6.4, fam: PRINT },
    { type: 'pol', key: 'heat', x: 570, y: 1460, w: 340, rot: 0.05, label: 'heat vision', at: 6.9, fam: PRINT },
    { type: 'pol', key: 'sky_maze2', x: 880, y: 1400, w: 340, rot: 0.09, label: 'sky maze', at: 7.4, fam: PRINT },
  ] });

spot({ id: 'W131', title: 'January energy levels', slug: 'january-energy-levels', dur: 12, run: 'latejan', series: 'More concepts', music: 77,
  persona: 'Parents 25 to 44, running on empty', angle: 'A very scientific chart of family energy in January, rescued on Saturday', style: 'Growth-curve chart sliding down all week, then a zoom through Saturday’s spike into the photos',
  hook: 'Chart: "January energy: 5%"',
  meta: { headline: 'January energy at 5%?', primary: primary('Family energy levels in January: Monday, low. Friday, 5%.', 'Saturday: recharged by plasma lightning, the laser jungle and the light-up floor, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  chartFmt, { title: 'Family energy', yLabel: 'ENERGY', bg: ['#1e3a8a', '#172554'], xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], points: [0.5, 0.4, 0.28, 0.15, 0.05, 0.97], peak: 5, notes: [[2, 'Grey again', '#ef4444'], [4, '5%', '#ef4444'], [5, 'Explorazone', '#16a34a']], hook: ['January energy:', '_5%._'], mid: ['Saturday:', '_recharged._'], cards: ['plasma', 'jungle2', 'floor2'], end: ['Energy at 5%?', '_Recharge here._'], strip: ['plasma', 'jungle2', 'floor2', 'laser_room', 'heat', 'robot2'] });

spot({ id: 'W132', title: 'Our Saturday story', slug: 'our-saturday-story', dur: 12, run: 'latejan', series: 'Screens and phones', music: 1210, ring: true,
  persona: 'Parents 25 to 44 who post their weekends', angle: 'A family’s Saturday story, tapped through on a phone', style: 'Phone mockup playing a story with progress bars and captions, then a zoom through the screen',
  hook: 'Phone story: "Saturday: grey outside..."',
  meta: { headline: 'Our Saturday story', primary: primary('Our Saturday story: grey outside, lasers inside, robot waiters for lunch.', 'All indoors at Explorazone, Bowthorpe, Norwich, outside the city-centre traffic.') } },
  phoneFmt, { mode: 'story', shots: ['red_lasers', 'robot2', 'infinity_floor'], captions: ['lasers inside', 'robot waiters!', 'the floor never ends'], zoomAt: 4.8, hook: ['Saturday:', '_grey outside..._'], mid: ['...bright', '_inside._'], cards: ['heat', 'roses'], end: ['Your Saturday', '_story._'], strip: ['red_lasers', 'robot2', 'infinity_floor', 'heat', 'roses', 'laser_room'] });

spot({ id: 'W133', title: 'Myth: grandparents can’t do the sky maze', slug: 'myth-grandparents-sky-maze', dur: 8, run: 'latejan', series: 'More concepts', music: 824,
  persona: 'Grandparents 55+ who like a challenge', angle: 'Grandparents can absolutely do the sky maze', style: 'Myth statement stamped BUSTED, then a 2x2 grid',
  hook: '"Myth: grandparents can’t do the sky maze."',
  meta: { headline: 'Grandparents vs the sky maze', primary: primary('Myth: grandparents can’t do the sky maze.', 'Busted. Bring the grandchildren and prove it, then heat vision, robot waiters and the café, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  mythFmt, { myth: 'Grandparents can’t do the sky maze.', hook: ['Myth _buster:_'], mid: ['Grandparents:', '_unstoppable._'], cards: ['sky_maze', 'heat', 'robot2', 'cafe'], end: ['Sky maze?', '_Nan’s got this._'], strip: ['sky_maze', 'heat', 'robot2', 'cafe', 'laser_room', 'roses'] });

spot({ id: 'W134', title: 'Group special: nine for £108', slug: 'group-special-nine', dur: 12, run: 'latejan', series: 'More concepts', music: 696,
  persona: 'Friends and family groups of six to nine', angle: 'A magazine cover special on group days out: nine for £108', style: 'Magazine cover with cover lines popping on, then a zoom through the cover photo into the venue',
  hook: 'Magazine cover: "Nine of you? £108."',
  meta: { headline: 'Nine of you? £108.', primary: primary('The group special: nine of you for £108, because every third ticket is free.', 'The laser room, the sky maze and robot waiters, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  magazineFmt, { mast: ['GROUP DAYS OUT', P.red], mastSize: 80, issue: 'JANUARY ISSUE', photo: 'laser_room', tags: [['3 for £36', 1.4], ['6 for £72', 1.8], ['9 for £108', 2.2], ['Every 3rd ticket FREE', 2.6]], cover: ['Nine of you?', '_£108._'], cards: ['sky_maze2', 'robot2'], mid: ['The whole group.', '_£108._'], end: ['Nine of you?', '_£108._'], strip: ['laser_room', 'sky_maze2', 'robot2', 'heat', 'roses', 'infinity_floor'] });

spot({ id: 'W135', title: 'Weather warning: wind', slug: 'weather-warning-wind', dur: 12, run: 'latejan', series: 'Rain and winter weather', music: 676, ring: true,
  persona: 'Parents 25 to 44, stormy January weekends', angle: 'The park is off when the wind picks up; inside it is calm and lit up', style: 'Weather-warning alert with a blustery scene, then calm bright rooms',
  hook: 'Alert: "Weather warning: wind"',
  meta: { headline: 'Windy weekend? Calm in here', primary: primary('Weather warning: wind, gusts all weekend. The park is off.', 'In here it is calm, dry and lit up: the light forest, the space zone and the laser jungle, all indoors in Bowthorpe, Norwich.') } },
  stormFmt, { alert: ['Warning: wind', 'Gusts all weekend'], hook: ['Weather', '_warning._'], hook2: ['Park?', '_Blown away._'], mid: ['In here:', '_calm and lit up._'], cards: ['light_pillars', 'astro', 'jungle2', 'dodeca'], end: ['Windy out.', '_Calm in here._'], strip: ['light_pillars', 'astro', 'jungle2', 'dodeca', 'laser_room', 'heat'] });

spot({ id: 'W136', title: 'Foggy Saturday', slug: 'foggy-saturday', dur: 12, run: 'latejan', series: 'Rain and winter weather', music: 148,
  persona: 'Parents 25 to 44, misty January mornings', angle: 'A foggy morning cancels the walk; the fog lifts inside', style: 'Fog wipe clearing to the garden of light',
  hook: '"Visibility: 50 metres."',
  meta: { headline: 'Foggy out? Clear plan', primary: primary('Foggy Saturday morning: visibility 50 metres, and the walk is off.', 'The fog lifts in here: the garden of light, the infinity floor and the science lab, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  fogFmt, { hook: ['Visibility:', '_50 metres._'], hook2: ['The walk?', '_Off._'], mid: ['The fog lifts', '_in here._'], mid2: ['Saturday:', '_clear plan._'], reveal: 'roses', cards: ['infinity_floor', 'lab3', 'dodeca'], end: ['Foggy out.', '_Clear plan._'], strip: ['roses', 'infinity_floor', 'lab3', 'dodeca', 'heat', 'laser_room'] });
