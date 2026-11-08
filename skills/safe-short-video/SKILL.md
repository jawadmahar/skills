---
name: safe-short-video
description: Make short social videos (Instagram Reels, TikTok, YouTube Shorts, Facebook Reels) from a topic, idea or script, then prepare them for posting with human approval at every step. Use whenever the user wants a promo, explainer or social video, a Reel, "turn this into a video", a video for STEMEX, Explorazone, Muffin Break or Cafe UFO, or mentions MoneyPrinterTurbo. This is the safe clean-room replacement for MoneyPrinterTurbo, so use it instead of installing that project. Claude writes the script, footage comes from the user's own media or Pexels, voice from Azure Speech, a recording or none, rendering is local ffmpeg, and nothing is posted without the user approving the exact file.
---

# Safe Short Video

Turns a topic into a finished vertical video (script, footage, voiceover, captions, optional licensed music, logo) and a posting pack. Built as a safe alternative to MoneyPrinterTurbo after a security review (see `SECURITY-REVIEW.md`). Same outcome, without unattended installs, third-party posting brokers or keys pasted into chat.

## Safety rules (never skip)

1. **Do not download, install or run MoneyPrinterTurbo**, or code from any other repository, for this task. Everything needed is in `scripts/` and uses only Python's standard library plus ffmpeg.
2. **Ask before installing anything.** The only things this skill may need are ffmpeg (and optionally Pillow), from the operating system's official package manager. Never pipe a remote script into a shell (`curl ... | sh`, `irm ... | iex`).
3. **Secrets stay out of chat and files.** Keys and tokens are environment variables the user sets in their own terminal. Never ask for a key in chat, never write one to a file, never print one. If the user pastes a key into chat, tell them to revoke it and create a new one.
4. **Three approval gates:** storyboard, finished video, publishing. Wait for a clear yes at each. Approval for one video never carries over to another.
5. **Nothing is posted without explicit approval of the exact file.** Manual upload is the default. The API publisher only runs with the approval code of the reviewed file.
6. **No third-party posting brokers** (services that hold access to the Instagram, TikTok or YouTube accounts), unless the director has approved that vendor in writing.
7. **Licensed music only.** Never use audio ripped from YouTube or other people's content.
8. **No servers or open ports.** Everything runs as one-off local commands.

## Step 0: Context

Confirm, asking only what is missing:

- **Entity:** STEMEX, Explorazone, Muffin Break or Cafe UFO. If unclear, ask before writing anything.
- **Goal and call to action** (book, visit, order, follow), **audience**, and any offer, price or date.
- **Format:** default Instagram Reel, `9:16`, 20 to 40 seconds. Other options: `4:5`, `1:1`, `16:9`.
- **Voice:** Azure British voice, the user's own recording, or no voice (captions and music only).
- **Media:** a folder of the business's own photos and clips, Pexels stock, or both.

Then check the machine: `python scripts/make_video.py --check`. If ffmpeg is missing, explain and ask before installing it (macOS `brew install ffmpeg`, Windows `winget install Gyan.FFmpeg`).

## Step 1: Script and storyboard (Gate 1)

Write the script yourself. No external AI service or API key is needed for this.

- British English. Never use em dashes. Spell the Bowthorpe centre "Explorazone".
- Hook in the first two seconds. One idea per scene. Usually 5 to 8 scenes of 8 to 20 spoken words. End with the call to action.
- Every claim must be true and provable. Prices to consumers include VAT. No children's names. No invented reviews.

Create a project folder (for example `videos/2026-11-halfterm/`) and write `storyboard.json` there. Format: `references/storyboard-format.md`. Worked example: `examples/storyboard.example.json`.

Run `python scripts/make_video.py videos/.../storyboard.json --plan` and show the user the script and timings. **Wait for approval or edits.**

## Step 2: Footage

Preference order:

1. **The business's own photos and clips.** Most authentic. Before using any, apply the people rules in `references/posting-checklist.md`, especially: no identifiable child without written parental consent for social media.
2. **Pexels stock** (free for commercial use): `python scripts/fetch_pexels.py --query "children science experiment" --out videos/.../media --count 3`. It needs `PEXELS_API_KEY` in the user's environment (free key at pexels.com/api) and records creator credits in `credits.json`. Use `--list-only` to preview matches first. Never present stock people as real customers or staff.

Prefer portrait clips for `9:16`. Landscape clips are centre-cropped. Photos get a slow pan. iPhone HEIC photos must be exported as JPEG first.

## Step 3: Voice

Set `voice.provider` in the storyboard:

| Provider | When | Needs |
| --- | --- | --- |
| `azure` (recommended) | Official Microsoft neural voices. Free tier covers about 500,000 characters a month. | `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION` (for example `uksouth`) |
| `file` | The user's own recording (most authentic, good for founder-led posts). | `voice.file` path |
| `none` | Captions and music only. | nothing |
| `edge` | Unofficial Edge read-aloud service. Drafts only, and only if the user explicitly agrees to install `edge-tts`. | `edge-tts` |

Good British voices: `en-GB-SoniaNeural`, `en-GB-LibbyNeural` (female), `en-GB-RyanNeural`, `en-GB-ThomasNeural` (male). Any synthetic voice means the post must carry an AI label (Step 6).

## Step 4: Render

`python scripts/make_video.py videos/.../storyboard.json`

It writes `output/<title>-<time>/` containing `final.mp4` (H.264/AAC, 30 fps, loudness about -14 LUFS), `cover.jpg`, `captions.srt`, and `manifest.json` with timings, credits and the **approval code**. A 30-second video usually takes under a minute. If the script stops with `ERROR:`, read the message, fix the storyboard or inputs, and rerun once.

## Step 5: Review (Gate 2)

1. Give the user `final.mp4` and `cover.jpg` to watch with sound.
2. Go through `references/posting-checklist.md` and report anything that fails.
3. Write `caption.txt` in the output folder: hook line, 1 to 3 short lines, call to action, 3 to 8 relevant hashtags, and "Footage: Pexels" if stock was used. Same writing rules as the script.
4. For changes, edit the storyboard and re-render. A new render means a new approval code.

**Wait for explicit approval of the video and caption.**

## Step 6: Publish (Gate 3)

**Default: the user posts it by hand.** Instagram app: **+** > **Reel** > choose `final.mp4` > optionally add music from Instagram's own library > paste `caption.txt` > **Advanced settings** > turn on the **AI label** if the voice or visuals are synthetic > **Share**. To schedule, use Meta Business Suite > **Create reel**. TikTok and YouTube Shorts: upload the same file (on YouTube, also upload `captions.srt`).

**Optional: official Instagram API** (one-time setup in `references/instagram-api-setup.md`):

1. Dry run, which sends nothing: `python scripts/publish_instagram.py --video <out>/final.mp4 --caption-file <out>/caption.txt --ai-label`
2. Show the user the dry-run summary and approval code. Ask: "Publish this exact video and caption to Instagram now?"
3. Only after a clear yes: rerun with `--confirm-publish <APPROVAL_CODE>`. Report the permalink it prints.

Leave out `--ai-label` only when there is no synthetic voice and no AI-generated visuals. The script refuses to post a file that changed after approval, and refuses to post the same file twice.

## Files

- `scripts/make_video.py`: storyboard to finished video (`--check`, `--plan`, render).
- `scripts/fetch_pexels.py`: Pexels search and download with credits.
- `scripts/publish_instagram.py`: optional Reel publishing through Meta's official API. Dry run by default.
- `references/storyboard-format.md`: every storyboard field.
- `references/posting-checklist.md`: UK pre-posting checks (safeguarding, UK GDPR, CAP Code, DMCCA 2024, copyright, AI labels).
- `references/instagram-api-setup.md`: getting `IG_USER_ID` and a scoped token safely.
- `SECURITY-REVIEW.md`: why this exists instead of MoneyPrinterTurbo.
