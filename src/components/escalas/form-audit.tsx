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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestTube, Info, Download, ChevronDown, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const auditQuestionSchema = z.string({ required_error: "Seleccione una opción." });

const auditSchema = z.object({
  q1_frecuencia: auditQuestionSchema,
  q2_cantidad: auditQuestionSchema,
  q3_frec_5_mas: auditQuestionSchema,
  q4_incapaz_parar: auditQuestionSchema,
  q5_no_hizo_esperaba: auditQuestionSchema,
  q6_necesito_manana: auditQuestionSchema,
  q7_sentido_culpable: auditQuestionSchema,
  q8_no_recordaba: auditQuestionSchema,
  q9_herido_usted_otro: auditQuestionSchema,
  q10_preocupado_familiar: auditQuestionSchema,
});

type AUDITFormValues = z.infer<typeof auditSchema>;

interface AUDITOption {
  value: string;
  label: string;
  score: number;
}

const auditOptions: Record<keyof AUDITFormValues, AUDITOption[]> = {
  q1_frecuencia: [
    { value: "0", label: "0. Nunca", score: 0 },
    { value: "1", label: "1. Una vez al mes o menos", score: 1 },
    { value: "2", label: "2. De 2 a 4 veces al mes", score: 2 },
    { value: "3", label: "3. De 2 a 3 veces a la semana", score: 3 },
    { value: "4", label: "4. 4 o más veces a la semana", score: 4 },
  ],
  q2_cantidad: [
    { value: "0", label: "0. 1 o 2", score: 0 },
    { value: "1", label: "1. 3 o 4", score: 1 },
    { value: "2", label: "2. 5 o 6", score: 2 },
    { value: "3", label: "3. 7 a 9", score: 3 },
    { value: "4", label: "4. 10 o más", score: 4 },
  ],
  q3_frec_5_mas: [
    { value: "0", label: "0. Nunca", score: 0 },
    { value: "1", label: "1. Menos de una vez al mes", score: 1 },
    { value: "2", label: "2. Mensualmente", score: 2 },
    { value: "3", label: "3. Semanalmente", score: 3 },
    { value: "4", label: "4. A diario o casi a diario", score: 4 },
  ],
  q4_incapaz_parar: [
    { value: "0", label: "0. Nunca", score: 0 },
    { value: "1", label: "1. Menos de una vez al mes", score: 1 },
    { value: "2", label: "2. Mensualmente", score: 2 },
    { value: "3", label: "3. Semanalmente", score: 3 },
    { value: "4", label: "4. A diario o casi a diario", score: 4 },
  ],
  q5_no_hizo_esperaba: [
    { value: "0", label: "0. Nunca", score: 0 },
    { value: "1", label: "1. Menos de una vez al mes", score: 1 },
    { value: "2", label: "2. Mensualmente", score: 2 },
    { value: "3", label: "3. Semanalmente", score: 3 },
    { value: "4", label: "4. A diario o casi a diario", score: 4 },
  ],
  q6_necesito_manana: [
    { value: "0", label: "0. Nunca", score: 0 },
    { value: "1", label: "1. Menos de una vez al mes", score: 1 },
    { value: "2", label: "2. Mensualmente", score: 2 },
    { value: "3", label: "3. Semanalmente", score: 3 },
    { value: "4", label: "4. A diario o casi a diario", score: 4 },
  ],
  q7_sentido_culpable: [
    { value: "0", label: "0. Nunca", score: 0 },
    { value: "1", label: "1. Menos de una vez al mes", score: 1 },
    { value: "2", label: "2. Mensualmente", score: 2 },
    { value: "3", label: "3. Semanalmente", score: 3 },
    { value: "4", label: "4. A diario o casi a diario", score: 4 },
  ],
  q8_no_recordaba: [
    { value: "0", label: "0. Nunca", score: 0 },
    { value: "1", label: "1. Menos de una vez al mes", score: 1 },
    { value: "2", label: "2. Mensualmente", score: 2 },
    { value: "3", label: "3. Semanalmente", score: 3 },
    { value: "4", label: "4. A diario o casi a diario", score: 4 },
  ],
  q9_herido_usted_otro: [
    { value: "0", label: "0. No", score: 0 },
    { value: "2", label: "2. Sí, pero no en el último año", score: 2 },
    { value: "4", label: "4. Sí, durante el último año", score: 4 },
  ],
  q10_preocupado_familiar: [
    { value: "0", label: "0. No", score: 0 },
    { value: "2", label: "2. Sí, pero no en el último año", score: 2 },
    { value: "4", label: "4. Sí, durante el último año", score: 4 },
  ],
};

const questionFullLabelsAUDIT: Record<keyof AUDITFormValues, string> = {
    q1_frecuencia: "1. ¿Con qué frecuencia consume alguna bebida alcohólica?",
    q2_cantidad: "2. ¿Cuántos tragos o consumiciones de bebidas alcohólicas suele realizar en un día de consumo normal?",
    q3_frec_5_mas: "3. ¿Con qué frecuencia toma 5 o más tragos o consumiciones en una sola ocasión?",
    q4_incapaz_parar: "4. ¿Con qué frecuencia en el último año ha sido incapaz de parar de beber una vez que había empezado?",
    q5_no_hizo_esperaba: "5. ¿Con qué frecuencia en el último año no pudo hacer lo que se esperaba de usted porque había bebido?",
    q6_necesito_manana: "6. ¿Con qué frecuencia en el último año ha necesitado beber en ayunas para recuperarse después de haber bebido mucho el día anterior?",
    q7_sentido_culpable: "7. ¿Con qué frecuencia en el último año ha tenido remordimientos o sentimientos de culpa después de haber bebido?",
    q8_no_recordaba: "8. ¿Con qué frecuencia en el último año no ha podido recordar lo que sucedió la noche anterior porque había estado bebiendo?",
    q9_herido_usted_otro: "9. ¿Usted o alguna otra persona ha resultado herido porque usted había bebido?",
    q10_preocupado_familiar: "10. ¿Algún familiar, amigo, médico o profesional de la salud se ha preocupado por su consumo de bebidas alcohólicas o le ha sugerido que beba menos?",
};

const AUDITForm: React.FC = () => {
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const [interpretation, setInterpretation] = useState<string>("");
    const [patientName, setPatientName] = useState('');
    const { toast } = useToast();

    const form = useForm<AUDITFormValues>({
        resolver: zodResolver(auditSchema),
        defaultValues: {},
    });

    const onSubmit = (data: AUDITFormValues) => {
        const score = Object.keys(data).reduce((sum, key) => {
            const questionKey = key as keyof AUDITFormValues;
            const answer = data[questionKey];
            return sum + (auditOptions[questionKey].find(opt => opt.value === answer)?.score ?? 0);
        }, 0);
        setTotalScore(score);

        if (score >= 0 && score <= 7) setInterpretation("Zona I: Consumo de Bajo Riesgo.");
        else if (score >= 8 && score <= 15) setInterpretation("Zona II: Consumo de Riesgo.");
        else if (score >= 16 && score <= 19) setInterpretation("Zona III: Consumo Perjudicial.");
        else if (score >= 20) setInterpretation("Zona IV: Probable Dependencia.");
        else setInterpretation("Puntuación fuera de rango esperado.");
    };

    const resetCalculator = () => {
        form.reset();
        setTotalScore(null);
        setInterpretation("");
        setPatientName("");
    };
    
    const generateExportContent = (formatType: 'txt' | 'csv') => {
        if (totalScore === null) return "";
        const formValues = form.getValues();
        const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
        const questionKeys = Object.keys(auditOptions) as Array<keyof AUDITFormValues>;

        if (formatType === 'csv') {
          const headers = [
            "Paciente", "Fecha", "Puntaje Total AUDIT", "Interpretacion AUDIT",
            ...questionKeys.map(key => `"${questionFullLabelsAUDIT[key].replace(/"/g, '""')}"`)
          ];
          const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
          const values = [
            patientNameCsv,
            currentDate,
            totalScore.toString(),
            `"${interpretation.replace(/"/g, '""')}"`,
            ...questionKeys.map(key => {
              const selectedOptionValue = formValues[key];
              const selectedOption = auditOptions[key].find(opt => opt.value === selectedOptionValue);
              return selectedOption ? `"${selectedOption.label.replace(/"/g, '""')} (${selectedOption.score} pts)"` : "No respondido";
            })
          ];
          return `${headers.join(",")}\n${values.join(",")}`;
        } else { // TXT format
          let content = `Resultado del Cuestionario AUDIT\n`;
          if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
          content += `Fecha: ${currentDate}\n\n`;
          content += `PUNTAJE TOTAL: ${totalScore} / 40 puntos\n`;
          content += `Interpretación: ${interpretation}\n\n`;
          content += `DETALLES DE LA EVALUACIÓN:\n`;
          questionKeys.forEach(key => {
              const selectedOptionValue = formValues[key];
              const selectedOption = auditOptions[key].find(opt => opt.value === selectedOptionValue);
              content += `- ${questionFullLabelsAUDIT[key]}:\n  Respuesta: ${selectedOption ? selectedOption.label : 'No respondido'} (Puntos: ${selectedOption ? selectedOption.score : 0})\n`;
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
        link.download = `resultado_audit_${new Date().toISOString().split('T')[0]}${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
    };
    
    const renderRadioGroupField = (
        name: keyof AUDITFormValues,
        label: string,
        description?: string
    ) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel className="text-base font-semibold">{label}</FormLabel>
                    {description && <FormDescription className="text-xs">{description}</FormDescription>}
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                        >
                            {auditOptions[name].map((option) => (
                                <FormItem key={option.value} className="flex items-start space-x-3 space-y-0 p-2 hover:bg-muted/50 rounded-md transition-colors">
                                    <FormControl>
                                        <RadioGroupItem value={option.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal flex-1 cursor-pointer text-sm">
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
                <CardTitle className="flex items-center"><TestTube className="mr-2 h-6 w-6 text-green-500" />Cuestionario AUDIT</CardTitle>
                <ScaleCardDescription>
                    Test de Identificación de Trastornos por Consumo de Alcohol. Conteste según su consumo en el último año.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label htmlFor="patientNameAUDIT">Nombre del Paciente (Opcional para exportación)</Label>
                    <Input 
                      id="patientNameAUDIT" 
                      value={patientName} 
                      onChange={(e) => setPatientName(e.target.value)} 
                      placeholder="Ingrese el nombre del paciente..." 
                    />
                </div>
                <Separator className="my-6" />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {renderRadioGroupField("q1_frecuencia", questionFullLabelsAUDIT.q1_frecuencia)}
                        <Separator />
                        {renderRadioGroupField("q2_cantidad", questionFullLabelsAUDIT.q2_cantidad, "Un trago equivale a una copa de vino, una cerveza, o un licor destilado.")}
                        <Separator />
                        {renderRadioGroupField("q3_frec_5_mas", questionFullLabelsAUDIT.q3_frec_5_mas, "Para mujeres, la referencia suele ser 4 o más tragos.")}
                        <Separator />
                        {renderRadioGroupField("q4_incapaz_parar", questionFullLabelsAUDIT.q4_incapaz_parar)}
                        <Separator />
                        {renderRadioGroupField("q5_no_hizo_esperaba", questionFullLabelsAUDIT.q5_no_hizo_esperaba)}
                        <Separator />
                        {renderRadioGroupField("q6_necesito_manana", questionFullLabelsAUDIT.q6_necesito_manana)}
                        <Separator />
                        {renderRadioGroupField("q7_sentido_culpable", questionFullLabelsAUDIT.q7_sentido_culpable)}
                        <Separator />
                        {renderRadioGroupField("q8_no_recordaba", questionFullLabelsAUDIT.q8_no_recordaba)}
                        <Separator />
                        {renderRadioGroupField("q9_herido_usted_otro", questionFullLabelsAUDIT.q9_herido_usted_otro)}
                        <Separator />
                        {renderRadioGroupField("q10_preocupado_familiar", questionFullLabelsAUDIT.q10_preocupado_familiar)}
                        
                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Limpiar
                            </Button>
                            <Button type="submit" className="w-full sm:w-auto">Calcular Puntaje AUDIT</Button>
                        </div>
                    </form>
                </Form>

                {totalScore !== null && (
                    <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                            <h3 className="text-xl font-bold text-left flex-grow">Resultado del Cuestionario AUDIT</h3>
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
                        <p className="text-3xl font-extrabold text-center text-primary mb-2">{totalScore} / 40 puntos</p>
                        <p className="text-md font-semibold text-center text-muted-foreground">{interpretation}</p>
                    </div>
                )}
                <Separator className="my-8" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                        El AUDIT es una herramienta de cribado de 10 preguntas desarrollada por la OMS. Un puntaje más alto indica mayor riesgo.
                    </p>
                    <p><strong>Interpretación por Zonas de Riesgo (OMS):</strong></p>
                    <ul className="list-disc list-inside pl-4 space-y-1">
                        <li><strong>Zona I (0-7 puntos):</strong> Consumo de Bajo Riesgo. Se recomienda educación sobre el alcohol.</li>
                        <li><strong>Zona II (8-15 puntos):</strong> Consumo de Riesgo. Se recomienda consejo simple e intervención breve.</li>
                        <li><strong>Zona III (16-19 puntos):</strong> Consumo Perjudicial. Se recomienda consejo simple, intervención breve y monitorización continuada.</li>
                        <li><strong>Zona IV (20-40 puntos):</strong> Probable Dependencia. Requiere una evaluación diagnóstica más profunda para dependencia y derivación a tratamiento especializado.</li>
                    </ul>
                    <p className="italic">
                        Los puntos de corte y las intervenciones pueden variar según las guías locales. El AUDIT-C (preguntas 1-3) también es un cribado rápido válido (corte ≥3 para mujeres, ≥4 para hombres).
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default AUDITForm;
