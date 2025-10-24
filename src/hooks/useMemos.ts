"use client";

import { useState, useCallback, useEffect } from "react";
import type { MemoEntry } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export function useMemos(initialMemos: MemoEntry[] = []) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [memos, setMemos] = useState<MemoEntry[]>(initialMemos);

  // Guardar en Firestore
  const saveMemos = useCallback(
    async (data: MemoEntry[]) => {
      if (!user) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { memos: data }, { merge: true });
      } catch (error) {
        console.error("Error guardando notas:", error);
        toast({
          title: "Error al guardar",
          description: "No se pudieron guardar tus notas.",
          variant: "destructive",
        });
      }
    },
    [user, toast]
  );

  useEffect(() => {
    saveMemos(memos);
  }, [memos, saveMemos]);

  // Handlers
  const addMemo = (memoData: Omit<MemoEntry, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newMemo: MemoEntry = {
      ...memoData,
      id: crypto.randomUUID(),
      color: memoData.color || "yellow",
      createdAt: now,
      updatedAt: now,
    };
    setMemos((prev) => [newMemo, ...prev].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    toast({ title: "Nota añadida", description: `La nota "${newMemo.title}" fue creada.` });
  };

  const updateMemo = (updatedMemo: MemoEntry) => {
    setMemos((prev) =>
      prev
        .map((m) =>
          m.id === updatedMemo.id ? { ...updatedMemo, updatedAt: new Date().toISOString() } : m
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    );
    toast({ title: "Nota actualizada", description: `La nota "${updatedMemo.title}" fue actualizada.` });
  };

  const deleteMemo = (memoId: string) => {
    setMemos((prev) => prev.filter((m) => m.id !== memoId));
    toast({ title: "Nota eliminada", variant: "destructive" });
  };

  return {
    memos,
    addMemo,
    updateMemo,
    deleteMemo,
  };
}
