#!/usr/bin/env python3
"""Turn an ad copy sheet into checked, ready-to-send inline ad specs for the Meta Ads connector.

Usage:
  python3 build_ad_specs.py --copy ad-copy.tsv --videos videos.json --thumbs thumbs.json \
      --settings launch.json --out specs.json [--check-links]

--copy      the SMVM ad copy sheet (tab-separated: Ad name, Audience, Headline, Primary text, Start,
            End, ...) or a JSON list of rows with the same keys. An optional "Ad set" column wins
            over the audience rules.
--videos    JSON {"<ID>": "<ad video id>"} from the upload step (IDs as in the ad names, e.g. V07)
--thumbs    JSON {"<ID>": "<image hash>"}, e.g. from match_thumbs.py
--settings  private launch settings, never committed:
  {"page_id": "...", "instagram_user_id": "...", "prefix": "EXZ_HT26", "link": "https://example.co.uk/offer/",
   "utm": {"utm_source": "meta", "utm_medium": "paid_social", "utm_campaign": "ht26_videos"},
   "cta": "SIGN_UP", "adsets": {"families": "<ad set id>", "grandparents": "<ad set id>"},
   "audience_rules": [{"match": ["grand", "nan"], "adset": "grandparents"}, {"match": [""], "adset": "families"}],
   "required_terms": ["New customers only", "Max 9 per group", "T&Cs apply"],
   "window": {"start": "2026-10-21", "end": "2026-10-31"},
   "variants": [{"id": "V02B", "from": "V02", "name_suffix": "_thumbB"}]}

Rows outside the launch window are held back (no January ads in November). Rows with a missing
video or thumbnail, no matching ad set, missing required terms or dashes are refused. Specs for the
good rows are written either way; the exit code is 1 when anything was refused so it gets fixed.
"""
import argparse
import csv
import json
import re
import subprocess
import sys
from datetime import date
from pathlib import Path
from urllib.parse import urlencode

DASHES = {'\u2014': 'em dash', '\u2013': 'en dash'}
ID_RE = re.compile(r'(?<![A-Za-z0-9])([A-Z]{1,3}\d{2,3}[A-Z]?)(?![A-Za-z0-9])')


def load_rows(path):
    p = Path(path)
    if p.suffix == '.json':
        return json.loads(p.read_text(encoding='utf-8'))
    with open(p, newline='', encoding='utf-8-sig') as fh:
        return list(csv.DictReader(fh, delimiter='\t'))


def col(row, *names):
    low = {k.strip().lower(): v for k, v in row.items() if k}
    for n in names:
        if low.get(n.lower()) not in (None, ''):
            return str(low[n.lower()]).strip()
    return ''


def parse_day(s):
    try:
        return date.fromisoformat(s[:10]) if s else None
    except ValueError:
        return None


def pick_adset(audience, explicit, rules):
    if explicit:
        return explicit
    a = audience.lower()
    for r in rules:
        if any(m.lower() in a for m in r.get('match', [''])):
            return r['adset']
    return ''


def check_link(url):
    r = subprocess.run(['curl', '-sS', '-L', '-m', '25', '-o', '/dev/null', '-w', '%{http_code}', url],
                       capture_output=True, text=True)
    return r.stdout.strip()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--copy', required=True)
    ap.add_argument('--videos', required=True)
    ap.add_argument('--thumbs', required=True)
    ap.add_argument('--settings', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--check-links', action='store_true', help='fetch each landing link once and require HTTP 200')
    a = ap.parse_args()
    cfg = json.loads(Path(a.settings).read_text(encoding='utf-8'))
    videos = json.loads(Path(a.videos).read_text(encoding='utf-8'))
    thumbs = json.loads(Path(a.thumbs).read_text(encoding='utf-8'))
    win = cfg.get('window', {})
    w_start, w_end = parse_day(win.get('start', '')), parse_day(win.get('end', ''))

    rows = {}
    for r in load_rows(a.copy):
        name = col(r, 'Ad name', 'name')
        if not name:  # older sheets: build PREFIX_ID_slug from the file name, e.g. brand-campaign-V07-slug.mp4
            f = re.search(r'-([A-Z]{1,3}\d{2,3}[A-Z]?)-([^.]+)\.', col(r, 'File'))
            if f and cfg.get('prefix'):
                name = f'{cfg["prefix"]}_{f.group(1)}_{f.group(2)}'
        ids = ID_RE.findall(name)  # PREFIX_ID_slug: the prefix can look like an ID too (HT26), so take the last
        vid = ids[-1] if ids else ''
        if not vid or not name:
            sys.exit(f'build_ad_specs: cannot find the ID and ad name for row "{name or col(r, "Video", "File")}" '
                     '(add an "Ad name" column, or "prefix" in the settings)')
        rows[vid] = {'id': vid, 'name': name, 'audience': col(r, 'Audience', 'persona', 'set'),
                     'adset': col(r, 'Ad set', 'adset'), 'headline': col(r, 'Headline', 'title'),
                     'message': col(r, 'Primary text', 'message', 'primary'),
                     'start': col(r, 'Start'), 'end': col(r, 'End')}
    for v in cfg.get('variants', []):
        base = rows.get(v['from'])
        if not base:
            sys.exit(f'build_ad_specs: variant {v["id"]} copies {v["from"]}, which is not in the sheet')
        rows[v['id']] = dict(base, id=v['id'], name=base['name'] + v.get('name_suffix', '_' + v['id']), video_from=v['from'])

    specs, problems, held = {}, [], []
    for vid, r in rows.items():
        start, end = parse_day(r['start']), parse_day(r['end'])
        if (w_end and start and start > w_end) or (w_start and end and end < w_start):
            held.append(f'{vid} ({r["start"]} to {r["end"]})')
            continue
        issues = []
        key = pick_adset(r['audience'], r['adset'], cfg.get('audience_rules', []))
        adset_id = cfg.get('adsets', {}).get(key)
        if not adset_id:
            issues.append(f'no ad set for audience "{r["audience"]}"')
        video = videos.get(r.get('video_from', vid)) or videos.get(r['name'])
        if not video:
            issues.append('no video id')
        thumb = thumbs.get(vid)
        if not thumb:
            issues.append('no thumbnail hash')
        missing = [t for t in cfg.get('required_terms', []) if t not in r['message']]
        if missing:
            issues.append('primary text missing: ' + ', '.join(missing))
        for ch, label in DASHES.items():
            if ch in r['message'] or ch in r['headline']:
                issues.append(f'{label} in copy')
        if not r['message'] or not r['headline']:
            issues.append('empty headline or primary text')
        if issues:
            problems.append(f'{vid}: ' + '; '.join(issues))
            continue
        link = cfg['link'] + ('&' if '?' in cfg['link'] else '?') + urlencode({**cfg.get('utm', {}), 'utm_content': vid})
        oss = {'page_id': cfg['page_id'],
               'video_data': {'video_id': video, 'image_hash': thumb, 'title': r['headline'], 'message': r['message'],
                              'call_to_action': {'type': cfg.get('cta', 'LEARN_MORE'), 'value': {'link': link}}}}
        if cfg.get('instagram_user_id'):
            oss = {'page_id': cfg['page_id'], 'instagram_user_id': cfg['instagram_user_id'], 'video_data': oss['video_data']}
        specs[vid] = {'name': r['name'], 'adset': key, 'adset_id': adset_id, 'link': link,
                      'creative': json.dumps({'name': r['name'], 'object_story_spec': oss}, ensure_ascii=False)}

    if a.check_links and specs:
        first = next(iter(specs.values()))['link']
        code = check_link(first)
        print(f'landing link: HTTP {code} {first}')
        if code != '200':
            problems.append(f'landing link returned HTTP {code}: {first}')

    Path(a.out).write_text(json.dumps(specs, indent=1, ensure_ascii=False), encoding='utf-8')
    by_set = {}
    for vid, s in sorted(specs.items()):
        by_set.setdefault(s['adset'], []).append(vid)
    print(f'{a.out}: {len(specs)} ads')
    for k, ids in by_set.items():
        print(f'  {k}: {len(ids)} ({", ".join(ids)})')
    if held:
        print('  held back, outside the launch window: ' + ', '.join(held))
    if problems:
        print('\n'.join('  problem: ' + p for p in problems))
        sys.exit(1)


if __name__ == '__main__':
    main()
