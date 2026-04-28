---
name: arcads-ugc
description: Generate UGC video ads end-to-end via the Arcads external API. Use when the user wants to draft scripts from a product brief, score them, and render videos through Talking Actors, Seedance 2, Sora 2, Veo 3.1, or B-Roll/Kling, then poll for the finished asset.
---

# Arcads UGC Pipeline

Drives the full brief → script → video flow against the Arcads external API.

## Quality bar

Only submit scripts scoring **9.5/10 or higher** to the video endpoints. Score
each draft on hook strength, clarity, CTA, brand fit, and pacing (2 points
each). Iterate or discard anything below the bar — do not render it.

## Arcads API

- **Base URL:** `https://external-api.arcads.ai`
- **Auth:** read `ARCADS_AUTH` from `.env` and send it as
  `Authorization: Bearer $ARCADS_AUTH`.

### Endpoints

| Purpose          | Method | Path                                |
| ---------------- | ------ | ----------------------------------- |
| Talking Actors   | POST   | `/v1/scripts` then `/v1/scripts/{id}/generate` |
| Seedance 2       | POST   | `/v1/seedance2/generate/video`      |
| Sora 2           | POST   | `/v1/sora2/generate/video`          |
| Veo 3.1          | POST   | `/v1/veo31/generate/video`          |
| B-Roll / Kling   | POST   | `/v1/b-roll`                        |

### Polling

`GET https://external-api.arcads.ai/v1/assets/{id}` every **30 seconds** until
`status` is `completed` (then read `url`) or `failed`.

## Folders

- `briefs/`  — raw product briefs, one per file (`.md` or `.txt`)
- `scripts_out/` — generated/scored scripts (JSON)
- `videos/` — downloaded finished MP4s

## Workflow

1. Read the brief from `briefs/<name>.md`.
2. Draft 3–5 script variants. Score each; keep only `>= 9.5`.
3. Save the winning script to `scripts_out/<name>.json`.
4. Pick the engine (Talking Actors, Seedance 2, Sora 2, Veo 3.1, or B-Roll)
   based on the brief. Default to Talking Actors for spokesperson UGC.
5. Submit via `scripts/generate.py` — it handles auth, the two-step Talking
   Actors flow, polling, and downloading the asset to `videos/`.

## Running the pipeline

```bash
# One-shot: brief → video
python scripts/generate.py \
  --brief briefs/my-product.md \
  --engine talking-actors \
  --out videos/

# Just render an already-scored script
python scripts/generate.py \
  --script scripts_out/my-product.json \
  --engine sora2
```

`scripts/generate.py --help` lists every flag. Engines: `talking-actors`,
`seedance2`, `sora2`, `veo31`, `b-roll`.

## Notes

- Endpoint paths and payload shapes here mirror the brief in the source post.
  Cross-check against Arcads' live docs before production use; tweak the
  payload builders in `scripts/generate.py` if the real schema differs.
- Never commit `.env` or rendered videos containing client material.
