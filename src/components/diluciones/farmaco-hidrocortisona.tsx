"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const HidrocortisonaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Corticosteroide de corta acción con propiedades antiinflamatorias, inmunosupresoras y mineralocorticoides.")}
        {renderDetailSection("Presentación", "Frasco ampolla de 100 mg o 500 mg de polvo liofilizado (como succinato sódico).")}
        {renderDetailSection("Indicaciones", "Insuficiencia suprarrenal aguda (crisis addisoniana), shock (especialmente séptico), reacciones alérgicas graves (anafilaxia), crisis asmática severa, enfermedades inflamatorias y autoinmunes agudas.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial con el solvente proporcionado o con Agua para Inyectables (API).")}
        {renderDetailSection("Dosis", "Muy variable según la indicación. Dosis de estrés en shock séptico: 50-100 mg IV cada 6-8 horas. Crisis asmática: 100-500 mg IV cada 6 horas.")}
        {renderDetailSection("Administración", "Bolo intravenoso lento (durante 30 segundos a varios minutos, dependiendo de la dosis) o infusión intermitente diluida en SF 0.9% o SG 5%.")}
        {renderDetailSection("RAM / Observaciones", "Uso agudo puede causar hiperglicemia, hipertensión, hipokalemia, alteraciones del estado de ánimo (euforia, psicosis). El uso prolongado tiene los efectos adversos clásicos de los corticoides. La suspensión debe ser gradual si el tratamiento dura más de unos pocos días.")}
      </Accordion>
    </ScrollArea>
  );
};

export default HidrocortisonaCard;
