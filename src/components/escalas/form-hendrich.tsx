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
import { Info, AlertTriangle, Download, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const hendrichSchema = z.object({
  confusionDisorientationImpulsivity: z.string({ required_error: "Seleccione una opción." }),
  symptomaticDepression: z.string({ required_error: "Seleccione una opción." }),
  alteredElimination: z.string({ required_error: "Seleccione una opción." }),
  dizzinessVertigo: z.string({ required_error: "Seleccione una opción." }),
  maleGender: z.string({ required_error: "Seleccione una opción." }),
  antiepileptics: z.string({ required_error: "Seleccione una opción." }),
  benzodiazepines: z.string({ required_error: "Seleccione una opción." }),
  getUpAndGo: z.string({ required_error: "Seleccione una opción." }),
});

type HendrichFormValues = z.infer<typeof hendrichSchema>;

interface HendrichOption {
  value: string;
  label: string;
  score: number;
}

const hendrichOptions: Record<keyof HendrichFormValues, HendrichOption[]> = {
  confusionDisorientationImpulsivity: [
    { value: "0", label: "No", score: 0 },
    { value: "1", label: "Sí", score: 4 },
  ],
  symptomaticDepression: [
    { value: "0", label: "No", score: 0 },
    { value: "1", label: "Sí", score: 2 },
  ],
  alteredElimination: [ // Incontinencia, urgencia/frecuencia, nicturia
    { value: "0", label: "No", score: 0 },
    { value: "1", label: "Sí", score: 1 },
  ],
  dizzinessVertigo: [
    { value: "0", label: "No", score: 0 },
    { value: "1", label: "Sí", score: 1 },
  ],
  maleGender: [
    { value: "0", label: "No (Femenino)", score: 0 },
    { value: "1", label: "Sí (Masculino)", score: 1 },
  ],
  antiepileptics: [ // Cualquier antiepiléptico
    { value: "0", label: "No", score: 0 },
    { value: "1", label: "Sí", score: 2 },
  ],
  benzodiazepines: [ // Cualquier benzodiazepina
    { value: "0", label: "No", score: 0 },
    { value: "1", label: "Sí", score: 1 },
  ],
  getUpAndGo: [
    { value: "0", label: "Se levanta en un solo movimiento sin usar los brazos.", score: 0 },
    { value: "1", label: "Se empuja con los brazos / Múltiples intentos para levantarse.", score: 1 },
    { value: "2", label: "Incapaz de levantarse sin ayuda.", score: 4 }, 
  ],
};

const questionFullLabelsHendrich: Record<keyof HendrichFormValues, string> = {
  confusionDisorientationImpulsivity: "Confusión/Desorientación/Impulsividad",
  symptomaticDepression: "Depresión Sintomática",
  alteredElimination: "Eliminación Alterada",
  dizzinessVertigo: "Mareos o Vértigo",
  maleGender: "Sexo Masculino",
  antiepileptics: "Administración de Antiepilépticos",
  benzodiazepines: "Administración de Benzodiacepinas",
  getUpAndGo: "Prueba \"Levántate y Anda\" (Get Up & Go)",
};

const HendrichScaleForm: React.FC = () => {
  const [hendrichScore, setHendrichScore] = useState<number | null>(null);
  const [hendrichInterpretation, setHendrichInterpretation] = useState<string>("");
  const [patientName, setPatientName] = useState('');
  const { toast } = useToast();

  const form = useForm<HendrichFormValues>({
    resolver: zodResolver(hendrichSchema),
    defaultValues: {},
  });

  const onHendrichSubmit = (data: HendrichFormValues) => {
    const score = (
      hendrichOptions.confusionDisorientationImpulsivity.find(opt => opt.value === data.confusionDisorientationImpulsivity)!.score +
      hendrichOptions.symptomaticDepression.find(opt => opt.value === data.symptomaticDepression)!.score +
      hendrichOptions.alteredElimination.find(opt => opt.value === data.alteredElimination)!.score +
      hendrichOptions.dizzinessVertigo.find(opt => opt.value === data.dizzinessVertigo)!.score +
      hendrichOptions.maleGender.find(opt => opt.value === data.maleGender)!.score +
      hendrichOptions.antiepileptics.find(opt => opt.value === data.antiepileptics)!.score +
      hendrichOptions.benzodiazepines.find(opt => opt.value === data.benzodiazepines)!.score +
      hendrichOptions.getUpAndGo.find(opt => opt.value === data.getUpAndGo)!.score
    );
    setHendrichScore(score);

    if (score >= 5) setHendrichInterpretation("Alto Riesgo de Caídas");
    else setHendrichInterpretation("Bajo Riesgo de Caídas");
  };

  const resetCalculator = () => {
    form.reset();
    setHendrichScore(null);
    setHendrichInterpretation("");
    setPatientName("");
  };

  const generateExportContent = (formatType: 'txt' | 'csv') => {
    if (hendrichScore === null) return "";
    const formValues = form.getValues();
    const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    const questionKeys = Object.keys(hendrichOptions) as Array<keyof HendrichFormValues>;

    if (formatType === 'csv') {
      const headers = [
        "Paciente", "Fecha", "Puntaje Total Hendrich II", "Interpretacion Hendrich II",
        ...questionKeys.map(key => `"${questionFullLabelsHendrich[key].replace(/"/g, '""')}"`)
      ];
      const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
      const values = [
        patientNameCsv,
        currentDate,
        hendrichScore.toString(),
        `"${hendrichInterpretation.replace(/"/g, '""')}"`,
        ...questionKeys.map(key => {
          const selectedOptionValue = formValues[key];
          const selectedOption = hendrichOptions[key].find(opt => opt.value === selectedOptionValue);
          return selectedOption ? `"${selectedOption.label.replace(/"/g, '""')} (${selectedOption.score} pts)"` : "No respondido";
        })
      ];
      return `${headers.join(",")}\n${values.join(",")}`;
    } else { // TXT format
      let content = `Resultado de la Escala Hendrich II\n`;
      if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
      content += `Fecha: ${currentDate}\n\n`;
      content += `PUNTAJE TOTAL: ${hendrichScore} puntos\n`;
      content += `Interpretación: ${hendrichInterpretation}\n\n`;
      content += `DETALLES DE LA EVALUACIÓN:\n`;
      questionKeys.forEach(key => {
          const selectedOptionValue = formValues[key];
          const selectedOption = hendrichOptions[key].find(opt => opt.value === selectedOptionValue);
          content += `- ${questionFullLabelsHendrich[key]}:\n  Respuesta: ${selectedOption ? selectedOption.label : 'No respondido'} (Puntos: ${selectedOption ? selectedOption.score : 0})\n`;
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
    link.download = `resultado_escala_hendrich_II_${new Date().toISOString().split('T')[0]}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
  };
  
  const renderRadioGroupField = (
    name: keyof HendrichFormValues,
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
              {hendrichOptions[name].map((option) => (
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
        <CardTitle className="flex items-center"><AlertTriangle className="mr-2 h-6 w-6 text-orange-500" />Escala Hendrich II (Riesgo de Caídas)</CardTitle>
        <ScaleCardDescription>
          Modelo de evaluación del riesgo de caídas en pacientes adultos hospitalizados.
        </ScaleCardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <Label htmlFor="patientNameHendrich">Nombre del Paciente (Opcional para exportación)</Label>
          <div className="flex gap-2 items-start">
            <Input
              id="patientNameHendrich"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Ingrese nombre del paciente..."
              className="flex-grow"
            />
          </div>
        </div>
        <Separator className="my-6" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onHendrichSubmit)} className="space-y-8">
            {renderRadioGroupField("confusionDisorientationImpulsivity", questionFullLabelsHendrich.confusionDisorientationImpulsivity)}
            <Separator />
            {renderRadioGroupField("symptomaticDepression", questionFullLabelsHendrich.symptomaticDepression)}
            <Separator />
            {renderRadioGroupField("alteredElimination", questionFullLabelsHendrich.alteredElimination, "Presencia de incontinencia, urgencia, frecuencia urinaria o nicturia.")}
            <Separator />
            {renderRadioGroupField("dizzinessVertigo", questionFullLabelsHendrich.dizzinessVertigo, "Reportados por el paciente o evidentes.")}
            <Separator />
            {renderRadioGroupField("maleGender", questionFullLabelsHendrich.maleGender)}
            <Separator />
            {renderRadioGroupField("antiepileptics", questionFullLabelsHendrich.antiepileptics, "Cualquier fármaco antiepiléptico.")}
            <Separator />
            {renderRadioGroupField("benzodiazepines", questionFullLabelsHendrich.benzodiazepines, "Cualquier fármaco benzodiazepínico.")}
            <Separator />
            {renderRadioGroupField("getUpAndGo", questionFullLabelsHendrich.getUpAndGo)}
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">Calcular Riesgo Hendrich II</Button>
            </div>
          </form>
        </Form>

        {hendrichScore !== null && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
             <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                <h3 className="text-xl font-bold text-left flex-grow">Resultado de la Escala Hendrich II</h3>
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
            <p className="text-3xl font-extrabold text-center text-primary mb-2">{hendrichScore} puntos</p>
            <p className="text-md font-semibold text-center text-muted-foreground">{hendrichInterpretation}</p>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={18} className="mr-2 flex-shrink-0 text-blue-500"/> 
                La Escala Hendrich II Fall Risk Model identifica pacientes con riesgo de caídas. Un puntaje mayor indica mayor riesgo.
            </p>
            <p><strong>Interpretación del Puntaje:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>Puntaje &lt; 5:</strong> Bajo Riesgo de Caídas.</li>
                <li><strong>Puntaje ≥ 5:</strong> Alto Riesgo de Caídas.</li>
            </ul>
            <p className="italic">
                Esta escala es una herramienta de cribado. Las intervenciones preventivas deben basarse en el nivel de riesgo identificado y el juicio clínico.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HendrichScaleForm;
