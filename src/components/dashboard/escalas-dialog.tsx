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
import { ArrowLeft, ChevronRight, Star, FileText, SlidersHorizontal, Search, Activity, Bed, Users, Baby, Smile, Brain, ShieldCheck, AlertTriangle, ClipboardList, ClipboardCheck, ClipboardEdit, Frown, UserCheck, TestTube, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ScaleItem, ScaleCategoryData } from '@/lib/types';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Import individual scale components dynamically
const NortonScaleForm = lazy(() => import('@/components/escalas/form-norton'));
const BarthelIndexForm = lazy(() => import('@/components/escalas/form-barthel'));
const GlasgowComaScaleForm = lazy(() => import('@/components/escalas/form-glasgow'));
const NIHSSForm = lazy(() => import('@/components/escalas/form-nihss'));
const CAMICUForm = lazy(() => import('@/components/escalas/form-cam-icu'));
const NuDESCForm = lazy(() => import('@/components/escalas/form-nu-desc'));
const BradenScaleForm = lazy(() => import('@/components/escalas/form-braden'));
const BradenQScaleForm = lazy(() => import('@/components/escalas/form-braden-q'));
const EminaScaleForm = lazy(() => import('@/components/escalas/form-emina'));
const MorseScaleForm = lazy(() => import('@/components/escalas/form-morse'));
const HendrichScaleForm = lazy(() => import('@/components/escalas/form-hendrich'));
const TinettiScaleForm = lazy(() => import('@/components/escalas/form-tinetti'));
const MiniBestestScaleForm = lazy(() => import('@/components/escalas/form-minibestest'));
const BergBalanceScaleForm = lazy(() => import('@/components/escalas/form-berg'));
const EFAMScaleForm = lazy(() => import('@/components/escalas/form-efam'));
const MMSEAbreviadoForm = lazy(() => import('@/components/escalas/form-mmse-abreviado'));
const YesavageScaleForm = lazy(() => import('@/components/escalas/form-yesavage'));
const PfefferFAQForm = lazy(() => import('@/components/escalas/form-pfeffer'));
const RASSScaleForm = lazy(() => import('@/components/escalas/form-rass'));
const GoldbergScaleForm = lazy(() => import('@/components/escalas/form-goldberg'));
const AUDITForm = lazy(() => import('@/components/escalas/form-audit'));
const ASSISTForm = lazy(() => import('@/components/escalas/form-assist'));


interface EscalasDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  favoriteScales: string[];
  onToggleFavorite: (name: string) => void;
}

const ALL_SCALES_DATA: ScaleCategoryData[] = [
  {
    name: "Riesgo de Caídas",
    icon: <Activity className="h-6 w-6 text-orange-500" />,
    items: [
      { name: "Escala de Morse", description: "Evaluación del riesgo de caídas.", implemented: true, component: MorseScaleForm, icon: <FileText className="h-4 w-4 text-orange-500" /> },
      { name: "Escala Hendrich II", description: "Modelo de riesgo de caídas Hendrich II.", implemented: true, component: HendrichScaleForm, icon: <AlertTriangle className="h-4 w-4 text-orange-500" /> },
      { name: "Escala de Tinetti (equilibrio y marcha)", description: "Evaluación de la marcha y el equilibrio.", implemented: true, component: TinettiScaleForm, icon: <ClipboardList className="h-4 w-4 text-orange-500" /> },
      { name: "Escala Mini-BESTest", description: "Mini Balance Evaluation Systems Test.", implemented: true, component: MiniBestestScaleForm, icon: <FileText className="h-4 w-4 text-orange-500" /> },
      { name: "Escala de Equilibrio de Berg", description: "Evaluación del equilibrio estático y dinámico.", implemented: true, component: BergBalanceScaleForm, icon: <FileText className="h-4 w-4 text-orange-500" /> },
    ],
  },
  {
    name: "Riesgo de LPP",
    icon: <Bed className="h-6 w-6 text-red-500" />,
    items: [
      { name: "Escala de Norton", description: "Riesgo de úlceras por presión.", implemented: true, component: NortonScaleForm, icon: <FileText className="h-4 w-4 text-red-500" /> },
      { name: "Escala de Braden", description: "Valoración del riesgo de LPP.", implemented: true, component: BradenScaleForm, icon: <ShieldCheck className="h-4 w-4 text-red-500" /> },
      { name: "Escala Braden Q", description: "Valoración del riesgo de LPP en pediatría.", implemented: true, component: BradenQScaleForm, icon: <Baby className="h-4 w-4 text-pink-500" /> },
      { name: "Escala EMINA", description: "Evaluación del riesgo de desarrollar LPP.", implemented: true, component: EminaScaleForm, icon: <FileText className="h-4 w-4 text-red-500" /> },
    ],
  },
  {
    name: "Adulto Mayor",
    icon: <Users className="h-6 w-6 text-teal-500" />,
    items: [
      { name: "EFAM (Examen Funcional del Adulto Mayor)", description: "Valoración funcional y cognitiva (EFAM-Chile).", implemented: true, component: EFAMScaleForm, icon: <ClipboardCheck className="h-4 w-4 text-teal-500" /> },
      { name: "Índice de Barthel", description: "Actividades básicas de la vida diaria.", implemented: true, component: BarthelIndexForm, icon: <FileText className="h-4 w-4 text-teal-500" /> },
      { name: "Evaluación Cognitiva (MMSE Abreviado)", description: "Cribado cognitivo (Mini-Mental State Examination).", implemented: true, component: MMSEAbreviadoForm, icon: <ClipboardEdit className="h-4 w-4 text-teal-500" /> },
      { name: "Escala de Yesavage (Depresión Geriátrica)", description: "Cribado de síntomas depresivos (GDS-15 o GDS-5).", implemented: true, component: YesavageScaleForm, icon: <Frown className="h-4 w-4 text-teal-500" /> },
      { name: "Cuestionario de Pfeffer (FAQ)", description: "Actividades instrumentales de la vida diaria (informante).", implemented: true, component: PfefferFAQForm, icon: <UserCheck className="h-4 w-4 text-teal-500" /> },
    ],
  },
  {
    name: "Salud Mental",
    icon: <Smile className="h-6 w-6 text-green-500" />,
    items: [
      { name: "Escala de Goldberg (Ansiedad/Depresión)", description: "Cribado de ansiedad y depresión.", implemented: true, component: GoldbergScaleForm, icon: <FileText className="h-4 w-4 text-green-500" /> },
      { name: "Cuestionario AUDIT (Consumo de Alcohol)", description: "Detección de consumo de riesgo de alcohol.", implemented: true, component: AUDITForm, icon: <TestTube className="h-4 w-4 text-green-500" /> },
      { name: "Cuestionario ASSIST (Consumo de Drogas)", description: "Detección de consumo de riesgo de otras sustancias.", implemented: true, component: ASSISTForm, icon: <TestTube className="h-4 w-4 text-green-500" /> },
    ],
  },
  {
    name: "Neurología / Críticos",
    icon: <Brain className="h-6 w-6 text-purple-500" />,
    items: [
      { name: "Escala de Coma de Glasgow (GCS)", description: "Nivel de conciencia.", implemented: true, component: GlasgowComaScaleForm, icon: <FileText className="h-4 w-4 text-purple-500" /> },
      { name: "Escala NIHSS", description: "Severidad del ictus.", implemented: true, component: NIHSSForm, icon: <ClipboardEdit className="h-4 w-4 text-purple-500" /> },
      { name: "CAM-ICU", description: "Detección de delirium en UCI.", implemented: true, component: CAMICUForm, icon: <FileText className="h-4 w-4 text-purple-500" /> },
      { name: "Nu-DESC", description: "Detección de delirium por enfermería.", implemented: true, component: NuDESCForm, icon: <FileText className="h-4 w-4 text-purple-500" /> },
      { name: "Escala RASS (Sedación-Agitación de Richmond)", description: "Nivel de sedación y agitación.", implemented: true, component: RASSScaleForm, icon: <UserCheck className="h-4 w-4 text-purple-500" /> },
    ],
  },
];

const EscalasDialog: FC<EscalasDialogProps> = ({
  isOpen,
  onOpenChange,
  favoriteScales,
  onToggleFavorite,
}) => {
  const [view, setView] = useState<'categories' | 'list' | 'scale'>("categories");
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);
  const [selectedScale, setSelectedScale] = useState<ScaleItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const resetDialogState = useCallback(() => {
    setView("categories");
    setActiveCategoryName(null);
    setSelectedScale(null);
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

  const handleScaleSelect = (scale: ScaleItem) => {
    if (scale.implemented && scale.component) {
      setSelectedScale(scale);
      setView("scale");
    } else {
      alert('La escala "' + scale.name + '" estará disponible próximamente.');
    }
  };

  const allScalesList = useMemo(() => ALL_SCALES_DATA.flatMap(cat => cat.items.map(item => ({ ...item, categoryName: cat.name }))), []);

  const favoriteScalesList = useMemo(() => {
    return allScalesList.filter(calc => favoriteScales.includes(calc.name));
  }, [allScalesList, favoriteScales]);

  const displayedCategories = useMemo(() => {
    const baseCategories = [...ALL_SCALES_DATA];
    if (favoriteScalesList.length > 0) {
      return [
        { name: "Favoritos", icon: <Star className="h-6 w-6 text-yellow-400" />, items: favoriteScalesList },
        ...baseCategories,
      ];
    }
    return baseCategories;
  }, [favoriteScalesList]);

  const filteredScales = useMemo(() => {
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

  const SelectedScaleComponent = selectedScale?.component;

  const dialogTitle =
    view === "categories"
      ? "Escalas de Valoración"
      : view === "list" && activeCategoryName
      ? `Escalas - ${activeCategoryName}`
      : view === "scale" && selectedScale
      ? `Escala: ${selectedScale.name}`
      : "Escalas de Valoración";

  if (!isOpen && typeof window !== 'undefined') return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="h-[90vh] sm:h-[85vh] md:h-[600px] sm:max-w-2xl flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center text-xl sm:text-2xl">
            <SlidersHorizontal className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-primary" /> {/* Icono General para Escalas */}
            {dialogTitle}
          </DialogTitle>
          {view === "categories" && (
            <DialogDescription className="text-sm">
              Selecciona una categoría para ver las escalas disponibles.
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
                key={view + (activeCategoryName ?? "") + (selectedScale?.name ?? "")}
                initial={{ opacity: 0, x: view === 'scale' ? 20 : (view === 'list' && activeCategoryName ? 20 : 0) }}
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
                          {category.items.length} escala{category.items.length !== 1 ? 's' : ''}
                        </p>
                      </Button>
                    ))}
                  </div>
                )}

                {view === "list" && activeCategoryName && (
                  <div className="space-y-3">
                    {filteredScales.length > 0 ? filteredScales.map((scale) => (
                      <div
                        key={scale.name}
                        role="button"
                        tabIndex={0}
                        className={cn(
                            "w-full h-auto p-3 flex justify-between items-center text-left rounded-md cursor-pointer",
                            "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring",
                            "border border-border"
                        )}
                        onClick={() => handleScaleSelect(scale)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleScaleSelect(scale); }}
                      >
                        <div className="flex items-center flex-grow">
                           {scale.icon && <span className="mr-3">{scale.icon}</span>}
                          <div className="flex-grow">
                            <p className="font-medium">{scale.name}</p>
                            {scale.description && <p className="text-xs text-muted-foreground">{scale.description}</p>}
                          </div>
                        </div>
                        <div className="flex items-center flex-shrink-0 ml-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="mr-2 h-7 w-7"
                                onClick={(e) => { e.stopPropagation(); onToggleFavorite(scale.name); }}
                                title={favoriteScales.includes(scale.name) ? "Quitar de favoritos" : "Añadir a favoritos"}
                            >
                                <Star className={cn("h-4 w-4", favoriteScales.includes(scale.name) ? "fill-yellow-400 text-yellow-500" : "text-muted-foreground")} />
                            </Button>
                            {scale.implemented ? <ChevronRight className="h-4 w-4 text-muted-foreground" /> : <span className="text-xs text-amber-600 dark:text-amber-400">Próximamente</span>}
                        </div>
                      </div>
                    )) : (
                         <p className="text-sm text-muted-foreground text-center py-4">No se encontraron escalas en esta categoría.</p>
                    )}
                  </div>
                )}

                {view === "scale" && SelectedScaleComponent && (
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
                    <SelectedScaleComponent />
                  </Suspense>
                )}
                 {view === "scale" && !SelectedScaleComponent && selectedScale && !selectedScale.implemented && (
                    <div className="text-center p-8">
                        <SlidersHorizontal className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">{selectedScale.name}</h3>
                        <p className="text-muted-foreground">Esta escala estará disponible próximamente.</p>
                    </div>
                )}
              </motion.div>
            </AnimatePresence>
          </ScrollArea>
        </div>

        <DialogFooter className="p-6 pt-3 border-t bg-background sticky bottom-0 z-10">
          {(view === "list" || view === "scale") && (
            <Button
              variant="outline"
              onClick={() => {
                if (view === "scale") {
                  setView("list");
                  setSelectedScale(null);
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

export default EscalasDialog;
