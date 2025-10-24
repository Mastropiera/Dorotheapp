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
import { ClipboardCheck, Info, Download, ChevronDown, Mic, MicOff, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Schema definition for all 20 questions
const schemaShape: Record<string, z.ZodType<any, any>> = {};
for (let i = 1; i <= 20; i++) {
  schemaShape[`q${i}`] = z.string({ required_error: "Debe seleccionar una opción." });
}
const mchatSchema = z.object(schemaShape);

type MchatFormValues = z.infer<typeof mchatSchema>;

interface MchatQuestion {
  id: keyof MchatFormValues;
  text: string;
  scoreForYes: number; // 1 if YES scores a point, 0 if NO scores a point
}

const mchatQuestions: MchatQuestion[] = [
  { id: "q1", text: "1. Si usted señala algo al otro lado de la habitación, ¿su hijo/a lo mira?", scoreForYes: 0 },
  { id: "q2", text: "2. ¿Alguna vez se ha preguntado si su hijo/a es sordo/a?", scoreForYes: 1 },
  { id: "q3", text: "3. ¿Su hijo/a juega a simular, por ejemplo, que habla por teléfono o que cuida a sus muñecos, o que hace como si hiciera otras cosas?", scoreForYes: 0 },
  { id: "q4", text: "4. ¿A su hijo/a le gusta subirse a cosas, como a los muebles o a juegos en la plaza?", scoreForYes: 0 },
  { id: "q5", text: "5. ¿Su hijo/a hace movimientos extraños con los dedos cerca de sus ojos?", scoreForYes: 1 },
  { id: "q6", text: "6. ¿Su hijo/a señala con el dedo para pedir algo o para solicitar ayuda?", scoreForYes: 0 },
  { id: "q7", text: "7. ¿Su hijo/a señala con el dedo para mostrarle a usted algo que le llama la atención?", scoreForYes: 0 },
  { id: "q8", text: "8. ¿Su hijo/a se interesa por otros niños?", scoreForYes: 0 },
  { id: "q9", text: "9. ¿Su hijo/a le muestra cosas, trayéndoselas o levantándolas para que usted las vea (no para pedir ayuda)?", scoreForYes: 0 },
  { id: "q10", text: "10. ¿Su hijo/a responde cuando usted lo/a llama por su nombre?", scoreForYes: 0 },
  { id: "q11", text: "11. Cuando usted le sonríe a su hijo/a, ¿le devuelve la sonrisa?", scoreForYes: 0 },
  { id: "q12", text: "12. ¿Su hijo/a se molesta con los ruidos de la vida diaria (por ej. la aspiradora o la música muy fuerte)?", scoreForYes: 1 },
  { id: "q13", text: "13. ¿Su hijo/a camina solo/a?", scoreForYes: 0 },
  { id: "q14", text: "14. ¿Su hijo/a lo/a mira a los ojos cuando usted le habla, juega con él/ella o lo/a viste?", scoreForYes: 0 },
  { id: "q15", text: "15. ¿Su hijo/a trata de imitar lo que usted hace (por ej. decir adiós con la mano, aplaudir, o hacer un ruido gracioso)?", scoreForYes: 0 },
  { id: "q16", text: "16. Si usted se da vuelta para mirar algo, ¿su hijo/a se da vuelta para ver qué es lo que usted está mirando?", scoreForYes: 0 },
  { id: "q17", text: "17. ¿Su hijo/a trata de que usted lo/a mire?", scoreForYes: 0 },
  { id: "q18", text: "18. ¿Su hijo/a entiende cuando usted le dice que haga algo?", scoreForYes: 0 },
  { id: "q19", text: "19. Si algo nuevo sucede, ¿su hijo/a lo/a mira a usted a la cara para ver cómo se siente usted al respecto?", scoreForYes: 0 },
  { id: "q20", text: "20. ¿A su hijo/a le gusta que lo/a mezan o que lo/a hagan saltar sobre sus rodillas, etc.?", scoreForYes: 0 },
];

const siNoOptions = [{ value: "yes", label: "Sí" }, { value: "no", label: "No" }];

const MchatRfForm: React.FC = () => {
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const [interpretation, setInterpretation] = useState<{ text: string, action: string, color: string } | null>(null);
    const [patientName, setPatientName] = useState('');
    const { toast } = useToast();

    const form = useForm<MchatFormValues>({
        resolver: zodResolver(mchatSchema),
        defaultValues: {},
    });

    const onSubmit = (data: MchatFormValues) => {
        let score = 0;
        mchatQuestions.forEach(q => {
            const answer = data[q.id];
            if (q.scoreForYes === 1 && answer === "yes") score++;
            else if (q.scoreForYes === 0 && answer === "no") score++;
        });
        setTotalScore(score);

        if (score >= 0 && score <= 2) {
            setInterpretation({ text: "Bajo Riesgo", action: "No se requiere ninguna acción adicional. Reevaluar en el próximo control de salud infantil.", color: "text-green-600 dark:text-green-400" });
        } else if (score >= 3 && score <= 7) {
            setInterpretation({ text: "Riesgo Moderado", action: "Requiere aplicación de Entrevista de Seguimiento (M-CHAT-R/F) para clarificar el riesgo.", color: "text-yellow-600 dark:text-yellow-400" });
        } else { // score >= 8
            setInterpretation({ text: "Alto Riesgo", action: "Se recomienda derivar directamente para una evaluación diagnóstica y de desarrollo. No es necesario aplicar la Entrevista de Seguimiento.", color: "text-red-600 dark:text-red-500" });
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
            const headers = ["Paciente", "Fecha", "Puntaje M-CHAT-R/F", "Interpretación", "Acción Recomendada", ...mchatQuestions.map(q => `"${q.text.replace(/"/g, '""')}"`)];
            const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
            const values = [
                patientNameCsv, currentDate, totalScore.toString(),
                `"${interpretation.text.replace(/"/g, '""')}"`,
                `"${interpretation.action.replace(/"/g, '""')}"`,
                ...mchatQuestions.map(q => `"${formValues[q.id] === 'yes' ? 'Sí' : 'No'}"`)
            ];
            return `${headers.join(",")}\n${values.join(",")}`;
        } else {
            let content = `Resultado de la Escala M-CHAT-R/F\n`;
            if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
            content += `Fecha: ${currentDate}\n\n`;
            content += `PUNTAJE TOTAL: ${totalScore} puntos\n`;
            content += `INTERPRETACIÓN: ${interpretation.text}\n`;
            content += `ACCIÓN RECOMENDADA: ${interpretation.action}\n\n`;
            content += `DETALLE DE LA EVALUACIÓN:\n`;
            mchatQuestions.forEach(q => {
                let points = 0;
                if (q.scoreForYes === 1 && formValues[q.id] === "yes") points = 1;
                else if (q.scoreForYes === 0 && formValues[q.id] === "no") points = 1;
                content += `- ${q.text}: ${formValues[q.id] === 'yes' ? 'Sí' : 'No'} (Puntos: ${points})\n`;
            });
            return content;
        }
    }

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
        link.download = `resultado_mchat_${patientName.replace(/\s+/g, '_') || 'paciente'}_${new Date().toISOString().split('T')[0]}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo .${extension}` });
    };

    const renderRadioGroupField = (question: MchatQuestion) => (
        <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/50 transition-colors">
                    <FormLabel className="text-sm font-medium flex-1 pr-4">{question.text}</FormLabel>
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
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center"><ClipboardCheck className="mr-2 h-6 w-6 text-pink-500" />M-CHAT-R/F</CardTitle>
                <ScaleCardDescription>
                    Herramienta de tamizaje para Trastornos del Espectro Autista en niños de 16 a 30 meses, aplicada a los padres/cuidadores.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label htmlFor="patientNameMchat">Nombre del Niño/a (Opcional)</Label>
                    <Input id="patientNameMchat" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Ingrese nombre..." />
                </div>
                <Separator className="my-6" />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {mchatQuestions.map(q => renderRadioGroupField(q))}
                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">Limpiar</Button>
                            <Button type="submit" className="w-full sm:w-auto">Calcular Riesgo</Button>
                        </div>
                    </form>
                </Form>
                {totalScore !== null && interpretation && (
                    <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                            <h3 className="text-xl font-bold">Resultado M-CHAT-R/F</h3>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Exportar <ChevronDown className="ml-1 h-4 w-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleExport('txt')}>Como TXT</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleExport('csv')}>Como CSV</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <p className="text-3xl font-extrabold text-center text-primary mb-1">{totalScore} puntos</p>
                        <div className={cn("text-center font-semibold", interpretation.color)}>
                            <p className="text-lg">{interpretation.text}</p>
                            <p className="text-sm text-muted-foreground mt-1">{interpretation.action}</p>
                        </div>
                    </div>
                )}
                <Separator className="my-8" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p><strong>Puntuación y Algoritmo de Decisión (según MINSAL):</strong></p>
                    <ul className="list-disc list-inside pl-4">
                        <li><strong>Puntaje 0-2 (Bajo Riesgo):</strong> No requiere acción. Reevaluar en próximo control.</li>
                        <li><strong>Puntaje 3-7 (Riesgo Moderado):</strong> Se debe aplicar la Entrevista de Seguimiento del M-CHAT-R/F para clarificar el riesgo. Si tras el seguimiento el puntaje persiste ≥ 2, derivar.</li>
                        <li><strong>Puntaje 8-20 (Alto Riesgo):</strong> Derivar directamente para evaluación diagnóstica.</li>
                    </ul>
                    <p className="italic">Fuente: Norma Técnica para la supervisión de niños y niñas de 0 a 9 años en la Atención Primaria de Salud, MINSAL 2014, Anexo 10.</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default MchatRfForm;
