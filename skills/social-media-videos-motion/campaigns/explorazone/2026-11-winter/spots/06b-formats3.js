// =====================================================================
// Effect formats picked from the director's list (Oct 2026): magazine cover, checklist, phone mockup,
// paper cutout (scrapbook), growth curve and chat takeover, joined to the photos with snap-zoom and zoom-through cuts.
// =====================================================================

// whole photos in sequence; each cut after the first snaps in from 122% with a short white flash
function snapSeq(t, keys, t0, step, o = {}) {
  const i = Math.min(keys.length - 1, Math.max(0, Math.floor((t - t0) / step))), a = t0 + i * step, key = keys[i];
  const snap = i > 0 ? 1 + 0.22 * (1 - easeOutCubic(prog(t, a, a + 0.22))) : 1, cy = o.cy ?? 900;
  ctx.save(); ctx.translate(540, cy); ctx.scale(snap, snap); ctx.translate(-540, -cy); heroPhoto(key, t, a, a + step, { cy: o.cy, dz: 0.04 }); ctx.restore();
  const fl = i > 0 ? 1 - prog(t, a, a + 0.14) : 0; if (fl > 0) { ctx.save(); ctx.globalAlpha = fl * 0.7; fill('#fff'); ctx.restore(); }
  if (o.labels !== false && LABEL[key]) labelPill(key, 70, o.labelY ?? 1150, { alpha: prog(t, a + 0.15, a + 0.35) });
  return i;
}
// zoom through a rectangle (a cover photo, a phone screen, a chart point) until it fills the frame
function zoomThrough(t, a, d, rect, drawInside) {
  const p = easeInCubic(prog(t, a, a + d)), [x, y, w, h] = rect, cx = x + w / 2, cy = y + h / 2, s = lerp(1, Math.max(W / w, H / h) * 1.1, p);
  ctx.save(); ctx.translate(lerp(cx, 540, p), lerp(cy, 960, p)); ctx.scale(s, s); ctx.translate(-cx, -cy); drawInside(); ctx.restore();
  return p;
}
// shared tail: zoom through rect into the first photo, then snap-zoom through the rest with the mid line on top
function zoomTail(t, X, D, E, rect, drawFront, keys, c, hl) {
  const step = (E - X - D) / keys.length;
  if (t < X) { drawFront(t); return; }
  if (t < X + D) {
    const p = zoomThrough(t, X, D, rect, () => drawFront(t));
    if (p > 0.5) heroPhoto(keys[0], t, X + D, X + D + step, { dz: 0.04, alpha: (p - 0.5) / 0.5 });
    return;
  }
  snapSeq(t, keys, X + D, step); shade(0.75, 0, 0.36); hook(c.mid, 400, 100, X + D + 0.1, t, { hl });
}
const HOOK_Y = 400;

// Magazine cover -------------------------------------------------------------------------------
function magazineFmt(c) {
  const X = c.zoomAt ?? 4.4, D = 0.5, red = c.mast?.[1] ?? P.red;
  const cover = (t) => {
    const k = easeOutBack(prog(t, 0.05, 0.5), 1.1), sc = lerp(0.85, 1, clamp(k));
    ctx.save(); ctx.translate(540, 900); ctx.rotate((1 - clamp(k)) * -0.12); ctx.scale(sc, sc); ctx.translate(-540, -900);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20; ctx.fillStyle = c.paper ?? '#fff'; ctx.fillRect(90, 300, 900, 1200); ctx.restore();
    ctx.fillStyle = red; ctx.fillRect(90, 300, 900, 170);
    T(c.mast?.[0] ?? 'EXPLORAZONE', 540, 425, { size: c.mastSize ?? 96, w: 800, fam: HEAD, color: '#fff', ls: 2 });
    T(c.issue ?? 'WINTER ISSUE', 960, 492, { size: 22, w: 800, color: '#111', align: 'right', ls: 3 });
    photo(IMG[c.photo], 90, 500, 900, 560, { zoom: 1.02 + 0.03 * prog(t, 0, X) });
    c.tags.forEach(([txt, at], i) => {
      const kk = prog(t, at, at + 0.25); if (kk <= 0) return; const tw = measure(txt, 30, 800), y = 580 + Math.floor(i / 2) * 120;
      pill(i % 2 ? 960 - tw / 2 - 26 : 120 + tw / 2 + 26, y, txt, { size: 30, bg: i % 3 === 0 ? P.yellow : '#fff', fg: '#111', alpha: kk, scale: lerp(0.6, 1, easeOutBack(kk)) });
    });
    words(c.cover, 1140, 72, c.coverAt ?? 0.9, t, { color: '#111', hl: red, maxW: 820 });
    for (let b = 0; b < 30; b++) { ctx.fillStyle = '#111'; ctx.fillRect(800 + b * 5, 1340, (b * 7) % 3 + 1, 110); }
    T(c.price ?? 'BUY 2, GET THE 3RD FREE', 120, 1420, { size: 30, w: 800, color: red, align: 'left' });
    ctx.restore();
  };
  const front = (t) => { bgPhoto(IMG[c.photo]); ctx.save(); ctx.globalAlpha = 0.35; fill('#0b1220'); ctx.restore(); cover(t); };
  return {
    frame(t) {
      const E = endAt(c.dur);
      if (t < E + 0.4) { zoomTail(t, X, D, E, [90, 500, 900, 560], front, [c.photo, ...c.cards], c, P.lime); brandTop(); }
      endScene(t, E, c.end, c.endKind ?? 'navy', { stripKeys: c.strip });
    },
  };
}

// Checklist ---------------------------------------------------------------------------------------
function checklistFmt(c) {
  const X = c.zoomAt ?? 5.0, D = 0.5, Y0 = 720, DY = 108, last = c.items[c.items.length - 1], lastY = Y0 + (c.items.length - 1) * DY;
  const front = (t) => {
    vgrad([[0, c.bg?.[0] ?? '#1a34bf'], [1, c.bg?.[1] ?? '#0b1450']]); photoStrip(t, 1460, 420, { keys: c.strip, alpha: 0.9 });
    glassCard(80, 540, 920, 760, { fill: 'rgba(255,255,255,0.96)', r: 40 });
    T(c.title, 130, 630, { size: 50, w: 800, fam: HEAD, color: '#111', align: 'left' });
    c.items.forEach(([txt, at, key], i) => {
      const y = Y0 + i * DY, k = prog(t, at, at + 0.25); if (k <= 0) return;
      ctx.save(); ctx.globalAlpha = k; ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 5; rr(ctx, 130, y - 10, 64, 64, 16); ctx.stroke(); ctx.restore();
      const done = prog(t, at + 0.35, at + 0.6);
      if (done > 0) { ctx.save(); ctx.fillStyle = key ? P.red : '#16a34a'; ctx.globalAlpha = done; rr(ctx, 130, y - 10, 64, 64, 16); ctx.fill(); ctx.restore(); tickMark(162, y + 22, 44, done, '#fff'); }
      T(txt, 220, y + 38, { size: 44, w: key ? 800 : 600, color: key ? P.red : '#1f2937', align: 'left', alpha: k });
      if (key) { const pk = easeOutBack(prog(t, at + 0.5, at + 0.9)); if (pk > 0) { ctx.save(); ctx.translate(880, y + 22); ctx.scale(pk, pk); photo(IMG[key], -80, -52, 160, 104, { radius: 14, shadow: 'rgba(0,0,0,0.3)' }); ctx.restore(); } }
    });
    if (t < X) hook(c.hook, HOOK_Y, 88, 0.05, t, { hl: P.yellow });
  };
  return {
    frame(t) {
      const E = endAt(c.dur);
      if (t < E + 0.4) { zoomTail(t, X, D, E, [800, lastY - 30, 160, 104], front, [last[2], ...c.cards], c, P.yellow); brandTop(); }
      endScene(t, E, c.end, c.endKind ?? 'royal', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}

// Phone mockup: a feed, a story or a reminder on a phone, then a zoom through the screen ------------
function phoneFmt(c) {
  const X = c.zoomAt ?? 5.0, D = 0.55, PX = 260, PY = 560, PW = 560, PH = 1120, SX = PX + 26, SY = PY + 26, SW = PW - 52, SH = PH - 52;
  const screen = (t) => {
    ctx.save(); rr(ctx, SX, SY, SW, SH, 52); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(SX, SY, SW, SH);
    if (c.mode === 'story') {
      const n = c.shots.length, st = (X - 0.4) / n, i = Math.min(n - 1, Math.max(0, Math.floor((t - 0.4) / st)));
      photo(IMG[c.shots[i]], SX, SY, SW, SH, { zoom: 1.04 + 0.05 * prog(t, 0.4 + i * st, 0.4 + (i + 1) * st) });
      for (let b = 0; b < n; b++) { const bx = SX + 20 + b * (SW - 40) / n, bw = (SW - 40) / n - 8, f = b < i ? 1 : b > i ? 0 : prog(t, 0.4 + i * st, 0.4 + (i + 1) * st); ctx.fillStyle = 'rgba(255,255,255,0.45)'; rr(ctx, bx, SY + 34, bw, 8, 4); ctx.fill(); if (f > 0) { ctx.fillStyle = '#fff'; rr(ctx, bx, SY + 34, bw * f, 8, 4); ctx.fill(); } }
      appIcon(SX + 22, SY + 60, 56, P.red, 'E'); T('explorazone', SX + 92, SY + 100, { size: 28, w: 800, color: '#fff', align: 'left', shadow: 'rgba(0,0,0,0.6)' });
      if (c.captions) { const cap = c.captions[i]; if (cap) T(cap, SX + SW / 2, SY + 640, { size: 40, w: 800, color: '#fff', stroke: 7, strokeColor: '#000', alpha: prog(t, 0.4 + i * st, 0.6 + i * st) }); }
    } else if (c.mode === 'reminder') {
      photo(IMG[c.shots[0]], SX, SY, SW, SH, { filter: 'blur(10px) brightness(0.6)', zoom: 1.1 });
      T(c.time ?? '08:30', SX + SW / 2, SY + 250, { size: 120, w: 700, color: '#fff' }); T(c.date ?? 'Saturday', SX + SW / 2, SY + 120, { size: 34, w: 700, color: '#fff' });
      (c.reminders ?? []).forEach(([title, body, at], i) => {
        const k = easeOutBack(prog(t, at, at + 0.4)); if (k <= 0) return; const y = SY + 320 + i * 170, lastOne = i === c.reminders.length - 1;
        ctx.save(); ctx.translate(0, (1 - clamp(k)) * -160); glassCard(SX + 18, y, SW - 36, 150, { fill: 'rgba(255,255,255,0.93)', r: 28, alpha: clamp(k) });
        appIcon(SX + 36, y + 35, 76, lastOne ? P.red : '#64748b', lastOne ? 'E' : '!', { alpha: clamp(k) });
        T(title, SX + 130, y + 68, { size: 28, w: 800, color: '#111', align: 'left', alpha: clamp(k) }); T(body, SX + 130, y + 110, { size: 24, w: 500, color: '#374151', align: 'left', alpha: clamp(k) }); ctx.restore();
      });
    } else {
      const off = easeInOutSine(prog(t, 1.0, X - 0.3)) * (c.shots.length - 1) * 720;
      ctx.save(); ctx.translate(0, -off);
      c.shots.forEach((k2, i) => { const y = SY + 110 + i * 720; appIcon(SX + 18, y, 52, P.red, 'E'); T('explorazone', SX + 84, y + 36, { size: 26, w: 800, color: '#111', align: 'left' }); photo(IMG[k2], SX, y + 70, SW, 540, {}); heart(SX + 44, y + 660, 22, i === 0 && t > 2 ? '#ef4444' : '#9ca3af'); T(`${(c.likes ?? [312, 204, 518])[i % 3]} likes`, SX + 84, y + 670, { size: 26, w: 800, color: '#111', align: 'left' }); });
      ctx.restore(); ctx.fillStyle = '#fff'; ctx.fillRect(SX, SY, SW, 96); T(c.feedTitle ?? 'For you', SX + SW / 2, SY + 70, { size: 34, w: 800, color: '#111' });
    }
    ctx.restore();
  };
  const front = (t) => {
    vgrad([[0, c.bg?.[0] ?? '#0f172a'], [1, c.bg?.[1] ?? '#312e81']]);
    const k = easeOutCubic(prog(t, 0, 0.6)), rot = -0.04 * (1 - prog(t, 0.6, X));
    ctx.save(); ctx.translate(0, (1 - k) * 600); ctx.translate(540, 1120); ctx.rotate(rot); ctx.translate(-540, -1120);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 30; ctx.fillStyle = '#111'; rr(ctx, PX, PY, PW, PH, 76); ctx.fill(); ctx.restore();
    screen(t); ctx.fillStyle = '#111'; rr(ctx, PX + PW / 2 - 80, PY + 40, 160, 40, 20); ctx.fill();
    ctx.restore();
    if (t < X) hook(c.hook, HOOK_Y, 88, 0.05, t, { hl: P.lime });
  };
  return {
    frame(t) {
      const E = endAt(c.dur);
      if (t < E + 0.4) { zoomTail(t, X, D, E, [SX, SY, SW, SH], front, [c.shots[c.shots.length - 1], ...c.cards], c, P.lime); brandTop(); }
      endScene(t, E, c.end, c.endKind ?? 'navy', { stripKeys: c.strip });
    },
  };
}

// Paper cutout scrapbook: ransom-note letters, torn photos taped on kraft paper, stop-motion timing -------------
function tornPath(x, y, w, h, seed) {
  const r = rng(seed), p = new Path2D(), j = () => (r() - 0.5) * 14, step = 22;
  p.moveTo(x + j(), y + j()); for (let i = step; i < w; i += step) p.lineTo(x + i, y + j());
  for (let i = 0; i < h; i += step) p.lineTo(x + w + j(), y + i); for (let i = w; i > 0; i -= step) p.lineTo(x + i, y + h + j());
  for (let i = h; i > 0; i -= step) p.lineTo(x + j(), y + i); p.closePath(); return p;
}
function scrapbookFmt(c) {
  let paper = null;
  const COLS = ['#fde68a', '#fca5a5', '#a7f3d0', '#bfdbfe', '#fbcfe8', '#ffffff'], FAMS = [HEAD, SCRIPT, TYPEW, PRINT, KALAM];
  return {
    setup() { paper = makeCanvas(W, H); const g = paper.getContext('2d'), r = rng(31); g.fillStyle = c.paper ?? '#c8a77e'; g.fillRect(0, 0, W, H); for (let i = 0; i < 6000; i++) { g.fillStyle = `rgba(80,50,20,${r() * 0.07})`; g.fillRect(r() * W, r() * H, 2, 2); } },
    frame(t) {
      const E = endAt(c.dur), tq = Math.floor(t * 12) / 12;
      if (t < E + 0.4) {
        ctx.drawImage(paper, 0, 0);
        c.pieces.forEach(([key, cx, cy, w, h, rot, at, cap], i) => {
          const k = easeOutBack(prog(tq, at, at + 0.25)); if (k <= 0) return; const jit = (Math.floor(t * 6) % 2 ? 1 : -1) * 0.006;
          ctx.save(); ctx.translate(cx, cy - (1 - clamp(k)) * 120); ctx.rotate(rot + jit);
          const outer = tornPath(-w / 2 - 14, -h / 2 - 14, w + 28, h + 28, 100 + i), inner = tornPath(-w / 2, -h / 2, w, h, 200 + i);
          ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8; ctx.fillStyle = '#fbf8f1'; ctx.fill(outer); ctx.restore();
          ctx.save(); ctx.clip(inner); photo(IMG[key], -w / 2, -h / 2, w, h, {}); ctx.restore();
          ctx.save(); ctx.translate(-w / 2 + 40, -h / 2 - 4); ctx.rotate(-0.5); ctx.fillStyle = 'rgba(244,114,182,0.75)'; ctx.fillRect(-60, -17, 120, 34); ctx.restore();
          if (cap) T(cap, 0, h / 2 + 64, { size: 46, w: 700, fam: KALAM, color: '#1f2937' });
          ctx.restore();
        });
        (c.titles ?? [[c.title, 470]]).forEach(([title, ty, t0], li) => {
          const letters = title.split(''), base = c.titleSize ?? 88, raw = letters.reduce((a, ch) => a + (ch === ' ' ? base * 0.4 : base * 0.78), 0), sz = base * Math.min(1, 960 / raw);
          const widths = letters.map((ch) => (ch === ' ' ? sz * 0.4 : sz * 0.78)); let x = 540 - widths.reduce((a, b) => a + b, 0) / 2;
          letters.forEach((ch, i) => {
            const a = (t0 ?? 0.1 + li * 0.9) + i * 0.06, k = prog(tq, a, a + 0.12);
            if (ch !== ' ' && k > 0) { const r = rng(li * 97 + i * 13 + 5), rot = (r() - 0.5) * 0.3, dy = (r() - 0.5) * 16, col = COLS[Math.floor(r() * COLS.length)], fam = FAMS[Math.floor(r() * FAMS.length)], s = lerp(1.4, 1, k); ctx.save(); ctx.translate(x + widths[i] / 2, ty + dy); ctx.rotate(rot); ctx.scale(s, s); ctx.save(); ctx.fillStyle = col; ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 8; ctx.fillRect(-widths[i] / 2 + 2, -sz * 0.62, widths[i] - 4, sz * 0.95); ctx.restore(); T(ch, 0, sz * 0.18, { size: sz * 0.8, w: 800, fam, color: '#111' }); ctx.restore(); }
            x += widths[i];
          });
        });
        (c.stickers ?? []).forEach(([x2, y2, at]) => { const k = easeOutBack(prog(tq, at, at + 0.2)); if (k > 0) star(x2, y2, 34 * k, P.yellow, 1, 0.3); });
        brandTop();
      }
      endScene(t, E, c.end, c.endKind ?? 'cream', { stripKeys: c.strip });
    },
  };
}

// Growth curve: a tongue-in-cheek chart, then a zoom through the peak into the photos -----------------------------
function chartFmt(c) {
  const X = c.zoomAt ?? 5.4, D = 0.5, x0 = 170, x1 = 940, y0 = 1190, y1 = 720, n = c.points.length - 1;
  const pt = (u, v) => [lerp(x0, x1, u), lerp(y0, y1, v)];
  const front = (t) => {
    vgrad([[0, c.bg?.[0] ?? '#0f766e'], [1, c.bg?.[1] ?? '#134e4a']]); photoStrip(t, 1470, 410, { keys: c.strip, alpha: 0.9 });
    glassCard(80, 540, 920, 800, { fill: '#fff', r: 36 });
    T(c.title, 130, 625, { size: 42, w: 800, fam: HEAD, color: '#111', align: 'left' }); T(c.note ?? '(very scientific)', 950, 625, { size: 24, w: 600, color: '#9ca3af', align: 'right' });
    ctx.strokeStyle = '#d1d5db'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y1 - 20); ctx.lineTo(x0, y0); ctx.lineTo(x1 + 10, y0); ctx.stroke();
    T(c.yLabel ?? 'FUN', x0 + 14, y1 - 6, { size: 22, w: 800, color: '#6b7280', align: 'left', ls: 2 });
    c.xLabels.forEach((l, i) => T(l, lerp(x0, x1, i / (c.xLabels.length - 1)), y0 + 44, { size: 24, w: 700, color: '#6b7280' }));
    const upto = prog(t, 0.6, X - 0.6) * n;
    ctx.save(); ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let i = 0; i < n && i < upto; i++) { const f = Math.min(1, upto - i), [ax, ay] = pt(i / n, c.points[i]), [bx, by] = pt((i + 1) / n, c.points[i + 1]); ctx.strokeStyle = c.points[i + 1] >= c.points[i] ? '#16a34a' : '#ef4444'; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(lerp(ax, bx, f), lerp(ay, by, f)); ctx.stroke(); }
    ctx.restore();
    c.notes.forEach(([idx, txt, col]) => { if (upto < idx) return; const [nx, ny] = pt(idx / n, c.points[idx]), a = 0.6 + (idx / n) * (X - 1.2), k = easeOutBack(prog(t, a, a + 0.3)); ctx.fillStyle = col ?? '#111'; ctx.beginPath(); ctx.arc(nx, ny, 12, 0, Math.PI * 2); ctx.fill(); pill(clamp(nx, 260, 820), ny - 56, txt, { size: 28, bg: col ?? '#111', fg: '#fff', scale: k, alpha: clamp(k) }); });
    if (t < X) hook(c.hook, HOOK_Y, 88, 0.05, t, { hl: P.yellow });
  };
  return {
    frame(t) {
      const E = endAt(c.dur), [px, py] = pt(c.peak / n, c.points[c.peak]);
      if (t < E + 0.4) { zoomTail(t, X, D, E, [px - 80, py - 60, 160, 120], front, c.cards, c, P.yellow); brandTop(); }
      endScene(t, E, c.end, c.endKind ?? 'green', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}

// Chat takeover: the group chat floods with replies until it fills the screen, then the photo takes over -----------
function chatTakeoverFmt(c) {
  const base = chatFmt({ ...c, dur: 99 }), X = c.zoomAt ?? 4.6, D = 0.5;
  const front = (t) => {
    base.frame(Math.min(t, X));
    const n = Math.floor(prog(t, c.floodAt ?? 2.6, X) * 14);
    const fa = 1 - prog(t, X, X + 0.2);
    if (fa > 0) for (let i = 0; i < n; i++) { const r = rng(i + 7), left = r() > 0.5, x = left ? 60 : 520, y = 440 + ((i * 97) % 800); glassCard(x, y, 500, 92, { fill: left ? '#fff' : '#dcf8c6', r: 24, alpha: fa }); T(c.flood[i % c.flood.length], x + 26, y + 58, { size: 32, w: 600, color: '#111', align: 'left', alpha: fa }); }
  };
  return {
    frame(t) {
      const E = endAt(c.dur);
      if (t < E + 0.4) { zoomTail(t, X, D, E, c.photoRect ?? [434, 748, 572, 280], front, [c.photo, ...c.cards], c, P.lime); brandTop(); }
      endScene(t, E, c.end, c.endKind ?? 'green', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
