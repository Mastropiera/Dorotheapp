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
import { Info, Gauge } from 'lucide-react';

const pamSchema = z.object({
  pas: z.coerce.number().min(30, "PAS debe ser > 30 mmHg").max(300, "PAS irreal"),
  pad: z.coerce.number().min(20, "PAD debe ser > 20 mmHg").max(200, "PAD irreal"),
}).refine(data => data.pas >= data.pad, {
  message: "PAS debe ser mayor o igual que PAD",
  path: ["pas"], 
});

type PamFormValues = z.infer<typeof pamSchema>;

const PAMCalculator: React.FC = () => {
  const [pamResult, setPamResult] = useState<number | null>(null);
  const [pamInterpretation, setPamInterpretation] = useState<string>("");

  const form = useForm<PamFormValues>({
    resolver: zodResolver(pamSchema),
    defaultValues: {
        pas: undefined,
        pad: undefined,
    }
  });

  const onPamSubmit = (data: PamFormValues) => {
    const result = data.pad + (data.pas - data.pad) / 3;
    setPamResult(parseFloat(result.toFixed(1))); // Mostrar con 1 decimal

    if (result >= 70 && result <= 100) setPamInterpretation("Normal");
    else if (result < 70) setPamInterpretation("Hipotensión (Posible hipoperfusión tisular)");
    else if (result > 100) setPamInterpretation("Hipertensión (Considerar HTA o estado hipertensivo)");
    else setPamInterpretation("Valor fuera de rangos típicos de interpretación.");
  };

  const resetCalculator = () => {
    form.reset();
    setPamResult(null);
    setPamInterpretation("");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><Gauge className="mr-2 h-5 w-5" />Presión Arterial Media (PAM)</CardTitle>
        <CardDescription>Calcula la PAM, un indicador de perfusión tisular.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onPamSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presión Arterial Sistólica (PAS) en mmHg</FormLabel>
                  <FormControl><Input type="number" placeholder="Ej: 120" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presión Arterial Diastólica (PAD) en mmHg</FormLabel>
                  <FormControl><Input type="number" placeholder="Ej: 80" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={resetCalculator} className="w-full">
                 Limpiar
                </Button>
                <Button type="submit" className="w-full">Calcular PAM</Button>
            </div>
          </form>
        </Form>

        {pamResult !== null && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/50">
            <h3 className="text-lg font-semibold text-center mb-2">Resultado de la PAM</h3>
            <p className="text-2xl font-bold text-center text-primary">{pamResult} mmHg</p>
            {pamInterpretation && (
              <p className="text-sm text-center text-muted-foreground mt-1">{pamInterpretation}</p>
            )}
          </div>
        )}
        <Separator className="my-6" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={18} className="mr-2 flex-shrink-0 text-blue-500"/> La PAM es la presión promedio en las arterias durante un ciclo cardíaco. Es crucial para asegurar la perfusión de los órganos.</p>
            <p><strong>Valores de Referencia (Adultos):</strong></p>
            <ul className="list-disc list-inside pl-2">
                <li>70 - 100 mmHg: Generalmente considerado normal.</li>
                <li>&lt; 70 mmHg (o &lt;65 mmHg en algunos contextos): Puede indicar hipoperfusión.</li>
                <li>&gt; 100 mmHg: Puede indicar hipertensión.</li>
            </ul>
            <p><em>Objetivos específicos de PAM pueden variar según la condición clínica del paciente.</em></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PAMCalculator;