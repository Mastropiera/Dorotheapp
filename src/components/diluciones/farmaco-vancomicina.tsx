
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const VancomicinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico glucopeptídico bactericida.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 500 mg o 1 g de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Tratamiento de infecciones graves causadas por bacterias grampositivas resistentes, especialmente Staphylococcus aureus meticilino-resistente (SAMR).")}
        {renderDetailSection("Reconstitución", "Reconstituir 500 mg con 10 ml de API, o 1 g con 20 ml de API (concentración 50 mg/ml).")}
        {renderDetailSection("Dosis", "Adultos: 15-20 mg/kg cada 8-12 horas. Ajustar dosis según función renal y niveles plasmáticos.")}
        {renderDetailSection("Dilución", "Diluir la dosis reconstituida en al menos 100 ml de SF 0.9% o SG 5% por cada 500 mg.")}
        {renderDetailSection("Administración", "Infusión intravenosa LENTA. Administrar cada 500 mg en al menos 60 minutos para evitar el 'síndrome del hombre rojo'.")}
        {renderDetailSection("RAM / Observaciones", "'Síndrome del hombre rojo' (eritema, prurito, hipotensión) por liberación de histamina si se infunde rápido. Nefrotoxicidad y ototoxicidad son riesgos, especialmente con otros fármacos tóxicos. Requiere monitoreo de niveles plasmáticos (valle) para asegurar eficacia y minimizar toxicidad.")}
      </Accordion>
    </ScrollArea>
  );
};

export default VancomicinaCard;
