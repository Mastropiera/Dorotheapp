"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, SlidersHorizontal } from 'lucide-react';

const ictSchema = z.object({
  cintura: z.coerce.number().min(30, "Cintura debe ser > 30 cm").max(300, "Valor de cintura irreal"),
  talla: z.coerce.number().min(50, "Talla debe ser > 50 cm").max(300, "Valor de talla irreal"),
});

type IctFormValues = z.infer<typeof ictSchema>;

const ICTCalculator: React.FC = () => {
  const [ictResult, setIctResult] = useState<number | null>(null);
  const [ictInterpretation, setIctInterpretation] = useState<string>("");

  const form = useForm<IctFormValues>({
    resolver: zodResolver(ictSchema),
    defaultValues: {
      cintura: undefined,
      talla: undefined,
    },
  });

  const onIctSubmit = (data: IctFormValues) => {
    if (data.talla === 0) {
      setIctInterpretation("La talla no puede ser 0.");
      setIctResult(null);
      return;
    }
    const result = data.cintura / data.talla;
    setIctResult(parseFloat(result.toFixed(2))); // Mostrar con 2 decimales

    if (result < 0.5) setIctInterpretation("Riesgo cardiovascular bajo (Saludable)");
    else if (result >= 0.5 && result < 0.55) setIctInterpretation("Sobrepeso / Riesgo cardiovascular aumentado");
    else if (result >= 0.55 && result < 0.6) setIctInterpretation("Obesidad / Riesgo cardiovascular alto");
    else if (result >= 0.6) setIctInterpretation("Obesidad severa / Riesgo cardiovascular muy alto");
    else setIctInterpretation("Valor fuera de rangos típicos de interpretación.");
  };

  const resetCalculator = () => {
    form.reset();
    setIctResult(null);
    setIctInterpretation("");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><SlidersHorizontal className="mr-2 h-5 w-5" />Índice Cintura-Talla (ICT)</CardTitle>
        <CardDescription>Evalúa el riesgo cardiovascular según la relación entre cintura y talla.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onIctSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cintura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Circunferencia de Cintura (cm)</FormLabel>
                  <FormControl><Input type="number" placeholder="Ej: 80" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="talla"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Talla (cm)</FormLabel>
                  <FormControl><Input type="number" placeholder="Ej: 170" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={resetCalculator} className="w-full">
                 Limpiar
                </Button>
                <Button type="submit" className="w-full">Calcular ICT</Button>
            </div>
          </form>
        </Form>

        {ictResult !== null && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/50">
            <h3 className="text-lg font-semibold text-center mb-2">Resultado del ICT</h3>
            <p className="text-2xl font-bold text-center text-primary">{ictResult}</p>
            {ictInterpretation && (
              <p className="text-sm text-center text-muted-foreground mt-1">{ictInterpretation}</p>
            )}
          </div>
        )}
        <Separator className="my-6" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={18} className="mr-2 flex-shrink-0 text-blue-500"/> El ICT es un indicador de adiposidad central y riesgo cardiometabólico.</p>
            <p><strong>Puntos de corte generales (Adultos):</strong></p>
            <ul className="list-disc list-inside pl-2">
                <li>&lt; 0.5: Saludable / Riesgo bajo.</li>
                <li>0.5 - 0.54: Sobrepeso / Riesgo aumentado.</li>
                <li>0.55 - 0.59: Obesidad / Riesgo alto.</li>
                <li>≥ 0.6: Obesidad severa / Riesgo muy alto.</li>
            </ul>
            <p><em>Estos valores son orientativos y pueden variar ligeramente según la población y guías. Consultar con un profesional.</em></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ICTCalculator;