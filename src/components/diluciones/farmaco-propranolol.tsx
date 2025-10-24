
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const PropranololCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Betabloqueante no selectivo (β1 y β2).")}
        {renderDetailSection("Presentación", "Ampolla de 1 mg / 1 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de arritmias cardíacas, crisis hipertensivas, tirotoxicosis, feocromocitoma.")}
        {renderDetailSection("Dosis", "Emergencias: 1 mg IV administrado en 1 minuto, puede repetirse cada 2 minutos hasta un máximo de 10 mg en pacientes conscientes o 5 mg en anestesia.")}
        {renderDetailSection("Administración", "Bolo intravenoso LENTO (1 mg/min). La administración rápida puede causar hipotensión severa y bradicardia.")}
        {renderDetailSection("RAM / Observaciones", "Bradicardia, hipotensión, broncoespasmo (por bloqueo β2, precaución en pacientes con asma/EPOC), fatiga. Requiere monitoreo de ECG y presión arterial.")}
      </Accordion>
    </ScrollArea>
  );
};

export default PropranololCard;
