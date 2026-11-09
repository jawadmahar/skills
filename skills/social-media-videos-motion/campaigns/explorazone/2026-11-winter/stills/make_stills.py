#!/usr/bin/env python3
"""Build static ads (4:5 feed and 9:16 story) from the motion spots' own settings, so every still matches its video.

  python3 make_stills.py --ids W51-W150            writes out/stills_html/S51_feed.html, S51_story.html, ...
  node shoot.mjs out/stills_html out/stills        screenshots them to JPEG

Each spot's format (dossier, notebook, phone, chart...) picks a layout; the hook, photos and labels come from the
spot config dumped to out/spots-cfg.json. Every still carries the same offer band: offer, maths, end date, terms.
"""
import argparse
import html
import json
import re
from pathlib import Path

W = Path(__file__).resolve().parent.parent
CAMP = json.loads((W / 'campaign.json').read_text())
BRAND = json.loads((W / CAMP['brand']).resolve().read_text()) if not Path(CAMP['brand']).is_absolute() else json.loads(Path(CAMP['brand']).read_text())
SP = json.loads((W / 'out/spots-cfg.json').read_text())
PHOTOS = W / 'assets/photos'
LABEL = CAMP.get('labels', {})
FOCUS = {**BRAND.get('focus', {}), **CAMP.get('focus', {})}
COPY = CAMP['copy']
P = BRAND['palette']
SIZES = {'feed': (1080, 1350), 'story': (1080, 1920)}
LAY = {'feed': {'logo': 40, 'top': 124, 'offer': 1022}, 'story': {'logo': 196, 'top': 286, 'offer': 1180}}
BOX_H = 880

esc = html.escape


def hl(s):
    """'_word_' marks the highlighted phrase, as in the videos."""
    s = esc(s)
    s = re.sub(r'_([^_]+)_', r'<em>\1</em>', s)
    return s.replace('_', '')


def lines(ls):
    return '<br>'.join(hl(x) for x in ls if x)


def fit(ls, width=960, mx=92, mn=48, k=0.56):
    n = max((len(re.sub('_', '', x)) for x in ls if x), default=10)
    return int(max(mn, min(mx, width / (k * n))))


def ph(key):
    return (PHOTOS / f'{key}.jpg').as_uri()


def pos(key):
    fx, fy = FOCUS.get(key, [0.5, 0.5])
    return f'{fx * 100:.0f}% {fy * 100:.0f}%'


def img(key, cls='', style='', label=True):
    lab = f'<span class="lab">{esc(LABEL[key])}</span>' if label and key in LABEL else ''
    return f'<div class="ph {cls}" style="{style}"><img src="{ph(key)}" style="object-position:{pos(key)}">{lab}</div>'


def keys_of(cfg):
    out = []
    def add(k):
        if isinstance(k, str) and (PHOTOS / f'{k}.jpg').exists() and k not in out:
            out.append(k)
    for f in ('reveal', 'photo', 'fillKey', 'wall'):
        add(cfg.get(f))
    for f in ('cards', 'strip', 'shots', 'grid', 'scenes'):
        for k in cfg.get(f, []) or []:
            add(k)
    for f in ('segs', 'inside', 'pics', 'worlds', 'patches', 'pops', 'pieces', 'wipes', 'good', 'items', 'qs', 'pairs'):
        for row in cfg.get(f, []) or []:
            if isinstance(row, dict):
                add(row.get('key'))
            elif isinstance(row, list):
                for v in row:
                    add(v)
    if isinstance(cfg.get('hero'), list):
        add(cfg['hero'][1])
    return out


def head_of(s):
    c = s['cfg']
    for f in ('hook', 'cover'):
        if c.get(f) and any(c[f]):
            return c[f]
    if c.get('hooks'):
        return c['hooks'][0][1]
    if c.get('beats'):
        return c['beats'][-1][0]
    return c.get('end') or [s['meta']['headline']]


# ---------------------------------------------------------------- layouts: each returns (stage background css, box html)
def L_glass(s, ks):
    c = s['cfg']; k = ks[0]
    hd = head_of(s); sub = c.get('mid') or c.get('hook2') or c.get('end') or []
    extra = ''
    if s['fmt'] == 'forecastFmt':
        rows = ''.join(f'<div class="fc"><b>{esc(d)}</b><span class="g">{esc(a)}</span><span class="good">{esc(g[2])}</span></div>' for (d, a, *_), g in zip(c['days'], c['good']))
        extra = f'<div class="fcs">{rows}</div>'
    elif s['fmt'] == 'stormFmt':
        extra = f'<div class="alert">⚠ {esc(c["alert"][0])}<small>{esc(c["alert"][1])}</small></div>'
    elif s['fmt'] == 'stopwatchFmt':
        t = int(c.get('target', 299)); extra = f'<div class="watch">{t // 60:02d}:{t % 60:02d}<small>{esc(c.get("stamp", ""))}</small></div>'
    box = f'''<div class="glass-bg">{img(k, 'full blur', label=False)}</div><div class="gph">{img(k)}</div>
<div class="glass"><h1 style="font-size:{fit(hd, 860, 92)}px">{lines(hd)}</h1><h2>{lines(sub)}</h2></div>{f'<div class="glass g2">{extra}</div>' if extra else ''}'''
    return P['navy'], box, 'dark'


def L_pov(s, ks):
    c = s['cfg']; segs = c['segs']
    cap = segs[0][1]; k = segs[min(1, len(segs) - 1)][0]
    small = ''.join(f'<span>{esc(x[1])}</span>' for x in segs[1:4])
    return '#000', f'''<div class="glass-bg">{img(k, 'full blur', label=False)}</div><div class="pvph">{img(k)}</div>
<p class="cap">{esc(cap)}</p><div class="povs">{small}</div>''', 'dark'


def L_bignum(s, ks):
    c = s['cfg']
    if s['fmt'] == 'flapFmt':
        num = ' '.join(c['nums']) if all(len(x) == 1 for x in c['nums']) else c['nums'][-1]; hd = c['hook']; sub = c.get('label', '')
    else:
        num = c['num']; hd = c['beats'][-1][0]; sub = ' · '.join(c.get('chips', []))
    k = c.get('fillKey') or ks[0]
    size = 520 if len(num) <= 3 else 400
    return f'background:radial-gradient(circle at 50% 40%, {P["royal"]}, {P["navy"]})', f'''<h1 class="top" style="font-size:{fit(hd, 960, 92)}px">{lines(hd)}</h1>
<div class="big" style="font-size:{size}px;background-image:url('{ph(k)}');background-position:{pos(k)}">{esc(num)}</div>
<div class="bigsub">{esc(sub)}</div>''', 'dark'


def phone_screen(s, ks):
    c = s['cfg']; f = s['fmt']
    if f in ('chatFmt', 'chatTakeoverFmt'):
        msgs = ''
        for m in c['msgs'][:5]:
            if m.get('me') and m.get('key'):
                msgs += f'<div class="msg me pic"><img src="{ph(m["key"])}" style="object-position:{pos(m["key"])}"><p>{esc(m["text"])}</p></div>'
            else:
                msgs += f'<div class="msg"><b style="color:{m.get("col", "#c2410c")}">{esc(m.get("who", ""))}</b><p>{esc(m["text"])}</p></div>'
        return f'<div class="chat-top"><i>{esc(c["title"][:1])}</i><b>{esc(c["title"])}</b><small>{esc(c.get("members", ""))}</small></div><div class="chat">{msgs}</div>'
    if f == 'searchFmt':
        sug = ''.join(f'<li class="{"on" if i == c.get("pick", 0) else ""}">{esc(c["query"])} <b>{esc(x)}</b></li>' for i, x in enumerate(c['suggest']))
        res = ''.join(f'<img src="{ph(k)}" style="object-position:{pos(k)}">' for k in c['cards'][:3])
        return f'<div class="search"><div class="bar">🔍 {esc(c["query"])} {esc(c["suggest"][c.get("pick", 0)])}</div><ul>{sug}</ul><div class="res"><b>Explorazone</b><small>Indoor science attraction · Bowthorpe, Norwich</small><div class="r3">{res}</div></div></div>'
    if f == 'notifFmt' or (f == 'phoneFmt' and c.get('mode') == 'reminder'):
        wall = c.get('wall') or (c.get('shots') or ks)[0]
        if f == 'notifFmt':
            notes = [(n[0], n[1], n[2], n[3], n[4]) for n in c['notes']]
            tm, dy = c.get('time', '20:14'), c.get('day', 'Friday')
        else:
            notes = [('Reminder' if i < len(c['reminders']) - 1 else 'Explorazone', '#64748b' if i < len(c['reminders']) - 1 else P['red'], '!' if i < len(c['reminders']) - 1 else 'E', r[0], r[1]) for i, r in enumerate(c['reminders'])]
            tm, dy = c.get('time', '08:30'), c.get('date', '')
        nn = ''.join(f'<div class="note"><i style="background:{col}">{esc(l)}</i><div><b>{esc(t)}</b><p>{esc(b)}</p></div></div>' for app, col, l, t, b in notes)
        return f'<div class="lock"><img class="wall" src="{ph(wall)}" style="object-position:{pos(wall)}"><div class="dy">{esc(dy)}</div><div class="tm">{esc(tm)}</div>{nn}</div>'
    if f == 'phoneFmt' and c.get('mode') == 'story':
        k = c['shots'][-1]; cap = (c.get('captions') or [''])[-1]
        bars = ''.join('<i></i>' for _ in c['shots'])
        return f'<div class="igstory"><img src="{ph(k)}" style="object-position:{pos(k)}"><div class="bars">{bars}</div><div class="who"><i>E</i>explorazone</div><p>{esc(cap)}</p></div>'
    if f == 'rollFmt':
        g = ''.join(f'<img src="{ph(k)}" style="object-position:{pos(k)}">' for k in c['grid'][:12])
        return f'<div class="roll"><h3>Recents</h3><small>{esc(c.get("sub", ""))}</small><div class="grid">{g}</div></div>'
    if f == 'payFmt':
        rows = ''.join(f'<div class="row {"hot" if len(r) > 3 and r[3] else ""}"><span>{esc(r[0])}</span><b>{esc(r[1])}</b></div>' for r in c['rows'])
        return f'<div class="pay"><div class="pay-top"><span>PAYDAY</span></div>{rows}</div>'
    if f == 'screenTimeFmt':
        bars = ''.join(f'<i style="height:{h}%"></i>' for h in (30, 42, 38, 55, 70, 88, 96))
        return f'<div class="st"><h3>Screen Time</h3><small>Daily average</small><div class="big">7h 48m</div><div class="bars">{bars}</div></div>'
    # feed
    posts = ''.join(f'<div class="post"><div class="who"><i>E</i>explorazone</div><img src="{ph(k)}" style="object-position:{pos(k)}"><div class="likes">♥ {n} likes</div></div>' for k, n in zip((c.get('shots') or ks)[:2], (312, 204)))
    return f'<div class="feedtop">{esc(c.get("feedTitle", "For you"))}</div>{posts}'


def L_phone(s, ks):
    c = s['cfg']; hd = [h for h in (c.get('hook') or []) if h] or [s['meta']['headline']]
    sub = c.get('mid') or c.get('end') or []
    if sub == hd:
        sub = []
    if len(hd) == 1 and len(hd[0]) > 14:
        w = hd[0].split(' '); best = min(range(1, len(w)), key=lambda i: abs(len(' '.join(w[:i])) - len(' '.join(w[i:]))))
        hd = [' '.join(w[:best]), '_' + ' '.join(w[best:]) + '_']
    if s['fmt'] == 'screenTimeFmt':
        hd = c.get('hook2') or hd
    return f'background:linear-gradient(160deg,{P["navy"]},{P["royal"]})', f'''<div class="pcol"><h1 style="font-size:{fit(hd, 500, 84, 42, 0.56)}px">{lines(hd)}</h1><h2>{lines(sub)}</h2></div>
<div class="phone"><div class="scr">{phone_screen(s, ks)}</div><div class="notch"></div></div>''', 'dark'


PAPERS = {'lined': '#fffdf6', 'notepad': '#fff3b0', 'diary': '#fbf4e4', 'squared': '#ffffff', 'report': '#ffffff', 'planner': '#fffdf6',
          'santa': '#fff8ef', 'card': '#fff8ef', 'postcard': '#fbf3e2', 'fridge': '#eef2f5'}


def L_note(s, ks):
    c = s['cfg']; f = s['fmt']
    if f == 'chalkFmt':
        txt = ''.join(f'<p style="font-size:{min(76, (ln[2] if len(ln) > 2 else 58)) * 0.95:.0f}px;color:{ln[3] if len(ln) > 3 else "#f4f1e8"}">{esc(ln[0])}</p>' for ln in c['lines'])
        pics = [p[0] for p in c.get('pics', [])][:3]
        pol = ''.join(f'<div class="pol" style="--r:{r}deg">{img(k, label=False)}<span>{esc(LABEL.get(k, "").lower())}</span></div>' for k, r in zip(pics, (-5, 4, -3)))
        return '#3b3226', f'<div class="paper chalk"><div class="txt">{txt}</div></div><div class="pols">{pol}</div>', 'dark'
    paper = c.get('paper', 'lined')
    items = c.get('items', [])
    txt = ''
    for it in items:
        if it.get('type') in ('w', 'print') and it.get('text'):
            fam = it.get('fam') or '"Patrick Hand", cursive'
            size = min(70, (it.get('size') or 56) * 0.92, 780 / (0.5 * max(1, len(it['text']))))
            txt += f'<p style="font-family:{esc(fam)};font-size:{size:.0f}px;color:{it.get("color") or "#1f2937"}">{esc(it["text"])}</p>'
    tot = sum(float(m) * 1.12 + 8 for m in re.findall(r'font-size:([0-9.]+)px', txt))
    if tot > 540:
        txt = re.sub(r'font-size:([0-9.]+)px', lambda m: f'font-size:{float(m.group(1)) * 540 / tot:.0f}px', txt)
    pics = [it['key'] for it in items if it.get('type') in ('pol', 'corners', 'magnet', 'pic', 'card') and it.get('key')][:3]
    if not pics:
        pics = ks[:2]
    pol = ''.join(f'<div class="pol" style="--r:{r}deg">{img(k, label=False)}<span>{esc(next((it.get("label") for it in items if it.get("key") == k and isinstance(it.get("label"), str)), LABEL.get(k, "").lower()))}</span></div>' for k, r in zip(pics, (-5, 4, -3)))
    return '#d9c7a7', f'<div class="paper {esc(paper)}" style="background-color:{PAPERS.get(paper, "#fffdf6")}"><div class="txt">{txt}</div></div><div class="pols">{pol}</div>', 'light'


def L_dossier(s, ks):
    c = s['cfg']
    txt = ''.join(f'<p style="color:{ln[3] if len(ln) > 3 else "#1f1f1f"};font-size:{(ln[2] if len(ln) > 2 and ln[2] else 44) * 0.9:.0f}px">{esc(ln[0])}</p>' for ln in c['lines'])
    st = c['stamps']
    stamps = f'<div class="stamp s1" style="color:{st[0][5]}">{esc(st[0][0])}</div>' + (f'<div class="stamp s2" style="color:{st[1][5]}">{esc(st[1][0])}</div>' if len(st) > 1 else '')
    pics = ''.join(f'<div class="pol" style="--r:{r}deg">{img(p[0], label=False)}<span>{esc(LABEL.get(p[0], "").lower())}</span></div>' for p, r in zip(c['pics'][:2], (-5, 5)))
    return '#d4b06f', f'<div class="dossier"><div class="tab">CLASSIFIED</div>{txt}{stamps}</div><div class="pols dp">{pics}</div>', 'light'


def L_retro(s, ks):
    c = s['cfg']
    if s['fmt'] == 'thenNowFmt':
        o, ot, n, nt, ol, nl = c['pairs'][0]
    else:
        segs = c['segs']; old = next(x for x in segs if x[3]); new = next((x for x in segs if not x[3]), segs[-1])
        o, ol, n, nl, ot, nt = old[0], old[1], new[0], new[1], 'THEN', 'NOW'
    return '#141414', f'''<div class="film"><div class="fr sep">{img(o, label=False)}<div class="fcap"><span>{esc(ot)}</span>{lines(ol)}</div></div>
<div class="fr">{img(n)}<div class="fcap"><span class="now">{esc(nt)}</span>{lines(nl)}</div></div></div>''', 'dark'


def L_map(s, ks):
    c = s['cfg']; hd = c['hook']
    dots = ''.join(f'<circle cx="{540 + 230 * __import__("math").cos(a / 14 * 6.283):.0f}" cy="{330 + 190 * __import__("math").sin(a / 14 * 6.283):.0f}" r="9" fill="#ef4444"/>' for a in range(14))
    svg = f'''<svg viewBox="0 0 1080 640" class="map"><rect width="1080" height="640" fill="#0f1b33"/>
<g stroke="#22335a" stroke-width="14" fill="none"><path d="M0 300 H1080"/><path d="M540 0 V640"/><path d="M80 600 L1000 60"/><path d="M60 80 L1020 620"/></g>
<ellipse cx="540" cy="330" rx="230" ry="190" fill="none" stroke="#f59e0b" stroke-width="16" opacity="0.9"/>{dots}
<text x="540" y="338" text-anchor="middle" fill="#fca5a5" font-size="30" font-weight="800" font-family="Inter">CITY CENTRE</text>
<path d="M330 420 C 240 520, 180 470, 140 380" stroke="{P['lime']}" stroke-width="10" fill="none" stroke-dasharray="22 16"/>
<circle cx="140" cy="370" r="26" fill="{P['red']}"/><circle cx="140" cy="370" r="10" fill="#fff"/>
<rect x="40" y="250" width="300" height="74" rx="37" fill="{P['lime']}"/><text x="190" y="298" text-anchor="middle" font-size="30" font-weight="800" font-family="Inter" fill="{P['ink']}">EXPLORAZONE</text>
<text x="140" y="440" text-anchor="middle" fill="#cbd5e1" font-size="26" font-weight="700" font-family="Inter">Bowthorpe</text></svg>'''
    return '#0b1428', f'<h1 class="top" style="font-size:{fit(hd, 960, 90)}px">{lines(hd)}</h1><div class="mapbox">{svg}</div><div class="maplab">{' '.join(hl(x) for x in c.get("mid", []))}</div>', 'dark'


def L_crossword(s, ks):
    c = s['cfg']; ans = c.get('answer', 'EXPLORAZONE'); n = len(ans)
    rows = ''
    for r in (-2, -1, 0, 1, 2):
        cells = ''
        for k in range(n):
            if r == 0:
                cells += f'<i class="ans">{ans[k]}</i>'
            else:
                cells += f'<i class="{"blk" if ((k * 7 + r * 3) % 5) < 2 else ""}"></i>'
        rows += f'<div class="cwr">{cells}</div>'
    return '#f7f3ea', f'''<h1 class="top ink" style="font-size:{fit(c["hook"], 960, 90)}px">{lines(c["hook"])}</h1>
<div class="clue"><small>{c.get("num", 7)} ACROSS</small><p>{esc(c["clue"])}</p></div><div class="cw">{rows}</div><div class="tick">✓</div>''', 'light'


def L_bingo(s, ks):
    c = s['cfg']
    cells = ''.join(f'<div class="bc"><span>{esc(x)}</span><i></i></div>' for x in c['cells'][:9])
    return f'linear-gradient(160deg,#7c3aed,#4c1d95)', f'''<h1 class="top" style="font-size:{fit(c["hook"], 960, 90)}px">{lines(c["hook"])}</h1>
<div class="bingo"><div class="bt">{esc(c["title"])}</div><div class="bg">{cells}</div><div class="house">FULL HOUSE!</div></div>''', 'dark'


def L_calendar(s, ks):
    c = s['cfg']
    if s['fmt'] == 'dayFmt':
        return 'linear-gradient(#fde68a,#f59e0b)', f'''<h1 class="top ink" style="font-size:{fit(c["hook"], 960, 92)}px">{lines(c["hook"])}</h1>
<div class="tear"><div class="th">{esc(c["days"][0])}</div><div class="tb">{esc(c.get("big", "??"))}</div></div>''', 'light'
    cells = ''.join('<i></i>' for _ in range(c['firstDow'])) + ''.join(f'<i class="{"mk" if d == c["mark"] else ""}">{d}</i>' for d in range(1, c['days'] + 1))
    dows = ''.join(f'<b>{d}</b>' for d in 'MTWTFSS')
    return '#fffdf7', f'''<h1 class="top ink" style="font-size:{fit(c["hook"], 960, 92)}px">{lines(c["hook"])}</h1>
<div class="cal"><div class="ch">{esc(c["month"])}</div><div class="cg">{dows}{cells}</div><div class="cn">{esc(c["note"])}</div></div>''', 'light'


def L_split(s, ks):
    c = s['cfg']; labs = c.get('labels', ['OUTSIDE', 'INSIDE'])
    a = c['inside'][0][0]
    return '#111', f'''<div class="split"><div class="sl"><div class="town"></div><div class="rain"></div><span>{esc(labs[0])}</span><small>{esc(c.get("outside", ""))}</small></div>
<div class="sr">{img(a)}<span>{esc(labs[1] if len(labs) > 1 else "INSIDE")}</span></div></div><h1 class="ontop" style="font-size:{fit(c["hook"], 960, 88)}px">{lines(c["hook"])}</h1>''', 'dark'


def L_card(s, ks):
    c = s['cfg']; f = s['fmt']
    if f == 'quizFmt':
        q, a, k = c['qs'][0]; body = f'<small>QUESTION 1 OF {len(c["qs"])}</small><p>{esc(q)}</p>'; stamp = a; k2 = c['qs'][1][2]
    elif f == 'mythFmt':
        body = f'<small>MYTH</small><p>{esc(c["myth"])}</p>'; stamp = 'BUSTED'; k, k2 = c['cards'][0], c['cards'][1]
    elif f == 'crackerFmt':
        body = f'<small>CRACKER JOKE</small><p>{esc(c["q"])}</p><p class="ans">{esc(c["a"])}</p>'; stamp = ''; k, k2 = c['cards'][0], c['cards'][1]
    else:
        it = c['items']; body = f'<small>SPECIMEN</small><p>{esc(it[0][1])} → {esc(it[1][1])}</p><p class="ans">Excitement: {esc(it[-1][3])}</p>'; stamp = 'UPGRADE'; k, k2 = it[1][0], it[2][0]
    col = '#16a34a' if stamp in ('TRUE', 'UPGRADE') else P['red']
    st = f'<div class="stamp cs" style="color:{col}">{esc(stamp)}</div>' if stamp else ''
    return f'linear-gradient(160deg,{P["navy"]},#3b0764)', f'''<h1 class="top" style="font-size:{fit(c["hook"], 960, 92)}px">{lines(c["hook"])}</h1>
<div class="qcard">{body}{st}</div><div class="pols qp"><div class="pol" style="--r:-4deg">{img(k)}</div><div class="pol" style="--r:5deg">{img(k2)}</div></div>''', 'dark'


def L_receipt(s, ks):
    c = s['cfg']
    if s['fmt'] == 'boardingFmt':
        rows = ''.join(f'<div class="bp"><small>{esc(f[0])}</small><b>{esc(f[1])}</b></div>' for f in c['fields'])
        return '#0f172a', f'''<h1 class="top" style="font-size:{fit(c["hook"], 960, 92)}px">{lines(c["hook"])}</h1>
<div class="pass"><div class="ph-top">BOARDING PASS · EXPLORAZONE AIR</div>{rows}<div class="stamp ps">{esc(c.get("stamp", "APPROVED"))}</div></div>''', 'dark'
    rows = ''.join(f'<div class="rl {"hot" if len(l) > 3 and l[3] else ""}"><span>{esc(l[0])}</span><span>{esc(l[1])}</span></div>' for l in c['lines'])
    k = c['cards'][0]
    return '#1f2937', f'''<h1 class="top" style="font-size:{fit(c["hook"], 960, 92)}px">{lines(c["hook"])}</h1>
<div class="receipt">{rows}<div class="thanks">THANK YOU · EXPLORAZONE.CO.UK</div></div><div class="pol rp" style="--r:6deg">{img(k)}</div>''', 'dark'


def L_swatch(s, ks):
    c = s['cfg']
    sw = ''.join(f'<div class="sw"><i style="background:{col}"></i><span>{esc(n)}</span></div>' for n, col in c['swatches'])
    hn, hk = c['hero']
    return '#efe9df', f'''<h1 class="top ink" style="font-size:{fit(c["hook"], 960, 92)}px">{lines(c["hook"])}</h1>
<div class="chip"><div class="cht">{esc(c["card"])}</div>{sw}<div class="sw hero">{img(hk, label=False)}<span>{esc(hn)}</span></div></div>''', 'light'


def L_magazine(s, ks):
    c = s['cfg']; red = (c.get('mast') or ['', P['red']])[1]
    tags = ''.join(f'<span class="t{i % 2}">{esc(t[0])}</span>' for i, t in enumerate(c['tags']))
    return '#111827', f'''<div class="glass-bg">{img(c["photo"], "full blur", label=False)}</div>
<div class="mag"><div class="mast" style="background:{red};font-size:{min(70, 600 / (0.62 * len((c.get("mast") or ["EXPLORAZONE"])[0]))):.0f}px">{esc((c.get("mast") or ["EXPLORAZONE"])[0])}</div><div class="iss">{esc(c.get("issue", ""))}</div>
<div class="mph">{img(c["photo"])}<div class="tags">{tags}</div></div><div class="cov">{lines(c["cover"])}</div><div class="pr" style="color:{red}">{esc(c.get("price", "BUY 2, GET THE 3RD FREE"))}</div><div class="bar"></div></div>''', 'dark'


def L_check(s, ks):
    c = s['cfg']
    if s['fmt'] == 'snowPlanFmt':
        items = [(t, m == 'v', None) for t, m in c['list']]; title = 'The plan'
    else:
        items = [(it[0], True, it[2] if len(it) > 2 else None) for it in c['items']]; title = c['title']
    rows = ''
    for t, ok, k in items:
        mark = '✓' if ok else '✕'
        th = f'<img src="{ph(k)}" style="object-position:{pos(k)}">' if k else ''
        rows += f'<div class="ci {"key" if k else ""} {"no" if not ok else ""}"><i>{mark}</i><span>{esc(t)}</span>{th}</div>'
    bg = c.get('bg') or [P['royal'], '#0b1450']
    return f'linear-gradient(160deg,{bg[0]},{bg[1]})', f'''<h1 class="top" style="font-size:{fit(c["hook"], 960, 92)}px">{lines(c["hook"])}</h1>
<div class="check"><h3>{esc(title)}</h3>{rows}</div>''', 'dark'


def L_scrap(s, ks):
    c = s['cfg']; cols = ['#fde68a', '#fca5a5', '#a7f3d0', '#bfdbfe', '#fbcfe8', '#ffffff']
    fams = ['"Bricolage Grotesque"', '"Dancing Script"', '"Special Elite"', '"Patrick Hand"', 'Kalam']
    titles = c.get('titles') or [[c['title'], 0]]
    tt = ''
    for li, row in enumerate(titles[:2]):
        word = ''.join('<b class="sp"></b>' if ch == ' ' else f'<i style="background:{cols[(li * 7 + i * 3) % 6]};font-family:{fams[(li + i * 2) % 5]};--r:{((i * 37) % 11 - 5) * 1.2}deg">{esc(ch)}</i>' for i, ch in enumerate(row[0]))
        tt += f'<div class="rw">{word}</div>'
    pcs = ''.join(f'<div class="torn" style="--r:{(-4, 4, 3, -3)[i]}deg">{img(p[0], label=False)}<b class="tape"></b><span>{esc(p[7] if len(p) > 7 else "")}</span></div>' for i, p in enumerate(c['pieces'][:4]))
    return f'{c.get("paper", "#c8a77e")}', f'<div class="ransom">{tt}</div><div class="torns">{pcs}</div>', 'light'


def L_chart(s, ks):
    c = s['cfg']; pts = c['points']; n = len(pts) - 1
    xs = [80 + 820 * i / n for i in range(n + 1)]; ys = [470 - 380 * v for v in pts]
    segs = ''.join(f'<line x1="{xs[i]:.0f}" y1="{ys[i]:.0f}" x2="{xs[i + 1]:.0f}" y2="{ys[i + 1]:.0f}" stroke="{"#16a34a" if pts[i + 1] >= pts[i] else "#ef4444"}" stroke-width="12" stroke-linecap="round"/>' for i in range(n))
    notes = ''.join(f'<circle cx="{xs[i]:.0f}" cy="{ys[i]:.0f}" r="13" fill="{col}"/><rect x="{min(max(xs[i] - 120, 20), 700):.0f}" y="{ys[i] - 76:.0f}" width="240" height="50" rx="25" fill="{col}"/><text x="{min(max(xs[i] - 120, 20), 700) + 120:.0f}" y="{ys[i] - 42:.0f}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="25" fill="#fff">{esc(t)}</text>' for i, t, col in c['notes'])
    xl = ''.join(f'<text x="{80 + 820 * i / (len(c["xLabels"]) - 1):.0f}" y="520" text-anchor="middle" font-family="Inter" font-weight="700" font-size="24" fill="#6b7280">{esc(l)}</text>' for i, l in enumerate(c['xLabels']))
    svg = f'<svg viewBox="0 0 960 540"><line x1="80" y1="60" x2="80" y2="480" stroke="#d1d5db" stroke-width="3"/><line x1="80" y1="480" x2="920" y2="480" stroke="#d1d5db" stroke-width="3"/><text x="92" y="66" font-family="Inter" font-weight="800" font-size="22" fill="#6b7280">{esc(c.get("yLabel", "FUN"))}</text>{segs}{notes}{xl}</svg>'
    bg = c.get('bg') or ['#0f766e', '#134e4a']
    return f'linear-gradient(160deg,{bg[0]},{bg[1]})', f'''<h1 class="top" style="font-size:{fit(c["hook"], 960, 92)}px">{lines(c["hook"])}</h1>
<div class="chart"><div class="cht2"><b>{esc(c["title"])}</b><small>{esc(c.get("note", "(very scientific)"))}</small></div>{svg}</div>''', 'dark'


def L_portal(s, ks):
    c = s['cfg']; hd = c['hooks'][0][1]
    rings = ''.join(f'<div class="ring" style="--c:{col}">{img(k)}</div>' for k, col in c['worlds'][:4])
    return f'radial-gradient(circle at 50% 50%, #1e1b4b, #020617)', f'<h1 class="top" style="font-size:{fit(hd, 960, 92)}px">{lines(hd)}</h1><div class="rings">{rings}</div>', 'dark'


LAYOUT = {
    'dossierFmt': L_dossier, 'noteFmt': L_note, 'chalkFmt': L_note, 'filmFmt': L_retro, 'thenNowFmt': L_retro, 'povFmt': L_pov,
    'quizFmt': L_card, 'mythFmt': L_card, 'crackerFmt': L_card, 'specimenFmt': L_card,
    'phoneFmt': L_phone, 'searchFmt': L_phone, 'chatFmt': L_phone, 'chatTakeoverFmt': L_phone, 'notifFmt': L_phone, 'screenTimeFmt': L_phone,
    'rollFmt': L_phone, 'payFmt': L_phone, 'mapFmt': L_map, 'checklistFmt': L_check, 'snowPlanFmt': L_check,
    'bigNumFmt': L_bignum, 'flapFmt': L_bignum, 'swatchFmt': L_swatch, 'splitFmt': L_split, 'scrapbookFmt': L_scrap, 'receiptFmt': L_receipt,
    'boardingFmt': L_receipt, 'magazineFmt': L_magazine, 'crosswordFmt': L_crossword, 'chartFmt': L_chart, 'bingoFmt': L_bingo,
    'calendarFmt': L_calendar, 'dayFmt': L_calendar, 'portalFmt': L_portal,
}

CSS = (Path(__file__).parent / 'stills.css').read_text()


def page(sid, s, size):
    w, h = SIZES[size]; lay = LAY[size]
    ks = keys_of(s['cfg']) or ['laser_room']
    bg, box, tone = LAYOUT.get(s['fmt'], L_glass)(s, ks)
    bg = bg.replace('background:', '')
    maths = ''.join(f'<span>{esc(m)}</span>' for m in COPY['maths'])
    strip = ''
    if size == 'story':
        sk = [k for k in (s['cfg'].get('strip') or ks) if (PHOTOS / f'{k}.jpg').exists()][:3]
        strip = '<div class="strip">' + ''.join(f'<img src="{ph(k)}" style="object-position:{pos(k)}">' for k in sk) + '</div>'
    offer = COPY['offer'].replace('3rd free', '<em>3rd free</em>')
    fonts = '&'.join('family=' + f for f in BRAND['fonts']['google'] + CAMP['fonts']['google'])
    return f'''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?{fonts}&display=block">
<style>{CSS}</style></head><body class="{size} {tone}" style="width:{w}px;height:{h}px">
<div class="stage" style="width:{w}px;height:{h}px;background:{bg}">
<div class="box" style="top:{lay["top"]}px">{box}</div>
<img class="logo" src="{(W / 'assets/logo.png').as_uri()}" style="top:{lay["logo"]}px">
<div class="offer" style="top:{lay["offer"]}px"><div class="o1">{offer}</div><div class="o2">{maths}</div><div class="o3">{esc(COPY["dates"])}</div><div class="o4">{esc(COPY["terms"])}</div></div>
{strip}</div></body></html>'''


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--ids', default='W51-W150'); ap.add_argument('--out', default=str(W / 'out/stills_html'))
    a = ap.parse_args()
    lo, hi = (int(x[1:]) for x in a.ids.split('-'))
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    n = 0
    for i in range(lo, hi + 1):
        vid = f'W{i:02d}'; s = SP[vid]; sid = f'S{i:02d}'
        for size in SIZES:
            (out / f'{sid}_{size}.html').write_text(page(sid, s, size), encoding='utf-8'); n += 1
    print('wrote', n, 'pages to', out)


if __name__ == '__main__':
    main()
