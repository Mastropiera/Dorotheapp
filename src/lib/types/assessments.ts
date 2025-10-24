// ------------------------------
// DSM-V Breve
// ------------------------------

export interface DSMBreveItem {
    id: string;
    category: string;
    question: string;
  }
  
  export interface DSMBreveResponse {
    itemId: string;
    response: number; // 0–4
  }
  
  export interface DSMBreveResult {
    totalScore: number;
    categories: Record<string, number>;
  }
  
  // ------------------------------
  // EEDP (Escala de Evaluación del Desarrollo Psicomotor)
  // ------------------------------
  
  export interface EEDPItem {
    id: string;
    itemNumber: number;
    area: 'M' | 'L' | 'S' | 'C'; // ✅ Cambiado a las abreviaturas que usa el archivo de datos
    text: string;
    instructions?: string;
    ageInMonths?: number; // ✅ Hecho opcional
    materialNeeded?: string;
    description?: string; // ✅ Agregado opcional
  }

  
  export interface EEDPResponse {
    itemId: string;
    passed: boolean;
  }
  
  export interface EEDPResult {
    rawScores: Record<'Lenguaje' | 'Coordinación' | 'Motricidad' | 'Social', number>;
    totalScore: number;
    developmentalQuotient: number;
  }
  
  // ------------------------------
  // TEPSI (Test de Desarrollo Psicomotor)
  // ------------------------------
  
  export interface TEPSIItem {
    id: string;
    itemNumber: number;
    text: string;
    instructions?: string;
    area?: string; // ✅ Agregar opcional
  }
  
  export interface TEPSIResponse {
    itemId: string;
    passed: boolean;
  }
  
  export interface TEPSIResult {
    rawScores: Record<'Lenguaje' | 'Motricidad' | 'Coordinación', number>;
    totalScore: number;
    percentile: number;
  }
  
  // ------------------------------
  // Baremos / Tablas normativas
  // ------------------------------
  
  export interface NormativeTableEntry {
    age: string;     // "3 años", "4 años"
    area: string;    // "Lenguaje", "Motricidad"
    mean: number;
    sd: number;
    cutoff: number;
  }
  
  export interface NormativeTable {
    test: 'EEDP' | 'TEPSI';
    entries: NormativeTableEntry[];
  }
  // Al final de src/lib/types/assessments.ts, agrega:

// ------------------------------
// EEDP - Tipos adicionales
// ------------------------------

export type EEDPAgeKey = 
| '1mes' | '2meses' | '3meses' | '4meses' | '5meses' | '6meses'
| '7meses' | '8meses' | '9meses' | '10meses' | '11meses' | '12meses'
| '15meses' | '18meses' | '21meses' | '24meses';

export interface EEDPData {
[key: string]: EEDPItem[];
}

export interface EEDPProfileRequirement {
minPassed: number;
maxFailed: number;
}

// ------------------------------
// TEPSI - Tipos adicionales
// ------------------------------

export type TEPSIAgeCategory = '2a0m-2a5m' | '2a6m-2a11m' | '3a0m-3a5m' | '3a6m-3a11m' | '4a0m-4a5m' | '4a6m-4a11m';

export type TEPSISubtest = 'coordinacion' | 'lenguaje' | 'motricidad';

// EEDP - Tipos de perfil
export type EEDPProfileData = {
  [key: string]: {
    M?: number[][];
    L?: number[][];
    S?: number[][];
    C?: number[][];
  };
};

// EEDP - Baremos

export interface EEDPBaremosData {
  [key: string]: Array<{
    cd: number;
    score: number;
  }>;
}

// TEPSI - Tipos de datos
export interface TEPSIData {
  [key: string]: TEPSIItem[];
}

export interface TEPSIBaremosData {
  [ageCategory: string]: {
    coordinacion: Array<{ raw: number[]; t: number }>;
    lenguaje: Array<{ raw: number[]; t: number }>;
    motricidad: Array<{ raw: number[]; t: number }>;
    total: Array<{ raw: number[]; t: number }>;
  };
}

// Pauta Breve DSM-V
export interface PautaBreveDSMItem {
  id: string;
  area: string;
  text: string;
  instructions?: string;
}

export interface PautaBreveData {
  [key: string]: PautaBreveDSMItem[];
}