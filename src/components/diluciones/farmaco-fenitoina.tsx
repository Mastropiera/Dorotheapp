"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const FenitoinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Anticonvulsivante, antiarrítmico (Clase Ib).")}
        {renderDetailSection("Presentación", "Ampolla de 250 mg / 5 ml (50 mg/ml).")}
        {renderDetailSection("Indicaciones", "Status epilepticus de tipo tónico-clónico. Crisis tónico-clónicas generalizadas y crisis parciales. Profilaxis de convulsiones en neurocirugía.")}
        {renderDetailSection("Dosis", <><strong>Status epilepticus (Dosis de carga):</strong> 15-20 mg/kg IV.<br/><strong>Mantenimiento:</strong> 100 mg IV cada 6-8 horas.</>)}
        {renderDetailSection("Dilución", "Diluir exclusivamente en Suero Fisiológico 0.9% a una concentración final no superior a 10 mg/ml. NO usar suero glucosado por riesgo de precipitación.")}
        {renderDetailSection("Administración", "Infusión intravenosa LENTA. La velocidad no debe exceder los 50 mg/minuto en adultos (1-3 mg/kg/min en neonatos) para evitar hipotensión y arritmias. Administrar con un filtro en línea de 0.22 a 0.5 micras.")}
        {renderDetailSection("Estabilidad de Solución", "La solución diluida debe administrarse inmediatamente o dentro de 1-4 horas, ya que puede precipitar con el tiempo.")}
        {renderDetailSection("RAM / Observaciones", "Hipotensión, arritmias cardíacas (especialmente con administración rápida). Extravasación puede causar irritación tisular severa (síndrome del guante púrpura). Ataxia, nistagmo, confusión. Monitorización continua de ECG y presión arterial durante la infusión de carga. Niveles terapéuticos: 10-20 mcg/ml.")}
      </Accordion>
    </ScrollArea>
  );
};

export default FenitoinaCard;
