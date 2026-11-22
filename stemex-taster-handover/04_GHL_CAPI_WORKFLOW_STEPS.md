# 04 - GHL to Meta Stage Events (manual build)

## Why
The Meta dataset "STEMEX GHL CRM" (`1500506997905938`) currently receives only "Lead" events. Sending later stages lets Meta report cost per taster booked, attended and sold. In future it could also let Meta optimise for quality, but at 20 to 50 leads a month this is mainly for reporting for now.

## Build three workflows in GHL (STEMEX sub-account)
Go to Automation, then Workflows, then Create Workflow, then Start from scratch. Leave **allow re-entry off** on all three, so each stage fires only once per contact.

| Workflow name | Trigger | Action |
|---|---|---|
| Meta CAPI - Taster Booked | Pipeline Stage Changed. Pipeline: 04-S-M Meta Ads - Taster Sessions W26. Stage: Taster Booked | Facebook / Meta Conversions API. Dataset: STEMEX GHL CRM. Event: **Schedule** |
| Meta CAPI - Taster Attended | Same pipeline. Stage: Attended | Event: custom **TasterAttended** |
| Meta CAPI - Block Bought | Same pipeline. Stage: Block Bought | Event: **Purchase**, value 70, currency GBP |

**In each action:**
- Send email and phone, which are hashed automatically.
- If the action offers a **Lead ID** field, map it to the Meta lead ID. That gives the best match for instant-form leads.

## Test before publishing
1. In Meta Events Manager, open STEMEX GHL CRM, go to Test events and copy the test code.
2. Paste the code into the GHL action. Move a test contact into each stage and confirm the event appears.
3. Remove the test code, then publish each workflow.

## Watch out for
- **Rescheduled taster:** if a card moves back to Taster Booked, re-entry off stops a duplicate event.
- **Cards must actually be moved.** The data is only as good as the team moving cards to Booked, Attended and Block Bought every time.
