'use strict';

const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');
const path = require('node:path');

const DB_PATH = process.env.KABOOTAR_DB || path.join(__dirname, '..', 'kabootar.db');

const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS forms (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    slug       TEXT NOT NULL UNIQUE,
    name       TEXT NOT NULL,
    kind       TEXT NOT NULL DEFAULT 'order',
    fields     TEXT NOT NULL DEFAULT '[]',
    active     INTEGER NOT NULL DEFAULT 1,
    footer     TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id    INTEGER NOT NULL REFERENCES forms(id),
    token      TEXT NOT NULL UNIQUE,
    number     INTEGER NOT NULL,
    data       TEXT NOT NULL DEFAULT '{}',
    status     TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );

  CREATE TABLE IF NOT EXISTS print_jobs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id  INTEGER NOT NULL REFERENCES tickets(id),
    content    TEXT NOT NULL,
    status     TEXT NOT NULL DEFAULT 'queued',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    printed_at TEXT
  );
`);

function getSetting(key) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return row ? row.value : null;
}

function setSetting(key, value) {
  db.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  ).run(key, String(value));
}

function ensureSetting(key, makeDefault) {
  let v = getSetting(key);
  if (v === null) {
    v = makeDefault();
    setSetting(key, v);
  }
  return v;
}

// First-run secrets. ADMIN_PIN env always wins so a forgotten PIN is recoverable.
const adminPin = process.env.ADMIN_PIN
  ? String(process.env.ADMIN_PIN)
  : ensureSetting('admin_pin', () => String(crypto.randomInt(100000, 1000000)));
const printKey = ensureSetting('print_key', () => crypto.randomBytes(16).toString('hex'));
ensureSetting('business_name', () => process.env.BUSINESS_NAME || 'My Shop');

const FORM_KINDS = ['order', 'queue', 'booking'];

function seedDemoForms() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM forms').get().n;
  if (count > 0) return;
  const insert = db.prepare(
    'INSERT INTO forms (slug, name, kind, fields, footer) VALUES (?, ?, ?, ?, ?)'
  );
  insert.run('order', 'Place an Order', 'order', JSON.stringify([
    { key: 'name', label: 'Your name', type: 'text', required: true },
    { key: 'phone', label: 'Phone number', type: 'tel', required: true },
    { key: 'items', label: 'What would you like?', type: 'textarea', required: true },
    { key: 'notes', label: 'Notes (allergies, preferences)', type: 'textarea', required: false }
  ]), 'Thank you! We will call you when it is ready.');
  insert.run('queue', 'Join the Queue', 'queue', JSON.stringify([
    { key: 'name', label: 'Your name', type: 'text', required: true },
    { key: 'party', label: 'Number of people', type: 'text', required: false }
  ]), 'Please keep this ticket. Watch the screen for your number.');
  insert.run('booking', 'Book an Appointment', 'booking', JSON.stringify([
    { key: 'name', label: 'Your name', type: 'text', required: true },
    { key: 'phone', label: 'Phone number', type: 'tel', required: true },
    { key: 'service', label: 'Service needed', type: 'text', required: true },
    { key: 'when', label: 'Preferred date & time', type: 'text', required: true }
  ]), 'We will confirm your booking shortly.');
}
seedDemoForms();

function parseFields(form) {
  try {
    const f = JSON.parse(form.fields);
    return Array.isArray(f) ? f : [];
  } catch {
    return [];
  }
}

function listForms() {
  return db.prepare('SELECT * FROM forms ORDER BY id').all();
}

function getFormBySlug(slug) {
  return db.prepare('SELECT * FROM forms WHERE slug = ?').get(slug);
}

function getFormById(id) {
  return db.prepare('SELECT * FROM forms WHERE id = ?').get(id);
}

function createForm({ slug, name, kind, fields, footer }) {
  return db.prepare(
    'INSERT INTO forms (slug, name, kind, fields, footer) VALUES (?, ?, ?, ?, ?)'
  ).run(slug, name, kind, JSON.stringify(fields), footer || '');
}

function toggleForm(id) {
  db.prepare('UPDATE forms SET active = 1 - active WHERE id = ?').run(id);
}

function todayStartIso() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString();
}

function createTicket(form, data) {
  const number = db.prepare(
    'SELECT COUNT(*) + 1 AS n FROM tickets WHERE form_id = ? AND created_at >= ?'
  ).get(form.id, todayStartIso()).n;
  const token = crypto.randomBytes(8).toString('hex');
  const info = db.prepare(
    'INSERT INTO tickets (form_id, token, number, data) VALUES (?, ?, ?, ?)'
  ).run(form.id, token, number, JSON.stringify(data));
  return getTicketById(info.lastInsertRowid);
}

function getTicketById(id) {
  return db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
}

function getTicketByToken(token) {
  return db.prepare('SELECT * FROM tickets WHERE token = ?').get(token);
}

const TICKET_STATUSES = ['pending', 'approved', 'ready', 'rejected', 'done'];

function setTicketStatus(id, status) {
  if (!TICKET_STATUSES.includes(status)) throw new Error('bad status');
  db.prepare(
    "UPDATE tickets SET status = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?"
  ).run(status, id);
}

function listTickets({ since } = {}) {
  if (since) {
    return db.prepare(
      'SELECT t.*, f.name AS form_name, f.kind AS form_kind FROM tickets t JOIN forms f ON f.id = t.form_id WHERE t.created_at >= ? ORDER BY t.id DESC'
    ).all(since);
  }
  return db.prepare(
    'SELECT t.*, f.name AS form_name, f.kind AS form_kind FROM tickets t JOIN forms f ON f.id = t.form_id ORDER BY t.id DESC LIMIT 200'
  ).all();
}

function dataVersion() {
  const row = db.prepare(
    'SELECT COUNT(*) AS n, COALESCE(MAX(updated_at), "") AS m FROM tickets'
  ).get();
  return `${row.n}:${row.m}`;
}

function enqueuePrint(ticketId, content) {
  return db.prepare(
    'INSERT INTO print_jobs (ticket_id, content) VALUES (?, ?)'
  ).run(ticketId, content).lastInsertRowid;
}

function nextQueuedJob() {
  return db.prepare(
    "SELECT * FROM print_jobs WHERE status = 'queued' ORDER BY id LIMIT 1"
  ).get();
}

function getJob(id) {
  return db.prepare('SELECT * FROM print_jobs WHERE id = ?').get(id);
}

function listQueuedJobs() {
  return db.prepare("SELECT * FROM print_jobs WHERE status = 'queued' ORDER BY id").all();
}

function markJobPrinted(id) {
  db.prepare(
    "UPDATE print_jobs SET status = 'printed', printed_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?"
  ).run(id);
}

function todayStats() {
  const since = todayStartIso();
  const rows = db.prepare(
    'SELECT status, COUNT(*) AS n FROM tickets WHERE created_at >= ? GROUP BY status'
  ).all(since);
  const stats = { total: 0 };
  for (const r of rows) {
    stats[r.status] = r.n;
    stats.total += r.n;
  }
  return stats;
}

module.exports = {
  db,
  adminPin,
  printKey,
  getSetting,
  setSetting,
  FORM_KINDS,
  TICKET_STATUSES,
  parseFields,
  listForms,
  getFormBySlug,
  getFormById,
  createForm,
  toggleForm,
  createTicket,
  getTicketById,
  getTicketByToken,
  setTicketStatus,
  listTickets,
  dataVersion,
  enqueuePrint,
  nextQueuedJob,
  getJob,
  listQueuedJobs,
  markJobPrinted,
  todayStats,
  todayStartIso
};
