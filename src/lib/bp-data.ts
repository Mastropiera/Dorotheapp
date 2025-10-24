// src/lib/bp-data.ts

export interface BpPercentiles {
  p50: number;
  p90: number;
  p95: number;
}

export interface BpDataPoint {
  systolic: BpPercentiles;
  diastolic: BpPercentiles;
}

// Data from provided image: TABLA 13: PRESIÓN ARTERIAL EN LACTANTES MENORES DE 1 AÑO DE SEXO BIOLOGICO MASCULINO.
export const bpInfantsMaleData: Record<number, BpDataPoint> = {
  0: { systolic: { p50: 72, p90: 87, p95: 91 }, diastolic: { p50: 55, p90: 68, p95: 72 } },
  1: { systolic: { p50: 86, p90: 101, p95: 105 }, diastolic: { p50: 52, p90: 64, p95: 69 } },
  2: { systolic: { p50: 91, p90: 105, p95: 110 }, diastolic: { p50: 50, p90: 63, p95: 66 } },
  3: { systolic: { p50: 91, p90: 106, p95: 110 }, diastolic: { p50: 49, p90: 63, p95: 65 } },
  4: { systolic: { p50: 91, p90: 106, p95: 110 }, diastolic: { p50: 50, p90: 64, p95: 66 } },
  5: { systolic: { p50: 91, p90: 105, p95: 110 }, diastolic: { p50: 51, p90: 65, p95: 68 } },
  6: { systolic: { p50: 91, p90: 105, p95: 110 }, diastolic: { p50: 53, p90: 66, p95: 70 } },
  7: { systolic: { p50: 91, p90: 105, p95: 110 }, diastolic: { p50: 54, p90: 67, p95: 71 } },
  8: { systolic: { p50: 91, p90: 105, p95: 110 }, diastolic: { p50: 55, p90: 68, p95: 72 } },
  9: { systolic: { p50: 91, p90: 105, p95: 110 }, diastolic: { p50: 56, p90: 68, p95: 72 } },
  10: { systolic: { p50: 91, p90: 105, p95: 110 }, diastolic: { p50: 56, p90: 69, p95: 73 } },
  11: { systolic: { p50: 91, p90: 105, p95: 110 }, diastolic: { p50: 56, p90: 69, p95: 73 } },
};

// Data from provided image: TABLA 14: PRESIÓN ARTERIAL EN LACTANTES MENORES DE 1 AÑO DE SEXO BIOLOGICO FEMENINO.
export const bpInfantsFemaleData: Record<number, BpDataPoint> = {
    0: { systolic: { p50: 66, p90: 80, p95: 84 }, diastolic: { p50: 55, p90: 68, p95: 72 } },
    1: { systolic: { p50: 84, p90: 98, p95: 101 }, diastolic: { p50: 52, p90: 65, p95: 69 } },
    2: { systolic: { p50: 86, p90: 101, p95: 105 }, diastolic: { p50: 51, p90: 64, p95: 68 } },
    3: { systolic: { p50: 88, p90: 104, p95: 107 }, diastolic: { p50: 52, p90: 65, p95: 68 } },
    4: { systolic: { p50: 90, p90: 105, p95: 109 }, diastolic: { p50: 52, p90: 65, p95: 69 } },
    5: { systolic: { p50: 91, p90: 105, p95: 110 }, diastolic: { p50: 53, p90: 65, p95: 69 } },
    6: { systolic: { p50: 91, p90: 105, p95: 110 }, diastolic: { p50: 53, p90: 66, p95: 70 } },
    7: { systolic: { p50: 91, p90: 105, p95: 110 }, diastolic: { p50: 54, p90: 66, p95: 70 } },
    8: { systolic: { p50: 91, p90: 105, p95: 110 }, diastolic: { p50: 54, p90: 66, p95: 70 } },
    9: { systolic: { p50: 91, p90: 104, p95: 110 }, diastolic: { p50: 54, p90: 67, p95: 70 } },
    10: { systolic: { p50: 91, p90: 105, p95: 110 }, diastolic: { p50: 54, p90: 67, p95: 71 } },
    11: { systolic: { p50: 91, p90: 105, p95: 110 }, diastolic: { p50: 55, p90: 67, p95: 71 } },
};

// TODO: Add bpChildrenData (1-12 years) for male and female when available.
