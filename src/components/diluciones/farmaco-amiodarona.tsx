"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';

const AmiodaronaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antiarrítmico de clase III. Prolonga la duración del potencial de acción y el período refractario en el tejido miocárdico.")}
        {renderDetailSection("Presentación", "Ampolla de 150 mg / 3 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de arritmias ventriculares y supraventriculares graves, incluyendo fibrilación ventricular y taquicardia ventricular hemodinámicamente inestable.")}
        {renderDetailSection("Dosis", <><strong>Dosis de carga:</strong> 150 mg en 100 ml SG 5% a pasar en 10-30 minutos.<br/><strong>Dosis de mantención:</strong> 1 mg/min por 6 horas (360 mg), luego 0,5 mg/min por 18 horas (540 mg). Dosis máxima en 24h: 2,2 g.</>)}
        {renderDetailSection("Dilución", "Diluir exclusivamente en Suero Glucosado al 5%. La concentración no debe exceder 2 mg/ml para venas periféricas. Para la infusión, una concentración común es 900 mg en 500 ml SG 5% (1.8 mg/ml).")}
        {renderDetailSection("Administración", "Infusión intravenosa. La dosis de carga rápida debe ser por vía central si es posible. La infusión de mantenimiento puede ser por vía periférica, pero con vigilancia estricta por riesgo de flebitis.")}
        {renderDetailSection("Estabilidad", "La solución diluida en SG 5% es estable por 24 horas a temperatura ambiente. No refrigerar, puede precipitar.")}
        {renderDetailSection("RAM / Observaciones", "Hipotensión (principalmente con la infusión rápida), bradicardia, bloqueo AV. Flebitis en sitio de punción. A largo plazo: toxicidad pulmonar, hepática y tiroidea. Monitoreo continuo de ECG y presión arterial durante la infusión.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AmiodaronaCard;
