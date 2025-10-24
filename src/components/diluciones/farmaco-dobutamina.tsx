"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';

const DobutaminaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Agente inotrópico β1-adrenérgico. Aumenta la contractilidad cardíaca y el gasto cardíaco con escaso efecto cronotrópico.")}
        {renderDetailSection("Presentación", "Ampolla de 250mg/5ml o 250mg/20ml.")}
        {renderDetailSection("Indicaciones", "Insuficiencia cardíaca aguda, shock cardiogénico, soporte inotrópico post-cirugía cardíaca.")}
        {renderDetailSection("Dosis", "2,5 a 15 mcg/kg/min en infusión continua. Se puede titular hasta 40 mcg/kg/min según respuesta.")}
        {renderDetailSection("Dilución", "Dilución estándar: 500 mg (2 ampollas) en 250 ml de SF 0,9% o SG 5% = 2000 mcg/ml.\nCompatible con la mayoría de sueros IV comunes.")}
        {renderDetailSection("Administración", "Infusión intravenosa continua (BIC). Preferiblemente por vía central, pero puede usarse una vena periférica de gran calibre.")}
        {renderDetailSection("Estabilidad", "Estable 24 horas a temperatura ambiente. La solución puede adquirir un color rosado que no indica pérdida de potencia.")}
        {renderDetailSection("RAM / Observaciones", "Taquicardia, arritmias, hipertensión, náuseas, cefalea. Monitoreo hemodinámico continuo es esencial.")}
      </Accordion>
    </ScrollArea>
  );
};

export default DobutaminaCard;
