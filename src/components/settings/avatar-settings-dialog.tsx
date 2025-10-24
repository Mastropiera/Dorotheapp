"use client";

import { useState, useEffect } from 'react';
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
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatarUrl?: string | null;
  onSetAvatarUrl: (url: string) => void;
}

const AVATAR_OPTIONS = [
  { name: "Gatita Enfermera", url: "/avatars/gatita.webp", hint: "gatita enfermera" },
  { name: "Dogtor", url: "/avatars/dogtor.webp", hint: "perro doctor" },
  { name: "Enfermero Serio", url: "/avatars/enfermeroserio.webp", hint: "enfermero serio" },
  { name: "Gatito Joven", url: "/avatars/gatitojoven.webp", hint: "gatito joven" },
  { name: "Kinesiólogo", url: "/avatars/kine.webp", hint: "kinesiólogo" },
  { name: "Kinesióloga", url: "/avatars/kineA.webp", hint: "kinesióloga" },
  { name: "Matrona", url: "/avatars/matrona.webp", hint: "matrona" },
  { name: "Nutria Nutricionista", url: "/avatars/nutria.webp", hint: "nutria nutricionista" },
  { name: "Traumatólogo", url: "/avatars/trauma.webp", hint: "traumatólogo" },
];

export default function AvatarSettingsDialog({
  isOpen,
  onOpenChange,
  currentAvatarUrl,
  onSetAvatarUrl,
}: AvatarSettingsDialogProps) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(currentAvatarUrl ?? null);

  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentAvatarUrl ?? null);
    }
  }, [isOpen, currentAvatarUrl]);

  const handleSelect = (url: string) => {
    setSelectedUrl(url);
    onSetAvatarUrl(url);
  };

  const handleRestoreDefault = () => {
    const defaultUrl = "/avatars/gatita.webp";
    setSelectedUrl(defaultUrl);
    onSetAvatarUrl(defaultUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Seleccionar Avatar</DialogTitle>
          <DialogDescription>
            Elige un avatar para el encabezado de la aplicación.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] my-4 pr-3">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {AVATAR_OPTIONS.map((option) => (
              <div
                key={option.url}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={cn(
                    "relative rounded-full overflow-hidden cursor-pointer border-2 transition-all w-24 h-24",
                    selectedUrl === option.url
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-transparent hover:border-muted-foreground/50"
                  )}
                  onClick={() => handleSelect(option.url)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSelect(option.url)}
                >
                  <Image
                    src={option.url}
                    alt={option.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    data-ai-hint={option.hint}
                  />
                  {selectedUrl === option.url && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground rounded-full p-0.5">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-center">{option.name}</p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between items-center">
          <Button variant="outline" onClick={handleRestoreDefault}>
            <XCircle className="mr-2 h-4 w-4" />
            Restaurar por Defecto
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}