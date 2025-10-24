"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const AciclovirCard: React.FC = () => {
    
  const renderDetailSection = (title: string, content?: string) => {
    if (!content) return null;
    return (
      <AccordionItem value={title}>
        <AccordionTrigger className="text-sm font-semibold">{title}</AccordionTrigger>
        <AccordionContent>
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <ScrollArea className="h-full pr-4 -mr-4">
      <Accordion type="multiple" defaultValue={['Presentaciones', 'Indicaciones', 'Dosis']} className="w-full">
        {renderDetailSection("Presentaciones", "Como sal sódica\nFA polvo liofilizado: 250 mg - 500 mg\nFA o vial de 10 ml: 250 mg\nFA o vial de 20 ml: 500 mg")}
        {renderDetailSection("Indicaciones", "Tratamiento de infecciones causadas por Herpes simplex; Herpes zoster, Varicela zoster. Tratamiento de encefalitis causada por Herpes simplex.")}
        {renderDetailSection("Contraindicaciones", "En pacientes con hipersensibilidad al fármaco.")}
        {renderDetailSection("Almacenamiento", "Temperatura Ambiente.")}
        {renderDetailSection("Reconstitución", "Según forma farmacéutica\nFA de 250mg: 10 ml de API.\nFA de 500mg: 20 ml de API.")}
        {renderDetailSection("Dosis", "Encefalitis:\n0 a 1 mes: 60 mg/kg/día; 1 mes a 12 años: 45 mg/kg/dia; 12 años en adelante: 30 mg/kg/dia; fraccionado cada 8 hrs.\nInfecciones por herpes sin meningitis: 750mg/m²/dia cada 8 horas.\nInmunosupresión: 60mg/kg/dia: 1500m².")}
        {renderDetailSection("Dilución", "7mg/ml.\nNo exceder los 10 mg/ml.")}
        {renderDetailSection("Administración", "EV directa: NO\nEV infusión intermitente: SI\nEV infusión continua: NO\nIM: NO\nOtras vías: VO, crema, solución oftálmica.")}
        {renderDetailSection("Estabilidad de Solución", "Reconstituida: 12 horas a temperatura ambiente; no refrigerar.\nDiluida: 24 horas a temperatura ambiente.\nDepende del laboratorio la estabilidad del fármaco. Verificar que fármaco contenga preservantes para guardar excedente.\nNo refrigerar")}
        {renderDetailSection("Velocidad de Administración", "EV infusión intermitente: mínimo en 1 hora.")}
        {renderDetailSection("Sueros Compatibles", "Suero fisiológico, suero glucosado 5%.")}
        {renderDetailSection("Observaciones - RAM", "Se han descrito casos de erupciones cutáneas; éstas desaparecen con la interrupción del tratamiento, náuseas, vómitos, diarrea,")}
      </Accordion>
    </ScrollArea>
  );
};

export default AciclovirCard;