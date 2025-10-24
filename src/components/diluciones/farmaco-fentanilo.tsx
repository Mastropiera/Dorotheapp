"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';

const FentaniloCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Analgésico opioide sintético potente. Actúa sobre receptores μ-opioides. De inicio rápido y corta duración.")}
        {renderDetailSection("Presentación", "Ampolla de 0,1 mg / 2ml o Ampolla de 0,5 mg / 10ml.")}
        {renderDetailSection("Indicaciones", "Analgesia en procedimientos cortos, sedación en UCI, componente analgésico de la anestesia general.")}
        {renderDetailSection("Dosis", <><strong>Bolo IV:</strong> 1-2 mcg/kg.<br/><strong>Infusión continua (analgesia/sedación):</strong> 0.5 - 2 mcg/kg/hr. Titular según respuesta.</>)}
        {renderDetailSection("Dilución", "Dilución estándar para infusión: 1000 mcg (1mg) o 2000 mcg (2mg) en 100 ml de SF 0,9% o SG 5% para obtener una concentración de 10 o 20 mcg/ml.")}
        {renderDetailSection("Administración", "Bolo intravenoso lento (1-2 minutos) para evitar rigidez torácica. Infusión intravenosa continua (BIC).")}
        {renderDetailSection("Estabilidad", "Estable 24 horas a temperatura ambiente en jeringas de polipropileno y en soluciones IV compatibles.")}
        {renderDetailSection("RAM / Observaciones", "Depresión respiratoria, rigidez muscular (especialmente torácica si se administra rápido), bradicardia, hipotensión, náuseas, vómitos. Tener disponible equipo de reanimación y naloxona (antídoto).")}
      </Accordion>
    </ScrollArea>
  );
};

export default FentaniloCard;
