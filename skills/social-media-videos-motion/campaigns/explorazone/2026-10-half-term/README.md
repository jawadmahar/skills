# Explorazone, October half term 2026: buy 2, get the 3rd free

20 videos (V01 to V20) for Instagram and Facebook Reels and Stories, for Fri 23 Oct to Sun 1 Nov 2026. Delivered on 18 October 2026 as one zip with the pack PDF, ad copy sheet, music credits and studio.

| Series | Videos |
|---|---|
| Rain series (director favourite) | V02, V11, V12, V13, V14, V15 |
| Notebook series (director favourite) | V04, V16, V17, V18, V19, V20 |
| More concepts | V01, V03, V05, V06, V07, V08, V09, V10 |

Ad name prefix: `EXZ_HT26` (for example `EXZ_HT26_V11_raindrop-race`).

## Rebuild

Photos and the logo are not stored here (see `brands/explorazone/photo-manifest.json`). With them in `assets/`:

```bash
python3 ../../../scripts/build_studio.py . --assets /path/to/assets --out studio.html
python3 ../../../scripts/render_all.py studio.html out --campaign campaign.json
```

## Launch on Meta

Set up on 21 October 2026 with the meta-ads-operator skill (IDs and money are kept out of this repository):
- 21 ads: the 20 videos plus `EXZ_HT26_V02_let-it-rain_thumbB`, the same video with the end-card frame as its cover, for a thumbnail test.
- Two ad sets: families (15 ads) and grandparents 50+ (V04, V05, V09, V11, V14, V17 only), Facebook and Instagram, running to Sat 31 Oct.
- A/B tests planned once live: thumbnail V02 against V02B, hook V12 against V13.
- Button Sign up, linking to the official offer page with `utm_content` set to the video ID.
- "Max 9 per group" added to nine primary texts before launch (learning G9).

## Results

To be added after the half-term run (`references/feedback-loop.md`): scorecard, top and bottom three, patterns by series, audience, hook and music, and decisions.
