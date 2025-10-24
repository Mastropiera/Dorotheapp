
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const CaspofunginaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antifúngico, equinocandina. Inhibe la síntesis de (1,3)-β-D-glucano, un componente esencial de la pared celular de muchos hongos filamentosos y levaduras.")}
        {renderDetailSection("Presentación", "Vial con 50 mg o 70 mg de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Tratamiento de candidiasis invasiva, esofágica; aspergilosis invasiva en pacientes refractarios o intolerantes a otras terapias.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial con 10.5 ml de SF 0.9% (NO usar soluciones con glucosa).")}
        {renderDetailSection("Dosis", <><strong>Candidiasis invasiva:</strong> Dosis de carga de 70 mg el día 1, seguido de 50 mg diarios.<br/><strong>Aspergilosis:</strong> Dosis de carga de 70 mg el día 1, seguido de 50 mg diarios. Se puede aumentar a 70 mg si la respuesta no es adecuada.</>)}
        {renderDetailSection("Dilución", "Transferir el volumen requerido de la solución reconstituida (ej. 10 ml para dosis de 50 mg) a una bolsa de 250 ml de SF 0.9% para infusión. NO usar SG 5%.")}
        {renderDetailSection("Administración", "Infusión intravenosa lenta, administrada durante aproximadamente 1 hora.")}
        {renderDetailSection("Estabilidad de Solución", "La solución diluida para infusión debe usarse dentro de 24 horas si se almacena a temperatura ambiente (≤25°C) o dentro de 48 horas si se refrigera (2-8°C).")}
        {renderDetailSection("RAM / Observaciones", "Fiebre, flebitis en el sitio de infusión, náuseas, vómitos, rash. Posible elevación de enzimas hepáticas. Menos tóxico que la Anfotericina B.")}
      </Accordion>
    </ScrollArea>
  );
};

export default CaspofunginaCard;
