"use client";

import { useState, useCallback, useEffect } from "react";
import type { MedicationReminder, MedicationTakenLog } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export function useMedicamentos(
  initialReminders: MedicationReminder[] = [],
  initialTakenLog: MedicationTakenLog = {}
) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [medicationReminders, setMedicationReminders] = useState<MedicationReminder[]>(initialReminders);
  const [medicationTakenLog, setMedicationTakenLog] = useState<MedicationTakenLog>(initialTakenLog);

  // Guardar en Firestore
  const saveMedicationData = useCallback(
    async (field: string, data: any) => {
      if (!user) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { [field]: data }, { merge: true });
      } catch (error) {
        console.error(`Error guardando ${field}:`, error);
        toast({
          title: "Error al guardar",
          description: "No se pudieron guardar tus medicamentos.",
          variant: "destructive",
        });
      }
    },
    [user, toast]
  );

  useEffect(() => {
    saveMedicationData("medicationReminders", medicationReminders);
  }, [medicationReminders, saveMedicationData]);

  useEffect(() => {
    saveMedicationData("medicationTakenLog", medicationTakenLog);
  }, [medicationTakenLog, saveMedicationData]);

  // Handlers
  const addMedicationReminder = (reminder: Omit<MedicationReminder, "id">) => {
    const newReminder = { ...reminder, id: crypto.randomUUID() };
    setMedicationReminders((prev) => [...prev, newReminder]);
    toast({
      title: "Recordatorio Añadido",
      description: `Recordatorio para ${reminder.name} guardado.`,
    });
  };

  const deleteMedicationReminder = (reminderId: string) => {
    setMedicationReminders((prev) => prev.filter((r) => r.id !== reminderId));
    setMedicationTakenLog((prevLog) => {
      const { [reminderId]: _, ...restLog } = prevLog;
      return restLog;
    });
    toast({ title: "Recordatorio Eliminado", variant: "destructive" });
  };

  const toggleMedicationTaken = (medicationId: string, date: string, time: string) => {
    setMedicationTakenLog((prevLog) => {
      const newLog = { ...prevLog };
      if (!newLog[medicationId]) {
        newLog[medicationId] = {};
      }
      if (!newLog[medicationId][date]) {
        newLog[medicationId][date] = {};
      }
      newLog[medicationId][date][time] = !newLog[medicationId][date][time];
      return newLog;
    });
  };

  return {
    medicationReminders,
    medicationTakenLog,
    addMedicationReminder,
    deleteMedicationReminder,
    toggleMedicationTaken,
  };
}