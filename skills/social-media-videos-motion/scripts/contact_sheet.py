#!/usr/bin/env python3
"""Make a labelled contact sheet so you can eyeball many frames at once (then Read the JPEG to review it).

  python3 contact_sheet.py SHEET.jpg STILLS_DIR            stills from render.mjs stills
  python3 contact_sheet.py SHEET.jpg OUT/final/*.mp4 --at 0.1,0.5,0.9
                                                           frames pulled from finished videos
Look for: text outside the safe zone (top 14%, bottom 35%), overlaps, empty bands, typos, cut-off words,
photos that do not match the copy, and end cards with the wrong offer or dates.
"""
import argparse
import re
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw


def frames_from_videos(files, at, tmp):
    out = []
    for f in files:
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(f)],
                                   capture_output=True, text=True).stdout)
        for a in at:
            t = min(dur - 0.05, a * dur)
            m = re.search(r'[A-Z]\d{2,3}-.*', f.stem)  # label with the video id and slug, not the long prefix
            p = Path(tmp) / f'{(m.group(0) if m else f.stem)[:30]}_{t:.1f}.jpg'
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', str(f), '-frames:v', '1', str(p)])
            out.append(p)
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('sheet')
    ap.add_argument('inputs', nargs='+')
    ap.add_argument('--at', default='0.1,0.5,0.92')
    ap.add_argument('--cols', type=int, default=6)
    ap.add_argument('--thumb', type=int, default=270)
    ap.add_argument('--safe', action='store_true', help='shade the Reels UI areas')
    a = ap.parse_args()
    with tempfile.TemporaryDirectory() as tmp:
        paths = []
        for i in map(Path, a.inputs):
            if i.is_dir():
                paths += sorted(p for p in i.iterdir() if p.suffix.lower() in ('.jpg', '.png'))
            elif i.suffix.lower() == '.mp4':
                paths += frames_from_videos([i], [float(x) for x in a.at.split(',')], tmp)
            else:
                paths.append(i)
        tw, th = a.thumb, round(a.thumb * 16 / 9)
        rows = (len(paths) + a.cols - 1) // a.cols
        sheet = Image.new('RGB', (a.cols * (tw + 8) + 8, rows * (th + 30) + 8), '#222')
        d = ImageDraw.Draw(sheet)
        for n, p in enumerate(paths):
            im = Image.open(p).convert('RGB').resize((tw, th))
            if a.safe:
                ov = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
                od = ImageDraw.Draw(ov)
                od.rectangle([0, 0, tw, th * 0.14], fill=(255, 60, 30, 70))
                od.rectangle([0, th * 0.65, tw, th], fill=(255, 60, 30, 70))
                im = Image.alpha_composite(im.convert('RGBA'), ov).convert('RGB')
            x, y = 8 + (n % a.cols) * (tw + 8), 8 + (n // a.cols) * (th + 30)
            sheet.paste(im, (x, y))
            d.text((x + 2, y + th + 6), p.stem[:40], fill='#ddd')
        sheet.save(a.sheet, quality=85)
        print(f'{a.sheet}: {len(paths)} frames')


if __name__ == '__main__':
    main()
