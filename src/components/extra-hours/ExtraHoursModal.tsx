"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export interface ExtraHourEntry {
  id: string;
  date: string;
  hours: number;
  notes?: string;
}

export interface ExtraHoursModalProps {
  open: boolean; // controla visibilidad
  onClose: () => void;
  date?: string;
  addExtraHours: (entry: ExtraHourEntry) => void;
}

export default function ExtraHoursModal({
  open,
  onClose,
  date,
  addExtraHours,
}: ExtraHoursModalProps) {
  const [hours, setHours] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");

  const handleAdd = () => {
    if (!date) return;
    addExtraHours({
      id: crypto.randomUUID(),
      date,
      hours,
      notes,
    });
    setHours(1);
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar horas extra</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p>Fecha: {date}</p>
          <div>
            <label className="block text-sm font-medium mb-1">Horas</label>
            <Input
              type="number"
              value={hours}
              min={0.5}
              step={0.5}
              onChange={(e) => setHours(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notas</label>
            <Input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Opcional"
            />
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleAdd}>Agregar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
