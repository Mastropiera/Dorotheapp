"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ScaleCardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Frown, Info, Download, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const beckQuestionSchema = z.string({ required_error: "Seleccione una opción." });

const beckSchemaObject: Record<string, z.ZodType<any, any>> = {};
for (let i = 1; i <= 21; i++) {
  beckSchemaObject[`q${i}`] = beckQuestionSchema;
}
const beckSchema = z.object(beckSchemaObject);

type BeckFormValues = z.infer<typeof beckSchema>;

interface BeckOption {
  value: string;
  label: string;
  score: number;
}

const beckQuestions: { id: keyof BeckFormValues; text: string; options: BeckOption[] }[] = [
  { id: "q1", text: "1. Tristeza", options: [ { value: "0", label: "0. No me siento triste.", score: 0 }, { value: "1", label: "1. Me siento triste gran parte del tiempo.", score: 1 }, { value: "2", label: "2. Estoy triste todo el tiempo.", score: 2 }, { value: "3", label: "3. Estoy tan triste o infeliz que no puedo soportarlo.", score: 3 } ] },
  { id: "q2", text: "2. Pesimismo", options: [ { value: "0", label: "0. No estoy desalentado respecto a mi futuro.", score: 0 }, { value: "1", label: "1. Me siento más desalentado respecto a mi futuro que lo que solía estar.", score: 1 }, { value: "2", label: "2. No espero que las cosas mejoren para mí.", score: 2 }, { value: "3", label: "3. Siento que mi futuro es desesperanzador y que sólo empeorará.", score: 3 } ] },
  { id: "q3", text: "3. Fracaso Pasado", options: [ { value: "0", label: "0. No me siento como un fracasado.", score: 0 }, { value: "1", label: "1. He fracasado más de lo que debería.", score: 1 }, { value: "2", label: "2. Cuando miro hacia atrás, veo muchos fracasos.", score: 2 }, { value: "3", label: "3. Siento que como persona soy un fracaso total.", score: 3 } ] },
  { id: "q4", text: "4. Pérdida de Placer", options: [ { value: "0", label: "0. Obtengo tanto placer como siempre de las cosas que disfruto.", score: 0 }, { value: "1", label: "1. No disfruto de las cosas tanto como solía hacerlo.", score: 1 }, { value: "2", label: "2. Obtengo muy poco placer de las cosas que solía disfrutar.", score: 2 }, { value: "3", label: "3. No puedo obtener ningún placer de las cosas que solía disfrutar.", score: 3 } ] },
  { id: "q5", text: "5. Sentimientos de Culpa", options: [ { value: "0", label: "0. No me siento particularmente culpable.", score: 0 }, { value: "1", label: "1. Me siento culpable por muchas cosas que he hecho o que debería haber hecho.", score: 1 }, { value: "2", label: "2. Me siento bastante culpable la mayor parte del tiempo.", score: 2 }, { value: "3", label: "3. Me siento culpable todo el tiempo.", score: 3 } ] },
  { id: "q6", text: "6. Sentimientos de Castigo", options: [ { value: "0", label: "0. No siento que esté siendo castigado.", score: 0 }, { value: "1", label: "1. Siento que puedo ser castigado.", score: 1 }, { value: "2", label: "2. Espero ser castigado.", score: 2 }, { value: "3", label: "3. Siento que estoy siendo castigado.", score: 3 } ] },
  { id: "q7", text: "7. Autodesprecio", options: [ { value: "0", label: "0. Siento lo mismo de siempre sobre mí.", score: 0 }, { value: "1", label: "1. He perdido la confianza en mí mismo.", score: 1 }, { value: "2", label: "2. Estoy decepcionado conmigo mismo.", score: 2 }, { value: "3", label: "3. No me gusto.", score: 3 } ] },
  { id: "q8", text: "8. Autocrítica", options: [ { value: "0", label: "0. No me critico ni me culpo más de lo habitual.", score: 0 }, { value: "1", label: "1. Soy más crítico conmigo mismo de lo que solía ser.", score: 1 }, { value: "2", label: "2. Critico todas mis faltas.", score: 2 }, { value: "3", label: "3. Me culpo por todo lo malo que sucede.", score: 3 } ] },
  { id: "q9", text: "9. Pensamientos o Deseos Suicidas", options: [ { value: "0", label: "0. No tengo ningún pensamiento de suicidio.", score: 0 }, { value: "1", label: "1. Tengo pensamientos de suicidio, pero no los llevaría a cabo.", score: 1 }, { value: "2", label: "2. Me gustaría suicidarme.", score: 2 }, { value: "3", label: "3. Me suicidaría si tuviera la oportunidad.", score: 3 } ] },
  { id: "q10", text: "10. Llanto", options: [ { value: "0", label: "0. No lloro más de lo que solía hacerlo.", score: 0 }, { value: "1", label: "1. Lloro más de lo que solía hacerlo.", score: 1 }, { value: "2", label: "2. Lloro por cualquier pequeña cosa.", score: 2 }, { value: "3", label: "3. Siento ganas de llorar, pero no puedo.", score: 3 } ] },
  { id: "q11", text: "11. Agitación", options: [ { value: "0", label: "0. No estoy más inquieto o agitado de lo habitual.", score: 0 }, { value: "1", label: "1. Me siento más inquieto o agitado de lo habitual.", score: 1 }, { value: "2", label: "2. Estoy tan inquieto o agitado que me es difícil quedarme quieto.", score: 2 }, { value: "3", label: "3. Estoy tan inquieto o agitado que tengo que estar moviéndome o haciendo algo constantemente.", score: 3 } ] },
  { id: "q12", text: "12. Pérdida de Interés", options: [ { value: "0", label: "0. No he perdido el interés en otras personas o actividades.", score: 0 }, { value: "1", label: "1. Estoy menos interesado en otras personas o cosas que antes.", score: 1 }, { value: "2", label: "2. He perdido la mayor parte de mi interés en otras personas o cosas.", score: 2 }, { value: "3", label: "3. Me es difícil interesarme por algo.", score: 3 } ] },
  { id: "q13", text: "13. Indecisión", options: [ { value: "0", label: "0. Tomo decisiones tan bien como siempre.", score: 0 }, { value: "1", label: "1. Me resulta más difícil tomar decisiones que de costumbre.", score: 1 }, { value: "2", label: "2. Tengo mucha más dificultad para tomar decisiones que de costumbre.", score: 2 }, { value: "3", label: "3. Tengo problemas para tomar cualquier decisión.", score: 3 } ] },
  { id: "q14", text: "14. Devaluación", options: [ { value: "0", label: "0. No siento que no valgo nada.", score: 0 }, { value: "1", label: "1. No me considero tan valioso y útil como solía hacerlo.", score: 1 }, { value: "2", label: "2. Me siento menos valioso en comparación con otras personas.", score: 2 }, { value: "3", label: "3. Siento que no valgo nada.", score: 3 } ] },
  { id: "q15", text: "15. Pérdida de Energía", options: [ { value: "0", label: "0. Tengo tanta energía como siempre.", score: 0 }, { value: "1", label: "1. Tengo menos energía de la que solía tener.", score: 1 }, { value: "2", label: "2. No tengo suficiente energía para hacer mucho.", score: 2 }, { value: "3", label: "3. No tengo energía suficiente para hacer nada.", score: 3 } ] },
  { id: "q16", text: "16. Cambios en el Patrón de Sueño", options: [ { value: "0", label: "0. No he experimentado ningún cambio en mi patrón de sueño.", score: 0 }, { value: "1", label: "1a. Duermo un poco más de lo habitual. / 1b. Duermo un poco menos de lo habitual.", score: 1 }, { value: "2", label: "2a. Duermo mucho más de lo habitual. / 2b. Duermo mucho menos de lo habitual.", score: 2 }, { value: "3", label: "3a. Duermo la mayor parte del día. / 3b. Me despierto 1-2 horas antes y no puedo volver a dormir.", score: 3 } ] },
  { id: "q17", text: "17. Irritabilidad", options: [ { value: "0", label: "0. No estoy más irritable de lo habitual.", score: 0 }, { value: "1", label: "1. Estoy más irritable de lo habitual.", score: 1 }, { value: "2", label: "2. Estoy mucho más irritable de lo habitual.", score: 2 }, { value: "3", label: "3. Estoy irritable todo el tiempo.", score: 3 } ] },
  { id: "q18", text: "18. Cambios en el Apetito", options: [ { value: "0", label: "0. No he experimentado ningún cambio en mi apetito.", score: 0 }, { value: "1", label: "1a. Mi apetito es un poco menor de lo habitual. / 1b. Mi apetito es un poco mayor de lo habitual.", score: 1 }, { value: "2", label: "2a. Mi apetito es mucho menor que antes. / 2b. Mi apetito es mucho mayor que lo habitual.", score: 2 }, { value: "3", label: "3a. No tengo apetito en absoluto. / 3b. Quiero comer todo el día.", score: 3 } ] },
  { id: "q19", text: "19. Dificultad de Concentración", options: [ { value: "0", label: "0. Puedo concentrarme tan bien como siempre.", score: 0 }, { value: "1", label: "1. No puedo concentrarme tan bien como habitualmente.", score: 1 }, { value: "2", label: "2. Me es difícil mantener la mente en algo por mucho tiempo.", score: 2 }, { value: "3", label: "3. No puedo concentrarme en nada.", score: 3 } ] },
  { id: "q20", text: "20. Cansancio o Fatiga", options: [ { value: "0", label: "0. No estoy más cansado o fatigado de lo habitual.", score: 0 }, { value: "1", label: "1. Me canso o fatigo más fácilmente de lo habitual.", score: 1 }, { value: "2", label: "2. Estoy demasiado cansado o fatigado para hacer muchas de las cosas que solía hacer.", score: 2 }, { value: "3", label: "3. Estoy demasiado cansado o fatigado para hacer la mayoría de las cosas que solía hacer.", score: 3 } ] },
  { id: "q21", text: "21. Pérdida de Interés en el Sexo", options: [ { value: "0", label: "0. No he notado ningún cambio reciente en mi interés por el sexo.", score: 0 }, { value: "1", label: "1. Estoy menos interesado en el sexo de lo que solía estar.", score: 1 }, { value: "2", label: "2. Estoy mucho menos interesado en el sexo ahora.", score: 2 }, { value: "3", label: "3. He perdido completamente el interés en el sexo.", score: 3 } ] },
];


const BeckDepressionInventoryForm: React.FC = () => {
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const [interpretation, setInterpretation] = useState<string>("");
    const { toast } = useToast();

    const form = useForm<BeckFormValues>({
        resolver: zodResolver(beckSchema),
        defaultValues: {},
    });
    
    const onSubmit = (data: BeckFormValues) => {
        const score = beckQuestions.reduce((sum, q) => {
            const selectedOption = q.options.find(opt => opt.value === data[q.id]);
            return sum + (selectedOption ? selectedOption.score : 0);
        }, 0);
        setTotalScore(score);

        if (score <= 13) setInterpretation("Depresión Mínima.");
        else if (score <= 19) setInterpretation("Depresión Leve.");
        else if (score <= 28) setInterpretation("Depresión Moderada.");
        else setInterpretation("Depresión Grave.");
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
          const headers = ["Paciente", "Fecha", "Puntaje Total BDI-II", "Interpretacion BDI-II", ...beckQuestions.map(q => `"${q.text.replace(/"/g, '""')}"`)];
          const values = [
            "No especificado",
            currentDate,
            totalScore.toString(),
            `"${interpretation.replace(/"/g, '""')}"`,
            ...beckQuestions.map(q => {
              const selectedOptionValue = formValues[q.id];
              const selectedOption = q.options.find(opt => opt.value === selectedOptionValue);
              return selectedOption ? `"${selectedOption.label.replace(/"/g, '""')} (${selectedOption.score} pts)"` : "No respondido";
            })
          ];
          return `${headers.join(",")}\n${values.join(",")}`;
        } else { // TXT format
          let content = `Resultado del Inventario de Depresión de Beck (BDI-II)\n`;
          content += `Fecha: ${currentDate}\n\n`;
          content += `PUNTAJE TOTAL: ${totalScore} / 63 puntos\n`;
          content += `Interpretación: ${interpretation}\n\n`;
          content += `DETALLES DE LA EVALUACIÓN:\n`;
          beckQuestions.forEach((q) => {
              const selectedOptionValue = formValues[q.id];
              const selectedOption = q.options.find(opt => opt.value === selectedOptionValue);
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
        link.download = `resultado_bdi-ii_${new Date().toISOString().split('T')[0]}${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center"><Frown className="mr-2 h-6 w-6 text-green-500" />Inventario de Depresión de Beck (BDI-II)</CardTitle>
                <ScaleCardDescription>
                    Mide la severidad de la depresión. Conteste según cómo se ha sentido en las últimas 2 semanas, incluido hoy.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {beckQuestions.map(q => (
                            <FormField
                                key={q.id}
                                control={form.control}
                                name={q.id}
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="text-base font-semibold">{q.text}</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-1">
                                                {q.options.map(opt => (
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
                            <Button type="submit">Calcular Puntaje BDI-II</Button>
                        </div>
                    </form>
                </Form>
                 {totalScore !== null && (
                  <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                        <h3 className="text-xl font-bold text-left flex-grow">Resultado del BDI-II</h3>
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
                    <p className="text-3xl font-extrabold text-center text-primary mb-2">{totalScore} / 63 puntos</p>
                    <p className="text-md font-semibold text-center text-muted-foreground">{interpretation}</p>
                  </div>
                )}
            </CardContent>
        </Card>
    );
};

export default BeckDepressionInventoryForm;
