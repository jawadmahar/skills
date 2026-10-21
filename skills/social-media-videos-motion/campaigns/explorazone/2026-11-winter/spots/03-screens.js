// =====================================================================
// Screens and phone UI (9): W09 W10 W13 W29 W37 W39 W40 W41 W49
// Native-feeling phone moments: notifications, search, POV captions, group chat, screen time, camera roll, battery.
// =====================================================================
function glassCard(x, y, w, h, o = {}) { ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; ctx.fillStyle = o.fill ?? 'rgba(255,255,255,0.9)'; rr(ctx, x, y, w, h, o.r ?? 36); ctx.fill(); ctx.restore(); }
function appIcon(x, y, s, bg, letter, o = {}) { ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.fillStyle = bg; rr(ctx, x, y, s, s, s * 0.24); ctx.fill(); ctx.restore(); T(letter, x + s / 2, y + s * 0.7, { size: s * 0.55, w: 800, color: o.fg ?? '#fff', alpha: o.alpha ?? 1 }); }

// W09 Lock-screen pings ---------------------------------------------------------
function notifFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur);
      if (t < E + 0.4) {
        bgPhoto(IMG[c.wall], { filter: 'blur(40px) brightness(0.45) saturate(1.3)' });
        T(c.day, 540, 330, { size: 40, w: 600, color: 'rgba(255,255,255,0.85)' });
        T(c.time, 540, 520, { size: 190, w: 700, color: '#fff', fam: BODY });
        const n = c.notes.length;
        c.notes.forEach(([app, col, letter, title, body, at], i) => {
          const k = easeOutBack(prog(t, at, at + 0.35), 1.1); if (k <= 0) return;
          const stackY = 600 + (n - 1 - i) * 0; const later = c.notes.filter((x) => x[5] <= t && x[5] > at).length;
          const y = 600 + later * 170 + (1 - k) * -120, a = clamp(k * 2);
          glassCard(60, y, 960, 150, { alpha: a, fill: i === n - 1 ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.86)' });
          appIcon(90, y + 30, 90, col, letter, { alpha: a });
          T(app.toUpperCase(), 210, y + 52, { size: 24, w: 700, color: '#6b7280', align: 'left', ls: 2, alpha: a }); T('now', 990, y + 52, { size: 24, w: 600, color: '#6b7280', align: 'right', alpha: a });
          T(title, 210, y + 96, { size: 36, w: 800, color: '#111', align: 'left', alpha: a }); T(body, 210, y + 134, { size: 30, w: 500, color: '#374151', align: 'left', alpha: a });
        });
        const X = c.expand; if (t > X) { const k = easeOutCubic(prog(t, X, X + 0.4)); ctx.save(); ctx.globalAlpha = k; card(c.photo, 60, lerp(600, 380, k), 960, lerp(150, 760, k), { radius: 36 }); ctx.restore(); }
        photoStrip(t, 1395, 470, { keys: c.strip, alpha: 0.9 });
        brandTop();
      }
      endScene(t, E, c.end, 'photo', { key: c.wall, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W09', title: 'Lock-screen pings', slug: 'lock-screen-pings', dur: 8, run: 'nov', series: 'Screens and phones', music: 729, ring: true,
  persona: 'Parents 25 to 44, Saturday morning', angle: 'The notifications pile up until the right one lands', style: 'Phone lock screen with stacking notifications that expand into a photo',
  hook: 'Weather notification: "Grey all weekend"',
  meta: { headline: 'The notification you wanted', primary: primary('Weather: grey all weekend. Family chat: what are we doing Saturday? Maps: city centre, heavy traffic.', 'Explorazone: the laser room, heat vision and the sky maze, all indoors in Bowthorpe, Norwich.') } },
  notifFmt, { wall: 'laser_room', day: 'Saturday', time: '9:41', photo: 'laser_room', expand: 3.2, notes: [['Weather', '#3b82f6', 'W', 'Grey all weekend', 'Cloudy with drizzle, Sat and Sun', 0.15], ['Family chat', '#22c55e', 'F', 'Mum', 'What are we doing Saturday?', 0.9], ['Maps', '#ef4444', 'M', 'City centre: heavy traffic', 'Christmas shoppers everywhere', 1.6], ['Explorazone', '#ef4720', 'E', 'Buy 2, get the 3rd free', 'Outside the ring road. All indoors.', 2.4]], end: ['Saturday?', '_Sorted._'], strip: ['laser_room', 'heat', 'sky_maze2', 'infinity_floor', 'robot2', 'roses'] });

// W10 and W41 Search bar ---------------------------------------------------------------
function searchFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), R = c.results ?? 4.6;
      if (t < E + 0.4) {
        fill('#f4f6fb'); ctx.save(); ctx.fillStyle = c.top ?? '#1a34bf'; ctx.fillRect(0, 0, W, 250); ctx.restore();
        const typed = c.query.slice(0, Math.floor(c.query.length * prog(t, 0.1, c.typeEnd ?? 1.9)));
        glassCard(60, 420, 960, 130, { fill: '#fff', r: 65 });
        ctx.save(); ctx.strokeStyle = '#9aa3b2'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(140, 478, 24, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(158, 496); ctx.lineTo(178, 516); ctx.stroke(); ctx.restore();
        const fs = typed.length > 26 ? 44 : 50; T(typed, 200, 500, { size: fs, w: 600, color: '#111', align: 'left' });
        if (Math.floor(t * 2.5) % 2 === 0 && t < R) { const tw = measure(typed, fs, 600); ctx.fillStyle = '#1a34bf'; ctx.fillRect(204 + tw, 462, 4, 56); }
        if (t < R) {
          c.suggest.forEach((s, i) => {
            const a = prog(t, 2.0 + i * 0.15, 2.3 + i * 0.15); if (a <= 0) return; const y = 600 + i * 120, hot = i === c.pick && t > 3.2;
            glassCard(60, y, 960, 104, { fill: hot ? '#e8edff' : '#fff', r: 26, alpha: a });
            const qs = c.query.length > 26 ? 34 : 38; T(c.query + ' ', 100, y + 66, { size: qs, w: 500, color: '#6b7280', align: 'left', alpha: a });
            T(s, 100 + measure(c.query + ' ', qs, 500), y + 66, { size: qs, w: 800, color: '#111', align: 'left', alpha: a });
          });
        } else {
          const k = easeOutCubic(prog(t, R, R + 0.4));
          ctx.save(); ctx.globalAlpha = k; ctx.translate(0, (1 - k) * 80);
          glassCard(60, 600, 960, 640, { fill: '#fff', r: 36 });
          T('Explorazone', 100, 680, { size: 52, w: 800, fam: HEAD, color: '#1a0dab', align: 'left' });
          T('Indoor science attraction · Bowthorpe, Norwich', 100, 730, { size: 30, w: 500, color: '#3c4043', align: 'left' });
          c.cards.forEach((key, i) => { const a = prog(t, R + 0.3 + i * 0.25, R + 0.6 + i * 0.25); photo(IMG[key], 100 + i * 300, 780, 280, 300, { radius: 20, alpha: a }); T(LABEL[key] || '', 240 + i * 300, 1125, { size: 22, w: 800, color: '#111', alpha: a }); });
          pill(540, 1180, c.offerChip ?? 'Buy 2, get the 3rd free', { size: 32, bg: P.red, fg: '#fff', alpha: prog(t, R + 1.1, R + 1.4) });
          ctx.restore();
        }
        photoStrip(t, 1395, 470, { keys: c.strip });
        brandTop();
      }
      endScene(t, E, c.end, c.endKind ?? 'royal', { stripKeys: c.strip });
    },
  };
}
spot({ id: 'W10', title: 'Search: rainy day Norwich', slug: 'search-rainy-day', dur: 12, run: 'nov', series: 'Screens and phones', music: 587, ring: true,
  persona: 'Parents 25 to 44 searching for rainy-day ideas', angle: 'The search every Norwich parent types on a wet Saturday', style: 'Search bar typing with autocomplete, then a result card with photos',
  hook: 'Typing: "things to do in norwich when it..."',
  meta: { headline: 'What to do when it rains', primary: primary('Things to do in Norwich when it rains with kids. You have typed it. We have answered it.', 'The science lab, the AR sandbox and the laser jungle, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  searchFmt, { query: 'things to do in norwich when it', suggest: ['rains', 'rains with kids', 'is cold', 'gets dark at 4'], pick: 1, cards: ['lab3', 'sandbox', 'jungle2'], end: ['Searched it?', '_Found it._'], strip: ['lab3', 'sandbox', 'jungle2', 'laser_room', 'heat', 'infinity_floor'] });
spot({ id: 'W41', title: 'Search: grandchildren', slug: 'search-grandchildren', dur: 12, run: 'hols', series: 'Screens and phones', music: 12,
  persona: 'Grandparents 55+ minding grandchildren in the holidays', angle: 'Grandparents search for something everyone will enjoy', style: 'Search bar typing with autocomplete in green, then a result card with photos',
  hook: 'Typing: "things to do with grandchildren..."',
  meta: { headline: 'Grandchildren for the day?', primary: primary('Things to do with grandchildren in Norwich, indoors. Look no further.', 'Robot waiters, fossils and rocks and crystals, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  searchFmt, { top: '#00a884', query: 'things to do with grandchildren', suggest: ['in norwich', 'indoors', 'when it rains', 'aged 5 to 11'], pick: 1, cards: ['robot2', 'fossils', 'crystals'], end: ['Grandchildren', '_for the day? Sorted._'], endKind: 'green', strip: ['robot2', 'fossils', 'crystals', 'heat', 'laser_room', 'roses'] });

// W13 and W49 POV captions -------------------------------------------------------------
function povFmt(c) {
  const J = (() => { const r = rng(c.seed ?? 5); return Array.from({ length: 200 }, () => [r() - 0.5, r() - 0.5]); })();
  return {
    frame(t) {
      const E = endAt(c.dur);
      if (t < E + 0.4) {
        const seg = c.segs.findIndex((s, i) => t >= s[2] && (i === c.segs.length - 1 || t < c.segs[i + 1][2]));
        const [key, cap, a, filt] = c.segs[Math.max(0, seg)];
        const punch = 1 + 0.12 * (1 - easeOutCubic(prog(t, a, a + 0.35))), j = J[Math.floor(t * 8) % 200];
        bgPhoto(IMG[key]);
        const ph = heroH(key);
        ctx.save(); ctx.translate(540 + j[0] * 14, 900 + j[1] * 14); ctx.rotate(j[0] * 0.01); ctx.scale(punch, punch); ctx.translate(-540, -900);
        photo(IMG[key], 0, 900 - ph / 2, W, ph, { zoom: 1.02 + 0.04 * prog(t, a, a + 2), filter: filt, shadow: 'rgba(0,0,0,0.45)' });
        ctx.restore(); vgrad([[0, 'rgba(0,0,0,0.35)'], [0.3, 'rgba(0,0,0,0)'], [0.75, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.35)']]);
        const lines = wrap(cap, 900, 66, 800), k = prog(t, a + 0.05, a + 0.2);
        lines.forEach((ln, i) => {
          const y = 440 + i * 92;
          if (c.bubble) { const w = measure(ln, 62, 800) + 50; ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = '#fff'; rr(ctx, 540 - w / 2, y - 62, w, 84, 16); ctx.fill(); ctx.restore(); T(ln, 540, y, { size: 62, w: 800, color: '#111', alpha: k }); }
          else T(ln, 540, y, { size: 66, w: 800, color: '#fff', stroke: 10, strokeColor: '#000', alpha: k });
        });
        if (seg > 0 && LABEL[key]) labelPill(key, 70, 1120, { alpha: prog(t, a + 0.2, a + 0.4) });
        brandTop();
      }
      endScene(t, E, c.end, 'photo', { key: c.segs[c.segs.length - 1][0], stripKeys: c.strip });
    },
  };
}
spot({ id: 'W13', title: 'POV: you promised a day out', slug: 'pov-day-out', dur: 12, run: 'nov', series: 'Screens and phones', music: 82,
  persona: 'Parents 25 to 44, native Reels viewers', angle: 'POV: you promised them something fun and actually delivered', style: 'Handheld punch-in cuts with bold POV captions, native Reels look',
  hook: '"POV: you said ‘we’ll do something fun this weekend’"',
  meta: { headline: 'POV: you actually did it', primary: primary('POV: you said we will do something fun this weekend. And you actually did.', 'The sky maze, the laser lights, the space-time tunnel and heat vision, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  povFmt, { segs: [['sky_maze2', "POV: you said 'we'll do something fun this weekend'", 0, 'brightness(0.8)'], ['red_lasers', '...and you actually did', 2.2], ['tunnel', 'space-time tunnel: done', 4.0], ['heat', 'heat vision: obsessed', 5.6], ['infinity_floor', 'parent of the year', 7.0]], end: ['Parent of', '_the year._'], strip: ['sky_maze2', 'red_lasers', 'tunnel', 'heat', 'infinity_floor', 'laser_room'] });
spot({ id: 'W49', title: 'Too old for that', slug: 'too-old-for-that', dur: 12, run: 'jan', series: 'Screens and phones', music: 834,
  persona: 'Parents of 11 to 14 year olds, and teens', angle: 'The teenager who is too old for it, until they are not', style: 'White caption bubbles over handheld photo cuts, teen humour',
  hook: '"‘I’m too old for that.’"',
  meta: { headline: 'Too old for it? Apparently not', primary: primary('"I am too old for that." Also them, an hour later: one more go in the sky maze.', 'The laser jungle, the sky maze, the infinity floor and the plasma ball, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  povFmt, { bubble: true, seed: 9, segs: [['jungle2', "\"I'm too old for that.\"", 0, 'brightness(0.75) saturate(0.8)'], ['red_lasers', 'also them, an hour later:', 2.0], ['sky_maze2', '"one more go"', 3.6], ['infinity_floor', 'sends the group chat 40 photos', 5.2], ['plasma', '"can we come back?"', 6.8]], end: ['Too old for it?', '_Apparently not._'], strip: ['jungle2', 'red_lasers', 'sky_maze2', 'infinity_floor', 'plasma', 'tunnel'] });

// W29 Family group chat ---------------------------------------------------------------------
function chatFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur);
      if (t < E + 0.4) {
        fill('#ece5dd');
        ctx.save(); ctx.fillStyle = '#075e54'; ctx.fillRect(0, 0, W, 380); ctx.restore();
        T(c.title, 520, 356, { size: 44, w: 800, color: '#fff', align: 'left' }); T(c.members ?? 'Nan, Grandad, Mum, you', 520, 300, { size: 26, w: 500, color: 'rgba(255,255,255,0.75)', align: 'left' }); appIcon(410, 290, 90, '#25d366', c.title[4] ?? 'F');
        let y = 450;
        const shown = c.msgs.filter((m) => t >= m.at);
        const total = shown.reduce((a, m) => a + (m.key ? 360 : 120) + 22, 0), off = Math.max(0, total - 800);
        ctx.save(); ctx.beginPath(); ctx.rect(0, 400, W, 860); ctx.clip(); ctx.translate(0, -off);
        c.msgs.forEach((m) => {
          if (t < m.at - 0.6) return;
          if (t < m.at) { if (!m.me) { glassCard(60, y, 160, 80, { fill: '#fff', r: 30 }); for (let d = 0; d < 3; d++) { ctx.fillStyle = '#9ca3af'; ctx.beginPath(); ctx.arc(105 + d * 34, y + 40 + Math.sin(t * 10 + d) * 5, 9, 0, Math.PI * 2); ctx.fill(); } } return; }
          const k = easeOutBack(prog(t, m.at, m.at + 0.3)), h = m.key ? 360 : 120, w = m.key ? 600 : Math.min(860, measure(m.text, 38, 500) + 70), x = m.me ? W - 60 - w : 60;
          ctx.save(); ctx.translate(x + (m.me ? w : 0), y); ctx.scale(k, k); ctx.translate(-(x + (m.me ? w : 0)), -y);
          glassCard(x, y, w, h, { fill: m.me ? '#dcf8c6' : '#fff', r: 26 });
          if (m.key) { photo(IMG[m.key], x + 14, y + 14, w - 28, h - 80, { radius: 18 }); T(m.text, x + 30, y + h - 22, { size: 32, w: 600, color: '#111', align: 'left' }); }
          else { T(m.who, x + 30, y + 44, { size: 26, w: 800, color: m.col ?? '#c2410c', align: 'left' }); T(m.text, x + 30, y + 92, { size: 38, w: 500, color: '#111', align: 'left' }); }
          ctx.restore();
          if (m.react && t > m.react) { const rk = easeOutBack(prog(t, m.react, m.react + 0.3)); heart(x + w - 20, y + h + 8, 26 * rk, '#e0362c'); }
          y += h + 22;
        });
        ctx.restore();
        photoStrip(t, 1395, 470, { keys: c.strip, alpha: 0.95 });
        brandTop();
      }
      endScene(t, E, c.end, 'green', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W29', title: 'Family group chat', slug: 'family-group-chat', dur: 12, run: 'xmas', series: 'Screens and phones', music: 984, ring: true,
  persona: 'Three generations planning the Christmas holidays', angle: 'The family chat agrees on one plan for once', style: 'Messaging app with typing dots, a photo message and heart reactions',
  hook: 'Nan in the family chat: "Who’s doing what this Christmas?"',
  meta: { headline: 'The family chat agrees', primary: primary('Nan: who is doing what this Christmas? Mum: kids are off soon, ideas? Grandad: somewhere dry, please.', 'Robot waiters, heat vision and the laser room, all indoors at Explorazone, Bowthorpe, Norwich. Buy 2, the 3rd goes free.') } },
  chatFmt, { title: 'The Family', msgs: [
    { who: 'Nan', text: "Who's doing what this Christmas?", at: 0.2, col: '#be185d' },
    { who: 'Mum', text: 'Kids are off soon. Ideas?', at: 1.4, col: '#1d4ed8' },
    { who: 'Grandad', text: 'Somewhere dry please', at: 2.6, col: '#047857' },
    { me: true, key: 'robot2', text: 'This? 3 of us, 3rd free', at: 3.8 },
    { who: 'Nan', text: 'Book it!!', at: 5.4, col: '#be185d', react: 5.8 },
    { who: 'Grandad', text: 'Do the robots bring tea?', at: 6.5, col: '#047857' },
  ], end: ['The family chat', '_agrees._'], strip: ['robot2', 'heat', 'laser_room', 'infinity_floor', 'roses', 'sky_maze2'] });

// W37 Screen time report ------------------------------------------------------------------------
function screenTimeFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), S = c.switchAt ?? 4.2;
      if (t < E + 0.4) {
        fill('#000');
        if (t < S + 0.4) {
          ctx.save(); ctx.globalAlpha = 1 - prog(t, S, S + 0.4);
          T('Screen Time', 80, 420, { size: 64, w: 800, color: '#fff', align: 'left' });
          T('DAILY AVERAGE', 80, 520, { size: 28, w: 700, color: '#8e8e93', align: 'left', ls: 2 });
          const hrs = Math.round(lerp(1, 7, easeOutCubic(prog(t, 0.2, 1.4))));
          T(`${hrs}h ${String(Math.round(lerp(5, 48, prog(t, 0.2, 1.4)))).padStart(2, '0')}m`, 80, 640, { size: 120, w: 800, color: '#fff', align: 'left' });
          pill(250, 715, 'up 312% this week', { size: 32, bg: '#ff453a', fg: '#fff', alpha: prog(t, 1.2, 1.5) });
          const bars = [0.25, 0.3, 0.5, 0.7, 0.85, 0.95, 1];
          bars.forEach((b, i) => { const k = easeOutCubic(prog(t, 0.3 + i * 0.1, 0.8 + i * 0.1)), h = 250 * b * k; ctx.fillStyle = i > 3 ? '#ff9f0a' : '#0a84ff'; rr(ctx, 100 + i * 128, 1180 - h, 90, h, 14); ctx.fill(); T(['M', 'T', 'W', 'T', 'F', 'S', 'S'][i], 145 + i * 128, 1230, { size: 28, w: 600, color: '#8e8e93' }); });
          if (t > 1.8) hook(c.hook2, 830, 64, 1.8, t, { color: '#fff', hl: '#ff9f0a', shadow: 'rgba(0,0,0,0.9)' });
          ctx.restore();
        }
        if (t > S) {
          const k = easeOutCubic(prog(t, S, S + 0.4));
          ctx.save(); ctx.globalAlpha = k;
          T('New setting', 80, 420, { size: 64, w: 800, color: '#fff', align: 'left' });
          glassCard(60, 470, 960, 130, { fill: '#1c1c1e', r: 26 }); T('Hands-on time', 100, 552, { size: 44, w: 700, color: '#fff', align: 'left' });
          const on = easeInOutCubic(prog(t, S + 0.5, S + 0.8)); ctx.fillStyle = on > 0.5 ? '#30d158' : '#3a3a3c'; rr(ctx, 860, 502, 120, 66, 33); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(lerp(893, 947, on), 535, 28, 0, Math.PI * 2); ctx.fill();
          c.cards.forEach((key, i) => { const a = S + 1.0 + i * 0.6; if (t > a) card(key, 60 + (i % 2) * 490, 650 + Math.floor(i / 2) * 420, i === 2 ? 960 : 470, 380, { alpha: easeOutCubic(prog(t, a, a + 0.3)), zoom: 1.06 }); });
          ctx.restore();
        }
        photoStrip(t, 1460, 420, { keys: c.strip, alpha: prog(t, S, S + 0.6) });
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { accent: '#30d158', stripKeys: c.strip });
    },
  };
}
spot({ id: 'W37', title: 'Screen time report', slug: 'screen-time-report', dur: 12, run: 'hols', series: 'Screens and phones', music: 1183,
  persona: 'Parents 25 to 44, Christmas holidays', angle: 'Holiday screen time is through the roof; switch on hands-on time', style: 'Phone screen-time report with rising bars, then a "hands-on time" toggle switches on',
  hook: 'Screen-time report: "7h 48m, up 312% this week"',
  meta: { headline: 'Switch on hands-on time', primary: primary('Screen time this week: up 312%. We have all been there over the holidays.', 'Switch on hands-on time: microscopes, the AR sandbox and the plasma ball, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  screenTimeFmt, { hook: [''], hook2: ['Holiday screen time. _Oops._'], cards: ['microscope', 'sandbox', 'plasma'], end: ['Switch on', '_hands-on time._'], strip: ['microscope', 'sandbox', 'plasma', 'lab3', 'laser_room', 'heat'] });

// W39 Batteries: 1% -----------------------------------------------------------------------------
function batteryFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), S = c.switchAt ?? 2.3;
      if (t < E + 0.4) {
        if (t < S) {
          vgrad([[0, '#1b1b2f'], [1, '#2a1f3d']]);
          const lvl = lerp(1, (c.minPct ?? 1) / 100, easeInCubic(prog(t, 0.1, 1.5)));
          ctx.save(); ctx.translate(540, 900); ctx.strokeStyle = '#fff'; ctx.lineWidth = 16; rr(ctx, -300, -150, 560, 300, 40); ctx.stroke(); ctx.fillStyle = '#fff'; rr(ctx, 270, -60, 40, 120, 12); ctx.fill();
          ctx.fillStyle = lvl > 0.2 ? '#30d158' : '#ff453a'; rr(ctx, -278, -128, Math.max(16, 516 * lvl), 256, 26); ctx.fill(); ctx.restore();
          T(`${Math.max(c.minPct ?? 1, Math.round(lvl * 100))}%`, 540, 1180, { size: 110, w: 800, fam: HEAD, color: lvl > 0.2 ? '#fff' : '#ff453a' });
          hook(c.hook, 430, 104, 0.05, t, { hl: '#ff453a' });
        } else {
          heroPhoto(c.cards[0], t, S, E, { cy: 820 });
          ctx.save(); ctx.globalAlpha = 1 - prog(t, S, S + 0.25); fill('#fff'); ctx.restore();
          ctx.save(); ctx.globalAlpha = prog(t, S, S + 0.3); shade(0.75, 0, 0.36); ctx.restore();
          hook(c.mid, 430, 100, S + 0.1, t, { hl: P.yellow });
          if (c.cards[1] && t > S + 0.9) card(c.cards[1], 540, 1000, 470, 260, { alpha: easeOutCubic(prog(t, S + 0.9, S + 1.2)), zoom: 1.06 });
          labelPill(c.cards[0], 70, 1060, { alpha: prog(t, S + 0.4, S + 0.7) });
        }
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { accent: P.yellow, stripKeys: c.strip });
    },
  };
}
spot({ id: 'W39', title: 'Batteries: 1%', slug: 'batteries-1-percent', dur: 8, run: 'post', series: 'Screens and phones', music: 786,
  persona: 'Parents 25 to 44, the days after Christmas', angle: 'The new toy is already flat; the plasma ball never needs batteries', style: 'Battery icon draining to red, then a flash cut to the plasma ball and lava lamps',
  hook: '"New toy. Batteries: 1%."',
  meta: { headline: 'No batteries required', primary: primary('New toy. Batteries: 1%. Nobody bought AAs.', 'The plasma ball and the lava lamps never need batteries. All indoors at Explorazone, Bowthorpe, Norwich.') } },
  batteryFmt, { hook: ['New toy.', 'Batteries: _1%._'], mid: ['No batteries', '_required._'], cards: ['plasma', 'lava_lamp'], end: ['No batteries', '_required._'], strip: ['plasma', 'lava_lamp', 'light_pillars', 'laser_room', 'infinity_floor', 'tunnel'] });

// W40 Camera roll --------------------------------------------------------------------------------
function rollFmt(c) {
  return {
    frame(t) {
      const E = endAt(c.dur), X = c.openAt ?? 4.0;
      if (t < E + 0.4) {
        fill('#fff'); T('Recents', 70, 420, { size: 66, w: 800, color: '#111', align: 'left' }); T(c.sub, 70, 480, { size: 32, w: 600, color: '#8e8e93', align: 'left' });
        const s = 312, gap = 6, keys = c.grid;
        keys.forEach((k, i) => { const a = 0.15 + i * 0.12, p = prog(t, a, a + 0.25); if (p <= 0) return; const x = 30 + (i % 3) * (s + gap), y = 520 + Math.floor(i / 3) * (s + gap); photo(IMG[k], x, y, s, s, { alpha: p, zoom: 1.05 }); });
        const sel = c.open.findIndex((o, i) => t >= o[1] && (i === c.open.length - 1 || t < c.open[i + 1][1]));
        if (t > X && sel >= 0) {
          const [key, at, cap] = c.open[sel]; const k = easeOutCubic(prog(t, at, at + 0.4));
          ctx.save(); ctx.globalAlpha = k; fill('#000'); ctx.restore();
          const fh = heroH(key), w = lerp(312, W, k), h = lerp(312, fh, k), x = lerp(30 + 312, 0, k), y = lerp(830, 900 - fh / 2, k);
          photo(IMG[key], x, y, w, h, { zoom: 1.05 + 0.04 * prog(t, at, at + 2) });
          T(cap, 540, 1210, { size: 52, w: 800, color: '#fff', shadow: 'rgba(0,0,0,0.8)', alpha: prog(t, at + 0.3, at + 0.6) });
          labelPill(key, 70, 460, { alpha: prog(t, at + 0.3, at + 0.6) });
          ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = '#111'; ctx.fillRect(0, 1680, W, 240); ctx.restore();
          heart(540, 1800, 44 * k, '#fff');
        }
        brandTop();
      }
      endScene(t, E, c.end, 'navy', { stripKeys: c.strip });
    },
  };
}
spot({ id: 'W40', title: 'Camera roll', slug: 'camera-roll', dur: 12, run: 'hols', series: 'Screens and phones', music: 1069,
  persona: 'Three generations, Christmas holidays', angle: 'The holiday camera roll fills up with one day out', style: 'Phone photo grid filling up, then photos open full screen with captions',
  hook: 'Camera roll "Recents: Christmas holidays" filling with photos',
  meta: { headline: 'Best photos of the holidays', primary: primary('Camera roll, Christmas holidays: 312 photos, and most of them are from one day out.', 'The infinity floor, the space-time tunnel and the garden of light, all indoors at Explorazone, Bowthorpe, Norwich.') } },
  rollFmt, { sub: 'Christmas holidays · 312 photos', grid: ['infinity_floor', 'tunnel', 'roses', 'heat', 'robot2', 'sky_maze2', 'dodeca', 'laser_room', 'light_pillars', 'floor2', 'plasma', 'found_room'], open: [['infinity_floor', 4.0, 'day 4: the infinity floor'], ['tunnel', 5.7, 'the space-time tunnel'], ['roses', 7.0, 'garden of light. wow.']], end: ['Best photos', '_of the holidays._'], strip: ['infinity_floor', 'tunnel', 'roses', 'heat', 'robot2', 'sky_maze2'] });
