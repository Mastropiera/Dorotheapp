
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const MorfinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Analgésico opioide agonista puro. Actúa sobre receptores μ en el SNC.")}
        {renderDetailSection("Presentación", "Ampolla de 10 mg / 1 ml y 20 mg / 1 ml.")}
        {renderDetailSection("Indicaciones", "Dolor agudo y crónico severo. Edema agudo de pulmón (por su efecto vasodilatador y ansiolítico).")}
        {renderDetailSection("Dosis", "Bolo IV: 2-10 mg cada 4 horas según necesidad. Infusión continua: 0.8-10 mg/hora. Dosis altamente variable.")}
        {renderDetailSection("Dilución", "Para bolo IV, diluir la dosis en 5-10 ml de SF 0.9%. Para infusión, diluir a una concentración de 1 mg/ml (ej. 50 mg en 50 ml SF 0.9%).")}
        {renderDetailSection("Administración", "Bolo IV lento (administrar en 4-5 minutos). Infusión continua con bomba.")}
        {renderDetailSection("RAM / Observaciones", "Depresión respiratoria, sedación, hipotensión, náuseas, vómitos, constipación, miosis. Tener Naloxona disponible como antídoto. Monitorizar frecuencia respiratoria y nivel de conciencia.")}
      </Accordion>
    </ScrollArea>
  );
};

export default MorfinaCard;
