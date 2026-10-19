// =====================================================================
// Christmas and seasonal formats (8): W20 W22 W23 W24 W25 W28 W30 W31
// Advent doors, gift box, receipt, snow globe, knitted jumper, flip countdown, tickets in the snow, secret dossier.
// =====================================================================
function festiveBg(t, kind = 'red') {
  if (kind === 'green') vgrad([[0, '#13654a'], [1, '#072b1d']]); else if (kind === 'navy') vgrad([[0, '#1f3060'], [1, '#0a1330']]); else vgrad([[0, '#c22c1c'], [1, '#6d140b']]);
  snow(t, { n: 70, alpha: 0.35, scale: 0.8 });
}

// W20 Advent doors ------------------------------------------------------------------
function adventFmt(c) {
  const NUM = [7, 3, 11, 1, 9, 5, 12, 4, 2, 10, 6, 8];
  return {
    frame(t) {
      const E = endAt(c.dur);
      if (t < E + 0.4) {
        festiveBg(t, 'red');
        const dw = 300, dh = 160, gx = 20, gy = 20, x0 = 70, y0 = 540;
        NUM.forEach((n, i) => {
          const x = x0 + (i % 3) * (dw + gx), y = y0 + Math.floor(i / 3) * (dh + gy);
          const open = c.doors[n]; const p = open ? easeInOutCubic(prog(t, open[0], open[0] + 0.45)) : 0;
          ctx.save(); ctx.fillStyle = '#3a0d08'; rr(ctx, x, y, dw, dh, 14); ctx.fill(); ctx.restore();
          if (p > 0) {
            if (open[1] === 'rain') { ctx.save(); rr(ctx, x, y, dw, dh, 14); ctx.clip(); ctx.fillStyle = '#5d6f84'; ctx.fillRect(x, y, dw, dh); ctx.restore(); cloudIcon(x + dw / 2, y + dh / 2 - 10, 80, 1); }
            else photo(IMG[open[1]], x, y, dw, dh, { radius: 14, zoom: 1.1 });
          }
          const sx = 1 - p * 1.12; ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(-0.15, sx), 1);
          ctx.fillStyle = p > 0.5 ? '#8f1d12' : '#e9b949'; rr(ctx, 0, 0, dw, dh, 14); ctx.fill(); ctx.strokeStyle = '#fff3d6'; ctx.lineWidth = 4; rr(ctx, 8, 8, dw - 16, dh - 16, 10); ctx.stroke();
          if (sx > 0.2) T(String(n), dw / 2, dh / 2 + 30, { size: 84, w: 800, fam: HEAD, color: '#7a160c' });
          ctx.restore();
        });
        if (t < c.flipHook) hook(c.hook, 400, 96, 0.1, t, { hl: P.yellow, alpha: 1 - prog(t, c.flipHook - 0.2, c.flipHook) });
        else hook(c.hook2, 400, 96, c.flipHook, t, { hl: P.yellow });
        photoStrip(t, 1395, 470, { keys: c.strip });
        brandTop();
      }
      endScene(t, E, c.end, 'red', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W20', title: 'Advent doors', slug: 'advent-doors', dur: 12, run: 'xmas', series: 'Christmas', music: 867,
  persona: 'Parents 25 to 44, December weekends', angle: 'Every advent door so far has been rain; the next ones open on colour', style: 'Advent calendar whose first doors show rain clouds and later doors open on venue photos',
  hook: 'Advent doors open: "Door 1: rain. Door 3: rain."',
  meta: { headline: 'A December worth opening', primary: primary('Advent so far. Door 1: rain. Door 3: rain. Door 7: more rain.', 'Open a better door: the laser room, the infinity floor, robot waiters and the garden of light, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  adventFmt, { flipHook: 3.0, hook: ['Door 1: rain.', 'Door 3: _rain._'], hook2: ['The next doors:', '_much better._'], doors: { 1: [0.3, 'rain'], 3: [1.0, 'rain'], 7: [1.7, 'rain'], 4: [3.1, 'laser_room'], 2: [3.6, 'infinity_floor'], 9: [4.1, 'robot2'], 5: [4.6, 'roses'], 12: [5.1, 'heat'], 10: [5.6, 'dodeca'], 6: [6.1, 'sky_maze2'], 11: [6.6, 'tunnel'], 8: [7.1, 'floor2'] }, end: ['A December', '_worth opening._'], strip: ['laser_room', 'infinity_floor', 'robot2', 'roses', 'heat', 'dodeca'] });

// W22 Gift box --------------------------------------------------------------------------
function giftFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), O = c.openAt ?? 2.6;
      if (t < E + 0.4) {
        vgrad([[0, '#fbf5e8'], [1, '#f1dcc4']]); photoStrip(t, 1395, 470, { keys: c.strip, alpha: 1 - prog(t, O, O + 0.5) });
        const cx = 540, cy = 1000, bw = 520, bh = 380;
        const drop = easeOutBack(prog(t, 0, 0.5), 1.4), wob = t < O ? Math.sin(t * 22) * 0.05 * prog(t, 0.8, 1.2) * (1 - prog(t, 2.2, 2.5)) : 0;
        if (t > O) { const rk = easeOutCubic(prog(t, O, O + 0.6)); ctx.save(); ctx.globalAlpha = 0.6 * (1 - prog(t, O + 1.5, O + 2.5)); ctx.translate(cx, cy - bh / 2); for (let i = 0; i < 14; i++) { ctx.rotate(Math.PI / 7); ctx.fillStyle = i % 2 ? '#ffe14d' : '#fff4c2'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-60, -900 * rk); ctx.lineTo(60, -900 * rk); ctx.fill(); } ctx.restore(); }
        ctx.save(); ctx.translate(cx, cy - (1 - drop) * 900); ctx.rotate(wob);
        ctx.shadowColor = 'rgba(80,30,10,0.35)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; ctx.fillStyle = '#c22c1c'; ctx.fillRect(-bw / 2, -bh / 2, bw, bh); ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#e9b949'; ctx.fillRect(-35, -bh / 2, 70, bh); ctx.fillRect(-bw / 2, -25, bw, 50);
        const lift = easeOutCubic(prog(t, O, O + 0.5));
        ctx.save(); ctx.translate(lift * 420, -bh / 2 - 30 - lift * 700); ctx.rotate(lift * 0.9); ctx.fillStyle = '#d63a28'; ctx.fillRect(-bw / 2 - 25, -50, bw + 50, 90); ctx.fillStyle = '#e9b949'; ctx.fillRect(-35, -50, 70, 90);
        ctx.beginPath(); ctx.ellipse(-70, -80, 80, 44, 0.4, 0, Math.PI * 2); ctx.ellipse(70, -80, 80, 44, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        ctx.restore();
        c.pops.forEach(([key, x, y, rot, label], i) => {
          const a = O + 0.2 + i * 0.25, p = easeOutBack(prog(t, a, a + 0.5)); if (p <= 0) return;
          polaroidAt(IMG[key], lerp(cx, x, p), lerp(cy - 100, y, p), 360, rot * p, label, clamp(p), { fam: KALAM });
        });
        if (t < O) hook(c.hook, 430, 104, 0.1, t, { color: P.ink, hl: P.red, shadow: false, alpha: 1 - prog(t, O - 0.2, O) });
        else hook(c.hook2, 430, 104, O, t, { color: P.ink, hl: P.red, shadow: false });
        brandTop();
      }
      endScene(t, E, c.end, 'red', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W22', title: 'Give a day, not more stuff', slug: 'give-a-day', dur: 12, run: 'xmas', series: 'Christmas', music: 896,
  persona: 'Grandparents 55+ choosing Christmas presents', angle: 'For grandchildren who have everything, give a day out together', style: 'A wrapped present shakes, the lid flies off and polaroids burst out',
  hook: '"Grandkids have everything?" over a shaking present',
  meta: { headline: 'Give a day, not more stuff', primary: primary('Grandchildren who have everything? Give them a day out together instead.', 'Infinity lights, the sky maze, heat vision and robot waiters, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  giftFmt, { hook: ['Grandkids have', '_everything?_'], hook2: ['Give a day,', '_not more stuff._'], pops: [['dodeca', 260, 760, -0.12, 'lights!'], ['sky_maze2', 820, 740, 0.1, 'sky maze'], ['heat', 250, 1480, 0.08, 'heat vision'], ['robot2', 830, 1500, -0.08, 'robots']], end: ['Give a day,', '_not more stuff._'], strip: ['dodeca', 'sky_maze2', 'heat', 'robot2', 'laser_room', 'roses'] });

// W23 Christmas shopping receipt ---------------------------------------------------------
function receiptFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), X = c.outAt ?? 6.4;
      if (t < E + 0.4) {
        vgrad([[0, '#3b2a20'], [1, '#1d140f']]); photoStrip(t, 1395, 470, { keys: c.strip, alpha: 0.95 });
        const lh = 56, x0 = 200, x1 = 880, top = 560, shown = c.lines.filter((l) => t >= l[2]).length;
        const up = easeInCubic(prog(t, X, X + 0.5)) * 1500;
        ctx.save(); ctx.translate(0, -up);
        const h = 40 + shown * lh + 20;
        ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; ctx.fillStyle = '#fbfbf7'; ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x1, top); ctx.lineTo(x1, top + h); for (let x = x1; x > x0; x -= 34) { ctx.lineTo(x - 17, top + h + 14); ctx.lineTo(x - 34, top + h); } ctx.closePath(); ctx.fill(); ctx.restore();
        c.lines.forEach(([l, r, at, hot], i) => { if (t < at) return; const y = top + 70 + i * lh, col = hot ? '#c0271b' : '#222'; T(l, x0 + 30, y, { size: 34, w: 700, fam: '"Courier Prime", monospace', color: col, align: 'left' }); if (r) T(r, x1 - 30, y, { size: 34, w: 700, fam: '"Courier Prime", monospace', color: col, align: 'right' }); });
        if (c.circle && t > c.circle[1]) { const y = top + 70 + c.circle[0] * lh - 12; const pth = new Path2D(); pth.ellipse(540, y, 330, 42, -0.02, -2.2, Math.PI * 2 - 1.9); strokeReveal(pth, prog(t, c.circle[1], c.circle[1] + 0.4), { color: '#e0362c', w: 7, len: 2400 }); }
        ctx.restore();
        ctx.fillStyle = '#111'; rr(ctx, x0 - 50, top - 40, x1 - x0 + 100, 50, 18); ctx.fill();
        if (t > X) { bgPhoto(IMG[c.cards[0]], { alpha: prog(t, X + 0.2, X + 0.5) }); dropStack(t, c.cards, X + 0.3, (E - X - 0.4) / c.cards.length, { cy: 900, h: 600 }); }
        if (t < X) hook(c.hook, 380, 96, 0.1, t, { hl: P.yellow });
        else hook(c.mid, 400, 96, X + 0.2, t, { hl: P.yellow });
        brandTop();
      }
      endScene(t, E, c.end, 'green', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W23', title: 'Christmas shopping receipt', slug: 'christmas-receipt', dur: 12, run: 'xmas', series: 'Christmas', music: 503,
  persona: 'Parents 25 to 44 doing the Christmas shop', angle: 'In a pricey December, the 3rd ticket is the one line that costs nothing', style: 'A till receipt prints line by line; the free 3rd ticket is circled in red',
  hook: 'Receipt printing: "Wrapping paper £4.00"',
  meta: { headline: 'The cheapest line on the receipt', primary: primary('Christmas shopping receipt: wrapping paper, batteries, more batteries. One line costs nothing: the 3rd ticket.', 'Robot waiters and heat vision, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  receiptFmt, { hook: ['December', '_receipts._'], mid: ['The best line:', '_£0.00._'], lines: [['XMAS SHOP', '', 0.2], ['Wrapping paper', '£4.00', 0.5], ['Sellotape (lost)', '£2.50', 0.9], ['Batteries AAA', '£6.99', 1.3], ['Socks x3', '£9.00', 1.7], ['- - - - - - - - - - - - -', '', 2.1], ['EXPLORAZONE', '', 2.4], ['Ticket 1', '£18.00', 2.8], ['Ticket 2', '£18.00', 3.2], ['Ticket 3', '£0.00', 3.6, true], ['3 TICKETS', '£36.00', 4.2]], circle: [9, 4.6], cards: ['robot2', 'heat'], end: ['The best line', '_on the receipt._'], strip: ['robot2', 'heat', 'laser_room', 'roses', 'infinity_floor', 'sky_maze2'] });

// W24 Snow globe --------------------------------------------------------------------------
function globeFmt(c) {
  const FL = (() => { const r = rng(91); return Array.from({ length: 90 }, () => ({ a: r() * 6.28, d: Math.sqrt(r()), w: 0.6 + r() * 1.4, s: 3 + r() * 5, f: r() })); })();
  return {
    frame(t) {
      const E = endAt(c.dur), cx = 540, cy = 1000, R = 380;
      if (t < E + 0.4) {
        vgrad([[0, '#14214a'], [1, '#060b1f']]); snow(t, { n: 40, alpha: 0.25, scale: 0.6 }); photoStrip(t, 1560, 380, { keys: c.strip, alpha: 0.85 });
        const shakes = c.shakes, last = shakes.filter((s) => t >= s).pop() ?? -5, sh = Math.exp(-(t - last) * 1.6);
        ctx.save(); ctx.translate(cx, cy + 300); ctx.rotate(Math.sin((t - last) * 18) * 0.06 * sh * (t >= last ? 1 : 0)); ctx.translate(-cx, -cy - 300);
        ctx.fillStyle = '#5a3417'; ctx.beginPath(); ctx.moveTo(cx - 330, cy + 300); ctx.lineTo(cx + 330, cy + 300); ctx.lineTo(cx + 400, cy + 520); ctx.lineTo(cx - 400, cy + 520); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#e9b949'; rr(ctx, cx - 200, cy + 380, 400, 80, 12); ctx.fill(); T('BOWTHORPE', cx, cy + 436, { size: 40, w: 800, color: '#5a3417', ls: 6 });
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
        const n = c.scenes.length, seg = (E - 0.2) / n, i = Math.min(n - 1, Math.floor(t / seg)), fadeK = prog(t, (i + 1) * seg - 0.4, (i + 1) * seg);
        photo(IMG[c.scenes[i]], cx - R, cy - R, R * 2, R * 2, { zoom: 1.1 + 0.05 * prog(t, i * seg, (i + 1) * seg) });
        if (fadeK > 0 && c.scenes[i + 1]) photo(IMG[c.scenes[i + 1]], cx - R, cy - R, R * 2, R * 2, { zoom: 1.1, alpha: fadeK });
        FL.forEach((f) => { const sw = sh * 3 + 0.25, ang = f.a + t * f.w * sw, rr2 = R * 0.92 * f.d; const fall = ((f.f + t * 0.06) % 1) * 2 - 1; const x = cx + Math.cos(ang) * rr2 * (0.4 + sh), y = cy + lerp(Math.sin(ang) * rr2, fall * R * 0.9, 1 - Math.min(1, sh)); ctx.globalAlpha = 0.85; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, f.s, 0, Math.PI * 2); ctx.fill(); });
        ctx.restore();
        ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(cx, cy, R - 40, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke(); ctx.restore();
        ctx.restore();
        const lab = c.scenes[i]; if (LABEL[lab]) pill(cx, cy - R + 70, LABEL[lab], { size: 30, bg: P.yellow, fg: P.ink, alpha: 1 - fadeK });
        const hi = c.hooks.filter((h) => t >= h[0]).pop(); if (hi) hook(hi[1], 400, 96, hi[0], t, { hl: P.yellow });
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W24', title: 'Snow globe', slug: 'snow-globe', dur: 15, run: 'xmas', series: 'Christmas', music: 691,
  persona: 'Three generations, Christmas run-up', angle: 'Shake up December: a magical day for Nan, Mum and the children', style: 'A snow globe on a wooden base; each shake swirls snow and changes the room inside',
  hook: 'A snow globe shakes: "Shake up December."',
  meta: { headline: 'Shake up December', primary: primary('Shake up December. One day out for Nan, Mum and the children.', 'The garden of light, infinity lights and the infinity floor, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  globeFmt, { shakes: [0.2, 3.9, 7.6], scenes: ['roses', 'dodeca', 'infinity_floor'], hooks: [[0.1, ['Shake up', '_December._']], [3.8, ['Nan, Mum', '_and the kids._']], [7.5, ['One magical', '_day out._']]], end: ['Shake up', '_December._'], strip: ['roses', 'dodeca', 'infinity_floor', 'found_room', 'laser_room', 'tunnel'] });

// W25 Christmas jumper day ------------------------------------------------------------------
function knitCanvas() {
  const c = makeCanvas(W, H), g = c.getContext('2d'), s = 24;
  const motif = (row, col) => { const band = Math.floor(row / 10) % 3; if (band !== 1) return null; const r = row % 10, k = col % 10; if (r === 0 || r === 9) return '#fff'; const d = Math.abs(r - 4.5) + Math.abs(k - 4.5); return d < 2.5 ? '#fff' : (d < 3.5 && (r + k) % 2 ? '#e9b949' : null); };
  for (let row = 0; row < H / s + 1; row++) for (let col = 0; col < W / s + 1; col++) {
    const m = motif(row, col), base = Math.floor(row / 10) % 3 === 1 ? '#1f6e43' : '#c22c1c'; const x = col * s, y = row * s;
    g.fillStyle = m ?? base; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + s * 0.25, y + s * 0.9, x + s * 0.5, y + s); g.lineTo(x + s * 0.5, y + s * 0.35); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(x + s, y); g.quadraticCurveTo(x + s * 0.75, y + s * 0.9, x + s * 0.5, y + s); g.lineTo(x + s * 0.5, y + s * 0.35); g.closePath(); g.fill();
    g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(x + s * 0.48, y, 1.5, s);
  }
  return c;
}
function knitFmt(c) {
  let kc = null;
  return {
    setup() { kc = knitCanvas(); },
    frame(t) {
      const E = endAt(c.dur), X = c.patchAt ?? 2.2;
      if (t < E + 0.4) {
        ctx.save(); const z = 1.08 - 0.06 * prog(t, 0, E); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-540, -960); ctx.drawImage(kc, 0, 0); ctx.restore();
        ctx.save(); ctx.fillStyle = 'rgba(40,8,4,0.45)'; ctx.fillRect(0, 300, W, 400); ctx.restore();
        if (t < X - 0.2) hook(c.hook, 430, 116, 0.05, t, { hl: P.yellow, alpha: 1 - prog(t, X - 0.4, X - 0.2) });
        else hook(c.hook2, 430, 116, X - 0.2, t, { hl: P.yellow });
        c.patches.forEach(([key, x, y, w, h, rot], i) => {
          const a = X + i * 0.45, p = easeOutBack(prog(t, a, a + 0.4)); if (p <= 0) return;
          ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot); ctx.scale(p, p);
          photo(IMG[key], -w / 2, -h / 2, w, h, { radius: 30, shadow: 'rgba(0,0,0,0.45)' });
          ctx.setLineDash([18, 12]); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; rr(ctx, -w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 22); ctx.stroke(); ctx.setLineDash([]);
          ctx.restore(); labelPill(key, x + 30, y + h - 50, { alpha: clamp(p), bg: P.yellow });
        });
        brandTop();
      }
      endScene(t, E, c.end, 'red', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W25', title: 'Jumper day: done', slug: 'jumper-day-done', dur: 8, run: 'xmas', series: 'Christmas', music: 981,
  persona: 'Parents 25 to 44, last weeks of term', angle: 'Christmas jumper day is done; now what do you do with the weekend?', style: 'Knitted Christmas jumper pattern with photos stitched on as patches',
  hook: '"Christmas jumper day: done." on a knitted background',
  meta: { headline: 'Jumper day done. Now what?', primary: primary('Christmas jumper day: done. Weekend: now what?', 'The laser room and the space-time tunnel, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  knitFmt, { hook: ['Jumper day:', '_done._'], hook2: ['Weekend:', '_now what?_'], patches: [['laser_room', 70, 740, 560, 440, -0.05], ['tunnel', 500, 820, 520, 400, 0.06]], end: ['Jumper day done.', '_Lasers next._'], strip: ['laser_room', 'tunnel', 'infinity_floor', 'heat', 'robot2', 'roses'] });

// W28 Countdown to the holidays ----------------------------------------------------------------
function flapFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), X = c.doneAt ?? 2.7;
      if (t < E + 0.4) {
        festiveBg(t, 'navy');
        if (t < X) {
          const step = (X - 0.4) / c.nums.length, i = Math.min(c.nums.length - 1, Math.floor(prog(t, 0.2, X - 0.2) * c.nums.length)), f = prog(t, 0.2 + i * step, 0.2 + i * step + 0.18);
          const cur = c.nums[i], prev = c.nums[Math.max(0, i - 1)];
          const x = 290, y = 560, w = 500, h = 560;
          ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 40; ctx.fillStyle = '#111827'; rr(ctx, x, y, w, h, 40); ctx.fill(); ctx.restore();
          ctx.save(); rr(ctx, x, y, w, h, 40); ctx.clip();
          T(cur, 540, y + h / 2 + 150, { size: 420, w: 800, fam: HEAD, color: '#fff' });
          if (f < 1 && i > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h / 2); ctx.clip(); ctx.translate(540, y + h / 2); ctx.scale(1, Math.max(0.02, 1 - f)); ctx.translate(-540, -(y + h / 2)); ctx.fillStyle = '#111827'; ctx.fillRect(x, y, w, h / 2); T(prev, 540, y + h / 2 + 150, { size: 420, w: 800, fam: HEAD, color: '#fff' }); ctx.restore(); }
          ctx.fillStyle = '#000'; ctx.fillRect(x, y + h / 2 - 3, w, 6);
          ctx.restore();
          T(c.label, 540, 1210, { size: 40, w: 800, color: P.yellow, ls: 4 });
          hook(c.hook, 430, 96, 0.05, t, { hl: P.yellow });
        } else {
          mosaic(t, c.cards, X + 0.1, { y: 560 });
          hook(c.mid, 430, 104, X, t, { hl: P.yellow });
          if (t < X + 0.3) { ctx.save(); ctx.globalAlpha = 1 - prog(t, X, X + 0.3); fill('#fff'); ctx.restore(); }
        }
        photoStrip(t, 1460, 420, { keys: c.strip });
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W28', title: 'Countdown to the holidays', slug: 'countdown-to-holidays', dur: 8, run: 'xmas', series: 'Christmas', music: 911,
  persona: 'Parents 25 to 44, last week of term', angle: 'The countdown to the Christmas holidays, with the first day out already planned', style: 'Split-flap countdown from 5 to 1, then a 2x2 photo grid',
  hook: 'Flip clock: "5 days of term left"',
  meta: { headline: 'Holidays: first day sorted', primary: primary('5 days of term left. 4. 3. 2. 1. Christmas holidays: first day out already sorted.', 'The laser room, infinity lights, robot waiters and the infinity floor, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  flapFmt, { nums: ['5', '4', '3', '2', '1'], label: 'DAYS OF TERM LEFT', hook: ['The countdown', '_is on._'], mid: ['First day off:', '_sorted._'], cards: ['laser_room', 'dodeca', 'robot2', 'infinity_floor'], end: ['First day off:', '_sorted._'], strip: ['laser_room', 'dodeca', 'robot2', 'infinity_floor', 'roses', 'heat'] });

// W30 Tickets in the snow --------------------------------------------------------------------
function snowTicketsFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), F = c.flipAt ?? 2.6, X = c.photosAt ?? 4.8;
      if (t < E + 0.4) {
        if (t < X) {
          vgrad([[0, '#0f1d3d'], [1, '#2a4170']]); snow(t, { n: 170 });
          const tk = tickets();
          [[-0.14, 300, 900, 'paid', 0.2], [0, 540, 860, 'paid2', 0.6], [0.14, 780, 900, 'third', 1.0]].forEach(([rot, x, y, kind, at]) => {
            const p = easeOutBack(prog(t, at, at + 0.55), 1.2); if (p <= 0) return;
            const sc = lerp(0.2, 1, p), xx = lerp(540, x, p), yy = lerp(1400, y, p);
            if (kind === 'third') { const f = prog(t, F, F + 0.6); flipTicket(tk.paid, tk.free, f, xx, yy, 330 * sc, { rot: rot * p }); }
            else drawTicket(tk[kind], xx, yy, 330 * sc, { rot: rot * p });
          });
          confetti2D(780, 900, t - F - 0.3);
          if (t < F) hook(c.hook, 430, 104, 0.1, t, { hl: '#9cd8ff' }); else hook(c.hook2, 430, 104, F, t, { hl: P.lime });
        } else {
          cardSeq(t, c.cards.map((k, i) => { const s = (E - X) / c.cards.length; return { k, a: X + i * s, b: X + (i + 1) * s }; }), 600, 980, 640);
          snow(t, { n: 90, alpha: 0.7 });
          hook(c.mid, 430, 100, X, t, { hl: P.lime });
        }
        brandTop();
      }
      endScene(t, E, c.end, 'snow', { stripKeys: c.strip });
    },
  };
}
spot({ id: 'W30', title: 'Tickets in the snow', slug: 'tickets-in-the-snow', dur: 12, run: 'xmas', series: 'Christmas', music: 510,
  persona: 'Parents 25 to 44, families of three or more', angle: 'Two tickets paid, the third flips to free', style: 'Three tickets tumble in through falling snow; the third flips to FREE with confetti',
  hook: 'Tickets fly in through snow: "Two tickets..."',
  meta: { headline: 'Two tickets. Third one free.', primary: primary('Two tickets at £18. The third flips to free.', 'The laser room, the space-time tunnel and the light-up floor, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  snowTicketsFmt, { hook: ['Two tickets.', '_£18 each._'], hook2: ['The third?', '_Free._'], mid: ['Three of you.', '_Two tickets._'], cards: ['laser_room', 'tunnel', 'floor2'], end: ['Two tickets.', '_Third one free._'], strip: ['laser_room', 'tunnel', 'floor2', 'heat', 'robot2', 'roses'] });

// W31 Operation Wrapping (secret dossier) --------------------------------------------------------
function dossierFmt(c) {
  let pc = null;
  return {
    setup() { pc = makeCanvas(W, H); const g = pc.getContext('2d'), r = rng(4); g.fillStyle = '#d9b779'; g.fillRect(0, 0, W, H); for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(90,60,20,${0.03 + r() * 0.05})`; g.fillRect(r() * W, r() * H, 2, 2); } g.fillStyle = '#c9a463'; g.fillRect(0, 0, W, 260); g.fillStyle = '#f7f3ea'; g.save(); g.translate(540, 960); g.rotate(-0.015); g.shadowColor = 'rgba(0,0,0,0.3)'; g.shadowBlur = 20; g.fillRect(-470, -640, 940, 1500); g.restore(); },
    frame(t) {
      const E = endAt(c.dur);
      if (t < E + 0.4) {
        ctx.drawImage(pc, 0, 0);
        const TW = '"Special Elite", "Courier New", monospace';
        c.lines.forEach(([txt, at, size, col], i) => { const n = Math.floor(txt.length * prog(t, at, at + txt.length * 0.028)); if (n <= 0) return; T(txt.slice(0, n), 100, 430 + i * 96 + (i ? 30 : 0), { size: (size ?? 44) * 1.18, w: 400, fam: TW, color: col ?? '#1f1f1f', align: 'left' }); });
        c.stamps.forEach(([txt, x, y, rot, at, col]) => noteItem({ type: 'stamp', text: txt, x, y, rot, at, color: col, size: 64 }, t));
        c.pics.forEach(([key, x, y, rot, at]) => { const p = prog(t, at, at + 0.35); if (p <= 0) return; polaroidAt(IMG[key], x, y, 380, rot, LABEL[key] && LABEL[key].toLowerCase(), p, { fam: KALAM }); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = '#9aa1a9'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-20, -250); ctx.lineTo(-20, -190); ctx.arc(0, -190, 20, Math.PI, 0, true); ctx.lineTo(20, -240); ctx.stroke(); ctx.restore(); });
        brandTop();
      }
      endScene(t, E, c.end, 'cream', { stripKeys: c.strip });
    },
  };
}
spot({ id: 'W31', title: 'Operation: Wrapping', slug: 'operation-wrapping', dur: 12, run: 'xmas', series: 'Christmas', music: 1015,
  persona: 'Grandparents 55+ helping parents in December', angle: 'Grandparents take the children out so the presents can be wrapped in secret', style: 'Top-secret mission dossier typed on a typewriter, with stamps and clipped photos',
  hook: '"TOP SECRET: Operation Wrapping" stamped on a dossier',
  meta: { headline: 'Grandparents: your mission', primary: primary('Top secret. Operation Wrapping. Agents: Nan and Grandad. Mission: take the children out for the day so the presents can be wrapped.', 'Location: Explorazone, Bowthorpe, Norwich. Laser room, sky maze, all indoors.') } },
  dossierFmt, { lines: [['OPERATION WRAPPING', 0.4, 58, '#7a160c'], ['AGENTS: Nan & Grandad', 1.2], ['MISSION: get the kids', 2.1], ['out of the house all day', 3.0], ['SO: presents get wrapped', 3.9], ['LOCATION: Explorazone', 4.9, 44, '#1a34bf']], stamps: [['TOP SECRET', 760, 350, 0.12, 0.1, '#c0271b'], ['ACCEPTED', 760, 1090, -0.15, 6.0, '#1f7a3e']], pics: [['laser_room', 280, 1460, -0.06, 3.6], ['sky_maze2', 780, 1500, 0.07, 4.4]], end: ['Grandparents:', '_your mission._'], strip: ['laser_room', 'sky_maze2', 'heat', 'robot2', 'roses', 'infinity_floor'] });
