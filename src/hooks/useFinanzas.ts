"use client";

import { useState, useCallback, useEffect } from "react";
import type { IncomeEntry, ManualExpenseEntry } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export function useFinanzas(initialIncome: IncomeEntry[] = [], initialExpenses: ManualExpenseEntry[] = []) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>(initialIncome);
  const [manualExpenseEntries, setManualExpenseEntries] = useState<ManualExpenseEntry[]>(initialExpenses);

  // Guardar ingresos/gastos en Firestore
  const saveFinanzas = useCallback(
    async (field: string, data: any) => {
      if (!user) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { [field]: data }, { merge: true });
      } catch (error) {
        console.error(`Error guardando ${field}:`, error);
        toast({
          title: "Error al guardar",
          description: `No se pudieron guardar tus ${field}.`,
          variant: "destructive",
        });
      }
    },
    [user, toast]
  );

  useEffect(() => {
    saveFinanzas("incomeEntries", incomeEntries);
  }, [incomeEntries, saveFinanzas]);

  useEffect(() => {
    saveFinanzas("manualExpenseEntries", manualExpenseEntries);
  }, [manualExpenseEntries, saveFinanzas]);

  // Handlers Ingresos
  const addIncomeEntry = (entry: Omit<IncomeEntry, "id">) => {
    const newEntry: IncomeEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    setIncomeEntries((prev) =>
      [...prev, newEntry].sort((a, b) => b.date.localeCompare(a.date))
    );
    toast({
      title: "Ingreso añadido",
      description: `${entry.description}: $${entry.amount}`,
    });
  };

  const deleteIncomeEntry = (id: string) => {
    setIncomeEntries((prev) => prev.filter((e) => e.id !== id));
    toast({ title: "Ingreso eliminado", variant: "destructive" });
  };

  // Handlers Gastos
  const addManualExpenseEntry = (entry: Omit<ManualExpenseEntry, "id">) => {
    const newEntry: ManualExpenseEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    setManualExpenseEntries((prev) =>
      [...prev, newEntry].sort((a, b) => b.date.localeCompare(a.date))
    );
    toast({
      title: "Gasto añadido",
      description: `${entry.description}: $${entry.amount}`,
    });
  };

  const deleteManualExpenseEntry = (id: string) => {
    setManualExpenseEntries((prev) => prev.filter((e) => e.id !== id));
    toast({ title: "Gasto eliminado", variant: "destructive" });
  };

  return {
    incomeEntries,
    manualExpenseEntries,
    addIncomeEntry,
    deleteIncomeEntry,
    addManualExpenseEntry,
    deleteManualExpenseEntry,
  };
}
