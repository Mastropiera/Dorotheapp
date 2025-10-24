"use client";

import { setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { useGoogleApi } from "@/contexts/google-api-context";
import { PRESET_SHIFTS } from "@/lib/shifts";
import type { ShiftType } from "@/lib/types";

interface ShiftSchedulerProps {
  selectedDate: Date;
  onSaved?: () => void;
}

export default function ShiftScheduler({ selectedDate, onSaved }: ShiftSchedulerProps) {
  const { user } = useAuth();
  const { isAuthorized, createGoogleShiftEvent } = useGoogleApi();

  async function saveShift(shiftKey: ShiftType) {
    if (!user) return;

    const shift = PRESET_SHIFTS.find(s => s.value === shiftKey);
    if (!shift) return;

    // Crear el documento en Firestore
    const dateKey = selectedDate.toISOString().split("T")[0];
    
    const shiftData = {
      date: dateKey,
      title: shift.name,
      shiftType: shiftKey,
      type: 'shift' as const,
    };

    // Guardar en Firestore
    await setDoc(
      doc(db, "users", user.uid, "calendar", dateKey), 
      shiftData
    );

    // Sincronizar con Google Calendar si está autorizado
    if (isAuthorized) {
      try {
        await createGoogleShiftEvent(shiftKey, selectedDate);
      } catch (error) {
        console.error("Error syncing with Google Calendar:", error);
      }
    }

    if (onSaved) onSaved();
  }

  return (
    <div className="flex flex-col gap-2">
      {PRESET_SHIFTS.map((shift) => (
        <button
          key={shift.value}
          onClick={() => saveShift(shift.value)}
          className="px-4 py-2 rounded text-white font-semibold"
          style={{ backgroundColor: shift.backgroundColor }}
        >
          {shift.symbol} {shift.name}
        </button>
      ))}
    </div>
  );
}