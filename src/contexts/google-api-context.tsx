
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
    tokenClient: any;
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
  const { user } = useAuth();
  const [isGapiReady, setIsGapiReady] = useState(false);
  const [isGisReady, setIsGisReady] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const TOKEN_VERSION_KEY = 'google_token_version';
  const CURRENT_TOKEN_VERSION = '2';

  const clearOldTokenIfNeeded = useCallback(() => {
    if (typeof window === 'undefined') return;
    const savedVersion = localStorage.getItem(TOKEN_VERSION_KEY);
    if (savedVersion !== CURRENT_TOKEN_VERSION) {
      localStorage.removeItem('google_access_token');
      localStorage.setItem(TOKEN_VERSION_KEY, CURRENT_TOKEN_VERSION);
      console.log('Token antiguo eliminado. Se requiere nueva autenticación.');
    }
  }, []);

  const handleGapiLoad = useCallback(() => {
    window.gapi.load('client', () => {
      window.gapi.client.init({}).then(() => {
        setIsGapiReady(true);
      }).catch((err: any) => console.error("Error initializing GAPI client", err));
    });
  }, []);

  const handleGisLoad = useCallback(() => {
    if (window.google && window.google.accounts) {
        window.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: GOOGLE_API_SCOPES,
        prompt: 'consent',
        callback: (tokenResponse: any) => {
            if (tokenResponse.access_token) {
                window.gapi.client.setToken(tokenResponse);
                localStorage.setItem('google_access_token', tokenResponse.access_token);
                setIsAuthorized(true);
                toast({ 
                    title: "✅ Conectado a Google", 
                    description: "Tu calendario ahora se sincronizará automáticamente."
                });
            }
        },
        });
        setIsGisReady(true);
    }
  }, [toast]);

  const logout = useCallback(() => {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem(TOKEN_VERSION_KEY);
    if (window.gapi?.client?.getToken()) {
      const token = window.gapi.client.getToken();
      if (token && window.google) {
        window.google.accounts.oauth2.revoke(token.access_token, () => {
          window.gapi.client.setToken(null);
          setIsAuthorized(false);
          toast({ 
            title: "Desconectado", 
            description: "Tu cuenta de Google ha sido desconectada."
          });
        });
      }
    } else {
      setIsAuthorized(false);
    }
  }, [toast]);
  
  useEffect(() => {
    if (isGapiReady && isGisReady) {
      clearOldTokenIfNeeded();
      const savedToken = localStorage.getItem('google_access_token');
      if (savedToken) {
        window.gapi.client.setToken({ access_token: savedToken });
        window.gapi.client.load('calendar', 'v3').then(() => {
            setIsAuthorized(true);
        }).catch((err: any) => {
            console.error("Error loading calendar API on init", err);
            logout();
        }).finally(() => {
            setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    }
  }, [isGapiReady, isGisReady, logout, clearOldTokenIfNeeded]);


  const login = useCallback(() => {
    if (window.tokenClient) {
      window.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      toast({ 
        title: "Error", 
        description: "El cliente de Google no está listo.", 
        variant: "destructive" 
      });
    }
  }, [toast]);

  const getGoogleCalendarEvents = async (startDate: Date, endDate: Date): Promise<GoogleCalendarEvent[]> => {
    if (!isAuthorized) return [];
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
          toast({ title: "Sesión de Google Expirada", description: "Por favor, vuelve a conectar tu cuenta de Google.", variant: "destructive" });
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
      await window.gapi.client.load('tasks', 'v1');
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
      <Script src="https://accounts.google.com/gsi/client" async defer onLoad={handleGisLoad} />
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
