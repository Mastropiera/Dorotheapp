"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, Baby, Info, RefreshCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { bpInfantsMaleData, bpInfantsFemaleData } from '@/lib/bp-data';
import { Label } from '../ui/label';

const bpSchema = z.object({
  sex: z.enum(['male', 'female'], { required_error: "Seleccione el sexo biológico." }),
  ageUnit: z.enum(['months', 'years'], { required_error: "Seleccione la unidad de edad." }),
  ageMonths: z.coerce.number().optional(),
  ageYears: z.coerce.number().optional(),
  height: z.coerce.number().positive("La talla debe ser positiva.").optional(),
  systolicBP: z.coerce.number().min(30, "Valor muy bajo.").max(200, "Valor muy alto."),
  diastolicBP: z.coerce.number().min(20, "Valor muy bajo.").max(150, "Valor muy alto."),
}).refine(data => {
    if (data.ageUnit === 'months') return data.ageMonths !== undefined && data.ageMonths >= 0 && data.ageMonths < 12;
    if (data.ageUnit === 'years') return data.ageYears !== undefined && data.ageYears >= 1 && data.ageYears <= 12;
    return false;
}, {
    message: "Por favor, ingrese una edad válida para la unidad seleccionada.",
    path: ["ageMonths"], // Asignar el error a uno de los campos de edad
}).refine(data => {
    if (data.ageUnit === 'years') return data.height !== undefined && data.height > 0;
    return true;
}, {
    message: "La talla es requerida para niños de 1 año o más.",
    path: ["height"],
});

type BpFormValues = z.infer<typeof bpSchema>;

type InterpretationResult = {
  systolic: string;
  diastolic: string;
  overall: 'Normal' | 'Normal-Alta' | 'Hipertensión Arterial';
};

const BPCalculatorInfantil: React.FC = () => {
    const [result, setResult] = useState<InterpretationResult | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const form = useForm<BpFormValues>({
        resolver: zodResolver(bpSchema),
        defaultValues: {
            sex: 'male',
            ageUnit: undefined,
            ageMonths: undefined,
            ageYears: undefined,
            height: undefined,
            systolicBP: undefined,
            diastolicBP: undefined,
        },
    });

    const { watch } = form;
    const ageUnit = watch('ageUnit');

    const onSubmit = (data: BpFormValues) => {
        setResult(null);
        setInfo(null);
        
        if (data.ageUnit === 'months' && data.ageMonths !== undefined) {
            const dataTable = data.sex === 'male' ? bpInfantsMaleData : bpInfantsFemaleData;
            const ageData = dataTable[data.ageMonths];

            if (!ageData) {
                setInfo("No hay datos de referencia para la edad en meses seleccionada.");
                return;
            }

            const { systolic, diastolic } = ageData;
            
            let systolicInterp = 'Normal';
            if (data.systolicBP >= systolic.p95) systolicInterp = 'Hipertensión Arterial';
            else if (data.systolicBP >= systolic.p90) systolicInterp = 'Normal-Alta';

            let diastolicInterp = 'Normal';
            if (data.diastolicBP >= diastolic.p95) diastolicInterp = 'Hipertensión Arterial';
            else if (data.diastolicBP >= diastolic.p90) diastolicInterp = 'Normal-Alta';

            let overallInterp: InterpretationResult['overall'] = 'Normal';
            if (systolicInterp === 'Hipertensión Arterial' || diastolicInterp === 'Hipertensión Arterial') {
                overallInterp = 'Hipertensión Arterial';
            } else if (systolicInterp === 'Normal-Alta' || diastolicInterp === 'Normal-Alta') {
                overallInterp = 'Normal-Alta';
            }
            
            setResult({
                systolic: systolicInterp,
                diastolic: diastolicInterp,
                overall: overallInterp,
            });
        } else if (data.ageUnit === 'years') {
            // Placeholder para la lógica futura
            setInfo("Las tablas para niños mayores de 1 año (que consideran la talla) aún no están implementadas. Próximamente disponible.");
        }
    };
    
    const resetCalculator = () => {
        form.reset({ sex: 'male', ageUnit: undefined, ageMonths: undefined, ageYears: undefined, height: undefined, systolicBP: undefined, diastolicBP: undefined });
        setResult(null);
        setInfo(null);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-none border-none">
            <CardHeader>
                <CardTitle className="flex items-center"><Heart className="mr-2 h-6 w-6 text-red-500" />Interpretación de Presión Arterial Infantil</CardTitle>
                <CardDescription>
                    Evalúe la presión arterial en niños de 0 a 12 años según las guías de referencia.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <FormField control={form.control} name="sex" render={({ field }) => (
                                <FormItem><FormLabel>Sexo Biológico</FormLabel>
                                <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4 pt-2">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="male" /></FormControl><FormLabel className="font-normal">Masculino</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="female" /></FormControl><FormLabel className="font-normal">Femenino</FormLabel></FormItem>
                                </RadioGroup></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="ageUnit" render={({ field }) => (
                                <FormItem><FormLabel>Unidad de Edad</FormLabel>
                                <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4 pt-2">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="months" /></FormControl><Label className="font-normal">Meses (&lt;1 año)</Label></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="years" /></FormControl><Label className="font-normal">Años (1-12a)</Label></FormItem>
                                </RadioGroup></FormControl><FormMessage /></FormItem>
                            )}/>
                            {ageUnit === 'months' && (
                                <FormField control={form.control} name="ageMonths" render={({ field }) => (
                                    <FormItem><FormLabel>Edad en Meses Cumplidos</FormLabel>
                                    <FormControl><Input type="number" min={0} max={11} placeholder="Ej: 6" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            )}
                            {ageUnit === 'years' && (
                                <>
                                 <FormField control={form.control} name="ageYears" render={({ field }) => (
                                    <FormItem><FormLabel>Edad en Años Cumplidos</FormLabel>
                                    <FormControl><Input type="number" min={1} max={12} placeholder="Ej: 5" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="height" render={({ field }) => (
                                    <FormItem><FormLabel>Talla (cm)</FormLabel>
                                    <FormControl><Input type="number" min={50} max={200} placeholder="Ej: 110" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                </>
                            )}
                             <FormField control={form.control} name="systolicBP" render={({ field }) => (
                                <FormItem><FormLabel>Presión Arterial Sistólica (mmHg)</FormLabel>
                                <FormControl><Input type="number" placeholder="Ej: 95" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="diastolicBP" render={({ field }) => (
                                <FormItem><FormLabel>Presión Arterial Diastólica (mmHg)</FormLabel>
                                <FormControl><Input type="number" placeholder="Ej: 60" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">Limpiar</Button>
                            <Button type="submit" className="w-full sm:w-auto">Calcular Interpretación</Button>
                        </div>
                    </form>
                </Form>

                {info && <p className="mt-6 text-center text-sm text-muted-foreground">{info}</p>}
                
                {result && (
                     <div className={cn("mt-8 p-4 border-2 rounded-lg", 
                        result.overall === 'Hipertensión Arterial' ? "border-red-500 bg-red-50 dark:bg-red-900/40" : 
                        result.overall === 'Normal-Alta' ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/40" :
                        "border-green-500 bg-green-50 dark:bg-green-900/40")}>
                        <h3 className="text-lg font-bold text-center mb-2 flex items-center justify-center">
                            {result.overall === 'Hipertensión Arterial' && <AlertTriangle className="mr-2 text-red-500"/>}
                            {result.overall === 'Normal-Alta' && <AlertTriangle className="mr-2 text-yellow-500"/>}
                            {result.overall === 'Normal' && <CheckCircle className="mr-2 text-green-500"/>}
                            Interpretación: {result.overall}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-center mt-4">
                           <div>
                                <p className="text-xs text-muted-foreground">Sistólica</p>
                                <p className="font-medium">{result.systolic}</p>
                           </div>
                           <div>
                               <p className="text-xs text-muted-foreground">Diastólica</p>
                               <p className="font-medium">{result.diastolic}</p>
                           </div>
                        </div>
                     </div>
                )}
                
                <Separator className="my-8" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                       La presión arterial se considera Normal si es &lt; p90, Normal-Alta si está entre p90 y p95, e Hipertensión Arterial si es ≥ p95 para la edad y sexo (y talla en mayores de 1 año).
                    </p>
                    <p className="italic">
                        Fuente: Guía Clínica Hipertensión Arterial Primaria o Esencial en Niños y Adolescentes de 3 a 17 años, MINSAL Chile, 2017. Las tablas de lactantes provienen de fuentes referenciales de la guía.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default BPCalculatorInfantil;
