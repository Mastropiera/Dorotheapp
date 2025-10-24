
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const LorazepamCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Benzodiazepina de acción intermedia. Ansiolítico, sedante, hipnótico, anticonvulsivante.")}
        {renderDetailSection("Presentación", "Ampolla de 4 mg / 1 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento a corto plazo de la ansiedad severa, status epilepticus, sedación preoperatoria.")}
        {renderDetailSection("Dosis", "Status epilepticus: 4 mg IV lento. Puede repetirse en 10-15 min. Sedación: 0.05 mg/kg IV.")}
        {renderDetailSection("Dilución", "Debe diluirse 1:1 con un diluyente compatible (SF 0.9% o SG 5%) justo antes de la administración IV.")}
        {renderDetailSection("Administración", "Bolo intravenoso MUY LENTO, a una velocidad no superior a 2 mg/minuto.")}
        {renderDetailSection("Antídoto", "Flumazenil.")}
        {renderDetailSection("RAM / Observaciones", "Depresión respiratoria, hipotensión, sedación profunda. Riesgo de precipitación si se mezcla con otros fármacos. La ampolla debe conservarse refrigerada.")}
      </Accordion>
    </ScrollArea>
  );
};

export default LorazepamCard;
