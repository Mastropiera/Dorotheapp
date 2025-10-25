"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Script from 'next/script';
import { useToast } from "@/hooks/use-toast";
import { GOOGLE_CLIENT_ID, GOOGLE_API_SCOPES } from '@/lib/google-calendar-config';
import type { GoogleCalendarEvent, GoogleTask } from '@/lib/types';
import type { ShiftType } from '@/lib/types/calendar';
import { buildGoogleShiftEvent } from '@/lib/google-shifts';
import { useAuth } from './auth-context';

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

interface GoogleApiContextType {
  isAuthorized: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  getGoogleCalendarEvents: (startDate: Date, endDate: Date) => Promise<GoogleCalendarEvent[]>;
  createGoogleShiftEvent: (shiftType: ShiftType, date: Date) => Promise<string | undefined>;
  createGoogleAllDayEvent: (title: string, date: Date) => Promise<string | undefined>;
  deleteGoogleCalendarEvent: (eventId: string) => Promise<void>;
  getGoogleTasks: () => Promise<GoogleTask[]>;
  addGoogleTask: (title: string) => Promise<GoogleTask | null>;
  updateGoogleTask: (taskId: string, isCompleted: boolean) => Promise<void>;
  deleteGoogleTask: (taskId: string) => Promise<void>;
}

const GoogleApiContext = createContext<GoogleApiContextType | undefined>(undefined);

export const GoogleApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { user, logout: authLogout } = useAuth();
  const [isGapiReady, setIsGapiReady] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleGapiLoad = useCallback(() => {
    window.gapi.load('client', () => {
      window.gapi.client.init({}).then(() => {
        setIsGapiReady(true);
      }).catch((err: any) => console.error("Error initializing GAPI client", err));
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('google_access_token');
    if (window.gapi?.client?.getToken()) {
      window.gapi.client.setToken(null);
    }
    setIsAuthorized(false);
    toast({ 
      title: "Desconectado", 
      description: "Tu cuenta de Google ha sido desconectada."
    });
  }, [toast]);
  
  // Cargar el token automáticamente cuando GAPI esté listo
  useEffect(() => {
    if (isGapiReady && user) {
      const savedToken = localStorage.getItem('google_access_token');
      if (savedToken) {
        window.gapi.client.setToken({ access_token: savedToken });
        
        // Cargar las APIs necesarias
        Promise.all([
          window.gapi.client.load('calendar', 'v3'),
          window.gapi.client.load('tasks', 'v1')
        ])
        .then(() => {
          setIsAuthorized(true);
          console.log('✅ Google Calendar y Tasks cargados automáticamente');
        })
        .catch((err: any) => {
          console.error("Error loading Google APIs:", err);
          // Si hay error, probablemente el token expiró o no tiene los scopes necesarios
          logout();
          toast({
            title: "Reconecta tu cuenta",
            description: "Por favor, cierra sesión y vuelve a iniciar sesión con Google para actualizar los permisos.",
            variant: "default"
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
        // Si no hay token, mostrar mensaje para que inicie sesión
        if (user) {
          toast({
            title: "Conecta Google Calendar",
            description: "Cierra sesión y vuelve a iniciar sesión con Google para sincronizar tu calendario.",
            variant: "default"
          });
        }
      }
    } else if (isGapiReady && !user) {
      setIsLoading(false);
    }
  }, [isGapiReady, user, logout, toast]);

  // La función login ahora simplemente informa al usuario que debe usar el login principal
  const login = useCallback(() => {
    toast({ 
      title: "Usa el login principal", 
      description: "Por favor, cierra sesión y vuelve a iniciar sesión con Google para obtener los permisos necesarios.", 
      variant: "default" 
    });
  }, [toast]);

  const getGoogleCalendarEvents = async (startDate: Date, endDate: Date): Promise<GoogleCalendarEvent[]> => {
    if (!isAuthorized) {
      console.log('❌ No autorizado para Google Calendar');
      return [];
    }
    try {
      const response = await window.gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': startDate.toISOString(),
        'timeMax': endDate.toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 100,
        'orderBy': 'startTime'
      });
      return response.result.items || [];
    } catch (error: any) {
      console.error('Error fetching calendar events:', error?.result?.error?.message || error);
      if (error.status === 401) {
        logout();
        toast({ 
          title: "Sesión de Google Expirada", 
          description: "Por favor, vuelve a iniciar sesión con Google.", 
          variant: "destructive" 
        });
      } else if (error?.result?.error?.message?.includes('insufficient')) {
        toast({ 
          title: "Permisos insuficientes", 
          description: "Cierra sesión y vuelve a iniciar sesión con Google para actualizar los permisos.", 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Error de Calendario", 
          description: `No se pudieron cargar los eventos: ${error?.result?.error?.message || 'Error desconocido.'}`, 
          variant: "destructive" 
        });
      }
      return [];
    }
  };

  const createGoogleShiftEvent = async (shiftType: ShiftType, date: Date): Promise<string | undefined> => {
    if (!isAuthorized) return undefined;

    const event = buildGoogleShiftEvent(shiftType, date);
    if (!event) {
      toast({ title: "Error", description: "Tipo de turno no válido.", variant: "destructive" });
      return undefined;
    }

    try {
      const response = await window.gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event,
      });
      return response.result.id;
    } catch (error: any) {
      console.error('Error creating shift event:', error);
      if (error.status === 401) logout();
      toast({ title: "Error", description: "No se pudo crear el turno en Google Calendar.", variant: "destructive" });
      return undefined;
    }
  };

  const createGoogleAllDayEvent = async (title: string, date: Date): Promise<string | undefined> => {
    if (!isAuthorized) return undefined;

    try {
      const event = {
        'summary': title,
        'start': { 'date': date.toISOString().split('T')[0] },
        'end': { 'date': date.toISOString().split('T')[0] },
      };
      const response = await window.gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event,
      });
      return response.result.id;
    } catch (error: any) {
      console.error('Error creating event:', error);
      if (error.status === 401) logout();
      toast({ title: "Error", description: "No se pudo crear el evento.", variant: "destructive" });
      return undefined;
    }
  };

  const deleteGoogleCalendarEvent = async (eventId: string) => {
    if (!isAuthorized) return;

    try {
      await window.gapi.client.calendar.events.delete({
        'calendarId': 'primary',
        'eventId': eventId,
      });
      toast({ 
        title: "Evento Eliminado", 
        description: "El evento ha sido eliminado de tu Google Calendar."
      });
    } catch (error: any) {
      console.error('Error deleting event:', error);
      if (error.status === 401) logout();
      toast({ 
        title: "Error", 
        description: "No se pudo eliminar el evento.", 
        variant: "destructive" 
      });
    }
  };

  const getGoogleTasks = async (): Promise<GoogleTask[]> => {
    if (!isAuthorized) return [];
    try {
      const taskListsResponse = await window.gapi.client.tasks.tasklists.list({ maxResults: 10 });
      const taskLists = taskListsResponse.result.items;
      if (!taskLists || taskLists.length === 0) return [];

      const taskListId = taskLists[0].id;
      if (!taskListId) return [];

      const tasksResponse = await window.gapi.client.tasks.tasks.list({
        tasklist: taskListId,
        showCompleted: true,
      });

      return (tasksResponse.result.items || []) as GoogleTask[];
    } catch (error: any) {
      console.error('Error fetching Google Tasks:', error);
      if (error.status === 401) logout();
      toast({ 
        title: "Error de Tareas", 
        description: "No se pudieron cargar las tareas de Google Tasks.", 
        variant: "destructive" 
      });
      return [];
    }
  };

  const addGoogleTask = async (): Promise<GoogleTask | null> => { return null; };
  const updateGoogleTask = async () => {};
  const deleteGoogleTask = async () => {};

  return (
    <GoogleApiContext.Provider value={{
      isAuthorized,
      isLoading,
      login,
      logout,
      getGoogleCalendarEvents,
      createGoogleShiftEvent,
      createGoogleAllDayEvent,
      deleteGoogleCalendarEvent,
      getGoogleTasks,
      addGoogleTask,
      updateGoogleTask,
      deleteGoogleTask
    }}>
      <Script src="https://apis.google.com/js/api.js" async defer onLoad={handleGapiLoad} />
      {children}
    </GoogleApiContext.Provider>
  );
};

export const useGoogleApi = (): GoogleApiContextType => {
  const context = useContext(GoogleApiContext);
  if (context === undefined) {
    throw new Error('useGoogleApi debe ser usado dentro de un GoogleApiProvider');
  }
  return context;
};