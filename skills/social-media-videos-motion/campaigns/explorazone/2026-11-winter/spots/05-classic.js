// =====================================================================
// More new concepts (13): W11 W12 W14 W15 W16 W18 W34 W38 W44 W45 W47 W48 W50
// Retro film, big-number price, split screen, stopwatch, quiz, specimen labels, cracker joke, calendar, chalkboard, family tree, myth stamp, portals.
// =====================================================================

// W11 In my day (retro film) ---------------------------------------------------------------
function filmFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur);
      if (t < E + 0.4) {
        const i = c.segs.findIndex((s, j) => t >= s[2] && (j === c.segs.length - 1 || t < c.segs[j + 1][2])), [key, lines, a, sepia] = c.segs[Math.max(0, i)];
        const fade = prog(t, a, a + 0.3);
        fill('#0b0b0b');
        const filmShot = (k, sep, alpha, z) => { const fh = 900 * IMG[k].height / IMG[k].width; bgPhoto(IMG[k], { alpha, filter: sep ? 'blur(36px) sepia(0.9) brightness(0.4)' : 'blur(36px) brightness(0.45) saturate(1.3)' }); photo(IMG[k], 90, 900 - fh / 2, W - 180, fh, { zoom: z, alpha, filter: sep ? 'sepia(0.9) contrast(1.1) brightness(0.85)' : 'saturate(1.25)', shadow: 'rgba(0,0,0,0.5)' }); };
        filmShot(key, sepia, 1, 1.02 + 0.04 * prog(t, a, a + 2));
        if (fade < 1 && i > 0) { const [pk, , , ps] = c.segs[i - 1]; filmShot(pk, ps, 1 - fade, 1.06); }
        const gr = rng(Math.floor(t * 12) + 1); ctx.save(); for (let k = 0; k < (sepia ? 220 : 60); k++) { ctx.fillStyle = `rgba(255,255,255,${gr() * 0.18})`; ctx.fillRect(gr() * W, gr() * H, 2, 2 + gr() * 6); } ctx.restore();
        if (sepia) { ctx.save(); ctx.globalAlpha = 0.25; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; const sx = 200 + gr() * 680; ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx + 6, H); ctx.stroke(); ctx.restore(); }
        vignette(0.6);
        ['l', 'r'].forEach((side) => { const x = side === 'l' ? 0 : W - 90; ctx.fillStyle = '#0b0b0b'; ctx.fillRect(x, 0, 90, H); const off = (t * 220) % 120; for (let y = -120 + off; y < H; y += 120) { ctx.fillStyle = '#e8e2d0'; rr(ctx, x + 25, y, 40, 60, 8); ctx.fill(); } });
        ctx.save(); ctx.globalAlpha = 0.5; vgrad([[0, 'rgba(0,0,0,0.75)'], [0.4, 'rgba(0,0,0,0)']]); ctx.restore();
        hook(lines, 430, 104, a + 0.05, t, { hl: sepia ? '#f3d38a' : P.lime, font: HEAD });
        if (!sepia && LABEL[key]) labelPill(key, 120, 1150, { alpha: prog(t, a + 0.3, a + 0.6) });
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { accent: '#f3d38a', stripKeys: c.strip });
    },
  };
}
spot({ id: 'W11', title: 'In my day', slug: 'in-my-day', dur: 15, run: 'nov', series: 'More concepts', music: 644,
  persona: 'Grandparents 55+ with grandchildren', angle: 'Grandparents show the grandchildren the tech they grew up with, then the lasers', style: 'Sepia film strip with grain and sprocket holes over retro tech, bursting into full colour',
  hook: '"In my day, phones had dials." on sepia film',
  meta: { headline: 'In my day, phones had dials', primary: primary('In my day, phones had dials, radios were furniture and cameras had film.', 'Show the grandchildren the old telephones, radios and cameras, then the laser room and heat vision. All indoors at Explorazone, Bowthorpe, Norwich.') } },
  filmFmt, { segs: [['telephones', ['In my day,', 'phones had _dials._'], 0, true], ['radios', ['Radios were', '_furniture._'], 2.3, true], ['cameras', ['Cameras', 'had _film._'], 4.3, true], ['laser_room', ['Now?', '_Lasers._'], 6.3, false], ['heat', ['And _heat vision._'], 8.0, false], ['typewriters', ['Show them', '_both._'], 9.7, true]], end: ['In my day...', '_and theirs._'], strip: ['telephones', 'radios', 'cameras', 'laser_room', 'heat', 'typewriters'] });

// W12 and W45 Big-number price -------------------------------------------------------------
function bigNumFmt(c) {
  let tc = null, fr = null;
  return {
    setup() { tc = makeCanvas(W, 700); },
    frame(t) {
      const E = endAt(c.dur), X = c.cardsAt ?? 2.7;
      if (t < E + 0.4) {
        if (c.grey) { vgrad([[0, '#8d97a3'], [1, '#3c4552']]); for (let k = 0; k < 8; k++) { const x = ((k * 300 + t * 70) % (W + 800)) - 400, y = 240 + (k % 4) * 330; const g2 = ctx.createRadialGradient(x, y, 0, x, y, 460); g2.addColorStop(0, 'rgba(225,230,236,0.35)'); g2.addColorStop(1, 'rgba(225,230,236,0)'); ctx.fillStyle = g2; ctx.fillRect(x - 460, y - 460, 920, 920); } } else vgrad([[0, '#2440d6'], [1, '#101f7a']]);
        if (t < X + 0.3) {
          const k = easeOutBack(prog(t, c.numAt ?? 0.15, (c.numAt ?? 0.15) + 0.5), 1.3), out2 = prog(t, X, X + 0.3);
          const g = tc.getContext('2d'); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, 700);
          g.font = `800 520px ${HEAD}`; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillStyle = '#fff'; g.fillText(c.num, 540, 560);
          g.globalCompositeOperation = 'source-in'; const img = IMG[c.fillKey], s = Math.max(W / img.width, 700 / img.height) * (1.1 + 0.1 * prog(t, 0, X)); g.drawImage(img, (W - img.width * s) / 2, (700 - img.height * s) / 2, img.width * s, img.height * s);
          ctx.save(); ctx.globalAlpha = 1 - out2; ctx.translate(540, 920); ctx.scale(k, k); ctx.translate(-540, -350);
          ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 40; ctx.drawImage(tc, 0, 0); ctx.restore();
          ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.font = `800 520px ${HEAD}`; ctx.textAlign = 'center'; ctx.strokeText(c.num, 540, 560); ctx.restore();
          c.beats.forEach(([lines, a, b], i) => { if (t >= a && t < b) hook(lines, 430, 100, a, t, { hl: P.lime, color: '#fff', shadow: 'rgba(0,0,0,0.5)' }); });
          chipsRow(c.chips, 1205, 1.3, t, { bg: P.lime, fg: P.ink, size: 44, alpha: 1 - out2 });
        } else {
          c.cards.forEach((key, i) => { const a = X + 0.2 + i * 0.35; card(key, 70 + i * 180, 580 + i * 280, 760, 400, { alpha: easeOutCubic(prog(t, a, a + 0.3)), zoom: 1.06 }); });
          hook(c.mid, 430, 100, X + 0.1, t, { hl: P.lime, color: '#fff', shadow: 'rgba(0,0,0,0.5)' });
        }
        if (t < X + 0.3) photoStrip(t, 1395, 470, { keys: c.strip });
        brandTop();
      }
      endScene(t, E, c.end, c.grey ? 'navy' : 'royal', { stripKeys: c.strip });
    },
  };
}
spot({ id: 'W12', title: '£36. Three of you.', slug: 'thirty-six-three', dur: 8, run: 'nov', series: 'More concepts', music: 849, ring: true,
  persona: 'Parents 25 to 44, price-conscious families of three', angle: 'The price is the headline: £36 gets three in', style: 'Giant £36 filled with a venue photo, price chips, then two photo cards',
  hook: 'Giant "£36" filled with the light-up floor',
  meta: { headline: '£36 for three tickets', primary: primary('£36. Three of you. That is the whole maths.', 'The light-up floor and robot waiters, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  bigNumFmt, { num: '£36', fillKey: 'floor2', beats: [[['£36.'], 0.1, 0.9], [['Three of you.', '_Two tickets._'], 0.9, 3.0]], chips: ['3 for £36', '6 for £72', '9 for £108'], mid: ['Three of you.', '_Sorted._'], cards: ['floor2', 'robot2'], end: ['£36.', '_Three of you._'], strip: ['floor2', 'robot2', 'laser_room', 'heat', 'infinity_floor', 'roses'] });
spot({ id: 'W45', title: 'January maths', slug: 'january-maths', dur: 8, run: 'jan', series: 'More concepts', music: 1029,
  persona: 'Parents 25 to 44, January budgets', angle: 'Grey, dark, skint January: three get in for the price of two', style: 'Grey drifting clouds behind a giant £36 filled with the infinity floor',
  hook: '"Grey. Dark. January." then a giant £36',
  meta: { headline: 'January maths: £36 for three', primary: primary('Grey. Dark. January. And the bank balance agrees.', 'Three tickets for £36: the infinity floor and the space-time tunnel, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  bigNumFmt, { grey: true, num: '£36', fillKey: 'infinity_floor', numAt: 0.9, beats: [[['Grey. Dark.', '_January._'], 0.05, 1.3], [['Three of you:', '_£36._'], 1.3, 3.0]], chips: ['3 for £36', '6 for £72'], mid: ['January,', '_brightened._'], cards: ['infinity_floor', 'tunnel'], end: ['January maths:', '_£36 for three._'], strip: ['infinity_floor', 'tunnel', 'laser_room', 'roses', 'heat', 'dodeca'] });

// W14 Outside vs inside --------------------------------------------------------------------
function splitFmt(c) {
  let rc = null;
  return {
    setup() { rc = makeCanvas(W, H); },
    frame(t) {
      const E = endAt(c.dur), M = c.mergeAt ?? 3.2;
      if (t < E + 0.4) {
        const split = lerp(540, 0, easeInOutCubic(prog(t, M, M + 0.7)));
        const seg = c.inside.findIndex(([, a], i) => t >= a && (i === c.inside.length - 1 || t < c.inside[i + 1][1])), key = c.inside[Math.max(0, seg)][0];
        heroPhoto(key, t, 0, E);
        if (split > 1) {
          const g = rc.getContext('2d'); g.clearRect(0, 0, W, H); rainScene(g, t); g.fillStyle = 'rgba(120,130,140,0.35)'; g.fillRect(0, 0, W, H);
          ctx.save(); ctx.beginPath(); ctx.rect(0, 0, split, H); ctx.clip(); ctx.filter = 'grayscale(1)'; ctx.drawImage(rc, 0, 0); ctx.filter = 'none'; ctx.restore();
          ctx.fillStyle = '#fff'; ctx.fillRect(split - 5, 0, 10, H);
          T('OUTSIDE', split / 2, 640, { size: 46, w: 800, color: '#fff', ls: 6, alpha: clamp(split / 400) });
          T(c.outside, split / 2, 720, { size: 40, w: 600, color: '#dfe6ee', alpha: clamp(split / 400) });
          T('INSIDE', split + (W - split) / 2, 640, { size: 46, w: 800, color: P.lime, ls: 6, shadow: 'rgba(0,0,0,0.6)' });
        }
        shade(0.7, 0, 0.36);
        if (t < M) hook(c.hook, 430, 100, 0.1, t, { hl: P.lime }); else hook(c.mid, 430, 100, M + 0.4, t, { hl: P.lime });
        if (t > M + 0.6 && LABEL[key]) labelPill(key, 70, 1150, { alpha: prog(t, c.inside[Math.max(0, seg)][1], c.inside[Math.max(0, seg)][1] + 0.3) || prog(t, M + 0.6, M + 0.9) });
        brandTop();
      }
      endScene(t, E, c.end, 'photo', { key: c.inside[c.inside.length - 1][0], stripKeys: c.strip });
    },
  };
}
spot({ id: 'W14', title: 'Outside vs inside', slug: 'outside-vs-inside', dur: 12, run: 'nov', series: 'More concepts', music: 474,
  persona: 'Three generations, grey November days', angle: 'Grey drizzle on one side, neon colour on the other; inside wins', style: 'Split screen: grey rain versus colourful rooms, the divider slides until inside takes over',
  hook: '"Outside: drizzle. Inside:" on a split screen',
  meta: { headline: 'Outside: drizzle. Inside: this', primary: primary('Outside: 6 degrees and drizzle. Inside: the infinity floor.', 'Lava lamps, the garden of light and the laser jungle too, all indoors at Explorazone, Bowthorpe, Norwich. One day out for all three generations.') } },
  splitFmt, { outside: '6°C, drizzle', hook: ['Outside: drizzle.', '_Inside:_'], mid: ['All three generations:', '_inside._'], inside: [['infinity_floor', 0], ['lava_lamp', 5.2], ['roses', 6.6], ['jungle2', 7.6]], end: ['Outside: drizzle.', '_Inside: this._'], strip: ['infinity_floor', 'lava_lamp', 'roses', 'jungle2', 'laser_room', 'heat'] });

// W15 Bored-o-meter (stopwatch) --------------------------------------------------------------
function stopwatchFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), X = c.boredAt ?? 2.0;
      if (t < E + 0.4) {
        if (t < X + 0.6) {
          vgrad([[0, '#2b2f3a'], [1, '#14161c']]);
          const secs = Math.floor(lerp(0, 299, easeInCubic(prog(t, 0.1, X)))); const mm = String(Math.floor(secs / 60)).padStart(2, '0'), ss = String(secs % 60).padStart(2, '0');
          ctx.save(); ctx.translate(540, 900); ctx.fillStyle = '#f4f4f5'; ctx.beginPath(); ctx.arc(0, 0, 320, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#d4d4d8'; ctx.fillRect(-40, -390, 80, 70); ctx.fillRect(-70, -410, 140, 30);
          for (let i = 0; i < 60; i++) { ctx.save(); ctx.rotate(i * Math.PI / 30); ctx.fillStyle = '#27272a'; ctx.fillRect(-2, -300, 4, i % 5 ? 18 : 36); ctx.restore(); }
          ctx.save(); ctx.rotate((secs % 60) / 60 * Math.PI * 2); ctx.fillStyle = '#ef4720'; ctx.fillRect(-4, -280, 8, 300); ctx.restore(); ctx.fillStyle = '#27272a'; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          T(`${mm}:${ss}`, 540, 1010, { size: 90, w: 800, fam: '"Courier Prime", monospace', color: '#111' });
          hook(c.hook, 430, 92, 0.05, t, { hl: '#ff9f0a' });
          if (t > X) noteItem({ type: 'stamp', text: 'BORED.', x: 540, y: 1160, rot: -0.1, at: X, color: '#ef4720', size: 72 }, t);
        } else {
          heroPhoto(c.cards[0], t, X + 0.6, E, { cy: 820 }); shade(0.75, 0, 0.36);
          if (c.cards[1]) card(c.cards[1], 60, 1000, 460, 260, { alpha: easeOutCubic(prog(t, X + 1.2, X + 1.5)), zoom: 1.06 });
          labelPill(c.cards[0], 600, 1060, { alpha: prog(t, X + 0.8, X + 1.1) });
          hook(c.mid, 430, 100, X + 0.6, t, { hl: P.lime });
        }
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { stripKeys: c.strip });
    },
  };
}
spot({ id: 'W15', title: 'Bored-o-meter', slug: 'bored-o-meter', dur: 8, run: 'nov', series: 'More concepts', music: 9,
  persona: 'Parents 25 to 44 with children aged 6 to 12', angle: 'At home they are bored in under five minutes; here the microscopes keep them going', style: 'Stopwatch racing to 04:59 with a BORED stamp, then microscopes and fossils',
  hook: 'Stopwatch: "Time until ‘I’m bored’" hits 04:59',
  meta: { headline: 'Bored in five minutes?', primary: primary('Time until "I am bored" at home: four minutes, fifty-nine seconds.', 'Microscopes and real fossils to get hands-on with, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  stopwatchFmt, { hook: ["Time until", "_'I'm bored':_"], mid: ['Here?', '_Not a chance._'], cards: ['microscope', 'fossils'], end: ['Bored?', '_Not in here._'], strip: ['microscope', 'fossils', 'crystals', 'lab3', 'laser_room', 'heat'] });

// W16 True or false? (quiz) ------------------------------------------------------------------
function quizFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), n = c.qs.length, step = (E - 0.2) / n;
      if (t < E + 0.4) {
        vgrad([[0, '#6d28d9'], [1, '#1e1b4b']]); photoStrip(t, 1395, 470, { keys: c.strip });
        const i = Math.min(n - 1, Math.floor(t / step)), a = i * step, [q, ans, key] = c.qs[i];
        const inK = easeOutCubic(prog(t, a, a + 0.35)), outK = easeInCubic(prog(t, a + step - 0.3, a + step));
        ctx.save(); ctx.translate((1 - inK) * 1100 - outK * 1100, 0); ctx.rotate((outK - (1 - inK)) * 0.05);
        glassCard(70, 520, 940, 720, { fill: '#fff', r: 44 });
        T(`QUESTION ${i + 1} OF ${n}`, 540, 600, { size: 28, w: 800, color: '#7c3aed', ls: 4 });
        wrap(q, 820, 64, 800).forEach((ln, j) => T(ln, 540, 690 + j * 76, { size: 64, w: 800, fam: HEAD, color: '#111' }));
        const rev = prog(t, a + step * 0.45, a + step * 0.45 + 0.3);
        if (rev <= 0) { pill(330, 1150, 'TRUE', { size: 46, bg: '#16a34a', fg: '#fff' }); pill(750, 1150, 'FALSE', { size: 46, bg: '#dc2626', fg: '#fff' }); }
        else { photo(IMG[key], 110, 850, 860, 360, { radius: 24, alpha: rev }); noteItem({ type: 'stamp', text: ans, x: 540, y: 1030, rot: -0.12, at: a + step * 0.45, color: ans === 'TRUE' ? '#16a34a' : '#dc2626', size: 90 }, t); if (LABEL[key]) labelPill(key, 130, 1170, { alpha: rev }); }
        ctx.restore();
        hook(c.hook, 400, 96, 0.05, t, { hl: P.yellow });
        brandTop();
      }
      endScene(t, E, c.end, 'royal', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W16', title: 'True or false?', slug: 'true-or-false', dur: 12, run: 'nov', series: 'More concepts', music: 670,
  persona: 'Families with children aged 7 to 11', angle: 'A quick quiz that proves science is not boring', style: 'Swipe quiz cards with TRUE and FALSE buttons, answer stamps and photos',
  hook: 'Quiz card: "True or false: science is boring."',
  meta: { headline: 'True or false: science is boring', primary: primary('True or false: science is boring. False. You can see heat, and you can walk through a maze of lasers.', 'The plasma ball, heat vision and the laser room, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  quizFmt, { hook: ['True', '_or false?_'], qs: [['Science is boring.', 'FALSE', 'plasma'], ['You can see heat.', 'TRUE', 'heat'], ['You can walk through a maze of lasers.', 'TRUE', 'laser_room']], end: ['Science? Boring?', '_False._'], strip: ['plasma', 'heat', 'laser_room', 'lab3', 'sky_maze2', 'robot2'] });

// W18 Pockets full of conkers (specimen labels) --------------------------------------------------
function specimenFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), n = c.items.length, step = (E - 0.3) / n;
      if (t < E + 0.4) {
        vgrad([[0, '#1a1a1a'], [1, '#0a0a0a']]); const gr = rng(3); ctx.save(); for (let k = 0; k < 600; k++) { ctx.fillStyle = `rgba(255,255,255,${gr() * 0.03})`; ctx.fillRect(gr() * W, gr() * H, 2, 2); } ctx.restore();
        const i = Math.min(n - 1, Math.floor(t / step)), a = i * step, [key, name, found, level] = c.items[i];
        const k = easeOutCubic(prog(t, a, a + 0.4)), o = 1 - prog(t, a + step - 0.25, a + step);
        ctx.save(); ctx.globalAlpha = k * o;
        if (key === 'conker') { ctx.save(); ctx.translate(540, 800); const g = ctx.createRadialGradient(-60, -60, 10, 0, 0, 230); g.addColorStop(0, '#b0602a'); g.addColorStop(1, '#4a2410'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, 230, 210, 0.2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#d9c3a0'; ctx.beginPath(); ctx.ellipse(-30, -150, 90, 50, 0.1, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.ellipse(-90, -40, 40, 70, -0.5, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
        else { ctx.save(); ctx.shadowColor = 'rgba(255,240,200,0.25)'; ctx.shadowBlur = 60; photo(IMG[key], 90, 520, 900, 560, { radius: 12, zoom: 1.06 + 0.04 * prog(t, a, a + step) }); ctx.restore(); }
        ctx.save(); ctx.translate(540, 1165); ctx.rotate(-0.015); ctx.fillStyle = '#f3ead5'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 20; ctx.fillRect(-380, -110, 760, 220); ctx.restore();
        const TW = '"Special Elite", "Courier New", monospace';
        T(`SPECIMEN ${i + 1}: ${name}`, 190, 1112, { size: 40, w: 400, fam: TW, color: '#1f1f1f', align: 'left' });
        T(`Found: ${found}`, 190, 1166, { size: 34, w: 400, fam: TW, color: '#3f3f3f', align: 'left' });
        T(`Excitement: ${level}`, 190, 1220, { size: 34, w: 400, fam: TW, color: level.includes('HIGH') ? '#c0271b' : '#3f3f3f', align: 'left' });
        ctx.restore();
        if (t < step) hook(c.hook, 400, 96, 0.05, t, { hl: '#f3d38a' }); else hook(c.mid, 400, 96, step, t, { hl: '#f3d38a' });
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { accent: '#f3d38a', stripKeys: c.strip });
    },
  };
}
spot({ id: 'W18', title: 'Pockets full of conkers', slug: 'pockets-full-of-conkers', dur: 12, run: 'nov', series: 'More concepts', music: 621,
  persona: 'Curious children aged 6 to 11 and their parents', angle: 'Upgrade from conkers to crystals, fossils and microscopes', style: 'Museum specimen labels on black velvet: a conker, then crystals, fossils and microscopes',
  hook: '"Pockets full of conkers?" with a museum label',
  meta: { headline: 'From conkers to crystals', primary: primary('Pockets full of conkers? Time for an upgrade.', 'Rocks and crystals, real fossils and microscopes, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  specimenFmt, { hook: ['Pockets full', 'of _conkers?_'], mid: ['Time for', 'an _upgrade._'], items: [['conker', 'Conker', 'the park', 'low'], ['crystals', 'Crystals', 'Explorazone', 'VERY HIGH'], ['fossils', 'Fossils', 'Explorazone', 'VERY HIGH'], ['microscope', 'Microscope', 'Explorazone', 'OFF THE SCALE']], end: ['From conkers', '_to crystals._'], strip: ['crystals', 'fossils', 'microscope', 'lab3', 'laser_room', 'heat'] });

// W34 Cracker joke ------------------------------------------------------------------------------
function crackerFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), P0 = c.popAt ?? 1.0;
      if (t < E + 0.4) {
        festiveBg(t, 'green');
        const pull = easeOutCubic(prog(t, P0, P0 + 0.35)) * 160, sh = t < P0 ? Math.sin(t * 40) * 6 * prog(t, 0.4, P0) : 0;
        [[-1, '#c22c1c'], [1, '#c22c1c']].forEach(([s, col]) => {
          ctx.save(); ctx.translate(540 + s * (pull + 10) + sh * s, 1300); ctx.rotate(s * pull * 0.0012);
          ctx.fillStyle = col; ctx.fillRect(s > 0 ? 0 : -240, -60, 240, 120); ctx.fillStyle = '#e9b949'; ctx.fillRect(s > 0 ? 40 : -60, -60, 20, 120);
          ctx.beginPath(); ctx.moveTo(s * 240, -60); ctx.lineTo(s * 330, -90); ctx.lineTo(s * 330, 90); ctx.lineTo(s * 240, 60); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
          ctx.restore();
        });
        if (t > P0) { confetti2D(540, 1300, t - P0); noteItem({ type: 'stamp', text: 'SNAP!', x: 540, y: 1180, rot: 0.08, at: P0, color: '#e9b949', size: 64 }, t * 1 + 0); }
        const up = easeOutBack(prog(t, P0 + 0.3, P0 + 0.9));
        if (up > 0) {
          ctx.save(); ctx.translate(540, lerp(1300, 820, up)); ctx.rotate(-0.03); ctx.scale(up, up);
          ctx.fillStyle = '#fffdf4'; ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 30; ctx.fillRect(-420, -220, 840, 440); ctx.shadowColor = 'transparent';
          const TW = '"Special Elite", "Courier New", monospace';
          wrap(c.q, 740, 44, 400).forEach((ln, i) => T(ln, -380, -130 + i * 56, { size: 44, w: 400, fam: TW, color: '#1f1f1f', align: 'left', alpha: prog(t, P0 + 0.8, P0 + 1.0) }));
          wrap(c.a, 740, 52, 400).forEach((ln, i) => T(ln, -380, 70 + i * 64, { size: 52, w: 400, fam: TW, color: '#c0271b', align: 'left', alpha: prog(t, c.answerAt, c.answerAt + 0.3) }));
          ctx.restore();
        }
        hook(c.hook, 400, 96, 0.05, t, { hl: P.yellow });
        if (t > c.answerAt + 0.6) c.cards.forEach((key, i) => { const a = c.answerAt + 0.6 + i * 0.3; card(key, 70 + i * 490, 1380, 450, 360, { alpha: easeOutCubic(prog(t, a, a + 0.3)), label: false }); });
        brandTop();
      }
      endScene(t, E, c.end, 'green', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W34', title: 'Cracker joke', slug: 'cracker-joke', dur: 8, run: 'xmas', series: 'Christmas', music: 944,
  persona: 'Friends and family groups of three to nine', angle: 'The only cracker joke worth reading: three tickets, two prices', style: 'A Christmas cracker snaps with confetti and the paper joke unfolds',
  hook: 'A cracker snaps: "Cracker joke of the year:"',
  meta: { headline: 'Three tickets, two prices', primary: primary('Cracker joke of the year. What do you call three tickets for £36? Christmas maths.', 'Bring the whole group, up to nine: the laser room and infinity lights, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  crackerFmt, { hook: ['Cracker joke', '_of the year:_'], q: 'Q: What do you call 3 tickets for £36?', a: 'A: Christmas maths.', answerAt: 2.6, cards: ['laser_room', 'dodeca'], end: ['Three tickets.', '_Two prices._'], strip: ['laser_room', 'dodeca', 'robot2', 'heat', 'roses', 'infinity_floor'] });

// W38 What day is it? ----------------------------------------------------------------------------
function dayFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), X = c.planAt ?? 2.6;
      if (t < E + 0.4) {
        vgrad([[0, '#fde68a'], [1, '#f59e0b']]); photoStrip(t, 1395, 470, { keys: c.strip });
        if (t < X) {
          const i = Math.floor(t / 0.28) % c.days.length, wob = Math.sin(t * 9) * 0.05;
          ctx.save(); ctx.translate(540, 900); ctx.rotate(wob); ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 30; rr(ctx, -330, -260, 660, 540, 30); ctx.fill(); ctx.shadowColor = 'transparent';
          ctx.fillStyle = '#ef4720'; rr(ctx, -330, -260, 660, 150, 30); ctx.fill(); ctx.fillRect(-330, -160, 660, 50);
          T(c.days[i], 0, -160, { size: 64, w: 800, fam: HEAD, color: '#fff' }); T('??', 0, 170, { size: 260, w: 800, fam: HEAD, color: '#111' });
          ctx.restore();
          hook(c.hook, 430, 92, 0.05, t, { color: P.ink, hl: '#c0271b', shadow: false });
        } else {
          mosaic(t, c.cards, X + 0.1, { y: 580 });
          hook(c.mid, 430, 96, X, t, { color: P.ink, hl: '#c0271b', shadow: false });
        }
        brandTop();
      }
      endScene(t, E, c.end, 'cream', { stripKeys: c.strip });
    },
  };
}
spot({ id: 'W38', title: 'What day is it?', slug: 'what-day-is-it', dur: 8, run: 'post', series: 'More concepts', music: 2, ring: true,
  persona: 'Parents 25 to 44, between Christmas and New Year', angle: 'Nobody knows what day it is, but the plan is clear', style: 'A desk calendar spinning through random days, then a 2x2 photo grid',
  hook: '"Nobody knows what day it is." with a spinning calendar',
  meta: { headline: 'What day is it? Who cares.', primary: primary('Between Christmas and New Year nobody knows what day it is. Monday? Thursday? Sunday?', 'We do know the plan: the sky maze, robot waiters, heat vision and the infinity floor, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  dayFmt, { days: ['MONDAY', 'THURSDAY', 'SUNDAY', 'TUESDAY', 'FRIDAY', 'WEDNESDAY', 'SATURDAY'], hook: ['Nobody knows', '_what day it is._'], mid: ['But we know', '_the plan._'], cards: ['sky_maze2', 'robot2', 'heat', 'infinity_floor'], end: ['Any day.', '_This plan._'], strip: ['sky_maze2', 'robot2', 'heat', 'infinity_floor', 'laser_room', 'roses'] });

// W44 Saturday timetable (chalkboard) -------------------------------------------------------------
function chalkFmt(c) {
  let bd = null;
  return {
    setup() { bd = makeCanvas(W, H); const g = bd.getContext('2d'), r = rng(8); g.fillStyle = '#7a4a26'; g.fillRect(0, 0, W, H); g.fillStyle = '#2f4a3a'; g.fillRect(40, 300, W - 80, 1000); for (let i = 0; i < 5000; i++) { g.fillStyle = `rgba(255,255,255,${r() * 0.035})`; g.fillRect(40 + r() * (W - 80), 300 + r() * 1000, 2 + r() * 6, 1 + r() * 2); } g.fillStyle = '#5c3519'; g.fillRect(40, 1300, W - 80, 30); g.fillStyle = '#f5f5f5'; g.fillRect(700, 1286, 70, 16); },
    frame(t) {
      const E = endAt(c.dur);
      if (t < E + 0.4) {
        ctx.drawImage(bd, 0, 0); photoStrip(t, 1420, 450, { keys: c.strip, borderColor: '#e9dcc4' });
        c.lines.forEach(([txt, at, size, col], i) => writeH(txt, 90, 400 + i * 120 + (i ? 30 : 0), t, at, at + txt.length * 0.04, { fam: HAND, size: size ?? 70, color: col ?? 'rgba(250,250,245,0.92)' }));
        c.pics.forEach(([key, at], i) => { const p = prog(t, at, at + 0.35); if (p > 0) polaroidAt(IMG[key], 840, 560 + i * 330, 240, (i % 2 ? 0.08 : -0.06), '', p); });
        brandTop();
      }
      endScene(t, E, c.end, 'green', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W44', title: 'Saturday timetable', slug: 'saturday-timetable', dur: 12, run: 'jan', series: 'More concepts', music: 514,
  persona: 'Friends and family groups, first weekend back at school', angle: 'A Saturday timetable where every lesson is fun', style: 'Chalkboard timetable written in chalk with pinned photos',
  hook: 'Chalk on a blackboard: "Saturday’s timetable"',
  meta: { headline: 'Saturday’s timetable', primary: primary('Saturday timetable. Physics: the laser room. Geography: the AR sandbox. History: fossils. Homework: none.', 'All indoors at Explorazone, Bowthorpe, Norwich. Bring the whole group, up to nine.') } },
  chalkFmt, { lines: [["Saturday's timetable", 0.05, 76, '#ffe14d'], ['Physics: lasers', 1.2], ['Geography: sandbox', 2.3], ['History: fossils', 3.4], ['Chemistry: the lab', 4.5], ['Homework: none!', 5.7, 74, '#b6f542']], pics: [['laser_room', 2.0], ['sandbox', 3.1], ['fossils', 4.2]], end: ['Saturday’s', '_timetable._'], strip: ['laser_room', 'sandbox', 'fossils', 'lab3', 'heat', 'robot2'] });

// W47 Family tree ----------------------------------------------------------------------------------
function treeFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur);
      if (t < E + 0.4) {
        vgrad([[0, '#fbf5e8'], [1, '#efe3cc']]);
        const trunk = new Path2D('M540 1900 C 530 1600, 560 1400, 540 1200 M540 1300 C 450 1150, 300 1050, 270 900 M540 1300 C 630 1150, 780 1050, 810 900 M540 1200 C 540 1000, 540 820, 540 640');
        strokeReveal(trunk, prog(t, 0.0, 1.0), { color: '#7a4a26', w: 26, len: 3000 });
        c.nodes.forEach(([name, x, y, at, free]) => {
          const p = easeOutBack(prog(t, at, at + 0.4)); if (p <= 0) return;
          ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.fillStyle = free ? P.red : P.navy; ctx.beginPath(); ctx.arc(0, 0, 120, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.stroke();
          T(name, 0, 18, { size: 54, w: 800, fam: HEAD, color: '#fff' }); ctx.restore();
          const tp = prog(t, at + 0.5, at + 0.8); if (tp > 0) pill(x, y + 160, free ? 'FREE' : '£18', { size: 40, bg: free ? P.lime : '#fff', fg: P.ink, scale: easeOutBack(tp), alpha: tp, border: free ? 0 : 3, borderColor: P.ink });
        });
        c.leaves.forEach(([key, x, y, at]) => { const p = easeOutBack(prog(t, at, at + 0.4)); if (p <= 0) return; ctx.save(); ctx.beginPath(); ctx.arc(x, y, 130 * p, 0, Math.PI * 2); ctx.clip(); photo(IMG[key], x - 130, y - 130, 260, 260, {}); ctx.restore(); ctx.save(); ctx.strokeStyle = '#3f8f4f'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(x, y, 130 * p, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); });
        const hi = c.hooks.filter((h) => t >= h[0]).pop(); if (hi) hook(hi[1], 400, 96, hi[0], t, { color: P.ink, hl: P.red, shadow: false });
        brandTop();
      }
      endScene(t, E, c.end, 'cream', { stripKeys: c.strip });
    },
  };
}
spot({ id: 'W47', title: 'Family tree', slug: 'family-tree', dur: 15, run: 'jan', series: 'More concepts', music: 801,
  persona: 'Three generations together', angle: 'Nan and Mum pay, the youngest branch of the family tree goes free', style: 'A family tree grows; name circles get ticket tags; venue photos grow as leaves',
  hook: 'A family tree draws: "Nan + Mum + me"',
  meta: { headline: 'Three generations, two tickets', primary: primary('Nan plus Mum plus me: three branches of the family tree, two tickets. The third goes free.', 'Heat vision, the garden of light and robot waiters, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  treeFmt, { nodes: [['Nan', 270, 860, 0.9], ['Mum', 810, 860, 1.6], ['Me', 540, 700, 2.4, true]], leaves: [['heat', 180, 1180, 5.0], ['roses', 900, 1180, 5.5], ['robot2', 540, 1520, 6.0]], hooks: [[0.05, ['Nan + Mum', '_+ me._']], [3.6, ['Three generations.', '_Two tickets._']], [7.0, ['One day out', '_for the whole tree._']]], end: ['Three generations.', '_Two tickets._'], strip: ['heat', 'roses', 'robot2', 'laser_room', 'infinity_floor', 'dodeca'] });

// W48 Myth: nothing to do in January --------------------------------------------------------------
function mythFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), X = c.gridAt ?? 2.4;
      if (t < E + 0.4) {
        vgrad([[0, '#111827'], [1, '#030712']]);
        if (t < X + 0.3) {
          ctx.save(); ctx.globalAlpha = 1 - prog(t, X, X + 0.3);
          T('MYTH:', 540, 640, { size: 70, w: 800, color: '#9ca3af', ls: 8 });
          wrap(c.myth, 900, 96, 800).forEach((ln, i) => T(ln, 540, 790 + i * 110, { size: 96, w: 800, fam: HEAD, color: '#fff' }));
          noteItem({ type: 'stamp', text: 'BUSTED', x: 540, y: 900, rot: -0.18, at: 1.1, color: '#ef4720', size: 130 }, t);
          ctx.restore();
          hook(c.hook, 430, 80, 0.05, t, { hl: '#ef4720' });
        } else { mosaic(t, c.cards, X + 0.1, { y: 560 }); hook(c.mid, 430, 96, X, t, { hl: P.lime }); }
        photoStrip(t, 1460, 420, { keys: c.strip, alpha: 0.9 });
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { stripKeys: c.strip });
    },
  };
}
spot({ id: 'W48', title: 'Myth: nothing to do in January', slug: 'myth-nothing-to-do', dur: 8, run: 'jan', series: 'More concepts', music: 15, ring: true,
  persona: 'Friends and family groups, January weekends', angle: 'Busting the myth that there is nothing to do in January', style: 'Bold myth statement with a red BUSTED stamp, then a 2x2 photo grid',
  hook: '"MYTH: there’s nothing to do in January." stamped BUSTED',
  meta: { headline: 'Nothing to do in January? Busted', primary: primary('Myth: there is nothing to do in January. Busted.', 'The laser jungle, the AR sandbox, rocks and crystals and the light forest, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  mythFmt, { myth: 'Nothing to do in January.', hook: ['Myth _buster:_'], mid: ['January:', '_busted._'], cards: ['jungle2', 'sandbox2', 'crystals', 'light_pillars'], end: ['Nothing to do?', '_Busted._'], strip: ['jungle2', 'sandbox2', 'crystals', 'light_pillars', 'laser_room', 'heat'] });

// W50 New year, new worlds (portals) ---------------------------------------------------------------
function portalFmt(c) {
  const ST = (() => { const r = rng(17); return Array.from({ length: 160 }, () => ({ a: r() * 6.28, d: r(), s: 1 + r() * 2.5 })); })();
  return {
    frame(t) {
      const E = endAt(c.dur), n = c.worlds.length, step = (E - 0.2) / n;
      if (t < E + 0.4) {
        const i = Math.min(n - 1, Math.floor(t / step)), a = i * step, u = prog(t, a, a + step), [key] = c.worlds[i];
        if (i > 0) { heroPhoto(c.worlds[i - 1][0], t, a, a + step, { z0: 1.05 }); ctx.save(); ctx.globalAlpha = 0.45; fill('#050816'); ctx.restore(); } else { fill('#050816'); ST.forEach((s) => { const r2 = ((s.d + t * 0.25) % 1) * 1100; ctx.fillStyle = `rgba(255,255,255,${(r2 / 1100) * 0.9})`; ctx.beginPath(); ctx.arc(540 + Math.cos(s.a) * r2, 900 + Math.sin(s.a) * r2, s.s * (r2 / 600), 0, Math.PI * 2); ctx.fill(); }); }
        const R = lerp(260, 1300, easeInCubic(prog(u, 0.55, 1)));
        ctx.save(); ctx.beginPath(); ctx.arc(540, 900, R, 0, Math.PI * 2); ctx.clip(); heroPhoto(key, t, a, a + step, { z0: lerp(1.15, 1.0, u), dz: 0 }); ctx.restore();
        ctx.save(); ctx.strokeStyle = c.worlds[i][1]; ctx.lineWidth = 18; ctx.shadowColor = c.worlds[i][1]; ctx.shadowBlur = 50; for (let k = 0; k < 2; k++) { ctx.beginPath(); ctx.arc(540, 900, R + k * 26, t * 2 + k, t * 2 + k + Math.PI * 1.6); ctx.stroke(); } ctx.restore();
        if (LABEL[key]) pill(540, 1110, LABEL[key], { size: 34, bg: c.worlds[i][1], fg: P.ink, alpha: 1 - prog(u, 0.6, 0.8) });
        shade(0.65, 0, 0.3);
        const hi = c.hooks.filter((h) => t >= h[0]).pop(); if (hi) hook(hi[1], 400, 96, hi[0], t, { hl: P.lime });
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { stripKeys: c.strip });
    },
  };
}
spot({ id: 'W50', title: 'New year, new worlds', slug: 'new-year-new-worlds', dur: 15, run: 'jan', series: 'More concepts', music: 688,
  persona: 'Parents 25 to 44, New Year', angle: 'Start the year by stepping through glowing portals into new worlds', style: 'Zoom-through glowing portals, each opening on a different room',
  hook: 'A glowing portal opens in space: "New year. New worlds."',
  meta: { headline: 'New year. New worlds.', primary: primary('New year. New worlds to explore.', 'Step through the infinity floor, the space-time tunnel, the plasma ball and the laser room, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  portalFmt, { worlds: [['infinity_floor', P.lime], ['tunnel', P.teal], ['plasma', '#c084fc'], ['laser_room', P.yellow]], hooks: [[0.05, ['New year.', '_New worlds._']], [5.6, ['Step', '_right in._']]], end: ['New year.', '_New worlds._'], strip: ['infinity_floor', 'tunnel', 'plasma', 'laser_room', 'sky_maze2', 'heat'] });
