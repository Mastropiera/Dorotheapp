"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const DexametasonaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Corticosteroide sintético de larga duración con potente acción antiinflamatoria e inmunosupresora.")}
        {renderDetailSection("Presentación", "Ampolla de 4 mg / 1 ml (como fosfato sódico).")}
        {renderDetailSection("Indicaciones", "Tratamiento de shock anafiláctico, edema cerebral, crisis asmática severa, reacciones alérgicas graves y como parte de regímenes de quimioterapia (efecto antiemético).")}
        {renderDetailSection("Dosis", "Varía ampliamente según la indicación. Dosis comunes: 4-20 mg IV o IM. En edema cerebral, se pueden usar dosis iniciales de 10 mg IV, seguidas de 4 mg cada 6 horas.")}
        {renderDetailSection("Administración", "Puede administrarse por vía IV lenta (durante varios minutos) o IM profunda. La administración rápida en bolo IV puede causar ardor o prurito perineal transitorio.")}
        {renderDetailSection("Dilución", "Puede administrarse sin diluir para dosis de bolo. Para infusión, es compatible con SF 0.9% y SG 5%.")}
        {renderDetailSection("RAM / Observaciones", "Uso agudo: hiperglicemia, hipertensión, insomnio, cambios de humor. Uso crónico: supresión adrenal, osteoporosis, síndrome de Cushing, cataratas, aumento del riesgo de infecciones. La suspensión del tratamiento prolongado debe ser gradual.")}
      </Accordion>
    </ScrollArea>
  );
};

export default DexametasonaCard;
