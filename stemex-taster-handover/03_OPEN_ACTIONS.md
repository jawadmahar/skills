# 03 - Open Actions (updated 23 Nov 2026, 14:51 by Musa)

Update column added 23 Nov. Full detail in `07_STATUS_UPDATE_23_NOV.md`. Decisions are asked in `08_DECISIONS_FOR_JAWAD.md`.

Status key: **TODO** = ready to do | **JAWAD DECISION** = needs his explicit yes first | **TEAM** = a person must do it outside Claude.

| # | Action | Status | Allowed during the freeze? | Notes | Update 23 Nov |
|---|---|---|---|---|---|
| 1 | Recheck audiences `120252319359750363` (form-submitter exclusion) and `120252319359010363` (lookalike) on 23 Nov | TODO | Yes, read only | If either is still inactive after 48 hours, report it to Jawad with options. Don't rebuild the ad set without his approval. | Lookalike ready (code 200). Exclusion still filling (code 441). Recheck 24 Nov. |
| 2 | Visually check all 5 ad images and the wording on lead form 1486064703377219 | TEAM | Yes | A1 and A2 reuse images from the old campaign and may say "Saturday" only, or not say "free". The form should say free, ages 4 to 16, Sat & Sun. If an image is wrong, tell Jawad before changing anything. | Not done. Needs a person to check by eye. |
| 3 | Fix A5 main text 2 to add "Saturdays and Sundays" | JAWAD DECISION | Only before the freeze starts properly (ideally by 23 Nov) | Creatives can't be edited. The fix is a new creative and ad with the same image hash, then pausing the old A5. | Asked Jawad (urgent). A5 has 54% of spend. |
| 4 | Delete leftover drafts: ad set `120252319362440363` under the old campaign, plus an old "SEND Campaign" draft at £25 a day | JAWAD DECISION | Yes, drafts don't run | Risk: anyone pressing "publish all" in Ads Manager would put these live. | Connector shows no drafts, but only sees drafts saved by the checker. Jawad to check his login or approve. |
| 5 | Refresh the customer list behind the lookalike and exclusion (`120250363574940363`) with families who attended or became members from July to November 2026 | TEAM + JAWAD DECISION | Yes | Export from GHL (the Attended, £70 Link Sent, Block Bought and Members stages), then upload in Ads Manager under Audiences, then "Add customers". Check that the privacy notice covers ad-platform matching (UK GDPR). Upload parents' details only. | Asked Jawad, incl. privacy notice confirmation. |
| 6 | Build 3 GHL workflows that send pipeline stages to Meta | TEAM | Yes | See `04_GHL_CAPI_WORKFLOW_STEPS.md`. The GHL workflow API is not enabled for this account, so it has to be built by hand. | Not started. |
| 7 | Automatic SMS within 5 minutes of a new taster lead, with a booking link, plus a 24-hour follow-up | TEAM (Eman) | Yes | The brief is in `05_MESSAGES.md`. Jawad has reminders set for 23 Nov to send it. | Waiting on Jawad sending the brief to Eman. |
| 8 | Chase the 11 leads sitting in "Chasing" this week | TEAM | Yes | Move each card to the right stage as you go. | Not checked (GHL connector not on). |
| 9 | Send the 14-day freeze note to Mohsin | Jawad to send | n/a | The text is in `05_MESSAGES.md`. | Reminder included in 08. |
| 10 | Confirm ad claims are accurate: "limited places", and that a child builds a robot, writes code and tries an experiment in one hour | JAWAD DECISION | n/a | CAP Code rule 3.1 and the DMCC Act 2024. | Asked Jawad. |
| 11 | Review on Sun 6 Dec 2026 | TODO | This ends the freeze | See `06_REVIEW_6_DEC.md`. | Scheduled. |
| 12 | Phase 2 ideas (not started): a higher-intent lead form (child's age, preferred day), re-contacting last year's 1,528 leads by email or SMS, and fresh creatives for week 3 | JAWAD DECISION | After the review | Re-contact needs a PECR check (consent or soft opt-in). A new form must also be connected in GHL. | Not started. |
