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

const miniBestestSchema = z.object({
  sitToStand: z.string({ required_error: "Seleccione una opción." }),
  riseToToes: z.string({ required_error: "Seleccione una opción." }),
  standOnOneLegEO: z.string({ required_error: "Seleccione una opción." }),
  stepForward: z.string({ required_error: "Seleccione una opción." }),
  stepBackward: z.string({ required_error: "Seleccione una opción." }),
  stepLateral: z.string({ required_error: "Seleccione una opción." }),
  tandemStanceEO: z.string({ required_error: "Seleccione una opción." }),
  standOnOneLegEC: z.string({ required_error: "Seleccione una opción." }),
  inclineStanceEC: z.string({ required_error: "Seleccione una opción." }),
  gaitSpeedChange: z.string({ required_error: "Seleccione una opción." }),
  walkHeadTurns: z.string({ required_error: "Seleccione una opción." }),
  pivotTurns: z.string({ required_error: "Seleccione una opción." }),
  stepOverObstacle: z.string({ required_error: "Seleccione una opción." }),
  tugDualTask: z.string({ required_error: "Seleccione una opción." }),
});

type MiniBestestFormValues = z.infer<typeof miniBestestSchema>;

interface MiniBestestOption {
  value: string;
  label: string;
  score: number;
}

const miniBestestOptions: Record<keyof MiniBestestFormValues, MiniBestestOption[]> = {
  sitToStand: [
    { value: "2", label: "2. Normal: capaz de levantarse sin usar los brazos, estable.", score: 2 },
    { value: "1", label: "1. Lento o necesita usar los brazos una vez, o algo inestable.", score: 1 },
    { value: "0", label: "0. Necesita múltiples intentos, o usa los brazos repetidamente, o incapaz sin ayuda.", score: 0 },
  ],
  riseToToes: [
    { value: "2", label: "2. Normal: se eleva sobre los dedos de los pies y mantiene por 3 segundos.", score: 2 },
    { value: "1", label: "1. Capaz, pero no mantiene 3 segundos o se eleva poco.", score: 1 },
    { value: "0", label: "0. Incapaz o necesita ayuda.", score: 0 },
  ],
  standOnOneLegEO: [ 
    { value: "2", label: "2. Mantiene >20 segundos.", score: 2 },
    { value: "1", label: "1. Mantiene 5-19 segundos.", score: 1 },
    { value: "0", label: "0. Mantiene <5 segundos o incapaz.", score: 0 },
  ],
  stepForward: [
    { value: "2", label: "2. Recupera el equilibrio con un solo paso, estable.", score: 2 },
    { value: "1", label: "1. Recupera con >1 paso, pero estable.", score: 1 },
    { value: "0", label: "0. Da pasos pero necesita ayuda, o cae.", score: 0 },
  ],
  stepBackward: [ 
    { value: "2", label: "2. Recupera el equilibrio con un solo paso, estable.", score: 2 },
    { value: "1", label: "1. Recupera con >1 paso, pero estable.", score: 1 },
    { value: "0", label: "0. Da pasos pero necesita ayuda, o cae.", score: 0 },
  ],
  stepLateral: [ 
    { value: "2", label: "2. Recupera el equilibrio con un solo paso, estable.", score: 2 },
    { value: "1", label: "1. Recupera con >1 paso, pero estable.", score: 1 },
    { value: "0", label: "0. Da pasos pero necesita ayuda, o cae.", score: 0 },
  ],
  tandemStanceEO: [ 
    { value: "2", label: "2. Mantiene 30 segundos.", score: 2 },
    { value: "1", label: "1. Mantiene 10-29 segundos o con leve inestabilidad.", score: 1 },
    { value: "0", label: "0. Mantiene <10 segundos o necesita ayuda.", score: 0 },
  ],
  standOnOneLegEC: [ 
    { value: "2", label: "2. Mantiene >10 segundos.", score: 2 },
    { value: "1", label: "1. Mantiene 3-9 segundos.", score: 1 },
    { value: "0", label: "0. Mantiene <3 segundos o incapaz.", score: 0 },
  ],
  inclineStanceEC: [ 
    { value: "2", label: "2. Estable por 30 segundos.", score: 2 },
    { value: "1", label: "1. Inestable, se mueve, pero mantiene 30 segundos.", score: 1 },
    { value: "0", label: "0. Incapaz de mantener 30 segundos o necesita ayuda.", score: 0 },
  ],
  gaitSpeedChange: [
    { value: "2", label: "2. Cambia significativamente la velocidad, sin problemas de equilibrio.", score: 2 },
    { value: "1", label: "1. Cambia la velocidad, pero con leve alteración del equilibrio o solo un cambio modesto.", score: 1 },
    { value: "0", label: "0. No puede cambiar la velocidad, o pierde el equilibrio.", score: 0 },
  ],
  walkHeadTurns: [ 
    { value: "2", label: "2. Realiza giros de cabeza sin alteración de la marcha ni equilibrio.", score: 2 },
    { value: "1", label: "1. Realiza giros de cabeza con leve disminución de velocidad o leve inestabilidad.", score: 1 },
    { value: "0", label: "0. Inestable, se detiene, o no puede realizarlo.", score: 0 },
  ],
  pivotTurns: [ 
    { value: "2", label: "2. Gira suavemente en <3-4 pasos, estable.", score: 2 },
    { value: "1", label: "1. Gira en >4 pasos, o con leve inestabilidad.", score: 1 },
    { value: "0", label: "0. Inestable, o no puede girar con seguridad.", score: 0 },
  ],
  stepOverObstacle: [ 
    { value: "2", label: "2. Pasa el obstáculo sin problemas, estable.", score: 2 },
    { value: "1", label: "1. Pasa el obstáculo pero toca levemente o con leve inestabilidad.", score: 1 },
    { value: "0", label: "0. No puede pasar el obstáculo o lo golpea significativamente, inestable.", score: 0 },
  ],
  tugDualTask: [ 
    { value: "2", label: "2. Realiza TUG con doble tarea sin cambio significativo en tiempo o seguridad comparado con TUG simple.", score: 2 },
    { value: "1", label: "1. Realiza TUG con doble tarea, pero es más lento o con leve disminución de la seguridad.", score: 1 },
    { value: "0", label: "0. No puede realizar TUG con doble tarea de forma segura, o se detiene en una de las tareas.", score: 0 },
  ],
};

const questionFullLabelsMiniBestest: Record<keyof MiniBestestFormValues, string> = {
  sitToStand: "I.1. Sentarse a Pararse",
  riseToToes: "I.2. Elevarse sobre los Dedos de los Pies",
  standOnOneLegEO: "I.3. Pararse en una Pierna (Ojos Abiertos)",
  stepForward: "II.4. Corrección con Pasos Compensatorios - Hacia Adelante",
  stepBackward: "II.5. Corrección con Pasos Compensatorios - Hacia Atrás",
  stepLateral: "II.6. Corrección con Pasos Compensatorios - Lateral",
  tandemStanceEO: "III.7. Postura Tándem (Ojos Abiertos, Superficie Firme)",
  standOnOneLegEC: "III.8. Postura Unipodal (Ojos Cerrados, Superficie Firme)",
  inclineStanceEC: "III.9. Postura en Rampa Inclinada (Ojos Cerrados)",
  gaitSpeedChange: "IV.10. Cambio de Velocidad de la Marcha",
  walkHeadTurns: "IV.11. Caminar con Giros de Cabeza (Horizontal)",
  pivotTurns: "IV.12. Giros en Pivote",
  stepOverObstacle: "IV.13. Pasar por Encima de un Obstáculo",
  tugDualTask: "IV.14. Timed Up & Go con Doble Tarea Cognitiva",
};

const MiniBestestScaleForm: React.FC = () => {
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const [interpretation, setInterpretation] = useState<string>("");
    const [patientName, setPatientName] = useState('');
    const { toast } = useToast();

    const form = useForm<MiniBestestFormValues>({
        resolver: zodResolver(miniBestestSchema),
        defaultValues: {},
    });

    const onSubmit = (data: MiniBestestFormValues) => {
        let calculatedScore = 0;
        (Object.keys(data) as Array<keyof MiniBestestFormValues>).forEach(key => {
            calculatedScore += miniBestestOptions[key].find(opt => opt.value === data[key])?.score || 0;
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
        const questionKeys = Object.keys(miniBestestOptions) as Array<keyof MiniBestestFormValues>;

        if (formatType === 'csv') {
          const headers = [
            "Paciente", "Fecha", "Puntaje Total Mini-BESTest", "Interpretacion Mini-BESTest",
            ...questionKeys.map(key => `"${questionFullLabelsMiniBestest[key].replace(/"/g, '""')}"`)
          ];
          const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
          const values = [
            patientNameCsv,
            currentDate,
            totalScore.toString(),
            `"${interpretation.replace(/"/g, '""')}"`,
            ...questionKeys.map(key => {
              const selectedOptionValue = formValues[key];
              const selectedOption = miniBestestOptions[key].find(opt => opt.value === selectedOptionValue);
              return selectedOption ? `"${selectedOption.label.replace(/"/g, '""')} (${selectedOption.score} pts)"` : "No respondido";
            })
          ];
          return `${headers.join(",")}\n${values.join(",")}`;
        } else { // TXT format
          let content = `Resultado de la Escala Mini-BESTest\n`;
          if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
          content += `Fecha: ${currentDate}\n\n`;
          content += `PUNTAJE TOTAL: ${totalScore} / 28 puntos\n`;
          content += `Interpretación: ${interpretation}\n\n`;
          content += `DETALLES DE LA EVALUACIÓN:\n`;
          questionKeys.forEach(key => {
              const selectedOptionValue = formValues[key];
              const selectedOption = miniBestestOptions[key].find(opt => opt.value === selectedOptionValue);
              content += `- ${questionFullLabelsMiniBestest[key]}:\n  Respuesta: ${selectedOption ? selectedOption.label : 'No respondido'} (Puntos: ${selectedOption ? selectedOption.score : 0})\n`;
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
        link.download = `resultado_escala_minibestest_${new Date().toISOString().split('T')[0]}${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
    };

    const renderRadioGroupField = (
        name: keyof MiniBestestFormValues,
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
                            {miniBestestOptions[name].map((option) => (
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
                <CardTitle className="flex items-center"><Activity className="mr-2 h-6 w-6 text-orange-500" />Escala Mini-BESTest</CardTitle>
                <ScaleCardDescription>
                    Evaluación abreviada de los sistemas de equilibrio. Puntuación máxima: 28 puntos.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label htmlFor="patientNameMiniBestest">Nombre del Paciente (Opcional para exportación)</Label>
                    <Input
                      id="patientNameMiniBestest"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Ingrese nombre del paciente..."
                    />
                </div>
                <Separator className="my-6" />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold text-primary mb-2">I. Control Postural Anticipatorio</h3>
                            {renderRadioGroupField("sitToStand", questionFullLabelsMiniBestest.sitToStand, "Instrucción: Cruce los brazos sobre el pecho. Cuando diga 'adelante', levántese y quédese de pie. Intente no usar los brazos.")}
                            <Separator className="my-4" />
                            {renderRadioGroupField("riseToToes", questionFullLabelsMiniBestest.riseToToes, "Instrucción: Levántese sobre los dedos de los pies lo más alto que pueda y manténgase así.")}
                            <Separator className="my-4" />
                            {renderRadioGroupField("standOnOneLegEO", questionFullLabelsMiniBestest.standOnOneLegEO, "Instrucción: (Probar pierna D y L, usar la PEOR puntuación) Manténgase en una pierna el mayor tiempo posible.")}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-primary mb-2">II. Control Postural Reactivo</h3>
                            {renderRadioGroupField("stepForward", questionFullLabelsMiniBestest.stepForward, "Instrucción: (Empujar suavemente hacia atrás en los hombros) Manténgase firme cuando lo empuje.")}
                            <Separator className="my-4" />
                            {renderRadioGroupField("stepBackward", questionFullLabelsMiniBestest.stepBackward, "Instrucción: (Tirar suavemente hacia adelante de los hombros) Manténgase firme cuando lo jale.")}
                            <Separator className="my-4" />
                            {renderRadioGroupField("stepLateral", questionFullLabelsMiniBestest.stepLateral, "Instrucción: (Empujar suavemente hacia un lado en la pelvis) Manténgase firme cuando lo empuje.")}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-primary mb-2">III. Orientación Sensorial</h3>
                            {renderRadioGroupField("tandemStanceEO", questionFullLabelsMiniBestest.tandemStanceEO, "Instrucción: Coloque un pie directamente delante del otro, talón tocando los dedos. Mantenga esta posición.")}
                             <Separator className="my-4" />
                            {renderRadioGroupField("standOnOneLegEC", questionFullLabelsMiniBestest.standOnOneLegEC, "Instrucción: (Probar pierna D y L, usar la PEOR puntuación) Cierre los ojos y manténgase en una pierna.")}
                             <Separator className="my-4" />
                            {renderRadioGroupField("inclineStanceEC", questionFullLabelsMiniBestest.inclineStanceEC, "Instrucción: Párese en la rampa con los ojos cerrados.")}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-primary mb-2">IV. Marcha Dinámica</h3>
                            {renderRadioGroupField("gaitSpeedChange", questionFullLabelsMiniBestest.gaitSpeedChange, "Instrucción: Camine a su velocidad normal, luego rápido, luego lento.")}
                            <Separator className="my-4" />
                            {renderRadioGroupField("walkHeadTurns", questionFullLabelsMiniBestest.walkHeadTurns, "Instrucción: Camine y gire la cabeza de lado a lado.")}
                            <Separator className="my-4" />
                            {renderRadioGroupField("pivotTurns", questionFullLabelsMiniBestest.pivotTurns, "Instrucción: Camine y luego gire rápidamente 180 o 360 grados.")}
                            <Separator className="my-4" />
                            {renderRadioGroupField("stepOverObstacle", questionFullLabelsMiniBestest.stepOverObstacle, "Instrucción: Camine y pase por encima de esta caja de zapatos.")}
                            <Separator className="my-4" />
                            {renderRadioGroupField("tugDualTask", questionFullLabelsMiniBestest.tugDualTask, "Instrucción: Levántese, camine 3 metros, regrese y siéntese mientras cuenta hacia atrás desde 100 de 7 en 7.")}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                          <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                            Limpiar
                          </Button>
                          <Button type="submit" className="w-full sm:w-auto">Calcular Puntaje Mini-BESTest</Button>
                        </div>
                    </form>
                </Form>

                {totalScore !== null && (
                  <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                        <h3 className="text-xl font-bold text-left flex-grow">
                            <ClipboardCheck className="inline mr-2 h-5 w-5 text-primary"/>Resultado Mini-BESTest
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
                    <p className="text-3xl font-extrabold text-center text-primary mb-2">{totalScore} / 28 puntos</p>
                    <p className="text-md font-semibold text-center text-muted-foreground">{interpretation}</p>
                  </div>
                )}
                <Separator className="my-8" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                        La Mini-BESTest es una herramienta para evaluar múltiples aspectos del equilibrio. Un puntaje más bajo indica mayor deterioro del equilibrio y mayor riesgo de caídas.
                    </p>
                    <p><strong>Interpretación General del Puntaje Total (Máx. 28 puntos):</strong></p>
                    <ul className="list-disc list-inside pl-4 space-y-1">
                        <li><strong>&lt; 19 puntos:</strong> Alto riesgo de caídas (o necesidad de evaluación adicional).</li>
                        <li><strong>19 - 24 puntos:</strong> Riesgo moderado de caídas.</li>
                        <li><strong>&gt; 24 puntos:</strong> Bajo riesgo de caídas.</li>
                    </ul>
                    <p className="italic">
                        Los puntos de corte pueden variar según la población estudiada y el contexto clínico. La escala original (Franchignoni et al., 2010) sugiere un cut-off de ≤19 para identificar caedores en pacientes con Parkinson. Consulte guías específicas para su población.
                    </p>
                </div>
              </CardContent>
        </Card>
    );
};

export default MiniBestestScaleForm;
