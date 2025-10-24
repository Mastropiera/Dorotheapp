
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ScaleCardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Brain, Info, RefreshCcw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';

const camIcuSchema = z.object({
  feature1: z.string({ required_error: "Debe evaluar la Característica 1." }),
  rassScore: z.string({ required_error: "Debe ingresar un puntaje RASS." }),
  feature2_errors: z.coerce.number().min(0, "Mínimo 0 errores.").max(10, "Máximo 10 errores.").int(),
  feature4_errors: z.coerce.number().min(0, "Mínimo 0 errores.").max(5, "Máximo 5 errores.").int(),
});

type CamIcuFormValues = z.infer<typeof camIcuSchema>;

const RASS_LEVELS_FOR_ASSESSMENT = [
    { value: "+4", label: "+4 Combativo" },
    { value: "+3", label: "+3 Muy Agitado" },
    { value: "+2", label: "+2 Agitado" },
    { value: "+1", label: "+1 Inquieto" },
    { value: "0", label: "0 Alerta y Tranquilo" },
    { value: "-1", label: "-1 Somnoliento" },
    { value: "-2", label: "-2 Sedación Leve" },
    { value: "-3", label: "-3 Sedación Moderada" },
    { value: "-4", label: "-4 Sedación Profunda" },
    { value: "-5", label: "-5 No Despertable" },
];

const CamIcuForm: React.FC = () => {
    const [result, setResult] = useState<{ positive: boolean; text: string; details: string[] } | null>(null);

    const form = useForm<CamIcuFormValues>({
        resolver: zodResolver(camIcuSchema),
        defaultValues: {
            feature2_errors: 0,
            feature4_errors: 0,
        },
    });

    const { watch, setValue } = form;
    const watchRassScore = watch('rassScore');
    const isDeeplySedated = watchRassScore === '-4' || watchRassScore === '-5';

    // Reset feature 4 if RASS is not in the appropriate range
    React.useEffect(() => {
        if (watchRassScore !== '0' && watchRassScore !== '-1') {
            setValue('feature4_errors', 0);
        }
    }, [watchRassScore, setValue]);


    const onSubmit = (data: CamIcuFormValues) => {
        if (isDeeplySedated) {
            setResult({ positive: false, text: "No se puede evaluar", details: ["Paciente con sedación profunda o no despertable (RASS -4 o -5). Reevaluar cuando la sedación sea menor."] });
            return;
        }

        const feature1_present = data.feature1 === 'yes';
        const feature2_present = data.feature2_errors > 2;
        const feature3_present = data.rassScore !== '0';
        const feature4_present = (watchRassScore === '0' || watchRassScore === '-1') ? data.feature4_errors > 1 : false;

        const isDeliriumPositive = feature1_present && feature2_present && (feature3_present || feature4_present);

        const details = [
            `Característica 1 (Inicio Agudo/Curso Fluctuante): ${feature1_present ? 'Presente' : 'Ausente'}`,
            `Característica 2 (Inatención): ${feature2_present ? 'Presente' : 'Ausente'} (Errores: ${data.feature2_errors})`,
            `Característica 3 (Nivel de Conciencia Alterado): ${feature3_present ? 'Presente' : 'Ausente'} (RASS: ${data.rassScore})`,
        ];

        if (watchRassScore === '0' || watchRassScore === '-1') {
            details.push(`Característica 4 (Pensamiento Desorganizado): ${feature4_present ? 'Presente' : 'Ausente'} (Errores: ${data.feature4_errors})`);
        }


        if (isDeliriumPositive) {
            setResult({ positive: true, text: "CAM-ICU Positivo (Delirium Presente)", details });
        } else {
            setResult({ positive: false, text: "CAM-ICU Negativo (Delirium Ausente)", details });
        }
    };

    const resetCalculator = () => {
        form.reset({
            feature2_errors: 0,
            feature4_errors: 0,
            rassScore: undefined,
            feature1: undefined,
        });
        setResult(null);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center"><Brain className="mr-2 h-6 w-6 text-purple-500" />CAM-ICU (Confusion Assessment Method)</CardTitle>
                <ScaleCardDescription>
                    Método de Evaluación de la Confusión para la UCI. Evalúa la presencia de delirium en pacientes críticos.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Paso 1: Sedación y Nivel de Conciencia</AccordionTrigger>
                                <AccordionContent className="pt-4 space-y-4">
                                    <FormField control={form.control} name="rassScore" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Evalúe el Nivel de Sedación (RASS)</FormLabel>
                                            <FormControl>
                                                <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 gap-2">
                                                    {RASS_LEVELS_FOR_ASSESSMENT.map(level => (
                                                        <FormItem key={level.value} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-muted/50">
                                                            <FormControl><RadioGroupItem value={level.value} /></FormControl>
                                                            <Label className="font-normal text-sm cursor-pointer">{level.label}</Label>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormDescription className="text-xs">Si el paciente es RASS -4 o -5, no se puede evaluar CAM-ICU. Reevaluar más tarde.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                </AccordionContent>
                            </AccordionItem>
                            
                            {!isDeeplySedated && (
                            <>
                                <AccordionItem value="item-2">
                                <AccordionTrigger>Paso 2: Evaluación CAM-ICU</AccordionTrigger>
                                <AccordionContent className="pt-4 space-y-6">
                                    <FormField control={form.control} name="feature1" render={({ field }) => (
                                        <FormItem>
                                        <FormLabel className="font-semibold">Característica 1: ¿Cambio agudo o curso fluctuante del estado mental?</FormLabel>
                                        <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><Label className="font-normal">Sí</Label></FormItem>
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><Label className="font-normal">No</Label></FormItem>
                                        </RadioGroup></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <Separator/>
                                    <FormField control={form.control} name="feature2_errors" render={({ field }) => (
                                        <FormItem>
                                        <FormLabel className="font-semibold">Característica 2: Inatención</FormLabel>
                                        <FormDescription>Pida al paciente que apriete su mano cada vez que oiga la letra 'A' en la secuencia S-A-V-E-A-H-A-A-R-T. (Se lee a 1 letra/seg). Ingrese el número de errores (omisiones o apretar en letra incorrecta).</FormDescription>
                                        <FormControl><Input type="number" min={0} max={10} {...field} className="w-24"/></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <Separator/>
                                    <FormField control={form.control} name="feature4_errors" render={({ field }) => (
                                        <FormItem>
                                        <FormLabel className={cn("font-semibold", (watchRassScore !== '0' && watchRassScore !== '-1') && "text-muted-foreground")}>Característica 4: Pensamiento Desorganizado</FormLabel>
                                        <FormDescription>Aplicar solo si RASS es 0 o -1. Haga estas 4 preguntas y una orden. Ingrese el número total de errores.<br/>1. ¿Una piedra flota en el agua? (No)<br/>2. ¿Hay peces en el mar? (Sí)<br/>3. ¿Pesa más 1 kg que 2 kg? (No)<br/>4. ¿Se puede usar un martillo para clavar un clavo? (Sí)<br/>Orden: "Levante dos dedos" (hacerlo primero). "Ahora haga lo mismo con la otra mano" (no demostrar).</FormDescription>
                                        <FormControl><Input type="number" min={0} max={5} {...field} className="w-24" disabled={watchRassScore !== '0' && watchRassScore !== '-1'}/></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}/>
                                </AccordionContent>
                                </AccordionItem>
                            </>
                            )}
                        </Accordion>
                        
                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">Limpiar</Button>
                            <Button type="submit" className="w-full sm:w-auto">Evaluar CAM-ICU</Button>
                        </div>
                    </form>
                </Form>

                {result && (
                    <div className={cn("mt-8 p-6 border rounded-lg", result.positive ? "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700" : "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700")}>
                        <h3 className={cn("text-xl font-bold mb-2 flex items-center", result.positive ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300")}>
                            {result.positive ? <XCircle className="mr-2"/> : <CheckCircle className="mr-2"/>}
                            {result.text}
                        </h3>
                        <ul className="text-sm list-disc pl-5 space-y-1">
                            {result.details.map((detail, index) => <li key={index}>{detail}</li>)}
                        </ul>
                    </div>
                )}
                
                <Separator className="my-8" />
                 <div className="text-xs text-muted-foreground space-y-2">
                    <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500" /> 
                        El CAM-ICU es una herramienta validada para la detección de delirium en pacientes de UCI, incluyendo aquellos con ventilación mecánica.
                    </p>
                    <p><strong>Diagnóstico de Delirium (CAM-ICU Positivo):</strong></p>
                    <p>Se requiere la presencia de la <strong>Característica 1</strong> Y la <strong>Característica 2</strong>, más la presencia de la <strong>Característica 3</strong> O la <strong>Característica 4</strong>.</p>
                    <ul className="list-disc list-inside pl-4 space-y-1">
                        <li><strong>1. Inicio Agudo/Curso Fluctuante:</strong> Sí.</li>
                        <li><strong>2. Inatención:</strong> Sí (&gt;2 errores en la prueba de atención).</li>                        <li><strong>3. Nivel de Conciencia Alterado:</strong> Sí (RASS diferente de 0).</li>
                        <li><strong>4. Pensamiento Desorganizado:</strong> Sí (&gt;1 error en las preguntas y la orden. Aplicable solo si RASS es 0 o -1).</li>
                    </ul>
                     <p className="italic">Fuente: Ely EW, et al. Delirium in mechanically ventilated patients: validity and reliability of the Confusion Assessment Method for the Intensive Care Unit (CAM-ICU). JAMA. 2001.</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default CamIcuForm;
