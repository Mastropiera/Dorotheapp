
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const AmikacinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico aminoglucósido. Actividad bactericida principalmente contra bacilos gramnegativos aerobios.")}
        {renderDetailSection("Presentación", "Frasco ampolla de 100 mg / 2 ml. Frasco ampolla de 500 mg / 2 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de infecciones graves causadas por bacterias gramnegativas susceptibles, como Pseudomonas aeruginosa, E. coli, Klebsiella, Serratia, Proteus.")}
        {renderDetailSection("Dosis", "Adultos: 15 mg/kg/día, dividido cada 8-12 horas o en dosis única diaria (dosis extendida). Ajustar según función renal y niveles plasmáticos.")}
        {renderDetailSection("Dilución", "Diluir la dosis en 50-200 ml de suero fisiológico 0.9% o suero glucosado 5%.")}
        {renderDetailSection("Administración", "Infusión intravenosa intermitente durante 30 a 60 minutos. También puede administrarse por vía intramuscular profunda.")}
        {renderDetailSection("Estabilidad de Solución", "Estable por 24 horas a temperatura ambiente una vez diluido.")}
        {renderDetailSection("RAM / Observaciones", "Nefrotoxicidad (reversible) y ototoxicidad (irreversible, coclear y vestibular). Riesgo aumentado con dosis altas, tratamiento prolongado, deshidratación, y uso concomitante de otros fármacos nefrotóxicos. Requiere monitoreo de la función renal y niveles plasmáticos (peak y valle) para ajustar dosis.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AmikacinaCard;
