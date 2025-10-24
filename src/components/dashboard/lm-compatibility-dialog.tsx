
"use client";

import { useState, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LMCompatibilityEntry, LMRiskLevelKey, PregnancyCategory } from '@/lib/types';
import { LM_COMPATIBILITY_DATA, LM_RISK_LEVEL_INFO, PREGNANCY_CATEGORY_INFO } from '@/lib/lm-compatibility-data';
import { Baby, Search, Info, HeartPulse, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface LMCompatibilityDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LMCompatibilityDialog({ isOpen, onOpenChange }: LMCompatibilityDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<LMCompatibilityEntry | null>(null);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return []; 
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return LM_COMPATIBILITY_DATA.filter(med =>
      med.name.toLowerCase().includes(lowerSearchTerm)
    );
  }, [searchTerm]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setTimeout(() => {
      setSearchTerm('');
      setSelectedDrug(null);
    }, 300);
  }, [onOpenChange]);

  const handleDrugSelect = (drug: LMCompatibilityEntry) => {
    setSelectedDrug(drug);
  };
  
  const handleBack = () => {
    setSelectedDrug(null);
  };

  const lmRiskInfo = selectedDrug ? LM_RISK_LEVEL_INFO[selectedDrug.riskLevel] : null;
  const pregnancyRiskInfo = selectedDrug && selectedDrug.pregnancyCategory ? PREGNANCY_CATEGORY_INFO[selectedDrug.pregnancyCategory] : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full sm:max-w-lg max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="flex items-center text-lg sm:text-2xl">
                 {selectedDrug && (
                    <Button variant="ghost" size="icon" className="mr-2 h-7 w-7" onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                )}
                <Baby className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                {selectedDrug ? selectedDrug.name : "Compatibilidad LM y Embarazo"}
            </DialogTitle>
             <DialogDescription className="text-xs sm:text-sm pl-8">
                {selectedDrug ? `Detalles de compatibilidad para ${selectedDrug.name}.` : "Guía de consulta rápida sobre medicamentos."}
            </DialogDescription>
        </DialogHeader>

        <div className="flex-grow flex flex-col min-h-0">
           <AnimatePresence mode="wait">
            {selectedDrug ? (
                 <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 pt-2 space-y-4"
                >
                    {lmRiskInfo && (
                         <div className="flex items-start gap-3">
                            <Baby className={cn("h-5 w-5 mt-0.5 flex-shrink-0", lmRiskInfo.colorClass)} />
                            <div>
                                <p className="text-sm font-semibold">Lactancia:</p>
                                <p className={cn("text-sm", lmRiskInfo.colorClass)}>
                                    <strong className="font-bold">{lmRiskInfo.text}</strong>. {lmRiskInfo.secondaryText}
                                </p>
                            </div>
                        </div>
                    )}
                    {pregnancyRiskInfo && (
                        <div className="flex items-start gap-3">
                            <HeartPulse className={cn("h-5 w-5 mt-0.5 flex-shrink-0", pregnancyRiskInfo.colorClass)} />
                            <div>
                                <p className="text-sm font-semibold">Embarazo (Cat. FDA {selectedDrug.pregnancyCategory}):</p>
                                <p className={cn("text-sm", pregnancyRiskInfo.colorClass)}>
                                    <strong className="font-bold">{pregnancyRiskInfo.text}</strong>. {pregnancyRiskInfo.description}
                                </p>
                            </div>
                        </div>
                    )}
                 </motion.div>
            ) : (
                <motion.div
                    key="list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="flex-grow flex flex-col min-h-0 pt-4 px-6"
                >
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        type="text"
                        placeholder="Buscar medicamento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 text-sm sm:text-base"
                        />
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <ScrollArea className="h-full">
                            {searchTerm.trim() && searchResults.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No se encontraron coincidencias.</p>
                            )}
                            {searchResults.length > 0 && (
                                <div className="space-y-1">
                                    {searchResults.map(med => (
                                        <Button key={med.id} variant="ghost" className="w-full justify-start text-left h-auto py-2" onClick={() => handleDrugSelect(med)}>
                                            {med.name}
                                        </Button>
                                    ))}
                                </div>
                            )}
                            {!searchTerm.trim() && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Ingresa el nombre de un medicamento para ver su compatibilidad.
                                </p>
                            )}
                        </ScrollArea>
                    </div>
                 </motion.div>
            )}
           </AnimatePresence>
        </div>

        <div className="p-6 pt-2">
            <div className="text-[10px] sm:text-xs text-muted-foreground p-2 border rounded-md bg-muted/50">
                <Info className="inline h-3 w-3 mr-1" />
                La información es referencial. No reemplaza el juicio clínico. Fuente principal: e-lactancia.org.
            </div>
        </div>

        <DialogFooter className="p-6 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
