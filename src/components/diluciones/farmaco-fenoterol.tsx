
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const FenoterolCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Agonista selectivo de los receptores beta-2 adrenérgicos de acción corta. Broncodilatador y tocolítico (relajante uterino).")}
        {renderDetailSection("Presentación", "Ampolla de 0.5 mg / 10 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de la crisis asmática grave. Manejo a corto plazo del parto prematuro no complicado (tocolisis).")}
        {renderDetailSection("Dosis", <><strong>Tocólisis:</strong> Infusión IV continua, iniciar a 0.5 mcg/min e incrementar cada 20 min hasta cese de contracciones. Dosis máxima habitual 4 mcg/min.<br/><strong>Crisis asmática:</strong> 0.5-2.5 mcg/min en infusión IV, titular según respuesta.</>)}
        {renderDetailSection("Dilución", "Diluir en Suero Glucosado 5%. Para tocólisis, una dilución común es 2.5 mg (5 ampollas) en 500 ml de SG 5% para obtener una concentración de 5 mcg/ml.")}
        {renderDetailSection("Administración", "Infusión intravenosa continua utilizando una bomba de infusión para un control preciso de la velocidad.")}
        {renderDetailSection("RAM / Observaciones", "Taquicardia, palpitaciones, temblores, cefalea, hiperglicemia, hipokalemia. Monitorización continua de la frecuencia cardíaca materna y fetal, presión arterial y niveles de potasio. Riesgo de edema pulmonar, especialmente si se usan corticoides concomitantemente.")}
      </Accordion>
    </ScrollArea>
  );
};

export default FenoterolCard;
