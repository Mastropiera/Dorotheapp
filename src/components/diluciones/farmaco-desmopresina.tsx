
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const DesmopresinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Análogo sintético de la vasopresina (hormona antidiurética, ADH). Aumenta la reabsorción de agua en los riñones y aumenta los niveles de Factor VIII y factor von Willebrand.")}
        {renderDetailSection("Presentación", "Ampolla de 4 mcg / 1 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de la diabetes insípida central. Hemofilia A leve y enfermedad de von Willebrand tipo I (para control de hemorragias menores). Enuresis nocturna primaria.")}
        {renderDetailSection("Dosis", "Diabetes insípida: Adultos 1-4 mcg/día IV o SC, generalmente dividido en 2 dosis. Hemofilia/vW: 0.3 mcg/kg IV.")}
        {renderDetailSection("Dilución", "Para infusión, diluir la dosis requerida en 50 ml de Suero Fisiológico 0.9%.")}
        {renderDetailSection("Administración", "Infusión intravenosa durante 15 a 30 minutos. También puede administrarse por vía subcutánea.")}
        {renderDetailSection("RAM / Observaciones", "El principal riesgo es la hiponatremia por retención hídrica, que puede llevar a convulsiones. Es crucial restringir la ingesta de líquidos después de la administración. Otros efectos incluyen cefalea, náuseas, dolor abdominal, y reacciones en el sitio de inyección.")}
      </Accordion>
    </ScrollArea>
  );
};

export default DesmopresinaCard;

