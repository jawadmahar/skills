# Security review: MoneyPrinterTurbo

**Reviewed:** 8 November 2026, re-checked 9 November 2026. `main` branch of github.com/harry0703/MoneyPrinterTurbo (MIT licence), agent skill v1.3.2.
**Method:** read-only review of the README, the agent skill (`docs/skill/SKILL.md`, `docs/skill/mpt_agent.py`), `config.example.toml`, `app/config/config.py`, `app/asgi.py`, `main.py`, `webui.sh`, `app/services/upload_post.py`, `app/services/version_checker.py` and `docker-compose.release.yml`. Nothing was installed or run. The other 30+ service modules and the dependency tree were not reviewed, so this is not a full audit.

## Verdict

**Not suitable for our business machines or business social accounts as it stands.** We found no sign of deliberate malware in the files reviewed, and parts of it are carefully written. Our concern is the design of its AI agent route: it tells the agent to install and run a large, fast-changing codebase without asking, it gathers many API keys into a plain-text file, and it posts to social media through a third-party broker. `safe-short-video` gives us the same result without those risks. Other users with different needs may reasonably reach a different view.

## Findings

| # | Severity | Finding | Evidence |
| --- | --- | --- | --- |
| 1 | High | **Unattended install of code that is not pinned to a version.** The agent skill says "Do not ask for confirmation before installing" and tells the agent never to ask whether to continue. Its helper downloads the moving `main` branch as a zip, with no fixed version, checksum or signature, then runs `uv sync` and the project with the user's full permissions. Whoever controls `main` or a dependency at that moment (the maintainer, or anyone who compromises their account) gets code running on the computer, next to the API keys. | `SKILL.md` "Required Behavior" 2 and "Exit code 1"; `mpt_agent.py` `PROJECT_ARCHIVE_URL`, `ensure_project`, `run_checked` |
| 2 | Medium | **Installer scripts piped into a shell.** If `uv` is missing, the skill installs it with `curl ... \| sh` or `irm ... \| iex`. These are the tool's official installers over HTTPS, so this is common practice, but it is still unpinned code run without asking. | `SKILL.md` step 2 |
| 3 | Medium | **The optional API service has no password and listens on the whole network by default.** `listen_host = "0.0.0.0"` and `api_key = ""`, and the code itself warns "API key authentication is disabled". This applies only if you start the API service (`python main.py`). The web interface defaults to this computer only, the agent skill does not start the API, and the Docker release binds to 127.0.0.1. If it is started on shared Wi-Fi, others on the network could run jobs that spend paid AI credits. | `config.example.toml` lines 11 and 52; `app/config/config.py` line 695; `app/asgi.py` line 31; `webui.sh` line 16 |
| 4 | Medium | **Posting goes through a third-party broker.** TikTok, Instagram and YouTube publishing uses Upload-Post (`api.upload-post.com`), so that company holds the connection to the accounts and one key can post to all of them. YouTube privacy defaults to "public" and "made for kids" defaults to false, which matters for children's content. Auto-upload is off by default. | `app/services/upload_post.py`; `config.example.toml` lines 654 to 669 |
| 5 | Medium | **Many credentials in one plain-text file**, and the agent is told to collect missing keys in chat, so they also end up in chat transcripts. | `SKILL.md` "Exit code 10"; `mpt_agent.py` `apply_environment_config` |
| 6 | Medium | **Promotes low-cost API resellers through affiliate links** (for example "LLMs from 1% of official rates"). Routing business prompts and keys through intermediaries we have not vetted, several based outside the UK, raises UK GDPR international transfer and confidentiality questions. | README sponsor section; `mpt_agent.py` provider links |
| 7 | Medium | **Bundled music of unclear rights.** The README says the default music comes "from YouTube videos" and to delete it "if there are copyright issues". Posting it from a business account risks takedowns and infringement under the Copyright, Designs and Patents Act 1988. | README "Background Music" |
| 8 | Low | **The obvious package name belongs to someone else.** The README states that the official PyPI package is `mpt` and that the `MoneyPrinterTurbo` package on PyPI "is maintained by a third party". Typing the project's own name into `pip install` installs code from a different author. | README "Install the Official Package with pip" |
| 9 | Low | **Large attack surface:** 35+ service modules, sign-in reuse of ChatGPT, Codex, Kimi and Claude Code subscriptions (which may breach those providers' terms), automatic update checks, and a 1.6 to 3 GB model download from Hugging Face for Whisper captions. | `app/services/` listing; README |
| 10 | Low | Defaults are a Chinese voice and language, and the agent skill supports macOS and Windows only. | `mpt_agent.py` `DEFAULT_VOICE_NAME`; `SKILL.md` "Scope" |

**In its favour:** zip extraction is protected against path traversal, keys are never printed, paid video providers need an explicit confirmation flag, auto-upload is off by default, the web interface and the Docker setup only listen on the local computer, and the project is open about its music and its package name.

**Correction, 9 November 2026:** the first version of this review rated findings 2 and 3 as High. On re-checking the source, finding 3 applies only to the optional API service, and finding 2 uses the tool's official installer, so both are now Medium. Finding 8 was added.

## How safe-short-video avoids each risk

| Risk | Mitigation |
| --- | --- |
| 1, 2, 9 | Three small Python scripts using only the standard library, plus ffmpeg from the operating system's package manager. Nothing is downloaded or installed without asking. No piped installers, update checks or model downloads. |
| 3 | No servers and no open ports. Each step is a one-off local command. |
| 4 | Manual posting by default. The optional publisher talks only to Meta's own API hosts and refuses redirects. It is a dry run unless given a publish code that covers the exact video, caption, settings and account the user approved. It names the account before approval, and refuses to post the same file twice. |
| 5 | Keys only in environment variables set by the user. Never requested in chat, written to disk or printed. Error messages redact the Instagram token. |
| 6 | Claude writes the script itself, so no extra AI provider or key is needed. Voice uses Microsoft's official Azure Speech service, the user's own recording, or none. |
| 7 | No bundled music. Music needs a recorded `licence` or is refused. Instagram's own music library is recommended. |
| 8 | Nothing is installed from a package index. |
| Extra | Input files must be ordinary media (ffprobe format allowlist and `-protocol_whitelist file`), which blocks disguised "video" files that are really playlists. Pexels downloads are HTTPS only, from Pexels hosts only, size-capped, and logged with creator credits. A UK posting checklist covers safeguarding, UK GDPR, the CAP Code, DMCCA 2024, copyright and AI labelling. |

## What has and has not been tested

- **Tested:** the renderer end to end in all four formats, on Python 3.11 to 3.13 on Linux. The publisher's approval logic against a simulated Meta API: 20 checks covering changed captions, changed settings, the wrong account, altered files, double posting, dropped connections and redirects.
- **Not tested against live services:** Azure Speech, Pexels and Instagram. The calls follow each provider's published documentation, but no keys were available. Test the Instagram publisher first with a post you are happy to delete.
- **Not tested on Windows or with real phone footage:** the scripts are written to run on Windows and macOS, and the HDR conversion was checked on a synthetic HDR clip, not a real iPhone recording. Check the colours of the first real video carefully.
