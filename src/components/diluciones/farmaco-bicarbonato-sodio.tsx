
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const BicarbonatoDeSodioCard: React.FC = () => {
    
  const renderDetailSection = (title: string, content?: string | React.ReactNode) => {
    if (!content) return null;
    return (
      <AccordionItem value={title}>
        <AccordionTrigger className="text-sm font-semibold">{title}</AccordionTrigger>
        <AccordionContent>
          <div className="text-sm whitespace-pre-wrap">{content}</div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <ScrollArea className="h-full pr-4 -mr-4">
      <Accordion type="multiple" defaultValue={['Acción Terapéutica', 'Presentación', 'Dosis']} className="w-full">
        {renderDetailSection("Acción Terapéutica", "Alcalinizante sistémico. Aumenta el bicarbonato plasmático, amortigua el exceso de iones de hidrógeno y eleva el pH sanguíneo.")}
        {renderDetailSection("Presentación", "Ampolla al 8.4% (1 Molar): 1 mEq/ml. Viales de 10 ml y 100 ml.")}
        {renderDetailSection("Indicaciones", "Acidosis metabólica severa (pH < 7.1-7.2), paro cardíaco con acidosis preexistente, hiperkalemia severa, intoxicación por antidepresivos tricíclicos o salicilatos.")}
        {renderDetailSection("Dosis", "Acidosis severa / PCR: 1 mEq/kg IV inicialmente. Dosis posteriores guiadas por gases en sangre. No se recomienda de forma rutinaria en PCR.")}
        {renderDetailSection("Dilución", "Para infusión, puede diluirse en SG 5% para evitar hipertonicidad. La dilución depende del objetivo terapéutico y del estado del paciente (ej. 150 mEq en 1L de SG 5%).")}
        {renderDetailSection("Administración", "Bolo IV lento en situaciones de emergencia. Infusión IV para corrección gradual. NUNCA administrar por vía IM o SC.")}
        {renderDetailSection("RAM / Observaciones", "Alcalosis metabólica, hipernatremia, hipocalcemia, sobrecarga de volumen. La extravasación puede causar necrosis tisular. Incompatible con muchas soluciones y medicamentos (ej. catecolaminas, calcio). Verificar compatibilidad antes de mezclar. La administración rápida puede causar hemorragia intracraneal en neonatos.")}
      </Accordion>
    </ScrollArea>
  );
};

export default BicarbonatoDeSodioCard;
