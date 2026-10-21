// Dump each spot's format and config for the stills builder: node dump_cfg.mjs <studio.html> <out/spots-cfg.json>
import { createRequire } from 'module'; import { execSync } from 'child_process'; import fs from 'fs'; import path from 'path';
async function loadPlaywright() { try { return await import('playwright'); } catch {} const root = execSync('npm root -g').toString().trim(); return createRequire(path.join(root, 'noop.js'))('playwright'); }
const { chromium } = await loadPlaywright();
const [studio, out] = process.argv.slice(2);
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'], proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
await page.goto('file://' + studio + '?v=W01&t=0', { timeout: 180000, waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__ready, null, { timeout: 120000 });
const data = await page.evaluate(() => { const o = {}; for (const s of window.__spots) o[s.id] = { ...s, ...window.__spotCfg[s.id] }; return JSON.parse(JSON.stringify(o)); });
fs.writeFileSync(out, JSON.stringify(data, null, 1)); console.log('spots', Object.keys(data).length);
await browser.close();
