
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const TiopentalCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Barbitúrico de acción ultracorta. Anestésico general, anticonvulsivante.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 0.5 g o 1 g de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Inducción de la anestesia general. Tratamiento de status epilepticus refractario. Reducción de la presión intracraneal en pacientes neurocríticos.")}
        {renderDetailSection("Reconstitución", "Reconstituir a una concentración de 2.5% (25 mg/ml). Ej: 1 g en 40 ml de API o SF 0.9%.")}
        {renderDetailSection("Dosis", "Inducción anestésica: 3-5 mg/kg IV.")}
        {renderDetailSection("Administración", "Bolo intravenoso lento. Debe ser administrado por personal experto en anestesia.")}
        {renderDetailSection("RAM / Observaciones", "Depresión respiratoria y cardiovascular severa, laringoespasmo, broncoespasmo. La extravasación puede causar necrosis tisular severa. Es una solución muy alcalina e incompatible con muchos fármacos (ej. relajantes musculares).")}
      </Accordion>
    </ScrollArea>
  );
};

export default TiopentalCard;
