import * as THREE from 'three';

const ASSETS = __ASSETS__;
const BRAND = __BRAND__;
const CAMPAIGN = __CAMPAIGN__;

// ---------- brand and campaign settings (edit brand.json and campaign.json, not this file) ----------
// COPY holds every on-screen line shared across a campaign; campaign values override brand values
const COPY = { ...(BRAND.copy || {}), ...(CAMPAIGN.copy || {}) };
const P = { ...(BRAND.palette || {}), ...(CAMPAIGN.palette || {}) };
// semantic colours used by the shared helpers; each role names a palette entry or holds a hex value
const ROLE = Object.fromEntries(Object.entries({ accent: '#ffd400', light: '#ffffff', ink: '#111111', cta: '#e63946', ctaText: '#ffffff', ...(BRAND.roles || {}), ...(CAMPAIGN.roles || {}) }).map(([k, v]) => [k, P[v] ?? v]));
const HEAD = BRAND.fonts?.head ?? '"Arial Black", Inter, sans-serif';
const BODY = BRAND.fonts?.body ?? 'Inter, system-ui, "Segoe UI", Arial, sans-serif';
const HAND = BRAND.fonts?.hand ?? 'Caveat, "Comic Sans MS", cursive';

// ---------- maths ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const smooth = (x) => x * x * (3 - 2 * x);
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const easeInCubic = (x) => x * x * x;
const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeInOutSine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
const easeOutBack = (x, c1 = 1.5) => { const c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const win = (t, a, b, f = 0.3) => prog(t, a, a + f) * (1 - prog(t, b - f, b)); // fade in at a, out by b
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }

// ---------- canvas ----------
const W = 1080, H = 1920;
const out = document.getElementById('out');
const ctx = out.getContext('2d');
let IMG = {};
function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function rr(g, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function fill(c, g = ctx) { g.fillStyle = c; g.fillRect(0, 0, W, H); }
function vgrad(stops, y0 = 0, y1 = H, g = ctx) { const gr = g.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function vignette(a = 0.5, g = ctx) { const v = g.createRadialGradient(W / 2, H * 0.48, H * 0.25, W / 2, H * 0.5, H * 0.78); v.addColorStop(0, 'rgba(5,8,18,0)'); v.addColorStop(1, `rgba(5,8,18,${a})`); g.fillStyle = v; g.fillRect(0, 0, W, H); }
function T(s, x, y, o = {}) {
  const g = o.g || ctx; g.save();
  g.globalAlpha = o.alpha ?? 1; g.font = `${o.italic ? 'italic ' : ''}${o.w ?? 700} ${o.size ?? 40}px ${o.fam ?? BODY}`;
  g.fillStyle = o.color ?? '#fff'; g.textAlign = o.align ?? 'center'; g.textBaseline = o.base ?? 'alphabetic';
  if (o.ls && 'letterSpacing' in g) g.letterSpacing = o.ls + 'px';
  if (o.shadow) { g.shadowColor = o.shadow; g.shadowBlur = o.blur ?? 20; g.shadowOffsetY = o.oy ?? 4; }
  if (o.stroke) { g.lineWidth = o.stroke; g.strokeStyle = o.strokeColor ?? '#000'; g.lineJoin = 'round'; g.strokeText(s, x, y); g.shadowColor = 'transparent'; }
  g.fillText(s, x, y); g.restore();
}
function measure(s, size, w = 700, fam = BODY) { ctx.save(); ctx.font = `${w} ${size}px ${fam}`; const m = ctx.measureText(s).width; ctx.restore(); return m; }
// word-by-word headline; wrap a phrase in _underscores_ to highlight it
function words(lines, cy, size, t0, t, o = {}) {
  const fam = o.fam ?? HEAD, wt = o.w ?? 800, lh = size * (o.lh ?? 1.04), stagger = o.stagger ?? 0.09, rise = o.rise ?? 34;
  ctx.save(); ctx.font = `${wt} ${size}px ${fam}`;
  const maxW = o.maxW ?? 960; let scale = 1;
  lines.forEach((l) => { const w = ctx.measureText(l.replace(/_/g, '')).width; if (w > maxW) scale = Math.min(scale, maxW / w); });
  const s = size * scale; ctx.font = `${wt} ${s}px ${fam}`; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  if (o.shadow) { ctx.shadowColor = o.shadow; ctx.shadowBlur = o.blur ?? 24; ctx.shadowOffsetY = 4; }
  const space = ctx.measureText(' ').width; let idx = 0;
  lines.forEach((line, li) => {
    let hl = false;
    const parts = line.split(' ').map((w) => { let x = w, on = hl; if (x.startsWith('_')) { on = true; hl = true; x = x.slice(1); } if (x.endsWith('_')) { x = x.slice(0, -1); hl = false; } else if (x.includes('_')) { x = x.replace('_', ''); hl = false; } return { x, on, w: ctx.measureText(x).width }; });
    const total = parts.reduce((a, p) => a + p.w, 0) + space * (parts.length - 1);
    let x = o.align === 'left' ? (o.x ?? 90) : W / 2 - total / 2; const y = cy + li * lh * scale;
    parts.forEach((p) => {
      const k = easeOutCubic(prog(t, t0 + idx * stagger, t0 + idx * stagger + 0.35));
      ctx.globalAlpha = (o.alpha ?? 1) * k;
      const yy = y + (1 - k) * rise;
      if (o.stroke) { ctx.lineWidth = o.stroke; ctx.strokeStyle = o.strokeColor ?? '#000'; ctx.lineJoin = 'round'; ctx.strokeText(p.x, x, yy); }
      ctx.fillStyle = p.on ? (o.hl ?? ROLE.accent) : (o.color ?? ROLE.light);
      ctx.fillText(p.x, x, yy);
      x += p.w + space; idx++;
    });
  });
  ctx.restore();
  return cy + (lines.length - 1) * lh * scale;
}
function pill(cx, cy, text, o = {}) {
  const size = o.size ?? 40, h = o.h ?? size * 2.1, padX = o.padX ?? size * 0.85;
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.translate(cx, cy); ctx.scale(o.scale ?? 1, o.scale ?? 1); ctx.rotate(o.rot ?? 0);
  ctx.font = `${o.w ?? 800} ${size}px ${o.fam ?? BODY}`; const w = ctx.measureText(text).width + padX * 2;
  if (o.shadow !== false) { ctx.shadowColor = 'rgba(5,10,25,0.3)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6; }
  ctx.fillStyle = o.bg ?? ROLE.accent; rr(ctx, -w / 2, -h / 2, w, h, o.radius ?? h / 2); ctx.fill();
  ctx.shadowColor = 'transparent';
  if (o.border) { ctx.lineWidth = o.border; ctx.strokeStyle = o.borderColor ?? '#fff'; ctx.stroke(); }
  ctx.fillStyle = o.fg ?? ROLE.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, size * 0.06);
  ctx.restore(); return w;
}
function chipsRow(list, cy, t0, t, o = {}) {
  const size = o.size ?? 40, gap = o.gap ?? 16, padX = size * 0.8;
  const ws = list.map((c) => measure(c, size, 800) + padX * 2); const total = ws.reduce((a, b) => a + b, 0) + gap * (ws.length - 1);
  let x = W / 2 - total / 2;
  list.forEach((c, i) => {
    const k = prog(t, t0 + i * (o.stagger ?? 0.14), t0 + i * (o.stagger ?? 0.14) + 0.3);
    if (k > 0) pill(x + ws[i] / 2, cy, c, { size, bg: o.bg, fg: o.fg, alpha: k * (o.alpha ?? 1), scale: lerp(0.6, 1, easeOutBack(k)), shadow: o.shadow });
    x += ws[i] + gap;
  });
}
// focal point of each photo, [fx, fy] from 0 to 1, from "focus" in brand.json or campaign.json: crops keep the subject in view
const FOCUS = { ...(BRAND.focus || {}), ...(CAMPAIGN.focus || {}) };
function focusOf(img) { return FOCUS[img?.dataset?.key] || [0.5, 0.5]; }
function photo(img, x, y, w, h, o = {}) {
  const [dfx, dfy] = focusOf(img), z = o.zoom ?? 1, fx = o.fx ?? dfx, fy = o.fy ?? dfy;
  const s = Math.max(w / img.width, h / img.height) * z, iw = img.width * s, ih = img.height * s;
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1;
  if (o.shadow) { const sp = shadowSprite(w, h, o.radius ?? 0, o.shadow); ctx.drawImage(sp, x - SHADOW_PAD, y - SHADOW_PAD, w + SHADOW_PAD * 2, h + SHADOW_PAD * 2 + 18); }
  rr(ctx, x, y, w, h, o.radius ?? 0); ctx.clip();
  if (o.filter) ctx.filter = o.filter;
  ctx.drawImage(img, x + (w - iw) * fx, y + (h - ih) * fy, iw, ih);
  ctx.filter = 'none'; ctx.restore();
  if (o.border) { ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.lineWidth = o.border; ctx.strokeStyle = o.borderColor ?? '#fff'; rr(ctx, x, y, w, h, o.radius ?? 0); ctx.stroke(); ctx.restore(); }
}
// Blurs and soft shadows are the slowest things to rasterise in software, so both are drawn once and cached.
// The caches are pure (same inputs, same pixels), so frames stay a function of t only.
const SHADOW_PAD = 110, SHADOWS = new Map(), BLURS = new WeakMap();
function shadowSprite(w, h, r, color) {
  const key = `${Math.round(w)}x${Math.round(h)}x${Math.round(r)}|${color}`; let c = SHADOWS.get(key);
  if (!c) {
    if (SHADOWS.size > 300) SHADOWS.clear();
    c = makeCanvas(Math.round(w) + SHADOW_PAD * 2, Math.round(h) + SHADOW_PAD * 2 + 18); const g = c.getContext('2d');
    g.shadowColor = color; g.shadowBlur = 50; g.shadowOffsetY = 18; g.fillStyle = '#000'; rr(g, SHADOW_PAD, SHADOW_PAD, Math.round(w), Math.round(h), r); g.fill(); SHADOWS.set(key, c);
  }
  return c;
}
function bgPhoto(img, o = {}) {
  const filter = o.filter ?? 'blur(36px) brightness(0.55) saturate(1.2)', zoom = o.zoom ?? 1, key = filter + '|' + zoom;
  if (!/blur\(/.test(filter)) { photo(img, -60, -60, W + 120, H + 120, { zoom, filter, alpha: o.alpha }); return; }
  let m = BLURS.get(img); if (!m) { m = new Map(); BLURS.set(img, m); }
  let c = m.get(key);
  if (!c) {  // blur a quarter-size copy (blur radius scaled to match), then scale it up: the result looks the same and costs a fraction
    const q = 4, cw = Math.round((W + 120) / q), ch = Math.round((H + 120) / q); c = makeCanvas(cw, ch); const g = c.getContext('2d');
    const s = Math.max(cw / img.width, ch / img.height) * zoom, iw = img.width * s, ih = img.height * s;
    g.filter = filter.replace(/blur\(([\d.]+)px\)/, (_, n) => `blur(${n / q}px)`); g.drawImage(img, (cw - iw) / 2, (ch - ih) / 2, iw, ih); m.set(key, c);
  }
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(c, -60, -60, W + 120, H + 120); ctx.restore();
}
function logo(cx, y, w, alpha = 1, o = {}) {
  const L = IMG.logo; const h = w * L.height / L.width; const x = o.align === 'left' ? cx : cx - w / 2;
  ctx.save(); ctx.globalAlpha = alpha;
  if (o.box) { const p = w * 0.07; ctx.fillStyle = '#fff'; rr(ctx, x - p, y - p, w + p * 2, h + p * 2, 10); ctx.fill(); ctx.strokeStyle = o.boxBorder ?? ROLE.cta; ctx.lineWidth = 3; ctx.stroke(); }
  if (o.shadow) { ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 6; }
  ctx.drawImage(L, x, y, w, h); ctx.restore();
}
function wrap(text, maxW, size, w = 500) { const ws = text.split(' '); const lines = []; let cur = ''; ws.forEach((x) => { const tt = cur ? cur + ' ' + x : x; if (measure(tt, size, w) > maxW && cur) { lines.push(cur); cur = x; } else cur = tt; }); if (cur) lines.push(cur); return lines; }

// colourful photos used to fill the top and bottom of the frame, and the labels shown on them
const POOL = CAMPAIGN.photoPool ?? BRAND.photoPool ?? Object.keys(ASSETS).filter((k) => k !== 'logo');
const LABEL = { ...(BRAND.labels || {}), ...(CAMPAIGN.labels || {}) };
// a slowly drifting row of big rounded photo tiles
function photoStrip(t, y, h, o = {}) {
  const keys = o.keys ?? POOL, tw = o.tileW ?? Math.round(h * 0.74), gap = o.gap ?? 22, speed = o.speed ?? 45;
  const step = tw + gap, total = keys.length * step; const off = ((t * speed + (o.phase ?? 0)) % total + total) % total;
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1;
  const first = Math.floor(off / step);
  for (let i = -1; i < Math.ceil(W / step) + 2; i++) {
    const idx = (((first + i) % keys.length) + keys.length) % keys.length, x = (first + i) * step - off - (o.dir === -1 ? 0 : 0);
    const k = keys[idx]; const rot = (o.tilt ?? 0.025) * (idx % 2 ? 1 : -1);
    ctx.save(); ctx.translate(x + tw / 2, y + h / 2); ctx.rotate(rot);
    photo(IMG[k], -tw / 2, -h / 2, tw, h, { radius: o.radius ?? 30, border: o.border ?? 6, borderColor: o.borderColor ?? ROLE.light, shadow: o.shadow ?? 'rgba(0,0,0,0.35)' });
    if (o.labels) pill(0, h / 2 - 46, LABEL[k] || '', { size: 24, bg: o.labelBg ?? ROLE.accent, fg: ROLE.ink, shadow: false });
    ctx.restore();
  }
  ctx.restore();
}
function ticker(t, y, o = {}) {
  const h = o.h ?? 66, text = o.text ?? COPY.ticker ?? '';
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.fillStyle = o.bg ?? ROLE.accent; ctx.fillRect(0, y, W, h);
  ctx.font = `800 ${o.size ?? 30}px ${BODY}`; if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
  const tw = ctx.measureText(text).width; let x = -((t * (o.speed ?? 110)) % tw);
  ctx.fillStyle = o.fg ?? ROLE.ink; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  for (; x < W; x += tw) ctx.fillText(text, x, y + h / 2 + 2);
  ctx.restore();
}
function polaroidAt(img, cx, cy, w, rot, label, k, o = {}) {
  if (k <= 0) return; const h = w * 1.18, pad = w * 0.06;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); const s = lerp(1.3, 1, easeOutCubic(k)); ctx.scale(s, s); ctx.globalAlpha = clamp(k * 1.6);
  ctx.shadowColor = 'rgba(40,30,10,0.32)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 12; ctx.fillStyle = '#fff'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.shadowColor = 'transparent';
  ctx.save(); ctx.beginPath(); ctx.rect(-w / 2 + pad, -h / 2 + pad, w - pad * 2, w - pad * 1.2); ctx.clip();
  const iw = w - pad * 2, ih = w - pad * 1.2, sc = Math.max(iw / img.width, ih / img.height), [fx, fy] = focusOf(img); ctx.drawImage(img, -w / 2 + pad + (iw - img.width * sc) * fx, -h / 2 + pad + (ih - img.height * sc) * fy, img.width * sc, img.height * sc); ctx.restore();
  if (label) T(label, 0, h / 2 - w * 0.07, { size: w * 0.15, w: 700, fam: o.fam ?? HAND, color: o.ink ?? '#253a8f' });
  if (o.tape !== false) { ctx.fillStyle = o.tapeColor ?? 'rgba(235,220,170,0.78)'; ctx.fillRect(-w * 0.22, -h / 2 - w * 0.07, w * 0.44, w * 0.14); }
  ctx.restore();
}

// Standard end card. Headline, offer and button sit inside the Reels-safe area;
// a scrolling ticker fills the top and a strip of venue photos fills the bottom.
function endCard(t, t0, o) {
  const k = (a, d = 0.35) => easeOutCubic(prog(t, t0 + a, t0 + a + d));
  if (o.bg) { ctx.save(); ctx.globalAlpha = k(0, 0.45); o.bg(); ctx.restore(); }
  if (o.strip !== false) {
    const sk = k(0.25, 0.6);
    if (o.strip === 'polaroids') { (o.stripKeys ?? POOL.slice(0, 3)).forEach((key, i) => polaroidAt(IMG[key], 200 + i * 340, 1640 + (i % 2 ? 30 : 0), 330, (i - 1) * 0.08, (o.stripLabels ?? [])[i] ?? '', prog(t, t0 + 0.4 + i * 0.15, t0 + 0.8 + i * 0.15))); }
    else { ctx.save(); ctx.translate(0, (1 - sk) * 160); photoStrip(t, 1395, 470, { alpha: sk, keys: o.stripKeys, borderColor: o.stripBorder ?? ROLE.light }); ctx.restore(); }
  }
  if (o.ticker !== false) ticker(t, 140, { bg: o.tickerBg ?? o.accent, fg: o.tickerFg ?? ROLE.ink, alpha: k(0.1) });
  logo(540, 262, o.logoW ?? 330, k(0.05), { box: o.logoBox, shadow: o.logoShadow });
  const size = o.size ?? 108;
  let y = words(o.headline, 500, size, t0 + 0.15, t, { color: o.fg, hl: o.accent, stagger: 0.07, shadow: o.textShadow });
  y += 104; T(o.offer ?? COPY.offer, 540, y, { size: 50, w: 800, color: o.offerColor ?? o.fg, alpha: k(0.55), fam: BODY });
  const maths = o.maths ?? COPY.maths ?? [];
  if (maths.length) { y += 104; chipsRow(maths, y - 14, t0 + 0.7, t, { bg: o.chipBg, fg: o.chipFg, size: 38, shadow: o.chipShadow }); }
  if (o.dates ?? COPY.dates) { y += 92; T(o.dates ?? COPY.dates, 540, y, { size: 36, w: 700, color: o.fg, alpha: k(1.05) * 0.95 }); }
  y += 118;
  const ck = prog(t, t0 + 1.2, t0 + 1.55);
  if (ck > 0) pill(540, y - 12, o.cta ?? COPY.cta, { size: 44, h: 110, bg: o.ctaBg ?? ROLE.cta, fg: o.ctaFg ?? ROLE.ctaText, alpha: ck, scale: lerp(0.7, 1, easeOutBack(ck)) * (1 + 0.05 * Math.sin(Math.PI * prog(t, t0 + 1.6, t0 + 1.9))) });
  y += 100; T(FOOTER, 540, y, { size: 24, w: 700, color: o.fg, alpha: k(1.45), ls: 2 });
  y += 40; wrap(o.terms ?? COPY.terms ?? '', 940, 20, 500).forEach((ln, i) => T(ln, 540, y + i * 27, { size: 20, w: 500, color: o.fg, alpha: k(1.6) * 0.75 }));
}
// small caps line under the button, e.g. "BOWTHORPE · NORWICH · FORMERLY EXPLORING SCIENCE"
const FOOTER = COPY.footer ?? [COPY.loc, COPY.formerly && COPY.formerly.toUpperCase()].filter(Boolean).join(' · ');

// ---------- tickets (2D textures, reused by several videos) ----------
function ticketShape(g, w, h, r = 30, nr = 30, ny = 0.7) {
  g.beginPath(); g.moveTo(r, 0); g.lineTo(w - r, 0); g.arcTo(w, 0, w, r, r); g.lineTo(w, h * ny - nr);
  g.arc(w, h * ny, nr, -Math.PI / 2, Math.PI / 2, true); g.lineTo(w, h - r); g.arcTo(w, h, w - r, h, r);
  g.lineTo(r, h); g.arcTo(0, h, 0, h - r, r); g.lineTo(0, h * ny + nr); g.arc(0, h * ny, nr, Math.PI / 2, -Math.PI / 2, true);
  g.lineTo(0, r); g.arcTo(0, 0, r, 0, r); g.closePath();
}
// ticket wording comes from COPY.ticket in campaign.json
const TK = { admit: 'ADMIT ONE', price: '', label: '', free: 'FREE', freeLine: '', brand: (BRAND.name || '').toUpperCase(), ...(COPY.ticket || {}) };
function makeTicket(kind) {
  const w = 600, h = 780, c = makeCanvas(w, h), g = c.getContext('2d');
  const paid = kind !== 'free';
  ticketShape(g, w, h); g.save(); g.clip();
  g.fillStyle = paid ? ROLE.light : ROLE.cta; g.fillRect(0, 0, w, h);
  g.strokeStyle = paid ? ROLE.cta : ROLE.light; g.lineWidth = 5; rr(g, 26, 26, w - 52, h - 52, 22); g.stroke();
  g.setLineDash([16, 14]); g.lineWidth = 4; g.strokeStyle = paid ? 'rgba(20,32,58,0.35)' : 'rgba(251,245,232,0.6)';
  g.beginPath(); g.moveTo(44, h * 0.7); g.lineTo(w - 44, h * 0.7); g.stroke(); g.setLineDash([]);
  g.textAlign = 'center';
  if (paid) {
    const lw = 380, lh = lw * IMG.logo.height / IMG.logo.width; g.drawImage(IMG.logo, (w - lw) / 2, 70, lw, lh);
    T(TK.admit, w / 2, 250, { g, size: 30, w: 700, color: ROLE.ink, ls: 8 });
    T(TK.price, w / 2, 470, { g, size: 230, w: 800, fam: HEAD, color: ROLE.ink });
    T(TK.label, w / 2, 620, { g, size: 34, w: 700, color: ROLE.ink, alpha: 0.75 });
    T('No. 000' + (kind === 'paid2' ? '2' : '1'), w / 2, 680, { g, size: 22, w: 500, color: ROLE.ink, alpha: 0.55, ls: 4 });
  } else {
    T(TK.admit, w / 2, 140, { g, size: 30, w: 700, color: ROLE.light, ls: 8 });
    T(TK.free, w / 2, 380, { g, size: 200, w: 800, fam: HEAD, color: ROLE.light });
    T(TK.freeLine, w / 2, 470, { g, size: 36, w: 800, color: ROLE.accent });
    T(TK.brand, w / 2, 640, { g, size: 26, w: 700, color: ROLE.light, ls: 8, alpha: 0.85 });
    T('No. 0003', w / 2, 690, { g, size: 22, w: 500, color: ROLE.light, alpha: 0.6, ls: 4 });
  }
  g.restore(); return c;
}
let TICKETS = null;
function tickets() { if (!TICKETS) TICKETS = { paid: makeTicket('paid'), paid2: makeTicket('paid2'), free: makeTicket('free') }; return TICKETS; }
function drawTicket(tex, cx, cy, w, o = {}) {
  const h = w * tex.height / tex.width;
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.translate(cx, cy); ctx.rotate(o.rot ?? 0); ctx.scale((o.sx ?? 1) * (o.scale ?? 1), o.scale ?? 1);
  ctx.shadowColor = 'rgba(10,15,30,0.35)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14;
  ctx.drawImage(tex, -w / 2, -h / 2, w, h); ctx.restore();
}
// flip from texture a to texture b over p (0..1)
function flipTicket(a, b, p, cx, cy, w, o = {}) { const ang = Math.PI * p; drawTicket(ang < Math.PI / 2 ? a : b, cx, cy, w, { ...o, sx: Math.max(0.02, Math.abs(Math.cos(ang))) }); }

// ---------- Three.js helper (only for the 3D videos) ----------
let three = null;
function getThree() {
  if (three) return three;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 200);
  three = { renderer, scene, camera }; return three;
}
function draw3D() { three.renderer.render(three.scene, three.camera); ctx.drawImage(three.renderer.domElement, 0, 0, W, H); }
function texFromCanvas(c) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }

// ---------- registry ----------
const SPOTS = {};
const ORDER = [];
function defineSpot(s) { SPOTS[s.id] = s; ORDER.push(s.id); }
