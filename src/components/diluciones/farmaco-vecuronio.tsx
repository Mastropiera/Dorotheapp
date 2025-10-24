
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const VecuronioCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Bloqueante neuromuscular no despolarizante de duración intermedia.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 4 mg o 10 mg de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Coadyuvante de la anestesia general para facilitar la intubación y proporcionar relajación muscular en cirugía.")}
        {renderDetailSection("Reconstitución", "Reconstituir con el solvente apropiado (ej. API) según las instrucciones del fabricante, usualmente para obtener una concentración de 1-2 mg/ml.")}
        {renderDetailSection("Dosis", "Intubación: 0.08-0.1 mg/kg. Mantenimiento: 0.02-0.03 mg/kg.")}
        {renderDetailSection("Administración", "Bolo intravenoso.")}
        {renderDetailSection("Antídoto", "Neostigmina (con Atropina) o Sugammadex.")}
        {renderDetailSection("RAM / Observaciones", "Menor liberación de histamina comparado con otros relajantes. Efecto prolongado en pacientes con insuficiencia renal o hepática. Requiere monitoreo de la función neuromuscular.")}
      </Accordion>
    </ScrollArea>
  );
};

export default VecuronioCard;
