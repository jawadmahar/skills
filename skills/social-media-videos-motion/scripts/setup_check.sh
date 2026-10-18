#!/bin/bash
# Checks everything the render pipeline needs and caches three.js r170 locally.
# Run once at the start of a production session: bash scripts/setup_check.sh
ok=1
say() { printf '%-28s %s\n' "$1" "$2"; }
for c in node python3 ffmpeg ffprobe curl; do
  if command -v $c >/dev/null; then say "$c" "ok"; else say "$c" "MISSING"; ok=0; fi
done
node -e "process.exit(Number(process.versions.node.split('.')[0]) < 18 ? 1 : 0)" 2>/dev/null && say "node 18+" "ok" || { say "node 18+" "MISSING"; ok=0; }
if node -e "import('playwright').then(()=>process.exit(0)).catch(()=>{try{require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');process.exit(0)}catch(e){process.exit(1)}})" 2>/dev/null; then
  say "playwright" "ok"
else
  say "playwright" "MISSING (npm i -g playwright; in Claude Code on the web it is preinstalled)"; ok=0
fi
if ls ${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}/chromium-*/chrome-linux/chrome >/dev/null 2>&1 || [ -n "$CHROMIUM_PATH" ]; then say "chromium" "ok"; else say "chromium" "not found in PLAYWRIGHT_BROWSERS_PATH; Playwright will try its own"; fi
python3 -c "import numpy, PIL" 2>/dev/null && say "python numpy + Pillow" "ok" || { say "python numpy + Pillow" "MISSING (pip install numpy pillow)"; ok=0; }
python3 -c "import requests" 2>/dev/null && say "python requests" "ok" || say "python requests" "missing (only needed for Drive uploads)"
T="$HOME/.cache/smvm/three@0.170.0/three.module.js"
if [ ! -s "$T" ]; then
  mkdir -p "$(dirname "$T")" && curl -sSL -m 120 -o "$T" https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js
fi
[ -s "$T" ] && say "three.js r170 cache" "ok" || say "three.js r170 cache" "not cached (3D spots will load it from the CDN)"
for u in https://fonts.googleapis.com/css2?family=Inter https://assets.mixkit.co/music/2/2.mp3; do
  code=$(curl -s -o /dev/null -m 20 -w '%{http_code}' -r 0-1000 "$u")
  case $code in 200|206) say "${u#https://}" "reachable" ;; *) say "${u#https://}" "NOT reachable ($code)"; ok=0 ;; esac
done
if [ -n "$GDRIVE_REFRESH_TOKEN" ]; then say "Drive upload secrets" "present"; else say "Drive upload secrets" "not set (zips will be handed over in chat instead)"; fi
[ $ok = 1 ] && echo "Ready to render." || echo "Fix the MISSING items before rendering. Planning, copy and feedback work without them."
