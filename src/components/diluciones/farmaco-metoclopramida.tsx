"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const MetoclopramidaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antiemético, procinético. Antagonista dopaminérgico D2.")}
        {renderDetailSection("Presentación", "Ampolla de 10 mg / 2 ml.")}
        {renderDetailSection("Indicaciones", "Prevención y tratamiento de náuseas y vómitos postoperatorios, inducidos por quimioterapia o radioterapia. Trastornos de la motilidad gastrointestinal.")}
        {renderDetailSection("Dosis", "Adultos: 10 mg IV/IM cada 8 horas.")}
        {renderDetailSection("Dilución", "Para infusión, diluir en 50 ml de SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Bolo intravenoso lento (al menos 3 minutos) para evitar reacciones de ansiedad e inquietud. Infusión intermitente durante 15 minutos.")}
        {renderDetailSection("RAM / Observaciones", "Somnolencia, astenia. Reacciones extrapiramidales (distonías agudas, parkinsonismo), especialmente en niños y adultos jóvenes. Puede causar crisis hipertensivas en pacientes con feocromocitoma.")}
      </Accordion>
    </ScrollArea>
  );
};

export default MetoclopramidaCard;
