
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const ClindamicinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico del grupo de las lincosamidas. Efecto bacteriostático o bactericida dependiendo de la concentración. Activo contra cocos grampositivos y bacterias anaerobias.")}
        {renderDetailSection("Presentación", "Ampolla de 600 mg / 4 ml.")}
        {renderDetailSection("Indicaciones", "Infecciones de piel y tejidos blandos, infecciones intraabdominales, infecciones pélvicas, osteomielitis, infecciones por anaerobios.")}
        {renderDetailSection("Dosis", "Adultos: 600-900 mg IV cada 8 horas. En infecciones graves, hasta 4.8 g/día.")}
        {renderDetailSection("Dilución", "Diluir cada 300 mg en al menos 50 ml de SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Infusión intravenosa intermitente. La velocidad no debe exceder los 30 mg/minuto. Una dosis de 600 mg debe infundirse en al menos 20-30 minutos. NO administrar en bolo IV.")}
        {renderDetailSection("Estabilidad de Solución", "Estable 24 horas a temperatura ambiente una vez diluido.")}
        {renderDetailSection("RAM / Observaciones", "El efecto adverso más grave es la colitis pseudomembranosa causada por Clostridium difficile, que puede ser fatal. Diarrea es común. Rash cutáneo. Puede potenciar el efecto de los bloqueantes neuromusculares.")}
      </Accordion>
    </ScrollArea>
  );
};

export default ClindamicinaCard;

