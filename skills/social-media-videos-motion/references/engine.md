# The motion engine

## Contents
1. How it works
2. Working folder layout
3. brand.json
4. campaign.json
5. Writing a spot
6. Helper reference
7. Commands
8. Rules that keep renders correct
9. Pitfalls we have hit
10. Big sets: the kit pattern

## 1. How it works

`build_studio.py` stitches `engine/head.html` + `engine/core.js` + the campaign's `lib/` files + its spot files + `engine/main.js` into one HTML file with every photo embedded. Each spot draws one frame for any time `t` on a 1080x1920 canvas (2D, with optional Three.js for 3D). `render.mjs` opens the studio in headless Chromium, calls `window.__seek(t)` for every frame at 30 fps and saves JPEGs; ffmpeg encodes them to H.264. Because frames are pure functions of `t`, renders are exact and independent of machine speed.

The studio also works by itself in a browser: open `studio.html?v=V07` to preview, scrub, toggle the safe-zone overlay or record.

## 2. Working folder layout

```
work/<brand>-<campaign>/            not committed (photos are brand property)
  campaign.json                     settings and copy for this campaign
  spots/01-*.js, 02-*.js            spot code, loaded in this order
  assets/logo.png                   transparent PNG preferred
  assets/photos/<key>.jpg           key = file name, used as IMG.<key>
  music/                            mk_<id>.mp3 and starts.json
  music_map.json                    {"W01": 2, "W02": 480}
  music_credits.json                {"2": {"title": "...", "author": "...", "source": "Mixkit"}}
  out/                              spots.json, silent/, final/, stills/, thumbs/
```
When the campaign is finished, copy `campaign.json`, `spots/`, `music_map.json` and `music_credits.json` (no photos) into `campaigns/<brand>/<yyyy-mm-name>/` in this skill so the next job can learn from it.

## 3. brand.json

```json
{
  "name": "Explorazone",
  "palette": {"navy": "#16223f", "lime": "#b6f542", "red": "#ef4720", "cream": "#fbf5e8", "ink": "#14203a"},
  "roles": {"accent": "lime", "light": "cream", "ink": "ink", "cta": "red", "ctaText": "#fff", "dark": "navy", "paper": "#f5efe2"},
  "fonts": {
    "head": "\"Bricolage Grotesque\", \"Arial Black\", Inter, sans-serif",
    "body": "Inter, system-ui, Arial, sans-serif",
    "hand": "Caveat, \"Comic Sans MS\", cursive",
    "google": ["Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800", "Inter:wght@500;600;700;800"],
    "preload": ["800 100px \"Bricolage Grotesque\"", "700 40px Inter"]
  },
  "copy": {"loc": "BOWTHORPE · NORWICH", "formerly": "Formerly Exploring Science"},
  "labels": {"laser_room": "LASER ROOM"},
  "photoPool": ["laser_room", "roses", "sky_maze"]
}
```
- `roles` drive every shared helper: `accent` (highlights, chips, ticker), `light` (light text and photo borders), `ink` (dark text), `cta` and `ctaText` (button), `dark` and `paper` (pack PDF). A role names a palette entry or holds a hex value.
- `fonts.google` entries are Google Fonts css2 family specs; `preload` lists every face the spots draw with. Canvas text falls back to a system font if a face is not preloaded.
- `copy.footer` (or `loc` plus `formerly`) is the small line under the end-card button.
- `labels` map photo keys to the names shown on photo cards; `photoPool` is the set used for photo strips.

## 4. campaign.json

```json
{
  "brand": "../../brands/explorazone/brand.json",
  "name": "Explorazone winter 2026-27: buy 2, get the 3rd free",
  "slug": "explorazone-winter",
  "adPrefix": "EXZ_WIN27",
  "dates": {"start": "2026-11-02", "end": "2027-02-12"},
  "assets": "assets",
  "libs": ["weather", "paper", "fx3d"],
  "spots": ["spots/01-rain.js", "spots/02-notebook.js"],
  "copy": {
    "offer": "Buy 2, get the 3rd free",
    "maths": ["3 for £36", "6 for £72", "9 for £108"],
    "dates": "Until Fri 12 Feb",
    "terms": "Full terms, exactly as approved.",
    "cta": "Claim your free 3rd ticket",
    "ticker": "BUY 2, GET THE 3RD FREE · 3 FOR £36 · ",
    "ticket": {"price": "£18", "label": "Winter", "freeLine": "The 3rd walks in free"}
  },
  "fonts": {"google": ["Kalam:wght@700"], "preload": ["700 80px Kalam"]},
  "studio": {"title": "Winter Video Studio", "eyebrow": "Winter · Buy 2, get the 3rd free"},
  "series": {"Rain series": ["W01", "W02"], "Notebook series": ["W03"]},
  "slugs": {"W01": "frosty-window"},
  "pack": {"title": "...", "intro": ["..."], "insights": ["..."], "launch": ["..."]}
}
```
Campaign values override brand values (`copy`, `palette`, `roles`, `labels`, `photoPool`). `maths` and `dates` are optional; the end card closes the gap when they are missing. `pack` feeds the PDF pack. Use a fresh id prefix per campaign (V for half term 2026, W for winter, and so on) so ad names never collide.

## 5. Writing a spot

```js
defineSpot({
  id: 'W01', title: 'Frosty window', dur: 12, series: 'Rain series',
  persona: 'Parents 25 to 44, cold weekends', angle: 'Freezing outside, glowing inside',
  style: 'Frost creeps over a window, a hand wipes it clear', hook: '"Minus two. Again."', music: 2,
  meta: { headline: 'Too cold for the park?', primary: 'Hook line.\n\nOffer, dates and key terms.', button: 'Sign up' },
  setup() { /* build offscreen canvases or 3D objects once */ },
  frame(t) {
    const E = 8.4;                                   // end-card start
    if (t < E + 0.4) {
      rainScene(ctx, t);
      logo(72, 262, 250, 1, { align: 'left' });
      words(['Minus two.', '_Again._'], 430, 112, 0.2, t, { color: '#fff', hl: P.teal, shadow: 'rgba(0,0,0,0.5)' });
    }
    if (t > E) endCard(t, E, { bg: () => RAIN_END(t), headline: ['Warm inside.', '_All day._'], fg: '#fff', accent: P.teal });
  },
});
```
Fields: `id`, `title`, `dur` (seconds), `persona`, `angle`, `style`, `hook`, `music` (track id), `meta.headline`, `meta.primary`, optional `series`, `slug`, `meta.button`. They all flow into the studio, the pack and the ad copy sheet, so fill them properly.

## 6. Helper reference

Timing (all pure): `clamp`, `lerp`, `prog(t, a, b)` (0 to 1 between a and b), `smooth`, `easeOutCubic`, `easeInCubic`, `easeInOutCubic`, `easeInOutSine`, `easeOutBack`, `win(t, a, b, fade)` (fade in at a, out by b), `rng(seed)` (seeded random; never use Math.random).

Canvas: `W`, `H`, `ctx`, `IMG.<key>`, `P` (palette), `ROLE`, `COPY`, `HEAD`, `BODY`, `HAND`, `makeCanvas(w, h)`, `rr(g, x, y, w, h, r)`, `fill(colour)`, `vgrad([[0, c1], [1, c2]])`, `vignette(a)`.

| Helper | Use |
|---|---|
| `T(text, x, y, {size, w, fam, color, align, alpha, ls, shadow, stroke, italic, g})` | One line of text |
| `words(lines, cy, size, t0, t, {color, hl, fam, w, stagger, maxW, align, shadow})` | Word-by-word headline; `_wrap words_` in underscores to highlight; shrinks to fit 960 px; returns the last line's y |
| `pill(cx, cy, text, {size, bg, fg, scale, alpha, rot, border})` | Rounded label or button |
| `chipsRow(list, cy, t0, t, {bg, fg, size})` | Row of popping chips (price maths) |
| `photo(img, x, y, w, h, {radius, border, borderColor, zoom, fx, fy, shadow, filter, alpha})` | Cover-fit photo |
| `bgPhoto(img, {filter, alpha})` | Full-bleed blurred background photo |
| `logo(x, y, w, alpha, {align, box, shadow})` | Brand logo; `box` puts it on a white card |
| `wrap(text, maxW, size, weight)` | Split text into lines |
| `photoStrip(t, y, h, {keys, labels, speed, borderColor})` | Drifting row of photo tiles (fills the bottom UI area) |
| `ticker(t, y, {text, bg, fg})` | Scrolling offer band (fills the top UI area) |
| `polaroidAt(img, cx, cy, w, rot, label, k)` | Polaroid with handwritten label |
| `endCard(t, t0, {headline, fg, accent, bg, strip, stripKeys, stripLabels, offer, maths, dates, cta, ctaBg, ctaFg, terms, ticker, logoBox})` | The standard end card: ticker, logo, headline, offer, chips, dates, button, footer, terms, photo strip |
| `tickets()`, `drawTicket`, `flipTicket` | Paid and FREE ticket textures, wording from `COPY.ticket` |
| `getThree()`, `draw3D()`, `texFromCanvas(c)`, `THREE` | Three.js renderer, scene and camera composited onto the canvas |

Libraries (`campaign.json` `"libs"`):
- `weather`: `rainScene(g, t, {drops, alpha})`, `cloudIcon`, `RAIN_END(t)`, `fogWipe(canvas, t, a, b, img)`, `cardSeq(t, cards, y, w, h)`
- `paper`: `makePaper()`, `writeLine`, `writeH(text, x, y, t, a, b, {fam, size, color})`, `strokeReveal(path, p)`, `polaroid`, `tickMark`, `star`, `heart`, `photoCorners`, fonts `SCRIPT`, `PRINT`, `KALAM` (add their Google Fonts to campaign.json)
- `fx3d`: `roundedPhotoCanvas`, `project(vec3)`, `confetti2D(x, y, dt)`, `VS_UV`

## 7. Commands

```bash
S=<skill folder>/scripts
bash $S/setup_check.sh
python3 $S/build_studio.py work/exz-winter --out work/exz-winter/out/studio.html
node $S/render.mjs stills work/exz-winter/out/studio.html work/exz-winter/out/stills --at 1.5s,0.5,0.96
python3 $S/contact_sheet.py work/exz-winter/out/sheet.jpg work/exz-winter/out/stills --safe
python3 $S/render_all.py work/exz-winter/out/studio.html work/exz-winter/out --jobs 3 --campaign work/exz-winter/campaign.json
python3 $S/mixkit.py fetch 2 480 729 --dir work/exz-winter/music && python3 $S/mixkit.py starts --dir work/exz-winter/music
python3 $S/mux.py --silent work/exz-winter/out/silent --music work/exz-winter/music --map work/exz-winter/music_map.json --out work/exz-winter/out/final --prefix explorazone-winter
python3 $S/check_videos.py work/exz-winter/out/final/*.mp4
```
Rendering runs at about 1 to 3 minutes per 12-second spot under software WebGL; run batches in the background and keep `--jobs` at 2 or 3.

## 8. Rules that keep renders correct

- `frame(t)` must depend only on `t`: no `Math.random`, `Date`, timers or state carried between frames. Precompute in `setup()` or with `rng(seed)`.
- Every photo key used must exist in `assets/photos`; the build stops if one is missing.
- Every font face drawn must be in a `preload` list.
- Top-level names are shared by all files in a campaign: a duplicate `function` or `const` name breaks the whole studio.
- Keep text between y 270 and y 1248; fill the top and bottom with imagery.

## 9. Pitfalls we have hit

- Ad copy naming photos that had been swapped out: re-read copy after any photo change.
- Polaroids and photos drawn over handwriting: check stills at the moments text is being written.
- 3D objects drifting behind end-card text: move the camera path or fade the 3D layer before the end card.
- Stretching an offscreen canvas for a ripple: draw slices directly instead (`rippleRect` in V15).
- Headless MediaRecorder output is WebM with drifting timing: always render frames with `render.mjs`, never record for delivery.
- Text placed for one font looked wrong when the font failed to load: preload every face and check the first stills.
- A background command in Claude Code on the web is stopped after 2 hours. For 40+ videos, render in batches with `--ids` (or restart the rest with `--ids`); finished MP4s in `out/silent` are kept.
- `mixkit.py starts` can pick a soft passage; `check_videos.py` then flags the loudness. Measure 12-second windows with `ffmpeg -ss N -t 12 -i track.mp3 -af ebur128 -f null -`, set a livelier start in `music/starts.json` and re-mux that video only.

## 10. Big sets: the kit pattern

For more than about 15 videos, write each look once as a format function and make every video a short config (rule G10). The winter 2026-27 campaign is the worked example (`campaigns/explorazone/2026-11-winter/spots/`):

- `00-kit.js` holds what every video shares: `primary(lead, more)` builds the Meta primary text with the offer, end wording and terms; `RUN` and `PERIOD` hold each run window; `spot(meta, format, config)` calls `defineSpot` and puts the run dates into `meta.start`, `meta.end` and `meta.period` (the ad copy sheet and pack read them); `endScene(t, E, headline, kind)` wraps `endCard` with backgrounds (`snow`, `navy`, `rain`, `red`, `green`, `royal`, `cream`, `photo`); plus `snow()`, `card()`, `labelPill()`, `dropStack()`, `mosaic()`, `heroPhoto()`, `shade()` and `hook()`.
- A format is `function nameFmt(c) { return { setup() {...}, frame(t) {...} }; }`. It reads everything from `c` (copy lines, photo keys, timings, `c.dur`) and ends with `endScene`, so the end card starts at `endAt(dur)` (3.6 seconds before the end).
- `noteFmt` (`02-notebook.js`) is a generic page player: a paper kind (`lined`, `santa`, `diary`, `squared`, `notepad`, `planner`, `report`, `postcard`, `card`, `fridge`) plus a timed list of items (`w` handwriting, `strike`, `circle`, `tick`, `pol`, `corners`, `star`, `heart`, `stamp`, `sticky`, `magnet`, `card`, `pic`, `print`) and optional `flip` with a `front` drawer.
- `build_studio.py` counts `spot({ id: ... })` calls as well as `defineSpot`, so the duplicate-id check still works.
- Before a long render, seek every frame once to catch runtime errors: an exception at an unsampled moment otherwise shows up only as a failed render after an hour.

Group the campaign's `series` by when the videos run (for example one group per month) when the person posting needs a schedule; each spot keeps its creative series in its own `series` field, and the ad copy sheet shows both (Group and Series columns).
