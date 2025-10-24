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

interface BackgroundSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentBackgroundUrl?: string | null;
  onSetBackgroundUrl?: (url: string | null) => void;
}

const BACKGROUND_OPTIONS = [
  { name: "Robots", url: "/backgrounds/fondo1.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo1_thumb.webp", hint: "Robots" },
  { name: "Gatitos", url: "/backgrounds/fondo2.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo2_thumb.webp", hint: "Gatitos" },
  { name: "Enfermería", url: "/backgrounds/fondo3.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo3_thumb.webp", hint: "Enfermería" },
  { name: "Capibaras", url: "/backgrounds/fondo4.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo4_thumb.webp", hint: "Capibaras" },
  { name: "Daleks", url: "/backgrounds/fondo5.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo5_thumb.webp", hint: "Daleks" },
  { name: "Tardis", url: "/backgrounds/fondo6.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo6_thumb.webp", hint: "Tardis" },
  { name: "Star", url: "/backgrounds/fondo7.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo7_thumb.webp", hint: "Star" },
  { name: "Harry", url: "/backgrounds/fondo8.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo8_thumb.webp", hint: "Harry" },
  { name: "Halloween", url: "/backgrounds/fondo9.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo9_thumb.webp", hint: "Halloween" },
  { name: "Hobbits", url: "/backgrounds/fondo10.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo10_thumb.webp", hint: "Hobbits" },
  { name: "LOTR", url: "/backgrounds/fondo11.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo11_thumb.webp", hint: "LOTR" },
  { name: "Gatitos2", url: "/backgrounds/fondo12.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo12_thumb.webp", hint: "Gatitos2" },
  { name: "Gatitos3", url: "/backgrounds/fondo13.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo13_thumb.webp", hint: "Gatitos3" },
  { name: "Ardillas", url: "/backgrounds/fondo14.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo14_thumb.webp", hint: "Ardillas" },
  { name: "Cielo", url: "/backgrounds/fondo15.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo15_thumb.webp", hint: "Cielo" },
  { name: "Ghibli1", url: "/backgrounds/fondo16.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo16_thumb.webp", hint: "Ghibli1" },
  { name: "Flores", url: "/backgrounds/fondo17.webp", thumbnailUrl: "/backgrounds/thumbnails/fondo17_thumb.webp", hint: "Flores" },
  { name: "Chihiro", url: "/backgrounds/chihiro.webp", thumbnailUrl: "/backgrounds/thumbnails/chihiro_thumb.webp", hint: "Chihiro" },
  { name: "Chihiro2", url: "/backgrounds/chihiro2.webp", thumbnailUrl: "/backgrounds/thumbnails/chihiro2_thumb.webp", hint: "Chihiro" },
  { name: "Ghibli2", url: "/backgrounds/ghibli2.webp", thumbnailUrl: "/backgrounds/thumbnails/ghibli2_thumb.webp", hint: "Ghibli" },
  { name: "Ghibli3", url: "/backgrounds/ghibli3.webp", thumbnailUrl: "/backgrounds/thumbnails/ghibli3_thumb.webp", hint: "Ghibli" },
  { name: "Totoro", url: "/backgrounds/totoro.webp", thumbnailUrl: "/backgrounds/thumbnails/totoro_thumb.webp", hint: "Totoro" },
  { name: "Totoro2", url: "/backgrounds/totoro2.webp", thumbnailUrl: "/backgrounds/thumbnails/totoro2_thumb.webp", hint: "Totoro" },
  { name: "Totoro3", url: "/backgrounds/totoro3.webp", thumbnailUrl: "/backgrounds/thumbnails/totoro3_thumb.webp", hint: "Totoro" },
];

export default function BackgroundSettingsDialog({
  isOpen,
  onOpenChange,
  currentBackgroundUrl,
  onSetBackgroundUrl,
}: BackgroundSettingsDialogProps) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(currentBackgroundUrl ?? null);

  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentBackgroundUrl ?? null);
    }
  }, [isOpen, currentBackgroundUrl]);

  const handleSelect = (url: string | null) => {
    setSelectedUrl(url);
    onSetBackgroundUrl?.(url);
  };

  const handleRemoveBackground = () => {
    setSelectedUrl(null);
    onSetBackgroundUrl?.(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Seleccionar Imagen de Fondo</DialogTitle>
          <DialogDescription>
            Elige una imagen para personalizar el fondo de la aplicación.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] my-4 pr-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {BACKGROUND_OPTIONS.map((option) => (
              <div
                key={option.url}
                className={cn(
                  "relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                  selectedUrl === option.url ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent hover:border-muted-foreground/50"
                )}
                onClick={() => handleSelect(option.url)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSelect(option.url)}
              >
                <Image
                  src={option.thumbnailUrl}
                  alt={option.name}
                  width={200}
                  height={100}
                  className="w-full h-auto aspect-[2/1] object-cover"
                  data-ai-hint={option.hint}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs text-center p-1">{option.name}</p>
                </div>
                {selectedUrl === option.url && (
                  <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between items-center">
          <Button
            variant="outline"
            onClick={handleRemoveBackground}
            disabled={selectedUrl === null}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Quitar Fondo
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
