
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ShiftType } from "@/lib/types/calendar";
import type { Celebration } from "@/lib/types";
import type { DisplayableEvent } from "@/lib/types/display";
import type { GoogleCalendarEvent } from "@/lib/types/google-calendar";
import type { LocalEvent } from "@/lib/types/calendar";
import type { MenstrualData } from "@/lib/types/cycles";
import type { MenstrualCycleSettings } from "@/lib/types/cycles";
import { format, startOfDay, parseISO, isValid, addDays, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, ListChecks, Trash2, PartyPopper, PlusCircle, Briefcase, Info, Globe, ExternalLink, Video, AlertTriangle, Droplet } from "lucide-react"; 
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useEffect } from "react";
import { useGoogleApi } from '@/contexts/google-api-context'; 
import { Skeleton } from "@/components/ui/skeleton";
import ShiftSelector from "./shift-selector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DailyPlanSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  holidayName?: string | null;
  internationalDayName?: string | null; 
  googleCalendarEvents?: GoogleCalendarEvent[];
  localEvents?: LocalEvent[];
  isLoadingGoogleEvents?: boolean;
  googleApiError?: string | null;
  onAddCelebration: (title: string, date: Date) => void;
  onAddLocalEvent: (event: Omit<LocalEvent, 'id'>) => void;
  onDeleteLocalEvent: (eventId: string) => void;
  menstrualData: MenstrualData;
  setMenstrualData: React.Dispatch<React.SetStateAction<MenstrualData>>;
}

export default function DailyPlanSheet({
  isOpen,
  onOpenChange,
  selectedDate,
  holidayName,
  internationalDayName, 
  googleCalendarEvents = [],
  localEvents = [],
  isLoadingGoogleEvents = false,
  googleApiError,
  onAddCelebration,
  onAddLocalEvent,
  onDeleteLocalEvent,
  menstrualData,
  setMenstrualData,
}: DailyPlanSheetProps) {
  
  const formattedDate = selectedDate ? format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es }) : "";
  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const [newCelebrationTitle, setNewCelebrationTitle] = useState('');
  const [newActivityTitle, setNewActivityTitle] = useState('');

  const { isAuthorized: isGoogleApiAuthorized, login: loginWithGoogle, deleteGoogleCalendarEvent } = useGoogleApi();

  const handleAddCelebrationClick = () => {
    if (newCelebrationTitle.trim() && selectedDate) {
        onAddCelebration(newCelebrationTitle.trim(), selectedDate);
        setNewCelebrationTitle('');
    }
  };

  const handleAddActivityClick = () => {
    if (newActivityTitle.trim() && selectedDate) {
        onAddLocalEvent({
            title: newActivityTitle.trim(),
            date: format(selectedDate, 'yyyy-MM-dd'),
            type: 'local'
        });
        setNewActivityTitle('');
    }
  };
  
  const combinedEvents: DisplayableEvent[] = useMemo(() => {
    const events: DisplayableEvent[] = [];
  
    googleCalendarEvents.forEach(gEvent => {
      let startTime: Date;
      let isAllDay = false;
      let displayTime = "Todo el día";
  
      if (gEvent.start.dateTime) {
        startTime = parseISO(gEvent.start.dateTime);
        if (isValid(startTime)) {
            displayTime = format(startTime, "HH:mm", { locale: es });
        } else {
            startTime = startOfDay(selectedDate);
            displayTime = "Hora inválida";
        }
      } else if (gEvent.start.date) {
        startTime = startOfDay(parseISO(gEvent.start.date));
        if (isValid(startTime)) {
          isAllDay = true;
        } else {
            startTime = startOfDay(selectedDate);
            isAllDay = true;
        }
      } else {
        startTime = startOfDay(selectedDate);
        isAllDay = true;
      }
      
      events.push({
        id: `google-${gEvent.id}`,
        title: gEvent.summary,
        startTime,
        isAllDay,
        type: 'google',
        source: gEvent,
        displayTime,
        description: gEvent.description,
        htmlLink: gEvent.htmlLink,
        location: gEvent.location,
        googleMeetLink: gEvent.hangoutLink,
      });
    });

    localEvents.forEach(lEvent => {
        if(lEvent.date === format(selectedDate, 'yyyy-MM-dd')) {
            events.push({
                id: `${lEvent.type}-${lEvent.id}`,
                title: lEvent.title,
                startTime: parseISO(lEvent.date),
                isAllDay: true,
                type: 'local',
                source: lEvent,
                displayTime: "Todo el día",
            });
        }
    });
  
    return events.sort((a, b) => {
      if (a.isAllDay && !b.isAllDay) return -1;
      if (!a.isAllDay && b.isAllDay) return 1;
      return a.startTime.getTime() - b.startTime.getTime();
    });
  }, [googleCalendarEvents, localEvents, selectedDate]);
  
  const handleDeleteEvent = (event: DisplayableEvent) => {
    if (event.type === 'google' && (event.source as GoogleCalendarEvent).id) {
        deleteGoogleCalendarEvent((event.source as GoogleCalendarEvent).id!);
    } else if (event.type === 'local') {
        onDeleteLocalEvent(event.source.id);
    }
  };

  const handleTogglePeriodDay = (isPeriod: boolean) => {
    setMenstrualData(prev => {
      const newManualDays = { ...(prev.manualPeriodDays || {}) };
      // true para marcar, false para desmarcar explícitamente
      newManualDays[dateKey] = isPeriod;
      return { ...prev, manualPeriodDays: newManualDays };
    });
  };

  const isPeriodDay = useMemo(() => {
    const { settings, recordedPeriods = [], manualPeriodDays = {} } = menstrualData;
    const periodLength = settings?.periodLength || 5;
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    
    // Primero, revisar el override manual
    if (manualPeriodDays[dateKey] === true) return true;
    if (manualPeriodDays[dateKey] === false) return false;
    
    // Si no hay override, calcular a partir de los períodos registrados
    for (const period of recordedPeriods) {
        const startDate = parseISO(period.startDate);
        const diff = differenceInDays(selectedDate, startDate);
        if (diff >= 0 && diff < periodLength) {
            return true;
        }
    }
    
    return false;
  }, [menstrualData, selectedDate]);


  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-[90vw] flex flex-col" side="right">
        <SheetHeader className="p-6">
          <SheetTitle className="text-2xl font-headline flex items-center">
            <CalendarDays className="mr-2 h-6 w-6 text-primary" />
            Plan del Día
          </SheetTitle>
          <SheetDescription className="text-lg text-muted-foreground">{formattedDate}</SheetDescription>
          {holidayName && (
            <p className="text-sm text-destructive font-semibold flex items-center mt-1">
                <Info className="mr-1.5 h-4 w-4" /> Hoy es {holidayName}.
            </p>
          )}
          {internationalDayName && (
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center mt-1">
                <Globe className="mr-1.5 h-4 w-4" /> Hoy es {internationalDayName}.
            </p>
          )}
        </SheetHeader>
        
        <ScrollArea className="flex-grow px-6 pt-0">
          <ShiftSelector selectedDate={selectedDate} onAddLocalEvent={onAddLocalEvent}/>
          
          <Separator className="my-6" />
           {!isGoogleApiAuthorized && (
              <div className="p-4 border-2 border-dashed border-yellow-400 rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-center">
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">Conecta tu cuenta de Google para sincronizar tus turnos y eventos automáticamente.</p>
                <Button onClick={loginWithGoogle} variant="outline">Conectar con Google Calendar</Button>
              </div>
            )}
          <Separator className="my-6" />

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center text-foreground">
              <Droplet className="mr-2 h-5 w-5 text-red-500" />
              Registro Menstrual
            </h3>
            <div className="flex items-center space-x-2">
              <Switch 
                id="period-toggle" 
                checked={isPeriodDay}
                onCheckedChange={handleTogglePeriodDay}
              />
              <Label htmlFor="period-toggle">Marcar este día como período menstrual</Label>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center text-foreground">
              <ListChecks className="mr-2 h-5 w-5 text-primary" />
              Agenda del Día
            </h3>
            {googleApiError && (
              <div className="p-3 my-2 border rounded-md bg-destructive/10 text-destructive text-sm flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold">Error de API de Google</p>
                  <p>{googleApiError}</p>
                </div>
              </div>
            )}
            {isLoadingGoogleEvents && (
                <div className="space-y-2 my-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            )}
            {!isGoogleApiAuthorized && localEvents.length === 0 ? (
                 <p className="text-muted-foreground italic">No hay eventos para este día. Conecta Google para ver tu calendario.</p>
            ) : !isLoadingGoogleEvents && combinedEvents.length === 0 ? (
              <p className="text-muted-foreground italic">No hay eventos para este día.</p>
            ) : (
              <ul className="space-y-3">
                {combinedEvents.map((event) => (
                  <li key={event.id} className="p-3 border rounded-md shadow-sm bg-card flex justify-between items-start gap-1">
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 text-blue-500 flex-shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <h4 className="font-medium text-card-foreground">{event.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.displayTime}</p>
                      {event.description && <p className="text-sm text-muted-foreground mt-1 truncate">{event.description.split('\n')[0]}</p>}
                      {event.location && (
                        <p className="text-xs text-muted-foreground mt-1">Lugar: {event.location}</p>
                      )}
                       {event.googleMeetLink && (
                        <a href={event.googleMeetLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center mt-1">
                            <Video className="mr-1 h-3 w-3"/> Unirse a Google Meet
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                       {(event.type === 'google' || event.type === 'local') && (
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteEvent(event)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                        {event.htmlLink && (
                          <a href={event.htmlLink} target="_blank" rel="noopener noreferrer" title="Ver en Google Calendar">
                            <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Ver en Google Calendar">
                                <ExternalLink className="h-4 w-4 text-blue-500" />
                            </Button>
                          </a>
                        )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <Separator className="my-6" />

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center text-foreground">
              <PlusCircle className="mr-2 h-5 w-5 text-primary" />
              Añadir Actividad
            </h3>
             <div className="flex gap-2">
                <Input 
                    placeholder="Ej: Cita con el dentista"
                    value={newActivityTitle}
                    onChange={(e) => setNewActivityTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddActivityClick()}
                />
                <Button onClick={handleAddActivityClick} size="icon" aria-label="Añadir Actividad" disabled={!newActivityTitle.trim()}>
                    <PlusCircle className="h-5 w-5"/>
                </Button>
             </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center text-foreground">
              <PartyPopper className="mr-2 h-5 w-5 text-primary" />
              Añadir Celebración Anual
            </h3>
             <div className="flex gap-2">
                <Input 
                    placeholder="Ej: Cumpleaños de Juan"
                    value={newCelebrationTitle}
                    onChange={(e) => setNewCelebrationTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCelebrationClick()}
                />
                <Button onClick={handleAddCelebrationClick} size="icon" aria-label="Añadir Celebración" disabled={!newCelebrationTitle.trim()}>
                    <PlusCircle className="h-5 w-5"/>
                </Button>
             </div>
          </div>
        </ScrollArea>

        <SheetFooter className="p-6 border-t flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
