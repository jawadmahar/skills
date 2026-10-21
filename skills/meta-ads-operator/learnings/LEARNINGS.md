# Operator learnings

Last consolidated: 21 October 2026 (version 1.0.1)

Rules learned while running real launches. Read them before building. Confidence: **Director** (the director said so), **Firm** (learned the hard way in production), **Hypothesis** (believed, not yet proven). Creative lessons (hooks, series, music) belong in the SMVM learnings, not here.

| # | Rule | Evidence | Confidence | Since |
|---|---|---|---|---|
| O1 | Agree the daily budget, its split and its end date before building, and ask again (multiple choice) whenever the agreed period ends or a scheduled check finds none. | Director: budget is asked by multiple choice each time a scheduled task runs or the skill is called, unless already shared | Director | Oct 2026 |
| O2 | Creatives go only to their audience's ad set; grandparent creatives never run in ad sets aimed at parents. Later-season creatives wait for their window. | Director: "dont post january ads now, and dont post grandparents creatives in our other ad-sets" | Director | Oct 2026 |
| O3 | Pause, then tell. Weekly checks for campaigns longer than two months; shorter ones get a day 5 to 7 check and an end review. | Director's answers to the setup questions | Director | Oct 2026 |
| O4 | Build ads with an inline creative spec holding the thumbnail image hash only. Ads made from an existing creative ID copied both the image URL and Meta's hash and failed with ObjectStorySpecRedundant (1443051). | Half-term launch: first six drafts all failed; inline rebuild of 21 ads had no errors | Firm | Oct 2026 |
| O5 | Keep your own file to video ID and file to image hash maps from the upload step. Creative read-backs return the Page post's video copy, and URL-copied images are all "untitled" and arrive out of order after a retry. | Half-term launch: 15 of 21 thumbnails would have been mismatched by order | Firm | Oct 2026 |
| O6 | After publishing, check ad sets and ads in live read-back and the activity log, not just the campaign. If only the campaign goes live, retry once, then hand over to Ads Manager's Review and publish. | 21 Oct 2026: three publish calls returned PUBLISHING; only the campaign was created | Firm | Oct 2026 |
| O7 | Check every primary text for the offer's required terms before building. | 9 of 21 half-term texts lacked "Max 9 per group" (CAP Code 3.9 and 8.17) | Firm | Oct 2026 |
| O8 | Test the landing link before building; fall back to the brand's official offer page and say why. | The n8n practice sign-up webhook returned 404 (workflow not active) | Firm | Oct 2026 |
| O9 | Pass the Page's Instagram account (instagram_user_id) in inline specs so Instagram placements run, and ask Musa to confirm it is the right account. | `ads_get_ig_accounts` returned nothing while Meta filled the account into creatives | Hypothesis (confirm on the first live ad) | Oct 2026 |
| O10 | When the auto-mode safety check blocks a Meta write, do not loop. Finish everything else, then explain and let the director decide. | Two single calls blocked as real-world transactions on 21 Oct; one retry each succeeded | Firm | Oct 2026 |
| O11 | Prefer media routes that need no clean-up: cloud sessions could not delete the temporary GitHub branch (HTTP 403), so the director had to. | 21 Oct 2026 | Firm | Oct 2026 |
| O12 | Call a campaign or ad "running" only from its delivery status and end date, and re-check before reporting. Status and effective status stay ACTIVE after an end date has passed. | 21 Oct report flagged the B1G1 reactivation campaign as still running from 17 Oct data; it had completed at its end date, midday Sun 18 Oct | Firm | Oct 2026 |

## Retired
None yet.
