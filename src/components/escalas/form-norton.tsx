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
import { BedDouble, Info, Download, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const nortonSchema = z.object({
  physicalCondition: z.string({ required_error: "Seleccione una opción." }),
  mentalCondition: z.string({ required_error: "Seleccione una opción." }),
  activity: z.string({ required_error: "Seleccione una opción." }),
  mobility: z.string({ required_error: "Seleccione una opción." }),
  incontinence: z.string({ required_error: "Seleccione una opción." }),
});

type NortonFormValues = z.infer<typeof nortonSchema>;

interface NortonOption {
  value: string;
  label: string;
  score: number;
}

const nortonOptions: Record<keyof Omit<NortonFormValues, 'totalScore'>, NortonOption[]> = {
  physicalCondition: [
    { value: "4", label: "Buena", score: 4 },
    { value: "3", label: "Regular", score: 3 },
    { value: "2", label: "Mala", score: 2 },
    { value: "1", label: "Muy mala", score: 1 },
  ],
  mentalCondition: [
    { value: "4", label: "Alerta", score: 4 },
    { value: "3", label: "Apático", score: 3 },
    { value: "2", label: "Confuso", score: 2 },
    { value: "1", label: "Estuporoso/Comatoso", score: 1 },
  ],
  activity: [
    { value: "4", label: "Deambula", score: 4 },
    { value: "3", label: "Deambula con ayuda", score: 3 },
    { value: "2", label: "Sentado/Sillón", score: 2 },
    { value: "1", label: "Encamado", score: 1 },
  ],
  mobility: [
    { value: "4", label: "Total", score: 4 },
    { value: "3", label: "Disminuida/Limitada", score: 3 },
    { value: "2", label: "Muy limitada", score: 2 },
    { value: "1", label: "Inmóvil", score: 1 },
  ],
  incontinence: [
    { value: "4", label: "Ninguna", score: 4 },
    { value: "3", label: "Ocasional", score: 3 },
    { value: "2", label: "Urinaria o Fecal habitual", score: 2 },
    { value: "1", label: "Urinaria y Fecal (Doble)", score: 1 },
  ],
};

const questionFullLabelsNorton: Record<keyof NortonFormValues, string> = {
  physicalCondition: "Condición Física General",
  mentalCondition: "Estado Mental",
  activity: "Actividad",
  mobility: "Movilidad",
  incontinence: "Incontinencia",
};

const NortonScaleForm: React.FC = () => {
  const [nortonScore, setNortonScore] = useState<number | null>(null);
  const [nortonInterpretation, setNortonInterpretation] = useState<string>("");
  const [patientName, setPatientName] = useState('');
  const { toast } = useToast();

  const form = useForm<NortonFormValues>({
    resolver: zodResolver(nortonSchema),
    defaultValues: {},
  });

  const onNortonSubmit = (data: NortonFormValues) => {
    const score = (
      nortonOptions.physicalCondition.find(opt => opt.value === data.physicalCondition)!.score +
      nortonOptions.mentalCondition.find(opt => opt.value === data.mentalCondition)!.score +
      nortonOptions.activity.find(opt => opt.value === data.activity)!.score +
      nortonOptions.mobility.find(opt => opt.value === data.mobility)!.score +
      nortonOptions.incontinence.find(opt => opt.value === data.incontinence)!.score
    );
    setNortonScore(score);

    if (score < 12) setNortonInterpretation("Riesgo Muy Alto");
    else if (score >= 12 && score <= 14) setNortonInterpretation("Riesgo Alto");
    else if (score > 14 && score <=18) setNortonInterpretation("Riesgo Medio / Riesgo Evidente");
    else if (score > 18) setNortonInterpretation("Riesgo Mínimo / Sin Riesgo Evidente");
    else setNortonInterpretation("Puntuación fuera de rango esperado.");
  };

  const resetCalculator = () => {
    form.reset();
    setNortonScore(null);
    setNortonInterpretation("");
    setPatientName("");
  };

  const generateExportContent = (formatType: 'txt' | 'csv') => {
    if (nortonScore === null) return "";
    const formValues = form.getValues();
    const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    const questionKeys = Object.keys(nortonOptions) as Array<keyof NortonFormValues>;

    if (formatType === 'csv') {
      const headers = [
        "Paciente", "Fecha", "Puntaje Total Norton", "Interpretacion Norton",
        ...questionKeys.map(key => `"${questionFullLabelsNorton[key].replace(/"/g, '""')}"`)
      ];
      const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
      const values = [
        patientNameCsv,
        currentDate,
        nortonScore.toString(),
        `"${nortonInterpretation.replace(/"/g, '""')}"`,
        ...questionKeys.map(key => {
          const selectedOptionValue = formValues[key];
          const selectedOption = nortonOptions[key].find(opt => opt.value === selectedOptionValue);
          return selectedOption ? `"${selectedOption.label.replace(/"/g, '""')} (${selectedOption.score} pts)"` : "No respondido";
        })
      ];
      return `${headers.join(",")}\n${values.join(",")}`;
    } else { // TXT format
      let content = `Resultado de la Escala de Norton\n`;
      if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
      content += `Fecha: ${currentDate}\n\n`;
      content += `PUNTAJE TOTAL: ${nortonScore} puntos\n`;
      content += `Interpretación: ${nortonInterpretation}\n\n`;
      content += `DETALLES DE LA EVALUACIÓN:\n`;
      questionKeys.forEach(key => {
          const selectedOptionValue = formValues[key];
          const selectedOption = nortonOptions[key].find(opt => opt.value === selectedOptionValue);
          content += `- ${questionFullLabelsNorton[key]}:\n  Respuesta: ${selectedOption ? selectedOption.label : 'No respondido'} (Puntos: ${selectedOption ? selectedOption.score : 0})\n`;
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
    link.download = `resultado_escala_norton_${new Date().toISOString().split('T')[0]}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
  };
  
  const renderRadioGroupField = (
    name: keyof NortonFormValues,
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
              {nortonOptions[name].map((option) => (
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
        <CardTitle className="flex items-center"><BedDouble className="mr-2 h-6 w-6" />Escala de Norton</CardTitle> 
        <ScaleCardDescription>
          Evalúa el riesgo de desarrollar úlceras por presión (LPP) en pacientes.
        </ScaleCardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <Label htmlFor="patientNameNorton">Nombre del Paciente (Opcional para exportación)</Label>
          <div className="flex gap-2 items-start">
            <Input
              id="patientNameNorton"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Ingrese nombre del paciente..."
              className="flex-grow"
            />
          </div>
        </div>
        <Separator className="my-6" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNortonSubmit)} className="space-y-8">
            {renderRadioGroupField("physicalCondition", questionFullLabelsNorton.physicalCondition)}
            <Separator />
            {renderRadioGroupField("mentalCondition", questionFullLabelsNorton.mentalCondition)}
            <Separator />
            {renderRadioGroupField("activity", questionFullLabelsNorton.activity)}
            <Separator />
            {renderRadioGroupField("mobility", questionFullLabelsNorton.mobility)}
            <Separator />
            {renderRadioGroupField("incontinence", questionFullLabelsNorton.incontinence)}
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">Calcular Riesgo</Button>
            </div>
          </form>
        </Form>

        {nortonScore !== null && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                <h3 className="text-xl font-bold text-left flex-grow">Resultado de la Escala de Norton</h3>
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
            <p className="text-3xl font-extrabold text-center text-primary mb-2">{nortonScore} puntos</p>
            <p className="text-md font-semibold text-center text-muted-foreground">{nortonInterpretation}</p>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={18} className="mr-2 flex-shrink-0 text-blue-500"/> 
                La Escala de Norton es una herramienta para valorar el riesgo de LPP. Un menor puntaje indica mayor riesgo.
            </p>
            <p><strong>Interpretación del Puntaje:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>5-11 puntos:</strong> Riesgo Muy Alto</li>
                <li><strong>12-14 puntos:</strong> Riesgo Alto</li>
                <li><strong>15-18 puntos:</strong> Riesgo Medio</li>
                <li><strong>19-20 puntos:</strong> Riesgo Mínimo / Sin Riesgo</li>
            </ul>
            <p className="italic">
                Los puntos de corte exactos y las intervenciones pueden variar según el protocolo institucional. 
                Esta escala es una guía y debe complementarse con el juicio clínico.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NortonScaleForm;
