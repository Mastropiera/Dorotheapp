
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const MetronidazolCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico y antiprotozoario del grupo de los nitroimidazoles.")}
        {renderDetailSection("Presentación", "Frasco listo para usar de 500 mg / 100 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de infecciones por bacterias anaerobias (Bacteroides, Clostridium), tricomoniasis, amebiasis, giardiasis.")}
        {renderDetailSection("Dosis", "Adultos: Dosis de carga de 15 mg/kg, seguida de 7.5 mg/kg cada 6-8 horas. Dosis habitual: 500 mg cada 8 horas.")}
        {renderDetailSection("Administración", "Infusión intravenosa durante 30 a 60 minutos.")}
        {renderDetailSection("RAM / Observaciones", "Sabor metálico, náuseas, neuropatía periférica (uso prolongado). Efecto disulfiram (antabus) con el alcohol, se debe evitar su consumo durante y hasta 3 días después del tratamiento. Oscurecimiento de la orina.")}
      </Accordion>
    </ScrollArea>
  );
};

export default MetronidazolCard;
