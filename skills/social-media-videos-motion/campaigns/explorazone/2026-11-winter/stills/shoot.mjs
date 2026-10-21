// Screenshot the still pages: node shoot.mjs <htmlDir> <outDir> [filter regex]
import { createRequire } from 'module'; import { execSync } from 'child_process'; import fs from 'fs'; import path from 'path';
async function loadPlaywright() { try { return await import('playwright'); } catch {} const root = execSync('npm root -g').toString().trim(); return createRequire(path.join(root, 'noop.js'))('playwright'); }
const { chromium } = await loadPlaywright();
const [dir, out, filt] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html') && (!filt || new RegExp(filt).test(f))).sort();
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'], proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
for (const f of files) {
  const story = f.includes('_story'); await page.setViewportSize({ width: 1080, height: story ? 1920 : 1350 });
  await page.goto('file://' + path.resolve(dir, f), { waitUntil: 'load', timeout: 120000 });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))); });
  await page.screenshot({ path: path.join(out, f.replace('.html', '.jpg')), type: 'jpeg', quality: 92 });
}
console.log('shot', files.length, 'errors', errs.slice(0, 3));
await browser.close();
