
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const CeftriaxonaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico cefalosporina de tercera generación de larga acción.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 1 g de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Meningitis, gonorrea, enfermedad de Lyme, infecciones severas del tracto respiratorio y urinario.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 1 g con 10 ml de API para uso IV.")}
        {renderDetailSection("Dosis", "Adultos: 1-2 g una vez al día. Meningitis: 2 g cada 12 horas.")}
        {renderDetailSection("Dilución", "Diluir en 50-100 ml de SF 0.9% o SG 5% para infusión intravenosa.")}
        {renderDetailSection("Administración", "Infusión intravenosa intermitente durante al menos 30 minutos.")}
        {renderDetailSection("RAM / Observaciones", "Diarrea, rash, elevación de enzimas hepáticas. Riesgo de pseudolitiasis biliar (barro biliar). Contraindicado en neonatos con hiperbilirrubinemia. NO mezclar ni administrar simultáneamente con soluciones que contengan calcio (ej. Ringer Lactato) por riesgo de precipitación.")}
      </Accordion>
    </ScrollArea>
  );
};

export default CeftriaxonaCard;
