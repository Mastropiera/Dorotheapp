
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const LidocainaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Anestésico local tipo amida, antiarrítmico de clase Ib.")}
        {renderDetailSection("Presentación", "Ampolla al 1% (10 mg/ml) y al 2% (20 mg/ml), generalmente sin epinefrina para uso IV.")}
        {renderDetailSection("Indicaciones", "Tratamiento de arritmias ventriculares (taquicardia ventricular, fibrilación ventricular) post-infarto de miocardio o cirugía cardíaca. Anestesia local o regional.")}
        {renderDetailSection("Dosis", <><strong>Antiarrítmico:</strong> Bolo IV inicial de 1-1.5 mg/kg, seguido de bolos adicionales de 0.5-0.75 mg/kg cada 5-10 min si es necesario. Infusión de mantenimiento de 1-4 mg/minuto.</>)}
        {renderDetailSection("Dilución", "Para infusión continua, diluir en Suero Glucosado al 5% para obtener una concentración de 1 a 4 mg/ml (ej. 1 g en 250 ml = 4 mg/ml).")}
        {renderDetailSection("Administración", "Bolo intravenoso lento. Infusión continua con bomba de infusión.")}
        {renderDetailSection("RAM / Observaciones", "Toxicidad del SNC es dosis-dependiente: somnolencia, mareos, parestesias, desorientación, convulsiones. Depresión cardiovascular, hipotensión, bradicardia, asistolia. Monitorizar ECG y estado neurológico. Reducir dosis en insuficiencia cardíaca o hepática.")}
      </Accordion>
    </ScrollArea>
  );
};

export default LidocainaCard;

