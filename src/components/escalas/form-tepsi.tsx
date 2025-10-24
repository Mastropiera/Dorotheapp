"use client";

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ScaleCardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Baby, CalendarIcon, Info, ClipboardCheck, AlertTriangle, Download, ChevronDown, CheckCircle, XCircle, Meh } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format, isValid, startOfDay, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { TEPSI_DATA } from '@/lib/tepsi-data';
import { TEPSI_BAREMOS_DATA } from '@/lib/tepsi-baremos-data';
import type { TEPSISubtest, TEPSIAgeCategory } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
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
const allTepsiItems = [...TEPSI_DATA.coordinacion, ...TEPSI_DATA.lenguaje, ...TEPSI_DATA.motricidad];
const scoreSchemaShape: Record<string, z.ZodType<any, any>> = {};
allTepsiItems.forEach(item => {
    scoreSchemaShape[item.id] = z.string().optional();
});
const tepsiScoreSchema = z.object(scoreSchemaShape);


type AgeFormValues = z.infer<typeof ageSchema>;
type TepsiScoreFormValues = z.infer<typeof tepsiScoreSchema>;


const TEPSIScaleForm: React.FC = () => {
    const { toast } = useToast();
    const [patientName, setPatientName] = useState('');
    const [edadCronologica, setEdadCronologica] = useState<{ years: number, months: number, days: number } | null>(null);
    const [ageCategory, setAgeCategory] = useState<TEPSIAgeCategory | null>(null);

    const [rawScores, setRawScores] = useState<Record<TEPSISubtest | 'total', number> | null>(null);
    const [tScores, setTScores] = useState<Record<TEPSISubtest | 'total', number> | null>(null);
    const [interpretations, setInterpretations] = useState<Record<TEPSISubtest | 'total', string> | null>(null);

    const ageForm = useForm<AgeFormValues>({
        resolver: zodResolver(ageSchema),
        defaultValues: { fechaControl: startOfDay(new Date()) },
    });
    
    const scoreForm = useForm<TepsiScoreFormValues>({
        resolver: zodResolver(tepsiScoreSchema),
        defaultValues: {},
    });
  
    const onAgeSubmit = (data: AgeFormValues) => {
        const fechaNac = startOfDay(data.fechaNacimiento);
        const fechaCtrl = startOfDay(data.fechaControl);

        if (!isValid(fechaNac) || !isValid(fechaCtrl)) {
            toast({title: "Fechas inválidas.", variant: "destructive"});
            return;
        }

        const totalDays = differenceInDays(fechaCtrl, fechaNac);
        const years = Math.floor(totalDays / 365.25);
        const remainingDaysAfterYears = totalDays % 365.25;
        const months = Math.floor(remainingDaysAfterYears / 30.4375);
        const days = Math.round(remainingDaysAfterYears % 30.4375);
        
        const totalMonths = years * 12 + months;

        if (totalMonths < 24 || (years === 5 && (months > 0 || days > 0)) || years > 5) {
            toast({ title: "Edad fuera de rango", description: "TEPSI es aplicable para niños de 2 años, 0 meses, 0 días hasta 5 años, 0 meses, 0 días.", variant: "destructive" });
            setEdadCronologica(null);
            setAgeCategory(null);
            return;
        }

        setEdadCronologica({ years, months, days });

        let cat: TEPSIAgeCategory | null = null;
        if (years === 2 && months <= 5) cat = "2a0m-2a5m";
        else if (years === 2) cat = "2a6m-2a11m";
        else if (years === 3 && months <= 5) cat = "3a0m-3a5m";
        else if (years === 3) cat = "3a6m-3a11m";
        else if (years === 4 && months <= 5) cat = "4a0m-4a5m";
        else if (years === 4) cat = "4a6m-4a11m";
        else if (years === 5 && months === 0 && days === 0) cat = "4a6m-4a11m"; // 5a0m0d is end of the last category
        
        setAgeCategory(cat);

        scoreForm.reset({});
        setRawScores(null);
        setTScores(null);
        setInterpretations(null);
    };

    const getTScore = (subtest: TEPSISubtest | 'total', rawScore: number, category: TEPSIAgeCategory): number => {
        const categoryData = TEPSI_BAREMOS_DATA[category];
        if (!categoryData || !(subtest in categoryData)) {
            console.error(`Baremo no encontrado para categoría ${category} y subtest ${subtest}`);
            return 0; // o manejar el error como corresponda
        }
        
        const baremo = categoryData[subtest as keyof typeof categoryData];
        for (const entry of baremo) {
            if (entry.raw.includes(rawScore)) {
                return entry.t;
            }
        }
        return 0; // valor por defecto si el puntaje bruto no se encuentra
    };
    
    const getInterpretation = (tScore: number): string => {
        if (tScore >= 40) return "Normal";
        if (tScore >= 30) return "Riesgo";
        return "Retraso";
    };

    const calculateResult = () => {
        if (!ageCategory) {
            toast({ title: "Error", description: "Primero debe calcular la edad del niño/a.", variant: "destructive" });
            return;
        }

        const scoreData = scoreForm.getValues();
        const allItemsEvaluated = allTepsiItems.every(item => scoreData[item.id] !== undefined);
        if (!allItemsEvaluated) {
            toast({ title: "Evaluación incompleta", description: "Debe marcar 'Logrado' o 'No Logrado' para todos los ítems.", variant: "destructive"});
            return;
        }

        const subtestKeys: TEPSISubtest[] = ['coordinacion', 'lenguaje', 'motricidad'];
        const calculatedRawScores: any = {};
        
        subtestKeys.forEach(subtest => {
            calculatedRawScores[subtest] = TEPSI_DATA[subtest].reduce((sum, item) => {
                return sum + (scoreData[item.id] === 'logrado' ? 1 : 0);
            }, 0);
        });

        calculatedRawScores.total = calculatedRawScores.coordinacion + calculatedRawScores.lenguaje + calculatedRawScores.motricidad;
        setRawScores(calculatedRawScores);

        const calculatedTScores: any = {};
        const calculatedInterpretations: any = {};
        
        [...subtestKeys, 'total'].forEach(key => {
            const raw = calculatedRawScores[key as TEPSISubtest | 'total'];
            const t = getTScore(key as TEPSISubtest | 'total', raw, ageCategory);
            calculatedTScores[key as TEPSISubtest | 'total'] = t;
            calculatedInterpretations[key as TEPSISubtest | 'total'] = getInterpretation(t);
        });

        setTScores(calculatedTScores);
        setInterpretations(calculatedInterpretations);
    };

    const resetCalculator = () => {
        ageForm.reset({ fechaControl: startOfDay(new Date()), fechaNacimiento: undefined });
        scoreForm.reset({});
        setPatientName('');
        setEdadCronologica(null);
        setAgeCategory(null);
        setRawScores(null);
        setTScores(null);
        setInterpretations(null);
    };

    const generateExportContent = (formatType: 'txt' | 'csv') => {
        if (!interpretations || !rawScores || !tScores) return "";
        const ageFormData = ageForm.getValues();
        const scoreFormData = scoreForm.getValues();
        const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });

        const headers = ["Paciente", "Fecha de Control", "Fecha de Nacimiento", "Edad Cronológica", "Puntaje Bruto Coord.", "Puntaje T Coord.", "Interpretación Coord.", "Puntaje Bruto Leng.", "Puntaje T Leng.", "Interpretación Leng.", "Puntaje Bruto Mot.", "Puntaje T Mot.", "Interpretación Mot.", "Puntaje Bruto Total", "Puntaje T Total", "Interpretación Total"];
        const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
        const values = [
            patientNameCsv,
            ageFormData.fechaControl ? `"${format(ageFormData.fechaControl, "PPP", { locale: es })}"` : "N/A",
            ageFormData.fechaNacimiento ? `"${format(ageFormData.fechaNacimiento, "PPP", { locale: es })}"` : "N/A",
            edadCronologica ? `"${edadCronologica.years}a ${edadCronologica.months}m ${edadCronologica.days}d"` : "N/A",
            rawScores.coordinacion, tScores.coordinacion, interpretations.coordinacion,
            rawScores.lenguaje, tScores.lenguaje, interpretations.lenguaje,
            rawScores.motricidad, tScores.motricidad, interpretations.motricidad,
            rawScores.total, tScores.total, interpretations.total
        ];

        if (formatType === 'csv') return `${headers.join(",")}\n${values.join(",")}`;
        
        let content = "Resultado del Test de Desarrollo Psicomotor (TEPSI)\n";
        content += "-----------------------------------------------------\n\n";
        if (patientName) content += `Paciente: ${patientName}\n`;
        headers.slice(1,4).forEach((h, i) => content += `${h}: ${values[i+1]}\n`);
        content += "\nRESUMEN DE RESULTADOS:\n";
        content += `Coordinación: Puntaje Bruto=${rawScores.coordinacion}, Puntaje T=${tScores.coordinacion} (${interpretations.coordinacion})\n`;
        content += `Lenguaje: Puntaje Bruto=${rawScores.lenguaje}, Puntaje T=${tScores.lenguaje} (${interpretations.lenguaje})\n`;
        content += `Motricidad: Puntaje Bruto=${rawScores.motricidad}, Puntaje T=${tScores.motricidad} (${interpretations.motricidad})\n`;
        content += `TOTAL: Puntaje Bruto=${rawScores.total}, Puntaje T=${tScores.total} (${interpretations.total})\n`;
        
        content += "\nDETALLE DE ÍTEMS:\n";
        Object.entries(TEPSI_DATA).forEach(([subtest, items]) => {
            content += `\n--- Subtest ${subtest.charAt(0).toUpperCase() + subtest.slice(1)} ---\n`;
            items.forEach(item => {
                content += `${item.itemNumber}. ${item.text}: ${scoreFormData[item.id] === 'logrado' ? 'Logrado' : 'No Logrado'}\n`;
            });
        });
        return content;
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
        link.download = `resultado_tepsi_${patientName.replace(/\s+/g, '_') || 'paciente'}_${new Date().toISOString().split('T')[0]}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo .${extension}` });
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center"><ClipboardCheck className="mr-2 h-6 w-6 text-pink-500" />TEPSI - Test de Desarrollo Psicomotor</CardTitle>
                <ScaleCardDescription>
                    Evaluación del desarrollo psicomotor en niños de 2 a 5 años.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label>Nombre del Niño/a (Opcional)</Label>
                    <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Ingrese nombre..." />
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
                        <Button type="submit" size="sm">Calcular Edad para Baremos</Button>
                        </form>
                    </Form>
                     {edadCronologica && (
                        <div className="mt-4 pt-4 border-t text-sm">
                            <p><strong>Edad Cronológica:</strong> {`${edadCronologica.years}a ${edadCronologica.months}m ${edadCronologica.days}d`}</p>
                            <p><strong>Categoría de Baremo:</strong> {ageCategory || "Fuera de rango"}</p>
                        </div>
                    )}
                </div>

                {ageCategory && (
                    <div className="border p-4 rounded-lg bg-background shadow mb-6">
                        <h3 className="text-lg font-semibold mb-3">Paso 2: Aplicar Test</h3>
                        <Form {...scoreForm}>
                        <form onSubmit={e => {e.preventDefault(); calculateResult();}}>
                            <Accordion type="multiple" className="w-full">
                            {Object.entries(TEPSI_DATA).map(([subtest, items]) => (
                                <AccordionItem key={subtest} value={subtest}>
                                    <AccordionTrigger className="capitalize text-md font-medium">{subtest}</AccordionTrigger>
                                    <AccordionContent>
                                    <div className="space-y-3 pl-2">
                                        {items.map(item => (
                                            <FormField key={item.id} control={scoreForm.control} name={item.id as keyof TepsiScoreFormValues} render={({ field }) => (
                                                <FormItem className="p-2.5 border-b last:border-b-0">
                                                <div className="flex flex-col sm:flex-row justify-between">
                                                    <FormLabel className="text-sm font-normal flex-1 mb-2 sm:mb-0 sm:pr-4">{item.itemNumber}. {item.text}</FormLabel>
                                                    <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4 flex-shrink-0">
                                                        <FormItem className="flex items-center space-x-1"><FormControl><RadioGroupItem value="logrado" /></FormControl><FormLabel className="text-xs">Logrado (1)</FormLabel></FormItem>
                                                        <FormItem className="flex items-center space-x-1"><FormControl><RadioGroupItem value="no-logrado" /></FormControl><FormLabel className="text-xs">No Logrado (0)</FormLabel></FormItem>
                                                    </RadioGroup></FormControl>
                                                </div>
                                                <FormMessage className="text-xs pt-1"/>
                                                </FormItem>
                                            )}/>
                                        ))}
                                    </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                            </Accordion>
                            <div className="flex flex-col sm:flex-row gap-2 pt-6">
                                <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">Limpiar Todo</Button>
                                <Button type="submit" className="w-full sm:w-auto">Calcular Resultado Final</Button>
                            </div>
                        </form>
                        </Form>
                    </div>
                )}
                
                {rawScores && tScores && interpretations && (
                    <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Resultados del TEPSI</h3>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Exportar <ChevronDown className="ml-1 h-4 w-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleExport('txt')}>Como TXT</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleExport('csv')}>Como CSV</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50"><tr>
                                    <th className="p-2">Subtest</th>
                                    <th className="p-2 text-center">Puntaje Bruto</th>
                                    <th className="p-2 text-center">Puntaje T</th>
                                    <th className="p-2 text-center">Interpretación</th>
                                </tr></thead>
                                <tbody>
                                    <tr className="border-b"><td className="p-2 font-medium">Coordinación</td><td className="p-2 text-center">{rawScores.coordinacion}</td><td className="p-2 text-center">{tScores.coordinacion}</td><td className="p-2 text-center font-semibold">{interpretations.coordinacion}</td></tr>
                                    <tr className="border-b"><td className="p-2 font-medium">Lenguaje</td><td className="p-2 text-center">{rawScores.lenguaje}</td><td className="p-2 text-center">{tScores.lenguaje}</td><td className="p-2 text-center font-semibold">{interpretations.lenguaje}</td></tr>
                                    <tr className="border-b"><td className="p-2 font-medium">Motricidad</td><td className="p-2 text-center">{rawScores.motricidad}</td><td className="p-2 text-center">{tScores.motricidad}</td><td className="p-2 text-center font-semibold">{interpretations.motricidad}</td></tr>
                                    <tr className="bg-muted/50"><td className="p-2 font-bold">Total</td><td className="p-2 text-center font-bold">{rawScores.total}</td><td className="p-2 text-center font-bold">{tScores.total}</td><td className="p-2 text-center font-extrabold">{interpretations.total}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                <Separator className="my-8" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500" />
                        El TEPSI evalúa el desarrollo en 3 áreas: Coordinación, Lenguaje y Motricidad.
                    </p>
                    <p><strong>Interpretación del Puntaje T:</strong></p>
                    <ul className="list-disc list-inside pl-4">
                        <li><strong>≥ 40 puntos:</strong> Normal.</li>
                        <li><strong>30 a 39 puntos:</strong> Riesgo.</li>
                        <li><strong>≤ 29 puntos:</strong> Retraso.</li>
                    </ul>
                    <p className="italic">Fuente: Test de Desarrollo Psicomotor 2-5 años, de las autoras Isabel Margarita Haeussler y Teresa Marchant. Baremos según anexo de la Norma Técnica MINSAL, 2014.</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default TEPSIScaleForm;