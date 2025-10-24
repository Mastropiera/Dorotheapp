
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const CefazolinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico cefalosporina de primera generación. Actividad bactericida contra cocos grampositivos y algunos bacilos gramnegativos.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 1 g de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Infecciones de piel y tejidos blandos, infecciones óseas, profilaxis quirúrgica, endocarditis.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 1 g con 10 ml de Agua para Inyectables (API) para obtener una concentración de 100 mg/ml.")}
        {renderDetailSection("Dosis", "Adultos: 1-2 g cada 8 horas. Profilaxis quirúrgica: 1-2 g IV 30-60 minutos antes de la incisión.")}
        {renderDetailSection("Dilución", "Para infusión IV, diluir la dosis reconstituida en 50-100 ml de SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Bolo intravenoso lento (3-5 minutos) o infusión intermitente (30-60 minutos).")}
        {renderDetailSection("Estabilidad de Solución", "Estable 24 horas a temperatura ambiente o 96 horas refrigerada después de la reconstitución.")}
        {renderDetailSection("RAM / Observaciones", "Reacciones de hipersensibilidad (rash, urticaria, anafilaxia), flebitis, diarrea. Posible reacción cruzada en pacientes con alergia a penicilinas (bajo riesgo).")}
      </Accordion>
    </ScrollArea>
  );
};

export default CefazolinaCard;
