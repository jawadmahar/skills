# 🕊️ Kabootar

**QR code → customer form → staff approval → ticket prints at the till.**

A customer scans a QR code at your counter (or on your website), fills in a short
form on their phone, and gets a live status page with a ticket number. Staff see
the request on any phone or laptop, tap **Approve**, and a ticket comes out of the
receipt printer. No app installs for customers, no app stores, no fees.

One engine, three modes (built-in form templates):

| Mode | What it does |
|---|---|
| **Order** | Customer request → staff approve/reject → ticket prints |
| **Queue** | Walk-in token: submits, auto-approves, prints a numbered token instantly |
| **Booking** | Appointment request → staff confirm → confirmation slip prints |

## Quick start (Windows laptop or anywhere with Node 22.5+)

```
cd apps/kabootar
npm install
npm start
```

The console prints your **Admin PIN** and **Print key** on first run. Then:

- Staff dashboard: `http://localhost:8787/admin` (login with the PIN)
- Demo customer forms: `/f/order`, `/f/queue`, `/f/booking`
- **Forms & QR** page: get the QR code for each form, print an A4 QR poster,
  create your own forms (no code needed), and find the printer connection URLs.

Settings via environment variables (all optional):

| Variable | Purpose | Default |
|---|---|---|
| `PORT` | Port to listen on | `8787` |
| `BASE_URL` | Public URL baked into QR codes — set this in production | `http://localhost:PORT` |
| `ADMIN_PIN` | Staff login PIN (overrides the stored one — use to recover a forgotten PIN) | auto-generated |
| `BUSINESS_NAME` | Shown on pages and printed tickets (first run only) | `My Shop` |
| `KABOOTAR_DB` | SQLite database file path | `./kabootar.db` |

Run the end-to-end test: `npm test`

## Getting it on the internet

Customers' phones need to reach the server, so for real use deploy it anywhere
that runs Node and has a persistent disk (the SQLite file must survive restarts):

- **Railway / Render / Fly.io** — connect the repo, set root to `apps/kabootar`,
  start command `npm start`, attach a small volume, set `BASE_URL` to your URL.
- **Any cheap VPS** — `node server.js` behind Caddy/nginx for HTTPS.
- **Quick demo from your laptop** — run locally and expose it with a tunnel
  (e.g. `cloudflared tunnel --url http://localhost:8787`), then set `BASE_URL`
  to the tunnel URL so the QR codes point at it.

## Connecting your receipt printer

Three options, pick whichever matches your hardware:

1. **Star printer with CloudPRNT** (Ethernet/Wi-Fi models): in the printer's web
   config, set the CloudPRNT server URL to the one shown on the **Forms & QR**
   page (`/printer/cloudprnt?key=...`). The printer polls the server itself —
   nothing else needed. Approved tickets print automatically.
2. **Bluetooth / USB printer at the till**: any small helper on a phone or PC can
   poll the bridge API and push jobs to the printer:
   - `GET /api/print-jobs?key=<print key>` → `{ jobs: [{ id, content }] }`
   - `POST /api/print-jobs/<id>/done?key=<print key>` after printing
   Job content is plain 42-column text, ready to wrap in ESC/POS. (An Android
   bridge APK for this is the planned next component.)
3. **No printer / fallback**: every ticket has a browser **Print view** in the
   dashboard — works with any printer Windows can see, including thermal ones
   installed as a Windows printer.

## Using it with your WordPress sites

No plugin needed. Each form is just a link (`https://your-app/f/order`), so on
stemex.uk or explorazone.co.uk you can:

- add a button/menu link to the form, or
- embed it with a block: `<iframe src="https://your-app/f/order" style="width:100%;height:640px;border:0"></iframe>`

## Roadmap (the other launch ideas this engine unlocks)

- Android bridge APK (Bluetooth ESC/POS printing + order notifications)
- Kitchen/back-office live display (idea 6) — a read-only auto-refreshing board
- "Now serving" public screen for queue mode (idea 2)
- Review-funnel QR on printed tickets (idea 4)
- Daily stats dashboard (idea 5) — basic today-counts already on the dashboard
- Loyalty stamps via ticket ref codes (idea 7)

## Security notes

- Staff area is PIN + session cookie, with login rate-limiting.
- Printer endpoints require the per-install print key.
- Customer status pages use unguessable tokens; no personal data is shown beyond
  what the customer themselves entered.
- All customer input is HTML-escaped; SQLite via prepared statements only.
