import type { AllGrowthCharts, GrowthDataPoint, PercentileChartData, GrowthChartData } from './types';
import growthData0_2 from '@/components/dashboard/data/tablas_oms/crecimiento_0_2_anos.json';
import headCircData0_3 from '@/components/dashboard/data/tablas_oms/perimetro_cefalico_0_3_anos.json';

// Interpretations for different Z-scores
const weightForAgeInterpretations = { "-3": "Desnutrición Severa", "-2": "Desnutrición", "-1": "Riesgo de Desnutrición", "0": "Normal", "+1": "Normal", "+2": "Riesgo de Sobrepeso", "+3": "Riesgo de Sobrepeso" };
const lengthForAgeInterpretations = {
    "Talla baja severa": (z: number) => z < -3,
    "Talla baja": (z: number) => z >= -3 && z < -2,
    "Talla normal baja": (z: number) => z >= -2 && z < -1,
    "Normal": (z: number) => z >= -1 && z <= 1,
    "Talla normal alta": (z: number) => z > 1 && z <= 2,
    "Talla alta": (z: number) => z > 2,
};
const headCircForAgeInterpretations = { "-3": "Microcefalia Severa", "-2": "Microcefalia", "-1": "Normal", "0": "Normal", "+1": "Normal", "+2": "Macrocefalia", "+3": "Macrocefalia Severa" };
const weightForLengthInterpretations = { "-3": "Desnutrición Severa", "-2": "Desnutrición", "-1": "Riesgo de Desnutrición", "0": "Normal", "+1": "Riesgo de Sobrepeso", "+2": "Sobrepeso", "+3": "Obesidad" };
const bmiForAgeInterpretations = { "-3": "Desnutrición Severa", "-2": "Desnutrición", "-1": "Riesgo de Desnutrición", "0": "Normal", "+1": "Sobrepeso", "+2": "Obesidad", "+3": "Obesidad Severa" };

// Waist circumference percentile interpretations
const waistCircumferenceInterpretations = { "p10": "Bajo", "p25": "Normal Bajo", "p50": "Normal", "p75": "Normal Alto", "p90": "Alto" };

// Source for Waist Circumference: Fernández J. et Al. J. Pediatr 2004: 14439-44
const waistCircumferenceForAgeBoysData: PercentileChartData = {
    "5y": { p10: 49.3, p25: 51.0, p50: 53.6, p75: 57.0, p90: 60.1 },
    "6y": { p10: 50.8, p25: 52.4, p50: 55.0, p75: 58.5, p90: 61.9 },
    "7y": { p10: 52.3, p25: 54.0, p50: 56.7, p75: 60.4, p90: 64.2 },
    "8y": { p10: 54.0, p25: 55.8, p50: 58.8, p75: 62.9, p90: 67.4 },
    "9y": { p10: 55.7, p25: 57.7, p50: 61.0, p75: 65.6, p90: 70.8 },
    "10y": { p10: 57.6, p25: 59.7, p50: 63.3, p75: 68.4, p90: 74.2 },
    "11y": { p10: 59.5, p25: 61.8, p50: 65.7, p75: 71.3, p90: 77.6 },
    "12y": { p10: 61.5, p25: 64.0, p50: 68.2, p75: 74.2, p90: 81.1 },
    "13y": { p10: 63.6, p25: 66.3, p50: 70.8, p75: 77.1, p90: 84.5 },
    "14y": { p10: 65.6, p25: 68.6, p50: 73.4, p75: 79.9, p90: 87.7 },
    "15y": { p10: 67.7, p25: 70.8, p50: 76.0, p75: 82.7, p90: 90.7 },
    "16y": { p10: 69.6, p25: 72.8, p50: 78.3, p75: 85.3, p90: 93.3 },
    "17y": { p10: 71.2, p25: 74.4, p50: 80.3, p75: 87.5, p90: 95.5 },
    "18y": { p10: 72.4, p25: 75.6, p50: 81.6, p75: 89.1, p90: 97.0 },
};

const waistCircumferenceForAgeGirlsData: PercentileChartData = {
    "5y": { p10: 48.5, p25: 50.1, p50: 53.0, p75: 56.7, p90: 61.4 },
    "6y": { p10: 50.1, p25: 51.8, p50: 55.0, p75: 59.1, p90: 64.1 },
    "7y": { p10: 51.6, p25: 53.5, p50: 56.9, p75: 61.5, p90: 67.5 },
    "8y": { p10: 53.2, p25: 55.2, p50: 58.9, p75: 63.9, p90: 70.5 },
    "9y": { p10: 54.8, p25: 56.9, p50: 60.8, p75: 66.3, p90: 73.6 },
    "10y": { p10: 56.3, p25: 58.6, p50: 62.8, p75: 68.7, p90: 76.6 },
    "11y": { p10: 57.9, p25: 60.3, p50: 64.8, p75: 71.1, p90: 79.7 },
    "12y": { p10: 59.5, p25: 62.0, p50: 66.7, p75: 73.5, p90: 82.7 },
    "13y": { p10: 61.0, p25: 63.7, p50: 68.7, p75: 75.9, p90: 85.9 },
    "14y": { p10: 62.6, p25: 65.4, p50: 70.6, p75: 78.3, p90: 88.8 },
    "15y": { p10: 64.2, p25: 67.1, p50: 72.6, p75: 80.7, p90: 91.9 },
    "16y": { p10: 65.7, p25: 68.8, p50: 74.6, p75: 83.1, p90: 94.9 },
    "17y": { p10: 67.3, p25: 70.5, p50: 76.5, p75: 85.5, p90: 98.0 },
    "18y": { p10: 68.9, p25: 72.2, p50: 78.5, p75: 87.9, p90: 101.0 },
};

function transformHeadCircData(rawData: Record<string, { [key: string]: number }>): Record<string, GrowthDataPoint> {
  const transformedData: Record<string, GrowthDataPoint> = {};
  for (const key in rawData) {
    if (Object.prototype.hasOwnProperty.call(rawData, key)) {
      const entry = rawData[key];
      transformedData[key] = {
        sd3neg: entry['SD-3'],
        sd2neg: entry['SD-2'],
        sd1neg: entry['SD-1'],
        sd0: entry['SD0'],
        sd1: entry['SD1'],
        sd2: entry['SD2'],
        sd3: entry['SD3'],
      };
    }
  }
  return transformedData;
}

export const GROWTH_CHART_DATA: AllGrowthCharts = {
  headCircForAgeBoys: {
    interpretations: headCircForAgeInterpretations,
    table: transformHeadCircData(headCircData0_3.tablas.perimetro_cefalico.masculino)
  },
  headCircForAgeGirls: {
    interpretations: headCircForAgeInterpretations,
    table: transformHeadCircData(headCircData0_3.tablas.perimetro_cefalico.femenino)
  },
  waistCircumferenceForAgeBoys: {
    interpretations: waistCircumferenceInterpretations,
    table: waistCircumferenceForAgeBoysData
  },
  waistCircumferenceForAgeGirls: {
    interpretations: waistCircumferenceInterpretations,
    table: waistCircumferenceForAgeGirlsData
  },
};
