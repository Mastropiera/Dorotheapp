
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import MenstrualSettingsForm from '@/components/menstrual-cycle/menstrual-settings-form';
import type { MenstrualCycleSettings, PeriodEntry } from '@/lib/types';
import { HeartPulse } from 'lucide-react';
import { ScrollArea } from "../ui/scroll-area";

interface MiCicloDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentSettings: MenstrualCycleSettings;
  recordedPeriods: PeriodEntry[];
  onSave: (settings: MenstrualCycleSettings, newPeriodStartDate?: string) => void;
}

export default function MiCicloDialog({
  isOpen,
  onOpenChange,
  currentSettings,
  recordedPeriods,
  onSave,
}: MiCicloDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <HeartPulse className="mr-2 h-6 w-6 text-primary" />
            Mi Ciclo Menstrual
          </DialogTitle>
          <DialogDescription>
            Configura y revisa la información de tu ciclo.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-1 pr-3">
            <MenstrualSettingsForm
              currentSettings={currentSettings}
              recordedPeriods={recordedPeriods}
              onSave={onSave}
            />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
