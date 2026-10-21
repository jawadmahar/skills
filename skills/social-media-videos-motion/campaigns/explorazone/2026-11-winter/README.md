# Explorazone, winter 2026-27: buy 2, get the 3rd free

150 videos (W01 to W150) for Instagram and Facebook Reels and Stories and 200 stills (S51 to S150, 4:5 feed and 9:16 story), for Mon 2 Nov 2026 to Fri 12 Feb 2027 (offer ends Fri 12 Feb 2027). W01 to W50 were delivered on 20 October 2026; W51 to W150 and the stills on 21 October 2026, as one zip per run period (period, then Families or Grandparents, then Videos and Stills).

| Group (when to run) | Videos |
|---|---|
| 1 November (2 to 29 Nov) | W01 to W18 |
| 2 Christmas run-up (30 Nov to 20 Dec) | W19 to W34 |
| 3 Christmas holidays (19 Dec to 4 Jan; W35, W38, W39 from 26 Dec) | W35, W37 to W42 |
| 4 New Year and back to school (1 to 10 Jan) | W36, W43 to W50 |

Batch 2 (W51 to W150, 31 for the grandparents ad set): 1 November W51 to W70; 2 Christmas run-up W71 to W92; 3 Christmas holidays W93 to W106 (W95, W96, W98 to W101 and W104 from 26 Dec); 4 New Year and back to school W107 to W118; 5 Late January (11 to 31 Jan) W119 to W136; 6 February, last chance (1 to 12 Feb) W137 to W150. `campaign.json` `series` lists every video by period and ad set.

| Creative series | Videos |
|---|---|
| Rain and winter weather | W01 W02 W03 W04 W05 W17 W26 W32 W42 W46 |
| Notebook | W06 W07 W08 W19 W21 W27 W33 W35 W36 W43 |
| Screens and phones | W09 W10 W13 W29 W37 W39 W40 W41 W49 |
| Christmas | W20 W22 W23 W24 W25 W28 W30 W31 W34 |
| More concepts | W11 W12 W14 W15 W16 W18 W38 W44 W45 W47 W48 W50 |

Ad name prefix: `EXZ_WIN27` (for example `EXZ_WIN27_W07_saturday-sorted`). Audience mix: parents 25 to 44 lead (28), grandparents and three generations (16), friends and family groups and teens (6). Lengths: 12 at 8 s, 30 at 12 s, 8 at 15 s.

## Director feedback (20 Oct 2026)

Favourites: W11 "In my day" and W31 "Operation: Wrapping"; make more like them next time. Norwich winters are grey and dark, not frozen, so W01 became "Grey again", W26 "White Christmas? In Norwich?", W45 went grey and W46 became "Skip the city centre" (traffic, outside the ring road). Full-frame photos now show the whole photo over a blurred fill, with focal points in `brand.json`. 17 videos were re-rendered on 20 Oct.

## How the code is organised

`spots/00-kit.js` is the shared kit (primary text builder, run windows, `spot()`, `endScene()`, snow, cards, stacks and grids). Each of `01-weather.js` to `05-classic.js` defines formats as functions of a config and then one `spot(meta, format, config)` call per video. Batch 2 adds `06-formats2.js` (swatch, map, crossword, bingo, then and now, boarding pass, banking app, calendar), `06b-formats3.js` (magazine, checklist, phone mockup, scrapbook, chart, chat takeover, snap and zoom-through cuts) and one file per run period (`07-p1-nov.js` to `12-p6-feb.js`). See `references/engine.md` section 10.

`stills/` builds the matching stills: `dump_cfg.mjs` exports each spot's format and config from the studio, `make_stills.py` writes a 4:5 and a 9:16 page per spot (layouts in `stills.css`), `shoot.mjs` screenshots them and `stills_copy.py` names them and writes the stills ad copy.

## Rebuild

Photos and the logo are not stored here (see `brands/explorazone/photo-manifest.json`, 35 photos). With them in `assets/`:

```bash
python3 ../../../scripts/build_studio.py . --assets /path/to/assets --out studio.html
python3 ../../../scripts/render_all.py studio.html out --campaign campaign.json --jobs 3
node stills/dump_cfg.mjs "$PWD/studio.html" out/spots-cfg.json
python3 stills/make_stills.py --ids W51-W150 && node stills/shoot.mjs out/stills_html out/stills && python3 stills/stills_copy.py
```

## Results

To be added once the videos have run for a week (`references/feedback-loop.md`): scorecard, top and bottom three, patterns by series, audience, hook and music, and decisions for the late January and February periods.
