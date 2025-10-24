export interface MedicationReminder {
    id: string;
    name: string;
    dose?: string;
    times: string[];
    daysOfWeek: number[];
    notes?: string;
  }
  
  export type MedicationTakenLog = Record<string, Record<string, Record<string, boolean>>>;
  
  export interface VademecumEntry {
    id: string;
    name: string;
    action?: string;
    presentations?: string;
    indications?: string;
    contraindications?: string;
    storage?: string;
    reconstitution?: string;
    dose?: string;
    dilution?: string;
    administration?: string;
    solutionStability?: string;
    administrationSpeed?: string;
    compatibleSerums?: string;
    ramObservations?: string;
  }
  
  export const LM_RISK_LEVEL_KEYS = ['safe', 'quiteSafe', 'lessSafe', 'veryUnsafe'] as const;
  export type LMRiskLevelKey = typeof LM_RISK_LEVEL_KEYS[number];
  
  export const PREGNANCY_CATEGORIES = ['A', 'B', 'C', 'D', 'X'] as const;
  export type PregnancyCategory = typeof PREGNANCY_CATEGORIES[number];
  
  export interface LMCompatibilityEntry {
    id: string;
    name: string;
    riskLevel: LMRiskLevelKey;
    pregnancyCategory?: PregnancyCategory;
  }
  