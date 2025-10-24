"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';

const DopaminaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Catecolamina, vasopresor, inotropo. Sus efectos son dosis-dependientes (receptores dopaminérgicos, beta y alfa).")}
        {renderDetailSection("Presentación", "Ampolla de 200 mg / 5 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de la hipotensión aguda (shock), bajo gasto cardíaco, bradicardia sintomática.")}
        {renderDetailSection("Dosis", <><strong>Dosis dopaminérgica (renal):</strong> 1-3 mcg/kg/min (aumenta flujo renal).<br/><strong>Dosis beta (inotrópica):</strong> 3-10 mcg/kg/min (aumenta contractilidad y FC).<br/><strong>Dosis alfa (vasopresora):</strong> 10-20 mcg/kg/min (produce vasoconstricción). </>)}
        {renderDetailSection("Dilución", "Dilución estándar: 400 mg (2 ampollas) en 250 ml de SF 0,9% o SG 5% = 1600 mcg/ml.")}
        {renderDetailSection("Administración", "Infusión intravenosa continua (BIC). Administrar por vía central para minimizar el riesgo de extravasación.")}
        {renderDetailSection("Estabilidad", "Estable 24 horas a temperatura ambiente. Incompatible con soluciones alcalinas como bicarbonato de sodio.")}
        {renderDetailSection("RAM / Observaciones", "Taquiarritmias, hipertensión, vasoconstricción excesiva, náuseas. Requiere monitoreo hemodinámico invasivo. No mezclar con bicarbonato.")}
      </Accordion>
    </ScrollArea>
  );
};

export default DopaminaCard;
