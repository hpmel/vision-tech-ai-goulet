import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const data = compile(await readFile(new URL('../src/services/vehicleCatalogData.ts', import.meta.url), 'utf8'));
const source = (await readFile(new URL('../src/services/vehicleCatalog.ts', import.meta.url), 'utf8'))
  .replace("'./vehicleCatalogData'", JSON.stringify(moduleUrl(data)));
const catalogue = await import(moduleUrl(compile(source)));

test('Honda 2020 models match the reference and exclude later releases', () => {
  const models = catalogue.getVehicleModels('Honda', 2020);
  assert.deepEqual(models, ['Accord', 'Accord Hybrid', 'Civic', 'Civic Type R', 'Clarity', 'CR-V', 'Fit', 'HR-V', 'Insight', 'Odyssey', 'Passport', 'Pilot', 'Ridgeline']);
  assert.ok(!models.includes('Prologue'));
  assert.ok(catalogue.getVehicleModels('Honda', 2025).includes('Prologue'));
  assert.ok(!catalogue.getVehicleModels('Honda', 2025).includes('Fit'));
});

test('Finitions follow the selected year and combine overlapping catalogue entries without duplicates', () => {
  const trims = catalogue.getVehicleTrims('Honda', 'Civic', 2020);
  assert.ok(trims.includes('LX'));
  assert.ok(trims.includes('Sport'));
  assert.equal(trims.length, new Set(trims).size);
  assert.deepEqual(catalogue.getVehicleTrims('Honda', 'Prologue', 2020), []);
});

test('Unknown vehicles and uncovered years allow manual entry without invented suggestions', () => {
  for (const make of ['Unknown', catalogue.OTHER_VEHICLE, '__proto__']) {
    assert.deepEqual(catalogue.getVehicleModels(make, 2020), []);
    assert.deepEqual(catalogue.getVehicleTrims(make, 'Civic', 2020), []);
  }
  assert.deepEqual(catalogue.getVehicleModels('Honda', 1965), []);
  assert.deepEqual(catalogue.getVehicleModels('Honda', NaN), []);
  assert.deepEqual(catalogue.getVehicleTrims('Honda', 'Civic', 2027), []);
});

// The static export is tested when its separate checkout is available.
const staticSource = await readFile(new URL('../upstream/vision-tech-ai-garageSTR/js/vehicle-catalog.js', import.meta.url), 'utf8').catch(() => null);
test('STR static export has the same models and trims as the Goulet service', { skip: !staticSource }, () => {
  const context = vm.createContext({});
  vm.runInContext(staticSource, context);
  for (const make of catalogue.vehicleMakes) {
    for (const year of [1965, 1995, 2020, 2025, 2027]) {
      const models = catalogue.getVehicleModels(make, year);
      const staticModels = vm.runInContext(`VehicleCatalog.getVehicleModels(${JSON.stringify(make)}, ${year})`, context);
      assert.deepEqual(Array.from(staticModels), models);
      for (const model of models) {
        const staticTrims = vm.runInContext(`VehicleCatalog.getVehicleTrims(${JSON.stringify(make)}, ${JSON.stringify(model)}, ${year})`, context);
        assert.deepEqual(Array.from(staticTrims), catalogue.getVehicleTrims(make, model, year));
      }
    }
  }
});
