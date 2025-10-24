
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { MedicationReminder, Celebration, GoogleCalendarEvent, AlarmSound, DisplayableEvent } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PartyPopper, ListChecks, Pill, Mic, Gift, Loader2, CalendarClock } from 'lucide-react';
import { format, parseISO, startOfDay, addDays, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { textToSpeech } from '@/ai/flows/tts-flow';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';

interface WelcomeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  todaysEvents: GoogleCalendarEvent[];
  tomorrowsEvents: GoogleCalendarEvent[];
  todaysMedications: MedicationReminder[];
  todaysCelebrations?: Celebration[];
  tomorrowsCelebrations?: Celebration[];
  isLoadingEvents?: boolean;
  alarmSound: AlarmSound;
}

const BIRTHDAY_KEYWORDS = ['cumpleaños', 'cumple', 'aniversario', 'birthday', 'hbday', 'felicitaciones'];

export default function WelcomeDialog({
  isOpen,
  onOpenChange,
  userName,
  todaysEvents,
  tomorrowsEvents,
  todaysMedications,
  todaysCelebrations = [],
  tomorrowsCelebrations = [],
  isLoadingEvents = false,
  alarmSound,
}: WelcomeDialogProps) {
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const announcementAudioRef = useRef<HTMLAudioElement>(null);
  const alarmAudioRef = useRef<HTMLAudioElement>(null);
  const hasTriggeredAudio = useRef(false);
  
  const getDisplayableEvents = (events: GoogleCalendarEvent[], dateForFallback: Date): DisplayableEvent[] => {
      return events.map(gEvent => {
        let startTime: Date;
        let isAllDay = false;
        let displayTime = "Todo el día";

        if (gEvent.start.dateTime) {
            startTime = parseISO(gEvent.start.dateTime);
            if (isValid(startTime)) {displayTime = format(startTime, "HH:mm", { locale: es });}
            else { startTime = startOfDay(dateForFallback); displayTime = "Hora inválida"; }
        } else if (gEvent.start.date) {
            startTime = startOfDay(parseISO(gEvent.start.date));
            isAllDay = true;
        } else {
            startTime = startOfDay(dateForFallback);
            isAllDay = true;
        }
        return {
            id: `google-${gEvent.id}`, title: gEvent.summary, startTime, isAllDay,
            type: 'google' as const, source: gEvent, displayTime, description: gEvent.description,
            htmlLink: gEvent.htmlLink, location: gEvent.location, googleMeetLink: gEvent.hangoutLink,
        };
      }).sort((a, b) => {
        if (a.isAllDay && !b.isAllDay) {return -1;}
        if (!a.isAllDay && b.isAllDay) {return 1;}
        return a.startTime.getTime() - b.startTime.getTime();
      });
  };

  const displayableTodaysEvents: DisplayableEvent[] = useMemo(() => getDisplayableEvents(todaysEvents, new Date()), [todaysEvents]);
  const displayableTomorrowsEvents: DisplayableEvent[] = useMemo(() => getDisplayableEvents(tomorrowsEvents, addDays(new Date(), 1)), [tomorrowsEvents]);

  const todaysBirthdays = useMemo(() => {
    return todaysCelebrations.filter(cel => 
      BIRTHDAY_KEYWORDS.some(keyword => cel.title.toLowerCase().includes(keyword))
    );
  }, [todaysCelebrations]);
  
  const tomorrowsBirthdays = useMemo(() => {
    return tomorrowsCelebrations.filter(cel => 
      BIRTHDAY_KEYWORDS.some(keyword => cel.title.toLowerCase().includes(keyword))
    );
  }, [tomorrowsCelebrations]);

  const nextMedicationDoses = useMemo(() => {
    const now = new Date();
    const currentTimeStr = format(now, 'HH:mm');
    
    return todaysMedications.map(med => {
      const upcomingTimes = med.times
        .filter(time => time >= currentTimeStr)
        .sort();
      return upcomingTimes.length > 0 ? { ...med, nextDoseTime: upcomingTimes[0] } : null;
    }).filter((med): med is (MedicationReminder & { nextDoseTime: string }) => med !== null);
  }, [todaysMedications]);


  useEffect(() => {
    if (isOpen && userName && !isLoadingEvents && !hasTriggeredAudio.current) {
        hasTriggeredAudio.current = true;
        
        const generateAndPlayAudio = async () => {
            setIsLoadingAudio(true);
            
            let speechText = `Hola ${userName}. `;
            let hasContentForSpeech = false;

            if (displayableTodaysEvents.length > 0) {
                speechText += `Para hoy tienes en tu calendario: `;
                displayableTodaysEvents.slice(0, 2).forEach(event => {
                    speechText += `${event.title} ${event.isAllDay ? 'todo el día' : `a las ${event.displayTime}`}. `;
                });
                hasContentForSpeech = true;
            }

            if (nextMedicationDoses.length > 0) {
                speechText += `Recuerda tu próxima dosis de medicamentos: `;
                nextMedicationDoses.slice(0, 2).forEach(med => {
                speechText += `${med.name} a las ${med.nextDoseTime}. `;
                });
                hasContentForSpeech = true;
            }

            if (todaysBirthdays.length > 0) {
                speechText += `Y no olvides que hoy es: `;
                todaysBirthdays.slice(0, 1).forEach(bday => {
                    speechText += `${bday.title}. `;
                });
                hasContentForSpeech = true;
            }
            
            if (displayableTomorrowsEvents.length > 0) {
                speechText += `Mañana tienes programado: ${displayableTomorrowsEvents[0].title}. `;
                hasContentForSpeech = true;
            }

            if (!hasContentForSpeech) {
                speechText += `No tienes nada destacado programado. `;
            }

            speechText += `¡Que tengas un excelente día!`;
            
            try {
                const generatedUrl = await textToSpeech(speechText);
                setAudioUrl(generatedUrl);
            } catch (error) {
                console.error("Failed to generate welcome TTS audio:", error);
            } finally {
                setIsLoadingAudio(false);
            }
        };

        generateAndPlayAudio();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userName, isLoadingEvents]);

  useEffect(() => {
    const alarmAudio = alarmAudioRef.current;
    const announcementAudio = announcementAudioRef.current;
    let announcementTimeout: NodeJS.Timeout;

    if (isOpen && audioUrl && announcementAudio && alarmAudio) {
        const playAnnouncement = () => {
            announcementTimeout = setTimeout(() => {
                announcementAudio.play().catch(e => console.error("Error playing announcement:", e));
            }, 100);
        };

        alarmAudio.addEventListener('ended', playAnnouncement);
        
        alarmAudio.play().catch(e => {
            console.error("Error playing alarm sound:", e);
            playAnnouncement();
        });
        
        return () => {
            clearTimeout(announcementTimeout);
            if(alarmAudio) {
              alarmAudio.removeEventListener('ended', playAnnouncement);
              alarmAudio.pause();
              alarmAudio.currentTime = 0;
            }
            if (announcementAudio) {
                announcementAudio.pause();
                announcementAudio.currentTime = 0;
            }
        };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, audioUrl]);


  useEffect(() => {
    if (!isOpen) {
      setAudioUrl(null);
      setIsLoadingAudio(false);
      hasTriggeredAudio.current = false;
    }
  }, [isOpen]);

  const renderSection = (title: string, icon: React.ReactNode, items: React.ReactNode[], isLoading: boolean, loadingText: string) => {
    if (isLoading) {
      return (
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center">{icon}{loadingText}</h3>
          <div className="space-y-2 pl-7"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
        </div>
      );
    }
    if (items.length === 0) return null;
    return (
      <div>
        <h3 className="font-semibold text-lg mb-2 flex items-center">{icon}{title}</h3>
        <ul className="list-disc pl-7 space-y-1 text-sm">{items}</ul>
      </div>
    );
  };
  
  const hasTodayContent = displayableTodaysEvents.length > 0 || nextMedicationDoses.length > 0 || todaysBirthdays.length > 0;
  const hasTomorrowContent = displayableTomorrowsEvents.length > 0 || tomorrowsBirthdays.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <PartyPopper className="mr-2 h-6 w-6 text-primary" />
            Resumen de Actividades
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-3 my-4">
            <div className="space-y-4">
                <p className="text-lg">¡Hola, ${userName}!</p>
                
                {renderSection( "Eventos para hoy:", <ListChecks className="mr-2 h-5 w-5 text-blue-500" />,
                    displayableTodaysEvents.map(event => <li key={event.id}>{event.title} <span className="text-muted-foreground">{event.isAllDay ? 'todo el día' : `a las ${event.displayTime}`}</span></li>),
                    isLoadingEvents, "Cargando eventos..."
                )}
                
                {renderSection("Próximas dosis de hoy:", <Pill className="mr-2 h-5 w-5 text-green-500" />,
                    nextMedicationDoses.map(med => <li key={med.id}>{med.name} {med.dose ? `(${med.dose})` : ''} <span className="text-muted-foreground">a las ${med.nextDoseTime}</span></li>),
                    false, ""
                )}

                {renderSection("Celebraciones de hoy:", <Gift className="mr-2 h-5 w-5 text-pink-500" />,
                    todaysBirthdays.map(bday => <li key={bday.id}>{bday.title}</li>),
                    false, ""
                )}

                {!isLoadingEvents && !hasTodayContent && !hasTomorrowContent && (
                    <p className="text-muted-foreground italic text-center py-4">No tienes eventos, medicamentos, ni celebraciones especiales programadas para hoy o mañana. ¡Disfruta tu día!</p>
                )}

                {hasTomorrowContent && (
                    <>
                        <Separator className="my-4" />
                        <h3 className="font-semibold text-xl mb-2 flex items-center"><CalendarClock className="mr-2 h-5 w-5 text-purple-500" />Para mañana...</h3>
                         {renderSection( "Eventos para mañana:", <ListChecks className="mr-2 h-5 w-5 text-blue-500" />,
                            displayableTomorrowsEvents.map(event => <li key={event.id}>{event.title} <span className="text-muted-foreground">{event.isAllDay ? 'todo el día' : `a las ${event.displayTime}`}</span></li>),
                            isLoadingEvents, "Cargando eventos de mañana..."
                        )}
                        {renderSection("Celebraciones de mañana:", <Gift className="mr-2 h-5 w-5 text-pink-500" />,
                            tomorrowsCelebrations.map(bday => <li key={bday.id}>{bday.title}</li>),
                            false, ""
                        )}
                    </>
                )}
            </div>
        </ScrollArea>
        <div className="text-xs text-muted-foreground flex items-center justify-center">
            {isLoadingAudio ? (
              <> <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Generando saludo... </>
            ) : (
              <> <Mic className="mr-1 h-3 w-3" /> El resumen se ha leído en voz alta. </>
            )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="bg-primary hover:bg-primary/90">
            Entendido
          </Button>
        </DialogFooter>
        
        <audio ref={alarmAudioRef} src={alarmSound.src} preload="auto" />
        {audioUrl && <audio ref={announcementAudioRef} src={audioUrl} preload="auto" />}
      </DialogContent>
    </Dialog>
  );
}
