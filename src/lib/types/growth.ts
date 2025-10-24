// ------------------------------
// Growth Charts & Percentiles
// ------------------------------

export interface GrowthDataPoint {
    sd2neg: number;
    sd1neg: number;
    sd0: number;
    sd1: number;
    sd2: number;
    sd3neg?: number; // Opcional
    sd3?: number;    // Opcional
  }
  
  export interface GrowthChartData {
    table: Record<string, GrowthDataPoint>; // clave = edad en meses o talla en cm
    interpretations: Record<string, string | ((z: number) => boolean)>;
  }
  
  export interface ZScoreInterpretation {
    diagnosis: string;
    zScore?: string;
    percentile?: number;
  }
  
  export interface PercentileDataPoint {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  }
  
  export type PercentileChartData = Record<string, PercentileDataPoint>; // clave = edad en años, ej. "5y"
  
  export interface PatientData {
    name: string;
    gender: 'boys' | 'girls';
    chronologicalAge: string;
    correctedAge: string | null;
    ageInMonths: number;
    correctedAgeInMonths: number | null;
    ageInYears: number;
    evaluationAge: string;
    evaluationAgeInMonths: number;
  }
  
  export interface AllGrowthCharts {
    headCircForAgeBoys: GrowthChartData;
    headCircForAgeGirls: GrowthChartData;
    waistCircumferenceForAgeBoys: {
      interpretations: Record<string, string>;
      table: PercentileChartData;
    };
    waistCircumferenceForAgeGirls: {
      interpretations: Record<string, string>;
      table: PercentileChartData;
    };
  }
  