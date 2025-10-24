"use client";

import React, { useState, lazy, Suspense, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Baby, TrendingUp, ClipboardList, ArrowLeft, Heart } from "lucide-react";
import { Skeleton } from '../ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area";
import GrowthCharts from '@/components/dashboard/growth-charts';
import BPCalculatorInfantil from '@/components/calculators/calculator-bp-infantil';

// Importar las escalas pediátricas
const PautaBreveDSMForm = lazy(() => import('@/components/escalas/form-pauta-breve-dsm'));
const EEDPScaleForm = lazy(() => import('@/components/escalas/form-eedp'));
const TEPSIScaleForm = lazy(() => import('@/components/escalas/form-tepsi'));
const EdimburgoScaleForm = lazy(() => import('@/components/escalas/form-edimburgo'));
const MchatRfForm = lazy(() => import('@/components/escalas/form-mchat-rf'));
const ScoreIRACalculator = lazy(() => import('@/components/escalas/form-score-ira'));
const PENSModificadoForm = lazy(() => import('@/components/escalas/form-pens-modificado'));
const PautaRiesgoMalnutricionExcesoForm = lazy(() => import('@/components/escalas/form-malnutricion-exceso'));


interface SaludInfantilDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type View = 'main' | 'antropometria' | 'bp' | 'escalas' | 'escala-detalle';

const pediatricScales = [
    { id: 'pauta-breve-dsm', name: 'Pauta Breve de Desarrollo Psicomotor (PB-DP)', description: 'Evaluación del desarrollo entre 4 y 24 meses.', component: PautaBreveDSMForm },
    { id: 'eedp', name: 'Escala de Evaluación del Desarrollo Psicomotor (EEDP)', description: 'Evaluación del desarrollo de 0 a 24 meses.', component: EEDPScaleForm },
    { id: 'tepsi', name: 'TEPSI (Test de Desarrollo Psicomotor)', description: 'Evaluación del desarrollo psicomotor en niños de 2 a 5 años.', component: TEPSIScaleForm },
    { id: 'score-ira', name: 'Score IRA (Riesgo de Muerte por Neumonía)', description: 'Riesgo de muerte en niños de 3m a 5a con neumonía.', component: ScoreIRACalculator },
    { id: 'mchat-rf', name: 'M-CHAT-R/F', description: 'Tamizaje de Autismo en niños pequeños (16-30 meses).', component: MchatRfForm },
    { id: 'malnutricion-exceso', name: 'Pauta de Riesgo de Malnutrición por Exceso', description: 'Factores de riesgo en niños eutróficos.', component: PautaRiesgoMalnutricionExcesoForm },
    { id: 'edimburgo', name: 'Escala de Depresión Postparto de Edimburgo (EPDS)', description: 'Cribado de síntomas de depresión posparto.', component: EdimburgoScaleForm },
    { id: 'pens', name: 'Protocolo de Evaluación Neurosensorial (PENS)', description: 'Evaluación neurosensorial para lactantes de 1 y 2 meses.', component: PENSModificadoForm },
];

export default function SaludInfantilDialog({ isOpen, onOpenChange }: SaludInfantilDialogProps) {
  const [view, setView] = useState<View>('main');
  const [selectedScale, setSelectedScale] = useState<typeof pediatricScales[0] | null>(null);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setTimeout(() => {
        setView('main');
        setSelectedScale(null);
    }, 300);
  }, [onOpenChange]);
  
  const handleBack = () => {
    if (view === 'escala-detalle') {
        setView('escalas');
        setSelectedScale(null);
    } else {
        setView('main');
        setSelectedScale(null);
    }
  };
  
  const handleScaleSelect = (scale: typeof pediatricScales[0]) => {
    setSelectedScale(scale);
    setView('escala-detalle');
  };

  const SelectedComponent = 
      view === 'antropometria' ? GrowthCharts 
    : view === 'bp' ? BPCalculatorInfantil
    : view === 'escala-detalle' && selectedScale ? selectedScale.component 
    : null;

  const getDialogTitle = () => {
    switch(view) {
        case 'antropometria': return "Antropometría";
        case 'bp': return "Interpretación de Presión Arterial";
        case 'escalas': return "Escalas de Evaluación Pediátrica";
        case 'escala-detalle': return selectedScale?.name || "Escala";
        default: return "Salud Infantil y Adolescente";
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col p-0">
            <DialogHeader className="p-6 pb-4 border-b">
                 <DialogTitle className="flex items-center text-2xl">
                    {view !== 'main' && (
                        <Button variant="ghost" size="icon" className="mr-2" onClick={handleBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <Baby className="mr-2 h-6 w-6 text-primary" />
                    {getDialogTitle()}
                </DialogTitle>
                <DialogDescription>
                    {view === 'main' ? 'Herramientas y guías para la evaluación pediátrica.' : 
                     view === 'escalas' ? 'Seleccione una escala para continuar.' :
                     'Utilice la herramienta seleccionada.'}
                </DialogDescription>
            </DialogHeader>

            <ScrollArea className="flex-grow">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, x: view !== 'main' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="p-6 h-full"
                    >
                        {view === 'main' && (
                            <div className="space-y-4">
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start p-4 h-auto text-left"
                                    onClick={() => setView('antropometria')}
                                >
                                    <TrendingUp className="mr-3 h-5 w-5 text-cyan-500" />
                                    <div>
                                        <p className="font-semibold">Antropometría</p>
                                        <p className="text-xs text-muted-foreground">Evalúa el crecimiento infantil y adolescente.</p>
                                    </div>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start p-4 h-auto text-left"
                                    onClick={() => setView('bp')}
                                >
                                    <Heart className="mr-3 h-5 w-5 text-red-500" />
                                    <div>
                                        <p className="font-semibold">Interpretación de Presión Arterial</p>
                                        <p className="text-xs text-muted-foreground">Evalúa la PA en niños de 0 a 12 años.</p>
                                    </div>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start p-4 h-auto text-left"
                                    onClick={() => setView('escalas')}
                                >
                                    <ClipboardList className="mr-3 h-5 w-5 text-pink-500" />
                                    <div>
                                        <p className="font-semibold">Escalas de Evaluación</p>
                                        <p className="text-xs text-muted-foreground">Instrumentos de tamizaje pediátrico.</p>
                                    </div>
                                </Button>
                            </div>
                        )}
                        
                         {view === 'escalas' && (
                            <div className="space-y-2">
                                {pediatricScales.map(scale => (
                                     <Button 
                                        key={scale.id}
                                        variant="outline" 
                                        className="w-full justify-start p-4 h-auto text-left"
                                        onClick={() => handleScaleSelect(scale)}
                                    >
                                        <ClipboardList className="mr-3 h-5 w-5 text-pink-500" />
                                        <div>
                                            <p className="font-semibold">{scale.name}</p>
                                            <p className="text-xs text-muted-foreground">{scale.description}</p>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        )}

                        {SelectedComponent && (
                             <Suspense fallback={
                                <div className="space-y-4 animate-pulse">
                                    <Skeleton className="h-8 w-3/4" />
                                    <Skeleton className="h-6 w-full mb-4" />
                                    <div className="space-y-6 pt-4"><div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div><div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div></div>
                                </div>
                            }>
                                <SelectedComponent />
                            </Suspense>
                        )}
                    </motion.div>
                </AnimatePresence>
            </ScrollArea>

            <DialogFooter className="p-6 pt-4 border-t">
                <Button variant="outline" onClick={handleClose}>
                    Cerrar
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
