"use client";

import { useState, useCallback, useEffect } from "react";
import type { SavedShoppingList } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";

export function useShoppingLists(initialLists: SavedShoppingList[] = []) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [savedShoppingLists, setSavedShoppingLists] = useState<SavedShoppingList[]>(initialLists);

  // Guardar en Firestore
  const saveShoppingLists = useCallback(
    async (data: SavedShoppingList[]) => {
      if (!user) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { savedShoppingLists: data }, { merge: true });
      } catch (error) {
        console.error("Error guardando listas de compras:", error);
        toast({
          title: "Error al guardar",
          description: "No se pudieron guardar tus listas de compras.",
          variant: "destructive",
        });
      }
    },
    [user, toast]
  );

  useEffect(() => {
    saveShoppingLists(savedShoppingLists);
  }, [savedShoppingLists, saveShoppingLists]);

  // Handlers
  const saveShoppingList = (list: SavedShoppingList) => {
    setSavedShoppingLists((prev) =>
      [list, ...prev].sort((a, b) => b.date.localeCompare(a.date))
    );
    toast({
      title: "Compra guardada",
      description: `Lista del ${format(parseISO(list.date), "PPP", { locale: es })} almacenada.`,
    });
  };

  return {
    savedShoppingLists,
    saveShoppingList,
  };
}
