
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const LinezolidCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico del grupo de las oxazolidinonas. Actividad bacteriostática contra la mayoría de los gérmenes grampositivos.")}
        {renderDetailSection("Presentación", "Bolsa para infusión intravenosa lista para usar de 600 mg / 300 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de infecciones graves causadas por bacterias grampositivas resistentes, incluyendo Staphylococcus aureus meticilino-resistente (SAMR) y Enterococcus faecium vancomicina-resistente (VRE). Neumonía nosocomial y comunitaria.")}
        {renderDetailSection("Dosis", "Adultos: 600 mg IV cada 12 horas.")}
        {renderDetailSection("Administración", "Infusión intravenosa durante 30 a 120 minutos. Viene listo para usar, no requiere dilución adicional. No mezclar con otros fármacos en la misma vía.")}
        {renderDetailSection("RAM / Observaciones", "Mielosupresión (trombocitopenia, anemia, leucopenia) es un riesgo significativo, especialmente con tratamientos de más de 2 semanas. Neuropatía periférica y óptica con uso prolongado. Riesgo de síndrome serotoninérgico si se coadministra con agentes serotoninérgicos (ISRS, IMAO). Requiere monitoreo del hemograma semanalmente.")}
      </Accordion>
    </ScrollArea>
  );
};

export default LinezolidCard;
