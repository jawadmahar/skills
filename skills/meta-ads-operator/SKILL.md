---
name: meta-ads-operator
description: "Meta Ads Operator, also called MAO (aliases: mao, /mao, ads operator, ads-operator). Runs Mahar Group's paid Facebook and Instagram advertising end to end through the Meta Ads connector, so the business does not depend on one person: uploads videos and images, builds campaigns, ad sets and ads from a creative pack, puts each creative in the right audience's ad set, asks for the daily budget whenever none is agreed, publishes only with explicit approval and checks it went live, sets up A/B tests, monitors on a schedule, pauses clear losers and then reports, and hands what the connector cannot do to the right person. Use it whenever someone wants Facebook or Instagram ads posted, launched, paused, budgeted, tested, checked or reported, wants Claude to do Musa's Ads Manager work, or says 'launch the drop', 'post these videos as ads', 'how are the ads doing' or any alias, even without the word skill. Pairs with social-media-videos-motion (smvm), which makes the videos."
compatibility: "Needs the Meta Ads connector (draft mode is fine). Optional: GitHub for a temporary media link, Google Drive for the budget log, Claude Code routines (send_later, create_trigger) for scheduled checks, Python 3 with Pillow and numpy for the helper scripts."
metadata:
  version: "1.0.1"
  updated: "2026-10-21"
  aliases: "mao, ads-operator"
  owner: "Mahar Group Operations"
  pairs-with: "social-media-videos-motion"
---

# Meta Ads Operator (MAO)

Everything a media buyer does in Ads Manager, done through the Meta Ads connector with the same care: right creative, right audience, agreed budget, verified launch, steady monitoring. "mao", "/mao", "ads operator" and "ads-operator" all mean: run this skill. It works for any of our brands and any creative pack, and it is written so a new team member, or a new Claude session, can pick it up cold.

## What matters most

1. **Money moves only with a yes.** Publishing, raising a budget, extending an end date or switching paused ads back on spends real money. Do it only when the director has said yes in this conversation, or in a standing instruction for this exact campaign (for example "£X a day until 31 Oct"). Pausing to protect money is the exception: see rule 4.
2. **Right creative, right audience, right time.** A creative made for one audience goes only in that audience's ad set: grandparent creatives in the grandparents ad set, never in an ad set aimed at parents. A creative made for a later season waits for its window: no January ads in November.
3. **Verify, never assume.** "PUBLISHING" means handed over, not live. Read back every launch, pause and budget change before reporting it, and say plainly what is live and what is not.
4. **Pause, then tell.** While monitoring, pause clear losers yourself and tell the director straight after, with the numbers. Never raise spend, extend dates or unpause without asking.
5. **The repository is public.** Account, Page, Instagram and ad IDs, budgets, spend and cost per result never go into a commit. They live in the conversation, in routine prompts and in private Drive files.

## The budget gate (every run)

Run this first, every time the skill is called and every time a scheduled check fires:
- Find the agreed daily budget for the campaign and period: the conversation, the routine prompt, or the "Meta ads budget log" Google Sheet (private, in the director's Drive).
- If there is none, or the agreed period has ended, ask with the multiple-choice tool before anything else (`references/interview.md`, budget round). Record the answer in the budget log: date, campaign, ad set split, amount per day (net of VAT), until when, who agreed. Without the Drive connector, repeat it back in chat and put it in any routine prompt you create.
- On a scheduled run with nobody to ask: never extend or raise anything. Let ad sets end on their date, pause only to protect money, and report.

## Workflow

### 1. Get oriented
- Read `learnings/LEARNINGS.md` and the brand's notes in `references/brands.md`. For anything about the creative itself, also read the SMVM learnings.
- Find the ad account and Page with `ads_get_ad_accounts` and `ads_get_ad_account_pages` rather than from memory. Check the account is queryable, and note its currency and time zone.
- List what is live now (campaigns and ad sets with delivery status, budget and end date; status alone still says ACTIVE after an end date) so new work does not collide with or duplicate someone else's, such as Musa's campaigns. Mention anything odd you notice, for example an old offer still running.

### 2. Intake
- The usual input is an SMVM delivery: videos, the pack PDF and the ad copy sheet (ad name, audience, headline, primary text, button, dates). Other creatives work too, with the same columns.
- Make the launch plan: one row per ad with ad name, file, audience, ad set, start and end, link and button. `scripts/build_ad_specs.py` builds it and refuses rows that have no matching ad set, fall outside the window being launched, miss required offer terms or contain dashes.

### 3. Interview
Multiple-choice rounds from `references/interview.md`: the budget gate if needed, then launch (publish now or drafts for Musa, landing link, button, AI label), then tests. Skip anything already answered and state it as an assumption. Test every landing link before using it: it must load (HTTP 200) and show the sign-up or booking form. If a link someone gave you fails, say so and use the brand's official offer page instead.

### 4. Get the media into the ad account
`references/media.md`: upload by public URL (a temporary GitHub link, with the director's OK, removed afterwards), the local upload tool where it is available, or Musa uploads in Ads Manager. Wait until every video is ready. Keep your own map of file to ad video ID and image hash; Meta's read-backs do not give these back reliably.

### 5. Build as drafts
`references/meta-recipes.md` has the exact calls. Campaign, then ad sets (budget, end date, audience, frequency cap), then one ad per creative with an inline creative spec: video ID plus thumbnail image hash, never both an image URL and a hash. Names follow `PREFIX_ID_slug`, the same as the ad copy sheet, so results trace back to each video.

### 6. Check the draft
Save the draft listing and run `scripts/check_drafts.py`: budgets and split, end dates, ages, audience mapping, ads per ad set, validation errors. Fix everything before asking to publish. Delete broken drafts rather than leaving them for someone to publish by mistake.

### 7. Publish and verify
With approval, publish the campaign, its ad sets and ads together (`ads_activate_entity` with every ID in `object_ids`). Then read back live objects and the activity log. If only part of it appears, retry the missing objects once; if they still do not appear after a few minutes, stop calling publish. The director or Musa opens the campaign in Ads Manager and clicks Review and publish, which shows any blocking message. Report exactly what is live.

### 8. Test
Creative A/B tests with `ads_experiment_check_eligibility` then `ads_experiment_abtest_create_test`: one variable per test (thumbnail: same video, different cover; hook: same offer, different opening), cells are live ad IDs, start tomorrow, end with the campaign. Never pause a cell while its test runs.

### 9. Monitor on a schedule
`references/monitoring.md`: campaigns up to two months get a check after five to seven days and an end review; longer campaigns get a weekly routine. Each run: budget gate, results, score (`smvm` `score_ads.py`), pause clear losers then tell, short report.

### 10. Report and learn
A short report to the director (what is live, spend pace, top three, what you paused, what needs a decision) and a ready-to-paste note for Musa when he needs to act. Log operator lessons in `learnings/LEARNINGS.md`; send creative lessons to the SMVM feedback log.

## What stays with people for now
The Meta Ads connector does not publish organic posts, answer comments or DMs, change Business Settings or fix billing. `references/gaps.md` lists each gap, who covers it and how to close it.

## House style
- British English, no em dashes or en dashes, "Explorazone" with a capital E and one word, dates like "Fri 23 Oct".
- Budgets in Meta are net of VAT; say so when quoting them. Meta's budget fields are in pence.
- Start replies with the date and time (organisation rule). Keep reports short; numbers in a table only when there are more than three.

## Files

| Path | What it is |
|---|---|
| `references/meta-recipes.md` | Exact connector calls for every task, and the pitfalls we have hit |
| `references/interview.md` | Multiple-choice question bank: budget gate, launch, tests, monitoring |
| `references/monitoring.md` | Check cadence, pause rules, routines, report template |
| `references/media.md` | Getting videos and thumbnails into the ad account |
| `references/brands.md` | Audiences, links, terms and cautions per brand (no IDs) |
| `references/gaps.md` | What the connector cannot do yet, who covers it, how to close it |
| `scripts/build_ad_specs.py` | Ad copy sheet plus media maps to checked inline ad specs |
| `scripts/match_thumbs.py` | Matches Meta image hashes to local thumbnail files by picture |
| `scripts/check_drafts.py` | Summarises a saved draft listing and flags problems |
| `scripts/media_drop.sh` | Temporary public GitHub branch for media: push, list URLs, delete |
| `learnings/LEARNINGS.md` | Operator rules learned in production |
| `CHANGELOG.md` | Version history |
