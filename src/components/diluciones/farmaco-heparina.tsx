"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';

const HeparinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Anticoagulante. Potencia la acción de la antitrombina III, inactivando la trombina y el factor Xa, previniendo la formación de coágulos.")}
        {renderDetailSection("Presentación", "Frasco ampolla de 25.000 UI / 5 ml (5.000 UI/ml).")}
        {renderDetailSection("Indicaciones", "Tratamiento y profilaxis de trombosis venosa profunda (TVP), embolismo pulmonar (EP), fibrilación auricular con embolismo, síndromes coronarios agudos, anticoagulación en circuitos extracorpóreos.")}
        {renderDetailSection("Dosis", <><strong>TVP/EP (Bolo):</strong> 80 UI/kg (máx. 10.000 UI).<br/><strong>TVP/EP (Infusión):</strong> Iniciar con 18 UI/kg/hora.<br/>Ajustar dosis según TTPK (objetivo terapéutico generalmente 1.5-2.5 veces el control).</>)}
        {renderDetailSection("Dilución", "Dilución estándar para infusión: 25.000 UI en 250 ml de SF 0,9% o SG 5% para obtener una concentración de 100 UI/ml.")}
        {renderDetailSection("Administración", "Bolo intravenoso seguido de infusión continua intravenosa (BIC) mediante bomba de infusión para un control preciso.")}
        {renderDetailSection("Antídoto", "Sulfato de Protamina. 1 mg de protamina neutraliza aproximadamente 100 UI de heparina.")}
        {renderDetailSection("RAM / Observaciones", "Hemorragia (principal efecto adverso), trombocitopenia inducida por heparina (TIH), osteoporosis (uso prolongado). Requiere monitoreo estricto de TTPK, plaquetas y signos de sangrado. No administrar por vía IM debido al riesgo de hematomas.")}
      </Accordion>
    </ScrollArea>
  );
};

export default HeparinaCard;
