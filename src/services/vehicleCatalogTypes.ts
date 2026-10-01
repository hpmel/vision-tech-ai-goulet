export interface VehicleGeneration {
  years: [number, number];
  trims: string[];
}

export interface VehicleCatalog {
  makes: string[];
  vehicles: Record<string, Record<string, VehicleGeneration[]>>;
}
