"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const LCarnitinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Aminoácido modificado. Esencial para el transporte de ácidos grasos de cadena larga a la mitocondria para su oxidación y producción de energía.")}
        {renderDetailSection("Presentación", "Ampolla de 1 g / 5 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de la deficiencia de carnitina primaria y secundaria. Cardiopatía y miopatía por deficiencia de carnitina.")}
        {renderDetailSection("Dosis", "Dosis muy variable según indicación y edad. Adultos: 50 mg/kg/día dividido en dosis cada 8-12 horas.")}
        {renderDetailSection("Administración", "Inyección intravenosa LENTA durante 2-3 minutos, o por infusión.")}
        {renderDetailSection("Dilución", "Puede diluirse en Suero Fisiológico 0.9% o Suero Glucosado 5%.")}
        {renderDetailSection("RAM / Observaciones", "Generalmente bien tolerada. Puede causar náuseas, vómitos, calambres abdominales y diarrea. La administración IV rápida puede causar hipotensión. Un efecto característico es el olor corporal a pescado.")}
      </Accordion>
    </ScrollArea>
  );
};

export default LCarnitinaCard;
