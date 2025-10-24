"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ScaleCardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calculator, Info, Download, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

const bradfordSchema = z.object({
  absences: z.coerce.number().min(0, "Debe ser un número positivo.").int("Debe ser un número entero."),
  totalDays: z.coerce.number().min(0, "Debe ser un número positivo.").int("Debe ser un número entero."),
}).refine(data => data.totalDays >= data.absences, {
    message: "El total de días de ausencia no puede ser menor que el número de eventos de ausencia.",
    path: ["totalDays"],
});

type BradfordFormValues = z.infer<typeof bradfordSchema>;

const BradfordFactorForm: React.FC = () => {
    const [bradfordScore, setBradfordScore] = useState<number | null>(null);
    const [interpretation, setInterpretation] = useState<string>("");
    const [patientName, setPatientName] = useState('');
    const { toast } = useToast();

    const form = useForm<BradfordFormValues>({
        resolver: zodResolver(bradfordSchema),
        defaultValues: {
            absences: undefined,
            totalDays: undefined,
        },
    });

    const onSubmit = (data: BradfordFormValues) => {
        const score = data.absences * data.absences * data.totalDays;
        setBradfordScore(score);

        if (score <= 49) setInterpretation("Ausencia aceptable, no requiere acción.");
        else if (score <= 99) setInterpretation("Requiere una conversación informal y recordatorio de políticas.");
        else if (score <= 399) setInterpretation("Requiere una advertencia verbal y monitorización.");
        else if (score <= 899) setInterpretation("Requiere una advertencia escrita formal.");
        else setInterpretation("Considerar acciones disciplinarias adicionales, incluyendo posible despido.");
    };

    const resetCalculator = () => {
        form.reset();
        setBradfordScore(null);
        setInterpretation("");
        setPatientName("");
    };

    const generateExportContent = (formatType: 'txt' | 'csv') => {
        if (bradfordScore === null) return "";
        const data = form.getValues();
        const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });

        if (formatType === 'csv') {
            const headers = ["Trabajador", "Fecha", "Eventos de Ausencia", "Días Totales Ausente", "Puntaje Bradford", "Interpretación"];
            const patientNameCsv = patientName.trim() ? `"${patientName.trim().replace(/"/g, '""')}"` : "No especificado";
            const values = [
                patientNameCsv, currentDate, data.absences?.toString() || '0', data.totalDays?.toString() || '0', bradfordScore.toString(), `"${interpretation.replace(/"/g, '""')}"`
            ];
            return `${headers.join(",")}\n${values.join(",")}`;
        } else {
            let content = `Reporte de Factor de Bradford\n`;
            if (patientName.trim()) content += `Trabajador/a: ${patientName.trim()}\n`;
            content += `Fecha: ${currentDate}\n\n`;
            content += `DATOS INGRESADOS:\n`;
            content += `- Número de eventos de ausencia (S): ${data.absences}\n`;
            content += `- Días totales de ausencia (D): ${data.totalDays}\n\n`;
            content += `RESULTADO:\n`;
            content += `Puntaje Bradford (S x S x D): ${bradfordScore}\n`;
            content += `Interpretación: ${interpretation}\n`;
            return content;
        }
    };
    
    const handleExport = (formatType: 'txt' | 'csv') => {
        const content = generateExportContent(formatType);
        if (!content) return;
        const mimeType = formatType === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
        const extension = formatType;
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `reporte_bradford_${new Date().toISOString().split('T')[0]}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({ title: "Reporte Exportado", description: `El reporte se ha descargado como archivo .${extension}.` });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center"><Calculator className="mr-2 h-6 w-6 text-blue-500" />Factor de Bradford</CardTitle>
                <ScaleCardDescription>
                    Mide el ausentismo laboral, penalizando las ausencias cortas y frecuentes.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label htmlFor="workerNameBradford">Nombre del Trabajador/a (Opcional)</Label>
                    <Input id="workerNameBradford" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Ingrese nombre..." />
                </div>
                <Separator className="my-6" />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="absences"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número de eventos de ausencia (S)</FormLabel>
                                    <FormControl><Input type="number" placeholder="Ej: 5" {...field} value={field.value ?? ''} /></FormControl>
                                    <FormDescription>Un "evento" es un período de ausencia consecutivo, sin importar su duración.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="totalDays"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Días totales de ausencia (D)</FormLabel>
                                    <FormControl><Input type="number" placeholder="Ej: 10" {...field} value={field.value ?? ''} /></FormControl>
                                    <FormDescription>La suma total de días no trabajados en el período.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">Limpiar</Button>
                            <Button type="submit" className="w-full sm:w-auto">Calcular Factor</Button>
                        </div>
                    </form>
                </Form>

                {bradfordScore !== null && (
                    <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                            <h3 className="text-xl font-bold">Resultado Factor de Bradford</h3>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Exportar <ChevronDown className="ml-1 h-4 w-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleExport('txt')}>Como TXT (.txt)</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleExport('csv')}>Como CSV (.csv)</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <p className="text-3xl font-extrabold text-center text-primary mb-2">{bradfordScore} puntos</p>
                        <p className="text-md font-semibold text-center text-muted-foreground">{interpretation}</p>
                    </div>
                )}
                <Separator className="my-8" />
                <div className="text-xs text-muted-foreground space-y-2">
                    <p><strong>Fórmula:</strong> S² x D = Puntaje Bradford</p>
                    <p><strong>Interpretación del Puntaje (Referencial):</strong></p>
                    <ul className="list-disc list-inside pl-4">
                        <li><strong>&lt; 50:</strong> Ausencia aceptable.</li>
                        <li><strong>50 - 99:</strong> Requiere conversación informal.</li>
                        <li><strong>100 - 399:</strong> Requiere advertencia verbal.</li>
                        <li><strong>400 - 899:</strong> Requiere advertencia escrita.</li>
                        <li><strong>&gt; 900:</strong> Considerar acciones disciplinarias.</li>
                    </ul>
                    <p className="italic">Los puntos de corte son una guía y deben adaptarse a las políticas de cada organización.</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default BradfordFactorForm;