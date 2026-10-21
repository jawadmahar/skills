// =====================================================================
// lib/fx3d.js: shared Three.js helpers
// VS_UV shader · roundedPhotoCanvas(img, w, h, {border, radius, borderColor}) · project(vec3) to screen · confetti2D(x0, y0, dt)
// =====================================================================
const VS_UV = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }';
function roundedPhotoCanvas(img, w, h, o = {}) {
  const c = makeCanvas(w, h), g = c.getContext('2d'); const b = o.border ?? 18, r = o.radius ?? 40;
  g.fillStyle = o.borderColor ?? ROLE.light; rr(g, 0, 0, w, h, r); g.fill();
  g.save(); rr(g, b, b, w - b * 2, h - b * 2, r - b / 2); g.clip();
  const s = Math.max((w - b * 2) / img.width, (h - b * 2) / img.height), [fx, fy] = focusOf(img); g.drawImage(img, b + (w - b * 2 - img.width * s) * fx, b + (h - b * 2 - img.height * s) * fy, img.width * s, img.height * s);
  g.restore(); return c;
}
function project(v) { const p = v.clone().project(three.camera); return { x: (p.x + 1) / 2 * W, y: (1 - p.y) / 2 * H }; }
const CONF = (() => { const r = rng(21); const pal = CAMPAIGN.confetti ?? BRAND.confetti ?? [ROLE.accent, ROLE.cta, ROLE.light, P.teal ?? '#00ddb4', P.gold ?? '#e9b949', P.yellow ?? '#ffe14d']; return Array.from({ length: 90 }, (_, i) => ({ vx: (r() - 0.5) * 1500, vy: -600 - r() * 1300, rot: r() * 6, vr: (r() - 0.5) * 18, w: 14 + r() * 10, h: 22 + r() * 14, c: pal[i % pal.length], d: r() * 0.08 })); })();
function confetti2D(x0, y0, dt) {
  if (dt <= 0 || dt > 1.8) return; ctx.save();
  CONF.forEach((c) => { const tt = Math.max(0, dt - c.d); const x = x0 + c.vx * tt, y = y0 + c.vy * tt + 1600 * tt * tt; ctx.save(); ctx.globalAlpha = 1 - prog(tt, 1.1, 1.7); ctx.translate(x, y); ctx.rotate(c.rot + c.vr * tt); ctx.fillStyle = c.c; ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h); ctx.restore(); });
  ctx.restore();
}

