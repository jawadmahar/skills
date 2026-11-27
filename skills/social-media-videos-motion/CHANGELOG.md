# Changelog

Versions: patch for learnings and concept statuses, minor for new concepts, libraries, scripts and workflow changes, major for brand.json or campaign.json changes that break old campaigns.

## 1.0.1 (21 October 2026)
- `make_adcopy.py` checks every primary text against `requiredTerms` in campaign.json and exits with code 1 when a term is missing (learning G9).
- Half-term campaign: `requiredTerms` added, and "Max 9 per group" added to the nine primary texts that lacked it (V04, V09, V10, V13, V15, V16, V17, V19, V20), matching what went to Meta.
- Delivery points to the new meta-ads-operator skill (alias mao) for posting the ads.

## 1.0.0 (18 October 2026)
- First version, built from the Explorazone October half-term 2026 production (20 videos with music, pack, ad copy and zip).
- Brand-agnostic engine: brand.json and campaign.json drive copy, colours, fonts, labels and photos; rain, paper and 3D helpers moved into `scripts/engine/lib/`. Renders match the half-term originals pixel for pixel.
- Workflow: brand guidelines first, Meta research, multiple-choice interview, Andromeda diversity matrix, build and review, render, music, checks, delivery, feedback loop.
- Scripts: build_studio, render, render_all, mixkit, mux, check_videos, contact_sheet, make_pack, make_adcopy, make_zip, score_ads, upload_to_drive, setup_check.
- Brand profiles: Explorazone (working), STEMEX, Muffin Break, Cafe UFO (provisional, to fill from their guidelines).
- Learnings seeded from the director's feedback in October 2026.
- Aliases: smvm, social-videos, motion-ads, reels-maker.
