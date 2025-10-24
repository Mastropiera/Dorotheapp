
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const VoriconazolCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antifúngico triazólico de amplio espectro.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 200 mg de polvo para solución para infusión.")}
        {renderDetailSection("Indicaciones", "Tratamiento de aspergilosis invasiva, candidemia en pacientes no neutropénicos, y otras infecciones fúngicas graves.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 200 mg con 19 ml de API para obtener 20 ml de una solución de 10 mg/ml.")}
        {renderDetailSection("Dosis", "Dosis de carga: 6 mg/kg cada 12 horas para 2 dosis. Dosis de mantenimiento: 4 mg/kg cada 12 horas.")}
        {renderDetailSection("Dilución", "Diluir la dosis requerida en un volumen compatible (SF 0.9% o SG 5%) para obtener una concentración final entre 0.5 y 5 mg/ml.")}
        {renderDetailSection("Administración", "Infusión intravenosa durante 1-2 horas. No administrar en bolo. No infundir con otras soluciones o medicamentos.")}
        {renderDetailSection("RAM / Observaciones", "Alteraciones visuales (visión borrosa, cambios de color) son comunes. Hepatotoxicidad, rash cutáneo. Múltiples interacciones farmacológicas (inhibidor e inductor de CYP). Monitorizar función hepática y visual.")}
      </Accordion>
    </ScrollArea>
  );
};

export default VoriconazolCard;
