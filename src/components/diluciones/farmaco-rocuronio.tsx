
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const RocuronioCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Bloqueante neuromuscular no despolarizante de inicio rápido y duración intermedia.")}
        {renderDetailSection("Presentación", "Vial de 50 mg / 5 ml (10 mg/ml).")}
        {renderDetailSection("Indicaciones", "Coadyuvante de la anestesia general para facilitar la intubación endotraqueal y para conseguir la relajación de la musculatura esquelética.")}
        {renderDetailSection("Dosis", "Intubación: 0.6-1.2 mg/kg. Mantenimiento: Bolo de 0.1-0.2 mg/kg o infusión de 5-12 mcg/kg/min.")}
        {renderDetailSection("Administración", "Bolo intravenoso rápido o infusión continua.")}
        {renderDetailSection("Antídoto", "Sugammadex (específico) o Neostigmina (con anticolinérgico).")}
        {renderDetailSection("RAM / Observaciones", "Reacciones en el sitio de inyección. Reacciones anafilácticas (raras). Taquicardia. Requiere monitoreo de la función neuromuscular.")}
      </Accordion>
    </ScrollArea>
  );
};

export default RocuronioCard;
