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
import { Brain, Info, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const nuDescSchema = z.object({
  disorientation: z.string({ required_error: "Seleccione una opción." }),
  inappropriateBehavior: z.string({ required_error: "Seleccione una opción." }),
  inappropriateCommunication: z.string({ required_error: "Seleccione una opción." }),
  illusionsHallucinations: z.string({ required_error: "Seleccione una opción." }),
  psychomotorRetardation: z.string({ required_error: "Seleccione una opción." }),
});

type NuDESCFormValues = z.infer<typeof nuDescSchema>;

interface NuDESCOption {
  value: string;
  label: string;
  score: number;
}

const nuDescOptions: NuDESCOption[] = [
  { value: "0", label: "0 - Ausente", score: 0 },
  { value: "1", label: "1 - Presente/Leve", score: 1 },
  { value: "2", label: "2 - Presente/Severo", score: 2 },
];

const questionDetails: { id: keyof NuDESCFormValues; text: string; description: string }[] = [
  { id: "disorientation", text: "1. Desorientación", description: "Confusión o incerteza sobre tiempo, lugar o persona. No atribuible a problemas de lenguaje." },
  { id: "inappropriateBehavior", text: "2. Comportamiento Inapropiado", description: "Conductas inapropiadas para el lugar o la persona (ej. quitarse tubos, inquietud, agresividad)." },
  { id: "inappropriateCommunication", text: "3. Comunicación Inapropiada", description: "Discurso incoherente, sin sentido, confabulación, o dificultad para seguir una conversación." },
  { id: "illusionsHallucinations", text: "4. Ilusiones / Alucinaciones", description: "Ver u oír cosas que no están, distorsiones de objetos, paranoia." },
  { id: "psychomotorRetardation", text: "5. Retardo Psicomotor", description: "Disminución del movimiento, letargo, latencia de respuesta muy prolongada." },
];

const NuDESCForm: React.FC = () => {
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [interpretation, setInterpretation] = useState<{ text: string; color: string; icon: React.ReactNode } | null>(null);
  const { toast } = useToast();

  const form = useForm<NuDESCFormValues>({
    resolver: zodResolver(nuDescSchema),
    defaultValues: {},
  });

  const onSubmit = (data: NuDESCFormValues) => {
    let score = 0;
    (Object.keys(data) as Array<keyof NuDESCFormValues>).forEach(key => {
      const selectedOption = nuDescOptions.find(opt => opt.value === data[key]);
      if (selectedOption) {
        score += selectedOption.score;
      }
    });

    setTotalScore(score);

    if (score >= 2) {
      setInterpretation({
        text: "Positivo para Delirium",
        color: "text-red-600 dark:text-red-500",
        icon: <XCircle className="h-5 w-5 mr-2" />
      });
    } else if (score === 1) {
      setInterpretation({
        text: "Delirium Subsíndromal / En Riesgo",
        color: "text-yellow-600 dark:text-yellow-400",
        icon: <AlertTriangle className="h-5 w-5 mr-2" />
      });
    } else { // score === 0
      setInterpretation({
        text: "Negativo para Delirium",
        color: "text-green-600 dark:text-green-400",
        icon: <CheckCircle className="h-5 w-5 mr-2" />
      });
    }
  };

  const resetCalculator = () => {
    form.reset();
    setTotalScore(null);
    setInterpretation(null);
  };

  const renderRadioGroupField = (
    name: keyof NuDESCFormValues,
    label: string,
    description: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-base font-semibold">{label}</FormLabel>
          <FormDescription className="text-xs">{description}</FormDescription>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-1">
              {nuDescOptions.map(option => (
                <FormItem key={option.value} className="flex items-start space-x-3 space-y-0 p-2 hover:bg-muted/50 rounded-md transition-colors">
                  <FormControl><RadioGroupItem value={option.value} /></FormControl>
                  <FormLabel className="font-normal flex-1 cursor-pointer">{option.label}</FormLabel>
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><Brain className="mr-2 h-6 w-6 text-purple-500" />Nu-DESC (Nursing Delirium Screening Scale)</CardTitle>
        <ScaleCardDescription>
          Escala de Detección de Delirium por Enfermería. Evaluar la presencia y severidad de los siguientes síntomas durante el turno u observación.
        </ScaleCardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {questionDetails.map(q => (
              <React.Fragment key={q.id}>
                {renderRadioGroupField(q.id, q.text, q.description)}
                {q.id !== "psychomotorRetardation" && <Separator />}
              </React.Fragment>
            ))}
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">Calcular Puntaje Nu-DESC</Button>
            </div>
          </form>
        </Form>
        {totalScore !== null && interpretation && (
          <div className={cn("mt-8 p-6 border rounded-lg", 
             totalScore >= 2 ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700"
             : totalScore === 1 ? "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700"
             : "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700"
          )}>
            <h3 className="text-xl font-bold text-center mb-2">Resultado Nu-DESC</h3>
            <p className="text-3xl font-extrabold text-center text-primary mb-2">{totalScore} / 10 puntos</p>
            <div className={cn("text-lg font-semibold flex items-center justify-center", interpretation.color)}>
                {interpretation.icon} {interpretation.text}
            </div>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500" />
                La Nu-DESC es una herramienta de cribado para delirium. Un puntaje mayor indica mayor probabilidad de delirium.
            </p>
            <p><strong>Interpretación del Puntaje:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>Puntaje ≥ 2:</strong> Positivo para Delirium.</li>
                <li><strong>Puntaje = 1:</strong> Considerado subsíndromal. Requiere reevaluación.</li>
                <li><strong>Puntaje = 0:</strong> Negativo para Delirium.</li>
            </ul>
            <p className="italic">
               Fuente: Gaudreau, J.-D., et al. (2005). Fast, systematic, and continuous delirium assessment in hospitalized patients: the nursing delirium screening scale. Journal of Pain and Symptom Management, 29(4), 368-375.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NuDESCForm;