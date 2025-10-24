
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const PiperacilinaTazobactamCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico beta-lactámico (penicilina de espectro extendido) con un inhibidor de beta-lactamasas (Tazobactam).")}
        {renderDetailSection("Presentación", "Frasco ampolla de 4 g Piperacilina + 0.5 g Tazobactam (Total 4.5 g).")}
        {renderDetailSection("Indicaciones", "Infecciones graves intraabdominales, de piel y tejidos blandos, neumonía nosocomial, infecciones en pacientes neutropénicos.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 4.5 g con 20 ml de SF 0.9% o API.")}
        {renderDetailSection("Dosis", "4.5 g cada 6-8 horas.")}
        {renderDetailSection("Dilución", "Diluir la dosis reconstituida en 50-150 ml de SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Infusión intravenosa intermitente durante 30 minutos. La infusión extendida (durante 3-4 horas) es una estrategia para optimizar su efecto bactericida dependiente del tiempo.")}
        {renderDetailSection("RAM / Observaciones", "Reacciones de hipersensibilidad, diarrea, tromboflebitis. Ajustar dosis en insuficiencia renal. Incompatible con soluciones de Ringer Lactato (contiene calcio).")}
      </Accordion>
    </ScrollArea>
  );
};

export default PiperacilinaTazobactamCard;
