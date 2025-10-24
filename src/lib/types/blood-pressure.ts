// ------------------------------
// Pediatric Blood Pressure
// ------------------------------

export interface BpPercentiles {
    p50: number;
    p90: number;
    p95: number;
  }
  
  export interface BpDataPoint {
    systolic: BpPercentiles;
    diastolic: BpPercentiles;
  }
  
  // [edad][talla] → valores de presión
  export type BpData = Record<string, Record<string, BpDataPoint>>;
  
  export interface NutritionalStatusRule {
    classification: string;
    indicator: 'P/E' | 'P/T' | 'IMC/E';
    condition: (z: number) => boolean;
  }
  