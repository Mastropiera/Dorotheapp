
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const BetametasonaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Corticosteroide de acción prolongada con potentes propiedades antiinflamatorias e inmunosupresoras.")}
        {renderDetailSection("Presentación", "Ampolla de 4 mg / 1 ml (como fosfato sódico).")}
        {renderDetailSection("Indicaciones", "Tratamiento de estados inflamatorios y alérgicos severos. Maduración pulmonar fetal en partos prematuros. Edema cerebral.")}
        {renderDetailSection("Dosis", "Varía ampliamente según la indicación. Dosis común: 4-20 mg IV/IM. Maduración pulmonar fetal: 12 mg IM, repetir en 24 horas (2 dosis en total).")}
        {renderDetailSection("Administración", "Puede administrarse por vía IV lenta o IM profunda. La administración IV debe ser lenta para evitar reacciones.")}
        {renderDetailSection("Dilución", "Generalmente se administra sin diluir para dosis de bolo. Para infusión, puede diluirse en SF 0.9% o SG 5%.")}
        {renderDetailSection("RAM / Observaciones", "Uso agudo: hiperglicemia, hipertensión, alteraciones del ánimo. Uso crónico: supresión adrenal, osteoporosis, síndrome de Cushing, aumento del riesgo de infecciones. La suspensión debe ser gradual tras uso prolongado.")}
      </Accordion>
    </ScrollArea>
  );
};

export default BetametasonaCard;
