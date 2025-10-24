
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const AlbuminaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Expansor del volumen plasmático, coloide. Mantiene la presión oncótica del plasma.")}
        {renderDetailSection("Presentación", "Frasco ampolla al 20% (20 g / 100 ml). Frasco ampolla al 25% (12.5 g / 50 ml).")}
        {renderDetailSection("Indicaciones", "Hipovolemia, hipoalbuminemia severa, shock, quemaduras extensas, ascitis, síndrome nefrótico, síndrome de dificultad respiratoria del adulto.")}
        {renderDetailSection("Dosis", "Varía según la condición clínica y el peso del paciente. Dosis común para hipoalbuminemia: 1-1.5 g/kg/día. En hipovolemia, la dosis se ajusta según la respuesta hemodinámica.")}
        {renderDetailSection("Dilución", "Puede administrarse sin diluir o diluida en suero fisiológico 0.9% o suero glucosado 5%. No usar agua para inyectables para la dilución por riesgo de hemólisis.")}
        {renderDetailSection("Administración", "Infusión intravenosa. La velocidad depende de la indicación y el estado del paciente. En shock hipovolémico puede ser rápida. En pacientes normovolémicos, infundir lentamente para evitar sobrecarga de volumen (ej. 1-4 ml/min para albúmina al 20-25%).")}
        {renderDetailSection("Estabilidad de Solución", "Usar inmediatamente después de abrir el frasco. No utilizar si la solución está turbia o contiene precipitados. Desechar la porción no utilizada.")}
        {renderDetailSection("RAM / Observaciones", "Reacciones de hipersensibilidad (fiebre, escalofríos, urticaria), sobrecarga circulatoria, edema pulmonar. Monitorizar estado hemodinámico (PA, FC, PVC), estado respiratorio y diuresis. Administrar con precaución en pacientes con insuficiencia cardíaca o anemia severa.")}
      </Accordion>
    </ScrollArea>
  );
};

export default AlbuminaCard;
