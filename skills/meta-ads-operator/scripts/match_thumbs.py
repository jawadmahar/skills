#!/usr/bin/env python3
"""Match Meta image hashes to local thumbnail files by comparing the pictures.

Usage:
  python3 match_thumbs.py --meta images.json --local out/thumbs --out thumbs.json

--meta   what ads_get_ad_images returned for a hashes lookup with url_128 (or url): either the
         tool's JSON ({"ad_images": [{"hash": ..., "url_128": ...}, ...]}), a plain list of those
         objects, or a dict {"<hash>": "<url>"}
--local  folder of the thumbnails you uploaded. The ID comes from the file name: V07.jpg or
         thumb-V07.jpg is V07, and thumbB-V02.jpg (or V02B.jpg) is the B cover of V02, V02B.

Why: images copied in by URL are all named "untitled", and their order does not follow the
upload order once a call has been retried, so pairing by position goes wrong. Meta also
re-encodes the files, so hashes are not the MD5 of your files. Pictures are compared at 36x64
in greyscale; a clear match scores near 0, and the script warns when the best and second-best
matches are close.
"""
import argparse
import io
import json
import re
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image

SIZE = (36, 64)


def fetch(url):
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            return r.read()
    except Exception:
        if shutil.which('curl'):
            r = subprocess.run(['curl', '-sS', '-L', '-m', '30', url], capture_output=True)
            if r.returncode == 0 and r.stdout:
                return r.stdout
        raise


def vec(data):
    return np.asarray(Image.open(io.BytesIO(data)).convert('L').resize(SIZE, Image.LANCZOS), dtype=float)


def local_id(stem):
    m = re.match(r'thumbB-(.+)$', stem)
    if m:
        return m.group(1) + 'B'
    m = re.match(r'thumb-(.+)$', stem)
    return m.group(1) if m else stem


def load_meta(path):
    d = json.loads(Path(path).read_text(encoding='utf-8'))
    if isinstance(d, dict) and 'ad_images' in d:
        d = d['ad_images']
        d = json.loads(d) if isinstance(d, str) else d
    if isinstance(d, dict):
        return dict(d)
    return {x['hash']: x.get('url_128') or x.get('url') for x in d}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--meta', required=True)
    ap.add_argument('--local', required=True)
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    local = {local_id(p.stem): vec(p.read_bytes()) for p in sorted(Path(a.local).iterdir())
             if p.suffix.lower() in ('.jpg', '.jpeg', '.png')}
    if not local:
        sys.exit(f'match_thumbs: no images in {a.local}')
    mapping, warnings = {}, []
    for h, url in load_meta(a.meta).items():
        m = vec(fetch(url))
        scores = sorted((float(np.abs(m - l).mean()), k) for k, l in local.items())
        best, second = scores[0], scores[1] if len(scores) > 1 else (999.0, '-')
        if best[1] in mapping:
            warnings.append(f'{best[1]} matched twice ({mapping[best[1]]} and {h})')
        mapping[best[1]] = h
        flag = '' if best[0] < 8 and second[0] - best[0] > 5 else '  <- check by eye'
        if flag:
            warnings.append(f'{h} -> {best[1]} is not a clear match')
        print(f'{h} -> {best[1]:6} score {best[0]:5.1f} | next {second[1]} {second[0]:5.1f}{flag}')
    Path(a.out).write_text(json.dumps(dict(sorted(mapping.items())), indent=1), encoding='utf-8')
    missing = sorted(set(local) - set(mapping))
    print(f'{a.out}: {len(mapping)} matched' + (f'; no Meta image for {", ".join(missing)}' if missing else ''))
    if warnings:
        print('\n'.join('  warning: ' + w for w in warnings))
        sys.exit(1)


if __name__ == '__main__':
    main()
