
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const AtropinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Anticolinérgico, antimuscarínico. Aumenta la frecuencia cardíaca, disminuye las secreciones y la motilidad gastrointestinal.")}
        {renderDetailSection("Presentación", "Ampolla de 1 mg / 1 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de la bradicardia sinusal sintomática. Premedicación anestésica para reducir secreciones. Antídoto para intoxicación por organofosforados y carbamatos.")}
        {renderDetailSection("Dosis", <><strong>Bradicardia (ACLS):</strong> 1 mg IV cada 3-5 minutos, hasta una dosis total de 3 mg.<br/><strong>Preanestesia:</strong> 0.4 - 0.6 mg IV/IM/SC, 30-60 minutos antes de la cirugía.</>)}
        {renderDetailSection("Dilución", "Generalmente se administra sin diluir. Para dosis pediátricas o infusiones, puede diluirse en Suero Fisiológico 0.9%.")}
        {renderDetailSection("Administración", "Bolo intravenoso rápido. Administrar lento puede causar bradicardia paradójica. También se puede usar vía IM o SC.")}
        {renderDetailSection("RAM / Observaciones", "Taquicardia, boca seca, visión borrosa, midriasis, retención urinaria, confusión (especialmente en ancianos). Contraindicado en glaucoma de ángulo estrecho, miastenia gravis, íleo paralítico.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AtropinaCard;
