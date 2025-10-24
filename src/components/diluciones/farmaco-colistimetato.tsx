
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const ColistimetatoCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico polipeptídico. Activo contra la mayoría de bacilos aerobios gramnegativos.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 1.000.000 UI de Colistimetato Sódico en polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Tratamiento de infecciones graves causadas por bacterias gramnegativas multirresistentes, como Pseudomonas aeruginosa, Acinetobacter baumannii, Klebsiella pneumoniae.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 1 millón UI con 2 ml de API, SF 0.9% o SG 5%.")}
        {renderDetailSection("Dosis", "La dosificación es compleja y debe basarse en el peso y la función renal. Generalmente se usa una dosis de carga seguida de dosis de mantenimiento. Ej: Carga de 9 millones de UI, mantenimiento de 4.5 millones de UI cada 12 horas.")}
        {renderDetailSection("Dilución", "Diluir la dosis requerida en 50-100 ml de SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Infusión intravenosa intermitente durante 30 a 60 minutos.")}
        {renderDetailSection("RAM / Observaciones", "NEFROTOXICIDAD y NEUROTOXICIDAD son los efectos adversos más importantes y limitantes de la dosis. Requiere monitorización estricta de la función renal y estado neurológico. La neurotoxicidad puede manifestarse como parestesias, mareos, debilidad muscular y apnea.")}
      </Accordion>
    </ScrollArea>
  );
};

export default ColistimetatoCard;
