#!/usr/bin/env node
// Builds the A4 PDF pack that travels with the videos: launch notes, offer wording, one card per video
// (key frame, audience, angle, hook, music, headline, primary text, file name) and music credits.
//
//   node make_pack.mjs --campaign campaign.json --spots OUT/spots.json --thumbs OUT/thumbs \
//        --map music_map.json --credits music_credits.json --out OUT/pack.pdf [--files OUT/final]
//
// thumbs/ holds one <ID>.jpg key frame per video (render.mjs stills, renamed). Optional text comes from
// campaign.json "pack": { "title", "subtitle", "intro": [..], "insights": [..], "launch": [..] }.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { execSync } from 'child_process';

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, v, i, all) => (v.startsWith('--') ? [...acc, [v.slice(2), all[i + 1]]] : acc), []));
const need = ['campaign', 'spots', 'out'];
for (const k of need) if (!args[k]) { console.error(`missing --${k}`); process.exit(2); }
const read = (p, d) => (p && fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : d);
const camp = read(args.campaign);
const brand = read(path.resolve(path.dirname(args.campaign), camp.brand), {});
const spots = read(args.spots);
const mmap = read(args.map, {});
const credits = read(args.credits, {});
const pal = { ...(brand.palette || {}) };
const role = (k, d) => { const v = (brand.roles || {})[k]; return pal[v] ?? v ?? d; };
const C = { dark: role('dark', '#16223f'), accent: role('accent', '#b6f542'), cta: role('cta', '#ef4720'), paper: role('paper', '#f5efe2'), ink: role('ink', '#14203a') };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/£/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const files = {};
if (args.files && fs.existsSync(args.files)) for (const f of fs.readdirSync(args.files)) { const m = f.match(/(V\d+)-/); if (m && f.endsWith('.mp4')) files[m[1]] = f; }
const thumb = (id) => { const p = args.thumbs && path.join(args.thumbs, id + '.jpg'); return p && fs.existsSync(p) ? 'data:image/jpeg;base64,' + fs.readFileSync(p).toString('base64') : ''; };
const P = camp.pack || {};
const copy = camp.copy || {};
const series = camp.series && Object.keys(camp.series).length ? Object.entries(camp.series) : [['Videos', spots.map((s) => s.id)]];
const byId = Object.fromEntries(spots.map((s) => [s.id, s]));
const prefix = camp.adPrefix || (camp.slug || 'AD').toUpperCase();
const total = spots.reduce((a, s) => a + s.dur, 0);
const list = (xs) => (xs && xs.length ? `<ul>${xs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '');
const launch = P.launch || [
  'Put every video in one ad set with broad targeting and Advantage+ placements, so Meta can match each creative to the people it suits.',
  'Upload each video as its own ad and keep the ad name from the sheet, so results can be traced back to the creative.',
  'Let them run 5 to 7 days before judging. Pause anything with a weak hook rate and low results, and keep the winners running.',
  'Refresh with new concepts every 2 to 4 weeks rather than small edits of the same video.',
];
const card = (s) => {
  const t = String(mmap[s.id] ?? s.music ?? ''); const c = credits[t] || {};
  const slug = (camp.slugs || {})[s.id] || s.slug || slugify(s.title);
  return `<article class="card">${thumb(s.id) ? `<img src="${thumb(s.id)}" alt="${s.id} key frame">` : '<div class="ph"></div>'}<div>
    <h3><span>${s.id}</span> ${esc(s.title)} <em>${s.dur}s</em></h3>
    <dl><dt>Audience</dt><dd>${esc(s.persona)}</dd><dt>Angle</dt><dd>${esc(s.angle)}</dd><dt>Hook</dt><dd>${esc(s.hook)}</dd>
    <dt>Music</dt><dd>${t ? `${esc(c.title || '?')} by ${esc(c.author || '?')} (${esc(c.source || 'Mixkit')} #${esc(t)})` : 'None'}</dd>
    <dt>Headline</dt><dd><strong>${esc(s.meta?.headline)}</strong></dd></dl>
    <p class="primary">${esc(s.meta?.primary)}</p>
    <p class="file">Ad name: ${esc(`${prefix}_${s.id}_${slug}`)}${files[s.id] ? ` · File: ${esc(files[s.id])}` : ''}</p></div></article>`;
};
const used = [...new Set(spots.map((s) => String(mmap[s.id] ?? s.music ?? '')).filter(Boolean))];
const fams = [...new Set([...(brand.fonts?.google || [])])].filter((f) => !/Caveat|Kalam|Patrick|Dancing/.test(f));
const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8">
${fams.length ? `<link href="https://fonts.googleapis.com/css2?${fams.map((f) => 'family=' + f).join('&')}&display=swap" rel="stylesheet">` : ''}
<style>
  @page { size: A4; margin: 13mm 13mm 14mm; }
  * { box-sizing: border-box; }
  body { font: 9.4pt/1.42 Inter, Arial, sans-serif; color: ${C.ink}; margin: 0; }
  .head { font-family: ${brand.fonts?.head || 'Inter, sans-serif'}; }
  .band { background: ${C.dark}; color: #fff; border-radius: 10px; padding: 14px 18px; display: flex; justify-content: space-between; gap: 16px; align-items: center; }
  .band h1 { font: 800 20pt/1.05 ${brand.fonts?.head || 'Inter, sans-serif'}; margin: 2px 0 4px; }
  .band p { margin: 0; opacity: .85; }
  .eyebrow { color: ${C.accent}; font-weight: 800; font-size: 8pt; letter-spacing: .08em; text-transform: uppercase; }
  .pill { background: ${C.cta}; color: #fff; font-weight: 800; border-radius: 99px; padding: 6px 12px; white-space: nowrap; font-size: 9pt; }
  h2 { font: 800 12.5pt/1.2 ${brand.fonts?.head || 'Inter, sans-serif'}; margin: 13px 0 6px; color: ${C.dark}; }
  ul { margin: 0; padding-left: 17px; } li { margin: 0 0 4px; }
  .terms { background: ${C.paper}; border-radius: 8px; padding: 8px 10px; font-size: 8.6pt; }
  table { width: 100%; border-collapse: collapse; font-size: 8.4pt; } th, td { text-align: left; padding: 3.5px 6px; border-bottom: 1px solid #e3ddd0; vertical-align: top; } th { background: ${C.paper}; }
  .group { break-before: page; }
  .card { display: grid; grid-template-columns: 30mm 1fr; gap: 10px; padding: 8px 0; border-bottom: 1px solid #e3ddd0; break-inside: avoid; }
  .card img, .ph { width: 30mm; aspect-ratio: 9/16; border-radius: 6px; display: block; background: #ddd; object-fit: cover; }
  .card h3 { margin: 0 0 4px; font: 800 12pt/1.2 ${brand.fonts?.head || 'Inter, sans-serif'}; }
  .card h3 span { background: ${C.dark}; color: ${C.accent}; border-radius: 5px; padding: 1px 6px; font-size: 10pt; margin-right: 4px; }
  .card h3 em { font-style: normal; color: #59627a; font-size: 9pt; font-family: Inter, sans-serif; font-weight: 600; }
  dl { display: grid; grid-template-columns: 19mm 1fr; gap: 1px 8px; margin: 0 0 4px; font-size: 8.6pt; } dt { color: #59627a; font-weight: 600; } dd { margin: 0; }
  .primary { white-space: pre-wrap; background: ${C.paper}; border-radius: 6px; padding: 6px 8px; margin: 4px 0; font-size: 8.4pt; }
  .file { margin: 0; font-size: 7.8pt; color: #59627a; }
  .note { font-size: 8pt; color: #59627a; }
</style></head><body>
<header class="band"><div><div class="eyebrow">${esc(P.eyebrow || brand.name || '')}</div><h1>${esc(P.title || camp.name)}</h1>
<p>${esc(P.subtitle || `${spots.length} videos · ${Math.round(total)}s in total · 9:16 for Reels and Stories`)}</p></div>
<div class="pill">${esc(copy.offer || '')}</div></header>
${P.intro ? `<h2>What is in this pack</h2>${list(P.intro)}` : ''}
${P.insights ? `<h2>What the data says</h2>${list(P.insights)}` : ''}
<h2>How to launch</h2>${list(launch)}
${copy.offer ? `<h2>Offer wording (use exactly)</h2><div class="terms"><strong>${esc(copy.offer)}</strong>${copy.maths ? ` · ${esc(copy.maths.join(' · '))}` : ''}${copy.dates ? `<br>${esc(copy.dates)}` : ''}<br>${esc(copy.terms || '')}</div>` : ''}
${series.map(([name, ids]) => `<section class="group"><h2>${esc(name)}</h2>${ids.filter((i) => byId[i]).map((i) => card(byId[i])).join('')}</section>`).join('')}
<section class="group"><h2>Music credits</h2><table><tr><th>Track</th><th>Artist</th><th>Source</th><th>Used in</th></tr>
${used.map((t) => { const c = credits[t] || {}; return `<tr><td>${esc(c.title || '?')}</td><td>${esc(c.author || '?')}</td><td>${esc(c.source || 'Mixkit')} #${esc(t)}</td><td>${spots.filter((s) => String(mmap[s.id] ?? s.music) === t).map((s) => s.id).join(', ')}</td></tr>`; }).join('')}</table>
<p class="note">${esc(P.licence || 'Mixkit tracks are used under the Mixkit Free Licence: commercial use including social media ads is allowed, no attribution is required, broadcast TV and radio are excluded, and tracks may not be redistributed on their own.')}</p></section>
</body></html>`;

let chromium;
try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = createRequire(path.join(execSync('npm root -g').toString().trim(), 'noop.js'))('playwright')); }
const exe = (() => { const b = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers'; try { const d = fs.readdirSync(b).filter((x) => /^chromium-\d+$/.test(x)).sort((x, y) => y.split('-')[1] - x.split('-')[1])[0]; const p = d && path.join(b, d, 'chrome-linux', 'chrome'); return p && fs.existsSync(p) ? p : undefined; } catch { return undefined; } })();
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || exe, proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.pdf({ path: args.out, format: 'A4', printBackground: true, margin: { top: '13mm', bottom: '14mm', left: '13mm', right: '13mm' } });
await browser.close();
console.log(`pack: ${args.out} (${spots.length} videos)`);
