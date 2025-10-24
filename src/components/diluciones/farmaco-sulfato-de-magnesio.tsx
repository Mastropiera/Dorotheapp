
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const SulfatoDeMagnesioCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Anticonvulsivante, electrolito, antiarrítmico, tocolítico.")}
        {renderDetailSection("Presentación", "Ampolla al 25% (2.5 g / 10 ml).")}
        {renderDetailSection("Indicaciones", "Tratamiento de eclampsia y preeclampsia severa. Torsades de pointes. Hipomagnesemia. Crisis asmática severa.")}
        {renderDetailSection("Dosis", "Eclampsia: Dosis de carga de 4-6 g IV en 15-20 min, seguida de infusión de 1-2 g/hora. Torsades de pointes: 1-2 g IV en 5-60 min.")}
        {renderDetailSection("Dilución", "Diluir la dosis requerida en SF 0.9% o SG 5% para infusión.")}
        {renderDetailSection("Administración", "Infusión intravenosa. La administración rápida puede causar hipotensión, bradicardia y sofocos.")}
        {renderDetailSection("Antídoto", "Gluconato de Calcio.")}
        {renderDetailSection("RAM / Observaciones", "Signos de toxicidad por magnesio: pérdida de reflejos osteotendinosos profundos (primer signo), depresión respiratoria, bloqueo cardíaco, letargo. Requiere monitorización de reflejos, frecuencia respiratoria, diuresis y niveles de magnesio sérico.")}
      </Accordion>
    </ScrollArea>
  );
};

export default SulfatoDeMagnesioCard;
