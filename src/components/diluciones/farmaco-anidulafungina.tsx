
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const AnidulafunginaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antifúngico, equinocandina. Inhibe la síntesis de (1,3)-β-D-glucano, un componente esencial de la pared celular fúngica.")}
        {renderDetailSection("Presentación", "Vial con 100 mg de polvo liofilizado + vial de solvente (30 ml).")}
        {renderDetailSection("Indicaciones", "Tratamiento de candidiasis invasiva en pacientes adultos no neutropénicos.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 100 mg con su solvente de 30 ml para obtener una concentración de 3.33 mg/ml. Agitar suavemente.")}
        {renderDetailSection("Dosis", <><strong>Dosis de carga:</strong> 200 mg el primer día.<br/><strong>Dosis de mantención:</strong> 100 mg una vez al día.</>)}
        {renderDetailSection("Dilución", "Diluir la dosis requerida en Suero Fisiológico 0.9% o Suero Glucosado 5% para obtener una concentración de 0.77 mg/ml. (Ej: 100 mg en 130 ml; 200 mg en 260 ml).")}
        {renderDetailSection("Administración", "Infusión intravenosa. No administrar en bolo. La velocidad de infusión no debe exceder 1.1 mg/minuto (equivalente a 1.4 ml/min o 84 ml/hora para la concentración final).")}
        {renderDetailSection("Estabilidad de Solución", "La solución reconstituida puede almacenarse hasta por 24 horas refrigerada (2-8°C). La solución para infusión es estable por 48 horas refrigerada y debe usarse dentro de 24 horas si se almacena a temperatura ambiente.")}
        {renderDetailSection("RAM / Observaciones", "Reacciones relacionadas con la infusión (fiebre, escalofríos, hipotensión, rash), hipokalemia, elevación de enzimas hepáticas. No mezclar ni administrar con otras soluciones IV o medicamentos.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AnidulafunginaCard;
