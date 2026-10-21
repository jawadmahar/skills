#!/usr/bin/env python3
"""Summarise a saved draft listing from ads_get_ad_entities (object_state=draft) and flag problems.

Usage:
  python3 check_drafts.py DRAFTS.json [--specs specs.json]

DRAFTS.json is the file the connector saved when the listing was too large to show (JSON with an
"ad_drafts" string), or the same data as a plain list. With --specs (from build_ad_specs.py) it
also checks that every planned ad is staged, under the ad set its audience belongs to, and that
nothing unplanned is staged.

Prints the campaign, each ad set (budget, dates, ages, Advantage+ audience, frequency cap,
exclusions, ad count) and every problem: validation errors, ads in the wrong ad set, missing or
extra ads. Ads staged as DELETED are listed but never counted. Exit code 1 when there are problems.
"""
import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path


def load(path):
    d = json.loads(Path(path).read_text(encoding='utf-8'))
    if isinstance(d, dict):
        d = d.get('ad_drafts', d)
    return json.loads(d) if isinstance(d, str) else d


def val(o, key):
    v = o.get('values') or {}
    v = json.loads(v) if isinstance(v, str) else v
    x = v.get(key)
    return x.get('new') if isinstance(x, dict) and 'new' in x else x


def errors(o):
    e = o.get('active_errors') or []
    e = json.loads(e) if isinstance(e, str) else e
    return [x.get('error_summary') or x.get('error_description') or str(x) for x in e]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('drafts')
    ap.add_argument('--specs')
    a = ap.parse_args()
    objs = load(a.drafts)
    specs = json.loads(Path(a.specs).read_text(encoding='utf-8')) if a.specs else {}
    problems, deleted = [], []
    ads_by_set = defaultdict(list)
    for o in objs:
        t, oid = o.get('ad_object_type'), o.get('ad_object_id')
        status, errs = val(o, 'status'), errors(o)
        if t == 'ad' and status == 'DELETED':
            deleted.append(val(o, 'name'))
            continue
        if errs:
            problems.append(f'{t} {val(o, "name")}: ' + '; '.join(errs))
        if t == 'campaign':
            print(f'campaign {oid}: {val(o, "name")} | {val(o, "objective")} | {status} | {o.get("validation_status")}')
        elif t == 'ad':
            ads_by_set[str(val(o, 'adset_id') or o.get('parent_ad_object_id'))].append(val(o, 'name'))
    total = 0
    for o in objs:
        if o.get('ad_object_type') != 'adset':
            continue
        oid = str(o['ad_object_id'])
        tg = val(o, 'targeting') or {}
        aa = (tg.get('targeting_automation') or {}).get('advantage_audience')
        budget = val(o, 'daily_budget')
        total += int(budget or 0)
        print(f'ad set {oid}: {val(o, "name")}')
        print(f'  budget {"£%.2f a day" % (int(budget) / 100) if budget else "none (campaign budget?)"} | '
              f'start {val(o, "start_time") or "on publish"} | end {val(o, "end_time") or "none"} | '
              f'goal {val(o, "optimization_goal")}')
        print(f'  ages {tg.get("age_min")} to {tg.get("age_max") or "65+"} | Advantage+ audience {aa} | '
              f'frequency {val(o, "frequency_control_specs") or "none"} | '
              f'exclusions {len(tg.get("excluded_custom_audiences") or [])}')
        print(f'  ads: {len(ads_by_set.get(oid, []))}')
        if not val(o, 'end_time'):
            problems.append(f'ad set {val(o, "name")} has no end date')
    if total:
        print(f'total: £{total / 100:.2f} a day across ad sets (net of VAT)')
    if deleted:
        print(f'staged as deleted (never publish): {len(deleted)}')
    if specs:
        staged = {n: s for s, names in ads_by_set.items() for n in names}
        for vid, s in specs.items():
            where = staged.get(s['name'])
            if where is None:
                problems.append(f'{vid} {s["name"]} is not staged')
            elif where != str(s['adset_id']):
                problems.append(f'{vid} {s["name"]} is in ad set {where}, but its audience belongs in {s["adset_id"]} ({s["adset"]})')
        planned = {s['name'] for s in specs.values()}
        for n in sorted(set(staged) - planned):
            problems.append(f'unplanned ad staged: {n}')
    if problems:
        print('\n'.join('  problem: ' + p for p in problems))
        sys.exit(1)
    print('no problems found')


if __name__ == '__main__':
    main()
