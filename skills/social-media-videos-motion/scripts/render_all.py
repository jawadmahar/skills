#!/usr/bin/env python3
"""Render spots to silent H.264 MP4s (1080x1920, 30 fps), several at a time.

Usage:
  python3 render_all.py STUDIO.html OUT_DIR [--ids V01,V02] [--jobs 3] [--campaign campaign.json]

Writes OUT_DIR/spots.json (spot metadata) and OUT_DIR/silent/<ID>-<slug>.mp4.
Frames go to OUT_DIR/frames_<ID>/ and are deleted after encoding.
Slugs come from campaign.json "slugs", then the spot's own slug, then its title.
Rendering is slow under software WebGL (roughly 1 to 3 minutes per 12 s spot),
so run long batches in the background and check the log.
"""
import argparse
import json
import re
import shutil
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent


def slugify(s):
    s = s.lower().replace('&', 'and').replace('£', '')
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(f"{' '.join(map(str, cmd[:4]))} failed:\n{r.stdout}\n{r.stderr}")
    return r.stdout


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('studio')
    ap.add_argument('out')
    ap.add_argument('--ids', help='comma-separated spot ids (default: all)')
    ap.add_argument('--jobs', type=int, default=3)
    ap.add_argument('--fps', type=int, default=30)
    ap.add_argument('--crf', type=int, default=18)
    ap.add_argument('--campaign', help='campaign.json, for slugs')
    a = ap.parse_args()

    out = Path(a.out)
    (out / 'silent').mkdir(parents=True, exist_ok=True)
    meta = out / 'spots.json'
    run(['node', str(HERE / 'render.mjs'), 'meta', a.studio, str(meta)])
    spots = {s['id']: s for s in json.loads(meta.read_text())}
    slugs = json.loads(Path(a.campaign).read_text()).get('slugs', {}) if a.campaign else {}
    ids = a.ids.split(',') if a.ids else list(spots)
    unknown = [i for i in ids if i not in spots]
    if unknown:
        sys.exit(f'unknown spot ids: {unknown}')

    def one(sid):
        t0 = time.time()
        s = spots[sid]
        slug = slugs.get(sid) or s.get('slug') or slugify(s['title'])
        frames = out / f'frames_{sid}'
        run(['node', str(HERE / 'render.mjs'), 'frames', a.studio, sid, str(frames), '--fps', str(a.fps)])
        mp4 = out / 'silent' / f'{sid}-{slug}.mp4'
        run(['ffmpeg', '-y', '-v', 'error', '-framerate', str(a.fps), '-i', str(frames / '%04d.jpg'), '-c:v', 'libx264',
             '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', str(a.crf), '-preset', 'slow', '-movflags', '+faststart', str(mp4)])
        shutil.rmtree(frames, ignore_errors=True)
        print(f'{sid} -> {mp4.name} ({time.time() - t0:.0f}s)', flush=True)
        return sid

    failed = []
    with ThreadPoolExecutor(max_workers=a.jobs) as ex:
        for sid, fut in [(i, ex.submit(one, i)) for i in ids]:
            try:
                fut.result()
            except Exception as e:  # keep going so one bad spot does not lose the batch
                failed.append(sid)
                print(f'{sid} FAILED: {e}', file=sys.stderr, flush=True)
    print(f'done: {len(ids) - len(failed)} rendered' + (f', failed: {failed}' if failed else ''))
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
