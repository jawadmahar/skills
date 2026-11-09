#!/usr/bin/env python3
"""Render a short social video (Reel, Short, TikTok) from a storyboard JSON file.

Safe-by-design rules this script follows:
  * Standard library only. Pillow is used if already installed, never installed.
  * ffmpeg/ffprobe are called with argument lists, never through a shell.
  * Inputs must be local files that ffprobe recognises as ordinary media
    (playlists, concat lists and network protocols are refused).
  * No servers, no listening ports, no auto-updates, no telemetry.
  * The only optional network call is Azure Speech text-to-speech, using a key
    read from the environment. The key is never written to disk or printed.

Usage:
  python make_video.py --check
  python make_video.py storyboard.json --plan
  python make_video.py storyboard.json [--out DIR] [--keep-work]
"""

from __future__ import annotations

import argparse
import functools
import hashlib
import http.client
import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile
import textwrap
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape
from xml.sax.saxutils import quoteattr

VERSION = "1.1.0"

ASPECTS = {
    "9:16": (1080, 1920),
    "4:5": (1080, 1350),
    "1:1": (1080, 1080),
    "16:9": (1920, 1080),
}
VIDEO_EXT = {".mp4", ".mov", ".m4v", ".webm", ".mkv"}
IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp"}
AUDIO_EXT = {".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac"}
# Every token of ffprobe's format_name must be in this set. This refuses HLS
# playlists, concat lists and similar containers that can make ffmpeg read
# other local files or reach the network.
ALLOWED_FORMATS = {
    "mov", "mp4", "m4a", "3gp", "3g2", "mj2", "matroska", "webm",
    "image2", "png_pipe", "jpeg_pipe", "webp_pipe",
    "mp3", "wav", "aac", "ogg", "flac",
}
VOICE_PROVIDERS = {"azure", "edge", "file", "none"}
MAX_STORYBOARD_BYTES = 256 * 1024
MAX_SCENES = 30
DEFAULT_MAX_SECONDS = 180
HARD_MAX_SECONDS = 900  # Instagram Reels upper limit (15 minutes)
WORDS_PER_SECOND = 2.6  # comfortable British narration pace
SCENE_PAD = 0.35  # breathing space after each narrated line
RATE_RE = re.compile(r"^[+-]\d{1,2}%$")
VOICE_RE = re.compile(r"^[A-Za-z]{2,3}-[A-Za-z]{2,4}(-[A-Za-z0-9]+)+$")
LANG_RE = re.compile(r"^[A-Za-z]{2,3}-[A-Za-z]{2,4}$")
REGION_RE = re.compile(r"^[a-z0-9]{3,30}$")
HEX_RE = re.compile(r"^#?[0-9A-Fa-f]{6}$")
PROTOCOLS = ["-protocol_whitelist", "file"]
# Phones (recent iPhones by default) record HDR video. Converted naively it comes
# out dull and muddy, so HDR clips are tone-mapped to standard colour.
HDR_TRANSFERS = {"arib-std-b67", "smpte2084"}
TONEMAP = (
    "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,"
    "tonemap=tonemap=mobius:desat=0,zscale=t=bt709:m=bt709:r=tv"
)
WARNINGS: list[str] = []
ASS_NEWLINE = "\\N"


class RenderError(Exception):
    """A problem the user can act on. Never contains secrets."""


# --------------------------------------------------------------------------
# Small helpers
# --------------------------------------------------------------------------

def log(message: str) -> None:
    print(f"[safe-short-video] {message}", file=sys.stderr, flush=True)


def warn(message: str) -> None:
    """Record something the user should check. Shown at the end and kept in the manifest."""
    if message not in WARNINGS:
        WARNINGS.append(message)
        log(f"WARNING: {message}")


def use_utf8_output() -> None:
    """Windows pipes and consoles default to a legacy code page that cannot print
    emoji or non-Latin names. Force UTF-8 so printing never crashes."""
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass


@functools.lru_cache(maxsize=None)
def has_filter(name: str) -> bool:
    listing = subprocess.run([tool("ffmpeg"), "-hide_banner", "-filters"],
                             capture_output=True, text=True, encoding="utf-8",
                             errors="replace", check=False).stdout
    return re.search(rf"\s{re.escape(name)}\s", listing) is not None


def has_emoji(text: str) -> bool:
    return any(ord(ch) > 0xFFFF or 0x2600 <= ord(ch) <= 0x27BF or ord(ch) == 0xFE0F for ch in text)


class _NoRedirects(urllib.request.HTTPRedirectHandler):
    """A redirect would forward the API key to another host, so refuse them all."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise RenderError("refusing an unexpected redirect from the speech service")


OPENER = urllib.request.build_opener(_NoRedirects)


def tool(name: str) -> str:
    path = shutil.which(name)
    if not path:
        raise RenderError(
            f"{name} was not found. Install ffmpeg from your operating system's "
            "official package manager (macOS: 'brew install ffmpeg', Windows: "
            "'winget install Gyan.FFmpeg', Ubuntu: 'sudo apt install ffmpeg') "
            "after the user approves."
        )
    return path


def run(cmd: list[str], cwd: Path | None = None) -> str:
    result = subprocess.run(
        cmd,
        cwd=str(cwd) if cwd else None,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    if result.returncode != 0:
        tail = "\n".join(result.stderr.strip().splitlines()[-12:])
        raise RenderError(f"{Path(cmd[0]).name} failed (exit {result.returncode}):\n{tail}")
    return result.stdout


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def even(value: float) -> int:
    number = int(round(value))
    return number if number % 2 == 0 else number + 1


def ass_colour(hex_colour: str, alpha: int = 0) -> str:
    """'#RRGGBB' -> ASS '&HAABBGGRR'. alpha 0 is opaque, 255 transparent."""
    if not HEX_RE.match(hex_colour):
        raise RenderError(f"colour must look like #RRGGBB, got {hex_colour!r}")
    value = hex_colour.lstrip("#")
    red, green, blue = value[0:2], value[2:4], value[4:6]
    return f"&H{alpha:02X}{blue}{green}{red}".upper()


def ass_text(text: str) -> str:
    """Neutralise characters that libass treats as override codes."""
    cleaned = text.replace("\\", "/").replace("{", "(").replace("}", ")")
    return " ".join(cleaned.split())


def ass_time(seconds: float) -> str:
    seconds = max(0.0, seconds)
    centis = int(round(seconds * 100))
    hours, rem = divmod(centis, 360000)
    minutes, rem = divmod(rem, 6000)
    secs, centis = divmod(rem, 100)
    return f"{hours}:{minutes:02d}:{secs:02d}.{centis:02d}"


def srt_time(seconds: float) -> str:
    seconds = max(0.0, seconds)
    millis = int(round(seconds * 1000))
    hours, rem = divmod(millis, 3600000)
    minutes, rem = divmod(rem, 60000)
    secs, millis = divmod(rem, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def _balanced(words: list[str], max_chars: int) -> list[str]:
    """Split words into the fewest lines that fit max_chars, with the longest
    line as short as possible, so no word is left stranded on a line of its own."""
    if not words:
        return []

    def fill(limit: int) -> list[str]:
        lines, current = [], ""
        for word in words:
            candidate = f"{current} {word}" if current else word
            if current and len(candidate) > limit:
                lines.append(current)
                current = word
            else:
                current = candidate
        lines.append(current)
        return lines

    longest_word = max(len(word) for word in words)
    fewest = len(fill(max(max_chars, longest_word)))
    low, high = longest_word, max(max_chars, longest_word)
    while low < high:
        mid = (low + high) // 2
        if len(fill(mid)) <= fewest:
            high = mid
        else:
            low = mid + 1
    return fill(low)


def chunk_caption(text: str, max_chars: int = 44) -> list[str]:
    """Split narration into caption cues at clause boundaries, balancing long clauses.

    Splits only at punctuation followed by a space, so prices (4.50), times
    (10:00) and web addresses stay intact.
    """
    clauses = [c for c in re.split(r"(?<=[,.;:!?])\s+", " ".join(text.split())) if c]
    merged: list[str] = []
    for clause in clauses:
        if merged and len(merged[-1]) < 16 and len(merged[-1]) + 1 + len(clause) <= max_chars:
            merged[-1] = f"{merged[-1]} {clause}"
        else:
            merged.append(clause)
    cues: list[str] = []
    for clause in merged:
        cues.extend(_balanced(clause.split(), max_chars) if len(clause) > max_chars else [clause])
    return cues


def word_count(text: str) -> int:
    return len(text.split())


# --------------------------------------------------------------------------
# Media probing (with format allowlist)
# --------------------------------------------------------------------------

@dataclass
class MediaInfo:
    path: Path
    kind: str  # video | image | audio
    duration: float
    width: int = 0
    height: int = 0
    hdr: bool = False


def probe(path: Path, expected: str) -> MediaInfo:
    if not path.is_file():
        raise RenderError(f"file not found: {path}")
    ext = path.suffix.lower()
    allowed_ext = {"video": VIDEO_EXT | IMAGE_EXT, "audio": AUDIO_EXT, "image": IMAGE_EXT}[expected]
    if ext not in allowed_ext:
        raise RenderError(f"unsupported file type {ext} for {expected}: {path.name}")
    raw = run([
        tool("ffprobe"), "-v", "error", *PROTOCOLS,
        "-show_entries", "format=format_name,duration:stream=codec_type,width,height,color_transfer",
        "-of", "json", str(path),
    ])
    data = json.loads(raw or "{}")
    fmt = data.get("format", {})
    tokens = set(str(fmt.get("format_name", "")).split(","))
    if not tokens or not tokens <= ALLOWED_FORMATS:
        raise RenderError(
            f"{path.name} is not an ordinary media file (format {fmt.get('format_name')!r}); refusing it"
        )
    streams = data.get("streams", [])
    video = next((s for s in streams if s.get("codec_type") == "video"), None)
    audio = next((s for s in streams if s.get("codec_type") == "audio"), None)
    try:
        duration = float(fmt.get("duration") or 0.0)
    except ValueError:
        duration = 0.0
    if ext in IMAGE_EXT:
        if not video:
            raise RenderError(f"{path.name} has no image data")
        return MediaInfo(path, "image", 0.0, int(video.get("width", 0)), int(video.get("height", 0)))
    if expected == "audio":
        if not audio:
            raise RenderError(f"{path.name} has no audio stream")
        return MediaInfo(path, "audio", duration)
    if not video:
        raise RenderError(f"{path.name} has no video stream")
    if duration <= 0.2:
        raise RenderError(f"{path.name} is too short to use")
    return MediaInfo(path, "video", duration, int(video.get("width", 0)), int(video.get("height", 0)),
                     hdr=video.get("color_transfer") in HDR_TRANSFERS)


# --------------------------------------------------------------------------
# Storyboard
# --------------------------------------------------------------------------

@dataclass
class Scene:
    index: int
    media: Path
    narration: str = ""
    caption: str | None = None
    overlay: str = ""
    start: float = 0.0
    duration: float | None = None
    audio: Path | None = None
    # filled during rendering
    info: MediaInfo | None = None
    speech: float = 0.0
    length: float = 0.0
    offset: float = 0.0
    credit: dict | None = None


@dataclass
class Storyboard:
    path: Path
    title: str
    aspect: str
    fps: int
    voice: dict
    music: dict | None
    captions: dict
    logo: dict | None
    fade: bool
    scenes: list[Scene] = field(default_factory=list)
    max_seconds: float = DEFAULT_MAX_SECONDS

    @property
    def size(self) -> tuple[int, int]:
        return ASPECTS[self.aspect]


def _resolve(base: Path, value: object, label: str) -> Path:
    if not isinstance(value, str) or not value.strip():
        raise RenderError(f"{label} must be a file path")
    candidate = Path(value).expanduser()
    if not candidate.is_absolute():
        candidate = base / candidate
    return candidate.resolve()


def load_storyboard(path: Path, max_seconds: float) -> Storyboard:
    path = path.expanduser().resolve()
    if not path.is_file():
        raise RenderError(f"storyboard not found: {path}")
    if path.stat().st_size > MAX_STORYBOARD_BYTES:
        raise RenderError("storyboard is larger than 256 KB; something is wrong")
    try:
        data = json.loads(path.read_text(encoding="utf-8-sig"))
    except UnicodeDecodeError:
        raise RenderError("storyboard must be saved as UTF-8 text") from None
    except json.JSONDecodeError as exc:
        raise RenderError(f"storyboard is not valid JSON: {exc}") from exc
    if not isinstance(data, dict):
        raise RenderError("storyboard must be a JSON object")
    base = path.parent

    aspect = str(data.get("aspect", "9:16"))
    if aspect not in ASPECTS:
        raise RenderError(f"aspect must be one of {', '.join(ASPECTS)}")
    fps = int(data.get("fps", 30))
    if fps not in (24, 25, 30, 60):
        raise RenderError("fps must be 24, 25, 30 or 60")

    voice = dict(data.get("voice") or {"provider": "none"})
    provider = str(voice.get("provider", "none")).lower()
    if provider not in VOICE_PROVIDERS:
        raise RenderError(f"voice.provider must be one of {', '.join(sorted(VOICE_PROVIDERS))}")
    voice["provider"] = provider
    voice.setdefault("name", "en-GB-SoniaNeural")
    voice.setdefault("lang", "en-GB")
    voice.setdefault("rate", "+0%")
    if provider in {"azure", "edge"}:
        if not VOICE_RE.match(str(voice["name"])):
            raise RenderError(f"voice.name looks wrong: {voice['name']!r}")
        if not LANG_RE.match(str(voice["lang"])):
            raise RenderError(f"voice.lang looks wrong: {voice['lang']!r}")
        if not RATE_RE.match(str(voice["rate"])):
            raise RenderError("voice.rate must look like +0%, -10% or +15%")
    if provider == "file":
        voice["file"] = _resolve(base, voice.get("file"), "voice.file")

    music = data.get("music")
    if music:
        music = dict(music)
        music["file"] = _resolve(base, music.get("file"), "music.file")
        music["volume"] = float(music.get("volume", 0.15))
        if not 0.0 < music["volume"] <= 1.0:
            raise RenderError("music.volume must be between 0 and 1")
        if not music.get("licence"):
            raise RenderError(
                "music.licence is required (for example 'Epidemic Sound licence, account X' "
                "or 'own composition'). Unlicensed music is refused."
            )

    captions = {
        "enabled": True, "font": "Arial", "size": 64, "colour": "#FFFFFF",
        "outline_colour": "#000000", "headline_size": 76,
        "headline_colour": "#FFFFFF", "headline_box_colour": "#111111",
    }
    captions.update(data.get("captions") or {})
    for key in ("colour", "outline_colour", "headline_colour", "headline_box_colour"):
        ass_colour(str(captions[key]))
    if not re.match(r"^[A-Za-z0-9 _-]{1,60}$", str(captions["font"])):
        raise RenderError("captions.font must be a plain font family name")

    logo = data.get("logo")
    if logo:
        logo = dict(logo)
        logo["file"] = _resolve(base, logo.get("file"), "logo.file")
        logo.setdefault("position", "top-right")
        logo.setdefault("width", 180)
        logo.setdefault("opacity", 0.9)
        if logo["position"] not in {"top-left", "top-right", "bottom-left", "bottom-right"}:
            raise RenderError("logo.position must be top-left, top-right, bottom-left or bottom-right")

    raw_scenes = data.get("scenes")
    if not isinstance(raw_scenes, list) or not raw_scenes:
        raise RenderError("storyboard needs a non-empty 'scenes' list")
    if len(raw_scenes) > MAX_SCENES:
        raise RenderError(f"too many scenes (max {MAX_SCENES})")

    scenes: list[Scene] = []
    for number, item in enumerate(raw_scenes):
        if not isinstance(item, dict):
            raise RenderError(f"scene {number + 1} must be an object")
        scene = Scene(
            index=number,
            media=_resolve(base, item.get("media"), f"scene {number + 1} media"),
            narration=str(item.get("narration", "") or "").strip(),
            caption=(str(item["caption"]).strip() if item.get("caption") is not None else None),
            overlay=str(item.get("overlay", "") or "").strip(),
            start=float(item.get("start", 0) or 0),
            duration=(float(item["duration"]) if item.get("duration") not in (None, "") else None),
            audio=(_resolve(base, item["audio"], f"scene {number + 1} audio") if item.get("audio") else None),
        )
        if scene.duration is not None and not 0.5 <= scene.duration <= 60:
            raise RenderError(f"scene {number + 1} duration must be between 0.5 and 60 seconds")
        if len(scene.overlay) > 60:
            raise RenderError(f"scene {number + 1} overlay is over 60 characters; keep headlines short")
        if "\u2014" in (scene.narration + (scene.caption or "") + scene.overlay):
            raise RenderError(f"scene {number + 1} contains an em dash; house style forbids them")
        burned_in = scene.overlay + (scene.caption if scene.caption is not None else scene.narration)
        if has_emoji(burned_in):
            warn(f"scene {number + 1} has emoji in its on-screen text. They often show as empty "
                 "boxes in burned-in captions. Put emoji in the post caption instead.")
        scenes.append(scene)

    board = Storyboard(
        path=path,
        title=str(data.get("title", path.stem))[:120],
        aspect=aspect,
        fps=fps,
        voice=voice,
        music=music,
        captions=captions,
        logo=logo,
        fade=bool(data.get("fade", True)),
        scenes=scenes,
        max_seconds=min(float(max_seconds), HARD_MAX_SECONDS),
    )
    return board


def load_credits(media: Path) -> dict | None:
    credits_file = media.parent / "credits.json"
    if not credits_file.is_file():
        return None
    try:
        entries = json.loads(credits_file.read_text(encoding="utf-8-sig"))
    except (json.JSONDecodeError, OSError):
        return None
    if isinstance(entries, list):
        for entry in entries:
            if isinstance(entry, dict) and entry.get("file") == media.name:
                return entry
    return None


# --------------------------------------------------------------------------
# Text to speech
# --------------------------------------------------------------------------

def build_ssml(text: str, voice: str, lang: str, rate: str) -> str:
    return (
        f"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang={quoteattr(lang)}>"
        f"<voice name={quoteattr(voice)}><prosody rate={quoteattr(rate)}>"
        f"{xml_escape(text)}</prosody></voice></speak>"
    )


def tts_azure(text: str, voice: dict, out: Path) -> None:
    key = os.environ.get("AZURE_SPEECH_KEY", "").strip()
    region = os.environ.get("AZURE_SPEECH_REGION", "uksouth").strip().lower()
    if not key:
        raise RenderError(
            "AZURE_SPEECH_KEY is not set. Ask the user to set it in their own terminal "
            "(not in chat), or switch voice.provider to 'file' or 'none'."
        )
    if not REGION_RE.match(region):
        raise RenderError("AZURE_SPEECH_REGION must be a plain region name such as uksouth")
    url = f"https://{region}.tts.speech.microsoft.com/cognitiveservices/v1"
    body = build_ssml(text, voice["name"], voice["lang"], voice["rate"]).encode("utf-8")
    request = urllib.request.Request(url, data=body, method="POST", headers={
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-48khz-96kbitrate-mono-mp3",
        "User-Agent": f"safe-short-video/{VERSION}",
    })
    try:
        with OPENER.open(request, timeout=60) as response:
            if not response.headers.get("Content-Type", "").startswith("audio/"):
                raise RenderError("Azure Speech returned something other than audio")
            out.write_bytes(response.read(50 * 1024 * 1024))
    except urllib.error.HTTPError as exc:
        hint = {401: "key rejected or wrong region", 403: "key not allowed", 429: "rate limited, wait and retry"}
        raise RenderError(f"Azure Speech error {exc.code}: {hint.get(exc.code, exc.reason)}") from None
    except urllib.error.URLError as exc:
        raise RenderError(f"could not reach Azure Speech: {exc.reason}") from None
    except (OSError, http.client.HTTPException) as exc:
        raise RenderError(f"Azure Speech connection failed: {type(exc).__name__}") from None


def tts_edge(text: str, voice: dict, out: Path) -> None:
    edge = shutil.which("edge-tts")
    if not edge:
        raise RenderError(
            "voice.provider 'edge' needs the unofficial edge-tts tool, which is not installed. "
            "Prefer 'azure' (official). Only install edge-tts if the user explicitly agrees."
        )
    run([edge, "--voice", voice["name"], "--rate", voice["rate"], "--text", text, "--write-media", str(out)])


# --------------------------------------------------------------------------
# Rendering
# --------------------------------------------------------------------------

def prepare_image(src: Path, work: Path, cover_w: int, cover_h: int) -> Path:
    """Rotate a photo upright and shrink it to just cover the frame, once.

    Full-size phone photos (12 megapixels and up) were being decoded again for
    every frame, which made photo scenes render about four times slower than
    real time. ffmpeg applies the EXIF rotation itself; Pillow, when installed,
    covers older ffmpeg builds that do not.
    """
    key = hashlib.sha1(f"{src}|{cover_w}x{cover_h}".encode()).hexdigest()[:10]
    target = work / f"img_{key}.png"
    if target.exists():
        return target
    try:
        from PIL import Image, ImageOps  # type: ignore
    except ImportError:
        run([tool("ffmpeg"), "-y", "-hide_banner", "-loglevel", "error", *PROTOCOLS, "-i", str(src),
             "-vf", f"scale={cover_w}:{cover_h}:force_original_aspect_ratio=increase:flags=lanczos",
             "-frames:v", "1", str(target)])
        return target
    with Image.open(src) as image:
        fixed = ImageOps.exif_transpose(image).convert("RGB")
        scale = max(cover_w / fixed.width, cover_h / fixed.height)
        if scale < 1:
            size = (math.ceil(fixed.width * scale), math.ceil(fixed.height * scale))
            fixed = fixed.resize(size, Image.LANCZOS)
        fixed.save(target)
    return target


def render_segment(scene: Scene, board: Storyboard, work: Path, out: Path) -> None:
    width, height = board.size
    fps = board.fps
    length = f"{scene.length:.3f}"
    encode = ["-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
              "-pix_fmt", "yuv420p", "-r", str(fps), "-t", length, str(out)]
    ffmpeg = tool("ffmpeg")
    assert scene.info is not None
    if scene.info.kind == "image":
        big_w, big_h = even(width * 1.12), even(height * 1.12)
        source = prepare_image(scene.media, work, big_w, big_h)
        travel = "(in_w-out_w)*t/{d}".format(d=max(scene.length, 0.1))
        x_expr = travel if scene.index % 2 == 0 else f"(in_w-out_w)-{travel}"
        vf = (
            f"scale={big_w}:{big_h}:force_original_aspect_ratio=increase,"
            f"crop={width}:{height}:x='{x_expr}':y='(in_h-out_h)/2',setsar=1,format=yuv420p"
        )
        run([ffmpeg, "-y", "-hide_banner", "-loglevel", "error", *PROTOCOLS,
             "-loop", "1", "-framerate", str(fps), "-t", length, "-i", str(source),
             "-vf", vf, *encode])
        return

    loops = ["-stream_loop", "-1"] if scene.info.duration - scene.start < scene.length else []
    start = ["-ss", f"{scene.start:.3f}"] if scene.start > 0 else []

    def command(tonemap: str) -> list[str]:
        # Shrink first, then tone-map: tone-mapping 4K frames is very slow.
        vf = (
            f"scale={width}:{height}:force_original_aspect_ratio=increase,"
            f"crop={width}:{height},{tonemap}setsar=1,fps={fps},format=yuv420p"
        )
        return [ffmpeg, "-y", "-hide_banner", "-loglevel", "error", *PROTOCOLS,
                *loops, *start, "-i", str(scene.media), "-vf", vf, *encode]

    flat = (f"{scene.media.name} is an HDR clip and could not be converted to standard colour, so it "
            "may look dull. On the phone, re-export it as standard (SDR) video, or on iPhone turn off "
            "Settings > Camera > Record Video > HDR Video.")
    if not scene.info.hdr:
        run(command(""))
    elif not (has_filter("zscale") and has_filter("tonemap")):
        warn(flat)
        run(command(""))
    else:
        try:
            run(command(TONEMAP + ","))
            warn(f"{scene.media.name} is an HDR clip and was converted to standard colour. "
                 "Check its colours and brightness when you review the video.")
        except RenderError:
            warn(flat)
            run(command(""))


def pad_audio(source: Path | None, seconds: float, out: Path) -> None:
    ffmpeg = tool("ffmpeg")
    if source is None:
        cmd = [ffmpeg, "-y", "-hide_banner", "-loglevel", "error", "-f", "lavfi",
               "-i", "anullsrc=r=48000:cl=stereo", "-t", f"{seconds:.3f}",
               "-c:a", "pcm_s16le", str(out)]
    else:
        cmd = [ffmpeg, "-y", "-hide_banner", "-loglevel", "error", *PROTOCOLS, "-i", str(source),
               "-af", "apad", "-t", f"{seconds:.3f}", "-ar", "48000", "-ac", "2",
               "-c:a", "pcm_s16le", str(out)]
    run(cmd)


def trim_audio(source: Path, start: float, seconds: float, out: Path) -> None:
    run([tool("ffmpeg"), "-y", "-hide_banner", "-loglevel", "error", *PROTOCOLS,
         "-ss", f"{start:.3f}", "-i", str(source), "-af", "apad", "-t", f"{seconds:.3f}",
         "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", str(out)])


def concat(files: list[Path], work: Path, list_name: str, out: Path) -> None:
    listing = work / list_name
    listing.write_text("".join(f"file '{f.name}'\n" for f in files), encoding="utf-8")
    run([tool("ffmpeg"), "-y", "-hide_banner", "-loglevel", "error",
         "-protocol_whitelist", "file", "-f", "concat", "-i", listing.name,
         "-c", "copy", out.name], cwd=work)


def plan_durations(board: Storyboard, work: Path | None, synthesise: bool) -> None:
    """Work out each scene's speech length and on-screen length."""
    provider = board.voice["provider"]
    for scene in board.scenes:
        scene.info = probe(scene.media, "video")
        scene.credit = load_credits(scene.media)
        if scene.info.kind == "video" and scene.start >= scene.info.duration:
            raise RenderError(f"scene {scene.index + 1} start is beyond the end of {scene.media.name}")

    if provider == "file":
        voice_file = probe(board.voice["file"], "audio")
        board.voice["_duration"] = voice_file.duration
        fixed = sum(s.duration for s in board.scenes if s.duration)
        flexible = [s for s in board.scenes if not s.duration]
        remaining = voice_file.duration - fixed
        if flexible and remaining <= 0.5 * len(flexible):
            raise RenderError("voiceover file is shorter than the scenes with fixed durations")
        weights = [max(len(s.narration), 1) for s in flexible]
        for scene, weight in zip(flexible, weights):
            scene.length = remaining * weight / sum(weights)
        for scene in board.scenes:
            if scene.duration:
                scene.length = scene.duration
            scene.speech = scene.length if scene.narration else 0.0
        return

    for scene in board.scenes:
        audio_path: Path | None = None
        if scene.audio:
            audio_path = scene.audio
        elif scene.narration and provider in {"azure", "edge"} and synthesise:
            assert work is not None
            audio_path = work / f"tts_{scene.index:03d}.mp3"
            log(f"voiceover for scene {scene.index + 1} ({provider})")
            (tts_azure if provider == "azure" else tts_edge)(scene.narration, board.voice, audio_path)
        if audio_path:
            scene.audio = audio_path
            scene.speech = probe(audio_path, "audio").duration
        elif scene.narration:
            scene.speech = word_count(scene.narration) / WORDS_PER_SECOND
        natural = max(2.0, scene.speech + SCENE_PAD) if scene.narration else 2.5
        if scene.duration:
            if scene.audio and scene.speech > scene.duration:
                log(f"scene {scene.index + 1}: narration is longer than its duration, extending")
                scene.length = scene.speech + 0.2
            else:
                scene.length = scene.duration
        else:
            scene.length = natural


def write_captions(board: Storyboard, ass_path: Path, srt_path: Path) -> int:
    width, height = board.size
    style = board.captions
    size = int(style["size"])
    line_chars = max(12, int(width * 0.84 / (size * 0.56)))
    portrait = height > width
    # Meta's Reels safe zone: keep text out of the top 14% and bottom 35%.
    caption_margin = int(height * (0.33 if portrait else 0.08))
    headline_margin = int(height * (0.15 if portrait else 0.06))
    header = textwrap.dedent(f"""\
        [Script Info]
        ScriptType: v4.00+
        PlayResX: {width}
        PlayResY: {height}
        WrapStyle: 2
        ScaledBorderAndShadow: yes

        [V4+ Styles]
        Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
        Style: Caption,{style['font']},{size},{ass_colour(style['colour'])},&H000000FF,{ass_colour(style['outline_colour'])},&H80000000,-1,0,0,0,100,100,0,0,1,5,1,2,70,70,{caption_margin},1
        Style: Headline,{style['font']},{int(style['headline_size'])},{ass_colour(style['headline_colour'])},&H000000FF,{ass_colour(style['headline_box_colour'], 0x30)},&H00000000,-1,0,0,0,100,100,0,0,3,16,0,8,70,70,{headline_margin},1

        [Events]
        Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
        """)
    events: list[str] = []
    srt: list[str] = []
    cue_number = 0
    for scene in board.scenes:
        start, end = scene.offset, scene.offset + scene.length
        if scene.overlay:
            lines = _balanced(ass_text(scene.overlay).split(), max(10, int(line_chars * 0.85)))
            events.append(f"Dialogue: 1,{ass_time(start)},{ass_time(end)},Headline,,0,0,0,,{ASS_NEWLINE.join(lines)}")
        text = scene.caption if scene.caption is not None else scene.narration
        if not style.get("enabled", True) or not text:
            continue
        cues = chunk_caption(text, max_chars=line_chars * 2 - 2)
        window = scene.speech if scene.speech > 0 else scene.length - 0.2
        window = max(0.5, min(window, scene.length))
        total_chars = sum(len(c) for c in cues) or 1
        cursor = start + 0.05
        for cue in cues:
            span = window * len(cue) / total_chars
            cue_end = min(cursor + span, end - 0.02)
            lines = _balanced(ass_text(cue).split(), line_chars)  # no orphan words
            events.append(f"Dialogue: 0,{ass_time(cursor)},{ass_time(cue_end)},Caption,,0,0,0,,{ASS_NEWLINE.join(lines)}")
            cue_number += 1
            srt.append(f"{cue_number}\n{srt_time(cursor)} --> {srt_time(cue_end)}\n{chr(10).join(lines)}\n")
            cursor = cue_end
    ass_path.write_text(header + "\n".join(events) + "\n", encoding="utf-8")
    srt_path.write_text("\n".join(srt), encoding="utf-8")
    return cue_number


def mix_audio(board: Storyboard, narration: Path | None, total: float, work: Path, out: Path) -> None:
    ffmpeg = tool("ffmpeg")
    base = [ffmpeg, "-y", "-hide_banner", "-loglevel", "error"]
    finish = ["-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", "-t", f"{total:.3f}", str(out)]
    loud = "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000"
    music = board.music
    if narration and music:
        vol = music["volume"]
        graph = (
            f"[1:a]atrim=0:{total:.3f},asetpts=PTS-STARTPTS,aresample=48000,volume={vol},"
            f"afade=t=in:d=1,afade=t=out:st={max(total - 1.5, 0):.3f}:d=1.5[m];"
            "[0:a]asplit=2[v1][v2];"
            "[m][v2]sidechaincompress=threshold=0.04:ratio=6:attack=20:release=350[duck];"
            f"[v1][duck]amix=inputs=2:normalize=0:duration=first,{loud}[out]"
        )
        cmd = [*base, *PROTOCOLS, "-i", str(narration), *PROTOCOLS, "-stream_loop", "-1",
               "-i", str(music["file"]), "-filter_complex", graph, "-map", "[out]", *finish]
    elif narration:
        cmd = [*base, *PROTOCOLS, "-i", str(narration), "-af", loud, *finish]
    elif music:
        graph = (
            f"atrim=0:{total:.3f},asetpts=PTS-STARTPTS,volume={max(music['volume'], 0.6)},"
            f"afade=t=in:d=1,afade=t=out:st={max(total - 1.5, 0):.3f}:d=1.5,{loud}"
        )
        cmd = [*base, *PROTOCOLS, "-stream_loop", "-1", "-i", str(music["file"]), "-af", graph, *finish]
    else:
        cmd = [*base, "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", *finish]
    run(cmd, cwd=work)


def final_encode(board: Storyboard, video: Path, audio: Path, total: float,
                 captions: bool, work: Path, out: Path) -> None:
    width, height = board.size
    inputs = [*PROTOCOLS, "-i", str(video), *PROTOCOLS, "-i", str(audio)]
    chain = "[0:v]"
    graph: list[str] = []
    if board.logo:
        logo = board.logo
        info = probe(logo["file"], "image")
        inputs += [*PROTOCOLS, "-i", str(info.path)]
        portrait = height > width
        margin_x = int(width * 0.06)
        top = int(height * (0.07 if portrait else 0.05))
        bottom = int(height * (0.36 if portrait else 0.05))
        x = margin_x if "left" in logo["position"] else f"W-w-{margin_x}"
        y = top if "top" in logo["position"] else f"H-h-{bottom}"
        graph.append(
            f"[2:v]scale={int(logo['width'])}:-1,format=rgba,"
            f"colorchannelmixer=aa={float(logo['opacity']):.2f}[lg]"
        )
        graph.append(f"{chain}[lg]overlay=x={x}:y={y}[v1]")
        chain = "[v1]"
    filters = []
    if captions:
        filters.append("ass=captions.ass")
    if board.fade:
        filters.append("fade=t=in:st=0:d=0.25")
        filters.append(f"fade=t=out:st={max(total - 0.4, 0):.3f}:d=0.4")
    filters.append("format=yuv420p")
    graph.append(f"{chain}{','.join(filters)}[vout]")
    audio_filter = (
        f"afade=t=in:d=0.15,afade=t=out:st={max(total - 0.4, 0):.3f}:d=0.4" if board.fade else "anull"
    )
    cmd = [
        tool("ffmpeg"), "-y", "-hide_banner", "-loglevel", "error", *inputs,
        "-filter_complex", ";".join(graph), "-map", "[vout]", "-map", "1:a",
        "-af", audio_filter,
        "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-profile:v", "high",
        "-pix_fmt", "yuv420p", "-r", str(board.fps), "-g", str(board.fps * 2),
        "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-ac", "2",
        "-movflags", "+faststart", "-t", f"{total:.3f}", str(out),
    ]
    run(cmd, cwd=work)


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug[:50] or "video"


def render(board: Storyboard, out_dir: Path | None, keep_work: bool) -> dict:
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    out_dir = (out_dir or board.path.parent / "output" / f"{slugify(board.title)}-{stamp}").resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    work = Path(tempfile.mkdtemp(prefix="ssv-work-", dir=str(out_dir)))
    try:
        plan_durations(board, work, synthesise=True)
        offset = 0.0
        for scene in board.scenes:
            scene.offset = offset
            offset += scene.length
        total = offset
        if total > board.max_seconds:
            raise RenderError(
                f"video would be {total:.1f}s, over the {board.max_seconds:.0f}s limit; "
                "shorten the script or pass --max-seconds"
            )

        segments: list[Path] = []
        for scene in board.scenes:
            log(f"rendering scene {scene.index + 1}/{len(board.scenes)} ({scene.length:.1f}s)")
            segment = work / f"seg_{scene.index:03d}.mp4"
            render_segment(scene, board, work, segment)
            segments.append(segment)
        video = work / "video.mp4"
        concat(segments, work, "segments.txt", video)

        narration: Path | None = None
        if board.voice["provider"] == "file":
            narration = work / "narration.wav"
            trim_audio(board.voice["file"], 0.0, total, narration)
        elif any(scene.audio for scene in board.scenes):
            pieces = []
            for scene in board.scenes:
                piece = work / f"aud_{scene.index:03d}.wav"
                pad_audio(scene.audio, scene.length, piece)
                pieces.append(piece)
            narration = work / "narration.wav"
            concat(pieces, work, "audio.txt", narration)

        log("mixing audio")
        mixed = work / "mixed.wav"
        mix_audio(board, narration, total, work, mixed)

        cue_count = write_captions(board, work / "captions.ass", out_dir / "captions.srt")
        has_text = cue_count > 0 or any(s.overlay for s in board.scenes)
        final = out_dir / "final.mp4"
        log("final encode")
        final_encode(board, video, mixed, total, has_text, work, final)

        cover = out_dir / "cover.jpg"
        run([tool("ffmpeg"), "-y", "-hide_banner", "-loglevel", "error", *PROTOCOLS,
             "-ss", f"{min(1.0, total / 2):.2f}", "-i", str(final), "-frames:v", "1",
             "-q:v", "2", str(cover)])

        digest = sha256_file(final)
        manifest = {
            "tool": f"safe-short-video {VERSION}",
            "title": board.title,
            "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "storyboard": str(board.path),
            "aspect": board.aspect,
            "resolution": "x".join(map(str, board.size)),
            "duration_seconds": round(total, 2),
            "voice": {
                "provider": board.voice["provider"],
                "name": board.voice.get("name") if board.voice["provider"] in {"azure", "edge"} else None,
                "synthetic": board.voice["provider"] in {"azure", "edge"},
            },
            "music": (
                {"file": board.music["file"].name, "licence": board.music["licence"]}
                if board.music else None
            ),
            "scenes": [
                {
                    "media": scene.media.name,
                    "seconds": round(scene.length, 2),
                    "narration": scene.narration,
                    "overlay": scene.overlay,
                    "credit": scene.credit,
                }
                for scene in board.scenes
            ],
            "files": {
                "video": str(final),
                "cover": str(cover),
                "captions_srt": str(out_dir / "captions.srt"),
            },
            "sha256": digest,
            "video_fingerprint": digest[:12],
            "warnings": list(WARNINGS),
            "size_bytes": final.stat().st_size,
        }
        (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
        return manifest
    finally:
        if keep_work:
            log(f"work files kept in {work}")
        else:
            shutil.rmtree(work, ignore_errors=True)
            if out_dir.is_dir() and not any(out_dir.iterdir()):
                out_dir.rmdir()  # failed before producing anything


# --------------------------------------------------------------------------
# Commands
# --------------------------------------------------------------------------

def check() -> int:
    rows: list[tuple[str, str]] = []
    ok = True
    for name in ("ffmpeg", "ffprobe"):
        path = shutil.which(name)
        rows.append((name, path or "MISSING"))
        ok &= bool(path)
    if shutil.which("ffmpeg"):
        filters = subprocess.run([shutil.which("ffmpeg"), "-hide_banner", "-filters"],
                                 capture_output=True, text=True).stdout
        encoders = subprocess.run([shutil.which("ffmpeg"), "-hide_banner", "-encoders"],
                                  capture_output=True, text=True).stdout
        for needed in ("ass", "sidechaincompress", "loudnorm"):
            present = re.search(rf"\s{needed}\s", filters) is not None
            rows.append((f"ffmpeg filter {needed}", "ok" if present else "MISSING"))
            ok &= present
        present = "libx264" in encoders
        rows.append(("ffmpeg encoder libx264", "ok" if present else "MISSING"))
        ok &= present
        hdr_ok = all(re.search(rf"\s{name}\s", filters) for name in ("zscale", "tonemap"))
        rows.append(("HDR phone clips (zscale, tonemap)", "ok" if hdr_ok else "not available (optional)"))
    try:
        import PIL  # type: ignore  # noqa: F401
        rows.append(("Pillow (photo rotation fix)", "ok"))
    except ImportError:
        rows.append(("Pillow (photo rotation fix)", "not installed (optional)"))
    rows.append(("AZURE_SPEECH_KEY", "set" if os.environ.get("AZURE_SPEECH_KEY") else "not set"))
    rows.append(("PEXELS_API_KEY", "set" if os.environ.get("PEXELS_API_KEY") else "not set"))
    rows.append(("edge-tts (unofficial, optional)", "installed" if shutil.which("edge-tts") else "not installed"))
    width = max(len(r[0]) for r in rows)
    for label, value in rows:
        print(f"{label.ljust(width)}  {value}")
    print("READY" if ok else "NOT READY: install ffmpeg (with libass and libx264) after the user approves")
    return 0 if ok else 1


def plan(board: Storyboard) -> int:
    plan_durations(board, None, synthesise=False)
    total = 0.0
    print(f"Title: {board.title}")
    print(f"Format: {board.aspect} {board.size[0]}x{board.size[1]} @ {board.fps}fps")
    provider = board.voice["provider"]
    voice_name = board.voice.get("name", "") if provider in {"azure", "edge"} else ""
    music = f"{board.music['file'].name} ({board.music['licence']})" if board.music else "none"
    print(f"Voice: {provider} {voice_name}".rstrip())
    print(f"Music: {music}")
    for scene in board.scenes:
        total += scene.length
        credit = f" [credit: {scene.credit.get('credit')}]" if scene.credit else ""
        print(f"  {scene.index + 1:>2}. ~{scene.length:4.1f}s  {scene.media.name}{credit}")
        if scene.overlay:
            print(f"      overlay: {scene.overlay}")
        if scene.narration:
            print(f"      says: {scene.narration}")
    print(f"Estimated length: ~{total:.0f}s (synthetic voices can vary by a few seconds)")
    for scene in board.scenes:
        if scene.info and scene.info.hdr:
            print(f"NOTE: {scene.media.name} is an HDR clip and will be converted to standard colour.")
    for message in WARNINGS:
        print(f"WARNING: {message}")
    if total > board.max_seconds:
        print(f"WARNING: over the {board.max_seconds:.0f}s limit")
        return 1
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Render a short social video from a storyboard.")
    parser.add_argument("storyboard", nargs="?", type=Path)
    parser.add_argument("--check", action="store_true", help="check local tools and exit")
    parser.add_argument("--plan", action="store_true", help="validate and show timings, no rendering")
    parser.add_argument("--out", type=Path, help="output folder (default: output/<title>-<time>)")
    parser.add_argument("--keep-work", action="store_true", help="keep intermediate files")
    parser.add_argument("--max-seconds", type=float, default=DEFAULT_MAX_SECONDS)
    args = parser.parse_args(argv)
    use_utf8_output()
    try:
        if args.check:
            return check()
        if not args.storyboard:
            parser.error("storyboard is required unless --check is used")
        try:
            board = load_storyboard(args.storyboard, args.max_seconds)
        except (ValueError, TypeError) as exc:
            raise RenderError(f"storyboard has a value of the wrong type: {exc}") from None
        if args.plan:
            return plan(board)
        manifest = render(board, args.out, args.keep_work)
    except RenderError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    print("RESULT")
    print(f"VIDEO={manifest['files']['video']}")
    print(f"COVER={manifest['files']['cover']}")
    print(f"CAPTIONS_SRT={manifest['files']['captions_srt']}")
    print(f"DURATION={manifest['duration_seconds']}s")
    print(f"VIDEO_FINGERPRINT={manifest['video_fingerprint']}")
    for message in manifest["warnings"]:
        print(f"WARNING: {message}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
