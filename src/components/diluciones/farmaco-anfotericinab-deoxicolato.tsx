
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const AnfotericinaBDeoxicolatoCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antifúngico poliéno de amplio espectro. Actúa uniéndose al ergosterol de la membrana celular fúngica, alterando su permeabilidad.")}
        {renderDetailSection("Presentación", "Frasco ampolla con 50 mg de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Tratamiento de infecciones fúngicas sistémicas graves y potencialmente mortales.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 50 mg con 10 ml de Agua para Inyectables (API) SIN preservantes. Agitar hasta que la solución esté clara. Concentración resultante: 5 mg/ml.")}
        {renderDetailSection("Dosis", "Dosis de prueba: 1 mg en 20-30 min. Dosis habitual: 0.25 a 1.5 mg/kg/día. La dosis se incrementa gradualmente según tolerancia.")}
        {renderDetailSection("Dilución", "Diluir la dosis requerida en Suero Glucosado al 5% con un pH > 4.2. La concentración final no debe exceder 0.1 mg/ml (1 mg por cada 10 ml de suero). NO USAR SUERO FISIOLÓGICO NI SOLUCIONES CON ELECTROLITOS, ya que causa precipitación.")}
        {renderDetailSection("Administración", "Infusión intravenosa LENTA, durante un período de 2 a 6 horas. Usar un filtro en línea si es posible (poro > 1 micra).")}
        {renderDetailSection("Estabilidad de Solución", "Reconstituida: estable 24h refrigerada o 24h a T° ambiente protegida de la luz. Diluida: debe administrarse inmediatamente.")}
        {renderDetailSection("RAM / Observaciones", "Alta toxicidad. Reacciones infusionales agudas (fiebre, escalofríos, hipotensión, náuseas) son muy comunes. Nefrotoxicidad es el principal efecto adverso limitante de dosis. También causa hipokalemia, hipomagnesemia y anemia. Se requiere pre-medicación (paracetamol, antihistamínicos, corticoides) y monitorización estricta de la función renal y electrolitos.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AnfotericinaBDeoxicolatoCard;
