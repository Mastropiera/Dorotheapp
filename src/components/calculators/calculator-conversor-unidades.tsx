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
import { Calculator, Info, RefreshCcw, Droplet } from 'lucide-react';

const conversorSchema = z.object({
  dosisMcgKgMin: z.coerce.number().min(0, "Debe ser >= 0"),
  pesoKg: z.coerce.number().min(0.1, "Peso debe ser > 0 kg"),
  drogaMg: z.coerce.number().min(0, "Debe ser >= 0 mg"),
  volumenMl: z.coerce.number().min(1, "Volumen debe ser > 0 ml"),
});

type ConversorFormValues = z.infer<typeof conversorSchema>;

const ConversorUnidadesCalculator: React.FC = () => {
  const [mlPorHora, setMlPorHora] = useState<number | null>(null);

  const form = useForm<ConversorFormValues>({
    resolver: zodResolver(conversorSchema),
    defaultValues: {
      dosisMcgKgMin: undefined,
      pesoKg: undefined,
      drogaMg: undefined,
      volumenMl: undefined,
    },
  });

  const onSubmit = (data: ConversorFormValues) => {
    const mcgPorMin = data.dosisMcgKgMin * data.pesoKg;
    const mcgPorHora = mcgPorMin * 60;
    
    if (data.volumenMl === 0) {
        form.setError("volumenMl", { type: "manual", message: "El volumen no puede ser cero." });
        setMlPorHora(null);
        return;
    }
    const concentracionMcgPorMl = (data.drogaMg * 1000) / data.volumenMl;

    if (concentracionMcgPorMl === 0 && mcgPorHora > 0) {
        form.setError("drogaMg", { type: "manual", message: "La cantidad de droga no puede ser cero si la dosis es mayor a cero."});
        setMlPorHora(null);
        return;
    }
    
    const resultadoMlPorHora = concentracionMcgPorMl > 0 ? mcgPorHora / concentracionMcgPorMl : 0;
    setMlPorHora(resultadoMlPorHora);
  };

  const resetCalculator = () => {
    form.reset();
    setMlPorHora(null);
  };

  const renderInputField = (name: keyof ConversorFormValues, label: string, placeholder: string, unit: string, description?: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
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
        <CardTitle className="flex items-center"><Calculator className="mr-2 h-6 w-6 text-blue-500" />Conversor de Unidades</CardTitle>
        <CardDescription>
          Convierte dosis de mcg/kg/min a ml/hr para bombas de infusión.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderInputField("dosisMcgKgMin", "Dosis Indicada", "Ej: 5", "mcg/kg/min")}
            {renderInputField("pesoKg", "Peso del Paciente", "Ej: 70", "kg")}
            {renderInputField("drogaMg", "Cantidad de Fármaco en la Dilución", "Ej: 200", "mg")}
            {renderInputField("volumenMl", "Volumen Total de la Dilución", "Ej: 250", "ml")}
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                <RefreshCcw className="mr-2 h-4 w-4" /> Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Calcular ml/hr
              </Button>
            </div>
          </form>
        </Form>

        {mlPorHora !== null && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50 text-center">
            <h3 className="text-xl font-bold mb-2 text-foreground">Velocidad de Infusión Requerida</h3>
            <div className="flex items-center justify-center">
              <Droplet className="mr-2 h-8 w-8 text-primary"/>
              <p className="text-3xl font-extrabold text-primary">
                {mlPorHora.toFixed(2)} ml/hr
              </p>
            </div>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                Esta calculadora te ayuda a determinar la velocidad en ml/hr para programar una bomba de infusión continua (BIC) basándose en una dosis indicada en mcg/kg/min.
            </p>
            <p><strong>Fórmula General Utilizada:</strong></p>
            <ol className="list-decimal list-inside pl-4 space-y-1">
                <li>mcg/min = Dosis (mcg/kg/min) × Peso (kg)</li>
                <li>mcg/hora = mcg/min × 60</li>
                <li>Concentración (mcg/ml) = (Droga (mg) × 1000) / Volumen Total (ml)</li>
                <li>Velocidad (ml/hr) = mcg/hora / Concentración (mcg/ml)</li>
            </ol>
            <p className="italic">
                Asegúrate de verificar la compatibilidad de los fluidos y fármacos, y sigue siempre los protocolos institucionales y el juicio clínico.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversorUnidadesCalculator;