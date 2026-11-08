# Storyboard format

`storyboard.json` describes one video. Paths are relative to the storyboard file. Only `scenes` is required. A full example is in `examples/storyboard.example.json`.

```json
{
  "title": "Explorazone half-term science",
  "aspect": "9:16",
  "fps": 30,
  "fade": true,
  "voice": { "provider": "azure", "name": "en-GB-SoniaNeural", "lang": "en-GB", "rate": "+0%" },
  "music": { "file": "music/upbeat.mp3", "volume": 0.15, "licence": "Epidemic Sound, Mahar Group account" },
  "captions": { "enabled": true, "font": "Arial", "size": 64, "colour": "#FFFFFF", "outline_colour": "#000000" },
  "logo": { "file": "brand/logo.png", "position": "top-right", "width": 180, "opacity": 0.9 },
  "scenes": [
    { "media": "media/rocket.mp4", "overlay": "Half-term at Explorazone", "narration": "This half-term, build a rocket and launch it." }
  ]
}
```

## Top level

| Field | Default | Notes |
| --- | --- | --- |
| `title` | file name | Used for the output folder name and manifest. |
| `aspect` | `9:16` | `9:16` (1080x1920, Reels/TikTok/Shorts), `4:5` (1080x1350, feed), `1:1` (1080x1080), `16:9` (1920x1080). |
| `fps` | `30` | 24, 25, 30 or 60. |
| `fade` | `true` | Short fade in and out at the start and end. |

## `voice`

| Field | Default | Notes |
| --- | --- | --- |
| `provider` | `none` | `azure`, `file`, `none` or `edge`. See SKILL.md Step 3. |
| `name` | `en-GB-SoniaNeural` | Azure or Edge voice name. |
| `lang` | `en-GB` | SSML language. |
| `rate` | `+0%` | Speed, for example `-5%` or `+10%`. |
| `file` | none | Required for `provider: file`. One recording covering the whole video. Scene lengths are shared out in proportion to each scene's narration length unless a scene sets `duration`. |

With `azure` or `edge`, each scene is voiced separately, so captions stay in sync scene by scene.

## `music` (optional)

| Field | Notes |
| --- | --- |
| `file` | MP3, WAV, M4A, AAC, OGG or FLAC. Loops if shorter than the video. |
| `volume` | 0 to 1. Default 0.15. Music is automatically lowered while the voice speaks. |
| `licence` | **Required.** Where the right to use it comes from, for example "Epidemic Sound, Mahar Group account" or "own composition". Rendering refuses music without it. |

Often simpler: leave `music` out and add a track from Instagram's own library when posting.

## `captions`

| Field | Default | Notes |
| --- | --- | --- |
| `enabled` | `true` | Burned-in captions from each scene's narration (or `caption`). |
| `font` | `Arial` | A font family installed on the computer. |
| `size` | `64` | Pixels at 1080 width. |
| `colour`, `outline_colour` | white, black | `#RRGGBB`. |
| `headline_size`, `headline_colour`, `headline_box_colour` | 76, white, near black | Style of the `overlay` headline box at the top. |

Captions sit inside Meta's Reels safe zone (clear of the top 14% and bottom 35%) so the app's buttons do not cover them. A `captions.srt` file is also written for platforms that accept caption uploads.

## `logo` (optional)

| Field | Default | Notes |
| --- | --- | --- |
| `file` | none | PNG with transparency works best. |
| `position` | `top-right` | `top-left`, `top-right`, `bottom-left`, `bottom-right`. |
| `width` | `180` | Pixels. |
| `opacity` | `0.9` | 0 to 1. |

## `scenes` (required, 1 to 30)

| Field | Notes |
| --- | --- |
| `media` | **Required.** Video (`.mp4 .mov .m4v .webm .mkv`) or photo (`.jpg .jpeg .png .webp`). Short clips loop. Photos get a slow pan. |
| `narration` | What the voice says. Also the caption text unless `caption` is set. |
| `caption` | On-screen text if it should differ from the narration. Use `""` for no caption on this scene. |
| `overlay` | Short headline in a box at the top, up to 60 characters. Good for the hook and the call to action. |
| `duration` | Seconds on screen (0.5 to 60). If left out: the narration length plus a short pause, or about 2.6 words a second when there is no voice. |
| `start` | Seconds into the clip to start from. |
| `audio` | A recorded line for this scene only. Overrides the voice provider for this scene. |

## Validation

The renderer refuses: values of the wrong type, files that are not ordinary media (for example playlists disguised as `.mp4`), em dashes in on-screen or spoken text, music without a `licence`, voice names or rates in an unexpected format, and videos longer than 180 seconds (raise with `--max-seconds`, up to 900).
