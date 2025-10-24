
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const PapaverinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Alcaloide del opio, vasodilatador. Relaja el músculo liso, especialmente de los vasos sanguíneos.")}
        {renderDetailSection("Presentación", "Ampolla de 60 mg / 2 ml.")}
        {renderDetailSection("Indicaciones", "Espasmos vasculares (arteriales, cerebrales), embolia arterial. Tratamiento de la disfunción eréctil (inyección intracavernosa).")}
        {renderDetailSection("Dosis", "30 a 120 mg IV o IM, repetido cada 3 horas según sea necesario.")}
        {renderDetailSection("Administración", "Administrar por vía IV LENTA durante 1-2 minutos para evitar arritmias y apnea fatal.")}
        {renderDetailSection("RAM / Observaciones", "Hipotensión, taquicardia, arritmias, sedación, cefalea. La administración IV rápida es peligrosa.")}
      </Accordion>
    </ScrollArea>
  );
};

export default PapaverinaCard;
