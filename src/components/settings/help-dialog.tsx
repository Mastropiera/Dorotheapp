
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, CalendarDays, ListChecks, BookOpenText, Calculator, ClipboardList, Users2, NotebookText, ShoppingCart, PiggyBank, Pill, HeartPulse, Settings, Baby } from "lucide-react";

interface HelpDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const helpTopics = [
  {
    icon: <CalendarDays className="h-5 w-5 text-primary" />,
    title: "Calendario y Plan del Día",
    content: "El calendario es tu vista principal. Haz clic en cualquier día para abrir el 'Plan del Día'. Aquí puedes asignar un turno de trabajo (Largo, Noche, 24h, Extra), añadir celebraciones como cumpleaños, y marcar el inicio y fin de tu ciclo menstrual. Si conectas tu cuenta de Google, tus eventos de Google Calendar para ese día aparecerán automáticamente."
  },
  {
    icon: <ListChecks className="h-5 w-5 text-primary" />,
    title: "Pendientes (Google Tasks)",
    content: "Esta sección se sincroniza directamente con tu lista de tareas principal de Google Tasks. Para usarla, debes conectar tu cuenta de Google. Puedes añadir, completar y eliminar tareas, y los cambios se reflejarán en tu cuenta de Google y viceversa."
  },
  {
    icon: <Users2 className="h-5 w-5 text-primary" />,
    title: "Mis Pacientes",
    content: "Una sección dedicada para gestionar información de tus pacientes. Puedes añadir pacientes, registrar notas de evolución con signos vitales, y exportar o compartir cada nota de forma individual. Toda la información se guarda de forma segura en la nube asociada a tu cuenta."
  },
  {
    icon: <NotebookText className="h-5 w-5 text-primary" />,
    title: "Mis Notas / Ayudamemorias",
    content: "Un bloc de notas simple para apuntes rápidos que necesites tener a mano. Puedes asignarles diferentes colores para organizarlas visualmente, como si fueran post-its. Ideal para datos de referencia, recordatorios no urgentes o cualquier información de uso frecuente."
  },
  {
    icon: <BookOpenText className="h-5 w-5 text-primary" />,
    title: "Vademécum y Compatibilidad LM",
    content: "Dos herramientas de consulta rápida. El Vademécum ofrece información de ejemplo sobre medicamentos. 'Compatibilidad LM' proporciona una guía sobre la seguridad de los medicamentos durante la lactancia materna. Ambas secciones son de carácter referencial y no reemplazan el juicio clínico."
  },
  {
    icon: <Calculator className="h-5 w-5 text-primary" />,
    title: "Calculadoras",
    content: "Accede a una variedad de calculadoras clínicas útiles para el día a día, como PaFi, IMC, Edad Corregida, Balance Hídrico, y más. Puedes marcar tus calculadoras más usadas como favoritas para un acceso más rápido."
  },
  {
    icon: <ClipboardList className="h-5 w-5 text-primary" />,
    title: "Escalas",
    content: "Encuentra diversas escalas de valoración clínica como Downton (riesgo de caídas), Braden (riesgo de LPP), Barthel (ABVD), Yesavage (depresión geriátrica), entre otras. Los resultados pueden ser exportados para tus registros."
  },
  {
    icon: <ShoppingCart className="h-5 w-5 text-primary" />,
    title: "Lista de Compras",
    content: "Crea listas de compras, añade ítems, y marca los que ya tienes. Puedes ingresar el precio de cada artículo para ver un total estimado. Al finalizar, puedes guardar la compra en tus registros financieros."
  },
  {
    icon: <PiggyBank className="h-5 w-5 text-primary" />,
    title: "Mis Finanzas",
    content: "Lleva un registro de tus ingresos y gastos. Las compras guardadas desde la 'Lista de Compras' aparecerán automáticamente como gastos. También puedes añadir ingresos y otros gastos manualmente para tener un balance general."
  },
  {
    icon: <Pill className="h-5 w-5 text-primary" />,
    title: "Pastillero",
    content: "Configura recordatorios para tus medicamentos. Define el nombre, dosis, los días de la semana y las horas de las tomas. Si habilitas las notificaciones, recibirás alertas en tu dispositivo. También puedes marcar las dosis que ya has tomado."
  },
  {
    icon: <HeartPulse className="h-5 w-5 text-primary" />,
    title: "Mi Ciclo Menstrual",
    content: "Define la duración promedio de tu ciclo en la configuración. Luego, en el calendario, puedes marcar los días de inicio y fin de tu periodo. La aplicación usará estos datos para predecir tus futuros ciclos y días de ovulación, mostrándolos con iconos en el calendario."
  },
  {
    icon: <Settings className="h-5 w-5 text-primary" />,
    title: "Configuración",
    content: "Desde el menú de 'Configuración' en la parte inferior de la pantalla, puedes personalizar tu experiencia. Cambia tu nombre de usuario, el avatar, el fondo de la aplicación, la voz de bienvenida, y decide qué secciones ('post-its') quieres ver en la pantalla principal."
  }
];

export default function HelpDialog({ isOpen, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center text-2xl">
            <HelpCircle className="mr-2 h-6 w-6 text-primary" />
            Ayuda y Guía de Uso
          </DialogTitle>
          <DialogDescription>
            Encuentra aquí una descripción de las principales funciones de la aplicación.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow px-6">
          <Accordion type="single" collapsible className="w-full">
            {helpTopics.map((topic, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    {topic.icon}
                    <span className="font-semibold">{topic.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm pl-4 border-l-2 border-primary/20 ml-4">
                  {topic.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
