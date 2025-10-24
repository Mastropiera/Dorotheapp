"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const FlumazenilCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antagonista de los receptores de benzodiazepinas.")}
        {renderDetailSection("Presentación", "Ampolla de 0.5 mg / 5 ml.")}
        {renderDetailSection("Indicaciones", "Reversión de los efectos sedantes de las benzodiazepinas en procedimientos anestésicos y diagnósticos. Tratamiento de la sobredosis de benzodiazepinas.")}
        {renderDetailSection("Dosis", "Dosis inicial de 0.2 mg IV en 15 segundos. Si no se obtiene el nivel de conciencia deseado, se puede administrar una segunda dosis de 0.3 mg un minuto después. Dosis posteriores de 0.5 mg pueden administrarse a intervalos de 1 minuto hasta una dosis total máxima de 3 mg.")}
        {renderDetailSection("Administración", "Bolo intravenoso. Puede administrarse sin diluir o diluido en SF 0.9% o SG 5%.")}
        {renderDetailSection("RAM / Observaciones", "Puede precipitar un síndrome de abstinencia agudo en pacientes con dependencia de benzodiazepinas (riesgo de convulsiones). Náuseas, vómitos, agitación. Vida media corta, por lo que puede ser necesaria una nueva dosis si reaparece la sedación.")}
      </Accordion>
    </ScrollArea>
  );
};

export default FlumazenilCard;
