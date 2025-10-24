"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { cn } from '@/lib/utils';

const morseSchema = z.object({
  historyOfFalling: z.string({ required_error: "Seleccione una opción." }),
  secondaryDiagnosis: z.string({ required_error: "Seleccione una opción." }),
  ambulatoryAid: z.string({ required_error: "Seleccione una opción." }),
  ivTherapy: z.string({ required_error: "Seleccione una opción." }),
  gait: z.string({ required_error: "Seleccione una opción." }),
  mentalStatus: z.string({ required_error: "Seleccione una opción." }),
});

type MorseFormValues = z.infer<typeof morseSchema>;

interface MorseOption {
  value: string;
  label: string;
  score: number;
}

const morseOptions: Record<keyof MorseFormValues, MorseOption[]> = {
  historyOfFalling: [
    { value: "0", label: "No", score: 0 },
    { value: "1", label: "Sí", score: 25 },
  ],
  secondaryDiagnosis: [
    { value: "0", label: "No", score: 0 },
    { value: "1", label: "Sí", score: 15 },
  ],
  ambulatoryAid: [
    { value: "0", label: "Ninguna / Reposo en cama / Ayuda de enfermería", score: 0 },
    { value: "1", label: "Bastón / Muletas / Andador", score: 15 },
    { value: "2", label: "Se apoya en los muebles", score: 30 },
  ],
  ivTherapy: [
    { value: "0", label: "No", score: 0 },
    { value: "1", label: "Sí (Vía IV o catéter heparinizado/salinizado)", score: 20 },
  ],
  gait: [
    { value: "0", label: "Normal / Reposo en cama / Silla de ruedas (inmóvil)", score: 0 },
    { value: "1", label: "Débil (pasos cortos, arrastra pies)", score: 10 },
    { value: "2", label: "Alterada / Deficiente (dificultad para levantarse, pasos inseguros, agarra objetos)", score: 20 },
  ],
  mentalStatus: [
    { value: "0", label: "Orientado respecto a sus propias limitaciones", score: 0 },
    { value: "1", label: "Sobreestima o desconoce / Olvida sus limitaciones", score: 15 },
  ],
};

const questionLabels: Record<keyof MorseFormValues, string> = {
  historyOfFalling: "1. Antecedentes de caídas (inmediatas o en los últimos 3 meses)",
  secondaryDiagnosis: "2. Diagnóstico secundario (≥ 2 diagnósticos médicos en la historia)",
  ambulatoryAid: "3. Ayuda para la deambulación",
  ivTherapy: "4. Terapia intravenosa / Catéter heparinizado o salinizado",
  gait: "5. Marcha / Transferencia",
  mentalStatus: "6. Estado mental (Conciencia de las propias limitaciones)",
};

const MorseScaleForm: React.FC = () => {
  const [morseScore, setMorseScore] = useState<number | null>(null);
  const [morseInterpretation, setMorseInterpretation] = useState<string>("");
  const [patientName, setPatientName] = useState('');
  const { toast } = useToast();

  const form = useForm<MorseFormValues>({
    resolver: zodResolver(morseSchema),
    defaultValues: {},
  });

  const onMorseSubmit = (data: MorseFormValues) => {
    const score = (
      morseOptions.historyOfFalling.find(opt => opt.value === data.historyOfFalling)!.score +
      morseOptions.secondaryDiagnosis.find(opt => opt.value === data.secondaryDiagnosis)!.score +
      morseOptions.ambulatoryAid.find(opt => opt.value === data.ambulatoryAid)!.score +
      morseOptions.ivTherapy.find(opt => opt.value === data.ivTherapy)!.score +
      morseOptions.gait.find(opt => opt.value === data.gait)!.score +
      morseOptions.mentalStatus.find(opt => opt.value === data.mentalStatus)!.score
    );
    setMorseScore(score);

    if (score >= 0 && score <= 24) setMorseInterpretation("Sin Riesgo / Riesgo Bajo");
    else if (score >= 25 && score <= 50) setMorseInterpretation("Riesgo Medio");
    else if (score > 50) setMorseInterpretation("Riesgo Alto");
    else setMorseInterpretation("Puntuación fuera de rango esperado.");
  };
  
  const resetCalculator = () => {
    form.reset();
    setMorseScore(null);
    setMorseInterpretation("");
    setPatientName("");
  };

  const generateExportContent = (formatType: 'txt' | 'csv') => {
    if (morseScore === null) return "";
    const formValues = form.getValues();
    const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    
    if (formatType === 'csv') {
      const headers = [
        "Paciente", "Fecha", "Puntaje Total", "Interpretacion",
        ...Object.values(questionLabels)
      ];
      const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
      const values = [
        patientNameCsv,
        currentDate,
        morseScore.toString(),
        `"${morseInterpretation.replace(/"/g, '""')}"`, 
        ...Object.keys(morseOptions).map(keyStr => {
          const key = keyStr as keyof MorseFormValues;
          const selectedOptionValue = formValues[key];
          const selectedOption = morseOptions[key].find(opt => opt.value === selectedOptionValue);
          return selectedOption ? `"${selectedOption.label.replace(/"/g, '""')} (${selectedOption.score} pts)"` : "No respondido";
        })
      ];
      return `${headers.join(",")}\n${values.join(",")}`;
    } else { // TXT format
      let content = `Resultado de la Escala de Morse de Riesgo de Caídas\n`;
      if (patientName.trim()) {
        content += `Paciente: ${patientName.trim()}\n`;
      }
      content += `Fecha: ${currentDate}\n\n`;
      content += `PUNTAJE TOTAL: ${morseScore} puntos\n`;
      content += `Interpretación: ${morseInterpretation}\n\n`;
      content += `DETALLES DE LA EVALUACIÓN:\n`;
      (Object.keys(morseOptions) as Array<keyof MorseFormValues>).forEach(key => {
          const questionFullLabel = questionLabels[key];
          const selectedOptionValue = formValues[key];
          const selectedOption = morseOptions[key].find(opt => opt.value === selectedOptionValue);
          content += `- ${questionFullLabel}:\n  Respuesta: ${selectedOption ? selectedOption.label : 'No respondido'} (Puntos: ${selectedOption ? selectedOption.score : 0})\n`;
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
    link.download = `resultado_escala_morse_${new Date().toISOString().split('T')[0]}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
  };

  const renderRadioGroupField = (
    name: keyof MorseFormValues,
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
              {morseOptions[name].map((option) => (
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
        <CardTitle className="flex items-center"><Activity className="mr-2 h-6 w-6 text-orange-500" />Escala de Morse de Riesgo de Caídas</CardTitle>
        <ScaleCardDescription>
          Identifica el riesgo de caídas en pacientes hospitalizados.
        </ScaleCardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <Label htmlFor="patientNameMorse">Nombre del Paciente (Opcional para exportación)</Label>
          <div className="flex gap-2 items-start">
            <Input
              id="patientNameMorse"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Ingrese nombre del paciente..."
              className="flex-grow"
            />
          </div>
        </div>
        <Separator className="my-6" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onMorseSubmit)} className="space-y-8">
            {renderRadioGroupField("historyOfFalling", questionLabels.historyOfFalling)}
            <Separator />
            {renderRadioGroupField("secondaryDiagnosis", questionLabels.secondaryDiagnosis)}
            <Separator />
            {renderRadioGroupField("ambulatoryAid", questionLabels.ambulatoryAid)}
            <Separator />
            {renderRadioGroupField("ivTherapy", questionLabels.ivTherapy)}
            <Separator />
            {renderRadioGroupField("gait", questionLabels.gait)}
            <Separator />
            {renderRadioGroupField("mentalStatus", questionLabels.mentalStatus)}
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">Calcular Riesgo Morse</Button>
            </div>
          </form>
        </Form>

        {morseScore !== null && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                <h3 className="text-xl font-bold text-left flex-grow">Resultado de la Escala de Morse</h3>
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
            <p className="text-3xl font-extrabold text-center text-primary mb-2">{morseScore} puntos</p>
            <p className="text-md font-semibold text-center text-muted-foreground">{morseInterpretation}</p>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={18} className="mr-2 flex-shrink-0 text-blue-500"/> 
                La Escala de Morse se utiliza para evaluar el riesgo de caídas. Un puntaje mayor indica mayor riesgo.
            </p>
            <p><strong>Interpretación del Puntaje (General):</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>0 - 24 puntos:</strong> Sin Riesgo / Riesgo Bajo.</li>
                <li><strong>25 - 50 puntos:</strong> Riesgo Medio.</li>
                <li><strong>&gt;50 puntos:</strong> Riesgo Alto.</li>
            </ul>
            <p className="italic">
                Los puntos de corte pueden variar ligeramente según la fuente y el protocolo institucional.
                Implementar medidas preventivas acordes al nivel de riesgo identificado.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MorseScaleForm;
    





