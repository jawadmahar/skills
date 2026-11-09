
// =====================================================================
// V01  The maths  (families, value)  light kinetic type + flipping tickets
// =====================================================================
function creamGrid() {
  fill(P.cream); ctx.save(); ctx.strokeStyle = 'rgba(22,34,63,0.06)'; ctx.lineWidth = 2;
  for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();
}
defineSpot({
  id: 'V01', title: 'The maths', dur: 10, persona: 'Families, value seekers (25 to 44)',
  angle: '3 tickets cost £54, this half term they cost £36', style: 'Light, typographic, flipping tickets',
  hook: '"3 tickets for half term?" with three £18 tickets sliding in',
  meta: { headline: '3 tickets for the price of 2', primary: 'Three tickets for half term? Pay for two. Buy 2 tickets at £18 each and the 3rd walks in free. That’s 3 for £36, 6 for £72 or 9 for £108. VR rides, laser mazes, robots and 15,000 sq ft of hands-on science in Bowthorpe, Norwich.\n\nHalf term: Fri 23 Oct to Sun 1 Nov. New customers only. Sign up to claim. Max 9 per group. T&Cs apply.' },
  setup() { tickets(); },
  frame(t) {
    creamGrid();
    const E = 6.4;
    if (t < E + 0.45) {
      ctx.save(); ctx.translate(0, (1 - easeOutCubic(prog(t, 0.6, 1.3))) * 200); photoStrip(t, 1395, 470, { labels: true, alpha: prog(t, 0.6, 1.1) }); ctx.restore();
      ticker(t, 140, { bg: P.navy, fg: P.cream });
      ctx.save(); ctx.globalAlpha = 1 - prog(t, E, E + 0.45);
      logo(72, 262, 250, 1, { align: 'left' });
      if (t < 3.55) words(['3 tickets', 'for half term?'], 470, 116, 0.15, t, { color: P.navy, alpha: 1 - prog(t, 3.2, 3.5) });
      if (t > 3.35) words(['Buy 2,', 'get the _3rd free._'], 470, 116, 3.45, t, { color: P.navy, hl: P.red });
      const TK = tickets(), xs = [235, 540, 845], rots = [-0.07, 0, 0.07];
      const tOut = 1 - prog(t, 4.45, 4.8);
      if (tOut > 0) {
        for (let i = 0; i < 3; i++) {
          const k = easeOutBack(prog(t, 0.7 + i * 0.22, 1.2 + i * 0.22));
          if (k <= 0) continue;
          const x = lerp(xs[i] + 900, xs[i], k), y = 830 - (i === 2 ? 14 * Math.sin(Math.PI * prog(t, 2.45, 3.0)) : 0);
          if (i === 2) flipTicket(TK.paid, TK.free, easeInOutCubic(prog(t, 2.45, 2.95)), x, y, 255, { rot: rots[i], alpha: tOut });
          else drawTicket(i ? TK.paid2 : TK.paid, x, y, 255, { rot: rots[i], alpha: tOut });
        }
        // sparkle burst on the free ticket
        const sp = prog(t, 2.9, 3.35);
        if (sp > 0 && sp < 1) {
          ctx.save(); ctx.strokeStyle = P.red; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.globalAlpha = (1 - sp) * tOut;
          for (let a = 0; a < 10; a++) { const ang = a / 10 * Math.PI * 2; const r1 = 200 + sp * 60, r2 = r1 + 50 * (1 - sp); ctx.beginPath(); ctx.moveTo(845 + Math.cos(ang) * r1, 830 + Math.sin(ang) * r1); ctx.lineTo(845 + Math.cos(ang) * r2, 830 + Math.sin(ang) * r2); ctx.stroke(); }
          ctx.restore();
        }
        // totals
        const k54 = easeOutBack(prog(t, 1.75, 2.05));
        if (k54 > 0) {
          const mv = easeInOutCubic(prog(t, 3.0, 3.35));
          const x54 = lerp(540, 330, mv);
          ctx.save(); ctx.globalAlpha = tOut * lerp(1, 0.45, mv);
          T('£54', x54, 1170, { size: 160 * lerp(0.6, 1, k54) * lerp(1, 0.8, mv), w: 800, fam: HEAD, color: P.navy });
          ctx.restore();
          const st = prog(t, 3.0, 3.22);
          if (st > 0) { ctx.save(); ctx.globalAlpha = tOut; ctx.strokeStyle = P.red; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x54 - 130, 1125); ctx.lineTo(x54 - 130 + 260 * st, 1105); ctx.stroke(); ctx.restore(); }
          const k36 = easeOutBack(prog(t, 3.2, 3.5));
          if (k36 > 0) T('£36', 720, 1180, { size: 190 * lerp(0.5, 1, k36), w: 800, fam: HEAD, color: P.red, alpha: tOut * clamp(k36 * 2) });
        }
      }
      // multiples
      const rows = COPY.maths;
      rows.forEach((r, i) => {
        const k = prog(t, 4.75 + i * 0.3, 5.05 + i * 0.3);
        if (k > 0) pill(540, 760 + i * 150, r, { size: 66, h: 124, padX: 60, bg: i === 0 ? P.red : P.navy, fg: i === 0 ? '#fff' : P.cream, alpha: k, scale: lerp(0.6, 1, easeOutBack(k)) });
      });
      T('Every 3rd ticket is free. Max 9 per group.', 540, 1200, { size: 38, w: 700, color: P.navy, alpha: prog(t, 5.7, 6.0) * 0.85 });
      ctx.restore();
    }
    if (t > E) endCard(t, E, { bg: creamGrid, headline: ['Half term,', '_sorted._'], fg: P.navy, accent: P.red, offerColor: P.red, chipBg: P.navy, chipFg: P.cream, ctaBg: P.red, ctaFg: '#fff', chipShadow: false });
  },
});

// =====================================================================
// V02  Rain check  (autumn weather, indoor)  rain on glass, hand wipe
// =====================================================================
let fogC = null;
defineSpot({
  id: 'V02', title: 'Let it rain', dur: 15, persona: 'Families, autumn weather (all ages)',
  angle: 'The half-term forecast is rain, Explorazone is warm, dry and glowing', style: 'Moody rain on glass, hand-wiped window reveal',
  hook: 'Rain streaming down a window with a 5-day "half-term forecast" of rain',
  meta: { headline: 'Rainy half term? Sorted.', primary: 'Half-term forecast: rain. Inside Explorazone: warm, dry and glowing. Six hours of the laser room, the garden of light and hands-on science, all indoors in Bowthorpe, Norwich.\n\nBuy 2 tickets at £18 each, the 3rd walks in free. 3 for £36. Half term: Fri 23 Oct to Sun 1 Nov. New customers only. Sign up to claim. Max 9 per group. T&Cs apply.' },
  setup() { fogC = makeCanvas(W, H); },
  frame(t) {
    const days = [['FRI', '23'], ['SAT', '24'], ['SUN', '25'], ['MON', '26'], ['TUE', '27']];
    if (t < 3.0) {
      rainScene(ctx, t);
      logo(72, 262, 250, 1, { align: 'left' });
      words(['Half-term', 'forecast:'], 440, 108, 0.15, t, { color: '#ffffff', shadow: 'rgba(0,0,0,0.5)' });
      words(['Rain.'], 760, 190, 0.8, t, { color: '#a9c4dc', shadow: 'rgba(0,0,0,0.5)' });
      days.forEach(([d, n], i) => {
        const k = easeOutCubic(prog(t, 1.2 + i * 0.1, 1.55 + i * 0.1)); if (k <= 0) return;
        const x = 92 + i * 182, y = 860 + (1 - k) * 60;
        ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(255,255,255,0.12)'; rr(ctx, x, y, 168, 230, 26); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
        T(d, x + 84, y + 50, { size: 28, w: 700, color: '#fff', alpha: k * 0.8, ls: 3 }); T(n, x + 84, y + 100, { size: 46, w: 800, color: '#fff', alpha: k });
        cloudIcon(x + 84, y + 150, 64, k);
      });
      T('Every. Single. Day.', 540, 1180, { size: 46, w: 700, color: '#fff', alpha: prog(t, 2.0, 2.3) * 0.85 });
    } else if (t < 5.0) {
      const z = 1.05 + 0.06 * prog(t, 3.0, 5.0);
      photo(IMG.tubes, 0, 0, W, H, { zoom: z, fx: 0.4 });
      const g = fogC.getContext('2d');
      g.globalCompositeOperation = 'source-over'; rainScene(g, t, { alpha: 0.8 });
      g.fillStyle = 'rgba(200,214,228,0.22)'; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'destination-out'; g.strokeStyle = '#000'; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 260;
      const p = easeInOutSine(prog(t, 3.0, 4.3)), N = 60; g.beginPath();
      for (let i = 0; i <= N * p; i++) { const u = i / N; const x = 540 + 360 * Math.sin(u * Math.PI * 3.2), y = 1250 - 900 * u; i ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
      const cr = easeInCubic(prog(t, 4.1, 4.8)) * 1500; if (cr > 0) { g.beginPath(); g.arc(540, 820, cr, 0, Math.PI * 2); g.fill(); }
      g.globalCompositeOperation = 'source-over';
      ctx.drawImage(fogC, 0, 0);
      ctx.save(); ctx.globalAlpha = prog(t, 3.6, 4.0); vgrad([[0, 'rgba(8,14,40,0.75)'], [0.38, 'rgba(8,14,40,0)']]); ctx.restore();
      logo(72, 262, 250, 1, { align: 'left' });
      words(['Inside:', 'warm, dry and _glowing._'], 440, 100, 3.7, t, { color: '#fff', hl: P.teal, shadow: 'rgba(0,0,0,0.55)' });
    } else if (t < 9.4) {
      const cards = [{ img: IMG.tubes, a: 5.0, b: 6.6, fx: 0.4 }, { img: IMG.laser_room, a: 6.6, b: 8.0, label: 'LASER ROOM', fx: 0.5 }, { img: IMG.roses, a: 8.0, b: 9.4, label: 'GARDEN OF LIGHT', fx: 0.5 }];
      cards.forEach((c) => { const a = win(t, c.a - 0.2, c.b + 0.2, 0.35); if (a > 0) bgPhoto(c.img, { alpha: a }); });
      ctx.save(); ctx.globalAlpha = 0.35; fill('#06102a'); ctx.restore();
      cards.forEach((c) => {
        if (t < c.a - 0.05 || t > c.b + 0.35) return;
        const kin = easeOutCubic(prog(t, c.a, c.a + 0.4)), kout = easeInCubic(prog(t, c.b, c.b + 0.35));
        const x = 40 + (c.a > 5.0 ? (1 - kin) * 1100 : 0) - kout * 1150;
        photo(c.img, x, 580, 1000, 820, { radius: 36, border: 6, borderColor: P.cream, zoom: 1 + 0.08 * prog(t, c.a, c.b), fx: c.fx, shadow: 'rgba(0,0,0,0.5)' });
        if (c.label) pill(x + 60 + measure(c.label, 32, 800) / 2 + 28, 1340, c.label, { size: 32, bg: P.lime, fg: P.ink, alpha: prog(t, c.a + 0.3, c.a + 0.5) });
      });
      logo(72, 262, 250, 1, { align: 'left' });
      if (t < 6.75) words(['Inside:', 'warm, dry and _glowing._'], 440, 100, 3.7, t, { color: '#fff', hl: P.teal, shadow: 'rgba(0,0,0,0.55)', alpha: 1 - prog(t, 6.4, 6.7) });
      if (t > 6.6) words(['Six hours of', '_hands-on science._'], 440, 100, 6.7, t, { color: '#fff', hl: P.teal, shadow: 'rgba(0,0,0,0.55)' });
    }
    if (t >= 9.2) endCard(t, 9.2, { bg: () => { rainScene(ctx, t, { drops: false, alpha: 0.6 }); ctx.save(); ctx.globalAlpha = 0.72; fill('#0d1a3a'); ctx.restore(); }, headline: ['Let it _rain._'], size: 130, fg: '#ffffff', accent: P.teal, offerColor: P.teal, chipBg: P.teal, chipFg: P.ink, ctaBg: P.red, ctaFg: '#fff' });
  },
});

// =====================================================================
// V04  Dear Nan & Grandad  (grandchildren POV)  handwritten letter
// =====================================================================
let paperC = null;
defineSpot({
  id: 'V04', title: 'Dear Nan & Grandad', dur: 12, persona: 'Grandparents, through the grandchild’s eyes',
  angle: 'A child’s half-term letter: if you buy 2 tickets, I go free', style: 'Handwritten notebook letter, polaroids and doodles',
  hook: 'A child’s handwriting: "Dear Nan & Grandad, it’s half term!!"',
  meta: { headline: 'Nan, Grandad and me. One goes free.', primary: '"Dear Nan & Grandad, it’s half term!! Can we PLEASE go to Explorazone? If you buy 2 tickets, I go FREE!!!"\n\nBuy 2 tickets at £18 each and the 3rd walks in free. The offer made for a party of three. VR, robots, mirror maze and 15,000 sq ft of hands-on science in Bowthorpe, Norwich. Half term: Fri 23 Oct to Sun 1 Nov. New customers only. Sign up to claim. T&Cs apply.' },
  setup() { paperC = makePaper(); },
  frame(t) {
    const E = 7.4; const slide = easeInCubic(prog(t, E, E + 0.6));
    if (t > E) endCard(t, E + 0.25, { bg: () => ctx.drawImage(paperC, 0, 0), headline: ['The offer made for', 'a party of _three._'], size: 100, strip: 'polaroids', stripKeys: ['laser_room', 'robot2', 'roses'], stripLabels: ['lasers!!', 'robots!!', 'wow'], tickerBg: '#253a8f', tickerFg: '#fff', fg: P.ink, accent: P.red, offerColor: P.red, chipBg: '#253a8f', chipFg: '#fff', ctaBg: P.red, ctaFg: '#fff', chipShadow: false });
    if (slide >= 1) return;
    ctx.save(); ctx.translate(0, -slide * H);
    ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 40; ctx.drawImage(paperC, 0, 0); ctx.shadowColor = 'transparent';
    // brand sticker
    ctx.save(); ctx.translate(880, 300); ctx.rotate(0.07); logo(0, -36, 260, 1, { box: true }); ctx.restore();
    writeLine('Dear Nan & Grandad,', 160, 468, t, 0.25, 1.25);
    writeLine('it’s half term!!', 160, 564, t, 1.3, 1.95);
    writeLine('Can we PLEASE go to', 160, 660, t, 2.0, 2.9);
    writeLine('Explorazone?', 160, 756, t, 2.9, 3.5, { size: 88 });
    writeLine('If you buy 2 tickets', 160, 852, t, 3.65, 4.55);
    writeLine('I go FREE!!!', 160, 956, t, 4.6, 5.25, { size: 110, color: '#e0362c', crayon: true });
    const ul = new Path2D(); ul.moveTo(170, 985); for (let x = 170; x <= 650; x += 20) ul.lineTo(x, 985 + Math.sin(x * 0.05) * 6); ul.moveTo(190, 1006); for (let x = 190; x <= 630; x += 20) ul.lineTo(x, 1006 + Math.cos(x * 0.06) * 5);
    strokeReveal(ul, prog(t, 5.25, 5.6), { len: 1100, w: 6 });
    writeLine('Love, me xx', 160, 1140, t, 5.75, 6.35);
    // stick figure doodle: Nan, Grandad and me
    const fig = (x, y, s) => { const p = new Path2D(); p.arc(x, y, 26 * s, 0, Math.PI * 2); p.moveTo(x, y + 26 * s); p.lineTo(x, y + 110 * s); p.moveTo(x - 46 * s, y + 60 * s); p.lineTo(x + 46 * s, y + 60 * s); p.moveTo(x, y + 110 * s); p.lineTo(x - 34 * s, y + 170 * s); p.moveTo(x, y + 110 * s); p.lineTo(x + 34 * s, y + 170 * s); return p; };
    strokeReveal(fig(690, 1035, 0.95), prog(t, 6.0, 6.45), { color: '#253a8f', w: 6, len: 900 });
    strokeReveal(fig(820, 1035, 1.0), prog(t, 6.15, 6.6), { color: '#253a8f', w: 6, len: 900 });
    strokeReveal(fig(935, 1085, 0.68), prog(t, 6.3, 6.75), { color: '#e0362c', w: 6, len: 700 });
    const lab = prog(t, 6.6, 6.9);
    T('Nan', 690, 1242, { size: 40, w: 700, fam: HAND, color: '#253a8f', alpha: lab }); T('Grandad', 820, 1242, { size: 40, w: 700, fam: HAND, color: '#253a8f', alpha: lab }); T('me!', 935, 1242, { size: 40, w: 700, fam: HAND, color: '#e0362c', alpha: lab });
    polaroidAt(IMG.laser_room, 930, 660, 270, 0.09, 'lasers!!', prog(t, 2.7, 3.1));
    polaroidAt(IMG.racing, 935, 960, 270, -0.07, 'VR!!!', prog(t, 3.5, 3.9));
    polaroidAt(IMG.robot2, 205, 1560, 340, -0.09, 'robots!!', prog(t, 5.9, 6.3));
    polaroidAt(IMG.sky_maze, 540, 1600, 340, 0.04, 'sky maze', prog(t, 6.15, 6.55));
    polaroidAt(IMG.roses, 875, 1555, 340, 0.1, 'so pretty', prog(t, 6.4, 6.8));
    ctx.restore();
  },
});

// =====================================================================
// V07  POV  (families, native Reels)  fast photo cuts, caption style
// =====================================================================
defineSpot({
  id: 'V07', title: 'POV: half term', dur: 10, persona: 'Parents 25 to 44, native Reels style',
  angle: 'POV montage: rainy half term, so you take them here', style: 'Fast cuts, handheld zooms, social captions',
  hook: '"POV: it’s half term and it’s raining again" over a glowing photo',
  meta: { headline: 'Half term, but make it science', primary: 'POV: it’s half term and it’s raining again. So you take them to Explorazone. VR racing sims. The laser room. The sky maze. The garden of light. Heat vision. Robot waiters. Six hours later they’re still going.\n\nBuy 2 tickets at £18 each, the 3rd walks in free. Half term: Fri 23 Oct to Sun 1 Nov, Bowthorpe, Norwich. New customers only. Sign up to claim. Max 9 per group. T&Cs apply.' },
  setup() {},
  frame(t) {
    const shots = [
      { img: IMG.tubes_purple, a: 0, b: 1.8, cap: ['POV: it\u2019s half term', 'and it\u2019s raining _again_'] },
      { img: IMG.racing, a: 1.8, b: 2.5, cap: ['so you take them here'] },
      { img: IMG.laser_room, a: 2.5, b: 3.1, cap: ['laser room'] },
      { img: IMG.sky_maze, a: 3.1, b: 3.7, cap: ['sky maze'] },
      { img: IMG.roses, a: 3.7, b: 4.3, cap: ['garden of light'] },
      { img: IMG.heat, a: 4.3, b: 4.9, cap: ['heat vision'] },
      { img: IMG.robot2, a: 4.9, b: 5.5, cap: ['robot waiters'] },
      { img: IMG.lab3, a: 5.5, b: 6.7, cap: ['6 hours later', 'they\u2019re _still_ going'] },
    ];
    const E = 6.7;
    const s = shots.find((x) => t >= x.a && t < x.b) || shots[shots.length - 1];
    if (t < E + 0.4) {
      const lt = t - s.a, punch = 0.14 * (1 - smooth(prog(lt, 0, 0.2)));
      const sx = 9 * Math.sin(t * 7.3) + 5 * Math.sin(t * 13.1), sy = 7 * Math.cos(t * 6.1) + 4 * Math.sin(t * 11.7);
      bgPhoto(s.img, { zoom: 1.1 });
      ctx.save(); ctx.translate(540 + sx, 1130 + sy); const z = 1 + punch + 0.06 * (lt / (s.b - s.a)); ctx.scale(z, z);
      photo(s.img, -560, -620, 1120, 1240, {}); ctx.restore();
      if (lt < 0.07 && s.a > 0) { ctx.save(); ctx.globalAlpha = 0.6 * (1 - lt / 0.07); fill('#fff'); ctx.restore(); }
      words(s.cap, 430, 76, s.a + 0.02, t, { fam: BODY, w: 800, color: '#fff', hl: P.lime, stroke: 12, strokeColor: '#000', stagger: s.cap.length > 1 ? 0.12 : 0.05, rise: 16 });
      logo(60, 262, 210, 1, { align: 'left', shadow: true });
    }
    if (t > E) endCard(t, E, { bg: () => { bgPhoto(IMG.lab3, { filter: 'blur(40px) brightness(0.4) saturate(1.2)' }); ctx.save(); ctx.globalAlpha = 0.55; fill(P.navy); ctx.restore(); }, headline: ['and the 3rd ticket', 'was _free._'], size: 104, fg: '#ffffff', accent: P.lime, offerColor: P.lime, chipBg: P.lime, chipFg: P.ink, ctaBg: P.red, ctaFg: '#fff' });
  },
});

// =====================================================================
// V08  £12 each  (value, punchy)  giant extruded number
// =====================================================================
function royalBg() { fill(P.royal); ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 26; for (let x = -H; x < W; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + H, H); ctx.stroke(); } ctx.restore(); }
function bigNumber(text, cx, by, size, k) {
  ctx.save(); ctx.translate(cx, by); const s = lerp(2.4, 1, easeOutBack(k, 1.2)); ctx.scale(s, s);
  ctx.font = `800 ${size}px ${HEAD}`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.globalAlpha = clamp(k * 3);
  for (let i = 20; i >= 1; i--) { const c = lerp(0, 1, i / 20); ctx.fillStyle = `rgb(${Math.round(lerp(196, 110, c))},${Math.round(lerp(150, 84, c))},${Math.round(lerp(10, 6, c))})`; ctx.fillText(text, i * 2.2, i * 2.2); }
  ctx.fillStyle = P.yellow; ctx.fillText(text, 0, 0);
  ctx.restore();
}
defineSpot({
  id: 'V08', title: '£12 each', dur: 8, persona: 'Value seekers, short attention (all ages)',
  angle: '£12 a head when the 3rd ticket is free', style: 'Bold royal blue and yellow, giant extruded number',
  hook: 'A giant yellow "£12" slams onto the screen',
  meta: { headline: '£12 each this half term', primary: '£12 each. Six hours. When the 3rd ticket’s free. Buy 2 tickets at £18 each and the 3rd walks in free: 3 for £36, 6 for £72, 9 for £108.\n\nExplorazone, Bowthorpe, Norwich. Half term: Fri 23 Oct to Sun 1 Nov. New customers only. Sign up to claim. Max 9 per group. T&Cs apply.' },
  setup() {},
  frame(t) {
    royalBg();
    const E = 4.7;
    if (t < E + 0.4) {
      ctx.save(); ctx.globalAlpha = 1 - prog(t, E, E + 0.4);
      const shake = t > 0.35 && t < 0.8 ? 14 * Math.sin(t * 95) * (1 - prog(t, 0.35, 0.8)) : 0;
      const up = easeInOutCubic(prog(t, 2.9, 3.4));
      ctx.translate(shake, -up * 250);
      ctx.save(); ctx.translate(540, 820); ctx.scale(lerp(1, 0.78, up), lerp(1, 0.78, up)); bigNumber('£12', 0, 0, 430, prog(t, 0, 0.45)); ctx.restore();
      words(['each. Six hours.'], lerp(970, 965, up), 96, 0.55, t, { color: P.cream, stagger: 0.22 });
      T('When the 3rd ticket’s free.', 540, lerp(1075, 1062, up), { size: 50, w: 800, color: P.yellow, alpha: prog(t, 1.5, 1.8) });
      ctx.restore();
      chipsRow(COPY.maths, 1200, 2.1, t, { bg: P.yellow, fg: P.ink, size: 40, alpha: 1 - prog(t, 2.8, 3.1) });
      ctx.save(); ctx.translate(0, (1 - easeOutCubic(prog(t, 0.9, 1.5))) * 220); photoStrip(t, 1445, 430, { alpha: prog(t, 0.9, 1.3) * (1 - prog(t, E, E + 0.4)), borderColor: P.yellow, keys: ['heat', 'robot2', 'laser_room', 'sky_maze', 'roses', 'dodeca'] }); ctx.restore();
      const pk = easeOutCubic(prog(t, 3.1, 3.55));
      if (pk > 0) photo(IMG.racing, 70, lerp(1500, 900, pk), 940, 520, { radius: 34, border: 6, borderColor: P.yellow, alpha: 1 - prog(t, E, E + 0.4), zoom: 1.05 + 0.05 * prog(t, 3.1, 4.7), shadow: 'rgba(0,0,0,0.4)' });
      logo(72, 262, 250, 1 - prog(t, E, E + 0.4), { align: 'left' });
    }
    if (t > E) endCard(t, E, { bg: royalBg, headline: ['Half term for', '_£12 each._'], fg: P.cream, accent: P.yellow, offerColor: P.yellow, chipBg: P.yellow, chipFg: P.ink, ctaBg: P.yellow, ctaFg: P.ink });
  },
});

// =====================================================================
// V09  Wonder, shared  (grandparents 65+)  slow, warm, large type
// =====================================================================
function warmBg() { vgrad([[0, '#4a2214'], [1, '#2a120a']]); }
defineSpot({
  id: 'V09', title: 'An old-fashioned day out', dur: 15, persona: 'Grandparents 65+',
  angle: 'Half term with the grandchildren: bring two, the third walks in free', style: 'Slow, warm, cinematic photo pans with large type',
  hook: '"Half term with the grandchildren?" over a busy science lab',
  meta: { headline: 'Bring two grandchildren, one goes free', primary: 'Half term with the grandchildren? Bring two, the third walks in free. Warm, dry and six hours of wonder: a real science lab, infinity lights, typewriters, rotary phones and a laser room, all under one roof in Bowthorpe, Norwich.\n\nBuy 2 tickets at £18 each, the 3rd walks in free. 3 in for £36. Half term: Fri 23 Oct to Sun 1 Nov. New customers only. Sign up to claim. T&Cs apply.' },
  setup() {},
  frame(t) {
    const scenes = [
      { img: IMG.lab3, a: 0, b: 4.4, lines: ['Half term with', 'the _grandchildren?_'], fx: 0.55 },
      { img: IMG.dodeca, a: 4.4, b: 8.4, lines: ['Bring two.', 'The third walks in _free._'], fx: 0.5 },
      { img: IMG.typewriters, a: 8.4, b: 11.6, lines: ['Typewriters, rotary phones', 'and a _laser room._'], fx: 0.5 },
    ];
    const E = 11.4;
    if (t < E + 0.5) {
      warmBg();
      scenes.forEach((s) => { const a = win(t, s.a - 0.3, s.b + 0.3, 0.6); if (a > 0) bgPhoto(s.img, { alpha: a * 0.55, filter: 'blur(40px) brightness(0.6) sepia(0.35)' }); });
      scenes.forEach((s) => {
        const a = win(t, s.a - 0.3, s.b + 0.3, 0.6); if (a <= 0) return;
        const z = 1.02 + 0.12 * prog(t, s.a - 0.3, s.b + 0.3);
        photo(s.img, 40, 600, 1000, 860, { radius: 36, border: 8, borderColor: P.cream, zoom: z, fx: s.fx, alpha: a, shadow: 'rgba(0,0,0,0.45)' });
        words(s.lines, 430, 84, s.a + 0.35, t, { color: P.cream, hl: '#ffc978', stagger: 0.12, alpha: 1 - prog(t, s.b - 0.3, s.b) });
      });
      photoStrip(t, 1520, 360, { keys: ['phones', 'roses', 'laser_room', 'typewriters', 'sky_maze', 'robot2'], speed: 30, borderColor: P.cream });
      logo(64, 262, 250, 1, { align: 'left', box: true });
      ctx.save(); ctx.globalAlpha = prog(t, E, E + 0.5); fill(P.burnt); ctx.restore();
    }
    if (t > E) endCard(t, E + 0.2, { bg: () => fill(P.burnt), logoBox: true, headline: ['An old-fashioned', 'day out', '_(with robots)._'], size: 100, stripKeys: ['robot2', 'phones', 'roses', 'typewriters', 'dodeca', 'laser_room'], tickerBg: P.cream, fg: P.cream, accent: '#ffd98a', offerColor: P.cream, chipBg: P.cream, chipFg: P.burnt, ctaBg: P.cream, ctaFg: P.burnt });
  },
});
