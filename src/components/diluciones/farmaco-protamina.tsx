
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const ProtaminaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antídoto de la heparina. Se une a la heparina para formar un complejo inactivo.")}
        {renderDetailSection("Presentación", "Ampolla de 50 mg / 5 ml (10 mg/ml).")}
        {renderDetailSection("Indicaciones", "Reversión de la anticoagulación por heparina no fraccionada (HNF).")}
        {renderDetailSection("Dosis", "1 mg de protamina neutraliza aproximadamente 100 UI de heparina. La dosis depende de la cantidad de heparina administrada y el tiempo transcurrido.")}
        {renderDetailSection("Administración", "Inyección intravenosa LENTA, no exceder 50 mg en un período de 10 minutos.")}
        {renderDetailSection("RAM / Observaciones", "La administración rápida puede causar hipotensión severa, bradicardia, y reacciones anafilactoides. Riesgo aumentado de reacción en pacientes alérgicos al pescado (la protamina se deriva del esperma de salmón) y en pacientes diabéticos que usan insulina NPH.")}
      </Accordion>
    </ScrollArea>
  );
};

export default ProtaminaCard;
