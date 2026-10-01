import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const modules = new Map();
const loadService = async (name) => {
  if (modules.has(name)) return modules.get(name);
  let source = await readFile(new URL(`../src/services/${name}.ts`, import.meta.url), 'utf8');
  if (name === 'demoEmailDelivery') {
    source = source.replace("'./demoEmailTemplates.js'", JSON.stringify(await loadService('demoEmailTemplates')))
      .replace("'nodemailer'", JSON.stringify(pathToFileURL(require.resolve('nodemailer')).href));
  }
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
  modules.set(name, url);
  return url;
};
const { buildDemoEmails } = await import(await loadService('demoEmailTemplates'));
const { validateDemoInquiry } = await import(await loadService('demoInquiryValidation'));
const { deliverDemoEmails, allowedDemoOrigin } = await import(await loadService('demoEmailDelivery'));
const inquiry = { requestId: randomUUID(), name: 'Essai local', email: 'demo@example.com', phone: '5145550100', make: 'Honda', year: '2020', model: 'Civic', trim: 'LX', service: 'Pneus neufs', size: '205/55 R16', notes: 'Été & hiver', date: '2026-10-02', time: '08:00' };

test('Each demo sends both messages exclusively to the visitor, including the owner-labelled copy', () => {
  for (const garage of ['str', 'goulet']) {
    const emails = buildDemoEmails(inquiry, garage, 'DEMO-TEST');
    assert.equal(emails.length, 2);
    for (const email of emails) {
      assert.deepEqual(email.to, { name: inquiry.name, address: inquiry.email });
      assert.equal(email.cc, undefined);
      assert.equal(email.bcc, undefined);
      assert.match(email.text, /aucune réservation réelle/i);
      assert.match(email.text, /2020 Honda Civic LX/);
      assert.match(email.html, /DÉMONSTRATION|DÉMO/);
    }
    assert.match(emails[0].subject, /Confirmation/);
    assert.match(emails[1].subject, /COPIE PROPRIÉTAIRE/);
  }
});

test('Validation rejects additional-recipient syntax, invalid dates and honeypot submissions', () => {
  for (const email of ['first@example.com,other@example.com', 'first@example.com\r\nBcc:other@example.com', 'First <first@example.com>']) {
    assert.throws(() => validateDemoInquiry({ ...inquiry, email }, 'goulet'));
  }
  assert.throws(() => validateDemoInquiry({ ...inquiry, date: '2026-02-31' }, 'str'));
  assert.throws(() => validateDemoInquiry({ ...inquiry, website: 'spam' }, 'str'));
  assert.throws(() => validateDemoInquiry({ ...inquiry, notes: 'x'.repeat(1501) }, 'goulet'));
  assert.deepEqual(validateDemoInquiry({ ...inquiry, to: 'owner@example.com', cc: 'owner@example.com' }, 'str'), inquiry);
});

test('User text is escaped in HTML email bodies', () => {
  const messages = buildDemoEmails({ ...inquiry, name: '<img src=x onerror=alert(1)>', notes: '<script>bad()</script> & hiver' }, 'goulet', 'DEMO-TEST');
  assert.ok(messages.every(message => !message.html.includes('<script>') && !message.html.includes('<img src=x')));
  assert.match(messages[0].html, /&lt;script&gt;/);
});

test('Success requires two accepted messages and repeated identical submissions do not resend', async () => {
  const input = { ...inquiry, requestId: randomUUID(), email: 'success@example.com' };
  const sent = [];
  const send = async message => { sent.push(message); };
  const result = await deliverDemoEmails(input, 'str', 'test-success', send);
  assert.equal(result.success, true);
  assert.equal(result.confirmationSent, true);
  assert.equal(result.ownerCopySent, true);
  await deliverDemoEmails(input, 'str', 'test-success', send);
  assert.equal(sent.length, 2);
  await assert.rejects(deliverDemoEmails({ ...input, notes: 'Changed' }, 'str', 'test-success', send));
});

test('A partial failure is reported and retry sends only the missing message', async () => {
  const input = { ...inquiry, requestId: randomUUID(), email: 'partial@example.com' };
  const sent = [];
  let failCopy = true;
  const send = async message => {
    if (failCopy && message.subject.includes('COPIE PROPRIÉTAIRE')) throw new Error('Simulated SMTP failure');
    sent.push(message);
  };
  const result = await deliverDemoEmails(input, 'goulet', 'test-partial', send);
  assert.equal(result.success, false);
  assert.equal(result.confirmationSent, true);
  assert.equal(result.ownerCopySent, false);
  failCopy = false;
  const retry = await deliverDemoEmails(input, 'goulet', 'test-partial', send);
  assert.equal(retry.success, true);
  assert.equal(sent.length, 2);
});

test('Different visitor submissions are limited per mailbox and origin is garage-specific', async () => {
  const input = { ...inquiry, email: 'limit@example.com' };
  const send = async () => {};
  for (let attempt = 0; attempt < 3; attempt++) await deliverDemoEmails({ ...input, requestId: randomUUID() }, 'str', 'test-limit', send);
  await assert.rejects(deliverDemoEmails({ ...input, requestId: randomUUID() }, 'str', 'test-limit', send));
  assert.equal(allowedDemoOrigin('https://garagestr.vision-tech-ai.com', 'str'), true);
  assert.equal(allowedDemoOrigin('https://goulet.vision-tech-ai.com', 'str'), false);
  assert.equal(allowedDemoOrigin('https://unrelated.example', 'goulet'), false);
});
