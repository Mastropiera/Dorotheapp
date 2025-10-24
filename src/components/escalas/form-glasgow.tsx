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
import { Brain, Info, Download, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const glasgowSchema = z.object({
  eyeOpening: z.string({ required_error: "Seleccione una opción de apertura ocular." }),
  verbalResponse: z.string({ required_error: "Seleccione una opción de respuesta verbal." }),
  motorResponse: z.string({ required_error: "Seleccione una opción de respuesta motora." }),
});

type GlasgowFormValues = z.infer<typeof glasgowSchema>;

interface GlasgowOption {
  value: string;
  label: string;
  score: number;
}

const glasgowOptions: Record<keyof GlasgowFormValues, GlasgowOption[]> = {
  eyeOpening: [
    { value: "4", label: "4. Espontánea", score: 4 },
    { value: "3", label: "3. A la orden verbal", score: 3 },
    { value: "2", label: "2. Al dolor", score: 2 },
    { value: "1", label: "1. Ninguna", score: 1 },
  ],
  verbalResponse: [
    { value: "5", label: "5. Orientada", score: 5 },
    { value: "4", label: "4. Confusa", score: 4 },
    { value: "3", label: "3. Palabras inapropiadas", score: 3 },
    { value: "2", label: "2. Sonidos incomprensibles", score: 2 },
    { value: "1", label: "1. Ninguna", score: 1 },
  ],
  motorResponse: [
    { value: "6", label: "6. Obedece órdenes", score: 6 },
    { value: "5", label: "5. Localiza el dolor", score: 5 },
    { value: "4", label: "4. Retirada y flexión", score: 4 },
    { value: "3", label: "3. Flexión anormal (decorticación)", score: 3 },
    { value: "2", label: "2. Extensión anormal (descerebración)", score: 2 },
    { value: "1", label: "1. Ninguna", score: 1 },
  ],
};

const questionFullLabelsGlasgow: Record<keyof GlasgowFormValues, string> = {
  eyeOpening: "Respuesta Ocular (E)",
  verbalResponse: "Respuesta Verbal (V)",
  motorResponse: "Respuesta Motora (M)",
};

const GlasgowComaScaleForm: React.FC = () => {
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [eyeScore, setEyeScore] = useState<number>(0);
  const [verbalScore, setVerbalScore] = useState<number>(0);
  const [motorScore, setMotorScore] = useState<number>(0);
  const [interpretation, setInterpretation] = useState<string>("");
  const [patientName, setPatientName] = useState('');
  const { toast } = useToast();

  const form = useForm<GlasgowFormValues>({
    resolver: zodResolver(glasgowSchema),
    defaultValues: {},
  });

  const onSubmit = (data: GlasgowFormValues) => {
    const eScore = glasgowOptions.eyeOpening.find(opt => opt.value === data.eyeOpening)?.score ?? 0;
    const vScore = glasgowOptions.verbalResponse.find(opt => opt.value === data.verbalResponse)?.score ?? 0;
    const mScore = glasgowOptions.motorResponse.find(opt => opt.value === data.motorResponse)?.score ?? 0;
    
    setEyeScore(eScore);
    setVerbalScore(vScore);
    setMotorScore(mScore);
    
    const score = eScore + vScore + mScore;
    setTotalScore(score);

    if (score === 15) setInterpretation("Paciente completamente alerta y consciente.");
    else if (score >= 13) setInterpretation("Traumatismo Craneoencefálico Leve");
    else if (score >= 9) setInterpretation("Traumatismo Craneoencefálico Moderado");
    else if (score >= 3) setInterpretation("Traumatismo Craneoencefálico Severo");
    else setInterpretation("Puntuación inválida.");
  };

  const resetCalculator = () => {
    form.reset();
    setTotalScore(null);
    setEyeScore(0);
    setVerbalScore(0);
    setMotorScore(0);
    setInterpretation("");
    setPatientName("");
  };
  
  const generateExportContent = (formatType: 'txt' | 'csv') => {
    if (totalScore === null) return "";
    const formValues = form.getValues();
    const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });

    if (formatType === 'csv') {
      const headers = ["Paciente", "Fecha", "Puntaje Ocular (E)", "Puntaje Verbal (V)", "Puntaje Motor (M)", "Puntaje Total GCS", "Interpretacion GCS"];
      const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
      const values = [
        patientNameCsv, currentDate, eyeScore.toString(), verbalScore.toString(), motorScore.toString(), totalScore.toString(), `"${interpretation.replace(/"/g, '""')}"`
      ];
      return `${headers.join(",")}\n${values.join(",")}`;
    } else { // TXT format
      let content = `Resultado de la Escala de Coma de Glasgow (GCS)\n`;
      if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
      content += `Fecha: ${currentDate}\n\n`;
      content += `PUNTAJE TOTAL: ${totalScore} (E${eyeScore}V${verbalScore}M${motorScore})\n`;
      content += `Interpretación: ${interpretation}\n\n`;
      content += `DETALLES DE LA EVALUACIÓN:\n`;
      (Object.keys(formValues) as Array<keyof GlasgowFormValues>).forEach(key => {
        const selectedOptionValue = formValues[key];
        const selectedOption = glasgowOptions[key].find(opt => opt.value === selectedOptionValue);
        content += `- ${questionFullLabelsGlasgow[key]}:\n  Respuesta: ${selectedOption ? selectedOption.label : 'No respondido'}\n`;
      });
      return content;
    }
  }

  const handleExport = (formatType: 'txt' | 'csv') => {
    const content = generateExportContent(formatType);
    if (!content) {
        toast({title: "Exportación no disponible", description: "Complete la escala para poder exportar.", variant: "default"});
        return;
    }
    const mimeType = formatType === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
    const extension = formatType === 'csv' ? '.csv' : '.txt';
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `resultado_escala_glasgow_${new Date().toISOString().split('T')[0]}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
  };
  
  const renderRadioGroupField = (name: keyof GlasgowFormValues, label: string) => (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem className="space-y-3">
        <FormLabel className="text-base font-semibold">{label}</FormLabel>
        <FormControl>
          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-1">
            {glasgowOptions[name].map((option) => (
              <FormItem key={option.value} className="flex items-center space-x-3 space-y-0 p-2 hover:bg-muted/50 rounded-md transition-colors">
                <FormControl><RadioGroupItem value={option.value} /></FormControl>
                <FormLabel className="font-normal flex-1 cursor-pointer">{option.label}</FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><Brain className="mr-2 h-6 w-6 text-purple-500" />Escala de Coma de Glasgow (GCS)</CardTitle>
        <ScaleCardDescription>
          Evalúa el nivel de conciencia en pacientes con traumatismo craneoencefálico o alteraciones neurológicas.
        </ScaleCardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <Label htmlFor="patientNameGlasgow">Nombre del Paciente (Opcional para exportación)</Label>
          <div className="flex gap-2 items-start">
            <Input id="patientNameGlasgow" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Ingrese nombre del paciente..." className="flex-grow" />
          </div>
        </div>
        <Separator className="my-6" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {renderRadioGroupField("eyeOpening", questionFullLabelsGlasgow.eyeOpening)}
            <Separator />
            {renderRadioGroupField("verbalResponse", questionFullLabelsGlasgow.verbalResponse)}
            <Separator />
            {renderRadioGroupField("motorResponse", questionFullLabelsGlasgow.motorResponse)}
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">Limpiar</Button>
              <Button type="submit" className="w-full sm:w-auto">Calcular Glasgow</Button>
            </div>
          </form>
        </Form>

        {totalScore !== null && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                <h3 className="text-xl font-bold text-left flex-grow">Resultado de la Escala de Glasgow</h3>
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
            <p className="text-3xl font-extrabold text-center text-primary mb-1">{totalScore} puntos</p>
            <p className="text-md font-semibold text-center text-muted-foreground"> (E{eyeScore}V{verbalScore}M{motorScore})</p>
            <p className="text-md font-semibold text-center text-muted-foreground mt-2">{interpretation}</p>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                La GCS es una herramienta estandarizada para evaluar el nivel de conciencia. Un puntaje más bajo indica un nivel de conciencia más bajo.
            </p>
            <p><strong>Interpretación del Puntaje Total (Máx. 15 puntos):</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>15 puntos:</strong> Paciente completamente alerta y consciente.</li>
                <li><strong>13-14 puntos:</strong> Traumatismo Craneoencefálico Leve.</li>
                <li><strong>9-12 puntos:</strong> Traumatismo Craneoencefálico Moderado.</li>
                <li><strong>3-8 puntos:</strong> Traumatismo Craneoencefálico Severo.</li>
            </ul>
            <p className="italic">
                Es crucial registrar los componentes individuales (E, V, M) además del puntaje total. Una puntuación de 8 o menos a menudo se considera indicativa de coma y puede requerir intubación.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlasgowComaScaleForm;