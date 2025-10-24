"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarShadCN } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarHeart, CalendarIcon, Info, RefreshCcw } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format, addDays, isValid, startOfDay, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

const fppSchema = z.object({
  fum: z.date({ required_error: "La Fecha de Última Menstruación (FUM) es requerida." }),
});

type FppFormValues = z.infer<typeof fppSchema>;

const FPPCalculator: React.FC = () => {
  const [fppResult, setFppResult] = useState<string | null>(null);
  const [semanasGestacion, setSemanasGestacion] = useState<number | null>(null);
  const [diasGestacion, setDiasGestacion] = useState<number | null>(null);


  const form = useForm<FppFormValues>({
    resolver: zodResolver(fppSchema),
    defaultValues: {},
  });

  const onSubmit = (data: FppFormValues) => {
    if (!isValid(data.fum)) {
      setFppResult("Fecha de FUM inválida.");
      setSemanasGestacion(null);
      setDiasGestacion(null);
      return;
    }
    
    const fumDate = startOfDay(data.fum);
    const today = startOfDay(new Date());

    // Regla de Naegele (FUM + 280 días)
    const calculatedFpp = addDays(fumDate, 280);
    setFppResult(format(calculatedFpp, "PPP", { locale: es }));

    if (today >= fumDate) {
      const totalDaysSinceFum = differenceInDays(today, fumDate);
      const weeks = Math.floor(totalDaysSinceFum / 7);
      const days = totalDaysSinceFum % 7;
      setSemanasGestacion(weeks);
      setDiasGestacion(days);
    } else {
      // FUM es en el futuro, no tiene sentido calcular semanas de gestación
      setSemanasGestacion(0);
      setDiasGestacion(0);
    }
  };

  const resetCalculator = () => {
    form.reset();
    setFppResult(null);
    setSemanasGestacion(null);
    setDiasGestacion(null);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><CalendarHeart className="mr-2 h-6 w-6 text-pink-500" />Fecha Probable de Parto (FPP)</CardTitle>
        <CardDescription>
          Calcula la FPP y las semanas de gestación actual según la Fecha de Última Menstruación (FUM).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fum"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Última Menstruación (FUM)</FormLabel>
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
                      <CalendarShadCN
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
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full">
                <RefreshCcw className="mr-2 h-4 w-4" /> Limpiar
              </Button>
              <Button type="submit" className="w-full">Calcular FPP</Button>
            </div>
          </form>
        </Form>

        {fppResult !== null && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/50 space-y-2">
            <h3 className="text-lg font-semibold text-center mb-2">Resultados del Cálculo</h3>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha Probable de Parto (FPP):</p>
              <p className="text-xl font-bold text-primary">{fppResult}</p>
            </div>
            {semanasGestacion !== null && diasGestacion !== null && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Edad Gestacional Actual:</p>
                <p className="text-xl font-bold text-primary">
                  {semanasGestacion} semana{semanasGestacion !== 1 ? 's' : ''} y {diasGestacion} día{diasGestacion !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}
        <Separator className="my-6" />
        <div className="text-xs text-muted-foreground space-y-2">
          <p className="flex items-start">
            <Info size={20} className="mr-2 flex-shrink-0 text-blue-500"/> 
            La FPP se calcula sumando 280 días (40 semanas) a la FUM (Regla de Naegele).
            La edad gestacional se cuenta desde el primer día de la FUM.
          </p>
          <p>Esta es una estimación. La ecografía temprana puede ofrecer una datación más precisa.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FPPCalculator;