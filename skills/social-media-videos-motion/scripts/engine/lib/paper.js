// =====================================================================
// lib/paper.js: handwriting on paper, doodles, polaroids, photo corners
// makePaper() · writeLine(text, x, y, t, a, b, {size, color, crayon}) · writeH(text, x, y, t, a, b, {fam, size, w, color, crayon}) · strokeReveal(path, p, {color, w, len}) · polaroid(img, cx, cy, rot, label, k) · tickMark · star · heart · photoCorners · fonts SCRIPT, PRINT, KALAM
// =====================================================================
function makePaper() {
  const c = makeCanvas(W, H), g = c.getContext('2d'); const r = rng(5);
  g.fillStyle = '#fffdf4'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(120,100,60,${0.03 + r() * 0.04})`; g.fillRect(r() * W, r() * H, 1 + r() * 2, 1 + r() * 2); }
  g.strokeStyle = 'rgba(110,160,215,0.55)'; g.lineWidth = 2.5; for (let y = 380; y < H - 60; y += 96) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.strokeStyle = 'rgba(230,110,110,0.7)'; g.lineWidth = 3; g.beginPath(); g.moveTo(130, 0); g.lineTo(130, H); g.stroke();
  return c;
}
function writeLine(text, x, y, t, a, b, o = {}) {
  const p = easeInOutSine(prog(t, a, b)); if (p <= 0) return;
  const size = o.size ?? 78; const w = measure(text, size, 700, HAND) + 20;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 10, y - size * 1.1, w * p + 10, size * 1.6); ctx.clip();
  T(text, x, y, { size, w: 700, fam: HAND, color: o.color ?? '#253a8f', align: 'left' });
  if (o.crayon) T(text, x + 2, y + 1, { size, w: 700, fam: HAND, color: o.color, align: 'left', alpha: 0.45 });
  ctx.restore();
}
function strokeReveal(path, p, o = {}) {
  if (p <= 0) return; ctx.save(); ctx.strokeStyle = o.color ?? '#e0362c'; ctx.lineWidth = o.w ?? 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const len = o.len ?? 1200; ctx.setLineDash([len, len]); ctx.lineDashOffset = len * (1 - p); ctx.stroke(path); ctx.restore();
}
function polaroid(img, cx, cy, rot, label, k) {
  if (k <= 0) return; const w = 250, h = 296;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); const s = lerp(1.35, 1, easeOutCubic(k)); ctx.scale(s, s); ctx.globalAlpha = clamp(k * 1.6);
  ctx.shadowColor = 'rgba(40,30,10,0.3)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10; ctx.fillStyle = '#fff'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.shadowColor = 'transparent';
  ctx.restore();
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); const s2 = lerp(1.35, 1, easeOutCubic(k)); ctx.scale(s2, s2); ctx.globalAlpha = clamp(k * 1.6);
  ctx.beginPath(); ctx.rect(-w / 2 + 16, -h / 2 + 16, w - 32, w - 40); ctx.clip();
  const iw = w - 32, ih = w - 40, sc = Math.max(iw / img.width, ih / img.height); ctx.drawImage(img, -img.width * sc / 2, -h / 2 + 16 + ih / 2 - img.height * sc / 2, img.width * sc, img.height * sc);
  ctx.restore();
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(s2, s2); ctx.globalAlpha = clamp(k * 1.6);
  T(label, 0, h / 2 - 22, { size: 44, w: 700, fam: HAND, color: '#253a8f' });
  ctx.fillStyle = 'rgba(235,220,170,0.75)'; ctx.fillRect(-55, -h / 2 - 18, 110, 38);
  ctx.restore();
}
const SCRIPT = '"Dancing Script", "Brush Script MT", cursive';
const PRINT = '"Patrick Hand", "Comic Sans MS", cursive';
const KALAM = 'Kalam, "Comic Sans MS", cursive';
function writeH(text, x, y, t, a, b, o = {}) {
  const p = easeInOutSine(prog(t, a, b)); if (p <= 0) return;
  const size = o.size ?? 72, fam = o.fam ?? HAND, w = o.w ?? 700; const tw = measure(text, size, w, fam) + 20;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 10, y - size * 1.15, tw * p + 10, size * 1.7); ctx.clip();
  T(text, x, y, { size, w, fam, color: o.color ?? '#253a8f', align: 'left' });
  if (o.crayon) T(text, x + 2, y + 1, { size, w, fam, color: o.color, align: 'left', alpha: 0.45 });
  ctx.restore();
  return tw;
}
function tickMark(cx, cy, s, p, color = '#e0362c') { const path = new Path2D(); path.moveTo(cx - s * 0.5, cy); path.lineTo(cx - s * 0.12, cy + s * 0.4); path.lineTo(cx + s * 0.6, cy - s * 0.55); strokeReveal(path, p, { color, w: s * 0.13, len: s * 2.2 }); }
function star(cx, cy, r, color, a = 1, rot = 0) { ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, cy); ctx.rotate(rot); ctx.fillStyle = color; ctx.beginPath(); for (let i = 0; i < 10; i++) { const ang = i * Math.PI / 5 - Math.PI / 2, rr2 = i % 2 ? r * 0.45 : r; ctx.lineTo(Math.cos(ang) * rr2, Math.sin(ang) * rr2); } ctx.closePath(); ctx.fill(); ctx.restore(); }
function heart(cx, cy, s, color, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(cx, cy + s * 0.35); ctx.bezierCurveTo(cx - s, cy - s * 0.3, cx - s * 0.45, cy - s, cx, cy - s * 0.45); ctx.bezierCurveTo(cx + s * 0.45, cy - s, cx + s, cy - s * 0.3, cx, cy + s * 0.35); ctx.fill(); ctx.restore(); }
function photoCorners(img, cx, cy, w, rot, label, k, o = {}) {
  if (k <= 0) return; const h = w * 0.8;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); const s = lerp(1.25, 1, easeOutCubic(k)); ctx.scale(s, s); ctx.globalAlpha = clamp(k * 1.6);
  ctx.shadowColor = 'rgba(40,30,10,0.28)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8; ctx.fillStyle = '#fff'; ctx.fillRect(-w / 2 - 10, -h / 2 - 10, w + 20, h + 20); ctx.shadowColor = 'transparent';
  ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip(); const sc = Math.max(w / img.width, h / img.height); ctx.drawImage(img, -img.width * sc / 2, -img.height * sc / 2, img.width * sc, img.height * sc); ctx.restore();
  ctx.fillStyle = '#222'; const c = w * 0.12; [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { ctx.beginPath(); ctx.moveTo(sx * (w / 2 + 12), sy * (h / 2 + 12)); ctx.lineTo(sx * (w / 2 + 12) - sx * c, sy * (h / 2 + 12)); ctx.lineTo(sx * (w / 2 + 12), sy * (h / 2 + 12) - sy * c); ctx.closePath(); ctx.fill(); });
  if (label) T(label, 0, h / 2 + 70, { size: 52, w: 700, fam: o.fam ?? SCRIPT, color: o.ink ?? '#1f2d5a' });
  ctx.restore();
}
