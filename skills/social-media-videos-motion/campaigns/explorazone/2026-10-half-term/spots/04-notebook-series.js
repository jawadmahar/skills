
// =====================================================================
// Notebook series (V16 to V20): variations on V04 "Dear Nan & Grandad"
// =====================================================================
function notesEnd(t, E, bg, headline, o = {}) {
  endCard(t, E, { bg, headline, size: o.size ?? 104, strip: 'polaroids', stripKeys: o.keys ?? ['laser_room', 'robot2', 'roses'], stripLabels: o.labels ?? ['lasers!!', 'robots!!', 'wow'], tickerBg: o.tickerBg ?? '#253a8f', tickerFg: o.tickerFg ?? '#fff', fg: o.fg ?? P.ink, accent: o.accent ?? P.red, offerColor: o.offerColor ?? P.red, chipBg: o.chipBg ?? '#253a8f', chipFg: '#fff', ctaBg: P.red, ctaFg: '#fff', chipShadow: false });
}

// V16 Dear Mum & Dad (spiral notebook) -------------------------------------
let paper16 = null;
function makeSpiralPaper() {
  const c = makePaper(), g = c.getContext('2d');
  g.fillStyle = '#d9d4c7'; g.fillRect(0, 0, W, 150); g.fillStyle = '#fffdf4'; g.fillRect(0, 150, W, 10);
  for (let x = 50; x < W; x += 62) { g.fillStyle = '#5b5f6a'; g.beginPath(); g.arc(x, 150, 14, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#9aa0ab'; g.lineWidth = 9; g.beginPath(); g.arc(x, 112, 34, Math.PI * 0.55, Math.PI * 1.45 + Math.PI, false); g.stroke(); }
  return c;
}
defineSpot({
  id: 'V16', title: 'Dear Mum & Dad', dur: 12, persona: 'Parents, through the child’s eyes (25 to 44)',
  angle: 'A child bargains for a half-term trip: you buy 2, my brother goes free', style: 'Spiral notebook, child’s handwriting, doodles and big polaroids',
  hook: '"Dear Mum & Dad, it’s half term and it’s raining. AGAIN."', music: 9,
  meta: { headline: 'You buy 2. One goes free.', primary: '"Dear Mum & Dad, it’s half term and it’s raining. AGAIN. Can we go to Explorazone? You buy 2 tickets and Sam goes FREE!! I’ll tidy my room.* (*probably)"\n\nBuy 2 tickets at £18 each, the 3rd walks in free. 3 for £36. Lasers, robots and six hours of hands-on science in Bowthorpe, Norwich. Half term: Fri 23 Oct to Sun 1 Nov. New customers only. Sign up to claim. T&Cs apply.' },
  setup() { paper16 = makeSpiralPaper(); },
  frame(t) {
    const E = 7.9; const slide = easeInCubic(prog(t, E, E + 0.6));
    if (t > E) notesEnd(t, E + 0.25, () => ctx.drawImage(paper16, 0, 0), ['Half term,', '_negotiated._'], { keys: ['robot2', 'laser_room', 'heat'], labels: ['robots!', 'LASERS', 'me!!'] });
    if (slide >= 1) return;
    ctx.save(); ctx.translate(0, -slide * H); ctx.drawImage(paper16, 0, 0);
    ctx.save(); ctx.translate(890, 250); ctx.rotate(-0.06); logo(0, -36, 250, 1, { box: true }); ctx.restore();
    const S = 72;
    writeH('Dear Mum & Dad,', 160, 468, t, 0.25, 1.1, { size: S });
    writeH('it’s half term and it’s', 160, 564, t, 1.15, 1.9, { size: S });
    writeH('raining. AGAIN.', 160, 660, t, 1.95, 2.5, { size: S });
    writeH('Can we go to Explorazone?', 160, 756, t, 2.55, 3.45, { size: S });
    writeH('You buy 2 tickets and', 160, 852, t, 3.55, 4.3, { size: S });
    writeH('Sam goes FREE!!', 160, 958, t, 4.35, 4.95, { size: 104, color: '#e0362c', crayon: true });
    const ul = new Path2D(); ul.moveTo(170, 990); for (let x = 170; x <= 700; x += 20) ul.lineTo(x, 990 + Math.sin(x * 0.05) * 6); strokeReveal(ul, prog(t, 4.95, 5.25), { len: 900, w: 6 });
    writeH('I’ll tidy my room.*', 160, 1052, t, 5.3, 5.95, { size: S });
    writeH('*probably', 760, 1110, t, 6.0, 6.3, { size: 48, color: '#7a7a85' });
    writeH('Love, me x', 160, 1148, t, 6.05, 6.5, { size: S });
    writeH('£18+£18 = £36', 690, 852, t, 4.3, 4.6, { size: 44, color: '#7a7a85' });
    const rb = new Path2D(); rb.rect(830, 1150, 120, 100); rb.moveTo(890, 1150); rb.lineTo(890, 1110); rb.moveTo(880, 1105); rb.arc(890, 1105, 10, 0, Math.PI * 2); rb.moveTo(855, 1185); rb.arc(860, 1185, 8, 0, Math.PI * 2); rb.moveTo(915, 1185); rb.arc(920, 1185, 8, 0, Math.PI * 2); rb.moveTo(860, 1220); rb.lineTo(920, 1220); rb.rect(850, 1250, 80, 70);
    strokeReveal(rb, prog(t, 6.2, 6.9), { color: '#253a8f', w: 6, len: 1500 });
    polaroidAt(IMG.robot2, 200, 1560, 320, -0.09, 'robots!', prog(t, 6.6, 7.0));
    polaroidAt(IMG.laser_room, 540, 1600, 320, 0.04, 'LASERS!!', prog(t, 6.85, 7.25));
    polaroidAt(IMG.heat, 880, 1555, 320, 0.1, 'me!!', prog(t, 7.1, 7.5));
    ctx.restore();
  },
});

// V17 Grandad's reply (fountain pen letter) -----------------------------------
let paper17 = null;
function makeLetterPaper() {
  const c = makeCanvas(W, H), g = c.getContext('2d'), r = rng(17);
  g.fillStyle = '#c9a77c'; g.fillRect(0, 0, W, 230);
  g.fillStyle = '#b8926a'; g.beginPath(); g.moveTo(0, 0); g.lineTo(540, 200); g.lineTo(W, 0); g.closePath(); g.fill();
  g.fillStyle = '#fbf6ea'; g.fillRect(30, 190, W - 60, H - 190);
  for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(150,120,70,${0.03 + r() * 0.04})`; g.fillRect(30 + r() * (W - 60), 190 + r() * (H - 190), 1 + r() * 2, 1 + r() * 2); }
  g.strokeStyle = 'rgba(120,110,90,0.18)'; g.lineWidth = 2; for (let y = 440; y < 1300; y += 100) { g.beginPath(); g.moveTo(90, y); g.lineTo(990, y); g.stroke(); }
  // stamp and postmark
  g.save(); g.translate(930, 110); g.rotate(0.05); g.fillStyle = '#fff'; g.fillRect(-70, -85, 140, 170); g.fillStyle = '#c0392b'; g.fillRect(-56, -71, 112, 142); g.fillStyle = '#fff'; g.font = `800 64px ${HEAD}`; g.textAlign = 'center'; g.fillText('1st', 0, 22); g.restore();
  g.save(); g.strokeStyle = 'rgba(30,30,40,0.55)'; g.lineWidth = 5; g.beginPath(); g.arc(770, 110, 70, 0, Math.PI * 2); g.stroke(); g.font = `700 24px ${BODY}`; g.fillStyle = 'rgba(30,30,40,0.6)'; g.textAlign = 'center'; g.fillText('NORWICH', 770, 100); g.fillText('19 OCT', 770, 134); for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(850, 80 + i * 18); g.bezierCurveTo(880, 70 + i * 18, 900, 95 + i * 18, 1000, 80 + i * 18); g.stroke(); } g.restore();
  return c;
}
defineSpot({
  id: 'V17', title: 'Grandad’s reply', dur: 12, persona: 'Grandparents 60+',
  angle: 'Grandad writes back: Nan and I buy two tickets, so you go free', style: 'Fountain-pen letter in an envelope, vintage photos with album corners',
  hook: '"My dear Lily, Nan and I would love to take you to Explorazone this half term."', music: 12,
  meta: { headline: 'Nan & Grandad pay. One goes free.', primary: '"My dear Lily, Nan and I would love to take you to Explorazone this half term. We’ll buy two tickets, so you go free. Saturday at ten? Love, Grandad x. P.S. They have typewriters!"\n\nBuy 2 tickets at £18 each, the 3rd walks in free. Typewriters, rotary phones, a garden of light and a laser room in Bowthorpe, Norwich. Half term: Fri 23 Oct to Sun 1 Nov. New customers only. Sign up to claim. T&Cs apply.' },
  setup() { paper17 = makeLetterPaper(); },
  frame(t) {
    const E = 7.5; const slide = easeInCubic(prog(t, E, E + 0.6));
    if (t > E) notesEnd(t, E + 0.25, () => ctx.drawImage(paper17, 0, 0), ['Nan & Grandad pay.', 'The _grandchild goes free._'], { size: 92, keys: ['typewriters', 'roses', 'laser_room'], labels: ['like mine!', 'for Nan', 'for Lily'], tickerBg: '#1f2d5a', chipBg: '#1f2d5a' });
    if (slide >= 1) return;
    ctx.save(); ctx.translate(0, -slide * H); ctx.drawImage(paper17, 0, 0);
    logo(60, 60, 270, 1, { align: 'left', box: true });
    const ink = '#1f2d5a', S = 68;
    writeH('My dear Lily,', 110, 420, t, 0.25, 1.0, { fam: SCRIPT, size: 78, color: ink });
    writeH('Nan and I would love to take', 110, 520, t, 1.05, 2.0, { fam: SCRIPT, size: S, color: ink });
    writeH('you to Explorazone this', 110, 620, t, 2.05, 2.8, { fam: SCRIPT, size: S, color: ink });
    writeH('half term. We’ll buy two', 110, 720, t, 2.85, 3.6, { fam: SCRIPT, size: S, color: ink });
    writeH('tickets, so you go free.', 110, 820, t, 3.65, 4.4, { fam: SCRIPT, size: S, color: ink });
    const u = new Path2D(); u.moveTo(560, 840); u.bezierCurveTo(650, 850, 760, 832, 850, 842); strokeReveal(u, prog(t, 4.4, 4.7), { color: ink, w: 5, len: 400 });
    writeH('Saturday at ten?', 110, 920, t, 4.75, 5.25, { fam: SCRIPT, size: S, color: ink });
    writeH('Love, Grandad x', 470, 1040, t, 5.3, 5.9, { fam: SCRIPT, size: 82, color: ink });
    writeH('P.S. They have typewriters!', 110, 1150, t, 5.95, 6.6, { fam: SCRIPT, size: 56, color: ink });
    photoCorners(IMG.typewriters, 220, 1500, 330, -0.06, 'like mine!', prog(t, 6.3, 6.7));
    photoCorners(IMG.roses, 560, 1560, 330, 0.04, 'for Nan', prog(t, 6.55, 6.95));
    photoCorners(IMG.laser_room, 880, 1500, 330, 0.08, 'for Lily', prog(t, 6.8, 7.2));
    ctx.restore();
  },
});

// V18 Maths homework (squared paper) ---------------------------------------------
let paper18 = null;
function makeSquaredPaper() {
  const c = makeCanvas(W, H), g = c.getContext('2d');
  g.fillStyle = '#fdfdfb'; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(90,150,210,0.28)'; g.lineWidth = 2; for (let x = 0; x <= W; x += 45) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y <= H; y += 45) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.strokeStyle = 'rgba(225,80,80,0.75)'; g.lineWidth = 3; g.beginPath(); g.moveTo(110, 0); g.lineTo(110, H); g.stroke();
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, 250); g.strokeStyle = '#253a8f'; g.lineWidth = 4; g.strokeRect(40, 130, W - 80, 100);
  T('Name:', 70, 195, { g, size: 34, w: 700, color: '#253a8f', align: 'left' }); T('Class:', 640, 195, { g, size: 34, w: 700, color: '#253a8f', align: 'left' });
  T('Maya', 190, 200, { g, size: 52, w: 700, fam: KALAM, color: '#2d2d3a', align: 'left' }); T('4B', 760, 200, { g, size: 52, w: 700, fam: KALAM, color: '#2d2d3a', align: 'left' });
  return c;
}
defineSpot({
  id: 'V18', title: 'Half-term homework', dur: 10, persona: 'Families with primary-age children',
  angle: 'Half-term maths homework: 3 tickets, buy 2, get the 3rd free = £36', style: 'Squared exercise book, pencil working, teacher’s red ticks and gold star',
  hook: '"Half-term homework. Q1. 3 tickets cost £18 each. Buy 2, get the 3rd free. How much?"', music: 670,
  meta: { headline: 'Half-term maths: 3 tickets = £36', primary: 'Half-term homework. Q1: 3 tickets at £18 each. Buy 2, get the 3rd free. How much? £36, that’s £12 each. Q2: 6 tickets? £72. Q3: 9 tickets? £108. 10/10.\n\nExplorazone, Bowthorpe, Norwich: AR sandbox, heat vision, robots and six hours of hands-on science. Half term: Fri 23 Oct to Sun 1 Nov. New customers only. Sign up to claim. Max 9 per group. T&Cs apply.' },
  setup() { paper18 = makeSquaredPaper(); },
  frame(t) {
    const E = 6.6; const slide = easeInCubic(prog(t, E, E + 0.5));
    if (t > E) notesEnd(t, E + 0.2, () => ctx.drawImage(paper18, 0, 0), ['Half-term maths,', '_sorted._'], { keys: ['sandbox', 'heat', 'robot2'], labels: ['geography!', 'science!', 'robots!'] });
    if (slide >= 1) return;
    ctx.save(); ctx.translate(0, -slide * H); ctx.drawImage(paper18, 0, 0);
    logo(780, 30, 260, 1, { align: 'left' });
    writeH('Half-term homework', 150, 340, t, 0.1, 0.8, { fam: KALAM, size: 70, color: '#2d2d3a' });
    const hu = new Path2D(); hu.moveTo(150, 360); hu.lineTo(800, 362); strokeReveal(hu, prog(t, 0.7, 0.9), { color: '#2d2d3a', w: 5, len: 700 });
    const q = (s, y, a) => T(s, 150, y, { size: 40, w: 600, color: P.ink, align: 'left', alpha: prog(t, a, a + 0.25) });
    q('Q1. 3 tickets cost £18 each.', 445, 0.5); q('Buy 2, get the 3rd free. How much?', 500, 0.65);
    writeH('£18 + £18 + £0 = £36', 150, 620, t, 1.0, 2.1, { fam: KALAM, size: 70, color: '#2d2d3a' });
    tickMark(985, 590, 100, prog(t, 2.2, 2.5));
    writeH('Well done! That’s £12 each', 150, 715, t, 2.5, 3.2, { size: 62, color: '#e0362c' });
    q('Q2. 6 tickets?', 830, 3.2); writeH('£72', 520, 835, t, 3.5, 3.8, { fam: KALAM, size: 80, color: '#2d2d3a' }); tickMark(760, 810, 90, prog(t, 3.85, 4.1));
    q('Q3. 9 tickets? (max per group)', 935, 4.1); writeH('£108', 720, 940, t, 4.35, 4.7, { fam: KALAM, size: 80, color: '#2d2d3a' }); tickMark(990, 915, 90, prog(t, 4.75, 5.0));
    const ring = new Path2D(); ring.ellipse(330, 1110, 160, 90, -0.1, 0, Math.PI * 2); strokeReveal(ring, prog(t, 5.0, 5.4), { color: '#e0362c', w: 8, len: 1200 });
    writeH('10/10', 230, 1135, t, 5.05, 5.35, { size: 92, color: '#e0362c' });
    writeH('Excellent maths!', 520, 1135, t, 5.3, 5.8, { size: 56, color: '#e0362c' });
    star(995, 1080, 70 * easeOutBack(prog(t, 5.6, 5.9)), '#f4c430', 1, 0.2);
    polaroidAt(IMG.sandbox, 280, 1560, 380, -0.07, 'geography!', prog(t, 5.6, 6.0));
    polaroidAt(IMG.heat, 790, 1570, 380, 0.07, 'science!', prog(t, 5.85, 6.25));
    ctx.restore();
  },
});

// V19 Dear Diary (gel pen, after the visit) ------------------------------------
let paper19 = null;
function makeDiaryPaper() {
  const c = makeCanvas(W, H), g = c.getContext('2d');
  g.fillStyle = '#fbeef8'; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(214,150,200,0.6)'; g.lineWidth = 2.5; for (let y = 480; y < H - 40; y += 92) { g.beginPath(); g.moveTo(60, y); g.lineTo(W - 60, y); g.stroke(); }
  g.setLineDash([14, 10]); g.strokeStyle = '#a256c9'; g.lineWidth = 4; rr(g, 140, 170, 800, 150, 30); g.stroke(); g.setLineDash([]);
  return c;
}
defineSpot({
  id: 'V19', title: 'Dear Diary', dur: 12, persona: 'Kids 7 to 12 and their parents (social proof)',
  angle: 'A child’s diary after the visit: best day ever, and my ticket was free', style: 'Gel-pen diary page, doodled hearts and stars, big taped photos',
  hook: '"Dear Diary, BEST. DAY. EVER."', music: 1076,
  meta: { headline: 'Make it their best day ever', primary: '"Dear Diary, BEST. DAY. EVER. We went to Explorazone! I saw myself in heat vision, a robot brought Mum’s coffee and Grandad got lost in the sky maze (lol). AND my ticket was FREE!!"\n\nBuy 2 tickets at £18 each, the 3rd walks in free. 3 for £36. Bowthorpe, Norwich. Half term: Fri 23 Oct to Sun 1 Nov. New customers only. Sign up to claim. T&Cs apply.' },
  setup() { paper19 = makeDiaryPaper(); },
  frame(t) {
    const E = 7.6; const slide = easeInCubic(prog(t, E, E + 0.6));
    if (t > E) notesEnd(t, E + 0.25, () => ctx.drawImage(paper19, 0, 0), ['Make it their', '_best day ever._'], { keys: ['heat', 'robot2', 'sky_maze'], labels: ['me!!', 'coffee robot', 'Grandad?!'], tickerBg: '#6b2fa3', chipBg: '#6b2fa3', accent: '#e0368f', offerColor: '#e0368f' });
    if (slide >= 1) return;
    ctx.save(); ctx.translate(0, -slide * H); ctx.drawImage(paper19, 0, 0);
    logo(60, 40, 240, 1, { align: 'left', box: true });
    const ink = '#6b2fa3', pink = '#e0368f';
    writeH('Wednesday 28 October', 200, 268, t, 0.1, 0.8, { fam: PRINT, size: 62, color: ink, w: 400 });
    star(980, 120, 34, '#f4c430', prog(t, 0.6, 0.8), 0.3); heart(90, 380, 30, pink, prog(t, 0.7, 0.9));
    writeH('Dear Diary,', 90, 470, t, 0.3, 0.9, { fam: PRINT, size: 72, color: ink, w: 400 });
    writeH('BEST. DAY. EVER.', 90, 562, t, 0.95, 1.6, { fam: PRINT, size: 92, color: pink, w: 400 });
    writeH('We went to Explorazone!', 90, 654, t, 1.65, 2.4, { fam: PRINT, size: 72, color: ink, w: 400 });
    writeH('I saw myself in heat vision,', 90, 746, t, 2.45, 3.3, { fam: PRINT, size: 72, color: ink, w: 400 });
    writeH('a robot brought Mum’s coffee', 90, 838, t, 3.35, 4.2, { fam: PRINT, size: 72, color: ink, w: 400 });
    writeH('and Grandad got lost in the', 90, 930, t, 4.25, 5.0, { fam: PRINT, size: 72, color: ink, w: 400 });
    writeH('sky maze (lol).', 90, 1022, t, 5.05, 5.5, { fam: PRINT, size: 72, color: ink, w: 400 });
    writeH('AND my ticket was FREE!!', 90, 1124, t, 5.55, 6.3, { fam: PRINT, size: 84, color: pink, w: 400 });
    heart(980, 1000, 40, pink, prog(t, 6.2, 6.4)); star(900, 1220, 30, '#f4c430', prog(t, 6.3, 6.5), -0.2);
    polaroidAt(IMG.heat, 200, 1570, 320, -0.09, 'me!!', prog(t, 6.3, 6.7), { ink });
    polaroidAt(IMG.robot2, 540, 1610, 320, 0.04, 'coffee robot', prog(t, 6.55, 6.95), { ink });
    polaroidAt(IMG.sky_maze, 880, 1565, 320, 0.1, 'Grandad?!', prog(t, 6.8, 7.2), { ink });
    ctx.restore();
  },
});

// V20 Fridge sticky notes ---------------------------------------------------------
let fridgeC = null;
function makeFridge() {
  const c = makeCanvas(W, H), g = c.getContext('2d'), r = rng(20);
  const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, '#dfe4e9'); gr.addColorStop(0.5, '#f3f5f7'); gr.addColorStop(1, '#cfd6dd'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 400; i++) { g.strokeStyle = `rgba(255,255,255,${r() * 0.25})`; g.lineWidth = 1; const x = r() * W; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (r() - 0.5) * 6, H); g.stroke(); }
  g.fillStyle = 'rgba(80,90,100,0.35)'; g.fillRect(0, 248, W, 6);
  g.fillStyle = '#b9c1c9'; rr(g, 1010, 330, 40, 1100, 20); g.fill(); g.fillStyle = 'rgba(255,255,255,0.5)'; rr(g, 1016, 340, 10, 1080, 5); g.fill();
  return c;
}
function stickyNote(cx, cy, s, rot, color, lines, k, o = {}) {
  if (k <= 0) return; const sc = lerp(1.6, 1, easeOutBack(k, 1.6));
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k * 2);
  ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10; ctx.fillStyle = color; ctx.fillRect(-s / 2, -s / 2, s, s); ctx.shadowColor = 'transparent';
  const g = ctx.createLinearGradient(0, s * 0.2, 0, s / 2); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.08)'); ctx.fillStyle = g; ctx.fillRect(-s / 2, -s / 2, s, s);
  const size = o.size ?? 60; lines.forEach((l, i) => T(l, 0, -((lines.length - 1) * size * 1.05) / 2 + i * size * 1.05 + size * 0.35, { size, w: 700, fam: HAND, color: o.ink ?? '#1d1d1f' }));
  if (o.circle) { ctx.strokeStyle = '#e0362c'; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(0, 10, s * 0.44, s * 0.3, -0.1, 0, Math.PI * 2 * prog(o.t, o.circle, o.circle + 0.4)); ctx.stroke(); }
  ctx.restore();
}
function magnetPhoto(img, cx, cy, w, h, rot, k, color) {
  if (k <= 0) return; ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); const s = lerp(1.3, 1, easeOutCubic(k)); ctx.scale(s, s); ctx.globalAlpha = clamp(k * 2);
  photo(img, -w / 2, -h / 2, w, h, { radius: 8, border: 10, borderColor: '#fff', shadow: 'rgba(0,0,0,0.3)' });
  const g = ctx.createRadialGradient(-8, -h / 2 - 8, 4, 0, -h / 2, 34); g.addColorStop(0, '#fff'); g.addColorStop(0.3, color); g.addColorStop(1, color); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -h / 2, 32, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
defineSpot({
  id: 'V20', title: 'The fridge plan', dur: 10, persona: 'Organised parents planning the week',
  angle: 'The half-term plan on the fridge: Mon rain, Tue rain, Wed EXPLORAZONE', style: 'Fridge door with colourful sticky notes, magnets and big photos',
  hook: 'Sticky notes slapping onto a fridge: "HALF TERM PLAN"', music: 1057,
  meta: { headline: 'The half-term plan is on the fridge', primary: 'The half-term plan. Mon: rain. Tue: rain. Wed: EXPLORAZONE! Buy 2 tickets at £18 each and the 3rd walks in free. The laser room, the garden of light and the light-up floor, all indoors in Bowthorpe, Norwich.\n\nHalf term: Fri 23 Oct to Sun 1 Nov. 3 for £36, 6 for £72, 9 for £108. New customers only. Sign up first at explorazone.co.uk. T&Cs apply.' },
  setup() { fridgeC = makeFridge(); },
  frame(t) {
    const E = 5.4;
    if (t < E + 0.5) {
      ctx.drawImage(fridgeC, 0, 0);
      // child's drawing
      const dk = prog(t, 0.05, 0.35);
      if (dk > 0) { ctx.save(); ctx.translate(250, 450); ctx.rotate(-0.07); ctx.globalAlpha = dk; ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 14; ctx.fillStyle = '#fff'; ctx.fillRect(-190, -150, 380, 300); ctx.shadowColor = 'transparent';
        ['#e0362c', '#f39c12', '#f4d03f', '#27ae60', '#2e86de', '#8e44ad'].forEach((c, i) => { ctx.strokeStyle = c; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(0, 90, 150 - i * 13, Math.PI, 0); ctx.stroke(); });
        ctx.strokeStyle = '#253a8f'; ctx.lineWidth = 6; ctx.strokeRect(-40, -10, 80, 70); ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, -40); ctx.stroke(); ctx.fillStyle = '#e0362c'; ctx.beginPath(); ctx.arc(0, -46, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#253a8f'; ctx.beginPath(); ctx.arc(-18, 15, 7, 0, Math.PI * 2); ctx.arc(18, 15, 7, 0, Math.PI * 2); ctx.fill();
        const g = ctx.createRadialGradient(-6, -158, 3, 0, -150, 30); g.addColorStop(0, '#fff'); g.addColorStop(0.3, '#e0362c'); g.addColorStop(1, '#a3241a'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -150, 28, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      logo(620, 300, 300, prog(t, 0.0, 0.3), { align: 'left', box: true });
      stickyNote(770, 560, 300, 0.05, '#ffe66b', ['HALF TERM', 'PLAN'], prog(t, 0.3, 0.6), { size: 64 });
      stickyNote(250, 860, 280, -0.08, '#ff9ec7', ['Mon:', 'rain'], prog(t, 0.8, 1.05));
      stickyNote(560, 880, 280, 0.06, '#9fd7ff', ['Tue:', 'rain'], prog(t, 1.15, 1.4));
      stickyNote(860, 900, 300, -0.04, P.lime, ['Wed:', 'EXPLORA-', 'ZONE!!'], prog(t, 1.5, 1.75), { size: 54, circle: 1.9, t });
      stickyNote(300, 1190, 320, 0.07, '#ffb36b', ['Buy 2 tickets', '3rd FREE!'], prog(t, 2.2, 2.45), { size: 52 });
      stickyNote(730, 1220, 320, -0.05, '#ffe66b', ['Sign up first:', 'explorazone', '.co.uk'], prog(t, 2.6, 2.85), { size: 46 });
      magnetPhoto(IMG.laser_room, 250, 1610, 420, 330, -0.05, prog(t, 3.1, 3.45), '#2e86de');
      magnetPhoto(IMG.roses, 760, 1640, 440, 340, 0.05, prog(t, 3.4, 3.75), '#27ae60');
      ctx.save(); ctx.globalAlpha = prog(t, E, E + 0.5); fill('#f3f5f7'); ctx.restore();
    }
    if (t > E) endCard(t, E, { bg: () => ctx.drawImage(fridgeC, 0, 0), headline: ['Stick it on', 'the _fridge._'], fg: P.ink, accent: P.red, offerColor: P.red, chipBg: P.navy, chipFg: P.cream, ctaBg: P.red, ctaFg: '#fff', tickerBg: '#ffe66b', chipShadow: false, stripBorder: '#fff' });
  },
});
