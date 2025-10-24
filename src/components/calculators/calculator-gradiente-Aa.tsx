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
import { BarChart3, Info, RefreshCcw, Sigma, Waves, ThermometerIcon, User } from 'lucide-react'; // User icon for age
import { cn } from '@/lib/utils';

const gradienteAaSchema = z.object({
  fio2: z.coerce.number().min(21, "FiO₂ debe ser >= 21%").max(100, "FiO₂ no puede ser > 100%"),
  pao2: z.coerce.number().min(10, "PaO₂ debe ser > 10 mmHg").max(700, "Valor de PaO₂ irreal"), // Adjusted max based on FiO2 * PB
  paco2: z.coerce.number().min(10, "PaCO₂ debe ser > 10 mmHg").max(150, "Valor de PaCO₂ irreal"),
  presionBarometrica: z.coerce.number().min(600, "PB debe ser >= 600 mmHg").max(850, "PB no puede ser > 850 mmHg").optional().default(760),
  edad: z.coerce.number().min(1, "Edad debe ser > 0 años").max(120, "Edad irreal").optional(),
});

type GradienteAaFormValues = z.infer<typeof gradienteAaSchema>;

const PRESION_VAPOR_AGUA = 47; // mmHg a 37°C
const COCIENTE_RESPIRATORIO = 0.8;

const GradienteAaCalculator: React.FC = () => {
  const [gradienteAaResult, setGradienteAaResult] = useState<number | null>(null);
  const [pao2Calculada, setPao2Calculada] = useState<number | null>(null);
  const [gradienteNormalEsperado, setGradienteNormalEsperado] = useState<string | null>(null);
  const [interpretation, setInterpretation] = useState<string>("");

  const form = useForm<GradienteAaFormValues>({
    resolver: zodResolver(gradienteAaSchema),
    defaultValues: {
      fio2: 21,
      presionBarometrica: 760,
    },
  });

  const onSubmit = (data: GradienteAaFormValues) => {
    const pb = data.presionBarometrica || 760;
    const calculatedPAO2 = (data.fio2 / 100) * (pb - PRESION_VAPOR_AGUA) - (data.paco2 / COCIENTE_RESPIRATORIO);
    setPao2Calculada(calculatedPAO2);

    const result = calculatedPAO2 - data.pao2;
    setGradienteAaResult(parseFloat(result.toFixed(1)));

    let normalExpected = "N/A";
    if (data.edad) {
      const normalUpperLimit = (data.edad / 4) + 4;
      normalExpected = `Aprox. < ${normalUpperLimit.toFixed(1)} mmHg para ${data.edad} años`;
      setGradienteNormalEsperado(normalExpected);
      if (result > normalUpperLimit) {
        setInterpretation("Elevado para la edad (sugiere alteración en la transferencia de O₂).");
      } else {
        setInterpretation("Dentro del rango esperado para la edad.");
      }
    } else {
      setGradienteNormalEsperado("Edad no ingresada para cálculo específico.");
      // Interpretación general sin edad
      if (result > 15) { // Umbral general común, aunque varía con FiO2 y edad
         setInterpretation("Elevado (sugiere alteración en la transferencia de O₂).");
      } else {
         setInterpretation("Generalmente considerado normal o levemente elevado (interpretar con edad y FiO₂).");
      }
    }
  };

  const resetCalculator = () => {
    form.reset({ fio2: 21, presionBarometrica: 760, pao2: undefined, paco2: undefined, edad: undefined });
    setGradienteAaResult(null);
    setPao2Calculada(null);
    setGradienteNormalEsperado(null);
    setInterpretation("");
  };

  const renderInputField = (name: keyof GradienteAaFormValues, label: string, placeholder: string, unit: string, description?: string, icon?: React.ReactNode) => (
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
        <CardTitle className="flex items-center"><BarChart3 className="mr-2 h-6 w-6 text-blue-500" />Gradiente Alvéolo-arterial de O₂ (A-aDO₂)</CardTitle>
        <CardDescription>
          Calcula la diferencia entre la presión alveolar de oxígeno (PAO₂) y la presión arterial de oxígeno (PaO₂).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderInputField("fio2", "FiO₂ (Fracción Inspirada de O₂)", "Ej: 21", "%", "Aire ambiente es 21%.", <Waves />)}
            {renderInputField("pao2", "PaO₂ (Presión Arterial de O₂)", "Ej: 90", "mmHg")}
            {renderInputField("paco2", "PaCO₂ (Presión Arterial de CO₂)", "Ej: 40", "mmHg")}
            {renderInputField("presionBarometrica", "Presión Barométrica (PB)", "Ej: 760", "mmHg", "Nivel del mar aprox. 760 mmHg.", <ThermometerIcon />)}
            {renderInputField("edad", "Edad (Opcional)", "Ej: 30", "años", "Para calcular el gradiente normal esperado.", <User />)}
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                <RefreshCcw className="mr-2 h-4 w-4" /> Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                <Sigma className="mr-2 h-4 w-4" /> Calcular Gradiente A-a
              </Button>
            </div>
          </form>
        </Form>

        {gradienteAaResult !== null && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
            <h3 className="text-xl font-bold text-center mb-3 text-foreground">Resultado del Gradiente A-a</h3>
            <div className="grid grid-cols-1 gap-2 text-center">
                {pao2Calculada !== null && (
                     <p className="text-sm">PAO₂ Calculada: <span className="font-semibold">{pao2Calculada.toFixed(1)} mmHg</span></p>
                )}
                <p className="text-3xl font-extrabold text-primary mb-1">{gradienteAaResult.toFixed(1)} mmHg</p>
                {gradienteNormalEsperado && (
                    <p className="text-xs text-muted-foreground">Normal Esperado: {gradienteNormalEsperado}</p>
                )}
                 <p className={cn("text-sm font-semibold", interpretation.includes("Elevado") ? "text-orange-600" : "text-green-600")}>
                    {interpretation}
                </p>
            </div>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                El gradiente A-a evalúa la eficiencia de la transferencia de oxígeno de los alvéolos a la sangre.
            </p>
            <p><strong>Fórmulas Utilizadas:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li>PAO₂ = (FiO₂/100 × (PB - PH₂O)) - (PaCO₂ / R)</li>
                <li>A-aDO₂ = PAO₂ - PaO₂</li>
                <li>PH₂O (Presión de vapor de agua) = 47 mmHg</li>
                <li>R (Cociente respiratorio) = 0.8</li>
                <li>Gradiente A-a Normal Esperado ≈ (Edad / 4) + 4 mmHg</li>
            </ul>
            <p className="italic">
                Un gradiente A-a elevado puede indicar V/Q mismatch, shunt, o limitación de la difusión. La interpretación debe hacerse en el contexto clínico.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GradienteAaCalculator;