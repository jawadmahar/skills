'use strict';

const http = require('node:http');
const crypto = require('node:crypto');
const { URL } = require('node:url');
const QRCode = require('qrcode');

const store = require('./lib/db');
const views = require('./lib/views');
const { renderTicketText } = require('./lib/print');

const PORT = Number(process.env.PORT || 8787);
// Public URL used inside QR codes; must be set to the real domain in production.
const BASE_URL = (process.env.BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

const sessions = new Map(); // token -> expiry epoch ms
const loginFailures = new Map(); // ip -> { count, until }

function businessName() {
  return store.getSetting('business_name') || 'My Shop';
}

function parseCookies(req) {
  const out = {};
  for (const part of (req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function isAdmin(req) {
  const token = parseCookies(req).kb_sess;
  if (!token) return false;
  const exp = sessions.get(token);
  if (!exp || exp < Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function startSession(res) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, Date.now() + SESSION_TTL_MS);
  res.setHeader('Set-Cookie', `kb_sess=${token}; HttpOnly; Path=/; Max-Age=${SESSION_TTL_MS / 1000}; SameSite=Lax`);
}

function readBody(req, limit = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('body too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function parseForm(body) {
  const out = {};
  for (const [k, v] of new URLSearchParams(body)) out[k] = v.trim();
  return out;
}

function send(res, status, body, type = 'text/html; charset=utf-8', headers = {}) {
  res.writeHead(status, { 'Content-Type': type, ...headers });
  res.end(body);
}

function sendJson(res, status, obj) {
  send(res, status, JSON.stringify(obj), 'application/json; charset=utf-8');
}

function redirect(res, to) {
  res.writeHead(303, { Location: to });
  res.end();
}

function requirePin(req, res) {
  if (isAdmin(req)) return true;
  redirect(res, '/admin/login');
  return false;
}

function validPrintKey(url) {
  const key = url.searchParams.get('key') || '';
  return key.length > 0 && crypto.timingSafeEqual(
    Buffer.from(key.padEnd(64).slice(0, 64)),
    Buffer.from(store.printKey.padEnd(64).slice(0, 64))
  );
}

function enqueueTicketPrint(ticket) {
  const form = store.getFormById(ticket.form_id);
  const text = renderTicketText({
    ticket,
    form,
    fields: store.parseFields(form),
    businessName: businessName()
  });
  store.enqueuePrint(ticket.id, text);
  return text;
}

const routes = [];
function route(method, pattern, handler) {
  routes.push({ method, pattern, handler });
}

// ---------- customer ----------

route('GET', /^\/$/, (req, res) => redirect(res, '/admin'));

route('GET', /^\/f\/([a-z0-9-]+)$/, (req, res, m) => {
  const form = store.getFormBySlug(m[1]);
  if (!form || !form.active) return send(res, 404, views.notFoundPage({ businessName: businessName() }));
  send(res, 200, views.customerFormPage({
    form, fields: store.parseFields(form), businessName: businessName()
  }));
});

route('POST', /^\/f\/([a-z0-9-]+)$/, async (req, res, m) => {
  const form = store.getFormBySlug(m[1]);
  if (!form || !form.active) return send(res, 404, views.notFoundPage({ businessName: businessName() }));
  const fields = store.parseFields(form);
  const posted = parseForm(await readBody(req));
  const data = {};
  for (const f of fields) {
    const v = String(posted[f.key] ?? '').slice(0, 2000);
    if (f.required && !v) {
      return send(res, 400, views.customerFormPage({
        form, fields, businessName: businessName(), error: `Please fill in "${f.label}".`
      }));
    }
    data[f.key] = v;
  }
  const ticket = store.createTicket(form, data);
  // Walk-in queue tokens don't need approval — print immediately.
  if (form.kind === 'queue') {
    store.setTicketStatus(ticket.id, 'approved');
    enqueueTicketPrint(store.getTicketById(ticket.id));
  }
  redirect(res, `/t/${ticket.token}`);
});

route('GET', /^\/t\/([a-f0-9]+)$/, (req, res, m) => {
  const ticket = store.getTicketByToken(m[1]);
  if (!ticket) return send(res, 404, views.notFoundPage({ businessName: businessName() }));
  const form = store.getFormById(ticket.form_id);
  send(res, 200, views.statusPage({ ticket, form, businessName: businessName() }));
});

route('GET', /^\/api\/t\/([a-f0-9]+)$/, (req, res, m) => {
  const ticket = store.getTicketByToken(m[1]);
  if (!ticket) return sendJson(res, 404, { error: 'not found' });
  sendJson(res, 200, { version: `${ticket.status}:${ticket.updated_at}`, status: ticket.status, number: ticket.number });
});

// ---------- admin ----------

route('GET', /^\/admin\/login$/, (req, res) => {
  send(res, 200, views.loginPage({ businessName: businessName() }));
});

route('POST', /^\/admin\/login$/, async (req, res) => {
  const ip = req.socket.remoteAddress || '?';
  const fail = loginFailures.get(ip);
  if (fail && fail.until > Date.now()) {
    return send(res, 429, views.loginPage({ businessName: businessName(), error: 'Too many attempts. Wait a minute and try again.' }));
  }
  const { pin } = parseForm(await readBody(req));
  if (pin && pin === store.adminPin) {
    loginFailures.delete(ip);
    startSession(res);
    return redirect(res, '/admin');
  }
  const count = (fail?.count || 0) + 1;
  loginFailures.set(ip, { count, until: count >= 5 ? Date.now() + 60_000 : 0 });
  send(res, 401, views.loginPage({ businessName: businessName(), error: 'Wrong PIN.' }));
});

route('GET', /^\/admin$/, (req, res) => {
  if (!requirePin(req, res)) return;
  send(res, 200, views.dashboardPage({
    tickets: store.listTickets(),
    stats: store.todayStats(),
    printQueueDepth: store.listQueuedJobs().length,
    businessName: businessName()
  }));
});

route('GET', /^\/api\/admin\/version$/, (req, res) => {
  if (!isAdmin(req)) return sendJson(res, 401, { error: 'unauthorized' });
  sendJson(res, 200, { version: store.dataVersion() });
});

route('POST', /^\/admin\/tickets\/(\d+)\/status$/, async (req, res, m) => {
  if (!requirePin(req, res)) return;
  const ticket = store.getTicketById(Number(m[1]));
  if (!ticket) return send(res, 404, views.notFoundPage({ businessName: businessName() }));
  const { status } = parseForm(await readBody(req));
  if (!store.TICKET_STATUSES.includes(status)) return send(res, 400, 'bad status');
  store.setTicketStatus(ticket.id, status);
  if (status === 'approved') enqueueTicketPrint(store.getTicketById(ticket.id));
  redirect(res, '/admin');
});

route('GET', /^\/admin\/forms$/, (req, res) => {
  if (!requirePin(req, res)) return;
  send(res, 200, views.formsPage({
    forms: store.listForms(), baseUrl: BASE_URL, businessName: businessName(), printKey: store.printKey
  }));
});

route('POST', /^\/admin\/forms$/, async (req, res) => {
  if (!requirePin(req, res)) return;
  const posted = parseForm(await readBody(req));
  const slug = String(posted.slug || '').toLowerCase();
  if (!/^[a-z0-9-]{1,40}$/.test(slug) || !posted.name) return send(res, 400, 'bad form definition');
  if (store.getFormBySlug(slug)) return send(res, 400, 'slug already exists');
  const kind = store.FORM_KINDS.includes(posted.kind) ? posted.kind : 'order';
  const fields = String(posted.fields || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      const required = line.includes('!');
      const [label, type] = line.replace('!', '').split('|').map((s) => s.trim());
      return {
        key: `q${i + 1}_${label.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 20)}`,
        label: label || `Question ${i + 1}`,
        type: ['text', 'tel', 'textarea'].includes(type) ? type : 'text',
        required
      };
    });
  if (fields.length === 0) fields.push({ key: 'name', label: 'Your name', type: 'text', required: true });
  store.createForm({ slug, name: posted.name.slice(0, 80), kind, fields, footer: (posted.footer || '').slice(0, 200) });
  redirect(res, '/admin/forms');
});

route('POST', /^\/admin\/forms\/(\d+)\/toggle$/, (req, res, m) => {
  if (!requirePin(req, res)) return;
  store.toggleForm(Number(m[1]));
  redirect(res, '/admin/forms');
});

route('GET', /^\/admin\/qr\/([a-z0-9-]+)\.svg$/, async (req, res, m) => {
  if (!isAdmin(req)) return send(res, 401, 'unauthorized', 'text/plain');
  const form = store.getFormBySlug(m[1]);
  if (!form) return send(res, 404, 'not found', 'text/plain');
  const svg = await QRCode.toString(`${BASE_URL}/f/${form.slug}`, { type: 'svg', margin: 1, width: 320 });
  send(res, 200, svg, 'image/svg+xml');
});

route('GET', /^\/admin\/poster\/([a-z0-9-]+)$/, (req, res, m) => {
  if (!requirePin(req, res)) return;
  const form = store.getFormBySlug(m[1]);
  if (!form) return send(res, 404, views.notFoundPage({ businessName: businessName() }));
  send(res, 200, views.posterPage({ form, baseUrl: BASE_URL, businessName: businessName() }));
});

route('GET', /^\/admin\/print\/(\d+)$/, (req, res, m) => {
  if (!requirePin(req, res)) return;
  const ticket = store.getTicketById(Number(m[1]));
  if (!ticket) return send(res, 404, views.notFoundPage({ businessName: businessName() }));
  const form = store.getFormById(ticket.form_id);
  const text = renderTicketText({
    ticket, form, fields: store.parseFields(form), businessName: businessName()
  });
  send(res, 200, views.printPage({ text, ticket, businessName: businessName() }));
});

// ---------- printers ----------

// Star CloudPRNT: the printer polls this URL on its own schedule.
// POST -> "is there a job?", GET ?token= -> job body, DELETE ?token= -> confirm printed.
route('POST', /^\/printer\/cloudprnt$/, async (req, res, m, url) => {
  if (!validPrintKey(url)) return sendJson(res, 401, { error: 'bad key' });
  await readBody(req).catch(() => '');
  const job = store.nextQueuedJob();
  sendJson(res, 200, job
    ? { jobReady: true, jobToken: String(job.id), mediaTypes: ['text/plain'] }
    : { jobReady: false });
});

route('GET', /^\/printer\/cloudprnt$/, (req, res, m, url) => {
  if (!validPrintKey(url)) return sendJson(res, 401, { error: 'bad key' });
  const job = store.getJob(Number(url.searchParams.get('token')));
  if (!job || job.status !== 'queued') return send(res, 404, 'no job', 'text/plain');
  send(res, 200, job.content, 'text/plain; charset=utf-8');
});

route('DELETE', /^\/printer\/cloudprnt$/, (req, res, m, url) => {
  if (!validPrintKey(url)) return sendJson(res, 401, { error: 'bad key' });
  const job = store.getJob(Number(url.searchParams.get('token')));
  if (job && job.status === 'queued') store.markJobPrinted(job.id);
  send(res, 200, 'ok', 'text/plain');
});

// Generic bridge API for a phone/PC helper feeding Bluetooth/USB printers.
route('GET', /^\/api\/print-jobs$/, (req, res, m, url) => {
  if (!validPrintKey(url)) return sendJson(res, 401, { error: 'bad key' });
  sendJson(res, 200, {
    jobs: store.listQueuedJobs().map((j) => ({ id: j.id, content: j.content, created_at: j.created_at }))
  });
});

route('POST', /^\/api\/print-jobs\/(\d+)\/done$/, (req, res, m, url) => {
  if (!validPrintKey(url)) return sendJson(res, 401, { error: 'bad key' });
  const job = store.getJob(Number(m[1]));
  if (!job) return sendJson(res, 404, { error: 'not found' });
  store.markJobPrinted(job.id);
  sendJson(res, 200, { ok: true });
});

// ---------- misc ----------

route('GET', /^\/manifest\.webmanifest$/, (req, res) => {
  sendJson(res, 200, {
    name: businessName(),
    short_name: 'Kabootar',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#f6f4ef',
    theme_color: '#0f766e',
    icons: []
  });
});

route('GET', /^\/healthz$/, (req, res) => sendJson(res, 200, { ok: true }));

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, BASE_URL);
  for (const r of routes) {
    if (r.method !== req.method) continue;
    const m = url.pathname.match(r.pattern);
    if (!m) continue;
    try {
      await r.handler(req, res, m, url);
    } catch (err) {
      console.error(`[error] ${req.method} ${url.pathname}:`, err.message);
      if (!res.headersSent) send(res, 500, 'server error', 'text/plain');
    }
    return;
  }
  send(res, 404, views.notFoundPage({ businessName: businessName() }));
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Kabootar running at ${BASE_URL} (port ${PORT})`);
    if (!process.env.ADMIN_PIN) console.log(`Admin PIN: ${store.adminPin}`);
    console.log(`Print key: ${store.printKey}`);
  });
}

module.exports = { server };
