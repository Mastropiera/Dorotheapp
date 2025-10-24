
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const CiprofloxacinoCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico del grupo de las fluoroquinolonas. Inhibe la ADN girasa bacteriana.")}
        {renderDetailSection("Presentación", "Frasco listo para usar (pre-diluido) de 200 mg / 100 ml y 400 mg / 200 ml.")}
        {renderDetailSection("Indicaciones", "Infecciones del tracto urinario complicadas, infecciones del tracto respiratorio inferior, infecciones de la piel, huesos y articulaciones, infecciones intraabdominales.")}
        {renderDetailSection("Dosis", "Adultos: 200-400 mg cada 8-12 horas IV.")}
        {renderDetailSection("Dilución", "Generalmente viene pre-diluido y listo para usar. Si se necesita diluir un concentrado, usar SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Infusión intravenosa lenta durante al menos 60 minutos. La administración rápida puede aumentar el riesgo de reacciones adversas.")}
        {renderDetailSection("RAM / Observaciones", "Náuseas, diarrea, rash. Efectos adversos graves (aunque raros) incluyen tendinitis y ruptura de tendón (especialmente tendón de Aquiles), neuropatía periférica, y efectos sobre el SNC (confusión, convulsiones). Puede prolongar el intervalo QT. Evitar en niños y embarazo si es posible.")}
      </Accordion>
    </ScrollArea>
  );
};

export default CiprofloxacinoCard;
