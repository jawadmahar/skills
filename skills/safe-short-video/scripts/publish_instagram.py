#!/usr/bin/env python3
"""Publish an approved video to Instagram as a Reel using Meta's official API.

This is OPTIONAL. Posting by hand in the Instagram app or Meta Business Suite
is the default and is always acceptable.

Safety rules:
  * Dry run by default. Nothing is sent to Meta unless --confirm-publish is
    given the approval code of the exact file that was reviewed (the first 12
    characters of its SHA-256, printed by make_video.py and by the dry run).
    If the file changes after approval, the code no longer matches.
  * Talks only to graph.facebook.com and rupload.facebook.com (Meta's own
    Instagram API hosts). No third-party posting brokers.
  * The access token is read from IG_ACCESS_TOKEN in the environment, sent in
    a header (never in a URL), and never printed or written to disk.
  * Refuses to post the same file twice unless --allow-repost is given.

Usage:
  python publish_instagram.py --video final.mp4 --caption-file caption.txt
  python publish_instagram.py --video final.mp4 --caption-file caption.txt --ai-label \
      --confirm-publish 1a2b3c4d5e6f
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

VERSION = "1.0.0"
GRAPH_HOST = "graph.facebook.com"
UPLOAD_HOST = "rupload.facebook.com"
DEFAULT_API_VERSION = "v26.0"
MAX_BYTES = 300 * 1024 * 1024
MIN_SECONDS, MAX_SECONDS = 3, 900
MAX_CAPTION = 2200
MAX_HASHTAGS = 30
MAX_MENTIONS = 20


class PublishError(Exception):
    pass


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def video_facts(path: Path) -> dict:
    ffprobe = shutil.which("ffprobe")
    facts = {"bytes": path.stat().st_size, "seconds": None, "width": None, "height": None}
    if not ffprobe:
        return facts
    raw = subprocess.run(
        [ffprobe, "-v", "error", "-protocol_whitelist", "file", "-select_streams", "v:0",
         "-show_entries", "format=duration:stream=width,height,codec_name", "-of", "json", str(path)],
        capture_output=True, text=True, check=False,
    ).stdout
    data = json.loads(raw or "{}")
    stream = (data.get("streams") or [{}])[0]
    facts.update({
        "seconds": float((data.get("format") or {}).get("duration") or 0) or None,
        "width": stream.get("width"),
        "height": stream.get("height"),
        "codec": stream.get("codec_name"),
    })
    return facts


def check_caption(caption: str) -> list[str]:
    problems = []
    if len(caption) > MAX_CAPTION:
        problems.append(f"caption is {len(caption)} characters (Instagram limit {MAX_CAPTION})")
    if len(re.findall(r"(?<!\w)#\w+", caption)) > MAX_HASHTAGS:
        problems.append(f"more than {MAX_HASHTAGS} hashtags")
    if len(re.findall(r"(?<!\w)@[\w.]+", caption)) > MAX_MENTIONS:
        problems.append(f"more than {MAX_MENTIONS} @mentions")
    if "\u2014" in caption:
        problems.append("caption contains an em dash (house style forbids them)")
    return problems


class Graph:
    def __init__(self, token: str, api_version: str):
        if not re.match(r"^v\d{2}\.\d$", api_version):
            raise PublishError("API version must look like v26.0")
        self.token = token
        self.version = api_version

    def _redact(self, text: str) -> str:
        return text.replace(self.token, "[redacted]") if self.token else text

    def _send(self, request: urllib.request.Request, timeout: int = 60) -> dict:
        host = urllib.parse.urlsplit(request.full_url).hostname
        if host not in (GRAPH_HOST, UPLOAD_HOST) or not request.full_url.startswith("https://"):
            raise PublishError(f"refusing to contact unexpected host {host}")
        request.add_header("Authorization", f"OAuth {self.token}")
        request.add_header("User-Agent", f"safe-short-video/{VERSION}")
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return json.loads(response.read(2 * 1024 * 1024).decode("utf-8") or "{}")
        except urllib.error.HTTPError as exc:
            body = exc.read(4096).decode("utf-8", "replace")
            try:
                error = json.loads(body).get("error", {})
                detail = f"{error.get('message')} (code {error.get('code')}, subcode {error.get('error_subcode')})"
            except (json.JSONDecodeError, AttributeError):
                detail = body[:300]
            raise PublishError(self._redact(f"Meta API error {exc.code}: {detail}")) from None
        except urllib.error.URLError as exc:
            raise PublishError(f"could not reach Meta: {exc.reason}") from None

    def get(self, path: str, params: dict) -> dict:
        url = f"https://{GRAPH_HOST}/{self.version}/{path}?{urllib.parse.urlencode(params)}"
        return self._send(urllib.request.Request(url, method="GET"))

    def post(self, path: str, params: dict) -> dict:
        url = f"https://{GRAPH_HOST}/{self.version}/{path}"
        body = urllib.parse.urlencode(params).encode("utf-8")
        request = urllib.request.Request(url, data=body, method="POST", headers={
            "Content-Type": "application/x-www-form-urlencoded",
        })
        return self._send(request)

    def upload(self, upload_uri: str | None, container_id: str, video: Path) -> dict:
        url = upload_uri or f"https://{UPLOAD_HOST}/ig-api-upload/{self.version}/{container_id}"
        if urllib.parse.urlsplit(url).hostname != UPLOAD_HOST:
            url = f"https://{UPLOAD_HOST}/ig-api-upload/{self.version}/{container_id}"
        size = video.stat().st_size
        with video.open("rb") as handle:
            request = urllib.request.Request(url, data=handle, method="POST", headers={
                "offset": "0",
                "file_size": str(size),
                "Content-Length": str(size),
                "Content-Type": "application/octet-stream",
            })
            return self._send(request, timeout=900)


def publish(args: argparse.Namespace, video: Path, caption: str, digest: str) -> dict:
    token = os.environ.get("IG_ACCESS_TOKEN", "").strip()
    user_id = os.environ.get("IG_USER_ID", "").strip()
    if not token or not user_id:
        raise PublishError(
            "IG_ACCESS_TOKEN and IG_USER_ID must be set in the user's own terminal "
            "(see references/instagram-api-setup.md). Never paste tokens into chat."
        )
    if not user_id.isdigit():
        raise PublishError("IG_USER_ID must be the numeric Instagram professional account ID")
    graph = Graph(token, args.api_version)

    params = {
        "media_type": "REELS",
        "upload_type": "resumable",
        "caption": caption,
        "share_to_feed": "true" if args.share_to_feed else "false",
    }
    if args.thumb_offset_ms is not None:
        params["thumb_offset"] = str(int(args.thumb_offset_ms))
    if args.ai_label:
        params["is_ai_generated"] = "true"

    print("1/4 creating Reel container")
    container = graph.post(f"{user_id}/media", params)
    container_id = str(container.get("id", ""))
    if not container_id.isdigit():
        raise PublishError("Meta did not return a container ID")

    print("2/4 uploading video to Meta")
    result = graph.upload(container.get("uri"), container_id, video)
    if result.get("success") is not True:
        raise PublishError(f"upload was not confirmed by Meta: {result}")

    print("3/4 waiting for Instagram to process the video")
    deadline = time.monotonic() + args.timeout
    status = ""
    while time.monotonic() < deadline:
        state = graph.get(container_id, {"fields": "status_code,status"})
        status = str(state.get("status_code", ""))
        if status == "FINISHED":
            break
        if status in {"ERROR", "EXPIRED"}:
            raise PublishError(f"Instagram could not process the video: {state.get('status')}")
        time.sleep(6)
    else:
        raise PublishError(f"timed out waiting for processing (last status {status or 'unknown'})")

    print("4/4 publishing")
    published = graph.post(f"{user_id}/media_publish", {"creation_id": container_id})
    media_id = str(published.get("id", ""))
    permalink = None
    if media_id:
        try:
            permalink = graph.get(media_id, {"fields": "permalink"}).get("permalink")
        except PublishError:
            permalink = None
    return {
        "platform": "instagram",
        "media_id": media_id,
        "permalink": permalink,
        "approval_code": digest[:12],
        "sha256": digest,
        "published_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "ai_label": bool(args.ai_label),
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Publish an approved Reel via Meta's official API.")
    parser.add_argument("--video", required=True, type=Path)
    parser.add_argument("--caption-file", required=True, type=Path)
    parser.add_argument("--confirm-publish", metavar="APPROVAL_CODE",
                        help="approval code of the reviewed file; without it this is a dry run")
    parser.add_argument("--ai-label", action="store_true",
                        help="mark the Reel as AI-generated (use when the voice or visuals are synthetic)")
    parser.add_argument("--no-feed", dest="share_to_feed", action="store_false",
                        help="show in the Reels tab only, not the main grid")
    parser.add_argument("--thumb-offset-ms", type=int, help="frame to use as cover, in milliseconds")
    parser.add_argument("--api-version", default=os.environ.get("IG_GRAPH_API_VERSION", DEFAULT_API_VERSION))
    parser.add_argument("--timeout", type=int, default=900, help="seconds to wait for processing")
    parser.add_argument("--allow-repost", action="store_true", help="allow posting a file already posted")
    args = parser.parse_args(argv)

    video = args.video.expanduser().resolve()
    caption_path = args.caption_file.expanduser().resolve()
    try:
        if not video.is_file() or video.suffix.lower() not in {".mp4", ".mov"}:
            raise PublishError("video must be an existing .mp4 or .mov file")
        if not caption_path.is_file():
            raise PublishError("caption file not found")
        caption = caption_path.read_text(encoding="utf-8").strip()
        digest = sha256_file(video)
        facts = video_facts(video)
        problems = check_caption(caption)
        if facts["bytes"] > MAX_BYTES:
            problems.append(f"file is {facts['bytes'] // (1024 * 1024)} MB (limit 300 MB)")
        if facts["seconds"] and not MIN_SECONDS <= facts["seconds"] <= MAX_SECONDS:
            problems.append(f"video is {facts['seconds']:.1f}s (Reels must be 3s to 15 minutes)")
        record_path = video.with_name(video.stem + ".published.json")
        if record_path.exists() and not args.allow_repost:
            previous = json.loads(record_path.read_text(encoding="utf-8"))
            if previous.get("sha256") == digest:
                problems.append(f"this exact file was already published ({previous.get('permalink')})")

        print("INSTAGRAM REEL")
        seconds = f"{facts['seconds']:.1f}s" if facts["seconds"] else "unknown length"
        print(f"  file:        {video.name} ({facts['bytes'] / (1024 * 1024):.1f} MB, "
              f"{seconds}, {facts['width']}x{facts['height']})")
        print(f"  feed:        {'Reels tab and main grid' if args.share_to_feed else 'Reels tab only'}")
        print(f"  AI label:    {'yes' if args.ai_label else 'no'}")
        print(f"  account:     {'set' if os.environ.get('IG_USER_ID') else 'IG_USER_ID not set'}")
        print("  caption:")
        for line in caption.splitlines() or [""]:
            print(f"    | {line}")
        print(f"APPROVAL_CODE={digest[:12]}")
        if problems:
            for problem in problems:
                print(f"PROBLEM: {problem}")
            return 1
        if not args.confirm_publish:
            print("DRY RUN ONLY. Nothing was sent. To publish, the user must approve this exact "
                  "file and caption, then rerun with --confirm-publish " + digest[:12])
            return 0
        if args.confirm_publish.strip().lower() != digest[:12]:
            raise PublishError("approval code does not match this file; the video changed or the "
                               "wrong file was given. Re-review before publishing.")
        record = publish(args, video, caption, digest)
        record_path.write_text(json.dumps(record, indent=2), encoding="utf-8")
        print("PUBLISHED")
        print(f"PERMALINK={record.get('permalink') or 'not returned (check the Instagram app)'}")
        return 0
    except PublishError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
