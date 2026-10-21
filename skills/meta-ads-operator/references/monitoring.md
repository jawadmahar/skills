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
2. Read live status: campaigns, ad sets and ads, effective status, delivery issues (`ads_get_errors`) and anything disapproved.
3. Pull ad-level results for the period and score them (SMVM `score_ads.py`): spend, impressions, reach, frequency, hook rate (3-second plays / impressions), hold rate (ThruPlays / 3-second plays), CTR (link), CPM, and results such as leads or sign-ups.
4. Apply the pause rules below; pause, then tell.
5. Report.

## Pause rules (awareness video ads)

Judge only ads with at least about 1,000 impressions and 3 days live. Pause an ad when both hold:
- its hook rate is in the bottom quarter of its ad set, and
- its link CTR is under half the ad set median, or its CPM is more than twice the median with no link clicks.

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
Top 3: <ad> (hook <h>%, CTR <c>%), ...
Paused: <ad> (why), or "nothing paused".
Tests: <test> leading <cell> (not yet significant / significant).
Needs you: <decision>, or "nothing".
```

Then one line for Musa when he needs to act, ready to paste.

## End of campaign

- Make sure ad sets have ended or are paused; nothing should spend after the agreed end.
- Pull final results, score them, and log what was learned: operator lessons here, creative lessons in the SMVM feedback log and the campaign's README (no IDs or money in the repository).
- Ask the budget question for what comes next.
