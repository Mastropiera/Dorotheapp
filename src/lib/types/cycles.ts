export interface MenstrualCycleSettings {
  cycleLength: number;
  periodLength: number;
}

export interface PeriodEntry {
  id: string;
  startDate: string;
  endDate?: string;
}

export interface MenstrualData {
  settings: MenstrualCycleSettings;
  recordedPeriods: PeriodEntry[];
  manualPeriodDays?: Record<string, boolean>;
}
