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
import { Activity, Info, ClipboardCheck, Download, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const bergSchema = z.object({
  sitToStand: z.string({ required_error: "Seleccione una opción." }),
  standingUnsupported: z.string({ required_error: "Seleccione una opción." }),
  sittingUnsupported: z.string({ required_error: "Seleccione una opción." }),
  standingToSitting: z.string({ required_error: "Seleccione una opción." }),
  transfers: z.string({ required_error: "Seleccione una opción." }),
  standingEyesClosed: z.string({ required_error: "Seleccione una opción." }),
  standingFeetTogether: z.string({ required_error: "Seleccione una opción." }),
  reachingForward: z.string({ required_error: "Seleccione una opción." }),
  pickupObject: z.string({ required_error: "Seleccione una opción." }),
  turnToLookBehind: z.string({ required_error: "Seleccione una opción." }),
  turn360: z.string({ required_error: "Seleccione una opción." }),
  alternateFootOnStep: z.string({ required_error: "Seleccione una opción." }),
  standingOneFootInFront: z.string({ required_error: "Seleccione una opción." }),
  standingOnOneLeg: z.string({ required_error: "Seleccione una opción." }),
});

type BergFormValues = z.infer<typeof bergSchema>;

interface BergOption {
  value: string;
  label: string;
  score: number;
}

const bergOptions: Record<keyof BergFormValues, BergOption[]> = {
  sitToStand: [
    { value: "0", label: "0. Necesita ayuda moderada o máxima para levantarse.", score: 0 },
    { value: "1", label: "1. Necesita ayuda mínima para levantarse o estabilizarse.", score: 1 },
    { value: "2", label: "2. Capaz de levantarse usando las manos después de varios intentos.", score: 2 },
    { value: "3", label: "3. Capaz de levantarse independientemente usando las manos.", score: 3 },
    { value: "4", label: "4. Capaz de levantarse sin usar las manos y estabilizarse independientemente.", score: 4 },
  ],
  standingUnsupported: [ // Durante 2 minutos
    { value: "0", label: "0. Incapaz de mantenerse de pie 30 segundos sin apoyo.", score: 0 },
    { value: "1", label: "1. Capaz de mantenerse de pie 30 segundos sin apoyo.", score: 1 },
    { value: "2", label: "2. Capaz de mantenerse de pie 1 minuto sin apoyo.", score: 2 },
    { value: "3", label: "3. Capaz de mantenerse de pie 2 minutos sin apoyo, con supervisión.", score: 3 },
    { value: "4", label: "4. Capaz de mantenerse de pie 2 minutos sin apoyo de forma segura.", score: 4 },
  ],
  sittingUnsupported: [ // Con pies en el suelo, durante 2 minutos
    { value: "0", label: "0. Necesita ayuda para mantenerse sentado.", score: 0 },
    { value: "1", label: "1. Capaz de mantenerse sentado con apoyo de la espalda o brazos.", score: 1 },
    { value: "2", label: "2. Capaz de mantenerse sentado 30 segundos sin apoyo.", score: 2 },
    { value: "3", label: "3. Capaz de mantenerse sentado 1 minuto sin apoyo.", score: 3 },
    { value: "4", label: "4. Capaz de mantenerse sentado 2 minutos de forma segura y sin apoyo.", score: 4 },
  ],
  standingToSitting: [
    { value: "0", label: "0. Necesita ayuda para sentarse.", score: 0 },
    { value: "1", label: "1. Se sienta con un descenso no controlado o necesita ayuda mínima.", score: 1 },
    { value: "2", label: "2. Usa la parte posterior de las piernas contra la silla para controlar el descenso.", score: 2 },
    { value: "3", label: "3. Controla el descenso usando las manos.", score: 3 },
    { value: "4", label: "4. Se sienta de forma segura con mínimo o ningún uso de las manos.", score: 4 },
  ],
  transfers: [ // De silla con brazos a silla sin brazos y viceversa
    { value: "0", label: "0. Necesita dos personas para ayudar o supervisar para estar seguro.", score: 0 },
    { value: "1", label: "1. Necesita una persona para ayudar (verbal o física).", score: 1 },
    { value: "2", label: "2. Capaz de transferirse con indicaciones verbales y/o supervisión.", score: 2 },
    { value: "3", label: "3. Capaz de transferirse de forma segura con uso de las manos.", score: 3 },
    { value: "4", label: "4. Capaz de transferirse de forma segura con mínimo o ningún uso de las manos.", score: 4 },
  ],
  standingEyesClosed: [ // Durante 10 segundos
    { value: "0", label: "0. Necesita ayuda para no caerse.", score: 0 },
    { value: "1", label: "1. Necesita supervisión verbal o física, o se tambalea significativamente.", score: 1 },
    { value: "2", label: "2. Capaz de mantenerse de pie 3 segundos.", score: 2 },
    { value: "3", label: "3. Capaz de mantenerse de pie 10 segundos con supervisión.", score: 3 },
    { value: "4", label: "4. Capaz de mantenerse de pie 10 segundos de forma segura.", score: 4 },
  ],
  standingFeetTogether: [ // Sin apoyo, durante 1 minuto
    { value: "0", label: "0. Incapaz de colocar los pies juntos sin ayuda o de mantenerse 15 seg.", score: 0 },
    { value: "1", label: "1. Capaz de colocar los pies juntos independientemente y mantenerse 15 seg.", score: 1 },
    { value: "2", label: "2. Capaz de colocar los pies juntos independientemente y mantenerse 30 seg.", score: 2 },
    { value: "3", label: "3. Capaz de colocar los pies juntos independientemente y mantenerse 1 min con supervisión.", score: 3 },
    { value: "4", label: "4. Capaz de colocar los pies juntos independientemente y mantenerse 1 min de forma segura.", score: 4 },
  ],
  reachingForward: [ // Con brazo extendido, mientras está de pie
    { value: "0", label: "0. Necesita ayuda para evitar caerse o no puede alcanzar.", score: 0 },
    { value: "1", label: "1. Alcanza <5 cm (2 pulgadas) o necesita supervisión.", score: 1 },
    { value: "2", label: "2. Alcanza 5-12 cm (2-5 pulgadas).", score: 2 },
    { value: "3", label: "3. Alcanza >12 cm (5 pulgadas) pero con algo de inestabilidad.", score: 3 },
    { value: "4", label: "4. Alcanza >25 cm (10 pulgadas) de forma segura.", score: 4 }, 
  ],
  pickupObject: [ // Desde el suelo
    { value: "0", label: "0. Incapaz de intentarlo o necesita ayuda para no perder el equilibrio.", score: 0 },
    { value: "1", label: "1. Capaz de recogerlo pero necesita supervisión.", score: 1 },
    { value: "2", label: "2. Capaz de recogerlo pero con dificultad o inestabilidad.", score: 2 },
    { value: "3", label: "3. Capaz de recogerlo, pero necesita usar las manos para apoyarse o con algo de inestabilidad.", score: 3 },
    { value: "4", label: "4. Capaz de recogerlo de forma fácil y segura.", score: 4 },
  ],
  turnToLookBehind: [ // Sobre hombros izquierdo y derecho
    { value: "0", label: "0. Necesita ayuda para no perder el equilibrio.", score: 0 },
    { value: "1", label: "1. Solo mira hacia un lado o necesita supervisión.", score: 1 },
    { value: "2", label: "2. Gira la cabeza hacia ambos lados, pero muestra inestabilidad.", score: 2 },
    { value: "3", label: "3. Gira hacia ambos lados, pero el peso se desplaza más hacia un lado.", score: 3 },
    { value: "4", label: "4. Gira hacia ambos lados de forma segura y con buen equilibrio.", score: 4 },
  ],
  turn360: [
    { value: "0", label: "0. Inestable (se tambalea, se agarra) Y/O Pasos discontinuos.", score: 0 },
    { value: "1", label: "1. Estable pero con pasos discontinuos, O Inestable pero con pasos continuos.", score: 1 },
    { value: "2", label: "2. Estable Y Pasos continuos.", score: 2 },
  ],
  alternateFootOnStep: [ // 8 pasos en 20 segundos
    { value: "0", label: "0. Incapaz de intentarlo o necesita ayuda para no caerse.", score: 0 },
    { value: "1", label: "1. Capaz de completar <4 pasos o necesita supervisión significativa.", score: 1 },
    { value: "2", label: "2. Capaz de completar 4 pasos sin ayuda pero con inestabilidad.", score: 2 },
    { value: "3", label: "3. Capaz de completar 8 pasos en >20 segundos.", score: 3 },
    { value: "4", label: "4. Capaz de completar 8 pasos en 20 segundos de forma segura.", score: 4 },
  ],
  standingOneFootInFront: [ // Tandem, por 30 segundos
    { value: "0", label: "0. Incapaz de colocar el pie en tándem o de mantenerse 3 seg.", score: 0 },
    { value: "1", label: "1. Capaz de colocar el pie delante independientemente y mantenerse 3 seg.", score: 1 },
    { value: "2", label: "2. Capaz de mantenerse en tándem durante 10 segundos.", score: 2 },
    { value: "3", label: "3. Capaz de mantenerse en tándem durante 30 segundos con supervisión o leve inestabilidad.", score: 3 },
    { value: "4", label: "4. Capaz de mantenerse en tándem durante 30 segundos de forma segura.", score: 4 },
  ],
  standingOnOneLeg: [ // Durante 10 segundos
    { value: "0", label: "0. Incapaz de intentarlo o de mantenerse 3 seg.", score: 0 },
    { value: "1", label: "1. Capaz de levantarlo independientemente y mantenerse 3 seg.", score: 1 },
    { value: "2", label: "2. Capaz de mantenerse sobre una pierna durante 5 segundos.", score: 2 },
    { value: "3", label: "3. Capaz de mantenerse sobre una pierna durante 10 segundos con supervisión o leve inestabilidad.", score: 3 },
    { value: "4", label: "4. Capaz de mantenerse sobre una pierna durante 10 segundos de forma segura.", score: 4 },
  ],
};

const questionFullLabelsBerg: Record<keyof BergFormValues, string> = {
  sitToStand: "1. Sentarse a Pararse",
  standingUnsupported: "2. Pararse sin Apoyo",
  sittingUnsupported: "3. Sentarse sin Apoyo de Espalda",
  standingToSitting: "4. Pararse a Sentarse",
  transfers: "5. Transferencias",
  standingEyesClosed: "6. Pararse sin Apoyo con Ojos Cerrados",
  standingFeetTogether: "7. Pararse sin Apoyo con Pies Juntos",
  reachingForward: "8. Alcanzar Hacia Adelante con Brazo Extendido",
  pickupObject: "9. Recoger un Objeto del Suelo",
  turnToLookBehind: "10. Girar para Mirar Hacia Atrás",
  turn360: "11. Girar 360 Grados",
  alternateFootOnStep: "12. Colocar Alternativamente los Pies en un Escalón",
  standingOneFootInFront: "13. Pararse sin Apoyo con un Pie Delante del Otro",
  standingOnOneLeg: "14. Pararse sobre una Pierna",
};

const BergBalanceScaleForm: React.FC = () => {
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const [interpretation, setInterpretation] = useState<string>("");
    const [patientName, setPatientName] = useState('');
    const { toast } = useToast();

    const form = useForm<BergFormValues>({
        resolver: zodResolver(bergSchema),
        defaultValues: {},
    });

    const onSubmit = (data: BergFormValues) => {
        let calculatedScore = 0;
        (Object.keys(data) as Array<keyof BergFormValues>).forEach(key => {
            calculatedScore += bergOptions[key].find(opt => opt.value === data[key])?.score || 0;
        });
        setTotalScore(calculatedScore);

        if (calculatedScore < 19) setInterpretation("Alto Riesgo de Caídas (Puntuación < 19)");
        else if (calculatedScore >= 19 && calculatedScore <= 24) setInterpretation("Riesgo Moderado de Caídas (Puntuación 19-24)");
        else if (calculatedScore > 24) setInterpretation("Bajo Riesgo de Caídas (Puntuación > 24)");
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
        const questionKeys = Object.keys(bergOptions) as Array<keyof BergFormValues>;

        if (formatType === 'csv') {
          const headers = [
            "Paciente", "Fecha", "Puntaje Total Berg", "Interpretacion Berg",
            ...questionKeys.map(key => `"${questionFullLabelsBerg[key].replace(/"/g, '""')}"`)
          ];
          const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
          const values = [
            patientNameCsv,
            currentDate,
            totalScore.toString(),
            `"${interpretation.replace(/"/g, '""')}"`,
            ...questionKeys.map(key => {
              const selectedOptionValue = formValues[key];
              const selectedOption = bergOptions[key].find(opt => opt.value === selectedOptionValue);
              return selectedOption ? `"${selectedOption.label.replace(/"/g, '""')} (${selectedOption.score} pts)"` : "No respondido";
            })
          ];
          return `${headers.join(",")}\n${values.join(",")}`;
        } else { // TXT format
          let content = `Resultado de la Escala de Equilibrio de Berg\n`;
          if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
          content += `Fecha: ${currentDate}\n\n`;
          content += `PUNTAJE TOTAL: ${totalScore} / 56 puntos\n`;
          content += `Interpretación: ${interpretation}\n\n`;
          content += `DETALLES DE LA EVALUACIÓN:\n`;
          questionKeys.forEach(key => {
              const selectedOptionValue = formValues[key];
              const selectedOption = bergOptions[key].find(opt => opt.value === selectedOptionValue);
              content += `- ${questionFullLabelsBerg[key]}:\n  Respuesta: ${selectedOption ? selectedOption.label : 'No respondido'} (Puntos: ${selectedOption ? selectedOption.score : 0})\n`;
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
        link.download = `resultado_escala_berg_${new Date().toISOString().split('T')[0]}${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
    };

    const renderRadioGroupField = (
        name: keyof BergFormValues,
        label: string,
        description?: string
    ) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="text-base font-semibold">{label}</FormLabel>
                    {description && <FormDescription className="text-xs">{description}</FormDescription>}
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                        >
                            {bergOptions[name].map((option) => (
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
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center"><Activity className="mr-2 h-6 w-6 text-orange-500" />Escala de Equilibrio de Berg</CardTitle>
                <ScaleCardDescription>
                    Evaluación del equilibrio funcional en adultos mayores. Consta de 14 ítems, puntuación máxima: 56.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label htmlFor="patientNameBerg">Nombre del Paciente (Opcional para exportación)</Label>
                    <Input
                      id="patientNameBerg"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Ingrese nombre del paciente..."
                    />
                </div>
                <Separator className="my-6" />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {renderRadioGroupField("sitToStand", questionFullLabelsBerg.sitToStand, "Instrucción: Cruce los brazos sobre el pecho. Cuando diga 'adelante', levántese y quédese de pie. Intente no usar los brazos.")}
                        <Separator className="my-4"/>
                        {renderRadioGroupField("standingUnsupported", questionFullLabelsBerg.standingUnsupported, "Durante 2 minutos")}
                        <Separator className="my-4"/>
                        {renderRadioGroupField("sittingUnsupported", questionFullLabelsBerg.sittingUnsupported, "Pies en el suelo o en un taburete, durante 2 minutos.")}
                        <Separator className="my-4"/>
                        {renderRadioGroupField("standingToSitting", questionFullLabelsBerg.standingToSitting)}
                        <Separator className="my-4"/>
                        {renderRadioGroupField("transfers", questionFullLabelsBerg.transfers, "Ej: Silla con brazos a silla sin brazos y viceversa.")}
                        <Separator className="my-4"/>
                        {renderRadioGroupField("standingEyesClosed", questionFullLabelsBerg.standingEyesClosed, "Durante 10 segundos")}
                        <Separator className="my-4"/>
                        {renderRadioGroupField("standingFeetTogether", questionFullLabelsBerg.standingFeetTogether, "Sin apoyo, durante 1 minuto")}
                        <Separator className="my-4"/>
                        {renderRadioGroupField("reachingForward", questionFullLabelsBerg.reachingForward, "Con brazo extendido, manteniendo el equilibrio de pie.")}
                        <Separator className="my-4"/>
                        {renderRadioGroupField("pickupObject", questionFullLabelsBerg.pickupObject, "Desde la posición de pie.")}
                        <Separator className="my-4"/>
                        {renderRadioGroupField("turnToLookBehind", questionFullLabelsBerg.turnToLookBehind, "Por encima de los hombros izquierdo y derecho, estando de pie.")}
                        <Separator className="my-4"/>
                        {renderRadioGroupField("turn360", questionFullLabelsBerg.turn360)}
                        <Separator className="my-4"/>
                        {renderRadioGroupField("alternateFootOnStep", questionFullLabelsBerg.alternateFootOnStep, "8 pasos en 20 segundos, estando de pie sin apoyo.")}
                        <Separator className="my-4"/>
                        {renderRadioGroupField("standingOneFootInFront", questionFullLabelsBerg.standingOneFootInFront, "Tándem, por 30 segundos")}
                        <Separator className="my-4"/>
                        {renderRadioGroupField("standingOnOneLeg", questionFullLabelsBerg.standingOnOneLeg, "Durante 10 segundos")}

                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                                Limpiar
                            </Button>
                            <Button type="submit" className="w-full sm:w-auto">Calcular Puntaje Berg</Button>
                        </div>
                    </form>
                </Form>

                {totalScore !== null && (
                    <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                            <h3 className="text-xl font-bold text-left flex-grow">
                                <ClipboardCheck className="inline mr-2 h-5 w-5 text-primary"/>Resultado Escala de Berg
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
                        <p className="text-3xl font-extrabold text-center text-primary mb-2">{totalScore} / 56 puntos</p>
                        <p className="text-md font-semibold text-center text-muted-foreground">{interpretation}</p>
                    </div>
                )}
                <Separator className="my-8" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                        La Escala de Equilibrio de Berg es una herramienta clínica utilizada para evaluar el equilibrio estático y dinámico. Un puntaje más bajo indica mayor riesgo de caídas.
                    </p>
                    <p><strong>Interpretación General del Puntaje Total (Máx. 56 puntos):</strong></p>
                    <ul className="list-disc list-inside pl-4 space-y-1">
                        <li><strong>0 - 20 puntos:</strong> Alto riesgo de caídas.</li>
                        <li><strong>21 - 40 puntos:</strong> Riesgo medio de caídas.</li>
                        <li><strong>41 - 56 puntos:</strong> Bajo riesgo de caídas.</li>
                    </ul>
                    <p className="italic">
                        Estos rangos son orientativos. Las intervenciones deben ser individualizadas y basadas en el contexto clínico completo del paciente.
                    </p>
                </div>
              </CardContent>
        </Card>
    );
};

export default BergBalanceScaleForm;
