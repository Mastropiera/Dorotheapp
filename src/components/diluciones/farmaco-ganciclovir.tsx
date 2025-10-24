
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const GanciclovirCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antiviral, análogo de la guanosina. Activo contra citomegalovirus (CMV).")}
        {renderDetailSection("Presentación", "Frasco ampolla con 500 mg de polvo liofilizado.")}
        {renderDetailSection("Indicaciones", "Tratamiento de retinitis por CMV en pacientes inmunocomprometidos. Profilaxis de enfermedad por CMV en receptores de trasplante.")}
        {renderDetailSection("Reconstitución", "Reconstituir el vial de 500 mg con 10 ml de Agua para Inyectables (API) para obtener una concentración de 50 mg/ml. NO usar agua bacteriostática.")}
        {renderDetailSection("Dosis", "Inducción: 5 mg/kg IV cada 12 horas por 14-21 días. Mantenimiento: 5 mg/kg IV una vez al día. Ajustar dosis según función renal.")}
        {renderDetailSection("Dilución", "Diluir la dosis requerida en un volumen de 50-250 ml (usualmente 100 ml) de SF 0.9% o SG 5% a una concentración final que no exceda los 10 mg/ml.")}
        {renderDetailSection("Administración", "Infusión intravenosa durante 1 hora. NO administrar en bolo IV rápido ni por vía IM o SC.")}
        {renderDetailSection("Estabilidad de Solución", "La solución reconstituida es estable por 12 horas a temperatura ambiente. La solución diluida debe usarse dentro de 24 horas si se refrigera.")}
        {renderDetailSection("RAM / Observaciones", "Mielosupresión (neutropenia, trombocitopenia, anemia) es el efecto adverso más común y limitante de dosis. Fiebre, rash, función hepática alterada. Requiere monitorización estricta del hemograma.")}
      </Accordion>
    </ScrollArea>
  );
};

export default GanciclovirCard;
