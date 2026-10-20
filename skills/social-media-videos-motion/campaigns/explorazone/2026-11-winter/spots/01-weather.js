// =====================================================================
// Rain and winter-weather series (10): W01 W02 W03 W04 W05 W17 W26 W32 W42 W46
// Winterised versions of the half-term rain series: frost, dark at 4pm, fog, wind, snow, wipers.
// =====================================================================
function mixHex(a, b, k) { const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16)); return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], clamp(k)))).join(',')})`; }
function bareTree(g, x, base, h, seed) {
  const r = rng(seed); g.strokeStyle = 'rgba(18,24,36,0.9)'; g.lineCap = 'round';
  const br = (x1, y1, a, len, w, d) => { if (!d) return; const x2 = x1 + Math.cos(a) * len, y2 = y1 + Math.sin(a) * len; g.lineWidth = w; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); br(x2, y2, a - 0.3 - r() * 0.35, len * 0.74, w * 0.66, d - 1); br(x2, y2, a + 0.3 + r() * 0.35, len * 0.74, w * 0.66, d - 1); };
  br(x, base, -Math.PI / 2, h * 0.34, 24, 7);
}
function houseRow(g, y, lit, seed, o = {}) {
  const r = rng(seed); let x = -40;
  while (x < W + 40) {
    const w = 160 + r() * 120, h = 220 + r() * 140; g.fillStyle = o.fill ?? '#141b2b'; g.fillRect(x, y - h, w, H); g.beginPath(); g.moveTo(x - 10, y - h); g.lineTo(x + w / 2, y - h - 90 - r() * 40); g.lineTo(x + w + 10, y - h); g.fill();
    for (let i = 0; i < 4; i++) { const wx = x + 26 + (i % 2) * (w - 92), wy = y - h + 40 + Math.floor(i / 2) * 110, on = lit(r()); g.fillStyle = on ? 'rgba(255,207,110,0.95)' : 'rgba(60,70,90,0.9)'; g.fillRect(wx, wy, 40, 56); }
    x += w + 20 + r() * 30;
  }
}
function makeTraffic() {
  const c = makeCanvas(W, H), g = c.getContext('2d'), r = rng(19);
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0e1830'); gr.addColorStop(0.6, '#24324f'); gr.addColorStop(1, '#151a24'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  houseRow(g, 1250, (v) => v < 0.55, 33, { fill: '#0b101c' });
  [[160, 640], [560, 600], [960, 660]].forEach(([x, y]) => { const lg = g.createRadialGradient(x, y, 0, x, y, 260); lg.addColorStop(0, 'rgba(255,196,120,0.5)'); lg.addColorStop(1, 'rgba(255,196,120,0)'); g.fillStyle = lg; g.fillRect(x - 260, y - 260, 520, 520); });
  g.fillStyle = '#161b24'; g.fillRect(0, 1250, W, H - 1250);
  for (let row = 0; row < 7; row++) {
    const y = 1290 + row * 95, sc = 0.45 + row * 0.12;
    for (let k = 0; k < 4; k++) {
      const x = 90 + k * 270 + (row % 2) * 60 + r() * 30, gap = 120 * sc;
      [x, x + gap].forEach((lx) => { const rg = g.createRadialGradient(lx, y, 0, lx, y, 70 * sc); rg.addColorStop(0, 'rgba(255,60,50,0.95)'); rg.addColorStop(0.3, 'rgba(255,40,40,0.55)'); rg.addColorStop(1, 'rgba(255,40,40,0)'); g.fillStyle = rg; g.fillRect(lx - 70 * sc, y - 70 * sc, 140 * sc, 140 * sc); });
    }
  }
  return c;
}
function makeMist(seed) {
  const c = makeCanvas(W, H), g = c.getContext('2d'), r = rng(seed);
  g.fillStyle = 'rgba(190,200,210,0.5)'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 2600; i++) { const x = r() * W, y = r() * H, rad = 1.5 + r() * r() * 9; g.fillStyle = 'rgba(40,50,60,0.18)'; g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.arc(x - rad * 0.3, y - rad * 0.3, rad * 0.4, 0, Math.PI * 2); g.fill(); }
  g.strokeStyle = 'rgba(120,135,150,0.25)'; g.lineCap = 'round'; for (let i = 0; i < 22; i++) { const x = r() * W, y = r() * H * 0.7, l = 80 + r() * 260; g.lineWidth = 3 + r() * 5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 10, y + l); g.stroke(); }
  return c;
}
function makeOutside(kind) {
  if (kind === 'traffic') return makeTraffic();
  const dark = kind === 'dark';
  const c = makeCanvas(W, H), g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, dark ? '#1b2a4a' : '#aab6c4'); gr.addColorStop(0.7, dark ? '#2b3a58' : '#6d7a8a'); gr.addColorStop(1, '#2a3340'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  if (dark) { const lg = g.createRadialGradient(820, 1050, 0, 820, 1050, 380); lg.addColorStop(0, 'rgba(255,190,110,0.55)'); lg.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = lg; g.fillRect(0, 0, W, H); }
  [[150, 1500, 900, 4], [470, 1560, 700, 5], [900, 1520, 1000, 6]].forEach(([x, b, h, s]) => bareTree(g, x, b, h, s));
  houseRow(g, 1700, (v) => dark && v < 0.5, 12);
  g.fillStyle = '#39424d'; g.fillRect(0, 1700, W, H - 1700);
  return c;
}
function makeFrost(seed) {
  const c = makeCanvas(W, H), g = c.getContext('2d'), r = rng(seed);
  const rg = g.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 1100); rg.addColorStop(0, 'rgba(225,238,248,0.35)'); rg.addColorStop(1, 'rgba(235,245,252,0.85)'); g.fillStyle = rg; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineCap = 'round';
  const br = (x, y, a, len, d) => { if (d <= 0 || len < 5) return; const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len; g.lineWidth = d * 0.75; g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke(); br(x2, y2, a + (r() - 0.5) * 0.4, len * 0.8, d - 1); if (r() < 0.55) br(x2, y2, a + 1 + r() * 0.3, len * 0.45, d - 1); if (r() < 0.55) br(x2, y2, a - 1 - r() * 0.3, len * 0.45, d - 1); };
  for (let i = 0; i < 80; i++) { const s = i % 4; const x = s < 2 ? r() * W : (s === 2 ? 0 : W), y = s < 2 ? (s ? H : 0) : r() * H, a = [Math.PI / 2, -Math.PI / 2, 0, Math.PI][s]; br(x, y, a + (r() - 0.5) * 0.9, 70 + r() * 90, 6); }
  for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(255,255,255,${0.1 + r() * 0.35})`; g.fillRect(r() * W, r() * H, 1 + r() * 2.5, 1 + r() * 2.5); }
  return c;
}

// W01 Frosty window and W46 Ice scraper ------------------------------------
function frostFmt(c) {
  let out = null, fr = null, fc = null;
  return {
    setup() { out = makeOutside(c.scene ?? (c.dark ? 'dark' : 'grey')); fr = c.texture === 'mist' ? makeMist(c.seed ?? 3) : makeFrost(c.seed ?? 3); fc = makeCanvas(W, H); },
    frame(t) {
      const E = endAt(c.dur), A = c.wipeAt ?? 3.9, B = A + 1.6;
      if (t < E + 0.4) {
        if (t < A) {
          ctx.drawImage(out, 0, 0); ctx.save(); ctx.globalAlpha = 0.2 + 0.8 * easeOutCubic(prog(t, 0, 1.3)); ctx.drawImage(fr, 0, 0); ctx.restore();
          shade(0.85, 0.0, 0.5);
          const ta = easeOutCubic(prog(t, 0.3, 0.8)) * (1 - prog(t, A - 0.3, A));
          if (c.temp) T(c.temp, 540, 900, { size: 210, w: 800, fam: HEAD, color: '#fff', alpha: ta, shadow: 'rgba(20,40,70,0.5)' });
          if (c.sub) T(c.sub, 540, 1000, { size: 56, w: 700, color: '#e5ecf3', alpha: ta, shadow: 'rgba(20,40,70,0.6)' });
          if (c.badge) pill(540, 900, c.badge, { size: 54, bg: '#ef4444', fg: '#fff', alpha: ta, scale: easeOutBack(prog(t, 0.4, 0.8)) });
          if (t < 2.1) hook(c.hook, 430, 104, 0.1, t, { hl: P.teal, alpha: 1 - prog(t, 1.85, 2.1) });
          else hook(c.hook2, 430, 104, 2.1, t, { hl: P.teal });
        } else if (t < B + 0.2) {
          heroPhoto(c.reveal, t, A, B + 3);
          const g = fc.getContext('2d'); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H); g.drawImage(out, 0, 0); g.drawImage(fr, 0, 0);
          g.globalCompositeOperation = 'destination-out'; g.strokeStyle = '#000'; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath();
          const p = easeInOutSine(prog(t, A, B - 0.45));
          if (c.scrape) { g.lineWidth = 210; const N = 7, M = N * 24; for (let i = 0; i <= M * p; i++) { const u = i / M, row = Math.min(N - 1, Math.floor(u * N)), f = u * N - row; const x = row % 2 ? 990 - 900 * f : 90 + 900 * f; i ? g.lineTo(x, 330 + row * 200 + f * 30) : g.moveTo(x, 330); } }
          else { g.lineWidth = 300; const N = 60; for (let i = 0; i <= N * p; i++) { const u = i / N; const x = 540 + 360 * Math.sin(u * Math.PI * 3.4), y = 1450 - 1100 * u; i ? g.lineTo(x, y) : g.moveTo(x, y); } }
          g.stroke(); const cr = easeInCubic(prog(t, B - 0.5, B)) * 1700; if (cr > 0) { g.beginPath(); g.arc(540, 900, cr, 0, Math.PI * 2); g.fill(); }
          g.globalCompositeOperation = 'source-over'; ctx.drawImage(fc, 0, 0);
          ctx.save(); ctx.globalAlpha = prog(t, A + 0.6, A + 1.0); shade(0.75, 0, 0.4); ctx.restore();
          if (t > A + 0.6) hook(c.mid, 430, 104, A + 0.7, t, { hl: P.lime });
        } else {
          if (c.beat === 'stack') { bgPhoto(IMG[c.reveal]); dropStack(t, c.cards, B + 0.2, (E - B - 0.3) / c.cards.length, { cy: 900 }); }
          else cardSeq(t, c.cards.map((k, i) => { const s = (E - B) / c.cards.length; return { k, a: B + 0.2 + i * s, b: B + 0.2 + (i + 1) * s }; }), 600, 980, 640);
          hook(c.mid, 430, 104, A + 0.7, t, { hl: P.lime });
        }
        brandTop();
      }
      endScene(t, E, c.end, c.endKind ?? 'snow', { accent: P.teal, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W01', title: 'Grey again', slug: 'grey-again', dur: 12, run: 'nov', series: 'Rain and winter weather', music: 504, ring: true,
  persona: 'Parents 25 to 44, grey weekends', angle: 'Grey outside, glowing inside: wipe the misty window and see Explorazone', style: 'Condensation on a window over a grey street; a hand wipes it clear to reveal the laser room',
  hook: '"Grey. Again." over a misty window, 8°C and overcast',
  meta: { headline: 'Grey outside? Glowing inside', primary: primary('Grey. Again. The park is soggy and the children are already climbing the walls.', 'Wipe the window: the laser room, the infinity floor, heat vision and the sky maze, all indoors in Bowthorpe, Norwich.') } },
  frostFmt, { texture: 'mist', scene: 'grey', temp: '8°C', sub: 'Overcast', hook: ['Grey.', '_Again._'], hook2: ['Park?', '_Soggy._'], mid: ['Grey out.', '_Glowing in._'], reveal: 'laser_room', cards: ['infinity_floor', 'heat', 'sky_maze2'], end: ['Grey outside?', '_Glowing inside._'], endKind: 'navy', strip: ['laser_room', 'infinity_floor', 'heat', 'sky_maze2', 'dodeca', 'roses'] });
spot({ id: 'W46', title: 'Skip the city centre', slug: 'skip-the-city-centre', dur: 12, run: 'jan', series: 'Rain and winter weather', music: 532, ring: true,
  persona: 'Parents 25 to 44, January weekends', angle: 'January-sales traffic in the city centre; Explorazone is outside the ring road', style: 'Misty windscreen in a dark traffic jam full of tail lights, wiped clear to reveal the infinity floor',
  hook: '"City centre? Gridlocked." in a traffic jam',
  meta: { headline: 'Skip the city-centre traffic', primary: primary('City centre? Gridlocked. January-sales crowds? No thanks.', 'Head the other way: the infinity floor, the space-time tunnel, the light forest and the plasma ball, all indoors in Bowthorpe, Norwich.') } },
  frostFmt, { scene: 'traffic', texture: 'mist', scrape: true, seed: 8, badge: 'HEAVY TRAFFIC', hook: ['City centre?', '_Gridlocked._'], hook2: ['January sales?', '_No thanks._'], mid: ['Outside the', '_ring road._'], reveal: 'infinity_floor', cards: ['tunnel', 'light_pillars', 'plasma'], beat: 'stack', end: ['Skip the', '_city centre._'], endKind: 'navy', strip: ['infinity_floor', 'tunnel', 'light_pillars', 'plasma', 'laser_room', 'heat'] });

// W02 Dark by 4pm ---------------------------------------------------------
function duskFmt(c) {
  const ST = (() => { const r = rng(9); return Array.from({ length: 110 }, () => ({ x: r() * W, y: r() * 1100, r: 1 + r() * 2.4, tw: r() * 6 })); })();
  let street = null;
  return {
    setup() { street = makeCanvas(W, H); const g = street.getContext('2d'); houseRow(g, 1920, () => false, 21, { fill: '#0b101c' }); },
    frame(t) {
      const E = endAt(c.dur), A = 4.3, k = easeInOutSine(prog(t, 0.2, 2.6));
      if (t < E + 0.4) {
        if (t < A) {
          vgrad([[0, mixHex('#f28b4a', '#081027', k)], [0.55, mixHex('#f6c27a', '#162447', k)], [1, mixHex('#c76a4a', '#1d2b4f', k)]]);
          ctx.save(); ctx.globalAlpha = 1 - k; const sy = lerp(980, 1380, k); const sg = ctx.createRadialGradient(540, sy, 0, 540, sy, 300); sg.addColorStop(0, 'rgba(255,230,160,1)'); sg.addColorStop(0.3, 'rgba(255,170,90,0.7)'); sg.addColorStop(1, 'rgba(255,140,80,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H); ctx.restore();
          ST.forEach((s) => { ctx.save(); ctx.globalAlpha = prog(t, 1.4, 2.6) * (0.5 + 0.5 * Math.sin(t * 3 + s.tw)); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
          ctx.drawImage(street, 0, -380);
          const mins = 52 + Math.floor(prog(t, 0.2, 2.6) * 9); const hh = mins >= 60 ? '16' : '15', mm = String(mins % 60).padStart(2, '0');
          T(`${hh}:${mm}`, 540, 880, { size: 230, w: 800, fam: HEAD, color: '#fff', shadow: 'rgba(0,0,0,0.4)', alpha: prog(t, 0.1, 0.4) });
          if (t < 2.3) hook(c.hook, 430, 110, 0.1, t, { hl: P.yellow, alpha: 1 - prog(t, 2.05, 2.3) });
          else hook(c.hook2, 430, 100, 2.3, t, { hl: P.yellow });
        } else {
          vgrad([[0, '#081027'], [1, '#1d2b4f']]); photoStrip(t, 1395, 470, { keys: c.strip, alpha: prog(t, A, A + 0.5) });
          c.cards.forEach((key, i) => {
            const s = (E - A - 0.2) / c.cards.length, a = A + 0.1 + i * s, b = a + s; if (t < a - 0.05 || t > b + 0.3) return;
            const on = easeOutCubic(prog(t, a + 0.35, a + 0.6)), out2 = prog(t, b, b + 0.3);
            const x = 80 - out2 * 1100, y = 600;
            ctx.save(); ctx.globalAlpha = 1 - out2; photo(IMG[key], x, y, 920, 640, { radius: 40, border: 7, borderColor: '#fff', shadow: 'rgba(0,0,0,0.5)', filter: `brightness(${lerp(0.12, 1, on)}) saturate(${lerp(0.3, 1.25, on)})`, zoom: 1.04 + 0.05 * prog(t, a, b) }); ctx.restore();
            if (on > 0.5) labelPill(key, x + 40, y + 640 - 60, { alpha: (on - 0.5) * 2 * (1 - out2) });
            const sw = prog(t, a + 0.15, a + 0.4); if (sw > 0 && sw < 1) pill(540, 1300, 'click', { size: 34, bg: P.yellow, fg: P.ink, alpha: 1 - sw, scale: 0.8 + 0.3 * sw });
          });
          hook(c.mid, 430, 104, A + 0.1, t, { hl: P.yellow });
        }
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W02', title: 'Dark by 4pm', slug: 'dark-by-4pm', dur: 12, run: 'nov', series: 'Rain and winter weather', music: 988, ring: true,
  persona: 'Parents 25 to 44, after the clocks go back', angle: 'Dark by four outside, lights on all day inside', style: 'Sunset time-lapse to night with a ticking clock, then rooms switch on one by one',
  hook: 'Clock ticks to 16:00 as the sky goes black: "4pm. Pitch black."',
  meta: { headline: 'Dark by 4pm? Lights on inside', primary: primary('4pm and it is pitch black already. The clocks went back and so did the fun.', 'Inside Explorazone the lights stay on: the space-time tunnel, the light forest and the garden of light, in Bowthorpe, Norwich.') } },
  duskFmt, { hook: ['4pm.', '_Pitch black._'], hook2: ['Clocks went back.', 'So did _the fun._'], mid: ['Lights on.', '_All day._'], cards: ['tunnel', 'light_pillars', 'roses'], end: ['Dark out?', '_Bright in here._'], strip: ['tunnel', 'light_pillars', 'roses', 'dodeca', 'infinity_floor', 'laser_room'] });

// W03 Wet weekend forecast ---------------------------------------------------
function forecastFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), S = c.swipe ?? 2.3, sw = easeInOutCubic(prog(t, S, S + 0.4));
      if (t < E + 0.4) {
        if (sw < 1) {
          ctx.save(); ctx.translate(-sw * W, 0);
          vgrad([[0, '#5d6f84'], [1, '#232d3b']]); rainScene(ctx, t, { drops: false, alpha: 0.55 }); ctx.save(); ctx.globalAlpha = 0.35; fill('#26313f'); ctx.restore();
          T('NORWICH · THIS WEEKEND', 540, 340, { size: 32, w: 700, color: '#fff', ls: 6, alpha: 0.9 });
          hook(c.hook, 470, 100, 0.1, t, { hl: '#9cc9ff' });
          c.days.forEach(([d, w1, w2], i) => {
            const k = easeOutBack(prog(t, 0.5 + i * 0.25, 0.9 + i * 0.25)); if (k <= 0) return; const y = 640 + i * 300;
            ctx.save(); ctx.translate(540, y + 130); ctx.scale(k, k); ctx.fillStyle = 'rgba(255,255,255,0.12)'; rr(ctx, -470, -130, 940, 260, 36); ctx.fill(); ctx.restore();
            T(d, 140, y + 110, { size: 64, w: 800, fam: HEAD, color: '#fff', align: 'left', alpha: k });
            T(w1, 140, y + 180, { size: 38, w: 600, color: '#cfe0f2', align: 'left', alpha: k });
            cloudIcon(780, y + 100, 150 - i * 0, k); if (i) cloudIcon(860, y + 160, 90, k * 0.9);
            T(w2, 960, y + 230, { size: 32, w: 700, color: '#9cc9ff', align: 'right', alpha: k });
          });
          ctx.restore();
        }
        if (sw > 0) {
          ctx.save(); ctx.translate((1 - sw) * W, 0);
          bgPhoto(IMG[c.good[0][1]], { filter: 'blur(30px) brightness(0.5) saturate(1.4)' }); vgrad([[0, 'rgba(26,52,191,0.55)'], [1, 'rgba(0,221,180,0.35)']]);
          T('EXPLORAZONE · THIS WEEKEND', 540, 340, { size: 32, w: 700, color: '#fff', ls: 6 });
          hook(c.hook2, 470, 100, S + 0.3, t, { hl: P.lime });
          c.good.forEach(([d, key, line], i) => {
            const k = easeOutBack(prog(t, S + 0.5 + i * 0.25, S + 0.9 + i * 0.25)); if (k <= 0) return; const y = 640 + i * 300;
            ctx.save(); ctx.translate(540, y + 130); ctx.scale(k, k); ctx.fillStyle = 'rgba(255,255,255,0.16)'; rr(ctx, -470, -130, 940, 260, 36); ctx.fill(); ctx.restore();
            photo(IMG[key], 560, y + 20, 400, 220, { radius: 24, alpha: k, border: 4, borderColor: '#fff' });
            T(d, 140, y + 110, { size: 64, w: 800, fam: HEAD, color: '#fff', align: 'left', alpha: k });
            T(line, 140, y + 180, { size: 36, w: 700, color: P.lime, align: 'left', alpha: k });
          });
          ctx.restore();
        }
        brandTop();
      }
      endScene(t, E, c.end, 'rain', { accent: P.lime, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W03', title: 'Wet weekend forecast', slug: 'wet-weekend', dur: 8, run: 'nov', series: 'Rain and winter weather', music: 480,
  persona: 'Parents 25 to 44 planning the weekend', angle: 'The weekend forecast is wet, the Explorazone forecast is glowing', style: 'Weather-app weekend forecast that swipes to an Explorazone forecast with photos',
  hook: '"Weekend forecast: wet." with Saturday and Sunday rain cards',
  meta: { headline: 'Wet weekend? Sorted.', primary: primary('Weekend forecast: wet. Then wetter.', 'The Explorazone forecast: bright spells in the garden of light and clear skies in the sky maze, all indoors in Bowthorpe, Norwich.') } },
  forecastFmt, { hook: ['Weekend forecast:', '_wet._'], hook2: ['Our forecast:', '_glowing._'], days: [['SAT', 'Rain', 'Wet'], ['SUN', 'More rain', 'Wetter']], good: [['SAT', 'found_room', 'Bright spells'], ['SUN', 'sky_maze2', 'Clear skies']], end: ['Wet weekend?', '_Sorted._'], strip: ['found_room', 'sky_maze2', 'laser_room', 'heat', 'infinity_floor', 'dodeca'] });

// W04 Windscreen wipers -------------------------------------------------------
function wipersFmt(c) {
  let rc = null;
  return {
    setup() { rc = makeCanvas(W, H); },
    frame(t) {
      const E = endAt(c.dur), px = 540, py = 1560, L = 1250;
      if (t < E + 0.4) {
        const cur = c.wipes.findIndex(([a], i) => t >= a && (i === c.wipes.length - 1 || t < c.wipes[i + 1][0]));
        if (cur >= 0) heroPhoto(c.wipes[cur][1], t, c.wipes[cur][0], c.wipes[cur][0] + 2); else fill('#1a2230');
        const g = rc.getContext('2d'); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H); rainScene(g, t);
        let ang = Math.PI;
        if (cur >= 0) {
          const a = c.wipes[cur][0], u = prog(t, a, a + 0.55); ang = Math.PI * (1 - easeInOutSine(u));
          const back = prog(t, a + 0.75, a + 1.2); if (back > 0) ang = Math.PI * easeInOutSine(back);
          const clear = 1 - prog(t, a + 1.25, a + 1.6) * 0;
          g.globalCompositeOperation = 'destination-out'; g.globalAlpha = clear; g.beginPath(); g.moveTo(px, py); g.arc(px, py, L, -Math.PI, -Math.PI * (1 - easeInOutSine(u)) * 1 + 0); g.closePath(); g.fill(); g.globalAlpha = 1;
          g.globalCompositeOperation = 'source-over';
          const regrow = prog(t, a + 1.3, (c.wipes[cur + 1] || [E])[0]); if (regrow > 0) { g.save(); g.globalAlpha = regrow * 0.8; rainScene(g, t); g.restore(); }
        }
        ctx.drawImage(rc, 0, 0);
        ctx.save(); ctx.strokeStyle = '#0c0f15'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(ang) * L, py - Math.sin(ang) * L); ctx.stroke();
        ctx.lineWidth = 10; ctx.strokeStyle = '#2b2f38'; ctx.beginPath(); ctx.moveTo(px + Math.cos(ang) * 300, py - Math.sin(ang) * 300); ctx.lineTo(px + Math.cos(ang) * L, py - Math.sin(ang) * L); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.fillStyle = '#0b0e14'; ctx.beginPath(); ctx.moveTo(0, 1500); ctx.quadraticCurveTo(540, 1420, W, 1500); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
        ctx.strokeStyle = '#1d222c'; ctx.lineWidth = 46; ctx.beginPath(); ctx.arc(300, 1900, 300, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.fillStyle = '#0b0e14'; ctx.fillRect(0, 0, W, 120); ctx.restore();
        if (cur >= 0 && t > c.wipes[cur][0] + 0.45) labelPill(c.wipes[cur][1], 90, 1180, { alpha: prog(t, c.wipes[cur][0] + 0.45, c.wipes[cur][0] + 0.7) * (1 - prog(t, c.wipes[cur][0] + 1.3, c.wipes[cur][0] + 1.5)) });
        const first = c.wipes[0][0];
        if (t < first) hook(c.hook, 430, 100, 0.1, t, { hl: P.yellow });
        else hook(c.mid, 430, 100, first + 0.1, t, { hl: P.yellow });
        brandTop();
      }
      endScene(t, E, c.end, 'rain', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W04', title: 'Windscreen wipers', slug: 'windscreen-wipers', dur: 12, run: 'nov', series: 'Rain and winter weather', music: 7,
  persona: 'Grandparents 55+ with grandchildren for the day', angle: 'Every swipe of the wipers shows another room the grandchildren will love', style: 'Rainy windscreen from the driver’s seat; each wiper pass reveals an attraction',
  hook: '"Wipers on full. Grandkids in the back."',
  meta: { headline: 'Grandkids for the day?', primary: primary('Wipers on full. Grandkids in the back. Where to?', 'Robot waiters, heat vision and the sky maze, all indoors in Bowthorpe, Norwich. Park, pop in, stay dry.') } },
  wipersFmt, { hook: ['Wipers on full.', '_Grandkids_ in the back.'], mid: ['Where to?', '_Somewhere dry._'], wipes: [[3.0, 'robot2'], [4.8, 'heat'], [6.6, 'sky_maze2']], end: ['Grandkids for', '_the day? Sorted._'], strip: ['robot2', 'heat', 'sky_maze2', 'plasma', 'laser_room', 'roses'] });

// W05 Foggy Saturday ---------------------------------------------------------
function fogFmt(c) {
  const BL = (() => { const r = rng(44); return Array.from({ length: 26 }, () => ({ x: r() * W, y: 200 + r() * 1500, r: 260 + r() * 360, v: 15 + r() * 40, a: 0.35 + r() * 0.35 })); })();
  return {
    frame(t) {
      const E = endAt(c.dur), C = c.clear ?? [2.6, 6.2];
      if (t < E + 0.4) {
        const fog = 1 - easeInOutSine(prog(t, C[0], C[1]));
        if (t < C[1] + 0.6) {
          heroPhoto(c.reveal, t, 0, C[1] + 1, { filter: `grayscale(${fog}) brightness(${lerp(1, 0.75, fog)})` });
          ctx.save(); ctx.globalAlpha = fog * 0.75; fill('#c9cfd4'); ctx.restore();
          BL.forEach((b) => { const x = ((b.x + b.v * t) % (W + 600)) - 300; const g = ctx.createRadialGradient(x, b.y, 0, x, b.y, b.r); g.addColorStop(0, `rgba(228,232,236,${b.a * fog})`); g.addColorStop(1, 'rgba(228,232,236,0)'); ctx.fillStyle = g; ctx.fillRect(x - b.r, b.y - b.r, b.r * 2, b.r * 2); });
          const sk = easeOutBack(prog(t, 0.2, 0.6)) * (1 - prog(t, C[0] + 0.5, C[0] + 1));
          if (sk > 0) { ctx.save(); ctx.translate(540, 820); ctx.scale(sk, sk); ctx.fillStyle = P.yellow; rr(ctx, -380, -110, 760, 220, 22); ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = P.ink; rr(ctx, -360, -90, 720, 180, 14); ctx.stroke(); T('VISIBILITY', 0, -16, { size: 50, w: 800, color: P.ink, ls: 6 }); T('50 METRES', 0, 56, { size: 66, w: 800, fam: HEAD, color: P.ink }); ctx.restore(); }
          if (t < 2.4) hook(c.hook, 430, 100, 0.1, t, { color: P.ink, hl: P.red, shadow: 'rgba(255,255,255,0.6)', alpha: 1 - prog(t, 2.2, 2.4) });
          else if (t < C[0] + 1.6) hook(c.hook2, 430, 100, 2.4, t, { color: P.ink, hl: P.red, shadow: 'rgba(255,255,255,0.6)', alpha: 1 - prog(t, C[0] + 1.4, C[0] + 1.6) });
          else { ctx.save(); ctx.globalAlpha = prog(t, C[0] + 1.5, C[0] + 1.9); shade(0.7, 0, 0.4); ctx.restore(); hook(c.mid, 430, 104, C[0] + 1.7, t, { hl: P.lime }); }
        } else {
          bgPhoto(IMG[c.cards[0]]); dropStack(t, c.cards, C[1] + 0.6, (E - C[1] - 0.8) / c.cards.length, { cy: 920 });
          hook(c.mid2, 430, 100, C[1] + 0.6, t, { hl: P.lime });
        }
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { stripKeys: c.strip });
    },
  };
}
spot({ id: 'W05', title: 'Foggy Saturday', slug: 'foggy-saturday', dur: 15, run: 'nov', series: 'Rain and winter weather', music: 1073,
  persona: 'Three generations, foggy November weekends', angle: 'Fog cancels the walk; the plan that is clear is Explorazone', style: 'A grey fog bank with a road sign lifts slowly to reveal the garden of light in full colour',
  hook: 'Yellow road sign: "Visibility: 50 metres"',
  meta: { headline: 'Foggy out. Clear plan.', primary: primary('Visibility: 50 metres. The walk with Nan is off.', 'The fog lifts in here: the garden of light, the infinity floor and the science lab, all indoors in Bowthorpe, Norwich, for all three generations.') } },
  fogFmt, { hook: ['Visibility:', '_50 metres._'], hook2: ['The walk', 'with Nan? _Off._'], mid: ['The fog lifts', '_in here._'], mid2: ['Nan, Mum and me:', '_one clear plan._'], reveal: 'roses', cards: ['found_room', 'infinity_floor', 'lab3'], end: ['Foggy out.', '_Clear plan._'], strip: ['roses', 'found_room', 'infinity_floor', 'lab3', 'dodeca', 'heat'] });

// W17 Storm warning ------------------------------------------------------------
function stormFmt(c) {
  const LV = (() => { const r = rng(63); return Array.from({ length: 40 }, () => ({ y: 200 + r() * 1500, v: 700 + r() * 700, ph: r() * 3000, s: 14 + r() * 18, rot: r() * 6, c: ['#a35a2a', '#c98a3a', '#7d4a22', '#d3a04a'][Math.floor(r() * 4)] })); })();
  const ST = (() => { const r = rng(64); return Array.from({ length: 70 }, () => ({ y: r() * H, ph: r() * 2000, v: 1800 + r() * 1200, len: 120 + r() * 200 })); })();
  return {
    frame(t) {
      const E = endAt(c.dur), A = c.calm ?? 4.6;
      if (t < E + 0.4) {
        if (t < A) {
          vgrad([[0, '#2a3242'], [1, '#121722']]);
          for (let i = 0; i < 9; i++) { const x = ((i * 260 + t * 260) % (W + 700)) - 350, y = 300 + (i % 3) * 260; const g = ctx.createRadialGradient(x, y, 0, x, y, 420); g.addColorStop(0, 'rgba(90,100,118,0.55)'); g.addColorStop(1, 'rgba(90,100,118,0)'); ctx.fillStyle = g; ctx.fillRect(x - 420, y - 420, 840, 840); }
          ctx.save(); ctx.strokeStyle = 'rgba(210,220,235,0.18)'; ctx.lineWidth = 3; ST.forEach((s) => { const x = ((s.ph + s.v * t) % (W + 600)) - 300; ctx.beginPath(); ctx.moveTo(x, s.y); ctx.lineTo(x - s.len, s.y + s.len * 0.12); ctx.stroke(); }); ctx.restore();
          LV.forEach((l) => { const x = ((l.ph + l.v * t) % (W + 200)) - 100, y = l.y + Math.sin(t * 4 + l.ph) * 40; ctx.save(); ctx.translate(x, y); ctx.rotate(l.rot + t * 6); ctx.fillStyle = l.c; ctx.beginPath(); ctx.ellipse(0, 0, l.s, l.s * 0.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
          const ak = easeOutCubic(prog(t, 0.15, 0.5));
          ctx.save(); ctx.translate(0, (1 - ak) * -300); ctx.globalAlpha = ak; ctx.fillStyle = 'rgba(255,255,255,0.94)'; rr(ctx, 60, 600, 960, 300, 40); ctx.fill();
          ctx.fillStyle = P.yellow; ctx.beginPath(); ctx.moveTo(190, 660); ctx.lineTo(270, 800); ctx.lineTo(110, 800); ctx.closePath(); ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = 6; ctx.stroke(); T('!', 190, 785, { size: 90, w: 800, color: P.ink });
          T(c.alert[0], 320, 720, { size: 50, w: 800, color: P.ink, align: 'left' }); T(c.alert[1], 320, 790, { size: 40, w: 600, color: '#4a5568', align: 'left' }); T('WEATHER ALERT · NOW', 320, 860, { size: 26, w: 700, color: '#8a94a6', align: 'left', ls: 3 }); ctx.restore();
          if (t < 2.3) hook(c.hook, 430, 100, 0.2, t, { hl: P.yellow, alpha: 1 - prog(t, 2.1, 2.3) });
          else hook(c.hook2, 430, 100, 2.3, t, { hl: P.yellow });
          ctx.save(); ctx.globalAlpha = prog(t, A - 0.25, A); fill('#fff'); ctx.restore();
        } else {
          bgPhoto(IMG[c.cards[0]], { filter: 'blur(34px) brightness(0.5) saturate(1.3)' });
          mosaic(t, c.cards, A + 0.3, { y: 600 });
          hook(c.mid, 430, 100, A + 0.1, t, { hl: P.lime });
          ctx.save(); ctx.globalAlpha = 1 - prog(t, A, A + 0.3); fill('#fff'); ctx.restore();
        }
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { stripKeys: c.strip });
    },
  };
}
spot({ id: 'W17', title: 'Storm warning', slug: 'storm-warning', dur: 12, run: 'nov', series: 'Rain and winter weather', music: 175,
  persona: 'Parents 25 to 44, stormy November weekends', angle: 'A wind warning cancels the park; inside it is calm, dry and lit up', style: 'Storm sky with blowing leaves and a phone weather alert, then a calm 2x2 photo grid',
  hook: 'Weather alert drops in: "Warning: wind"',
  meta: { headline: 'Windy out. Calm in here.', primary: primary('Weather warning: wind. Gusts all weekend and the park is off.', 'Inside Explorazone it is calm, dry and lit up: the space zone, infinity lights, the laser jungle and the light-up floor, in Bowthorpe, Norwich.') } },
  stormFmt, { alert: ['Warning: wind', 'Gusts all weekend'], hook: ['Weather', '_warning._'], hook2: ['Park?', '_Blown away._'], mid: ['In here:', '_calm, dry, lit up._'], cards: ['astro', 'dodeca', 'jungle2', 'floor2'], end: ['Windy out.', '_Calm in here._'], strip: ['astro', 'dodeca', 'jungle2', 'floor2', 'laser_room', 'heat'] });

// W26 Snow day plan ---------------------------------------------------------------
function snowPlanFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), A = c.photosAt ?? 5.4;
      if (t < E + 0.4) {
        if (t < A) {
          if (c.grey) rainScene(ctx, t, { alpha: 0.9 }); else { vgrad([[0, '#0f1d3d'], [1, '#2a4170']]); snow(t, { n: 170, scale: 1.2 }); }
          ctx.save(); ctx.fillStyle = '#f4efe6'; ctx.fillRect(0, 0, W, 90); ctx.fillRect(0, H - 120, W, 120); ctx.fillRect(0, 0, 60, H); ctx.fillRect(W - 60, 0, 60, H); ctx.fillRect(520, 0, 40, H); ctx.fillRect(0, 1240, W, 36); ctx.restore();
          hook(c.hook, 430, 104, 0.1, t, { hl: '#9cd8ff' });
          const pk = easeOutBack(prog(t, 0.9, 1.3)); ctx.save(); ctx.translate(540, 900); ctx.scale(pk, pk); ctx.rotate(-0.02); ctx.fillStyle = '#fffdf4'; ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 30; rr(ctx, -420, -260, 840, 520, 20); ctx.fill(); ctx.restore();
          if (pk > 0.9) c.list.forEach(([txt, mark], i) => {
            const a = 1.3 + i * 0.75, y = 720 + i * 120;
            writeH(txt, 200, y, t, a, a + 0.5, { fam: KALAM, size: 54, color: '#253a8f' });
            const box = 150; ctx.save(); ctx.strokeStyle = '#253a8f'; ctx.lineWidth = 4; ctx.strokeRect(box - 26, y - 44, 44, 44); ctx.restore();
            if (mark === 'x') { const p = prog(t, a + 0.5, a + 0.7); strokeReveal(new Path2D(`M${box - 22} ${y - 40} L${box + 14} ${y - 4} M${box + 14} ${y - 40} L${box - 22} ${y - 4}`), p, { color: '#e0362c', w: 7, len: 120 }); }
            if (mark === 'v') tickMark(box - 4, y - 22, 52, prog(t, a + 0.5, a + 0.75), '#1f9d55');
          });
        } else {
          heroPhoto(c.cards[0], t, A, E, {}); if (!c.grey) snow(t, { n: 80, alpha: 0.7 });
          c.cards.slice(1).forEach((k, i) => { const a = A + 0.7 + i * 0.9; if (t > a) { const p = easeOutBack(prog(t, a, a + 0.4)); polaroidAt(IMG[k], 300 + i * 480, 960 + i * 30, 400, (i ? 0.06 : -0.05), LABEL[k] && LABEL[k].toLowerCase(), p, { fam: KALAM }); } });
          ctx.save(); ctx.globalAlpha = prog(t, A, A + 0.3); shade(0.7, 0, 0.36); ctx.restore();
          labelPill(c.cards[0], 70, 620, { alpha: prog(t, A + 0.3, A + 0.6) });
          hook(c.mid, 430, 100, A + 0.1, t, { hl: '#9cd8ff' });
        }
        brandTop();
      }
      endScene(t, E, c.end, c.endKind ?? 'snow', { accent: '#9cd8ff', stripKeys: c.strip });
    },
  };
}
spot({ id: 'W26', title: 'White Christmas? In Norwich?', slug: 'white-christmas-norwich', dur: 12, run: 'xmas', series: 'Rain and winter weather', music: 866, ring: true,
  persona: 'Parents 25 to 44, December weekends', angle: 'Norwich does grey, not white: the plan for a grey Christmas', style: 'Drizzle on a window, a handwritten plan with two crosses and a tick, then photos',
  hook: '"White Christmas? In Norwich?" over drizzle on the window',
  meta: { headline: 'Grey Christmas? Sorted.', primary: primary('White Christmas? In Norwich? Probably grey, like most years.', 'The plan that works anyway: the sky maze, the light forest and the infinity floor, all indoors in Bowthorpe, Norwich.') } },
  snowPlanFmt, { grey: true, hook: ['White Christmas?', '_In Norwich?_'], list: [['Snowman (no snow)', 'x'], ['Sledging (no hill)', 'x'], ['Explorazone', 'v']], mid: ['Grey outside:', '_glowing inside._'], cards: ['sky_maze2', 'light_pillars', 'infinity_floor'], end: ['Grey Christmas?', '_Sorted._'], endKind: 'rain', strip: ['sky_maze2', 'light_pillars', 'infinity_floor', 'roses', 'dodeca', 'laser_room'] });

// W32 Fairy lights ------------------------------------------------------------------
function fairyFmt(c) {
  const BK = (() => { const r = rng(55); return Array.from({ length: 40 }, () => ({ x: r() * W, y: 300 + r() * 1300, r: 30 + r() * 90, c: ['255,200,90', '255,120,160', '120,220,255', '190,255,140'][Math.floor(r() * 4)], ph: r() * 6 })); })();
  return {
    frame(t) {
      const E = endAt(c.dur), A = c.swapAt ?? 4.2;
      if (t < E + 0.4) {
        if (t < A) {
          vgrad([[0, '#2b2420'], [1, '#14100d']]);
          ctx.save(); ctx.strokeStyle = '#2f3b2a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(60, 820); ctx.quadraticCurveTo(540, 1080, 1020, 820); ctx.stroke(); ctx.restore();
          for (let i = 0; i < 11; i++) {
            const u = (i + 0.5) / 11, x = lerp(60, 1020, u), y = (1 - u) * (1 - u) * 820 + 2 * (1 - u) * u * 1080 + u * u * 820 + 26;
            const dead = [2, 5, 6, 9].includes(i) || (i === 7 && t > 1.6), on = dead ? 0 : 0.85 + 0.15 * Math.sin(t * 3 + i);
            const col = ['255,200,90', '255,120,160', '120,220,255', '190,255,140'][i % 4];
            if (on) { const g = ctx.createRadialGradient(x, y, 0, x, y, 70); g.addColorStop(0, `rgba(${col},${0.55 * on})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(x - 70, y - 70, 140, 140); }
            ctx.fillStyle = on ? `rgba(${col},1)` : '#555'; ctx.beginPath(); ctx.ellipse(x, y, 14, 22, 0, 0, Math.PI * 2); ctx.fill();
          }
          if (t < 2.2) hook(c.hook, 430, 104, 0.1, t, { hl: P.yellow, alpha: 1 - prog(t, 2.0, 2.2) });
          else hook(c.hook2, 430, 104, 2.2, t, { hl: P.yellow });
        } else {
          heroPhoto(c.cards[0], t, A, E, { z0: 1.15, dz: -0.08 });
          BK.forEach((b) => { const a = 0.18 + 0.12 * Math.sin(t * 2 + b.ph); const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r); g.addColorStop(0, `rgba(${b.c},${a})`); g.addColorStop(1, `rgba(${b.c},0)`); ctx.fillStyle = g; ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2); });
          ctx.save(); ctx.globalAlpha = prog(t, A, A + 0.4); shade(0.7, 0, 0.36); ctx.restore();
          hook(c.mid, 430, 104, A + 0.1, t, { hl: P.yellow });
          c.cards.slice(1).forEach((k, i) => { const a = A + 1.0 + i * 0.8; if (t > a) card(k, 90 + i * 470, 700 + (i % 2) * 60, 430, 480, { alpha: easeOutCubic(prog(t, a, a + 0.35)), zoom: 1.08 }); });
          labelPill(c.cards[0], 70, 680, { alpha: prog(t, A + 0.4, A + 0.7) });
        }
        brandTop();
      }
      endScene(t, E, c.end, 'red', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W32', title: 'Fairy lights', slug: 'fairy-lights', dur: 12, run: 'xmas', series: 'Rain and winter weather', music: 93,
  persona: 'Parents 25 to 44, Christmas run-up', angle: 'Our lights at home: one tired string. Theirs: a whole garden of light', style: 'A droopy string of fairy lights with dead bulbs, then the glowing garden of light with bokeh',
  hook: '"Our Christmas lights: one string." with half the bulbs out',
  meta: { headline: 'Better than our fairy lights', primary: primary('Our Christmas lights: one string, and half of it works.', 'Explorazone has a whole garden of light, the light forest and infinity lights, all indoors in Bowthorpe, Norwich.') } },
  fairyFmt, { hook: ['Our Christmas lights:', '_one string._'], hook2: ['Half of it', '_works._'], mid: ['Theirs: a whole', '_garden of light._'], cards: ['roses', 'light_pillars', 'dodeca'], end: ['Lights on,', '_all December._'], strip: ['roses', 'light_pillars', 'dodeca', 'found_room', 'infinity_floor', 'tunnel'] });

// W42 Raindrop race 2 ------------------------------------------------------------------
function racePos(keys, t) { if (t <= keys[0][0]) return 0; for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, p0] = keys[i - 1], [t1, p1] = keys[i]; return lerp(p0, p1, easeInOutSine((t - t0) / (t1 - t0))); } return 1; }
function raceFmt(c) {
  let fg = null;
  return {
    setup() { fg = makeCanvas(W, H); },
    frame(t) {
      const E = endAt(c.dur), A = 4.6;
      if (t < A) {
        rainScene(ctx, t);
        ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 8; ctx.setLineDash([26, 18]); ctx.beginPath(); ctx.moveTo(100, 1260); ctx.lineTo(980, 1260); ctx.stroke(); ctx.restore();
        T('FINISH', 540, 1330, { size: 60, w: 700, fam: HAND, color: 'rgba(255,255,255,0.75)' });
        c.racers.forEach(([name, keys, col], i) => {
          const x = 260 + i * 280, y = 720 + 540 * racePos(keys, t);
          ctx.save(); ctx.strokeStyle = 'rgba(220,235,255,0.28)'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, 720); ctx.lineTo(x, y); ctx.stroke(); ctx.restore();
          const g = ctx.createRadialGradient(x - 10, y - 12, 4, x, y, 40); g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.4, 'rgba(190,215,240,0.55)'); g.addColorStop(1, 'rgba(60,80,110,0.5)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, 32, 38, 0, 0, Math.PI * 2); ctx.fill();
          pill(x, 650, name, { size: 32, bg: col, fg: P.ink, alpha: prog(t, 0.5, 0.8) });
        });
        if (t > 3.4) pill(540, 1150, 'DAY 3. STILL RAINING.', { size: 36, bg: P.red, fg: '#fff', scale: easeOutBack(prog(t, 3.4, 3.7)), alpha: prog(t, 3.4, 3.6) });
        brandTop();
        if (t < 2.2) hook(c.hook, 430, 92, 0.1, t, { hl: P.teal, alpha: 1 - prog(t, 2.0, 2.2) }); else hook(c.hook2, 430, 100, 2.2, t, { hl: P.teal });
      } else if (t < E + 0.4) {
        if (t < A + 1.4) { fogWipe(fg, t, A, A + 1.4, IMG[c.reveal], { under: () => heroPhoto(c.reveal, t, A, A + 3) }); }
        else cardSeq(t, c.cards.map((k, i) => { const s = (E - A - 1.4) / c.cards.length; return { k, a: A + 1.4 + i * s, b: A + 1.4 + (i + 1) * s }; }), 600, 980, 640);
        ctx.save(); ctx.globalAlpha = prog(t, A + 0.4, A + 0.8); shade(0.75, 0, 0.4); ctx.restore();
        hook(c.mid, 430, 100, A + 0.5, t, { hl: P.lime }); brandTop();
      }
      endScene(t, E, c.end, 'rain', { accent: P.teal, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W42', title: 'Raindrop race: holiday edition', slug: 'raindrop-race-holidays', dur: 12, run: 'hols', series: 'Rain and winter weather', music: 10,
  persona: 'Parents 25 to 44, wet days in the Christmas holidays', angle: 'Christmas holiday activity #1 is watching the rain; activity #2 is better', style: 'Three raindrops race down the glass, then the window is wiped to show the laser room',
  hook: '"Christmas holidays, activity #1: watch the rain."',
  meta: { headline: 'Holiday activity #2', primary: primary('Christmas holidays, activity #1: watch the rain. Day three, still raining.', 'Activity #2: the laser room, the sky maze and heat vision, all indoors in Bowthorpe, Norwich.') } },
  raceFmt, { hook: ['Holidays,', 'activity #1: _the rain._'], hook2: ['Raindrop', '_racing._'], racers: [['Me', [[0.8, 0], [1.4, 0.3], [1.9, 0.32], [2.6, 0.7], [3.3, 1]], P.lime], ['Dad', [[0.8, 0], [1.6, 0.2], [2.4, 0.55], [2.8, 0.58], [3.6, 1]], P.cream], ['Mum', [[0.8, 0], [1.3, 0.12], [2.1, 0.4], [2.9, 0.62], [3.9, 1]], P.yellow]], mid: ['Activity #2:', '_much better._'], reveal: 'laser_room', cards: ['laser_room', 'sky_maze', 'heat'], end: ['Holiday activity', '_#2, sorted._'], strip: ['laser_room', 'sky_maze', 'heat', 'robot2', 'infinity_floor', 'tunnel'] });
