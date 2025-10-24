// src/lib/nutritional-status-data.ts

/**
 * Fuente: Tabla 14. Criterios para la calificación del estado nutricional desde el
 * mes de vida hasta los 19 años. Norma Técnica para la supervisión de niños y niñas de 0 a 9 años en la APS, MINSAL 2014.
 * Y Norma de evaluación nutricional de niños, niñas y adolescentes de 5 a 19 años, MINSAL 2016.
 */

export interface NutritionalStatusRule {
  classification: string;
  indicator: 'P/E' | 'P/T' | 'IMC/E';
  condition: (z: number) => boolean;
}

export const nutritionalStatusCriteria = {
  under1Year: [
    { classification: 'Desnutrición', indicator: 'P/E', condition: (z: number) => z <= -2 },
    { classification: 'Riesgo de desnutrir', indicator: 'P/E', condition: (z: number) => z <= -1 && z > -2 },
    { classification: 'Normal o eutrófico', indicator: 'P/E', condition: (z: number) => z > -1 && z < 1 },
    // Para sobrepeso y obesidad, P/T prima si es >= +1DE
    { classification: 'Sobrepeso', indicator: 'P/T', condition: (z: number) => z >= 1 && z < 2 },
    { classification: 'Obesidad', indicator: 'P/T', condition: (z: number) => z >= 2 },
  ],
  between1And5Years: [
    { classification: 'Desnutrición', indicator: 'P/T', condition: (z: number) => z <= -2 },
    { classification: 'Riesgo de desnutrir', indicator: 'P/T', condition: (z: number) => z <= -1 && z > -2 },
    { classification: 'Normal o eutrófico', indicator: 'P/T', condition: (z: number) => z > -1 && z < 1 },
    { classification: 'Sobrepeso', indicator: 'P/T', condition: (z: number) => z >= 1 && z < 2 },
    { classification: 'Obesidad', indicator: 'P/T', condition: (z: number) => z >= 2 },
  ],
  from5To19Years: [
    { classification: 'Desnutrición', indicator: 'IMC/E', condition: (z: number) => z <= -2 },
    { classification: 'Riesgo de desnutrir', indicator: 'IMC/E', condition: (z: number) => z <= -1 && z > -2 },
    { classification: 'Normal o eutrófico', indicator: 'IMC/E', condition: (z: number) => z > -1 && z < 1 },
    { classification: 'Sobrepeso', indicator: 'IMC/E', condition: (z: number) => z >= 1 && z < 2 },
    { classification: 'Obesidad', indicator: 'IMC/E', condition: (z: number) => z >= 2 && z < 3 },
    { classification: 'Obesidad severa', indicator: 'IMC/E', condition: (z: number) => z >= 3 },
  ],
};

/**
 * Nota especial para menores de 1 año:
 * "En los niños menores de 1 año el indicador P/E es el que determina la calificación nutricional,
 * salvo que el indicador P/T sea ≥ +1DE, situación en la cual prima el indicador P/T."
 * 
 * Esta lógica debe ser implementada donde se use esta data.
 * 1. Evaluar P/T. Si es >= +1, usar la clasificación de P/T.
 * 2. Si P/T es < +1, usar la clasificación de P/E.
 */
