// =====================================================================
// Reference tests (5 Nov 2026), built from Refs cards: R01 after REF-2831 (sci-fi fashion film: countdown,
// heads-up display, numbered looks, a three-frame white flash into a stark editorial field) and R02 after
// REF-0015 (halftone mascot enters from the right beside a question, accent-field change for the offer,
// continuous reframe into a storefront grid, dark ending).
// =====================================================================
const MONO = '"Courier Prime", monospace';

// corner brackets around a box, plus faint scan lines over the whole frame
function hudFrame(x, y, w, h, o = {}) {
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.strokeStyle = o.col ?? P.lime; ctx.lineWidth = 6; const L = o.len ?? 80;
  [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([cx, cy, sx, sy]) => { ctx.beginPath(); ctx.moveTo(cx, cy + sy * L); ctx.lineTo(cx, cy); ctx.lineTo(cx + sx * L, cy); ctx.stroke(); });
  if (o.scan !== false) { ctx.globalAlpha = (o.alpha ?? 1) * 0.07; ctx.fillStyle = '#fff'; for (let yy = 0; yy < H; yy += 6) ctx.fillRect(0, yy, W, 2); }
  ctx.restore();
}
// a short glitch on a cut: horizontal slices of the frame slide sideways for d seconds
function glitchCut(t, a, d = 0.12, seed = 1) {
  const p = prog(t, a, a + d); if (p <= 0 || p >= 1) return;
  const r = rng(seed * 31 + Math.floor(t * 30));
  for (let i = 0; i < 7; i++) { const y = Math.floor(r() * H), h = 20 + Math.floor(r() * 90), dx = (r() - 0.5) * 140 * (1 - p); ctx.drawImage(out, 0, y, W, h, dx, y, W, h); }
  ctx.save(); ctx.globalAlpha = 0.18 * (1 - p); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = '#ff2d55'; ctx.fillRect(0, 0, W, H); ctx.restore();
}

// R01 -------------------------------------------------------------------------------------------
function launchFmt(c) {
  const C = c.countEnd ?? 2.0, F = c.flashAt ?? 11.5, n = c.looks.length, step = (F - C) / n;
  return {
    frame(t) {
      const E = endAt(c.dur);
      if (t < E + 0.4) {
        if (t < C) {
          fill('#05070d'); const k = Math.max(0, (c.countFrom ?? 10) - Math.floor(t / (C / (c.countFrom ?? 10))));
          T('T-MINUS', 540, 780, { size: 46, w: 700, fam: MONO, color: P.lime, ls: 10, alpha: prog(t, 0.1, 0.3) });
          T(String(k).padStart(2, '0'), 540, 1060, { size: 300, w: 800, fam: HEAD, color: '#fff' });
          ctx.save(); ctx.strokeStyle = 'rgba(182,245,66,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(540, 960, 260, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * prog(t, 0, C)); ctx.stroke(); ctx.restore();
          (c.telemetry ?? []).forEach((ln, i) => { const a = 0.3 + i * 0.25; if (t > a) T(ln.slice(0, Math.floor((t - a) * 40)), 90, 1150 + i * 40, { size: 26, w: 700, fam: MONO, color: i === (c.telemetry.length - 1) ? P.lime : '#cbd5e1', align: 'left' }); });
          hudFrame(60, 300, W - 120, 960);
          ctx.save(); ctx.strokeStyle = 'rgba(182,245,66,0.22)'; ctx.lineWidth = 2; for (let i = 0; i <= 12; i++) { const y = 1330 + Math.pow(i / 12, 1.8) * 590; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } for (let i = -8; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(540 + i * 30, 1330); ctx.lineTo(540 + i * 260, H); ctx.stroke(); } ctx.restore();
          hook(c.hook, 430, 84, 0.05, t, { hl: P.lime });
        } else if (t < F) {
          const i = Math.min(n - 1, Math.floor((t - C) / step)), a = C + i * step, [key, name] = c.looks[i];
          heroPhoto(key, t, a, a + step, { dz: 0.08, z0: 1.02 });
          shade(0.7, 0.2, 0.4);
          const h = heroH(key), y = 900 - h / 2;
          hudFrame(30, y - 20, W - 60, h + 40, { len: 70 });
          T(`LOOK ${String(i + 1).padStart(2, '0')}`, 80, 420, { size: 40, w: 700, fam: MONO, color: P.lime, align: 'left', ls: 6 });
          T(`${String(i + 1).padStart(2, '0')}/${String(n).padStart(2, '0')}`, 1000, 420, { size: 40, w: 700, fam: MONO, color: '#fff', align: 'right' });
          words([name], 520, 92, a + 0.05, t, { align: 'left', x: 80, color: '#fff', stagger: 0.05, shadow: 'rgba(0,0,0,0.5)' });
          const bar = prog(t, a, a + step); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(80, 1236, 920, 6); ctx.fillStyle = P.lime; ctx.fillRect(80, 1236, 920 * ((i + bar) / n), 6);
          T(`T+00:${String(Math.floor((t - C) * 10) / 10).padStart(4, '0')}`, 80, 1200, { size: 26, w: 700, fam: MONO, color: '#e5e7eb', align: 'left' });
          glitchCut(t, a, 0.12, i + 1);
        } else {
          fill('#ffffff');
          if (t < F + 0.1) { /* three white frames at 30 fps */ } else {
            const k = prog(t, F + 0.1, F + 0.6);
            ctx.fillStyle = '#111'; ctx.fillRect(80, 470, 920 * k, 3); ctx.fillRect(80, 1110, 920 * k, 3);
            T(c.edit[0], 80, 450, { size: 28, w: 700, color: '#111', align: 'left', ls: 8, alpha: k });
            T(c.edit[1], 540, 690, { size: 120, w: 800, fam: HEAD, color: '#111', alpha: prog(t, F + 0.2, F + 0.5) });
            words([c.edit[2]], 820, 64, F + 0.5, t, { color: '#111', hl: P.red });
            T(c.edit[3], 540, 960, { size: 52, w: 800, fam: HEAD, color: P.red, alpha: prog(t, F + 1.0, F + 1.3) });
            T(c.edit[4], 1000, 1090, { size: 24, w: 700, color: '#111', align: 'right', ls: 4, alpha: prog(t, F + 1.3, F + 1.6) });
            c.strip.slice(0, 3).forEach((k2, j) => { const kk = easeOutCubic(prog(t, F + 1.4 + j * 0.15, F + 1.8 + j * 0.15)); if (kk > 0) photo(IMG[k2], 80 + j * 313, 1180 + (1 - kk) * 80, 294, 400, { alpha: kk }); });
          }
        }
        brandTop(t < C || t >= F + 0.1 ? 1 : 0.95);
      }
      endScene(t, E, c.end, 'cream', { stripKeys: c.strip });
    },
  };
}

// R02 -------------------------------------------------------------------------------------------
const HT_CACHE = {};
// halftone dots of a photo crop (fractions sx, sy, sw, sh of the image), sampled once per cell size
function halftoneDots(key, crop, cols, rows) {
  const id = key + crop.join() + cols + 'x' + rows; if (HT_CACHE[id]) return HT_CACHE[id];
  const img = IMG[key], cv = makeCanvas(cols, rows), g = cv.getContext('2d');
  g.drawImage(img, crop[0] * img.width, crop[1] * img.height, crop[2] * img.width, crop[3] * img.height, 0, 0, cols, rows);
  const d = g.getImageData(0, 0, cols, rows).data, lum = new Float32Array(cols * rows);
  for (let i = 0; i < cols * rows; i++) lum[i] = (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255;
  return (HT_CACHE[id] = lum);
}
function drawHalftone(key, crop, x, y, w, h, o = {}) {
  const s = o.cell ?? 15, cols = Math.round(w / s), rows = Math.round(h / s), lum = halftoneDots(key, crop, cols, rows), cw = w / cols, ch = h / rows;
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.fillStyle = o.ink ?? P.ink;
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
    const v = Math.pow(1 - lum[r * cols + q], 0.9) * (o.gain ?? 1.1); if (v < 0.06) continue;
    ctx.beginPath(); ctx.arc(x + (q + 0.5) * cw, y + (r + 0.5) * ch, Math.min(cw, ch) * 0.56 * Math.min(1, v), 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
function bubble(x, y, text, t, a, o = {}) {
  const k = easeOutBack(prog(t, a, a + 0.3)); if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); const w = measure(text, 38, 800) + 60;
  ctx.fillStyle = '#fff'; ctx.strokeStyle = P.ink; ctx.lineWidth = 5; rr(ctx, -w, -50, w, 100, 30); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 48); ctx.lineTo(-10, 90); ctx.lineTo(-80, 48); ctx.closePath(); ctx.fill(); ctx.stroke();
  T(text, -w / 2, 13, { size: 38, w: 800, color: P.ink });
  ctx.restore();
}
function halftoneFmt(c) {
  const A = c.fieldAt ?? 2.33, G = c.gridAt ?? 7.1, D = c.darkAt ?? 11.2, key = c.mascot, crop = c.crop;
  const rA = [500, 520, 560, 870], rB = [560, 760, 460, 714];
  const tiles = c.tiles, tw = 320, th = 215, gx = 20, x0 = 40, y0 = 560, cell = (i) => [x0 + (i % 3) * (tw + gx), y0 + Math.floor(i / 3) * (th + gx), tw, th];
  return {
    frame(t) {
      const E = endAt(c.dur);
      if (t < E + 0.4) {
        if (t < G) {
          const field = t < A ? P.cream : P.lime; fill(field);
          ctx.save(); ctx.globalAlpha = 0.08; ctx.fillStyle = P.ink; for (let yy = 30; yy < H; yy += 30) for (let xx = (yy / 30) % 2 ? 15 : 30; xx < W; xx += 30) { ctx.beginPath(); ctx.arc(xx, yy, 3, 0, Math.PI * 2); ctx.fill(); } ctx.restore();
          const slide = easeOutCubic(prog(t, 0, 0.8)), mv = easeInOutCubic(prog(t, A, A + 0.6));
          const r = rA.map((v, i) => lerp(v, rB[i], mv)); r[0] += (1 - slide) * 700;
          drawHalftone(key, crop, r[0], r[1], r[2], r[3], { cell: 15 });
          if (t < A) {
            words(c.hook, 760, 96, 0.45, t, { align: 'left', x: 60, color: P.ink, hl: P.red, maxW: 400 });
            bubble(980, 470, c.say[0], t, 1.2);
          } else {
            words(c.offerHook, 470, 88, A + 0.05, t, { color: P.ink, hl: '#9a3412' });
            COPY.maths.forEach((m, i) => { const a = A + 0.7 + i * 0.5, k = easeOutBack(prog(t, a, a + 0.3)); if (k > 0) pill(70 + measure(m, 54, 800) / 2 + 46, 860 + i * 140, m, { size: 54, bg: P.ink, fg: P.lime, scale: k, alpha: clamp(k) }); });
            bubble(1000, 700, c.say[1], t, A + 2.4);
          }
        } else if (t < D) {
          fill(P.cream);
          const mv = easeInOutCubic(prog(t, G, G + 0.6)), ctr = cell(4), r = rB.map((v, i) => lerp(v, ctr[i], mv));
          tiles.forEach((k2, i) => { if (i === 4) return; const a = G + 0.3 + i * 0.08, k = easeOutBack(prog(t, a, a + 0.35)); if (k <= 0) return; const [x, y, w, h] = cell(i); ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); photo(IMG[k2], -w / 2, -h / 2, w, h, { radius: 18, shadow: 'rgba(0,0,0,0.25)' }); ctx.restore(); if (k > 0.9) pill(x + 14 + measure(LABEL[k2] || '', 20, 800) / 2 + 17, y + h - 26, LABEL[k2] || '', { size: 20, bg: P.lime, fg: P.ink }); });
          const cf = prog(t, G + 0.5, G + 0.9);
          if (cf < 1) drawHalftone(key, crop, r[0], r[1], r[2], r[3], { cell: lerp(15, 9, mv), alpha: 1 - cf });
          if (cf > 0) { const [x, y, w, h] = ctr; photo(IMG[c.mascotPhoto ?? key], x, y, w, h, { radius: 18, alpha: cf, shadow: 'rgba(0,0,0,0.25)' }); if (cf >= 1) pill(x + 14 + measure(LABEL[c.mascotPhoto ?? key] || '', 20, 800) / 2 + 17, y + h - 26, LABEL[c.mascotPhoto ?? key] || '', { size: 20, bg: P.lime, fg: P.ink }); }
          const sel = Math.floor(prog(t, G + 1.4, D - 0.2) * 9); if (t > G + 1.4 && sel < 9) { const [x, y, w, h] = cell(sel); ctx.save(); ctx.strokeStyle = P.red; ctx.lineWidth = 8; rr(ctx, x - 6, y - 6, w + 12, h + 12, 24); ctx.stroke(); ctx.restore(); }
          words(c.gridHook, 400, 84, G + 0.2, t, { color: P.ink, hl: P.red });
        } else {
          fill(P.navy); const k = prog(t, D, D + 0.4);
          ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = P.lime; for (let yy = 30; yy < H; yy += 30) for (let xx = (yy / 30) % 2 ? 15 : 30; xx < W; xx += 30) { ctx.beginPath(); ctx.arc(xx, yy, 3, 0, Math.PI * 2); ctx.fill(); } ctx.restore();
          words(c.dark, 900, 110, D + 0.15, t, { color: P.cream, hl: P.lime, alpha: k });
        }
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { stripKeys: c.strip });
    },
  };
}

spot({ id: 'R01', title: 'Launch sequence', slug: 'launch-sequence', dur: 18, run: 'season', series: 'Reference tests', music: 470, ring: true,
  persona: 'Parents 25 to 44, design-savvy Reels viewers', angle: 'A Saturday out staged like a sci-fi fashion launch: countdown, six numbered looks, then a stark editorial reveal', style: 'After Refs REF-2831: heads-up-display countdown, numbered looks with glitch cuts, a three-frame white flash into a white editorial page',
  hook: 'Countdown "T-MINUS 10" with "Saturday: launch sequence."',
  meta: { headline: 'Saturday: launch sequence', primary: primary('Saturday launch sequence: T-minus 10. Six looks, one day out.', 'The laser room, the sky maze, heat vision, the infinity floor, robot waiters and the garden of light, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  launchFmt, { countFrom: 10, countEnd: 2.0, flashAt: 11.5, hook: ['Saturday:', '_launch sequence._'], telemetry: ['LOC 52.63N 1.21E BOWTHORPE', 'SKY: GREY. AGAIN.', 'CITY CENTRE: GRIDLOCK', 'STATUS: READY'],
    looks: [['laser_room', 'LASER ROOM'], ['sky_maze2', 'SKY MAZE'], ['heat', 'HEAT VISION'], ['infinity_floor', 'INFINITY FLOOR'], ['robot2', 'ROBOT WAITERS'], ['roses', 'GARDEN OF LIGHT']],
    edit: ['THE WINTER COLLECTION', 'EXPLORAZONE', 'Six looks. _One day out._', 'Buy 2, get the 3rd free', 'BOWTHORPE · NORWICH'],
    end: ['Six looks.', '_One day out._'], strip: ['laser_room', 'sky_maze2', 'heat', 'infinity_floor', 'robot2', 'roses'] });

spot({ id: 'R02', title: 'Ask the robot', slug: 'ask-the-robot', dur: 16, run: 'season', series: 'Reference tests', music: 1254, ring: true,
  persona: 'Parents 25 to 44 planning the weekend', angle: 'The robot waiter as a halftone mascot: weekend plans, the offer maths, then every room in one grid', style: 'After Refs REF-0015: halftone mascot slides in from the right beside a question, the field flips to lime for the offer, a continuous reframe into a storefront grid, dark ending',
  hook: 'Halftone robot slides in: "Weekend plans?"',
  meta: { headline: 'Weekend plans? Ask the robot', primary: primary('Weekend plans? Our robot waiters have a few ideas.', 'The laser room, the sky maze, heat vision, the infinity floor and the garden of light, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  halftoneFmt, { mascot: 'robot2', mascotPhoto: 'robot2', crop: [0.14, 0.02, 0.36, 0.72], hook: ['Weekend', '_plans?_'], say: ['Beep. I have ideas.', 'Beep. Maths done.'],
    offerHook: ['Bring two.', '_The 3rd is free._'], gridHook: ['Pick a room.', '_Or all of them._'], dark: ['Explorazone.', '_All indoors._'],
    tiles: ['laser_room', 'sky_maze2', 'heat', 'infinity_floor', 'robot2', 'roses', 'dodeca', 'sandbox', 'tunnel'],
    end: ['Weekend plans?', '_Sorted._'], strip: ['laser_room', 'sky_maze2', 'heat', 'infinity_floor', 'roses', 'robot2'] });
