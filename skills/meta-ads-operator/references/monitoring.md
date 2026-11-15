# Monitoring, pausing and reporting

## Cadence (the director's rule, October 2026)

| Campaign length | Checks |
|---|---|
| Up to two months | One check after 5 to 7 days live, one end review on the last day, and a budget question when the agreed period ends |
| Longer than two months | A weekly check (same weekday and time each week), plus the budget question whenever the agreed period ends |

Set them up as soon as the campaign is live:
- One-off checks: `send_later` (Claude Code routines) with the exact time, for example 09:00 UK time on day 5.
- Weekly checks: `create_trigger` with a cron in UK time, for example `CRON_TZ=Europe/London 47 8 * * 1` (Mondays 08:47; avoid :00 and :30, which are busy). Give it a complete prompt: brand, ad account, campaign name prefix, the agreed budget and its end date, the pause rule, and "run the budget gate first".
- Tell the director what you scheduled, in one line, and cancel the routines when the campaign ends.

## Every check, in this order

1. Budget gate (`SKILL.md`). On a scheduled run with an expired budget and nobody to ask, do not extend anything.
2. Read live status: campaigns, ad sets and ads, delivery status, delivery issues (`ads_get_errors`), anything disapproved, and the activity log for other people's changes.
3. Read the whole account's money for the last 30 days at campaign level (spend, link clicks, leads, objective), not only the campaign being watched. The question that matters is what each pound buys: compare the cost of a lead in the lead campaigns with the cost of a link click in the awareness campaigns, and say so when one is far better value.
4. Pull ad-level results since launch (impressions, plays at 25%, ThruPlays, link clicks, spend, created time) and run `scripts/score_live_ads.py` on them. Do not work the rates out by hand: a typed number or a misread quartile pauses the wrong ad.
5. Apply the pause rule below; pause, read back, then tell.
6. On someone else's launch, and on the first check of any launch: read one ad per ad set in full (`meta-recipes.md`, "Read what a live ad really contains") and confirm where the button goes, which text options it carries and that the copy matches the copy sheet.
7. Report.

## Pause rule (awareness video ads)

3-second plays are not reported per ad through the connector (only per ad set and above), so ads are compared on two rates that are: quarter-watched (plays at 25% / impressions) and ThruPlay (ThruPlays / impressions). `score_live_ads.py` applies the rule. An ad is a clear loser only when all of these hold:
- it is delivering, has at least 1,000 impressions and has been live 3 days;
- both rates are in the bottom quarter of the ads in its ad set that have enough data;
- both rates are clearly below the rest of the ad set (a binomial test, so a small sample cannot condemn an ad by chance);
- it is not out-clicking the ad set (3 or more link clicks at 1.5 times the ad set's click rate keeps an ad alive).

Before trusting the table, check the script's impressions and spend totals against the ad set read for the same dates. With many ads on a small budget most ads never reach 1,000 impressions; say so, and recommend fewer ads per ad set rather than waiting weeks for data.

For lead or sign-up campaigns, pause when cost per result is more than twice the ad set median after spending at least three times the target cost per result.

Never:
- pause an ad that is a cell in a running A/B test;
- leave an ad set with fewer than 4 live ads (3 if it started with fewer than 8), or pause the last ad made for an audience;
- raise a budget, extend an end date or switch an ad back on without the director's yes.

Pausing protects money, so it does not need approval first, but it always needs a report straight after: which ads, the numbers that triggered it, and what is still running.

## Report template (plain text, short)

```
<date and time>
<Brand> <campaign>: day <n> of <m>. Spend £<x> of £<y> so far (net of VAT), reach <r>.
Top 3: <ad> (quarter-watched <q>%, ThruPlay <t>%, <n> link clicks), ...
Paused: <ad> (why), or "nothing paused".
Value: a lead costs £<a> in <lead campaign>; a link click costs £<b> in <this campaign>.
Tests: <test> leading <cell> (not yet significant / significant).
Needs you: <decision>, or "nothing".
```

Then one line for Musa when he needs to act, ready to paste.

## When a check finds a fault in live ads

Report it once. If it is still there at the next check, do not report it a third time: stage the corrected ads as drafts (`meta-recipes.md`, "Fix a live ad's copy or link"), attach a paste-ready copy sheet, and ask the director one question: publish the fix, or hand it to Musa. A wrong link or garbled text in a live ad is public every day it waits.

## End of campaign

- Make sure ad sets have ended or are paused; nothing should spend after the agreed end.
- Pull final results, score them, and log what was learned: operator lessons here, creative lessons in the SMVM feedback log and the campaign's README (no IDs or money in the repository).
- Ask the budget question for what comes next.
