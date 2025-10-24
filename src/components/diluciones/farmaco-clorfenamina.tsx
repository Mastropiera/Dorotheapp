
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const ClorfenaminaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antihistamínico H1 de primera generación, anticolinérgico.")}
        {renderDetailSection("Presentación", "Ampolla de 10 mg / 1 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de reacciones alérgicas agudas, urticaria, angioedema, rinitis alérgica. Coadyuvante en anafilaxia.")}
        {renderDetailSection("Dosis", "Adultos: 10 a 20 mg IM, SC o IV lento. Dosis máxima diaria: 40 mg.")}
        {renderDetailSection("Dilución", "Para administración IV, puede diluirse en 10 ml de SF 0.9% para facilitar la administración lenta.")}
        {renderDetailSection("Administración", "La administración IV debe ser LENTA, durante al menos 1 minuto, para minimizar el riesgo de mareos e hipotensión.")}
        {renderDetailSection("RAM / Observaciones", "Sedación y somnolencia son los efectos más comunes. Efectos anticolinérgicos como boca seca, visión borrosa, retención urinaria. Usar con precaución en pacientes con glaucoma, hipertrofia prostática o asma.")}
      </Accordion>
    </ScrollArea>
  );
};

export default ClorfenaminaCard;
