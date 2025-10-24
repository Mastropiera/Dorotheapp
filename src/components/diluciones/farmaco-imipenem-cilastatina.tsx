
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const ImipenemCilastatinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico carbapenémico de amplio espectro. Imipenem es el agente bactericida, y Cilastatina previene la degradación renal de Imipenem.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 500 mg de Imipenem + 500 mg de Cilastatina en polvo.")}
        {renderDetailSection("Indicaciones", "Tratamiento de infecciones graves causadas por bacterias multirresistentes, incluyendo infecciones intraabdominales, del tracto respiratorio inferior, ginecológicas, y septicemia.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial con 10 ml de un solvente compatible (ej. SF 0.9%). Agitar bien hasta obtener una suspensión.")}
        {renderDetailSection("Dosis", "Adultos: 250 mg a 1 g cada 6-8 horas, dependiendo de la severidad de la infección. Dosis máxima: 4 g/día.")}
        {renderDetailSection("Dilución", "Transferir la suspensión reconstituida a 100 ml de Suero Fisiológico 0.9% o Suero Glucosado 5%.")}
        {renderDetailSection("Administración", "Infusión intravenosa. Dosis ≤ 500 mg administrar en 20-30 minutos. Dosis > 500 mg administrar en 40-60 minutos. NO administrar en bolo directo.")}
        {renderDetailSection("Estabilidad de Solución", "La estabilidad de la solución diluida es limitada, generalmente 4 horas a temperatura ambiente o 24 horas refrigerada. Consultar las especificaciones del fabricante.")}
        {renderDetailSection("RAM / Observaciones", "Náuseas, vómitos, diarrea. Reacciones de hipersensibilidad (puede haber reacción cruzada con penicilinas). Convulsiones (el riesgo aumenta con dosis altas, insuficiencia renal o lesiones preexistentes del SNC).")}
      </Accordion>
    </ScrollArea>
  );
};

export default ImipenemCilastatinaCard;
