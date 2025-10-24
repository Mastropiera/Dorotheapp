"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const MetilprednisolonaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Corticosteroide de acción intermedia con potente actividad antiinflamatoria.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 40 mg, 125 mg, 500 mg, 1 g de polvo liofilizado (como succinato sódico).")}
        {renderDetailSection("Indicaciones", "Tratamiento de shock anafiláctico, crisis asmática severa, enfermedades reumáticas y del colágeno, edema cerebral, y en regímenes de quimioterapia.")}
        {renderDetailSection("Reconstitución", "Reconstituir con el diluyente proporcionado o con API.")}
        {renderDetailSection("Dosis", "Muy variable. Dosis antiinflamatoria/inmunosupresora: 0.5-1.7 mg/kg/día. Dosis altas (pulsoterapia): 500 mg a 1 g IV por día durante 3-5 días.")}
        {renderDetailSection("Administración", "Bolo IV lento para dosis bajas. Para dosis altas (>250 mg), administrar en infusión IV durante al menos 30-60 minutos para reducir el riesgo de arritmias e hipotensión.")}
        {renderDetailSection("Dilución", "Diluir la dosis en SF 0.9% o SG 5%.")}
        {renderDetailSection("RAM / Observaciones", "Similares a otros corticoides: hiperglicemia, hipertensión, retención de líquidos. La administración rápida de dosis altas se ha asociado con arritmias y colapso cardiovascular.")}
      </Accordion>
    </ScrollArea>
  );
};

export default MetilprednisolonaCard;
