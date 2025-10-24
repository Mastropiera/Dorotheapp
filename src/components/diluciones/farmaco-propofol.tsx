
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const PropofolCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Agente anestésico general intravenoso de acción corta.")}
        {renderDetailSection("Presentación", "Ampolla o vial al 1% (10 mg/ml) o 2% (20 mg/ml). emulsión lipídica blanca.")}
        {renderDetailSection("Indicaciones", "Inducción y mantenimiento de la anestesia general. Sedación en pacientes de UCI con ventilación mecánica.")}
        {renderDetailSection("Dosis", "Inducción: 1.5-2.5 mg/kg IV. Mantenimiento anestesia: 4-12 mg/kg/hora. Sedación UCI: 0.3-4 mg/kg/hora.")}
        {renderDetailSection("Administración", "Generalmente se administra sin diluir mediante bomba de infusión. Si se diluye, usar solo SG 5% y no exceder una dilución de 1:5 (2 mg/ml).")}
        {renderDetailSection("RAM / Observaciones", "Hipotensión, bradicardia, apnea, dolor en el sitio de inyección. Riesgo de Síndrome de Infusión por Propofol (PRIS) con dosis altas y prolongadas. Es una emulsión lipídica, considerar aporte calórico. Técnica aséptica estricta en su manipulación por riesgo de contaminación bacteriana.")}
      </Accordion>
    </ScrollArea>
  );
};

export default PropofolCard;
