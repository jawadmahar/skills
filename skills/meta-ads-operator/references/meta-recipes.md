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

## A/B tests

`ads_experiment_check_eligibility` with the ad IDs, then `ads_experiment_abtest_create_test`: cells `[{"name":"Thumbnail A","ad_entity_ids":["<ad>"]},{"name":"Thumbnail B","ad_entity_ids":["<ad>"]}]`, `start_time` tomorrow or later (YYYY-MM-DD), `end_time` the campaign's last day, and a `primary_kpi` that suits the objective: `cost_per_action_type:link_click` or `cost_per_action_type:video_view` for awareness video, `cost_per_action_type:lead` for leads. Ads must be live first.

## Results

`ads_get_ad_entities` at level `ad` with fields checked through `ads_get_field_context` (spend, impressions, reach, 3-second plays, ThruPlays, link clicks, CTR, CPM, results) and a `date_preset` or `time_range`. Save the rows and score them with SMVM's `scripts/score_ads.py`. `ads_get_ad_preview` returns a preview link: give it to the user exactly as returned.

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
