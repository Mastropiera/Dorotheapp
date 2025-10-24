// src/lib/types/google-calendar.ts
// Tipos para Google Calendar API

export interface GoogleCalendarEventDateTime {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  }
  
  export interface GoogleCalendarEvent {
    id: string;
    summary: string;
    description?: string;
    location?: string;
    htmlLink?: string;
    hangoutLink?: string;
    
    // Color del evento (1-11)
    colorId?: string;
    
    // Fechas de inicio y fin
    start: GoogleCalendarEventDateTime;
    end: GoogleCalendarEventDateTime;
    
    // Propiedades extendidas para guardar metadata de turnos
    extendedProperties?: {
      private?: {
        shiftType?: string;
        shiftSymbol?: string;
        shiftColor?: string;
        [key: string]: string | undefined;
      };
      shared?: {
        [key: string]: string;
      };
    };
    
    // Otras propiedades útiles de la API de Google
    status?: 'confirmed' | 'tentative' | 'cancelled';
    created?: string;
    updated?: string;
    creator?: {
      email?: string;
      displayName?: string;
    };
    organizer?: {
      email?: string;
      displayName?: string;
    };
  }
  
  export interface GoogleTask {
    id: string;
    title: string;
    notes?: string;
    status?: 'needsAction' | 'completed';
    due?: string;
    completed?: string;
    updated?: string;
    links?: Array<{
      type: string;
      description?: string;
      link: string;
    }>;
  }