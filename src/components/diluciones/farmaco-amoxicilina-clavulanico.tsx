
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const AmoxicilinaClavulanicoCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico beta-lactámico (penicilina de amplio espectro) combinado con un inhibidor de beta-lactamasas (ácido clavulánico).")}
        {renderDetailSection("Presentación", "Frasco ampolla de 500 mg de Amoxicilina + 100 mg de Ác. Clavulánico.\nFrasco ampolla de 1000 mg de Amoxicilina + 200 mg de Ác. Clavulánico.")}
        {renderDetailSection("Indicaciones", "Infecciones del tracto respiratorio, urinario, piel y tejidos blandos, intraabdominales causadas por gérmenes productores de beta-lactamasas.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 500/100 mg con 10 ml de API. Reconstituir el vial de 1000/200 mg con 20 ml de API.")}
        {renderDetailSection("Dosis", "Adultos: 1 g / 200 mg cada 8 horas. En infecciones graves, cada 6 horas. Dosis pediátrica se calcula según peso.")}
        {renderDetailSection("Dilución", "Diluir la solución reconstituida en 50-100 ml de suero fisiológico 0.9%.")}
        {renderDetailSection("Administración", "Infusión intravenosa intermitente durante 30-40 minutos. También puede administrarse en bolo IV lento durante 3-4 minutos.")}
        {renderDetailSection("Estabilidad de Solución", "Usar inmediatamente después de reconstituir. La solución diluida en SF 0.9% es estable por un tiempo limitado (consultar especificaciones del fabricante, generalmente 1-4 horas).")}
        {renderDetailSection("RAM / Observaciones", "Reacciones de hipersensibilidad (desde rash hasta anafilaxia), diarrea, náuseas, vómitos, flebitis en el sitio de inyección. Aumento de transaminasas. Investigar antecedentes de alergia a penicilinas y cefalosporinas.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AmoxicilinaClavulanicoCard;
