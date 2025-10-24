
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ScaleCardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Baby, CalendarIcon, Info, RefreshCcw, ClipboardCheck, AlertTriangle, CheckCircle, XCircle, ChevronsUp, Download, ChevronDown, Brain, BarChart3 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format, isValid, startOfDay, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { EEDP_DATA, EEDP_PROFILE_REQUIREMENTS } from '@/lib/eedp-data';
import { EEDP_BAREMOS_DATA } from '@/lib/eedp-baremos-data';
import type { EEDPData, EEDPAgeKey, EEDPItem, EEDPProfileRequirement, TEPSIItem, TEPSISubtest, TEPSIAgeCategory } from '@/lib/types/assessments';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ageSchema = z.object({
  fechaControl: z.date({ required_error: "La fecha de control es requerida." }),
  fechaNacimiento: z.date({ required_error: "La fecha de nacimiento es requerida." }),
}).refine(data => data.fechaControl >= data.fechaNacimiento, {
  message: "La fecha de control debe ser posterior a la fecha de nacimiento.",
  path: ["fechaControl"],
});


// Create a dynamic schema based on all possible items
const allEEDPItems = Object.values(EEDP_DATA).flat();
// Define an enum with all possible item IDs for type safety
const eedpItemIds = z.enum(allEEDPItems.map(item => item.id) as [string, ...string[]]);
// Build the schema using the enum
const eedpScoreSchema = z.object(
  eedpItemIds.options.reduce((acc, id) => {
    acc[id] = z.string().optional();
    return acc;
  }, {} as Record<typeof eedpItemIds.options[number], z.ZodType<any, any>>)
);


type EedpAgeFormValues = z.infer<typeof ageSchema>;
type EedpScoreFormValues = z.infer<typeof eedpScoreSchema>;

type AreaKey = 'Motor' | 'Lenguaje' | 'Social' | 'Coordinación';
const areaMap: Record<string, AreaKey> = { M: 'Motor', L: 'Lenguaje', S: 'Social', C: 'Coordinación' };

const EEDPScaleForm: React.FC = () => {
    const { toast } = useToast();
    const [patientName, setPatientName] = useState('');
    const [edadCronologica, setEdadCronologica] = useState<string | null>(null);
    const [edadCronologicaMeses, setEdadCronologicaMeses] = useState<number | null>(null);
    const [edadParaPrueba, setEdadParaPrueba] = useState<number | null>(null);
    
    // Final result states
    const [calculatedEdadBase, setCalculatedEdadBase] = useState<number | null>(null);
    const [calculatedExitosAdicionales, setCalculatedExitosAdicionales] = useState<number | null>(null);
    const [edadMental, setEdadMental] = useState<number | null>(null);
    const [coeficienteDesarrollo, setCoeficienteDesarrollo] = useState<number | null>(null);
    const [standardScore, setStandardScore] = useState<number | null>(null);
    const [interpretation, setInterpretation] = useState<{ text: string; color: string; icon: React.ReactNode; } | null>(null);
    const [profileResult, setProfileResult] = useState<{ normal: boolean; rezagos: AreaKey[] } | null>(null);

    const itemNumberToIdMap = useMemo(() => {
        const map = new Map<number, string>();
        allEEDPItems.forEach(item => {
            map.set(item.itemNumber, item.id);
        });
        return map;
    }, []);

    const ageForm = useForm<EedpAgeFormValues>({
      resolver: zodResolver(ageSchema),
      defaultValues: { fechaControl: startOfDay(new Date()) },
    });

    const scoreForm = useForm<EedpScoreFormValues>({
        resolver: zodResolver(eedpScoreSchema),
        defaultValues: {},
    });
  
    const onAgeSubmit = (data: EedpAgeFormValues) => {
        const fechaNac = startOfDay(data.fechaNacimiento);
        const fechaCtrl = startOfDay(data.fechaControl);

        if (!isValid(fechaNac) || !isValid(fechaCtrl)) {
            setEdadCronologica("Fechas inválidas."); setEdadParaPrueba(null); setEdadCronologicaMeses(null);
            return;
        }

        const totalDays = differenceInDays(fechaCtrl, fechaNac);
        const cronoMonths = Math.floor(totalDays / 30.4375);
        const cronoDays = Math.round(totalDays % 30.4375);
        
        setEdadCronologica(`${cronoMonths} mes(es) y ${cronoDays} día(s)`);
        setEdadCronologicaMeses(cronoMonths + (cronoDays / 30.4375));

        let edadPruebaMeses = cronoMonths;
        if (cronoDays >= 16) {
            edadPruebaMeses += 1;
        }
        setEdadParaPrueba(edadPruebaMeses > 24 ? 24 : edadPruebaMeses);

        scoreForm.reset({});
        setCalculatedEdadBase(null);
        setCalculatedExitosAdicionales(null);
        setEdadMental(null);
        setCoeficienteDesarrollo(null);
        setStandardScore(null);
        setInterpretation(null);
        setProfileResult(null);
    };

    const calculateResult = () => {
        const data = scoreForm.getValues();
        if (edadCronologicaMeses === null || edadCronologicaMeses <= 0) {
            toast({ title: "Error", description: "Calcule la edad cronológica primero.", variant: "destructive"});
            return;
        }
        
        // Find Edad Base
        let edadBase = 0;
        const allAgeKeysDesc = Object.keys(EEDP_DATA).map(k => parseInt(k.replace('m', ''))).sort((a, b) => b - a);
        for (const ageMonth of allAgeKeysDesc) {
            const ageKey = `${ageMonth}m` as EEDPAgeKey;
            const itemsForMonth = EEDP_DATA[ageKey];
            const allAchieved = itemsForMonth.every(item => data[item.id as keyof EedpScoreFormValues] === 'logrado');
            if (allAchieved) {
                edadBase = ageMonth;
                break;
            }
        }
        setCalculatedEdadBase(edadBase);

        // Calculate Exitos Adicionales
        let exitosAdicionales = 0;
        const allAgeKeysAsc = allAgeKeysDesc.reverse();
        for (const ageMonth of allAgeKeysAsc) {
            if (ageMonth > edadBase) {
                const ageKey = `${ageMonth}m` as EEDPAgeKey;
                const itemsForMonth = EEDP_DATA[ageKey];
                itemsForMonth.forEach(item => {
                    if (data[item.id as keyof EedpScoreFormValues] === 'logrado') {
                        exitosAdicionales++;
                    }
                });
            }
        }
        setCalculatedExitosAdicionales(exitosAdicionales);

        const em = edadBase + (exitosAdicionales * 0.2);
        setEdadMental(em);

        const cd = (em / edadCronologicaMeses);
        setCoeficienteDesarrollo(cd);

        if (cd >= 0.85) {
            setInterpretation({ text: "Normal", color: "text-green-600 dark:text-green-400", icon: <CheckCircle /> });
        } else if (cd >= 0.70) {
            setInterpretation({ text: "Riesgo", color: "text-yellow-600 dark:text-yellow-400", icon: <AlertTriangle /> });
        } else {
            setInterpretation({ text: "Retraso", color: "text-red-600 dark:text-red-500", icon: <XCircle /> });
        }
        
        // Standard Score Calculation
        const cronoMonthKey = `${Math.round(edadCronologicaMeses)}m`;
        const baremoTable = EEDP_BAREMOS_DATA[cronoMonthKey] || EEDP_BAREMOS_DATA['24m']; // Fallback to last
        if(baremoTable) {
            let closestBaremo = baremoTable[0];
            let minDiff = Math.abs(cd - closestBaremo.cd);
            for(const entry of baremoTable) {
                const diff = Math.abs(cd - entry.cd);
                if(diff < minDiff) {
                    minDiff = diff;
                    closestBaremo = entry;
                }
            }
            const calculatedStandardScore = closestBaremo.score;
            setStandardScore(calculatedStandardScore);

        } else {
            setStandardScore(null);
        }

        // Automatic Profile Analysis Logic
        if (edadParaPrueba !== null) {
            const profileReqs = EEDP_PROFILE_REQUIREMENTS[`${edadParaPrueba}m`];
            const detectedRezagos: AreaKey[] = [];
    
            if (profileReqs) {
                for (const areaChar of (Object.keys(profileReqs) as Array<keyof EEDPProfileRequirement>)) { // 'M', 'C', 'S', 'L'
                    const reqItemGroups = profileReqs[areaChar as 'M' | 'L' | 'S' | 'C'];
                    if (!reqItemGroups) continue;
    
                    let areaAchieved = true;
                    for (const group of reqItemGroups) {
                        const isGroupAchieved = group.some((itemNumber: number) => {
                            const itemId = itemNumberToIdMap.get(itemNumber);
                            return itemId && data[itemId as keyof EedpScoreFormValues] === 'logrado';
                        });
                        if (!isGroupAchieved) {
                            areaAchieved = false;
                            break;
                        }
                    }
    
                    if (!areaAchieved) {
                        detectedRezagos.push(areaMap[areaChar]);
                    }
                }
            }
            setProfileResult({ normal: detectedRezagos.length === 0, rezagos: detectedRezagos });
        } else {
            setProfileResult(null);
        }
    };
    
    const handleMarkMonthAs = (ageKey: EEDPAgeKey, status: 'logrado' | 'no-logrado') => {
        const itemsForMonth = EEDP_DATA[ageKey];
        itemsForMonth.forEach(item => {
            scoreForm.setValue(item.id as keyof EedpScoreFormValues, status, { shouldDirty: true });
        });
        toast({
            title: `Mes de ${ageKey.replace('m', '')} marcado`,
            description: `Todos los hitos se han marcado como "${status === 'logrado' ? 'Logrado' : 'No Logrado'}".`
        });
    };

    const handleMarkPreviousMonthsAsAchieved = (currentAgeKey: EEDPAgeKey) => {
        const allAgeKeysNumeric = Object.keys(EEDP_DATA).map(k => parseInt(k.replace('m',''))).sort((a, b) => a - b);
        const currentAgeNumeric = parseInt(currentAgeKey.replace('m', ''));
    
        allAgeKeysNumeric.forEach(ageNum => {
            if (ageNum < currentAgeNumeric) {
                const ageKeyToUpdate = `${ageNum}m` as EEDPAgeKey;
                const itemsForMonth = EEDP_DATA[ageKeyToUpdate];
                itemsForMonth.forEach(item => {
                    scoreForm.setValue(item.id as keyof EedpScoreFormValues, 'logrado', { shouldDirty: true });
                });
            }
        });
    
        toast({
            title: `Meses anteriores marcados`,
            description: `Todos los hitos hasta ${currentAgeNumeric - 1} mes(es) se han marcado como "Logrado".`
        });
    };

    const resetCalculator = () => {
        ageForm.reset({ fechaControl: startOfDay(new Date()), fechaNacimiento: undefined });
        scoreForm.reset({});
        setPatientName('');
        setEdadCronologica(null); setEdadCronologicaMeses(null); setEdadParaPrueba(null);
        setCalculatedEdadBase(null); setCalculatedExitosAdicionales(null);
        setEdadMental(null); setCoeficienteDesarrollo(null); setStandardScore(null);
        setInterpretation(null); setProfileResult(null);
    };

    const generateExportContent = (formatType: 'txt' | 'csv') => {
        if (coeficienteDesarrollo === null || !interpretation || calculatedEdadBase === null) return "";
        const ageFormData = ageForm.getValues();
        const scoreFormData = scoreForm.getValues();
        const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });

        const itemsToDetail = allEEDPItems.filter(item => {
            const itemMonth = parseInt(item.id.match(/^(\d+)m/)?.[1] || '0');
            return itemMonth >= calculatedEdadBase;
        });

        const mesesAnterioresResumen = calculatedEdadBase > 1 
            ? `Meses 1 a ${calculatedEdadBase - 1}: Todos los hitos logrados (según Edad Base).`
            : "No hay meses anteriores a la Edad Base.";
        
        let profileSummary = "Análisis de Perfil no realizado.";
        if (profileResult) {
            profileSummary = profileResult.normal 
                ? "Perfil de Desarrollo Normal (sin rezagos)." 
                : `Rezago detectado en: ${profileResult.rezagos.join(', ')}.`;
        }

        if (formatType === 'csv') {
            const headers = [
                "Paciente", "Fecha de Control", "Fecha de Nacimiento",
                "Edad Cronológica", "Edad para Prueba (meses)", "Edad Base (meses)",
                "Éxitos Adicionales", "Edad Mental (meses)", "Coeficiente de Desarrollo (CD)", "Interpretación CD",
                "Puntaje Estándar", "Análisis de Perfil",
                ...itemsToDetail.map(item => `"${item.area}: ${item.text.replace(/"/g, '""')}"`)
            ];
            const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
            const values = [
                patientNameCsv,
                ageFormData.fechaControl ? `"${format(ageFormData.fechaControl, "PPP", { locale: es })}"` : "N/A",
                ageFormData.fechaNacimiento ? `"${format(ageFormData.fechaNacimiento, "PPP", { locale: es })}"` : "N/A",
                `"${edadCronologica || 'N/A'}"`,
                `"${edadParaPrueba?.toString() || 'N/A'}"`,
                `"${calculatedEdadBase?.toString() || 'N/A'}"`,
                `"${calculatedExitosAdicionales?.toString() || 'N/A'}"`,
                `"${edadMental?.toFixed(2) || 'N/A'}"`,
                `"${coeficienteDesarrollo?.toFixed(2) || 'N/A'}"`,
                `"${interpretation.text}"`,
                `"${standardScore?.toString() || 'N/A'}"`,
                `"${profileSummary}"`,
                ...itemsToDetail.map(item => `"${scoreFormData[item.id as keyof EedpScoreFormValues] === 'logrado' ? 'Logrado' : (scoreFormData[item.id as keyof EedpScoreFormValues] === 'no-logrado' ? 'No Logrado' : 'No Evaluado')}"`)
            ];
            return `${headers.join(",")}\n${values.join(",")}`;
        } else { // TXT
            let content = "Resultado de la Escala de Evaluación del Desarrollo Psicomotor (EEDP)\n";
            content += "----------------------------------------------------------------------\n\n";
            if(patientName) content += `Paciente: ${patientName}\n`;
            content += `Fecha de Control: ${ageFormData.fechaControl ? format(ageFormData.fechaControl, "PPP", { locale: es }) : "N/A"}\n`;
            content += `Fecha de Nacimiento: ${ageFormData.fechaNacimiento ? format(ageFormData.fechaNacimiento, "PPP", { locale: es }) : "N/A"}\n`;
            content += `Edad Cronológica: ${edadCronologica || "N/A"}\n`;
            content += `Edad para Prueba: ${edadParaPrueba?.toString() || "N/A"} meses\n\n`;

            content += `RESULTADOS GENERALES:\n`;
            content += `Edad Base: ${calculatedEdadBase} meses\n`;
            content += `Éxitos Adicionales: ${calculatedExitosAdicionales}\n`;
            content += `Edad Mental (EM): ${edadMental?.toFixed(2) || "N/A"} meses\n`;
            content += `Coeficiente de Desarrollo (CD): ${coeficienteDesarrollo?.toFixed(2) || "N/A"} -> ${interpretation.text}\n`;
            content += `Puntaje Estándar (PE): ${standardScore?.toFixed(2) || 'N/A'}\n\n`;

            content += `ANÁLISIS DEL PERFIL DE DESARROLLO:\n${profileSummary}\n\n`;
            content += `DETALLE DE LA EVALUACIÓN:\n`;
            content += "--------------------------\n";
            content += `${mesesAnterioresResumen}\n`;

            let currentMonth = -1;
            itemsToDetail.forEach((item) => {
                const itemMonth = parseInt(item.id.match(/^(\d+)m/)?.[1] || '0');
                if (itemMonth > currentMonth) {
                    content += `\n-- Mes ${itemMonth} --\n`;
                    currentMonth = itemMonth;
                }
                if (scoreFormData[item.id as keyof EedpScoreFormValues]) {
                   content += `- #${item.itemNumber} ${areaMap[item.area as keyof typeof areaMap]}: ${item.text} -> ${scoreFormData[item.id as keyof EedpScoreFormValues] === 'logrado' ? 'Logrado' : 'No Logrado'}\n`;
                }
            });
            return content;
        }
    };

    const handleExport = (formatType: 'txt' | 'csv') => {
        const content = generateExportContent(formatType);
        if (!content) {
            toast({title: "Exportación no disponible", description: "Complete y calcule el resultado para exportar.", variant: "default"});
            return;
        }
        const mimeType = formatType === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
        const extension = formatType;
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `resultado_eedp_${patientName.replace(/\s+/g, '_') || 'paciente'}_${new Date().toISOString().split('T')[0]}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo .${extension}` });
    };

    const allMonthKeys = useMemo(() => Object.keys(EEDP_DATA).map(k => parseInt(k.replace('m',''))).sort((a, b) => a - b), []);
  
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center"><ClipboardCheck className="mr-2 h-6 w-6 text-pink-500" />EEDP - Escala de Evaluación del Desarrollo Psicomotor</CardTitle>
          <ScaleCardDescription>
            Herramienta para evaluar el desarrollo de niños entre 0 y 24 meses.
          </ScaleCardDescription>
        </CardHeader>
        <CardContent>
           <div className="mb-6 space-y-2">
            <Label htmlFor="patientNameEEDP">Nombre del Niño/a (Opcional para exportación)</Label>
            <Input id="patientNameEEDP" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Ingrese nombre..." />
          </div>
          <Separator className="my-6" />

          <div className="border p-4 rounded-lg bg-background shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Paso 1: Calcular Edad</h3>
            <Form {...ageForm}>
                <form onSubmit={ageForm.handleSubmit(onAgeSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={ageForm.control} name="fechaNacimiento" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>Fecha de Nacimiento</FormLabel>
                                <Popover><PopoverTrigger asChild><FormControl>
                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP", { locale: es }) : <span>Selecciona fecha</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button></FormControl></PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus locale={es} fixedWeeks/>
                                </PopoverContent></Popover><FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={ageForm.control} name="fechaControl" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>Fecha de Control</FormLabel>
                            <Popover><PopoverTrigger asChild><FormControl>
                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP", { locale: es }) : <span>Selecciona fecha</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button></FormControl></PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (ageForm.getValues("fechaNacimiento") || new Date(0))} initialFocus locale={es} fixedWeeks/>
                                </PopoverContent></Popover><FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <Button type="submit" size="sm">Calcular Edad</Button>
                </form>
            </Form>
            {edadCronologica !== null && (
                <div className="mt-4 pt-4 border-t space-y-2">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Edad Cronológica:</p>
                        <p className="text-lg font-bold text-primary">{edadCronologica}</p>
                    </div>
                    {edadParaPrueba !== null && (
                         <div>
                            <p className="text-sm font-medium text-muted-foreground">Edad para la Prueba EEDP:</p>
                            <p className="text-lg font-bold text-primary">{edadParaPrueba} meses</p>
                            <p className="text-xs text-muted-foreground">Se debe comenzar la prueba en el mes inferior a la edad cronológica. Si el niño no logra algún ítem, se debe retroceder hasta el mes donde logre todos (Edad Base). Luego, evaluar meses posteriores para contar éxitos adicionales.</p>
                        </div>
                    )}
                </div>
            )}
          </div>
          
          {edadParaPrueba !== null && (
            <div className="border p-4 rounded-lg bg-background shadow mb-6">
                <h3 className="text-lg font-semibold mb-3">Paso 2: Aplicar Escala</h3>
                <Form {...scoreForm}>
                    <form onSubmit={(e) => { e.preventDefault(); calculateResult(); }}>
                        <Accordion type="multiple" className="w-full">
                            {allMonthKeys.map(ageNum => {
                                const ageKey = `${ageNum}m` as EEDPAgeKey;
                                const items = EEDP_DATA[ageKey];
                                return (
                                    <AccordionItem key={ageKey} value={ageKey}>
                                        <div className="flex w-full items-center">
                                            <AccordionTrigger className="flex-1 py-2 pr-2">
                                                <span>Hitos para {ageKey.replace('m', ' Meses')}</span>
                                            </AccordionTrigger>
                                            <div className="flex items-center gap-1 pl-2">
                                                <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger asChild>
                                                    <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); handleMarkPreviousMonthsAsAchieved(ageKey); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleMarkPreviousMonthsAsAchieved(ageKey); }}} className="p-1 rounded-md cursor-pointer hover:bg-accent"><ChevronsUp className="h-4 w-4 text-blue-500" /></span>
                                                </TooltipTrigger><TooltipContent><p>Marcar meses anteriores como Logrado</p></TooltipContent></Tooltip></TooltipProvider>
                                                <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger asChild>
                                                    <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); handleMarkMonthAs(ageKey, 'logrado'); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleMarkMonthAs(ageKey, 'logrado'); }}} className="p-1 rounded-md cursor-pointer hover:bg-accent"><CheckCircle className="h-4 w-4 text-green-500" /></span>
                                                </TooltipTrigger><TooltipContent><p>Marcar todo como Logrado</p></TooltipContent></Tooltip></TooltipProvider>
                                                <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger asChild>
                                                    <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); handleMarkMonthAs(ageKey, 'no-logrado'); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleMarkMonthAs(ageKey, 'no-logrado'); }}} className="p-1 rounded-md cursor-pointer hover:bg-accent"><XCircle className="h-4 w-4 text-red-500" /></span>
                                                </TooltipTrigger><TooltipContent><p>Marcar todo como No Logrado</p></TooltipContent></Tooltip></TooltipProvider>
                                            </div>
                                        </div>
                                        <AccordionContent>
                                             <div className="space-y-3 pl-2">
                                                {items.map(item => (
                                                    <FormField key={item.id} control={scoreForm.control} name={item.id as keyof EedpScoreFormValues} render={({ field }) => (
                                                        <FormItem className="p-2.5 border-b border-dashed last:border-b-0">
                                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                                                <div className="flex items-center gap-2 mb-2 sm:mb-0 flex-1">
                                                                    <FormLabel className="text-sm font-normal">#{item.itemNumber} {areaMap[item.area as keyof typeof areaMap]} - {item.text}</FormLabel>
                                                                    <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger asChild type="button" onClick={(e) => e.preventDefault()}>
                                                                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                                                    </TooltipTrigger><TooltipContent><p className="whitespace-pre-wrap text-sm max-w-xs">{EEDP_DATA[ageKey]?.find(i => i.id === item.id)?.instructions}</p></TooltipContent></Tooltip></TooltipProvider>
                                                                </div>
                                                                <FormControl>
                                                                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-2 flex-shrink-0">
                                                                        <FormItem className="flex items-center space-x-1"><FormControl><RadioGroupItem value="logrado" /></FormControl><FormLabel className="text-xs">Logrado</FormLabel></FormItem>
                                                                        <FormItem className="flex items-center space-x-1"><FormControl><RadioGroupItem value="no-logrado" /></FormControl><FormLabel className="text-xs">No Logrado</FormLabel></FormItem>
                                                                    </RadioGroup>
                                                                </FormControl>
                                                            </div>
                                                        </FormItem>
                                                    )}/>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                         <div className="flex flex-col sm:flex-row gap-2 pt-4 mt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">Limpiar Todo</Button>
                            <Button type="submit" className="w-full sm:w-auto">Calcular Resultado Final</Button>
                        </div>
                    </form>
                </Form>
            </div>
          )}

          {coeficienteDesarrollo !== null && interpretation && (
            <div className={cn("mt-6 p-4 border rounded-lg", interpretation.color.replace('text-', 'bg-').replace(/-\d{3}/, '-100 dark:bg-') + '-900/30'.replace('-600', '-700'))}>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                    <h3 className="text-lg font-semibold text-left flex-grow">Paso 3: Resultados de la Evaluación</h3>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" /> Exportar <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleExport('txt')}>
                          Como TXT (.txt)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('csv')}>
                          Como CSV (.csv)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-center mb-3">
                    <div className="p-2 bg-background/50 rounded-md">
                        <p className="text-xs font-medium text-muted-foreground">C. de Desarrollo (CD)</p>
                        <p className="text-lg font-bold">{coeficienteDesarrollo?.toFixed(2)}</p>
                        <p className={cn("text-sm font-semibold", interpretation.color)}>{interpretation.text}</p>
                    </div>
                     <div className="p-2 bg-background/50 rounded-md">
                        <p className="text-xs font-medium text-muted-foreground">Puntaje Estándar (PE)</p>
                        <p className="text-lg font-bold">{standardScore?.toFixed(2) || "N/A"}</p>
                    </div>
                    <div className="md:col-span-2 lg:col-span-1 p-2 bg-background/50 rounded-md">
                        <p className="text-xs font-medium text-muted-foreground">Perfil del Desarrollo</p>
                        <p className={cn("text-lg font-bold", profileResult?.normal ? "text-green-600" : "text-orange-600")}>
                             {profileResult?.normal ? "Normal" : "Rezago"}
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground">
                             {profileResult && !profileResult.normal ? `Áreas: ${profileResult.rezagos.join(', ')}` : "Sin rezagos detectados"}
                        </p>
                    </div>
                </div>
            </div>
          )}
          
          <Separator className="my-6" />
          <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
              La EEDP evalúa el desarrollo psicomotor en niños de 0 a 24 meses. Se calcula la Edad Mental (EM) y el Coeficiente de Desarrollo (CD).
            </p>
            <p><strong>Fórmulas:</strong></p>
            <ul className="list-disc list-inside pl-4">
                <li>Edad Mental (meses) = Edad Base + (Nº de éxitos adicionales × 0.2)</li>
                <li>Coeficiente de Desarrollo (CD) = Edad Mental / Edad Cronológica en meses</li>
            </ul>
            <p><strong>Interpretación del Coeficiente de Desarrollo (CD):</strong></p>
            <ul className="list-disc list-inside pl-4">
                <li><strong>Mayor o igual a 0,85:</strong> Normal</li>
                <li><strong>Entre 0,84 y 0,70:</strong> Riesgo</li>
                <li><strong>Menor o igual a 0,69:</strong> Retraso</li>
            </ul>
            <p className="italic">
              Fuente: Basado en la Escala de Evaluación del Desarrollo Psicomotor de 0 a 24 meses (Soledad Rodríguez et al.). Consulte el manual oficial.
            </p>
          </div>
        </CardContent>
      </Card>
    );
};

export default EEDPScaleForm;
