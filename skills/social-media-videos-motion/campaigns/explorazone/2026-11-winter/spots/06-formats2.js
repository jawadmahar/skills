// =====================================================================
// More formats for W51 to W150: paint swatches, ring-road map, crossword, bingo card,
// then and now, boarding pass, banking app, February calendar.
// =====================================================================
const TYPEW = '"Special Elite", "Courier New", monospace';

// W51 and W119: paint-swatch card, the last swatch is a photo ---------------------------
function swatchFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), X = c.heroAt ?? 5.2;
      if (t < E + 0.4) {
        vgrad([[0, c.bg?.[0] ?? '#e8e6e1'], [1, c.bg?.[1] ?? '#c9c6bf']]);
        if (t < X + 0.6) {
          const out2 = easeInCubic(prog(t, X, X + 0.6));
          ctx.save(); ctx.globalAlpha = 1 - out2; ctx.translate(540, 900); ctx.scale(1 + out2 * 0.3, 1 + out2 * 0.3); ctx.translate(-540, -900);
          glassCard(110, 540, 860, 760, { fill: '#fff', r: 18 });
          T(c.card, 150, 610, { size: 30, w: 800, color: '#6b7280', align: 'left', ls: 4 });
          const n = c.swatches.length + 1, rh = 120;
          c.swatches.forEach(([name, col], i) => {
            const a = 0.5 + i * 0.55, k = easeOutCubic(prog(t, a, a + 0.3)); if (k <= 0) return; const y = 640 + i * (rh + 6);
            ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = col; rr(ctx, 150, y, 520 * k, rh, 10); ctx.fill(); ctx.restore();
            T(name, 700, y + 72, { size: 40, w: 700, color: '#374151', align: 'left', alpha: k });
          });
          const a = 0.5 + c.swatches.length * 0.55 + 0.3, k = easeOutBack(prog(t, a, a + 0.4)), y = 640 + c.swatches.length * (rh + 6);
          if (k > 0) { photo(IMG[c.hero[1]], 150, y, 520, rh, { radius: 10, alpha: clamp(k), zoom: 1.4 }); T(c.hero[0], 700, y + 72, { size: 44, w: 800, color: P.red, align: 'left', alpha: clamp(k) }); star(1010, y + 30, 26 * clamp(k), P.yellow); }
          ctx.restore();
          hook(c.hook, 400, 96, 0.05, t, { color: P.ink, hl: P.red, shadow: false });
        } else {
          heroPhoto(c.hero[1], t, X, E, {}); shade(0.75, 0, 0.36);
          hook(c.mid, 400, 100, X + 0.4, t, { hl: P.lime });
          labelPill(c.hero[1], 70, 1150, { alpha: prog(t, X + 0.8, X + 1.1) });
          if (c.cards) c.cards.forEach((k2, i) => { const a = X + 1.6 + i * 0.5; if (t > a) card(k2, 560 - i * 30, 1000 + i * 40, 440, 260, { alpha: easeOutCubic(prog(t, a, a + 0.3)), zoom: 1.05, label: false }); });
        }
        brandTop();
      }
      endScene(t, E, c.end, c.endKind ?? 'navy', { stripKeys: c.strip });
    },
  };
}

// W52, W72, W115: ring-road map, packed centre, a route that goes round it -------------
function mapFmt(c) {
  const CARS = (() => { const r = rng(c.seed ?? 4); return Array.from({ length: 90 }, () => ({ a: r() * 6.28, d: r() * 0.95, s: 0.5 + r() })); })();
  const CX = 600, CY = 860, R = 230;
  const route = (u) => { const pts = [[260, 1240], [250, 1100], [230, 960], [220, 820], [215, 720]]; const f = u * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), k = f - i; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; };
  return {
    frame(t) {
      const E = endAt(c.dur), X = c.cardsAt ?? (c.dur > 9 ? 5.6 : 3.2);
      if (t < E + 0.4) {
        if (t < X + 0.3) {
          fill('#0f1b33');
          ctx.save(); ctx.strokeStyle = '#1f2f52'; ctx.lineWidth = 26; [[0, 760, W, 900], [CX, 300, CX - 60, 1500], [100, 1300, 1000, 450], [80, 520, 1040, 1220]].forEach(([a, b, c2, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c2, d); ctx.stroke(); }); ctx.restore();
          ctx.save(); ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
          T('RING ROAD', CX, CY - R - 24, { size: 26, w: 800, color: '#f59e0b', ls: 4 });
          CARS.forEach((q) => { const rr2 = R * q.d, ang = q.a + Math.sin(t * q.s) * 0.02; ctx.fillStyle = 'rgba(239,68,68,0.9)'; ctx.beginPath(); ctx.arc(CX + Math.cos(ang) * rr2, CY + Math.sin(ang) * rr2, 7, 0, Math.PI * 2); ctx.fill(); });
          pill(CX, CY, c.centreLabel ?? 'CITY CENTRE: PACKED', { size: 30, bg: '#ef4444', fg: '#fff', alpha: prog(t, 0.3, 0.6) });
          const u = easeInOutSine(prog(t, 1.4, X - 0.6));
          ctx.save(); ctx.setLineDash([22, 16]); ctx.strokeStyle = P.lime; ctx.lineWidth = 12; ctx.beginPath(); for (let i = 0; i <= 40 * u; i++) { const [x, y] = route(i / 40); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
          if (u > 0) { const [x, y] = route(u); ctx.fillStyle = '#fff'; rr(ctx, x - 22, y - 34, 44, 68, 12); ctx.fill(); ctx.fillStyle = P.lime; rr(ctx, x - 16, y - 24, 32, 20, 6); ctx.fill(); }
          const pk = easeOutBack(prog(t, 0.6, 1.0)); const g = ctx.createRadialGradient(215, 700, 0, 215, 700, 170); g.addColorStop(0, `rgba(182,245,66,${0.5 * pk})`); g.addColorStop(1, 'rgba(182,245,66,0)'); ctx.fillStyle = g; ctx.fillRect(45, 530, 340, 340);
          ctx.save(); ctx.translate(215, 690); ctx.scale(pk, pk); ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(0, -40, 40, Math.PI, 0); ctx.lineTo(0, 30); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, -40, 16, 0, Math.PI * 2); ctx.fill(); ctx.restore();
          pill(240, 790, 'EXPLORAZONE', { size: 30, bg: P.lime, fg: P.ink, alpha: prog(t, 0.9, 1.2) }); T('Bowthorpe', 240, 860, { size: 32, w: 700, color: '#fff', alpha: prog(t, 1.0, 1.3) });
          if (t < (c.hook2At ?? 2.4)) hook(c.hook, 400, 92, 0.05, t, { hl: '#f59e0b' }); else hook(c.hook2, 400, 92, c.hook2At ?? 2.4, t, { hl: P.lime });
          ctx.save(); ctx.globalAlpha = prog(t, X, X + 0.3); fill('#0f1b33'); ctx.restore();
        } else {
          fill('#0f1b33');
          mosaic(t, c.cards, X + 0.2, { y: 580 });
          hook(c.mid, 400, 96, X + 0.1, t, { hl: P.lime });
        }
        photoStrip(t, 1460, 420, { keys: c.strip, alpha: 0.9 });
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { stripKeys: c.strip });
    },
  };
}

// W57 and W127: crossword, the answer typed into the grid ---------------------------
function crosswordFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), X = c.cardsAt ?? 6.0, ans = c.answer ?? 'EXPLORAZONE', n = ans.length, s = Math.min(86, Math.floor(940 / n)), x0 = (W - s * n) / 2, y0 = 960;
      if (t < E + 0.4) {
        fill('#f7f3ea'); const gr = rng(2); for (let i = 0; i < 2500; i++) { ctx.fillStyle = `rgba(90,80,60,${gr() * 0.05})`; ctx.fillRect(gr() * W, gr() * H, 2, 2); }
        if (t < X + 0.3) {
          ctx.save(); ctx.globalAlpha = 1 - prog(t, X, X + 0.3);
          for (let r2 = -2; r2 <= 3; r2++) for (let k = 0; k < n; k++) { if (r2 === 0) continue; const black = ((k * 7 + r2 * 3) % 5) < 2; ctx.fillStyle = black ? '#1f2937' : '#fff'; ctx.fillRect(x0 + k * s, y0 + r2 * s, s, s); ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 2; ctx.strokeRect(x0 + k * s, y0 + r2 * s, s, s); }
          for (let k = 0; k < n; k++) { ctx.fillStyle = '#fff59d'; ctx.fillRect(x0 + k * s, y0, s, s); ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 3; ctx.strokeRect(x0 + k * s, y0, s, s); }
          T(String(c.num ?? 7), x0 + 6, y0 + 22, { size: 20, w: 700, color: '#1f2937', align: 'left' });
          const typed = Math.floor(n * prog(t, c.typeAt ?? 2.2, (c.typeAt ?? 2.2) + n * 0.17));
          for (let k = 0; k < typed; k++) T(ans[k], x0 + k * s + s / 2, y0 + s * 0.74, { size: s * 0.66, w: 700, fam: KALAM, color: '#1d4ed8' });
          T(c.clueHead ?? `${c.num ?? 7} ACROSS`, 90, 610, { size: 34, w: 800, color: '#6b7280', align: 'left', ls: 4 });
          wrap(c.clue, 900, 54, 700).forEach((ln, i) => T(ln, 90, 680 + i * 62, { size: 54, w: 700, fam: SCRIPT, color: '#1f2937', align: 'left', alpha: prog(t, 0.3, 0.7) }));
          if (typed >= n) tickMark(980, y0 + s * 2.2, 70, prog(t, (c.typeAt ?? 2.2) + n * 0.17, (c.typeAt ?? 2.2) + n * 0.17 + 0.3), '#16a34a');
          ctx.restore();
          hook(c.hook, 400, 92, 0.05, t, { color: P.ink, hl: P.red, shadow: false });
        } else {
          dropStack(t, c.cards, X + 0.2, (E - X - 0.4) / c.cards.length, { cy: 900, h: 600 });
          hook(c.mid, 400, 96, X + 0.1, t, { color: P.ink, hl: P.red, shadow: false });
        }
        brandTop();
      }
      endScene(t, E, c.end, 'cream', { stripKeys: c.strip });
    },
  };
}

// W61 and W94: bingo card, dabbed square by square, then HOUSE! ----------------------------
function bingoFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), X = c.cardsAt ?? 6.4, s = 240, x0 = 180, y0 = 580;
      if (t < E + 0.4) {
        vgrad([[0, '#7c3aed'], [1, '#3b0764']]); photoStrip(t, 1460, 420, { keys: c.strip, alpha: 0.9 });
        if (t < X + 0.3) {
          ctx.save(); ctx.globalAlpha = 1 - prog(t, X, X + 0.3);
          glassCard(130, 470, 820, 870, { fill: '#fff', r: 26 }); T(c.title, 540, 530, { size: 36, w: 800, color: '#7c3aed', ls: 4 });
          c.cells.forEach((txt, i) => { const x = x0 + (i % 3) * s, y = y0 + Math.floor(i / 3) * s; ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = 4; ctx.strokeRect(x, y, s, s); wrap(txt, s - 30, 36, 700).forEach((ln, j, arr) => T(ln, x + s / 2, y + s / 2 + 12 + (j - (arr.length - 1) / 2) * 42, { size: 36, w: 700, color: '#1f2937' })); });
          c.dabs.forEach((idx, j) => { const a = c.dabAt + j * 0.5, k = easeOutBack(prog(t, a, a + 0.25)); if (k <= 0) return; const x = x0 + (idx % 3) * s + s / 2, y = y0 + Math.floor(idx / 3) * s + s / 2; ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = '#ec4899'; ctx.beginPath(); ctx.arc(x, y, 95 * k, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
          const hk = prog(t, c.houseAt, c.houseAt + 0.3); if (hk > 0) noteItem({ type: 'stamp', text: c.house ?? 'HOUSE!', x: 540, y: 1000, rot: -0.12, at: c.houseAt, color: '#16a34a', size: 120 }, t);
          ctx.restore();
          hook(c.hook, 400, 88, 0.05, t, { hl: P.yellow });
        } else { mosaic(t, c.cards, X + 0.2, { y: 560 }); hook(c.mid, 400, 96, X + 0.1, t, { hl: P.yellow }); }
        brandTop();
      }
      endScene(t, E, c.end, 'royal', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}

// W64, W88, W117, W147: then (sepia) and now (colour), a wipe turns one into the other ---------
function thenNowFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), n = c.pairs.length, step = (E - 0.2) / n;
      if (t < E + 0.4) {
        fill('#111');
        const i = Math.min(n - 1, Math.floor(t / step)), a = i * step, [oldK, oldY, newK, newY] = c.pairs[i];
        const w = prog(t, a + step * 0.4, a + step * 0.75), cut = lerp(0, H, easeInOutCubic(w));
        heroPhoto(newK, t, a, a + step, { cy: 900 });
        ctx.save(); ctx.beginPath(); ctx.rect(0, cut, W, H - cut); ctx.clip();
        bgPhoto(IMG[oldK], { filter: 'blur(36px) sepia(0.9) brightness(0.4)' });
        const oh = heroH(oldK); photo(IMG[oldK], 0, 900 - oh / 2, W, oh, { filter: 'sepia(0.9) contrast(1.1) brightness(0.9)', zoom: 1.02, shadow: 'rgba(0,0,0,0.45)' });
        ctx.restore();
        if (w > 0 && w < 1) { ctx.fillStyle = '#fff'; ctx.fillRect(0, cut - 4, W, 8); }
        shade(0.7, 0, 0.32);
        pill(900, 1150, w < 0.5 ? oldY : newY, { size: 48, bg: w < 0.5 ? '#d6b98a' : P.lime, fg: P.ink });
        if (w >= 0.5 && LABEL[newK]) labelPill(newK, 70, 1150, { alpha: prog(t, a + step * 0.75, a + step * 0.85) });
        hook(w < 0.5 ? c.pairs[i][4] : c.pairs[i][5], 400, 96, w < 0.5 ? a + 0.05 : a + step * 0.6, t, { hl: w < 0.5 ? '#f3d38a' : P.lime });
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { accent: '#f3d38a', stripKeys: c.strip });
    },
  };
}

// W68: boarding pass with typed fields and a stamp -----------------------------------------
function boardingFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), X = c.cardsAt ?? 6.0;
      if (t < E + 0.4) {
        vgrad([[0, '#0ea5e9'], [1, '#1e3a8a']]); photoStrip(t, 1460, 420, { keys: c.strip, alpha: 0.9 });
        if (t < X + 0.3) {
          const k = easeOutBack(prog(t, 0.1, 0.5)); ctx.save(); ctx.globalAlpha = 1 - prog(t, X, X + 0.3); ctx.translate(540, 880); ctx.scale(k, k); ctx.rotate(-0.02); ctx.translate(-540, -880);
          glassCard(80, 520, 920, 720, { fill: '#fff', r: 34 }); ctx.fillStyle = P.red; rr(ctx, 80, 520, 920, 110, 34); ctx.fill(); ctx.fillRect(80, 580, 920, 50);
          T('BOARDING PASS', 120, 595, { size: 40, w: 800, color: '#fff', align: 'left', ls: 6 }); logo(750, 548, 210, 1, { align: 'left' }); ctx.setLineDash([14, 10]); ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(760, 640); ctx.lineTo(760, 1230); ctx.stroke(); ctx.setLineDash([]);
          c.fields.forEach(([lab, val, at], j) => { const y = 690 + j * 108, x = 120; T(lab, x, y, { size: 24, w: 800, color: '#64748b', align: 'left', ls: 3 }); const nn = Math.floor(val.length * prog(t, at, at + val.length * 0.04)); T(val.slice(0, nn), x, y + 48, { size: 40, w: 800, fam: HEAD, color: '#0f172a', align: 'left' }); });
          for (let b = 0; b < 26; b++) { ctx.fillStyle = '#0f172a'; ctx.fillRect(800 + b * 7, 700, (b * 37) % 3 + 2, 420); }
          ctx.restore();
          if (c.stamp) noteItem({ type: 'stamp', text: c.stamp, x: 600, y: 1150, rot: -0.14, at: c.stampAt ?? 4.4, color: '#16a34a', size: 64 }, t);
          hook(c.hook, 400, 92, 0.05, t, { hl: P.yellow });
        } else { dropStack(t, c.cards, X + 0.2, (E - X - 0.4) / c.cards.length, { cy: 880, h: 600 }); hook(c.mid, 400, 96, X + 0.1, t, { hl: P.yellow }); }
        brandTop();
      }
      endScene(t, E, c.end, 'royal', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}

// W120: banking app, payday, then a day-out payment ------------------------------------------
function payFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), X = c.cardsAt ?? 3.0;
      if (t < E + 0.4) {
        fill('#f3f4f6'); ctx.fillStyle = '#065f46'; ctx.fillRect(0, 0, W, 600);
        if (t < X + 0.3) {
          ctx.save(); ctx.globalAlpha = 1 - prog(t, X, X + 0.3);
          pill(200, 560, 'PAYDAY', { size: 30, bg: P.lime, fg: P.ink, scale: easeOutBack(prog(t, 0.2, 0.5)) });
          c.rows.forEach(([name, amt, at, hot], i) => { const k = easeOutCubic(prog(t, at, at + 0.3)); if (k <= 0) return; const y = 640 + i * 140; glassCard(60, y, 960, 120, { fill: hot ? '#ecfccb' : '#fff', r: 24, alpha: k }); T(name, 100, y + 74, { size: 38, w: 700, color: '#111827', align: 'left', alpha: k }); T(amt, 980, y + 74, { size: 38, w: 800, color: hot ? '#166534' : '#111827', align: 'right', alpha: k }); });
          ctx.restore();
          hook(c.hook, 400, 80, 0.05, t, { hl: P.lime, shadow: 'rgba(0,0,0,0.3)' });
        } else { mosaic(t, c.cards, X + 0.1, { y: 600 }); hook(c.mid, 430, 96, X + 0.1, t, { color: P.ink, hl: '#166534', shadow: false }); }
        photoStrip(t, 1470, 410, { keys: c.strip, alpha: 0.9 });
        brandTop();
      }
      endScene(t, E, c.end, 'green', { accent: P.lime, stripKeys: c.strip });
    },
  };
}

// W137: February calendar with the 12th circled -------------------------------------------------
function calendarFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), X = c.cardsAt ?? 3.0, cw = 130, x0 = 85, y0 = 700;
      if (t < E + 0.4) {
        fill('#fffdf7'); photoStrip(t, 1460, 420, { keys: c.strip, alpha: 0.9 });
        if (t < X + 0.3) {
          ctx.save(); ctx.globalAlpha = 1 - prog(t, X, X + 0.3);
          ctx.fillStyle = P.red; ctx.fillRect(60, 520, 960, 110); T(c.month, 540, 595, { size: 52, w: 800, fam: HEAD, color: '#fff', ls: 6 });
          ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach((d, i) => T(d, x0 + i * cw + cw / 2, y0 - 20, { size: 30, w: 800, color: '#6b7280' }));
          for (let d = 1; d <= c.days; d++) { const idx = d - 1 + c.firstDow, x = x0 + (idx % 7) * cw, y = y0 + Math.floor(idx / 7) * 120; T(String(d), x + cw / 2, y + 70, { size: 46, w: 700, color: d === c.mark ? P.red : '#1f2937' }); }
          const mi = c.mark - 1 + c.firstDow, mx = x0 + (mi % 7) * cw + cw / 2, my = y0 + Math.floor(mi / 7) * 120 + 55;
          const pth = new Path2D(); pth.ellipse(mx, my, 62, 52, -0.1, -2.2, Math.PI * 2 - 1.9); strokeReveal(pth, prog(t, 0.8, 1.3), { color: P.red, w: 9, len: 800 });
          if (t > 1.3) { const rows = Math.ceil((c.days + c.firstDow) / 7); writeH(c.note, 100, y0 + rows * 120 + 70, t, 1.3, 2.1, { fam: KALAM, size: 60, color: P.red }); }
          ctx.restore();
          hook(c.hook, 400, 92, 0.05, t, { color: P.ink, hl: P.red, shadow: false });
        } else { mosaic(t, c.cards, X + 0.1, { y: 580 }); hook(c.mid, 400, 96, X + 0.1, t, { color: P.ink, hl: P.red, shadow: false }); }
        brandTop();
      }
      endScene(t, E, c.end, 'red', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
