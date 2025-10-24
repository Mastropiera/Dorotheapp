"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Baby, CalendarIcon, Info, RefreshCcw } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format, differenceInDays, addDays, intervalToDuration, startOfDay, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

const edadCorregidaSchema = z.object({
  fechaNacimiento: z.date({ required_error: "La fecha de nacimiento es requerida." }),
  semanasGestacion: z.coerce.number().min(20, "Mínimo 20 semanas.").max(42, "Máximo 42 semanas."),
  fechaCalculo: z.date().optional().default(startOfDay(new Date())),
});

type EdadCorregidaFormValues = z.infer<typeof edadCorregidaSchema>;
type Duration = {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};
function formatDuration(duration: Duration) {
  const parts = [];
  if (duration.years && duration.years > 0) parts.push(`${duration.years} año${duration.years > 1 ? 's' : ''}`);
  if (duration.months && duration.months > 0) parts.push(`${duration.months} mes${duration.months > 1 ? 'es' : ''}`);
  if (duration.days && duration.days > 0) parts.push(`${duration.days} día${duration.days > 1 ? 's' : ''}`);
  if (parts.length === 0 && (duration.years === 0 || duration.months === 0 || duration.days === 0)) return "0 días";
  return parts.join(', ');
}

const EdadCorregidaCalculator: React.FC = () => {
  const [edadCronologica, setEdadCronologica] = useState<string | null>(null);
  const [edadCorregida, setEdadCorregida] = useState<string | null>(null);
  const [diasPrematuridad, setDiasPrematuridad] = useState<number | null>(null);

  const form = useForm<EdadCorregidaFormValues>({
    resolver: zodResolver(edadCorregidaSchema),
    defaultValues: {
      semanasGestacion: undefined,
      fechaCalculo: startOfDay(new Date()),
    },
  });

  const onSubmit = (data: EdadCorregidaFormValues) => {
    const fechaNac = startOfDay(data.fechaNacimiento);
    const fechaCalc = startOfDay(data.fechaCalculo || new Date());

    if (!isValid(fechaNac) || !isValid(fechaCalc) || fechaCalc < fechaNac) {
        setEdadCronologica("Fechas inválidas.");
        setEdadCorregida(null);
        setDiasPrematuridad(null);
        return;
    }

    const semanasTermino = 40;
    const diasPrem = (semanasTermino - data.semanasGestacion) * 7;
    setDiasPrematuridad(diasPrem);

    const duracionCronologica = intervalToDuration({ start: fechaNac, end: fechaCalc });
    setEdadCronologica(formatDuration(duracionCronologica));

    if (diasPrem <= 0) { // A término o post-término
      setEdadCorregida(formatDuration(duracionCronologica) + " (A término)");
    } else {
      const fechaNacimientoCorregida = addDays(fechaNac, diasPrem);
       if (fechaCalc < fechaNacimientoCorregida) {
         setEdadCorregida("Aún no alcanza la edad corregida de 0 días (fecha de cálculo es anterior a la fecha teórica de término).");
       } else {
        const duracionCorregida = intervalToDuration({ start: fechaNacimientoCorregida, end: fechaCalc });
        setEdadCorregida(formatDuration(duracionCorregida));
       }
    }
  };
  
  const resetCalculator = () => {
    form.reset({ fechaNacimiento: undefined, semanasGestacion: undefined, fechaCalculo: startOfDay(new Date())});
    setEdadCronologica(null);
    setEdadCorregida(null);
    setDiasPrematuridad(null);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><Baby className="mr-2 h-6 w-6 text-pink-500" />Edad Corregida (Prematuros)</CardTitle>
        <CardDescription>
          Calcula la edad corregida para recién nacidos prematuros.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fechaNacimiento"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Nacimiento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="semanasGestacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semanas de Gestación al Nacer</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 32" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fechaCalculo"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Cálculo (opcional)</FormLabel>
                   <FormDescription className="text-xs">Por defecto es hoy.</FormDescription>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        locale={es}
                         disabled={(date) => date < (form.getValues("fechaNacimiento") || new Date("1900-01-01"))}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full">
                <RefreshCcw className="mr-2 h-4 w-4" /> Limpiar
              </Button>
              <Button type="submit" className="w-full">Calcular Edad Corregida</Button>
            </div>
          </form>
        </Form>

        {edadCronologica !== null && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/50 space-y-2">
            <h3 className="text-lg font-semibold text-center mb-2">Resultados</h3>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Edad Cronológica:</p>
              <p className="text-xl font-bold text-primary">{edadCronologica}</p>
            </div>
            {diasPrematuridad !== null && diasPrematuridad > 0 && (
                 <div>
                    <p className="text-sm font-medium text-muted-foreground">Días de Prematuridad:</p>
                    <p className="text-md font-semibold text-primary">{diasPrematuridad} días ({diasPrematuridad/7} semanas)</p>
                </div>
            )}
            {edadCorregida !== null && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Edad Corregida:</p>
                <p className="text-xl font-bold text-primary">{edadCorregida}</p>
              </div>
            )}
          </div>
        )}
        <Separator className="my-6" />
        <div className="text-xs text-muted-foreground space-y-2">
          <p className="flex items-start">
            <Info size={20} className="mr-2 flex-shrink-0 text-blue-500"/> 
            La edad corregida ajusta la edad de un bebé prematuro según su grado de prematuridad. Se considera un embarazo a término a las 40 semanas.
          </p>
          <p>Se suele utilizar la edad corregida para evaluar el desarrollo hasta los 2 años de edad cronológica. Luego, se utiliza la edad cronológica.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EdadCorregidaCalculator;