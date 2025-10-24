"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';

const AdrenalinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Catecolamina. Agonista alfa y beta-adrenérgico. Vasopresor, inótropo y cronótropo positivo. Agonista alfa 1, alfa 2, beta 1, beta 2, beta 3.")}
        {renderDetailSection("Presentación", "Ampolla de 1mg/1ml")}
        {renderDetailSection("Indicaciones", "Shock cardiogénico, anafilaxia, paro cardíaco, broncoespasmo agudo.")}
        {renderDetailSection("Dosis", "0,01 a 0,5 mcg/kg/min en infusión continua.")}
        {renderDetailSection("Dilución", "Dilución estándar: 8 ampollas (8mg) en 250 ml de SF 0,9% o SG 5% = 32 mcg/ml.\nSe recomienda diluir en volúmenes de 100 a 500 ml para obtener concentraciones adecuadas para infusión continua.")}
        {renderDetailSection("Administración", "Infusión intravenosa continua (BIC). Administrar por vía central de preferencia para evitar extravasación y necrosis tisular.")}
        {renderDetailSection("Estabilidad", "Estable 24 horas a temperatura ambiente en SF 0,9% o SG 5%. Proteger de la luz.")}
        {renderDetailSection("RAM / Observaciones", "Taquicardia, arritmias, hipertensión, vasoconstricción periférica, ansiedad, cefalea. Monitoreo continuo de PA, FC y ECG. Vigilar sitio de punción.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AdrenalinaCard;
