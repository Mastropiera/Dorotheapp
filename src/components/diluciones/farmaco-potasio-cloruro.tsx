
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const PotasioCloruroCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Electrolito esencial.")}
        {renderDetailSection("Presentación", "Ampolla de Cloruro de Potasio (KCl) al 10% (1g en 10 ml). 1 g KCl = 13.4 mEq de K+.")}
        {renderDetailSection("Indicaciones", "Tratamiento y prevención de la hipokalemia.")}
        {renderDetailSection("Dosis", "Depende del déficit de potasio del paciente. Debe calcularse cuidadosamente.")}
        {renderDetailSection("Dilución", "¡NUNCA ADMINISTRAR SIN DILUIR! Diluir siempre en un gran volumen de fluido IV (SF 0.9% o SG 5%). La concentración máxima recomendada es de 40 mEq/L para vía periférica y 80 mEq/L para vía central.")}
        {renderDetailSection("Administración", "Infusión intravenosa LENTA con bomba de infusión. Velocidad máxima por vía periférica: 10 mEq/hora. Por vía central: 20 mEq/hora (en situaciones críticas y con monitorización ECG).")}
        {renderDetailSection("RAM / Observaciones", "Fármaco de alto riesgo. La administración rápida o sobredosis puede causar hiperkalemia fatal con arritmias cardíacas y paro cardíaco. Irritante para las venas, puede causar flebitis y dolor en el sitio de infusión.")}
      </Accordion>
    </ScrollArea>
  );
};

export default PotasioCloruroCard;
