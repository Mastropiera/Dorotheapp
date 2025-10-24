
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const DantrolenoCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Relajante muscular de acción directa. Actúa sobre el retículo sarcoplásmico, inhibiendo la liberación de calcio.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 20 mg de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Tratamiento de la crisis de hipertermia maligna. Prevención en pacientes susceptibles. Tratamiento de la espasticidad severa.")}
        {renderDetailSection("Reconstitución", "Reconstituir cada vial de 20 mg con 60 ml de Agua para Inyectables (API) sin agente bacteriostático. Agitar vigorosamente hasta que la solución sea clara.")}
        {renderDetailSection("Dosis", "Crisis de Hipertermia Maligna: Dosis inicial de 2.5 mg/kg IV en bolo rápido. Se puede repetir cada 5-10 minutos hasta controlar los síntomas, con una dosis total máxima de 10 mg/kg.")}
        {renderDetailSection("Administración", "Administrar por inyección intravenosa rápida. Es una solución muy irritante, asegurar una vía venosa permeable.")}
        {renderDetailSection("Estabilidad de Solución", "Usar dentro de las 6 horas posteriores a la reconstitución. Proteger de la luz directa y no transferir a envases de vidrio.")}
        {renderDetailSection("RAM / Observaciones", "Debilidad muscular, somnolencia, mareos, diarrea. Hepatotoxicidad (más común con el uso oral crónico). La extravasación puede causar necrosis tisular severa.")}
      </Accordion>
    </ScrollArea>
  );
};

export default DantrolenoCard;
