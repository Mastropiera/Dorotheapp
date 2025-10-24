"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';

const NoradrenalinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Vasopresor potente con acción predominante alfa-adrenérgica. Produce vasoconstricción y aumento de la presión arterial con leve efecto inotrópico.")}
        {renderDetailSection("Presentación", "Ampolla de 4mg/4ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de primera línea para la hipotensión en shock séptico y otros estados de shock con vasodilatación.")}
        {renderDetailSection("Dosis", "Iniciar con 0.05-0.1 mcg/kg/min y titular hasta alcanzar la Presión Arterial Media (PAM) objetivo (generalmente >65 mmHg).")}
        {renderDetailSection("Dilución", "Diluciones estándar: 4mg en 250ml SG 5% (16 mcg/ml) u 8mg en 250ml SG 5% (32 mcg/ml). Siempre diluir, nunca administrar directo.")}
        {renderDetailSection("Administración", "Infusión intravenosa continua (BIC). Administrar siempre por vía venosa central para evitar el riesgo de extravasación y necrosis tisular severa.")}
        {renderDetailSection("Estabilidad", "Estable por 24 horas a temperatura ambiente en SG 5%. Proteger de la luz.")}
        {renderDetailSection("RAM / Observaciones", "Hipertensión severa, isquemia periférica/mesentérica, bradicardia refleja, arritmias. Requiere monitoreo continuo e invasivo de la presión arterial.")}
      </Accordion>
    </ScrollArea>
  );
};

export default NoradrenalinaCard;
