
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
import { MessageCircle, Send } from "lucide-react";

interface ContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactDialog({ isOpen, onOpenChange }: ContactDialogProps) {
  const whatsappLink = "https://wa.me/56992949092";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <MessageCircle className="mr-2 h-5 w-5 text-primary" />
            Contacto
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <p className="text-sm text-foreground">
            Muchas gracias por probar mi aplicación. Para consultas, sugerencias, reclamos, felicitaciones, insultos, aportes, etc,{" "}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80 font-medium flex items-center"
            >
              escríbeme por aquí <Send className="ml-1 h-3 w-3" />
            </a>
            .
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
