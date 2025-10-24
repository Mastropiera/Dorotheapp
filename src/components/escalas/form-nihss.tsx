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
import { Brain, Info, Download, ChevronDown, Mic, MicOff, AlertTriangle, ClipboardEdit } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const nihssSchema = z.object({
  loc: z.string({ required_error: "Seleccione una opción." }),
  locQuestions: z.string({ required_error: "Seleccione una opción." }),
  locCommands: z.string({ required_error: "Seleccione una opción." }),
  bestGaze: z.string({ required_error: "Seleccione una opción." }),
  visualFields: z.string({ required_error: "Seleccione una opción." }),
  facialPalsy: z.string({ required_error: "Seleccione una opción." }),
  motorArmLeft: z.string({ required_error: "Seleccione una opción." }),
  motorArmRight: z.string({ required_error: "Seleccione una opción." }),
  motorLegLeft: z.string({ required_error: "Seleccione una opción." }),
  motorLegRight: z.string({ required_error: "Seleccione una opción." }),
  limbAtaxia: z.string({ required_error: "Seleccione una opción." }),
  sensory: z.string({ required_error: "Seleccione una opción." }),
  bestLanguage: z.string({ required_error: "Seleccione una opción." }),
  dysarthria: z.string({ required_error: "Seleccione una opción." }),
  extinctionInattention: z.string({ required_error: "Seleccione una opción." }),
});

type NIHSSFormValues = z.infer<typeof nihssSchema>;

interface NIHSSOption { value: string; label: string; score: number; }
type NIHSSQuestionKey = keyof NIHSSFormValues;

const nihssOptions: Record<NIHSSQuestionKey, NIHSSOption[]> = {
  loc: [ { value: "0", label: "0 - Alerta y responde vivamente.", score: 0 }, { value: "1", label: "1 - No alerta, pero se puede despertar con estímulos verbales menores.", score: 1 }, { value: "2", label: "2 - No alerta, requiere estímulos repetidos para atender o está obnubilado y requiere estímulos potentes o dolorosos.", score: 2 }, { value: "3", label: "3 - Responde solo con reflejos motores o autonómicos o está en coma profundo.", score: 3 }, ],
  locQuestions: [ { value: "0", label: "0 - Responde ambas preguntas correctamente.", score: 0 }, { value: "1", label: "1 - Responde una pregunta correctamente.", score: 1 }, { value: "2", label: "2 - No responde ninguna pregunta correctamente o no puede hablar.", score: 2 }, ],
  locCommands: [ { value: "0", label: "0 - Realiza ambas tareas correctamente.", score: 0 }, { value: "1", label: "1 - Realiza una tarea correctamente.", score: 1 }, { value: "2", label: "2 - No realiza ninguna tarea correctamente.", score: 2 }, ],
  bestGaze: [ { value: "0", label: "0 - Normal.", score: 0 }, { value: "1", label: "1 - Parálisis parcial de la mirada; mirada anormal en una o ambas direcciones.", score: 1 }, { value: "2", label: "2 - Desviación forzada de la mirada o parálisis total que no puede ser superada.", score: 2 }, ],
  visualFields: [ { value: "0", label: "0 - Sin pérdida de visión.", score: 0 }, { value: "1", label: "1 - Hemianopsia parcial.", score: 1 }, { value: "2", label: "2 - Hemianopsia completa.", score: 2 }, { value: "3", label: "3 - Hemianopsia bilateral (ceguera cortical).", score: 3 }, ],
  facialPalsy: [ { value: "0", label: "0 - Movimientos normales.", score: 0 }, { value: "1", label: "1 - Parálisis menor (borramiento surco nasolabial, asimetría al sonreír).", score: 1 }, { value: "2", label: "2 - Parálisis parcial (parálisis total o casi total de la parte inferior de la cara).", score: 2 }, { value: "3", label: "3 - Parálisis completa de un lado de la cara (superior e inferior).", score: 3 }, ],
  motorArmLeft: [ { value: "0", label: "0 - No hay caída; mantiene la posición por 10 segundos.", score: 0 }, { value: "1", label: "1 - Caída; el brazo cae antes de 10 segundos pero no toca la cama.", score: 1 }, { value: "2", label: "2 - Algo de esfuerzo contra la gravedad; el brazo no alcanza la posición de 90/45 grados o cae a la cama.", score: 2 }, { value: "3", label: "3 - Ningún esfuerzo contra la gravedad; el brazo cae.", score: 3 }, { value: "4", label: "4 - Ningún movimiento.", score: 4 }, ],
  motorArmRight: [ { value: "0", label: "0 - No hay caída; mantiene la posición por 10 segundos.", score: 0 }, { value: "1", label: "1 - Caída; el brazo cae antes de 10 segundos pero no toca la cama.", score: 1 }, { value: "2", label: "2 - Algo de esfuerzo contra la gravedad; el brazo no alcanza la posición de 90/45 grados o cae a la cama.", score: 2 }, { value: "3", label: "3 - Ningún esfuerzo contra la gravedad; el brazo cae.", score: 3 }, { value: "4", label: "4 - Ningún movimiento.", score: 4 }, ],
  motorLegLeft: [ { value: "0", label: "0 - No hay caída; mantiene la posición por 5 segundos.", score: 0 }, { value: "1", label: "1 - Caída; la pierna cae antes de 5 segundos pero no toca la cama.", score: 1 }, { value: "2", label: "2 - Algo de esfuerzo contra la gravedad; la pierna cae a la cama en 5 segundos.", score: 2 }, { value: "3", label: "3 - Ningún esfuerzo contra la gravedad; la pierna cae inmediatamente.", score: 3 }, { value: "4", label: "4 - Ningún movimiento.", score: 4 }, ],
  motorLegRight: [ { value: "0", label: "0 - No hay caída; mantiene la posición por 5 segundos.", score: 0 }, { value: "1", label: "1 - Caída; la pierna cae antes de 5 segundos pero no toca la cama.", score: 1 }, { value: "2", label: "2 - Algo de esfuerzo contra la gravedad; la pierna cae a la cama en 5 segundos.", score: 2 }, { value: "3", label: "3 - Ningún esfuerzo contra la gravedad; la pierna cae inmediatamente.", score: 3 }, { value: "4", label: "4 - Ningún movimiento.", score: 4 }, ],
  limbAtaxia: [ { value: "0", label: "0 - Ausente, sin ataxia.", score: 0 }, { value: "1", label: "1 - Presente en una extremidad.", score: 1 }, { value: "2", label: "2 - Presente en dos o más extremidades.", score: 2 }, ],
  sensory: [ { value: "0", label: "0 - Normal, sin pérdida sensorial.", score: 0 }, { value: "1", label: "1 - Pérdida leve a moderada; siente el estímulo pero es menos intenso.", score: 1 }, { value: "2", label: "2 - Pérdida severa a total; no siente el estímulo en la cara, brazo y pierna.", score: 2 }, ],
  bestLanguage: [ { value: "0", label: "0 - Sin afasia; normal.", score: 0 }, { value: "1", label: "1 - Afasia leve a moderada; algo de pérdida de fluidez o comprensión.", score: 1 }, { value: "2", label: "2 - Afasia severa; la comunicación es fragmentaria, el examinador tiene dificultad para entender.", score: 2 }, { value: "3", label: "3 - Afasia global / mutismo; ninguna expresión o comprensión auditiva útil.", score: 3 }, ],
  dysarthria: [ { value: "0", label: "0 - Articulación normal.", score: 0 }, { value: "1", label: "1 - Leve a moderada; el paciente arrastra algunas palabras pero se le entiende.", score: 1 }, { value: "2", label: "2 - Severa; el habla es ininteligible o está mudo/anártrico.", score: 2 }, ],
  extinctionInattention: [ { value: "0", label: "0 - Sin negligencia.", score: 0 }, { value: "1", label: "1 - Inatención visual, táctil, auditiva, espacial o personal a un lado del cuerpo.", score: 1 }, { value: "2", label: "2 - Heminegligencia profunda o extinción a más de una modalidad.", score: 2 }, ],
};

const questionFullLabels: Record<NIHSSQuestionKey, string> = {
  loc: "1a. Nivel de Conciencia (LOC)",
  locQuestions: "1b. Preguntas LOC (Mes y Edad)",
  locCommands: "1c. Órdenes LOC (Abrir/Cerrar ojos/mano)",
  bestGaze: "2. Mejor Mirada Conjugada",
  visualFields: "3. Campos Visuales",
  facialPalsy: "4. Parálisis Facial",
  motorArmLeft: "5a. Fuerza Brazo Izquierdo",
  motorArmRight: "5b. Fuerza Brazo Derecho",
  motorLegLeft: "6a. Fuerza Pierna Izquierda",
  motorLegRight: "6b. Fuerza Pierna Derecha",
  limbAtaxia: "7. Ataxia de Miembros",
  sensory: "8. Sensibilidad",
  bestLanguage: "9. Mejor Lenguaje / Afasia",
  dysarthria: "10. Disartria",
  extinctionInattention: "11. Extinción e Inatención (Negligencia)",
};

const NIHSSForm: React.FC = () => {
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const [interpretation, setInterpretation] = useState<string>("");
    const { toast } = useToast();

    const form = useForm<NIHSSFormValues>({
        resolver: zodResolver(nihssSchema),
        defaultValues: {},
    });

    const onSubmit = (data: NIHSSFormValues) => {
        let score = 0;
        (Object.keys(data) as NIHSSQuestionKey[]).forEach(key => {
            score += nihssOptions[key].find(opt => opt.value === data[key])?.score ?? 0;
        });
        setTotalScore(score);

        if (score === 0) setInterpretation("Sin déficit neurológico.");
        else if (score <= 4) setInterpretation("Déficit neurológico menor.");
        else if (score <= 15) setInterpretation("Déficit neurológico moderado.");
        else if (score <= 20) setInterpretation("Déficit neurológico moderado-severo.");
        else if (score <= 42) setInterpretation("Déficit neurológico severo.");
        else setInterpretation("Puntuación fuera de rango.");
    };

    const resetCalculator = () => {
        form.reset();
        setTotalScore(null);
        setInterpretation("");
    };
    
    const renderRadioGroupField = (name: NIHSSQuestionKey, label: string, description?: string) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="text-base font-semibold">{label}</FormLabel>
                    {description && <FormDescription className="text-xs">{description}</FormDescription>}
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-1">
                            {nihssOptions[name].map(option => (
                                <FormItem key={option.value} className="flex items-start space-x-3 space-y-0 p-2 hover:bg-muted/50 rounded-md transition-colors">
                                    <FormControl><RadioGroupItem value={option.value} /></FormControl>
                                    <FormLabel className="font-normal flex-1 cursor-pointer text-sm">{option.label}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-xs"/>
                </FormItem>
            )}
        />
    );

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center"><ClipboardEdit className="mr-2 h-6 w-6 text-purple-500" />Escala NIHSS</CardTitle>
                <ScaleCardDescription>
                    National Institutes of Health Stroke Scale para la evaluación cuantitativa del déficit neurológico en un ACV.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Accordion type="multiple" className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>1. Nivel de Conciencia</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    {renderRadioGroupField("loc", questionFullLabels.loc)}
                                    <Separator/>
                                    {renderRadioGroupField("locQuestions", questionFullLabels.locQuestions, "Preguntar: ¿En qué mes estamos? ¿Qué edad tiene?")}
                                    <Separator/>
                                    {renderRadioGroupField("locCommands", questionFullLabels.locCommands, "Pedir: Abra y cierre los ojos. Cierre y abra el puño.")}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>2 a 4. Funciones Oculares y Faciales</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    {renderRadioGroupField("bestGaze", questionFullLabels.bestGaze)}
                                    <Separator/>
                                    {renderRadioGroupField("visualFields", questionFullLabels.visualFields, "Evaluar campos visuales superiores e inferiores por confrontación.")}
                                    <Separator/>
                                    {renderRadioGroupField("facialPalsy", questionFullLabels.facialPalsy, "Pedir: Muestre los dientes, levante las cejas y cierre los ojos fuertemente.")}
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="item-3">
                                <AccordionTrigger>5 y 6. Fuerza de Miembros</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      {renderRadioGroupField("motorArmRight", questionFullLabels.motorArmRight, "Mantener brazo extendido a 90° (sentado) o 45° (acostado) por 10 seg.")}
                                      {renderRadioGroupField("motorArmLeft", questionFullLabels.motorArmLeft, "Mantener brazo extendido a 90° (sentado) o 45° (acostado) por 10 seg.")}
                                    </div>
                                    <Separator/>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      {renderRadioGroupField("motorLegRight", questionFullLabels.motorLegRight, "Mantener pierna extendida a 30° (acostado) por 5 seg.")}
                                      {renderRadioGroupField("motorLegLeft", questionFullLabels.motorLegLeft, "Mantener pierna extendida a 30° (acostado) por 5 seg.")}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger>7 a 11. Función Sensorial y Lenguaje</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    {renderRadioGroupField("limbAtaxia", questionFullLabels.limbAtaxia, "Prueba dedo-nariz y talón-rodilla en ambos lados.")}
                                    <Separator/>
                                    {renderRadioGroupField("sensory", questionFullLabels.sensory, "Evaluar sensibilidad al pinchazo en cara, brazos y piernas.")}
                                    <Separator/>
                                    {renderRadioGroupField("bestLanguage", questionFullLabels.bestLanguage, "Pedir describir una lámina, nombrar objetos y leer frases.")}
                                    <Separator/>
                                    {renderRadioGroupField("dysarthria", questionFullLabels.dysarthria, "Pedir que lea una lista de palabras.")}
                                    <Separator/>
                                    {renderRadioGroupField("extinctionInattention", questionFullLabels.extinctionInattention, "Usar información de ítems previos y estímulo bilateral simultáneo.")}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">Limpiar</Button>
                            <Button type="submit" className="w-full sm:w-auto">Calcular Puntaje NIHSS</Button>
                        </div>
                    </form>
                </Form>
                 {totalScore !== null && (
                  <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                    <h3 className="text-xl font-bold text-center mb-2">Resultado de la Escala NIHSS</h3>
                    <p className="text-3xl font-extrabold text-center text-primary mb-2">{totalScore} puntos</p>
                    <p className="text-md font-semibold text-center text-muted-foreground">{interpretation}</p>
                  </div>
                )}
                <Separator className="my-8" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500" /> 
                        La escala NIHSS es una herramienta sistemática para cuantificar el déficit neurológico en pacientes con ACV. Un puntaje mayor indica mayor severidad.
                    </p>
                    <p><strong>Interpretación del Puntaje (Máx. 42 puntos):</strong></p>
                    <ul className="list-disc list-inside pl-4">
                        <li><strong>0:</strong> Sin déficit por ACV.</li>
                        <li><strong>1-4:</strong> Déficit menor.</li>
                        <li><strong>5-15:</strong> Déficit moderado.</li>
                        <li><strong>16-20:</strong> Déficit moderado-severo.</li>
                        <li><strong>21-42:</strong> Déficit severo.</li>
                    </ul>
                    <p className="italic">
                        Fuente: Brott T, et al. Measurements of acute cerebral infarction: a clinical examination scale. Stroke. 1989.
                        Esta escala debe ser administrada por personal entrenado.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default NIHSSForm;
