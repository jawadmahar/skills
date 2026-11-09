# Meta Ads connector recipes

The calls that cover Musa's day-to-day work, in the order a launch uses them, with the traps we have actually hit. Tool names are the connector's (`ads_*`); load any that are deferred before calling them.

## Fields on every call

- `advertiser_job`: one value for the whole job, chosen from the user's goal, not the tool. Launching new ads is `create_and_launch_new_ads` for every call of that job, including lookups and the final check. A results review is `assess_and_optimize_performance`; a pure lookup is `report_measure_or_look_up`; pausing or budget edits on running campaigns are `update_existing_campaigns`.
- `advertiser_request`: the user's own words, joined across turns, without names or contact details.
- `client_conversation_id`: generate 20 random letters and digits on the first call of a conversation, then reuse the value each result returns.
- `client_model`: the exact model id from your system context.

## Discover

| Need | Call | Notes |
|---|---|---|
| Ad accounts | `ads_get_ad_accounts` | Check `is_queryable`; note currency and time zone |
| Pages | `ads_get_ad_account_pages` | The Page that owns the ads |
| Exclusion audiences | `ads_get_ad_account_custom_audiences` | Pick by name (existing customers, existing leads), not by remembered ID |
| Instagram account | `ads_get_ig_accounts` | Can return nothing even when Meta knows the Page's Instagram account (see Pitfalls) |
| What is live | `ads_get_ad_entities` level `campaign` or `adset` with `delivery` and `end_time` | Verify field names with `ads_get_field_context` first. Judge "running" by `delivery`: `status` and `effective_status` stay ACTIVE after the end date |
| Change history | `ads_account_get_activity_logs` | Who changed what; best proof that a publish created objects |

## Upload media

- Video or image by public URL: `ads_creative_upload_media` with `upload_source: URL`, `media_type: VIDEO` or `IMAGE`, `media_url`, `name`. Videos come back `processing`; poll `ads_get_ad_videos` until `ready`.
- `ads_creative_upload_local_image` and `LOCAL_FILE` uploads need the client's upload app; in Claude Code on the web they are not available yet, so use URLs (`media.md`).
- Thumbnails: an image URL given to a creative is copied into the image library. `ads_get_ad_images` without `hashes` lists only hash and name, and URL copies are all named "untitled"; call it again with `hashes` and `fields: ["hash", "url_128", "created_time"]`, then run `scripts/match_thumbs.py` to pair each hash with its file. Never pair by order: a retried upload lands out of sequence.

## Campaign

`ads_create_campaign` with an ODAX objective: `OUTCOME_AWARENESS` for reach-led video drops, `OUTCOME_TRAFFIC` for site visits, `OUTCOME_LEADS` for Meta lead forms (needs the Lead Ads terms accepted for this connection, `gaps.md`). `special_ad_categories` is empty for all our brands. Name: `<PREFIX> <what> | <offer> | <who built it> | <dd-mm-yy>`.

## Ad sets

`ads_create_ad_set`, one per audience:
- `daily_budget` in pence (`2500` is £25 a day), `end_time` ISO 8601 with offset, for example `2026-10-31T23:59:00+0000`. Leave `start_time` out to start on publish.
- Awareness: `optimization_goal: REACH`, `billing_event: IMPRESSIONS`, `bid_strategy: LOWEST_COST_WITHOUT_CAP`, and a frequency cap such as `[{"event":"IMPRESSIONS","interval_days":7,"max_frequency":2}]`.
- Location: a radius around the venue, for example `"geo_locations":{"places":[{"key":"<place key>","radius":60,"distance_unit":"kilometer"}],"location_types":["home","recent"]}`. Copy the key from the brand's working ad set rather than guessing.
- Exclude existing customers and existing leads with `excluded_custom_audiences` when the offer is for new customers only.
- Ages and Advantage+ audience: under Advantage+ audience a hard `age_min` above 25 or `age_max` below 65 is rejected. For a broad family audience keep `age_min` at 25 or lower and give the narrower range as suggestions (`targeting_automation.advantage_audience` with `age_min_suggestion` and `age_max_suggestion`). For an audience that must really be older, such as grandparents 50+, set `targeting_automation.advantage_audience` to 0 with the hard ages.

## Ads

`ads_create_ad` with `hide_ui: true` when making many, and an inline creative:

```json
{"name": "EXZ_HT26_V10_ticket-trio",
 "object_story_spec": {"page_id": "<page id>", "instagram_user_id": "<instagram account id>",
   "video_data": {"video_id": "<ad video id>", "image_hash": "<thumbnail hash>",
     "title": "<headline>", "message": "<primary text>",
     "call_to_action": {"type": "SIGN_UP", "value": {"link": "https://example.co.uk/offer/?utm_source=meta&utm_medium=paid_social&utm_campaign=<campaign>&utm_content=<ID>"}}}}}
```

- Check `active_errors` in every response; it must be `[]`.
- `scripts/build_ad_specs.py` writes these strings from the ad copy sheet, so nothing is retyped by hand.
- To change a live ad's creative, make a new ad and pause the old one; creatives cannot be edited.
- A broken draft ad: `ads_update_entity` with `{"status":"DELETED"}`. It stays in the draft marked deleted; never include it in a publish.

## Drafts

Draft mode stages everything in Ads Manager's draft. `ads_get_ad_entities` with `object_state: draft` and the campaign ID lists the staged tree. Big listings are too large to show and are saved to a file; run `scripts/check_drafts.py` on that file.

## Publish and verify

1. `ads_activate_entity` with `entity_id` and `entity_type` of the top object, `object_ids` listing the campaign, every ad set and every ad, and `publish_as_active: true`.
2. The answer `PUBLISHING` means handed over. Read back live objects (`ads_get_ad_entities` level `adset` filtered on `campaign.id`, then level `ad`) and the activity log.
3. If the campaign appears but its ad sets and ads do not, retry once with the ad sets and ads only. If they are still missing a few minutes later, stop: ask the director or Musa to open the campaign in Ads Manager, check the drafts and click Review and publish. Ads Manager shows any blocking message that the connector does not.

## Change running campaigns

- Pause: `ads_update_entity` with only `{"status":"PAUSED"}`. When the answer says `is_draft: false` the live object is paused; do not call `ads_activate_entity` afterwards, it can undo the pause.
- Budget: `ads_update_entity` with `{"daily_budget": <pence>}` on the ad set, only with approval. If the answer says `is_draft: true`, publish that one object alone.
- Check with `ads_get_ad_entities` after every change.

## Read what a live ad really contains

`ads_get_creatives` and ad previews leave out the things that go wrong most: the real button destination, the extra text options, the original video ID and the thumbnail hash. To see them, duplicate the ad as a draft: `ads_create_ad` with the live ad's `ad_set_id`, a clear new `ad_name`, `source_ad_id` set to the live ad, `hide_ui: true` and no `creative`. Nothing goes live. The returned `spec` holds the full creative:
- `creative.object_story_spec.video_data.call_to_action`: the button type and the link it really opens. The display link (`link_caption`) can show the offer page while the link itself goes somewhere else, such as map directions;
- `creative.asset_feed_spec.bodies` and `titles`: every text option Meta rotates, not just the first;
- `video_data.video_id` (the library video, not the Page post copy) and `video_data.image_hash` (the cover).

Each of these results is long (about 9,000 tokens). For more than two or three ads, write a specs file and give the job to a helper agent, then check its work from a draft listing with a script. Afterwards either turn the duplicate into the corrected ad (next section) or discard it; never leave an unedited duplicate in the draft.

## Fix a live ad's copy or link

Published creatives cannot be edited, so a fix is a new ad:
1. Duplicate the live ad as a draft (above) and note its `video_id` and `image_hash`.
2. Replace the draft's creative: `ads_update_entity` with `entity_type: ad` and `fields` of `{"creative": {"object_story_spec": {"page_id": ..., "instagram_user_id": ..., "video_data": {"video_id": ..., "image_hash": ..., "title": ..., "message": ..., "call_to_action": {"type": "SIGN_UP", "value": {"link": "<tested link>"}}}}, "url_tags": "<the account's usual tags>"}}`. The answer must show `active_errors: []`.
3. Check every staged ad's title and message against the copy sheet with a script, character for character.
4. With the director's yes, publish the new ads, read them back live, then pause the old ones. The ad set and its budget do not change, so spend does not rise.

Take the copy from the campaign's source files or the latest copy sheet, and check the sheet is newer than the last re-render: a sheet made before director feedback still carries the old text.

## Clear stale drafts

A superseded build left in the draft is a hazard: every read comes back with a reminder about it, and one click on Review and publish in Ads Manager could send it live. Discard it once the director agrees: `ads_update_entity` with `discard_draft_changes: true` on each draft ad set (a published campaign has nothing to discard; its unpublished ad sets do). The first call only previews and returns a `confirmation_token`; show the list, get the yes, then repeat the call with the token.

## A/B tests

`ads_experiment_check_eligibility` with the ad IDs, then `ads_experiment_abtest_create_test`: cells `[{"name":"Thumbnail A","ad_entity_ids":["<ad>"]},{"name":"Thumbnail B","ad_entity_ids":["<ad>"]}]`, `start_time` tomorrow or later (YYYY-MM-DD), `end_time` the campaign's last day, and a `primary_kpi` that suits the objective: `cost_per_action_type:link_click` or `cost_per_action_type:video_view` for awareness video, `cost_per_action_type:lead` for leads. Ads must be live first.

## Results

`ads_get_ad_entities` at level `ad` with `name`, `adset_name`, `delivery`, `created_time`, `amount_spent`, `impressions`, `video_p25_watched_actions`, `video_thruplay_watched_actions` and `link_click`, a `date_preset` or `time_range`, and `include_additional_context: false` to keep the answer small. `3_second_video_plays` exists only at ad set level and above, and `video_play_actions` counts every play, so neither gives a per-ad hook rate. Score live ads with `scripts/score_live_ads.py` (it takes the saved result, or a small tab-separated file when the result came back inline) and whole campaigns after they end with SMVM's `scripts/score_ads.py`. At campaign level add `objective`, `lead` and `link_click` for the money picture. `ads_get_ad_preview` returns a preview link to give to the user exactly as returned, but its result is very long and does not show the real link; use it for one ad the user wants to see, not for checks.

## Pitfalls we have hit

| What happened | What to do |
|---|---|
| Ads made from a creative ID showed `ObjectStorySpecRedundant` (1443051): the draft copied both the image URL and Meta's own image hash | Build ads with an inline spec holding the image hash only |
| A creative read back a different video ID from the one uploaded (the Page post's copy) | Keep your own map of uploaded video IDs |
| URL-copied thumbnails were all named "untitled" and one arrived out of order after a retry | Match by picture with `match_thumbs.py` |
| `ads_get_ig_accounts` returned nothing, but Meta filled the Page's Instagram account into the creative | Pass that `instagram_user_id` in inline specs so Instagram placements run, and ask Musa to confirm it is the right account |
| Publishing a new draft campaign pushed only the campaign; its ad sets and ads stayed in the draft, validated, with no error shown | Verify live, retry once, then hand to Ads Manager's Review and publish |
| The auto-mode safety check blocked a single write as a real-world transaction | Do not loop. Finish the rest, then explain to the director and let them decide |
| Draft listings over about 100 KB could not be shown | Read the saved file with `check_drafts.py` |
| A campaign past its end date still read ACTIVE, and was reported as running three days after it completed | Check `delivery` and `end_time`, and re-read before any report |
| `ads_get_creatives` returned no link for video ads that do have one, and the preview showed an empty link too | Duplicate the ad as a draft and read the spec ("Read what a live ad really contains") |
| Live ads showed a "See details" button and the offer page as the display link, but the click opened map directions | Read the real `call_to_action` link on one ad per ad set at the first check of every launch |
| Someone else rebuilt or paused the campaign outside the connector | Read the activity log before reporting, and say who did what |
| Rates typed and ranked by hand missed a clear loser and used the wrong comparison group | `scripts/score_live_ads.py` does the sums and the rule |
| A whole Google Sheet, an ad preview or a duplicate's spec flooded the conversation (9,000 to 20,000 tokens each) | Ask for named fields only, search rather than read whole sheets, and hand bulk reads to a helper agent |
| A write's result was lost when the session restarted | Read the object back before sending the write again |
| An old build left in the draft triggered a "staged but not published" reminder on every read | Clear stale drafts ("Clear stale drafts") |
