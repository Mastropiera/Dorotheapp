"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ScaleCardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Brain, Info, ClipboardEdit, Download, ChevronDown, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';

const mmseAbreviadoSchema = z.object({
  orientacionAno: z.string({ required_error: "Seleccione una opción." }),
  orientacionEstacion: z.string({ required_error: "Seleccione una opción." }),
  orientacionMes: z.string({ required_error: "Seleccione una opción." }),
  orientacionDiaMes: z.string({ required_error: "Seleccione una opción." }),
  orientacionDiaSemana: z.string({ required_error: "Seleccione una opción." }),
  registroPalabrasCorrectas: z.coerce.number().min(0, "Mínimo 0").max(3, "Máximo 3").int("Debe ser un número entero."),
  calculoSerie7Correctas: z.coerce.number().min(0, "Mínimo 0").max(5, "Máximo 5").int("Debe ser un número entero."),
  recuerdoPalabrasCorrectas: z.coerce.number().min(0, "Mínimo 0").max(3, "Máximo 3").int("Debe ser un número entero."),
});

type MMSEAbreviadoFormValues = z.infer<typeof mmseAbreviadoSchema>;

interface MMSEOption {
  value: string;
  label: string;
  score: number;
}

const correctoIncorrectoOptions: MMSEOption[] = [
  { value: "1", label: "Correcto", score: 1 },
  { value: "0", label: "Incorrecto", score: 0 },
];

const questionFullLabelsMMSE: Record<keyof MMSEAbreviadoFormValues, string> = {
  orientacionAno: "Orientación - Año",
  orientacionEstacion: "Orientación - Estación",
  orientacionMes: "Orientación - Mes",
  orientacionDiaMes: "Orientación - Día del Mes",
  orientacionDiaSemana: "Orientación - Día de la Semana",
  registroPalabrasCorrectas: "Registro de 3 Palabras",
  calculoSerie7Correctas: "Atención y Cálculo (Serie de 7)",
  recuerdoPalabrasCorrectas: "Recuerdo Diferido de 3 Palabras",
};

const MMSEAbreviadoForm: React.FC = () => {
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [interpretation, setInterpretation] = useState<string>("");
  const [patientName, setPatientName] = useState('');
  const { toast } = useToast();

  const form = useForm<MMSEAbreviadoFormValues>({
    resolver: zodResolver(mmseAbreviadoSchema),
    defaultValues: {
        registroPalabrasCorrectas: 0,
        calculoSerie7Correctas: 0,
        recuerdoPalabrasCorrectas: 0,
    },
  });

  const onSubmit = (data: MMSEAbreviadoFormValues) => {
    const scoreOrientacion = (
      correctoIncorrectoOptions.find(opt => opt.value === data.orientacionAno)!.score +
      correctoIncorrectoOptions.find(opt => opt.value === data.orientacionEstacion)!.score +
      correctoIncorrectoOptions.find(opt => opt.value === data.orientacionMes)!.score +
      correctoIncorrectoOptions.find(opt => opt.value === data.orientacionDiaMes)!.score +
      correctoIncorrectoOptions.find(opt => opt.value === data.orientacionDiaSemana)!.score
    );
    const scoreRegistro = data.registroPalabrasCorrectas;
    const scoreCalculo = data.calculoSerie7Correctas;
    const scoreRecuerdo = data.recuerdoPalabrasCorrectas;
    const calculatedTotalScore = scoreOrientacion + scoreRegistro + scoreCalculo + scoreRecuerdo;
    setTotalScore(calculatedTotalScore);

    if (calculatedTotalScore <= 12) setInterpretation("Posible deterioro cognitivo. Se sugiere evaluación más detallada.");
    else if (calculatedTotalScore >=13 && calculatedTotalScore <= 16) setInterpretation("Dentro de límites normales para esta versión abreviada.");
    else setInterpretation("Puntuación fuera de rango esperado (0-16).");
  };

  const resetCalculator = () => {
    form.reset({
        registroPalabrasCorrectas: 0,
        calculoSerie7Correctas: 0,
        recuerdoPalabrasCorrectas: 0,
    });
    setTotalScore(null);
    setInterpretation("");
    setPatientName("");
  };

  const generateExportContent = (formatType: 'txt' | 'csv') => {
    if (totalScore === null) return "";
    const formValues = form.getValues();
    const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    const questionKeys = Object.keys(questionFullLabelsMMSE) as Array<keyof MMSEAbreviadoFormValues>;

    if (formatType === 'csv') {
      const headers = [
        "Paciente", "Fecha", "Puntaje Total MMSE-2:BV", "Interpretacion MMSE-2:BV",
        ...questionKeys.map(key => `"${questionFullLabelsMMSE[key].replace(/"/g, '""')}"`)
      ];
      const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
      const values = [
        patientNameCsv,
        currentDate,
        totalScore.toString(),
        `"${interpretation.replace(/"/g, '""')}"`,
        ...questionKeys.map(key => {
          const value = formValues[key];
          let displayValue = "";
          if (key.startsWith('orientacion')) {
            const option = correctoIncorrectoOptions.find(opt => opt.value === value);
            displayValue = option ? `${option.label} (${option.score} pt)` : "No respondido";
          } else if (key === 'registroPalabrasCorrectas' || key === 'calculoSerie7Correctas' || key === 'recuerdoPalabrasCorrectas') {
            displayValue = `${value} pts`;
          }
          return `"${displayValue.replace(/"/g, '""')}"`;
        })
      ];
      return `${headers.join(",")}\n${values.join(",")}`;
    } else { // TXT format
      let content = `Resultado de la Evaluación Cognitiva (MMSE-2:BV)\n`;
      if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
      content += `Fecha: ${currentDate}\n\n`;
      content += `PUNTAJE TOTAL: ${totalScore} / 16 puntos\n`;
      content += `Interpretación: ${interpretation}\n\n`;
      content += `DETALLES DE LA EVALUACIÓN:\n`;
      questionKeys.forEach(key => {
          const value = formValues[key];
          let responseDetail = "";
          if (key.startsWith('orientacion')) {
            const option = correctoIncorrectoOptions.find(opt => opt.value === value);
            responseDetail = option ? `${option.label} (Puntos: ${option.score})` : 'No respondido';
          } else if (key === 'registroPalabrasCorrectas' || key === 'calculoSerie7Correctas' || key === 'recuerdoPalabrasCorrectas') {
            responseDetail = `Respuesta: ${value} (Puntos: ${value})`;
          }
          content += `- ${questionFullLabelsMMSE[key]}:\n  ${responseDetail}\n`;
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
    link.download = `resultado_mmse_abreviado_${new Date().toISOString().split('T')[0]}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
  };

  const renderRadioGroupField = (
    name: keyof Pick<MMSEAbreviadoFormValues, "orientacionAno" | "orientacionEstacion" | "orientacionMes" | "orientacionDiaMes" | "orientacionDiaSemana">,
    label: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className="text-sm font-medium">{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex space-x-4"
            >
              {correctoIncorrectoOptions.map((option) => (
                <FormItem key={option.value} className="flex items-center space-x-1 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal text-xs cursor-pointer">
                    {option.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage className="text-xs"/>
        </FormItem>
      )}
    />
  );

  const renderNumberInputField = (
    name: keyof Pick<MMSEAbreviadoFormValues, "registroPalabrasCorrectas" | "calculoSerie7Correctas" | "recuerdoPalabrasCorrectas">,
    label: string,
    maxScore: number,
    description?: string
  ) => (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel className="text-sm font-medium">{label}</FormLabel>
                {description && <FormDescription className="text-xs">{description}</FormDescription>}
                <FormControl>
                    <Input 
                        type="number"
                        min={0} max={maxScore} 
                        placeholder={`0-${maxScore}`}
                        {...field}
                        value={field.value === undefined ? '' : String(field.value)}
                        onChange={e => {
                            const val = e.target.value;
                            const numVal = parseInt(val, 10);
                            if (val === '') field.onChange(undefined);
                            else if (!isNaN(numVal)) field.onChange(Math.max(0, Math.min(maxScore, numVal)));
                        }}
                        className="w-28 h-9"
                    />
                </FormControl>
                <FormMessage className="text-xs"/>
            </FormItem>
        )}
    />
  );

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><ClipboardEdit className="mr-2 h-6 w-6 text-teal-500" />Evaluación Cognitiva (MMSE-2:BV)</CardTitle>
        <ScaleCardDescription>
          Mini-Mental State Examination, 2nd Edition: Brief Version. Puntaje máximo: 16 puntos.
        </ScaleCardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <Label htmlFor="patientNameMMSE">Nombre del Paciente (Opcional para exportación)</Label>
          <div className="flex gap-2 items-start">
            <Input
              id="patientNameMMSE"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Ingrese nombre del paciente..."
              className="flex-grow"
            />
          </div>
        </div>
        <Separator className="my-6" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="border p-4 rounded-lg bg-card shadow-sm">
                <h3 className="text-md font-semibold mb-3 flex items-center text-primary">
                    <Brain className="mr-2 h-4 w-4" />Orientación Temporal (Máx: 5 puntos)
                </h3>
                <div className="space-y-3">
                    {renderRadioGroupField("orientacionAno", questionFullLabelsMMSE.orientacionAno)}
                    {renderRadioGroupField("orientacionEstacion", questionFullLabelsMMSE.orientacionEstacion)}
                    {renderRadioGroupField("orientacionMes", questionFullLabelsMMSE.orientacionMes)}
                    {renderRadioGroupField("orientacionDiaMes", questionFullLabelsMMSE.orientacionDiaMes)}
                    {renderRadioGroupField("orientacionDiaSemana", questionFullLabelsMMSE.orientacionDiaSemana)}
                </div>
            </div>
            <div className="border p-4 rounded-lg bg-card shadow-sm space-y-3">
                <h3 className="text-md font-semibold mb-2 flex items-center text-primary">
                     Registro de 3 Palabras (Máx: 3 puntos)
                </h3>
                <FormDescription className="text-xs">
                    Diga: "Voy a decirle tres palabras. Quiero que las repita después de mí: MANZANA, MESA, MONEDA. Ahora repítalas". Anote el número de palabras repetidas correctamente en el primer intento.
                </FormDescription>
                {renderNumberInputField("registroPalabrasCorrectas", questionFullLabelsMMSE.registroPalabrasCorrectas, 3)}
            </div>
            <div className="border p-4 rounded-lg bg-card shadow-sm space-y-3">
                <h3 className="text-md font-semibold mb-2 flex items-center text-primary">
                    Atención y Cálculo (Serie de 7, Máx: 5 puntos)
                </h3>
                <FormDescription className="text-xs">
                    Diga: "Ahora le voy a pedir que reste de 7 en 7 partiendo del 100". Detener tras 5 sustracciones (93, 86, 79, 72, 65). Anote el número de sustracciones correctas.
                </FormDescription>
                {renderNumberInputField("calculoSerie7Correctas", questionFullLabelsMMSE.calculoSerie7Correctas, 5)}
            </div>
            <div className="border p-4 rounded-lg bg-card shadow-sm space-y-3">
                <h3 className="text-md font-semibold mb-2 flex items-center text-primary">
                    Recuerdo Diferido de 3 Palabras (Máx: 3 puntos)
                </h3>
                 <FormDescription className="text-xs">
                    Diga: "¿Cuáles fueron las tres palabras que le pedí que recordara antes (MANZANA, MESA, MONEDA)?". Anote el número de palabras recordadas correctamente.
                </FormDescription>
                {renderNumberInputField("recuerdoPalabrasCorrectas", questionFullLabelsMMSE.recuerdoPalabrasCorrectas, 3)}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">Calcular Puntaje MMSE-2:BV</Button>
            </div>
          </form>
        </Form>

        {totalScore !== null && (
          <div className={cn(
            "mt-8 p-6 border rounded-lg",
            totalScore <= 12 ? "bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:border-orange-700" 
                             : "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700"
          )}>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                <h3 className="text-xl font-bold text-left flex-grow">
                    <ClipboardEdit className="inline mr-2 h-5 w-5 text-primary"/>Resultado MMSE-2:BV
                </h3>
                <div className="flex gap-2">
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
            </div>
            <p className={cn(
                "text-3xl font-extrabold text-center mb-1",
                 totalScore <= 12 ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"
            )}>{totalScore} / 16 puntos</p>
            <p className="text-md font-semibold text-center text-muted-foreground">{interpretation}</p>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                El MMSE-2: Brief Version (MMSE-2:BV) es una herramienta de cribado rápido para el deterioro cognitivo.
            </p>
            <p><strong>Interpretación General del Puntaje (Máx. 16 puntos):</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>≤ 12 puntos:</strong> Sugiere posible deterioro cognitivo. Se recomienda una evaluación más completa.</li>
                <li><strong>≥ 13 puntos:</strong> Generalmente considerado dentro de los límites normales para esta versión.</li>
            </ul>
            <p className="italic">
                Esta escala es una herramienta de cribado y no diagnóstica. El punto de corte puede variar según factores como edad y nivel educativo. Consulte guías clínicas y realice una evaluación integral.
                Fuente: Adaptado de Folstein MF, Folstein SE, McHugh PR. “Mini-mental state”. J Psychiatr Res. 1975;12(3):189-98 y versiones posteriores del MMSE-2.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MMSEAbreviadoForm;
