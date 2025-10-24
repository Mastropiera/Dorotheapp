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
import { Gauge, Info, RefreshCcw, Sigma, Wind, TrendingUp, Activity as ActivityIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const oiSchema = z.object({
  map: z.coerce.number().min(0, "MAP debe ser >= 0 cmH₂O").max(80, "MAP irreal"),
  fio2: z.coerce.number().min(21, "FiO₂ debe ser >= 21%").max(100, "FiO₂ no puede ser > 100%"),
  pao2: z.coerce.number().min(10, "PaO₂ debe ser > 10 mmHg").max(700, "PaO₂ irreal"),
});

type OiFormValues = z.infer<typeof oiSchema>;

const OiCalculator: React.FC = () => {
  const [oiResult, setOiResult] = useState<number | null>(null);
  const [interpretation, setInterpretation] = useState<string>("");

  const form = useForm<OiFormValues>({
    resolver: zodResolver(oiSchema),
    defaultValues: {
      fio2: 21, // Default FiO2 to air
    },
  });

  const onSubmit = (data: OiFormValues) => {
    if (data.pao2 === 0) {
        form.setError("pao2", { type: "manual", message: "PaO₂ no puede ser cero para el cálculo." });
        setOiResult(null);
        setInterpretation("");
        return;
    }
    const result = (data.map * data.fio2) / data.pao2; // FiO2 as percentage
    setOiResult(parseFloat(result.toFixed(1)));

    if (result < 10) setInterpretation("Normal o levemente alterado. Buen pronóstico general.");
    else if (result >= 10 && result < 25) setInterpretation("Disfunción pulmonar leve-moderada.");
    else if (result >= 25 && result < 40) setInterpretation("Disfunción pulmonar grave. Considerar estrategias avanzadas.");
    else if (result >= 40) setInterpretation("Disfunción pulmonar muy grave. Alto riesgo, considerar ECMO según protocolos.");
    else setInterpretation("Puntuación fuera de rango esperado.");
  };

  const resetCalculator = () => {
    form.reset({ fio2: 21, map: undefined, pao2: undefined });
    setOiResult(null);
    setInterpretation("");
  };

  const renderInputField = (name: keyof OiFormValues, label: string, placeholder: string, unit: string, icon?: React.ReactNode, description?: string) => (
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
        <CardTitle className="flex items-center"><Gauge className="mr-2 h-6 w-6 text-blue-500" />Índice de Oxigenación (OI)</CardTitle>
        <CardDescription>
          Evalúa la severidad de la insuficiencia respiratoria hipoxémica, especialmente en pacientes con ventilación mecánica.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderInputField("map", "Presión Media Vía Aérea (MAP)", "Ej: 10", "cmH₂O", <TrendingUp />)}
            {renderInputField("fio2", "FiO₂ (Fracción Inspirada de O₂)", "Ej: 50", "%", <Wind />, "Ingresar como porcentaje (ej: 21 para aire ambiente, 100 para 100%).")}
            {renderInputField("pao2", "PaO₂ (Presión Arterial de O₂)", "Ej: 80", "mmHg", <ActivityIcon />)}
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                <RefreshCcw className="mr-2 h-4 w-4" /> Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                <Sigma className="mr-2 h-4 w-4" /> Calcular OI
              </Button>
            </div>
          </form>
        </Form>

        {oiResult !== null && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
            <h3 className="text-xl font-bold text-center mb-3 text-foreground">Resultado del Índice de Oxigenación</h3>
            <div className="text-center">
                <p className="text-3xl font-extrabold text-primary mb-1">{oiResult}</p>
                <p className={cn(
                    "text-sm font-semibold",
                    oiResult < 10 && "text-green-600",
                    oiResult >= 10 && oiResult < 25 && "text-yellow-600",
                    oiResult >= 25 && oiResult < 40 && "text-orange-600",
                    oiResult >= 40 && "text-red-600"
                )}>
                    {interpretation}
                </p>
            </div>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                El Índice de Oxigenación (OI) se utiliza para cuantificar la severidad de la falla respiratoria hipoxémica. Un OI más alto indica peor oxigenación.
            </p>
            <p><strong>Fórmula:</strong> OI = (MAP × FiO₂%) / PaO₂</p>
            <p><strong>Interpretación General (puede variar según contexto y población, ej. neonatos):</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>&lt; 10:</strong> Normal o disfunción pulmonar leve.</li>
                <li><strong>10 - 24:</strong> Disfunción pulmonar leve a moderada.</li>
                <li><strong>25 - 39:</strong> Disfunción pulmonar grave (SDRA severo).</li>
                <li><strong>≥ 40:</strong> Disfunción pulmonar muy grave (alta mortalidad, considerar ECMO).</li>
            </ul>
            <p className="italic">
                Siempre interpretar en el contexto clínico completo del paciente. Los umbrales para intervenciones como ECMO varían.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OiCalculator;