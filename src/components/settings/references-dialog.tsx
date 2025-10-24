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
import { BookCopy } from "lucide-react";

interface ReferencesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Formato Vancouver
const references = [
  {
    key: "minsal-norma-2021",
    text: "Ministerio de Salud de Chile. Norma Técnica para la Supervisión de Salud Integral de Niños y Niñas de 0 a 9 años en la Atención Primaria de Salud. Santiago: MINSAL; 2021.",
    url: "https://www.minsal.cl/portal/url/item/c495349513054f05e040010164010db7.pdf"
  },
  {
    key: "minsal-cap4-2021",
    text: "Ministerio de Salud de Chile. Capítulo 4: Instrumentos de evaluación y vigilancia. En: Norma Técnica para la Supervisión de Salud Integral de Niños y Niñas de 0 a 9 años en la Atención Primaria de Salud. Santiago: MINSAL; 2021.",
    url: "https://www.minsal.cl/wp-content/uploads/2021/12/Capi%CC%81tulo-4-Web.pdf"
  },
   {
    key: "e-lactancia",
    text: "e-lactancia.org. APILAM, Asociación para la Promoción e Investigación científica y cultural de la Lactancia Materna. [Consultado el 29 de Julio de 2024].",
    url: "https://e-lactancia.org"
  },
  {
    key: "manual-medicamentos-endovenosos",
    text: "Lizana C, González C, Villena R. Manual de Medicamentos Endovenosos: Unidad de Paciente Crítico del Hospital de Niños Dr. Exequiel González Cortés. [Internet].",
    url: "https://www.laboratoriochile.cl/ebook/files/mme.pdf"
  },
  {
    key: "guia-medicamentos-embarazo",
    text: "Rivera González L. Guía Clínica de Medicamentos en el Embarazo. Servicio de Salud Araucanía Sur, Gobierno de Chile.",
    url: "https://www.araucaniasur.cl/wp-content/uploads/2023/01/GUIA-8-MEDICAMENTOS-EN-EMBARAZO-OK.pdf"
  }
];

export default function ReferencesDialog({ isOpen, onOpenChange }: ReferencesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <BookCopy className="mr-2 h-5 w-5 text-primary" />
            Referencias Bibliográficas
          </DialogTitle>
          <DialogDescription>
            Fuentes de información utilizadas en la aplicación, en formato Vancouver.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] my-4 pr-4">
          <ul className="space-y-4">
            {references.map((ref) => (
              <li key={ref.key} className="text-sm">
                <p>{ref.text}</p>
                {ref.url && (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80 text-xs break-all"
                  >
                    Ver fuente
                  </a>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
