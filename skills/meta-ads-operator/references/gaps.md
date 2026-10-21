# What the connector cannot do yet, and who covers it

Checked October 2026. The Meta Ads connector covers paid ads: accounts, Pages for ads, audiences, media uploads, campaigns, ad sets, ads, budgets, statuses, tests, insights, previews and change history. Everything below needs a person or another tool. Re-check when the connector list changes.

| Gap | Who covers it now | How to close it |
|---|---|---|
| **Organic posts** to the Facebook Page and Instagram | Musa (Meta Business Suite) | A connector or small MCP server on the Meta Graph API with Page publishing and Instagram content publishing permissions, or an n8n workflow (the business already runs n8n) that posts on request; nothing suitable was in the connector directory in October 2026 |
| **Comments and DMs** on ads and posts | Musa (Business Suite inbox) | The same route with comment and messaging permissions, which Meta grants only after app review; until then Claude can draft replies for Musa to paste |
| **Instagram account check** (`ads_get_ig_accounts` returns nothing) | Musa confirms the account on one ad in Ads Manager | Reconnect the Meta connector with Instagram permissions, and link the Instagram account to the ad account in Business Settings |
| **Lead form ads** (Lead Ads terms not accepted for this connection) | Musa builds lead forms in Ads Manager | The director accepts Meta's Lead Ads terms for the Page (facebook.com/legal/leadgen/tos), then reconnects |
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
