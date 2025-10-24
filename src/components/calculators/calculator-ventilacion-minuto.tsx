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
import { Clock, Info, RefreshCcw, Sigma, Wind, Activity as ActivityIcon } from 'lucide-react';

const ventilacionMinutoSchema = z.object({
  frecuenciaRespiratoria: z.coerce.number().min(1, "FR debe ser > 0 rpm").max(100, "FR irreal"),
  volumenTidal: z.coerce.number().min(10, "VT debe ser > 10 ml").max(2000, "VT irreal (ml)"),
});

type VentilacionMinutoFormValues = z.infer<typeof ventilacionMinutoSchema>;

const VentilacionMinutoCalculator: React.FC = () => {
  const [veResult, setVeResult] = useState<number | null>(null);
  const [interpretation, setInterpretation] = useState<string>("");

  const form = useForm<VentilacionMinutoFormValues>({
    resolver: zodResolver(ventilacionMinutoSchema),
    defaultValues: {
      frecuenciaRespiratoria: undefined,
      volumenTidal: undefined,
    },
  });

  const onSubmit = (data: VentilacionMinutoFormValues) => {
    const volumenTidalLitros = data.volumenTidal / 1000; // Convertir ml a L
    if (volumenTidalLitros === 0) {
        form.setError("volumenTidal", { type: "manual", message: "Volumen Tidal no puede ser cero." });
        setVeResult(null);
        setInterpretation("");
        return;
    }
    const result = data.frecuenciaRespiratoria * volumenTidalLitros;
    setVeResult(parseFloat(result.toFixed(1)));

    // Interpretación general para adultos
    if (result < 4) setInterpretation("Hipoventilación (posible acidosis respiratoria).");
    else if (result >= 4 && result <= 8) setInterpretation("Ventilación minuto normal para un adulto en reposo (aprox. 5-8 L/min).");
    else if (result > 8 && result <= 12) setInterpretation("Ventilación minuto aumentada leve-moderada (ej. ejercicio ligero, compensación metabólica).");
    else setInterpretation("Hiperventilación (posible alcalosis respiratoria, respuesta a hipoxia, etc.).");
  };

  const resetCalculator = () => {
    form.reset();
    setVeResult(null);
    setInterpretation("");
  };

  const renderInputField = (name: keyof VentilacionMinutoFormValues, label: string, placeholder: string, unit: string, icon?: React.ReactNode, description?: string) => (
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
        <CardTitle className="flex items-center"><Clock className="mr-2 h-6 w-6 text-blue-500" />Ventilación Minuto (Ve)</CardTitle>
        <CardDescription>
          Calcula el volumen total de gas que entra (o sale) de los pulmones por minuto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderInputField("frecuenciaRespiratoria", "Frecuencia Respiratoria (FR)", "Ej: 12", "rpm", <ActivityIcon />)}
            {renderInputField("volumenTidal", "Volumen Tidal (VT)", "Ej: 500", "ml", <Wind />, "Ingresar en mililitros (ml).")}

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                <RefreshCcw className="mr-2 h-4 w-4" /> Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                <Sigma className="mr-2 h-4 w-4" /> Calcular Ve
              </Button>
            </div>
          </form>
        </Form>

        {veResult !== null && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
            <h3 className="text-xl font-bold text-center mb-3 text-foreground">Resultado de Ventilación Minuto</h3>
            <div className="text-center">
                <p className="text-3xl font-extrabold text-primary mb-1">{veResult.toFixed(1)} L/min</p>
                <p className="text-sm font-semibold text-muted-foreground">
                    {interpretation}
                </p>
            </div>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/>
                La Ventilación Minuto (Ve o VM) es el producto de la Frecuencia Respiratoria (FR) y el Volumen Tidal (VT).
            </p>
            <p><strong>Fórmula:</strong> Ve (L/min) = FR (resp/min) × VT (L)</p>
            <p><strong>Interpretación General (Adultos en reposo):</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>Normal:</strong> Aproximadamente 5-8 L/min.</li>
                <li><strong>Hipoventilación:</strong> Valores bajos pueden indicar depresión respiratoria.</li>
                <li><strong>Hiperventilación:</strong> Valores altos pueden ser respuesta a hipoxia, acidosis, ansiedad, etc.</li>
            </ul>
            <p className="italic">
                Evaluar siempre en el contexto clínico del paciente.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VentilacionMinutoCalculator;