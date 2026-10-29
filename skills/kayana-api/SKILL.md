---
name: kayana-api
description: Read and change Explorazone ticketing in Kayana through the Explorazone Kayana API. Use when asked how busy a day is, how many places are left, what tickets or orders exist, or to move a booking to another date, cancel or restore a ticket, correct customer details, resend tickets, add tickets to an order, turn online or till sales on or off, set Max Cap, change an event or ticket type, or release late-afternoon places on a full half-term day.
---

# Explorazone Kayana API

JSON in, JSON out. It does what the Kayana dashboard does, for Explorazone (Bowthorpe, Norwich).

- Base address: `https://health.stemex.uk/kayana-api`
- Guide: https://health.stemex.uk/kayana-api/
- Auth: header `X-API-Key`, value from the `KAYANA_API_KEY` environment variable.

## The key

- Read it from `KAYANA_API_KEY`. Never print it, echo it, log it, paste it into chat or commit it.
- If it is not set, stop and say so. Do not ask for it in chat: it belongs in the environment's secrets.
- A wrong key 10 times in 10 minutes blocks the caller's address for 30 minutes. On a 401 or 403, stop after one try.
- If the key may have leaked, Eman issues a new one.

## Calling it

Use `scripts/kayana.py` (Python standard library only):

```bash
python scripts/kayana.py GET /days
python scripts/kayana.py GET "/events/EVENT_ID/tickets?date=2026-10-30"
python scripts/kayana.py POST /tickets/TKT-2026-ABC123/change-date '{"date":"2026-10-30"}'            # dry run
python scripts/kayana.py POST /tickets/TKT-2026-ABC123/change-date '{"date":"2026-10-30"}' --confirm  # does it
```

Or curl: `curl -H "X-API-Key: $KAYANA_API_KEY" https://health.stemex.uk/kayana-api/days`

Every answer has `"ok"`. When it is `false`, `"why"` says what went wrong: report that, do not retry blindly.

## Changes: dry run, show, confirm

Every POST is a dry run unless the body has `"confirm": true`. The dry run returns `"dry_run": {...}` describing exactly what would happen and changes nothing.

1. Send the request without `confirm`.
2. Show the user the dry run in plain words (which ticket, order or event, what changes, from what to what).
3. Only after an explicit yes for that specific change, send the same request with `--confirm`.
4. Report the confirmed answer. Confirmed changes are checked, logged and Eman's assistant is told.

Never confirm on the user's behalf, never batch several confirms behind one yes unless the user approved the whole batch as listed, and never skip the dry run.

## Read

| Address | What you get |
|---|---|
| `GET /days` | People booked per holiday day (all tickets, not VR or food), places left online, the day's limit, online and till on or off |
| `GET /events` | Every event: id, name, status, dates, online and till on or off |
| `GET /events/{event_id}` | One event: description, dates, time slots, channels, Max Cap |
| `GET /events/{event_id}/ticket-types` | Ticket types: id, name, price, quantity, sold, available, per-order limits, time slots |
| `GET /events/{event_id}/tickets?date=YYYY-MM-DD&names=1&cancelled=1` | Tickets: id, type, date, scanned or not, cancelled. `names=1` adds the holder's name |
| `GET /events/{event_id}/cap` | Max Cap: on or off, places, taken, places left on the public page |
| `GET /orders?from=YYYY-MM-DD&to=YYYY-MM-DD` | Orders: number, id, customer, time, status, source, total |
| `GET /orders/{order_id}` | One order: customer name, email, phone, payment, items |

## Change (dry run unless confirmed)

| Address | Body | What it does |
|---|---|---|
| `POST /tickets/{ticket_id}/change-date` | `{"date":"YYYY-MM-DD"}` | Moves one booking to another date the event runs. Unscanned tickets only. Same QR code |
| `POST /tickets/{ticket_id}/cancel` | `{"reason":"...","note":"..."}` | Cancels one ticket. No refund |
| `POST /tickets/{ticket_id}/uncancel` | `{}` | Restores a cancelled ticket |
| `POST /orders/{order_id}/customer` | `{"name":"...","email":"...","phone":"..."}` | Corrects the customer's details |
| `POST /orders/{order_id}/resend-email` | `{}` | Emails the customer their tickets again |
| `POST /orders/{order_id}/add-tickets` | `{"tickets":[...]}` | Adds tickets to an existing order (Kayana's dashboard shape) |
| `POST /events/{event_id}/channels` | `{"online":true,"till":false}` | Online sales (website and Kayana listing) and/or reception till on or off. Bought tickets are not affected |
| `POST /events/{event_id}/cap` | `{"places":250}` or `{"enabled":false}` | Max Cap: one shared limit across all ticket types (on a one-day event, the day's total) |
| `POST /events/{event_id}/status` | `{"active":true}` | Event active or inactive |
| `POST /events/{event_id}/update` | any of `event_name`, `event_description`, `event_image_url`, `start_time`, `end_time`, `time_slots_config`, `recurrence_config`, `allow_group_entry`, `sort_order`, `venue_name`, `show_on_kiosk` | Changes the event's details |
| `POST /events/{event_id}/ticket-types/{ticket_type_id}` | any of `quantity`, `price`, `name`, `description`, `min_per_order`, `max_per_order`, `status` | Changes a ticket type. Quantity can never go below what is sold |
| `POST /events/create`, `POST /ticket-types/create` | `{"body":{...}}` | Creates an event or ticket type (Kayana's dashboard shape) |
| `POST /days/{YYYY-MM-DD}/late-only` | `{"places":50}` | On a full half-term day: releases N late-afternoon places only and reopens the day |

## Not offered, on purpose

- Cancelling an event date. It cancels every ticket already bought for that date (as happened on 23 Oct 2026).
- Refunds.

Both are done by a person in the Kayana dashboard. Say so rather than looking for a workaround.

## Good to know

- Half-term days close at 2pm and take up to 250 people each (per the guide).
- In `/days`, `people` counts everyone booked that day on any event (Half Term, the day's own event, Morning and Afternoon tickets) but not VR or food. `places_left_online`, `max_cap`, `online` and `till` belong to that day's own event (`day_event`), so `people` can be above `max_cap`. Read both before saying a day is full.
- Each half-term date has its own event, for example "Half Term - Fri 30 Oct". Get ids from `GET /events`; never guess one.
- Ticket type prices are what the customer pays, in pounds, so VAT-inclusive (gross).
- `GET /orders` currently ignores `from` and `to` (checked 29 Oct 2026: it returned every order). Filter on `when` yourself and tell the user the filter is client-side until it is fixed.

## Personal data

Order details and `names=1` return customer names, emails and phone numbers (UK GDPR). Only fetch them when the task needs them, use them for that task only, and keep them out of summaries, shared documents and anything committed. Prefer counts and order numbers.

## Recipes

- **How busy is a day?** `GET /days`, then report `people`, `places_left_online`, and whether online and till are on.
- **Move a booking:** find the order (`GET /orders`, filter by `when` or number) or the ticket (`GET /events/{id}/tickets?date=...`), check it is not scanned, dry run `change-date`, show it, confirm on a yes.
- **Day is full but late places are wanted:** dry run `POST /days/{date}/late-only` with the number of places, show it, confirm on a yes.
- **Stop online sales for a day:** find that day's event, dry run `POST /events/{id}/channels {"online":false}` (leave `till` out to keep it as is), show it, confirm on a yes.
