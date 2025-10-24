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
import { ClipboardList, Info, TrendingUp, Footprints, Download, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const tinettiSchema = z.object({
  equilibrioSentado: z.string({ required_error: "Seleccione una opción." }),
  levantarse: z.string({ required_error: "Seleccione una opción." }),
  intentosLevantarse: z.string({ required_error: "Seleccione una opción." }),
  equilibrioInmediatoLevantarse: z.string({ required_error: "Seleccione una opción." }),
  equilibrioBipedestacion: z.string({ required_error: "Seleccione una opción." }),
  empujon: z.string({ required_error: "Seleccione una opción." }),
  ojosCerrados: z.string({ required_error: "Seleccione una opción." }),
  giro360: z.string({ required_error: "Seleccione una opción." }),
  sentarse: z.string({ required_error: "Seleccione una opción." }),
  iniciacionMarcha: z.string({ required_error: "Seleccione una opción." }),
  longitudAlturaPasoDerecho: z.string({ required_error: "Seleccione una opción." }),
  longitudAlturaPasoIzquierdo: z.string({ required_error: "Seleccione una opción." }),
  simetriaPaso: z.string({ required_error: "Seleccione una opción." }),
  continuidadPaso: z.string({ required_error: "Seleccione una opción." }),
  trayectoria: z.string({ required_error: "Seleccione una opción." }),
  tronco: z.string({ required_error: "Seleccione una opción." }),
});

type TinettiFormValues = z.infer<typeof tinettiSchema>;

interface TinettiOption {
  value: string;
  label: string;
  score: number;
}

const tinettiOptions = {
  equilibrioSentado: [
    { value: "0", label: "0. Se inclina o se desliza en la silla.", score: 0 },
    { value: "1", label: "1. Estable y seguro.", score: 1 },
  ],
  levantarse: [
    { value: "0", label: "0. Incapaz sin ayuda.", score: 0 },
    { value: "1", label: "1. Capaz, pero usa los brazos para ayudarse.", score: 1 },
    { value: "2", label: "2. Capaz sin usar los brazos.", score: 2 },
  ],
  intentosLevantarse: [
    { value: "0", label: "0. Incapaz sin ayuda.", score: 0 },
    { value: "1", label: "1. Capaz, pero necesita más de un intento.", score: 1 },
    { value: "2", label: "2. Capaz al primer intento.", score: 2 },
  ],
  equilibrioInmediatoLevantarse: [ 
    { value: "0", label: "0. Inestable (se tambalea, mueve los pies, marcado balanceo del tronco).", score: 0 },
    { value: "1", label: "1. Estable, pero usa andador/bastón o pies muy separados.", score: 1 },
    { value: "2", label: "2. Estable sin andador/bastón, pies juntos/normal.", score: 2 },
  ],
  equilibrioBipedestacion: [
    { value: "0", label: "0. Inestable.", score: 0 },
    { value: "1", label: "1. Estable con apoyo amplio (pies separados) o usa bastón/andador.", score: 1 },
    { value: "2", label: "2. Estable con base de apoyo estrecha sin soporte.", score: 2 },
  ],
  empujon: [ 
    { value: "0", label: "0. Empieza a caer.", score: 0 },
    { value: "1", label: "1. Se tambalea, se agarra, pero se mantiene.", score: 1 },
    { value: "2", label: "2. Estable.", score: 2 },
  ],
  ojosCerrados: [ 
    { value: "0", label: "0. Inestable.", score: 0 },
    { value: "1", label: "1. Estable.", score: 1 },
  ],
  giro360: [
    { value: "0", label: "0. Pasos discontinuos O Inestable (se tambalea, se agarra).", score: 0 },
    { value: "1", label: "1. Pasos continuos O Estable.", score: 1 },
    { value: "2", label: "2. Pasos continuos Y Estable.", score: 2 },
  ],
  sentarse: [
    { value: "0", label: "0. Inseguro (calcula mal la distancia, cae en la silla).", score: 0 },
    { value: "1", label: "1. Usa los brazos o el movimiento no es suave.", score: 1 },
    { value: "2", label: "2. Seguro, movimiento suave.", score: 2 },
  ],
  iniciacionMarcha: [ 
    { value: "0", label: "0. Vacilación o múltiples intentos para empezar.", score: 0 },
    { value: "1", label: "1. Sin vacilación.", score: 1 },
  ],
  longitudAlturaPasoDerecho: [
    { value: "0", label: "0. No sobrepasa el pie izquierdo con el paso Y/O No levanta completamente el pie del suelo.", score: 0 },
    { value: "1", label: "1. Sobrepasa el pie izquierdo con el paso Y Levanta completamente el pie del suelo.", score: 1 },
  ],
  longitudAlturaPasoIzquierdo: [
    { value: "0", label: "0. No sobrepasa el pie derecho con el paso Y/O No levanta completamente el pie del suelo.", score: 0 },
    { value: "1", label: "1. Sobrepasa el pie derecho con el paso Y Levanta completamente el pie del suelo.", score: 1 },
  ],
  simetriaPaso: [
    { value: "0", label: "0. La longitud de los pasos con pie derecho e izquierdo no es igual.", score: 0 },
    { value: "1", label: "1. La longitud de los pasos parece igual.", score: 1 },
  ],
  continuidadPaso: [
    { value: "0", label: "0. Paradas o pasos discontinuos.", score: 0 },
    { value: "1", label: "1. Pasos continuos.", score: 1 },
  ],
  trayectoria: [ 
    { value: "0", label: "0. Desviación marcada de la trayectoria.", score: 0 },
    { value: "1", label: "1. Leve/moderada desviación o usa ayudas para mantener la trayectoria.", score: 1 },
    { value: "2", label: "2. Recta sin usar ayudas.", score: 2 },
  ],
  tronco: [
    { value: "0", label: "0. Marcado balanceo o usa ayudas.", score: 0 },
    { value: "1", label: "1. No hay balanceo, pero flexiona las rodillas o la espalda, o separa los brazos al caminar.", score: 1 },
    { value: "2", label: "2. Sin balanceo, ni flexión, ni uso de los brazos, ni ayudas.", score: 2 },
  ],
};

const questionFullLabelsTinetti: Record<keyof TinettiFormValues, string> = {
  equilibrioSentado: "1. Equilibrio sentado",
  levantarse: "2. Levantarse de la silla",
  intentosLevantarse: "3. Intentos para levantarse",
  equilibrioInmediatoLevantarse: "4. Equilibrio inmediato al levantarse",
  equilibrioBipedestacion: "5. Equilibrio en bipedestación",
  empujon: "6. Empujón",
  ojosCerrados: "7. Ojos cerrados (en bipedestación)",
  giro360: "8. Giro de 360 grados",
  sentarse: "9. Sentarse",
  iniciacionMarcha: "10. Iniciación de la marcha",
  longitudAlturaPasoDerecho: "11. Longitud y altura del paso (pie derecho)",
  longitudAlturaPasoIzquierdo: "12. Longitud y altura del paso (pie izquierdo)",
  simetriaPaso: "13. Simetría del paso",
  continuidadPaso: "14. Continuidad de los pasos",
  trayectoria: "15. Trayectoria de la marcha",
  tronco: "16. Tronco (estabilidad durante la marcha)",
};

const TinettiScaleForm: React.FC = () => {
  const [tinettiTotalScore, setTinettiTotalScore] = useState<number | null>(null);
  const [tinettiBalanceScore, setTinettiBalanceScore] = useState<number | null>(null);
  const [tinettiGaitScore, setTinettiGaitScore] = useState<number | null>(null);
  const [tinettiInterpretation, setTinettiInterpretation] = useState<string>("");
  const [patientName, setPatientName] = useState('');
  const { toast } = useToast();

  const form = useForm<TinettiFormValues>({
    resolver: zodResolver(tinettiSchema),
    defaultValues: {},
  });

  const onTinettiSubmit = (data: TinettiFormValues) => {
    const balanceKeys: (keyof TinettiFormValues)[] = ['equilibrioSentado', 'levantarse', 'intentosLevantarse', 'equilibrioInmediatoLevantarse', 'equilibrioBipedestacion', 'empujon', 'ojosCerrados', 'giro360', 'sentarse'];
    const gaitKeys: (keyof TinettiFormValues)[] = ['iniciacionMarcha', 'longitudAlturaPasoDerecho', 'longitudAlturaPasoIzquierdo', 'simetriaPaso', 'continuidadPaso', 'trayectoria', 'tronco'];
    
    const balanceScore = balanceKeys.reduce((sum, key) => sum + (tinettiOptions[key as keyof typeof tinettiOptions].find(opt => opt.value === data[key])?.score ?? 0), 0);
    setTinettiBalanceScore(balanceScore);

    const gaitScore = gaitKeys.reduce((sum, key) => sum + (tinettiOptions[key as keyof typeof tinettiOptions].find(opt => opt.value === data[key])?.score ?? 0), 0);
    setTinettiGaitScore(gaitScore);

    const totalScore = balanceScore + gaitScore;
    setTinettiTotalScore(totalScore);

    if (totalScore < 19) setTinettiInterpretation("Alto Riesgo de Caídas (Puntuación < 19)");
    else if (totalScore >= 19 && totalScore <= 23) setTinettiInterpretation("Riesgo Moderado de Caídas (Puntuación 19-23)");
    else if (totalScore >= 24) setTinettiInterpretation("Bajo Riesgo de Caídas (Puntuación ≥ 24)");
    else setTinettiInterpretation("Puntuación fuera de rango esperado.");
  };

  const resetCalculator = () => {
    form.reset();
    setTinettiTotalScore(null);
    setTinettiBalanceScore(null);
    setTinettiGaitScore(null);
    setTinettiInterpretation("");
    setPatientName("");
  };

  const generateExportContent = (formatType: 'txt' | 'csv') => {
    if (tinettiTotalScore === null || tinettiBalanceScore === null || tinettiGaitScore === null) return "";
    const formValues = form.getValues();
    const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    const questionKeys = Object.keys(questionFullLabelsTinetti) as Array<keyof TinettiFormValues>;

    if (formatType === 'csv') {
      const headers = [
        "Paciente", "Fecha", 
        "Puntaje Equilibrio Tinetti", "Puntaje Marcha Tinetti", "Puntaje Total Tinetti", "Interpretacion Tinetti",
        ...questionKeys.map(key => `"${questionFullLabelsTinetti[key].replace(/"/g, '""')}"`)
      ];
      const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
      const values = [
        patientNameCsv,
        currentDate,
        tinettiBalanceScore.toString(),
        tinettiGaitScore.toString(),
        tinettiTotalScore.toString(),
        `"${tinettiInterpretation.replace(/"/g, '""')}"`,
        ...questionKeys.map(key => {
          const selectedOptionValue = formValues[key];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const optionsForQuestion = tinettiOptions[key as keyof typeof tinettiOptions] as any[];
          const selectedOption = optionsForQuestion.find(opt => opt.value === selectedOptionValue);
          return selectedOption ? `"${selectedOption.label.replace(/"/g, '""')} (${selectedOption.score} pts)"` : "No respondido";
        })
      ];
      return `${headers.join(",")}\n${values.join(",")}`;
    } else { // TXT format
      let content = `Resultado de la Escala de Tinetti (POMA)\n`;
      if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
      content += `Fecha: ${currentDate}\n\n`;
      content += `PUNTAJE EQUILIBRIO: ${tinettiBalanceScore} / 16 puntos\n`;
      content += `PUNTAJE MARCHA: ${tinettiGaitScore} / 12 puntos\n`;
      content += `PUNTAJE TOTAL: ${tinettiTotalScore} / 28 puntos\n`;
      content += `Interpretación: ${tinettiInterpretation}\n\n`;
      content += `DETALLES DE LA EVALUACIÓN:\n`;
      questionKeys.forEach(key => {
          const selectedOptionValue = formValues[key];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const optionsForQuestion = tinettiOptions[key as keyof typeof tinettiOptions] as any[];
          const selectedOption = optionsForQuestion.find(opt => opt.value === selectedOptionValue);
          content += `- ${questionFullLabelsTinetti[key]}:\n  Respuesta: ${selectedOption ? selectedOption.label : 'No respondido'} (Puntos: ${selectedOption ? selectedOption.score : 0})\n`;
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
    link.download = `resultado_escala_tinetti_${new Date().toISOString().split('T')[0]}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
  };
  
  const renderRadioGroupField = (
    name: keyof TinettiFormValues,
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
              {(tinettiOptions[name as keyof typeof tinettiOptions] as TinettiOption[]).map((option: TinettiOption) => (
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
        <CardTitle className="flex items-center"><ClipboardList className="mr-2 h-6 w-6 text-orange-500" />Escala de Tinetti (POMA)</CardTitle>
        <ScaleCardDescription>
          Evaluación del equilibrio y la marcha para determinar el riesgo de caídas (Performance Oriented Mobility Assessment).
        </ScaleCardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <Label htmlFor="patientNameTinetti">Nombre del Paciente (Opcional para exportación)</Label>
          <div className="flex gap-2 items-start">
            <Input
              id="patientNameTinetti"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Ingrese nombre del paciente..."
              className="flex-grow"
            />
          </div>
        </div>
        <Separator className="my-6" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onTinettiSubmit)} className="space-y-8">
            <div className="border p-4 rounded-lg bg-card shadow-sm">
                <h3 className="text-lg font-semibold mb-3 flex items-center text-primary"><TrendingUp className="mr-2 h-5 w-5" />Subescala de Equilibrio (Máx: 16 puntos)</h3>
                {renderRadioGroupField("equilibrioSentado", questionFullLabelsTinetti.equilibrioSentado)}
                <Separator className="my-4" />
                {renderRadioGroupField("levantarse", questionFullLabelsTinetti.levantarse)}
                <Separator className="my-4" />
                {renderRadioGroupField("intentosLevantarse", questionFullLabelsTinetti.intentosLevantarse)}
                <Separator className="my-4" />
                {renderRadioGroupField("equilibrioInmediatoLevantarse", questionFullLabelsTinetti.equilibrioInmediatoLevantarse, "(primeros 5 segundos)")}
                <Separator className="my-4" />
                {renderRadioGroupField("equilibrioBipedestacion", questionFullLabelsTinetti.equilibrioBipedestacion)}
                <Separator className="my-4" />
                {renderRadioGroupField("empujon", questionFullLabelsTinetti.empujon, "Sujeto en bipedestación con pies juntos, el examinador empuja suavemente el esternón del paciente con la palma de la mano 3 veces.")}
                <Separator className="my-4" />
                {renderRadioGroupField("ojosCerrados", questionFullLabelsTinetti.ojosCerrados, "En la misma posición que en el ítem anterior (bipedestación, pies juntos).")}
                <Separator className="my-4" />
                {renderRadioGroupField("giro360", questionFullLabelsTinetti.giro360)}
                <Separator className="my-4" />
                {renderRadioGroupField("sentarse", questionFullLabelsTinetti.sentarse)}
            </div>

            <div className="border p-4 rounded-lg bg-card shadow-sm">
                <h3 className="text-lg font-semibold mb-3 flex items-center text-primary"><Footprints className="mr-2 h-5 w-5" />Subescala de Marcha (Máx: 12 puntos)</h3>
                {renderRadioGroupField("iniciacionMarcha", questionFullLabelsTinetti.iniciacionMarcha, "Inmediatamente después de decir “ande”.")}
                <Separator className="my-4" />
                {renderRadioGroupField("longitudAlturaPasoDerecho", questionFullLabelsTinetti.longitudAlturaPasoDerecho)}
                <Separator className="my-4" />
                {renderRadioGroupField("longitudAlturaPasoIzquierdo", questionFullLabelsTinetti.longitudAlturaPasoIzquierdo)}
                <Separator className="my-4" />
                {renderRadioGroupField("simetriaPaso", questionFullLabelsTinetti.simetriaPaso)}
                <Separator className="my-4" />
                {renderRadioGroupField("continuidadPaso", questionFullLabelsTinetti.continuidadPaso)}
                <Separator className="my-4" />
                {renderRadioGroupField("trayectoria", questionFullLabelsTinetti.trayectoria, "Observar el trazado que realiza uno de los pies durante unos 3 metros.")}
                <Separator className="my-4" />
                {renderRadioGroupField("tronco", questionFullLabelsTinetti.tronco)}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                Limpiar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">Calcular Riesgo Tinetti</Button>
            </div>
          </form>
        </Form>

        {tinettiTotalScore !== null && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
             <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-2">
                <h3 className="text-xl font-bold text-left flex-grow">Resultado de la Escala de Tinetti</h3>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 text-center">
                <div>
                    <p className="text-sm font-semibold text-muted-foreground">Equilibrio</p>
                    <p className="text-2xl font-bold text-primary">{tinettiBalanceScore} / 16</p>
                </div>
                <div>
                    <p className="text-sm font-semibold text-muted-foreground">Marcha</p>
                    <p className="text-2xl font-bold text-primary">{tinettiGaitScore} / 12</p>
                </div>
                <div>
                    <p className="text-sm font-semibold text-muted-foreground">Total</p>
                    <p className="text-3xl font-extrabold text-primary">{tinettiTotalScore} / 28</p>
                </div>
            </div>
            <p className="text-md font-semibold text-center text-muted-foreground">{tinettiInterpretation}</p>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                La Escala de Tinetti (POMA) evalúa la capacidad de equilibrio y marcha para predecir el riesgo de caídas en personas mayores.
                Un puntaje más bajo indica mayor riesgo.
            </p>
            <p><strong>Interpretación del Puntaje Total (Máx. 28 puntos):</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>&lt; 19 puntos:</strong> Alto riesgo de caídas.</li>
                <li><strong>19 - 23 puntos:</strong> Riesgo moderado de caídas.</li>
                <li><strong>≥ 24 puntos:</strong> Bajo riesgo de caídas.</li>
            </ul>
            <p className="italic">
                La escala es una herramienta de valoración y debe ser interpretada en el contexto clínico del paciente.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TinettiScaleForm;
