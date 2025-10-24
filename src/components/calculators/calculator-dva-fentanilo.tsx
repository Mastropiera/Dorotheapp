"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Weight, Syringe, RefreshCcw, Info } from 'lucide-react';

const dvaSchema = z.object({
  peso: z.coerce.number().min(0.1, "Peso debe ser > 0 kg").optional(),
  indicacionDosis: z.coerce.number().min(0, "Debe ser >= 0").optional(),
  velocidadInfusion: z.coerce.number().min(0, "Debe ser >= 0").optional(),
  drogaMg: z.coerce.number().min(0, "Debe ser >= 0").default(2), // 2000µg = 2mg
  volumenMl: z.coerce.number().min(1, "Debe ser > 0 ml").default(100),
});

type DvaFormValues = z.infer<typeof dvaSchema>;

const DVAFentaniloCalculator: React.FC = () => {
  const [calculating, setCalculating] = useState<'dose' | 'rate' | null>(null);

  const form = useForm<DvaFormValues>({
    resolver: zodResolver(dvaSchema),
    defaultValues: {
      drogaMg: 2,
      volumenMl: 100,
    },
  });

  const { watch, setValue, trigger } = form;
  const watchedValues = watch();

  useEffect(() => {
    if (!calculating) return;

    const { peso, indicacionDosis, velocidadInfusion, drogaMg, volumenMl } = watchedValues;
    const concentracionMcgMl = (drogaMg || 0) * 1000 / (volumenMl || 1);

    if (calculating === 'rate') {
        if (peso && indicacionDosis !== undefined && concentracionMcgMl > 0) {
            // indicacionDosis (µg/kg/hr) * peso (kg) = total µg/hr
            // (total µg/hr) / concentracion (µg/ml) = ml/hr
            const mlh = (indicacionDosis * peso) / concentracionMcgMl;
            setValue('velocidadInfusion', parseFloat(mlh.toFixed(2)));
        }
    }

    if (calculating === 'dose') {
        if (peso && velocidadInfusion !== undefined && peso > 0) {
            // velocidadInfusion (ml/hr) * concentracion (µg/ml) = total µg/hr
            // (total µg/hr) / peso (kg) = µg/kg/hr
            const dosis = (velocidadInfusion * concentracionMcgMl) / peso;
            setValue('indicacionDosis', parseFloat(dosis.toFixed(2)));
        }
    }
    
  }, [watchedValues, calculating, setValue]);

  const handleCalculate = async (type: 'dose' | 'rate') => {
    setCalculating(null); 
    await new Promise(resolve => setTimeout(resolve, 0)); 
    
    let isValid = false;
    if (type === 'rate') {
        isValid = await trigger(['peso', 'indicacionDosis', 'drogaMg', 'volumenMl']);
    } else { 
        isValid = await trigger(['peso', 'velocidadInfusion', 'drogaMg', 'volumenMl']);
    }
    
    if (isValid) {
        setCalculating(type);
    }
  };
  
  const resetCalculator = () => {
    form.reset({
      peso: undefined,
      indicacionDosis: undefined,
      velocidadInfusion: undefined,
      drogaMg: 2,
      volumenMl: 100,
    });
    setCalculating(null);
  };

  const renderInputField = (name: keyof DvaFormValues, label: string, unit: string, icon?: React.ReactNode, description?: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center text-sm">{icon && <span className="mr-2 h-4 w-4">{icon}</span>}{label}</FormLabel>
          <div className="flex items-center">
            <FormControl>
              <Input
                type="number"
                {...field}
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                onFocus={e => e.target.select()}
                className="h-9"
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
  
  const concentracion = ((watchedValues.drogaMg || 0) * 1000) / (watchedValues.volumenMl || 1);

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><Syringe className="mr-2 h-6 w-6 text-teal-500" />Cálculo de Fentanilo</CardTitle>
        <CardDescription>
          Analgésico opioide potente. Actúa sobre receptores μ para aliviar el dolor intenso. De inicio rápido y corta duración.
        </CardDescription>
        <p className="text-xs text-muted-foreground pt-1">Presentación: Ampolla de 0,1 mg/2ml, o Ampolla de 0,5mg/10ml</p>
        <p className="text-xs text-muted-foreground pt-1">Dilución estándar: 2000µg/100ml (2mg/100ml).</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <Card className="p-4 bg-muted/30">
                <CardHeader className="p-0 pb-2 mb-2"><CardTitle className="text-base">Datos de la Dilución</CardTitle></CardHeader>
                <CardContent className="p-0 grid grid-cols-2 gap-4">
                    {renderInputField("drogaMg", "Fármaco (Fentanilo)", "mg")}
                    {renderInputField("volumenMl", "Volumen Total", "ml")}
                    <div className="col-span-2 text-sm font-medium text-center p-2 bg-background rounded-md">
                        Concentración: {concentracion.toFixed(2)} µg/ml
                    </div>
                </CardContent>
            </Card>
            
            <div className="space-y-4">
                {renderInputField("peso", "Peso del Paciente", "kg", <Weight />)}
                <Separator/>

                <div className="p-4 border rounded-lg shadow-sm">
                    <h4 className="font-semibold mb-2">Calcular Velocidad de Infusión</h4>
                    {renderInputField("indicacionDosis", "Dosis Indicada", "µg/kg/hr", <Syringe />)}
                    <Button type="button" onClick={() => handleCalculate('rate')} className="mt-2 w-full">Calcular ml/h</Button>
                </div>

                <div className="text-center text-sm font-semibold text-muted-foreground">O</div>
                
                <div className="p-4 border rounded-lg shadow-sm">
                    <h4 className="font-semibold mb-2">Calcular Dosis</h4>
                    {renderInputField("velocidadInfusion", "Velocidad de Infusión", "ml/h", <Syringe />)}
                    <Button type="button" onClick={() => handleCalculate('dose')} className="mt-2 w-full">Calcular µg/kg/hr</Button>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                <RefreshCcw className="mr-2 h-4 w-4" /> Limpiar Todo
              </Button>
            </div>
          </form>
        </Form>
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/>
                Esta calculadora utiliza las fórmulas estándar para la infusión de Fentanilo.
            </p>
            <p><strong>Fórmulas:</strong></p>
            <ul className="list-disc list-inside pl-4">
                <li>ml/h = (Dosis [µg/kg/hr] × Peso [kg]) / Concentración [µg/ml]</li>
                <li>Dosis [µg/kg/hr] = (Velocidad [ml/h] × Concentración [µg/ml]) / Peso [kg]</li>
            </ul>
             <p className="italic">
                Verifique siempre los cálculos y protocolos institucionales. Esta herramienta es una ayuda y no reemplaza el juicio clínico. La infusión debe ser monitorizada de cerca.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DVAFentaniloCalculator;