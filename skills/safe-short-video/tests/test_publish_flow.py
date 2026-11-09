"""Exercise publish_instagram.py against a simulated Meta API. Nothing is sent
to Meta and no account or token is needed.

Usage: python tests/test_publish_flow.py
"""
import contextlib
import http.server
import io
import json
import os
import sys
import tempfile
import threading
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
import publish_instagram as pub  # noqa: E402

TOKEN = "SECRET-TOKEN-abc123"
ACCOUNTS = {"111": "explorazone", "222": "muffinbreaknorwich"}


class FakeResponse(io.BytesIO):
    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


class FakeMeta:
    """Stands in for pub.OPENER. Records every request it receives."""

    def __init__(self, publish_behaviour="ok"):
        self.calls = []
        self.status_polls = 0
        self.publish_behaviour = publish_behaviour
        self.uploaded = None

    def open(self, request, timeout=None):
        url = urllib.parse.urlsplit(request.full_url)
        assert url.scheme == "https" and url.hostname in ("graph.facebook.com", "rupload.facebook.com"), url
        assert request.get_header("Authorization") == f"OAuth {TOKEN}"
        assert TOKEN not in request.full_url, "token must never be in a URL"
        method = request.get_method()
        path = url.path
        query = dict(urllib.parse.parse_qsl(url.query))
        body = request.data
        self.calls.append((method, url.hostname, path))

        def reply(obj):
            return FakeResponse(json.dumps(obj).encode())

        def meta_error(code, message):
            raise urllib.error.HTTPError(request.full_url, code, "Bad", {}, io.BytesIO(
                json.dumps({"error": {"message": message, "code": 100, "error_subcode": 1}}).encode()))

        parts = path.strip("/").split("/")
        if url.hostname == "rupload.facebook.com":
            self.uploaded = body.read() if hasattr(body, "read") else body
            assert request.get_header("File_size") == str(len(self.uploaded))
            assert request.get_header("Offset") == "0"
            return reply({"success": True})
        if method == "GET" and query.get("fields") == "username":
            if parts[1] not in ACCOUNTS:
                meta_error(400, f"Unsupported get request. Token {TOKEN} invalid")
            return reply({"username": ACCOUNTS[parts[1]], "id": parts[1]})
        if method == "POST" and parts[-1] == "media":
            self.container_params = dict(urllib.parse.parse_qsl(body.decode()))
            return reply({"id": "9001", "uri": "https://rupload.facebook.com/ig-api-upload/v26.0/9001"})
        if method == "GET" and parts[1] == "9001":
            self.status_polls += 1
            return reply({"status_code": "IN_PROGRESS" if self.status_polls < 3 else "FINISHED"})
        if method == "POST" and parts[-1] == "media_publish":
            if self.publish_behaviour == "timeout":
                raise TimeoutError("timed out")
            if self.publish_behaviour == "meta_error":
                meta_error(400, "The media is not ready for publishing")
            return reply({"id": "7007"})
        if method == "GET" and query.get("fields") == "permalink":
            return reply({"permalink": "https://www.instagram.com/reel/TEST/"})
        raise AssertionError(f"unexpected request {method} {path}")


def run(argv, meta=None, env=None):
    meta = meta or FakeMeta()
    pub.OPENER = meta
    pub.POLL_SECONDS = 0
    old_env = {k: os.environ.get(k) for k in ("IG_ACCESS_TOKEN", "IG_USER_ID")}
    for key in old_env:
        os.environ.pop(key, None)
    os.environ.update(env or {})
    out, err = io.StringIO(), io.StringIO()
    try:
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            code = pub.main(argv)
    finally:
        for key, value in old_env.items():
            os.environ.pop(key, None)
            if value is not None:
                os.environ[key] = value
    text = out.getvalue() + err.getvalue()
    assert TOKEN not in text, "token leaked into output"
    return code, text, meta


def code_from(text):
    return next(line.split("=", 1)[1] for line in text.splitlines() if line.startswith("PUBLISH_CODE="))


def posts(meta):
    return [c for c in meta.calls if c[0] == "POST"]


results = []


def check(name, condition, detail=""):
    results.append(condition)
    print(f"{'PASS' if condition else 'FAIL'}  {name}{('  ' + detail) if detail and not condition else ''}")


with tempfile.TemporaryDirectory() as tmp:
    tmp = Path(tmp)
    video = tmp / "final.mp4"
    video.write_bytes(os.urandom(64 * 1024))  # stand-in for a rendered video
    caption = tmp / "caption.txt"
    caption.write_text("Half-term science at Explorazone \U0001F680\n#Norwich", encoding="utf-8")
    base = ["--video", str(video), "--caption-file", str(caption)]
    creds = {"IG_ACCESS_TOKEN": TOKEN, "IG_USER_ID": "111"}

    rc, text, meta = run(base)
    check("no credentials: dry run, no code, no requests", rc == 0 and "PUBLISH_CODE" not in text and not meta.calls)

    rc, text, meta = run(base, env=creds)
    code = code_from(text)
    check("dry run names the account and posts nothing",
          rc == 0 and "@explorazone" in text and not posts(meta) and len(meta.calls) == 1, text)

    rc, text, meta = run(base + ["--confirm-publish", "000000000000"], env=creds)
    check("wrong code refused, nothing posted", rc == 1 and not posts(meta))

    caption.write_text("50% OFF everything, nobody approved this", encoding="utf-8")
    rc, text, meta = run(base + ["--confirm-publish", code], env=creds)
    check("caption changed after approval: refused", rc == 1 and not posts(meta) and "does not match" in text, text)
    caption.write_text("Half-term science at Explorazone \U0001F680\n#Norwich", encoding="utf-8")

    rc, text, meta = run(base + ["--confirm-publish", code, "--ai-label"], env=creds)
    check("setting changed after approval (AI label): refused", rc == 1 and not posts(meta))

    rc, text, meta = run(base + ["--confirm-publish", code], env={**creds, "IG_USER_ID": "222"})
    check("different account than approved: refused", rc == 1 and not posts(meta) and "@muffinbreaknorwich" in text)

    caption_crlf = tmp / "caption-crlf.txt"
    caption_crlf.write_bytes("﻿Half-term science at Explorazone \U0001F680\r\n#Norwich\r\n".encode("utf-8"))
    rc, text, meta = run(["--video", str(video), "--caption-file", str(caption_crlf)], env=creds)
    check("Notepad-style caption (BOM, CRLF) gives the same code", code_from(text) == code)

    rc, text, meta = run(base + ["--confirm-publish", code], env=creds, meta=FakeMeta("meta_error"))
    record = tmp / "final.published.json"
    check("Meta rejects publish: reported, no leftover record, retry allowed",
          rc == 1 and "not ready" in text and not record.exists(), text)

    rc, text, meta = run(base + ["--confirm-publish", code], env=creds, meta=FakeMeta("timeout"))
    check("connection drops during publish: attempt recorded",
          rc == 1 and record.exists() and json.loads(record.read_text())["status"] == "attempted", text)
    rc, text, meta = run(base + ["--confirm-publish", code], env=creds)
    check("retry after unclear attempt: refused until checked", rc == 1 and not posts(meta) and "earlier attempt" in text, text)
    record.unlink()

    rc, text, meta = run(base + ["--confirm-publish", code], env=creds)
    sequence = [c[2].split("/")[-1] + ":" + c[0] for c in meta.calls]
    check("approved publish runs the full flow",
          rc == 0 and "PERMALINK=https://www.instagram.com/reel/TEST/" in text
          and posts(meta) == [("POST", "graph.facebook.com", "/v26.0/111/media"),
                              ("POST", "rupload.facebook.com", "/ig-api-upload/v26.0/9001"),
                              ("POST", "graph.facebook.com", "/v26.0/111/media_publish")], str(sequence))
    check("uploaded bytes are the approved file", meta.uploaded == video.read_bytes())
    check("caption sent intact, no AI flag unless asked",
          meta.container_params.get("caption", "").startswith("Half-term science at Explorazone \U0001F680")
          and "is_ai_generated" not in meta.container_params and meta.container_params["media_type"] == "REELS")
    check("record written as published", json.loads(record.read_text())["status"] == "published")

    rc, text, meta = run(base + ["--confirm-publish", code], env=creds)
    check("second publish of the same file: refused", rc == 1 and not posts(meta) and "already published" in text)
    record.unlink()

    (tmp / "manifest.json").write_text(json.dumps({"sha256": pub.sha256_file(video), "voice": {"synthetic": True}}))
    rc, text, meta = run(base, env=creds)
    check("synthetic voice without AI label: refused", rc == 1 and "AI label is required" in text)
    rc, text, meta = run(base + ["--ai-label"], env=creds)
    check("synthetic voice with AI label: accepted", rc == 0 and "matches the reviewed render" in text)
    with video.open("ab") as handle:
        handle.write(b"tampered")
    rc, text, meta = run(base + ["--ai-label"], env=creds)
    check("video altered after rendering: refused", rc == 1 and "not the render recorded" in text)

    rc, text, meta = run(base, env={**creds, "IG_USER_ID": "999"})
    check("bad account ID: no code, token redacted from Meta's error",
          "PUBLISH_CODE" not in text and "[redacted]" in text, text)

# Real HTTP: the script's own opener must refuse to follow a redirect (which would forward the token).
import importlib  # noqa: E402

importlib.reload(pub)
seen = {}


class Target(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        seen["auth"] = self.headers.get("Authorization")
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"{}")

    def log_message(self, *a):
        pass


class Redirector(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(302)
        self.send_header("Location", f"http://127.0.0.1:{target.server_port}/steal")
        self.end_headers()

    def log_message(self, *a):
        pass


target = http.server.HTTPServer(("127.0.0.1", 0), Target)
redirector = http.server.HTTPServer(("127.0.0.1", 0), Redirector)
for server in (target, redirector):
    threading.Thread(target=server.serve_forever, daemon=True).start()
request = urllib.request.Request(f"http://127.0.0.1:{redirector.server_port}/x")
request.add_header("Authorization", "OAuth SECRET")
no_proxy = urllib.request.build_opener(urllib.request.ProxyHandler({}), pub._NoRedirects)
try:
    no_proxy.open(request, timeout=5).read()
    refused = False
except pub.PublishError:
    refused = True
check("redirect refused, token not forwarded", refused and "auth" not in seen)

print(f"\n{sum(results)}/{len(results)} passed")
sys.exit(0 if all(results) else 1)
