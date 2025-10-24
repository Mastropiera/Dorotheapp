
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const ClorpromazinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antipsicótico típico (fenotiazina), antiemético, sedante.")}
        {renderDetailSection("Presentación", "Ampolla de 25 mg / 5 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de psicosis agudas, esquizofrenia. Control de náuseas y vómitos severos. Hipo incoercible. Tétanos (como coadyuvante).")}
        {renderDetailSection("Dosis", "Varía según indicación. Agitación psicótica en adultos: 25-50 mg IM, puede repetirse en 1 hora. Infusión IV: 25-50 mg diluidos, administrados lentamente.")}
        {renderDetailSection("Dilución", "Para infusión IV, diluir 25 mg en al menos 250 ml de Suero Fisiológico 0.9%. La concentración no debe exceder 1 mg/ml.")}
        {renderDetailSection("Administración", "Administración IM profunda. Para IV, debe ser en infusión lenta para minimizar el riesgo de hipotensión. El paciente debe permanecer en decúbito durante al menos 30 minutos post-administración IV.")}
        {renderDetailSection("RAM / Observaciones", "Hipotensión ortostática severa (riesgo principal con la administración parenteral). Sedación, efectos extrapiramidales (distonías, acatisia), síndrome neuroléptico maligno (raro pero grave). Efectos anticolinérgicos (boca seca, retención urinaria).")}
      </Accordion>
    </ScrollArea>
  );
};

export default ClorpromazinaCard;
