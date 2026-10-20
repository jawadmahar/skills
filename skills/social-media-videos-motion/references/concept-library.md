# Concept library

Proven concepts with working code. Start every new video from the closest one: copy its `defineSpot({...})` block into the new campaign's spot file, give it a new id, then change the copy, photos, colours, timing and music. The shared building blocks live in `scripts/engine/lib/` and are switched on per campaign with `"libs"` in campaign.json.

Status values: **Director favourite** (picked by the director), **Proven** (won on Meta data), **Untested**, **Retired** (lost on Meta data). Update the status from feedback; that is how this library learns.

Code: `campaigns/explorazone/2026-10-half-term/spots/` (`01-classic-2d.js`, `02-classic-3d.js`, `03-rain-series.js`, `04-notebook-series.js`) and `campaigns/explorazone/2026-11-winter/spots/` (a shared kit in `00-kit.js` plus config-driven formats in `01-weather.js` to `05-classic.js`; each W video is one `spot(meta, format, config)` call).

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

Winter variants (Oct 2026, Untested on Meta; code in the winter campaign, `01-weather.js`):

| Id | Title | Format | Mechanic |
|---|---|---|---|
| W01 | Grey again | `frostFmt` (mist, grey street) | Condensation on a window over a grey street, 8°C and overcast; a hand wipes it clear |
| W46 | Skip the city centre | `frostFmt` (mist, traffic, scrape) | Misty windscreen in a tail-light traffic jam, "HEAVY TRAFFIC"; wiped clear to "Outside the ring road" |
| W02 | Dark by 4pm | `duskFmt` | Sunset time-lapse with a ticking clock, rooms switch on one by one |
| W03 | Wet weekend forecast | `forecastFmt` | Two-day weather app swipes to an Explorazone forecast |
| W04 | Windscreen wipers | `wipersFmt` | Each wiper pass clears a sector showing an attraction |
| W05 | Foggy Saturday | `fogFmt` | Road sign in fog; the fog lifts into colour |
| W17 | Storm warning | `stormFmt` | Phone weather alert over blowing leaves, then a calm 2x2 grid |
| W26 | White Christmas? In Norwich? | `snowPlanFmt` (grey) | Drizzle on the window, a plan with "Snowman (no snow)" crossed out |
| W32 | Fairy lights | `fairyFmt` | One tired string of bulbs, then the garden of light |
| W42 | Raindrop race: holidays | `raceFmt` | Three-drop race (Me, Dad, Mum), then a fog wipe |

More ideas: wet wellies by the door, steamed-up café window, "100% chance of fun" weather map, a named storm, rain on a tent at a cancelled day out.
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

Winter variants (Oct 2026, Untested on Meta; `noteFmt` in the winter campaign's `02-notebook.js` draws a paper kind and a timed list of items: handwriting, strikes, circles, ticks, polaroids, photo corners, stamps, sticky notes, magnets):

| Id | Title | Paper | Mechanic |
|---|---|---|---|
| W06 | Dear Nan & Grandad: too cold | lined | Child's letter, polaroids along the bottom |
| W07 | Saturday: sorted | fridge | Sticky notes and magnet photos |
| W08 | Postcard from Bowthorpe | postcard | "Wish you were here, GRANDAD" front flips to a handwritten back with stamp and postmark |
| W19 | Dear Santa | santa | Candy-stripe letter: "I don't want toys this year" |
| W21 | Nan's Christmas list | notepad | Socks and bath salts struck out, "a day out with all the grandkids" circled |
| W27 | End-of-term report | report | "Fun: A*" in red pen |
| W33 | Nan's diary | diary | Hour-by-hour entries, ribbon bookmark |
| W35 | Thank-you card | card | Red and gold card front flips open to a thank-you letter |
| W36 | New Year resolutions | squared | Ticks and one honest cross |
| W43 | Back-to-school planner | planner | Week grid, Saturday circled |

More ideas: shopping list with the day out on it, birthday card, a school trip permission slip, a homework diary signed by a parent.
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

## Winter 2026-27 formats (Oct 2026, Untested on Meta)

Code in `campaigns/explorazone/2026-11-winter/spots/`. Every format is a function that takes a config, so a new video is one `spot()` call.

| Id | Title | Format | Look |
|---|---|---|---|
| W09 | Lock-screen pings | `notifFmt` | Lock screen; notifications stack, the last expands into a photo |
| W10, W41 | Search: rainy day / grandchildren | `searchFmt` | Search bar typing with autocomplete, then a result card with photos |
| W13, W49 | POV / Too old for that | `povFmt` | Handheld punch-in cuts with POV captions (outline or white bubble) |
| W29 | Family group chat | `chatFmt` | Messaging app with typing dots, photo message and hearts |
| W37 | Screen time report | `screenTimeFmt` | Screen-time bars, then a "hands-on time" toggle |
| W39 | Batteries: 1% | `batteryFmt` | Battery drains to red, flash cut to the plasma ball |
| W40 | Camera roll | `rollFmt` | Photo grid fills, tiles open full screen |
| W20 | Advent doors | `adventFmt` | Advent doors: rain clouds first, then photos |
| W22 | Give a day | `giftFmt` | Present shakes, lid flies off, polaroids burst out |
| W23 | Christmas receipt | `receiptFmt` | Till receipt prints; "Ticket 3 £0.00" circled |
| W24 | Snow globe | `globeFmt` | Snow globe shakes; the room inside changes |
| W25 | Jumper day: done | `knitFmt` | Procedural knitted jumper with stitched photo patches |
| W28 | Countdown to the holidays | `flapFmt` | Split-flap 5 to 1, then a 2x2 grid |
| W30 | Tickets in the snow | `snowTicketsFmt` | Three tickets in falling snow; the third flips to FREE |
| W31 | Operation: Wrapping | `dossierFmt` | Typed top-secret dossier with stamps and clipped photos. **Director favourite** (Oct 2026) |
| W11 | In my day | `filmFmt` | Sepia film strip with grain and sprockets over retro tech, then colour. **Director favourite** (Oct 2026) |
| W12, W45 | £36 / January maths | `bigNumFmt` | Giant price filled with a venue photo (grey-cloud option) |
| W14 | Outside vs inside | `splitFmt` | Grey rain versus colour; the divider slides |
| W15 | Bored-o-meter | `stopwatchFmt` | Stopwatch to 04:59 and a BORED stamp |
| W16 | True or false? | `quizFmt` | Swipe quiz cards with answer stamps |
| W18 | Pockets full of conkers | `specimenFmt` | Museum specimen labels on black velvet |
| W34 | Cracker joke | `crackerFmt` | Cracker snaps, the paper joke unfolds |
| W38 | What day is it? | `dayFmt` | Spinning desk calendar |
| W44 | Saturday timetable | `chalkFmt` | Chalkboard lessons and pinned photos |
| W47 | Family tree | `treeFmt` | Tree grows; Nan and Mum get £18 tags, Me gets FREE |
| W48 | Myth: nothing to do | `mythFmt` | Myth statement stamped BUSTED |
| W50 | New year, new worlds | `portalFmt` | Zoom-through glowing portals |

## Winter batch 2 formats (Oct 2026, Untested on Meta)

W51 to W150 for 2 Nov 2026 to Fri 12 Feb 2027, 31 in the grandparents ad set. Code: `06-formats2.js` (eight formats), `06b-formats3.js` (effects picked from the director's list, rule G16) and the period files `07-p1-nov.js` to `12-p6-feb.js`. Seventeen of the 31 grandparent videos follow the favourites: seven "Operation" dossiers and five "In my day" films, plus then-and-now pairs.

| Id | Title | Format | Look |
|---|---|---|---|
| W51, W119 | 50 shades of grey / Blue Monday | `swatchFmt` | Paint chart of local greys or blues; the last swatch is a venue photo |
| W52, W72, W115 | Ring-road map | `mapFmt` | Night map: jammed ring road, dashed route round to a glowing Bowthorpe pin (rule E9) |
| W57, W127 | Crossword | `crosswordFmt` | Newspaper clue; EXPLORAZONE typed into the grid, green tick |
| W61, W94 | Grandparent bingo | `bingoFmt` | Bingo card of everyday moans dabbed to FULL HOUSE |
| W64, W117, W147 | Then and now | `thenNowFmt` | Sepia old object above, the colour attraction below |
| W68 | Boarding pass | `boardingFmt` | "From: the sofa. Gate: outside the ring road. Seat 3: free" |
| W120 | Payday | `payFmt` | Banking app; the highlighted line is three tickets for £36 |
| W137 | February calendar | `calendarFmt` | Wall calendar with the last offer day circled in red pen |
| W103, W134 | Magazine cover | `magazineFmt` | Cover with masthead and popping cover lines, then a zoom through the cover photo |
| W108, W129, W145 | Checklist | `checklistFmt` | Items tick off; the last one carries a thumbnail and zooms through into the photos |
| W93, W113, W132, W138 | Phone mockup | `phoneFmt` | Phone with a lock-screen reminder, a scrolling feed or a story with progress bars, then a zoom through the screen |
| W100, W114 | Paper cutout | `scrapbookFmt` | Ransom-note letters and torn, taped photos on kraft paper, 12 fps stop-motion timing |
| W98, W131 | Growth curve | `chartFmt` | Tongue-in-cheek chart (patience, energy) falling all week, then a zoom through the Saturday spike |
| W105 | Chat takeover | `chatTakeoverFmt` | Group chat floods with replies until it fills the screen, then the photo bubble zooms open |

Cuts: `snapSeq` (each photo snaps in from 122% with a white flash) and `zoomThrough` (zoom into a rectangle until it fills the frame) join these formats to the photos; `zoomTail` wires both together.

Next ideas in the favourites' vein (rule E7): Grandad's toolbox of old gadgets, a 1970s school report next to today's, Nan's recipe card for "a good day out", Mission: half term, a spy-gadget briefing for the grandchildren.

## Making a variant well

1. Change at least three of: audience, hook, look, photos, music, length (`creative-playbook.md`). A headline swap alone is not a new concept.
2. Keep the hook in the first 1.5 seconds and the end card in the last 3 to 4.
3. Keep helper names unique across the campaign's files (a duplicate top-level name breaks the whole studio).
4. If a variant needs a new reusable effect, add it to a `lib/` file so the next campaign gets it too, and note it in `engine.md`.
