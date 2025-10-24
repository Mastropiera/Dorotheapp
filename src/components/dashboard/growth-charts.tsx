
"use client";

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Baby, Info, User, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GROWTH_CHART_DATA } from '@/lib/growth-chart-data';
import { heightForAgeBoys_0_144_months, heightForAgeGirls_0_144_months } from '@/lib/height-data';
import type { ZScoreInterpretation } from '@/lib/types';
import { Label } from "@/components/ui/label";


const evaluationSchema = z.object({
  gender: z.enum(['boys', 'girls'], { required_error: "Seleccione el sexo." }),
  ageYears: z.coerce.number().min(0).max(19),
  ageMonths: z.coerce.number().min(0).max(11),
  weight: z.coerce.number().positive("El peso debe ser positivo.").optional(),
  height: z.coerce.number().positive("La talla debe ser positiva.").optional(),
  headCirc: z.coerce.number().positive("El PC debe ser positivo.").optional(),
  waistCirc: z.coerce.number().positive("La CC debe ser positiva.").optional(),
});

type EvaluationFormValues = z.infer<typeof evaluationSchema>;

const GrowthCharts: React.FC = () => {
    const [results, setResults] = useState<ZScoreInterpretation[]>([]);

    const form = useForm<EvaluationFormValues>({
        resolver: zodResolver(evaluationSchema),
        defaultValues: { ageYears: 0, ageMonths: 0 },
    });

    const onSubmit = (data: EvaluationFormValues) => {
        const totalMonths = data.ageYears * 12 + data.ageMonths;
        const calculatedResults: ZScoreInterpretation[] = [];

        // Head Circumference
        if (data.headCirc) {
            const table = data.gender === 'boys' ? GROWTH_CHART_DATA.headCircForAgeBoys.table : GROWTH_CHART_DATA.headCircForAgeGirls.table;
            const monthKey = Math.floor(totalMonths).toString();
            const dataPoint = table[monthKey];
            if (dataPoint) {
                const { sd0, sd1, sd2, sd1neg, sd2neg } = dataPoint;
                let zScore = (data.headCirc - sd0) / ((sd1 - sd1neg) / 2); // Approximation
                let diagnosis = "Normal";
                if(zScore < -2) diagnosis = "Microcefalia";
                else if(zScore > 2) diagnosis = "Macrocefalia";
                calculatedResults.push({ diagnosis: `PC/E: ${diagnosis}`, zScore: zScore.toFixed(2) });
            }
        }
        
        // Height for Age
        if (data.height) {
            const heightTable = data.gender === 'boys' ? heightForAgeBoys_0_144_months : heightForAgeGirls_0_144_months;
            const ageKey = totalMonths;
            const heightDataPoint = heightTable[ageKey];
            if (heightDataPoint) {
                const { p3, p97 } = heightDataPoint;
                let diagnosis = "Talla Normal";
                if (data.height < p3) diagnosis = "Talla Baja";
                if (data.height > p97) diagnosis = "Talla Alta";
                calculatedResults.push({ diagnosis: `Talla/Edad: ${diagnosis}` });
            }
        }

        setResults(calculatedResults);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-none border-none">
            <CardHeader>
                <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-6 w-6 text-cyan-500"/>Antropometría y Gráficos de Crecimiento</CardTitle>
                <CardDescription>
                    Evalúe el estado nutricional y el crecimiento de niños y adolescentes utilizando las curvas de referencia de la OMS.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <FormField control={form.control} name="gender" render={({ field }) => (
                                <FormItem><FormLabel>Sexo Biológico</FormLabel>
                                <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4 pt-2">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="boys" /></FormControl><Label className="font-normal">Masculino</Label></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="female" /></FormControl><Label className="font-normal">Femenino</Label></FormItem>
                                </RadioGroup></FormControl><FormMessage /></FormItem>
                            )}/>
                             <div className="space-y-2">
                                <FormLabel>Edad</FormLabel>
                                <div className="flex items-center gap-2">
                                    <FormField control={form.control} name="ageYears" render={({ field }) => (
                                        <FormItem className="flex-1"><FormControl><Input type="number" placeholder="Años" {...field} value={field.value ?? ''} /></FormControl><FormMessage/></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="ageMonths" render={({ field }) => (
                                        <FormItem className="flex-1"><FormControl><Input type="number" placeholder="Meses" {...field} value={field.value ?? ''} /></FormControl><FormMessage/></FormItem>
                                    )}/>
                                </div>
                            </div>
                        </div>

                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <FormField control={form.control} name="weight" render={({ field }) => (
                                <FormItem><FormLabel>Peso (kg)</FormLabel><FormControl><Input type="number" placeholder="Ej: 10.5" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="height" render={({ field }) => (
                                <FormItem><FormLabel>Talla (cm)</FormLabel><FormControl><Input type="number" placeholder="Ej: 81.5" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="headCirc" render={({ field }) => (
                                <FormItem><FormLabel>PC (cm)</FormLabel><FormControl><Input type="number" placeholder="Ej: 45.5" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="waistCirc" render={({ field }) => (
                                <FormItem><FormLabel>CC (cm)</FormLabel><FormControl><Input type="number" placeholder="Ej: 52" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>

                        <Button type="submit">Calcular Indicadores</Button>
                    </form>
                </Form>

                {results.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold">Resultados de la Evaluación</h3>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {results.map((res, index) => (
                                <div key={index} className="p-3 border rounded-md bg-muted/50">
                                    <p className="font-medium">{res.diagnosis}</p>
                                    {res.zScore && <p className="text-sm text-muted-foreground">Z-Score: {res.zScore}</p>}
                                    {res.percentile && <p className="text-sm text-muted-foreground">Percentil: {res.percentile}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                 <Separator className="my-8" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                       Esta herramienta utiliza los estándares de crecimiento infantil de la OMS para evaluar el estado nutricional y el desarrollo.
                    </p>
                    <p>Las interpretaciones se basan en los puntos de corte Z-score recomendados por la OMS y adaptados por el MINSAL Chile.</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default GrowthCharts;
