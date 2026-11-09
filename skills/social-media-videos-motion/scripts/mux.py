#!/usr/bin/env python3
"""Add a music bed to each silent video: trimmed to length, faded, loudness-normalised for social (-16 LUFS).

Usage:
  python3 mux.py --silent OUT/silent --music music --map music_map.json --out OUT/final --prefix explorazone-winter

music_map.json maps spot id to a Mixkit id (uses music/mk_<id>.mp3) or to a file name in the music folder:
  {"V01": 10, "V02": "my-licensed-track.mp3"}
Start offsets come from music/starts.json (python3 mixkit.py starts) so tracks skip quiet intros.
Output: OUT/final/<prefix>-<ID>-<slug>.mp4, H.264 copied untouched plus AAC 192k 48 kHz.
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path


def duration(f):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(f)],
                                capture_output=True, text=True).stdout.strip())


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--silent', required=True)
    ap.add_argument('--music', default='music')
    ap.add_argument('--map', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--prefix', required=True)
    ap.add_argument('--fade-in', type=float, default=0.35)
    ap.add_argument('--fade-out', type=float, default=1.3)
    ap.add_argument('--lufs', type=float, default=-16)
    a = ap.parse_args()

    mdir, out = Path(a.music), Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    mapping = json.loads(Path(a.map).read_text())
    starts = json.loads((mdir / 'starts.json').read_text()) if (mdir / 'starts.json').exists() else {}
    used, missing = {}, []
    for f in sorted(Path(a.silent).glob('*.mp4')):
        sid = f.stem.split('-')[0]
        track = mapping.get(sid)
        if track is None:
            missing.append(sid); continue
        key = str(track)
        src = mdir / (f'mk_{key}.mp3' if key.isdigit() else key)
        if not src.exists():
            sys.exit(f'{sid}: music file {src} not found (python3 mixkit.py fetch {key})')
        used.setdefault(key, []).append(sid)
        st = starts.get(key if key.isdigit() else Path(key).stem, {}).get('start', 0)
        dur = duration(f)
        fo = max(0.0, dur - a.fade_out)
        dst = out / f'{a.prefix}-{f.name}'
        af = (f'[1:a]atrim=0:{dur:.3f},asetpts=PTS-STARTPTS,afade=t=in:st=0:d={a.fade_in},afade=t=out:st={fo:.2f}:d={a.fade_out},'
              f'loudnorm=I={a.lufs}:TP=-1.5:LRA=11,aresample=48000[a]')
        r = subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(f), '-ss', str(st), '-i', str(src), '-filter_complex', af,
                            '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart',
                            '-t', f'{dur:.3f}', str(dst)], capture_output=True, text=True)
        if r.returncode:
            sys.exit(f'{sid}: ffmpeg failed\n{r.stderr}')
        print(f'{dst.name}  music {key} from {st}s')
    for key, sids in used.items():
        if len(sids) > 1:
            print(f'  note: track {key} is used by {sids}; one track per video keeps the set diverse')
    if missing:
        print(f'  warning: no music mapped for {missing}; those videos were skipped')


if __name__ == '__main__':
    main()
