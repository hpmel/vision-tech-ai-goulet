import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/content.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { copy } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('French and English retain the complete service, process and FAQ content', () => {
  for (const language of ['fr', 'en']) {
    assert.equal(copy[language].services.length, 8);
    assert.equal(copy[language].steps.length, 4);
    assert.equal(copy[language].faqs.length, 5);
    assert.equal(copy[language].nav.length, 4);
    assert.deepEqual(Object.keys(copy[language]).sort(), Object.keys(copy.fr).sort());
    for (const item of [...copy[language].services, ...copy[language].faqs]) {
      assert.ok(item.title.trim().length > 0);
      assert.ok(item.body.trim().length > 20);
    }
  }
});

test('The rebuild does not reintroduce the obsolete automotive export', () => {
  assert.doesNotMatch(source, /mécanicien|pneus|vidange|oil change|mechanic|555-0100/i);
});

test('Contact links preserve the verified business destinations', async () => {
  const config = await readFile(new URL('../src/site.config.ts', import.meta.url), 'utf8');
  assert.ok(config.includes("phoneHref: '+15148384995'"));
  assert.ok(config.includes("email: 'vision.tech.ai7@gmail.com'"));
  assert.ok(config.includes("bookingUrl: 'https://vision-tech-ai.runable.site/#contact'"));
});
