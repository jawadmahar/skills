#!/usr/bin/env python3
"""Write the ad copy sheet (tab-separated, pastes straight into Google Sheets).

Usage:
  python3 make_adcopy.py --campaign campaign.json --spots OUT/spots.json --map music_map.json \
      --credits music_credits.json --out OUT/ad-copy.tsv [--files OUT/final]

One row per video: the Meta ad name to use (so results can be traced back to the creative later),
file name, series, audience, angle, hook, headline, primary text, button, music and dates.
"""
import argparse
import csv
import json
import re
from pathlib import Path


def slugify(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower().replace('&', 'and').replace('£', '')).strip('-')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--campaign', required=True)
    ap.add_argument('--spots', required=True)
    ap.add_argument('--map')
    ap.add_argument('--credits')
    ap.add_argument('--files', help='folder of finished videos, to use their exact file names')
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    camp = json.loads(Path(a.campaign).read_text(encoding='utf-8'))
    spots = json.loads(Path(a.spots).read_text(encoding='utf-8'))
    mmap = json.loads(Path(a.map).read_text()) if a.map else {}
    credits = json.loads(Path(a.credits).read_text(encoding='utf-8')) if a.credits else {}
    series = {sid: name for name, ids in camp.get('series', {}).items() for sid in ids}
    slugs = camp.get('slugs', {})
    files = {}
    if a.files:
        for p in Path(a.files).glob('*.mp4'):
            m = re.search(r'-([A-Z]\d+)-', p.name) or re.match(r'([A-Z]\d+)-', p.name)
            if m:
                files[m.group(1)] = p.name
    prefix = camp.get('adPrefix', camp.get('slug', 'AD').upper())
    dates = camp.get('dates', {})
    cols = ['Ad name', 'File', 'Group', 'Series', 'Title', 'Length (s)', 'Audience', 'Angle', 'Hook', 'Headline', 'Primary text',
            'Button', 'Music', 'Start', 'End']
    with open(a.out, 'w', newline='', encoding='utf-8') as fh:
        w = csv.writer(fh, delimiter='\t', quoting=csv.QUOTE_MINIMAL, lineterminator='\n')
        w.writerow(cols)
        for s in spots:
            sid = s['id']
            slug = slugs.get(sid) or s.get('slug') or slugify(s['title'])
            track = str(mmap.get(sid, s.get('music', '')))
            c = credits.get(track, {})
            music = f"{c.get('title', '?')} by {c.get('author', '?')} ({c.get('source', 'Mixkit')} #{track})" if track else ''
            meta = s.get('meta', {})
            w.writerow([f'{prefix}_{sid}_{slug}', files.get(sid, ''), series.get(sid, ''), s.get('series') or series.get(sid, ''), s['title'], s['dur'],
                        s.get('persona', ''), s.get('angle', ''), s.get('hook', ''), meta.get('headline', ''), meta.get('primary', ''),
                        meta.get('button', camp.get('button', 'Sign up')), music, meta.get('start', dates.get('start', '')), meta.get('end', dates.get('end', ''))])
    print(f'{a.out}: {len(spots)} rows')


if __name__ == '__main__':
    main()
