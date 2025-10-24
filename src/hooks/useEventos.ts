"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { useGoogleApi } from '@/contexts/google-api-context';
import type { GoogleCalendarEvent } from "@/lib/types/google-calendar";
import type { MenstrualData, MenstrualCycleSettings } from "@/lib/types/cycles";
import type { SavedShoppingList } from "@/lib/types/todos";
import type { LocalEvent } from "@/lib/types/calendar";

export function useEventos(
  initialLocalEvents: LocalEvent[] = [],
  initialShoppingLists: SavedShoppingList[] = [],
  initialMenstrualData: MenstrualData
) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    isAuthorized: isGoogleApiAuthorized, 
    getGoogleCalendarEvents: fetchGoogleEvents,
    createGoogleAllDayEvent,
    createGoogleShiftEvent,
    deleteGoogleCalendarEvent,
  } = useGoogleApi();

  const [localEvents, setLocalEvents] = useState<LocalEvent[]>(initialLocalEvents);
  const [savedShoppingLists, setSavedShoppingLists] = useState<SavedShoppingList[]>(initialShoppingLists);
  const [menstrualData, setMenstrualData] = useState<MenstrualData>(initialMenstrualData);
  
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isLoadingGoogleEvents, setIsLoadingGoogleEvents] = useState(false);
  const [googleApiError, setGoogleApiError] = useState<string | null>(null);

  const [pendingSyncEvents, setPendingSyncEvents] = useState<LocalEvent[]>([]);
  const [mergedEvents, setMergedEvents] = useState<LocalEvent[]>(initialLocalEvents);

  const saveUserData = useCallback(
    async (field: string, data: any) => {
      if (!user) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { [field]: data }, { merge: true });
      } catch (error) {
        console.error(`Error guardando ${field}:`, error);
        toast({
          title: "Error al guardar",
          description: "No se pudieron guardar los datos.",
          variant: "destructive",
        });
      }
    },
    [user, toast]
  );

  useEffect(() => { saveUserData("localEvents", localEvents); }, [localEvents, saveUserData]);
  useEffect(() => { saveUserData("savedShoppingLists", savedShoppingLists); }, [savedShoppingLists, saveUserData]);
  useEffect(() => { saveUserData("menstrualData", menstrualData); }, [menstrualData, saveUserData]);
  
  const refreshGoogleEvents = useCallback(async (date: Date) => {
    if (!isGoogleApiAuthorized) {
        setMergedEvents(localEvents); 
        return;
    };

    setIsLoadingGoogleEvents(true);
    setGoogleApiError(null);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    try {
      const events = await fetchGoogleEvents(start, end);
      setGoogleCalendarEvents(events);
      
      const googleEventIds = new Set(events.map(e => e.id));
      const localEventsSynced = localEvents.filter(le => le.googleEventId && googleEventIds.has(le.googleEventId));
      
      const newMergedEvents: LocalEvent[] = [...localEvents];

      events.forEach(ge => {
          if (ge.id && !localEventsSynced.some(le => le.googleEventId === ge.id)) {
              newMergedEvents.push({
                  id: `google-${ge.id}`,
                  googleEventId: ge.id,
                  title: ge.summary || 'Evento sin título',
                  date: ge.start.date || format(parseISO(ge.start.dateTime!), 'yyyy-MM-dd'),
                  type: 'local', // Tratado como local para la UI
                  syncedToGoogle: true,
              });
          }
      });
      setMergedEvents(newMergedEvents);

    } catch (err: any) {
      setGoogleApiError(err.message || "Error al cargar eventos de Google.");
      setMergedEvents(localEvents);
    } finally {
      setIsLoadingGoogleEvents(false);
    }
  }, [isGoogleApiAuthorized, fetchGoogleEvents, localEvents]);

  const addLocalEvent = useCallback(async (event: Omit<LocalEvent, 'id'>) => {
    const newEvent: LocalEvent = { 
      ...event, 
      id: crypto.randomUUID(),
      syncedToGoogle: false,
      googleEventId: undefined
    };
    
    setLocalEvents(prev => [...prev, newEvent]);
    setMergedEvents(prev => [...prev, newEvent]);
  
    if (isGoogleApiAuthorized) {
      const date = parseISO(event.date);
      let createdEventId: string | undefined | null = null;
      
      if (event.type === 'shift' && event.shiftType) {
        createdEventId = await createGoogleShiftEvent(event.shiftType, date);
      } else {
        createdEventId = await createGoogleAllDayEvent(event.title, date);
      }
      
      if (createdEventId) {
        setLocalEvents(prev => prev.map(e => 
          e.id === newEvent.id ? { ...e, syncedToGoogle: true, googleEventId: createdEventId! } : e
        ));
        toast({ title: "✅ Sincronizado", description: `"${event.title}" guardado en Google Calendar.`});
        refreshGoogleEvents(date);
      } else {
        setPendingSyncEvents(prev => [...prev, newEvent]);
        toast({ title: "📱 Guardado Localmente", description: "Fallo al sincronizar. Se intentará más tarde."});
      }
    } else {
      setPendingSyncEvents(prev => [...prev, newEvent]);
      toast({ title: "📱 Modo Offline", description: "Evento guardado. Se sincronizará después."});
    }
  }, [isGoogleApiAuthorized, createGoogleShiftEvent, createGoogleAllDayEvent, toast, refreshGoogleEvents]);
  
  useEffect(() => {
    const syncPendingEvents = async () => {
      if (!isGoogleApiAuthorized || pendingSyncEvents.length === 0) return;
      
      let successfulSyncs = 0;
      const stillPending: LocalEvent[] = [];

      for (const event of pendingSyncEvents) {
        const date = parseISO(event.date);
        let createdEventId: string | undefined | null = null;
        
        if (event.type === 'shift' && event.shiftType) {
          createdEventId = await createGoogleShiftEvent(event.shiftType, date);
        } else {
          createdEventId = await createGoogleAllDayEvent(event.title, date);
        }
        
        if (createdEventId) {
          setLocalEvents(prev => prev.map(e => 
            e.id === event.id ? { ...e, syncedToGoogle: true, googleEventId: createdEventId! } : e
          ));
          successfulSyncs++;
        } else {
          stillPending.push(event);
        }
      }
      
      setPendingSyncEvents(stillPending);
      
      if (successfulSyncs > 0) {
        toast({ 
          title: "✅ Sincronización Completa", 
          description: `${successfulSyncs} evento(s) pendientes han sido sincronizados.`
        });
        refreshGoogleEvents(new Date()); 
      }
    };
    
    if(isGoogleApiAuthorized && pendingSyncEvents.length > 0) {
      syncPendingEvents();
    }
  }, [isGoogleApiAuthorized, pendingSyncEvents, createGoogleShiftEvent, createGoogleAllDayEvent, toast, refreshGoogleEvents]);


  const deleteLocalEvent = useCallback(async (id: string) => {
      const eventToDelete = localEvents.find(e => e.id === id);
      setLocalEvents(prev => prev.filter(event => event.id !== id));
      setMergedEvents(prev => prev.filter(event => event.id !== id));
      
      if (isGoogleApiAuthorized && eventToDelete?.googleEventId) {
         await deleteGoogleCalendarEvent(eventToDelete.googleEventId);
         refreshGoogleEvents(parseISO(eventToDelete.date));
      }
      toast({ title: "Evento Eliminado", variant: 'destructive' });
  }, [localEvents, isGoogleApiAuthorized, deleteGoogleCalendarEvent, refreshGoogleEvents, toast]);

  const addCelebration = useCallback(async (title: string, date: Date) => {
    await addLocalEvent({
      title,
      date: format(date, 'yyyy-MM-dd'),
      type: 'celebration'
    });
  }, [addLocalEvent]);

  const saveShoppingList = (list: SavedShoppingList) => {
    setSavedShoppingLists((prev) => [list, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
    toast({ title: "Compra Guardada", description: `Tu lista de compras del ${format(parseISO(list.date), "PPP", { locale: es })} fue guardada.` });
  };

  const saveMenstrualData = (settings: MenstrualCycleSettings, newPeriodStartDate?: string) => {
    setMenstrualData(prev => {
        let newRecordedPeriods = [...(prev.recordedPeriods || [])];
        if (newPeriodStartDate) {
            if (!newRecordedPeriods.some(p => p.startDate === newPeriodStartDate)) {
                newRecordedPeriods.push({ id: crypto.randomUUID(), startDate: newPeriodStartDate });
                newRecordedPeriods.sort((a, b) => a.startDate.localeCompare(b.startDate));
            }
        }
        return {
            ...prev,
            settings: settings,
            recordedPeriods: newRecordedPeriods,
        };
    });
    toast({ title: "Configuración guardada", description: "Tu configuración del ciclo menstrual ha sido actualizada."});
  };

  return {
    localEvents: mergedEvents,
    savedShoppingLists,
    menstrualData,
    googleCalendarEvents,
    isLoadingGoogleEvents,
    googleApiError,
    refreshGoogleEvents,
    setGoogleCalendarEvents, 
    setIsLoadingGoogleEvents,
    setGoogleApiError,
    setMenstrualData,
    addLocalEvent,
    deleteLocalEvent,
    addCelebration,
    saveShoppingList,
    saveMenstrualData,
  };
}
