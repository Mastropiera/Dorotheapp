
"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlarmClock, Save, PlusCircle, Trash2, Music } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALARM_SOUNDS } from '@/lib/sounds';
import type { AlarmSound } from '@/lib/types';


interface AlarmSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentAlarmTimes: string[];
  onSaveAlarmTimes: (times: string[]) => void;
  currentSoundId: string;
  onSaveSound: (soundId: string) => void;
}

export default function AlarmSettingsDialog({
  isOpen,
  onOpenChange,
  currentAlarmTimes,
  onSaveAlarmTimes,
  currentSoundId,
  onSaveSound,
}: AlarmSettingsDialogProps) {
  const [times, setTimes] = useState<string[]>(currentAlarmTimes);
  const [newTime, setNewTime] = useState('');
  const [selectedSoundId, setSelectedSoundId] = useState<string>(currentSoundId);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setTimes(currentAlarmTimes);
      setSelectedSoundId(currentSoundId);
      setNewTime('');
    } else {
        // Detener la previsualización del sonido si el diálogo se cierra
        if (previewAudio) {
            previewAudio.pause();
            previewAudio.currentTime = 0;
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentAlarmTimes, currentSoundId]);

  const handleAddTime = () => {
    if (!newTime) {
      toast({ title: "Hora Vacía", description: "Por favor, ingresa una hora.", variant: "destructive" });
      return;
    }
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(newTime)) {
      toast({ title: "Formato de Hora Inválido", description: "Por favor, ingresa una hora válida en formato HH:mm de 24 horas.", variant: "destructive" });
      return;
    }
    if (times.includes(newTime)) {
      toast({ title: "Hora Duplicada", description: "Esta alarma ya ha sido añadida.", variant: "default" });
      return;
    }
    setTimes(prev => [...prev, newTime].sort());
    setNewTime('');
  };

  const handleRemoveTime = (timeToRemove: string) => {
    setTimes(prev => prev.filter(t => t !== timeToRemove));
  };
  
  const handleSoundChange = (soundId: string) => {
    setSelectedSoundId(soundId);
    const sound = ALARM_SOUNDS.find(s => s.id === soundId);
    if (sound) {
        const audio = new Audio(sound.src);
        audio.play().catch(e => console.error("Error playing preview audio", e));
        setPreviewAudio(audio);
    }
  };

  const handleSave = () => {
    onSaveAlarmTimes(times);
    onSaveSound(selectedSoundId);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <AlarmClock className="mr-2 h-5 w-5 text-primary" />
            Configurar Resumen y Sonidos
          </DialogTitle>
          <DialogDescription>
            Añade horas para el resumen de actividades y elige el sonido de notificación.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div>
            <Label htmlFor="alarmSound" className="flex items-center mb-2"><Music className="mr-2 h-4 w-4"/>Sonido de la Alarma</Label>
            <Select value={selectedSoundId} onValueChange={handleSoundChange}>
                <SelectTrigger id="alarmSound">
                    <SelectValue placeholder="Seleccionar sonido..." />
                </SelectTrigger>
                <SelectContent>
                    {ALARM_SOUNDS.map(sound => (
                        <SelectItem key={sound.id} value={sound.id}>{sound.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div>
            <Label htmlFor="newAlarmTime">Horas para Resumen de Actividades (24h)</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="newAlarmTime"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
              <Button type="button" size="icon" variant="outline" onClick={handleAddTime}>
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Añadir Hora</span>
              </Button>
            </div>
          </div>
          
          <div>
            <Label>Horas Activas</Label>
            {times.length === 0 ? (
              <p className="text-sm text-muted-foreground italic mt-2">No hay resúmenes programados.</p>
            ) : (
              <ScrollArea className="h-40 mt-2 border rounded-md p-2">
                <ul className="space-y-2">
                  {times.map(time => (
                    <li key={time} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <span className="font-mono text-lg">{time}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveTime(time)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" /> Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
