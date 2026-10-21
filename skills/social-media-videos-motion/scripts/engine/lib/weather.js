// =====================================================================
// lib/weather.js: rain on glass, weather icons, fog-wipe reveal, photo card sequence
// rainScene(g, t, {drops, alpha}) · cloudIcon(cx, cy, s, a) · RAIN_END(t) · fogWipe(cnv, t, a, b, img, {fx, turns, ph}) · cardSeq(t, cards, y, w, h, {dim})
// =====================================================================
const RAIN = (() => {
  const r = rng(11);
  return {
    streaks: Array.from({ length: 240 }, () => ({ x: r() * (W + 300), y: r() * (H + 300), len: 40 + r() * 70, v: 1500 + r() * 1300, a: 0.12 + r() * 0.25, w: 1 + r() * 1.6 })),
    drops: Array.from({ length: 170 }, () => ({ x: r() * W, y: r() * H, r: 3 + r() * 9 })),
    slides: Array.from({ length: 14 }, () => ({ x: r() * W, y: r() * H * 0.6, r: 7 + r() * 6, s: r() * 2.5, v: 160 + r() * 260 })),
    bokeh: Array.from({ length: 16 }, () => ({ x: r() * W, y: 200 + r() * (H - 400), r: 60 + r() * 120, c: ['255,179,71', '255,226,170', '0,221,180', '255,120,80'][Math.floor(r() * 4)], a: 0.12 + r() * 0.22, d: (r() - 0.5) * 20 })),
  };
})();
function rainScene(g, t, o = {}) {
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#3b4757'); gr.addColorStop(1, '#141a23'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  RAIN.bokeh.forEach((b) => { const x = b.x + b.d * t; const rg = g.createRadialGradient(x, b.y, 0, x, b.y, b.r); rg.addColorStop(0, `rgba(${b.c},${b.a})`); rg.addColorStop(1, `rgba(${b.c},0)`); g.fillStyle = rg; g.fillRect(x - b.r, b.y - b.r, b.r * 2, b.r * 2); });
  g.save(); g.lineCap = 'round';
  RAIN.streaks.forEach((s) => { const y = ((s.y + s.v * t) % (H + 300)) - 150; const x = (s.x - y * 0.12) % (W + 300); g.strokeStyle = `rgba(200,220,240,${s.a * (o.alpha ?? 1)})`; g.lineWidth = s.w; g.beginPath(); g.moveTo(x, y); g.lineTo(x + s.len * 0.12, y - s.len); g.stroke(); });
  g.restore();
  if (o.drops !== false) {
    RAIN.drops.forEach((d) => { g.fillStyle = 'rgba(10,16,24,0.35)'; g.beginPath(); g.arc(d.x, d.y, d.r, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(230,240,255,0.45)'; g.beginPath(); g.arc(d.x - d.r * 0.3, d.y - d.r * 0.35, d.r * 0.35, 0, Math.PI * 2); g.fill(); });
    RAIN.slides.forEach((d) => { const dt = Math.max(0, t - d.s); const y = d.y + d.v * dt * dt * 0.6; g.strokeStyle = 'rgba(200,215,235,0.18)'; g.lineWidth = d.r * 0.9; g.lineCap = 'round'; g.beginPath(); g.moveTo(d.x, d.y); g.lineTo(d.x, y); g.stroke(); g.fillStyle = 'rgba(225,235,250,0.5)'; g.beginPath(); g.arc(d.x, y, d.r, 0, Math.PI * 2); g.fill(); });
  }
}
function cloudIcon(cx, cy, s, a) {
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#dfe8f2';
  [[-0.35, 0.05, 0.32], [0, -0.12, 0.42], [0.36, 0.06, 0.3]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(cx + x * s, cy + y * s, r * s, 0, Math.PI * 2); ctx.fill(); });
  ctx.fillRect(cx - 0.62 * s, cy + 0.02 * s, 1.25 * s, 0.32 * s);
  ctx.strokeStyle = '#7fb8ff'; ctx.lineWidth = s * 0.07; ctx.lineCap = 'round';
  for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(cx + i * 0.35 * s, cy + 0.5 * s); ctx.lineTo(cx + i * 0.35 * s - 0.1 * s, cy + 0.78 * s); ctx.stroke(); }
  ctx.restore();
}
const RAIN_END = (t) => { rainScene(ctx, t, { drops: false, alpha: 0.6 }); ctx.save(); ctx.globalAlpha = 0.72; fill('#0d1a3a'); ctx.restore(); };
function fogWipe(cnv, t, a, b, img, o = {}) {
  // draws img full-bleed, then a fogged rainy window that gets wiped away between a and b
  photo(img, 0, 0, W, H, { zoom: 1.05 + 0.05 * prog(t, a, b + 1), fx: o.fx ?? 0.5 });
  const g = cnv.getContext('2d');
  g.globalCompositeOperation = 'source-over'; rainScene(g, t, { alpha: 0.8 }); g.fillStyle = 'rgba(200,214,228,0.22)'; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'destination-out'; g.strokeStyle = '#000'; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 280;
  const p = easeInOutSine(prog(t, a, b - 0.5)), N = 60; g.beginPath();
  for (let i = 0; i <= N * p; i++) { const u = i / N; const x = 540 + 380 * Math.sin(u * Math.PI * (o.turns ?? 3.2) + (o.ph ?? 0)), y = 1500 - 1150 * u; i ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.stroke(); const cr = easeInCubic(prog(t, b - 0.6, b)) * 1600; if (cr > 0) { g.beginPath(); g.arc(540, 900, cr, 0, Math.PI * 2); g.fill(); }
  g.globalCompositeOperation = 'source-over'; ctx.drawImage(cnv, 0, 0);
}
function cardSeq(t, cards, y, w, h, o = {}) {
  cards.forEach((c) => { const a = win(t, c.a - 0.2, c.b + 0.2, 0.35); if (a > 0) bgPhoto(IMG[c.k], { alpha: a }); });
  ctx.save(); ctx.globalAlpha = o.dim ?? 0.3; fill('#06102a'); ctx.restore();
  cards.forEach((c, i) => {
    if (t < c.a - 0.05 || t > c.b + 0.35) return;
    const kin = easeOutCubic(prog(t, c.a, c.a + 0.4)), kout = easeInCubic(prog(t, c.b, c.b + 0.35));
    const x = (W - w) / 2 + (i > 0 ? (1 - kin) * 1100 : 0) - kout * 1150;
    photo(IMG[c.k], x, y, w, h, { radius: 40, border: 7, borderColor: ROLE.light, zoom: 1 + 0.08 * prog(t, c.a, c.b), shadow: 'rgba(0,0,0,0.5)' });
    pill(x + 50 + measure(LABEL[c.k], 34, 800) / 2 + 30, y + h - 60, LABEL[c.k], { size: 34, bg: ROLE.accent, fg: ROLE.ink, alpha: prog(t, c.a + 0.25, c.a + 0.45) });
  });
}

