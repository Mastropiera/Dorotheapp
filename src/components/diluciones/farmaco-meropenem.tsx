"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const MeropenemCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico carbapenémico de muy amplio espectro, bactericida.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 500 mg o 1 g de polvo para solución inyectable.")}
        {renderDetailSection("Indicaciones", "Tratamiento de infecciones graves como neumonía (incluida la nosocomial), infecciones intraabdominales complicadas, meningitis bacteriana, infecciones de la piel y tejidos blandos complicadas, y septicemia.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 1 g con 20 ml de Agua para Inyectables (API) o SF 0.9%.")}
        {renderDetailSection("Dosis", "Adultos: 500 mg a 2 g IV cada 8 horas, dependiendo del tipo y la gravedad de la infección. Meningitis: 2 g cada 8 horas.")}
        {renderDetailSection("Dilución", "Para infusión, diluir la solución reconstituida en 50-250 ml de SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Puede administrarse como bolo intravenoso lento (durante 3-5 minutos) o como infusión intermitente (durante 15-30 minutos). La infusión extendida (durante 3 horas) puede ser beneficiosa para optimizar la terapia.")}
        {renderDetailSection("Estabilidad de Solución", "La estabilidad varía según el diluyente y la temperatura de almacenamiento. Consultar las especificaciones del fabricante, pero generalmente es estable por varias horas a temperatura ambiente.")}
        {renderDetailSection("RAM / Observaciones", "Generalmente bien tolerado. Los efectos adversos incluyen diarrea, náuseas, vómitos, rash y reacciones en el sitio de inyección. Tiene un menor riesgo de provocar convulsiones en comparación con imipenem. Posible reacción cruzada con penicilinas.")}
      </Accordion>
    </ScrollArea>
  );
};

export default MeropenemCard;
