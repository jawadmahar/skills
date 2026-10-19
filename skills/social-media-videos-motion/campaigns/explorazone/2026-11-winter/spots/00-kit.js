// =====================================================================
// Winter 2026-27 kit: offer copy, run windows, snow, end-card wrapper and photo beats
// Every format in 01 to 05 returns { setup, frame } from a config; spot() turns it into a video.
// =====================================================================
const OFFER_COPY = 'Buy 2 tickets at £18 each and the 3rd goes free: 3 for £36, 6 for £72, 9 for £108. Ends Fri 12 Feb 2027. We reserve the right to end this offer sooner.';
function primary(lead, more) { return `${lead}${more ? ' ' + more : ''}\n\n${OFFER_COPY}\n\n${COPY.terms}`; }
// when each video should run (start and end dates go into the ad copy sheet)
const RUN = {
  nov: ['2026-11-02', '2026-11-29'], xmas: ['2026-11-30', '2026-12-20'], hols: ['2026-12-19', '2027-01-04'],
  post: ['2026-12-26', '2027-01-04'], jan: ['2027-01-01', '2027-01-10'], winter: ['2026-12-19', '2027-01-10'],
};
const PERIOD = { nov: 'November', xmas: 'Christmas run-up', hols: 'Christmas holidays', post: 'Christmas holidays', jan: 'New Year and back to school', winter: 'Christmas holidays and January' };
function spot(m, fmt, cfg = {}) {
  const f = fmt({ dur: m.dur, ...cfg });
  defineSpot({ ...m, meta: { button: 'Sign up', ...m.meta, start: RUN[m.run][0], end: RUN[m.run][1], period: PERIOD[m.run] }, setup: f.setup ?? (() => {}), frame: f.frame });
}
const endAt = (dur) => dur - 3.6;

// ---------- snow ----------
const SNOWF = (() => { const r = rng(77); return Array.from({ length: 170 }, () => ({ x: r() * W, y: r() * H, r: 2 + r() * 7, v: 70 + r() * 150, sw: 10 + r() * 40, f: 0.5 + r() * 1.5, ph: r() * 6.28, a: 0.45 + r() * 0.5 })); })();
function snow(t, o = {}) {
  const n = Math.min(o.n ?? SNOWF.length, SNOWF.length);
  ctx.save(); ctx.fillStyle = o.color ?? '#fff';
  for (let i = 0; i < n; i++) {
    const s = SNOWF[i]; const y = ((s.y + s.v * (o.speed ?? 1) * t) % (H + 40)) - 20;
    const x = (((s.x + Math.sin(t * s.f + s.ph) * s.sw + (o.wind ?? 0) * t * s.v) % W) + W) % W;
    ctx.globalAlpha = s.a * (o.alpha ?? 1); ctx.beginPath(); ctx.arc(x, y, s.r * (o.scale ?? 1), 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// ---------- end card ----------
function endBg(kind, t, key) {
  return () => {
    if (kind === 'rain') { RAIN_END(t); return; }
    if (kind === 'photo') { bgPhoto(IMG[key]); ctx.save(); ctx.globalAlpha = 0.5; fill('#0d1a3a'); ctx.restore(); return; }
    if (kind === 'red') { vgrad([[0, '#c22c1c'], [1, '#6d140b']]); snow(t, { alpha: 0.45, n: 90 }); return; }
    if (kind === 'green') { vgrad([[0, '#13654a'], [1, '#072b1d']]); snow(t, { alpha: 0.4, n: 90 }); return; }
    if (kind === 'royal') { vgrad([[0, '#2440d6'], [1, '#101f7a']]); return; }
    if (kind === 'cream') { fill(P.cream); return; }
    vgrad([[0, '#1f3060'], [1, '#0a1330']]);
    if (kind === 'snow') snow(t, { alpha: 0.55, n: 110 });
  };
}
function endScene(t, E, headline, kind = 'snow', o = {}) {
  if (t <= E) return;
  const light = kind === 'cream', red = kind === 'red';
  const acc = o.accent ?? (light ? P.red : P.lime);
  const st = light
    ? { fg: P.ink, accent: acc, offerColor: P.red, chipBg: P.navy, chipFg: '#fff', tickerBg: P.red, tickerFg: '#fff', ctaBg: P.red, ctaFg: '#fff', stripBorder: '#fff' }
    : { fg: '#fff', accent: acc, offerColor: acc, chipBg: acc, chipFg: P.ink, ctaBg: red ? '#fff' : P.red, ctaFg: red ? P.red : '#fff' };
  endCard(t, E, { bg: endBg(kind, t, o.key), headline, ...st, logoShadow: true, ...o });
}

// ---------- shared on-screen pieces ----------
function brandTop(a = 1) { logo(72, 262, 250, a, { align: 'left', shadow: true }); }
function hook(lines, y, size, t0, t, o = {}) { return words(lines, y, size, t0, t, { color: '#fff', hl: P.lime, shadow: 'rgba(0,0,0,0.55)', ...o }); }
function labelPill(key, x, y, o = {}) { const lab = o.text ?? LABEL[key]; if (!lab) return; const s = o.size ?? 32; pill(x + measure(lab, s, 800) / 2 + s * 0.85, y, lab, { size: s, bg: o.bg ?? P.lime, fg: o.fg ?? P.ink, alpha: o.alpha ?? 1, rot: o.rot ?? 0 }); }
function card(key, x, y, w, h, o = {}) {
  photo(IMG[key], x, y, w, h, { radius: o.radius ?? 36, border: o.border ?? 7, borderColor: o.borderColor ?? '#fff', shadow: o.shadow ?? 'rgba(0,0,0,0.45)', zoom: o.zoom ?? 1, alpha: o.alpha ?? 1, filter: o.filter, fx: o.fx, fy: o.fy });
  if (o.label !== false) labelPill(key, x + 36, y + h - 56, { alpha: o.alpha ?? 1, bg: o.labelBg, fg: o.labelFg });
}
// cards drop onto a pile one after another; the last stays on top
function dropStack(t, keys, t0, step, o = {}) {
  const cx = o.cx ?? 540, cy = o.cy ?? 860, w = o.w ?? 880, h = o.h ?? 640;
  keys.forEach((k, i) => {
    const a = t0 + i * step; if (t < a) return;
    const p = easeOutBack(prog(t, a, a + 0.45), 1.2); const rot = ((i % 3) - 1) * 0.05 * (o.tilt ?? 1);
    ctx.save(); ctx.translate(cx, cy - (1 - p) * 900); ctx.rotate(rot * p + (1 - p) * 0.3); ctx.globalAlpha = clamp(p * 2);
    card(k, -w / 2, -h / 2, w, h, { zoom: 1 + 0.05 * prog(t, a, a + step + 1), labelBg: o.labelBg });
    ctx.restore();
  });
}
// a 2 x 2 grid of photos that pops in tile by tile
function mosaic(t, keys, t0, o = {}) {
  const x0 = o.x ?? 70, y0 = o.y ?? 560, s = o.s ?? 455, gap = o.gap ?? 30;
  keys.slice(0, 4).forEach((k, i) => {
    const k1 = easeOutBack(prog(t, t0 + i * 0.18, t0 + i * 0.18 + 0.4)); if (k1 <= 0) return;
    const x = x0 + (i % 2) * (s + gap), y = y0 + Math.floor(i / 2) * (s + gap);
    ctx.save(); ctx.translate(x + s / 2, y + s / 2); ctx.scale(k1, k1);
    photo(IMG[k], -s / 2, -s / 2, s, s, { radius: 30, border: 6, borderColor: '#fff', shadow: 'rgba(0,0,0,0.4)', zoom: 1.05 + 0.04 * prog(t, t0, t0 + 3) });
    if (o.labels !== false) pill(0, -s / 2 + 46, LABEL[k] || '', { size: 26, bg: o.labelBg ?? P.lime, fg: P.ink });
    ctx.restore();
  });
}
// full-bleed photo with a slow push-in, for scene backgrounds
function heroPhoto(key, t, a, b, o = {}) { photo(IMG[key], 0, 0, W, H, { zoom: (o.z0 ?? 1.05) + (o.dz ?? 0.08) * prog(t, a, b), fx: o.fx ?? 0.5, fy: o.fy ?? 0.5, filter: o.filter, alpha: o.alpha ?? 1 }); }
function shade(top = 0.7, bottom = 0.0, mid = 0.38) { vgrad([[0, `rgba(8,14,40,${top})`], [mid, 'rgba(8,14,40,0)'], [1, `rgba(8,14,40,${bottom})`]]); }
