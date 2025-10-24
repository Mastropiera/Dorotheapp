
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const CefotaximaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico cefalosporina de tercera generación. Amplio espectro contra bacterias gramnegativas.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 1 g de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Meningitis bacteriana, septicemia, infecciones intraabdominales, infecciones del tracto respiratorio inferior, infecciones complicadas del tracto urinario.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 1 g con 10 ml de API.")}
        {renderDetailSection("Dosis", "Adultos: 1-2 g cada 6-8 horas. Meningitis: 2 g cada 4-6 horas. Dosis máxima: 12 g/día.")}
        {renderDetailSection("Dilución", "Para infusión IV, diluir la dosis reconstituida en 50-100 ml de SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Bolo intravenoso lento (3-5 minutos) o infusión intermitente (20-60 minutos).")}
        {renderDetailSection("Estabilidad de Solución", "Estable por 24 horas a temperatura ambiente o 7-10 días refrigerada, dependiendo del fabricante y diluyente.")}
        {renderDetailSection("RAM / Observaciones", "Reacciones de hipersensibilidad, flebitis, diarrea, eosinofilia. Ajustar dosis en insuficiencia renal severa.")}
      </Accordion>
    </ScrollArea>
  );
};

export default CefotaximaCard;
