
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const MilrinonaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Inotrópico positivo y vasodilatador (inodilatador). Inhibidor de la fosfodiesterasa III.")}
        {renderDetailSection("Presentación", "Ampolla de 10 mg / 10 ml (1 mg/ml).")}
        {renderDetailSection("Indicaciones", "Tratamiento a corto plazo de la insuficiencia cardíaca congestiva aguda severa.")}
        {renderDetailSection("Dosis", "Bolo de carga (opcional): 50 mcg/kg en 10 minutos. Infusión de mantenimiento: 0.375 a 0.75 mcg/kg/min.")}
        {renderDetailSection("Dilución", "Diluir en SF 0.9% o SG 5% para obtener una concentración final de 200 mcg/ml (ej. 20 mg en 100 ml).")}
        {renderDetailSection("Administración", "Bolo IV seguido de infusión intravenosa continua. Ajustar dosis según respuesta hemodinámica.")}
        {renderDetailSection("RAM / Observaciones", "Arritmias ventriculares, hipotensión, cefalea. Requiere monitorización continua del ECG y la presión arterial. Ajustar dosis en insuficiencia renal.")}
      </Accordion>
    </ScrollArea>
  );
};

export default MilrinonaCard;
