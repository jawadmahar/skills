#!/usr/bin/env python3
"""Check finished videos against Meta Reels and Stories specs before anything is shared.

Usage:
  python3 check_videos.py OUT/final/*.mp4 [--no-loudness]

Checks: 1080x1920 (9:16), H.264 yuv420p, 24 to 60 fps, AAC audio present, 5 to 90 s, under 4 GB,
and integrated loudness within 2 LU of -16 LUFS. Exits 1 if any file fails.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path


def probe(f):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(f)], capture_output=True, text=True)
    return json.loads(r.stdout or '{}')


def loudness(f):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(f), '-af', 'ebur128=framelog=quiet', '-f', 'null', '-'],
                       capture_output=True, text=True)
    m = re.findall(r'I:\s+(-?[\d.]+) LUFS', r.stderr)
    return float(m[-1]) if m else None


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('files', nargs='+')
    ap.add_argument('--no-loudness', action='store_true')
    ap.add_argument('--size', default='1080x1920')
    a = ap.parse_args()
    bad = 0
    print('file\tsize\tfps\tsecs\taudio\tLUFS\tMB\tresult')
    for f in map(Path, a.files):
        p = probe(f)
        v = next((s for s in p.get('streams', []) if s['codec_type'] == 'video'), None)
        au = next((s for s in p.get('streams', []) if s['codec_type'] == 'audio'), None)
        issues = []
        if not v:
            issues.append('no video')
            v = {}
        size = f"{v.get('width')}x{v.get('height')}"
        if size != a.size:
            issues.append(f'size {size}')
        if v.get('codec_name') != 'h264' or v.get('pix_fmt') != 'yuv420p':
            issues.append(f"codec {v.get('codec_name')}/{v.get('pix_fmt')}")
        num, den = (v.get('avg_frame_rate') or '0/1').split('/')
        fps = float(num) / float(den or 1) if float(den or 1) else 0
        if not 24 <= fps <= 60:
            issues.append(f'fps {fps:.1f}')
        secs = float(p.get('format', {}).get('duration', 0))
        if not 5 <= secs <= 90:
            issues.append(f'length {secs:.1f}s')
        if not au or au.get('codec_name') != 'aac':
            issues.append('no AAC audio')
        mb = f.stat().st_size / 1e6
        if mb > 4000:
            issues.append('over 4 GB')
        lufs = None if a.no_loudness or not au else loudness(f)
        if lufs is not None and abs(lufs + 16) > 2:
            issues.append(f'loudness {lufs}')
        bad += bool(issues)
        print(f"{f.name}\t{size}\t{fps:.0f}\t{secs:.1f}\t{au.get('codec_name') if au else '-'}\t{lufs if lufs is not None else '-'}\t{mb:.1f}\t{'OK' if not issues else '; '.join(issues)}")
    print(f'\n{len(a.files) - bad} of {len(a.files)} passed')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
