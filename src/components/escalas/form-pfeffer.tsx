
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
import { UserCheck, Info, TrendingUp, Download, ChevronDown, Mic, MicOff, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const pfefferQuestionSchema = z.string({ required_error: "Seleccione una opción." });

const pfefferSchema = z.object({
  manejarDinero: pfefferQuestionSchema,
  comprarSolo: pfefferQuestionSchema,
  calentarAguaCocinar: pfefferQuestionSchema,
  prepararComidaEquilibrada: pfefferQuestionSchema,
  enteradoEventosActuales: pfefferQuestionSchema,
  recordarCitasEventos: pfefferQuestionSchema,
  prestarAtencionConversarLibro: pfefferQuestionSchema,
  recordarFamiliaresAmigos: pfefferQuestionSchema,
  manejarAparatosDomesticos: pfefferQuestionSchema,
  saludarAmigosAdecuadamente: pfefferQuestionSchema,
});

type PfefferFormValues = z.infer<typeof pfefferSchema>;

interface PfefferOption {
  value: string;
  label: string;
  score: number;
}

const pfefferOptions: PfefferOption[] = [
  { value: "0", label: "0. Normal / Nunca lo hizo pero podría hacerlo ahora.", score: 0 },
  { value: "1", label: "1. Lo hace con dificultad / Nunca lo hizo y tendría dificultad ahora.", score: 1 },
  { value: "2", label: "2. Necesita ayuda.", score: 2 },
  { value: "3", label: "3. Dependiente / Incapaz de hacerlo.", score: 3 },
];

interface PfefferQuestionInfo {
  id: keyof PfefferFormValues;
  text: string;
}

const pfefferQuestions: PfefferQuestionInfo[] = [
  { id: "manejarDinero", text: "1. ¿Es capaz de manejar su propio dinero?" },
  { id: "comprarSolo", text: "2. ¿Es capaz de comprar solo algunas cosas como ropa, artículos del hogar, etc.?" },
  { id: "calentarAguaCocinar", text: "3. ¿Es capaz de calentar agua para café o té y apagar la cocina (o el hervidor)?" },
  { id: "prepararComidaEquilibrada", text: "4. ¿Es capaz de preparar una comida equilibrada?" },
  { id: "enteradoEventosActuales", text: "5. ¿Está enterado de los eventos actuales (noticias, política, etc.)?" },
  { id: "recordarCitasEventos", text: "6. ¿Es capaz de recordar citas, eventos familiares, feriados?" },
  { id: "prestarAtencionConversarLibro", text: "7. ¿Es capaz de prestar atención, entender y discutir un programa de radio, TV, artículo de periódico o libro?" },
  { id: "recordarFamiliaresAmigos", text: "8. ¿Es capaz de recordar los nombres de familiares y amigos?" },
  { id: "manejarAparatosDomesticos", text: "9. ¿Es capaz de manejar los aparatos domésticos (ej. estufa, lavadora, aspiradora)?" },
  { id: "saludarAmigosAdecuadamente", text: "10. ¿Es capaz de saludar a sus amigos adecuadamente?" },
];

const questionFullLabelsPfeffer = pfefferQuestions.reduce((acc, q) => {
    acc[q.id] = q.text;
    return acc;
}, {} as Record<keyof PfefferFormValues, string>);

const PfefferFAQForm: React.FC = () => {
  const [pfefferScore, setPfefferScore] = useState<number | null>(null);
  const [pfefferInterpretation, setPfefferInterpretation] = useState<string>("");
  const [patientName, setPatientName] = useState('');
  const { toast } = useToast();
  
  const form = useForm<PfefferFormValues>({
    resolver: zodResolver(pfefferSchema),
    defaultValues: {},
  });

  const onPfefferSubmit = (data: PfefferFormValues) => {
    const score = pfefferQuestions.reduce((sum, q) => {
      const answer = data[q.id];
      return sum + (pfefferOptions.find(opt => opt.value === answer)?.score ?? 0);
    }, 0);
    setPfefferScore(score);

    if (score >= 0 && score <= 5) setPfefferInterpretation("Normal");
    else if (score >= 6) setPfefferInterpretation("Sugiere deterioro funcional / Posible deterioro cognitivo");
    else setPfefferInterpretation("Puntuación fuera de rango esperado (0-30).");
  };

  const resetCalculator = () => {
    form.reset();
    setPfefferScore(null);
    setPfefferInterpretation("");
    setPatientName("");
  };
  
  const generateExportContent = (formatType: 'txt' | 'csv') => {
    if (pfefferScore === null) return "";
    const formValues = form.getValues();
    const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    const questionKeys = Object.keys(questionFullLabelsPfeffer) as Array<keyof PfefferFormValues>;

    if (formatType === 'csv') {
      const headers = [
        "Paciente", "Fecha", "Puntaje Total Pfeffer FAQ", "Interpretacion Pfeffer FAQ",
        ...questionKeys.map(key => `"${questionFullLabelsPfeffer[key].replace(/"/g, '""')}"`)
      ];
      const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
      const values = [
        patientNameCsv,
        currentDate,
        pfefferScore.toString(),
        `"${pfefferInterpretation.replace(/"/g, '""')}"`,
        ...questionKeys.map(key => {
          const selectedOptionValue = formValues[key];
          const selectedOption = pfefferOptions.find(opt => opt.value === selectedOptionValue);
          return selectedOption ? `"${selectedOption.label.replace(/"/g, '""')} (${selectedOption.score} pts)"` : "No respondido";
        })
      ];
      return `${headers.join(",")}\n${values.join(",")}`;
    } else { // TXT format
      let content = `Resultado del Cuestionario de Actividades Funcionales de Pfeffer (FAQ)\n`;
      if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
      content += `Fecha: ${currentDate}\n\n`;
      content += `PUNTAJE TOTAL: ${pfefferScore} / 30 puntos\n`;
      content += `Interpretación: ${pfefferInterpretation}\n\n`;
      content += `DETALLES DE LA EVALUACIÓN (respondido por informante):\n`;
      questionKeys.forEach((key) => {
          const selectedOptionValue = formValues[key];
          const selectedOption = pfefferOptions.find(opt => opt.value === selectedOptionValue);
          content += `- ${questionFullLabelsPfeffer[key]}:\n  Respuesta: ${selectedOption ? selectedOption.label : 'No respondido'} (Puntos: ${selectedOption ? selectedOption.score : 0})\n`;
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
    link.download = `resultado_pfeffer_faq_${new Date().toISOString().split('T')[0]}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
  };
  
  const renderRadioGroupField = (
    question: PfefferQuestionInfo
  ) => (
    <FormField
      control={form.control}
      name={question.id}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-base font-semibold">{question.text}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {pfefferOptions.map((option) => (
                <FormItem key={option.value} className="flex items-start space-x-3 space-y-0 p-2 hover:bg-muted/50 rounded-md transition-colors">
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
        <CardTitle className="flex items-center"><UserCheck className="mr-2 h-6 w-6 text-teal-500" />Cuestionario de Pfeffer (FAQ)</CardTitle>
        <ScaleCardDescription>
          Evaluación de actividades instrumentales de la vida diaria (AIVD) a través de un informante.
        </ScaleCardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <Label htmlFor="patientNamePfeffer">Nombre del Paciente (Opcional para exportación)</Label>
          <div className="flex gap-2 items-start">
            <Input
              id="patientNamePfeffer"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Ingrese nombre del paciente..."
              className="flex-grow"
            />
          </div>
        </div>
        <Separator className="my-6" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onPfefferSubmit)} className="space-y-8">
            {pfefferQuestions.map((q) => (
              <React.Fragment key={q.id}>
                {renderRadioGroupField(q)}
                <Separator />
              </React.Fragment>
            ))}
            <div className="flex flex-col sm:flex-row gap-2 pt-6">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">Calcular Puntaje Pfeffer FAQ</Button>
            </div>
          </form>
        </Form>

        {pfefferScore !== null && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
             <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                <h3 className="text-xl font-bold text-left flex-grow">
                    <TrendingUp className="inline mr-2 h-5 w-5 text-primary"/>Resultado Cuestionario Pfeffer (FAQ)
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
            <p className="text-3xl font-extrabold text-center text-primary mb-2">{pfefferScore} / 30 puntos</p>
            <p className="text-md font-semibold text-center text-muted-foreground">{pfefferInterpretation}</p>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                El Cuestionario de Actividades Funcionales de Pfeffer (FAQ) evalúa la capacidad para realizar AIVD. Se administra a un informante que conozca bien al paciente. Un puntaje más alto indica mayor dependencia.
            </p>
            <p><strong>Interpretación General del Puntaje (Máx. 30 puntos):</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>0-5 puntos:</strong> Normal, sin deterioro funcional significativo.</li>
                <li><strong>≥ 6 puntos:</strong> Sugiere deterioro funcional y posible deterioro cognitivo. Requiere evaluación adicional.</li>
            </ul>
            <p className="italic">
                Esta escala es una herramienta de cribado. La interpretación debe considerar el contexto clínico y la historia del paciente.
                Fuente: Pfeffer RI, et al. Measurement of functional activities in older adults in the community. J Gerontol. 1982.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PfefferFAQForm;
