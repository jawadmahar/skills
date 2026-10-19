// =====================================================================
// Notebook series (10): W06 W07 W08 W19 W21 W27 W33 W35 W36 W43
// Handwritten letters, lists, diaries, cards, planners and postcards. noteFmt draws a paper and a timed list of items.
// =====================================================================
function paperCanvas(kind) {
  if (kind === 'lined') return makePaper();
  const c = makeCanvas(W, H), g = c.getContext('2d'), r = rng(kind.length * 17 + 3);
  const grain = (base, n = 3500) => { g.fillStyle = base; g.fillRect(0, 0, W, H); for (let i = 0; i < n; i++) { g.fillStyle = `rgba(120,100,60,${0.025 + r() * 0.04})`; g.fillRect(r() * W, r() * H, 1 + r() * 2, 1 + r() * 2); } };
  const lines = (y0, step, col, x0 = 0) => { g.strokeStyle = col; g.lineWidth = 2.5; for (let y = y0; y < H - 40; y += step) { g.beginPath(); g.moveTo(x0, y); g.lineTo(W, y); g.stroke(); } };
  if (kind === 'santa') {
    grain('#fffaf0'); lines(470, 100, 'rgba(200,60,60,0.18)', 110);
    g.save(); g.beginPath(); g.rect(0, 0, W, H); g.rect(46, 46, W - 92, H - 92); g.clip('evenodd');
    for (let i = -H; i < W + H; i += 56) { g.fillStyle = (i / 56) % 2 ? '#d62a1e' : '#fff'; g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 28, 0); g.lineTo(i + 28 + H, H); g.lineTo(i + H, H); g.fill(); }
    g.restore();
    [[120, 160], [960, 1780]].forEach(([x, y]) => { g.fillStyle = '#1f7a3e'; [[-40, -10, 0.5], [30, -20, -0.4], [0, 30, 1.6]].forEach(([dx, dy, a]) => { g.save(); g.translate(x + dx, y + dy); g.rotate(a); g.beginPath(); g.ellipse(0, 0, 52, 22, 0, 0, Math.PI * 2); g.fill(); g.restore(); }); g.fillStyle = '#d62a1e'; [[-8, 4], [10, 10], [2, -10]].forEach(([dx, dy]) => { g.beginPath(); g.arc(x + dx, y + dy, 13, 0, Math.PI * 2); g.fill(); }); });
    return c;
  }
  if (kind === 'diary') {
    grain('#f4ead2'); lines(480, 92, 'rgba(90,80,60,0.22)', 90);
    g.strokeStyle = 'rgba(200,70,70,0.5)'; g.lineWidth = 3; g.beginPath(); g.moveTo(150, 300); g.lineTo(150, H); g.stroke();
    g.fillStyle = '#b3261e'; g.fillRect(900, 0, 46, 1500); g.beginPath(); g.moveTo(900, 1500); g.lineTo(923, 1470); g.lineTo(946, 1500); g.fill();
    T('WEDNESDAY', 180, 400, { g, size: 44, w: 800, color: '#5b4a35', align: 'left', ls: 8 });
    return c;
  }
  if (kind === 'squared') {
    grain('#fdfdfb'); g.strokeStyle = 'rgba(90,140,200,0.25)'; g.lineWidth = 2; for (let x = 0; x < W; x += 54) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y < H; y += 54) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    g.fillStyle = '#222'; for (let y = 120; y < H; y += 110) { g.beginPath(); g.arc(46, y, 14, 0, Math.PI * 2); g.fill(); }
    return c;
  }
  if (kind === 'notepad') {
    grain('#fff3b8'); lines(470, 96, 'rgba(70,110,190,0.35)');
    g.strokeStyle = 'rgba(220,60,60,0.6)'; g.lineWidth = 3; g.beginPath(); g.moveTo(140, 230); g.lineTo(140, H); g.stroke();
    g.fillStyle = '#7c1d1d'; g.fillRect(0, 0, W, 230); g.fillStyle = 'rgba(0,0,0,0.2)'; g.fillRect(0, 230, W, 10);
    return c;
  }
  if (kind === 'planner') {
    grain('#ffffff', 1500); g.fillStyle = '#1a34bf'; g.fillRect(0, 0, W, 380); T('SPRING TERM · WEEK 1', 1010, 360, { g, size: 30, w: 800, color: '#fff', ls: 3, align: 'right' });
    ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].forEach((d, i) => { const y = 400 + i * 118; g.fillStyle = i > 4 ? '#e8f7f2' : '#f3f5fb'; g.fillRect(40, y, W - 80, 108); g.fillStyle = i > 4 ? '#00a884' : '#1a34bf'; g.fillRect(40, y, 150, 108); T(d, 115, y + 70, { g, size: 40, w: 800, color: '#fff' }); });
    return c;
  }
  if (kind === 'report') {
    grain('#fbfaf6', 1500); g.fillStyle = '#16223f'; g.beginPath(); g.arc(540, 400, 60, 0, Math.PI * 2); g.fill(); T('E', 540, 425, { g, size: 64, w: 800, fam: HEAD, color: '#e9b949' });
    T('END OF TERM REPORT', 540, 520, { g, size: 52, w: 800, color: '#16223f', fam: HEAD });
    g.strokeStyle = '#16223f'; g.lineWidth = 3; g.strokeRect(70, 570, W - 140, 600);
    ['Subject', 'Grade'].forEach((h, i) => T(h, i ? 820 : 110, 625, { g, size: 32, w: 800, color: '#16223f', align: 'left' }));
    for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(70, 650 + i * 104); g.lineTo(W - 70, 650 + i * 104); g.stroke(); }
    g.beginPath(); g.moveTo(780, 570); g.lineTo(780, 1170); g.stroke();
    return c;
  }
  if (kind === 'postcard') {
    grain('#7a5a3c', 6000); g.fillStyle = 'rgba(0,0,0,0.25)'; for (let y = 0; y < H; y += 140) g.fillRect(0, y, W, 4);
    g.save(); g.translate(540, 900); g.rotate(-0.025); g.shadowColor = 'rgba(0,0,0,0.45)'; g.shadowBlur = 40; g.shadowOffsetY = 16; g.fillStyle = '#f6efe0'; g.fillRect(-480, -560, 960, 1120); g.restore();
    g.save(); g.translate(540, 900); g.rotate(-0.025); g.strokeStyle = 'rgba(80,60,40,0.4)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-480, 120); g.lineTo(480, 120); g.stroke();
    for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-420, 220 + i * 80); g.lineTo(420, 220 + i * 80); g.stroke(); }
    g.setLineDash([10, 8]); g.strokeRect(250, -520, 190, 230); g.setLineDash([]); g.restore();
    return c;
  }
  if (kind === 'card') {
    grain('#fff8ec'); g.fillStyle = 'rgba(0,0,0,0.06)'; g.fillRect(0, 0, 30, H); g.strokeStyle = 'rgba(180,140,60,0.5)'; g.lineWidth = 6; g.strokeRect(60, 300, W - 120, 1460);
    return c;
  }
  if (kind === 'fridge') {
    const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, '#c9ced4'); gr.addColorStop(0.5, '#eef1f4'); gr.addColorStop(1, '#b9bfc6'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 900; i++) { g.strokeStyle = `rgba(255,255,255,${r() * 0.18})`; g.lineWidth = 1; const x = r() * W; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + r() * 4, H); g.stroke(); }
    g.fillStyle = '#9aa1a9'; rr(g, 1000, 500, 40, 700, 20); g.fill();
    return c;
  }
  grain('#fffdf4'); return c;
}
// one timed item on the page
function noteItem(it, t) {
  const at = it.at ?? it.a ?? 0;
  if (it.type === 'w') { const b = it.b ?? at + Math.max(0.45, it.text.length * 0.045); writeH(it.text, it.x, it.y, t, at, b, { fam: it.fam ?? HAND, size: it.size ?? 70, color: it.color ?? '#253a8f', w: it.w ?? 700 }); return; }
  const p = prog(t, at, at + (it.d ?? 0.35)); if (p <= 0) return;
  if (it.type === 'print') T(it.text, it.x, it.y, { size: it.size ?? 40, w: it.w ?? 700, fam: it.fam ?? BODY, color: it.color ?? P.ink, align: it.align ?? 'left', alpha: p });
  else if (it.type === 'strike') strokeReveal(new Path2D(`M${it.x} ${it.y} q ${it.w / 2} ${-8} ${it.w} ${4}`), p, { color: it.color ?? '#e0362c', w: it.lw ?? 7, len: it.w + 40 });
  else if (it.type === 'circle') { const pth = new Path2D(); pth.ellipse(it.x, it.y, it.rx, it.ry, -0.04, -2.2, Math.PI * 2 - 1.9); strokeReveal(pth, p, { color: it.color ?? '#e0362c', w: 7, len: Math.PI * (it.rx + it.ry) * 1.2 }); }
  else if (it.type === 'tick') tickMark(it.x, it.y, it.s ?? 60, p, it.color ?? '#1f9d55');
  else if (it.type === 'pol') polaroidAt(IMG[it.key], it.x, it.y, it.w ?? 340, it.rot ?? 0, it.label ?? '', p, { fam: it.fam ?? HAND });
  else if (it.type === 'corners') photoCorners(IMG[it.key], it.x, it.y, it.w ?? 420, it.rot ?? 0, it.label ?? '', p, { fam: it.fam });
  else if (it.type === 'star') star(it.x, it.y, (it.r ?? 30) * easeOutBack(p), it.color ?? '#f2b705', 1, it.rot ?? 0);
  else if (it.type === 'heart') heart(it.x, it.y, (it.s ?? 34) * easeOutBack(p), it.color ?? '#e0362c');
  else if (it.type === 'stamp') { const s = lerp(1.7, 1, easeOutCubic(p)); ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot ?? -0.12); ctx.scale(s, s); ctx.globalAlpha = clamp(p * 1.5) * 0.9; ctx.strokeStyle = it.color ?? '#c0271b'; ctx.lineWidth = 7; const w = measure(it.text, it.size ?? 54, 800, HEAD) + 60; rr(ctx, -w / 2, -(it.size ?? 54) * 0.85, w, (it.size ?? 54) * 1.6, 12); ctx.stroke(); T(it.text, 0, (it.size ?? 54) * 0.35, { size: it.size ?? 54, w: 800, fam: HEAD, color: it.color ?? '#c0271b' }); ctx.restore(); }
  else if (it.type === 'sticky') { const s = easeOutBack(p); ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot ?? 0); ctx.scale(s, s); ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10; ctx.fillStyle = it.color ?? '#ffe873'; ctx.fillRect(-(it.w ?? 420) / 2, -(it.h ?? 380) / 2, it.w ?? 420, it.h ?? 380); ctx.shadowColor = 'transparent'; ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(-(it.w ?? 420) / 2, -(it.h ?? 380) / 2, it.w ?? 420, 50); ctx.restore(); }
  else if (it.type === 'magnet') { const s = easeOutBack(p); ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot ?? 0); ctx.scale(s, s); photo(IMG[it.key], -(it.w ?? 400) / 2, -(it.h ?? 300) / 2, it.w ?? 400, it.h ?? 300, { radius: 8, border: 12, borderColor: '#fff', shadow: 'rgba(0,0,0,0.35)' }); ctx.fillStyle = it.mag ?? '#e0362c'; ctx.beginPath(); ctx.arc(0, -(it.h ?? 300) / 2 + 4, 26, 0, Math.PI * 2); ctx.fill(); ctx.restore(); if (it.label) labelPill(it.key, it.x - (it.w ?? 400) / 2 + 10, it.y + (it.h ?? 300) / 2 - 40, { size: 26, alpha: p }); }
  else if (it.type === 'card') card(it.key, it.x, it.y, it.w, it.h, { alpha: p, zoom: 1.05 });
  else if (it.type === 'pic') photo(IMG[it.key], it.x, it.y, it.w, it.h, { alpha: p, border: 8, borderColor: '#fff' });
}
function noteFmt(c) {
  let paper = null;
  return {
    setup() { paper = paperCanvas(c.paper); },
    frame(t) {
      const E = endAt(c.dur);
      if (t < E + 0.4) {
        if (c.under) c.under(t);
        ctx.save();
        const z = lerp(c.zoom ?? 1.1, 1, easeOutCubic(prog(t, 0, 1.4)));
        const pan = c.pan ? lerp(0, c.pan[2], easeInOutSine(prog(t, c.pan[0], c.pan[1]))) : 0;
        ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-540, -960 + pan);
        const fl = c.flip ? prog(t, c.flip, c.flip + 0.6) : 1;
        if (fl < 1) { ctx.save(); ctx.translate(540, 960); ctx.scale(Math.max(0.02, Math.abs(Math.cos(Math.PI * fl))), 1); ctx.translate(-540, -960); if (fl < 0.5) c.front(t); else ctx.drawImage(paper, 0, 0); ctx.restore(); }
        else { ctx.drawImage(paper, 0, 0); c.items.forEach((it) => noteItem(it, t)); }
        ctx.restore();
        if (c.over) c.over(t);
        if (c.logo !== false) brandTop();
      }
      endScene(t, E, c.end, c.endKind ?? 'cream', { stripKeys: c.strip, accent: c.accent });
    },
  };
}
const INK = '#253a8f', PENCIL = '#4a4a4a', RED = '#e0362c';

// W06 Dear Nan & Grandad, winter -------------------------------------------------
spot({ id: 'W06', title: 'Dear Nan & Grandad: too cold', slug: 'dear-nan-grandad-winter', dur: 15, run: 'nov', series: 'Notebook', music: 1072,
  persona: 'Grandparents 55+ with grandchildren aged 5 to 11', angle: 'A grandchild’s letter asks for a warm day out together', style: 'Child’s handwriting on lined paper, doodles and polaroids of heat vision, robots and the sky maze',
  hook: '"Dear Nan & Grandad, it’s too cold for the park..." in a child’s hand',
  meta: { headline: 'A letter from the grandchildren', primary: primary('Dear Nan and Grandad, it is too cold for the park, so can we go to Explorazone? You come too.', 'Heat vision, robot waiters and the sky maze, all indoors in Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'lined', end: ['Too cold for', '_the park?_'], strip: ['heat', 'robots', 'sky_maze', 'laser_room', 'infinity_floor', 'roses'], items: [
    { type: 'w', text: 'Dear Nan & Grandad,', x: 170, y: 460, at: 0.1, b: 1.1, fam: KALAM, size: 70 },
    { type: 'w', text: "It's too cold for", x: 170, y: 556, at: 1.3, fam: KALAM, size: 66 },
    { type: 'w', text: 'the park, so can we', x: 170, y: 652, at: 2.2, fam: KALAM, size: 66 },
    { type: 'w', text: 'go to Explorazone?', x: 170, y: 748, at: 3.2, fam: KALAM, size: 66, color: RED },
    { type: 'w', text: 'You come too!', x: 170, y: 844, at: 4.3, fam: KALAM, size: 66 },
    { type: 'w', text: 'Mum says 2 of you', x: 170, y: 940, at: 5.3, fam: KALAM, size: 62 },
    { type: 'w', text: '= 3rd ticket free', x: 170, y: 1036, at: 6.3, fam: KALAM, size: 62 },
    { type: 'w', text: 'Love Sam x', x: 520, y: 1132, at: 7.3, fam: KALAM, size: 66 },
    { type: 'heart', x: 920, y: 1110, s: 36, at: 8.0 }, { type: 'star', x: 900, y: 470, r: 34, at: 0.9 },
    { type: 'pol', key: 'heat', x: 230, y: 1460, w: 330, rot: -0.08, label: 'heat vision!', at: 8.3, fam: KALAM },
    { type: 'pol', key: 'robots', x: 560, y: 1520, w: 330, rot: 0.05, label: 'robots', at: 8.9, fam: KALAM },
    { type: 'pol', key: 'sky_maze', x: 880, y: 1460, w: 330, rot: 0.1, label: 'sky maze', at: 9.5, fam: KALAM },
  ] });

// W07 Saturday: sorted (fridge) -----------------------------------------------------
spot({ id: 'W07', title: 'Saturday: sorted', slug: 'saturday-sorted', dur: 8, run: 'nov', series: 'Notebook', music: 1057,
  persona: 'Parents 25 to 44, weekend planners', angle: 'The empty Saturday on the fridge gets filled', style: 'Sticky notes and magnet photos on a fridge door',
  hook: 'Sticky note: "SAT: ???"',
  meta: { headline: 'Saturday: sorted', primary: primary('SAT: ??? Rain forecast, nothing planned.', 'Saturday sorted: the sky maze, the space zone and the light-up floor, all indoors in Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'fridge', zoom: 1.05, end: ['Saturday:', '_sorted._'], strip: ['sky_maze', 'astro', 'floor2', 'heat', 'laser_room', 'roses'], items: [
    { type: 'sticky', x: 330, y: 560, rot: -0.06, color: '#ffe873', at: 0.05, d: 0.3 },
    { type: 'w', text: 'SAT: ???', x: 170, y: 590, at: 0.2, b: 0.8, fam: '"Permanent Marker", cursive', size: 72, color: '#222', w: 400 },
    { type: 'sticky', x: 760, y: 700, rot: 0.07, color: '#ff9ec3', w: 380, h: 300, at: 1.0, d: 0.3 },
    { type: 'w', text: 'Rain. Again.', x: 600, y: 720, at: 1.2, b: 1.8, fam: KALAM, size: 54, color: '#222' },
    { type: 'strike', x: 160, y: 568, w: 300, at: 2.0 },
    { type: 'w', text: 'Explorazone!', x: 180, y: 690, at: 2.2, b: 2.9, fam: KALAM, size: 58, color: RED },
    { type: 'magnet', key: 'sky_maze', x: 300, y: 1000, w: 420, h: 300, rot: -0.05, at: 2.8, label: true },
    { type: 'magnet', key: 'astro', x: 780, y: 1080, w: 400, h: 290, rot: 0.06, at: 3.2, mag: '#1a34bf', label: true },
    { type: 'magnet', key: 'floor2', x: 520, y: 1460, w: 520, h: 360, rot: 0.02, at: 3.6, mag: '#00a884' },
  ] });

// W08 Postcard from Bowthorpe ----------------------------------------------------------
function postcardFront(key, line) {
  let bg = null;
  return (t) => {
    if (!bg) bg = paperCanvas('postcard'); ctx.drawImage(bg, 0, 0);
    ctx.save(); ctx.translate(540, 900); ctx.rotate(-0.025); photo(IMG[key], -460, -540, 920, 1080, { filter: 'saturate(1.25)', zoom: 1 + 0.04 * t });
    T('Wish you were here,', 0, -380, { size: 74, w: 700, fam: SCRIPT, color: '#fff', shadow: 'rgba(0,0,0,0.7)' });
    T('GRANDAD', 0, -240, { size: 150, w: 800, fam: HEAD, color: P.yellow, stroke: 12, strokeColor: P.red, shadow: 'rgba(0,0,0,0.4)' });
    T(line, 0, 300, { size: 38, w: 800, color: '#fff', shadow: 'rgba(0,0,0,0.8)', ls: 2 });
    ctx.restore();
  };
}
let PC_FRONT = null;
spot({ id: 'W08', title: 'Postcard from Bowthorpe', slug: 'postcard-from-bowthorpe', dur: 12, run: 'nov', series: 'Notebook', music: 682,
  persona: 'Grandparents 55+, nostalgic', angle: 'A postcard home: the old telephones and typewriters, plus heat vision for Nan', style: 'Retro postcard front with big lettering flips to a handwritten back with stamp and postmark',
  hook: 'Postcard front: "Wish you were here, GRANDAD" over the old telephones',
  meta: { headline: 'Wish you were here, Grandad', primary: primary('Greetings from Bowthorpe. Wish you were here, Grandad.', 'We found the old telephones and typewriters just like yours, and Nan tried heat vision. All indoors at Explorazone, Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'postcard', zoom: 1.04, flip: 3.0, front: (t) => { if (!PC_FRONT) PC_FRONT = postcardFront('telephones', 'OLD TELEPHONES · HEAT VISION · LASERS'); PC_FRONT(t); }, end: ['Wish you were', '_here, Grandad._'], endKind: 'cream', strip: ['telephones', 'typewriters', 'heat', 'cameras', 'laser_room', 'radios'],
    items: [
    { type: 'pic', key: 'laser_room', x: 805, y: 395, w: 160, h: 200, at: 3.5 },
    { type: 'stamp', text: 'NORWICH', x: 840, y: 560, rot: -0.2, size: 36, color: '#2b4c8c', at: 3.7 },
    { type: 'w', text: 'Dear Grandad,', x: 120, y: 520, at: 3.8, b: 4.6, fam: SCRIPT, size: 64, color: INK },
    { type: 'w', text: 'Found the old phones', x: 120, y: 640, at: 4.7, fam: KALAM, size: 54 },
    { type: 'w', text: '+ typewriters like yours!', x: 120, y: 730, at: 5.6, fam: KALAM, size: 54 },
    { type: 'w', text: 'Nan tried heat vision.', x: 120, y: 820, at: 6.5, fam: KALAM, size: 54 },
    { type: 'w', text: 'Next time: you too x', x: 120, y: 930, at: 7.3, fam: KALAM, size: 54, color: RED },
    { type: 'corners', key: 'typewriters', x: 330, y: 1530, w: 380, rot: -0.06, at: 7.6 },
    { type: 'corners', key: 'heat', x: 770, y: 1560, w: 380, rot: 0.05, at: 8.0 },
  ] });

// W19 Dear Santa --------------------------------------------------------------------------
spot({ id: 'W19', title: 'Dear Santa', slug: 'dear-santa', dur: 15, run: 'xmas', series: 'Notebook', music: 862,
  persona: 'Parents 25 to 44 with children aged 5 to 10', angle: 'A child asks Santa for a day out instead of more toys', style: 'Candy-stripe letter to Santa in a child’s handwriting, with holly and polaroids',
  hook: '"Dear Santa, I don’t want toys this year."',
  meta: { headline: 'Dear Santa: no toys this year', primary: primary('Dear Santa, I do not want toys this year. (OK, maybe one.)', 'I want the laser room, the robot waiters and the infinity floor at Explorazone, Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'santa', end: ['Dear Santa:', '_a day out, please._'], endKind: 'red', accent: P.yellow, strip: ['laser_room', 'robot2', 'infinity_floor', 'roses', 'dodeca', 'heat'], items: [
    { type: 'w', text: 'Dear Santa,', x: 150, y: 450, at: 0.1, b: 0.8, fam: PRINT, size: 82, color: RED },
    { type: 'w', text: "I don't want toys", x: 150, y: 560, at: 0.9, b: 1.6, fam: PRINT, size: 74 },
    { type: 'w', text: 'this year.', x: 150, y: 660, at: 1.7, b: 2.2, fam: PRINT, size: 74 },
    { type: 'w', text: '(ok maybe one)', x: 520, y: 660, at: 2.6, fam: PRINT, size: 54, color: PENCIL },
    { type: 'w', text: 'I want the laser room', x: 150, y: 760, at: 3.6, fam: PRINT, size: 66 },
    { type: 'w', text: 'and the robot waiters', x: 150, y: 860, at: 4.7, fam: PRINT, size: 66 },
    { type: 'w', text: '& the infinity floor.', x: 150, y: 960, at: 5.8, fam: PRINT, size: 66 },
    { type: 'w', text: 'Love Ellie, age 7', x: 430, y: 1080, at: 6.9, fam: PRINT, size: 64, color: RED },
    { type: 'star', x: 920, y: 430, r: 36, at: 0.7 }, { type: 'star', x: 980, y: 520, r: 22, at: 0.9 },
    { type: 'pol', key: 'laser_room', x: 240, y: 1450, w: 330, rot: -0.07, label: 'lasers', at: 7.8, fam: PRINT },
    { type: 'pol', key: 'robot2', x: 560, y: 1510, w: 330, rot: 0.05, label: 'robots', at: 8.3, fam: PRINT },
    { type: 'pol', key: 'infinity_floor', x: 870, y: 1450, w: 330, rot: 0.09, label: 'the floor!', at: 8.8, fam: PRINT },
  ] });

// W21 Nan's Christmas list -------------------------------------------------------------------
spot({ id: 'W21', title: 'Nan’s Christmas list', slug: 'nans-christmas-list', dur: 12, run: 'xmas', series: 'Notebook', music: 916,
  persona: 'Grandparents 55+ buying for grandchildren', angle: 'Nan crosses out socks and bath salts and circles a day out with the grandchildren', style: 'Yellow notepad list in joined-up writing, crossed out and circled in red',
  hook: '"Socks for Grandad (again)" crossed out',
  meta: { headline: 'Nan’s list: sorted', primary: primary('Christmas list: socks for Grandad (again), another jigsaw, bath salts...', 'Or a day out with all of them: the garden of light, robot waiters and infinity lights at Explorazone, Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'notepad', end: ['Nan’s list:', '_sorted._'], endKind: 'green', accent: P.yellow, strip: ['roses', 'robot2', 'dodeca', 'heat', 'laser_room', 'found_room'], items: [
    { type: 'w', text: 'Christmas list', x: 180, y: 430, at: 0.05, b: 0.6, fam: SCRIPT, size: 80, color: '#7c1d1d' },
    { type: 'w', text: 'Socks for Grandad (again)', x: 180, y: 560, at: 0.5, b: 1.4, fam: SCRIPT, size: 58, color: INK },
    { type: 'strike', x: 170, y: 540, w: 690, at: 1.6 },
    { type: 'w', text: 'Another jigsaw', x: 180, y: 656, at: 2.0, fam: SCRIPT, size: 58, color: INK }, { type: 'strike', x: 170, y: 636, w: 420, at: 2.8 },
    { type: 'w', text: 'Bath salts', x: 180, y: 752, at: 3.0, fam: SCRIPT, size: 58, color: INK }, { type: 'strike', x: 170, y: 732, w: 300, at: 3.6 },
    { type: 'w', text: 'A day out with', x: 180, y: 880, at: 3.9, fam: SCRIPT, size: 66, color: RED },
    { type: 'w', text: 'all the grandkids', x: 180, y: 976, at: 4.6, fam: SCRIPT, size: 66, color: RED },
    { type: 'circle', x: 470, y: 915, rx: 380, ry: 120, at: 5.5, d: 0.5 }, { type: 'tick', x: 920, y: 930, s: 70, at: 5.9 },
    { type: 'pol', key: 'roses', x: 250, y: 1400, w: 340, rot: -0.07, label: 'garden of light', at: 6.2, fam: SCRIPT },
    { type: 'pol', key: 'robot2', x: 570, y: 1460, w: 340, rot: 0.05, label: 'robots', at: 6.7, fam: SCRIPT },
    { type: 'pol', key: 'dodeca', x: 880, y: 1400, w: 340, rot: 0.09, label: 'lights', at: 7.2, fam: SCRIPT },
  ] });

// W27 End-of-term report ------------------------------------------------------------------------
spot({ id: 'W27', title: 'End-of-term report', slug: 'end-of-term-report', dur: 8, run: 'xmas', series: 'Notebook', music: 1021,
  persona: 'Parents 25 to 44, end of the autumn term', angle: 'The report card that matters: Fun, A*', style: 'Printed school report filled in with red pen grades',
  hook: 'Report card: "Fun: A*" in red pen',
  meta: { headline: 'Report: Fun, A*', primary: primary('End of term report. Maths: B. Reading: A. Sitting still: C. Fun: A*.', 'Teacher’s comment: needs more days out. The science lab and the AR sandbox at Explorazone, Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'report', zoom: 1.06, end: ['Report:', '_Fun, A*._'], endKind: 'cream', strip: ['lab3', 'sandbox', 'laser_room', 'heat', 'robot2', 'infinity_floor'], items: [
    { type: 'print', text: 'Maths', x: 110, y: 728, at: 0.05, size: 40 }, { type: 'print', text: 'Reading', x: 110, y: 832, at: 0.05, size: 40 },
    { type: 'print', text: 'Sitting still', x: 110, y: 936, at: 0.05, size: 40 }, { type: 'print', text: 'Fun', x: 110, y: 1040, at: 0.05, size: 40 },
    { type: 'w', text: 'B', x: 840, y: 730, at: 0.4, b: 0.6, fam: KALAM, size: 70, color: RED }, { type: 'w', text: 'A', x: 840, y: 834, at: 0.7, b: 0.9, fam: KALAM, size: 70, color: RED },
    { type: 'w', text: 'C', x: 840, y: 938, at: 1.0, b: 1.2, fam: KALAM, size: 70, color: RED }, { type: 'w', text: 'A*', x: 830, y: 1044, at: 1.3, b: 1.6, fam: KALAM, size: 80, color: RED },
    { type: 'circle', x: 880, y: 1020, rx: 90, ry: 60, at: 1.7 }, { type: 'star', x: 1000, y: 960, r: 36, at: 1.9 },
    { type: 'w', text: 'Needs more days out!', x: 110, y: 1140, at: 2.1, b: 3.0, fam: KALAM, size: 56, color: RED },
    { type: 'pol', key: 'lab3', x: 300, y: 1470, w: 380, rot: -0.06, label: 'science lab', at: 2.9, fam: KALAM },
    { type: 'pol', key: 'sandbox', x: 780, y: 1490, w: 380, rot: 0.06, label: 'AR sandbox', at: 3.3, fam: KALAM },
  ] });

// W33 Nan's diary ---------------------------------------------------------------------------------
spot({ id: 'W33', title: 'Nan’s diary', slug: 'nans-diary', dur: 12, run: 'xmas', series: 'Notebook', music: 1037,
  persona: 'Grandparents 55+ looking after grandchildren in the holidays', angle: 'Nan’s diary: grandkids at 9am, bored by 9.05, best day by 4pm', style: 'Diary page with ribbon bookmark, hour-by-hour entries in joined-up writing',
  hook: '"Weds: grandkids. Help." in Nan’s diary',
  meta: { headline: 'Grandkids all day? Easy.', primary: primary('Nan’s diary. 9am: grandkids arrive. 9.05am: they are bored.', '10am: Explorazone. Rotary phones, robot waiters and the laser room, all indoors in Bowthorpe, Norwich. 4pm: best day. Need a nap.') } },
  noteFmt, { paper: 'diary', end: ['Grandkids all day?', '_Easy._'], endKind: 'navy', accent: P.yellow, strip: ['phones', 'robot2', 'laser_room', 'heat', 'roses', 'typewriters'], items: [
    { type: 'w', text: 'Grandkids. Help.', x: 180, y: 556, at: 0.1, b: 0.9, fam: SCRIPT, size: 72, color: INK },
    { type: 'w', text: '9am: they arrive', x: 180, y: 664, at: 1.2, fam: SCRIPT, size: 60, color: INK },
    { type: 'w', text: '9.05: "Nan, I\'m bored"', x: 180, y: 756, at: 2.2, fam: SCRIPT, size: 60, color: INK },
    { type: 'w', text: '10am: Explorazone', x: 180, y: 848, at: 3.4, fam: SCRIPT, size: 64, color: RED },
    { type: 'w', text: 'phones like ours!', x: 180, y: 940, at: 4.4, fam: SCRIPT, size: 60, color: INK },
    { type: 'w', text: '4pm: best day. Nap.', x: 180, y: 1032, at: 5.4, fam: SCRIPT, size: 62, color: INK },
    { type: 'heart', x: 830, y: 1010, s: 36, at: 6.4 },
    { type: 'corners', key: 'phones', x: 320, y: 1440, w: 400, rot: -0.05, at: 6.5 },
    { type: 'corners', key: 'robot2', x: 760, y: 1480, w: 400, rot: 0.06, at: 7.0 },
  ] });

// W35 Thank-you card --------------------------------------------------------------------------------
function cardFront(t) {
  vgrad([[0, '#c22c1c'], [1, '#7a160c']]); snow(t, { n: 60, alpha: 0.5 });
  ctx.save(); ctx.strokeStyle = '#e9b949'; ctx.lineWidth = 8; ctx.strokeRect(80, 320, W - 160, 1300); ctx.restore();
  T('Thank', 540, 640, { size: 200, w: 700, fam: SCRIPT, color: '#ffe9a8', shadow: 'rgba(0,0,0,0.3)' });
  T('you!', 560, 840, { size: 200, w: 700, fam: SCRIPT, color: '#ffe9a8', shadow: 'rgba(0,0,0,0.3)' });
  [[250, 520], [840, 540], [300, 1160], [800, 1180]].forEach(([x, y], i) => star(x, y, 40 + (i % 2) * 14, '#e9b949', 1, i));
}
spot({ id: 'W35', title: 'Thank-you card', slug: 'thank-you-card', dur: 15, run: 'post', series: 'Notebook', music: 813,
  persona: 'Grandparents 55+, after Christmas', angle: 'A grandchild’s thank-you card says the day out was the best present', style: 'Red and gold card front opens to a handwritten thank-you with photo corners',
  hook: 'Red "Thank you!" card opens: "Dear Nan..."',
  meta: { headline: 'The best present this year', primary: primary('Dear Nan, thank you for my Christmas present. My favourite bit was heat vision. And the robots. Can we go again?', 'A day out at Explorazone, all indoors in Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'card', zoom: 1.05, flip: 2.2, front: cardFront, end: ['The best present', '_this year._'], endKind: 'red', accent: P.yellow, strip: ['heat', 'robots', 'laser_room', 'infinity_floor', 'sky_maze2', 'roses'],
    over: (t) => { if (t < 2.2) hook(['Dear Nan,', '_thank you..._'], 1080, 92, 0.3, t, { hl: '#ffe9a8' }); }, items: [
    { type: 'w', text: 'Dear Nan,', x: 140, y: 440, at: 2.9, b: 3.5, fam: KALAM, size: 76, color: RED },
    { type: 'w', text: 'Thank you for my', x: 140, y: 550, at: 3.6, fam: KALAM, size: 66 },
    { type: 'w', text: 'Christmas present.', x: 140, y: 646, at: 4.5, fam: KALAM, size: 66 },
    { type: 'w', text: 'Best bit: heat vision.', x: 140, y: 742, at: 5.5, fam: KALAM, size: 66 },
    { type: 'w', text: 'And the robots.', x: 140, y: 838, at: 6.6, fam: KALAM, size: 66 },
    { type: 'w', text: 'Can we go again?', x: 140, y: 934, at: 7.5, fam: KALAM, size: 66, color: RED },
    { type: 'w', text: 'Love Alfie xx', x: 480, y: 1050, at: 8.5, fam: KALAM, size: 66 },
    { type: 'heart', x: 930, y: 1030, s: 38, at: 9.2 },
    { type: 'corners', key: 'heat', x: 310, y: 1440, w: 390, rot: -0.06, at: 9.3 },
    { type: 'corners', key: 'robots', x: 770, y: 1470, w: 390, rot: 0.06, at: 9.8 },
  ] });

// W36 Resolutions -------------------------------------------------------------------------------------
spot({ id: 'W36', title: 'New Year resolutions', slug: 'new-year-resolutions', dur: 12, run: 'jan', series: 'Notebook', music: 1076,
  persona: 'Parents 25 to 44, New Year', angle: 'The family resolutions that are easy to keep', style: 'Squared spiral notebook with a resolutions list, ticks and one honest cross',
  hook: '"Resolutions: 1. Less screen time."',
  meta: { headline: 'Resolutions you can keep', primary: primary('New Year resolutions: 1. Less screen time. 2. More fresh air (it is January, no). 3. Learn something new. 4. Do more together.', 'The science lab, rocks and crystals and the microscopes at Explorazone, all indoors in Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'squared', end: ['Resolutions', '_you can keep._'], endKind: 'royal', strip: ['lab3', 'crystals', 'microscope', 'laser_room', 'sky_maze2', 'heat'], items: [
    { type: 'w', text: 'Resolutions', x: 130, y: 440, at: 0.05, b: 0.6, fam: '"Permanent Marker", cursive', size: 84, color: '#1a34bf', w: 400 },
    { type: 'w', text: '1. Less screen time', x: 130, y: 570, at: 0.6, b: 1.4, fam: HAND, size: 72, color: '#222' }, { type: 'tick', x: 920, y: 545, s: 60, at: 1.5 },
    { type: 'w', text: '2. More fresh air', x: 130, y: 680, at: 1.9, fam: HAND, size: 72, color: '#222' },
    { type: 'w', text: "(it's January. no.)", x: 300, y: 760, at: 2.8, fam: HAND, size: 54, color: PENCIL }, { type: 'strike', x: 120, y: 660, w: 560, at: 3.5 },
    { type: 'w', text: '3. Learn something new', x: 130, y: 880, at: 3.9, fam: HAND, size: 72, color: '#222' }, { type: 'tick', x: 960, y: 855, s: 60, at: 4.9 },
    { type: 'w', text: '4. Do more together', x: 130, y: 990, at: 5.2, fam: HAND, size: 72, color: '#222' }, { type: 'tick', x: 920, y: 965, s: 60, at: 6.1 },
    { type: 'card', key: 'lab3', x: 80, y: 1120, w: 440, h: 330, at: 6.4 }, { type: 'card', key: 'crystals', x: 560, y: 1160, w: 440, h: 330, at: 6.8 },
    { type: 'card', key: 'microscope', x: 300, y: 1480, w: 480, h: 360, at: 7.2 },
  ] });

// W43 Back-to-school planner ------------------------------------------------------------------------------
spot({ id: 'W43', title: 'Back-to-school planner', slug: 'back-to-school-planner', dur: 12, run: 'jan', series: 'Notebook', music: 8,
  persona: 'Parents 25 to 44, first week back at school', angle: 'Week one back: survived. Saturday: the reward', style: 'School planner with handwritten days, Saturday circled',
  hook: 'Planner: "Week 1 back: survived."',
  meta: { headline: 'First week back? Survived.', primary: primary('Week 1 back at school. Monday: dark. Tuesday: darker. Friday: survived.', 'Saturday: Explorazone. The science lab, the AR sandbox and the laser room, all indoors in Bowthorpe, Norwich.') } },
  noteFmt, { paper: 'planner', zoom: 1.04, end: ['Week one done.', '_Saturday: sorted._'], endKind: 'royal', strip: ['lab3', 'sandbox', 'laser_room', 'heat', 'infinity_floor', 'robot2'], items: [
    { type: 'w', text: 'Back. Dark. Cold.', x: 220, y: 476, at: 0.1, b: 0.8, fam: HAND, size: 58, color: '#222' },
    { type: 'w', text: 'Even darker.', x: 220, y: 594, at: 0.9, b: 1.5, fam: HAND, size: 60, color: '#222' },
    { type: 'w', text: 'Spelling test (eek)', x: 220, y: 712, at: 1.6, b: 2.3, fam: HAND, size: 60, color: '#222' },
    { type: 'w', text: 'Swimming. Lost sock.', x: 220, y: 830, at: 2.4, b: 3.1, fam: HAND, size: 60, color: '#222' },
    { type: 'w', text: 'SURVIVED!', x: 220, y: 948, at: 3.2, b: 3.7, fam: '"Permanent Marker", cursive', size: 62, color: '#1a34bf', w: 400 },
    { type: 'w', text: 'EXPLORAZONE!!', x: 220, y: 1066, at: 3.9, b: 4.6, fam: '"Permanent Marker", cursive', size: 66, color: RED, w: 400 },
    { type: 'circle', x: 500, y: 1046, rx: 330, ry: 66, at: 4.7 }, { type: 'star', x: 930, y: 1030, r: 38, at: 5.0 },
    { type: 'w', text: 'Rest.', x: 220, y: 1184, at: 5.1, b: 5.5, fam: HAND, size: 60, color: '#222' },
    { type: 'pol', key: 'lab3', x: 260, y: 1560, w: 330, rot: -0.07, label: 'science lab', at: 5.6 },
    { type: 'pol', key: 'sandbox', x: 560, y: 1600, w: 330, rot: 0.04, label: 'sandbox', at: 6.0 },
    { type: 'pol', key: 'laser_room', x: 860, y: 1560, w: 330, rot: 0.08, label: 'lasers', at: 6.4 },
  ] });
