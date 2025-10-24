
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const AbciximabCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antiagregante plaquetario, anticuerpo monoclonal que se une a receptores de glicoproteína IIb/IIIa.")}
        {renderDetailSection("Presentación", "Vial de 10 mg / 5 ml.")}
        {renderDetailSection("Indicaciones", "Prevención de complicaciones isquémicas cardíacas en pacientes sometidos a angioplastia coronaria transluminal percutánea (ACTP).")}
        {renderDetailSection("Contraindicaciones", "Hipersensibilidad, hemorragia activa, cirugía mayor reciente, traumatismo craneoencefálico, historia de ACV, trombocitopenia (<100,000/mm3).")}
        {renderDetailSection("Dosis", <>Bolo IV de 0.25 mg/kg, seguido de infusión IV continua de 0.125 mcg/kg/min (máximo 10 mcg/min) durante 12 horas.</>)}
        {renderDetailSection("Dilución", "Extraer la dosis necesaria del vial. Para el bolo, administrar sin diluir. Para la infusión, diluir la dosis en suero fisiológico 0.9% o suero glucosado 5%.")}
        {renderDetailSection("Administración", "Bolo IV administrar en 1 minuto. La infusión continua debe ser administrada a través de una bomba de infusión para asegurar la precisión.")}
        {renderDetailSection("Estabilidad de Solución", "Estable por 12 horas a temperatura ambiente (15-30°C). No congelar. Desechar la porción no utilizada.")}
        {renderDetailSection("RAM / Observaciones", "Hemorragia es el efecto adverso más común. Trombocitopenia, hipotensión, náuseas, bradicardia. Monitorizar estrictamente signos de sangrado, recuento de plaquetas, y parámetros hemodinámicos.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AbciximabCard;
