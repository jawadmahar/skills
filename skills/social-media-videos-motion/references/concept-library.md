# Concept library

Proven concepts with working code. Start every new video from the closest one: copy its `defineSpot({...})` block into the new campaign's spot file, give it a new id, then change the copy, photos, colours, timing and music. The shared building blocks live in `scripts/engine/lib/` and are switched on per campaign with `"libs"` in campaign.json.

Status values: **Director favourite** (picked by the director), **Proven** (won on Meta data), **Untested**, **Retired** (lost on Meta data). Update the status from feedback; that is how this library learns.

Code: `campaigns/explorazone/2026-10-half-term/spots/` (`01-classic-2d.js`, `02-classic-3d.js`, `03-rain-series.js`, `04-notebook-series.js`).

## Series 1: Rain (weather outside, fun inside)

Status: **Director favourite** (Oct 2026: "looks really good, I want more variations"). Uses `lib/weather.js`.
Why it works: everyone recognises a wet weekend with bored children; the reveal from grey to colour is the payoff.

| Id | Title | Mechanic |
|---|---|---|
| V02 | Let it rain | Rain on glass, forecast tiles, hand wipes the steamed window to reveal colour (`fogWipe`), photo cards (`cardSeq`) |
| V11 | Raindrop race | Two raindrops (Grandad vs Me) race down the glass; "fun for five minutes" vs "fun for six hours" |
| V12 | Half-term forecast | Weather-app forecast of rain every day swipes to a "Glowing" forecast with attraction rows |
| V13 | The group chat | Parents' group chat over a rainy window; a photo message lands the idea |
| V14 | Leave the umbrella | Top-down spinning umbrella; panels turn into photos, then a 2x3 mosaic |
| V15 | Puddle season | Rippling puddle reflection (`rippleRect`) that dives into colourful rooms |

More ideas: frost on the window, dark by 4pm after the clocks change, a named storm, a snow-day plan, wipers in the car park, steamed-up café window, wet wellies by the door, "100% chance of fun" weather map, rain on a tent at a cancelled day out.
Other brands: STEMEX (rainy holiday club day), Muffin Break (warm drink and a muffin on a grey morning), Cafe UFO (delivery to the door on a wet night).

## Series 2: Notebook (handwritten notes)

Status: **Director favourite** (Oct 2026: "one of the best"). Uses `lib/paper.js`.
Why it works: handwriting feels personal and slows the scroll; the child's or grandparent's voice carries the offer without sounding like an ad.

| Id | Title | Mechanic |
|---|---|---|
| V04 | Dear Nan & Grandad | Lined paper, child's handwriting (`writeLine`), doodles (`strokeReveal`), polaroids |
| V16 | Dear Mum & Dad | Spiral notebook, "Sam goes FREE!!", a "*probably" footnote |
| V17 | Grandad's reply | Envelope with stamp and postmark, fountain-pen script (`SCRIPT`), photo corners |
| V18 | Half-term homework | Squared exercise book, the offer as a maths question, red ticks, gold star, 10/10 |
| V19 | Dear Diary | Lilac gel-pen diary, "BEST. DAY. EVER.", hearts and stars |
| V20 | The fridge plan | Sticky notes and magnet photos on a fridge door |

More ideas: letter to Santa ("I don't want toys, I want..."), a thank-you card after the visit, New Year's resolutions list, school planner, postcard home, shopping list with the day out on it, birthday card, a report card ("Fun: A*").
Other brands: STEMEX (a child's workshop journal), Muffin Break (order notepad, "note to self: muffin first"), Cafe UFO (order ticket on the pass).

## Other proven formats (Untested on Meta)

| Id | Title | Look | Reuse notes |
|---|---|---|---|
| V01 | The maths | Cream grid, flipping tickets, price struck through | Any multi-buy offer; tickets come from `tickets()` with wording from `COPY.ticket` |
| V03 | Leaves outside. Lasers inside. | 3D instanced falling leaves blown away to photo cards | Swap leaves for snowflakes, confetti or coffee beans |
| V05 | Three generations | 3D trading cards (Grandad, Mum, Me); third flips to FREE | Any "bring the family" offer |
| V06 | Half-term planner | 3D tear-off desk calendar with marker circles | Any dated event or countdown |
| V07 | POV: half term | Fast handheld zooms with social captions | Native Reels feel; cheapest to vary |
| V08 | £12 each | Giant extruded price on royal blue | Price-led offers; keep to 8 seconds |
| V09 | An old-fashioned day out | Slow warm pans, large type, nostalgic props | Grandparents; calm music |
| V10 | Ticket trio | 3D tickets fly through photo portals to a planet | Big launch or hero video |

## Making a variant well

1. Change at least three of: audience, hook, look, photos, music, length (`creative-playbook.md`). A headline swap alone is not a new concept.
2. Keep the hook in the first 1.5 seconds and the end card in the last 3 to 4.
3. Keep helper names unique across the campaign's files (a duplicate top-level name breaks the whole studio).
4. If a variant needs a new reusable effect, add it to a `lib/` file so the next campaign gets it too, and note it in `engine.md`.
