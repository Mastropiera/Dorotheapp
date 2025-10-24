"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';

const NitroglicerinaCard: React.FC = () => {
    
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
        {renderDetailSection("Acción Terapéutica", "Vasodilatador, principalmente venoso. Disminuye la precarga y en menor medida la poscarga, reduciendo el consumo de oxígeno del miocardio.")}
        {renderDetailSection("Presentación", "Ampolla 50mg/10ml - Matraz 50mg/250ml SG 5%.")}
        {renderDetailSection("Indicaciones", "Angina de pecho inestable, infarto agudo de miocardio, edema agudo de pulmón cardiogénico, crisis hipertensiva.")}
        {renderDetailSection("Dosis", "Iniciar con 5-10 mcg/min en infusión continua, titulando cada 3-5 minutos según respuesta (PA, dolor torácico) hasta 200 mcg/min o más.")}
        {renderDetailSection("Dilución", "Dilución estándar: 50 mg en 250 ml de SG 5% (200 mcg/ml). Utilizar exclusivamente SG 5% o SF 0.9% en envases de vidrio o polipropileno, ya que la NTG se adhiere al PVC.")}
        {renderDetailSection("Administración", "Infusión intravenosa continua (BIC) con bomba de infusión. Utilizar equipos de infusión de baja absorción (no PVC).")}
        {renderDetailSection("Estabilidad", "Estable 24 horas a temperatura ambiente en SG 5% o SF 0,9%. Proteger de la luz.")}
        {renderDetailSection("RAM / Observaciones", "Cefalea (muy común), hipotensión, taquicardia refleja, mareos. Puede desarrollarse tolerancia rápidamente (típicamente después de 24-48h). Contraindicado con el uso de inhibidores de la fosfodiesterasa-5 (sildenafilo, etc.) por riesgo de hipotensión severa.")}
      </Accordion>
    </ScrollArea>
  );
};

export default NitroglicerinaCard;
