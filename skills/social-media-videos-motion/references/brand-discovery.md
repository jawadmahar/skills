# Brand discovery: guidelines first

Every brand we make videos for already has a look, a voice and rules, written down or not. The job is to find them before designing anything, because a beautiful video in the wrong colours, fonts or tone has to be redone, and for a franchise it can breach the franchise agreement.

## 1. Confirm the brand

Mahar Group brands share an audience (local families) but not a voice:

| Brand | What it is | Notes |
|---|---|---|
| Explorazone | Interactive science attraction in Bowthorpe, Norwich (formerly Exploring Science, rebranded 2026) | Profile and photo manifest in `brands/explorazone/` |
| STEMEX | Children's STEM education, Short Breaks and Alternative Provision | Children's services: safeguarding and consent rules on photos |
| Muffin Break | Café franchise (Foodco) | Franchisor brand rules and approvals apply |
| Cafe UFO | Café and dark kitchen, including Wraps and Wings | Food advertising rules apply |

If the request does not make the brand clear, ask before doing anything else.

## 2. Search for guidelines, in this order

1. **This conversation and project**: attachments, project knowledge files, pasted briefs.
2. **Installed skills**: a skill dedicated to this brand (for example one with the brand's name in it). The `brand-guidelines` example skill that ships with Anthropic's skills describes Anthropic's own brand; never use it for our brands.
3. **Google Drive** (if the connector is available): search for `<brand> brand guidelines`, `brand book`, `style guide`, `tone of voice`, `logo`, `campaign brief`, and the campaign name. Prefer the newest file; note its name and date.
4. **Email** (if a mail connector is available, the user's own mailbox only): recent campaign briefs, franchisor marketing updates, offer approvals.
5. **This skill's records**: `brands/<brand>/profile.md` and `brand.json` from earlier jobs. If they are more than six months old, confirm the key points in the interview.
6. **Public sources**: the brand's website and social profiles, and its live Meta ads (`ads_get_creatives`, `ads_get_ad_images`) for the colours, fonts, voice and photos actually in use.

## 3. What to extract

| Item | What to capture |
|---|---|
| Logo | Files (transparent PNG preferred), clear space, minimum size, light and dark versions |
| Colours | Hex values; which are primary, which are accents; text and background pairings |
| Fonts | Names; if the brand font is not on Google Fonts, the closest Google Font and a note that it is a stand-in |
| Voice | Tone words, words to use and avoid, reading level, how the brand addresses people |
| Photography | Approved library, style (bright, candid, product close-ups), people and consent rules |
| Legal lines | Standard T&Cs, trademarks, franchise disclaimers, allergen or age notes |
| Must-haves | Logo on the end card, URL, location line, hashtags |
| Never | Competitor names, claims that need proof, anything the franchisor bans |

## 4. Order of precedence

When sources disagree, the higher one wins, and you tell the user where it changed the plan:

1. The law and platform rules (`compliance-uk.md`, Meta advertising standards)
2. Franchisor rules, for franchise brands
3. The campaign brief for this job
4. The brand guidelines
5. This skill's learnings for that brand
6. This skill's global learnings
7. This skill's defaults

## 5. Write it down

Copy `brands/_template/` to `brands/<brand>/` the first time, then keep it current:

- `brand.json`: what the engine needs (palette, colour roles, fonts, labels for photo keys, footer copy, photo pool). Schema in `engine.md`.
- `profile.md`: what a person or a future session needs (voice, sources with dates, assets and where they live, what to avoid, open questions).

If no guidelines exist, build a provisional profile from the website and current ads, mark it **Provisional, not confirmed by the brand owner**, and confirm colours, fonts, tone and terms in the interview.

## 6. Photos and assets

- Use the brand's own approved photos first. Real places, products and people beat stock every time.
- Hero photos need to be at least 1,000 pixels wide on screen. Big, bright and varied across the set.
- If there is no better library, the brand's existing Meta ad images are approved material: 9:16 Story ads at 1080x1920 usually have a clean photo band that can be cropped. Record each crop in `brands/<brand>/photo-manifest.json` (source image file id, crop box) so it can be rebuilt.
- People, especially children: only use images the brand already uses in its own marketing or has consent for. Never take faces from customers' social posts.
- Keep brand photos out of public repositories. They belong in the working folder or a private Drive, not in this skill.
