
// =====================================================================
// V03  Leaves outside. Lasers inside.  (autumn, families)  3D falling leaves
// =====================================================================
const LEAF = { mesh: null, data: [], cards: [] };
function autumnBg() { vgrad([[0, '#7a3216'], [0.55, '#4a1d0e'], [1, '#2a0f07']]); const g = ctx.createRadialGradient(540, 700, 50, 540, 700, 900); g.addColorStop(0, 'rgba(255,170,80,0.28)'); g.addColorStop(1, 'rgba(255,170,80,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
defineSpot({
  id: 'V03', title: 'Leaves outside. Lasers inside.', dur: 12, persona: 'Families, autumn mood (25 to 54)',
  angle: 'Autumn outside, a glowing day of science inside', style: '3D falling autumn leaves blown away to reveal photos',
  hook: 'Golden 3D leaves tumbling down with "Leaves outside."',
  meta: { headline: 'Leaves outside. Lasers inside.', primary: 'Leaves outside. Lasers inside. This half term, swap the soggy park for the laser room, the garden of light and the sky maze at Explorazone, Bowthorpe, Norwich.\n\nBuy 2 tickets at £18 each, the 3rd walks in free. 3 for £36, 6 for £72. Half term: Fri 23 Oct to Sun 1 Nov. New customers only. Sign up to claim. Max 9 per group. T&Cs apply.' },
  setup() {
    const { scene, camera } = getThree(); camera.position.set(0, 0, 8); camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xfff1e0, 0x3a1a10, 1.6)); const dl = new THREE.DirectionalLight(0xffe2b8, 2.4); dl.position.set(2, 4, 6); scene.add(dl);
    const s = new THREE.Shape(); s.moveTo(0, -0.5); s.bezierCurveTo(0.44, -0.28, 0.4, 0.22, 0, 0.5); s.bezierCurveTo(-0.4, 0.22, -0.44, -0.28, 0, -0.5);
    const geo = new THREE.ShapeGeometry(s, 12); const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setZ(i, -0.35 * Math.abs(pos.getX(i)));
    geo.computeVertexNormals();
    const N = 230; LEAF.mesh = new THREE.InstancedMesh(geo, new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }), N); LEAF.mesh.frustumCulled = false;
    const pal = ['#d9531e', '#e98a23', '#f2b134', '#b5361c', '#c4621a', '#f6c85f', '#9c4a1c']; const r = rng(3); const col = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const front = r() < 0.22;
      LEAF.data.push({ x0: (r() - 0.5) * 12, ph: r(), v: 0.55 + r() * 0.6, z: front ? 0.6 + r() * 2.6 : -5 + r() * 4.4, s: front ? 0.2 + r() * 0.16 : 0.26 + r() * 0.2, sa: 0.2 + r() * 0.5, sf: 0.8 + r() * 0.9, rx: (r() - 0.5) * 4, ry: (r() - 0.5) * 4, k: 0.7 + r() * 0.6, p2: r() * 6.28 });
      LEAF.mesh.setColorAt(i, col.set(pal[i % pal.length]));
    }
    scene.add(LEAF.mesh);
    [IMG.laser_room, IMG.roses, IMG.sky_maze].forEach((img) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.75), new THREE.MeshBasicMaterial({ map: texFromCanvas(roundedPhotoCanvas(img, 1000, 786, { border: 14 })), transparent: true, toneMapped: false }));
      m.position.set(0, -0.05, 0); m.visible = false; scene.add(m); LEAF.cards.push(m);
    });
  },
  frame(t) {
    autumnBg();
    const tm = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3();
    const gust = 7.5 * smooth(prog(t, 2.2, 4.0));
    LEAF.data.forEach((d, i) => {
      const y = 7 - ((d.ph * 14 + d.v * t) % 14);
      let x = d.x0 + 0.22 * t + gust * d.k + d.sa * Math.sin(t * d.sf + d.p2); x = ((x + 6) % 12 + 12) % 12 - 6;
      v.set(x, y, d.z); e.set(d.rx * t + d.p2, d.ry * t, 0.6 * Math.sin(t * d.sf + d.p2) + gust * 0.3); q.setFromEuler(e); sc.setScalar(d.s);
      tm.compose(v, q, sc); LEAF.mesh.setMatrixAt(i, tm);
    });
    LEAF.mesh.instanceMatrix.needsUpdate = true;
    const C = LEAF.cards, span = [[2.5, 5.0], [5.0, 6.65], [6.65, 8.4]];
    C.forEach((m, i) => {
      const [a, b] = span[i]; m.visible = t >= a && t < b + 0.3;
      if (!m.visible) return;
      if (i === 0) { const k = easeOutCubic(prog(t, a, a + 0.6)); m.position.z = lerp(-9, 0, k); m.rotation.set(0, lerp(0.9, 0, k), lerp(-0.2, 0, k)); }
      else { const k = easeOutCubic(prog(t, a, a + 0.28)); m.position.z = 0; m.rotation.set(0, lerp(-Math.PI / 2, 0, k), 0); }
      if (i < 2) { const ko = easeInCubic(prog(t, b - 0.28, b)); if (ko > 0) m.rotation.y = ko * Math.PI / 2; if (ko >= 1) m.visible = false; }
      else { const ko = easeInCubic(prog(t, b - 0.4, b + 0.3)); m.position.z = -ko * 6; m.material.opacity = 1 - ko; }
      m.position.y = -0.05 + 0.04 * Math.sin(t * 1.5);
    });
    draw3D();
    const E = 8.2;
    if (t < E + 0.4) {
      ctx.save(); ctx.globalAlpha = 1 - prog(t, E, E + 0.4);
      logo(72, 262, 250, 1, { align: 'left' });
      words(['Leaves outside.'], 440, 112, 0.2, t, { color: P.cream, shadow: 'rgba(30,10,0,0.5)' });
      words(['_Lasers inside._'], 560, 112, 2.6, t, { hl: P.lime, shadow: 'rgba(30,10,0,0.5)' });
      [['LASER ROOM', 2.9, 5.0], ['GARDEN OF LIGHT', 5.2, 6.65], ['SKY MAZE', 6.85, 8.2]].forEach(([l, a, b]) => { const k = win(t, a, b, 0.2); if (k > 0) pill(540, 1385, l, { size: 34, bg: P.lime, fg: P.ink, alpha: k }); });
      ctx.restore();
    }
    if (t > E) endCard(t, E, { bg: () => { autumnBg(); ctx.drawImage(three.renderer.domElement, 0, 0, W, H); ctx.save(); ctx.globalAlpha = 0.55; fill('#2a0f07'); ctx.restore(); }, headline: ['Half term,', 'the _cosy way._'], stripBorder: '#ffb347', fg: P.cream, accent: '#ffb347', offerColor: '#ffb347', chipBg: P.cream, chipFg: '#5a2412', ctaBg: '#ffb347', ctaFg: P.ink });
  },
});

// =====================================================================
// V05  Three generations  (3 generations)  3D card trio
// =====================================================================
const GEN = { cards: [] };
function genCardCanvas(img, name, tag) {
  const c = makeCanvas(690, 1050), g = c.getContext('2d');
  g.fillStyle = P.cream; rr(g, 0, 0, 690, 1050, 44); g.fill();
  g.save(); rr(g, 18, 18, 654, 742, 32); g.clip(); const s = Math.max(654 / img.width, 742 / img.height); g.drawImage(img, 345 - img.width * s / 2, 389 - img.height * s / 2, img.width * s, img.height * s); g.restore();
  T(name, 345, 880, { g, size: 104, w: 800, fam: HEAD, color: P.navy }); T(tag, 345, 950, { g, size: 36, w: 600, color: P.navy, alpha: 0.7 });
  g.fillStyle = P.red; g.beginPath(); g.arc(575, 120, 82, 0, Math.PI * 2); g.fill(); g.strokeStyle = P.cream; g.lineWidth = 6; g.stroke();
  T('£18', 575, 145, { g, size: 64, w: 800, fam: HEAD, color: '#fff' });
  return c;
}
function genFreeCanvas() {
  const c = makeCanvas(690, 1050), g = c.getContext('2d');
  g.fillStyle = P.red; rr(g, 0, 0, 690, 1050, 44); g.fill(); g.strokeStyle = P.cream; g.lineWidth = 6; rr(g, 26, 26, 638, 998, 30); g.stroke();
  T('ME', 345, 220, { g, size: 90, w: 800, fam: HEAD, color: P.cream }); T('FREE', 345, 520, { g, size: 230, w: 800, fam: HEAD, color: P.cream });
  T('The 3rd walks in free', 345, 620, { g, size: 40, w: 800, color: P.lime });
  const lw = 400, lh = lw * IMG.logo.height / IMG.logo.width; g.fillStyle = P.cream; rr(g, 345 - lw / 2 - 14, 820 - 14, lw + 28, lh + 28, 12); g.fill(); g.drawImage(IMG.logo, 345 - lw / 2, 820, lw, lh);
  return c;
}
function navyBg() { vgrad([[0, '#1d2d55'], [1, '#0b1428']]); ctx.save(); ctx.fillStyle = 'rgba(0,221,180,0.07)'; for (let y = 40; y < H; y += 60) for (let x = 40; x < W; x += 60) { ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
defineSpot({
  id: 'V05', title: 'Three generations', dur: 12, persona: 'Three generations (parents and grandparents)',
  angle: 'Grandad, Mum and me: three generations, two tickets', style: '3D trading-card trio, third card flips to FREE',
  hook: 'Three photo cards rise up: Grandad, Mum, Me',
  meta: { headline: 'Three generations. Two tickets.', primary: 'Grandad for the typewriters. Mum for the garden of light. Me for the laser room. Three generations, one day out, two tickets.\n\nBuy 2 tickets at £18 each, the 3rd walks in free. That’s 3 for £36, £12 each. Explorazone, Bowthorpe, Norwich. Half term: Fri 23 Oct to Sun 1 Nov. New customers only. Sign up to claim. Max 9 per group. T&Cs apply.' },
  setup() {
    const { scene } = getThree();
    const defs = [[IMG.typewriters, 'Grandad', 'for the typewriters'], [IMG.roses, 'Mum', 'for the garden of light'], [IMG.laser_room, 'Me', 'for the laser room']];
    const back = texFromCanvas((() => { const c = makeCanvas(690, 1050), g = c.getContext('2d'); g.fillStyle = P.navyMid; rr(g, 0, 0, 690, 1050, 44); g.fill(); const lw = 460, lh = lw * IMG.logo.height / IMG.logo.width; g.drawImage(IMG.logo, 115, 525 - lh / 2, lw, lh); return c; })());
    defs.forEach(([img, name, tag], i) => {
      const grp = new THREE.Group(); const geo = new THREE.PlaneGeometry(1.3, 1.978);
      const front = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: texFromCanvas(genCardCanvas(img, name, tag)), transparent: true, toneMapped: false }));
      const bk = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: i === 2 ? texFromCanvas(genFreeCanvas()) : back, transparent: true, toneMapped: false }));
      bk.rotation.y = Math.PI; grp.add(front, bk); scene.add(grp); GEN.cards.push(grp);
    });
  },
  frame(t) {
    navyBg();
    const cam = three.camera; cam.position.set(0.25 * Math.sin(t * 0.3), 0.1, lerp(8.6, 8.2, prog(t, 0, 6))); cam.lookAt(0, 0.05, 0);
    GEN.cards.forEach((c, i) => {
      const k = easeOutBack(prog(t, 0.1 + i * 0.15, 0.8 + i * 0.15), 1.2);
      c.position.set((i - 1) * 1.36, lerp(-6, 0.05, k) + 0.04 * Math.sin(t * 1.6 + i), 0);
      let ry = 0; if (i === 2) ry = Math.PI * easeInOutCubic(prog(t, 2.5, 3.05));
      c.rotation.set(lerp(0.9, 0, k), ry + 0.12 * Math.sin(t * 0.7 + i) * (1 - prog(t, 2.4, 2.6)) * 0, lerp((i - 1) * 0.35, 0, k));
    });
    draw3D();
    const E = 6.3;
    if (t < E + 0.4) {
      ctx.save(); ctx.globalAlpha = 1 - prog(t, E, E + 0.4);
      ctx.save(); ctx.translate(0, (1 - easeOutCubic(prog(t, 0.8, 1.5))) * 200); photoStrip(t, 1440, 430, { keys: ['typewriters', 'roses', 'laser_room', 'sky_maze', 'robot2', 'heat'], labels: true }); ctx.restore();
      ticker(t, 140, { bg: P.lime, fg: P.ink });
      logo(72, 262, 250, 1, { align: 'left' });
      const a1 = 1 - prog(t, 3.6, 3.9);
      if (t < 3.9) { words(['Three generations.'], 440, 104, 1.0, t, { color: P.cream, alpha: a1 }); words(['_Two tickets._'], 556, 104, 1.8, t, { hl: P.lime, alpha: a1 }); }
      if (t > 3.8) words(['3 in for £36.', 'That’s _£12 each._'], 440, 104, 3.9, t, { color: P.cream, hl: P.lime });
      const c3 = project(new THREE.Vector3(1.36, 0.5, 0)); confetti2D(c3.x, c3.y, t - 3.0);
      ctx.restore();
    }
    if (t > E) endCard(t, E, { bg: navyBg, headline: ['Bring the whole', '_family tree._'], fg: P.cream, accent: P.lime, offerColor: P.lime, chipBg: P.lime, chipFg: P.ink, ctaBg: P.red, ctaFg: '#fff' });
  },
});

// =====================================================================
// V06  Half-term planner  (half term)  3D tear-off calendar
// =====================================================================
const CAL = { grp: null, pages: [], finalCanvas: null, finalTex: null };
const CAL_DAYS = [['23', 'FRIDAY', 1], ['24', 'SATURDAY', 2], ['25', 'SUNDAY', 3], ['26', 'MONDAY', 4], ['27', 'TUESDAY', 5], ['28', 'WEDNESDAY', 6]];
function drawCalPage(g, d, circle = 0, write = 0) {
  const [num, wd, n] = d; g.clearRect(0, 0, 500, 550);
  g.fillStyle = '#fffaf0'; g.fillRect(0, 0, 500, 550);
  g.fillStyle = P.red; g.fillRect(0, 0, 500, 74); T('OCTOBER', 250, 50, { g, size: 30, w: 800, color: P.cream, ls: 8 });
  T(num, 250, 300, { g, size: 220, w: 800, fam: HEAD, color: P.navy });
  T(wd, 250, 372, { g, size: 36, w: 800, color: P.navy, ls: 6 });
  T(`Half term · day ${n} of 10`, 250, 520, { g, size: 24, w: 600, color: P.navy, alpha: 0.55 });
  if (circle > 0) { g.save(); g.strokeStyle = '#e0362c'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.ellipse(250, 228, 170, 118, -0.08, -1.9, -1.9 + Math.PI * 2.15 * circle); g.stroke(); g.restore(); }
  if (write > 0) { g.save(); g.beginPath(); g.rect(40, 390, 420 * write, 100); g.clip(); T('Explorazone day!', 250, 460, { g, size: 66, w: 700, fam: HAND, color: '#e0362c' }); g.restore(); }
}
function tealBg() { vgrad([[0, '#12566a'], [1, '#062430']]); ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 2; for (let x = 0; x <= W; x += 72) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y <= H; y += 72) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } ctx.restore(); }
defineSpot({
  id: 'V06', title: 'Half-term planner', dur: 12, persona: 'Planners: parents booking ahead for half term',
  angle: '10 days off school, circle the one they’ll remember', style: '3D tear-off desk calendar with marker pen',
  hook: 'Calendar pages tearing off: Fri 23, Sat 24, Sun 25...',
  meta: { headline: '10 days of half term. Plan the big one.', primary: 'Half term is 10 days long (Fri 23 Oct to Sun 1 Nov). Circle the one they’ll talk about: six hours of VR, lasers, robots and hands-on science at Explorazone, Bowthorpe, Norwich.\n\nBuy 2 tickets at £18 each, the 3rd walks in free. 3 for £36, 6 for £72, 9 for £108. New customers only. Sign up to claim. Max 9 per group. T&Cs apply.' },
  setup() {
    const { scene, camera } = getThree(); camera.position.set(0, 0.05, 8.3); camera.lookAt(0, 0.05, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x203040, 1.3)); const dl = new THREE.DirectionalLight(0xffffff, 1.8); dl.position.set(-3, 4, 6); scene.add(dl);
    const grp = new THREE.Group(); grp.position.set(0, -0.2, 0); scene.add(grp); CAL.grp = grp;
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.7, 3.1, 0.45), new THREE.MeshStandardMaterial({ color: '#efe6d2', roughness: 0.85 })); base.position.z = -0.24; grp.add(base);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(2.74, 0.34, 0.52), new THREE.MeshStandardMaterial({ color: P.red, roughness: 0.6 })); bar.position.set(0, 1.42, -0.2); grp.add(bar);
    for (let i = -1; i <= 1; i++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.035, 10, 32), new THREE.MeshStandardMaterial({ color: P.gold, metalness: 0.8, roughness: 0.3 })); ring.position.set(i * 0.8, 1.3, 0.02); ring.rotation.y = Math.PI / 2; grp.add(ring); }
    const pageGeo = new THREE.PlaneGeometry(2.5, 2.75); pageGeo.translate(0, -1.375, 0);
    const backMat = new THREE.MeshBasicMaterial({ color: '#f1e9d8', toneMapped: false });
    CAL_DAYS.forEach((d, k) => {
      const c = makeCanvas(500, 550); drawCalPage(c.getContext('2d'), d); const tex = texFromCanvas(c);
      const pg = new THREE.Group(); pg.position.set(0, 1.25, 0.004 + (CAL_DAYS.length - k) * 0.004);
      const fr = new THREE.Mesh(pageGeo, new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); const bk = new THREE.Mesh(pageGeo, backMat); bk.rotation.y = Math.PI;
      pg.add(fr, bk); grp.add(pg); CAL.pages.push(pg);
      if (k === CAL_DAYS.length - 1) { CAL.finalCanvas = c; CAL.finalTex = tex; }
    });
  },
  frame(t) {
    tealBg();
    const flips = [0.9, 1.22, 1.5, 1.75, 1.98];
    CAL.pages.forEach((pg, k) => {
      if (k < flips.length) { const p = easeInCubic(prog(t, flips[k], flips[k] + 0.3)); pg.rotation.x = -2.9 * p; pg.visible = p < 1; pg.position.z = 0.004 + (CAL_DAYS.length - k) * 0.004 + p * 0.3; }
    });
    const cp = easeInOutSine(prog(t, 2.55, 3.2)), wp = prog(t, 3.25, 3.95);
    if (t > 2.5 && t < 4.1) { drawCalPage(CAL.finalCanvas.getContext('2d'), CAL_DAYS[5], cp, wp); CAL.finalTex.needsUpdate = true; }
    else if (t >= 4.1 && !CAL.done) { drawCalPage(CAL.finalCanvas.getContext('2d'), CAL_DAYS[5], 1, 1); CAL.finalTex.needsUpdate = true; CAL.done = true; }
    else if (t < 2.5 && CAL.done !== 0) { drawCalPage(CAL.finalCanvas.getContext('2d'), CAL_DAYS[5]); CAL.finalTex.needsUpdate = true; CAL.done = 0; }
    const shake = t > 0.9 && t < 2.3 ? 0.012 * Math.sin(t * 60) : 0;
    CAL.grp.rotation.set(0.1, -0.22 + 0.06 * Math.sin(t * 0.6) + shake, 0.02);
    const pull = easeInOutCubic(prog(t, 4.4, 5.4));
    CAL.grp.position.set(0, lerp(-0.2, -0.1, pull), lerp(0, -0.6, pull));
    draw3D();
    const E = 6.2;
    if (t < E + 0.4) {
      ctx.save(); ctx.globalAlpha = 1 - prog(t, E, E + 0.4);
      ctx.save(); ctx.translate(0, (1 - easeOutCubic(prog(t, 3.9, 4.6))) * 500); photoStrip(t, 1440, 430, { labels: true, keys: ['laser_room', 'sandbox', 'heat', 'robot2', 'sky_maze', 'roses'] }); ctx.restore();
      ticker(t, 140, { bg: P.lime, fg: P.ink });
      logo(72, 262, 250, 1, { align: 'left' });
      words(['Half term:', '_10 days off._'], 430, 108, 0.15, t, { color: P.cream, hl: P.lime, alpha: 1 - prog(t, 4.2, 4.5) });
      if (t > 4.3) words(['Circle the one', 'they’ll _remember._'], 430, 104, 4.4, t, { color: P.cream, hl: P.lime });
      ctx.restore();
    }
    if (t > E) endCard(t, E, { bg: tealBg, headline: ['Half term,', '_planned._'], fg: P.cream, accent: P.lime, offerColor: P.lime, chipBg: P.cream, chipFg: '#0b3a46', ctaBg: P.red, ctaFg: '#fff' });
  },
});

// =====================================================================
// V10  Ticket trio  (families)  3D tickets fly through portals
// =====================================================================
const TRIO = { root: null, cards: [], portals: [], planet: null };
const PORTAL_FS = `uniform sampler2D map; uniform float uOpacity; uniform float uOpen; uniform vec3 uEdge; varying vec2 vUv;
  void main(){ vec2 p = vUv - 0.5; float r = length(p) * 2.0; float aa = fwidth(r) * 1.5;
    float outer = 1.0 - smoothstep(1.0 - aa, 1.0, r); float iris = smoothstep(uOpen - aa, uOpen, r);
    if (outer * iris < 0.01) discard;
    vec4 c = texture2D(map, vUv); float edge = 1.0 - smoothstep(0.0, 0.07, r - uOpen);
    gl_FragColor = vec4(mix(c.rgb, uEdge, edge * step(0.001, uOpen)), uOpacity * outer * iris);
    #include <colorspace_fragment>
  }`;
const TR = { RAMP: 0.1, SP: 7.0, T0: 4.2, T1: 9.4, PT: [4.95, 5.8, 6.65, 7.5, 8.35] };
TR.L = TR.SP / 0.85 * (TR.T1 - TR.T0) * (1 - TR.RAMP);
function trRamp(u) { const a = TR.RAMP; if (u < a) return (u * u / (2 * a)) / (1 - a); if (u > 1 - a) { const v = 1 - u; return 1 - (v * v / (2 * a)) / (1 - a); } return (a / 2 + (u - a)) / (1 - a); }
const trZ = (t) => -TR.L * trRamp(prog(t, TR.T0, TR.T1));
function portalCanvas(img, label) {
  const S = 768, c = makeCanvas(S, S), g = c.getContext('2d'); const s = Math.max(S / img.width, S / img.height);
  g.drawImage(img, S / 2 - img.width * s / 2, S / 2 - img.height * s / 2, img.width * s, img.height * s);
  const gr = g.createLinearGradient(0, 0, 0, S * 0.45); gr.addColorStop(0, 'rgba(10,18,40,0.7)'); gr.addColorStop(1, 'rgba(10,18,40,0)'); g.fillStyle = gr; g.fillRect(0, 0, S, S);
  g.font = `800 50px ${BODY}`; const pw = g.measureText(label).width + 110, ph = 90; g.fillStyle = P.lime; rr(g, (S - pw) / 2, S * 0.2 - ph / 2, pw, ph, ph / 2); g.fill();
  T(label, S / 2, S * 0.2 + 18, { g, size: 50, w: 800, color: P.ink });
  return c;
}
function planetCanvas() {
  const w = 1024, h = 512, c = makeCanvas(w, h), g = c.getContext('2d'), id = g.createImageData(w, h), d = id.data;
  const bands = [[233, 114, 76], [194, 84, 47], [242, 179, 139], [245, 239, 226], [158, 63, 34], [239, 131, 84], [212, 98, 58], [246, 205, 168]];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const u = x / w * Math.PI * 2, v = y / h; const b = (v + 0.035 * Math.sin(u * 3 + v * 9) + 0.02 * Math.sin(u * 7 + 1.3)) * 11;
    const i0 = ((Math.floor(b) % 8) + 8) % 8, f = smooth(clamp((b - Math.floor(b) - 0.55) / 0.45)), k = (y * w + x) * 4;
    for (let ch = 0; ch < 3; ch++) d[k + ch] = lerp(bands[i0][ch], bands[(i0 + 1) % 8][ch], f); d[k + 3] = 255;
  }
  g.putImageData(id, 0, 0); return c;
}
defineSpot({
  id: 'V10', title: 'Ticket trio', dur: 15, persona: 'Families (broad), proven 3D style',
  angle: 'Three tickets, the 3rd flips to FREE, then a fly-through of the venue', style: '3D tickets fly through photo portals to a planet',
  hook: 'A deck of three gold-edged tickets spins out of the dark',
  meta: { headline: 'Buy 2. Get the 3rd free.', primary: 'Half term for three? Buy 2 tickets at £18 each and the 3rd walks in free. Fly through the laser room, the sky maze, the garden of light, heat vision and infinity lights: six hours of hands-on science, all indoors.\n\nExplorazone, Bowthorpe, Norwich. Half term: Fri 23 Oct to Sun 1 Nov. 3 for £36, 6 for £72, 9 for £108. New customers only. Sign up to claim. Max 9 per group. T&Cs apply.' },
  setup() {
    const { scene } = getThree();
    scene.fog = new THREE.Fog('#16223f', 13, 40);
    scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x1a1030, 1.0)); const key = new THREE.DirectionalLight(0xfff1dd, 2.2); key.position.set(3, 5, 6); scene.add(key);
    const r = rng(42), n = 2200, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { pos[i * 3] = (r() - 0.5) * 26; pos[i * 3 + 1] = (r() - 0.5) * 22 + 1; pos[i * 3 + 2] = 10 - r() * (TR.L + 40); }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xfbf5e8, size: 0.055, transparent: true, opacity: 0.8, depthWrite: false })));
    const root = new THREE.Group(); scene.add(root); TRIO.root = root;
    const TK = tickets(); const geo = new THREE.PlaneGeometry(1.0, 1.3);
    const backC = makeCanvas(600, 780), bg = backC.getContext('2d'); ticketShape(bg, 600, 780); bg.fillStyle = P.navyMid; bg.fill(); const lw = 420, lh = lw * IMG.logo.height / IMG.logo.width; bg.drawImage(IMG.logo, 90, 390 - lh / 2, lw, lh);
    const backT = texFromCanvas(backC);
    [TK.paid, TK.paid2, TK.paid].forEach((cv, i) => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: texFromCanvas(cv), transparent: true, toneMapped: false })));
      const bk = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: i === 2 ? texFromCanvas(TK.free) : backT, transparent: true, toneMapped: false })); bk.rotation.y = Math.PI; g.add(bk);
      root.add(g); TRIO.cards.push(g);
    });
    [[IMG.laser_room, 'LASER ROOM'], [IMG.sky_maze, 'SKY MAZE'], [IMG.roses, 'GARDEN OF LIGHT'], [IMG.heat, 'HEAT VISION'], [IMG.dodeca, 'INFINITY LIGHTS']].forEach(([img, label], k) => {
      const R = 1.45, grp = new THREE.Group(); grp.position.set(0, -0.2, trZ(TR.PT[k]));
      const mat = new THREE.ShaderMaterial({ uniforms: { map: { value: texFromCanvas(portalCanvas(img, label)) }, uOpacity: { value: 0 }, uOpen: { value: 0 }, uEdge: { value: new THREE.Color(P.lime) } }, vertexShader: VS_UV, fragmentShader: PORTAL_FS, transparent: true, toneMapped: false });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(R + 0.03, 0.055, 12, 128), new THREE.MeshBasicMaterial({ color: P.red, transparent: true, toneMapped: false }));
      grp.add(new THREE.Mesh(new THREE.PlaneGeometry(R * 2, R * 2), mat), ring); scene.add(grp); TRIO.portals.push({ grp, mat, ring, k });
    });
    const planetSys = new THREE.Group(); planetSys.position.set(0, 0.6, -TR.L - 2.4); scene.add(planetSys);
    TRIO.planet = new THREE.Mesh(new THREE.SphereGeometry(1.3, 64, 48), new THREE.MeshStandardMaterial({ map: texFromCanvas(planetCanvas()), roughness: 0.85 })); planetSys.add(TRIO.planet);
    const ringF = new THREE.Group(); ringF.rotation.set(0.42, 0, 0.16); planetSys.add(ringF);
    const r1 = new THREE.Mesh(new THREE.RingGeometry(1.62, 1.8, 128), new THREE.MeshBasicMaterial({ color: P.cream, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }));
    const r2 = new THREE.Mesh(new THREE.RingGeometry(1.86, 2.02, 128), new THREE.MeshBasicMaterial({ color: P.teal, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }));
    r1.rotation.x = r2.rotation.x = -Math.PI / 2; ringF.add(r1, r2); TRIO.planetSys = planetSys; TRIO.ringF = ringF;
  },
  frame(t) {
    navyBg();
    const cam = three.camera, root = TRIO.root, V3 = (x, y, z) => new THREE.Vector3(x, y, z);
    const HERO = V3(0, -0.35, 0), END = V3(0, -0.35, -TR.L);
    const OFF3 = V3(0, 1.25, 6.2), LOOK3 = V3(0, 0.45, -6);
    const P0 = TRIO.planetSys.position, orbitQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.42, 0, 0.16, 'ZXY'));
    const orbit = (th) => V3(2.3 * Math.sin(th), 0, 2.3 * Math.cos(th)).applyQuaternion(orbitQ);
    P0.copy(END).sub(orbit(0));
    const CAM4 = P0.clone().add(V3(0, 0.5, 10.5)), LOOK4 = P0.clone().add(V3(0, 0.55, 0));
    // camera
    let look;
    if (t < TR.T0) { const a = easeOutCubic(prog(t, 0, 2)), b = easeInOutCubic(prog(t, 2, 3)); cam.position.set(0.08 * Math.sin(t * 0.8), lerp(lerp(0.3, 0.2, a), 0.1, b), lerp(lerp(7.7, 6.95, a), 6.6, b)); look = V3(0, 0, 0); }
    else if (t < TR.T1) { const rt = V3(0, HERO.y, trZ(t)), w = easeInOutCubic(prog(t, TR.T0, TR.T0 + 0.8)); cam.position.copy(rt).add(V3(0.08 * Math.sin(TR.T0 * 0.8), 0.1 - HERO.y, 6.6).lerp(OFF3, w)); look = V3(0, 0, 0).lerp(rt.clone().add(LOOK3), w); }
    else { const w = easeInOutCubic(prog(t, TR.T1, 11.0)); cam.position.copy(END).add(OFF3).lerp(CAM4, w); look = END.clone().add(LOOK3).lerp(LOOK4, w); }
    cam.lookAt(look); cam.updateMatrixWorld();
    // ticket root
    let sc = 1;
    if (t < TR.T0) { const u = easeOutCubic(prog(t, 0, 1.6)); root.position.copy(V3(0.9, 2.4, -28)).lerp(HERO, u); root.position.y += 0.035 * Math.sin(t * 2.2) * prog(t, 1.2, 1.8); const wob = t > 1.45 ? 0.07 * Math.sin((t - 1.45) * 13) * Math.exp(-(t - 1.45) * 5.5) : 0; root.rotation.set(lerp(0.6, 0, u) + wob, lerp(-4 * Math.PI, 0, u), lerp(-0.5, 0, u)); }
    else if (t < TR.T1) { const dip = 0.3 * smooth(prog(t, TR.T0, TR.T0 + 0.7)) * (1 - smooth(prog(t, TR.T1 - 0.6, TR.T1))); root.position.set(0, HERO.y - dip, trZ(t)); root.rotation.set(-0.38 * smooth(prog(t, TR.T0, TR.T0 + 0.6)) * (1 - smooth(prog(t, TR.T1 - 0.6, TR.T1))), 0, 0.09 * Math.sin((t - TR.T0) * 2.4) * (1 - prog(t, TR.T1 - 0.6, TR.T1))); sc = lerp(1, 0.72, smooth(prog(t, TR.T0, TR.T0 + 0.7))); }
    else {
      const th = Math.PI * 2 * 0.75 * easeInOutSine(prog(t, TR.T1, 11.7)); const op = P0.clone().add(orbit(th));
      const fly = easeInCubic(prog(t, 11.5, 12.2));
      root.position.copy(op).lerp(cam.position.clone().add(V3(0, -0.6, -0.2)), fly);
      const faceCam = cam.quaternion.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.2 * Math.sin(th))));
      root.quaternion.copy(new THREE.Quaternion()).slerp(faceCam, smooth(prog(t, TR.T1, TR.T1 + 0.6)));
      sc = lerp(0.72, 0.7, smooth(prog(t, TR.T1, 10.2))); root.visible = fly < 0.98;
    }
    if (t < TR.T1) root.visible = true;
    root.scale.setScalar(sc);
    // cards: stacked deck, then fan out; third flips to FREE
    const fanK = easeOutBack(prog(t, 2.05, 2.7), 1.3), orbitK = smooth(prog(t, TR.T1 - 0.2, TR.T1 + 0.6));
    TRIO.cards.forEach((c, i) => {
      const dx = (i - 1) * lerp(1.18, 0.62, orbitK), stack = (2 - i) * 0.03;
      c.position.set(lerp((i - 1) * 0.06, dx, fanK), lerp((1 - i) * 0.05, -Math.abs(i - 1) * 0.06 * orbitK, fanK), lerp(stack, (i - 1) * 0.02, fanK));
      c.rotation.set(0, i === 2 ? Math.PI * easeInOutCubic(prog(t, 2.75, 3.25)) : 0, lerp((1 - i) * 0.04, (1 - i) * lerp(0.08, 0.14, orbitK), fanK));
      c.scale.setScalar(lerp(1, 0.86, fanK));
    });
    // portals
    const gate = prog(t, TR.T0 + 0.1, TR.T0 + 0.5);
    TRIO.portals.forEach((p) => {
      const tk = TR.PT[p.k] - t, fade = prog(-tk, -1.2, -0.9) * gate, open = smooth(prog(-tk, -0.16, 0));
      p.grp.visible = fade > 0.001 && tk > -1.0; p.mat.uniforms.uOpacity.value = fade; p.mat.uniforms.uOpen.value = open * 1.05;
      p.ring.scale.setScalar(1 + 0.14 * Math.sin(Math.PI * prog(-tk, -0.16, 0.25))); p.ring.material.color.set(open > 0.02 ? P.lime : P.red); p.ring.material.opacity = fade * (1 - prog(-tk, 0.05, 0.3));
    });
    TRIO.planet.rotation.y = t * 0.18;
    draw3D();
    // overlay
    const E = 11.9;
    if (t < E + 0.4) {
      ctx.save(); ctx.globalAlpha = 1 - prog(t, E, E + 0.4);
      logo(72, 262, 250, 1, { align: 'left' });
      if (t < 2.7) words(['Half term', 'for _three?_'], 470, 112, 0.25, t, { color: P.cream, alpha: 1 - prog(t, 2.3, 2.6) });
      if (t > 2.6 && t < 4.6) words(['Buy 2.', '_Get the 3rd free._'], 470, 112, 2.7, t, { color: P.cream, alpha: 1 - prog(t, 4.3, 4.6) });
      if (t > 4.5 && t < 9.5) words(['Half term,', '_sorted._'], 470, 108, 4.6, t, { color: P.cream, alpha: 1 - prog(t, 9.1, 9.4) });
      if (t > 9.4) { words(['6 hours.', '_All indoors._'], 470, 108, 9.5, t, { color: P.cream }); chipsRow(COPY.maths, 668, 10.0, t, { bg: P.lime, fg: P.ink, size: 40 }); }
      ctx.restore();
      if (t > 3.1 && t < 5) { const c3 = project(new THREE.Vector3(1.0, -0.2, 0)); confetti2D(c3.x, c3.y, t - 3.15); }
    }
    if (t > E) endCard(t, E, { bg: () => { navyBg(); ctx.save(); ctx.globalAlpha = 0.18; ctx.drawImage(three.renderer.domElement, 0, 0, W, H); ctx.restore(); }, headline: ['Three in.', '_One free._'], fg: P.cream, accent: P.lime, offerColor: P.lime, chipBg: P.lime, chipFg: P.ink, ctaBg: P.red, ctaFg: '#fff' });
  },
});
