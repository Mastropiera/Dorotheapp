
export interface Celebration {
    id: string;
    title: string;
  }
  
  export interface DaySpecifics {
    celebrations?: Celebration[];
  }
  
  export type ShiftType = 'largo' | 'noche' | 'diurno' | '24' | 'extra' | 'custom';
  
  export interface ShiftData {
    date: string;
    title: string;
    shiftType: ShiftType;
    start?: string;
    end?: string;
    symbol?: string;
  }
  
  export interface LocalEvent {
    id: string;
    title: string;
    date: string;
    type: 'shift' | 'celebration' | 'local';
    shiftType?: ShiftType;
    start?: string;
    end?: string;
    symbol?: string;
    syncedToGoogle?: boolean;
    googleEventId?: string;
  }
  
