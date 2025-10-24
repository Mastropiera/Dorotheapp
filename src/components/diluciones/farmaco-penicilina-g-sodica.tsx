
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const PenicilinaGSodicaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico beta-lactámico bactericida.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 1, 2, 5, 10 millones de UI de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Infecciones graves por gérmenes sensibles como Streptococcus, Neisseria, Clostridium, Treponema pallidum (sífilis).")}
        {renderDetailSection("Reconstitución", "Reconstituir con API. El volumen varía según la dosis para obtener una concentración manejable.")}
        {renderDetailSection("Dosis", "Adultos: 1 a 5 millones de UI cada 4-6 horas. Neurosífilis: 18-24 millones de UI/día en infusión continua o dividida cada 4 horas.")}
        {renderDetailSection("Dilución", "Para infusión, diluir en 50-100 ml de SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Infusión intravenosa intermitente durante 15 a 60 minutos.")}
        {renderDetailSection("RAM / Observaciones", "Reacciones de hipersensibilidad (principal riesgo). Neurotoxicidad (convulsiones) con dosis muy altas o en insuficiencia renal. Reacción de Jarisch-Herxheimer en el tratamiento de la sífilis.")}
      </Accordion>
    </ScrollArea>
  );
};

export default PenicilinaGSodicaCard;
