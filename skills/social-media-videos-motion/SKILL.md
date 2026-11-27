---
name: social-media-videos-motion
description: "Social Media Videos Motion, also called SMVM (aliases: smvm, /smvm, social videos, motion ads, reels maker). Plans, builds, renders and delivers 9:16 motion videos with licensed music for Instagram and Facebook Reels and Stories, for any brand: Explorazone, STEMEX, Muffin Break, Cafe UFO or a new one. It finds and follows the brand's own guidelines and campaign brief first, runs a short multiple-choice interview, designs a creatively diverse set for Meta's Andromeda ad delivery, renders MP4s with a code-driven motion engine, writes the ad copy, zips everything for the team and improves itself from feedback and Meta results. Use it whenever someone wants social media videos, Reels, Stories, motion graphics or animated ads, video ad variations, a creative refresh, or promo videos for an offer, season or holiday, or says any alias, even without the word skill. Also use it to log feedback on past videos or to review how posted videos performed on Meta."
compatibility: "Rendering needs Node 18+, Playwright with Chromium, ffmpeg and Python 3 with numpy and Pillow, plus internet for fonts and music (Claude Code on the web has all of these). Planning, copy and feedback work anywhere. Optional connectors: Meta Ads, Google Drive."
metadata:
  version: "1.0.1"
  updated: "2026-10-21"
  aliases: "smvm, social-videos, motion-ads, reels-maker"
  owner: "Mahar Group Operations"
---

# Social Media Videos Motion (SMVM)

Short, scroll-stopping 9:16 videos that look as if the brand made them, from brief to finished MP4s, and a little better every time the skill is used. It works for any brand. "smvm", "/smvm", "social videos", "motion ads" and "reels maker" all mean: run this skill.

## What matters most

1. **The brand's own guidelines come first.** A clever video that is off-brand is a failure, and for a franchise it can breach the franchise agreement. If the guidelines or the campaign brief conflict with anything in this skill, learnings included, follow them and say where they differed.
2. **Read the learnings before planning.** `learnings/LEARNINGS.md` holds what earlier campaigns taught us. It is the reason the output improves over time; skipping it repeats old mistakes.
3. **Interview before producing.** Two or three rounds of multiple-choice questions take two minutes and prevent the expensive errors: wrong offer, wrong dates, wrong audience.
4. **Diversity beats polishing one idea.** Meta's Andromeda delivery groups look-alike ads and treats them as one, so ten tweaks of one idea reach one audience. Every video needs its own audience, hook, format, look and music.
5. **Close the loop.** Every comment, choice and Meta result is feedback. Log it, and turn patterns that repeat into rules.

## Workflow

### 1. Get oriented
- Read `learnings/LEARNINGS.md` (Global plus the brand's section) and the latest entries in `learnings/feedback-log.md`.
- If the Google Drive connector is available, read any entries in the shared "SMVM Learnings" folder that are newer than the "Last consolidated" date in LEARNINGS.md (`references/feedback-loop.md`).
- If you will render, run `bash scripts/setup_check.sh`. Where rendering is not possible (for example plain Claude chat without a browser), still plan, write the copy and build the studio HTML, which previews every video and has a Record button, and say plainly that final MP4s need Claude Code.

### 2. Brand and guidelines first
Follow `references/brand-discovery.md`. In short: confirm the brand (ask if it is unclear, since our businesses share audiences but not voices), then look for brand guidelines and the campaign brief in the conversation and project files, installed brand skills, Google Drive, this skill's `brands/<brand>/` profile, and finally the website and the brand's live Meta ads. Record what you found, with sources and dates, in `brands/<brand>/brand.json` and `profile.md`. Muffin Break is a franchise: the franchisor's rules apply and posts may need their approval.

### 3. Research what already works
If the brand advertises on Meta, pull the last 90 days at ad level with the Meta Ads connector: best and worst ads by cost per result, ages, placements, offers and formats. If earlier SMVM videos have been posted, score them first with `scripts/score_ads.py` (step 9). Summarise in three to six bullets; this shapes the interview and the plan.

### 4. Interview
Use the multiple-choice question tool: two or three rounds, up to four questions each, recommended option first. The question bank is in `references/interview.md`. Skip what the guidelines, brief or user already answered, and state those as assumptions instead. Never guess the offer, prices, dates or terms; confirm them.

### 5. Plan a diverse set
Use `references/creative-playbook.md` (structure, hooks, safe zones, Andromeda) and `references/concept-library.md` (proven concepts, with code you can copy). Write a plan table: ID, series, concept, audience, hook (the first 1.5 seconds), look, photos, music mood, length. No two rows should share the same audience, hook and look. Show the table, then carry on unless the user wants changes.

### 6. Build and review
Follow `references/engine.md`: set up the campaign folder, write the spots (start from the closest proven concept), run `scripts/build_studio.py`, render stills, make a contact sheet with `scripts/contact_sheet.py` and look at it (Read the JPEG). Fix and repeat until clean. Look for text in the Reels UI areas, overlaps, empty bands, copy naming an attraction that is not shown, and wrong dates or prices.

### 7. Render, add music, check
`scripts/render_all.py` (run big batches in the background), `scripts/mixkit.py` to search, fetch and trim music, `scripts/mux.py`, `scripts/check_videos.py`, then a contact sheet of the finished files. Music rules are in `references/music.md`: one licensed track per video, matched to its mood, with credits recorded.

### 8. Deliver
Follow `references/delivery.md`: pack PDF (`scripts/make_pack.mjs`), ad copy sheet (`scripts/make_adcopy.py`, tab-separated for Google Sheets), music credits, README, studio HTML and zips (`scripts/make_zip.py`, as few as possible). For Google Drive, use `scripts/upload_to_drive.py` when Drive secrets are set; otherwise create the folder with the Drive connector and hand the zips over in chat for the user to drop in. Ad names follow `PREFIX_ID_slug` so results can be traced back to each creative later. To post the ads on Meta, hand over to the `meta-ads-operator` skill (alias `mao`), which takes this delivery as its input.

### 9. Feedback and evolution
Follow `references/feedback-loop.md`:
- At delivery, ask one quick multiple-choice round: favourites, and what to change.
- Log every piece of feedback in `learnings/feedback-log.md` (and the shared Drive folder when available). Active feedback is what people say; passive feedback is what they do (post, pause, ask for more of) and what Meta measures.
- After posting, once each ad has roughly a week and 1,000 impressions, pull results, run `scripts/score_ads.py` and log the findings in the campaign folder.
- Promote a pattern to a rule in `LEARNINGS.md` when it holds across two or more videos or the director states it as a preference; retire rules the data contradicts. Bump the version here and in `CHANGELOG.md`.
- Save the change: commit to the skills repo when you have it, and give the user a fresh `.skill` package to re-save and share with the team.

## House style

- British English. No em dashes or en dashes anywhere, on screen or in copy (the build refuses them); use a hyphen, comma or full stop.
- Plain, warm and confident. No corporate jargon. Consumer prices include VAT.
- On-screen text in short beats of up to about seven words, large type, readable with the sound off.
- The organisation's standing instructions (reply format, brand spellings such as Explorazone) apply on top of this skill.

## Legal basics (UK)
Prices, "free" claims, promotions, closing dates, children, food advertising and music rights are covered in `references/compliance-uk.md`. Read it before writing any offer. When unsure, flag it rather than guess.

## Files

| Path | What it is |
|---|---|
| `scripts/` | Render pipeline and helpers; every script has `--help` |
| `scripts/engine/` | Studio engine: `core.js` helpers, `lib/` shared building blocks (weather, paper, fx3d) |
| `brands/<brand>/` | `brand.json` (palette, fonts, labels) and `profile.md` (voice, guideline sources, assets) |
| `campaigns/<brand>/<campaign>/` | Finished campaigns with their spot code: worked examples and the place for results |
| `references/` | The detail behind each step |
| `learnings/` | `LEARNINGS.md` (current rules) and `feedback-log.md` (raw feedback) |
| `CHANGELOG.md` | Version history |
