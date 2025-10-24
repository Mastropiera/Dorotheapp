
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const AminofilinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Broncodilatador. Relaja el músculo liso bronquial y los vasos pulmonares. También tiene efectos diuréticos, estimulantes del SNC y cardíacos.")}
        {renderDetailSection("Presentación", "Ampolla de 250 mg / 10 ml (25 mg/ml).")}
        {renderDetailSection("Indicaciones", "Asma bronquial, broncoespasmo reversible asociado a bronquitis crónica y enfisema. Apnea del prematuro.")}
        {renderDetailSection("Dosis", <><strong>Dosis de carga:</strong> 5-6 mg/kg en 20-30 minutos.<br/><strong>Dosis de mantención:</strong> 0.4-0.9 mg/kg/hora en infusión continua. Ajustar según niveles plasmáticos.</>)}
        {renderDetailSection("Dilución", "Diluir la dosis requerida en suero fisiológico 0.9% o suero glucosado 5% para obtener una concentración final que no exceda los 25 mg/ml para infusión.")}
        {renderDetailSection("Administración", "Infusión intravenosa LENTA. La velocidad no debe exceder los 25 mg/minuto para evitar toxicidad grave.")}
        {renderDetailSection("Estabilidad de Solución", "Estable 24 horas a temperatura ambiente una vez diluido.")}
        {renderDetailSection("RAM / Observaciones", "Índice terapéutico estrecho (niveles terapéuticos: 10-20 mcg/ml). Efectos adversos incluyen taquicardia, arritmias, náuseas, vómitos, cefalea, insomnio, convulsiones. Monitorizar niveles plasmáticos de teofilina, frecuencia cardíaca y ECG.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AminofilinaCard;
