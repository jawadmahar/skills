# Changelog

Versions: patch for learnings and concept statuses, minor for new concepts, libraries, scripts and workflow changes, major for brand.json or campaign.json changes that break old campaigns.

## 1.1.0 (19 October 2026)
- Built from the Explorazone winter 2026-27 production: 50 videos (W01 to W50) for Mon 2 Nov 2026 to Sun 10 Jan 2027, delivered in one zip with pack, ad copy, credits and studio.
- New campaign `campaigns/explorazone/2026-11-winter/`: a shared kit (`00-kit.js`) and 35 config-driven formats (frost, dusk, fog, storm, wipers, snow plan, fairy lights, notebook pages, lock screen, search, POV, chat, screen time, camera roll, battery, advent, gift box, receipt, snow globe, knitted jumper, flip countdown, tickets in snow, dossier, retro film, big number, split screen, stopwatch, quiz, specimens, cracker, calendar, chalkboard, family tree, myth stamp, portals). Documented in `engine.md` section 10 and `concept-library.md`.
- Engine: blurred backgrounds and soft photo shadows are cached (same pixels, about 15% faster renders); `build_studio.py` counts `spot({ id })` calls in its duplicate-id check.
- Scripts: `make_adcopy.py`, `make_pack.mjs` and `score_ads.py` accept any id letter (they only knew V ids); ad copy has a Group column and per-video Start and End dates from `meta.start` and `meta.end`; the pack shows each video's run window.
- Explorazone: photo manifest grows to 35 photos (18 from the October half-term statics) and the current "Science Discovery Lab" logo crop; profile records the winter offer and claim steps.
- Learnings: G3 and G5 reworded; new G9 (ask which seasonal moments matter), G10 (kit pattern for big sets), G11 (short legal lines), E5 (no Christmas opening dates), E6 (parents first, grandparents keep about a quarter).
- Music library: 31 new Mixkit tracks recorded with their videos.
- Director feedback, 20 Oct: per-photo focal points (`focus` in brand.json, used by `photo()`, polaroids, photo corners and 3D cards); `fogWipe` accepts `under`; the winter kit's `heroPhoto` shows the whole photo over a blurred fill instead of a 3x cover-fill. Grey, dark Norwich instead of frost and snow; city-centre traffic and ring-road hooks. 17 winter videos re-rendered. New rules G12, E7, E8, E9; E2 reworded; W11 and W31 marked Director favourite.

## 1.0.0 (18 October 2026)
- First version, built from the Explorazone October half-term 2026 production (20 videos with music, pack, ad copy and zip).
- Brand-agnostic engine: brand.json and campaign.json drive copy, colours, fonts, labels and photos; rain, paper and 3D helpers moved into `scripts/engine/lib/`. Renders match the half-term originals pixel for pixel.
- Workflow: brand guidelines first, Meta research, multiple-choice interview, Andromeda diversity matrix, build and review, render, music, checks, delivery, feedback loop.
- Scripts: build_studio, render, render_all, mixkit, mux, check_videos, contact_sheet, make_pack, make_adcopy, make_zip, score_ads, upload_to_drive, setup_check.
- Brand profiles: Explorazone (working), STEMEX, Muffin Break, Cafe UFO (provisional, to fill from their guidelines).
- Learnings seeded from the director's feedback in October 2026.
- Aliases: smvm, social-videos, motion-ads, reels-maker.
