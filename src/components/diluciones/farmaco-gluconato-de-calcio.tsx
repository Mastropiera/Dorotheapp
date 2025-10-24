"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const GluconatoDeCalcioCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Electrolito, suplemento de calcio.")}
        {renderDetailSection("Presentación", "Ampolla al 10% (1 g / 10 ml).")}
        {renderDetailSection("Indicaciones", "Tratamiento de la hipocalcemia aguda sintomática. Paro cardíaco asociado a hiperkalemia, hipocalcemia o toxicidad por magnesio. Antídoto para sobredosis de bloqueadores de canales de calcio.")}
        {renderDetailSection("Dosis", "Varía según indicación. Hipocalcemia sintomática: 1-2 g IV. Paro cardíaco: 500-1000 mg IV.")}
        {renderDetailSection("Administración", "Infusión intravenosa LENTA. La velocidad no debe exceder 1.5-2 ml/min (150-200 mg/minuto) para evitar bradicardia, arritmias y síncope vasovagal.")}
        {renderDetailSection("Dilución", "Puede diluirse en SF 0.9% o SG 5% para facilitar la administración lenta, especialmente en pediatría.")}
        {renderDetailSection("RAM / Observaciones", "Muy irritante para las venas; la extravasación puede causar necrosis tisular severa. Administrar preferiblemente por vía central si es posible. La administración rápida puede causar sensación de calor, hormigueo, hipotensión y arritmias graves. Incompatible con soluciones que contienen bicarbonato o fosfatos (precipita).")}
      </Accordion>
    </ScrollArea>
  );
};

export default GluconatoDeCalcioCard;
