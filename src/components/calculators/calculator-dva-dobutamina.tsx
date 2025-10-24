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
  drogaMg: z.coerce.number().min(0, "Debe ser >= 0").default(500),
  volumenMl: z.coerce.number().min(1, "Debe ser > 0 ml").default(250),
});

type DvaFormValues = z.infer<typeof dvaSchema>;

const DVADobutaminaCalculator: React.FC = () => {
  const [calculating, setCalculating] = useState<'dose' | 'rate' | null>(null);

  const form = useForm<DvaFormValues>({
    resolver: zodResolver(dvaSchema),
    defaultValues: {
      drogaMg: 500,
      volumenMl: 250,
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
            const mlh = (indicacionDosis * peso * 60) / concentracionMcgMl;
            setValue('velocidadInfusion', parseFloat(mlh.toFixed(2)));
        }
    }

    if (calculating === 'dose') {
        if (peso && velocidadInfusion !== undefined && peso > 0) {
            const dosis = (velocidadInfusion * concentracionMcgMl) / (peso * 60);
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
      drogaMg: 500,
      volumenMl: 250,
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
        <CardTitle className="flex items-center"><Syringe className="mr-2 h-6 w-6 text-purple-500" />Cálculo de DVA: Dobutamina</CardTitle>
        <CardDescription>
          Agente inotrópico β1-adrenérgico. Aumenta la contractilidad cardíaca y el gasto cardíaco con escaso efecto cronotrópico. Indicado en insuficiencia cardíaca aguda y shock cardiogénico.
        </CardDescription>
        <p className="text-xs text-muted-foreground pt-1">Presentación: Ampolla de 250mg/5ml</p>
        <p className="text-xs text-muted-foreground pt-1">Dosis habitual: 2,5-10 µg/kg/min.</p>
        <p className="text-xs text-muted-foreground pt-1">Preparación estándar: 500mg en 250ml de SF 0,9%/SG 5% = 2000µg/ml</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <Card className="p-4 bg-muted/30">
                <CardHeader className="p-0 pb-2 mb-2"><CardTitle className="text-base">Datos de la Dilución</CardTitle></CardHeader>
                <CardContent className="p-0 grid grid-cols-2 gap-4">
                    {renderInputField("drogaMg", "Fármaco (Dobutamina)", "mg")}
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
                    {renderInputField("indicacionDosis", "Dosis Indicada", "µg/kg/min", <Syringe />)}
                    <Button type="button" onClick={() => handleCalculate('rate')} className="mt-2 w-full">Calcular ml/h</Button>
                </div>

                <div className="text-center text-sm font-semibold text-muted-foreground">O</div>
                
                <div className="p-4 border rounded-lg shadow-sm">
                    <h4 className="font-semibold mb-2">Calcular Dosis</h4>
                    {renderInputField("velocidadInfusion", "Velocidad de Infusión", "ml/h", <Syringe />)}
                    <Button type="button" onClick={() => handleCalculate('dose')} className="mt-2 w-full">Calcular µg/kg/min</Button>
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
                Esta calculadora utiliza las fórmulas estándar para la infusión de drogas vasoactivas.
            </p>
            <p><strong>Fórmulas:</strong></p>
            <ul className="list-disc list-inside pl-4">
                <li>ml/h = (Dosis [µg/kg/min] × Peso [kg] × 60) / Concentración [µg/ml]</li>
                <li>Dosis [µg/kg/min] = (Velocidad [ml/h] × Concentración [µg/ml]) / (Peso [kg] × 60)</li>
            </ul>
             <p className="italic">
                Verifique siempre los cálculos y protocolos institucionales. Esta herramienta es una ayuda y no reemplaza el juicio clínico. La dilución estándar para Dobutamina es de 500mg en 250ml.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DVADobutaminaCalculator;