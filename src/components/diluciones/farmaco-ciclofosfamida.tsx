
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const CiclofosfamidaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Agente alquilante, citotóxico. Se utiliza como quimioterapéutico e inmunosupresor.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 200 mg, 500 mg, 1 g o 2 g de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Tratamiento de neoplasias (linfomas, leucemias, cáncer de mama, etc.). Enfermedades autoinmunes graves (lupus, vasculitis).")}
        {renderDetailSection("Reconstitución", "Reconstituir con SF 0.9% (no con API que sea bacteriostática). Ej: 200 mg con 10 ml, 500 mg con 25 ml, 1 g con 50 ml (Concentración 20 mg/ml).")}
        {renderDetailSection("Dosis", "Muy variable según el protocolo. Puede ir desde 400-1800 mg/m² en regímenes de quimioterapia hasta 0.5-1 g/m² en enfermedades autoinmunes.")}
        {renderDetailSection("Dilución", "Diluir la dosis reconstituida en un volumen de SF 0.9% o SG 5% para alcanzar una concentración final adecuada para infusión (ej. en 250-500 ml).")}
        {renderDetailSection("Administración", "Infusión intravenosa. La duración depende de la dosis y el protocolo (ej. 30-60 minutos para dosis bajas, varias horas para dosis altas).")}
        {renderDetailSection("Estabilidad de Solución", "La solución reconstituida y diluida es estable por 24 horas a temperatura ambiente o hasta 6 días refrigerada.")}
        {renderDetailSection("RAM / Observaciones", "Mielosupresión (leucopenia, trombocitopenia), náuseas, vómitos, alopecia. Toxicidad característica: CISTITIS HEMORRÁGICA, causada por el metabolito acroleína. Es fundamental una hidratación vigorosa y el uso de MESNA como protector urotelial, especialmente con dosis altas.")}
      </Accordion>
    </ScrollArea>
  );
};

export default CiclofosfamidaCard;
