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
import { Activity, Info, Download, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const hamiltonQuestionSchema = z.string({ required_error: "Seleccione una opción." });

const hamiltonSchemaObject: Record<string, z.ZodType<any, any>> = {};
for (let i = 1; i <= 14; i++) {
  hamiltonSchemaObject[`q${i}`] = hamiltonQuestionSchema;
}
const hamiltonSchema = z.object(hamiltonSchemaObject);

type HamiltonFormValues = z.infer<typeof hamiltonSchema>;

interface HamiltonOption {
  value: string;
  label: string;
  score: number;
}

const hamiltonOptions: HamiltonOption[] = [
    { value: "0", label: "0. Ausente", score: 0 },
    { value: "1", label: "1. Leve", score: 1 },
    { value: "2", label: "2. Moderado", score: 2 },
    { value: "3", label: "3. Grave", score: 3 },
    { value: "4", label: "4. Muy grave / Incapacitante", score: 4 },
];

const hamiltonQuestions: { id: keyof HamiltonFormValues; text: string; description?: string }[] = [
  { id: "q1", text: "1. Estado de Ánimo Ansioso", description: "Preocupaciones, anticipación de lo peor, aprensión, irritabilidad." },
  { id: "q2", text: "2. Tensión", description: "Sensación de tensión, fatiga, llanto fácil, temblor, inquietud, incapacidad para relajarse." },
  { id: "q3", text: "3. Miedos", description: "Miedo a la oscuridad, a los desconocidos, a quedarse solo, a los animales grandes, etc." },
  { id: "q4", text: "4. Insomnio", description: "Dificultad para conciliar el sueño, sueño interrumpido, sueño insatisfactorio y cansancio al despertar." },
  { id: "q5", text: "5. Funciones Intelectuales (Cognitivas)", description: "Dificultad para concentrarse, mala memoria." },
  { id: "q6", text: "6. Estado de Ánimo Deprimido", description: "Pérdida de interés, insatisfacción en las diversiones, depresión, despertar prematuro, cambios de humor durante el día." },
  { id: "q7", text: "7. Síntomas Somáticos Generales (Musculares)", description: "Dolores y molestias musculares, rigidez muscular, espasmos musculares, bruxismo, voz temblorosa." },
  { id: "q8", text: "8. Síntomas Somáticos Generales (Sensoriales)", description: "Zumbidos en los oídos, visión borrosa, sofocos o escalofríos, sensación de debilidad, sensación de hormigueo." },
  { id: "q9", text: "9. Síntomas Cardiovasculares", description: "Taquicardia, palpitaciones, dolor en el pecho, latidos vasculares, sensación de desmayo, extrasístoles." },
  { id: "q10", text: "10. Síntomas Respiratorios", description: "Presión o constricción en el pecho, sensación de ahogo, suspiros, disnea." },
  { id: "q11", text: "11. Síntomas Gastrointestinales", description: "Dificultad para tragar, gases, dolor antes o después de comer, ardor de estómago, plenitud gástrica, náuseas o vómitos, sensación de estómago vacío, estreñimiento o diarrea." },
  { id: "q12", text: "12. Síntomas Genitourinarios", description: "Micción frecuente, micción urgente, amenorrea, menorragia, aparición de la frigidez, eyaculación precoz, pérdida de la libido, impotencia." },
  { id: "q13", text: "13. Síntomas del Sistema Nervioso Autónomo", description: "Boca seca, rubor, palidez, tendencia a sudar, vértigos, cefaleas tensionales, piel de gallina." },
  { id: "q14", text: "14. Comportamiento en la Entrevista", description: "Agitado, inquieto, se pasea, se retuerce las manos, se muerde las uñas, se tira del pelo, se muerde los labios, etc." },
];

const HamiltonAnxietyScaleForm: React.FC = () => {
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const [interpretation, setInterpretation] = useState<string>("");
    const { toast } = useToast();

    const form = useForm<HamiltonFormValues>({
        resolver: zodResolver(hamiltonSchema),
        defaultValues: {},
    });
    
    const onSubmit = (data: HamiltonFormValues) => {
        const score = hamiltonQuestions.reduce((sum, q) => {
            const selectedOption = hamiltonOptions.find(opt => opt.value === data[q.id]);
            return sum + (selectedOption ? selectedOption.score : 0);
        }, 0);
        setTotalScore(score);

        if (score <= 17) setInterpretation("Ansiedad Leve.");
        else if (score <= 24) setInterpretation("Ansiedad Moderada.");
        else setInterpretation("Ansiedad Severa.");
    };

    const resetCalculator = () => {
        form.reset();
        setTotalScore(null);
        setInterpretation("");
    };
    
    const generateExportContent = (formatType: 'txt' | 'csv') => {
        if (totalScore === null) return "";
        const formValues = form.getValues();
        const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
        
        if (formatType === 'csv') {
          const headers = ["Paciente", "Fecha", "Puntaje Total HAM-A", "Interpretacion HAM-A", ...hamiltonQuestions.map(q => `"${q.text.replace(/"/g, '""')}"`)];
          const values = [
            "No especificado",
            currentDate,
            totalScore.toString(),
            `"${interpretation.replace(/"/g, '""')}"`,
            ...hamiltonQuestions.map(q => {
              const selectedOptionValue = formValues[q.id];
              const selectedOption = hamiltonOptions.find(opt => opt.value === selectedOptionValue);
              return selectedOption ? `"${selectedOption.label.replace(/"/g, '""')} (${selectedOption.score} pts)"` : "No respondido";
            })
          ];
          return `${headers.join(",")}\n${values.join(",")}`;
        } else { // TXT format
          let content = `Resultado de la Escala de Ansiedad de Hamilton (HAM-A)\n`;
          content += `Fecha: ${currentDate}\n\n`;
          content += `PUNTAJE TOTAL: ${totalScore} / 56 puntos\n`;
          content += `Interpretación: ${interpretation}\n\n`;
          content += `DETALLES DE LA EVALUACIÓN:\n`;
          hamiltonQuestions.forEach((q) => {
              const selectedOptionValue = formValues[q.id];
              const selectedOption = hamiltonOptions.find(opt => opt.value === selectedOptionValue);
              content += `- ${q.text}:\n  Respuesta: ${selectedOption ? selectedOption.label : 'No respondido'} (Puntos: ${selectedOption ? selectedOption.score : 0})\n`;
          });
          return content;
        }
    }
    
    const handleExport = (formatType: 'txt' | 'csv') => {
        const content = generateExportContent(formatType);
        if (!content) return;
        const mimeType = formatType === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
        const extension = formatType;
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `resultado_hama_${new Date().toISOString().split('T')[0]}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center"><Activity className="mr-2 h-6 w-6 text-green-500" />Escala de Ansiedad de Hamilton (HAM-A)</CardTitle>
                <ScaleCardDescription>
                    Evalúa la severidad de la ansiedad. Evaluar cada ítem en una escala de 0 (ausente) a 4 (muy grave).
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {hamiltonQuestions.map(q => (
                            <FormField
                                key={q.id}
                                control={form.control}
                                name={q.id}
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="text-base font-semibold">{q.text}</FormLabel>
                                        {q.description && <FormDescription>{q.description}</FormDescription>}
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-1">
                                                {hamiltonOptions.map(opt => (
                                                    <FormItem key={opt.value} className="flex items-start space-x-3 space-y-0 p-2 hover:bg-muted/50 rounded-md transition-colors">
                                                        <FormControl><RadioGroupItem value={opt.value} /></FormControl>
                                                        <FormLabel className="font-normal flex-1 cursor-pointer">{opt.label}</FormLabel>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator}>Limpiar</Button>
                            <Button type="submit">Calcular Puntaje HAM-A</Button>
                        </div>
                    </form>
                </Form>
                 {totalScore !== null && (
                  <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                        <h3 className="text-xl font-bold text-left flex-grow">Resultado de la Escala HAM-A</h3>
                        <div className="flex gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Exportar <ChevronDown className="ml-1 h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleExport('txt')}>Como TXT (.txt)</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExport('csv')}>Como CSV (.csv)</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-center text-primary mb-2">{totalScore} / 56 puntos</p>
                    <p className="text-md font-semibold text-center text-muted-foreground">{interpretation}</p>
                  </div>
                )}
            </CardContent>
        </Card>
    );
};

export default HamiltonAnxietyScaleForm;
