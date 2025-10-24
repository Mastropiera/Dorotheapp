
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const AnfotericinaBComplejoLipidicoCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antifúngico. Formulación lipídica de Anfotericina B con menor nefrotoxicidad que la formulación convencional.")}
        {renderDetailSection("Presentación", "Vial con 50 mg o 100 mg de polvo para suspensión.")}
        {renderDetailSection("Indicaciones", "Tratamiento de infecciones fúngicas invasivas graves, especialmente en pacientes con insuficiencia renal o que no toleran la Anfotericina B convencional.")}
        {renderDetailSection("Reconstitución", "Reconstituir únicamente con Agua para Inyectables (API). No usar sueros salinos. Agitar suavemente hasta obtener una suspensión amarilla y opaca. NO FILTRAR.")}
        {renderDetailSection("Dosis", "Generalmente 5 mg/kg/día en dosis única diaria.")}
        {renderDetailSection("Dilución", "Diluir la suspensión reconstituida únicamente en Suero Glucosado al 5% hasta una concentración final de 1-2 mg/ml. La concentración para infusión periférica no debe exceder 2 mg/ml.")}
        {renderDetailSection("Administración", "Infusión intravenosa durante al menos 2 horas. Se puede administrar una dosis de prueba (1 mg en 20 min).")}
        {renderDetailSection("Estabilidad de Solución", "La suspensión reconstituida se puede guardar refrigerada por 24 horas. La solución diluida debe usarse dentro de las 6 horas.")}
        {renderDetailSection("RAM / Observaciones", "Menor nefrotoxicidad y reacciones infusionales que la forma deoxicolato, pero aún pueden ocurrir. Fiebre, escalofríos, náuseas, vómitos, hipotensión, hipokalemia, hipomagnesemia. Se recomienda pre-medicación (paracetamol, antihistamínicos) para minimizar reacciones infusionales.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AnfotericinaBComplejoLipidicoCard;
