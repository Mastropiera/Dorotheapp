
"use client";

import React, { useState, useEffect, useRef } from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import type { TodoItem, Priority } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ListChecks, PlusCircle, Mic, MicOff, AlertTriangle, Trash2, Clock, Flag } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useGoogleApi } from '@/contexts/google-api-context';

interface PendientesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: TodoItem[];
  onAddItem: (item: Omit<TodoItem, 'id' | 'completed'>) => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearCompleted: () => void;
}

const priorityConfig: Record<Priority, { label: string; color: string; icon: React.ReactNode }> = {
    baja: { label: 'Baja', color: 'bg-green-500', icon: <Flag className="h-3 w-3" /> },
    moderada: { label: 'Moderada', color: 'bg-yellow-500', icon: <Flag className="h-3 w-3" /> },
    urgente: { label: 'Urgente', color: 'bg-red-500', icon: <Flag className="h-3 w-3" /> },
};

export default function PendientesDialog({
  isOpen,
  onOpenChange,
  items,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onClearCompleted,
}: PendientesDialogProps) {
  const [newItemText, setNewItemText] = useState('');
  const [priority, setPriority] = useState<Priority | 'none'>('none');
  const [deadlineValue, setDeadlineValue] = useState<number | ''>('');
  const [deadlineUnit, setDeadlineUnit] = useState<'horas' | 'días' | 'semanas' | 'meses'>('días');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAuthorized: isGoogleApiAuthorized, login: loginWithGoogle } = useGoogleApi();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API no es soportada por este navegador.");
      return;
    }
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'es-ES';
    recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setNewItemText(transcript);
        setIsListening(false);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error", event.error);
        setSpeechError(`Error de reconocimiento: ${event.error}`);
        setIsListening(false);
    };
    recognition.onend = () => {
        setIsListening(false);
    };
  }, []);

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setSpeechError(null);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    onAddItem({
        text: newItemText.trim(),
        priority: priority === 'none' ? undefined : priority,
        deadline: deadlineValue ? { value: Number(deadlineValue), unit: deadlineUnit } : undefined
    });
    setNewItemText('');
    setPriority('none');
    setDeadlineValue('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle className="flex items-center text-2xl">
                    <ListChecks className="mr-2 h-6 w-6 text-primary" />
                    Pendientes
                </DialogTitle>
                <DialogDescription>
                    Añade, gestiona y completa tus tareas aquí.
                </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Input
                        placeholder="Añadir nueva tarea..."
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                        />
                        {recognitionRef.current && (
                            <Button type="button" size="icon" variant="outline" onClick={handleMicClick}>
                                {isListening ? <MicOff className="text-red-500" /> : <Mic />}
                            </Button>
                        )}
                        <Button type="button" size="icon" onClick={handleAddItem} disabled={!newItemText.trim()}>
                            <PlusCircle />
                        </Button>
                    </div>
                    {speechError && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{speechError}</p>}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Select value={priority} onValueChange={(v) => setPriority(v as Priority | 'none')}>
                            <SelectTrigger><SelectValue placeholder="Prioridad" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Sin Prioridad</SelectItem>
                                <SelectItem value="baja">Baja</SelectItem>
                                <SelectItem value="moderada">Moderada</SelectItem>
                                <SelectItem value="urgente">Urgente</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex gap-1 w-full">
                            <Input type="number" placeholder="Plazo" value={deadlineValue} onChange={e => setDeadlineValue(e.target.value === '' ? '' : parseInt(e.target.value, 10))} className="w-1/2" min="1" />
                            <Select value={deadlineUnit} onValueChange={(v) => setDeadlineUnit(v as any)}>
                                <SelectTrigger className="w-1/2"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="horas">Horas</SelectItem>
                                    <SelectItem value="días">Días</SelectItem>
                                    <SelectItem value="semanas">Semanas</SelectItem>
                                    <SelectItem value="meses">Meses</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <Separator className="my-4"/>

                <ScrollArea className="h-64 pr-3 -mr-3">
                {items.length > 0 ? (
                    <div className="space-y-2">
                    {items.map(item => (
                        <div key={item.id} className="flex items-center gap-2 p-2 rounded-md bg-background/50 hover:bg-background">
                        <Checkbox id={`task-${item.id}`} checked={item.completed} onCheckedChange={() => onToggleItem(item.id)} />
                        <label htmlFor={`task-${item.id}`} className={cn("flex-grow text-sm", item.completed && "line-through text-muted-foreground")}>
                            {item.text}
                            <div className="flex items-center gap-2 mt-1">
                                {item.priority && (
                                <Badge variant="secondary" className={cn("text-xs py-0.5 px-1.5 h-auto", priorityConfig[item.priority].color)}>
                                        {priorityConfig[item.priority].icon}
                                        {priorityConfig[item.priority].label}
                                </Badge>
                                )}
                                {item.deadline && (
                                    <Badge variant="outline" className="text-xs py-0.5 px-1.5 h-auto font-normal">
                                    <Clock className="h-3 w-3 mr-1"/> {item.deadline.value} {item.deadline.unit}
                                    </Badge>
                                )}
                            </div>
                        </label>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDeleteItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        </div>
                    ))}
                    </div>
                ) : <p className="text-center text-sm text-muted-foreground pt-4">¡No hay pendientes!</p>}
                </ScrollArea>
            </div>
            <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-y-4">
                 <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
                    {items.some(item => item.completed) && (
                        <Button variant="outline" size="sm" onClick={onClearCompleted}>Limpiar Completadas</Button>
                    )}
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
                </div>
                 {user?.providerData.some(p => p.providerId === 'google.com') && !isGoogleApiAuthorized && (
                    <div className="flex flex-col items-end gap-1">
                        <Button onClick={loginWithGoogle} variant="outline" size="sm">Conectar con Google Calendar & Tasks</Button>
                        <p className="text-xs text-muted-foreground">(Verificación en proceso)</p>
                    </div>
                )}
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
