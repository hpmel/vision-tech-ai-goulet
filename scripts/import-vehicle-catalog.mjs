import { readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';

// Import the existing reference site's catalogue without executing its app.
const reference = new URL('../upstream/vision-tech-ai/packages/web/src/web/', import.meta.url);
const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const asModule = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
try {
  const extra = await import(asModule(compile(await readFile(new URL('vehicleDataExtra.ts', reference), 'utf8'))));
  const source = (await readFile(new URL('vehicleData.ts', reference), 'utf8'))
    .replace('import { EXTRA_TRIMS } from "./vehicleDataExtra";', `const EXTRA_TRIMS = ${JSON.stringify(extra.EXTRA_TRIMS)};`);
  const data = await import(asModule(compile(source)));
  const catalogue = { makes: data.COMMON_MAKES, vehicles: data.TRIM_DB };
  await writeFile(new URL('../src/services/vehicleCatalogData.ts', import.meta.url),
    `// Imported from the garage reference. Regenerate with scripts/import-vehicle-catalog.mjs.\nimport type { VehicleCatalog } from './vehicleCatalogTypes';\n\nexport const vehicleCatalogData: VehicleCatalog = ${JSON.stringify(catalogue, null, 2)};\n`);
  console.log(`Imported ${catalogue.makes.length} makes.`);
} catch (error) {
  console.error('Vehicle catalogue import failed.', error);
  process.exitCode = 1;
}
