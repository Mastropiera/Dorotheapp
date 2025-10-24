
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const AcidoValproicoCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Anticonvulsivante, estabilizador del ánimo.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 400 mg de polvo liofilizado + ampolla de 4 ml de solvente (API).")}
        {renderDetailSection("Indicaciones", "Tratamiento de crisis de ausencia, crisis parciales complejas, status epilepticus. Profilaxis de migraña. Manía aguda en trastorno bipolar.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 400 mg con sus 4 ml de solvente para obtener una solución de 100 mg/ml.")}
        {renderDetailSection("Dosis", "Status epilepticus: Dosis de carga de 20-40 mg/kg IV a una velocidad de 3-6 mg/kg/min. Dosis de mantención: 1-5 mg/kg/hr.")}
        {renderDetailSection("Dilución", "Diluir la dosis reconstituida en un volumen compatible (ej. 50-100 ml) de suero fisiológico 0.9% o suero glucosado 5%.")}
        {renderDetailSection("Administración", "Infusión intravenosa durante 60 minutos. Velocidad máxima de 20 mg/minuto.")}
        {renderDetailSection("Estabilidad de Solución", "La solución reconstituida y diluida es estable por 24 horas a temperatura ambiente.")}
        {renderDetailSection("RAM / Observaciones", "Hepatotoxicidad (riesgo mayor en niños <2 años), pancreatitis, trombocitopenia, hiperamonemia, somnolencia, mareos. Monitorizar función hepática, amilasa, y hemograma. Niveles terapéuticos: 50-100 mcg/ml.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AcidoValproicoCard;
