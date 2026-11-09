# Changelog

Versions: patch for learnings and wording, minor for new recipes, scripts and workflow steps, major for changes that break saved launch settings.

## 1.1.0 (9 November 2026)
From a full review of the first three weeks.
- New script `score_live_ads.py`: scores live video ads on quarter-watched and ThruPlay rates and applies the pause rule (enough data, bottom quarter on both, clearly below the rest of the ad set, not out-clicking it, never below the floor of live ads). Replaces sums done by hand.
- Monitoring: the pause rule now uses measures the connector reports per ad; every check reads the whole account's money and reports what a lead and a link click cost; the first check of a launch reads one ad per ad set in full; a fault found twice is fixed as drafts, not reported a third time.
- Recipes: read what a live ad really contains (duplicate as a draft), fix a live ad's copy or link, clear stale drafts, and smaller result reads.
- Brand notes: Explorazone offer page address and tracking tags; a directions button does not suit a sign-up offer.
- Learnings O16 to O23.

## 1.0.3 (6 November 2026)
- Learnings O13 to O15: video ad links are not readable through the creative list; read the activity log for other people's changes; check every ad's copy when someone else builds from a pack.

## 1.0.2 (21 October 2026)
- Gaps: GHL Social Planner and Conversations as the route for organic posts and DMs; Lead Ads terms now accepted for Explorazone; the connector's Instagram list stays empty even when linked.
- Brand notes: Explorazone's Instagram is @explorazonelab. Learning O9 confirmed.

## 1.0.1 (21 October 2026)
- Learning O12: judge "running" by delivery status and end date, never by status or effective status, and re-check before reporting.

## 1.0.0 (21 October 2026)
- First version, built from launching the Explorazone October half-term videos through the Meta Ads connector: 21 ads in two audience ad sets, a thumbnail test pair and a hook test pair.
- Workflow: budget gate on every run, orientation, intake, interview, media upload, draft build, draft check, publish and verify, A/B tests, scheduled monitoring with pause-then-tell, reports.
- Scripts: build_ad_specs (copy sheet to checked inline specs, audience to ad set mapping, launch window, required terms, link test), match_thumbs (Meta image hashes to files by picture), check_drafts (draft listing summary and checks), media_drop (temporary public GitHub branch).
- References: connector recipes and pitfalls, question bank, monitoring rules, media routes, brand notes, gaps and handover.
- Learnings O1 to O11 from the director's instructions and the first launch.
- Aliases: mao, ads-operator.
