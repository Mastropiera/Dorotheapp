import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import type { LocalEvent } from '@/lib/types';

const LOCAL_EVENTS_KEY = 'agendita_local_events';

export function useLocalEvents(userId: string) {
  const [localEvents, setLocalEvents] = useLocalStorage<LocalEvent[]>(LOCAL_EVENTS_KEY, []);
  const [isLoading, setIsLoading] = useState(true);
  const { isOnline, addToSyncQueue } = useOfflineSync(userId);

  // Cargar eventos desde Firestore cuando hay conexión
  useEffect(() => {
    if (!userId || !isOnline) {
      setIsLoading(false);
      return;
    }

    const colRef = collection(db, 'users', userId, 'calendar');

    // Usar listener en tiempo real para mantener sincronizado
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const events: LocalEvent[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          events.push({
            id: doc.id,
            date: data.date,
            title: data.title,
            shiftType: data.shiftType,
            type: 'shift',
          });
        });
        
        // Actualizar localStorage con los datos de Firestore
        setLocalEvents(events);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading events from Firestore:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, isOnline]);

  // Agregar evento (funciona offline)
  const addEvent = useCallback((event: Omit<LocalEvent, 'id'>) => {
    const newEvent: LocalEvent = {
      ...event,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // Guardar localmente primero
    setLocalEvents((prev) => [...prev, newEvent]);

    // Agregar a la cola de sincronización
    if (userId) {
      addToSyncQueue(newEvent.id, 'create', 'calendar', {
        date: newEvent.date,
        title: newEvent.title,
        shiftType: newEvent.shiftType,
        type: newEvent.type,
      });
    }

    return newEvent;
  }, [userId, addToSyncQueue, setLocalEvents]);

  // Actualizar evento (funciona offline)
  const updateEvent = useCallback((id: string, updates: Partial<LocalEvent>) => {
    setLocalEvents((prev) => {
      const updated = prev.map((event) =>
        event.id === id ? { ...event, ...updates } : event
      );
      
      // Agregar a la cola de sincronización
      const updatedEvent = updated.find(e => e.id === id);
      if (updatedEvent && userId) {
        addToSyncQueue(id, 'update', 'calendar', {
          date: updatedEvent.date,
          title: updatedEvent.title,
          shiftType: updatedEvent.shiftType,
          type: updatedEvent.type,
        });
      }
      
      return updated;
    });
  }, [userId, addToSyncQueue, setLocalEvents]);

  // Eliminar evento (funciona offline)
  const deleteEvent = useCallback((id: string) => {
    setLocalEvents((prev) => prev.filter((event) => event.id !== id));

    // Agregar a la cola de sincronización
    if (userId) {
      addToSyncQueue(id, 'delete', 'calendar', {});
    }
  }, [userId, addToSyncQueue, setLocalEvents]);

  // Obtener eventos por fecha
  const getEventsByDate = useCallback((date: string) => {
    return localEvents.filter((event) => event.date === date);
  }, [localEvents]);

  // Limpiar todos los eventos locales (útil para logout)
  const clearLocalEvents = useCallback(() => {
    setLocalEvents([]);
  }, [setLocalEvents]);

  return {
    events: localEvents,
    isLoading,
    isOnline,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
    clearLocalEvents,
  };
}