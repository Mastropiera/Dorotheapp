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
import { UserCheck, Info, TrendingUp, Download, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const barthelSchema = z.object({
  comer: z.string({ required_error: "Seleccione una opción." }),
  lavarse: z.string({ required_error: "Seleccione una opción." }),
  vestirse: z.string({ required_error: "Seleccione una opción." }),
  arreglarse: z.string({ required_error: "Seleccione una opción." }),
  deposicion: z.string({ required_error: "Seleccione una opción." }),
  miccion: z.string({ required_error: "Seleccione una opción." }),
  usarRetrete: z.string({ required_error: "Seleccione una opción." }),
  trasladarse: z.string({ required_error: "Seleccione una opción." }),
  deambular: z.string({ required_error: "Seleccione una opción." }),
  escaleras: z.string({ required_error: "Seleccione una opción." }),
});

type BarthelFormValues = z.infer<typeof barthelSchema>;

interface BarthelOption {
  value: string;
  label: string;
  score: number;
}

const barthelOptions: Record<keyof BarthelFormValues, BarthelOption[]> = {
  comer: [
    { value: "0", label: "0. Incapaz", score: 0 },
    { value: "5", label: "5. Necesita ayuda para cortar, extender mantequilla, usar condimentos, etc.", score: 5 },
    { value: "10", label: "10. Independiente (la comida está al alcance de la mano)", score: 10 },
  ],
  lavarse: [ // (Bañarse)
    { value: "0", label: "0. Dependiente", score: 0 },
    { value: "5", label: "5. Independiente: capaz de lavarse entero, entrar y salir de la bañera/ducha, usar ayudas si es preciso.", score: 5 },
  ],
  vestirse: [
    { value: "0", label: "0. Dependiente", score: 0 },
    { value: "5", label: "5. Necesita ayuda, pero realiza al menos la mitad de las tareas en un tiempo razonable.", score: 5 },
    { value: "10", label: "10. Independiente (incluye abrocharse, atarse los zapatos, ponerse corsés o prótesis).", score: 10 },
  ],
  arreglarse: [ // (Aseo personal: lavarse cara y manos, peinarse, afeitarse, maquillarse)
    { value: "0", label: "0. Necesita ayuda", score: 0 },
    { value: "5", label: "5. Independiente", score: 5 },
  ],
  deposicion: [ // (Control de heces)
    { value: "0", label: "0. Incontinente (o necesita que le suministren enemas o supositorios).", score: 0 },
    { value: "5", label: "5. Accidente ocasional (máximo una vez por semana).", score: 5 },
    { value: "10", label: "10. Continente.", score: 10 },
  ],
  miccion: [ // (Control de orina)
    { value: "0", label: "0. Incontinente, o sondado e incapaz de cuidarse de la sonda/bolsa.", score: 0 },
    { value: "5", label: "5. Accidente ocasional (máximo uno en 24 horas).", score: 5 },
    { value: "10", label: "10. Continente (durante al menos 7 días), o si está sondado es capaz de cuidarse de la sonda/bolsa.", score: 10 },
  ],
  usarRetrete: [
    { value: "0", label: "0. Dependiente.", score: 0 },
    { value: "5", label: "5. Necesita alguna ayuda, pero puede hacer algo solo/a.", score: 5 },
    { value: "10", label: "10. Independiente (va y viene, se limpia, se viste).", score: 10 },
  ],
  trasladarse: [ // (Sillón/cama)
    { value: "0", label: "0. Incapaz, no se mantiene sentado/a.", score: 0 },
    { value: "5", label: "5. Necesita ayuda importante (una persona entrenada o dos personas), puede estar sentado/a.", score: 5 },
    { value: "10", label: "10. Necesita ayuda leve (verbal o física).", score: 10 },
    { value: "15", label: "15. Independiente.", score: 15 },
  ],
  deambular: [
    { value: "0", label: "0. Inmóvil / Incapaz de desplazarse 50 metros.", score: 0 },
    { value: "5", label: "5. Independiente en silla de ruedas en 50 metros.", score: 5 },
    { value: "10", label: "10. Deambula con ayuda de una persona (verbal o física) en 50 metros.", score: 10 },
    { value: "15", label: "15. Independiente en 50 metros (puede usar ayudas como bastón, muletas, andador, pero no silla de ruedas).", score: 15 },
  ],
  escaleras: [ // (Subir y bajar un tramo de escaleras)
    { value: "0", label: "0. Incapaz.", score: 0 },
    { value: "5", label: "5. Necesita ayuda (verbal, física, o lleva ayudas técnicas).", score: 5 },
    { value: "10", label: "10. Independiente.", score: 10 },
  ],
};

const questionFullLabelsBarthel: Record<keyof BarthelFormValues, string> = {
    comer: "1. Comer",
    lavarse: "2. Lavarse (Bañarse)",
    vestirse: "3. Vestirse",
    arreglarse: "4. Arreglarse (Aseo personal)",
    deposicion: "5. Deposición (Control de heces)",
    miccion: "6. Micción (Control de orina)",
    usarRetrete: "7. Usar el retrete",
    trasladarse: "8. Trasladarse (Sillón/Cama)",
    deambular: "9. Deambular",
    escaleras: "10. Subir y bajar escaleras",
};

const BarthelIndexForm: React.FC = () => {
    const [barthelScore, setBarthelScore] = useState<number | null>(null);
    const [barthelInterpretation, setBarthelInterpretation] = useState<string>("");
    const [patientName, setPatientName] = useState('');
    const { toast } = useToast();

    const form = useForm<BarthelFormValues>({
        resolver: zodResolver(barthelSchema),
        defaultValues: {},
    });

    const onSubmit = (data: BarthelFormValues) => {
        const score = (
          barthelOptions.comer.find(opt => opt.value === data.comer)!.score +
          barthelOptions.lavarse.find(opt => opt.value === data.lavarse)!.score +
          barthelOptions.vestirse.find(opt => opt.value === data.vestirse)!.score +
          barthelOptions.arreglarse.find(opt => opt.value === data.arreglarse)!.score +
          barthelOptions.deposicion.find(opt => opt.value === data.deposicion)!.score +
          barthelOptions.miccion.find(opt => opt.value === data.miccion)!.score +
          barthelOptions.usarRetrete.find(opt => opt.value === data.usarRetrete)!.score +
          barthelOptions.trasladarse.find(opt => opt.value === data.trasladarse)!.score +
          barthelOptions.deambular.find(opt => opt.value === data.deambular)!.score +
          barthelOptions.escaleras.find(opt => opt.value === data.escaleras)!.score
        );
        setBarthelScore(score);

        if (score < 20) setBarthelInterpretation("Dependencia Total");
        else if (score >= 20 && score <= 35) setBarthelInterpretation("Dependencia Grave");
        else if (score >= 40 && score <= 55) setBarthelInterpretation("Dependencia Moderada");
        else if (score >= 60 && score <= 90) setBarthelInterpretation("Dependencia Leve");
        else if (score >= 91 && score <= 99) setBarthelInterpretation("Prácticamente Independiente / Dependencia Escasa");
        else if (score === 100) setBarthelInterpretation("Totalmente Independiente");
        else setBarthelInterpretation("Puntuación fuera de rango esperado (0-100).");
    };

    const resetCalculator = () => {
        form.reset();
        setBarthelScore(null);
        setBarthelInterpretation("");
        setPatientName("");
    };

    const generateExportContent = (formatType: 'txt' | 'csv') => {
        if (barthelScore === null) return "";
        const formValues = form.getValues();
        const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
        const questionKeys = Object.keys(barthelOptions) as Array<keyof BarthelFormValues>;

        if (formatType === 'csv') {
          const headers = [
            "Paciente", "Fecha", "Puntaje Total Barthel", "Interpretacion Barthel",
            ...questionKeys.map(key => `"${questionFullLabelsBarthel[key].replace(/"/g, '""')}"`)
          ];
          const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
          const values = [
            patientNameCsv,
            currentDate,
            barthelScore.toString(),
            `"${barthelInterpretation.replace(/"/g, '""')}"`,
            ...questionKeys.map(key => {
              const selectedOptionValue = formValues[key];
              const selectedOption = barthelOptions[key].find(opt => opt.value === selectedOptionValue);
              return selectedOption ? `"${selectedOption.label.replace(/"/g, '""')} (${selectedOption.score} pts)"` : "No respondido";
            })
          ];
          return `${headers.join(",")}\n${values.join(",")}`;
        } else { // TXT format
          let content = `Resultado del Índice de Barthel\n`;
          if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
          content += `Fecha: ${currentDate}\n\n`;
          content += `PUNTAJE TOTAL: ${barthelScore} / 100 puntos\n`;
          content += `Interpretación: ${barthelInterpretation}\n\n`;
          content += `DETALLES DE LA EVALUACIÓN:\n`;
          questionKeys.forEach(key => {
              const selectedOptionValue = formValues[key];
              const selectedOption = barthelOptions[key].find(opt => opt.value === selectedOptionValue);
              content += `- ${questionFullLabelsBarthel[key]}:\n  Respuesta: ${selectedOption ? selectedOption.label : 'No respondido'} (Puntos: ${selectedOption ? selectedOption.score : 0})\n`;
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
        link.download = `resultado_indice_barthel_${new Date().toISOString().split('T')[0]}${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
    };
    
    const renderRadioGroupField = (
        name: keyof BarthelFormValues,
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
                            {barthelOptions[name].map((option) => (
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
                <CardTitle className="flex items-center"><UserCheck className="mr-2 h-6 w-6 text-teal-500" />Índice de Barthel</CardTitle>
                <ScaleCardDescription>
                    Evaluación de la capacidad funcional para actividades básicas de la vida diaria (ABVD).
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label htmlFor="patientNameBarthel">Nombre del Paciente (Opcional para exportación)</Label>
                    <Input 
                      id="patientNameBarthel" 
                      value={patientName} 
                      onChange={(e) => setPatientName(e.target.value)} 
                      placeholder="Ingrese el nombre del paciente..." 
                    />
                </div>
                <Separator className="my-6" />
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {renderRadioGroupField("comer", questionFullLabelsBarthel.comer)}
                        <Separator />
                        {renderRadioGroupField("lavarse", questionFullLabelsBarthel.lavarse, "Entrar y salir de la bañera/ducha, lavarse entero.")}
                        <Separator />
                        {renderRadioGroupField("vestirse", questionFullLabelsBarthel.vestirse, "Incluye ponerse y quitarse la ropa, abrocharse, atarse los zapatos.")}
                        <Separator />
                        {renderRadioGroupField("arreglarse", questionFullLabelsBarthel.arreglarse, "Lavarse la cara, manos, peinarse, afeitarse, maquillarse.")}
                        <Separator />
                        {renderRadioGroupField("deposicion", questionFullLabelsBarthel.deposicion)}
                        <Separator />
                        {renderRadioGroupField("miccion", questionFullLabelsBarthel.miccion)}
                        <Separator />
                        {renderRadioGroupField("usarRetrete", questionFullLabelsBarthel.usarRetrete, "Ir al retrete, limpiarse y vestirse.")}
                        <Separator />
                        {renderRadioGroupField("trasladarse", questionFullLabelsBarthel.trasladarse)}
                        <Separator />
                        {renderRadioGroupField("deambular", questionFullLabelsBarthel.deambular, "Desplazarse 50 metros en llano.")}
                        <Separator />
                        {renderRadioGroupField("escaleras", questionFullLabelsBarthel.escaleras, "Un tramo de escaleras.")}
                        
                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                                Limpiar
                            </Button>
                            <Button type="submit" className="w-full sm:w-auto">Calcular Índice de Barthel</Button>
                        </div>
                    </form>
                </Form>

                {barthelScore !== null && (
                    <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                            <h3 className="text-xl font-bold text-left flex-grow">
                                <TrendingUp className="inline mr-2 h-5 w-5 text-primary"/>Resultado del Índice de Barthel
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
                        <p className="text-3xl font-extrabold text-center text-primary mb-2">{barthelScore} / 100 puntos</p>
                        <p className="text-md font-semibold text-center text-muted-foreground">{barthelInterpretation}</p>
                    </div>
                )}
                <Separator className="my-8" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500"/> 
                        El Índice de Barthel mide el grado de independencia en 10 actividades básicas de la vida diaria. Un puntaje más alto indica mayor independencia.
                    </p>
                    <p><strong>Interpretación General del Puntaje (Máx. 100 puntos):</strong></p>
                    <ul className="list-disc list-inside pl-4 space-y-1">
                        <li><strong>&lt; 20 puntos:</strong> Dependencia Total</li>
                        <li><strong>20 - 35 puntos:</strong> Dependencia Grave</li>
                        <li><strong>40 - 55 puntos:</strong> Dependencia Moderada</li>
                        <li><strong>60 - 90 puntos:</strong> Dependencia Leve</li>
                        <li><strong>91 - 99 puntos:</strong> Prácticamente Independiente / Dependencia Escasa</li>
                        <li><strong>100 puntos:</strong> Totalmente Independiente</li>
                    </ul>
                    <p className="italic">
                        Esta escala es una herramienta de valoración y debe ser interpretada en el contexto clínico del paciente.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
export default BarthelIndexForm;

  
