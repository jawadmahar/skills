
// =====================================================================
// studio UI, loop and recording
// =====================================================================
ORDER.sort();
const params = new URLSearchParams(location.search);
const SPOT = SPOTS[params.get('v')] || SPOTS[ORDER[0]];
let time = 0, playing = !params.has('t'), recording = false, recorder = null, last = performance.now();
if (params.has('t')) time = clamp(parseFloat(params.get('t')) || 0, 0, SPOT.dur);

const $ = (id) => document.getElementById(id);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
$('title').textContent = `${SPOT.id} · ${SPOT.title}`;
$('persona').textContent = SPOT.persona;
$('scrub').max = SPOT.dur;
ORDER.forEach((id) => { const a = document.createElement('a'); a.href = `?v=${id}`; a.textContent = id; if (id === SPOT.id) { a.className = 'on'; a.setAttribute('aria-current', 'page'); } $('grid').appendChild(a); });
$('facts').innerHTML = [['Length', SPOT.dur + 's, 9:16'], ['Angle', SPOT.angle], ['Hook', SPOT.hook], ['Style', SPOT.style], ['Headline', SPOT.meta.headline]].map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('');
$('copy').textContent = SPOT.meta.primary;
$('safeToggle').addEventListener('change', (e) => $('safe').classList.toggle('on', e.target.checked));
$('play').addEventListener('click', () => { if (!recording) playing = !playing; });
$('restart').addEventListener('click', () => { if (!recording) { time = 0; playing = true; } });
$('scrub').addEventListener('input', () => { if (!recording) { time = parseFloat($('scrub').value); playing = false; } });

function download(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
$('record').addEventListener('click', () => {
  if (recording || typeof MediaRecorder === 'undefined') return;
  // H.264 MP4 is what Meta wants; plain 'video/mp4' can silently use VP9, so ask for avc1 explicitly
  const mime = ['video/mp4;codecs=avc1.640028', 'video/mp4;codecs=avc1.4D401F', 'video/mp4;codecs=avc1.42E01E', 'video/webm;codecs=vp9', 'video/webm'].find((m) => MediaRecorder.isTypeSupported(m));
  if (!mime) { $('status').textContent = 'Video recording is not supported in this browser.'; return; }
  recorder = new MediaRecorder(out.captureStream(30), { mimeType: mime, videoBitsPerSecond: 12000000 });
  const chunks = []; recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  recorder.onstop = () => { const ext = mime.includes('mp4') ? 'mp4' : 'webm'; download(new Blob(chunks, { type: mime.split(';')[0] }), `${CAMPAIGN.slug ?? 'video'}-${SPOT.id}.${ext}`); $('status').textContent = ext === 'mp4' ? 'Saved MP4.' : 'Saved WebM. Convert to MP4 before uploading to Meta.'; recording = false; $('record').disabled = false; };
  time = 0; playing = true; recording = true; $('record').disabled = true; last = performance.now();
  $('status').textContent = 'Recording in real time. Keep this tab in front...';
  recorder.start(250);
});

function renderFrame(t) { ctx.save(); SPOT.frame(t); ctx.restore(); }
function updateUI(t) { $('scrub').value = t.toFixed(2); $('time').textContent = `${t.toFixed(1)}s / ${SPOT.dur.toFixed(1)}s`; $('play').textContent = playing ? 'Pause' : 'Play'; }
function loop(now) {
  // while recording, follow the real clock so the file length is exact even if frames drop
  const dt = recording ? (now - last) / 1000 : Math.min(0.1, (now - last) / 1000); last = now;
  if (playing) { time += dt; if (time >= SPOT.dur) { if (recording) { time = SPOT.dur - 0.001; playing = false; renderFrame(time); setTimeout(() => recorder.stop(), 300); } else time = 0; } }
  renderFrame(time); updateUI(time); requestAnimationFrame(loop);
}

async function loadFonts() {
  // every face the spots draw with must be loaded before the first frame, or canvas text falls back to a system font
  const faces = [...(BRAND.fonts?.preload || []), ...(CAMPAIGN.fonts?.preload || [])];
  await Promise.race([Promise.all(faces.map((f) => document.fonts.load(f).catch(() => {}))), new Promise((r) => setTimeout(r, 4000))]);
}
function loadImage(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
(async () => {
  await loadFonts();
  const keys = Object.keys(ASSETS); const imgs = await Promise.all(keys.map((k) => loadImage(ASSETS[k])));
  keys.forEach((k, i) => { IMG[k] = imgs[i]; });
  await SPOT.setup();
  $('loading').remove();
  window.__dur = SPOT.dur;
  window.__spots = ORDER.map((id) => { const x = SPOTS[id]; return { id, title: x.title, slug: x.slug, dur: x.dur, persona: x.persona, angle: x.angle, style: x.style, hook: x.hook, music: x.music, series: x.series, meta: x.meta }; });
  window.__seek = (t) => { time = t; playing = false; renderFrame(t); updateUI(t); };
  window.__ready = true;
  last = performance.now(); requestAnimationFrame(loop);
})().catch((e) => { $('loading').textContent = 'Could not load. Check your internet connection.'; console.error(e); });
</script>
</body>
</html>
