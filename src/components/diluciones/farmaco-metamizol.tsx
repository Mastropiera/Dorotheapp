
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const MetamizolCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Analgésico, antipirético, espasmolítico. AINE del grupo de las pirazolonas.")}
        {renderDetailSection("Presentación", "Ampolla de 1 g / 2 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento del dolor agudo post-operatorio o post-traumático, de tipo cólico o de origen tumoral. Fiebre alta que no responde a otros antitérmicos.")}
        {renderDetailSection("Dosis", "Adultos: 1-2 g cada 6-8 horas IV o IM.")}
        {renderDetailSection("Dilución", "Para infusión IV, diluir la dosis en un volumen de 50-100 ml de SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Bolo intravenoso LENTO (no menos de 3-5 minutos). Infusión intermitente durante 15-30 minutos. La administración rápida puede causar hipotensión.")}
        {renderDetailSection("RAM / Observaciones", "Reacción adversa más grave (aunque rara) es la agranulocitosis, que puede ser fatal. Reacciones anafilácticas/anafilactoides e hipotensión. No se recomienda su uso prolongado. Monitorizar la presión arterial durante y después de la administración IV.")}
      </Accordion>
    </ScrollArea>
  );
};

export default MetamizolCard;

