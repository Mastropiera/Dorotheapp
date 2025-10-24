
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const DiazepamCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Benzodiazepina de acción prolongada. Ansiolítico, sedante, miorrelajante, anticonvulsivante.")}
        {renderDetailSection("Presentación", "Ampolla de 10 mg / 2 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de la ansiedad severa, status epilepticus, sedación preoperatoria, espasmos musculares, síndrome de abstinencia alcohólica.")}
        {renderDetailSection("Dosis", "Status epilepticus: 5-10 mg IV lento, puede repetirse cada 10-15 minutos hasta un máximo de 30 mg. Sedación: 2-10 mg IV lento.")}
        {renderDetailSection("Dilución", "Generalmente se administra sin diluir. NO se recomienda diluir en grandes volúmenes de soluciones IV debido al riesgo de precipitación. Si se diluye, debe ser justo antes de la administración en una pequeña cantidad de SF 0.9% o SG 5% y observar si hay turbidez.")}
        {renderDetailSection("Administración", "Bolo intravenoso MUY LENTO, no exceder 5 mg/minuto. La administración rápida puede causar apnea, hipotensión y tromboflebitis. Administrar en una vena de gran calibre. NO administrar por vía IM debido a absorción errática y dolor intenso.")}
        {renderDetailSection("Antídoto", "Flumazenil.")}
        {renderDetailSection("RAM / Observaciones", "Depresión respiratoria, hipotensión, somnolencia, confusión, ataxia. La formulación inyectable contiene propilenglicol, que puede ser tóxico en altas dosis. Monitorear de cerca el estado respiratorio y hemodinámico.")}
      </Accordion>
    </ScrollArea>
  );
};

export default DiazepamCard;
