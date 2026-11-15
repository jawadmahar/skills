#!/usr/bin/env python3
"""Score live video ads from an ad-level read and apply the pause rule, so nothing is worked out by hand.

Usage:
  python3 score_live_ads.py RESULTS [RESULTS ...] [--today 2026-11-09] [--min-impressions 1000]
                            [--min-days 3] [--keep 4] [--tsv scorecard.tsv]

RESULTS is one of:
  - the saved result of ads_get_ad_entities at level "ad" (an object whose "ad_entities" is a list or a
    JSON string, or just the list), with the fields name, adset_name, delivery, created_time,
    amount_spent, impressions, video_p25_watched_actions, video_thruplay_watched_actions, link_click;
  - a tab-separated file with the header
      id  name  adset  created  impressions  quarter_plays  thruplays  link_clicks  spend
    for when the result came back inline: copy one line per ad and let this script do the sums.

Why these measures: 3-second plays are not reported per ad through the connector, so ads are compared on
the share of impressions watched to a quarter and the share watched to the end (ThruPlays).

The pause rule (awareness video ads). An ad is a clear loser only when ALL of these hold:
  1. it is delivering, has at least --min-impressions and has been live at least --min-days;
  2. its quarter-watched rate AND its ThruPlay rate are both in the bottom quarter of its ad set;
  3. both rates are clearly below the rest of the ad set (one-sided binomial test, p < 0.05), so a
     small sample cannot condemn an ad by chance;
  4. it is not out-clicking the ad set (3 or more link clicks at 1.5 times the ad set's click rate).
Pausing never leaves an ad set with fewer than --keep live ads (3 if it has fewer than 8).
The script only recommends. Pause through the connector, read back, then tell the director.
"""
import argparse
import csv
import json
import math
import re
import statistics
import sys
from collections import defaultdict
from datetime import date, datetime
from pathlib import Path

ID_RE = re.compile(r'(?<![A-Za-z0-9])([A-Z]{1,3}\d{2,3}[A-Z]?)(?![A-Za-z0-9])')


def num(v):
    if isinstance(v, dict):
        v = v.get('value')
    try:
        return float(v)
    except (TypeError, ValueError):
        return 0.0


def load(path):
    text = Path(path).read_text(encoding='utf-8')
    if text.lstrip()[:1] in '[{':
        data = json.loads(text)
        if isinstance(data, dict):
            data = data.get('ad_entities', data.get('data', []))
        if isinstance(data, str):
            data = json.loads(data)
        for a in data:
            d = a.get('delivery') or {}
            yield {'id': str(a.get('id', '')), 'name': a.get('name', ''), 'adset': a.get('adset_name', ''),
                   'created': (a.get('created_time') or '')[:10], 'delivering': (d.get('status', 'active') == 'active'),
                   'imp': int(num(a.get('impressions'))), 'q': int(num(a.get('video_p25_watched_actions'))),
                   't': int(num(a.get('video_thruplay_watched_actions'))), 'lc': int(num(a.get('link_click'))),
                   'spend': num(a.get('amount_spent'))}
    else:
        for r in csv.DictReader(text.splitlines(), delimiter='\t'):
            yield {'id': r.get('id', ''), 'name': r['name'], 'adset': r['adset'], 'created': (r.get('created') or '')[:10],
                   'delivering': True, 'imp': int(num(r['impressions'])), 'q': int(num(r['quarter_plays'])),
                   't': int(num(r['thruplays'])), 'lc': int(num(r.get('link_clicks'))), 'spend': num(r.get('spend'))}


def binom_cdf(k, n, p):
    """P(X <= k) for X ~ Binomial(n, p), summed in logs so large n is safe."""
    if n <= 0 or p <= 0:
        return 1.0
    if p >= 1:
        return 1.0 if k >= n else 0.0
    lp, lq = math.log(p), math.log(1 - p)
    logs = [math.lgamma(n + 1) - math.lgamma(i + 1) - math.lgamma(n - i + 1) + i * lp + (n - i) * lq for i in range(min(k, n) + 1)]
    m = max(logs)
    return min(1.0, math.exp(m) * sum(math.exp(x - m) for x in logs))


def quartile_cut(values):
    s = sorted(values)
    return s[len(s) // 4] if s else 0.0


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('results', nargs='+')
    ap.add_argument('--today', default=date.today().isoformat())
    ap.add_argument('--min-impressions', type=int, default=1000)
    ap.add_argument('--min-days', type=int, default=3)
    ap.add_argument('--keep', type=int, default=4)
    ap.add_argument('--tsv')
    a = ap.parse_args()
    today = datetime.strptime(a.today, '%Y-%m-%d').date()
    sets = defaultdict(list)
    for path in a.results:
        for ad in load(path):
            m = ID_RE.findall(ad['name'])
            ad['vid'] = m[-1] if m else ad['name'][:18]
            ad['days'] = (today - datetime.strptime(ad['created'], '%Y-%m-%d').date()).days if ad['created'] else 99
            ad['qr'] = ad['q'] / ad['imp'] if ad['imp'] else 0.0
            ad['tr'] = ad['t'] / ad['imp'] if ad['imp'] else 0.0
            sets[ad['adset']].append(ad)
    rows, pause = [], []
    for name, ads in sets.items():
        live = [x for x in ads if x['delivering']]
        ok = [x for x in live if x['imp'] >= a.min_impressions and x['days'] >= a.min_days]
        tot = {k: sum(x[k] for x in live) for k in ('imp', 'q', 't', 'lc', 'spend')}
        print(f"\n== {name}: {len(live)} live ads, {len(ok)} with enough data | impressions {tot['imp']:,} | spend {tot['spend']:.2f} | link clicks {tot['lc']}")
        print('   (check these totals against the ad set read for the same dates before trusting the table)')
        if len(ok) < 4:
            print('   too few ads with enough data to compare; nothing to pause')
        qcut, tcut = quartile_cut([x['qr'] for x in ok]), quartile_cut([x['tr'] for x in ok])
        set_ctr = tot['lc'] / tot['imp'] if tot['imp'] else 0.0
        if ok:
            print(f"   medians: quarter-watched {statistics.median(x['qr'] for x in ok):.1%}, ThruPlay {statistics.median(x['tr'] for x in ok):.2%}")
        losers = []
        for x in sorted(live, key=lambda r: r['qr']):
            verdict = 'ok'
            if x not in ok:
                verdict = 'too early'
            elif len(ok) >= 4:
                rest = [o for o in ok if o is not x]
                ri = sum(o['imp'] for o in rest) or 1
                pq = binom_cdf(x['q'], x['imp'], sum(o['q'] for o in rest) / ri)
                pt = binom_cdf(x['t'], x['imp'], sum(o['t'] for o in rest) / ri)
                low_q, low_t = x['qr'] < qcut and pq < 0.05, x['tr'] < tcut and pt < 0.05
                clicks_well = x['lc'] >= 3 and x['lc'] / x['imp'] >= 1.5 * set_ctr
                if low_q and low_t and not clicks_well:
                    verdict = 'LOSER'
                    losers.append(x)
                elif low_q and low_t:
                    verdict = 'weak, but clicks well'
                elif low_q or low_t:
                    verdict = 'weak on one measure'
            x['verdict'] = verdict
            print(f"   {x['vid']:<8} imp {x['imp']:>6,}  quarter {x['qr']:>6.1%}  thru {x['tr']:>6.2%}  clicks {x['lc']:>2}  spend {x['spend']:>6.2f}  days {x['days']:>2}  {verdict}")
            rows.append([name, x['id'], x['vid'], x['name'], x['imp'], f"{x['qr']:.4f}", f"{x['tr']:.4f}", x['lc'], f"{x['spend']:.2f}", x['days'], verdict])
        floor = a.keep if len(live) >= 8 else min(3, a.keep)
        room = max(0, len(live) - floor)
        losers.sort(key=lambda r: r['qr'] + 10 * r['tr'])
        for x in losers[:room]:
            pause.append((name, x))
        if len(losers) > room:
            print(f"   {len(losers) - room} more loser(s) kept so the ad set keeps {floor} live ads")
        best = sorted(ok, key=lambda r: (sorted(o['qr'] for o in ok).index(r['qr']) + sorted(o['tr'] for o in ok).index(r['tr']), r['lc']), reverse=True)[:3]
        if best:
            print('   top 3: ' + ', '.join(f"{b['vid']} ({b['qr']:.1%} quarter, {b['tr']:.2%} thru, {b['lc']} clicks)" for b in best))
    print('\nPause list (pause, read back, then tell the director):' if pause else '\nNothing to pause.')
    for name, x in pause:
        print(f"   {x['id'] or '(no id)'}  {x['vid']}  in {name}: quarter {x['qr']:.1%}, thru {x['tr']:.2%}, {x['imp']:,} impressions, {x['lc']} clicks")
    if a.tsv:
        with open(a.tsv, 'w', newline='', encoding='utf-8') as fh:
            w = csv.writer(fh, delimiter='\t', lineterminator='\n')
            w.writerow(['Ad set', 'Ad id', 'Video', 'Ad name', 'Impressions', 'Quarter-watched rate', 'ThruPlay rate', 'Link clicks', 'Spend', 'Days live', 'Verdict'])
            w.writerows(rows)
        print(f'\n{a.tsv}: {len(rows)} rows')
    return 0


if __name__ == '__main__':
    sys.exit(main())
