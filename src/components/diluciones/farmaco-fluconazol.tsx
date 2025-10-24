
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const FluconazolCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antifúngico del grupo de los triazoles. Inhibe la síntesis de ergosterol en la membrana celular del hongo.")}
        {renderDetailSection("Presentación", "Frasco ampolla listo para usar de 200 mg / 100 ml (2 mg/ml).")}
        {renderDetailSection("Indicaciones", "Candidiasis orofaríngea, esofágica, vaginal y sistémica (candidemia). Meningitis criptocócica (tratamiento y profilaxis).")}
        {renderDetailSection("Dosis", "Varía según la indicación. Candidiasis sistémica: Dosis de carga de 800 mg, seguida de 400 mg una vez al día. Meningitis criptocócica: Carga de 400 mg, seguida de 200-400 mg diarios.")}
        {renderDetailSection("Administración", "Infusión intravenosa a una velocidad que no exceda los 200 mg/hora.")}
        {renderDetailSection("RAM / Observaciones", "Generalmente bien tolerado. Puede causar cefalea, náuseas, dolor abdominal, y elevación de las transaminasas. Es un inhibidor conocido de las enzimas CYP2C9 y CYP3A4, lo que implica numerosas interacciones farmacológicas importantes (ej. warfarina, fenitoína, algunas estatinas).")}
      </Accordion>
    </ScrollArea>
  );
};

export default FluconazolCard;
