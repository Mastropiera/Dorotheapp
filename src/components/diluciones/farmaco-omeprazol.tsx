
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const OmeprazolCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Inhibidor de la bomba de protones (IBP). Reduce la secreción de ácido gástrico.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 40 mg de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Tratamiento a corto plazo de la enfermedad por reflujo gastroesofágico (ERGE), úlceras gástricas y duodenales, profilaxis de úlceras de estrés en pacientes críticos.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 40 mg con 10 ml de SF 0.9% (no usar SG 5% para reconstituir).")}
        {renderDetailSection("Dosis", "40 mg IV una vez al día.")}
        {renderDetailSection("Dilución", "Para infusión, diluir la solución reconstituida en 100 ml de SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Bolo intravenoso lento (al menos 3 minutos). Infusión intravenosa intermitente durante 20-30 minutos.")}
        {renderDetailSection("RAM / Observaciones", "Generalmente bien tolerado. Cefalea, diarrea, dolor abdominal. Uso prolongado se asocia con riesgo de fracturas, hipomagnesemia, e infecciones como Clostridium difficile.")}
      </Accordion>
    </ScrollArea>
  );
};

export default OmeprazolCard;
