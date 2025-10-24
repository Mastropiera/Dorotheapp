"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import type { GoogleCalendarEvent } from "@/lib/types/google-calendar";
import type { LocalEvent, ShiftType } from "@/lib/types/calendar";
import type { MenstrualData } from "@/lib/types/cycles";
import type { ShiftOption } from "@/lib/shifts";
import { format, startOfMonth, startOfDay, isSameDay, parseISO, addDays, isValid } from "date-fns";
import { es } from "date-fns/locale";
import type { DayContentProps } from "react-day-picker";
import { useDayRender } from "react-day-picker";
import { Droplet } from "lucide-react";
import { CHILEAN_HOLIDAYS_LIST } from "@/lib/holiday-data";
import { getShiftByType } from "@/lib/shifts";
import { extractShiftTypeFromEvent } from "@/lib/google-shifts";
import ExtraHoursModal from "@/components/extra-hours/ExtraHoursModal";
import type { ExtraHourEntry } from "@/hooks/useShiftEarnings";

interface CalendarDisplayProps {
  selectedDate: Date | undefined;
  onDateSelect: (date?: Date) => void;
  googleCalendarEvents?: GoogleCalendarEvent[];
  menstrualData: MenstrualData;
  localEvents: LocalEvent[];
  onMonthChange?: (month: Date) => void;
}

export default function CalendarDisplay({
  selectedDate,
  onDateSelect,
  googleCalendarEvents = [],
  menstrualData,
  localEvents,
  onMonthChange,
}: CalendarDisplayProps) {
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(
    selectedDate ? startOfMonth(selectedDate) : startOfMonth(new Date())
  );

  const [extraHours, setExtraHours] = useState<ExtraHourEntry[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExtraDate, setSelectedExtraDate] = useState<string | undefined>(undefined);

  const addExtraHours = (entry: ExtraHourEntry) => {
    setExtraHours((prev) => [...prev, entry]);
  };

  const handleAddExtra = (date: string) => {
    setSelectedExtraDate(date);
    setModalOpen(true);
  };
  
  useEffect(() => {
    if (onMonthChange) {
      onMonthChange(currentCalendarMonth);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCalendarMonth]);


  // Feriados chilenos
  const holidayDaysSet = useMemo(() => {
    const set = new Set<string>();
    const year = currentCalendarMonth.getFullYear();
    CHILEAN_HOLIDAYS_LIST.forEach((holiday) => {
      if (holiday.type === "fixed") {
        set.add(`${year}-${holiday.date}`);
      } else if (holiday.type === "variable" && holiday.year === year) {
        set.add(holiday.date);
      }
    });
    return set;
  }, [currentCalendarMonth]);

  // Mapear eventos por día
  const dayEvents = useMemo(() => {
    const map = new Map<string, (GoogleCalendarEvent | LocalEvent)[]>();

    googleCalendarEvents.forEach((event) => {
      const dateKey =
        event.start.date || format(parseISO(event.start.dateTime!), "yyyy-MM-dd");
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(event);
    });

    localEvents.forEach((event) => {
      if (!map.has(event.date)) map.set(event.date, []);
      map.get(event.date)!.push(event);
    });

    return map;
  }, [googleCalendarEvents, localEvents]);

  // Ciclo menstrual
  const { periodDays, predictedPeriodDays } = useMemo(() => {
    const periodDaySet = new Set<string>();
    const predictedPeriodDaySet = new Set<string>();
    const { settings, recordedPeriods = [], manualPeriodDays = {} } = menstrualData;
    const periodLength = settings?.periodLength || 5;
    const cycleLength = settings?.cycleLength || 28;

    recordedPeriods.forEach((period) => {
      const startDate = parseISO(period.startDate);
      if (isValid(startDate)) {
        for (let i = 0; i < periodLength; i++) {
          const dayKey = format(addDays(startDate, i), "yyyy-MM-dd");
          if (manualPeriodDays[dayKey] !== false) {
            periodDaySet.add(dayKey);
          }
        }
      }
    });

    Object.keys(manualPeriodDays).forEach((dateKey) => {
      if (manualPeriodDays[dateKey]) {
        periodDaySet.add(dateKey);
      } else {
        periodDaySet.delete(dateKey);
      }
    });

    const allStartDates = [
      ...recordedPeriods.map((p) => p.startDate),
      ...Object.keys(manualPeriodDays).filter((d) => manualPeriodDays[d]),
    ]
      .map((d) => parseISO(d))
      .filter(isValid);

    if (allStartDates.length > 0) {
      allStartDates.sort((a, b) => b.getTime() - a.getTime());
      const lastStartDate = allStartDates[0];
      const nextPeriodStartDate = addDays(lastStartDate, cycleLength);
      for (let i = 0; i < periodLength; i++) {
        const dayKey = format(addDays(nextPeriodStartDate, i), "yyyy-MM-dd");
        if (!periodDaySet.has(dayKey)) {
          predictedPeriodDaySet.add(dayKey);
        }
      }
    }

    return { periodDays: periodDaySet, predictedPeriodDays: predictedPeriodDaySet };
  }, [menstrualData]);

  // Función para encontrar el turno prioritario en un día
  function findShiftInEvents(events: (GoogleCalendarEvent | LocalEvent)[]): ShiftOption | null {
    for (const event of events) {
      if ('shiftType' in event && event.type === 'shift' && event.shiftType) {
        const shift = getShiftByType(event.shiftType);
        if (shift) return shift;
      }
      if ("summary" in event) {
        const shiftType = extractShiftTypeFromEvent(event as GoogleCalendarEvent);
        if (shiftType) {
          const shift = getShiftByType(shiftType);
          if (shift) return shift;
        }
      }
    }
    return null;
  }

  // Render personalizado de día
  function CustomDayContent(props: DayContentProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { isHidden } = useDayRender(props.date, props.displayMonth, buttonRef);
    if (isHidden) return <></>;

    const dayNumber = format(props.date, "d");
    const dateKey = format(props.date, "yyyy-MM-dd");
    const isCurrentMonth = props.date.getMonth() === props.displayMonth.getMonth();
    const isHoliday = isCurrentMonth && holidayDaysSet.has(dateKey);
    const isPeriodDay = periodDays.has(dateKey);
    const isPredictedPeriodDay = predictedPeriodDays.has(dateKey) && !isPeriodDay;
    const isSelected = selectedDate && isSameDay(props.date, selectedDate);
    const eventsForDay = dayEvents.get(dateKey) || [];
    const shiftInfo = findShiftInEvents(eventsForDay);

    const dayNumberStyle: React.CSSProperties = {};
    if (isSelected) {
      dayNumberStyle.color = "hsl(var(--primary-foreground))";
    } else if (isHoliday) {
      dayNumberStyle.color = "hsl(var(--destructive))";
      dayNumberStyle.fontWeight = "bold";
    } else if (shiftInfo) {
      dayNumberStyle.color = shiftInfo.color || "hsl(var(--primary-foreground))";
      dayNumberStyle.fontWeight = "600";
    }

    return (
      <div
        style={{
          backgroundColor: isSelected
            ? undefined
            : shiftInfo
            ? shiftInfo.backgroundColor
            : undefined,
            position: "relative"
        }}
        className="w-full h-full flex flex-col items-center justify-center rounded-md overflow-hidden"
        onContextMenu={(e) => {
          e.preventDefault();
          handleAddExtra(dateKey);
        }}
      >
        {isPeriodDay && (
          <Droplet className="absolute top-1 right-1 h-3 w-3 text-red-500 fill-red-500 z-10" />
         )}
        {isPredictedPeriodDay && (
          <Droplet className="absolute top-1 right-1 h-3 w-3 text-red-500/50 fill-red-500/50 z-10" />
        )}

        {shiftInfo && !isSelected && (
          <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            fontSize: "2.5rem",
            fontWeight: "900",
            color: shiftInfo.color || "#1e293b",
            opacity: 0.15,
            lineHeight: 1
          }}
        >
          {shiftInfo.symbol}
        </div>
        )}

        <span style={dayNumberStyle} className="relative z-20 text-base">
          {dayNumber}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-card p-4 sm:p-6 rounded-xl shadow-xl border border-border">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => onDateSelect(date ? startOfDay(date) : undefined)}
        month={currentCalendarMonth}
        onMonthChange={setCurrentCalendarMonth}
        locale={es}
        className="w-full"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 justify-center",
          month: "space-y-4 w-full",
          caption_label: "text-xl font-bold text-primary",
          nav_button: "h-8 w-8",
          head_cell: "w-full h-10 text-muted-foreground font-normal text-sm",
          row: "flex w-full mt-2",
          cell: "h-12 w-full text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          day: "h-12 w-full p-0 font-normal aria-selected:opacity-100 rounded-md",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "font-bold ring-2 ring-primary/50",
          day_outside: "text-muted-foreground opacity-50",
        }}
        components={{ DayContent: CustomDayContent }}
        showOutsideDays
        ISOWeek={false}
      />

      <ExtraHoursModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        date={selectedExtraDate}
        addExtraHours={addExtraHours}
      />
    </div>
  );
}
