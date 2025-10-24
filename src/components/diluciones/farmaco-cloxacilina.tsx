
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const CloxacilinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico beta-lactámico, penicilina resistente a penicilinasa.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 500 mg o 1 g de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Tratamiento de infecciones causadas por Staphylococcus aureus productor de penicilinasa, como infecciones de piel y tejidos blandos, osteomielitis y endocarditis.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 1 g con 10 ml de Agua para Inyectables (API).")}
        {renderDetailSection("Dosis", "Adultos: 1-2 g cada 4-6 horas IV.")}
        {renderDetailSection("Dilución", "Diluir la dosis reconstituida en 50-100 ml de SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Infusión intravenosa intermitente durante 20 a 30 minutos.")}
        {renderDetailSection("RAM / Observaciones", "Reacciones de hipersensibilidad, flebitis en el sitio de inyección, nefritis intersticial, elevación de transaminasas. Investigar antecedentes de alergia a penicilinas.")}
      </Accordion>
    </ScrollArea>
  );
};

export default CloxacilinaCard;
