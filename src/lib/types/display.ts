import type { GoogleCalendarEvent } from './google-calendar';
import type { LocalEvent } from './calendar';

export interface DisplayableEvent {
  id: string;
  title: string;
  startTime: Date;
  isAllDay: boolean;
  type: 'google' | 'local';
  source: GoogleCalendarEvent | LocalEvent;
  displayTime: string;
  description?: string;
  htmlLink?: string;
  location?: string;
  googleMeetLink?: string;
}
