#!/usr/bin/env python3
"""Score posted videos from a Meta ad-level export, and roll results up by creative attribute.

Usage:
  python3 score_ads.py INSIGHTS.json|.csv|.tsv --spots spots.json [--campaign campaign.json] [--map music_map.json] [--out scorecard.tsv]
                       [--min-impressions 1000] [--min-spend 15]

INSIGHTS: one row per ad, as saved from the Meta Ads connector (ads_get_ad_entities at ad level with
insights) or exported from Ads Manager. Column names are matched loosely, e.g.
  ad_name, spend, impressions, reach, clicks / inline_link_clicks, video_3s (3-second plays),
  thruplays, video_p75, leads, purchases, results
Rows are linked to creatives through the video id in the ad name (V07, or PREFIX_V07_slug), which is
why the ad name column in the copy sheet matters.

Metrics: hook rate = 3-second plays / impressions (stops the scroll), hold rate = ThruPlays / 3-second
plays (keeps attention), CTR (link), CPM, cost per lead, cost per purchase. Ads under the minimums are
listed but not ranked, because a handful of impressions proves nothing.
"""
import argparse
import csv
import json
import re
import statistics
from collections import defaultdict
from pathlib import Path

ALIASES = {
    'ad_name': ['ad_name', 'ad name', 'name', 'ad'],
    'spend': ['spend', 'amount spent (gbp)', 'amount spent', 'amount_spent'],
    'impressions': ['impressions', 'impr'],
    'reach': ['reach'],
    'clicks': ['inline_link_clicks', 'link clicks', 'link_clicks', 'clicks', 'lc'],
    'video_3s': ['video_3s', '3-second video plays', 'video_play_actions', 'video_3_sec_watched_actions', 'video_view', 'three_second_views'],
    'thruplays': ['thruplays', 'thruplay', 'video_thruplay_watched_actions', 'thruplay_actions'],
    'p75': ['video_p75', 'video_p75_watched_actions', 'video plays at 75%'],
    'leads': ['leads', 'lead', 'onsite_conversion.lead_grouped', 'leadgen.other', 'results (leads)'],
    'purchases': ['purchases', 'purchase', 'purch', 'website purchases'],
    'results': ['results', 'res'],
}


def num(v):
    if v is None or v == '':
        return 0.0
    if isinstance(v, (int, float)):
        return float(v)
    if isinstance(v, list):  # Meta action lists: [{"action_type": .., "value": ..}]
        return sum(num(x.get('value')) for x in v if isinstance(x, dict))
    try:
        return float(str(v).replace(',', '').replace('£', ''))
    except ValueError:
        return 0.0


def load(path):
    p = Path(path)
    if p.suffix == '.json':
        d = json.loads(p.read_text(encoding='utf-8'))
        if isinstance(d, dict):
            d = d.get('data') or d.get('ads') or d.get('rows') or list(d.values())[0]
        return d
    with open(p, newline='', encoding='utf-8-sig') as fh:
        return list(csv.DictReader(fh, delimiter='\t' if p.suffix == '.tsv' else ','))


def pick(row, key):
    low = {k.lower(): v for k, v in row.items()}
    for a in ALIASES[key]:
        if a in low:
            return low[a]
    if isinstance(low.get('actions'), list):  # fall back to the Meta actions array
        for x in low['actions']:
            if x.get('action_type') in ALIASES[key]:
                return x.get('value')
    return None


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('insights')
    ap.add_argument('--spots', required=True)
    ap.add_argument('--campaign')
    ap.add_argument('--map', help='music_map.json, to group results by track')
    ap.add_argument('--out', default='scorecard.tsv')
    ap.add_argument('--min-impressions', type=float, default=1000)
    ap.add_argument('--min-spend', type=float, default=15)
    a = ap.parse_args()
    spots = {s['id']: s for s in json.loads(Path(a.spots).read_text(encoding='utf-8'))}
    camp = json.loads(Path(a.campaign).read_text(encoding='utf-8')) if a.campaign else {}
    series = {sid: name for name, ids in camp.get('series', {}).items() for sid in ids}
    mmap = json.loads(Path(a.map).read_text()) if a.map else {}

    rows = []
    for r in load(a.insights):
        name = str(pick(r, 'ad_name') or '')
        m = re.search(r'(?:^|[_\-\s])(V\d{2,3})(?:[_\-\s]|$)', name)
        x = {k: num(pick(r, k)) for k in ALIASES if k != 'ad_name'}
        x.update(ad_name=name, id=m.group(1) if m else '')
        i, v3 = x['impressions'], x['video_3s']
        x['hook'] = v3 / i if i else 0
        x['hold'] = x['thruplays'] / v3 if v3 else 0
        x['ctr'] = x['clicks'] / i if i else 0
        x['cpm'] = x['spend'] / i * 1000 if i else 0
        x['cpl'] = x['spend'] / x['leads'] if x['leads'] else None
        x['cpa'] = x['spend'] / x['purchases'] if x['purchases'] else None
        x['enough'] = i >= a.min_impressions and x['spend'] >= a.min_spend
        s = spots.get(x['id'], {})
        x.update(series=series.get(x['id'], s.get('series', '')), persona=s.get('persona', ''), title=s.get('title', ''), music=str(mmap.get(x['id'], s.get('music', ''))))
        rows.append(x)
    ranked = sorted([r for r in rows if r['enough']], key=lambda r: (r['cpl'] is None, r['cpl'] or 0, -r['hook']))
    cols = ['ad_name', 'id', 'title', 'series', 'persona', 'spend', 'impressions', 'hook', 'hold', 'ctr', 'cpm', 'leads', 'cpl', 'purchases', 'cpa', 'enough']
    fmt = lambda k, v: '' if v is None else (f'{v:.1%}' if k in ('hook', 'hold', 'ctr') else f'{v:.2f}' if isinstance(v, float) else str(v))
    with open(a.out, 'w', encoding='utf-8') as fh:
        fh.write('\t'.join(cols) + '\n')
        for r in ranked + [r for r in rows if not r['enough']]:
            fh.write('\t'.join(fmt(k, r.get(k)) for k in cols) + '\n')
    print(f'{len(rows)} ads, {len(ranked)} with enough data -> {a.out}\n')
    if not ranked:
        print('Not enough data yet to rank anything. Wait until each ad has about 1,000 impressions.')
        return
    med_hook = statistics.median(r['hook'] for r in ranked)
    print(f'Median hook rate {med_hook:.1%}. Ranked by cost per lead, then hook rate:')
    for r in ranked[:10]:
        print(f"  {r['id'] or '?':>4} {r['title'][:34]:34} hook {r['hook']:.0%} hold {r['hold']:.0%} CTR {r['ctr']:.2%} "
              f"CPL {'£%.2f' % r['cpl'] if r['cpl'] else '-'} spend £{r['spend']:.0f}")
    for attr in ('series', 'persona', 'music'):
        groups = defaultdict(list)
        for r in ranked:
            if r[attr]:
                groups[r[attr]].append(r)
        if len(groups) < 2:
            continue
        print(f'\nBy {attr}:')
        for k, g in sorted(groups.items(), key=lambda kv: -statistics.mean(r['hook'] for r in kv[1])):
            sp, ld = sum(r['spend'] for r in g), sum(r['leads'] for r in g)
            print(f"  {k[:46]:46} n={len(g)} hook {statistics.mean(r['hook'] for r in g):.0%} CPL {'£%.2f' % (sp / ld) if ld else '-'}")
    print('\nTurn these into learnings only where the pattern holds across 2 or more ads (see references/feedback-loop.md).')


if __name__ == '__main__':
    main()
