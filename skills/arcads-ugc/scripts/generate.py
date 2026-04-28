#!/usr/bin/env python3
"""Arcads UGC pipeline runner.

Submits a scored script to one of the Arcads video engines and polls
`/v1/assets/{id}` every 30 seconds until the asset finishes, then downloads
the MP4 to ./videos/.

Endpoints and folder layout follow the brief in arcads-ugc/SKILL.md.
"""

from __future__ import annotations

import argparse
import json
import os
import pathlib
import sys
import time
from typing import Any
from urllib.parse import urlsplit

import requests

BASE_URL = "https://external-api.arcads.ai"
POLL_INTERVAL_S = 30
POLL_TIMEOUT_S = 60 * 60  # 1h
MIN_SCORE = 9.5

ENGINE_PATHS = {
    "seedance2": "/v1/seedance2/generate/video",
    "sora2": "/v1/sora2/generate/video",
    "veo31": "/v1/veo31/generate/video",
    "b-roll": "/v1/b-roll",
}
TALKING_ACTORS_CREATE = "/v1/scripts"
TALKING_ACTORS_GENERATE = "/v1/scripts/{id}/generate"
ASSET_POLL = "/v1/assets/{id}"


def load_env_file(path: pathlib.Path) -> None:
    if not path.exists():
        return
    for raw in path.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip().strip("'\""))


def auth_headers() -> dict[str, str]:
    token = os.environ.get("ARCADS_AUTH")
    if not token:
        sys.exit("ARCADS_AUTH not set. Add it to .env or export it.")
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }


def load_script(path: pathlib.Path) -> dict[str, Any]:
    data = json.loads(path.read_text())
    score = float(data.get("score", 0))
    if score < MIN_SCORE:
        sys.exit(f"Script score {score} < {MIN_SCORE}; refusing to submit.")
    return data


def post(url: str, payload: dict[str, Any]) -> dict[str, Any]:
    resp = requests.post(url, headers=auth_headers(), json=payload, timeout=60)
    resp.raise_for_status()
    return resp.json()


def submit_talking_actors(script: dict[str, Any]) -> str:
    created = post(f"{BASE_URL}{TALKING_ACTORS_CREATE}", {"script": script})
    script_id = created.get("id") or created.get("script_id")
    if not script_id:
        sys.exit(f"Talking Actors create did not return an id: {created}")
    generated = post(
        f"{BASE_URL}{TALKING_ACTORS_GENERATE.format(id=script_id)}", {}
    )
    return _extract_asset_id(generated)


def submit_engine(engine: str, script: dict[str, Any]) -> str:
    path = ENGINE_PATHS[engine]
    return _extract_asset_id(post(f"{BASE_URL}{path}", {"script": script}))


def _extract_asset_id(payload: dict[str, Any]) -> str:
    for key in ("asset_id", "id", "assetId"):
        if key in payload:
            return str(payload[key])
    sys.exit(f"Could not find asset id in response: {payload}")


def poll_asset(asset_id: str) -> dict[str, Any]:
    deadline = time.time() + POLL_TIMEOUT_S
    url = f"{BASE_URL}{ASSET_POLL.format(id=asset_id)}"
    while time.time() < deadline:
        resp = requests.get(url, headers=auth_headers(), timeout=30)
        resp.raise_for_status()
        body = resp.json()
        status = body.get("status", "").lower()
        print(f"[poll] {asset_id} status={status}")
        if status in {"completed", "succeeded", "ready"}:
            return body
        if status in {"failed", "error", "cancelled"}:
            sys.exit(f"Asset {asset_id} {status}: {body}")
        time.sleep(POLL_INTERVAL_S)
    sys.exit(f"Asset {asset_id} did not finish within {POLL_TIMEOUT_S}s")


def download(url: str, dest: pathlib.Path) -> pathlib.Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with requests.get(url, stream=True, timeout=120) as resp:
        resp.raise_for_status()
        with dest.open("wb") as fh:
            for chunk in resp.iter_content(chunk_size=1 << 15):
                if chunk:
                    fh.write(chunk)
    return dest


def filename_from_url(url: str, fallback: str) -> str:
    name = pathlib.Path(urlsplit(url).path).name
    return name or f"{fallback}.mp4"


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the Arcads UGC pipeline.")
    parser.add_argument(
        "--script",
        type=pathlib.Path,
        required=True,
        help="Path to a scored script JSON (must include score >= 9.5).",
    )
    parser.add_argument(
        "--engine",
        choices=["talking-actors", *ENGINE_PATHS.keys()],
        required=True,
        help="Which Arcads engine to render with.",
    )
    parser.add_argument(
        "--out",
        type=pathlib.Path,
        default=pathlib.Path("videos"),
        help="Directory to write the finished MP4 into.",
    )
    parser.add_argument(
        "--env",
        type=pathlib.Path,
        default=pathlib.Path(".env"),
        help="Path to the .env file holding ARCADS_AUTH.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate script + auth without making network calls.",
    )
    args = parser.parse_args()

    load_env_file(args.env)
    script = load_script(args.script)

    if args.dry_run:
        auth_headers()  # just verifies token presence
        print(
            f"[dry-run] would submit '{args.script.name}' to {args.engine} "
            f"(score={script.get('score')})"
        )
        return

    if args.engine == "talking-actors":
        asset_id = submit_talking_actors(script)
    else:
        asset_id = submit_engine(args.engine, script)
    print(f"[submit] engine={args.engine} asset_id={asset_id}")

    asset = poll_asset(asset_id)
    video_url = asset.get("url") or asset.get("video_url")
    if not video_url:
        sys.exit(f"Finished asset has no url: {asset}")

    dest = args.out / filename_from_url(video_url, asset_id)
    download(video_url, dest)
    print(f"[done] {dest}")


if __name__ == "__main__":
    main()
