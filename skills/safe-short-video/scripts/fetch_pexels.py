#!/usr/bin/env python3
"""Search Pexels for free stock footage and download it with a credit record.

Safety rules:
  * Uses the official Pexels API only (https://www.pexels.com/api/).
  * The key is read from the PEXELS_API_KEY environment variable, never from a
    file or the command line, and is never printed.
  * Downloads are HTTPS only, from Pexels hosts only (redirects included),
    capped in size, and written with generated file names.
  * Every download is recorded in credits.json next to the files, so the
    licence source and creator are traceable.

Usage:
  python fetch_pexels.py --query "children science experiment" --out media --count 3
  python fetch_pexels.py --query "coffee pouring" --type photos --orientation square --out media
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

VERSION = "1.0.0"
API = "https://api.pexels.com"
ALLOWED_HOSTS = ("pexels.com",)  # api., videos., images., www.
MAX_VIDEO_BYTES = 250 * 1024 * 1024
MAX_PHOTO_BYTES = 40 * 1024 * 1024
TARGET_SHORT_SIDE = {"portrait": 1080, "landscape": 1080, "square": 1080}


class FetchError(Exception):
    pass


def host_allowed(url: str) -> bool:
    parsed = urllib.parse.urlsplit(url)
    host = (parsed.hostname or "").lower()
    return parsed.scheme == "https" and any(host == h or host.endswith("." + h) for h in ALLOWED_HOSTS)


class PexelsOnlyRedirects(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: D401
        if not host_allowed(newurl):
            raise FetchError(f"refusing redirect to a non-Pexels host: {urllib.parse.urlsplit(newurl).hostname}")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


OPENER = urllib.request.build_opener(PexelsOnlyRedirects)


def api_get(path: str, params: dict, key: str) -> dict:
    url = f"{API}{path}?{urllib.parse.urlencode(params)}"
    request = urllib.request.Request(url, headers={
        "Authorization": key,
        "User-Agent": f"safe-short-video/{VERSION}",
        "Accept": "application/json",
    })
    try:
        with OPENER.open(request, timeout=30) as response:
            return json.loads(response.read(5 * 1024 * 1024).decode("utf-8"))
    except urllib.error.HTTPError as exc:
        hint = {401: "key rejected", 403: "key not allowed", 429: "hourly or monthly quota reached"}
        raise FetchError(f"Pexels API error {exc.code}: {hint.get(exc.code, exc.reason)}") from None
    except urllib.error.URLError as exc:
        raise FetchError(f"could not reach Pexels: {exc.reason}") from None


def download(url: str, target: Path, limit: int) -> int:
    if not host_allowed(url):
        raise FetchError(f"refusing to download from a non-Pexels host: {urllib.parse.urlsplit(url).hostname}")
    request = urllib.request.Request(url, headers={"User-Agent": f"safe-short-video/{VERSION}"})
    temp = target.with_suffix(target.suffix + ".part")
    written = 0
    try:
        with OPENER.open(request, timeout=120) as response:
            declared = int(response.headers.get("Content-Length") or 0)
            if declared > limit:
                raise FetchError(f"file is {declared // (1024 * 1024)} MB, over the limit")
            with temp.open("wb") as handle:
                while True:
                    block = response.read(1024 * 256)
                    if not block:
                        break
                    written += len(block)
                    if written > limit:
                        raise FetchError("download exceeded the size limit")
                    handle.write(block)
        temp.replace(target)
    finally:
        if temp.exists():
            temp.unlink()
    return written


def pick_video_file(files: list[dict], orientation: str) -> dict | None:
    target = TARGET_SHORT_SIDE.get(orientation, 1080)
    candidates = [
        f for f in files
        if f.get("file_type") == "video/mp4" and f.get("width") and f.get("height") and f.get("link")
    ]
    if not candidates:
        return None

    def score(item: dict) -> tuple[int, int]:
        short_side = min(int(item["width"]), int(item["height"]))
        too_small = 1 if short_side < target else 0
        return (too_small, abs(short_side - target))

    return sorted(candidates, key=score)[0]


def load_credits(path: Path) -> list[dict]:
    if path.is_file():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(data, list):
                return data
        except json.JSONDecodeError:
            pass
    return []


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Fetch free stock footage from Pexels with credits.")
    parser.add_argument("--query", required=True, help="what to search for, in plain English")
    parser.add_argument("--out", required=True, type=Path, help="folder to save media into")
    parser.add_argument("--type", choices=["videos", "photos"], default="videos")
    parser.add_argument("--orientation", choices=["portrait", "landscape", "square"], default="portrait")
    parser.add_argument("--count", type=int, default=3, help="how many files to download (1-10)")
    parser.add_argument("--min-seconds", type=int, default=4, help="skip videos shorter than this")
    parser.add_argument("--max-seconds", type=int, default=40, help="skip videos longer than this")
    parser.add_argument("--list-only", action="store_true", help="show matches without downloading")
    args = parser.parse_args(argv)

    key = os.environ.get("PEXELS_API_KEY", "").strip()
    if not key:
        print(
            "ERROR: PEXELS_API_KEY is not set.\n"
            "Get a free key at https://www.pexels.com/api/ and set it in your own terminal, "
            "for example:\n"
            "  macOS/Linux:  export PEXELS_API_KEY='...'\n"
            "  Windows:      $env:PEXELS_API_KEY='...'\n"
            "Do not paste the key into chat.",
            file=sys.stderr,
        )
        return 2
    count = max(1, min(args.count, 10))
    query = " ".join(args.query.split())[:100]
    out = args.out.expanduser().resolve()

    try:
        if args.type == "videos":
            data = api_get("/videos/search", {
                "query": query, "orientation": args.orientation, "per_page": 30, "size": "medium",
            }, key)
            items = [
                v for v in data.get("videos", [])
                if args.min_seconds <= int(v.get("duration") or 0) <= args.max_seconds
            ]
        else:
            data = api_get("/v1/search", {
                "query": query, "orientation": args.orientation, "per_page": 30,
            }, key)
            items = data.get("photos", [])
    except FetchError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    if not items:
        print(f"No {args.type} found for '{query}'. Try simpler or different words.")
        return 3

    chosen = items[:count]
    if args.list_only:
        for item in chosen:
            who = (item.get("user") or {}).get("name") or item.get("photographer") or "unknown"
            extra = f"{item.get('duration')}s" if args.type == "videos" else f"{item.get('width')}x{item.get('height')}"
            print(f"pexels-{item['id']}  {extra}  by {who}  {item.get('url')}")
        return 0

    out.mkdir(parents=True, exist_ok=True)
    credits_path = out / "credits.json"
    credits = load_credits(credits_path)
    saved = 0
    for item in chosen:
        try:
            if args.type == "videos":
                chosen_file = pick_video_file(item.get("video_files", []), args.orientation)
                if not chosen_file:
                    continue
                url = chosen_file["link"]
                name = f"pexels-{int(item['id'])}.mp4"
                creator = (item.get("user") or {}).get("name") or "Unknown"
                creator_url = (item.get("user") or {}).get("url")
                limit = MAX_VIDEO_BYTES
            else:
                src = item.get("src") or {}
                url = src.get(args.orientation) if args.orientation in ("portrait", "landscape") else src.get("large2x")
                url = url or src.get("original")
                name = f"pexels-photo-{int(item['id'])}.jpg"
                creator = item.get("photographer") or "Unknown"
                creator_url = item.get("photographer_url")
                limit = MAX_PHOTO_BYTES
            target = out / name
            if target.exists():
                print(f"already have {name}")
                saved += 1
                continue
            size = download(url, target, limit)
            credits = [c for c in credits if c.get("file") != name]
            credits.append({
                "file": name,
                "source": "Pexels",
                "licence": "Pexels License (free for commercial use, attribution appreciated, "
                           "do not imply endorsement by people shown)",
                "licence_url": "https://www.pexels.com/license/",
                "page": item.get("url"),
                "creator": creator,
                "creator_url": creator_url,
                "credit": f"{creator} / Pexels",
                "query": query,
                "downloaded_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            })
            saved += 1
            print(f"saved {name} ({size // 1024} KB) by {creator}")
        except (FetchError, urllib.error.URLError, OSError, KeyError, ValueError) as exc:
            print(f"skipped item {item.get('id')}: {exc}", file=sys.stderr)
    credits_path.write_text(json.dumps(credits, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"{saved} file(s) in {out}. Credits recorded in {credits_path.name}.")
    print("Pexels asks for a visible link back where possible, for example 'Footage: Pexels' in the caption.")
    return 0 if saved else 1


if __name__ == "__main__":
    raise SystemExit(main())
