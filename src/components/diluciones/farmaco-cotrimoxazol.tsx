
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

const CotrimoxazolCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Antibiótico bactericida. Combinación de Sulfametoxazol y Trimetoprim, que bloquean secuencialmente la síntesis de ácido fólico en las bacterias.")}
        {renderDetailSection("Presentación", "Frasco ampolla de 400 mg de Sulfametoxazol + 80 mg de Trimetoprim en 5 ml.")}
        {renderDetailSection("Indicaciones", "Tratamiento de infecciones del tracto urinario, exacerbaciones de bronquitis crónica, otitis media aguda, y tratamiento y profilaxis de neumonía por Pneumocystis jirovecii (PCP).")}
        {renderDetailSection("Dosis", "La dosificación se basa en el componente Trimetoprim. Dosis estándar: 8-10 mg/kg/día de Trimetoprim, dividido cada 6, 8 o 12 horas. Neumonía por PCP: 15-20 mg/kg/día de Trimetoprim, dividido cada 6-8 horas.")}
        {renderDetailSection("Dilución", "Diluir cada 5 ml de la ampolla en 125 ml de SG 5%. No usar concentraciones menores a 1:25 (1 ml de fármaco en 25 ml de suero).")}
        {renderDetailSection("Administración", "Infusión intravenosa intermitente durante 60 a 90 minutos. NO administrar por vía IM o en bolo IV rápido.")}
        {renderDetailSection("Estabilidad de Solución", "La solución diluida debe usarse dentro de un período corto (consultar especificaciones del fabricante, generalmente unas pocas horas), ya que puede precipitar.")}
        {renderDetailSection("RAM / Observaciones", "Reacciones de hipersensibilidad (rash, fiebre, síndrome de Stevens-Johnson) son comunes. Cristaluria (mantener buena hidratación), hiperkalemia, mielosupresión. Contraindicado en alergia a sulfas, embarazo a término y lactantes menores de 2 meses.")}
      </Accordion>
    </ScrollArea>
  );
};

export default CotrimoxazolCard;

