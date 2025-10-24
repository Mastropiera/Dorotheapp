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
import { ShieldCheck, Info, Download, ChevronDown, Mic, MicOff, AlertTriangle } from 'lucide-react';
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

const bradenSchema = z.object({
  sensoryPerception: z.string({ required_error: "Seleccione una opción." }),
  moisture: z.string({ required_error: "Seleccione una opción." }),
  activity: z.string({ required_error: "Seleccione una opción." }),
  mobility: z.string({ required_error: "Seleccione una opción." }),
  nutrition: z.string({ required_error: "Seleccione una opción." }),
  frictionAndShear: z.string({ required_error: "Seleccione una opción." }),
});

type BradenFormValues = z.infer<typeof bradenSchema>;

interface BradenOption {
  value: string;
  label: string;
  score: number;
}

const bradenOptions: Record<keyof BradenFormValues, BradenOption[]> = {
  sensoryPerception: [
    { value: "1", label: "1. Completamente limitado", score: 1 },
    { value: "2", label: "2. Muy limitado", score: 2 },
    { value: "3", label: "3. Ligeramente limitado", score: 3 },
    { value: "4", label: "4. Sin limitaciones", score: 4 },
  ],
  moisture: [
    { value: "1", label: "1. Constantemente húmeda", score: 1 },
    { value: "2", label: "2. A menudo húmeda / Muy húmeda", score: 2 },
    { value: "3", label: "3. Ocasionalmente húmeda", score: 3 },
    { value: "4", label: "4. Raramente húmeda", score: 4 },
  ],
  activity: [
    { value: "1", label: "1. Encamado/a", score: 1 },
    { value: "2", label: "2. En silla / Chairfast", score: 2 },
    { value: "3", label: "3. Deambula ocasionalmente", score: 3 },
    { value: "4", label: "4. Deambula frecuentemente", score: 4 },
  ],
  mobility: [
    { value: "1", label: "1. Completamente inmóvil", score: 1 },
    { value: "2", label: "2. Muy limitado", score: 2 },
    { value: "3", label: "3. Ligeramente limitado", score: 3 },
    { value: "4", label: "4. Sin limitaciones", score: 4 },
  ],
  nutrition: [
    { value: "1", label: "1. Muy pobre", score: 1 },
    { value: "2", label: "2. Probablemente inadecuada", score: 2 },
    { value: "3", label: "3. Adecuada", score: 3 },
    { value: "4", label: "4. Excelente", score: 4 },
  ],
  frictionAndShear: [
    { value: "1", label: "1. Problema", score: 1 },
    { value: "2", label: "2. Problema potencial", score: 2 },
    { value: "3", label: "3. Sin problema aparente", score: 3 },
  ],
};

const questionFullLabelsBraden: Record<keyof BradenFormValues, string> = {
  sensoryPerception: "Percepción Sensorial",
  moisture: "Humedad",
  activity: "Actividad",
  mobility: "Movilidad",
  nutrition: "Nutrición",
  frictionAndShear: "Fricción y Cizallamiento",
};

const BradenScaleForm: React.FC = () => {
  const [bradenScore, setBradenScore] = useState<number | null>(null);
  const [bradenInterpretation, setBradenInterpretation] = useState<string>("");
  const [patientName, setPatientName] = useState('');
  const { toast } = useToast();

  const form = useForm<BradenFormValues>({
    resolver: zodResolver(bradenSchema),
    defaultValues: {},
  });

  const onBradenSubmit = (data: BradenFormValues) => {
    const score = (
      bradenOptions.sensoryPerception.find(opt => opt.value === data.sensoryPerception)!.score +
      bradenOptions.moisture.find(opt => opt.value === data.moisture)!.score +
      bradenOptions.activity.find(opt => opt.value === data.activity)!.score +
      bradenOptions.mobility.find(opt => opt.value === data.mobility)!.score +
      bradenOptions.nutrition.find(opt => opt.value === data.nutrition)!.score +
      bradenOptions.frictionAndShear.find(opt => opt.value === data.frictionAndShear)!.score
    );
    setBradenScore(score);

    if (score <= 9) setBradenInterpretation("Muy Alto Riesgo");
    else if (score >= 10 && score <= 12) setBradenInterpretation("Alto Riesgo");
    else if (score >= 13 && score <= 14) setBradenInterpretation("Riesgo Moderado");
    else if (score >= 15 && score <= 18) setBradenInterpretation("Riesgo Leve / En Riesgo");
    else if (score >= 19 && score <= 23) setBradenInterpretation("Sin Riesgo Aparente / Muy Bajo Riesgo");
    else setBradenInterpretation("Puntuación fuera de rango esperado (6-23).");
  };

  const resetCalculator = () => {
    form.reset();
    setBradenScore(null);
    setBradenInterpretation("");
    setPatientName("");
  };
  
  const generateExportContent = (formatType: 'txt' | 'csv') => {
    if (bradenScore === null) return "";
    const formValues = form.getValues();
    const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    const questionKeys = Object.keys(bradenOptions) as Array<keyof BradenFormValues>;

    if (formatType === 'csv') {
      const headers = [
        "Paciente", "Fecha", "Puntaje Total Braden", "Interpretacion Braden",
        ...questionKeys.map(key => `"${questionFullLabelsBraden[key].replace(/"/g, '""')}"`)
      ];
      const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
      const values = [
        patientNameCsv,
        currentDate,
        bradenScore.toString(),
        `"${bradenInterpretation.replace(/"/g, '""')}"`,
        ...questionKeys.map(key => {
          const selectedOptionValue = formValues[key];
          const selectedOption = bradenOptions[key].find(opt => opt.value === selectedOptionValue);
          return selectedOption ? `"${selectedOption.label.replace(/"/g, '""')} (${selectedOption.score} pts)"` : "No respondido";
        })
      ];
      return `${headers.join(",")}\n${values.join(",")}`;
    } else { // TXT format
      let content = `Resultado de la Escala de Braden\n`;
      if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
      content += `Fecha: ${currentDate}\n\n`;
      content += `PUNTAJE TOTAL: ${bradenScore} puntos\n`;
      content += `Interpretación: ${bradenInterpretation}\n\n`;
      content += `DETALLES DE LA EVALUACIÓN:\n`;
      questionKeys.forEach(key => {
          const selectedOptionValue = formValues[key];
          const selectedOption = bradenOptions[key].find(opt => opt.value === selectedOptionValue);
          content += `- ${questionFullLabelsBraden[key]}:\n  Respuesta: ${selectedOption ? selectedOption.label : 'No respondido'} (Puntos: ${selectedOption ? selectedOption.score : 0})\n`;
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
    link.download = `resultado_escala_braden_${new Date().toISOString().split('T')[0]}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
  };

  const renderRadioGroupField = (
    name: keyof BradenFormValues,
    label: string,
    description?: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-base font-semibold">{label}</FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {bradenOptions[name].map((option) => (
                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0 p-2 hover:bg-muted/50 rounded-md transition-colors">
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal flex-1 cursor-pointer">
                    {option.label} <span className="text-xs text-muted-foreground">({option.score} pts)</span>
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-6 w-6" />Escala de Braden</CardTitle>
        <ScaleCardDescription>
          Para predecir el riesgo de úlceras por presión (LPP) en adultos.
        </ScaleCardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <Label htmlFor="patientNameBraden">Nombre del Paciente (Opcional para exportación)</Label>
          <div className="flex gap-2 items-start">
            <Input
              id="patientNameBraden"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Ingrese nombre del paciente..."
              className="flex-grow"
            />
          </div>
        </div>
        <Separator className="my-6" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onBradenSubmit)} className="space-y-8">
            {renderRadioGroupField("sensoryPerception", questionFullLabelsBraden.sensoryPerception, "Habilidad para responder significativamente a la incomodidad relacionada con la presión.")}
            <Separator />
            {renderRadioGroupField("moisture", questionFullLabelsBraden.moisture, "Grado en que la piel está expuesta a la humedad.")}
            <Separator />
            {renderRadioGroupField("activity", questionFullLabelsBraden.activity, "Grado de actividad física.")}
            <Separator />
            {renderRadioGroupField("mobility", questionFullLabelsBraden.mobility, "Habilidad para cambiar y controlar la posición del cuerpo.")}
            <Separator />
            {renderRadioGroupField("nutrition", questionFullLabelsBraden.nutrition, "Patrón usual de ingesta de alimentos.")}
            <Separator />
            {renderRadioGroupField("frictionAndShear", questionFullLabelsBraden.frictionAndShear, "Roce y deslizamiento.")}
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">Calcular Riesgo de LPP</Button>
            </div>
          </form>
        </Form>

        {bradenScore !== null && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                <h3 className="text-xl font-bold text-left flex-grow">Resultado de la Escala de Braden</h3>
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
            <p className="text-3xl font-extrabold text-center text-primary mb-2">{bradenScore} puntos</p>
            <p className="text-md font-semibold text-center text-muted-foreground">{bradenInterpretation}</p>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={18} className="mr-2 flex-shrink-0 text-blue-500"/> 
                La Escala de Braden valora el riesgo de LPP. Un puntaje menor indica mayor riesgo. El rango de puntaje es de 6 a 23.
            </p>
            <p><strong>Interpretación del Puntaje (Adultos):</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>≤ 9 puntos:</strong> Muy Alto Riesgo</li>
                <li><strong>10-12 puntos:</strong> Alto Riesgo</li>
                <li><strong>13-14 puntos:</strong> Riesgo Moderado</li>
                <li><strong>15-18 puntos:</strong> Riesgo Leve (o En Riesgo)</li>
                <li><strong>19-23 puntos:</strong> Sin Riesgo Aparente</li>
            </ul>
            <p className="italic">
                Los puntos de corte y las intervenciones preventivas pueden variar según el protocolo institucional.
                Esta escala es una herramienta de valoración y debe complementarse con el juicio clínico.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BradenScaleForm;

    