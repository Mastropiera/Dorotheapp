
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const AmpicilinaSulbactamCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico beta-lactámico (aminopenicilina) combinado con un inhibidor de beta-lactamasas (sulbactam).")}
        {renderDetailSection("Presentación", "Frasco ampolla de 1 g de Ampicilina + 0.5 g de Sulbactam (Total 1.5 g).\nFrasco ampolla de 2 g de Ampicilina + 1 g de Sulbactam (Total 3 g).")}
        {renderDetailSection("Indicaciones", "Infecciones de piel y tejidos blandos, intraabdominales, ginecológicas y del tracto respiratorio causadas por microorganismos productores de beta-lactamasa.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 1.5 g con 3.2 ml de API (concentración 375 mg/ml). Reconstituir el vial de 3 g con 6.4 ml de API.")}
        {renderDetailSection("Dosis", "Adultos: 1.5 a 3 g cada 6 horas IV. Dosis máxima diaria: 12 g (8 g de Ampicilina y 4 g de Sulbactam).")}
        {renderDetailSection("Dilución", "Diluir la dosis reconstituida en un volumen de 50 a 100 ml de suero fisiológico 0.9%.")}
        {renderDetailSection("Administración", "Infusión intravenosa intermitente durante 15-30 minutos. También puede administrarse por vía intramuscular profunda.")}
        {renderDetailSection("Estabilidad de Solución", "La estabilidad varía según el solvente y la temperatura. En SF 0.9% a temperatura ambiente, es estable por aproximadamente 8 horas.")}
        {renderDetailSection("RAM / Observaciones", "Dolor en el sitio de inyección, flebitis. Reacciones de hipersensibilidad, diarrea (común), rash cutáneo. Al igual que con otras penicilinas, investigar antecedentes de alergias.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AmpicilinaSulbactamCard;
