
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const SuccinilcolinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Bloqueante neuromuscular despolarizante de acción ultracorta.")}
        {renderDetailSection("Presentación", "Vial con 100 mg de polvo liofilizado o ampolla de 100 mg / 5 ml.")}
        {renderDetailSection("Indicaciones", "Facilitar la intubación endotraqueal, especialmente en secuencia de inducción rápida.")}
        {renderDetailSection("Dosis", "Adultos: 1-1.5 mg/kg IV.")}
        {renderDetailSection("Administración", "Bolo intravenoso rápido.")}
        {renderDetailSection("RAM / Observaciones", "Produce fasciculaciones musculares iniciales, que pueden causar dolor muscular postoperatorio. Aumenta la presión intraocular e intracraneal. Riesgo de hipertermia maligna en individuos susceptibles. Causa hiperkalemia (potencialmente fatal en pacientes con quemaduras, traumatismos masivos, lesiones de médula espinal). Bradicardia (especialmente en niños).")}
      </Accordion>
    </ScrollArea>
  );
};

export default SuccinilcolinaCard;
