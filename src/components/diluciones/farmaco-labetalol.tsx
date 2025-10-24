
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const LabetalolCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antihipertensivo, bloqueador de los receptores alfa y beta adrenérgicos.")}
        {renderDetailSection("Presentación", "Ampolla de 100 mg / 20 ml (5 mg/ml).")}
        {renderDetailSection("Indicaciones", "Tratamiento de emergencias hipertensivas, incluyendo la hipertensión en el embarazo (preeclampsia).")}
        {renderDetailSection("Dosis", <><strong>Bolo IV:</strong> 20 mg (4 ml) administrado en 2 minutos. Se pueden administrar dosis adicionales de 40-80 mg cada 10 minutos hasta un máximo de 300 mg.<br/><strong>Infusión continua:</strong> 1-2 mg/minuto, ajustando según respuesta.</>)}
        {renderDetailSection("Dilución", "Para infusión continua, diluir 200 mg (2 ampollas) en un volumen total de 200 ml de SF 0.9% o SG 5% para obtener una concentración de 1 mg/ml.")}
        {renderDetailSection("Administración", "Bolo intravenoso lento (2 minutos). Infusión continua con bomba. El paciente debe estar en posición supina durante la administración.")}
        {renderDetailSection("RAM / Observaciones", "Hipotensión postural (efecto más común), mareos, náuseas, bradicardia, broncoespasmo. Monitoreo continuo de la presión arterial y frecuencia cardíaca.")}
      </Accordion>
    </ScrollArea>
  );
};

export default LabetalolCard;
