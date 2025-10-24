"use client";

import React, { useState, useMemo, type FC, useCallback, lazy, Suspense } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calculator as CalculatorIconMain, ChevronRight, Heart, ListFilter, Search, Star, Wind, Activity, Bed, Users, Baby, Smile, Brain, ShieldCheck, AlertTriangle, ClipboardList, ClipboardCheck, ClipboardEdit, Frown, UserCheck, BarChart3, Repeat, Clock, Gauge as GaugeIcon, Weight, SlidersHorizontal, Droplet, Flame, CalendarHeart, TrendingUp, Syringe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CalculatorItem, CalculatorCategoryData } from '@/lib/types/calculators';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Import individual calculator components dynamically
const PaFiCalculator = lazy(() => import('@/components/calculators/calculator-pafi'));
const RoxIndexCalculator = lazy(() => import('@/components/calculators/calculator-rox'));
const IMCCalculator = lazy(() => import('@/components/calculators/calculator-imc'));
const EdadCorregidaCalculator = lazy(() => import('@/components/calculators/calculator-edad-corregida'));
const FPPCalculator = lazy(() => import('@/components/calculators/calculator-fpp'));
const ICTCalculator = lazy(() => import('@/components/calculators/calculator-ict'));
const PAMCalculator = lazy(() => import('@/components/calculators/calculator-pam'));
const BalanceHidricoCalculator = lazy(() => import('@/components/calculators/calculator-balance-hidrico'));
const RequerimientosHidricosCalculator = lazy(() => import('@/components/calculators/calculator-requerimientos-hidricos'));
const ConversorUnidadesCalculator = lazy(() => import('@/components/calculators/calculator-conversor-unidades'));
const HarrisBenedictCalculator = lazy(() => import('@/components/calculators/calculator-harris-benedict'));
const MifflinStJeorCalculator = lazy(() => import('@/components/calculators/calculator-mifflin-st-jeor'));
const GradienteAaCalculator = lazy(() => import('@/components/calculators/calculator-gradiente-Aa'));
const OiCalculator = lazy(() => import('@/components/calculators/calculator-oi'));
const TobinIndexCalculator = lazy(() => import('@/components/calculators/calculator-tobin'));
const VentilacionMinutoCalculator = lazy(() => import('@/components/calculators/calculator-ventilacion-minuto'));
const DVAAdrenalinaCalculator = lazy(() => import('@/components/calculators/calculator-dva-adrenalina'));
const DVANoradrenalinaCalculator = lazy(() => import('@/components/calculators/calculator-dva-noradrenalina'));
const DVADopaminaCalculator = lazy(() => import('@/components/calculators/calculator-dva-dopamina'));
const DVADobutaminaCalculator = lazy(() => import('@/components/calculators/calculator-dva-dobutamina'));
const DVANitroglicerinaCalculator = lazy(() => import('@/components/calculators/calculator-dva-nitroglicerina'));
const DVAFentaniloCalculator = lazy(() => import('@/components/calculators/calculator-dva-fentanilo'));
const DVAMidazolamCalculator = lazy(() => import('@/components/calculators/calculator-dva-midazolam'));
const BPCalculatorInfantil = lazy(() => import('@/components/calculators/calculator-bp-infantil'));


interface CalculatorsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  favoriteCalculators: string[];
  onToggleFavorite: (name: string) => void;
}

// Define calculator names as constants for easier reference
const PAFI_CALCULATOR_NAME = "PaFi (Índice de Kirby)";
const ROX_CALCULATOR_NAME = "Índice ROX";
const IMC_CALCULATOR_NAME = "IMC (Índice de Masa Corporal)";
const EDAD_CORREGIDA_CALCULATOR_NAME = "Edad Corregida (Prematuros)";
const FPP_CALCULATOR_NAME = "Fecha Probable de Parto (FPP)";
const CINTURA_TALLA_CALCULATOR_NAME = "Índice Cintura-Talla (ICT)";
const PAM_CALCULATOR_NAME = "Presión Arterial Media (PAM)";
const BALANCE_HIDRICO_CALCULATOR_NAME = "Balance Hídrico";
const REQUERIMIENTOS_HIDRICOS_BASALES_NAME = "Requerimientos Hídricos Basales";
const CONVERSOR_UNIDADES_NAME = "Conversor de Unidades";
const HARRIS_BENEDICT_NAME = "Fórmula de Harris-Benedict";
const MIFFLIN_ST_JEOR_NAME = "Fórmula de Mifflin-St Jeor";
const DVA_ADRENALINA_NAME = "Cálculo de Adrenalina (Epinefrina)";
const DVA_NORADRENALINA_NAME = "Cálculo de Noradrenalina (Norepinefrina)";
const DVA_DOPAMINA_NAME = "Cálculo de DVA: Dopamina";
const DVA_DOBUTAMINA_NAME = "Cálculo de DVA: Dobutamina";
const DVA_NITROGLICERINA_NAME = "Cálculo de Nitroglicerina";
const DVA_FENTANILO_NAME = "Cálculo de Fentanilo";
const DVA_MIDAZOLAM_NAME = "Cálculo de DVA: Midazolam";
const BP_INFANTIL_NAME = "Presión Arterial Infantil";

// Nuevas constantes para Respiratorio / Críticos
const A_A_GRADIENT_CALCULATOR_NAME = "Gradiente Alvéolo-arterial (A-a)";
const OI_CALCULATOR_NAME = "Índice de Oxigenación (OI)";
const TOBIN_INDEX_CALCULATOR_NAME = "Índice de Tobin (RSBI)";
const MINUTE_VENTILATION_CALCULATOR_NAME = "Ventilación Minuto (Ve)";


// Define Calculator Categories and Items
const ALL_CALCULATORS_DATA: CalculatorCategoryData[] = [
  {
    name: "Respiratorio / Críticos",
    icon: <Wind className="h-6 w-6 text-blue-500" />,
    items: [
      { name: PAFI_CALCULATOR_NAME, description: "Índice PaO₂/FiO₂ para SDRA.", implemented: true, component: PaFiCalculator, icon: <Activity className="h-4 w-4 text-blue-500" /> },
      { name: ROX_CALCULATOR_NAME, description: "Índice ROX para CNAF.", implemented: true, component: RoxIndexCalculator, icon: <Activity className="h-4 w-4 text-blue-500" /> },
      { name: A_A_GRADIENT_CALCULATOR_NAME, description: "Diferencia de O₂ alvéolo-arterial.", implemented: true, component: GradienteAaCalculator, icon: <BarChart3 className="h-4 w-4 text-blue-500" /> },
      { name: OI_CALCULATOR_NAME, description: "Severidad de hipoxemia en VM.", implemented: true, component: OiCalculator, icon: <GaugeIcon className="h-4 w-4 text-blue-500" /> },
      { name: TOBIN_INDEX_CALCULATOR_NAME, description: "Índice de respiración rápida y superficial (RSBI).", implemented: true, component: TobinIndexCalculator, icon: <Repeat className="h-4 w-4 text-blue-500" /> },
      { name: MINUTE_VENTILATION_CALCULATOR_NAME, description: "Volumen total de gas/min.", implemented: true, component: VentilacionMinutoCalculator, icon: <Clock className="h-4 w-4 text-blue-500" /> },
    ],
  },
  {
    name: "Cálculo de Infusiones",
    icon: <Syringe className="h-6 w-6 text-indigo-500" />,
    items: [
        { name: DVA_ADRENALINA_NAME, description: "Velocidad de infusión y dosis de Adrenalina.", implemented: true, component: DVAAdrenalinaCalculator, icon: <Droplet className="h-4 w-4 text-red-500" /> },
        { name: DVA_NORADRENALINA_NAME, description: "Velocidad de infusión y dosis de Noradrenalina.", implemented: true, component: DVANoradrenalinaCalculator, icon: <Droplet className="h-4 w-4 text-orange-500" /> },
        { name: DVA_DOPAMINA_NAME, description: "Velocidad de infusión y dosis de Dopamina.", implemented: true, component: DVADopaminaCalculator, icon: <Droplet className="h-4 w-4 text-blue-500" /> },
        { name: DVA_DOBUTAMINA_NAME, description: "Velocidad de infusión y dosis de Dobutamina.", implemented: true, component: DVADobutaminaCalculator, icon: <Droplet className="h-4 w-4 text-purple-500" /> },
        { name: DVA_NITROGLICERINA_NAME, description: "Velocidad de infusión de NTG (µg/min).", implemented: true, component: DVANitroglicerinaCalculator, icon: <Droplet className="h-4 w-4 text-pink-500" /> },
        { name: DVA_FENTANILO_NAME, description: "Velocidad de infusión de Fentanilo (µg/kg/hr).", implemented: true, component: DVAFentaniloCalculator, icon: <Droplet className="h-4 w-4 text-teal-500" /> },
        { name: DVA_MIDAZOLAM_NAME, description: "Velocidad de infusión de Midazolam (mg/kg/h).", implemented: true, component: DVAMidazolamCalculator, icon: <Droplet className="h-4 w-4 text-cyan-500" /> },
    ]
  },
  {
    name: "Cardiovascular",
    icon: <Heart className="h-6 w-6 text-red-500" />,
    items: [
      { name: IMC_CALCULATOR_NAME, description: "Índice de Masa Corporal.", implemented: true, component: IMCCalculator, icon: <Weight className="h-4 w-4 text-red-500" /> },
      { name: CINTURA_TALLA_CALCULATOR_NAME, description: "Relación cintura-estatura.", implemented: true, component: ICTCalculator, icon: <SlidersHorizontal className="h-4 w-4 text-red-500" /> },
      { name: PAM_CALCULATOR_NAME, description: "Presión Arterial Media.", implemented: true, component: PAMCalculator, icon: <GaugeIcon className="h-4 w-4 text-red-500" /> },
    ],
  },
  {
    name: "Pediatría-Obstetricia",
    icon: <Baby className="h-6 w-6 text-pink-500" />,
    items: [
      { name: EDAD_CORREGIDA_CALCULATOR_NAME, description: "Para prematuros.", implemented: true, component: EdadCorregidaCalculator, icon: <Baby className="h-4 w-4 text-pink-500" /> },
      { name: FPP_CALCULATOR_NAME, description: "Fecha Probable de Parto.", implemented: true, component: FPPCalculator, icon: <CalendarHeart className="h-4 w-4 text-pink-500" /> },
      { name: BP_INFANTIL_NAME, description: "Interpretación de Presión Arterial Infantil.", implemented: true, component: BPCalculatorInfantil, icon: <Heart className="h-4 w-4 text-pink-500" /> },
    ],
  },
  {
    name: "Fluidoterapia / Nutrición",
    icon: <Droplet className="h-6 w-6 text-green-500" />,
    items: [
      { name: BALANCE_HIDRICO_CALCULATOR_NAME, description: "Registro de ingresos y egresos.", implemented: true, component: BalanceHidricoCalculator, icon: <Droplet className="h-4 w-4 text-green-500"/> },
      { name: REQUERIMIENTOS_HIDRICOS_BASALES_NAME, description: "Cálculo de necesidades de fluidos (Holliday-Segar).", implemented: true, component: RequerimientosHidricosCalculator, icon: <Droplet className="h-4 w-4 text-green-500"/> },
      { name: HARRIS_BENEDICT_NAME, description: "Estimación del Gasto Energético Basal (GEB).", implemented: true, component: HarrisBenedictCalculator, icon: <Flame className="h-4 w-4 text-orange-500"/> },
      { name: MIFFLIN_ST_JEOR_NAME, description: "Estimación del Gasto Energético Basal (GEB), alternativa más moderna.", implemented: true, component: MifflinStJeorCalculator, icon: <Flame className="h-4 w-4 text-orange-500"/> },
    ],
  },
  {
    name: "Otros",
    icon: <ListFilter className="h-6 w-6 text-gray-500" />,
    items: [
        { name: CONVERSOR_UNIDADES_NAME, description: "Ej: mcg/kg/min a ml/hr.", implemented: true, component: ConversorUnidadesCalculator, icon: <CalculatorIconMain className="h-4 w-4 text-gray-500"/> },
    ]
  }
];


const CalculatorsDialog: FC<CalculatorsDialogProps> = ({
  isOpen,
  onOpenChange,
  favoriteCalculators,
  onToggleFavorite,
}) => {
  const [view, setView] = useState<'categories' | 'list' | 'calculator'>("categories");
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const resetDialogState = useCallback(() => {
    setView("categories");
    setActiveCategoryName(null);
    setSelectedCalculator(null);
    setSearchTerm('');
  }, []);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setTimeout(resetDialogState, 300);
  }, [onOpenChange, resetDialogState]);

  const handleCategorySelect = (categoryName: string) => {
    setActiveCategoryName(categoryName);
    setView("list");
    setSearchTerm('');
  };

  const handleCalculatorSelect = (calculator: CalculatorItem) => {
    if (calculator.implemented && calculator.component) {
      setSelectedCalculator(calculator);
      setView("calculator");
    } else {
      alert('La calculadora "' + calculator.name + '" estará disponible próximamente.');
    }
  };

  const allCalculatorsList = useMemo(() => ALL_CALCULATORS_DATA.flatMap(cat => cat.items.map(item => ({ ...item, categoryName: cat.name }))), []);

  const favoriteCalculatorsList = useMemo(() => {
    return allCalculatorsList.filter(calc => favoriteCalculators.includes(calc.name));
  }, [allCalculatorsList, favoriteCalculators]);

  const displayedCategories = useMemo(() => {
    const baseCategories = [...ALL_CALCULATORS_DATA];
    if (favoriteCalculatorsList.length > 0) {
      return [
        { name: "Favoritos", icon: <Star className="h-6 w-6 text-yellow-400" />, items: favoriteCalculatorsList },
        ...baseCategories,
      ];
    }
    return baseCategories;
  }, [favoriteCalculatorsList]);


  const filteredCalculators = useMemo(() => {
    if (view === 'list' && activeCategoryName) {
      const category = displayedCategories.find(cat => cat.name === activeCategoryName);
      if (!category) return [];
      if (!searchTerm) return category.items;
      return category.items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return [];
  }, [view, activeCategoryName, displayedCategories, searchTerm]);


  const SelectedCalculatorComponent = selectedCalculator?.component;

  const dialogTitle =
    view === "categories"
      ? "Calculadoras Clínicas"
      : view === "list" && activeCategoryName
      ? `Calculadoras - ${activeCategoryName}`
      : view === "calculator" && selectedCalculator
      ? `Calculadora: ${selectedCalculator.name}`
      : "Calculadoras Clínicas";

  if (!isOpen && typeof window !== 'undefined') return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="h-[90vh] sm:h-[85vh] md:h-[600px] sm:max-w-2xl flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center text-xl sm:text-2xl">
            <CalculatorIconMain className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            {dialogTitle}
          </DialogTitle>
          {view === "categories" && (
            <DialogDescription className="text-sm">
              Selecciona una categoría para ver las calculadoras disponibles.
            </DialogDescription>
          )}
           {(view === 'list' && activeCategoryName) && (
            <div className="relative pt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                type="search"
                placeholder={`Buscar en ${activeCategoryName}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full h-9 text-sm"
                />
            </div>
            )}
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <ScrollArea className="h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={view + (activeCategoryName ?? "") + (selectedCalculator?.name ?? "")}
                initial={{ opacity: 0, x: view === 'calculator' ? 20 : (view === 'list' && activeCategoryName ? 20 : 0) }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                {view === "categories" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {displayedCategories.map((category) => (
                      <Button
                        key={category.name}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-start text-left shadow hover:shadow-md transition-shadow"
                        onClick={() => handleCategorySelect(category.name)}
                      >
                        <div className="flex items-center mb-2">
                          {category.icon}
                          <span className="ml-2 text-md font-semibold">{category.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {category.items.length} calculadora{category.items.length !== 1 ? 's' : ''}
                        </p>
                      </Button>
                    ))}
                  </div>
                )}

                {view === "list" && activeCategoryName && (
                  <div className="space-y-3">
                    {filteredCalculators.length > 0 ? filteredCalculators.map((calc) => (
                      <div
                        key={calc.name}
                        role="button"
                        tabIndex={0}
                        className={cn(
                            "w-full h-auto p-3 flex justify-between items-center text-left rounded-md cursor-pointer",
                            "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring",
                            "border border-border" 
                        )}
                        onClick={() => handleCalculatorSelect(calc)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCalculatorSelect(calc); }}
                      >
                        <div className="flex items-center flex-grow">
                           {calc.icon && <span className="mr-3">{calc.icon}</span>}
                          <div className="flex-grow">
                            <p className="font-medium">{calc.name}</p>
                            {calc.description && <p className="text-xs text-muted-foreground">{calc.description}</p>}
                          </div>
                        </div>
                        <div className="flex items-center flex-shrink-0 ml-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="mr-2 h-7 w-7"
                                onClick={(e) => { e.stopPropagation(); onToggleFavorite(calc.name); }}
                                title={favoriteCalculators.includes(calc.name) ? "Quitar de favoritos" : "Añadir a favoritos"}
                            >
                                <Star className={cn("h-4 w-4", favoriteCalculators.includes(calc.name) ? "fill-yellow-400 text-yellow-500" : "text-muted-foreground")} />
                            </Button>
                            {calc.implemented ? <ChevronRight className="h-4 w-4 text-muted-foreground" /> : <span className="text-xs text-amber-600 dark:text-amber-400">Próximamente</span>}
                        </div>
                      </div>
                    )) : (
                         <p className="text-sm text-muted-foreground text-center py-4">No se encontraron calculadoras.</p>
                    )}
                  </div>
                )}

                {view === "calculator" && SelectedCalculatorComponent && (
                  <Suspense fallback={
                    <div className="flex justify-center items-center p-8">
                        <div className="w-full max-w-lg space-y-4 animate-pulse">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-6 w-full mb-4" />
                            <div className="space-y-6 pt-4">
                                <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                                <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                                <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                            </div>
                        </div>
                    </div>
                  }>
                    <SelectedCalculatorComponent />
                  </Suspense>
                )}
                 {view === "calculator" && !SelectedCalculatorComponent && selectedCalculator && !selectedCalculator.implemented && (
                    <div className="text-center p-8">
                        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">{selectedCalculator.name}</h3>
                        <p className="text-muted-foreground">Esta calculadora estará disponible próximamente.</p>
                    </div>
                )}
              </motion.div>
            </AnimatePresence>
          </ScrollArea>
        </div>

        <DialogFooter className="p-6 pt-3 border-t bg-background sticky bottom-0 z-10">
          {(view === "list" || view === "calculator") && (
            <Button
              variant="outline"
              onClick={() => {
                if (view === "calculator") {
                  setView("list");
                  setSelectedCalculator(null); 
                } else { 
                  setView("categories");
                  setActiveCategoryName(null);
                }
              }}
              className="mr-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          )}
          <Button variant="outline" onClick={handleClose} className={view === 'categories' ? 'w-full' : ''}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalculatorsDialog;
