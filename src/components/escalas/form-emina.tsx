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
import { FileText, Info, Download, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const eminaSchema = z.object({
  estadoMental: z.string({ required_error: "Seleccione una opción." }),
  movilidad: z.string({ required_error: "Seleccione una opción." }),
  humedad: z.string({ required_error: "Seleccione una opción." }),
  nutricion: z.string({ required_error: "Seleccione una opción." }),
  actividadFisica: z.string({ required_error: "Seleccione una opción." }),
});

type EminaFormValues = z.infer<typeof eminaSchema>;

interface EminaOption {
  value: string;
  label: string;
  score: number;
}

const eminaOptions: Record<keyof EminaFormValues, EminaOption[]> = {
  estadoMental: [
    { value: "0", label: "0. Orientado.", score: 0 },
    { value: "1", label: "1. Desorientado / confuso.", score: 1 },
    { value: "2", label: "2. Letárgico / estuporoso.", score: 2 },
    { value: "3", label: "3. Comatoso.", score: 3 },
  ],
  movilidad: [
    { value: "0", label: "0. Completa.", score: 0 },
    { value: "1", label: "1. Ligeramente limitada (ej. necesita ayuda para ciertos movimientos).", score: 1 },
    { value: "2", label: "2. Muy limitada (ej. precisa ayuda para cambios posturales importantes).", score: 2 },
    { value: "3", label: "3. Inmóvil.", score: 3 },
  ],
  humedad: [ // Frecuencia de exposición de la piel a la humedad
    { value: "0", label: "0. Piel siempre seca.", score: 0 },
    { value: "1", label: "1. Ocasionalmente húmeda (ej. sudoración ocasional).", score: 1 },
    { value: "2", label: "2. Frecuentemente húmeda (ej. incontinencia urinaria ocasional, sudoración frecuente).", score: 2 },
    { value: "3", label: "3. Constantemente húmeda (ej. incontinencia urinaria y/o fecal habitual).", score: 3 },
  ],
  nutricion: [ // Ingesta de alimentos
    { value: "0", label: "0. Correcta / adecuada.", score: 0 },
    { value: "1", label: "1. Ocasionalmente incompleta / regular.", score: 1 },
    { value: "2", label: "2. Incompleta / escasa (generalmente no come comidas completas).", score: 2 },
    { value: "3", label: "3. Muy deficiente / nula (ayuno, nutrición parenteral exclusiva).", score: 3 },
  ],
  actividadFisica: [ // Capacidad para deambular
    { value: "0", label: "0. Deambula sin limitaciones.", score: 0 },
    { value: "1", label: "1. Deambula con ayuda (bastón, andador) o con dificultad.", score: 1 },
    { value: "2", label: "2. Precisa ayuda para sedestación / encamado la mayor parte del tiempo.", score: 2 },
    { value: "3", label: "3. Encamado / inmovilizado.", score: 3 },
  ],
};

const questionFullLabelsEmina: Record<keyof EminaFormValues, string> = {
  estadoMental: "Estado Mental",
  movilidad: "Movilidad",
  humedad: "Humedad de la piel",
  nutricion: "Nutrición",
  actividadFisica: "Actividad Física",
};

const EminaScaleForm: React.FC = () => {
  const [eminaScore, setEminaScore] = useState<number | null>(null);
  const [eminaInterpretation, setEminaInterpretation] = useState<string>("");
  const [patientName, setPatientName] = useState('');
  const { toast } = useToast();

  const form = useForm<EminaFormValues>({
    resolver: zodResolver(eminaSchema),
    defaultValues: {},
  });

  const onEminaSubmit = (data: EminaFormValues) => {
    const score = (
      eminaOptions.estadoMental.find(opt => opt.value === data.estadoMental)!.score +
      eminaOptions.movilidad.find(opt => opt.value === data.movilidad)!.score +
      eminaOptions.humedad.find(opt => opt.value === data.humedad)!.score +
      eminaOptions.nutricion.find(opt => opt.value === data.nutricion)!.score +
      eminaOptions.actividadFisica.find(opt => opt.value === data.actividadFisica)!.score
    );
    setEminaScore(score);

    if (score === 0) setEminaInterpretation("Sin Riesgo");
    else if (score >= 1 && score <= 3) setEminaInterpretation("Riesgo Bajo");
    else if (score >= 4 && score <= 7) setEminaInterpretation("Riesgo Medio");
    else if (score >= 8) setEminaInterpretation("Riesgo Alto");
    else setEminaInterpretation("Puntuación fuera de rango esperado (0-15).");
  };

  const resetCalculator = () => {
    form.reset();
    setEminaScore(null);
    setEminaInterpretation("");
    setPatientName("");
  };
  
  const generateExportContent = (formatType: 'txt' | 'csv') => {
    if (eminaScore === null) return "";
    const formValues = form.getValues();
    const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    const questionKeys = Object.keys(eminaOptions) as Array<keyof EminaFormValues>;

    if (formatType === 'csv') {
      const headers = [
        "Paciente", "Fecha", "Puntaje Total EMINA", "Interpretacion EMINA",
        ...questionKeys.map(key => `"${questionFullLabelsEmina[key].replace(/"/g, '""')}"`)
      ];
      const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
      const values = [
        patientNameCsv,
        currentDate,
        eminaScore.toString(),
        `"${eminaInterpretation.replace(/"/g, '""')}"`,
        ...questionKeys.map(key => {
          const selectedOptionValue = formValues[key];
          const selectedOption = eminaOptions[key].find(opt => opt.value === selectedOptionValue);
          return selectedOption ? `"${selectedOption.label.replace(/"/g, '""')} (${selectedOption.score} pts)"` : "No respondido";
        })
      ];
      return `${headers.join(",")}\n${values.join(",")}`;
    } else { // TXT format
      let content = `Resultado de la Escala EMINA\n`;
      if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
      content += `Fecha: ${currentDate}\n\n`;
      content += `PUNTAJE TOTAL: ${eminaScore} puntos\n`;
      content += `Interpretación: ${eminaInterpretation}\n\n`;
      content += `DETALLES DE LA EVALUACIÓN:\n`;
      questionKeys.forEach(key => {
          const selectedOptionValue = formValues[key];
          const selectedOption = eminaOptions[key].find(opt => opt.value === selectedOptionValue);
          content += `- ${questionFullLabelsEmina[key]}:\n  Respuesta: ${selectedOption ? selectedOption.label : 'No respondido'} (Puntos: ${selectedOption ? selectedOption.score : 0})\n`;
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
    link.download = `resultado_escala_emina_${new Date().toISOString().split('T')[0]}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
  };
  
  const renderRadioGroupField = (
    name: keyof EminaFormValues,
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
              {eminaOptions[name].map((option) => (
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
        <CardTitle className="flex items-center"><FileText className="mr-2 h-6 w-6 text-red-500" />Escala EMINA</CardTitle>
        <ScaleCardDescription>
          Evaluación del riesgo de desarrollar úlceras por presión (LPP).
        </ScaleCardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <Label htmlFor="patientNameEmina">Nombre del Paciente (Opcional para exportación)</Label>
          <div className="flex gap-2 items-start">
            <Input
              id="patientNameEmina"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Ingrese nombre del paciente..."
              className="flex-grow"
            />
          </div>
        </div>
        <Separator className="my-6" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEminaSubmit)} className="space-y-8">
            {renderRadioGroupField("estadoMental", questionFullLabelsEmina.estadoMental)}
            <Separator />
            {renderRadioGroupField("movilidad", questionFullLabelsEmina.movilidad)}
            <Separator />
            {renderRadioGroupField("humedad", questionFullLabelsEmina.humedad)}
            <Separator />
            {renderRadioGroupField("nutricion", questionFullLabelsEmina.nutricion)}
            <Separator />
            {renderRadioGroupField("actividadFisica", questionFullLabelsEmina.actividadFisica)}
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">Calcular Riesgo EMINA</Button>
            </div>
          </form>
        </Form>

        {eminaScore !== null && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                <h3 className="text-xl font-bold text-left flex-grow">Resultado de la Escala EMINA</h3>
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
            <p className="text-3xl font-extrabold text-center text-primary mb-2">{eminaScore} puntos</p>
            <p className="text-md font-semibold text-center text-muted-foreground">{eminaInterpretation}</p>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={18} className="mr-2 flex-shrink-0 text-blue-500"/> 
                La Escala EMINA valora el riesgo de LPP. Un puntaje mayor indica mayor riesgo. El rango es de 0 a 15.
            </p>
            <p><strong>Interpretación del Puntaje:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>0 puntos:</strong> Sin Riesgo</li>
                <li><strong>1-3 puntos:</strong> Riesgo Bajo</li>
                <li><strong>4-7 puntos:</strong> Riesgo Medio</li>
                <li><strong>≥8 puntos:</strong> Riesgo Alto</li>
            </ul>
            <p className="italic">
                Fuente: Fariñas-Alvarez C, et al. Escala EMINA: un instrumento de valoración del riesgo de desarrollar úlceras por presión en pacientes hospitalizados. Gerokomos. 2003.
                Esta escala es una herramienta de valoración y debe complementarse con el juicio clínico.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EminaScaleForm;
