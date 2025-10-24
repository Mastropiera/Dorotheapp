
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const NeostigminaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Agente colinérgico, inhibidor de la acetilcolinesterasa.")}
        {renderDetailSection("Presentación", "Ampolla de 0.5 mg / 1 ml.")}
        {renderDetailSection("Indicaciones", "Reversión del bloqueo neuromuscular no despolarizante. Tratamiento de la miastenia gravis. Íleo paralítico y atonía vesical postoperatoria.")}
        {renderDetailSection("Dosis", "Reversión bloqueo neuromuscular: 0.03-0.07 mg/kg IV, hasta un máximo de 5 mg. Siempre coadministrar con un anticolinérgico (Atropina o Glicopirrolato).")}
        {renderDetailSection("Administración", "Bolo intravenoso lento, administrar durante al menos 1 minuto.")}
        {renderDetailSection("RAM / Observaciones", "Efectos colinérgicos muscarínicos: bradicardia, aumento de secreciones salivales y bronquiales, miosis, calambres abdominales. Estos efectos son mitigados por la coadministración de atropina.")}
      </Accordion>
    </ScrollArea>
  );
};

export default NeostigminaCard;
