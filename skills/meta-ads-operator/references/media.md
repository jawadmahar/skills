# Getting videos and thumbnails into the ad account

The connector uploads media from a public URL. Pick the first route that works:

1. **Temporary public link (GitHub media drop)**: with the director's OK for this batch, push the files to a throwaway branch of a repository and give Meta the raw URLs. Meta copies the files, so the link only needs to live until uploads finish. The files are adverts that will be public anyway, but brand photos and unreleased offers must never sit there longer than needed.
2. **Local upload tool** (`ads_creative_upload_local_image`, `LOCAL_FILE` uploads): only where the client supports the upload app. In Claude Code on the web it said "being gradually rolled out" in October 2026.
3. **Musa uploads in Ads Manager**, then tell Claude the file names; find the IDs with `ads_get_ad_videos` and `ads_get_ad_images`.

## Media drop, step by step

```bash
bash scripts/media_drop.sh push https://github.com/<owner>/<repo> media-drop-<campaign> out/final/*.mp4 out/thumbs/*.jpg
# prints one raw.githubusercontent.com URL per file; GitHub serves videos as application/octet-stream, which Meta accepts
```

- Upload each video with `ads_creative_upload_media` (URL, VIDEO, name = file name without extension) and record file to video ID.
- Poll `ads_get_ad_videos` until every video is `ready`.
- Upload thumbnails the same way as IMAGE (the result gives the hash), or let the first creative copy them and match hashes later with `match_thumbs.py`.
- Then remove the branch: `bash scripts/media_drop.sh delete https://github.com/<owner>/<repo> media-drop-<campaign>`. Cloud sessions are often not allowed to delete branches (HTTP 403 in October 2026). The script then prints the link for the director to delete it by hand at `https://github.com/<owner>/<repo>/branches`; ask them to, and do not try to work around the block.

## Thumbnails

- Use a frame that shows the hook, for example 35% into the video, at 1080x1920. `node scripts/render.mjs stills` in SMVM makes them.
- For a thumbnail A/B test, make the B cover from a different moment, such as the end card with the offer, and keep everything else identical.
- Record `<ID>: <image hash>` for every thumbnail in your private launch notes. Meta re-encodes images, so a hash is not the MD5 of your file.
