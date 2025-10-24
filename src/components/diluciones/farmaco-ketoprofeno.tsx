"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const KetoprofenoCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antiinflamatorio no esteroideo (AINE). Analgésico, antiinflamatorio y antipirético.")}
        {renderDetailSection("Presentación", "Frasco ampolla de 100 mg de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Tratamiento del dolor agudo de moderado a severo, como dolor postoperatorio, cólico renal, dolor lumbar.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 100 mg con 5 ml de API.")}
        {renderDetailSection("Dosis", "Adultos: 100 mg cada 12-24 horas, IV o IM. Dosis máxima: 200 mg/día.")}
        {renderDetailSection("Dilución", "Para infusión IV, diluir la dosis reconstituida en 100 ml de SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Infusión intravenosa intermitente durante 20 minutos. También puede administrarse por vía intramuscular profunda.")}
        {renderDetailSection("RAM / Observaciones", "Riesgo de efectos adversos gastrointestinales (úlcera, sangrado), cardiovasculares (hipertensión, infarto) y renales. Usar la dosis más baja efectiva por el menor tiempo posible.")}
      </Accordion>
    </ScrollArea>
  );
};

export default KetoprofenoCard;
