# What the connector cannot do yet, and who covers it

Checked October 2026. The Meta Ads connector covers paid ads: accounts, Pages for ads, audiences, media uploads, campaigns, ad sets, ads, budgets, statuses, tests, insights, previews and change history. Everything below needs a person or another tool. Re-check when the connector list changes.

| Gap | Who covers it now | How to close it |
|---|---|---|
| **Organic posts** to the Facebook Page and Instagram | Musa (Meta Business Suite) | Quickest: connect the Page and Instagram account in GHL (Marketing > Social Planner); a Claude session with the GHL connector can then draft and schedule posts there. Otherwise a Graph API connector or an n8n workflow; nothing suitable was in the connector directory in October 2026 |
| **Comments and DMs** on ads and posts | Musa (Business Suite inbox) | Connect Facebook and Instagram in GHL (Settings > Integrations) so messages arrive in GHL Conversations, where a Claude session with the GHL connector can read them and draft replies; until then Claude drafts replies for Musa to paste |
| **Instagram account list** (`ads_get_ig_accounts` returns nothing, for every brand) | Nobody needed for ads: creatives carry the Page's Instagram account (Explorazone: @explorazonelab, confirmed 21 Oct 2026). Musa boosts existing Instagram posts in Ads Manager | Still empty after reconnecting with every Instagram account ticked and linking the account to the ad account, in a new session too, so the connector does not have the permission yet; re-test when the connector changes |
| **Lead form ads** | Solved for Explorazone on 21 Oct 2026 (terms accepted) | For another Page, check `leadgen_tos_accepted` with `ads_get_ad_account_pages`; if false, a Page admin accepts at facebook.com/legal/leadgen/tos |
| **Publishing that stops at the campaign** | Director or Musa: Ads Manager, open the campaign, Review and publish | Report it; the drafts are complete and validated, so it is one click |
| **Business Settings**: people, roles, partners, payment methods | Director | Make sure at least two trusted people have full control of the Business portfolio, the ad account and the Page, so no one person is a single point of failure |
| **Billing problems** (an unsettled account, a failed card) | Director | Settle in Billing and payments; Claude can only report what it sees |
| **Deleting a temporary media branch** (blocked from cloud sessions) | Director, one click on GitHub | Or upload media through Musa or the local upload tool instead |
| **Phone-only work** (camera roll uploads, Stories stickers, Reels audio from Meta's library) | Musa | Not planned; our videos carry their own licensed music |

## Handover note for Musa (adapt and paste)

```
Hi Musa, Claude now builds and launches our Meta ads from the video packs, sets the budget we agree, and checks
results on a schedule. Please keep doing organic posts, comments and DMs, and when Claude asks, check new ads in
Ads Manager (Instagram account, preview on a phone) or click Review and publish if a launch gets stuck there.
Thanks, Jawad
```
