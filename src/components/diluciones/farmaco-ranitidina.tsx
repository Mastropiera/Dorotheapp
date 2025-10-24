
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const RanitidinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antagonista de los receptores de histamina H2. Inhibe la secreción de ácido gástrico.")}
        {renderDetailSection("Presentación", "Ampolla de 50 mg / 5 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de úlcera duodenal y gástrica, reflujo gastroesofágico, profilaxis de úlcera de estrés. (Nota: Su uso ha disminuido y ha sido retirado en algunos mercados por impurezas).")}
        {renderDetailSection("Dosis", "50 mg IV cada 6-8 horas.")}
        {renderDetailSection("Dilución", "Diluir 50 mg en un volumen total de 20 ml con SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Bolo intravenoso lento (al menos 2 minutos). Infusión intermitente (en 100 ml) durante 15-20 minutos.")}
        {renderDetailSection("RAM / Observaciones", "Generalmente bien tolerado. Cefalea, mareos. La administración IV rápida se ha asociado con bradicardia.")}
      </Accordion>
    </ScrollArea>
  );
};

export default RanitidinaCard;
