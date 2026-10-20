# Delivery

The person posting the ads should be able to open one zip, read one page and upload. Fewer files and fewer zips beat clever structure.

## 1. Stage the folder

```
<Brand>-<Campaign>-Videos/
  README.txt                          what is inside and how to post it (template below)
  1 Videos/
    1 <Series A>/<prefix>-<ID>-<slug>.mp4
    2 <Series B>/...
  2 <Brand>-<campaign>-video-pack.pdf launch notes, offer wording, one card per video, music credits
  3 <Brand>-<campaign>-ad-copy.tsv    one row per video, pastes into Google Sheets
  Music-credits-and-licence.txt
  <brand>-<campaign>-studio.html      optional: preview every video in a browser
```
When the set runs across several periods or ad sets, stage it as the posting schedule instead (rule G13): one top folder per run period, named with its dates, then one folder per ad set, then `Videos` and `Stills`, and one zip per period so each can be uploaded when its window opens:
```
<Brand>-<Campaign>-<n> <Period> (run <dates>)/
  README.txt, pack PDF, ad copy TSV (videos and stills), music credits
  Families/Videos/*.mp4   Families/Stills/*-feed-4x5.jpg, *-story-9x16.jpg
  Grandparents/Videos/... Grandparents/Stills/...
```
File names: lower case with hyphens, `<brand>-<campaign>-<ID>-<slug>.mp4` (for example `explorazone-winter-W07-frosty-window.mp4`). Ad names in Meta: `<PREFIX>_<ID>_<slug>` (for example `EXZ_WIN27_W07_frosty-window`). The ad name is how results find their way back to the creative, so it must match the sheet exactly.

## 2. Build the documents

```bash
node scripts/render.mjs stills out/studio.html out/thumbs --at 0.35 --name id   # one key frame per video, saved as <ID>.jpg
python3 scripts/make_adcopy.py --campaign campaign.json --spots out/spots.json --map music_map.json --credits music_credits.json --files out/final --out "staging/3 ad-copy.tsv"
node scripts/make_pack.mjs --campaign campaign.json --spots out/spots.json --thumbs out/thumbs --map music_map.json --credits music_credits.json --files out/final --out "staging/2 pack.pdf"
```
Pick key frames that show the idea (usually the hook moment, not the end card). Open the pack PDF's first pages as images and check them before zipping.

README.txt template (plain text, British English):

```
<Brand> <campaign>: <n> videos for Instagram and Facebook Reels and Stories
Made <date>. Offer: <offer> (<dates>). Terms: <terms>.

1 Videos: <series list with counts>. All 1080x1920, H.264 with music, ready to upload.
2 Pack (PDF): how to launch, exact offer wording, one page per series with every video's audience, hook, music and ad copy.
3 Ad copy (TSV): open Google Sheets, File > Import or paste. One row per video with the ad name to use.

How to post
- One ad set, broad targeting, Advantage+ placements (Reels and Stories on).
- One ad per video. Use the ad name from the sheet exactly.
- Leave them 5 to 7 days, then pause clear losers and keep winners.
- Then tell Claude "smvm feedback" so the next batch learns from the results.
Music: licensed from Mixkit for social ads (credits included). Do not use the tracks outside these videos.
Questions: <owner name>.
```

## 3. Zip

```bash
python3 scripts/make_zip.py staging/<Brand>-<Campaign>-Videos out/zips --max-mb 1800
```
One zip when it fits; otherwise the script splits by videos and repeats the README, pack and sheet in every part. Videos are stored, not recompressed. Name parts so they sort, e.g. `Explorazone-Winter-Videos (part 1 of 2).zip`. For batches spread over months, one zip per monthly drop is easiest for the team.

## 4. Google Drive

Two routes, depending on what this session has:

1. **Drive secrets set** (`GDRIVE_CLIENT_ID`, `GDRIVE_CLIENT_SECRET`, `GDRIVE_REFRESH_TOKEN`; `setup_check.sh` reports it): `python3 scripts/upload_to_drive.py out/zips/*.zip --folder "<Brand> videos <campaign>"`. It creates the folder, uploads with resume support and prints the links. Setup steps are at the top of the script.
2. **Connector only**: the Google Drive connector can create folders, Docs and Sheets and share them, but it cannot carry large binary files. Create the folder with the connector, add the README as a Google Doc and the ad copy as a Google Sheet (text content converts automatically), then send the zips to the user in chat and ask them to drag them into that folder.

Sharing: only share the folder with an address the user has confirmed in this conversation, as a viewer unless they say otherwise. Never make it public.

## 5. Hand over in chat

Send the zip(s) and the pack PDF with the file tool, then a short message: what was made, where the files are (Drive link if uploaded), anything that needs the user's decision, and the one-round feedback question (`interview.md`). Offer a ready-to-paste note for the person posting:

```
Hi <name>, the <campaign> videos are in <link or attached zip>. Start with the README, then the pack PDF.
Post each video as its own ad in one ad set, with the ad names from the sheet. After a week, send me the
results or ask Claude for "smvm feedback". Thanks, <sender>
```
