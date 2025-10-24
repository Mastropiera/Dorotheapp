
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const NaloxonaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antagonista de los receptores opioides. Revierte los efectos de los opioides, especialmente la depresión respiratoria.")}
        {renderDetailSection("Presentación", "Ampolla de 0.4 mg / 1 ml.")}
        {renderDetailSection("Indicaciones", "Reversión completa o parcial de la depresión respiratoria inducida por opioides. Diagnóstico de sospecha de sobredosis de opioides.")}
        {renderDetailSection("Dosis", "Adultos: 0.4 a 2 mg IV/IM/SC. Puede repetirse cada 2-3 minutos hasta una dosis máxima de 10 mg.")}
        {renderDetailSection("Dilución", "Puede administrarse sin diluir. Para infusión, diluir 2 mg en 500 ml de SF 0.9% o SG 5% (4 mcg/ml).")}
        {renderDetailSection("Administración", "Bolo intravenoso rápido en emergencia. La infusión se utiliza para mantener la reversión en caso de opioides de larga acción.")}
        {renderDetailSection("RAM / Observaciones", "Vida media corta (30-81 min), puede requerir dosis repetidas. La reversión del efecto opioide puede precipitar un síndrome de abstinencia agudo en pacientes dependientes y revertir la analgesia, causando dolor súbito y agitación.")}
      </Accordion>
    </ScrollArea>
  );
};

export default NaloxonaCard;
