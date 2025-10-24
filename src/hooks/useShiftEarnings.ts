// src/hooks/useShiftEarnings.ts
"use client";

import { useState, useCallback, useEffect } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import { startOfMonth, endOfMonth } from 'date-fns';

export interface ExtraHourEntry {
  id: string;
  date: string;
  hours: number;
  notes?: string;
}

export interface ShiftEarningsSettings {
  startDate: Date;
  endDate: Date;
  hourlyRate: number;
  extraHourlyRate: number;
  discountPercent: number;
}

export function useShiftEarnings(
  initialExtraHours: ExtraHourEntry[] = [],
  initialSettings?: Partial<ShiftEarningsSettings>
) {
  const { user } = useAuth();
  const [extraHours, setExtraHours] = useState<ExtraHourEntry[]>(initialExtraHours);
  
  // Configuración por defecto: mes actual
  const defaultSettings: ShiftEarningsSettings = {
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    hourlyRate: 5000,
    extraHourlyRate: 7500,
    discountPercent: 13,
    ...initialSettings
  };
  
  const [settings, setSettings] = useState<ShiftEarningsSettings>(defaultSettings);

  // Sincronizar con Firestore cuando cambian las horas extra
  useEffect(() => {
    if (!user) return;

    const saveToFirestore = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          extraHours: extraHours,
          shiftEarningsSettings: {
            ...settings,
            startDate: settings.startDate.toISOString(),
            endDate: settings.endDate.toISOString()
          }
        });
      } catch (error) {
        console.error("Error saving shift earnings data:", error);
      }
    };

    saveToFirestore();
  }, [extraHours, settings, user]);

  const addExtraHours = useCallback((entry: ExtraHourEntry) => {
    setExtraHours(prev => [...prev, entry]);
  }, []);

  const deleteExtraHours = useCallback((id: string) => {
    setExtraHours(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<ShiftEarningsSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    extraHours,
    settings,
    addExtraHours,
    deleteExtraHours,
    updateSettings,
    setExtraHours
  };
}