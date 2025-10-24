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
import { Repeat, Info, RefreshCcw, Sigma, Wind, Activity as ActivityIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const tobinSchema = z.object({
  frecuenciaRespiratoria: z.coerce.number().min(1, "FR debe ser > 0 rpm").max(100, "FR irreal"),
  volumenTidal: z.coerce.number().min(10, "VT debe ser > 10 ml").max(2000, "VT irreal (ml)"),
});

type TobinFormValues = z.infer<typeof tobinSchema>;

const TobinIndexCalculator: React.FC = () => {
  const [rsbiResult, setRsbiResult] = useState<number | null>(null);
  const [interpretation, setInterpretation] = useState<string>("");

  const form = useForm<TobinFormValues>({
    resolver: zodResolver(tobinSchema),
    defaultValues: {},
  });

  const onSubmit = (data: TobinFormValues) => {
    const volumenTidalLitros = data.volumenTidal / 1000; // Convertir ml a L
    if (volumenTidalLitros === 0) {
        form.setError("volumenTidal", { type: "manual", message: "Volumen Tidal no puede ser cero para el cálculo." });
        setRsbiResult(null);
        setInterpretation("");
        return;
    }
    const result = data.frecuenciaRespiratoria / volumenTidalLitros;
    setRsbiResult(parseFloat(result.toFixed(1)));

    if (result < 105) setInterpretation("Buen pronóstico para el destete/extubación (RSBI < 105).");
    else setInterpretation("Mayor probabilidad de fracaso del destete/extubación (RSBI ≥ 105).");
  };

  const resetCalculator = () => {
    form.reset();
    setRsbiResult(null);
    setInterpretation("");
  };

  const renderInputField = (name: keyof TobinFormValues, label: string, placeholder: string, unit: string, icon?: React.ReactNode, description?: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center">{icon && <span className="mr-2">{icon}</span>}{label}</FormLabel>
          <div className="flex items-center">
            <FormControl>
              <Input 
                type="number" 
                placeholder={placeholder} 
                {...field} 
                value={field.value === undefined ? '' : field.value}
                onChange={e => {
                    const val = e.target.value;
                    field.onChange(val === '' ? undefined : parseFloat(val));
                }}
                onFocus={e => e.target.select()}
              />
            </FormControl>
            <span className="ml-2 text-sm text-muted-foreground">{unit}</span>
          </div>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><Repeat className="mr-2 h-6 w-6 text-blue-500" />Índice de Tobin (RSBI)</CardTitle>
        <CardDescription>
          Calcula el Índice de Respiración Rápida y Superficial (RSBI) para predecir el éxito del destete ventilatorio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderInputField("frecuenciaRespiratoria", "Frecuencia Respiratoria (FR)", "Ej: 20", "rpm", <ActivityIcon />)}
            {renderInputField("volumenTidal", "Volumen Tidal (VT)", "Ej: 400", "ml", <Wind />, "Ingresar en mililitros (ml).")}
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                <RefreshCcw className="mr-2 h-4 w-4" /> Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                <Sigma className="mr-2 h-4 w-4" /> Calcular RSBI
              </Button>
            </div>
          </form>
        </Form>

        {rsbiResult !== null && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
            <h3 className="text-xl font-bold text-center mb-3 text-foreground">Resultado del Índice de Tobin</h3>
            <div className="text-center">
                <p className="text-3xl font-extrabold text-primary mb-1">{rsbiResult.toFixed(1)} <span className="text-xl font-normal">resp/min/L</span></p>
                <p className={cn(
                    "text-sm font-semibold",
                    rsbiResult < 105 ? "text-green-600" : "text-orange-600"
                )}>
                    {interpretation}
                </p>
            </div>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                El Índice de Tobin (RSBI) se calcula como Frecuencia Respiratoria / Volumen Tidal (en Litros).
                Es un predictor del éxito del destete de la ventilación mecánica.
            </p>
            <p><strong>Interpretación General:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>RSBI &lt; 105 resp/min/L:</strong> Generalmente asociado con éxito en el destete.</li>
                <li><strong>RSBI ≥ 105 resp/min/L:</strong> Mayor probabilidad de fracaso del destete.</li>
            </ul>
            <p className="italic">
                Este índice debe usarse como parte de una evaluación integral.
                Medir preferentemente después de 1 minuto de respiración espontánea sin soporte.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TobinIndexCalculator;