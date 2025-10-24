
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const PiridoxinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Vitamina B6.")}
        {renderDetailSection("Presentación", "Ampolla de 300 mg / 2 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de deficiencia de Vitamina B6. Antídoto en intoxicaciones por isoniazida. Tratamiento de convulsiones dependientes de piridoxina en neonatos.")}
        {renderDetailSection("Dosis", "Varía ampliamente. Intoxicación por isoniazida: administrar la misma cantidad de piridoxina que de isoniazida ingerida, IV.")}
        {renderDetailSection("Administración", "Puede administrarse IV o IM.")}
        {renderDetailSection("RAM / Observaciones", "Generalmente bien tolerada en dosis terapéuticas. Dosis muy altas y prolongadas pueden causar neuropatía sensorial periférica.")}
      </Accordion>
    </ScrollArea>
  );
};

export default PiridoxinaCard;
