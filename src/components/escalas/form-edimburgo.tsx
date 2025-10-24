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
import { Frown, Info, AlertTriangle } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';

const edimburgoQuestionSchema = z.string({ required_error: "Seleccione una opción." });
const edimburgoSchema = z.object({
  q1: edimburgoQuestionSchema, q2: edimburgoQuestionSchema, q3: edimburgoQuestionSchema, q4: edimburgoQuestionSchema, q5: edimburgoQuestionSchema,
  q6: edimburgoQuestionSchema, q7: edimburgoQuestionSchema, q8: edimburgoQuestionSchema, q9: edimburgoQuestionSchema, q10: edimburgoQuestionSchema,
});
type EdimburgoFormValues = z.infer<typeof edimburgoSchema>;

interface EdimburgoOption { value: string; label: string; score: number; }

const questions: { id: keyof EdimburgoFormValues; text: string; options: EdimburgoOption[] }[] = [
  { 
    id: 'q1', 
    text: '1. He sido capaz de reírme y ver el lado divertido de las cosas.', 
    options: [ 
      { value: '0', label: 'Tanto como siempre', score: 0 }, 
      { value: '1', label: 'No tanto ahora', score: 1 }, 
      { value: '2', label: 'Definitivamente no tanto ahora', score: 2 }, 
      { value: '3', label: 'No, en absoluto', score: 3 } 
    ] 
  },
  { 
    id: 'q2', 
    text: '2. He disfrutado mirando hacia adelante.', 
    options: [ 
      { value: '0', label: 'Tanto como siempre', score: 0 }, 
      { value: '1', label: 'Bastante menos que antes', score: 1 }, 
      { value: '2', label: 'Definitivamente menos que antes', score: 2 }, 
      { value: '3', label: 'Casi nada', score: 3 } 
    ] 
  },
  { 
    id: 'q3', 
    text: '3. Me he culpado innecesariamente cuando las cosas iban mal.', 
    options: [ 
      { value: '3', label: 'Sí, la mayor parte del tiempo', score: 3 }, 
      { value: '2', label: 'Sí, a veces', score: 2 }, 
      { value: '1', label: 'No muy a menudo', score: 1 }, 
      { value: '0', label: 'No, nunca', score: 0 } 
    ] 
  },
  { 
    id: 'q4', 
    text: '4. He estado ansiosa o preocupada sin motivo.', 
    options: [ 
      { value: '0', label: 'No, en absoluto', score: 0 }, 
      { value: '1', label: 'Casi nada', score: 1 }, 
      { value: '2', label: 'Sí, a veces', score: 2 }, 
      { value: '3', label: 'Sí, muy a menudo', score: 3 } 
    ] 
  },
  { 
    id: 'q5', 
    text: '5. He sentido miedo o pánico sin motivo alguno.', 
    options: [ 
      { value: '3', label: 'Sí, bastante a menudo', score: 3 }, 
      { value: '2', label: 'Sí, a veces', score: 2 }, 
      { value: '1', label: 'No, no mucho', score: 1 }, 
      { value: '0', label: 'No, nunca', score: 0 } 
    ] 
  },
  { 
    id: 'q6', 
    text: '6. Las cosas me han agobiado o sobrepasado.', 
    options: [ 
      { value: '3', label: 'Sí, la mayor parte del tiempo no he podido afrontar las cosas', score: 3 }, 
      { value: '2', label: 'Sí, a veces no he podido afrontar las cosas como de costumbre', score: 2 }, 
      { value: '1', label: 'No, la mayor parte del tiempo las he afrontado bastante bien', score: 1 }, 
      { value: '0', label: 'No, he afrontado las cosas tan bien como siempre', score: 0 } 
    ] 
  },
  { 
    id: 'q7', 
    text: '7. Me he sentido tan infeliz que he tenido dificultades para dormir.', 
    options: [ 
      { value: '3', label: 'Sí, la mayor parte del tiempo', score: 3 }, 
      { value: '2', label: 'Sí, a veces', score: 2 }, 
      { value: '1', label: 'No muy a menudo', score: 1 }, 
      { value: '0', label: 'No, en absoluto', score: 0 } 
    ] 
  },
  { 
    id: 'q8', 
    text: '8. Me he sentido triste o desgraciada.', 
    options: [ 
      { value: '3', label: 'Sí, la mayor parte del tiempo', score: 3 }, 
      { value: '2', label: 'Sí, bastante a menudo', score: 2 }, 
      { value: '1', label: 'No muy a menudo', score: 1 }, 
      { value: '0', label: 'No, en absoluto', score: 0 } 
    ] 
  },
  { 
    id: 'q9', 
    text: '9. Me he sentido tan infeliz que he estado llorando.', 
    options: [ 
      { value: '3', label: 'Sí, la mayor parte del tiempo', score: 3 }, 
      { value: '2', label: 'Sí, bastante a menudo', score: 2 }, 
      { value: '1', label: 'Solo de vez en cuando', score: 1 }, 
      { value: '0', label: 'No, nunca', score: 0 } 
    ] 
  },
  { 
    id: 'q10', 
    text: '10. Se me ha ocurrido la idea de hacerme daño.', 
    options: [ 
      { value: '3', label: 'Sí, bastante a menudo', score: 3 }, 
      { value: '2', label: 'A veces', score: 2 }, 
      { value: '1', label: 'Casi nunca', score: 1 }, 
      { value: '0', label: 'Nunca', score: 0 } 
    ] 
  },
];

const scoringRules = {
    q1: (val: string) => parseInt(val),
    q2: (val: string) => parseInt(val),
    q3: (val: string) => 3 - parseInt(val),
    q4: (val: string) => parseInt(val),
    q5: (val: string) => 3 - parseInt(val),
    q6: (val: string) => 3 - parseInt(val),
    q7: (val: string) => 3 - parseInt(val),
    q8: (val: string) => 3 - parseInt(val),
    q9: (val: string) => 3 - parseInt(val),
    q10: (val: string) => 3 - parseInt(val),
};

const EdimburgoScaleForm: React.FC = () => {
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const [interpretation, setInterpretation] = useState<string>("");
    const [q10Positive, setQ10Positive] = useState<boolean>(false);
    const [patientName, setPatientName] = useState('');

    const form = useForm<EdimburgoFormValues>({
        resolver: zodResolver(edimburgoSchema),
        defaultValues: {},
    });

    const onSubmit = (data: EdimburgoFormValues) => {
        // Calcular puntaje usando los valores directamente ya que están configurados correctamente
        let score = 0;
        (Object.keys(data) as Array<keyof EdimburgoFormValues>).forEach(key => {
            score += parseInt(data[key]);
        });
        
        setTotalScore(score);

        const isQ10Positive = parseInt(data.q10) > 0;
        setQ10Positive(isQ10Positive);

        if (score >= 13) setInterpretation("Probable Depresión Postparto.");
        else if (score >= 10) setInterpretation("Posible Depresión Postparto.");
        else setInterpretation("Poco probable Depresión Postparto.");
    };

    const resetCalculator = () => {
        form.reset();
        setTotalScore(null);
        setInterpretation("");
        setQ10Positive(false);
        setPatientName("");
    };

    const renderRadioGroupField = (question: typeof questions[0]) => (
        <FormField
            control={form.control} name={question.id}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel className="text-base font-semibold">{question.text}</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-1">
                            {question.options.map((option) => (
                                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0 p-2 hover:bg-muted/50 rounded-md">
                                    <FormControl><RadioGroupItem value={option.value} /></FormControl>
                                    <FormLabel className="font-normal flex-1 cursor-pointer">{option.label}</FormLabel>
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
                <CardTitle className="flex items-center"><Frown className="mr-2 h-6 w-6 text-pink-500" />Escala de Depresión Postparto de Edimburgo (EPDS)</CardTitle>
                <ScaleCardDescription>
                    Herramienta de cribado para detectar síntomas de depresión en el período postnatal. Conteste según cómo se ha sentido durante los últimos 7 días.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label htmlFor="patientNameEdimburgo">Nombre de la Madre (Opcional)</Label>
                    <Input id="patientNameEdimburgo" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Ingrese nombre..." />
                </div>
                <Separator className="my-6" />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {questions.map((q, index) => <React.Fragment key={q.id}>{renderRadioGroupField(q)}{index < questions.length - 1 && <Separator />}</React.Fragment>)}
                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">Limpiar</Button>
                            <Button type="submit" className="w-full sm:w-auto">Calcular Puntaje EPDS</Button>
                        </div>
                    </form>
                </Form>
                {totalScore !== null && (
                    <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                        <h3 className="text-lg font-semibold text-center mb-2">Resultado de la Escala EPDS</h3>
                        <p className="text-2xl font-bold text-center text-primary mb-2">{totalScore} / 30 puntos</p>
                        <p className="text-sm text-center text-muted-foreground mt-1">{interpretation}</p>
                        {q10Positive && (
                            <div className="mt-4 p-3 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                                <p className="font-bold flex items-center"><AlertTriangle className="mr-2 h-5 w-5"/> ¡Alerta de Riesgo!</p>
                                <p className="text-sm">La respuesta a la pregunta 10 sobre hacerse daño es positiva. Esto requiere una evaluación clínica inmediata e indagar sobre ideación suicida, independientemente del puntaje total.</p>
                            </div>
                        )}
                    </div>
                )}
                <Separator className="my-6" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p><strong>Puntos de corte (MINSAL):</strong></p>
                    <ul className="list-disc list-inside pl-4">
                        <li><strong>0-9 puntos:</strong> Poco probable Depresión Postparto.</li>
                        <li><strong>10-12 puntos:</strong> Posible Depresión Postparto.</li>
                        <li><strong>≥ 13 puntos:</strong> Probable Depresión Postparto.</li>
                    </ul>
                    <p className="italic">Fuente: J. L. Cox, J. M. Holden, R. Sagovsky (1987). Detection of postnatal depression. Development of the 10-item Edinburgh Postnatal Depression Scale. Puntos de corte según Norma Técnica MINSAL Chile.</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default EdimburgoScaleForm;
