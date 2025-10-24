
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Droplet, Weight, Clock, Thermometer, Wind, RefreshCcw, Info, ArrowUp, ArrowDown, Wallet, ChevronsRight, ChevronsLeft, Activity } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from '@/lib/utils';

const balanceHidricoSchema = z.object({
  balanceHours: z.coerce.number().min(1, "Debe ser al menos 1 hora").max(72, "No puede exceder 72 horas").default(12),
  patientWeight: z.coerce.number().min(1, "Debe ser > 0 kg").max(300, "Peso irreal").default(80),
  // Ingresos
  ingestaOral: z.coerce.number().min(0).default(0),
  parenteral: z.coerce.number().min(0).default(0),
  transfusiones: z.coerce.number().min(0).default(0),
  enteral: z.coerce.number().min(0).default(0),
  // Egresos
  diuresis: z.coerce.number().min(0).default(0),
  deposiciones: z.coerce.number().min(0).default(0),
  temperatura: z.coerce.number().min(35, "Temperatura baja").max(43, "Temperatura irreal").optional(),
  fiebreHours: z.coerce.number().min(0).optional(),
  sudoracion: z.enum(['ninguna', 'leve', 'moderada', 'profusa']).default('ninguna'),
  sudoracionHours: z.coerce.number().min(0).optional(),
  frecuenciaRespiratoria: z.coerce.number().min(0, "Debe ser >= 0").optional(),
  respiracionHours: z.coerce.number().min(0).optional(),
});

type BalanceHidricoFormValues = z.infer<typeof balanceHidricoSchema>;

interface BalanceResult {
  totalIngresos: number;
  totalEgresos: number;
  balanceFinal: number;
  detalles: Record<string, number>;
}

const CalculatorBalanceHidrico = () => {
  const [result, setResult] = useState<BalanceResult | null>(null);

  const form = useForm<BalanceHidricoFormValues>({
    resolver: zodResolver(balanceHidricoSchema),
    defaultValues: {
      balanceHours: 12,
      patientWeight: 80,
      ingestaOral: 0,
      parenteral: 0,
      transfusiones: 0,
      enteral: 0,
      diuresis: 0,
      deposiciones: 0,
      sudoracion: 'ninguna',
      fiebreHours: 0,
      sudoracionHours: 0,
      respiracionHours: 0,
    },
  });

  const onSubmit = (data: BalanceHidricoFormValues) => {
    const detalles: Record<string, number> = {};

    // INGRESOS
    detalles.ingestaOral = data.ingestaOral || 0;
    detalles.parenteral = data.parenteral || 0;
    detalles.transfusiones = data.transfusiones || 0;
    detalles.enteral = data.enteral || 0;
    detalles.aguaEndogena = 12.5 * data.balanceHours;

    const totalIngresos = detalles.ingestaOral + detalles.parenteral + detalles.transfusiones + detalles.enteral + detalles.aguaEndogena;

    // EGRESOS
    detalles.diuresis = data.diuresis || 0;
    detalles.deposiciones = data.deposiciones || 0;
    detalles.perspiracionInsensible = 0.5 * data.patientWeight * data.balanceHours;
    
    // Egresos extraordinarios
    detalles.fiebre = 0;
    if (data.temperatura && data.temperatura > 37 && data.fiebreHours) {
      const gradosSobre37 = data.temperatura - 37;
      detalles.fiebre = 6 * gradosSobre37 * data.fiebreHours;
    }
    
    detalles.sudoracion = 0;
    if (data.sudoracionHours && data.sudoracion !== 'ninguna') {
        let factorSudoracion = 0;
        switch(data.sudoracion) {
            case 'leve': factorSudoracion = 10; break;
            case 'moderada': factorSudoracion = 20; break;
            case 'profusa': factorSudoracion = 40; break;
        }
        detalles.sudoracion = factorSudoracion * data.sudoracionHours;
    }

    detalles.respiracion = 0;
    if (data.frecuenciaRespiratoria && data.frecuenciaRespiratoria > 20 && data.respiracionHours) {
        const respSobre20 = data.frecuenciaRespiratoria - 20;
        detalles.respiracion = 1 * respSobre20 * data.respiracionHours;
    }

    const totalEgresos = detalles.diuresis + detalles.deposiciones + detalles.perspiracionInsensible + detalles.fiebre + detalles.sudoracion + detalles.respiracion;
    const balanceFinal = totalIngresos - totalEgresos;

    setResult({ totalIngresos, totalEgresos, balanceFinal, detalles });
  };
  
  const resetCalculator = () => {
    form.reset();
    setResult(null);
  };

  const renderInputField = (name: keyof BalanceHidricoFormValues, label: string, icon?: React.ReactNode, unit = "ml") => (
    <FormField control={form.control} name={name} render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm flex items-center">{icon} {label}</FormLabel>
          <FormControl><Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="h-9" /></FormControl>
          <FormMessage />
        </FormItem>
    )}/>
  );
  
  const renderDetailRow = (label: string, value: number) => (
    <div className="flex justify-between items-center py-1.5 border-b border-dashed">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value.toFixed(1)} ml</span>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center"><Droplet className="mr-2 h-6 w-6 text-blue-500" />Balance Hídrico Detallado</CardTitle>
        <CardDescription>Calcule el balance de fluidos del paciente registrando todos los ingresos y egresos en un período determinado.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/20">
                <FormField control={form.control} name="balanceHours" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center"><Clock className="mr-2 h-4 w-4"/>Horas Totales del Balance</FormLabel>
                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} className="h-9" /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="patientWeight" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center"><Weight className="mr-2 h-4 w-4"/>Peso del Paciente (kg)</FormLabel>
                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="h-9"/></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* INGRESOS */}
              <div className="space-y-4 p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold flex items-center text-green-600"><ArrowDown className="mr-2 h-5 w-5"/>INGRESOS</h3>
                <Separator/>
                <h4 className="font-medium text-sm text-muted-foreground">Normales</h4>
                {renderInputField("ingestaOral", "Vía Oral (ingesta)", <ChevronsRight className="mr-2 h-4 w-4"/>)}
                <h4 className="font-medium text-sm text-muted-foreground">Extraordinarios</h4>
                {renderInputField("parenteral", "Parenteral (sueros, meds)", <ChevronsRight className="mr-2 h-4 w-4"/>)}
                {renderInputField("enteral", "Enteral (sonda)", <ChevronsRight className="mr-2 h-4 w-4"/>)}
                {renderInputField("transfusiones", "Transfusiones", <ChevronsRight className="mr-2 h-4 w-4"/>)}
              </div>
              {/* EGRESOS */}
              <div className="space-y-4 p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold flex items-center text-red-600"><ArrowUp className="mr-2 h-5 w-5"/>EGRESOS</h3>
                <Separator/>
                <h4 className="font-medium text-sm text-muted-foreground">Normales</h4>
                {renderInputField("diuresis", "Diuresis (Riñones)", <ChevronsLeft className="mr-2 h-4 w-4"/>)}
                {renderInputField("deposiciones", "Deposiciones", <ChevronsLeft className="mr-2 h-4 w-4"/>)}
                <Separator />
                <h4 className="font-medium text-sm text-muted-foreground">Extraordinarios</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="temperatura" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm flex items-center"><Thermometer className="mr-2 h-4 w-4"/>Temperatura (°C)</FormLabel>
                      <FormControl><Input type="number" step="0.1" placeholder="Ej: 38.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} className="h-9"/></FormControl><FormMessage /></FormItem>
                  )}/>
                   <FormField control={form.control} name="fiebreHours" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm flex items-center"><Clock className="mr-2 h-4 w-4"/>Horas con Fiebre</FormLabel>
                      <FormControl><Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} className="h-9"/></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="frecuenciaRespiratoria" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm flex items-center"><Activity className="mr-2 h-4 w-4"/>Frec. Resp. (rpm)</FormLabel>
                      <FormControl><Input type="number" placeholder="Ej: 25" {...field} onChange={e => field.onChange(parseInt(e.target.value) || undefined)} className="h-9"/></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="respiracionHours" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm flex items-center"><Clock className="mr-2 h-4 w-4"/>Horas con Taquipnea</FormLabel>
                      <FormControl><Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} className="h-9"/></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
                <div>
                   <FormField control={form.control} name="sudoracion" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm flex items-center"><Wind className="mr-2 h-4 w-4"/>Nivel de Sudoración</FormLabel>
                      <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="ninguna" /></FormControl><Label className="font-normal text-xs">Ninguna</Label></FormItem>
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="leve" /></FormControl><Label className="font-normal text-xs">Leve</Label></FormItem>
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="moderada" /></FormControl><Label className="font-normal text-xs">Moderada</Label></FormItem>
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="profusa" /></FormControl><Label className="font-normal text-xs">Profusa</Label></FormItem>
                      </RadioGroup></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="sudoracionHours" render={({ field }) => (
                      <FormItem className="mt-4"><FormLabel className="text-sm flex items-center"><Clock className="mr-2 h-4 w-4"/>Horas de Sudoración</FormLabel>
                      <FormControl><Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} className="h-9"/></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetCalculator} className="w-full sm:w-auto">
                <RefreshCcw className="mr-2 h-4 w-4" /> Limpiar Todo
              </Button>
              <Button type="submit" className="w-full sm:w-auto">Calcular Balance Hídrico</Button>
            </div>
          </form>
        </Form>

        {result && (
          <div className="mt-8 p-6 border rounded-lg bg-muted/20">
            <h3 className="text-xl font-bold text-center mb-4">Resultado del Balance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-3 rounded-md bg-green-100 dark:bg-green-900/30 border border-green-200">
                <p className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center"><ArrowDown className="mr-1 h-4 w-4"/>Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-200">{result.totalIngresos.toFixed(1)} ml</p>
              </div>
               <div className="p-3 rounded-md bg-red-100 dark:bg-red-900/30 border border-red-200">
                <p className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center"><ArrowUp className="mr-1 h-4 w-4"/>Egresos Totales</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-200">{result.totalEgresos.toFixed(1)} ml</p>
              </div>
              <div className={cn("p-3 rounded-md border", result.balanceFinal >= 0 ? "bg-blue-100 dark:bg-blue-900/30 border-blue-200" : "bg-orange-100 dark:bg-orange-900/30 border-orange-200")}>
                <p className={cn("text-sm font-medium flex items-center", result.balanceFinal >= 0 ? "text-blue-700 dark:text-blue-300" : "text-orange-700 dark:text-orange-300")}><Wallet className="mr-1 h-4 w-4"/>Balance Final</p>
                <p className={cn("text-2xl font-bold", result.balanceFinal >= 0 ? "text-blue-600 dark:text-blue-200" : "text-orange-600 dark:text-orange-200")}>
                    {result.balanceFinal > 0 ? '+' : ''}{result.balanceFinal.toFixed(1)} ml
                </p>
              </div>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details">
                <AccordionTrigger>Ver Desglose del Cálculo</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600">Desglose Ingresos</h4>
                      {renderDetailRow("Vía Oral", result.detalles.ingestaOral)}
                      {renderDetailRow("Parenteral", result.detalles.parenteral)}
                      {renderDetailRow("Enteral", result.detalles.enteral)}
                      {renderDetailRow("Transfusiones", result.detalles.transfusiones)}
                      {renderDetailRow("Agua Endógena", result.detalles.aguaEndogena)}
                    </div>
                     <div>
                      <h4 className="font-semibold mb-2 text-red-600">Desglose Egresos</h4>
                      {renderDetailRow("Diuresis", result.detalles.diuresis)}
                      {renderDetailRow("Deposiciones", result.detalles.deposiciones)}
                      {renderDetailRow("Perspiración Insensible", result.detalles.perspiracionInsensible)}
                      {renderDetailRow("Pérdidas por Fiebre", result.detalles.fiebre)}
                      {renderDetailRow("Pérdidas por Sudoración", result.detalles.sudoracion)}
                      {renderDetailRow("Pérdidas por Respiración", result.detalles.respiracion)}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="formulas">
                <AccordionTrigger>Fórmulas Utilizadas</AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Agua Endógena:</strong> 12.5 ml × horas totales</p>
                  <p><strong>Perspiración Insensible:</strong> 0.5 ml × Peso (kg) × horas totales</p>
                  <p><strong>Fiebre:</strong> 6 ml × (Temperatura [°C] - 37) × horas con fiebre</p>
                  <p><strong>Sudoración Leve/Mod./Prof.:</strong> 10/20/40 ml × horas de sudoración</p>
                  <p><strong>Respiración:</strong> 1 ml × (FR - 20) × horas con taquipnea</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalculatorBalanceHidrico;
