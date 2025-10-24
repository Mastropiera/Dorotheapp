
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const CefepimeCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico cefalosporina de cuarta generación de amplio espectro. Activo contra bacterias grampositivas y gramnegativas, incluyendo Pseudomonas aeruginosa.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 1 g o 2 g de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Neumonía, infecciones complicadas del tracto urinario, infecciones de piel y tejidos blandos, infecciones intraabdominales complicadas, neutropenia febril.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 1 g con 10 ml de solvente compatible (SF 0.9%, SG 5%, API).")}
        {renderDetailSection("Dosis", "Adultos: 1-2 g cada 8-12 horas, dependiendo de la severidad de la infección.")}
        {renderDetailSection("Dilución", "Diluir la dosis reconstituida en 50-100 ml de un solvente compatible para infusión IV.")}
        {renderDetailSection("Administración", "Infusión intravenosa intermitente durante 30 minutos.")}
        {renderDetailSection("Estabilidad de Solución", "Estable 24 horas a temperatura ambiente y 7 días refrigerado.")}
        {renderDetailSection("RAM / Observaciones", "Neurotoxicidad (encefalopatía, mioclonías, convulsiones) es un riesgo, especialmente en pacientes con insuficiencia renal. Ajustar dosis según función renal. Otros efectos incluyen rash, diarrea, prueba de Coombs positiva.")}
      </Accordion>
    </ScrollArea>
  );
};

export default CefepimeCard;
