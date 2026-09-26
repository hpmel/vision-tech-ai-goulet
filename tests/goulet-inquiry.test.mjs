import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/services/gouletInquiry.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { createGouletEmail } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const inquiry = { make: 'Toyota', year: '2022', model: 'RAV4', trim: '', service: 'Pneus neufs', name: 'Essai local', phone: '', email: 'test@example.com', size: '', notes: 'Été & hiver ? #besoin' };

test('Goulet inquiry preserves accents and vehicle details in an email draft', () => {
  const url = new URL(createGouletEmail(inquiry));
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'pneusgoulet@hotmail.com');
  assert.equal(url.searchParams.get('subject'), 'Demande : Pneus neufs | Essai local');
  assert.match(url.searchParams.get('body'), /Toyota RAV4 2022/);
  assert.match(url.searchParams.get('body'), /Été & hiver \? #besoin/);
  assert.match(url.searchParams.get('body'), /ne constitue pas une réservation/);
});

test('Goulet inquiry cannot append extra recipients through user-entered fields', () => {
  const url = new URL(createGouletEmail({ ...inquiry, name: 'Test&bcc=other@example.com', notes: '?cc=other@example.com\nMerci' }));
  assert.deepEqual([...url.searchParams.keys()], ['subject', 'body']);
  assert.equal(url.pathname, 'pneusgoulet@hotmail.com');
  assert.match(url.searchParams.get('body'), /Dimension des pneus : À déterminer/);
});
