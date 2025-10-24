import { useMemo } from "react";
import type { ShiftType } from "@/lib/types";
import { 
  PRESET_SHIFTS, 
  PRESET_SHIFTS_MAP,
  PREDEFINED_SHIFTS, 
  SPECIAL_SHIFTS,
  getShiftByType,
  type ShiftOption
} from "@/lib/shifts";

export default function useShifts() {
  // ✅ Usar la función helper en lugar de acceso directo
  const getShiftDetails = (shiftType: ShiftType): ShiftOption | undefined => {
    return getShiftByType(shiftType);
  };

  const isPredefinedShift = (shiftType: ShiftType): boolean => {
    return PREDEFINED_SHIFTS.includes(shiftType);
  };

  const isSpecialShift = (shiftType: ShiftType): boolean => {
    return SPECIAL_SHIFTS.includes(shiftType);
  };

  const predefinedShifts = useMemo(() => {
    return PREDEFINED_SHIFTS.map((type) => getShiftByType(type)).filter(Boolean) as ShiftOption[];
  }, []);

  return {
    PRESET_SHIFTS, // Array para iterar
    PRESET_SHIFTS_MAP, // Objeto para búsqueda rápida
    getShiftDetails,
    isPredefinedShift,
    isSpecialShift,
    predefinedShifts,
  };
}