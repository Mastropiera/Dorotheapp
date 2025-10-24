"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';

const InsulinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Hormona pancreática. Facilita la captación, utilización y almacenamiento de glucosa por las células, disminuyendo los niveles de glucosa en sangre.")}
        {renderDetailSection("Presentación", "Insulina Rápida (Cristalina): Frasco ampolla 100 UI/ml.")}
        {renderDetailSection("Indicaciones", "Hiperglicemia, cetoacidosis diabética (CAD), estado hiperosmolar hiperglicémico (EHH), hiperkalemia (junto con glucosa).")}
        {renderDetailSection("Dosis", <><strong>CAD/EHH:</strong> Bolo inicial de 0.1 UI/kg, seguido de infusión de 0.1 UI/kg/hora. Ajustar según glicemia capilar horaria.<br/><strong>Hiperkalemia:</strong> 10 UI de Insulina Rápida + 25-50g de Glucosa IV.</>)}
        {renderDetailSection("Dilución", "Dilución estándar para infusión: 100 UI de Insulina Rápida en 100 ml de Suero Fisiológico 0.9% (1 UI/ml).\nImportante: Purgar el sistema de infusión con 20-50 ml de la solución preparada antes de conectar al paciente, ya que la insulina se adhiere a las paredes del plástico.")}
        {renderDetailSection("Administración", "Infusión intravenosa continua (BIC) con bomba de infusión. También se puede administrar por vía subcutánea (SC).")}
        {renderDetailSection("Estabilidad", "La solución diluida en SF 0.9% es estable durante 24 horas a temperatura ambiente.")}
        {renderDetailSection("RAM / Observaciones", "Hipoglicemia (efecto más común y grave). Hipokalemia (la insulina promueve la entrada de potasio a las células). Reacciones locales en el sitio de inyección. Monitoreo estricto de glicemia capilar (cada 1-2 horas), electrolitos plasmáticos (especialmente potasio) y estado neurológico.")}
      </Accordion>
    </ScrollArea>
  );
};

export default InsulinaCard;
