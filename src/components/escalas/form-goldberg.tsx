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
import { Smile as SmileIcon, Frown, Info, Download, ChevronDown, Mic, MicOff, AlertTriangle, Meh } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';

const goldbergSchema = z.object({
  ans1_excitado: z.string({ required_error: "Seleccione una opción." }),
  ans2_preocupado: z.string({ required_error: "Seleccione una opción." }),
  ans3_irritable: z.string({ required_error: "Seleccione una opción." }),
  ans4_dificultad_relajarse: z.string({ required_error: "Seleccione una opción." }),
  ans5_dormido_mal: z.string({ required_error: "Seleccione una opción." }),
  ans6_dolores_cabeza_nuca: z.string({ required_error: "Seleccione una opción." }),
  ans7_sintomas_fisicos: z.string({ required_error: "Seleccione una opción." }),
  ans8_preocupado_salud: z.string({ required_error: "Seleccione una opción." }),
  ans9_dificultad_dormir: z.string({ required_error: "Seleccione una opción." }),
  dep1_poca_energia: z.string({ required_error: "Seleccione una opción." }),
  dep2_perdido_interes: z.string({ required_error: "Seleccione una opción." }),
  dep3_perdido_confianza: z.string({ required_error: "Seleccione una opción." }),
  dep4_sin_esperanzas: z.string({ required_error: "Seleccione una opción." }),
  dep5_dificultad_concentrarse: z.string({ required_error: "Seleccione una opción." }),
  dep6_perdido_peso: z.string({ required_error: "Seleccione una opción." }),
  dep7_despertando_temprano: z.string({ required_error: "Seleccione una opción." }),
  dep8_sentido_lentecido: z.string({ required_error: "Seleccione una opción." }),
  dep9_peor_mananas: z.string({ required_error: "Seleccione una opción." }),
});

type GoldbergFormValues = z.infer<typeof goldbergSchema>;

interface GoldbergQuestion {
  id: keyof GoldbergFormValues;
  text: string;
}

const anxietyQuestions: GoldbergQuestion[] = [
  { id: "ans1_excitado", text: "1. ¿Se ha sentido muy excitado/a, nervioso/a o en tensión?" },
  { id: "ans2_preocupado", text: "2. ¿Ha estado muy preocupado/a por algo?" },
  { id: "ans3_irritable", text: "3. ¿Se ha sentido muy irritable?" },
  { id: "ans4_dificultad_relajarse", text: "4. ¿Ha tenido dificultad para relajarse?" },
  { id: "ans5_dormido_mal", text: "5. ¿Ha dormido mal, ha tenido dificultades para dormir?" },
  { id: "ans6_dolores_cabeza_nuca", text: "6. ¿Ha tenido dolores de cabeza o de nuca?" },
  { id: "ans7_sintomas_fisicos", text: "7. ¿Ha tenido alguno de los siguientes síntomas: temblores, hormigueos, mareos, sudores, diarrea?" },
  { id: "ans8_preocupado_salud", text: "8. ¿Ha estado preocupado/a por su salud?" },
  { id: "ans9_dificultad_dormir", text: "9. ¿Ha tenido alguna dificultad para conciliar el sueño, para quedarse dormido/a?" },
];

const depressionQuestions: GoldbergQuestion[] = [
  { id: "dep1_poca_energia", text: "1. ¿Ha tenido poca energía?" },
  { id: "dep2_perdido_interes", text: "2. ¿Ha perdido su interés por las cosas?" },
  { id: "dep3_perdido_confianza", text: "3. ¿Ha perdido la confianza en sí mismo/a?" },
  { id: "dep4_sin_esperanzas", text: "4. ¿Se ha sentido sin esperanzas?" },
  { id: "dep5_dificultad_concentrarse", text: "5. ¿Ha tenido dificultades para concentrarse?" },
  { id: "dep6_perdido_peso", text: "6. ¿Ha perdido peso (a causa de su falta de apetito)?" },
  { id: "dep7_despertando_temprano", text: "7. ¿Se ha estado despertando demasiado temprano?" },
  { id: "dep8_sentido_lentecido", text: "8. ¿Se ha sentido enlentecido/a?" },
  { id: "dep9_peor_mananas", text: "9. ¿Cree usted que tiende a estar peor por las mañanas?" },
];

const siNoOptions = [{ value: "yes", label: "Sí" }, { value: "no", label: "No" }];

const GoldbergScaleForm: React.FC = () => {
    const [anxietyScore, setAnxietyScore] = useState<number | null>(null);
    const [anxietyInterpretation, setAnxietyInterpretation] = useState<string>("");
    const [depressionScore, setDepressionScore] = useState<number | null>(null);
    const [depressionInterpretation, setDepressionInterpretation] = useState<string>("");
    const [patientName, setPatientName] = useState('');
    const { toast } = useToast();

    const form = useForm<GoldbergFormValues>({
        resolver: zodResolver(goldbergSchema),
        defaultValues: {},
    });

    const onSubmit = (data: GoldbergFormValues) => {
        const anxietyScoreCalc = anxietyQuestions.reduce((sum, q) => sum + (data[q.id] === 'yes' ? 1 : 0), 0);
        setAnxietyScore(anxietyScoreCalc);
        setAnxietyInterpretation(anxietyScoreCalc >= 4 ? `Probable trastorno de ansiedad (Puntaje ≥ 4)` : `No se detecta probable trastorno de ansiedad (Puntaje < 4)`);

        const depressionScoreCalc = depressionQuestions.reduce((sum, q) => sum + (data[q.id] === 'yes' ? 1 : 0), 0);
        setDepressionScore(depressionScoreCalc);
        setDepressionInterpretation(depressionScoreCalc >= 2 ? `Probable trastorno depresivo (Puntaje ≥ 2)` : `No se detecta probable trastorno depresivo (Puntaje < 2)`);
    };

    const resetCalculator = () => {
        form.reset();
        setAnxietyScore(null);
        setAnxietyInterpretation("");
        setDepressionScore(null);
        setDepressionInterpretation("");
        setPatientName("");
    };

    const generateExportContent = (formatType: 'txt' | 'csv') => {
        if (anxietyScore === null || depressionScore === null) return "";
        const formValues = form.getValues();
        const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
        if (formatType === 'csv') {
            const headers = ["Paciente", "Fecha", "Puntaje Ansiedad", "Interpretacion Ansiedad", "Puntaje Depresion", "Interpretacion Depresion", ...anxietyQuestions.map(q => `"${q.text.replace(/"/g, '""')}"`), ...depressionQuestions.map(q => `"${q.text.replace(/"/g, '""')}"`)];
            const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
            const values = [
                patientNameCsv,
                currentDate,
                anxietyScore.toString(),
                `"${anxietyInterpretation.replace(/"/g, '""')}"`,
                depressionScore.toString(),
                `"${depressionInterpretation.replace(/"/g, '""')}"`,
                ...anxietyQuestions.map(q => `"${formValues[q.id] === 'yes' ? 'Sí' : 'No'}"`),
                ...depressionQuestions.map(q => `"${formValues[q.id] === 'yes' ? 'Sí' : 'No'}"`),
            ];
            return `${headers.join(",")}\n${values.join(",")}`;
        } else { // TXT format
            let content = `Resultado de la Escala de Goldberg de Ansiedad y Depresión\n`;
            if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
            content += `Fecha: ${currentDate}\n\n`;
            content += `SUBESCALA DE ANSIEDAD\n`;
            content += `Puntaje: ${anxietyScore} / 9\n`;
            content += `Interpretación: ${anxietyInterpretation}\n\n`;
            content += `SUBESCALA DE DEPRESIÓN\n`;
            content += `Puntaje: ${depressionScore} / 9\n`;
            content += `Interpretación: ${depressionInterpretation}\n\n`;
            content += `DETALLES DE LA EVALUACIÓN:\n--- Ansiedad ---\n`;
            anxietyQuestions.forEach(q => content += `- ${q.text}: ${formValues[q.id] === 'yes' ? 'Sí' : 'No'}\n`);
            content += `\n--- Depresión ---\n`;
            depressionQuestions.forEach(q => content += `- ${q.text}: ${formValues[q.id] === 'yes' ? 'Sí' : 'No'}\n`);
            return content;
        }
    }

    const handleExport = (formatType: 'txt' | 'csv') => {
        const content = generateExportContent(formatType);
        if (!content) return;
        const mimeType = formatType === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
        const extension = formatType === 'csv' ? '.csv' : '.txt';
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `resultado_escala_goldberg_${new Date().toISOString().split('T')[0]}${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
    };

    const renderRadioGroupField = (question: GoldbergQuestion) => (
        <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 border rounded-md bg-card shadow-sm hover:bg-muted/50 transition-colors">
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
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center"><SmileIcon className="mr-2 h-6 w-6 text-green-500" />Escala de Goldberg (Ansiedad y Depresión)</CardTitle>
                <ScaleCardDescription>
                    Herramienta de cribado para detectar posibles trastornos de ansiedad y depresión. Conteste según cómo se ha sentido en las últimas 2 semanas.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label htmlFor="patientNameGoldberg">Nombre del Paciente (Opcional para exportación)</Label>
                    <Input id="patientNameGoldberg" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Ingrese nombre del paciente..." />
                </div>
                <Separator className="my-6" />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-primary">Subescala de Ansiedad (Máx: 9 puntos)</h3>
                            {anxietyQuestions.map(q => <React.Fragment key={q.id}>{renderRadioGroupField(q)}</React.Fragment>)}
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-primary">Subescala de Depresión (Máx: 9 puntos)</h3>
                            {depressionQuestions.map(q => <React.Fragment key={q.id}>{renderRadioGroupField(q)}</React.Fragment>)}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">Limpiar</Button>
                            <Button type="submit" className="w-full sm:w-auto">Calcular Puntajes</Button>
                        </div>
                    </form>
                </Form>

                {(anxietyScore !== null || depressionScore !== null) && (
                    <div className="mt-8 p-6 border rounded-lg bg-muted/50 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                            <h3 className="text-xl font-bold text-left flex-grow">Resultados de la Escala de Goldberg</h3>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {anxietyScore !== null && (
                                <div className={cn("p-4 border rounded-md", anxietyScore >= 4 ? "bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:border-orange-700" : "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700")}>
                                    <h4 className="font-semibold text-center mb-1">Ansiedad</h4>
                                    <p className="text-2xl font-bold text-center">{anxietyScore} / 9</p>
                                    <p className="text-sm text-center text-muted-foreground">{anxietyInterpretation}</p>
                                </div>
                            )}
                            {depressionScore !== null && (
                                <div className={cn("p-4 border rounded-md", depressionScore >= 2 ? "bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:border-orange-700" : "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700")}>
                                    <h4 className="font-semibold text-center mb-1">Depresión</h4>
                                    <p className="text-2xl font-bold text-center">{depressionScore} / 9</p>
                                    <p className="text-sm text-center text-muted-foreground">{depressionInterpretation}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <Separator className="my-8" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500" />
                        La Escala de Goldberg es una herramienta de cribado. Un resultado positivo no es un diagnóstico, sino una indicación de que se requiere una evaluación clínica más profunda.
                    </p>
                    <p><strong>Puntos de corte (comúnmente utilizados):</strong></p>
                    <ul className="list-disc list-inside pl-4">
                        <li><strong>Subescala de Ansiedad:</strong> Un puntaje de 4 o más es positivo (sugiere probable trastorno de ansiedad).</li>
                        <li><strong>Subescala de Depresión:</strong> Un puntaje de 2 o más es positivo (sugiere probable trastorno depresivo).</li>
                    </ul>
                    <p className="italic">Fuente: Goldberg D, et al. A scaled version of the General Health Questionnaire. Psychol Med. 1972.</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default GoldbergScaleForm;
