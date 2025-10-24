
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const AtracurioCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Bloqueante neuromuscular no despolarizante de duración intermedia.")}
        {renderDetailSection("Presentación", "Ampolla de 25 mg / 2.5 ml (10 mg/ml). Ampolla de 50 mg / 5 ml (10 mg/ml).")}
        {renderDetailSection("Indicaciones", "Relajación muscular en anestesia general, para facilitar la intubación endotraqueal y la ventilación mecánica.")}
        {renderDetailSection("Dosis", <><strong>Bolo IV:</strong> 0.3 - 0.6 mg/kg.<br/><strong>Infusión continua:</strong> 0.3 - 0.6 mg/kg/hora.</>)}
        {renderDetailSection("Dilución", "Puede administrarse sin diluir en bolo. Para infusión continua, diluir en SF 0.9%, SG 5% o Ringer Lactato a una concentración de 0.2 a 0.5 mg/ml (Ej: 50 mg en 100 ml = 0.5 mg/ml).")}
        {renderDetailSection("Administración", "Bolo intravenoso o infusión intravenosa continua (BIC).")}
        {renderDetailSection("Estabilidad de Solución", "Las soluciones diluidas son estables por 24 horas a temperatura ambiente.")}
        {renderDetailSection("RAM / Observaciones", "Puede causar liberación de histamina, resultando en enrojecimiento cutáneo, hipotensión transitoria y broncoespasmo. Requiere monitoreo de la función neuromuscular (ej. Tren de Cuatro). Su degradación (eliminación de Hofmann) es independiente de la función renal y hepática.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AtracurioCard;
