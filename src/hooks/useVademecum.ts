"use client";

import { useState, useCallback, useEffect } from "react";
import type { VademecumEntry } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export function useVademecum(initialEntries: VademecumEntry[] = []) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [vademecumEntries, setVademecumEntries] = useState<VademecumEntry[]>(initialEntries);

  // Guardar en Firestore
  const saveVademecumEntries = useCallback(
    async (entries: VademecumEntry[]) => {
      if (!user) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { vademecumEntries: entries }, { merge: true });
      } catch (error) {
        console.error("Error guardando vademecum:", error);
        toast({
          title: "Error al guardar",
          description: "No se pudieron guardar las fichas de medicamentos.",
          variant: "destructive",
        });
      }
    },
    [user, toast]
  );

  useEffect(() => {
    saveVademecumEntries(vademecumEntries);
  }, [vademecumEntries, saveVademecumEntries]);

  // Handlers
  const addVademecumEntry = (entry: Omit<VademecumEntry, "id">) => {
    const newEntry: VademecumEntry = { ...entry, id: crypto.randomUUID() };
    setVademecumEntries((prev) => [...prev, newEntry]);
    toast({
      title: "Fármaco Añadido",
      description: `La ficha para "${newEntry.name}" ha sido creada.`,
    });
  };

  const updateVademecumEntry = (entry: VademecumEntry) => {
    setVademecumEntries((prev) => prev.map((e) => (e.id === entry.id ? entry : e)));
    toast({
      title: "Fármaco Actualizado",
      description: `La ficha para "${entry.name}" ha sido guardada.`,
    });
  };

  const deleteVademecumEntry = (id: string) => {
    setVademecumEntries((prev) => prev.filter((e) => e.id !== id));
    toast({ title: "Fármaco Eliminado", variant: "destructive" });
  };

  return {
    vademecumEntries,
    addVademecumEntry,
    updateVademecumEntry,
    deleteVademecumEntry,
  };
}