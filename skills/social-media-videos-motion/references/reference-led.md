# Reference-led videos

Sometimes the brief is a film to learn from: "make one like this". A reference gives structure and craft (how the hook lands, the order and length of beats, one signature transition, a type and colour system). It never gives assets: the film belongs to its maker, so no footage, characters, copy lines or music are copied. What comes out is an original video built in our engine with the brand's photos, palette, offer and end card.

## Where references come from

- The director sends a link, a Refs id (REF-0015) or a description.
- Refs (refs.video) is a library of dissected launch films, motion pieces and ads, reached through its MCP server (`search_videos`, `get_blueprint`, `get_frames`, `plan_video`, `check_render`).
- The brand's own best performers on Meta (`scripts/score_ads.py`) are the strongest references of all once results exist.

## Refs: what each plan gives (checked 9 November 2026)

| Plan | Price | What we get |
|---|---|---|
| Free | $0 | Search across the whole library. Full cards (length, shots, cuts per minute, first cut, music, tools, "why it works") only for the 100 free films; every other film returns a title and a one-line summary. No blueprints or frames through the MCP |
| Library | $6 a month, or $48 a year | Every film opens on the site with plates 1 and 2 of its blueprint |
| Pro | $16 a month, or $120 a year ($60 for the first year with a yearly code when one is offered) | Blueprints (all 15 plates and the recipe), frame sheets, `plan_video`, `check_render`, formulas and 3,000 credits a month. Costs seen on the pricing page: blueprint 5 credits, frame sheets 5, plan and storyboard 10, render check 2; search is free |

Fit for our work: the library is mostly 16:9 technology launch films. In November 2026 only 185 of about 5,400 films were vertical and under 30 seconds, and searches for family attractions, children or education returned nothing close. Treat it as a source of structures and looks, not of proven ads for a visitor attraction.

Rules that come with it:
- The terms forbid bulk-exporting the archive through the MCP and sharing tokens. Pull a blueprint only for a film we are about to build from.
- A token is personal. It goes in the cloud environment's secrets or a claude.ai connector, never in chat, a file or this public repository. If one is pasted into a conversation, ask the owner to regenerate it.
- A cancelled plan runs to the end of the paid period. Formats we wrote in our own engine stay ours.

## Workflow

1. Read the card (and, with Pro, the blueprint and frame sheets: seeing the frames beats guessing from text).
2. Write down what to keep and what to replace:
   - Keep: the hook mechanism, the beat order and its proportions, the pace (cuts per minute, first cut), one signature transition, the idea behind the type and colour system.
   - Replace: subject, every word of copy, palette, photos, music, offer, end card, aspect ratio (most references are 16:9; ours are 9:16).
3. Compress to 15 to 20 seconds: keep the proportions of the beats, not their lengths. A five-minute film becomes hook, three to six fast beats, the signature moment, end card.
4. Build it as a format function in the campaign kit (`engine.md` section 10) so it can be reused with other photos, brands and offers. Name the reference in the spot's `style` field ("After Refs REF-2831: ...") so results can be traced to the idea.
5. Check as usual: `seek_check.mjs`, stills and a contact sheet with the safe zone, then render, music, `check_videos.py`.
6. Show the director, log the reaction, and record the format in `concept-library.md`.

Worked examples: `campaigns/explorazone/2026-11-winter/spots/13-refs.js` (R01 "Launch sequence" after a sci-fi fashion film: countdown, heads-up display, six numbered looks with glitch cuts, a three-frame white flash into a white editorial page; R02 "Ask the robot" after a halftone mascot launch spot: mascot slides in beside a question, the field flips colour for the offer, a continuous reframe into a grid, a dark beat, end card). Both were built from free cards alone.
