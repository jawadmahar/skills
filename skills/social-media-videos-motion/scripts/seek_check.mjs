#!/usr/bin/env node
// Seek every frame of each spot once and report runtime errors, before a long render.
//
//   node seek_check.mjs <studio.html> [--spots W51,W52] [--step 0.1]
//
// Opens one page per spot (a hung spot cannot stall the rest), calls window.__seek(t) from 0 to the spot's
// length and prints the first errors with their times. Exits 1 if any spot fails. Run it at low priority
// (nice -n 19) when a render is already going, and on a copy of the studio file if you may rebuild it.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const [studio, ...rest] = process.argv.slice(2);
const flag = (name, dflt) => { const i = rest.indexOf('--' + name); return i >= 0 ? rest[i + 1] : dflt; };
if (!studio) { console.error('usage: node seek_check.mjs <studio.html> [--spots A,B] [--step 0.1]'); process.exit(2); }
const only = (flag('spots', '') || '').split(',').filter(Boolean), step = parseFloat(flag('step', '0.1'));

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
  return undefined;
}
const three = [process.env.SMVM_THREE, path.join(HERE, 'engine', 'vendor', 'three.module.js'), path.join(os.homedir(), '.cache', 'smvm', 'three@0.170.0', 'three.module.js')].find((p) => p && fs.existsSync(p));

const { chromium } = await loadPlaywright();
const browser = await chromium.launch({ executablePath: chromiumPath(), args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'], proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
const url = 'file://' + path.resolve(studio);
async function openPage(id) {
  const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  if (three) await page.route('https://cdn.jsdelivr.net/npm/three@0.170.0/**', (r) => r.fulfill({ path: three, contentType: 'application/javascript' }));
  await page.goto(url + '?t=0' + (id ? '&v=' + id : ''), { timeout: 120000, waitUntil: 'domcontentloaded' });
  let ready = true; try { await page.waitForFunction(() => window.__ready === true, null, { timeout: 90000 }); } catch { ready = false; }
  return { page, errs, ready };
}
const first = await openPage();
if (!first.ready) { console.error('studio did not become ready:', first.errs.slice(0, 3).join(' | ')); await browser.close(); process.exit(1); }
const spots = (await first.page.evaluate(() => window.__spots.map((s) => [s.id, s.dur]))).filter(([id]) => !only.length || only.includes(id));
await first.page.close();
let failed = 0;
for (const [id, dur] of spots) {
  const { page, errs, ready } = await openPage(id);
  let bad = [];
  if (ready) {
    bad = await Promise.race([
      page.evaluate(([d, st]) => { const out = []; for (let t = 0; t <= d; t += st) { try { window.__seek(t); } catch (e) { out.push(t.toFixed(1) + 's: ' + e.message); if (out.length > 2) break; } } return out; }, [dur, step]),
      new Promise((r) => setTimeout(() => r(['timed out while seeking']), 180000)),
    ]);
  }
  if (!ready || bad.length || errs.length) { failed++; console.log(`${id}: ${ready ? '' : 'page not ready; '}${bad.join(' | ')}${errs.length ? ' | page errors: ' + [...new Set(errs)].slice(0, 2).join(' | ') : ''}`); }
  await page.close();
}
console.log(`seek check: ${spots.length - failed} of ${spots.length} spots clean`);
await browser.close();
process.exit(failed ? 1 : 0);
