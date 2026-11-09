#!/usr/bin/env python3
"""Publish an approved video to Instagram as a Reel using Meta's official API.

This is OPTIONAL. Posting by hand in the Instagram app or Meta Business Suite
is the default and is always acceptable.

Safety rules:
  * Dry run by default. Nothing is posted unless --confirm-publish is given the
    publish code from a dry run. The code covers everything that was approved:
    the exact video file, the exact caption, the settings (AI label, feed,
    cover frame) and the Instagram account. Change any of them and the code no
    longer matches.
  * The dry run names the account (@username) the post would go to, so a token
    left over from another business cannot post to the wrong account unnoticed.
  * Talks only to graph.facebook.com and rupload.facebook.com (Meta's own
    Instagram API hosts) and refuses redirects. No third-party posting brokers.
  * The access token is read from IG_ACCESS_TOKEN in the environment, sent in
    a header (never in a URL), and never printed or written to disk.
  * Refuses to post the same file twice, including after an attempt that ended
    without a clear answer from Meta, unless --allow-repost is given.
  * Refuses to post a synthetic-voice video without the AI label.

Usage:
  python publish_instagram.py --video final.mp4 --caption-file caption.txt
  python publish_instagram.py --video final.mp4 --caption-file caption.txt --ai-label \
      --confirm-publish 1a2b3c4d5e6f
"""

from __future__ import annotations

import argparse
import hashlib
import http.client
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

VERSION = "1.1.0"
GRAPH_HOST = "graph.facebook.com"
UPLOAD_HOST = "rupload.facebook.com"
DEFAULT_API_VERSION = "v26.0"
MAX_BYTES = 300 * 1024 * 1024
MIN_SECONDS, MAX_SECONDS = 3, 900
MAX_CAPTION = 2200
MAX_HASHTAGS = 30
MAX_MENTIONS = 20
POLL_SECONDS = 6


class PublishError(Exception):
    """A problem the user can act on. Never contains the token."""


class MetaApiError(PublishError):
    """Meta answered with an error, so the request definitely did not go through."""


class _NoRedirects(urllib.request.HTTPRedirectHandler):
    """A redirect would forward the access token to another host, so refuse them all."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise PublishError("refusing an unexpected redirect from Meta")


OPENER = urllib.request.build_opener(_NoRedirects)


def use_utf8_output() -> None:
    """Windows pipes and consoles default to a legacy code page that cannot print
    emoji, which most captions contain. Force UTF-8 so printing never crashes."""
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def read_caption(path: Path) -> str:
    try:
        text = path.read_text(encoding="utf-8-sig")  # tolerate the marker Notepad adds
    except UnicodeDecodeError:
        raise PublishError("caption file must be saved as UTF-8 text "
                           "(in Notepad: Save as, Encoding: UTF-8)") from None
    return text.replace("\r\n", "\n").replace("\r", "\n").strip()


def publish_code(video_sha256: str, caption: str, account: str, ai_label: bool,
                 share_to_feed: bool, thumb_offset_ms: int | None) -> str:
    """One code for everything the user approves. Any change gives a different code."""
    approved = json.dumps({
        "video": video_sha256,
        "caption": caption,
        "account": account.lower(),
        "ai_label": bool(ai_label),
        "share_to_feed": bool(share_to_feed),
        "thumb_offset_ms": thumb_offset_ms,
    }, sort_keys=True, ensure_ascii=True)
    return hashlib.sha256(approved.encode("utf-8")).hexdigest()[:12]


def video_facts(path: Path) -> dict:
    ffprobe = shutil.which("ffprobe")
    facts = {"bytes": path.stat().st_size, "seconds": None, "width": None, "height": None}
    if not ffprobe:
        return facts
    raw = subprocess.run(
        [ffprobe, "-v", "error", "-protocol_whitelist", "file", "-select_streams", "v:0",
         "-show_entries", "format=duration:stream=width,height,codec_name", "-of", "json", str(path)],
        capture_output=True, text=True, encoding="utf-8", errors="replace", check=False,
    ).stdout
    try:
        data = json.loads(raw or "{}")
    except json.JSONDecodeError:
        return facts
    stream = (data.get("streams") or [{}])[0]
    facts.update({
        "seconds": float((data.get("format") or {}).get("duration") or 0) or None,
        "width": stream.get("width"),
        "height": stream.get("height"),
        "codec": stream.get("codec_name"),
    })
    return facts


def load_manifest(video: Path) -> dict | None:
    """The record make_video.py writes next to the video it rendered."""
    path = video.with_name("manifest.json")
    if not path.is_file():
        return None
    try:
        data = json.loads(path.read_text(encoding="utf-8-sig"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError):
        return None
    return data if isinstance(data, dict) else None


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
            with OPENER.open(request, timeout=timeout) as response:
                body = response.read(2 * 1024 * 1024).decode("utf-8", "replace")
        except urllib.error.HTTPError as exc:
            body = exc.read(4096).decode("utf-8", "replace")
            try:
                error = json.loads(body).get("error", {})
                detail = f"{error.get('message')} (code {error.get('code')}, subcode {error.get('error_subcode')})"
            except (json.JSONDecodeError, AttributeError):
                detail = body[:300]
            raise MetaApiError(self._redact(f"Meta API error {exc.code}: {detail}")) from None
        except urllib.error.URLError as exc:
            raise PublishError(self._redact(f"could not reach Meta: {exc.reason}")) from None
        except (OSError, http.client.HTTPException) as exc:
            raise PublishError(f"connection to Meta failed: {type(exc).__name__}") from None
        try:
            data = json.loads(body or "{}")
        except json.JSONDecodeError:
            raise PublishError("Meta returned a response that was not JSON") from None
        if not isinstance(data, dict):
            raise PublishError("Meta returned an unexpected response")
        return data

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

    def username(self, user_id: str) -> str:
        """Read-only: which Instagram account does IG_USER_ID point to?"""
        name = str(self.get(user_id, {"fields": "username"}).get("username") or "")
        if not re.match(r"^[A-Za-z0-9._]{1,30}$", name):
            raise PublishError("Meta did not return an Instagram username for IG_USER_ID")
        return name


def connect(api_version: str) -> tuple[Graph, str] | None:
    token = os.environ.get("IG_ACCESS_TOKEN", "").strip()
    user_id = os.environ.get("IG_USER_ID", "").strip()
    if not token or not user_id:
        return None
    if not user_id.isdigit():
        raise PublishError("IG_USER_ID must be the numeric Instagram professional account ID")
    return Graph(token, api_version), user_id


def write_record(path: Path, record: dict) -> None:
    path.write_text(json.dumps(record, indent=2, ensure_ascii=False), encoding="utf-8")


def publish(graph: Graph, user_id: str, account: str, args: argparse.Namespace, video: Path,
            caption: str, digest: str, code: str, record_path: Path) -> dict:
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
        raise PublishError("upload was not confirmed by Meta")

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
        time.sleep(POLL_SECONDS)
    else:
        raise PublishError(f"timed out waiting for processing (last status {status or 'unknown'}). "
                           "Nothing was posted.")

    record = {
        "status": "attempted",
        "platform": "instagram",
        "account": account,
        "sha256": digest,
        "publish_code": code,
        "container_id": container_id,
        "ai_label": bool(args.ai_label),
        "attempted_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }
    # Written BEFORE the publish call: if the connection drops at this point we
    # cannot know whether Meta posted it, and a blind retry could post twice.
    write_record(record_path, record)
    print("4/4 publishing")
    try:
        published = graph.post(f"{user_id}/media_publish", {"creation_id": container_id})
    except MetaApiError:
        record_path.unlink(missing_ok=True)  # Meta said no, so nothing was posted
        raise
    media_id = str(published.get("id", ""))
    permalink = None
    if media_id:
        try:
            permalink = graph.get(media_id, {"fields": "permalink"}).get("permalink")
        except PublishError:
            permalink = None
    record.update({
        "status": "published",
        "media_id": media_id,
        "permalink": permalink,
        "published_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    })
    write_record(record_path, record)
    return record


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Publish an approved Reel via Meta's official API.")
    parser.add_argument("--video", required=True, type=Path)
    parser.add_argument("--caption-file", required=True, type=Path)
    parser.add_argument("--confirm-publish", metavar="PUBLISH_CODE",
                        help="publish code from the dry run the user approved; without it this is a dry run")
    parser.add_argument("--ai-label", action="store_true",
                        help="mark the Reel as AI-generated (required when the voice or visuals are synthetic)")
    parser.add_argument("--no-feed", dest="share_to_feed", action="store_false",
                        help="show in the Reels tab only, not the main grid")
    parser.add_argument("--thumb-offset-ms", type=int, help="frame to use as cover, in milliseconds")
    parser.add_argument("--api-version", default=os.environ.get("IG_GRAPH_API_VERSION", DEFAULT_API_VERSION))
    parser.add_argument("--timeout", type=int, default=900, help="seconds to wait for processing")
    parser.add_argument("--allow-repost", action="store_true",
                        help="allow posting a file that was already posted or attempted")
    args = parser.parse_args(argv)
    use_utf8_output()

    video = args.video.expanduser().resolve()
    caption_path = args.caption_file.expanduser().resolve()
    try:
        if not video.is_file() or video.suffix.lower() not in {".mp4", ".mov"}:
            raise PublishError("video must be an existing .mp4 or .mov file")
        if not caption_path.is_file():
            raise PublishError("caption file not found")
        caption = read_caption(caption_path)
        digest = sha256_file(video)
        facts = video_facts(video)
        manifest = load_manifest(video)

        problems = check_caption(caption)
        if not caption:
            problems.append("caption is empty")
        if facts["bytes"] > MAX_BYTES:
            problems.append(f"file is {facts['bytes'] // (1024 * 1024)} MB (limit 300 MB)")
        if facts["seconds"] and not MIN_SECONDS <= facts["seconds"] <= MAX_SECONDS:
            problems.append(f"video is {facts['seconds']:.1f}s (Reels must be 3s to 15 minutes)")
        if manifest and manifest.get("sha256") != digest:
            problems.append("this file is not the render recorded in the manifest.json next to it. "
                            "It changed after rendering, so it is not the video that was reviewed")
        synthetic = bool(manifest and (manifest.get("voice") or {}).get("synthetic"))
        if synthetic and not args.ai_label:
            problems.append("the voice in this video is synthetic, so the AI label is required. Add --ai-label")
        record_path = video.with_name(video.stem + ".published.json")
        if record_path.exists() and not args.allow_repost:
            try:
                previous = json.loads(record_path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                previous = {}
            if previous.get("sha256") == digest:
                if previous.get("status") == "attempted":
                    problems.append(
                        "an earlier attempt to publish this file ended without a clear answer from Meta. "
                        f"Check @{previous.get('account')} in the Instagram app first. Only if the Reel is "
                        "not there, rerun with --allow-repost")
                else:
                    problems.append(f"this exact file was already published ({previous.get('permalink')})")

        account = None
        account_note = "not connected. Set IG_USER_ID and IG_ACCESS_TOKEN to see the account and get a publish code"
        connection = connect(args.api_version)
        if connection:
            graph, user_id = connection
            try:
                account = graph.username(user_id)  # read-only lookup, posts nothing
                account_note = f"@{account}"
            except PublishError as exc:
                account_note = f"could not be read ({exc})"

        print("INSTAGRAM REEL")
        seconds = f"{facts['seconds']:.1f}s" if facts["seconds"] else "unknown length"
        print(f"  account:     {account_note}")
        print(f"  file:        {video.name} ({facts['bytes'] / (1024 * 1024):.1f} MB, "
              f"{seconds}, {facts['width']}x{facts['height']})")
        reviewed = " (matches the reviewed render)" if manifest and manifest.get("sha256") == digest else ""
        print(f"  fingerprint: {digest[:12]}{reviewed}")
        print(f"  feed:        {'Reels tab and main grid' if args.share_to_feed else 'Reels tab only'}")
        print(f"  AI label:    {'yes' if args.ai_label else 'no'}")
        print("  caption:")
        for line in caption.splitlines() or [""]:
            print(f"    | {line}")
        if problems:
            for problem in problems:
                print(f"PROBLEM: {problem}")
            return 1

        if account is None:
            if args.confirm_publish:
                raise PublishError("cannot publish: the Instagram account could not be identified "
                                   "(see the account line above)")
            print("DRY RUN ONLY. Nothing was posted. No publish code yet, because the account is not known.")
            return 0

        code = publish_code(digest, caption, account, args.ai_label, args.share_to_feed, args.thumb_offset_ms)
        print(f"PUBLISH_CODE={code}")
        if not args.confirm_publish:
            print(f"DRY RUN ONLY. Nothing was posted (the only request made was a read-only lookup of the "
                  f"account name). To publish, the user must approve this exact video, caption, settings "
                  f"and account (@{account}), then rerun with --confirm-publish {code}")
            return 0
        if args.confirm_publish.strip().lower() != code:
            raise PublishError("publish code does not match. The video, caption, settings or account "
                               "changed since approval. Run the dry run again and get fresh approval.")
        record = publish(graph, user_id, account, args, video, caption, digest, code, record_path)
        print("PUBLISHED")
        print(f"ACCOUNT=@{account}")
        print(f"PERMALINK={record.get('permalink') or 'not returned (check the Instagram app)'}")
        return 0
    except PublishError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
