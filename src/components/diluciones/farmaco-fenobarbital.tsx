
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const FenobarbitalCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Anticonvulsivante, barbitúrico de acción prolongada. Sedante, hipnótico.")}
        {renderDetailSection("Presentación", "Ampolla de 200 mg / 1 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento del status epilepticus, convulsiones tónico-clónicas generalizadas, convulsiones parciales. Sedación. Hiperbilirrubinemia neonatal.")}
        {renderDetailSection("Dosis", <><strong>Status epilepticus (Dosis de carga):</strong> 15-20 mg/kg IV.<br/><strong>Mantenimiento:</strong> 1-3 mg/kg/día IV, IM o VO.</>)}
        {renderDetailSection("Administración", "Administración IV LENTA, a una velocidad no superior a 60 mg/minuto para evitar depresión respiratoria severa e hipotensión. También se puede administrar por vía intramuscular profunda.")}
        {renderDetailSection("Estabilidad de Solución", "Es una solución alcalina. Verificar compatibilidad antes de mezclar con otros fármacos. Puede precipitar en soluciones ácidas.")}
        {renderDetailSection("RAM / Observaciones", "Depresión respiratoria, hipotensión (especialmente con administración rápida), sedación, ataxia, nistagmo. Es un potente inductor de enzimas hepáticas (CYP450), afectando el metabolismo de muchos otros fármacos. Requiere monitoreo de la función respiratoria y cardiovascular durante la administración IV.")}
      </Accordion>
    </ScrollArea>
  );
};

export default FenobarbitalCard;
