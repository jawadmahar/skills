# Feedback loop: how this skill learns

The skill improves only if feedback is captured, weighed and written back into its files. This page says how.

## Two kinds of feedback

- **Active**: what people say. Requests, praise, complaints, edits, answers to the feedback round. "The rain one looks really good." "There is too much white space."
- **Passive**: what people do and what the numbers show. Which videos get posted or skipped, which are paused early, which they ask for more of, and what Meta measures (hook rate, hold rate, click-through, cost per result).

## When to capture

1. **During any job**: whenever the user comments on output, log it before carrying on. One line is enough.
2. **At delivery**: ask the one-round feedback question (`interview.md`).
3. **After posting**: when the user says "smvm feedback", asks how the videos did, or starts a new job for a brand whose last SMVM videos have been live for five days or more, pull the results (below) before planning anything new.
4. **"smvm evolve"**: consolidate the log into rules now (below).

## Log format

Append to `learnings/feedback-log.md`, newest at the bottom:

```
### 2026-10-18 · Explorazone · half term 2026 · active · director
What: "The rainy-day one looks really good. I want 5 more variations."
Applies to: V02, rain series
Meaning: rain concept is a director favourite; expand the series
Outcome: promoted to rule G4
```
Outcome is one of: promoted to rule X, supports rule X, contradicts rule X, logged only.

## Pulling Meta results

1. Find the ad account (`ads_get_ad_accounts`) and the campaign or ads by name prefix (`ads_get_ad_entities`).
2. Get ad-level results since launch: ad name, spend, impressions, reach, link clicks, results and cost per result, leads and purchases, 3-second video plays, ThruPlays and the 25/50/75/100% video plays. Field names vary; `ads_get_field_context` finds the right ones. Placement (publisher_platform, platform_position) and age breakdowns help explain why.
3. Save the rows as JSON and score them:
   `python3 scripts/score_ads.py out/insights.json --spots out/spots.json --campaign campaign.json --out out/scorecard.tsv`
4. Write `RESULTS.md` in the campaign folder: dates, spend band, top and bottom three, patterns by series, audience, hook, look, music and length, and the decisions taken. Keep exact money figures out of anything stored in a public repository.

How to read the numbers:
- **Hook rate** (3-second plays divided by impressions) shows whether the first 1.5 seconds stop the scroll. Compare within the set first; as a rough guide under 20% is weak and over 30% is strong.
- **Hold rate** (ThruPlays divided by 3-second plays) shows whether the story keeps people. Again compare within the set.
- **Cost per result** is the final judge but needs the most data. Treat anything under about 1,000 impressions or £15 spend per ad as too early.
- Check placement: a video that wins in Reels and loses in Feed is not a loser.

## Turning feedback into learnings

| Signal | What it becomes |
|---|---|
| The director or brand owner states a preference | A rule straight away (confidence: Director). It still yields to brand guidelines. |
| A Meta pattern across two or more ads with enough data | A Hypothesis rule, to test on purpose next time |
| The same pattern again in a later campaign, or across four or more ads | Proven |
| One video's result | Logged only: an anecdote, not a rule |
| Data contradicts a rule twice | Retire it (move it to Retired with the reason) |

Also update the statuses in `concept-library.md` (Director favourite, Proven, Retired). Keep `LEARNINGS.md` short: rules, not stories, about 40 at most; merge similar ones.

## Versions

Bump `metadata.version` and `updated` in SKILL.md, add a `CHANGELOG.md` entry and set "Last consolidated" in LEARNINGS.md.
- Patch (1.0.x): learnings or concept statuses changed
- Minor (1.x.0): new concepts, libraries, scripts, brand profiles or workflow changes
- Major (x.0.0): brand.json or campaign.json format changes that break old campaigns

## Saving changes so everyone gets them

A skill only learns where its files can be written. Use whichever applies:

1. **Claude Code with the skills repository**: edit the files, commit on a branch and open a pull request. Then package the skill (the skill-creator skill's `package_skill.py`, or zip the folder) and give the user the new `.skill` file to re-save and share.
2. **Read-only install** (claude.ai, or a synced copy in a session): write the updated `LEARNINGS.md`, `feedback-log.md` and `CHANGELOG.md`, package the whole skill with those changes as a new `.skill` file, and ask the user to re-save it (claude.ai: Settings, Capabilities, Skills).
3. **Shared Drive log** (best for a team): a Google Drive folder called "SMVM Learnings", shared with everyone who uses the skill. After each feedback event, create a Google Doc in it titled `YYYY-MM-DD <brand> <campaign> <active|passive> <short title>` holding the log entry. At the start of every job, read the docs newer than "Last consolidated". Everyone benefits at once, before the skill is re-packaged. Consolidate into LEARNINGS.md through route 1 or 2 once three or more new entries have built up.

Never store customer or staff personal data, or confidential financials, in learnings. In a public repository, keep learnings qualitative: no spend, no cost-per-lead figures, no account ids.
