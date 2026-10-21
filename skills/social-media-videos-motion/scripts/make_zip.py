#!/usr/bin/env python3
"""Zip a delivery folder for sharing, splitting only when it would be too big.

Usage:
  python3 make_zip.py STAGING_DIR OUT_DIR [--name "Explorazone-Winter-Videos"] [--max-mb 1800]

STAGING_DIR is the folder exactly as the recipient should see it, e.g.
  1 Videos/Rain series/*.mp4, 2 Pack.pdf, 3 Ad copy.tsv, Music credits.txt, README.txt
MP4s are stored as they are (already compressed); text and PDFs are deflated.
If everything fits under --max-mb you get one zip. Otherwise videos are spread across parts and every
part carries the README, pack and sheets, so each zip makes sense on its own. Fewer zips is better.
"""
import argparse
import zipfile
from pathlib import Path


def write(zpath, files, root):
    with zipfile.ZipFile(zpath, 'w', allowZip64=True) as z:
        for f in files:
            z.write(f, Path(root.name) / f.relative_to(root),
                    compress_type=zipfile.ZIP_STORED if f.suffix.lower() in ('.mp4', '.mov', '.jpg', '.png', '.zip') else zipfile.ZIP_DEFLATED)
    return zpath.stat().st_size / 1e6


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('staging')
    ap.add_argument('out')
    ap.add_argument('--name')
    ap.add_argument('--max-mb', type=float, default=1800)
    a = ap.parse_args()
    root, out = Path(a.staging).resolve(), Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    name = a.name or root.name
    files = sorted(p for p in root.rglob('*') if p.is_file() and p.name != '.DS_Store')
    videos = [f for f in files if f.suffix.lower() in ('.mp4', '.mov')]
    shared = [f for f in files if f not in videos]
    total = sum(f.stat().st_size for f in files) / 1e6
    if total <= a.max_mb:
        mb = write(out / f'{name}.zip', files, root)
        print(f'{name}.zip  {mb:.0f} MB  ({len(videos)} videos)')
        return
    shared_mb = sum(f.stat().st_size for f in shared) / 1e6
    parts, cur, size = [], [], shared_mb
    for v in videos:  # keep the folder order so each part holds whole series where possible
        vmb = v.stat().st_size / 1e6
        if cur and size + vmb > a.max_mb:
            parts.append(cur); cur, size = [], shared_mb
        cur.append(v); size += vmb
    parts.append(cur)
    for i, p in enumerate(parts, 1):
        zname = f'{name} (part {i} of {len(parts)}).zip'
        mb = write(out / zname, shared + p, root)
        print(f'{zname}  {mb:.0f} MB  ({len(p)} videos)')


if __name__ == '__main__':
    main()
