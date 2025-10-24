
import type { ShiftType } from "@/lib/types";

// Tipo para cada turno
export interface ShiftOption {
  value: ShiftType;
  name: string;
  start: string;
  end: string;
  overnight?: boolean;
  symbol: string;
  backgroundColor: string;
  color?: string; // Color de texto opcional
}

// ✅ PRESET_SHIFTS como ARRAY (mantener la estructura original)
export const PRESET_SHIFTS: ShiftOption[] = [
  {
    value: "largo",
    name: "Turno Largo",
    start: "08:00",
    end: "20:00",
    symbol: "L",
    backgroundColor: "#5cc0ff", // Un azul claro
    color: "#000000"
  },
  {
    value: "noche",
    name: "Turno Noche",
    start: "20:00",
    end: "08:00",
    overnight: true,
    symbol: "N",
    backgroundColor: "#4c4cba", // Un azul oscuro
    color: "#FFFFFF"
  },
  {
    value: "diurno",
    name: "Turno Diurno",
    start: "08:00",
    end: "17:00",
    symbol: "D",
    backgroundColor: "#9be979", // Un verde claro
    color: "#000000"
  },
  {
    value: "24",
    name: "Turno 24h",
    start: "08:00",
    end: "08:00",
    overnight: true,
    symbol: "24",
    backgroundColor: "#ff9a9a", // Un rojo claro
    color: "#000000"
  },
  {
    value: "extra",
    name: "Turno Extra",
    start: "00:00",
    end: "00:00",
    symbol: "E",
    backgroundColor: "#ffaa00", // Un naranjo
    color: "#000000"
  },
  {
    value: "custom",
    name: "Turno Personalizado",
    start: "00:00",
    end: "00:00",
    symbol: "C",
    backgroundColor: "#888888", // Un gris
    color: "#FFFFFF"
  },
];

// ✅ NUEVO: Objeto indexado para búsqueda rápida
export const PRESET_SHIFTS_MAP: Record<ShiftType, ShiftOption> = PRESET_SHIFTS.reduce((acc, shift) => {
  acc[shift.value] = shift;
  return acc;
}, {} as Record<ShiftType, ShiftOption>);


// Lista de turnos predefinidos
export const PREDEFINED_SHIFTS: ShiftType[] = ["largo", "noche", "diurno", "24"];

// Lista de turnos especiales
export const SPECIAL_SHIFTS: ShiftType[] = ["extra", "custom"];

/**
 * ✅ Obtiene los detalles de un turno por su tipo
 */
export function getShiftByType(shiftType: ShiftType): ShiftOption | undefined {
  return PRESET_SHIFTS_MAP[shiftType];
}

/**
 * Verifica si un turno es predefinido
 */
export function isPredefinedShift(shift: ShiftType): boolean {
  return PREDEFINED_SHIFTS.includes(shift);
}

/**
 * Verifica si un turno es especial (extra/custom)
 */
export function isSpecialShift(shift: ShiftType): boolean {
  return SPECIAL_SHIFTS.includes(shift);
}
