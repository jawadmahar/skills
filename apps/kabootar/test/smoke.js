'use strict';

// End-to-end smoke test: customer submits -> staff approves -> printer polls,
// fetches, and confirms the job. Runs against a throwaway DB.

const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kabootar-test-'));
process.env.KABOOTAR_DB = path.join(tmp, 'test.db');
process.env.ADMIN_PIN = '424242';
process.env.PORT = '0';

const { server } = require('../server');
const store = require('../lib/db');

function req(base, method, pathname, { body, headers = {}, cookie } = {}) {
  const h = { ...headers };
  if (cookie) h.cookie = cookie;
  if (body) h['content-type'] = 'application/x-www-form-urlencoded';
  return fetch(base + pathname, { method, headers: h, body, redirect: 'manual' });
}

async function main() {
  await new Promise((r) => server.listen(0, r));
  const base = `http://localhost:${server.address().port}`;

  // health + customer form renders
  assert.strictEqual((await fetch(`${base}/healthz`)).status, 200);
  const formPage = await fetch(`${base}/f/order`);
  assert.strictEqual(formPage.status, 200);
  assert.match(await formPage.text(), /Place an Order/);

  // missing required field is rejected
  const bad = await req(base, 'POST', '/f/order', { body: 'name=Jawad' });
  assert.strictEqual(bad.status, 400);

  // valid submission -> redirect to status page, ticket pending
  const submit = await req(base, 'POST', '/f/order', {
    body: new URLSearchParams({ name: 'Jawad', phone: '07000000000', items: '2x chicken karahi, 3x naan' }).toString()
  });
  assert.strictEqual(submit.status, 303);
  const token = submit.headers.get('location').split('/t/')[1];
  const statusJson = await (await fetch(`${base}/api/t/${token}`)).json();
  assert.strictEqual(statusJson.status, 'pending');
  assert.strictEqual(statusJson.number, 1);

  // admin requires login; wrong PIN rejected; right PIN sets session
  assert.strictEqual((await req(base, 'GET', '/admin')).status, 303);
  assert.strictEqual((await req(base, 'POST', '/admin/login', { body: 'pin=000000' })).status, 401);
  const login = await req(base, 'POST', '/admin/login', { body: 'pin=424242' });
  assert.strictEqual(login.status, 303);
  const cookie = login.headers.get('set-cookie').split(';')[0];

  const dash = await req(base, 'GET', '/admin', { cookie });
  assert.match(await dash.text(), /2x chicken karahi/);

  // approve -> print job queued, customer sees approved
  const ticket = store.getTicketByToken(token);
  const approve = await req(base, 'POST', `/admin/tickets/${ticket.id}/status`, { body: 'status=approved', cookie });
  assert.strictEqual(approve.status, 303);
  assert.strictEqual((await (await fetch(`${base}/api/t/${token}`)).json()).status, 'approved');

  // printer flow: bad key rejected; CloudPRNT poll -> fetch -> confirm
  const key = store.printKey;
  assert.strictEqual((await req(base, 'POST', '/printer/cloudprnt?key=wrong')).status, 401);
  const poll = await (await req(base, 'POST', `/printer/cloudprnt?key=${key}`)).json();
  assert.strictEqual(poll.jobReady, true);
  const job = await req(base, 'GET', `/printer/cloudprnt?key=${key}&token=${poll.jobToken}`);
  const jobText = await job.text();
  assert.match(jobText, /TICKET #1/);
  assert.match(jobText, /chicken karahi/);
  await req(base, 'DELETE', `/printer/cloudprnt?key=${key}&token=${poll.jobToken}`);
  const poll2 = await (await req(base, 'POST', `/printer/cloudprnt?key=${key}`)).json();
  assert.strictEqual(poll2.jobReady, false);

  // queue form auto-approves and auto-prints
  const q = await req(base, 'POST', '/f/queue', { body: 'name=Walk-in' });
  assert.strictEqual(q.status, 303);
  const bridge = await (await req(base, 'GET', `/api/print-jobs?key=${key}`)).json();
  assert.strictEqual(bridge.jobs.length, 1);
  assert.match(bridge.jobs[0].content, /TOKEN #1/);
  const done = await req(base, 'POST', `/api/print-jobs/${bridge.jobs[0].id}/done?key=${key}`);
  assert.strictEqual((await done.json()).ok, true);

  // QR + poster render for admins only
  assert.strictEqual((await req(base, 'GET', '/admin/qr/order.svg')).status, 401);
  const qr = await req(base, 'GET', '/admin/qr/order.svg', { cookie });
  assert.strictEqual(qr.status, 200);
  assert.match(await qr.text(), /<svg/);

  // create a custom form and submit to it
  const create = await req(base, 'POST', '/admin/forms', {
    cookie,
    body: new URLSearchParams({
      name: 'Lunch Orders', slug: 'lunch', kind: 'order',
      fields: 'Your name | text !\nSandwich | text !', footer: 'Cheers!'
    }).toString()
  });
  assert.strictEqual(create.status, 303);
  const lunchPage = await fetch(`${base}/f/lunch`);
  assert.match(await lunchPage.text(), /Sandwich/);

  server.close();
  console.log('smoke: all assertions passed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
