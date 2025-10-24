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
import { Droplet, Info, RefreshCcw, Sigma } from 'lucide-react';

const requerimientosHidricosSchema = z.object({
  peso: z.coerce.number().min(0.1, "El peso debe ser mayor a 0 kg.").max(150, "Peso ingresado parece excesivo para este cálculo pediátrico/general."),
});

type RequerimientosHidricosFormValues = z.infer<typeof requerimientosHidricosSchema>;

const RequerimientosHidricosCalculator: React.FC = () => {
  const [dailyRequirement, setDailyRequirement] = useState<number | null>(null);
  const [hourlyRate, setHourlyRate] = useState<number | null>(null);

  const form = useForm<RequerimientosHidricosFormValues>({
    resolver: zodResolver(requerimientosHidricosSchema),
    defaultValues: {
      peso: undefined,
    },
  });

  const onCalculateSubmit = (data: RequerimientosHidricosFormValues) => {
    const pesoKg = data.peso;
    let dailyMl = 0;

    if (pesoKg <= 10) {
      dailyMl = pesoKg * 100;
    } else if (pesoKg <= 20) {
      dailyMl = 1000 + (pesoKg - 10) * 50;
    } else {
      dailyMl = 1500 + (pesoKg - 20) * 20;
    }

    setDailyRequirement(dailyMl);
    setHourlyRate(dailyMl / 24);
  };

  const resetCalculator = () => {
    form.reset();
    setDailyRequirement(null);
    setHourlyRate(null);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><Droplet className="mr-2 h-6 w-6 text-blue-500" />Requerimientos Hídricos Basales</CardTitle>
        <CardDescription>
          Calcula los requerimientos de fluidos basales según el método de Holliday-Segar (principalmente para pediatría).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCalculateSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="peso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso del Paciente (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ej: 15"
                      {...field}
                      value={field.value === undefined ? '' : field.value}
                      onChange={e => {
                        const val = e.target.value;
                        field.onChange(val === '' ? undefined : parseFloat(val));
                      }}
                      onFocus={e => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                <RefreshCcw className="mr-2 h-4 w-4" /> Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                <Sigma className="mr-2 h-4 w-4" /> Calcular
              </Button>
            </div>
          </form>
        </Form>

        {dailyRequirement !== null && hourlyRate !== null && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50 text-center">
            <h3 className="text-xl font-bold mb-3 text-foreground">Resultados del Cálculo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-800/30 border border-blue-200 dark:border-blue-700">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Requerimiento Diario</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-200">{dailyRequirement.toFixed(0)} ml/día</p>
              </div>
              <div className="p-3 rounded-md bg-sky-100 dark:bg-sky-800/30 border border-sky-200 dark:border-sky-700">
                <p className="text-sm font-medium text-sky-700 dark:text-sky-300">Tasa Horaria (Goteo)</p>
                <p className="text-2xl font-bold text-sky-600 dark:text-sky-200">{hourlyRate.toFixed(1)} ml/hora</p>
              </div>
            </div>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                El método de Holliday-Segar se utiliza para estimar los requerimientos de fluidos de mantenimiento en niños. Para adultos, se suelen usar otras aproximaciones (ej: 25-35 ml/kg/día).
            </p>
            <p><strong>Fórmula de Holliday-Segar:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>0-10 kg:</strong> 100 ml/kg/día</li>
                <li><strong>11-20 kg:</strong> 1000 ml + 50 ml/kg por cada kg sobre 10 kg</li>
                <li><strong>&gt;20 kg:</strong> 1500 ml + 20 ml/kg por cada kg sobre 20 kg</li>
            </ul>
            <p className="italic">
                Estos son requerimientos basales. Se deben ajustar según el estado clínico, pérdidas adicionales (fiebre, vómitos, etc.), y otras condiciones.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequerimientosHidricosCalculator;