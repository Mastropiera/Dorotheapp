"use client";
import { useState } from 'react';
import { PRESET_SHIFTS } from "@/lib/shifts";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGoogleApi } from '@/contexts/google-api-context';
import type { ShiftType, LocalEvent } from '@/lib/types';
import { Briefcase, PlusCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, addHours, parse } from 'date-fns';
import { Separator } from '../ui/separator';

interface ShiftSelectorProps {
  selectedDate: Date;
  onAddLocalEvent: (event: Omit<LocalEvent, 'id'>) => void;
}

export default function ShiftSelector({ selectedDate, onAddLocalEvent }: ShiftSelectorProps) {
  const { isAuthorized } = useGoogleApi();
  const { toast } = useToast();

  const [customStartTime, setCustomStartTime] = useState('08:00');
  const [customDuration, setCustomDuration] = useState(8);

  const handleShiftSelect = async (shiftType: ShiftType) => {
    const shiftDetails = PRESET_SHIFTS.find(s => s.value === shiftType);
    if (!shiftDetails) return;
    
    // La lógica de si guardar en Google o local ahora la maneja el hook
    onAddLocalEvent({
        title: shiftDetails.name,
        date: format(selectedDate, 'yyyy-MM-dd'),
        type: 'shift',
        shiftType: shiftDetails.value
    });
  };
  
  const handleAddCustomShift = () => {
    if (!customStartTime || customDuration <= 0) {
        toast({
            title: "Datos incompletos",
            description: "Por favor, ingresa una hora de inicio y una duración válida.",
            variant: "destructive"
        });
        return;
    }

    const startDate = parse(customStartTime, 'HH:mm', selectedDate);
    const endDate = addHours(startDate, customDuration);
    const title = `Turno Personalizado (${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')})`;

    onAddLocalEvent({
        title,
        date: format(selectedDate, 'yyyy-MM-dd'),
        type: 'shift',
        shiftType: 'custom',
        start: startDate.toISOString(),
        end: endDate.toISOString(),
    });
    
    toast({
        title: "Turno Personalizado Creado",
        description: `Se añadió "${title}" a tu plan.`,
    });
  };

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${selectedDate.toISOString().substring(0,10).replace(/-/g,'')}/${selectedDate.toISOString().substring(0,10).replace(/-/g,'')}`;

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-3 flex items-center text-foreground">
        <Briefcase className="mr-2 h-5 w-5 text-primary" />
        Turnos de Trabajo
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {PRESET_SHIFTS.filter(s => s.value !== 'custom').map((shift) => (
          <Button
            key={shift.value}
            variant="outline"
            onClick={() => handleShiftSelect(shift.value)}
            className="h-12"
          >
            <span
              className="w-5 h-5 rounded-full mr-2"
              style={{ backgroundColor: shift.backgroundColor }}
            ></span>
            {shift.name}
          </Button>
        ))}
      </div>
       {isAuthorized && (
          <Button variant="outline" asChild className="mt-4 w-full">
              <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir evento/turno en Google
              </a>
          </Button>
      )}

      <Separator className="my-4" />

      <div>
        <h4 className="font-medium text-sm mb-2 flex items-center">
            <Clock className="mr-2 h-4 w-4 text-primary" />
            Añadir Turno Personalizado
        </h4>
        <div className="flex gap-2">
            <div className="flex-1">
                <Label htmlFor="start-time" className="text-xs">Inicio</Label>
                <Input id="start-time" type="time" value={customStartTime} onChange={(e) => setCustomStartTime(e.target.value)} />
            </div>
            <div className="flex-1">
                <Label htmlFor="duration" className="text-xs">Duración (hrs)</Label>
                <Input id="duration" type="number" value={customDuration} onChange={(e) => setCustomDuration(Number(e.target.value))} min="1" />
            </div>
        </div>
        <Button onClick={handleAddCustomShift} className="mt-2 w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Turno Personalizado
        </Button>
      </div>

    </div>
  );
}
