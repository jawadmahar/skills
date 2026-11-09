#!/usr/bin/env python3
"""Name the finished stills and write their ad copy sheet (tab-separated, for Google Sheets).

  python3 stills_copy.py        out/stills/S51_feed.jpg -> out/stills_final/explorazone-winter-S51-<slug>-feed-4x5.jpg, out/ad-copy-stills.tsv
"""
import csv, json, shutil
from pathlib import Path
W = Path(__file__).resolve().parent.parent
camp = json.loads((W / 'campaign.json').read_text()); sp = json.loads((W / 'out/spots-cfg.json').read_text())
group = {v: k for k, ids in camp['series'].items() for v in ids}
src, dst = W / 'out/stills', W / 'out/stills_final'
if dst.exists(): shutil.rmtree(dst)
dst.mkdir(parents=True)
rows = []
for i in range(51, 151):
    vid, sid = f'W{i}', f'S{i}'; s = sp[vid]; m = s['meta']
    names = {}
    for size, tag in (('feed', 'feed-4x5'), ('story', 'story-9x16')):
        n = f"{camp['slug']}-{sid}-{s['slug']}-{tag}.jpg"; shutil.copy2(src / f'{sid}_{size}.jpg', dst / n); names[size] = n
    rows.append({'Ad name': f"{camp['adPrefix']}_{sid}_{s['slug']}", 'Feed image (4:5)': names['feed'], 'Story image (9:16)': names['story'],
                 'Group': group.get(vid, ''), 'Matches video': vid, 'Title': s['title'], 'Audience': s['persona'], 'Hook': s['hook'],
                 'Headline': m['headline'], 'Primary text': m['primary'], 'Button': m.get('button', 'Sign up'), 'Start': m['start'], 'End': m['end']})
with open(W / 'out/ad-copy-stills.tsv', 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0]), delimiter='\t'); w.writeheader(); w.writerows(rows)
print('stills', len(rows) * 2, 'rows', len(rows))
