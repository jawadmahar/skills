# Security review: MoneyPrinterTurbo

**Reviewed:** 8 November 2026, `main` branch of github.com/harry0703/MoneyPrinterTurbo (MIT licence), agent skill v1.3.2.
**Method:** read-only review of the README, the agent skill (`docs/skill/SKILL.md`, `docs/skill/mpt_agent.py`), `config.example.toml`, `app/asgi.py`, `app/services/upload_post.py`, `app/services/version_checker.py` and `docker-compose.release.yml`. Nothing was installed or run. The other 30+ service modules and the dependency tree were not reviewed.

## Verdict

**Do not install it on a business machine or connect it to business social accounts.** We found no sign of deliberate malware in the files reviewed, and parts of it are carefully written. The problem is its design. It tells an AI agent to install and run a large, fast-changing codebase without asking you, it keeps many API keys in a plain-text file, and it posts to social media through a third-party broker. `safe-short-video` gives the same result without those risks.

## Findings

| # | Severity | Finding | Evidence |
| --- | --- | --- | --- |
| 1 | High | **Unattended install of code that is not pinned to a version.** The skill tells the agent "Do not ask for confirmation before installing" and never to ask whether to continue. The helper downloads the moving `main` branch as a zip, with no fixed version, checksum or signature, then runs `uv sync` and the project with your full user permissions. Whoever controls `main` or a dependency when it runs (the maintainer, or anyone who compromises their account) gets code running on your computer, next to your API keys. | `SKILL.md` "Required Behavior" 2 and "Exit code 1"; `mpt_agent.py` `PROJECT_ARCHIVE_URL`, `ensure_project`, `run_checked` |
| 2 | High | **Remote scripts piped straight into a shell** to install `uv` (`curl ... \| sh`, `irm ... \| iex`). | `SKILL.md` step 2 |
| 3 | High | **API open to the whole network with no password by default** when run from source: `listen_host = "0.0.0.0"` and `api_key = ""`. The code itself warns "API key authentication is disabled". On café or office Wi-Fi, anyone on the network could start jobs that spend your paid AI credits. (The Docker release binds to 127.0.0.1, which is safer.) | `config.example.toml` lines 11 and 52; `app/asgi.py` line 31 |
| 4 | Medium | **Posting goes through a third-party broker.** TikTok, Instagram and YouTube publishing uses Upload-Post (`api.upload-post.com`), so that company holds the connection to your accounts and one key can post to all of them. YouTube privacy defaults to "public". (Auto-upload is off by default.) | `app/services/upload_post.py`; `config.example.toml` lines 654 to 669 |
| 5 | Medium | **Many credentials in one plain-text file**, and the agent is told to collect missing keys in chat, so they also end up in chat transcripts. | `SKILL.md` "Exit code 10"; `mpt_agent.py` `apply_environment_config` |
| 6 | Medium | **Promotes low-cost API resellers through affiliate links** (for example "LLMs from 1% of official rates"). Routing business prompts and keys through unvetted intermediaries, several based outside the UK, raises UK GDPR international transfer and confidentiality concerns. | README sponsor section; `mpt_agent.py` provider links |
| 7 | Medium | **Bundled music of unclear rights.** The README says the default music comes "from YouTube videos" and to delete it "if there are copyright issues". Posting it from a business account risks takedowns and infringement under the Copyright, Designs and Patents Act 1988. | README "Background Music" |
| 8 | Low | **Large attack surface:** 35+ service modules, sign-in reuse of ChatGPT, Codex, Kimi and Claude Code subscriptions (which may breach those providers' terms), automatic update checks, and a 1.6 to 3 GB model download from Hugging Face for Whisper captions. | `app/services/` listing; README |
| 9 | Low | Defaults are Chinese voice and language, and the agent skill supports macOS and Windows only. | `mpt_agent.py` `DEFAULT_VOICE_NAME`; `SKILL.md` "Scope" |

**In its favour:** zip extraction is protected against path traversal, keys are never printed, paid video providers need an explicit confirmation flag, auto-upload is off by default, and the Docker setup only listens on localhost.

## How safe-short-video avoids each risk

| Risk | Mitigation |
| --- | --- |
| 1, 2, 8 | Three small Python scripts using only the standard library, plus ffmpeg from the operating system's package manager. Nothing is downloaded or installed without asking. No piped installers, update checks or model downloads. |
| 3 | No servers and no open ports. Each step is a one-off local command. |
| 4 | Manual posting by default. The optional publisher talks only to Meta's own API hosts, runs as a dry run unless given the approval code of the exact reviewed file, and refuses to post the same file twice. |
| 5 | Keys only in environment variables set by the user. Never requested in chat, written to disk or printed. Error messages redact the Instagram token. |
| 6 | Claude writes the script itself, so no extra AI provider or key is needed. Voice uses Microsoft's official Azure Speech service, the user's own recording, or none. |
| 7 | No bundled music. Music needs a recorded `licence` or is refused. Instagram's own music library is recommended. |
| Extra | Input files must be ordinary media (ffprobe format allowlist and `-protocol_whitelist file`), which blocks booby-trapped "video" files that are really playlists. Pexels downloads are HTTPS only, from Pexels hosts only, size-capped, and logged with creator credits. A UK posting checklist covers safeguarding, UK GDPR, the CAP Code, DMCCA 2024, copyright and AI labelling. |

## Not yet tested

The Azure Speech, Pexels and Instagram API calls follow each provider's published documentation but have not been tested against live accounts, because no keys were available during the build. Test the Instagram publisher first on a test account or with a post you are happy to delete.
