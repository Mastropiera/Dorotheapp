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
import { Info } from 'lucide-react';

const roxSchema = z.object({
  spO2: z.coerce.number().min(1, "SpO₂ debe ser > 0%").max(100, "SpO₂ no puede ser > 100%"),
  fiO2: z.coerce.number().min(21, "FiO₂ debe ser >= 21%").max(100, "FiO₂ no puede ser > 100%"),
  rr: z.coerce.number().min(1, "FR debe ser > 0 rpm").max(100, "FR irreal"),
});

type RoxFormValues = z.infer<typeof roxSchema>;

const RoxIndexCalculator: React.FC = () => {
  const [roxResult, setRoxResult] = useState<number | null>(null);
  const [roxInterpretation, setRoxInterpretation] = useState<string>("");

  const form = useForm<RoxFormValues>({
    resolver: zodResolver(roxSchema),
    defaultValues: {
        spO2: undefined,
        fiO2: undefined,
        rr: undefined,
    }
  });

  const onRoxSubmit = (data: RoxFormValues) => {
    if (data.fiO2 === 0 || data.rr === 0) {
      setRoxInterpretation("FiO₂ y Frecuencia Respiratoria no pueden ser 0.");
      setRoxResult(null);
      return;
    }
    const fiO2Decimal = data.fiO2 / 100;
    const numerator = data.spO2 / fiO2Decimal;
    const result = numerator / data.rr;
    setRoxResult(parseFloat(result.toFixed(2)));

    if (result >= 4.88) {
        setRoxInterpretation("Índice ROX ≥ 4.88: Menor riesgo de necesitar intubación con CNAF.");
    } else if (result >= 3.85 && result < 4.88) {
        setRoxInterpretation("Índice ROX entre 3.85 y 4.87: Riesgo intermedio. Monitorizar de cerca.");
    } else if (result < 3.85) {
        setRoxInterpretation("Índice ROX < 3.85: Mayor riesgo de necesitar intubación pese a CNAF.");
    } else {
        setRoxInterpretation("Valor fuera de rangos típicos de interpretación.");
    }
  };

  const resetCalculator = () => {
    form.reset();
    setRoxResult(null);
    setRoxInterpretation("");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Índice ROX</CardTitle>
        <CardDescription>Evalúa el riesgo de fracaso de la Cánula Nasal de Alto Flujo (CNAF).</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onRoxSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="spO2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saturación de Oxígeno (SpO₂)</FormLabel>
                  <FormControl><Input type="number" placeholder="Ej: 95" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fiO2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fracción Inspirada de Oxígeno (FiO₂) en %</FormLabel>
                  <FormControl><Input type="number" placeholder="Ej: 40" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frecuencia Respiratoria (FR) por minuto</FormLabel>
                  <FormControl><Input type="number" placeholder="Ej: 20" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={resetCalculator} className="w-full">
                 Limpiar
                </Button>
                <Button type="submit" className="w-full">Calcular Índice ROX</Button>
            </div>
          </form>
        </Form>

        {roxResult !== null && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/50">
            <h3 className="text-lg font-semibold text-center mb-2">Resultado del Índice ROX</h3>
            <p className="text-2xl font-bold text-center text-primary">{roxResult}</p>
            {roxInterpretation && (
              <p className="text-sm text-center text-muted-foreground mt-1">{roxInterpretation}</p>
            )}
          </div>
        )}
        <Separator className="my-6" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={20} className="mr-2 flex-shrink-0 text-blue-500"/>El Índice ROX (SpO₂/FiO₂ / FR) ayuda a predecir el éxito de la terapia con CNAF en pacientes con insuficiencia respiratoria aguda.</p>
            <p><strong>Puntos de corte comunes:</strong></p>
            <ul className="list-disc list-inside pl-2">
                <li>≥ 4.88: Bajo riesgo de fracaso de CNAF.</li>
                <li>3.85 - 4.87: Riesgo intermedio, seguimiento estrecho.</li>
                <li>&lt; 3.85: Alto riesgo de fracaso de CNAF y necesidad de intubación.</li>
            </ul>
            <p><em>Interpretación basada en Roca O, et al. (Am J Respir Crit Care Med 2016 & Crit Care 2019). Reevaluar a las 2, 6 y 12 horas.</em></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoxIndexCalculator;