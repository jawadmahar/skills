'use strict';

function esc(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const CSS = `
:root { --bg:#f6f4ef; --card:#ffffff; --ink:#1f2430; --muted:#6b7280; --brand:#0f766e; --brand-ink:#ffffff; --line:#e5e1d8; --bad:#b91c1c; --ok:#15803d; }
* { box-sizing:border-box; }
body { margin:0; font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; background:var(--bg); color:var(--ink); }
.wrap { max-width:720px; margin:0 auto; padding:16px; }
header.app { background:var(--brand); color:var(--brand-ink); padding:14px 16px; }
header.app .wrap { display:flex; align-items:center; justify-content:space-between; padding:0; max-width:720px; margin:0 auto; }
header.app a { color:var(--brand-ink); text-decoration:none; font-weight:700; letter-spacing:.3px; }
h1 { font-size:1.25rem; margin:0; } h2 { font-size:1.05rem; margin:20px 0 8px; }
.card { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:16px; margin:12px 0; }
label { display:block; font-weight:600; margin:12px 0 4px; }
input, textarea, select { width:100%; padding:10px 12px; border:1px solid var(--line); border-radius:8px; font-size:1rem; background:#fff; }
textarea { min-height:80px; }
button, .btn { display:inline-block; border:0; border-radius:8px; padding:10px 16px; font-size:1rem; font-weight:600; cursor:pointer; background:var(--brand); color:var(--brand-ink); text-decoration:none; }
button.ghost, .btn.ghost { background:#eceae3; color:var(--ink); }
button.danger { background:var(--bad); }
.muted { color:var(--muted); font-size:.9rem; }
.badge { display:inline-block; padding:2px 10px; border-radius:999px; font-size:.8rem; font-weight:700; }
.badge.pending { background:#fef3c7; color:#92400e; } .badge.approved { background:#dbeafe; color:#1e40af; }
.badge.ready { background:#dcfce7; color:#166534; } .badge.rejected { background:#fee2e2; color:#991b1b; }
.badge.done { background:#e5e7eb; color:#374151; }
.ticket-row { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; padding:12px 0; border-bottom:1px solid var(--line); }
.ticket-row:last-child { border-bottom:0; }
.actions { display:flex; gap:6px; flex-wrap:wrap; }
.actions form { display:inline; }
.actions button { padding:6px 10px; font-size:.85rem; }
.num { font-size:1.6rem; font-weight:800; min-width:56px; }
.statusbig { text-align:center; padding:32px 16px; }
.statusbig .n { font-size:4rem; font-weight:800; }
.grid2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
@media (max-width:520px) { .grid2 { grid-template-columns:1fr; } }
.qrbox svg { width:180px; height:180px; }
code.k { background:#eceae3; padding:2px 6px; border-radius:6px; font-size:.85em; word-break:break-all; }
@media print {
  header.app, .no-print { display:none !important; }
  body { background:#fff; }
  .paper { width:72mm; font-family:"Courier New",monospace; font-size:11px; white-space:pre-wrap; }
}
.paper { font-family:"Courier New",monospace; font-size:12px; white-space:pre-wrap; background:#fff; border:1px dashed var(--line); padding:12px; }
`;

function layout({ title, body, businessName, refreshVersionUrl, showNav }) {
  const nav = showNav
    ? `<nav><a href="/admin" style="margin-right:14px">Tickets</a><a href="/admin/forms">Forms &amp; QR</a></nav>`
    : '';
  const poll = refreshVersionUrl ? `<script>
(function(){
  var v=null;
  setInterval(function(){
    fetch(${JSON.stringify(refreshVersionUrl)}).then(r=>r.json()).then(function(j){
      if(v===null){v=j.version;return;}
      if(j.version!==v){location.reload();}
    }).catch(function(){});
  },5000);
})();
</script>` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="manifest" href="/manifest.webmanifest">
<style>${CSS}</style>
</head>
<body>
<header class="app"><div class="wrap"><a href="/admin"><h1>🕊️ ${esc(businessName)}</h1></a>${nav}</div></header>
<div class="wrap">
${body}
</div>
${poll}
</body>
</html>`;
}

function loginPage({ businessName, error }) {
  return layout({
    title: 'Staff login',
    businessName,
    body: `
<div class="card">
  <h2>Staff login</h2>
  ${error ? `<p style="color:var(--bad)">${esc(error)}</p>` : ''}
  <form method="post" action="/admin/login">
    <label for="pin">Admin PIN</label>
    <input id="pin" name="pin" type="password" inputmode="numeric" autocomplete="current-password" required>
    <p><button type="submit">Sign in</button></p>
  </form>
</div>`
  });
}

function customerFormPage({ form, fields, businessName, error }) {
  const inputs = fields.map((f) => {
    const req = f.required ? 'required' : '';
    const id = `f_${esc(f.key)}`;
    if (f.type === 'textarea') {
      return `<label for="${id}">${esc(f.label)}${f.required ? ' *' : ''}</label>
<textarea id="${id}" name="${esc(f.key)}" ${req}></textarea>`;
    }
    if (f.type === 'select' && Array.isArray(f.options)) {
      const opts = f.options.map((o) => `<option>${esc(o)}</option>`).join('');
      return `<label for="${id}">${esc(f.label)}${f.required ? ' *' : ''}</label>
<select id="${id}" name="${esc(f.key)}" ${req}>${opts}</select>`;
    }
    const type = f.type === 'tel' ? 'tel' : 'text';
    return `<label for="${id}">${esc(f.label)}${f.required ? ' *' : ''}</label>
<input id="${id}" type="${type}" name="${esc(f.key)}" ${req}>`;
  }).join('\n');

  return layout({
    title: form.name,
    businessName,
    body: `
<div class="card">
  <h2>${esc(form.name)}</h2>
  ${error ? `<p style="color:var(--bad)">${esc(error)}</p>` : ''}
  <form method="post">
    ${inputs}
    <p><button type="submit">Submit</button></p>
  </form>
  <p class="muted">After you submit, keep the next page open — it shows your ticket number and live status.</p>
</div>`
  });
}

const STATUS_COPY = {
  pending:  { label: 'Waiting for approval', hint: 'We have received your request. Hold on a moment.' },
  approved: { label: 'Approved — in progress', hint: 'Your request was approved and is being prepared.' },
  ready:    { label: 'Ready!', hint: 'Please come to the counter.' },
  rejected: { label: 'Not accepted', hint: 'Sorry, we could not accept this request. Please speak to staff.' },
  done:     { label: 'Completed', hint: 'Thank you!' }
};

function statusPage({ ticket, form, businessName }) {
  const s = STATUS_COPY[ticket.status] || STATUS_COPY.pending;
  return layout({
    title: `Ticket #${ticket.number}`,
    businessName,
    refreshVersionUrl: `/api/t/${ticket.token}`,
    body: `
<div class="card statusbig">
  <div class="muted">${esc(form.name)}</div>
  <div class="n">#${ticket.number}</div>
  <p><span class="badge ${esc(ticket.status)}">${esc(s.label)}</span></p>
  <p class="muted">${esc(s.hint)}</p>
  <p class="muted no-print">This page updates automatically. Ref: <code class="k">${esc(ticket.token)}</code></p>
</div>`
  });
}

function dashboardPage({ tickets, stats, businessName, printQueueDepth }) {
  const rows = tickets.map((t) => {
    const data = JSON.parse(t.data || '{}');
    const summary = Object.values(data).filter(Boolean).join(' · ').slice(0, 90);
    const act = (status, label, cls = '') =>
      `<form method="post" action="/admin/tickets/${t.id}/status"><input type="hidden" name="status" value="${status}"><button class="${cls}" type="submit">${label}</button></form>`;
    let actions = '';
    if (t.status === 'pending') actions = act('approved', 'Approve ✓') + act('rejected', 'Reject ✗', 'danger');
    else if (t.status === 'approved') actions = act('ready', 'Mark ready') + `<a class="btn ghost" href="/admin/print/${t.id}" target="_blank">Print view</a>`;
    else if (t.status === 'ready') actions = act('done', 'Complete', 'ghost');
    return `
<div class="ticket-row">
  <div class="num">#${t.number}</div>
  <div style="flex:1">
    <div><strong>${esc(t.form_name)}</strong> <span class="badge ${esc(t.status)}">${esc(t.status)}</span></div>
    <div class="muted">${esc(summary)}</div>
    <div class="muted">${esc(t.created_at.replace('T', ' ').slice(0, 16))} UTC</div>
  </div>
  <div class="actions">${actions}</div>
</div>`;
  }).join('');

  return layout({
    title: 'Dashboard',
    businessName,
    showNav: true,
    refreshVersionUrl: '/api/admin/version',
    body: `
<div class="grid2">
  <div class="card"><strong>Today</strong><div class="muted">${stats.total || 0} tickets · ${stats.pending || 0} pending · ${stats.ready || 0} ready</div></div>
  <div class="card"><strong>Print queue</strong><div class="muted">${printQueueDepth} job(s) waiting for the printer</div></div>
</div>
<div class="card">
  <h2 style="margin-top:0">Tickets</h2>
  ${rows || '<p class="muted">No tickets yet. Share a form QR code from the Forms page.</p>'}
</div>`
  });
}

function formsPage({ forms, baseUrl, businessName, printKey }) {
  const cards = forms.map((f) => `
<div class="card">
  <h2 style="margin-top:0">${esc(f.name)} <span class="muted">(${esc(f.kind)}${f.active ? '' : ' · disabled'})</span></h2>
  <div class="grid2">
    <div class="qrbox"><img src="/admin/qr/${esc(f.slug)}.svg" alt="QR code for ${esc(f.name)}" width="180" height="180"></div>
    <div>
      <p>Customer link:<br><code class="k">${esc(baseUrl)}/f/${esc(f.slug)}</code></p>
      <p class="actions">
        <a class="btn ghost" href="/admin/poster/${esc(f.slug)}" target="_blank">Printable QR poster</a>
        <form method="post" action="/admin/forms/${f.id}/toggle"><button class="ghost" type="submit">${f.active ? 'Disable' : 'Enable'}</button></form>
      </p>
    </div>
  </div>
</div>`).join('');

  return layout({
    title: 'Forms & QR codes',
    businessName,
    showNav: true,
    body: `
${cards}
<div class="card">
  <h2 style="margin-top:0">Create a new form</h2>
  <form method="post" action="/admin/forms">
    <label for="nf_name">Form name</label>
    <input id="nf_name" name="name" required placeholder="e.g. Lunch Orders">
    <label for="nf_slug">Link slug (letters, numbers, dashes)</label>
    <input id="nf_slug" name="slug" required pattern="[a-z0-9-]+" placeholder="e.g. lunch">
    <label for="nf_kind">Type</label>
    <select id="nf_kind" name="kind">
      <option value="order">Order (customer request → approve → print)</option>
      <option value="queue">Queue token (walk-in numbering)</option>
      <option value="booking">Booking (appointment request)</option>
    </select>
    <label for="nf_fields">Fields — one per line: <code class="k">label | type</code> (type: text, tel, textarea; add ! for required)</label>
    <textarea id="nf_fields" name="fields" placeholder="Your name | text !
Phone | tel !
Order details | textarea !"></textarea>
    <label for="nf_footer">Ticket footer message</label>
    <input id="nf_footer" name="footer" placeholder="Thank you!">
    <p><button type="submit">Create form</button></p>
  </form>
</div>
<div class="card">
  <h2 style="margin-top:0">Printer connection</h2>
  <p class="muted">Star CloudPRNT URL (set this in the printer's web config):</p>
  <p><code class="k">${esc(baseUrl)}/printer/cloudprnt?key=${esc(printKey)}</code></p>
  <p class="muted">Generic bridge API (for a phone/PC helper that feeds Bluetooth/USB printers):</p>
  <p><code class="k">GET ${esc(baseUrl)}/api/print-jobs?key=${esc(printKey)}</code><br>
     <code class="k">POST ${esc(baseUrl)}/api/print-jobs/&lt;id&gt;/done?key=${esc(printKey)}</code></p>
</div>`
  });
}

function printPage({ text, businessName, ticket }) {
  return layout({
    title: `Print ticket #${ticket.number}`,
    businessName,
    body: `
<p class="no-print"><button onclick="window.print()">Print</button> <a class="btn ghost" href="/admin">Back</a></p>
<div class="paper">${esc(text)}</div>`
  });
}

function posterPage({ form, baseUrl, businessName }) {
  return layout({
    title: `QR poster — ${form.name}`,
    businessName,
    body: `
<p class="no-print"><button onclick="window.print()">Print poster</button> <a class="btn ghost" href="/admin/forms">Back</a></p>
<div style="text-align:center;padding:24px">
  <h1 style="font-size:2rem">${esc(businessName)}</h1>
  <h2 style="font-size:1.4rem">${esc(form.name)}</h2>
  <p style="font-size:1.1rem">Scan with your phone camera:</p>
  <img src="/admin/qr/${esc(form.slug)}.svg" alt="QR code" width="320" height="320">
  <p class="muted">${esc(baseUrl)}/f/${esc(form.slug)}</p>
</div>`
  });
}

function notFoundPage({ businessName }) {
  return layout({
    title: 'Not found',
    businessName,
    body: '<div class="card"><h2>Page not found</h2><p class="muted">Check the link or QR code and try again.</p></div>'
  });
}

module.exports = {
  esc,
  layout,
  loginPage,
  customerFormPage,
  statusPage,
  dashboardPage,
  formsPage,
  printPage,
  posterPage,
  notFoundPage
};
