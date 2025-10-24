
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const PetidinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Analgésico opioide sintético (también conocido como Meperidina).")}
        {renderDetailSection("Presentación", "Ampolla de 100 mg / 2 ml.")}
        {renderDetailSection("Indicaciones", "Dolor agudo moderado a severo. Analgesia obstétrica.")}
        {renderDetailSection("Dosis", "Adultos: 25-100 mg IV/IM/SC cada 3-4 horas.")}
        {renderDetailSection("Administración", "Bolo intravenoso LENTO (durante al menos 2-3 minutos). La administración rápida puede causar aumento de efectos adversos.")}
        {renderDetailSection("RAM / Observaciones", "Su metabolito, la normeperidina, es tóxico para el SNC y puede causar temblores, mioclonías y convulsiones. El riesgo aumenta con dosis altas, uso prolongado e insuficiencia renal. Evitar su uso crónico.")}
      </Accordion>
    </ScrollArea>
  );
};

export default PetidinaCard;
