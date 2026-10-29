#!/usr/bin/env python3
"""Call the Explorazone Kayana API.

Usage:
  kayana.py GET /days
  kayana.py GET "/events/EVENT_ID/tickets?date=2026-10-30"
  kayana.py POST /tickets/TKT-2026-ABC123/change-date '{"date":"2026-10-30"}'
  kayana.py POST /tickets/TKT-2026-ABC123/change-date '{"date":"2026-10-30"}' --confirm

The key is read from the KAYANA_API_KEY environment variable and is never printed.
A POST is a dry run unless --confirm is given. Exits 1 when the answer has "ok": false.
"""

import argparse
import json
import os
import sys
import urllib.error
import urllib.request

BASE_URL = os.environ.get("KAYANA_API_BASE", "https://health.stemex.uk/kayana-api")


def call(method, path, body=None, confirm=False):
    key = os.environ.get("KAYANA_API_KEY")
    if not key:
        sys.exit("KAYANA_API_KEY is not set")

    headers = {"X-API-Key": key, "Accept": "application/json"}
    data = None
    if method == "POST":
        payload = dict(body or {})
        if confirm:
            payload["confirm"] = True
        else:
            payload.pop("confirm", None)
        data = json.dumps(payload).encode()
        headers["Content-Type"] = "application/json"

    url = BASE_URL.rstrip("/") + "/" + path.lstrip("/")
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.load(response)
    except urllib.error.HTTPError as e:
        try:
            return json.load(e)
        except ValueError:
            return {"ok": False, "why": f"HTTP {e.code} {e.reason}"}


def main():
    parser = argparse.ArgumentParser(description="Call the Explorazone Kayana API")
    parser.add_argument("method", choices=["GET", "POST", "get", "post"])
    parser.add_argument("path", help="for example /days or /events/EVENT_ID/cap")
    parser.add_argument("body", nargs="?", default=None, help="JSON body for a POST")
    parser.add_argument("--confirm", action="store_true", help="do the change instead of a dry run")
    args = parser.parse_args()

    method = args.method.upper()
    body = json.loads(args.body) if args.body else None
    if method == "GET" and (body or args.confirm):
        parser.error("a GET takes no body and no --confirm")

    answer = call(method, args.path, body, args.confirm)
    print(json.dumps(answer, indent=2, ensure_ascii=False))
    if not answer.get("ok", False):
        sys.exit(1)


if __name__ == "__main__":
    main()
