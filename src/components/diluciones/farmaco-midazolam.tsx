"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';

const MidazolamCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Benzodiazepina de acción corta. Produce sedación, ansiolisis, amnesia anterógrada y efectos anticonvulsivantes.")}
        {renderDetailSection("Presentación", "Ampolla de 5mg/1ml, 15mg/3ml, 50mg/10ml.")}
        {renderDetailSection("Indicaciones", "Sedación en UCI, sedación para procedimientos, inducción anestésica, manejo de convulsiones.")}
        {renderDetailSection("Dosis", <><strong>Sedación (Bolo IV):</strong> 0.02-0.1 mg/kg.<br/><strong>Infusión continua (sedación):</strong> 0.04-0.2 mg/kg/hr. Titular según nivel de sedación deseado (ej. RASS). </>)}
        {renderDetailSection("Dilución", "Dilución estándar para infusión: 100 mg en 100 ml de SF 0,9% o SG 5% para obtener una concentración de 1 mg/ml.")}
        {renderDetailSection("Administración", "Bolo intravenoso lento (más de 2 minutos). Infusión intravenosa continua (BIC).")}
        {renderDetailSection("Antídoto", "Flumazenil.")}
        {renderDetailSection("RAM / Observaciones", "Depresión respiratoria, hipotensión, amnesia. El efecto puede ser potenciado por opioides y otros depresores del SNC. Monitorizar estado respiratorio, hemodinámico y nivel de conciencia.")}
      </Accordion>
    </ScrollArea>
  );
};

export default MidazolamCard;
