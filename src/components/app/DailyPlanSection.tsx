// src/components/app/DailyPlanSection.tsx
import React from "react";
import CalendarDisplay from "@/components/color-plan/calendar-display";
import type { LocalEvent } from "@/lib/types/calendar";
import type { MenstrualData } from "@/lib/types/cycles";
import type { GoogleCalendarEvent } from "@/lib/types/google-calendar";

interface DailyPlanSectionProps {
  selectedDate?: Date;
  onDateSelect: (date?: Date) => void;
  googleCalendarEvents: GoogleCalendarEvent[];
  menstrualData: MenstrualData;
  localEvents: LocalEvent[];
  onMonthChange: (month: Date) => void;
}

const DailyPlanSection: React.FC<DailyPlanSectionProps> = ({
  selectedDate,
  onDateSelect,
  googleCalendarEvents,
  menstrualData,
  localEvents,
  onMonthChange
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <CalendarDisplay
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        googleCalendarEvents={googleCalendarEvents}
        menstrualData={menstrualData}
        localEvents={localEvents}
        onMonthChange={onMonthChange}
      />
    </div>
  );
};

export default DailyPlanSection;
