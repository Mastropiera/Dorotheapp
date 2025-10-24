
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const AcidoTranexamicoCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antifibrinolítico. Inhibe competitivamente la activación del plasminógeno, y a altas concentraciones, inhibe la plasmina.")}
        {renderDetailSection("Presentación", "Ampolla de 500 mg / 5 ml (100 mg/ml).")}
        {renderDetailSection("Indicaciones", "Prevención y tratamiento de hemorragias asociadas a fibrinólisis excesiva. Menorragia, cirugía, trauma, hemofilia.")}
        {renderDetailSection("Contraindicaciones", "Hipersensibilidad, historia de trombosis venosa o arterial, coagulación intravascular diseminada (CID) con hiperfibrinólisis, insuficiencia renal grave.")}
        {renderDetailSection("Dosis", "Adultos: 10-15 mg/kg IV cada 8 horas. Dosis habitual: 1 gramo cada 8 horas.")}
        {renderDetailSection("Dilución", "Diluir en suero fisiológico 0.9% o suero glucosado 5% en un volumen adecuado (ej. 100 ml) para infusión.")}
        {renderDetailSection("Administración", "Administrar por infusión intravenosa LENTA, a una velocidad no superior a 1 ml/minuto (100 mg/min) para evitar hipotensión.")}
        {renderDetailSection("Estabilidad de Solución", "Estable por 24 horas a temperatura ambiente una vez diluido.")}
        {renderDetailSection("RAM / Observaciones", "Náuseas, vómitos, diarrea (común). Hipotensión si se administra demasiado rápido. Riesgo de trombosis, especialmente en pacientes con factores de riesgo. Convulsiones con dosis altas. Alteraciones visuales.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AcidoTranexamicoCard;
