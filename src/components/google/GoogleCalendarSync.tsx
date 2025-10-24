import { google } from "googleapis";

export async function addShiftToGoogleCalendar(authToken: string, shiftData: any) {
  const calendar = google.calendar({ version: "v3" });
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: authToken });

  return await calendar.events.insert({
    auth,
    calendarId: "primary",
    requestBody: {
      summary: shiftData.title,
      start: { dateTime: shiftData.start, timeZone: "America/Santiago" },
      end: { dateTime: shiftData.end, timeZone: "America/Santiago" },
    },
  });
}
