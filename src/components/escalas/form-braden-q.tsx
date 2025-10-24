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
import { ShieldAlert, Baby, Info, Download, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const bradenQSchema = z.object({
  mobility: z.string({ required_error: "Seleccione una opción." }),
  activity: z.string({ required_error: "Seleccione una opción." }),
  sensoryPerception: z.string({ required_error: "Seleccione una opción." }),
  moisture: z.string({ required_error: "Seleccione una opción." }),
  frictionAndShear: z.string({ required_error: "Seleccione una opción." }),
  nutrition: z.string({ required_error: "Seleccione una opción." }),
  tissuePerfusionOxygenation: z.string({ required_error: "Seleccione una opción." }),
});

type BradenQFormValues = z.infer<typeof bradenQSchema>;

interface BradenQOption {
  value: string;
  label: string;
  score: number;
}

const bradenQOptions: Record<keyof BradenQFormValues, BradenQOption[]> = {
  mobility: [
    { value: "1", label: "1. Completamente inmóvil: No realiza ni ligeros cambios de posición corporal sin ayuda.", score: 1 },
    { value: "2", label: "2. Muy limitada: Realiza ocasionalmente ligeros cambios en la posición corporal o de las extremidades, pero es incapaz de realizar cambios frecuentes o significativos por sí mismo.", score: 2 },
    { value: "3", label: "3. Ligeramente limitada: Realiza cambios frecuentes aunque ligeros en la posición corporal o de las extremidades de forma independiente.", score: 3 },
    { value: "4", label: "4. Sin limitaciones: Realiza cambios mayores y frecuentes en la posición sin ayuda.", score: 4 },
  ],
  activity: [
    { value: "1", label: "1. Encamado: Confinado a la cama.", score: 1 },
    { value: "2", label: "2. En silla/sillón: Capacidad de andar severamente limitada o inexistente. No puede soportar su propio peso y/o debe ser ayudado para pasar a la silla o sillón.", score: 2 },
    { value: "3", label: "3. Deambula ocasionalmente: Deambula ocasionalmente durante el día, pero distancias muy cortas, con o sin ayuda. Pasa la mayor parte de cada turno en la cama o silla.", score: 3 },
    { value: "4", label: "4. Deambula frecuentemente: Deambula fuera de la habitación al menos dos veces al día y dentro de la habitación al menos cada dos horas durante las horas de vigilia.", score: 4 },
  ],
  sensoryPerception: [
    { value: "1", label: "1. Completamente limitada: No responde (no gime, no se agarra, no se estremece) a estímulos dolorosos, debido a la disminución del nivel de conciencia o sedación. O capacidad limitada para sentir dolor en la mayor parte del cuerpo.", score: 1 },
    { value: "2", label: "2. Muy limitada: Responde sólo a estímulos dolorosos. No puede comunicar la incomodidad excepto mediante gemidos o agitación. O tiene algún tipo de deterioro sensorial que limita la capacidad de sentir dolor o incomodidad en más de la mitad del cuerpo.", score: 2 },
    { value: "3", label: "3. Ligeramente limitada: Responde a órdenes verbales, pero no siempre puede comunicar la incomodidad o la necesidad de que le cambien de posición. O tiene algún deterioro sensorial que limita la capacidad de sentir dolor o incomodidad en 1 ó 2 extremidades.", score: 3 },
    { value: "4", label: "4. Sin limitaciones: Responde a órdenes verbales. No tiene déficit sensorial que pueda limitar la capacidad de sentir o expresar dolor o incomodidad.", score: 4 },
  ],
  moisture: [
    { value: "1", label: "1. Constantemente húmeda: La piel se mantiene húmeda por transpiración, orina, etc. casi constantemente. Se detecta humedad cada vez que se mueve o gira al paciente.", score: 1 },
    { value: "2", label: "2. Muy húmeda: La piel está a menudo, pero no siempre, húmeda. La ropa de cama debe cambiarse al menos una vez por turno.", score: 2 },
    { value: "3", label: "3. Ocasionalmente húmeda: La piel está ocasionalmente húmeda, requiriendo un cambio de sábanas extra aproximadamente una vez al día.", score: 3 },
    { value: "4", label: "4. Raramente húmeda: La piel suele estar seca, la ropa de cama sólo requiere ser cambiada en los intervalos de rutina.", score: 4 },
  ],
  frictionAndShear: [
    { value: "1", label: "1. Problema: Requiere ayuda de moderada a máxima para moverse. Es imposible levantarlo completamente sin que se deslice contra las sábanas. Se desliza frecuentemente en la cama o silla, requiriendo reposicionamientos frecuentes con máxima ayuda. La espasticidad, contracturas o agitación conllevan una fricción casi constante.", score: 1 },
    { value: "2", label: "2. Problema potencial: Se mueve débilmente o requiere mínima ayuda. Durante un movimiento, la piel probablemente roza algo contra las sábanas, silla, restricciones u otros dispositivos. Mantiene una posición relativamente buena en la silla o cama la mayor parte del tiempo, pero ocasionalmente se desliza hacia abajo.", score: 2 },
    { value: "3", label: "3. Sin problema aparente: Se mueve en la cama y en la silla independientemente y tiene suficiente fuerza muscular para levantarse completamente durante un movimiento. Mantiene una buena posición en la cama o en la silla en todo momento.", score: 3 },
  ],
  nutrition: [
    { value: "1", label: "1. Muy pobre: Nunca ingiere una comida completa. Raramente ingiere más de 1/3 de cualquier alimento ofrecido. Come 2 servicios o menos de proteínas (carne o productos lácteos) al día. Ingiere escasos líquidos. No toma un suplemento dietético líquido. O está en ayunas y/o en dieta líquida clara o soluciones intravenosas por más de 5 días.", score: 1 },
    { value: "2", label: "2. Probablemente inadecuada: Raramente come una comida completa y generalmente come sólo la mitad de cualquier alimento ofrecido. La ingesta de proteínas incluye sólo 3 servicios de carne o productos lácteos al día. Ocasionalmente tomará un suplemento dietético. O recibe menos de la cantidad óptima de una dieta líquida o por sonda de alimentación.", score: 2 },
    { value: "3", label: "3. Adecuada: Come más de la mitad de la mayoría de las comidas. Come un total de 4 o más servicios de proteínas (carne, productos lácteos) cada día. Ocasionalmente rehusará una comida, pero usualmente tomará un suplemento si se le ofrece. O está en régimen de alimentación por sonda o parenteral total que probablemente cubre la mayoría de sus necesidades nutricionales.", score: 3 },
    { value: "4", label: "4. Excelente: Come la mayor parte de cada comida, nunca rehúsa una comida. Usualmente come un total de 4 o más servicios de carne y productos lácteos. Ocasionalmente come entre comidas. No requiere suplementación.", score: 4 },
  ],
  tissuePerfusionOxygenation: [
    { value: "1", label: "1. Extremadamente comprometida: Hipotensión (PAM <50 mmHg, Presión Sistólica <80 mmHg) y/o no responde a fármacos vasoactivos.", score: 1 },
    { value: "2", label: "2. Comprometida: Presión Arterial Media (PAM) <60 mmHg o Presión Sistólica <90 mmHg; requiere fármacos vasoactivos; y/o SaO2 <90%; y/o pH <7.35.", score: 2 },
    { value: "3", label: "3. Adecuada: Presión Arterial Media (PAM) ≥60 mmHg o Presión Sistólica ≥90 mmHg; no requiere fármacos vasoactivos; y/o SaO2 ≥90%; y/o pH ≥7.35.", score: 3 },
    { value: "4", label: "4. Excelente: Presión arterial y perfusión tisular normales; SaO2 >95%; pH normal.", score: 4 },
  ],
};

const questionFullLabelsBradenQ: Record<keyof BradenQFormValues, string> = {
  mobility: "Movilidad",
  activity: "Actividad",
  sensoryPerception: "Percepción Sensorial",
  moisture: "Humedad",
  frictionAndShear: "Fricción y Cizallamiento",
  nutrition: "Nutrición",
  tissuePerfusionOxygenation: "Perfusión Tisular y Oxigenación",
};

const BradenQScaleForm: React.FC = () => {
    const [bradenQScore, setBradenQScore] = useState<number | null>(null);
    const [bradenQInterpretation, setBradenQInterpretation] = useState<string>("");
    const [patientName, setPatientName] = useState('');
    const { toast } = useToast();

    const form = useForm<BradenQFormValues>({
        resolver: zodResolver(bradenQSchema),
        defaultValues: {},
    });

    const onBradenQSubmit = (data: BradenQFormValues) => {
        const score = (
          bradenQOptions.mobility.find(opt => opt.value === data.mobility)!.score +
          bradenQOptions.activity.find(opt => opt.value === data.activity)!.score +
          bradenQOptions.sensoryPerception.find(opt => opt.value === data.sensoryPerception)!.score +
          bradenQOptions.moisture.find(opt => opt.value === data.moisture)!.score +
          bradenQOptions.frictionAndShear.find(opt => opt.value === data.frictionAndShear)!.score +
          bradenQOptions.nutrition.find(opt => opt.value === data.nutrition)!.score +
          bradenQOptions.tissuePerfusionOxygenation.find(opt => opt.value === data.tissuePerfusionOxygenation)!.score
        );
        setBradenQScore(score);

        if (score <= 16) setBradenQInterpretation("Riesgo Alto");
        else if (score >= 17 && score <= 20) setBradenQInterpretation("Riesgo Moderado");
        else if (score >= 21 && score <= 23) setBradenQInterpretation("Riesgo Bajo");
        else if (score >= 24) setBradenQInterpretation("Sin Riesgo Aparente / Riesgo Mínimo");
        else setBradenQInterpretation("Puntuación fuera de rango esperado (7-27).");
    };

    const resetCalculator = () => {
        form.reset();
        setBradenQScore(null);
        setBradenQInterpretation("");
        setPatientName("");
    };
    
    const generateExportContent = (formatType: 'txt' | 'csv') => {
        if (bradenQScore === null) return "";
        const formValues = form.getValues();
        const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
        const questionKeys = Object.keys(bradenQOptions) as Array<keyof BradenQFormValues>;

        if (formatType === 'csv') {
          const headers = [
            "Paciente", "Fecha", "Puntaje Total Braden Q", "Interpretacion Braden Q",
            ...questionKeys.map(key => `"${questionFullLabelsBradenQ[key].replace(/"/g, '""')}"`)
          ];
          const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
          const values = [
            patientNameCsv,
            currentDate,
            bradenQScore.toString(),
            `"${bradenQInterpretation.replace(/"/g, '""')}"`,
            ...questionKeys.map(key => {
              const selectedOptionValue = formValues[key];
              const selectedOption = bradenQOptions[key].find(opt => opt.value === selectedOptionValue);
              return selectedOption ? `"${selectedOption.label.replace(/"/g, '""')} (${selectedOption.score} pts)"` : "No respondido";
            })
          ];
          return `${headers.join(",")}\n${values.join(",")}`;
        } else { // TXT format
          let content = `Resultado de la Escala Braden Q\n`;
          if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
          content += `Fecha: ${currentDate}\n\n`;
          content += `PUNTAJE TOTAL: ${bradenQScore} puntos\n`;
          content += `Interpretación: ${bradenQInterpretation}\n\n`;
          content += `DETALLES DE LA EVALUACIÓN:\n`;
          questionKeys.forEach(key => {
              const selectedOptionValue = formValues[key];
              const selectedOption = bradenQOptions[key].find(opt => opt.value === selectedOptionValue);
              content += `- ${questionFullLabelsBradenQ[key]}:\n  Respuesta: ${selectedOption ? selectedOption.label : 'No respondido'} (Puntos: ${selectedOption ? selectedOption.score : 0})\n`;
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
        link.download = `resultado_escala_braden_q_${new Date().toISOString().split('T')[0]}${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
    };

    const renderRadioGroupField = (
        name: keyof BradenQFormValues,
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
                            {bradenQOptions[name].map((option) => (
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
                <CardTitle className="flex items-center"><Baby className="mr-2 h-6 w-6 text-pink-500" />Escala Braden Q</CardTitle>
                <ScaleCardDescription>
                    Para predecir el riesgo de úlceras por presión (LPP) en pacientes pediátricos.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label htmlFor="patientNameBradenQ">Nombre del Paciente (Opcional para exportación)</Label>
                    <Input
                      id="patientNameBradenQ"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Ingrese nombre del paciente..."
                    />
                </div>
                <Separator className="my-6" />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onBradenQSubmit)} className="space-y-8">
                        {renderRadioGroupField("mobility", questionFullLabelsBradenQ.mobility, "Capacidad de cambiar y controlar la posición del cuerpo.")}
                        <Separator />
                        {renderRadioGroupField("activity", questionFullLabelsBradenQ.activity, "Grado de actividad física.")}
                        <Separator />
                        {renderRadioGroupField("sensoryPerception", questionFullLabelsBradenQ.sensoryPerception, "Capacidad de responder de forma significativa al malestar relacionado con la presión.")}
                        <Separator />
                        {renderRadioGroupField("moisture", questionFullLabelsBradenQ.moisture, "Grado en que la piel está expuesta a la humedad.")}
                        <Separator />
                        {renderRadioGroupField("frictionAndShear", questionFullLabelsBradenQ.frictionAndShear)}
                        <Separator />
                        {renderRadioGroupField("nutrition", questionFullLabelsBradenQ.nutrition, "Patrón habitual de ingesta de alimentos.")}
                        <Separator />
                        {renderRadioGroupField("tissuePerfusionOxygenation", questionFullLabelsBradenQ.tissuePerfusionOxygenation, "Disponibilidad de oxígeno y flujo sanguíneo a los tejidos.")}
                        
                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                                Limpiar
                            </Button>
                            <Button type="submit" className="w-full sm:w-auto">Calcular Riesgo Braden Q</Button>
                        </div>
                    </form>
                </Form>

                {bradenQScore !== null && (
                    <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                         <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                            <h3 className="text-xl font-bold text-left flex-grow">Resultado de la Escala Braden Q</h3>
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
                        <p className="text-3xl font-extrabold text-center text-primary mb-2">{bradenQScore} puntos</p>
                        <p className="text-md font-semibold text-center text-muted-foreground">{bradenQInterpretation}</p>
                    </div>
                )}
                <Separator className="my-8" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p className="flex items-start"><Info size={18} className="mr-2 flex-shrink-0 text-blue-500"/> 
                        La Escala Braden Q valora el riesgo de LPP en pediatría. Un puntaje menor indica mayor riesgo. El rango es de 7 a 27.
                    </p>
                    <p><strong>Interpretación del Puntaje (Pediátrico - Ejemplo):</strong></p>
                    <ul className="list-disc list-inside pl-4 space-y-1">
                        <li><strong>≤ 16 puntos:</strong> Alto Riesgo</li>
                        <li><strong>17-20 puntos:</strong> Riesgo Moderado</li>
                        <li><strong>21-23 puntos:</strong> Riesgo Bajo</li>
                        <li><strong>24-27 puntos:</strong> Sin Riesgo Aparente / Riesgo Mínimo</li>
                    </ul>
                    <p className="italic">
                        Los puntos de corte pueden variar según la edad específica del paciente pediátrico y el protocolo institucional. Consulte guías especializadas.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default BradenQScaleForm;
