"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';

const FurosemidaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Diurético de asa. Inhibe la reabsorción de sodio y cloro en el asa ascendente de Henle, provocando una diuresis potente.")}
        {renderDetailSection("Presentación", "Ampolla de 20 mg / 2 ml.")}
        {renderDetailSection("Indicaciones", "Edema agudo de pulmón, insuficiencia cardíaca congestiva, edema asociado a insuficiencia renal o hepática, crisis hipertensivas.")}
        {renderDetailSection("Dosis", <><strong>Bolo IV:</strong> 20-40 mg, puede repetirse y aumentarse cada 2 horas si es necesario.<br/><strong>Infusión continua:</strong> Bolo inicial de 40 mg, seguido de infusión a 10-40 mg/hora. No exceder 4 mg/min para evitar ototoxicidad.</>)}
        {renderDetailSection("Dilución", "Para infusión continua, diluir en SF 0,9% o SG 5%. Una dilución común es 250 mg en 250 ml (1 mg/ml). No debe administrarse en soluciones ácidas.")}
        {renderDetailSection("Administración", "Bolo intravenoso lento (1-2 minutos). Para dosis altas o infusión continua, la velocidad no debe exceder 4 mg/minuto.")}
        {renderDetailSection("Estabilidad", "La solución diluida debe usarse dentro de 24 horas. Proteger de la luz. Si se vuelve amarilla, no usar.")}
        {renderDetailSection("RAM / Observaciones", "Desequilibrio hidroelectrolítico (hipokalemia, hiponatremia), hipotensión, ototoxicidad (especialmente con infusión rápida o en pacientes con insuficiencia renal), hiperuricemia, hiperglucemia. Monitorear electrolitos, función renal y presión arterial.")}
      </Accordion>
    </ScrollArea>
  );
};

export default FurosemidaCard;
