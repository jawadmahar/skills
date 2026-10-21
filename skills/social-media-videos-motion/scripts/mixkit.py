#!/usr/bin/env python3
"""Find, download and prepare Mixkit music (Mixkit Free Licence: commercial use incl. social ads, no attribution needed).

  python3 mixkit.py search children happy upbeat          list tracks on Mixkit category or tag pages
  python3 mixkit.py fetch 10 988 529 --dir music          download tracks as music/mk_<id>.mp3
  python3 mixkit.py starts --dir music                    find where each track gets going -> music/starts.json

"search" takes Mixkit page names: categories (e.g. children, happy, upbeat, chill, cinematic, corporate,
christmas) or tags as "tag/<name>" (e.g. tag/ukulele, tag/piano). It is best effort: if Mixkit changes its
page layout, browse https://mixkit.co/free-stock-music/ and note the track ids by hand.
Record the title and artist of every track you use in music_credits.json, which feeds the pack and credits.
"""
import argparse
import html
import json
import re
import subprocess
import sys
from pathlib import Path


def curl(url, out=None):
    cmd = ['curl', '-sSL', '-m', '60', '-A', 'Mozilla/5.0', url]
    if out:
        cmd += ['-o', str(out)]
    r = subprocess.run(cmd, capture_output=True, text=not out)
    if r.returncode:
        raise RuntimeError(f'curl failed for {url}: {r.stderr}')
    return r.stdout


def search(pages):
    found = {}
    for pg in pages:
        s = curl(f'https://mixkit.co/free-stock-music/{pg.strip("/")}/')
        for m in re.finditer(r'data-audio-player-item-id-value="(\d+)"', s):
            blk = s[m.start():m.start() + 6000]
            t = re.search(r'item-grid-card__title">\s*(.*?)\s*</h2>', blk, re.S)
            a = re.search(r'music-preview__author">\s*by (.*?)\s*</p>', blk, re.S)
            d = re.search(r'data-test-id="duration">\s*([\d:]+)', blk)
            tags = re.findall(r'meta-links__link"[^>]*>([^<]+)<', blk)
            tid = m.group(1)
            rec = found.setdefault(tid, {'id': int(tid), 'title': html.unescape(t.group(1)) if t else '?',
                                         'author': html.unescape(a.group(1)) if a else '?', 'dur': d.group(1) if d else '?',
                                         'tags': sorted({html.unescape(x) for x in tags}), 'pages': []})
            rec['pages'].append(pg)
    for r in found.values():
        print(f"{r['id']:>5} | {r['title']} | {r['author']} | {r['dur']} | {', '.join(r['tags'][:6])}")
    Path('mixkit_search.json').write_text(json.dumps(found, indent=1, ensure_ascii=False))
    print(f'{len(found)} tracks -> mixkit_search.json')


def fetch(ids, d):
    d.mkdir(parents=True, exist_ok=True)
    for i in ids:
        f = d / f'mk_{i}.mp3'
        if f.exists() and f.stat().st_size > 50000:
            print(f'{f.name} already here'); continue
        curl(f'https://assets.mixkit.co/music/{i}/{i}.mp3', f)
        print(f'{f.name} {f.stat().st_size // 1024} KB')


def starts(d):
    """Skip quiet intros: start where the track first holds 75% of its typical loudness for 2 s."""
    import numpy as np
    res = {}
    for f in sorted(d.glob('*.mp3')):
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(f), '-ac', '1', '-ar', '8000', '-f', 's16le', '-'], capture_output=True).stdout
        x = np.frombuffer(raw, dtype=np.int16).astype(float) / 32768
        hop = 2000  # 0.25 s
        n = len(x) // hop
        if not n:
            continue
        rms = np.array([np.sqrt(np.mean(x[k * hop:(k + 1) * hop] ** 2)) for k in range(n)])
        med = np.median(rms[:min(n, 240)])
        start = next((k * 0.25 for k in range(n) if rms[k] > 0.75 * med and (rms[k:k + 8] > 0.6 * med).all()), 0.0)
        key = f.stem[3:] if f.stem.startswith('mk_') else f.stem
        res[key] = {'file': f.name, 'start': round(start, 2), 'dur': round(len(x) / 8000, 1)}
        print(key, res[key])
    (d / 'starts.json').write_text(json.dumps(res, indent=1))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('cmd', choices=['search', 'fetch', 'starts'])
    ap.add_argument('args', nargs='*')
    ap.add_argument('--dir', default='music')
    a = ap.parse_args()
    if a.cmd == 'search':
        search(a.args or ['children', 'happy', 'upbeat'])
    elif a.cmd == 'fetch':
        if not a.args:
            sys.exit('give track ids')
        fetch(a.args, Path(a.dir))
    else:
        starts(Path(a.dir))


if __name__ == '__main__':
    main()
