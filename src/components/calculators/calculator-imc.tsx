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
import { Info, Weight } from 'lucide-react';

const imcSchema = z.object({
  peso: z.coerce.number().min(1, "Peso debe ser > 0 kg").max(500, "Peso irreal"),
  talla: z.coerce.number().min(50, "Talla debe ser > 50 cm").max(300, "Talla irreal"),
});

type ImcFormValues = z.infer<typeof imcSchema>;

const IMCCalculator: React.FC = () => {
  const [imcResult, setImcResult] = useState<number | null>(null);
  const [imcInterpretation, setImcInterpretation] = useState<string>("");
  const [imcInterpretationAdultoMayor, setImcInterpretationAdultoMayor] = useState<string>("");

  const form = useForm<ImcFormValues>({
    resolver: zodResolver(imcSchema),
    defaultValues: {
        peso: undefined,
        talla: undefined,
    }
  });

  const onImcSubmit = (data: ImcFormValues) => {
    if (data.talla === 0) {
      setImcInterpretation("La talla no puede ser 0.");
      setImcInterpretationAdultoMayor("");
      setImcResult(null);
      return;
    }
    const tallaMetros = data.talla / 100;
    const result = data.peso / (tallaMetros * tallaMetros);
    setImcResult(parseFloat(result.toFixed(1)));

    // Clasificación general (OMS)
    if (result < 18.5) setImcInterpretation("Bajo Peso");
    else if (result >= 18.5 && result <= 24.9) setImcInterpretation("Peso Normal");
    else if (result >= 25 && result <= 29.9) setImcInterpretation("Sobrepeso");
    else if (result >= 30 && result <= 34.9) setImcInterpretation("Obesidad Grado I");
    else if (result >= 35 && result <= 39.9) setImcInterpretation("Obesidad Grado II");
    else if (result >= 40) setImcInterpretation("Obesidad Grado III (Mórbida)");
    else setImcInterpretation("Valor fuera de rangos típicos.");

    // Clasificación para Adultos Mayores
    // < 23: Bajo Peso
    // 23 a 27,9: Peso Normal (corregido el límite superior a 27.9, no 23.1 a 27.9)
    // 28 a 31,9: Sobrepeso
    // 32 o más: Obeso
    if (result < 23) setImcInterpretationAdultoMayor("Bajo Peso");
    else if (result >= 23 && result <= 27.9) setImcInterpretationAdultoMayor("Peso Normal");
    else if (result >= 28 && result <= 31.9) setImcInterpretationAdultoMayor("Sobrepeso");
    else if (result >= 32) setImcInterpretationAdultoMayor("Obeso");
    else setImcInterpretationAdultoMayor("Valor fuera de rangos típicos para adulto mayor.");
  };
  
  const resetCalculator = () => {
    form.reset();
    setImcResult(null);
    setImcInterpretation("");
    setImcInterpretationAdultoMayor("");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><Weight className="mr-2 h-5 w-5" />Índice de Masa Corporal (IMC)</CardTitle>
        <CardDescription>Calcula el IMC para evaluar el estado nutricional según peso y talla.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onImcSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="peso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso (kg)</FormLabel>
                  <FormControl><Input type="number" placeholder="Ej: 70" {...field} value={field.value ?? ''} /></FormControl>
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
                  <FormControl><Input type="number" placeholder="Ej: 175" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={resetCalculator} className="w-full">
                 Limpiar
                </Button>
                <Button type="submit" className="w-full">Calcular IMC</Button>
            </div>
          </form>
        </Form>

        {imcResult !== null && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/50">
            <h3 className="text-lg font-semibold text-center mb-2">Resultado del IMC</h3>
            <p className="text-2xl font-bold text-center text-primary">{imcResult} kg/m²</p>
            {imcInterpretation && (
              <p className="text-sm text-center text-muted-foreground mt-1">{imcInterpretation}</p>
            )}
            {imcInterpretationAdultoMayor && (
              <p className="text-sm text-center text-muted-foreground mt-0.5">
                (Adulto Mayor: {imcInterpretationAdultoMayor})
              </p>
            )}
          </div>
        )}
        <Separator className="my-6" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={18} className="mr-2 flex-shrink-0 text-blue-500"/> El IMC es una herramienta de cribado, no diagnóstica. Considerar composición corporal y otros factores.</p>
            <p><strong>Clasificación OMS para adultos:</strong></p>
            <ul className="list-disc list-inside pl-2">
                <li>&lt; 18.5: Bajo Peso</li>
                <li>18.5 - 24.9: Peso Normal</li>
                <li>25.0 - 29.9: Sobrepeso</li>
                <li>30.0 - 34.9: Obesidad Grado I</li>
                <li>35.0 - 39.9: Obesidad Grado II</li>
                <li>≥ 40.0: Obesidad Grado III (Mórbida)</li>
            </ul>
            <p><strong>Clasificación para Adultos Mayores (referencial):</strong></p>
            <ul className="list-disc list-inside pl-2">
                <li>&lt; 23: Bajo Peso</li>
                <li>23.0 - 27.9: Peso Normal</li>
                <li>28.0 - 31.9: Sobrepeso</li>
                <li>≥ 32.0: Obeso</li>
            </ul>
             <p><em>Las clasificaciones pueden variar según guías y poblaciones específicas. Consultar con un profesional.</em></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IMCCalculator;