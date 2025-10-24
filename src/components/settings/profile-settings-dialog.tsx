
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Save } from "lucide-react";

interface ProfileSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserName: string;
  onSaveUserName: (name: string) => void;
}

export default function ProfileSettingsDialog({
  isOpen,
  onOpenChange,
  currentUserName,
  onSaveUserName,
}: ProfileSettingsDialogProps) {
  const [name, setName] = useState(currentUserName);

  useEffect(() => {
    if (isOpen) {
      setName(currentUserName);
    }
  }, [isOpen, currentUserName]);

  const handleSave = () => {
    if (name.trim()) {
      onSaveUserName(name.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <UserCircle className="mr-2 h-5 w-5 text-primary" />
            Establecer Nombre de Usuario
          </DialogTitle>
          <DialogDescription>
            Este nombre se usará para personalizar los saludos en la aplicación.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Label htmlFor="userName">Tu Nombre</Label>
          <Input
            id="userName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Escribe tu nombre"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!name.trim()} className="bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" /> Guardar Nombre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    