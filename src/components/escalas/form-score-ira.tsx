"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ScaleCardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, ShieldAlert as RiskIcon, Shield, Download, ChevronDown, CheckCircle, AlertTriangle as AlertTriangleIcon } from 'lucide-react'; 
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pautaSchema = z.object({
  malformacionCongenita: z.string({ required_error: "Seleccione una opción." }),
  tabaquismoMaterno: z.string({ required_error: "Seleccione una opción." }),
  hospitalizacionAnterior: z.string({ required_error: "Seleccione una opción." }),
  desnutricion: z.string({ required_error: "Seleccione una opción." }),
  bajaEscolaridad: z.string({ required_error: "Seleccione una opción." }),
  bajoPesoNacimiento: z.string({ required_error: "Seleccione una opción." }),
  lactanciaInsuficiente: z.string({ required_error: "Seleccione una opción." }),
  madreAdolescente: z.string({ required_error: "Seleccione una opción." }),
  sindromeBronquial: z.string({ required_error: "Seleccione una opción." }),
});

type PautaFormValues = z.infer<typeof pautaSchema>;

interface PautaQuestion {
  id: keyof PautaFormValues;
  text: string;
  subtext?: string;
  points: number;
}

const scoreIraQuestions: PautaQuestion[] = [
  { id: 'malformacionCongenita', text: 'Malformación congénita', points: 11 },
  { id: 'tabaquismoMaterno', text: 'Tabaquismo materno', points: 6 },
  { id: 'hospitalizacionAnterior', text: 'Hospitalización anterior', points: 6 },
  { id: 'desnutricion', text: 'Desnutrición (Peso/Edad: -2DS)', points: 5 },
  { id: 'bajaEscolaridad', text: 'Baja escolaridad materna', points: 4 },
  { id: 'bajoPesoNacimiento', text: 'Bajo peso de nacimiento (menos de 2500 g)', points: 3 },
  { id: 'lactanciaInsuficiente', text: 'Lactancia materna insuficiente (LM + LA)', points: 3 },
  { id: 'madreAdolescente', text: 'Madre adolescente (menor de 20 años)', points: 2 },
  { id: 'sindromeBronquial', text: 'Síndrome Bronquial Obstructivo', subtext:'(al menos 3 episodios al año o persistente)', points: 2 },
];

const siNoOptions = [{ value: 'yes', label: 'Sí' }, { value: 'no', label: 'No' }];

const ScoreIRACalculator: React.FC = () => {
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const [interpretation, setInterpretation] = useState<{ text: string, action: string, color: string, icon: React.ReactNode } | null>(null);
    const [patientName, setPatientName] = useState('');
    const { toast } = useToast();

    const form = useForm<PautaFormValues>({
        resolver: zodResolver(pautaSchema),
        defaultValues: {},
    });

    const onSubmit = (data: PautaFormValues) => {
        const score = scoreIraQuestions.reduce((sum, q) => sum + (data[q.id] === 'yes' ? q.points : 0), 0);
        setTotalScore(score);

        if (score >= 10) {
            setInterpretation({
                text: "Riesgo Grave",
                action: "Requiere evaluación y manejo especializado.",
                color: "text-red-600 dark:text-red-500",
                icon: <RiskIcon className="mr-2 h-5 w-5" />
            });
        } else if (score >= 6) {
            setInterpretation({
                text: "Riesgo Moderado",
                action: "Requiere seguimiento cercano y educación.",
                color: "text-yellow-600 dark:text-yellow-400",
                icon: <RiskIcon className="mr-2 h-5 w-5" />
            });
        } else {
            setInterpretation({
                text: "Riesgo Leve",
                action: "Mantener controles habituales y educación preventiva.",
                color: "text-green-600 dark:text-green-400",
                icon: <ShieldCheck className="mr-2 h-5 w-5" />
            });
        }
    };
    
    const resetCalculator = () => {
        form.reset();
        setTotalScore(null);
        setInterpretation(null);
        setPatientName('');
    };
    
    const generateExportContent = (formatType: 'txt' | 'csv') => {
        if (totalScore === null || !interpretation) return "";
        const formValues = form.getValues();
        const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
        
        if (formatType === 'csv') {
            const headers = ["Paciente", "Fecha", "Puntaje Total", "Interpretacion", "Acción Recomendada", ...scoreIraQuestions.map(q => `"${q.text.replace(/"/g, '""')}"`)];
            const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
            const values = [
                patientNameCsv, currentDate, totalScore.toString(),
                `"${interpretation.text.replace(/"/g, '""')}"`,
                `"${interpretation.action.replace(/"/g, '""')}"`,
                ...scoreIraQuestions.map(q => `"${formValues[q.id] === 'yes' ? 'Sí' : 'No'}"`)
            ];
            return `${headers.join(",")}\n${values.join(",")}`;
        } else { // TXT format
            let content = `Resultado del Score de Riesgo de Morir por Neumonía (Score IRA)\n`;
            if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
            content += `Fecha: ${currentDate}\n\n`;
            content += `PUNTAJE TOTAL: ${totalScore} puntos\n`;
            content += `INTERPRETACIÓN: ${interpretation.text}\n`;
            content += `ACCIÓN RECOMENDADA: ${interpretation.action}\n\n`;
            content += `DETALLE DE FACTORES DE RIESGO:\n`;
            scoreIraQuestions.forEach(q => {
                const answer = formValues[q.id];
                if (answer === 'yes') {
                    content += `- ${q.text}: Sí (${q.points} ptos)\n`;
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
        link.download = `score_ira_${patientName.replace(/\s+/g, '_') || 'paciente'}_${new Date().toISOString().split('T')[0]}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo .${extension}` });
    };

    const renderRadioGroupField = (question: PautaQuestion) => (
        <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-md bg-card shadow-sm hover:bg-muted/50 transition-colors">
                    <div className="flex-1 pr-4 mb-2 sm:mb-0">
                      <FormLabel className="text-sm font-medium">
                        {question.text} <span className="text-xs text-muted-foreground">({question.points} pts)</span>
                      </FormLabel>
                      {question.subtext && <p className="text-xs text-muted-foreground">{question.subtext}</p>}
                    </div>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4 mt-2 sm:mt-0">
                            {siNoOptions.map(option => (
                                <FormItem key={option.value} className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value={option.value} /></FormControl>
                                    <FormLabel className="font-normal text-sm cursor-pointer">{option.label}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-xs sm:ml-4" />
                </FormItem>
            )}
        />
    );

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center"><RiskIcon className="mr-2 h-6 w-6 text-red-500" />Score de Riesgo de Morir por Neumonía (Score IRA)</CardTitle>
                <ScaleCardDescription>
                    Puntaje para estratificar el riesgo en lactantes, basado en factores de riesgo biopsicosociales y médicos.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label htmlFor="patientNameIra">Nombre del Niño/a (Opcional)</Label>
                    <Input id="patientNameIra" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Ingrese nombre..." />
                </div>
                <Separator className="my-6" />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {scoreIraQuestions.map(q => renderRadioGroupField(q))}
                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">Limpiar</Button>
                            <Button type="submit" className="w-full sm:w-auto">Calcular Riesgo</Button>
                        </div>
                    </form>
                </Form>
                {totalScore !== null && interpretation && (
                    <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                         <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                            <h3 className="text-xl font-bold">Resultado de la Pauta</h3>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Exportar <ChevronDown className="ml-1 h-4 w-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleExport('txt')}>Como TXT</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleExport('csv')}>Como CSV</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <p className="text-3xl font-extrabold text-center text-primary mb-1">{totalScore} puntos</p>
                        <div className={cn("text-lg font-semibold flex flex-col items-center justify-center", interpretation.color)}>
                            <div className="flex items-center">
                                {interpretation.icon} {interpretation.text}
                            </div>
                            <p className="text-sm font-normal text-muted-foreground mt-1">{interpretation.action}</p>
                        </div>
                    </div>
                )}
                 <Separator className="my-8" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p><strong>Puntos de corte y nivel de riesgo:</strong></p>
                    <ul className="list-disc list-inside pl-4">
                        <li><strong>0-5 puntos:</strong> Riesgo Leve.</li>
                        <li><strong>6-9 puntos:</strong> Riesgo Moderado.</li>
                        <li><strong>≥ 10 puntos:</strong> Riesgo Grave.</li>
                    </ul>
                    <p className="italic">Fuente: Anexo 22, "Niños y Niñas de 0 a 9 años en la Atención Primaria de Salud", MINSAL, 2021.</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ScoreIRACalculator;
