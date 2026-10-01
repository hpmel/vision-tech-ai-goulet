import { vehicleCatalogData } from './vehicleCatalogData';
import type { VehicleGeneration } from './vehicleCatalogTypes';

export const OTHER_VEHICLE: string = '__other__';
export const vehicleMakes: string[] = vehicleCatalogData.makes;
export const vehicleYears: number[] = Array.from(
  { length: new Date().getFullYear() + 2 - 1965 },
  (_: unknown, index: number): number => new Date().getFullYear() + 1 - index,
);

const matchesYear = (generation: VehicleGeneration, year: number): boolean =>
  year >= generation.years[0] && year <= generation.years[1];

export const getVehicleModels = (make: string, year: number): string[] => {
  if (!Number.isInteger(year) || !vehicleMakes.includes(make)) return [];
  const models: Record<string, VehicleGeneration[]> = vehicleCatalogData.vehicles[make] ?? {};
  return Object.keys(models)
    .filter((model: string): boolean => models[model].some((entry: VehicleGeneration): boolean => matchesYear(entry, year)))
    .sort((first: string, second: string): number => first.localeCompare(second, 'fr-CA'));
};

export const getVehicleTrims = (make: string, model: string, year: number): string[] => {
  if (!Number.isInteger(year) || !vehicleMakes.includes(make)) return [];
  const entries: VehicleGeneration[] = vehicleCatalogData.vehicles[make]?.[model] ?? [];
  return [...new Set(entries
    .filter((entry: VehicleGeneration): boolean => matchesYear(entry, year))
    .flatMap((entry: VehicleGeneration): string[] => entry.trims))];
};
