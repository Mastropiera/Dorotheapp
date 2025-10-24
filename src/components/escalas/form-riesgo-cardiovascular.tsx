"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ScaleCardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, Info, AlertTriangle, CheckCircle, User, Cigarette, Droplet, Target } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Input } from '../ui/input';
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';


const framinghamSchema = z.object({
  sex: z.enum(['male', 'female'], { required_error: "Seleccione el sexo." }),
  age: z.coerce.number().min(35, "La edad debe ser entre 35 y 74 años.").max(74, "La edad debe ser entre 35 y 74 años."),
  smoker: z.enum(['yes', 'no'], { required_error: "Indique si es fumador/a." }),
  systolicBP: z.coerce.number().min(80, "Presión inválida.").max(220, "Presión inválida."),
  diastolicBP: z.coerce.number().min(40, "Presión inválida.").max(140, "Presión inválida."),
  totalCholesterol: z.coerce.number().min(100, "Colesterol inválido.").max(400, "Colesterol inválido."),
  hdlCholesterol: z.coerce.number().min(10, "HDL inválido.").max(100, "HDL inválido."),
});

const riesgoSchema = z.object({
  altoRiesgoIndependiente: z.string({ required_error: "Debe seleccionar una opción." }),
  framingham: framinghamSchema.optional(),
  reclassificationCriteria: z.string().optional(),
}).refine(data => {
    if (data.altoRiesgoIndependiente === 'no') {
        return !!data.framingham;
    }
    return true;
}, {
    message: "Los datos de Framingham son requeridos si no hay alto riesgo independiente.",
    path: ["framingham"],
});


type RiesgoFormValues = z.infer<typeof riesgoSchema>;
type FraminghamFormValues = z.infer<typeof framinghamSchema>;

// Data transcribed from the provided image
const framinghamData = {
  male: {
    'non-smoker': {
      '35-44': [ [1, 1, 1, 2, 2], [1, 2, 2, 2, 3], [1, 2, 2, 3, 3], [2, 3, 3, 4, 4], [2, 3, 3, 4, 4] ],
      '45-54': [ [1, 2, 2, 2, 3], [1, 2, 3, 3, 4], [2, 2, 3, 3, 5], [2, 3, 4, 4, 6], [2, 4, 5, 6, 7] ],
      '55-64': [ [1, 2, 3, 4, 4], [2, 3, 4, 5, 6], [3, 4, 5, 7, 8], [3, 5, 6, 8, 9], [3, 6, 7, 9, 11] ],
      '65-74': [ [2, 3, 4, 5, 6], [2, 3, 4, 5, 6], [2, 4, 5, 7, 8], [3, 5, 6, 8, 9], [3, 6, 7, 9, 10] ],
    },
    'smoker': {
      '35-44': [ [1, 2, 2, 2, 3], [1, 2, 2, 3, 3], [1, 2, 2, 3, 3], [2, 3, 3, 4, 4], [2, 3, 4, 5, 5] ],
      '45-54': [ [2, 3, 4, 5, 6], [2, 3, 4, 5, 6], [3, 4, 5, 7, 8], [3, 5, 6, 9, 10], [3, 6, 7, 9, 11] ],
      '55-64': [ [2, 3, 4, 5, 6], [3, 4, 5, 7, 8], [4, 5, 7, 8, 11], [5, 8, 10, 13, 15], [5, 9, 11, 14, 17] ],
      '65-74': [ [3, 5, 6, 8, 9], [3, 5, 6, 8, 9], [4, 7, 8, 11, 12], [5, 8, 10, 13, 15], [5, 9, 11, 14, 17] ],
    },
  },
  female: {
    'non-smoker': {
      '35-44': [ [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 2, 2], [1, 1, 2, 2, 2], [1, 1, 1, 2, 2] ],
      '45-54': [ [1, 1, 1, 1, 1], [1, 1, 1, 2, 2], [1, 1, 2, 2, 2], [1, 2, 2, 2, 3], [2, 2, 2, 2, 3] ],
      '55-64': [ [1, 1, 2, 2, 2], [1, 2, 2, 2, 3], [2, 2, 2, 2, 3], [2, 2, 3, 3, 4], [2, 3, 3, 4, 5] ],
      '65-74': [ [1, 1, 2, 2, 2], [2, 2, 2, 3, 3], [2, 2, 2, 2, 3], [2, 2, 3, 3, 4], [2, 3, 3, 4, 5] ],
    },
    'smoker': {
      '35-44': [ [1, 1, 1, 1, 1], [1, 1, 1, 1, 2], [1, 1, 1, 2, 2], [1, 2, 2, 2, 3], [1, 2, 3, 3, 4] ],
      '45-54': [ [1, 1, 1, 1, 2], [1, 2, 2, 2, 3], [2, 2, 2, 2, 3], [2, 2, 3, 3, 5], [2, 4, 4, 6, 6] ],
      '55-64': [ [1, 2, 2, 2, 2], [2, 2, 2, 3, 4], [2, 2, 3, 3, 4], [2, 3, 4, 4, 5], [3, 4, 4, 5, 6] ],
      '65-74': [ [1, 2, 2, 2, 2], [2, 2, 3, 3, 4], [2, 2, 3, 3, 4], [2, 3, 3, 4, 4], [3, 4, 4, 5, 6] ],
    },
  },
};

type RiskLevel = 'Bajo' | 'Moderado' | 'Alto';
type ResultadoState = {
    text: string;
    color: string;
    icon: React.ReactNode;
    details: string;
    showReclassification?: boolean;
    originalRisk?: RiskLevel;
    goals?: React.ReactNode;
};

const RiesgoCardiovascularForm: React.FC = () => {
    const [resultado, setResultado] = useState<ResultadoState | null>(null);
    const { toast } = useToast();

    const form = useForm<RiesgoFormValues>({
        resolver: zodResolver(riesgoSchema),
        defaultValues: {
            altoRiesgoIndependiente: undefined,
            reclassificationCriteria: undefined,
            framingham: {
                age: undefined,
                systolicBP: undefined,
                diastolicBP: undefined,
                totalCholesterol: undefined,
                hdlCholesterol: undefined,
                sex: undefined,
                smoker: undefined,
            }
        }
    });

    const { watch, trigger } = form;
    const altoRiesgoIndependiente = watch('altoRiesgoIndependiente');
    
    const calculateRisk = (framinghamFormValues: FraminghamFormValues) => {
        const { sex, age, smoker, systolicBP, totalCholesterol, hdlCholesterol } = framinghamFormValues;
        
        if (age < 35 || age >= 75) {
             return { finalRisk: null, riskLevel: null, error: "No se puede aplicar la tabla de Framingham. La edad debe ser entre 35 y 74 años." };
        }

        // Determine age range
        let ageRange: keyof typeof framinghamData.male['non-smoker'];
        if (age >= 35 && age <= 44) ageRange = '35-44';
        else if (age >= 45 && age <= 54) ageRange = '45-54';
        else if (age >= 55 && age <= 64) ageRange = '55-64';
        else ageRange = '65-74';

        // Determine BP range index (floor)
        let bpIndex: number;
        if (systolicBP < 120) bpIndex = 0;
        else if (systolicBP <= 129) bpIndex = 1;
        else if (systolicBP <= 139) bpIndex = 2;
        else if (systolicBP <= 159) bpIndex = 3;
        else bpIndex = 4;
        
        // Determine Cholesterol range index (apartment)
        let cholIndex: number;
        if (totalCholesterol < 160) cholIndex = 0;
        else if (totalCholesterol < 180) cholIndex = 1;
        else if (totalCholesterol < 220) cholIndex = 2;
        else if (totalCholesterol < 260) cholIndex = 3;
        else cholIndex = 4;

        const smokingStatus = smoker === 'yes' ? 'smoker' : 'non-smoker';
        
        let baseRisk = framinghamData[sex][smokingStatus][ageRange][bpIndex][cholIndex];

        // Apply HDL adjustment
        if (hdlCholesterol < 35) {
            baseRisk *= 1.5;
        } else if (hdlCholesterol >= 60) {
            baseRisk *= 0.5;
        }

        const finalRisk = Math.round(baseRisk);

        let riskLevel: RiskLevel;
        if (finalRisk < 5) riskLevel = 'Bajo';
        else if (finalRisk <= 9) riskLevel = 'Moderado';
        else riskLevel = 'Alto';
        
        return { finalRisk, riskLevel, error: null };
    };

    const getInterpretationAndGoals = (riskLevel: RiskLevel, finalRiskPercent?: number, reclassified: boolean = false) => {
        let text = "";
        let color = "";
        let icon = null;
        let goals: React.ReactNode = null;
        const riskPercentText = finalRiskPercent !== undefined ? ` (${finalRiskPercent}%)` : '';
        const reclassifiedText = reclassified ? " (reclasificado)" : "";

        const commonGoals = (
            <ul className="list-disc list-inside text-xs mt-2 space-y-1">
                <li>Abandono del tabaquismo.</li>
                <li>Actividad física de forma regular.</li>
                <li>Dieta saludable.</li>
                <li>Si bebe alcohol, que lo haga en moderación.</li>
            </ul>
        );

        switch (riskLevel) {
            case 'Bajo':
                text = `BAJO RIESGO CARDIOVASCULAR${riskPercentText}${reclassifiedText}`;
                color = "text-green-600 dark:text-green-400";
                icon = <CheckCircle className="h-6 w-6 mr-2" />;
                goals = ( <div> {commonGoals} <ul className="list-disc list-inside text-xs mt-1 pl-4 font-semibold"> <li>Col-LDL &lt; 130mg/dL</li> <li>PA &lt; 140/90mmHg**</li> </ul> </div> );
                break;
            case 'Moderado':
                text = `RIESGO MODERADO${riskPercentText}${reclassifiedText}`;
                color = "text-yellow-600 dark:text-yellow-400";
                icon = <AlertTriangle className="h-6 w-6 mr-2" />;
                goals = ( <div> {commonGoals} <ul className="list-disc list-inside text-xs mt-1 pl-4 font-semibold"> <li>Col-LDL &lt; 100mg/dL</li> <li>PA &lt; 140/90mmHg**</li> </ul> </div> );
                break;
            case 'Alto':
                text = `ALTO RIESGO CARDIOVASCULAR${riskPercentText}${reclassifiedText}`;
                color = "text-red-600 dark:text-red-500";
                icon = <AlertTriangle className="h-6 w-6 mr-2" />;
                goals = ( <div> {commonGoals} <ul className="list-disc list-inside text-xs mt-1 pl-4 font-semibold"> <li>Col-LDL &lt; 70mg/dL o &gt;50% de reducción si no es posible lograr el objetivo anterior</li> <li>HbA1c &lt; 7%*</li> <li>PA &lt; 140/90mmHg**</li> <li className="pl-4">ERC con RAC &gt; 30mg/g: PA &lt; 130/80mmHg</li> </ul> </div> );
                break;
        }
        return { text, color, icon, goals };
    };

    const onSubmit = async (data: RiesgoFormValues) => {
        if (data.altoRiesgoIndependiente === 'yes') {
            const { text, color, icon, goals } = getInterpretationAndGoals('Alto');
            setResultado({
                text, color, icon, goals,
                details: "El paciente presenta criterios que lo clasifican directamente en alto riesgo. Se debe iniciar o intensificar el manejo de los factores de riesgo.",
                showReclassification: false
            });
        } else {
            const framinghamFieldsValid = await trigger('framingham');
            if (framinghamFieldsValid && data.framingham) {
                const { finalRisk, riskLevel, error } = calculateRisk(data.framingham);

                if (error) {
                    setResultado({
                        text: "No aplicable",
                        color: "text-muted-foreground",
                        icon: <Info className="h-6 w-6 mr-2" />,
                        details: error,
                        showReclassification: false,
                        goals: null
                    });
                    return;
                }
                
                if (!riskLevel) return; // Should not happen if no error

                if (riskLevel === 'Alto') {
                    const { text, color, icon, goals } = getInterpretationAndGoals(riskLevel, finalRisk);
                    setResultado({
                        text, color, icon, goals,
                        details: `Riesgo de evento cardiovascular a 10 años, calculado según Framingham-MINSAL.`,
                        showReclassification: false,
                    });
                } else {
                    // Always show reclassification step if risk is not high initially
                    let finalRiskLevel: RiskLevel = riskLevel;
                    let reclassified = false;
                    if (data.reclassificationCriteria === 'yes') {
                        reclassified = true;
                        if (riskLevel === 'Bajo') finalRiskLevel = 'Moderado';
                        else if (riskLevel === 'Moderado') finalRiskLevel = 'Alto';
                    }
                    const { text, color, icon, goals } = getInterpretationAndGoals(finalRiskLevel, finalRisk, reclassified);
                    setResultado({
                        text, color, icon, goals,
                        details: `Riesgo de evento cardiovascular a 10 años, calculado según Framingham-MINSAL${reclassified ? ' y ajustado por criterios adicionales.' : '.'}`,
                        showReclassification: true,
                        originalRisk: riskLevel
                    });
                }
            } else {
                setResultado(null);
                toast({
                    title: "Datos incompletos",
                    description: "Por favor, complete todos los campos de la sección Framingham.",
                    variant: "destructive",
                });
            }
        }
    };
    
    const resetCalculator = () => {
        form.reset({
            altoRiesgoIndependiente: undefined,
            reclassificationCriteria: undefined,
            framingham: {
                age: undefined,
                systolicBP: undefined,
                diastolicBP: undefined,
                totalCholesterol: undefined,
                hdlCholesterol: undefined,
                sex: undefined,
                smoker: undefined,
            }
        });
        setResultado(null);
    };
    
    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center"><Heart className="mr-2 h-6 w-6 text-red-500" />Estimación del Riesgo Cardiovascular</CardTitle>
                <ScaleCardDescription>
                    Algoritmo para la estimación del riesgo cardiovascular según las guías del MINSAL, Chile.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="altoRiesgoIndependiente"
                            render={({ field }) => (
                                <FormItem className="space-y-3 p-4 border rounded-lg bg-background shadow-sm">
                                    <FormLabel className="text-base font-semibold">Paso 1: ¿El paciente tiene criterios independientes de ALTO riesgo cardiovascular?</FormLabel>
                                    <div className="text-xs text-muted-foreground">
                                        <p>Esto incluye cualquiera de los siguientes:</p>
                                        <ul className="list-disc list-inside pl-4 mt-1">
                                            <li>Diabetes Mellitus (tipo 1 o 2).</li>
                                            <li>Enfermedad Renal Crónica (ERC) con VFG &lt; 45 ml/min/1.73m² (Etapa 3b, 4 o 5).</li>
                                            <li>Antecedente de enfermedad cardiovascular ateroesclerótica documentada (infarto, angina, ACV, etc.).</li>
                                            <li>Hipertensión arterial refractaria a tratamiento.</li>
                                            <li>Colesterol LDL ≥ 190 mg/dL.</li>
                                        </ul>
                                    </div>
                                    <FormControl>
                                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4 pt-2">
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><Label className="font-normal">Sí</Label></FormItem>
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><Label className="font-normal">No</Label></FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {altoRiesgoIndependiente === 'no' && (
                             <div className="space-y-6 p-4 border rounded-lg bg-background shadow-sm">
                                <h3 className="text-base font-semibold">Paso 2: Estimar riesgo a 10 años (Framingham-MINSAL)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                     <FormField control={form.control} name="framingham.sex" render={({ field }) => (
                                        <FormItem><FormLabel className="flex items-center"><User className="mr-2 h-4 w-4"/>Sexo</FormLabel>
                                        <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4 pt-2">
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="male" /></FormControl><Label className="font-normal">Hombre</Label></FormItem>
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="female" /></FormControl><Label className="font-normal">Mujer</Label></FormItem>
                                        </RadioGroup></FormControl><FormMessage/></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="framingham.smoker" render={({ field }) => (
                                        <FormItem><FormLabel className="flex items-center"><Cigarette className="mr-2 h-4 w-4"/>¿Fumador/a?</FormLabel>
                                        <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4 pt-2">
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><Label className="font-normal">Sí</Label></FormItem>
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><Label className="font-normal">No</Label></FormItem>
                                        </RadioGroup></FormControl><FormMessage/></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="framingham.age" render={({ field }) => (
                                        <FormItem><FormLabel>Edad (años)</FormLabel>
                                        <FormControl><Input type="number" placeholder="Ej: 55" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="framingham.systolicBP" render={({ field }) => (
                                        <FormItem><FormLabel>Presión Arterial Sistólica (mmHg)</FormLabel>
                                        <FormControl><Input type="number" placeholder="Ej: 135" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="framingham.diastolicBP" render={({ field }) => (
                                        <FormItem><FormLabel>Presión Arterial Diastólica (mmHg)</FormLabel>
                                        <FormControl><Input type="number" placeholder="Ej: 85" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                     <FormField control={form.control} name="framingham.totalCholesterol" render={({ field }) => (
                                        <FormItem><FormLabel>Colesterol Total (mg/dL)</FormLabel>
                                        <FormControl><Input type="number" placeholder="Ej: 210" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                     <FormField control={form.control} name="framingham.hdlCholesterol" render={({ field }) => (
                                        <FormItem><FormLabel className="flex items-center"><Droplet className="mr-2 h-4 w-4"/>Colesterol HDL (mg/dL)</FormLabel>
                                        <FormControl><Input type="number" placeholder="Ej: 45" {...field} value={field.value || ''} /></FormControl>
                                        <FormDescription className="text-xs">Ajusta el riesgo: &lt;35 (x1.5), ≥60 (x0.5)</FormDescription>
                                        <FormMessage /></FormItem>
                                    )}/>
                                </div>
                             </div>
                        )}
                        
                        {resultado?.showReclassification && (
                             <FormField
                                control={form.control}
                                name="reclassificationCriteria"
                                render={({ field }) => (
                                    <FormItem className="space-y-3 p-4 border rounded-lg bg-background shadow-sm">
                                        <FormLabel className="text-base font-semibold">Paso 3: ¿Tiene 1 o más criterios que suben una categoría de riesgo?</FormLabel>
                                        <div className="text-xs text-muted-foreground">
                                            <ul className="list-disc list-inside pl-4 mt-1">
                                                <li>Antecedente de ECV prematura en familiares de 1º grado: &lt;55 años hombres y &lt;65 años mujeres.</li>
                                                <li>Síndrome metabólico.</li>
                                            </ul>
                                        </div>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4 pt-2">
                                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><Label className="font-normal">Sí</Label></FormItem>
                                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><Label className="font-normal">No</Label></FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">Limpiar</Button>
                            <Button type="submit" className="w-full sm:w-auto" disabled={!altoRiesgoIndependiente}>Evaluar Riesgo</Button>
                        </div>
                    </form>
                </Form>

                {resultado && (
                     <div className={cn("mt-8 p-6 border rounded-lg", resultado.color.replace('text-', 'bg-').replace(/-\d{3}/, '-50 dark:bg-') + '-900/30'.replace('-600', '-700'))}>
                        <h3 className="text-xl font-bold mb-2 flex items-center">
                            {resultado.icon}
                            {resultado.text}
                        </h3>
                        <p className="text-sm text-muted-foreground">{resultado.details}</p>
                        
                        {resultado.goals && (
                            <div className="mt-4 pt-4 border-t border-current/20">
                                <h4 className="font-semibold text-md flex items-center mb-2"><Target className="h-4 w-4 mr-2"/> Metas Terapéuticas</h4>
                                {resultado.goals}
                                <p className="text-xs text-muted-foreground mt-3">
                                    * En personas de 80 o más años, la meta de HbA1c debe ser individualizada.<br/>
                                    ** En personas de 80 o más años, la meta de PA es &lt;150/90mmHg, pero &gt;120/60mmHg.
                                </p>
                            </div>
                        )}
                    </div>
                )}
                 <Separator className="my-8" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500" /> 
                       Este es el algoritmo de dos pasos recomendado por el MINSAL. Primero se descartan condiciones de alto riesgo, y si no existen, se procede a calcular el riesgo a 10 años con la tabla de Framingham adaptada.
                    </p>
                    <p className="italic">
                        Fuente: Orientación Técnica: Estrategia de prevención secundaria para personas con enfermedades cardiovasculares (MINSAL, 2021) y guías relacionadas.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default RiesgoCardiovascularForm;
