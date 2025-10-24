
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const CefoperazonaSulbactamCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Combinación de una cefalosporina de tercera generación (Cefoperazona) y un inhibidor de beta-lactamasas (Sulbactam). Amplio espectro contra grampositivos, gramnegativos y anaerobios.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 1g de Cefoperazona + 1g de Sulbactam (Total 2g).")}
        {renderDetailSection("Indicaciones", "Infecciones del tracto respiratorio, peritonitis, infecciones del tracto biliar, septicemia, meningitis, infecciones de piel y tejidos blandos.")}
        {renderDetailSection("Reconstitución", "Reconstituir con 6.7 ml de solvente compatible para obtener una solución final de 10 ml.")}
        {renderDetailSection("Dosis", "Adultos: 2 a 4 g (en relación 1:1) cada 12 horas. Dosis máxima: 8 g/día de Cefoperazona.")}
        {renderDetailSection("Dilución", "Diluir la dosis reconstituida en un volumen de 50-100 ml de SF 0.9% o SG 5%.")}
        {renderDetailSection("Administración", "Infusión intravenosa intermitente durante 15 a 60 minutos.")}
        {renderDetailSection("Estabilidad de Solución", "Estable 24 horas a temperatura ambiente una vez reconstituido y diluido.")}
        {renderDetailSection("RAM / Observaciones", "Diarrea es común. Reacciones de hipersensibilidad. Puede causar deficiencia de vitamina K y un efecto similar al disulfiram con el alcohol (efecto antabus). Monitorizar tiempo de protrombina en pacientes de riesgo.")}
      </Accordion>
    </ScrollArea>
  );
};

export default CefoperazonaSulbactamCard;
