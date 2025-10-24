
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const TeicoplaninaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico glucopeptídico, similar a la vancomicina.")}
        {renderDetailSection("Presentación", "Frasco ampolla de 400 mg con solvente.")}
        {renderDetailSection("Indicaciones", "Infecciones graves por bacterias grampositivas resistentes, incluyendo S. aureus meticilino-resistente (SAMR).")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 400 mg con el solvente provisto (3 ml de API).")}
        {renderDetailSection("Dosis", "Dosis de carga: 6-12 mg/kg cada 12 horas para 3 dosis. Dosis de mantenimiento: 6-12 mg/kg una vez al día.")}
        {renderDetailSection("Administración", "Bolo intravenoso lento (3-5 minutos) o infusión intermitente (30 minutos).")}
        {renderDetailSection("RAM / Observaciones", "Similar a la vancomicina, pero puede tener menor incidencia de nefrotoxicidad. Puede causar 'síndrome del hombre rojo' si se infunde rápidamente. Requiere monitorización de niveles plasmáticos (valle) para ajustar dosis.")}
      </Accordion>
    </ScrollArea>
  );
};

export default TeicoplaninaCard;
