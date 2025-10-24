
// src/lib/holiday-data.ts

import { format } from 'date-fns';
import type { InternationalDay } from './types'; // Importar el nuevo tipo

export interface Holiday {
  date: string; // "MM-DD" for fixed, "YYYY-MM-DD" for variable
  name: string;
  type: 'fixed' | 'variable';
  year?: number; // Only for variable type
}

export const CHILEAN_HOLIDAYS_LIST: Holiday[] = [
  // Fijos (formato "MM-DD", aplicarán al año actual del calendario)
  { date: "01-01", name: "Año Nuevo", type: 'fixed' },
  { date: "05-01", name: "Día del Trabajo", type: 'fixed' },
  { date: "05-21", name: "Día de las Glorias Navales", type: 'fixed' },
  { date: "06-29", name: "San Pedro y San Pablo", type: 'fixed' },
  { date: "07-16", name: "Día de la Virgen del Carmen", type: 'fixed' },
  { date: "08-15", name: "Asunción de la Virgen", type: 'fixed' },
  { date: "09-18", name: "Independencia Nacional", type: 'fixed' },
  { date: "09-19", name: "Día de las Glorias del Ejército", type: 'fixed' },
  { date: "10-12", name: "Encuentro de Dos Mundos", type: 'fixed' },
  { date: "10-31", name: "Día de las Iglesias Evangélicas y Protestantes", type: 'fixed' },
  { date: "11-01", name: "Día de Todos los Santos", type: 'fixed' },
  { date: "12-08", name: "Inmaculada Concepción", type: 'fixed' },
  { date: "12-25", name: "Navidad", type: 'fixed' },
  // Variables (formato "YYYY-MM-DD", específicos para el año indicado)
  { date: "2024-03-29", name: "Viernes Santo", type: 'variable', year: 2024 },
  { date: "2024-03-30", name: "Sábado Santo", type: 'variable', year: 2024 },
  { date: "2024-06-20", name: "Día Nacional de los Pueblos Indígenas", type: 'variable', year: 2024 },
  { date: "2025-04-18", name: "Viernes Santo", type: 'variable', year: 2025 },
  { date: "2025-04-19", name: "Sábado Santo", type: 'variable', year: 2025 },
  { date: "2025-06-20", name: "Día Nacional de los Pueblos Indígenas", type: 'variable', year: 2025 },
];

export function getHolidayForDate(targetDate: Date, holidaysList: Holiday[]): Holiday | null {
  if (!targetDate) return null;

  const currentYear = targetDate.getFullYear();
  const formattedDateFull = format(targetDate, 'yyyy-MM-dd'); 
  const formattedDateMonthDay = format(targetDate, 'MM-dd'); 

  for (const holiday of holidaysList) {
    if (holiday.type === 'fixed') {
      if (holiday.date === formattedDateMonthDay) {
        return holiday;
      }
    } else if (holiday.type === 'variable') {
      // Para feriados variables, el año en la lista debe coincidir con el año de targetDate
      if (holiday.date === formattedDateFull && holiday.year === currentYear) {
        return holiday;
      }
    }
  }
  return null;
}


// Lista de Días Internacionales
export const INTERNATIONAL_DAYS_LIST: InternationalDay[] = [
  { date: "01-02", name: "Día Mundial del Introvertido" },
  { date: "01-03", name: "Día de las Cerezas Cubiertas de Chocolate" },
  { date: "01-04", name: "Día Mundial del Braille" },
  { date: "01-04", name: "Día de la Crema Batida" },
  { date: "01-06", name: "Día Mundial de las Víctimas de Guerra" },
  { date: "01-07", name: "Día de la Estampilla" },
  { date: "01-27", name: "Día Internacional de Conmemoración en Memoria de las Víctimas del Holocausto" },
  { date: "02-04", name: "Día Mundial contra el Cáncer" },
  { date: "02-13", name: "Día Mundial de la Radio" },
  { date: "02-14", name: "Día de San Valentín / Día de los Enamorados" },
  { date: "02-15", name: "Día Internacional del Niño con Cáncer" },
  { date: "03-08", name: "Día Internacional de la Mujer" },
  { date: "03-20", name: "Día Internacional de la Felicidad" },
  { date: "03-21", name: "Día Mundial del Síndrome de Down" },
  { date: "03-21", name: "Día Internacional de los Bosques" },
  { date: "03-21", name: "Día Internacional de la Eliminación de la Discriminación Racial" },
  { date: "03-22", name: "Día Mundial del Agua" },
  { date: "04-02", name: "Día Mundial de Concienciación sobre el Autismo" },
  { date: "04-07", name: "Día Mundial de la Salud" },
  { date: "04-22", name: "Día Internacional de la Madre Tierra" },
  { date: "05-01", name: "Día Internacional de los Trabajadores (también feriado en Chile)" },
  { date: "05-03", name: "Día Mundial de la Libertad de Prensa" },
  { date: "05-12", name: "Día Internacional de la Enfermería" },
  { date: "05-15", name: "Día Internacional de las Familias" },
  { date: "05-17", name: "Día Internacional contra la Homofobia, la Transfobia y la Bifobia" },
  { date: "05-31", name: "Día Mundial Sin Tabaco" },
  { date: "06-01", name: "Día Mundial de las Madres y los Padres" },
  { date: "06-05", name: "Día Mundial del Medio Ambiente" },
  { date: "06-08", name: "Día Mundial de los Océanos" },
  { date: "06-14", name: "Día Mundial del Donante de Sangre" },
  { date: "06-20", name: "Día Mundial del Refugiado" },
  { date: "07-18", name: "Día Internacional de Nelson Mandela" },
  { date: "07-30", name: "Día Internacional de la Amistad" },
  { date: "08-09", name: "Día Internacional de los Pueblos Indígenas" },
  { date: "08-12", name: "Día Internacional de la Juventud" },
  { date: "08-19", name: "Día Mundial de la Asistencia Humanitaria" },
  { date: "09-08", name: "Día Internacional de la Alfabetización" },
  { date: "09-10", name: "Día Mundial para la Prevención del Suicidio" },
  { date: "09-21", name: "Día Internacional de la Paz" },
  { date: "09-27", name: "Día Mundial del Turismo" },
  { date: "10-01", name: "Día Internacional de las Personas de Edad" },
  { date: "10-05", name: "Día Mundial de los Docentes" },
  { date: "10-10", name: "Día Mundial de la Salud Mental" },
  { date: "10-11", name: "Día Internacional de la Niña" },
  { date: "10-16", name: "Día Mundial de la Alimentación" },
  { date: "10-17", name: "Día Internacional para la Erradicación de la Pobreza" },
  { date: "10-24", name: "Día de las Naciones Unidas" },
  { date: "11-14", name: "Día Mundial de la Diabetes" },
  { date: "11-16", name: "Día Internacional para la Tolerancia" },
  { date: "11-19", name: "Día Mundial del Saneamiento (Día Mundial del Retrete)" },
  { date: "11-20", name: "Día Universal del Niño" },
  { date: "11-25", name: "Día Internacional de la Eliminación de la Violencia contra la Mujer" },
  { date: "12-01", name: "Día Mundial de la Lucha contra el SIDA" },
  { date: "12-03", name: "Día Internacional de las Personas con Discapacidad" },
  { date: "12-09", name: "Día Internacional contra la Corrupción" },
  { date: "12-10", name: "Día de los Derechos Humanos" },
];

export function getInternationalDayForDate(targetDate: Date, intlDaysList: InternationalDay[]): InternationalDay | null {
  if (!targetDate) return null;
  const formattedDateMonthDay = format(targetDate, 'MM-dd');
  return intlDaysList.find(day => day.date === formattedDateMonthDay) || null;
}
