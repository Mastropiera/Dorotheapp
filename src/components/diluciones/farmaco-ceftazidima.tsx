
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const CeftazidimaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico cefalosporina de tercera generación con excelente actividad contra Pseudomonas aeruginosa.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 1 g de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Infecciones graves causadas por organismos susceptibles, especialmente Pseudomonas. Neumonía nosocomial, infecciones en pacientes neutropénicos, meningitis.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 1 g con 10 ml de API.")}
        {renderDetailSection("Dosis", "Adultos: 1-2 g cada 8 horas IV.")}
        {renderDetailSection("Dilución", "Diluir en 50-100 ml de SF 0.9% o SG 5% para infusión intravenosa.")}
        {renderDetailSection("Administración", "Infusión intravenosa intermitente durante 15 a 30 minutos.")}
        {renderDetailSection("Estabilidad de Solución", "Estable 18-24 horas a temperatura ambiente o 7 días refrigerado.")}
        {renderDetailSection("RAM / Observaciones", "Reacciones de hipersensibilidad, flebitis, diarrea. Puede causar un resultado falso positivo en la prueba de Coombs. Requiere ajuste de dosis en insuficiencia renal.")}
      </Accordion>
    </ScrollArea>
  );
};

export default CeftazidimaCard;
