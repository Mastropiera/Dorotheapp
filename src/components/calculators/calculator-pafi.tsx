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

const paFiSchema = z.object({
  paO2: z.coerce.number().min(1, "PaO₂ debe ser > 0 mmHg").max(760, "Valor de PaO₂ irreal"),
  fiO2: z.coerce.number().min(21, "FiO₂ debe ser >= 21%").max(100, "FiO₂ no puede ser > 100%"),
});

type PaFiFormValues = z.infer<typeof paFiSchema>;

const PaFiCalculator: React.FC = () => {
  const [paFiResult, setPaFiResult] = useState<number | null>(null);
  const [paFiInterpretation, setPaFiInterpretation] = useState<string>("");

  const form = useForm<PaFiFormValues>({
    resolver: zodResolver(paFiSchema),
    defaultValues: {
      paO2: undefined,
      fiO2: undefined,
    },
  });

  const onPaFiSubmit = (data: PaFiFormValues) => {
    if (data.fiO2 === 0) {
      setPaFiInterpretation("FiO₂ no puede ser 0 para el cálculo.");
      setPaFiResult(null);
      return;
    }
    const fiO2Decimal = data.fiO2 / 100;
    const result = data.paO2 / fiO2Decimal;
    setPaFiResult(parseFloat(result.toFixed(1)));

    if (result > 300) setPaFiInterpretation("Normal o Daño Pulmonar Leve");
    else if (result >= 201 && result <= 300) setPaFiInterpretation("SDRA Leve (Definición Berlín)");
    else if (result >= 101 && result <= 200) setPaFiInterpretation("SDRA Moderado (Definición Berlín)");
    else if (result <= 100) setPaFiInterpretation("SDRA Severo (Definición Berlín)");
    else setPaFiInterpretation("Valor fuera de rangos típicos de interpretación.");
  };

  const resetCalculator = () => {
    form.reset();
    setPaFiResult(null);
    setPaFiInterpretation("");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>PaFi (Índice de Kirby)</CardTitle>
        <CardDescription>Calcula la relación PaO₂/FiO₂ para evaluar la oxigenación.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onPaFiSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="paO2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presión Arterial de Oxígeno (PaO₂)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 90" {...field} value={field.value ?? ''} />
                  </FormControl>
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
                  <FormControl>
                    <Input type="number" placeholder="Ej: 21 para aire ambiente" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={resetCalculator} className="w-full">
                 Limpiar
                </Button>
                <Button type="submit" className="w-full">Calcular PaFi</Button>
            </div>
          </form>
        </Form>

        {paFiResult !== null && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/50">
            <h3 className="text-lg font-semibold text-center mb-2">Resultado del Índice PaFi</h3>
            <p className="text-2xl font-bold text-center text-primary">{paFiResult} mmHg</p>
            {paFiInterpretation && (
              <p className="text-sm text-center text-muted-foreground mt-1">{paFiInterpretation}</p>
            )}
          </div>
        )}
        <Separator className="my-6" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={18} className="mr-2 flex-shrink-0 text-blue-500"/> El Índice de Kirby (PaO₂/FiO₂) es una medida de la insuficiencia respiratoria hipoxémica.</p>
            <p><strong>Rangos (Definición de Berlín para SDRA):</strong></p>
            <ul className="list-disc list-inside pl-2">
                <li>{">"} 300 mmHg: Normal o Daño Pulmonar Leve.</li>
                <li>201-300 mmHg: SDRA Leve.</li>
                <li>101-200 mmHg: SDRA Moderado.</li>
                <li>≤ 100 mmHg: SDRA Severo.</li>
            </ul>
            <p><em>Fuente: Adaptado de Definición de Berlín (JAMA 2012). Consulte siempre guías clínicas actualizadas.</em></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaFiCalculator;