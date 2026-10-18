#!/usr/bin/env python3
"""Build a single-file video studio (HTML) for one campaign.

The studio previews every spot, scrubs the timeline and is what render.mjs
captures frame by frame. Everything (photos, logo, brand and campaign settings,
spot code) is embedded, so the file works offline apart from Google Fonts and
three.js.

Usage:
  python3 build_studio.py CAMPAIGN_DIR [--assets DIR] [--out studio.html]

CAMPAIGN_DIR holds campaign.json (see references/engine.md). The assets folder
holds logo.png and photos/*.jpg|png; photo keys are the file names without the
extension, e.g. photos/laser_room.jpg is IMG.laser_room in spot code.
"""
import argparse
import base64
import html
import io
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
DASHES = {'\u2014': 'em dash', '\u2013': 'en dash'}
ROLE_KEYS = ['accent', 'light', 'ink', 'cta', 'ctaText']


def fail(msg):
    sys.exit(f'build_studio: {msg}')


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding='utf-8'))
    except FileNotFoundError:
        fail(f'missing {path}')
    except json.JSONDecodeError as e:
        fail(f'{path} is not valid JSON: {e}')


def data_uri(path, max_w):
    raw = path.read_bytes()
    mime = 'image/png' if path.suffix.lower() == '.png' else 'image/jpeg'
    try:  # shrink oversized photos so the studio stays light; never upscale
        from PIL import Image
        im = Image.open(io.BytesIO(raw))
        if im.width > max_w:
            im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
            buf = io.BytesIO()
            if mime == 'image/png':
                im.save(buf, 'PNG', optimize=True)
            else:
                im.convert('RGB').save(buf, 'JPEG', quality=90)
            raw = buf.getvalue()
        elif im.width < 700 and path.stem != 'logo':
            print(f'  note: {path.name} is only {im.width}px wide, keep it small on screen')
    except ImportError:
        pass
    return f'data:{mime};base64,' + base64.b64encode(raw).decode()


def js_json(obj):
    # safe to drop inside a <script> block
    return json.dumps(obj, ensure_ascii=False).replace('</', '<\\/')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('campaign', help='campaign folder (with campaign.json) or the campaign.json itself')
    ap.add_argument('--assets', help='folder with logo.png and photos/ (default: "assets" in campaign.json)')
    ap.add_argument('--out', default='studio.html')
    ap.add_argument('--engine', default=str(HERE / 'engine'))
    ap.add_argument('--max-photo-width', type=int, default=1400)
    a = ap.parse_args()

    cpath = Path(a.campaign)
    if cpath.is_dir():
        cpath = cpath / 'campaign.json'
    cdir = cpath.parent
    camp = load_json(cpath)
    bpath = (cdir / camp['brand']).resolve() if camp.get('brand') else fail('campaign.json needs "brand": path to brand.json')
    brand = load_json(bpath)

    engine = Path(a.engine)
    parts = [(engine / 'head.html').read_text(encoding='utf-8'), (engine / 'core.js').read_text(encoding='utf-8')]
    for name in camp.get('libs', []):  # shared building blocks: weather, paper, fx3d (see references/engine.md)
        lib = engine / 'lib' / f'{name}.js'
        if not lib.exists():
            fail(f'unknown lib "{name}"; available: {sorted(p.stem for p in (engine / "lib").glob("*.js"))}')
        parts.append(lib.read_text(encoding='utf-8'))
    spot_files = camp.get('spots') or sorted(str(p.relative_to(cdir)) for p in (cdir / 'spots').glob('*.js'))
    if not spot_files:
        fail('no spot files: list them in campaign.json "spots" or put .js files in spots/')
    spot_src = {}
    for f in spot_files:
        p = cdir / f
        if not p.exists():
            fail(f'spot file not found: {p}')
        spot_src[f] = p.read_text(encoding='utf-8')
        parts.append(spot_src[f])
    parts.append((engine / 'main.js').read_text(encoding='utf-8'))
    page = '\n'.join(parts)

    # ---- assets ----
    adir = Path(a.assets) if a.assets else (cdir / camp.get('assets', 'assets'))
    if not adir.exists():
        fail(f'assets folder not found: {adir} (pass --assets; it needs logo.png and photos/)')
    logo = next((adir / n for n in ('logo.png', 'logo.jpg') if (adir / n).exists()), None)
    if not logo:
        fail(f'no logo.png in {adir}')
    assets = {'logo': data_uri(logo, 1200)}
    pdir = adir / 'photos' if (adir / 'photos').exists() else adir
    for p in sorted(pdir.iterdir()):
        if p.suffix.lower() in ('.jpg', '.jpeg', '.png') and p.stem != 'logo':
            assets[p.stem] = data_uri(p, a.max_photo_width)

    # ---- checks that catch the mistakes we have actually made ----
    problems, warnings = [], []
    code = '\n'.join(spot_src.values())
    used = set(re.findall(r'IMG\.(\w+)', code)) | set(re.findall(r'IMG\[[\'"](\w+)[\'"]\]', code))
    used |= set(re.findall(r'\bk:\s*[\'"](\w+)[\'"]', code))
    for key in sorted(used - set(assets)):
        problems.append(f'photo "{key}" is used in spot code but there is no {key}.jpg in {pdir}')
    pool = camp.get('photoPool') or brand.get('photoPool') or []
    for key in pool:
        if key not in assets:
            problems.append(f'photoPool lists "{key}" but there is no such photo')
    roles = {**brand.get('roles', {}), **camp.get('roles', {})}
    missing_roles = [r for r in ROLE_KEYS if r not in roles]
    if missing_roles:
        warnings.append(f'brand.json roles missing {missing_roles}; neutral defaults will be used')
    for name, text in [('brand.json', json.dumps(brand, ensure_ascii=False)), ('campaign.json', json.dumps(camp, ensure_ascii=False))] + list(spot_src.items()):
        for ch, label in DASHES.items():
            if ch in text:
                line = next((ln.strip() for ln in text.splitlines() if ch in ln), '')[:90]
                problems.append(f'{label} in {name}: "{line}" (house style: use a hyphen, comma or full stop)')
    ids = re.findall(r"defineSpot\(\{\s*id:\s*'(\w+)'", code)
    dupes = sorted({i for i in ids if ids.count(i) > 1})
    if dupes:
        problems.append(f'duplicate spot ids: {dupes}')
    for w in warnings:
        print('  warning:', w)
    if problems:
        print('\n'.join('  problem: ' + p for p in problems))
        fail(f'{len(problems)} problem(s), studio not written')

    # ---- fonts and studio text ----
    fams = []
    for f in brand.get('fonts', {}).get('google', []) + camp.get('fonts', {}).get('google', []):
        if f not in fams:
            fams.append(f)
    href = 'https://fonts.googleapis.com/css2?' + '&'.join('family=' + f for f in fams) + '&display=swap' if fams else ''
    studio = camp.get('studio', {})
    subs = {
        '__STUDIO_TITLE__': html.escape(studio.get('title', f"{brand.get('name', 'Brand')} video studio")),
        '__STUDIO_DESC__': html.escape(studio.get('description', camp.get('name', ''))),
        '__EYEBROW__': html.escape(studio.get('eyebrow', camp.get('name', ''))),
        '__FONTS_HREF__': html.escape(href),
    }
    for k, v in subs.items():
        assert page.count(k) == 1, k
        page = page.replace(k, v)
    for k, v in {'__ASSETS__': json.dumps(assets), '__BRAND__': js_json(brand), '__CAMPAIGN__': js_json(camp)}.items():
        assert page.count(k) == 1, k
        page = page.replace(k, v)

    Path(a.out).write_text(page, encoding='utf-8')
    print(f'wrote {a.out}: {len(ids)} spots, {len(assets) - 1} photos, {len(page) // 1024} KB')


if __name__ == '__main__':
    main()
