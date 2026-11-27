#!/usr/bin/env node
// Drives a built studio in headless Chromium.
//
//   node render.mjs frames <studio.html> <spotId> <outDir> [--fps 30]   JPEG frames for ffmpeg
//   node render.mjs meta   <studio.html> <out.json>                       spot list with copy and settings
//   node render.mjs stills <studio.html> <outDir> [--at 0.12,0.45,0.8] [--spots V01,V02] [--name id]
//                                                                         QA stills; --at takes fractions of
//                                                                         the length, or seconds like 2.5s;
//                                                                         --name id saves <ID>.jpg (pack thumbnails)
// Frames are captured with window.__seek(t), so output is exact and independent of machine speed.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const [mode, studio, ...rest] = process.argv.slice(2);
const flag = (name, dflt) => { const i = rest.indexOf('--' + name); return i >= 0 ? rest[i + 1] : dflt; };
if (!['frames', 'meta', 'stills'].includes(mode) || !studio) {
  console.error('usage: node render.mjs frames|meta|stills <studio.html> ...'); process.exit(2);
}

async function loadPlaywright() {
  try { return await import('playwright'); } catch {}
  const root = execSync('npm root -g').toString().trim();
  return createRequire(path.join(root, 'noop.js'))('playwright');
}
function chromiumPath() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  try {
    const dirs = fs.readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => b.split('-')[1] - a.split('-')[1]);
    for (const d of dirs) { const p = path.join(base, d, 'chrome-linux', 'chrome'); if (fs.existsSync(p)) return p; }
  } catch {}
  return undefined; // fall back to the browser Playwright installed itself
}
function threeFile() {
  // a local copy of three.js r170 makes renders independent of the CDN; setup_check.sh fetches one
  const c = [process.env.SMVM_THREE, path.join(HERE, 'engine', 'vendor', 'three.module.js'), path.join(os.homedir(), '.cache', 'smvm', 'three@0.170.0', 'three.module.js')];
  return c.find((p) => p && fs.existsSync(p));
}

const { chromium } = await loadPlaywright();
const browser = await chromium.launch({
  executablePath: chromiumPath(),
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined,
});
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const local = threeFile();
if (local) await page.route('https://cdn.jsdelivr.net/npm/three@0.170.0/**', (r) => r.fulfill({ path: local, contentType: 'application/javascript' }));

async function open(spot) {
  await page.goto('file://' + path.resolve(studio) + '?t=0' + (spot ? '&v=' + spot : ''));
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
}
const grab = (t, q = 0.95) => page.evaluate(([tt, qq]) => { window.__seek(tt); return document.getElementById('out').toDataURL('image/jpeg', qq); }, [t, q]);
const save = (file, dataUrl) => fs.writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));

try {
  if (mode === 'meta') {
    await open();
    const spots = await page.evaluate(() => window.__spots);
    fs.writeFileSync(rest[0] || 'spots.json', JSON.stringify(spots, null, 1));
    console.log(`meta: ${spots.length} spots -> ${rest[0] || 'spots.json'}`);
  } else if (mode === 'frames') {
    const [spot, dir] = rest; const fps = Number(flag('fps', 30));
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    await open(spot);
    const dur = await page.evaluate(() => window.__dur); const n = Math.round(dur * fps);
    for (let i = 0; i < n; i++) save(`${dir}/${String(i).padStart(4, '0')}.jpg`, await grab(i / fps));
    console.log(`${spot}: ${n} frames`);
  } else {
    const dir = rest[0]; fs.mkdirSync(dir, { recursive: true });
    await open();
    const all = (await page.evaluate(() => window.__spots)).map((s) => s.id);
    const ids = flag('spots') ? flag('spots').split(',') : all;
    const at = flag('at', '0.12,0.45,0.8').split(',');
    for (const id of ids) {
      await open(id);
      const dur = await page.evaluate(() => window.__dur);
      for (const a of at) {
        const t = a.endsWith('s') ? parseFloat(a) : parseFloat(a) * dur;
        save(flag('name') === 'id' ? `${dir}/${id}.jpg` : `${dir}/${id}_${t.toFixed(2)}.jpg`, await grab(Math.min(t, dur - 0.001), 0.85));
      }
    }
    console.log(`stills: ${ids.length} spots x ${at.length} -> ${dir}`);
  }
} finally {
  await browser.close();
}
if (errors.length) { console.error('page errors:\n  ' + [...new Set(errors)].join('\n  ')); process.exit(1); }
