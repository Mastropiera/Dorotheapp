"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ScaleCardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Frown, Info, Meh, Smile as SmileIcon, Download, ChevronDown, TrendingUp } from 'lucide-react';
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

const yesavageQuestionSchema = z.string({ required_error: "Seleccione una opción." });

const yesavageSchema = z.object({
  q1_satisfecho: yesavageQuestionSchema,
  q2_renunciado_actividades: yesavageQuestionSchema,
  q3_vida_vacia: yesavageQuestionSchema,
  q4_aburrido_menudo: yesavageQuestionSchema,
  q5_buen_animo: yesavageQuestionSchema,
  q6_teme_algo_malo: yesavageQuestionSchema,
  q7_feliz_mayor_tiempo: yesavageQuestionSchema,
  q8_desamparado: yesavageQuestionSchema,
  q9_prefiere_casa: yesavageQuestionSchema,
  q10_problemas_memoria: yesavageQuestionSchema,
  q11_maravilloso_vivir: yesavageQuestionSchema,
  q12_inutil_despreciable: yesavageQuestionSchema,
  q13_lleno_energia: yesavageQuestionSchema,
  q14_situacion_desesperada: yesavageQuestionSchema,
  q15_mayoria_mejor_que_usted: yesavageQuestionSchema,
});

type YesavageFormValues = z.infer<typeof yesavageSchema>;

interface YesavageQuestion {
  id: keyof YesavageFormValues;
  text: string;
  scoreForYes: number; 
}

const yesavageQuestions: YesavageQuestion[] = [
  { id: "q1_satisfecho", text: "¿Está básicamente satisfecho/a con su vida?", scoreForYes: 0 },
  { id: "q2_renunciado_actividades", text: "¿Ha renunciado a muchas de sus actividades e intereses?", scoreForYes: 1 },
  { id: "q3_vida_vacia", text: "¿Siente que su vida está vacía?", scoreForYes: 1 },
  { id: "q4_aburrido_menudo", text: "¿Se encuentra a menudo aburrido/a?", scoreForYes: 1 },
  { id: "q5_buen_animo", text: "¿Tiene a menudo buen ánimo?", scoreForYes: 0 },
  { id: "q6_teme_algo_malo", text: "¿Teme que algo malo le vaya a pasar?", scoreForYes: 1 },
  { id: "q7_feliz_mayor_tiempo", text: "¿Se siente feliz la mayor parte del tiempo?", scoreForYes: 0 },
  { id: "q8_desamparado", text: "¿Se siente a menudo desamparado/a o desvalido/a?", scoreForYes: 1 },
  { id: "q9_prefiere_casa", text: "¿Prefiere quedarse en casa a salir y hacer cosas nuevas?", scoreForYes: 1 },
  { id: "q10_problemas_memoria", text: "¿Siente que tiene más problemas de memoria que la mayoría de la gente?", scoreForYes: 1 },
  { id: "q11_maravilloso_vivir", text: "¿Cree que es maravilloso estar vivo/a?", scoreForYes: 0 },
  { id: "q12_inutil_despreciable", text: "¿Se siente inútil o despreciable como está usted ahora?", scoreForYes: 1 },
  { id: "q13_lleno_energia", text: "¿Se siente lleno/a de energía?", scoreForYes: 0 },
  { id: "q14_situacion_desesperada", text: "¿Siente que su situación es desesperada?", scoreForYes: 1 },
  { id: "q15_mayoria_mejor_que_usted", text: "¿Cree que la mayoría de la gente está mejor que usted?", scoreForYes: 1 },
];

const siNoOptions = [{ value: "yes", label: "Sí" }, { value: "no", label: "No" }];

const YesavageScaleForm: React.FC = () => {
  const [yesavageScore, setYesavageScore] = useState<number | null>(null);
  const [yesavageInterpretation, setYesavageInterpretation] = useState<string>("");
  const [resultIcon, setResultIcon] = useState<React.ReactNode | null>(null);
  const [patientName, setPatientName] = useState('');
  const { toast } = useToast();

  const form = useForm<YesavageFormValues>({
    resolver: zodResolver(yesavageSchema),
    defaultValues: {},
  });

  const onYesavageSubmit = (data: YesavageFormValues) => {
    let score = 0;
    yesavageQuestions.forEach(q => {
      const answer = data[q.id]; 
      if (q.scoreForYes === 1 && answer === "yes") score++;
      else if (q.scoreForYes === 0 && answer === "no") score++;
    });
    setYesavageScore(score);

    let interpretationText = "";
    let icon = null;
    if (score <= 4) { interpretationText = "Normal / Sin depresión."; icon = <SmileIcon className="mr-2 h-6 w-6 text-green-600" />; }
    else if (score <= 8) { interpretationText = "Depresión Leve."; icon = <Meh className="mr-2 h-6 w-6 text-yellow-600" />; }
    else if (score <= 11) { interpretationText = "Depresión Moderada."; icon = <Frown className="mr-2 h-6 w-6 text-orange-600" />; }
    else if (score <= 15) { interpretationText = "Depresión Severa."; icon = <Frown className="mr-2 h-6 w-6 text-red-600" />; }
    else interpretationText = "Puntuación fuera de rango esperado (0-15).";
    setYesavageInterpretation(interpretationText);
    setResultIcon(icon);
  };

  const resetCalculator = () => {
    form.reset();
    setYesavageScore(null);
    setYesavageInterpretation("");
    setResultIcon(null);
    setPatientName("");
  };

  const generateExportContent = (formatType: 'txt' | 'csv') => {
    if (yesavageScore === null) return "";
    const formValues = form.getValues();
    const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    if (formatType === 'csv') {
      const headers = ["Paciente", "Fecha", "Puntaje Total GDS-15", "Interpretacion GDS-15", ...yesavageQuestions.map(q => `"${q.text.replace(/"/g, '""')}"`)];
      const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
      const values = [
        patientNameCsv,
        currentDate,
        yesavageScore.toString(),
        `"${yesavageInterpretation.replace(/"/g, '""')}"`,
        ...yesavageQuestions.map(q => {
          const answer = formValues[q.id];
          let points = 0;
          if (q.scoreForYes === 1 && answer === "yes") points = 1;
          else if (q.scoreForYes === 0 && answer === "no") points = 1;
          return `"${answer === "yes" ? "Sí" : "No"} (${points} pt)"`;
        })
      ];
      return `${headers.join(",")}\n${values.join(",")}`;
    } else { // TXT format
      let content = `Resultado de la Escala de Depresión Geriátrica de Yesavage (GDS-15)\n`;
      if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
      content += `Fecha: ${currentDate}\n\n`;
      content += `PUNTAJE TOTAL: ${yesavageScore} / 15 puntos\n`;
      content += `Interpretación: ${yesavageInterpretation}\n\n`;
      content += `DETALLES DE LA EVALUACIÓN:\n`;
      yesavageQuestions.forEach((q, index) => {
        const answer = formValues[q.id];
        let points = 0;
        if (q.scoreForYes === 1 && answer === "yes") points = 1;
        else if (q.scoreForYes === 0 && answer === "no") points = 1;
        content += `${index + 1}. ${q.text}\n  Respuesta: ${answer === "yes" ? "Sí" : "No"} (Puntos: ${points})\n`;
      });
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
    link.download = `resultado_gds15_${new Date().toISOString().split('T')[0]}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
  };
  
  const renderRadioGroupField = (
    question: YesavageQuestion,
    index: number
  ) => (
    <FormField
      control={form.control}
      name={question.id}
      render={({ field }) => (
        <FormItem className="space-y-2 p-3 border rounded-md bg-card shadow-sm hover:bg-muted/50 transition-colors">
          <FormLabel className="text-sm font-medium">
            {index + 1}. {question.text}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex space-x-4"
            >
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl><RadioGroupItem value="yes" /></FormControl>
                <FormLabel className="font-normal text-sm cursor-pointer">Sí</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl><RadioGroupItem value="no" /></FormControl>
                <FormLabel className="font-normal text-sm cursor-pointer">No</FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><Frown className="mr-2 h-6 w-6 text-teal-500" />Escala de Depresión Geriátrica de Yesavage (GDS-15)</CardTitle>
        <ScaleCardDescription>
          Instrumento de cribado para la depresión en personas mayores. Conteste según cómo se ha sentido durante la última semana.
        </ScaleCardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <Label htmlFor="patientNameYesavage">Nombre del Paciente (Opcional para exportación)</Label>
          <div className="flex gap-2 items-start">
            <Input
              id="patientNameYesavage"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Ingrese nombre del paciente..."
              className="flex-grow"
            />
          </div>
        </div>
        <Separator className="my-6" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onYesavageSubmit)} className="space-y-6">
            {yesavageQuestions.map((q, index) => (
              <React.Fragment key={q.id}>
                {renderRadioGroupField(q, index)}
              </React.Fragment>
            ))}
            <div className="flex flex-col sm:flex-row gap-2 pt-6">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">Calcular Puntaje GDS-15</Button>
            </div>
          </form>
        </Form>

        {yesavageScore !== null && (
          <div className={cn(
            "mt-8 p-6 border rounded-lg",
            yesavageScore <= 4 && "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700",
            yesavageScore >= 5 && yesavageScore <= 8 && "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700",
            yesavageScore >= 9 && yesavageScore <= 11 && "bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:border-orange-700",
            yesavageScore >= 12 && "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700"
          )}>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                <h3 className="text-xl font-bold text-left flex-grow">
                    <TrendingUp className="inline mr-2 h-5 w-5 text-primary"/>Resultado GDS-15
                </h3>
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
            <p className={cn(
                "text-3xl font-extrabold text-center mb-1",
                 yesavageScore <= 4 && "text-green-600 dark:text-green-400",
                 yesavageScore >= 5 && yesavageScore <= 8 && "text-yellow-600 dark:text-yellow-400",
                 yesavageScore >= 9 && yesavageScore <= 11 && "text-orange-600 dark:text-orange-400",
                 yesavageScore >= 12 && "text-red-600 dark:text-red-400"
            )}>{yesavageScore} / 15 puntos</p>
            <p className="text-md font-semibold flex items-center justify-center text-center">
                {resultIcon}{yesavageInterpretation}
            </p>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                La Escala de Depresión Geriátrica de Yesavage (GDS-15) es una herramienta de cribado. Un puntaje más alto sugiere mayor probabilidad de depresión.
            </p>
            <p><strong>Interpretación General del Puntaje (GDS-15):</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>0-4 puntos:</strong> Normal / Sin depresión.</li>
                <li><strong>5-8 puntos:</strong> Depresión Leve.</li>
                <li><strong>9-11 puntos:</strong> Depresión Moderada.</li>
                <li><strong>12-15 puntos:</strong> Depresión Severa.</li>
            </ul>
            <p className="italic">
                Esta escala es una herramienta de cribado y no un diagnóstico. Un resultado positivo debe llevar a una evaluación clínica más detallada.
                Fuente: Yesavage JA, et al. Development and validation of a geriatric depression screening scale: A preliminary report. Journal of Psychiatric Research 1982-83;17(1):37-49. (Versión de 15 ítems adaptada).
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default YesavageScaleForm;
