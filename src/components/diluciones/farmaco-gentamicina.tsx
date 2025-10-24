
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const GentamicinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico aminoglucósido. Bactericida de amplio espectro para bacterias gramnegativas.")}
        {renderDetailSection("Presentación", "Ampollas de 20 mg/2 ml, 40 mg/1 ml, 80 mg/2 ml, 160 mg/2 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de infecciones graves causadas por bacterias gramnegativas susceptibles (sepsis, infecciones del tracto urinario complicadas, neumonía nosocomial).")}
        {renderDetailSection("Dosis", "Adultos: 3-5 mg/kg/día, administrado en una dosis única diaria (dosis extendida) o dividido cada 8 horas. La dosificación debe ser ajustada según la función renal y los niveles plasmáticos.")}
        {renderDetailSection("Dilución", "Para infusión IV, diluir la dosis en 50-200 ml de Suero Fisiológico 0.9% o Suero Glucosado 5%.")}
        {renderDetailSection("Administración", "Infusión intravenosa intermitente durante 30 a 60 minutos.")}
        {renderDetailSection("RAM / Observaciones", "Nefrotoxicidad y ototoxicidad son los efectos adversos más significativos y limitantes de la dosis. El riesgo aumenta con la duración del tratamiento, dosis altas y en pacientes con insuficiencia renal preexistente. Requiere monitoreo de la función renal (creatinina sérica) y niveles plasmáticos (peak y valle).")}
      </Accordion>
    </ScrollArea>
  );
};

export default GentamicinaCard;
