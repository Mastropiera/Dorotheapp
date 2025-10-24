
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const AmpicilinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico beta-lactámico del grupo de las aminopenicilinas.")}
        {renderDetailSection("Presentación", "Frasco ampolla de 500 mg y 1 g de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Tratamiento de infecciones del tracto respiratorio, urinario, gastrointestinal, meningitis y endocarditis causadas por microorganismos sensibles.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 500 mg con 2 ml de API. Reconstituir el vial de 1 g con 5 ml de API.")}
        {renderDetailSection("Dosis", "Adultos: 500 mg a 2 g cada 4-6 horas, dependiendo de la severidad de la infección. Meningitis: dosis altas, 2 g cada 4 horas.")}
        {renderDetailSection("Dilución", "Para infusión IV, diluir la dosis reconstituida en 50-100 ml de suero fisiológico 0.9%.")}
        {renderDetailSection("Administración", "Bolo intravenoso lento (10-15 minutos) o infusión intermitente (15-30 minutos). También por vía intramuscular.")}
        {renderDetailSection("Estabilidad de Solución", "La ampicilina es poco estable en solución. Se recomienda usarla inmediatamente después de la reconstitución. En SF 0.9% es estable por aproximadamente 1 hora a temperatura ambiente.")}
        {renderDetailSection("RAM / Observaciones", "Reacciones de hipersensibilidad son las más comunes y pueden ser graves. Rash cutáneo es frecuente y no siempre alérgico (especialmente con mononucleosis). Diarrea. Investigar siempre antecedentes de alergia a penicilinas.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AmpicilinaCard;
