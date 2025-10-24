
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const NitroprusiatoCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Vasodilatador potente, arterial y venoso. Actúa directamente sobre el músculo liso vascular.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 50 mg de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Emergencias hipertensivas. Reducción controlada de la presión arterial durante la anestesia. Insuficiencia cardíaca aguda.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 50 mg con 2-3 ml del diluyente provisto (SG 5%).")}
        {renderDetailSection("Dosis", "Iniciar con 0.3-0.5 mcg/kg/min y titular cada pocos minutos según respuesta. Dosis habitual: 3 mcg/kg/min. Máximo: 10 mcg/kg/min por no más de 10 minutos.")}
        {renderDetailSection("Dilución", "Diluir inmediatamente la solución reconstituida en 250-1000 ml de SG 5% exclusivamente. Proteger de la luz envolviendo la bolsa y el sistema de infusión en material opaco (ej. papel de aluminio).")}
        {renderDetailSection("Administración", "Infusión intravenosa continua con bomba de infusión. Requiere monitoreo hemodinámico invasivo continuo.")}
        {renderDetailSection("RAM / Observaciones", "Hipotensión profunda, taquicardia refleja. Riesgo de toxicidad por cianuro y tiocianato con infusiones prolongadas, a dosis altas o en insuficiencia renal/hepática. Monitorear signos de toxicidad (acidosis metabólica, confusión).")}
      </Accordion>
    </ScrollArea>
  );
};

export default NitroprusiatoCard;
