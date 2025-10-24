
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ScaleCardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Baby, Info, ClipboardCheck, AlertTriangle, Download, ChevronDown, CheckCircle, XCircle, ChevronsUp, Brain, BarChart3 } from 'lucide-react';
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
import type { PautaBreveDSMItem } from '@/lib/types/assessments';

// No need for Zod or react-hook-form as this is now a display/manual calculation component

const PautaBreveDSMForm: React.FC = () => {
    const { toast } = useToast();
    const [patientName, setPatientName] = useState('');
    const [selectedAge, setSelectedAge] = useState<PautaBreveAgeKey | null>(null);
    const [itemsToEvaluate, setItemsToEvaluate] = useState<typeof PAUTA_BREVE_DSM_DATA[PautaBreveAgeKey]>([]);
    const [results, setResults] = useState<Record<string, 'logrado' | 'no-logrado'>>({});
    const [finalScore, setFinalScore] = useState<number | null>(null);
    const [interpretation, setInterpretation] = useState<{ text: string; affectedAreas: string | null; color: string; icon: React.ReactNode; } | null>(null);
    

    const handleAgeChange = (age: PautaBreveAgeKey) => {
        setSelectedAge(age);
        setItemsToEvaluate(PAUTA_BREVE_DSM_DATA[age]);
        setResults({});
        setFinalScore(null);
        setInterpretation(null);
    };
    
    const handleResultChange = (itemId: string, value: 'logrado' | 'no-logrado') => {
        setResults(prev => ({ ...prev, [itemId]: value }));
    };

    const calculateResult = () => {
        if (!selectedAge || itemsToEvaluate.length === 0) return;

        const allItemsEvaluated = itemsToEvaluate.every((item: PautaBreveDSMItem) => results.hasOwnProperty(item.id));

        if (!allItemsEvaluated) {
            toast({
                title: "Evaluación Incompleta",
                description: "Por favor, evalúe todos los hitos ('Logrado' o 'No Logrado') antes de calcular el resultado.",
                variant: "destructive",
            });
            return;
        }
        
        const achievedCount = itemsToEvaluate.reduce((count: number, item: PautaBreveDSMItem) => {
            return results[item.id] === 'logrado' ? count + 1 : count;
        }, 0);
        
        setFinalScore(achievedCount);

        if (achievedCount === 4) {
            setInterpretation({ 
                text: "Normal",
                affectedAreas: null, 
                color: "text-green-600 dark:text-green-400", 
                icon: <CheckCircle className="h-5 w-5 mr-2" /> 
            });
        } else { // 0 a 3 puntos
            const failedItems = itemsToEvaluate.filter((item: PautaBreveDSMItem) => results[item.id] !== 'logrado');
            const affectedAreas = [...new Set(failedItems.map((item: PautaBreveDSMItem) => item.area))].join(', ');
            setInterpretation({ 
                text: "Anormal", 
                affectedAreas: `Áreas afectadas: ${affectedAreas}`,
                color: "text-red-600 dark:text-red-500", 
                icon: <XCircle className="h-5 w-5 mr-2" /> 
            });
        }
    };

    const resetCalculator = () => {
        setSelectedAge(null);
        setItemsToEvaluate([]);
        setResults({});
        setFinalScore(null);
        setInterpretation(null);
        setPatientName('');
    };

    const generateExportContent = (formatType: 'txt' | 'csv') => {
        if (finalScore === null || !selectedAge || !interpretation) return "";
        const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
        
        if (formatType === 'csv') {
            const headers = ["Paciente", "Fecha", "Edad Evaluada", "Puntaje Logrado", "Interpretacion", "Áreas Afectadas", ...itemsToEvaluate.map((item: PautaBreveDSMItem) => `"${item.area}: ${item.text.replace(/"/g, '""')}"`)]; // ✅ Agregado ]
            const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
            const values = [
                patientNameCsv,
                currentDate,
                selectedAge,
                finalScore.toString(),
                `"${interpretation.text.replace(/"/g, '""')}"`,
                `"${(interpretation.affectedAreas || 'Ninguna').replace(/"/g, '""')}"`,
                ...itemsToEvaluate.map((item: PautaBreveDSMItem) => `"${results[item.id] === 'logrado' ? 'Logrado' : 'No Logrado'}"`)
            ];
            return `${headers.join(",")}\n${values.join(",")}`;
        } else {
            let content = `Resultado de Pauta Breve de Desarrollo Psicomotor (PB-DP)\n`;
            if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
            content += `Fecha: ${currentDate}\n\n`;
            content += `EDAD EVALUADA: ${selectedAge}\n`;
            content += `PUNTAJE: ${finalScore} / 4 hitos logrados\n`;
            content += `INTERPRETACIÓN: ${interpretation.text}\n`;
             if (interpretation.affectedAreas) {
                content += `${interpretation.affectedAreas}\n`;
            }
            content += `\nDETALLE DE LA EVALUACIÓN:\n`;
            itemsToEvaluate.forEach((item: PautaBreveDSMItem) => {
                content += `- ${item.area}: ${item.text} -> ${results[item.id] === 'logrado' ? 'Logrado' : 'No Logrado'}\n`;
            });
            return content;
        }
    }

    const handleExport = (formatType: 'txt' | 'csv') => {
        const content = generateExportContent(formatType);
        if (!content) {
            toast({title: "Exportación no disponible", description: "Complete y calcule el resultado para exportar.", variant: "default"});
            return;
        }
        const mimeType = formatType === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
        const extension = formatType;
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `resultado_pautabreve_dsm_${new Date().toISOString().split('T')[0]}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo .${extension}` });
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center"><ClipboardCheck className="mr-2 h-6 w-6 text-pink-500" />Pauta Breve de Desarrollo Psicomotor (PB-DP)</CardTitle>
                <ScaleCardDescription>
                    Evaluación del desarrollo psicomotor para lactantes entre 4 y 24 meses. Seleccione una edad para comenzar.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label>Nombre del Niño/a (Opcional)</Label>
                    <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Ingrese nombre..." />
                </div>
                 <div className="mb-6 space-y-2">
                    <Label>Edad a Evaluar</Label>
                    <Select onValueChange={(value) => handleAgeChange(value as PautaBreveAgeKey)} value={selectedAge || undefined}>
                        <SelectTrigger><SelectValue placeholder="Seleccione una edad..." /></SelectTrigger>
                        <SelectContent>
                            {Object.keys(PAUTA_BREVE_DSM_DATA).map(age => <SelectItem key={age} value={age}>{age.replace('m', ' Meses')}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <Separator className="my-6" />

                {selectedAge && (
                    <div className="space-y-4">
                        {itemsToEvaluate.map((item: PautaBreveDSMItem) => (
                            <div key={item.id} className="p-3 border rounded-md">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                    <div className="flex items-center space-x-2 flex-1 mb-2 sm:mb-0">
                                        <label htmlFor={item.id} className="text-sm font-medium leading-none flex items-center">
                                            {item.text}
                                            <TooltipProvider delayDuration={100}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild type="button" onClick={(e) => e.preventDefault()} className="ml-2">
                                                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="p-2 max-w-xs">
                                                           <p className="text-sm font-semibold mb-1">Instrucciones ({item.area})</p>
                                                           <p className="text-xs whitespace-pre-wrap">{item.instructions}</p>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </label>
                                    </div>
                                    <RadioGroup
                                        onValueChange={(value) => handleResultChange(item.id, value as 'logrado' | 'no-logrado')}
                                        value={results[item.id]}
                                        className="flex space-x-4 flex-shrink-0"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="logrado" id={`${item.id}-logrado`} />
                                            <Label htmlFor={`${item.id}-logrado`} className="font-normal text-sm">Logrado</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no-logrado" id={`${item.id}-no-logrado`} />
                                            <Label htmlFor={`${item.id}-no-logrado`} className="font-normal text-sm">No Logrado</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{item.area}</p>
                            </div>
                        ))}
                         <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">Limpiar</Button>
                            <Button type="button" onClick={calculateResult} className="w-full sm:w-auto">Calcular Resultado</Button>
                        </div>
                    </div>
                )}
                
                {finalScore !== null && interpretation && (
                    <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                             <h3 className="text-xl font-bold text-left flex-grow">Resultado de la Pauta Breve DSM</h3>
                             <div className="flex gap-2">
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Exportar <ChevronDown className="ml-1 h-4 w-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleExport('txt')}>Como TXT</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleExport('csv')}>Como CSV</DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                         <p className="text-2xl font-bold text-center text-primary mb-1">
                            {finalScore} / 4 {finalScore === 1 ? 'hito logrado' : 'hitos logrados'}
                        </p>
                        <div className={cn("text-lg font-semibold flex flex-col items-center justify-center", interpretation.color)}>
                            <div className="flex items-center">
                                {interpretation.icon} {interpretation.text}
                            </div>
                            {interpretation.affectedAreas && (
                                <p className="text-sm font-normal text-muted-foreground mt-1">{interpretation.affectedAreas}</p>
                            )}
                        </div>
                    </div>
                )}
                <Separator className="my-8" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p className="flex items-start"><Info size={24} className="mr-2 flex-shrink-0 text-blue-500" />
                        La Pauta Breve de Desarrollo Psicomotor (PB-DP) es una herramienta de tamizaje. Cada hito logrado suma 1 punto.
                    </p>
                    <p><strong>Interpretación:</strong></p>
                    <ul className="list-disc list-inside pl-4 space-y-1">
                        <li><strong>4 puntos:</strong> Normal.</li>
                        <li><strong>0 a 3 puntos:</strong> Anormal. Indica la necesidad de derivación a un médico para evaluación y confirmar o descartar un retraso del desarrollo.</li>
                    </ul>
                    <p className="italic">Fuente: Norma Técnica para la supervisión de niños y niñas de 0 a 9 años en la Atención Primaria de Salud, MINSAL Chile.</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default PautaBreveDSMForm;
