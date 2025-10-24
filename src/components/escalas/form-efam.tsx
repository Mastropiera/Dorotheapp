
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ScaleCardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users, Info, ClipboardCheck, Brain, AlertTriangle, Download, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';


const efamSchema = z.object({
  ayudaBanarse: z.string({ required_error: "Seleccione una opción." }),
  ayudaManejarDinero: z.string({ required_error: "Seleccione una opción." }),
  ayudaTomarMedicamentos: z.string({ required_error: "Seleccione una opción." }),
  ayudaPrepararComida: z.string({ required_error: "Seleccione una opción." }),
  ayudaTareasCasa: z.string({ required_error: "Seleccione una opción." }),
  aprendizajePalabras: z.coerce.number().min(0).max(3).optional(),
  fechaCorrecta: z.string().optional(),
  diaSemanaCorrecto: z.string().optional(),
  lugarCorrecto: z.string().optional(),
  evocacionPalabras: z.coerce.number().min(0).max(3).optional(),
});

type EfamFormValues = z.infer<typeof efamSchema>;

interface EfamOption {
  value: string;
  label: string;
  score: number;
}

const siNoOptions: EfamOption[] = [
  { value: "1", label: "Sí (Necesita ayuda / Tiene dificultad)", score: 1 },
  { value: "0", label: "No (No necesita ayuda / Sin dificultad)", score: 0 },
];

const correctoIncorrectoOptions: EfamOption[] = [
    { value: "1", label: "Correcto", score: 1 },
    { value: "0", label: "Incorrecto", score: 0 },
];

const questionFullLabelsEfam: Record<keyof EfamFormValues, string> = {
  ayudaBanarse: "1. ¿Necesita ayuda para bañarse o ducharse?",
  ayudaManejarDinero: "2. ¿Necesita ayuda para manejar su dinero?",
  ayudaTomarMedicamentos: "3. ¿Necesita ayuda para tomar sus medicamentos?",
  ayudaPrepararComida: "4. ¿Necesita ayuda para preparar su comida?",
  ayudaTareasCasa: "5. ¿Necesita ayuda para hacer las tareas del hogar?",
  aprendizajePalabras: "Parte B - 1. Aprendizaje de Palabras (0-3)",
  fechaCorrecta: "Parte B - 2. ¿En qué fecha estamos?",
  diaSemanaCorrecto: "Parte B - 3. ¿Qué día de la semana es hoy?",
  lugarCorrecto: "Parte B - 4. ¿En qué lugar estamos ahora?",
  evocacionPalabras: "Parte B - 5. Evocación de Palabras (0-3)",
};

const EFAMScaleForm: React.FC = () => {
  const [scoreParteA, setScoreParteA] = useState<number | null>(null);
  const [interpretacionParteA, setInterpretacionParteA] = useState<string>("");
  const [mostrarParteB, setMostrarParteB] = useState<boolean>(false);
  const [scoreParteB, setScoreParteB] = useState<number | null>(null);
  const [interpretacionParteB, setInterpretacionParteB] = useState<string>("");
  const [clasificacionFinal, setClasificacionFinal] = useState<string>("");
  const [riesgoFinalIcon, setRiesgoFinalIcon] = useState<React.ReactNode | null>(null);
  const [patientName, setPatientName] = useState('');
  const { toast } = useToast();

  const form = useForm<EfamFormValues>({
    resolver: zodResolver(efamSchema),
    defaultValues: {
        aprendizajePalabras: 0,
        evocacionPalabras: 0,
    },
  });

  const { watch, trigger } = form;

  const calcularClasificacionFinal = useCallback((currentScoreA: number | null, currentScoreB: number | null) => {
    if (currentScoreA === null) {
       setClasificacionFinal("");
       setRiesgoFinalIcon(null);
       return;
   }
   if (currentScoreA <= 1) {
       setClasificacionFinal("Autovalente");
       setRiesgoFinalIcon(<Users className="mr-2 h-5 w-5 text-green-600" />);
   } else { 
       if (!mostrarParteB || currentScoreB === null) { // Si Parte B es requerida pero no calculada
           setClasificacionFinal("Calcular Parte B para clasificación final.");
           setRiesgoFinalIcon(null);
       } else if (currentScoreB >= 6) {
           setClasificacionFinal("Autovalente con Riesgo");
           setRiesgoFinalIcon(<AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />);
       } else { // scoreParteB <= 5
           setClasificacionFinal("Riesgo de Dependencia");
           setRiesgoFinalIcon(<AlertTriangle className="mr-2 h-5 w-5 text-red-600" />);
       }
   }
 }, [mostrarParteB]);

  const calcularParteA = useCallback(() => {
    const values = form.getValues();
    const itemsParteA: (keyof EfamFormValues)[] = ['ayudaBanarse', 'ayudaManejarDinero', 'ayudaTomarMedicamentos', 'ayudaPrepararComida', 'ayudaTareasCasa'];
    let currentScoreA = 0;
    let allAnswered = true;

    itemsParteA.forEach(key => {
        const value = values[key];
        if (value === undefined) {
            allAnswered = false;
            return;
        }
        currentScoreA += siNoOptions.find(opt => opt.value === value)?.score ?? 0;
    });
    
    if (allAnswered && itemsParteA.every(key => values[key] !== undefined)) {
        setScoreParteA(currentScoreA);
        if (currentScoreA <= 1) {
            setInterpretacionParteA("Autovalente (Puntaje A: 0-1)");
            setMostrarParteB(false);
            setScoreParteB(null); 
            setInterpretacionParteB("");
            calcularClasificacionFinal(currentScoreA, null); 
        } else {
            setInterpretacionParteA(`Riesgo de Dependencia (Puntaje A: ${currentScoreA} >= 2). Aplicar Parte B.`);
            setMostrarParteB(true);
            calcularClasificacionFinal(currentScoreA, form.getValues('aprendizajePalabras') === undefined ? null : scoreParteB); // Recalcular clasificación con Parte B actual
        }
    } else {
        setScoreParteA(null);
        setInterpretacionParteA("");
        setMostrarParteB(false);
        setClasificacionFinal("");
        setRiesgoFinalIcon(null);
    }
  }, [form, calcularClasificacionFinal, scoreParteB]);


  useEffect(() => {
    const subscription = watch((value, { name }) => {
      const parteAFields: (keyof EfamFormValues)[] = ['ayudaBanarse', 'ayudaManejarDinero', 'ayudaTomarMedicamentos', 'ayudaPrepararComida', 'ayudaTareasCasa'];
      if (parteAFields.includes(name as keyof EfamFormValues)) {
        calcularParteA();
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, calcularParteA]);

  const onEfamSubmit = async (data: EfamFormValues) => {
    let currentScoreB = null;
    if (mostrarParteB) {
        const parteBFields: (keyof EfamFormValues)[] = ['aprendizajePalabras', 'fechaCorrecta', 'diaSemanaCorrecto', 'lugarCorrecto', 'evocacionPalabras'];
        const allParteBAnswered = parteBFields.every(field => data[field] !== undefined && data[field] !== null && data[field]!.toString().trim() !== '');

        if (!allParteBAnswered) {
            parteBFields.forEach(field => {
                if (data[field] === undefined || data[field] === null || data[field]!.toString().trim() === '') {
                    form.setError(field, { type: "manual", message: "Requerido para Parte B." });
                }
            });
            await trigger(parteBFields); 
            setInterpretacionParteB("Complete todos los campos de la Parte B.");
            setScoreParteB(null);
            calcularClasificacionFinal(scoreParteA, null);
            return; 
        }
        currentScoreB = (
            (data.aprendizajePalabras || 0) +
            (correctoIncorrectoOptions.find(opt => opt.value === data.fechaCorrecta)?.score ?? 0) +
            (correctoIncorrectoOptions.find(opt => opt.value === data.diaSemanaCorrecto)?.score ?? 0) +
            (correctoIncorrectoOptions.find(opt => opt.value === data.lugarCorrecto)?.score ?? 0) +
            (data.evocacionPalabras || 0)
        );
        setScoreParteB(currentScoreB);
        setInterpretacionParteB(currentScoreB >= 6 ? `Cognitivamente Normal (Puntaje B: ${currentScoreB} >= 6)` : `Deterioro Cognitivo Sugerido (Puntaje B: ${currentScoreB} <= 5)`);
    } else {
        setScoreParteB(null);
        setInterpretacionParteB("");
    }
    calcularClasificacionFinal(scoreParteA, currentScoreB);
  };

  const resetCalculator = () => {
    form.reset({
        aprendizajePalabras: 0,
        evocacionPalabras: 0,
    });
    setScoreParteA(null);
    setInterpretacionParteA("");
    setMostrarParteB(false);
    setScoreParteB(null);
    setInterpretacionParteB("");
    setClasificacionFinal("");
    setRiesgoFinalIcon(null);
    setPatientName("");
  };

  const generateExportContent = (formatType: 'txt' | 'csv') => {
    if (clasificacionFinal === "" || clasificacionFinal.includes("pendiente")) return "";
    const formValues = form.getValues();
    const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    const questionKeysA = Object.keys(formValues).filter(k => k.startsWith('ayuda')) as Array<keyof Pick<EfamFormValues, 'ayudaBanarse' | 'ayudaManejarDinero' | 'ayudaTomarMedicamentos' | 'ayudaPrepararComida' | 'ayudaTareasCasa'>>;
    const questionKeysB = ['aprendizajePalabras', 'fechaCorrecta', 'diaSemanaCorrecto', 'lugarCorrecto', 'evocacionPalabras'] as Array<keyof EfamFormValues>;

    let csvDataRows: string[][] = [];
    let txtDetails = "";

    questionKeysA.forEach(key => {
        const selectedOption = siNoOptions.find(opt => opt.value === formValues[key]);
        txtDetails += `- ${questionFullLabelsEfam[key]}:\n  Respuesta: ${selectedOption ? selectedOption.label : 'No respondido'} (Puntos A: ${selectedOption ? selectedOption.score : 0})\n`;
        if (formatType === 'csv') {
            csvDataRows.push([`"${questionFullLabelsEfam[key].replace(/"/g, '""')}"`, selectedOption ? `"${selectedOption.label.replace(/"/g, '""')} (${selectedOption.score} pts)"` : "No respondido"]);
        }
    });

    if (mostrarParteB && scoreParteB !== null) {
      txtDetails += "\nParte B Detalles:\n";
      questionKeysB.forEach(key => {
          let responseLabel = "";
          let responseScore = "";
          if (key === 'aprendizajePalabras' || key === 'evocacionPalabras') {
              responseLabel = `${formValues[key]} palabras`;
              responseScore = `${formValues[key]} pts`;
          } else if (key === 'fechaCorrecta' || key === 'diaSemanaCorrecto' || key === 'lugarCorrecto') {
              const selectedOption = correctoIncorrectoOptions.find(opt => opt.value === formValues[key]);
              responseLabel = selectedOption ? selectedOption.label : 'No respondido';
              responseScore = `${selectedOption ? selectedOption.score : 0} pts`;
          }
          txtDetails += `- ${questionFullLabelsEfam[key]}:\n  Respuesta: ${responseLabel} (Puntos B: ${responseScore})\n`;
          if (formatType === 'csv') {
              csvDataRows.push([`"${questionFullLabelsEfam[key].replace(/"/g, '""')}"`, `"${responseLabel.replace(/"/g, '""')} (${responseScore})"`]);
          }
      });
    }
    
    if (formatType === 'csv') {
      const csvDataRowsAsConst = csvDataRows;
      const headers = ["Variable", "Respuesta (Puntos)"];
      const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
      let csvContent = `Paciente,${patientNameCsv}\nFecha,${currentDate}\nClasificación Final EFAM,"${clasificacionFinal.replace(/"/g, '""')}"\n`;
      if (scoreParteA !== null) csvContent += `Puntaje Parte A,${scoreParteA}\n`;
      if (mostrarParteB && scoreParteB !== null) csvContent += `Puntaje Parte B,${scoreParteB}\n`;
      csvContent += "\n" + headers.join(",") + "\n";
      csvContent += csvDataRowsAsConst.map(row => row.join(",")).join("\n");
      return csvContent;
    } else { // TXT format
      let content = `Resultado de la Escala EFAM-Chile\n`;
      if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
      content += `Fecha: ${currentDate}\n\n`;
      content += `CLASIFICACIÓN FINAL: ${clasificacionFinal}\n`;
      if (scoreParteA !== null) content += `Puntaje Parte A: ${scoreParteA} (${interpretacionParteA})\n`;
      if (mostrarParteB && scoreParteB !== null) content += `Puntaje Parte B: ${scoreParteB} (${interpretacionParteB})\n`;
      content += `\nDETALLES DE LA EVALUACIÓN:\n${txtDetails}`;
      return content;
    }
  }

  const handleExport = (formatType: 'txt' | 'csv') => {
    const content = generateExportContent(formatType);
    if (!content) {
        toast({title: "Exportación no disponible", description: "Complete la escala para exportar.", variant: "default"});
        return;
    }
    const mimeType = formatType === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
    const extension = formatType;
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `resultado_escala_efam_${new Date().toISOString().split('T')[0]}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
  };
  
  const renderRadioGroupField = (
    name: keyof EfamFormValues,
    label: string,
    options: EfamOption[],
    description?: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-medium">{label}</FormLabel>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value?.toString() || ''}
              className="flex flex-col space-y-1"
            >
              {options.map((option) => (
                <FormItem key={option.value} className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal text-sm cursor-pointer">
                    {option.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );

  const renderNumberInputField = (
    name: keyof EfamFormValues,
    label: string,
    min: number,
    max: number,
    description?: string
  ) => (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel className="text-sm font-medium">{label}</FormLabel>
                {description && <FormDescription className="text-xs">{description}</FormDescription>}
                <FormControl>
                    <Input 
                        type="number"
                        min={min} max={max} 
                        placeholder={`0-${max}`}
                        {...field}
                        value={field.value === undefined ? '' : String(field.value)}
                        onChange={e => {
                            const val = e.target.value;
                            const numVal = parseInt(val, 10);
                            if (val === '') field.onChange(undefined);
                            else if (!isNaN(numVal)) field.onChange(Math.max(min, Math.min(max, numVal)));
                        }}
                        className="w-28 h-9"
                    />
                </FormControl>
                <FormMessage className="text-xs"/>
            </FormItem>
        )}
    />
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><ClipboardCheck className="mr-2 h-6 w-6 text-teal-500" />EFAM-Chile</CardTitle>
        <ScaleCardDescription>
          Examen Funcional del Adulto Mayor. Evalúa la funcionalidad y el estado cognitivo.
        </ScaleCardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <Label htmlFor="patientNameEfam">Nombre del Paciente (Opcional para exportación)</Label>
          <Input 
            id="patientNameEfam" 
            value={patientName} 
            onChange={(e) => setPatientName(e.target.value)} 
            placeholder="Ingrese nombre del paciente..." 
          />
        </div>
        <Separator className="my-6" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEfamSubmit)} className="space-y-6">
            <div className="border p-4 rounded-lg bg-background shadow">
                <h3 className="text-lg font-semibold mb-3 flex items-center text-primary">
                    <Users className="mr-2 h-5 w-5" />Parte A: Valoración Funcional
                </h3>
                <FormDescription className="text-xs mb-3">Responda según la necesidad de ayuda del adulto mayor para realizar las siguientes actividades.</FormDescription>
                <div className="space-y-4">
                    {renderRadioGroupField("ayudaBanarse", questionFullLabelsEfam.ayudaBanarse, siNoOptions)}
                    {renderRadioGroupField("ayudaManejarDinero", questionFullLabelsEfam.ayudaManejarDinero, siNoOptions)}
                    {renderRadioGroupField("ayudaTomarMedicamentos", questionFullLabelsEfam.ayudaTomarMedicamentos, siNoOptions)}
                    {renderRadioGroupField("ayudaPrepararComida", questionFullLabelsEfam.ayudaPrepararComida, siNoOptions)}
                    {renderRadioGroupField("ayudaTareasCasa", questionFullLabelsEfam.ayudaTareasCasa, siNoOptions, "Ej: lavar loza, hacer la cama, limpiar.")}
                </div>
                {scoreParteA !== null && (
                    <div className="mt-4 p-2 border-t">
                        <p className="text-sm font-semibold">Puntaje Parte A: {scoreParteA} puntos.</p>
                        <p className={cn("text-sm", scoreParteA <= 1 ? "text-green-600" : "text-orange-600")}>{interpretacionParteA}</p>
                    </div>
                )}
            </div>

            {mostrarParteB && (
              <div className="border p-4 rounded-lg bg-background shadow">
                <h3 className="text-lg font-semibold mb-3 flex items-center text-primary">
                  <Brain className="mr-2 h-5 w-5" />Parte B: Valoración Cognitiva
                </h3>
                <FormDescription className="text-xs mb-3">Aplicar sólo si el puntaje de la Parte A fue ≥ 2.</FormDescription>
                <div className="space-y-4">
                    {renderNumberInputField("aprendizajePalabras", questionFullLabelsEfam.aprendizajePalabras, 0, 3, "Se leen 3 palabras (ÁRBOL, MESA, AVIÓN). Anote N° de palabras repetidas correctamente al primer intento. Indique que las recuerde para después.")}
                    {renderRadioGroupField("fechaCorrecta", questionFullLabelsEfam.fechaCorrecta, correctoIncorrectoOptions)}
                    {renderRadioGroupField("diaSemanaCorrecto", questionFullLabelsEfam.diaSemanaCorrecto, correctoIncorrectoOptions)}
                    {renderRadioGroupField("lugarCorrecto", questionFullLabelsEfam.lugarCorrecto, correctoIncorrectoOptions)}
                    {renderNumberInputField("evocacionPalabras", questionFullLabelsEfam.evocacionPalabras, 0, 3, "Pida que recuerde las 3 palabras mencionadas antes (ÁRBOL, MESA, AVIÓN). Anote N° de palabras recordadas.")}
                </div>
                 {scoreParteB !== null && (
                    <div className="mt-4 p-2 border-t">
                        <p className="text-sm font-semibold">Puntaje Parte B: {scoreParteB} puntos.</p>
                        <p className={cn("text-sm", scoreParteB >=6 ? "text-green-600" : "text-red-600")}>{interpretacionParteB}</p>
                    </div>
                )}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">Obtener Clasificación EFAM</Button>
            </div>
          </form>
        </Form>

        {clasificacionFinal && !clasificacionFinal.includes("pendiente") && (
          <div className={cn(
            "mt-8 p-6 border rounded-lg",
            clasificacionFinal === "Autovalente" && "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700",
            clasificacionFinal === "Autovalente con Riesgo" && "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700",
            clasificacionFinal === "Riesgo de Dependencia" && "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700"
          )}>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                <h3 className="text-xl font-bold text-left flex-grow flex items-center">
                    {riesgoFinalIcon}Clasificación Final EFAM-Chile
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
            <p className={cn(
                "text-2xl font-extrabold text-center mb-1",
                 clasificacionFinal === "Autovalente" && "text-green-700 dark:text-green-300",
                 clasificacionFinal === "Autovalente con Riesgo" && "text-yellow-700 dark:text-yellow-400",
                 clasificacionFinal === "Riesgo de Dependencia" && "text-red-700 dark:text-red-500"
            )}>{clasificacionFinal}</p>
            <p className="text-xs text-muted-foreground text-center">
                {scoreParteA !== null && `Puntaje A: ${scoreParteA}. `}
                {mostrarParteB && scoreParteB !== null && `Puntaje B: ${scoreParteB}.`}
            </p>
          </div>
        )}
         {clasificacionFinal && clasificacionFinal.includes("pendiente") && (
             <div className="mt-8 p-6 border rounded-lg bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700 text-center">
                <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">{clasificacionFinal}</p>
             </div>
         )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                El EFAM-Chile es un instrumento de valoración funcional y cognitiva para adultos mayores.
            </p>
            <p><strong>Puntuaciones Parte A (Funcionalidad):</strong> 1 punto por cada "SÍ" (necesita ayuda). Rango 0-5.</p>
            <ul className="list-disc list-inside pl-4">
                <li><strong>0-1 puntos:</strong> Autovalente (No se aplica Parte B).</li>
                <li><strong>2-5 puntos:</strong> Riesgo de Dependencia (Aplicar Parte B).</li>
            </ul>
            <p><strong>Puntuaciones Parte B (Cognitiva):</strong> Suma de puntos de los ítems. Rango 0-9.</p>
             <ul className="list-disc list-inside pl-4">
                <li><strong>≥ 6 puntos:</strong> Normal.</li>
                <li><strong>≤ 5 puntos:</strong> Alterado / Sugiere deterioro cognitivo.</li>
            </ul>
            <p><strong>Clasificación Final EFAM-Chile:</strong></p>
            <ul className="list-disc list-inside pl-4">
                <li><strong>Autovalente:</strong> Puntaje A ≤ 1.</li>
                <li><strong>Autovalente con Riesgo:</strong> Puntaje A ≥ 2 Y Puntaje B ≥ 6.</li>
                <li><strong>Riesgo de Dependencia:</strong> Puntaje A ≥ 2 Y Puntaje B ≤ 5.</li>
            </ul>
            <p className="italic">
                Fuente: Adaptado del "Instrumento de Valoración Funcional del Adulto Mayor EFAM-CHILE" del Ministerio de Salud de Chile.
                Esta escala debe ser aplicada e interpretada por personal capacitado.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EFAMScaleForm;
