"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Flame, Info, RefreshCcw, Sigma } from 'lucide-react';

const harrisBenedictSchema = z.object({
  sexo: z.enum(['masculino', 'femenino'], { required_error: "Seleccione el sexo." }),
  peso: z.coerce.number().min(1, "Peso debe ser > 0 kg").max(300, "Peso irreal"),
  talla: z.coerce.number().min(50, "Talla debe ser > 50 cm").max(300, "Talla irreal"),
  edad: z.coerce.number().min(1, "Edad debe ser > 0 años").max(120, "Edad irreal"),
});

type HarrisBenedictFormValues = z.infer<typeof harrisBenedictSchema>;

const HarrisBenedictCalculator: React.FC = () => {
  const [gebResult, setGebResult] = useState<number | null>(null);

  const form = useForm<HarrisBenedictFormValues>({
    resolver: zodResolver(harrisBenedictSchema),
    defaultValues: {
      peso: undefined,
      talla: undefined,
      edad: undefined,
    },
  });

  const onSubmit = (data: HarrisBenedictFormValues) => {
    let bmr = 0;
    if (data.sexo === 'masculino') {
      bmr = 88.362 + (13.397 * data.peso) + (4.799 * data.talla) - (5.677 * data.edad);
    } else { // femenino
      bmr = 447.593 + (9.247 * data.peso) + (3.098 * data.talla) - (4.330 * data.edad);
    }
    setGebResult(bmr);
  };

  const resetCalculator = () => {
    form.reset();
    setGebResult(null);
  };

  const renderInputField = (name: keyof Pick<HarrisBenedictFormValues, "peso" | "talla" | "edad">, label: string, placeholder: string, unit: string) => (
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
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><Flame className="mr-2 h-6 w-6 text-orange-500" />Fórmula de Harris-Benedict</CardTitle>
        <CardDescription>
          Calcula el Gasto Energético Basal (GEB) o Basal Metabolic Rate (BMR).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="sexo"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Sexo</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="masculino" /></FormControl>
                        <FormLabel className="font-normal">Masculino</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="femenino" /></FormControl>
                        <FormLabel className="font-normal">Femenino</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {renderInputField("peso", "Peso", "Ej: 70", "kg")}
            {renderInputField("talla", "Talla", "Ej: 175", "cm")}
            {renderInputField("edad", "Edad", "Ej: 30", "años")}
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                <RefreshCcw className="mr-2 h-4 w-4" /> Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                <Sigma className="mr-2 h-4 w-4" /> Calcular GEB
              </Button>
            </div>
          </form>
        </Form>

        {gebResult !== null && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50 text-center">
            <h3 className="text-xl font-bold mb-2 text-foreground">Gasto Energético Basal (GEB)</h3>
            <div className="flex items-center justify-center">
              <Flame className="mr-2 h-8 w-8 text-primary"/>
              <p className="text-3xl font-extrabold text-primary">
                {gebResult.toFixed(0)} kcal/día
              </p>
            </div>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                La fórmula de Harris-Benedict (revisada por Roza y Shizgal en 1984) estima el metabolismo basal.
            </p>
            <p><strong>Fórmulas:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>Hombres:</strong> GEB = 88.362 + (13.397 × P) + (4.799 × T) - (5.677 × E)</li>
                <li><strong>Mujeres:</strong> GEB = 447.593 + (9.247 × P) + (3.098 × T) - (4.330 × E)</li>
            </ul>
            <p>(P: Peso en kg, T: Talla en cm, E: Edad en años)</p>
            <p className="italic">
                El GEB representa las calorías mínimas necesarias en reposo. Para calcular el gasto energético total (GET), se debe multiplicar el GEB por un factor de actividad y/o factor de estrés.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HarrisBenedictCalculator;