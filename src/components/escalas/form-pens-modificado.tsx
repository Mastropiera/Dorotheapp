"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ScaleCardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ClipboardCheck, Info, Baby, AlertTriangle, Download, ChevronDown, CheckCircle, XCircle, ChevronsUp, Brain, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PAUTA_BREVE_DSM_DATA, type PautaBreveAgeKey } from '@/lib/pauta-breve-dsm-data';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// No need for Zod or react-hook-form as this is now a display/manual calculation component

const pensItemsConfig = [
  { area: "Reflejos del Desarrollo", id: "reflejoMoro", text: "Reflejo Moro" },
  { area: "Reflejos del Desarrollo", id: "posturaEsgrimista", text: "Postura esgrimista (PE)" },
  { area: "Reflejos del Desarrollo", id: "reflejoPrensionPlantar", text: "Reflejo prensión plantar" },
  { area: "Reflejos del Desarrollo", id: "reflejosSuccionDeglucion", text: "Reflejos de succión y deglución" },
  { area: "Antropometría", id: "perimetroCefalico", text: "Perímetro Cefálico (PCe/E)" },
  { area: "Antropometría", id: "talla", text: "Talla (T/E)" },
  { area: "Antropometría", id: "peso", text: "Peso (P/E)" },
  { area: "Piel", id: "inspeccionPiel", text: "Inspección de piel" },
  { area: "Conducta y Comunicación", id: "conducta", text: "Conducta (evaluación cualitativa)" },
  { area: "Conducta y Comunicación", id: "llanto", text: "Llanto" },
  { area: "Conducta y Comunicación", id: "consolabilidad", text: "Consolabilidad" },
  { area: "Conducta y Comunicación", id: "sonrisaSocial", text: "Sonrisa social* (solo a los 2 meses)" },
  { area: "Movilidad", id: "controlCefalico", text: "Control Cefálico" },
  { area: "Movilidad", id: "movimientosEspontaneos", text: "Movimientos espontáneos de extremidades" },
  { area: "Movilidad", id: "aperturaManos", text: "Apertura de manos" },
  { area: "Movilidad", id: "movilidadFacial", text: "Movilidad facial" },
  { area: "Tono", id: "tonoAxial", text: "Tono axial" },
  { area: "Visión", id: "rojoPupilar", text: "Rojo pupilar" },
  { area: "Visión", id: "miraFijamente", text: "Mira fijamente al examinador/a y sigue un objeto 90°" },
  { area: "Audición", id: "reaccionaRuido", text: "Reacciona frente a ruido fuerte" },
];

const itemDescriptions: Record<string, string> = {
  reflejoMoro: "Normal: Simétrico.\nAlterado: Asimétrico, incompleto o hiperrespuesta.\nMuy alterado: Ausente.",
  posturaEsgrimista: "Normal: Se observa.\nAlterado: Ausente o incompleto.\nMuy alterado: Obligado y persistente.",
  reflejoPrensionPlantar: "Normal: Presente.\nAlterado: Débil o incompleto.\nMuy alterado: Ausente.",
  reflejosSuccionDeglucion: "Normal: Presentes, coordinados y vigorosos.\nAlterado: Débiles o incoordinados.\nMuy alterado: Ausentes.",
  perimetroCefalico: "Normal: Entre +2 y -2 DE.\nAlterado: Entre +2 y +3 DE o entre -2 y -3 DE.\nMuy alterado: > +3 DE o < -3 DE.",
  talla: "Normal: Entre +2 y -2 DE.\nAlterado: Entre +2 y +3 DE o entre -2 y -3 DE.\nMuy alterado: > +3 DE o < -3 DE.",
  peso: "Normal: Entre +2 y -2 DE.\nAlterado: Entre +2 y +3 DE o entre -2 y -3 DE.\nMuy alterado: > +3 DE o < -3 DE.",
  inspeccionPiel: "Normal: Sin alteraciones.\nAlterado: Mancha café con leche >0,5 cm, hemangiomas, nevo congénito, entre otras.\nMuy alterado: Más de 6 manchas café con leche, neurofibromas, etc.",
  conducta: "Normal: Alerta, tranquilo y colaborador.\nAlterado: Irritable, inquieto, letárgico, hipo o hiperreactivo.\nMuy alterado: Irritabilidad persistente, letargia marcada, no contacta.",
  llanto: "Normal: Normal.\nAlterado: Débil, quejumbroso o agudo.\nMuy alterado: Agudo e inconsolable.",
  consolabilidad: "Normal: Fácilmente consolable.\nAlterado: Difícilmente consolable.\nMuy alterado: Inconsolable.",
  sonrisaSocial: "Normal: Presente.\nAlterado: Incompleta o ausente.\nMuy alterado: No aplica (solo se evalúa si es normal o alterado).",
  controlCefalico: "Normal: Sostiene la cabeza.\nAlterado: Logra parcialmente.\nMuy alterado: No logra.",
  movimientosEspontaneos: "Normal: Movimientos alternados y fluidos.\nAlterado: Asimétricos o movimientos reducidos.\nMuy alterado: Escasos o ausentes.",
  aperturaManos: "Normal: Manos abiertas la mayor parte del tiempo.\nAlterado: Manos cerradas la mayor parte del tiempo o pulgar aducido.\nMuy alterado: Manos empuñadas persistentemente.",
  movilidadFacial: "Normal: Simétrica, expresión facial variada.\nAlterado: Asimetría o escasa mímica.\nMuy alterado: Asimetría marcada.",
  tonoAxial: "Normal: Al suspenderlo ventralmente endereza el tronco y levanta la cabeza.\nAlterado: Hipotonía o hipertonía leve.\nMuy alterado: Hipotonía o hipertonía marcada.",
  rojoPupilar: "Normal: Presente en ambos ojos.\nAlterado: Ausente o disminuido en un ojo.\nMuy alterado: Ausente en ambos ojos.",
  miraFijamente: "Normal: Logrado.\nAlterado: Logra parcialmente o solo fija la mirada.\nMuy alterado: No logra.",
  reaccionaRuido: "Normal: Reacciona con parpadeo, sobresalto o llanto.\nAlterado: Reacción débil.\nMuy alterado: No reacciona.",
};

type ItemResult = "0" | "1" | "2";

const PENSModificadoForm: React.FC = () => {
    const [results, setResults] = useState<Record<string, ItemResult | undefined>>({});
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const [interpretation, setInterpretation] = useState<{ text: string, action: string, color: string, icon: React.ReactNode } | null>(null);
    const [patientName, setPatientName] = useState('');
    const { toast } = useToast();

    const handleResultChange = (itemId: string, value: ItemResult) => {
        setResults(prev => ({ ...prev, [itemId]: value }));
    };

    const calculateResult = () => {
        if (Object.keys(results).length !== pensItemsConfig.length) {
            toast({
                title: "Evaluación Incompleta",
                description: "Por favor, evalúe todos los ítems antes de calcular el resultado.",
                variant: "destructive",
            });
            return;
        }

        let score = 0;
        Object.values(results).forEach(value => {
            if (value) score += parseInt(value, 10);
        });
        setTotalScore(score);

        const isRojoPupilarAltered = results.rojoPupilar && parseInt(results.rojoPupilar, 10) > 0;
        const isPerimetroCefalicoAltered = results.perimetroCefalico && parseInt(results.perimetroCefalico, 10) > 0;

        if (score >= 4 || isRojoPupilarAltered || isPerimetroCefalicoAltered) {
            setInterpretation({ text: "Muy Anormal", color: "text-red-600 dark:text-red-500", action: "Derivar a especialista en nivel secundario.", icon: <AlertTriangle className="h-5 w-5 mr-2" /> });
        } else if (score >= 1 && score <= 3) {
            setInterpretation({ text: "Anormal", color: "text-yellow-600 dark:text-yellow-400", action: "Repetir PENS en control de los 2 meses. Si persiste alteración, derivar a médico/a para evaluar derivación a nivel secundario.", icon: <AlertTriangle className="h-5 w-5 mr-2" /> });
        } else {
            setInterpretation({ text: "Normal", color: "text-green-600 dark:text-green-400", action: "Continuar con calendario de controles habituales y citar a control de los 2 meses.", icon: <CheckCircle className="h-5 w-5 mr-2" /> });
        }
    };
    
    const resetCalculator = () => {
        setResults({});
        setTotalScore(null);
        setInterpretation(null);
        setPatientName('');
    };

    const groupedItems = pensItemsConfig.reduce((acc, item) => {
        const area = item.area;
        if (!acc[area]) {
            acc[area] = [];
        }
        acc[area].push(item);
        return acc;
    }, {} as Record<string, typeof pensItemsConfig>);

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center"><ClipboardCheck className="mr-2 h-6 w-6 text-pink-500" />Protocolo de Evaluación Neurosensorial (PENS) Modificado</CardTitle>
                <ScaleCardDescription>
                    Evalúa el desarrollo neurosensorial en lactantes de 1 y 2 meses.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label htmlFor="patientNamePENS">Nombre del Niño/a (Opcional)</Label>
                    <Input id="patientNamePENS" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Ingrese nombre..." />
                </div>
                <Separator className="my-6" />
                <form onSubmit={(e) => { e.preventDefault(); calculateResult(); }} className="space-y-8">
                    {Object.entries(groupedItems).map(([area, items]) => (
                        <div key={area}>
                            <h3 className="text-md font-semibold text-primary mb-2">{area}</h3>
                            <div className="space-y-3">
                                {items.map(item => (
                                    <div key={item.id} className="p-2.5 border rounded-md">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                            <div className="flex items-center gap-2 mb-2 sm:mb-0 flex-1">
                                                <Label htmlFor={item.id} className="text-sm font-normal">{item.text}</Label>
                                                <TooltipProvider delayDuration={100}>
                                                    <Tooltip>
                                                        <TooltipTrigger type="button" onClick={(e) => e.preventDefault()}>
                                                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="whitespace-pre-wrap text-sm max-w-xs">{itemDescriptions[item.id]}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <RadioGroup
                                                onValueChange={(value) => handleResultChange(item.id, value as ItemResult)}
                                                value={results[item.id]}
                                                className="flex space-x-2 flex-shrink-0"
                                            >
                                                <div className="flex items-center space-x-1"><RadioGroupItem value="0" id={`${item.id}-0`} /><Label htmlFor={`${item.id}-0`} className="text-xs">Normal (0)</Label></div>
                                                <div className="flex items-center space-x-1"><RadioGroupItem value="1" id={`${item.id}-1`} /><Label htmlFor={`${item.id}-1`} className="text-xs">Alterado (1)</Label></div>
                                                <div className="flex items-center space-x-1"><RadioGroupItem value="2" id={`${item.id}-2`} /><Label htmlFor={`${item.id}-2`} className="text-xs">Muy Alt. (2)</Label></div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">Limpiar</Button>
                        <Button type="submit" className="w-full sm:w-auto">Calcular Resultado PENS</Button>
                    </div>
                </form>

                {totalScore !== null && interpretation && (
                    <div className={cn("mt-8 p-6 border rounded-lg", 
                         totalScore >= 4 ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700" 
                         : totalScore >= 1 ? "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700"
                         : "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700"
                    )}>
                        <h3 className="text-xl font-bold text-center mb-2">Resultado PENS</h3>
                        <p className="text-3xl font-extrabold text-center text-primary mb-2">{totalScore} puntos</p>
                        <div className={cn("text-lg font-semibold flex flex-col items-center justify-center", interpretation.color)}>
                            <div className="flex items-center">
                                {interpretation.icon} {interpretation.text}
                            </div>
                            <p className="text-sm font-normal text-muted-foreground mt-1 text-center">{interpretation.action}</p>
                        </div>
                    </div>
                )}
                <Separator className="my-8" />
                 <div className="text-xs text-muted-foreground space-y-2">
                    <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500" />
                        El PENS Modificado es una herramienta de tamizaje. Un resultado "Anormal" o "Muy Anormal" indica la necesidad de seguimiento y/o derivación.
                    </p>
                    <p><strong>Interpretación del Resultado:</strong></p>
                    <ul className="list-disc list-inside pl-4 space-y-1">
                        <li><strong>Normal (0 puntos):</strong> Continuar con calendario de controles habituales y citar a control de los 2 meses.</li>
                        <li><strong>Anormal (1-3 puntos):</strong> Repetir PENS en control de los 2 meses, si persiste alteración, derivar a médico/a para evaluar derivación a nivel secundario.</li>
                        <li><strong>Muy Anormal (≥ 4 puntos y/o microcefalia y/o macrocefalia y/o rojo pupilar alterado):</strong> Derivar a especialista en nivel secundario.</li>
                    </ul>
                    <p className="italic">Fuente: Norma Técnica para la supervisión de niños y niñas de 0 a 9 años en la Atención Primaria de Salud, MINSAL Chile.</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default PENSModificadoForm;