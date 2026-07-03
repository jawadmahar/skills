'use strict';

// Plain-text ticket rendering for 80mm thermal paper (42 chars at Font A).
// Plain text is accepted by Star CloudPRNT directly and is trivial for a
// Bluetooth/USB bridge app to convert to ESC/POS raw bytes.

const WIDTH = 42;

function center(text) {
  const t = String(text).slice(0, WIDTH);
  const pad = Math.max(0, Math.floor((WIDTH - t.length) / 2));
  return ' '.repeat(pad) + t;
}

function rule(char = '-') {
  return char.repeat(WIDTH);
}

function wrap(text, indent = 0) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  const max = WIDTH - indent;
  let line = '';
  for (const w of words) {
    if (line && (line + ' ' + w).length > max) {
      lines.push(' '.repeat(indent) + line);
      line = w;
    } else {
      line = line ? line + ' ' + w : w;
    }
  }
  if (line) lines.push(' '.repeat(indent) + line);
  return lines.length ? lines : [''];
}

function renderTicketText({ ticket, form, fields, businessName }) {
  const data = JSON.parse(ticket.data || '{}');
  const when = new Date(ticket.created_at);
  const lines = [];

  lines.push(center(businessName.toUpperCase()));
  lines.push(center(form.name));
  lines.push(rule('='));
  lines.push('');
  lines.push(center(`*** ${form.kind === 'queue' ? 'TOKEN' : 'TICKET'} #${ticket.number} ***`));
  lines.push('');
  lines.push(rule());

  for (const f of fields) {
    const value = data[f.key];
    if (value === undefined || value === '') continue;
    lines.push(`${f.label}:`);
    lines.push(...wrap(value, 2));
  }

  lines.push(rule());
  lines.push(`Time: ${when.toISOString().replace('T', ' ').slice(0, 16)} UTC`);
  lines.push(`Ref:  ${ticket.token}`);
  if (form.footer) {
    lines.push('');
    lines.push(...wrap(form.footer).map(center));
  }
  lines.push('');
  lines.push('');
  lines.push('');

  return lines.join('\n') + '\n';
}

module.exports = { renderTicketText, WIDTH };
