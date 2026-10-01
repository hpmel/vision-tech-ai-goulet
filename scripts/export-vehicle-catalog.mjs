import { readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';

// The static STR site uses the same service as the React Goulet site.
try {
  const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  const data = compile(await readFile(new URL('../src/services/vehicleCatalogData.ts', import.meta.url), 'utf8'));
  const service = (await readFile(new URL('../src/services/vehicleCatalog.ts', import.meta.url), 'utf8'))
    .replace("import { vehicleCatalogData } from './vehicleCatalogData';", '');
  const body = `${data}\n${compile(service)}`.replace(/^export /gm, '');
  const destination = new URL('../upstream/vision-tech-ai-garageSTR/js/vehicle-catalog.js', import.meta.url);
  await writeFile(destination, `// Generated from the common vehicle service. Run scripts/export-vehicle-catalog.mjs to update.\nconst VehicleCatalog = (() => {\n${body}\nreturn { OTHER_VEHICLE, vehicleMakes, vehicleYears, getVehicleModels, getVehicleTrims };\n})();\n`);
  console.log('STR vehicle catalogue exported.');
} catch (error) {
  console.error('Vehicle catalogue export failed.', error);
  process.exitCode = 1;
}
