
import type { ShiftType } from "@/lib/types";
import { getShiftByType, PRESET_SHIFTS } from "@/lib/shifts";
import type { GoogleCalendarEvent } from "@/lib/types";

/**
 * Mapeo de colores de turnos a IDs de colores de Google Calendar
 * Google Calendar tiene 11 colores predefinidos (1-11)
 * Documentación: https://developers.google.com/calendar/api/v3/reference/colors
 */
const SHIFT_COLOR_MAP: Record<ShiftType, string> = {
  largo: "7",      // Cyan (#5cc0ff similar)
  noche: "9",      // Azul oscuro (#4c4cba similar)
  diurno: "10",    // Verde (#9be979 similar)
  "24": "11",      // Rojo (#ff9a9a similar)
  extra: "5",      // Amarillo/Naranja (#ffaa00 similar)
  custom: "8",     // Gris (#888888 similar)
};

/**
 * Construye un evento de Google Calendar a partir de un ShiftType
 */
export function buildGoogleShiftEvent(
  shiftType: ShiftType,
  date: Date
): any | null {
  const shiftDetails = getShiftByType(shiftType);
  if (!shiftDetails) return null;

  const [startHour, startMinute] = shiftDetails.start.split(":").map(Number);
  const [endHour, endMinute] = shiftDetails.end.split(":").map(Number);

  const start = new Date(date);
  start.setHours(startHour, startMinute, 0, 0);

  const end = new Date(date);
  end.setHours(endHour, endMinute, 0, 0);

  if (shiftDetails.overnight) {
    end.setDate(end.getDate() + 1);
  }

  const isAllDay = shiftType === "extra" || shiftType === "custom";

  // Construir evento con TODA la información necesaria
  const event: any = {
    summary: `${shiftDetails.symbol} - ${shiftDetails.name}`,
    description: `Turno ${shiftDetails.name}\nSímbolo: ${shiftDetails.symbol}\nHorario: ${shiftDetails.start} - ${shiftDetails.end}${shiftDetails.overnight ? ' (nocturno)' : ''}`,
    location: "Hospital/Clínica",
    colorId: SHIFT_COLOR_MAP[shiftType],
    extendedProperties: {
      private: {
        shiftType: shiftType,
        shiftSymbol: shiftDetails.symbol,
      }
    }
  };

  // Configurar fechas
  if (isAllDay) {
    event.start = { date: date.toISOString().split("T")[0] };
    event.end = { date: date.toISOString().split("T")[0] };
  } else {
    event.start = { 
      dateTime: start.toISOString(), 
      timeZone: 'America/Santiago' 
    };
    event.end = { 
      dateTime: end.toISOString(), 
      timeZone: 'America/Santiago' 
    };
  }

  return event;
}

/**
 * Extrae el tipo de turno de un evento de Google Calendar
 */
export function extractShiftTypeFromEvent(event: GoogleCalendarEvent): ShiftType | null {
  // 1. Primero, buscar en extendedProperties (lo más confiable)
  if (event.extendedProperties?.private?.shiftType) {
    return event.extendedProperties.private.shiftType as ShiftType;
  }

  // 2. Buscar por el símbolo en el título (ej: "L - Turno Largo")
  const title = event.summary || "";
  const shiftBySymbol = PRESET_SHIFTS.find(shift => title.startsWith(`${shift.symbol} -`));
  if (shiftBySymbol) {
      return shiftBySymbol.value;
  }

  // 3. Buscar por nombre del turno en el título (fallback)
  const lowerTitle = title.toLowerCase();
  const matchedByName = PRESET_SHIFTS.find(s => 
    lowerTitle.includes(s.name.toLowerCase())
  );
  
  return matchedByName ? matchedByName.value : null;
}

/**
 * Verifica si un evento de Google Calendar es un turno
 */
export function isShiftEvent(event: GoogleCalendarEvent): boolean {
  return extractShiftTypeFromEvent(event) !== null;
}
