"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const KetorolacoCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antiinflamatorio no esteroideo (AINE) con potente actividad analgésica.")}
        {renderDetailSection("Presentación", "Ampolla de 30 mg / 1 ml. Ampolla de 60 mg / 2 ml.")}
        {renderDetailSection("Indicaciones", "Manejo a corto plazo del dolor agudo moderado a severo, especialmente postoperatorio.")}
        {renderDetailSection("Dosis", "Adultos: 30 mg IV o IM cada 6 horas. Dosis máxima diaria: 120 mg. En adultos mayores, insuficiencia renal o peso <50 kg, la dosis máxima es de 60 mg/día. Duración máxima del tratamiento total (incluyendo vía oral): 5 días.")}
        {renderDetailSection("Administración", "Bolo intravenoso administrado en no menos de 15 segundos. Inyección intramuscular profunda y lenta.")}
        {renderDetailSection("RAM / Observaciones", "Alto riesgo de efectos adversos gastrointestinales graves (úlcera, perforación, hemorragia), nefrotoxicidad (insuficiencia renal aguda) y eventos cardiovasculares trombóticos. Contraindicado en pacientes con úlcera péptica activa, insuficiencia renal avanzada, riesgo de sangrado y durante el parto. No se recomienda su uso crónico.")}
      </Accordion>
    </ScrollArea>
  );
};

export default KetorolacoCard;
