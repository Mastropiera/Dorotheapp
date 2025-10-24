
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { MenstrualCycleSettings, PeriodEntry } from "@/lib/types";
import { Settings2, Save, Info, ActivityIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useEffect } from "react";
import { parseISO, differenceInDays, format, isValid } from "date-fns";
import { Separator } from "@/components/ui/separator";

const menstrualSettingsSchema = z.object({
  cycleLength: z.coerce.number().min(15, "Debe ser al menos 15 días.").max(60, "No puede exceder 60 días."),
  periodLength: z.coerce.number().min(1, "Debe ser al menos 1 día.").max(15, "No puede exceder 15 días."),
  lastPeriodDay: z.coerce.number().min(1).max(31).optional(),
  lastPeriodMonth: z.coerce.number().min(1).max(12).optional(),
  lastPeriodYear: z.coerce.number().min(new Date().getFullYear() - 5).max(new Date().getFullYear()).optional(),
}).refine(data => {
    // Si uno de los campos de fecha está lleno, los otros dos también deben estarlo.
    const dateFields = [data.lastPeriodDay, data.lastPeriodMonth, data.lastPeriodYear];
    const filledFields = dateFields.filter(f => f !== undefined).length;
    if (filledFields > 0 && filledFields < 3) {
        return false;
    }
    // Si todos los campos están llenos, validar que sea una fecha real.
    if (filledFields === 3) {
        try {
           const date = new Date(data.lastPeriodYear!, data.lastPeriodMonth! - 1, data.lastPeriodDay!);
           return isValid(date) && date.getFullYear() === data.lastPeriodYear! && (date.getMonth() + 1) === data.lastPeriodMonth! && date.getDate() === data.lastPeriodDay!;
        } catch (e) {
            return false;
        }
    }
    return true;
}, {
  message: "Por favor, ingrese una fecha válida o deje los campos de fecha vacíos.",
  path: ["lastPeriodDay"], 
});


type MenstrualSettingsFormValues = z.infer<typeof menstrualSettingsSchema>;

interface MenstrualSettingsFormProps {
  currentSettings: MenstrualCycleSettings;
  recordedPeriods: PeriodEntry[];
  onSave: (settings: MenstrualCycleSettings, newPeriodStartDate?: string) => void;
}

export default function MenstrualSettingsForm({ currentSettings, recordedPeriods, onSave }: MenstrualSettingsFormProps) {
  const form = useForm<MenstrualSettingsFormValues>({
    resolver: zodResolver(menstrualSettingsSchema),
    defaultValues: {
      cycleLength: currentSettings?.cycleLength || 28,
      periodLength: currentSettings?.periodLength || 5,
    },
  });

  useEffect(() => {
    if (currentSettings) {
        form.reset({
            cycleLength: currentSettings.cycleLength || 28,
            periodLength: currentSettings.periodLength || 5,
        });
    }
  }, [currentSettings, form]);

  function onSubmit(data: MenstrualSettingsFormValues) {
    const { lastPeriodDay, lastPeriodMonth, lastPeriodYear, ...settings } = data;
    let newStartDate: string | undefined = undefined;

    if (lastPeriodDay && lastPeriodMonth && lastPeriodYear) {
      try {
        const date = new Date(lastPeriodYear, lastPeriodMonth - 1, lastPeriodDay);
        if(isValid(date)) {
            newStartDate = format(date, 'yyyy-MM-dd');
        }
      } catch (e) {
          console.error("Error al construir la fecha: ", e);
      }
    }
    onSave(settings, newStartDate);
    // Limpiar los campos de fecha después de guardar
    form.setValue('lastPeriodDay', undefined);
    form.setValue('lastPeriodMonth', undefined);
    form.setValue('lastPeriodYear', undefined);
    form.clearErrors(["lastPeriodDay", "lastPeriodMonth", "lastPeriodYear"]);
  }
  
  const calculatedAverages = useMemo(() => {
    let avgCycleLength: number | null = null;
    let avgPeriodDuration: number | null = null;

    if (!recordedPeriods) return { avgCycleLength, avgPeriodDuration };
    
    const validCycleStartDates = recordedPeriods
      .map(p => p.startDate)
      .sort((a,b) => a.localeCompare(b));
    
    if (validCycleStartDates.length >= 2) {
      const cycleDurations: number[] = [];
      for (let i = 1; i < validCycleStartDates.length; i++) {
        try {
            const prevStartDate = parseISO(validCycleStartDates[i-1]);
            const currStartDate = parseISO(validCycleStartDates[i]);
            cycleDurations.push(differenceInDays(currStartDate, prevStartDate));
        } catch (e) {
            console.error("Error parsing date for cycle length calculation:", e);
        }
      }
      if (cycleDurations.length > 0) {
        avgCycleLength = Math.round(cycleDurations.reduce((sum, len) => sum + len, 0) / cycleDurations.length);
      }
    }

    const completedPeriods = recordedPeriods.filter(p => p.startDate && p.endDate);
    if (completedPeriods.length > 0) {
      const periodDurations: number[] = [];
      completedPeriods.forEach(p => {
        if (p.endDate) { 
            try {
                const startDate = parseISO(p.startDate);
                const endDate = parseISO(p.endDate);
                periodDurations.push(differenceInDays(endDate, startDate) + 1);
            } catch (e) {
                 console.error("Error parsing date for period duration calculation:", e);
            }
        }
      });
      if (periodDurations.length > 0) {
        avgPeriodDuration = Math.round(periodDurations.reduce((sum, len) => sum + len, 0) / periodDurations.length);
      }
    }

    return { avgCycleLength, avgPeriodDuration };
  }, [recordedPeriods]);

  return (
    <Card className="mt-8 shadow-lg border border-border">
      <CardHeader>
        <CardTitle className="text-xl flex items-center text-primary">
          <Settings2 className="mr-2 h-5 w-5" />
          Configuración del Ciclo Menstrual
        </CardTitle>
        <CardDescription>
          Define la duración de tu ciclo y sangrado para mejores predicciones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cycleLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duración Promedio del Ciclo (días)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 28" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="periodLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duración Promedio del Sangrado (días)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div>
                <FormLabel>Registrar Fecha de Inicio del Último Período</FormLabel>
                <div className="flex gap-2 mt-1">
                    <FormField control={form.control} name="lastPeriodDay" render={({ field }) => (
                        <FormItem className="flex-1"><FormControl><Input type="number" placeholder="Día" {...field} value={field.value ?? ''} /></FormControl></FormItem>
                    )}/>
                    <FormField control={form.control} name="lastPeriodMonth" render={({ field }) => (
                        <FormItem className="flex-1"><FormControl><Input type="number" placeholder="Mes" {...field} value={field.value ?? ''} /></FormControl></FormItem>
                    )}/>
                    <FormField control={form.control} name="lastPeriodYear" render={({ field }) => (
                        <FormItem className="flex-1"><FormControl><Input type="number" placeholder="Año" {...field} value={field.value ?? ''} /></FormControl></FormItem>
                    )}/>
                </div>
                 <FormMessage>
                    {form.formState.errors.lastPeriodDay?.message}
                </FormMessage>
                <FormDescription className="text-xs mt-1">
                    Si registras una fecha aquí, se añadirá a tu historial de períodos.
                </FormDescription>
            </div>
            <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              <Save className="mr-2 h-4 w-4" /> Guardar Configuración
            </Button>
          </form>
        </Form>

        <Separator className="my-6" />

        <div>
            <h3 className="text-lg font-medium flex items-center text-primary mb-2">
                <ActivityIcon className="mr-2 h-5 w-5" />
                Resumen de Ciclos Registrados
            </h3>
            {(!recordedPeriods || recordedPeriods.length < 2) && (!calculatedAverages.avgCycleLength && !calculatedAverages.avgPeriodDuration) ? (
                 <p className="text-sm text-muted-foreground italic">No hay suficientes datos registrados para calcular promedios.</p>
            ) : (
                <div className="space-y-2 text-sm">
                    <p>
                        <span className="font-medium">Duración promedio del ciclo (calculado): </span> 
                        {calculatedAverages.avgCycleLength !== null ? `${calculatedAverages.avgCycleLength} días` : 'N/A (se necesitan al menos 2 inicios de periodo)'}
                    </p>
                    <p>
                        <span className="font-medium">Duración promedio del sangrado (calculado): </span>
                        {calculatedAverages.avgPeriodDuration !== null ? `${calculatedAverages.avgPeriodDuration} días` : 'N/A (se necesitan periodos completos registrados)'}
                    </p>
                </div>
            )}
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
                <Info className="w-3 h-3 mr-1" />
                Estos promedios se basan en los datos que has ido marcando en el calendario.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
