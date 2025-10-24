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
import { UserCheck, Info, RefreshCcw, Download, ChevronDown } from 'lucide-react';
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

const rassSchema = z.object({
  rassLevel: z.string({ required_error: "Seleccione un nivel de RASS." }),
});

type RASSFormValues = z.infer<typeof rassSchema>;

interface RASSLevel {
  value: string; 
  score: number; 
  term: string;
  description: string;
}

const rassLevels: RASSLevel[] = [
  { value: "+4", score: 4, term: "Combativo", description: "Abiertamente combativo o violento; peligro inmediato para el personal." },
  { value: "+3", score: 3, term: "Muy Agitado", description: "Tira de tubos o catéteres; agresivo." },
  { value: "+2", score: 2, term: "Agitado", description: "Movimientos frecuentes y no intencionados; lucha con el ventilador." },
  { value: "+1", score: 1, term: "Inquieto", description: "Ansioso o aprensivo, pero movimientos no agresivos o vigorosos." },
  { value: "0", score: 0, term: "Alerta y Tranquilo", description: "Alerta y tranquilo." },
  { value: "-1", score: -1, term: "Somnoliento", description: "No totalmente alerta, pero se despierta sostenidamente (más de 10 segundos) al estímulo verbal (ej. llamándolo por su nombre)." },
  { value: "-2", score: -2, term: "Sedación Leve", description: "Despierta brevemente (menos de 10 segundos) con contacto visual al estímulo verbal." },
  { value: "-3", score: -3, term: "Sedación Moderada", description: "Cualquier movimiento (pero sin contacto visual) al estímulo verbal." },
  { value: "-4", score: -4, term: "Sedación Profunda", description: "Ninguna respuesta al estímulo verbal, pero cualquier movimiento al estímulo físico." },
  { value: "-5", score: -5, term: "No Despertable", description: "Ninguna respuesta al estímulo verbal o físico." },
];

const RASSScaleForm: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<RASSLevel | null>(null);
  const [patientName, setPatientName] = useState('');
  const { toast } = useToast();

  const form = useForm<RASSFormValues>({
    resolver: zodResolver(rassSchema),
    defaultValues: {},
  });

  const onRASSValueChange = (value: string) => {
    const level = rassLevels.find(l => l.value === value);
    setSelectedLevel(level || null);
    form.setValue("rassLevel", value);
  };

  const resetCalculator = () => {
    form.reset();
    setSelectedLevel(null);
    setPatientName("");
  };

  const generateExportContent = (formatType: 'txt' | 'csv') => {
    if (!selectedLevel) return "";
    const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    
    if (formatType === 'csv') {
      const headers = ["Paciente", "Fecha", "Nivel RASS", "Término", "Descripción"];
      const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
      const values = [
        patientNameCsv,
        currentDate,
        `"${selectedLevel.value.replace(/"/g, '""')}"`,
        `"${selectedLevel.term.replace(/"/g, '""')}"`,
        `"${selectedLevel.description.replace(/"/g, '""')}"`,
      ];
      return `${headers.join(",")}\n${values.join(",")}`;
    } else { // TXT format
      let content = `Resultado de la Escala RASS\n`;
      if (patientName.trim()) content += `Paciente: ${patientName.trim()}\n`;
      content += `Fecha: ${currentDate}\n\n`;
      content += `NIVEL RASS SELECCIONADO:\n`;
      content += `Valor: ${selectedLevel.value}\n`;
      content += `Término: ${selectedLevel.term}\n`;
      content += `Descripción: ${selectedLevel.description}\n`;
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
    link.download = `resultado_escala_rass_${new Date().toISOString().split('T')[0]}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Resultado Exportado", description: `El resultado se ha descargado como archivo ${extension}.` });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCheck className="mr-2 h-6 w-6 text-blue-500" />
          Escala RASS (Richmond Agitation-Sedation Scale)
        </CardTitle>
        <ScaleCardDescription>
          Evalúa el nivel de agitación y sedación en pacientes críticos.
        </ScaleCardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <Label htmlFor="patientNameRASS">Nombre del Paciente (Opcional para exportación)</Label>
          <Input
              id="patientNameRASS"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Ingrese nombre del paciente..."
              className="flex-grow"
            />
        </div>
        <Separator className="my-6" />
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <FormField
              control={form.control}
              name="rassLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold">Seleccione el Nivel de RASS</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        onRASSValueChange(value);
                      }}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {rassLevels.map((level) => (
                        <FormItem key={level.value} className="flex items-start space-x-3 space-y-0 p-3 hover:bg-muted/50 rounded-md transition-colors border items-center">
                          <FormControl>
                            <RadioGroupItem value={level.value} />
                          </FormControl>
                          <div className="flex-1 cursor-pointer">
                            <FormLabel className="font-medium text-sm block">
                              {level.value}: {level.term}
                            </FormLabel>
                            <FormDescription className="text-xs text-muted-foreground">
                              {level.description}
                            </FormDescription>
                          </div>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                <RefreshCcw className="mr-2 h-4 w-4" /> Limpiar Selección
              </Button>
            </div>
          </form>
        </Form>

        {selectedLevel && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                <h3 className="text-xl font-bold text-left flex-grow">Nivel RASS Seleccionado</h3>
                <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" disabled={!selectedLevel}>
                          <Download className="mr-2 h-4 w-4" /> Exportar <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleExport('txt')} disabled={!selectedLevel}>
                          Como TXT (.txt)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('csv')} disabled={!selectedLevel}>
                          Como CSV (.csv)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <p className="text-3xl font-extrabold text-center text-primary mb-1">
              {selectedLevel.value}: {selectedLevel.term}
            </p>
            <p className="text-md text-center text-muted-foreground">
              {selectedLevel.description}
            </p>
          </div>
        )}
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start"><Info size={18} className="mr-2 flex-shrink-0 text-blue-500"/> 
                La escala RASS es utilizada para describir el nivel de agitación o sedación de un paciente, generalmente en la UCI.
            </p>
            <p><strong>Procedimiento de Evaluación:</strong></p>
            <ol className="list-decimal list-inside pl-4 space-y-1">
                <li>Observe al paciente. ¿Está alerta, inquieto o agitado? (Puntaje 0 a +4)</li>
                <li>Si no está alerta, llámelo por su nombre y pídale que abra los ojos y mire al orador.</li>
                <li>Si responde al estímulo verbal:
                    <ul className="list-disc list-inside pl-5">
                        <li>Despierta con apertura ocular y contacto visual sostenido (&gt;10s): <strong>-1 (Somnoliento)</strong></li>
                        <li>Despierta con apertura ocular y contacto visual breve (&lt;10s): <strong>-2 (Sedación Leve)</strong></li>
                        <li>Cualquier movimiento en respuesta al estímulo verbal (sin contacto visual): <strong>-3 (Sedación Moderada)</strong></li>
                    </ul>
                </li>
                <li>Si no responde al estímulo verbal, estimúlelo físicamente (ej. tocar el hombro, luego frotar el esternón si no hay respuesta).</li>
                 <li>Si responde al estímulo físico:
                    <ul className="list-disc list-inside pl-5">
                         <li>Cualquier movimiento al estímulo físico: <strong>-4 (Sedación Profunda)</strong></li>
                         <li>Ninguna respuesta a ningún estímulo: <strong>-5 (No Despertable)</strong></li>
                    </ul>
                </li>
            </ol>
            <p className="italic">
                Fuente: Sessler CN, et al. The Richmond Agitation-Sedation Scale. Am J Respir Crit Care Med. 2002.
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RASSScaleForm;
