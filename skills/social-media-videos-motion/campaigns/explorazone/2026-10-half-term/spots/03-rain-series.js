
// =====================================================================
// Rain series (V11 to V15): variations on V02 "Let it rain"
// =====================================================================
// V11 Raindrop race -------------------------------------------------
let fog11 = null;
function dropPath(keys, t) { if (t <= keys[0][0]) return 0; for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, p0] = keys[i - 1], [t1, p1] = keys[i]; return lerp(p0, p1, easeInOutSine((t - t0) / (t1 - t0))); } return 1; }
defineSpot({
  id: 'V11', title: 'Raindrop race', dur: 12, persona: 'Grandchildren and parents, rainy-day fun',
  angle: 'Raindrop racing is fun for 5 minutes. Explorazone is fun for 6 hours.', style: 'Two raindrops race down a steamy window, then a hand wipes it clear',
  hook: '"Half-term activity #1: raindrop racing" with Grandad’s drop against mine', music: 2,
  meta: { headline: 'Better than raindrop racing', primary: 'Half-term activity #1: raindrop racing. Fun for about five minutes. Explorazone: fun for six hours, with the laser room, the sky maze, heat vision and robot waiters, all indoors in Bowthorpe, Norwich.\n\nBuy 2 tickets at £18 each, the 3rd walks in free. 3 for £36. Half term: Fri 23 Oct to Sun 1 Nov. New customers only. Sign up to claim. Max 9 per group. T&Cs apply.' },
  setup() { fog11 = makeCanvas(W, H); },
  frame(t) {
    const E = 8.4;
    if (t < 4.4) {
      rainScene(ctx, t);
      const keysB = [[0.9, 0], [1.4, 0.18], [1.7, 0.2], [2.2, 0.55], [2.5, 0.58], [3.3, 1]], keysA = [[0.9, 0], [1.5, 0.25], [2.1, 0.3], [2.6, 0.62], [3.0, 0.66], [3.75, 1]];
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 8; ctx.setLineDash([26, 18]); ctx.beginPath(); ctx.moveTo(120, 1300); ctx.lineTo(960, 1300); ctx.stroke(); ctx.restore();
      T('FINISH', 540, 1370, { size: 64, w: 700, fam: HAND, color: 'rgba(255,255,255,0.75)' });
      [[380, keysA, 'Grandad'], [700, keysB, 'Me']].forEach(([x, keys, name], i) => {
        const y = 700 + 600 * dropPath(keys, t);
        ctx.save(); ctx.strokeStyle = 'rgba(220,235,255,0.28)'; ctx.lineWidth = 24; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, 700); ctx.lineTo(x, y); ctx.stroke(); ctx.restore();
        const g = ctx.createRadialGradient(x - 10, y - 12, 4, x, y, 40); g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.4, 'rgba(190,215,240,0.55)'); g.addColorStop(1, 'rgba(60,80,110,0.5)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, 34, 40, 0, 0, Math.PI * 2); ctx.fill();
        pill(x, 620, name, { size: 34, bg: i ? P.lime : P.cream, fg: P.ink, alpha: prog(t, 0.6, 0.9) });
      });
      if (t > 3.3) { const k = easeOutBack(prog(t, 3.3, 3.6)); pill(700, 1180, 'WINNER!', { size: 40, bg: P.red, fg: '#fff', scale: k, alpha: clamp(k) }); }
      logo(72, 262, 250, 1, { align: 'left' });
      if (t < 3.7) { words(['Half-term activity #1:'], 420, 86, 0.15, t, { color: '#fff', shadow: 'rgba(0,0,0,0.5)', alpha: 1 - prog(t, 3.4, 3.7) }); words(['_Raindrop racing._'], 530, 116, 0.6, t, { hl: P.teal, shadow: 'rgba(0,0,0,0.5)', alpha: 1 - prog(t, 3.4, 3.7) }); }
      else words(['Fun for about', '_five minutes._'], 420, 108, 3.75, t, { color: '#fff', hl: P.teal, shadow: 'rgba(0,0,0,0.5)' });
    } else if (t < 5.7) {
      fogWipe(fog11, t, 4.4, 5.7, IMG.laser_room);
      ctx.save(); ctx.globalAlpha = prog(t, 4.9, 5.3); vgrad([[0, 'rgba(8,14,40,0.75)'], [0.38, 'rgba(8,14,40,0)']]); ctx.restore();
      logo(72, 262, 250, 1, { align: 'left' });
      words(['Explorazone:', 'fun for _six hours._'], 420, 108, 5.0, t, { color: '#fff', hl: P.lime, shadow: 'rgba(0,0,0,0.55)' });
    } else if (t < E + 0.3) {
      cardSeq(t, [{ k: 'laser_room', a: 5.7, b: 6.6 }, { k: 'sky_maze', a: 6.6, b: 7.5 }, { k: 'heat', a: 7.5, b: 8.4 }], 580, 1000, 1100);
      logo(72, 262, 250, 1, { align: 'left' });
      words(['Explorazone:', 'fun for _six hours._'], 420, 108, 5.0, t, { color: '#fff', hl: P.lime, shadow: 'rgba(0,0,0,0.55)' });
    }
    if (t > E) endCard(t, E, { bg: () => RAIN_END(t), headline: ['Better than', '_raindrop racing._'], fg: '#fff', accent: P.teal, offerColor: P.teal, chipBg: P.teal, chipFg: P.ink, ctaBg: P.red, ctaFg: '#fff' });
  },
});

// V12 Weather forecast ------------------------------------------------
function sparkle(cx, cy, r, a) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#ffd36b'; ctx.beginPath(); for (let i = 0; i < 8; i++) { const ang = i * Math.PI / 4, rr2 = i % 2 ? r * 0.38 : r; ctx.lineTo(cx + Math.cos(ang - Math.PI / 2) * rr2, cy + Math.sin(ang - Math.PI / 2) * rr2); } ctx.closePath(); ctx.fill(); ctx.restore(); }
defineSpot({
  id: 'V12', title: 'Half-term forecast', dur: 12, persona: 'Parents planning ahead (25 to 54)',
  angle: 'Outside: showers all half term. Inside Explorazone: bright spells all day.', style: 'Weather-app forecast that swipes to an Explorazone forecast',
  hook: 'A 10-day half-term forecast with rain on every single day', music: 480,
  meta: { headline: 'The half-term forecast: indoors', primary: 'Norwich half-term forecast: showers. Explorazone forecast: bright spells in the laser room, clear skies in the sky maze and a warm front in heat vision. Six hours indoors in Bowthorpe, Norwich.\n\nBuy 2 tickets at £18 each, the 3rd walks in free. 3 for £36, 6 for £72. Half term: Fri 23 Oct to Sun 1 Nov. New customers only. Sign up to claim. Max 9 per group. T&Cs apply.' },
  setup() {},
  frame(t) {
    const E = 7.2, sw = easeInOutCubic(prog(t, 2.9, 3.5));
    const days = [['FRI', '23'], ['SAT', '24'], ['SUN', '25'], ['MON', '26'], ['TUE', '27'], ['WED', '28'], ['THU', '29'], ['FRI', '30'], ['SAT', '31'], ['SUN', '1']];
    if (t < E + 0.4) {
      if (sw < 1) {
        ctx.save(); ctx.translate(-sw * W, 0);
        vgrad([[0, '#6a7d93'], [1, '#26313f']]); rainScene(ctx, t, { drops: false, alpha: 0.5 }); ctx.save(); ctx.globalAlpha = 0.35; fill('#2a3646'); ctx.restore();
        T('NORWICH · HALF TERM', 540, 330, { size: 34, w: 700, color: '#fff', ls: 6, alpha: 0.85 });
        T('Showers', 540, 470, { size: 130, w: 800, fam: HEAD, color: '#fff' });
        cloudIcon(540, 620, 150, 1);
        T('All week. Every week.', 540, 870, { size: 50, w: 700, color: '#dfe8f2' });
        days.forEach(([d, n], i) => {
          const k = easeOutCubic(prog(t, 0.5 + i * 0.1, 0.8 + i * 0.1)); if (k <= 0) return; const y = 950 + i * 92;
          ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(255,255,255,0.08)'; rr(ctx, 70, y, 940, 80, 20); ctx.fill(); ctx.restore();
          T(`${d} ${n}`, 110, y + 54, { size: 38, w: 700, color: '#fff', align: 'left', alpha: k }); cloudIcon(540, y + 34, 40, k); T('Rain', 970, y + 54, { size: 38, w: 700, color: '#bcd0e4', align: 'right', alpha: k });
        });
        ctx.restore();
      }
      if (sw > 0) {
        ctx.save(); ctx.translate((1 - sw) * W, 0);
        bgPhoto(IMG.found_room, { filter: 'blur(30px) brightness(0.55) saturate(1.4)' }); vgrad([[0, 'rgba(90,30,140,0.55)'], [1, 'rgba(239,71,32,0.45)']]);
        T('EXPLORAZONE · BOWTHORPE', 540, 330, { size: 34, w: 700, color: '#fff', ls: 6, alpha: 0.9 });
        T('Glowing', 540, 470, { size: 130, w: 800, fam: HEAD, color: '#fff' });
        sparkle(880, 400, 70, 1);
        photo(IMG.roses, 40, 540, 1000, 420, { radius: 36, border: 6, borderColor: P.cream, zoom: 1.05 + 0.05 * prog(t, 3, 7), shadow: 'rgba(0,0,0,0.4)' });
        const rows = [['laser_room', 'Laser room', 'Bright spells'], ['sky_maze', 'Sky maze', 'Clear skies'], ['heat', 'Heat vision', 'Warm front'], ['robot2', 'Robot waiters', 'Drinks served'], ['sandbox', 'AR sandbox', 'Mountains moving'], ['dodeca', 'Infinity lights', 'Dazzling']];
        rows.forEach(([k, name, st], i) => {
          const kk = easeOutCubic(prog(t, 3.5 + i * 0.12, 3.85 + i * 0.12)); if (kk <= 0) return; const y = 1000 + i * 140;
          ctx.save(); ctx.globalAlpha = kk; ctx.fillStyle = 'rgba(255,255,255,0.14)'; rr(ctx, 40, y, 1000, 124, 26); ctx.fill(); ctx.restore();
          ctx.save(); ctx.globalAlpha = kk; ctx.beginPath(); ctx.arc(112, y + 62, 50, 0, Math.PI * 2); ctx.clip(); const im = IMG[k], s = Math.max(100 / im.width, 100 / im.height); ctx.drawImage(im, 112 - im.width * s / 2, y + 62 - im.height * s / 2, im.width * s, im.height * s); ctx.restore();
          T(name, 190, y + 76, { size: 44, w: 800, color: '#fff', align: 'left', alpha: kk }); T(st, 1005, y + 76, { size: 38, w: 700, color: P.lime, align: 'right', alpha: kk });
        });
        ctx.restore();
      }
      logo(72, 150, 230, 1 - prog(t, E, E + 0.4), { align: 'left' });
    }
    if (t > E) endCard(t, E, { bg: () => { bgPhoto(IMG.found_room, { filter: 'blur(36px) brightness(0.4) saturate(1.4)' }); vgrad([[0, 'rgba(60,20,110,0.7)'], [1, 'rgba(120,30,60,0.6)']]); }, headline: ['Forecast:', '_fun all half term._'], fg: '#fff', accent: P.lime, offerColor: P.lime, chipBg: P.lime, chipFg: P.ink, ctaBg: P.red, ctaFg: '#fff' });
  },
});

// V13 Group chat --------------------------------------------------------
const CHAT = [
  { who: 'Sarah', c: '#ff9f6b', text: 'It’s raining AGAIN.', a: 0.5 },
  { who: 'Sarah', c: '#ff9f6b', text: 'What are we doing with them all half term?', a: 1.2 },
  { who: 'Priya', c: '#7fd6ff', text: 'Soft play was heaving last time', a: 2.1 },
  { who: 'Tom', c: '#c9a6ff', text: 'Explorazone in Bowthorpe? Buy 2 tickets, the 3rd goes free', a: 3.0 },
  { who: 'Tom', c: '#c9a6ff', photo: 'laser_room', text: 'the laser room!!', a: 4.0 },
  { who: 'You', me: true, text: 'Lasers, robots AND a café? Sold.', a: 5.3 },
  { who: 'Priya', c: '#7fd6ff', text: 'Booking Wednesday. Who’s in?', a: 6.1 },
  { who: 'Sarah', c: '#ff9f6b', text: 'IN.', a: 6.8 },
];
function chatLayout() {
  let y = 0; return CHAT.map((m) => { const lines = wrap(m.text, 640, 44, 600); const h = (m.photo ? 600 : 0) + lines.length * 56 + (m.me ? 50 : 96); const r = { ...m, lines, y, h }; y += h + 26; return r; });
}
let CHAT_L = null;
defineSpot({
  id: 'V13', title: 'The group chat', dur: 12, persona: 'Parents, word-of-mouth style (25 to 44)',
  angle: 'A rainy-day parents’ group chat lands on Explorazone', style: 'Messaging-app conversation over a rainy window, with a big photo message',
  hook: '"It’s raining AGAIN. What are we doing with them all half term?"', music: 729,
  meta: { headline: 'The group chat has decided', primary: '"It’s raining AGAIN. What are we doing with them all half term?" Sorted: Explorazone in Bowthorpe. Lasers, robot waiters, a sky maze and a café, all indoors.\n\nBuy 2 tickets at £18 each, the 3rd walks in free. 3 for £36, 6 for £72, 9 for £108. Half term: Fri 23 Oct to Sun 1 Nov. New customers only. Sign up to claim. T&Cs apply.' },
  setup() { CHAT_L = chatLayout(); },
  frame(t) {
    const E = 7.9;
    if (t < E + 0.4) {
      rainScene(ctx, t, { alpha: 0.7 }); ctx.save(); ctx.globalAlpha = 0.45; fill('#0b1424'); ctx.restore();
      const visible = CHAT_L.filter((m) => t >= m.a);
      const bottom = visible.length ? visible[visible.length - 1].y + visible[visible.length - 1].h : 0;
      const target = Math.max(0, bottom - 1430); const prev = CHAT_L.filter((m) => t >= m.a + 0.0 && t - m.a < 0.35);
      const scroll = target - (prev.length ? (1 - easeOutCubic((t - prev[0].a) / 0.35)) * Math.min(prev[0].h + 26, target) : 0);
      ctx.save(); ctx.translate(0, 300 - scroll);
      CHAT_L.forEach((m, i) => {
        if (t < m.a) return; const k = easeOutBack(prog(t, m.a, m.a + 0.3), 1.2);
        const bw = Math.max(...m.lines.map((l) => measure(l, 44, 600))) + 60, w2 = m.photo ? 700 : Math.max(bw, m.me ? 0 : measure(m.who, 30, 800) + 60);
        const x = m.me ? W - 50 - w2 : 50;
        ctx.save(); ctx.translate(x + (m.me ? w2 : 0), m.y); ctx.scale(k, k); ctx.translate(-(m.me ? w2 : 0), 0); ctx.globalAlpha = clamp(k);
        ctx.fillStyle = m.me ? P.lime : '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 16; rr(ctx, 0, 0, w2, m.h, 34); ctx.fill(); ctx.shadowColor = 'transparent';
        let yy = 20;
        if (!m.me) { T(m.who, 30, yy + 32, { size: 30, w: 800, color: m.c === '#7fd6ff' ? '#1678b8' : m.c === '#c9a6ff' ? '#6a3fc2' : '#d4561f', align: 'left' }); yy += 46; }
        if (m.photo) { photo(IMG[m.photo], 14, yy, w2 - 28, 580, { radius: 24 }); yy += 600; }
        m.lines.forEach((l, j) => T(l, 30, yy + 44 + j * 56, { size: 44, w: 600, color: P.ink, align: 'left' }));
        ctx.restore();
      });
      // typing indicator before each new message
      const next = CHAT_L.find((m) => t < m.a && t > m.a - 0.55);
      if (next && !next.me) { const y = (visible.length ? visible[visible.length - 1].y + visible[visible.length - 1].h + 26 : 0); ctx.fillStyle = '#fff'; rr(ctx, 50, y, 150, 80, 34); ctx.fill(); for (let d = 0; d < 3; d++) { ctx.fillStyle = `rgba(20,32,58,${0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * 12 - d))})`; ctx.beginPath(); ctx.arc(95 + d * 30, y + 40, 10, 0, Math.PI * 2); ctx.fill(); } }
      ctx.restore();
      // header and input bar fill the top and bottom
      ctx.fillStyle = 'rgba(18,26,48,0.94)'; ctx.fillRect(0, 0, W, 270);
      ctx.save(); ctx.beginPath(); ctx.arc(140, 180, 56, 0, Math.PI * 2); ctx.fillStyle = P.lime; ctx.fill(); ctx.restore(); T('Y4', 140, 196, { size: 44, w: 800, fam: HEAD, color: P.ink });
      T('Year 4 parents', 220, 175, { size: 46, w: 800, color: '#fff', align: 'left' }); T('Sarah, Priya, Tom, you', 220, 222, { size: 30, w: 500, color: '#b9c3d8', align: 'left' });
      ctx.fillStyle = 'rgba(18,26,48,0.94)'; ctx.fillRect(0, 1760, W, 160); ctx.fillStyle = '#fff'; rr(ctx, 40, 1790, 860, 96, 48); ctx.fill(); T('Message', 90, 1852, { size: 36, w: 500, color: '#8a93a6', align: 'left' });
      ctx.fillStyle = P.lime; ctx.beginPath(); ctx.arc(980, 1838, 48, 0, Math.PI * 2); ctx.fill(); T('➤', 982, 1854, { size: 44, w: 800, color: P.ink });
    }
    if (t > E) endCard(t, E, { bg: () => RAIN_END(t), headline: ['The group chat', 'has _decided._'], fg: '#fff', accent: P.lime, offerColor: P.lime, chipBg: P.lime, chipFg: P.ink, ctaBg: P.red, ctaFg: '#fff' });
  },
});

// V14 Umbrella -----------------------------------------------------------
const SPL = (() => { const r = rng(77); return Array.from({ length: 70 }, () => ({ a: r() * 6.28, rr: 0.15 + r() * 0.8, ph: r() * 3 })); })();
function umbrella(cx, cy, R, rot, t, photoK) {
  const keys = ['laser_room', 'roses', 'sky_maze', 'heat', 'dodeca', 'robot2', 'floor2', 'sandbox'];
  for (let i = 0; i < 8; i++) {
    const a0 = rot + i * Math.PI / 4, a1 = a0 + Math.PI / 4, am = (a0 + a1) / 2;
    ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a0) * R, cy + Math.sin(a0) * R);
    ctx.quadraticCurveTo(cx + Math.cos(am) * R * 0.9, cy + Math.sin(am) * R * 0.9, cx + Math.cos(a1) * R, cy + Math.sin(a1) * R); ctx.closePath();
    ctx.fillStyle = i % 2 ? P.cream : P.red; ctx.fill(); ctx.clip();
    const pk = photoK[i]; if (pk > 0) { ctx.globalAlpha = pk; const im = IMG[keys[i]], s = Math.max(R * 1.2 / im.width, R * 1.2 / im.height); const px = cx + Math.cos(am) * R * 0.55, py = cy + Math.sin(am) * R * 0.55; ctx.translate(px, py); ctx.rotate(am + Math.PI / 2); ctx.drawImage(im, -im.width * s / 2, -im.height * s / 2, im.width * s, im.height * s); }
    ctx.restore();
    ctx.save(); ctx.strokeStyle = 'rgba(40,20,10,0.35)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a0) * R, cy + Math.sin(a0) * R); ctx.stroke(); ctx.restore();
  }
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, 'rgba(255,255,255,0.18)'); g.addColorStop(0.6, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,0.25)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2b1a12'; ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.fill();
  SPL.forEach((s) => { const p = ((t * 1.6 + s.ph) % 1); const x = cx + Math.cos(s.a + rot) * R * s.rr, y = cy + Math.sin(s.a + rot) * R * s.rr; ctx.strokeStyle = `rgba(230,240,255,${0.6 * (1 - p)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, 6 + p * 34, 4 + p * 22, 0, 0, Math.PI * 2); ctx.stroke(); });
}
defineSpot({
  id: 'V14', title: 'Leave the umbrella', dur: 12, persona: 'Three generations, families',
  angle: 'A red umbrella spins and every panel turns into a colourful room inside', style: 'Top-down spinning umbrella in the rain, panels become photos, then a photo mosaic',
  hook: 'Rain bouncing off a big red umbrella seen from above', music: 1037,
  meta: { headline: 'Leave the umbrella at home', primary: 'Rain all half term? Under one roof at Explorazone: the laser room, a garden of light, the sky maze, heat vision, infinity lights and robot waiters. Bring Nan, Grandad and the kids.\n\nBuy 2 tickets at £18 each, the 3rd walks in free. 3 for £36. Half term: Fri 23 Oct to Sun 1 Nov, Bowthorpe, Norwich. New customers only. Sign up to claim. Max 9 per group. T&Cs apply.' },
  setup() {},
  frame(t) {
    const E = 7.2;
    if (t < E + 0.4) {
      vgrad([[0, '#3a4757'], [1, '#141a23']]); rainScene(ctx, t, { drops: false, alpha: 0.9 });
      const close = easeInCubic(prog(t, 4.7, 5.3));
      const spin = 0.3 * t + 2.2 * easeInCubic(prog(t, 2.0, 4.8)) * (t - 2.0 > 0 ? 1 : 0);
      const photoK = Array.from({ length: 8 }, (_, i) => prog(t, 2.2 + i * 0.28, 2.5 + i * 0.28));
      if (close < 1) { ctx.save(); ctx.globalAlpha = 1 - close; umbrella(540, 1080, 500 * (1 - close * 0.6), spin, t, photoK); ctx.restore(); }
      if (t > 4.8) {
        const keys = ['laser_room', 'roses', 'sky_maze', 'heat', 'dodeca', 'robot2'];
        keys.forEach((k, i) => { const kk = easeOutBack(prog(t, 4.9 + i * 0.09, 5.3 + i * 0.09), 1.1); if (kk <= 0) return; const col = i % 2, row = Math.floor(i / 2); const x = 40 + col * 510, y = 600 + row * 420; ctx.save(); ctx.translate(x + 245, y + 200); ctx.scale(kk, kk); photo(IMG[k], -245, -200, 490, 400, { radius: 30, border: 6, borderColor: P.cream, shadow: 'rgba(0,0,0,0.4)' }); pill(0, 150, LABEL[k], { size: 26, bg: P.lime, fg: P.ink, shadow: false }); ctx.restore(); });
      }
      logo(72, 262, 250, 1, { align: 'left' });
      if (t < 2.5) words(['Rain all', '_half term?_'], 430, 112, 0.2, t, { color: '#fff', hl: P.teal, shadow: 'rgba(0,0,0,0.5)', alpha: 1 - prog(t, 2.2, 2.5) });
      else if (t < 4.9) words(['Under one roof:', '_all the colour._'], 430, 108, 2.5, t, { color: '#fff', hl: P.lime, shadow: 'rgba(0,0,0,0.5)', alpha: 1 - prog(t, 4.6, 4.9) });
      else words(['Three generations.', '_One goes free._'], 430, 104, 5.0, t, { color: '#fff', hl: P.lime, shadow: 'rgba(0,0,0,0.5)' });
    }
    if (t > E) endCard(t, E, { bg: () => { vgrad([[0, '#9b2c14'], [1, '#4a1208']]); }, headline: ['Leave the umbrella', 'at _home._'], fg: P.cream, accent: '#ffd98a', offerColor: P.cream, chipBg: P.cream, chipFg: '#7a2410', ctaBg: P.cream, ctaFg: '#7a2410', tickerBg: P.cream });
  },
});

// V15 Puddle reflection -----------------------------------------------------
let tarmac = null;
const RIP = (() => { const r = rng(15); return Array.from({ length: 26 }, () => ({ x: r(), y: r(), ph: r() * 2, s: 0.6 + r() * 0.8 })); })();
function rippleRect(img, x0, y0, w, h, t, amp) {
  const s = Math.max(w / img.width, h / img.height) * 1.06, iw = img.width * s, ih = img.height * s, oy = y0 + (h - ih) / 2, ox = x0 + (w - iw) / 2;
  for (let y = Math.max(y0, oy); y < Math.min(y0 + h, oy + ih); y += 8) {
    const off = amp * Math.sin(y * 0.03 + t * 5) + amp * 0.5 * Math.sin(y * 0.09 - t * 3);
    ctx.drawImage(img, 0, (y - oy) / s, img.width, 8 / s, ox + off, y, iw, 8.5);
  }
}
function drawPuddle(t, cx, cy, rx, ry, img, o = {}) {
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.clip();
  if (img) rippleRect(img, cx - rx, cy - ry, rx * 2, ry * 2, t, o.amp ?? 10);
  else { const gr = ctx.createLinearGradient(0, cy - ry, 0, cy + ry); gr.addColorStop(0, '#8fa1b5'); gr.addColorStop(1, '#3e4b5c'); ctx.fillStyle = gr; ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2); }
  RIP.forEach((r) => { const p = ((t * 0.9 * r.s + r.ph) % 1); const x = cx - rx + r.x * rx * 2, y = cy - ry + r.y * ry * 2; ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - p)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, 10 + p * 90, 4 + p * 36, 0, 0, Math.PI * 2); ctx.stroke(); });
  ctx.restore();
  if (rx < 1000) { ctx.save(); ctx.strokeStyle = 'rgba(20,24,30,0.6)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
}
defineSpot({
  id: 'V15', title: 'Puddle season', dur: 12, persona: 'Families, all ages, dreamy and visual',
  angle: 'Look closer at the puddle: it reflects the garden of light', style: 'Rippling puddle reflection that dives into colourful rooms',
  hook: '"Puddle season is here." with rain rippling a puddle', music: 175,
  meta: { headline: 'Puddles outside. Wonder inside.', primary: 'Puddle season is here. Look closer: a garden of light, a sky maze and infinity lights, six hours of it, all indoors at Explorazone in Bowthorpe, Norwich.\n\nBuy 2 tickets at £18 each, the 3rd walks in free. 3 for £36, 6 for £72, 9 for £108. Half term: Fri 23 Oct to Sun 1 Nov. New customers only. Sign up to claim. T&Cs apply.' },
  setup() {
    tarmac = makeCanvas(W, H); const g = tarmac.getContext('2d'), r = rng(8);
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#20262e'); gr.addColorStop(1, '#0e1115'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 14000; i++) { const v = 40 + r() * 70; g.fillStyle = `rgba(${v},${v},${v + 8},${0.25 + r() * 0.35})`; g.fillRect(r() * W, r() * H, 1 + r() * 3, 1 + r() * 3); }
  },
  frame(t) {
    const E = 7.6;
    if (t < E + 0.4) {
      ctx.drawImage(tarmac, 0, 0);
      ctx.save(); ctx.globalAlpha = 0.6; rainScene(ctx, t, { drops: false }); ctx.restore();
      const dive = easeInCubic(prog(t, 3.4, 4.2));
      const img = t < 2.4 ? null : IMG.roses;
      const rx = lerp(470, 1400, dive), ry = lerp(300, 1500, dive), cy = lerp(1250, 960, dive);
      if (t < 4.2) drawPuddle(t, 540, cy, rx, ry, img, { amp: lerp(10, 2, dive) });
      if (t > 2.4 && t < 3.4) { ctx.save(); ctx.globalAlpha = 1 - prog(t, 2.4, 2.9); drawPuddle(t, 540, cy, rx, ry, null); ctx.restore(); }
      if (t >= 4.2) {
        const sc = [{ k: 'roses', a: 4.2, b: 5.6 }, { k: 'sky_maze', a: 5.6, b: 6.6 }, { k: 'dodeca', a: 6.6, b: 7.8 }];
        sc.forEach((c) => { const a = win(t, c.a - 0.25, c.b + 0.25, 0.4); if (a <= 0) return; const amp = 14 * (1 - prog(t, c.a - 0.25, c.a + 0.5));
          if (amp > 0.5) { ctx.save(); ctx.globalAlpha = a; rippleRect(IMG[c.k], -60, -60, W + 120, H + 120, t, amp); ctx.restore(); } else photo(IMG[c.k], -60, -60, W + 120, H + 120, { zoom: 1 + 0.06 * prog(t, c.a, c.b), alpha: a });
          pill(540, 1320, LABEL[c.k], { size: 36, bg: P.lime, fg: P.ink, alpha: a * prog(t, c.a + 0.3, c.a + 0.5) }); });
        ctx.save(); vgrad([[0, 'rgba(6,12,30,0.75)'], [0.36, 'rgba(6,12,30,0)'], [0.75, 'rgba(6,12,30,0)'], [1, 'rgba(6,12,30,0.5)']]); ctx.restore();
      }
      logo(72, 262, 250, 1, { align: 'left' });
      if (t < 2.3) words(['Puddle season', 'is _here._'], 430, 112, 0.2, t, { color: '#fff', hl: P.teal, shadow: 'rgba(0,0,0,0.5)', alpha: 1 - prog(t, 2.0, 2.3) });
      else if (t < 4.3) words(['Look _closer._'], 430, 120, 2.4, t, { color: '#fff', hl: P.lime, shadow: 'rgba(0,0,0,0.5)', alpha: 1 - prog(t, 4.0, 4.3) });
      else words(['Dry feet.', '_Bright lights._'], 430, 112, 4.4, t, { color: '#fff', hl: P.lime, shadow: 'rgba(0,0,0,0.5)' });
    }
    if (t > E) endCard(t, E, { bg: () => { ctx.drawImage(tarmac, 0, 0); ctx.save(); ctx.globalAlpha = 0.6; fill('#0b2236'); ctx.restore(); }, headline: ['Puddles outside.', '_Wonder inside._'], fg: '#fff', accent: P.teal, offerColor: P.teal, chipBg: P.teal, chipFg: P.ink, ctaBg: P.red, ctaFg: '#fff' });
  },
});
