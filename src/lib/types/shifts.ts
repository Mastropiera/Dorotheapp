export interface ShiftDetails {
  start: string;
  end: string;
  overnight: boolean;
  symbol: string;
  color: string;
}

export interface ExtraHourEntry {
  id: string;
  date: string;
  hours: number;
  notes?: string;
}

export interface ShiftEarnings {
  normalHours: number;
  holidayHours: number;
  extraHours: number;
  normalEarnings: number;
  holidayEarnings: number;
  extraEarnings: number;
  totalGross: number;
  totalNet: number;
}

export interface ShiftEarningsSettings {
  startDate: Date;
  endDate: Date;
  hourlyRate: number;
  extraHourlyRate: number;
  discountPercent: number;
}