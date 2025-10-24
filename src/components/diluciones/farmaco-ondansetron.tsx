
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const OndansetronCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antiemético, antagonista selectivo de los receptores de serotonina 5-HT3.")}
        {renderDetailSection("Presentación", "Ampolla de 4 mg / 2 ml y 8 mg / 4 ml.")}
        {renderDetailSection("Indicaciones", "Prevención y tratamiento de náuseas y vómitos inducidos por quimioterapia, radioterapia y postoperatorios.")}
        {renderDetailSection("Dosis", "Adultos: 8 mg IV lento o en infusión, administrado 30 minutos antes de la quimioterapia. Dosis postoperatoria: 4 mg IV.")}
        {renderDetailSection("Dilución", "Puede administrarse sin diluir o diluido en 50-100 ml de SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Bolo IV lento (no menos de 30 segundos, preferiblemente 2-5 minutos). Infusión intermitente durante 15 minutos.")}
        {renderDetailSection("RAM / Observaciones", "Cefalea, estreñimiento, sensación de calor o enrojecimiento. Riesgo de prolongación del intervalo QT, especialmente con dosis altas, hipokalemia o hipomagnesemia.")}
      </Accordion>
    </ScrollArea>
  );
};

export default OndansetronCard;
