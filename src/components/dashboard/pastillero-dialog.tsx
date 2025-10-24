
"use client";

import { useState, useMemo } from 'react';
import { format, getDay } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { MedicationReminder, MedicationTakenLog } from '@/lib/types';
import { Pill, PlusCircle, Trash2, Clock, CalendarDays, X } from 'lucide-react';
import { es } from 'date-fns/locale';

interface PastilleroDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reminders: MedicationReminder[];
  takenLog: MedicationTakenLog;
  onAddReminder: (reminder: Omit<MedicationReminder, 'id'>) => void;
  onDeleteReminder: (id: string) => void;
  onToggleTaken: (medicationId: string, date: string, time: string) => void;
}

const daysOfWeekOptions = [
  { id: 1, label: 'Lu', value: 1 }, { id: 2, label: 'Ma', value: 2 }, { id: 3, label: 'Mi', value: 3 },
  { id: 4, label: 'Ju', value: 4 }, { id: 5, label: 'Vi', value: 5 }, { id: 6, label: 'Sá', value: 6 },
  { id: 0, label: 'Do', value: 0 }
];

export default function PastilleroDialog({
  isOpen,
  onOpenChange,
  reminders,
  takenLog,
  onAddReminder,
  onDeleteReminder,
  onToggleTaken,
}: PastilleroDialogProps) {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [newTime, setNewTime] = useState('');
  const [times, setTimes] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [notes, setNotes] = useState('');

  const todayKey = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
  const todayDayOfWeek = useMemo(() => getDay(new Date()), []);

  const handleAddTime = () => {
    if (newTime && !times.includes(newTime) && /^([01]\d|2[0-3]):([0-5]\d)$/.test(newTime)) {
      setTimes(prev => [...prev, newTime].sort());
      setNewTime('');
    }
  };

  const handleRemoveTime = (timeToRemove: string) => {
    setTimes(prev => prev.filter(t => t !== timeToRemove));
  };

  const handleDayToggle = (dayValue: number) => {
    setSelectedDays(prev =>
      prev.includes(dayValue) ? prev.filter(d => d !== dayValue) : [...prev, dayValue].sort()
    );
  };

  const resetForm = () => {
    setName('');
    setDose('');
    setTimes([]);
    setNewTime('');
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    setNotes('');
  };

  const handleAddReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && times.length > 0 && selectedDays.length > 0) {
      onAddReminder({ name: name.trim(), dose, times, daysOfWeek: selectedDays, notes });
      resetForm();
    }
  };

  const getDayLabel = (dayValue: number) => {
    const day = daysOfWeekOptions.find(d => d.value === dayValue);
    return day ? day.label : '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) resetForm(); }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Pill className="mr-2 h-6 w-6 text-primary" />
            Pastillero
          </DialogTitle>
          <DialogDescription>
            Administra tus recordatorios de medicamentos y marca tus tomas.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-3 mt-4">
          <form onSubmit={handleAddReminderSubmit} className="space-y-4 p-1 mb-6 border rounded-lg shadow-sm bg-card">
            <h3 className="text-lg font-medium text-card-foreground px-4 pt-4">Añadir Nuevo Recordatorio</h3>
            <div className="px-4 space-y-3">
              <Input placeholder="Nombre del medicamento" value={name} onChange={e => setName(e.target.value)} required />
              <Input placeholder="Dosis (ej: 1 comprimido, 10mg)" value={dose} onChange={e => setDose(e.target.value)} />
              <div>
                <Label htmlFor="med-time" className="flex items-center mb-1"><Clock className="mr-1 h-4 w-4" />Horarios</Label>
                <div className="flex gap-2">
                  <Input id="med-time" type="time" value={newTime} onChange={e => setNewTime(e.target.value)} />
                  <Button type="button" onClick={handleAddTime} size="icon" variant="outline">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                {times.length > 0 && (
                  <div className="mt-2 space-x-1">
                    {times.map(t => (
                      <span key={t} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        {t}
                        <Button type="button" onClick={() => handleRemoveTime(t)} variant="ghost" size="icon" className="ml-1 h-4 w-4">
                          <X className="h-3 w-3" />
                        </Button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label className="flex items-center mb-1"><CalendarDays className="mr-1 h-4 w-4" />Días de la Semana</Label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeekOptions.map(day => (
                    <Button
                      key={day.id}
                      type="button"
                      variant={selectedDays.includes(day.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDayToggle(day.value)}
                      className="w-10 h-10"
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
              </div>
              <Textarea placeholder="Notas adicionales (opcional)" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div className="px-4 pb-4">
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-4 w-4" />Añadir Recordatorio
                </Button>
            </div>
          </form>

          <Separator className="my-4" />

          <div>
            <h3 className="text-lg font-medium mb-2">Mis Recordatorios</h3>
            {reminders.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No hay recordatorios guardados.</p>
            ) : (
              <ul className="space-y-3">
                {reminders.map(reminder => {
                  const applicableTimesToday = reminder.daysOfWeek.includes(todayDayOfWeek) ? reminder.times : [];
                  return (
                    <li key={reminder.id} className="p-3 border rounded-md shadow-sm bg-card">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-card-foreground">{reminder.name}</h4>
                          {reminder.dose && <p className="text-sm text-muted-foreground">{reminder.dose}</p>}
                          <p className="text-xs text-muted-foreground">
                            Horas: {reminder.times.join(', ')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Días: {reminder.daysOfWeek.map(d => getDayLabel(d)).join(', ') || 'Ninguno'}
                          </p>
                          {reminder.notes && <p className="text-xs text-muted-foreground mt-1">Notas: {reminder.notes}</p>}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteReminder(reminder.id)} aria-label="Eliminar recordatorio">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      {applicableTimesToday.length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <h5 className="text-xs font-medium mb-1">Tomas de hoy ({format(new Date(), 'PPP', { locale: es })}):</h5>
                          <div className="space-y-1">
                            {applicableTimesToday.map(time => (
                              <div key={time} className="flex items-center justify-between text-sm">
                                <Label htmlFor={`taken-${reminder.id}-${time}`} className="flex items-center gap-2">
                                  <Checkbox
                                    id={`taken-${reminder.id}-${time}`}
                                    checked={!!(takenLog[reminder.id]?.[todayKey]?.[time])}
                                    onCheckedChange={() => onToggleTaken(reminder.id, todayKey, time)}
                                  />
                                  {time}
                                </Label>
                                {takenLog[reminder.id]?.[todayKey]?.[time] && <span className="text-xs text-green-600">Tomado</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => { onOpenChange(false); resetForm(); }}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
