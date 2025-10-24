
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { MemoEntry } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { NotebookText, PlusCircle, Edit, Trash2, Save, Palette, CheckCircle, Mic, MicOff, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MisNotasDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  memos: MemoEntry[];
  onAddMemo: (memo: Omit<MemoEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateMemo: (memo: MemoEntry) => void;
  onDeleteMemo: (id: string) => void;
}

const POST_IT_COLORS = [
  { name: 'yellow', bg: 'bg-yellow-100 dark:bg-yellow-900/40', border: 'border-yellow-300 dark:border-yellow-700/60' },
  { name: 'pink', bg: 'bg-pink-100 dark:bg-pink-900/40', border: 'border-pink-300 dark:border-pink-700/60' },
  { name: 'blue', bg: 'bg-blue-100 dark:bg-blue-900/40', border: 'border-blue-300 dark:border-blue-700/60' },
  { name: 'green', bg: 'bg-green-100 dark:bg-green-900/40', border: 'border-green-300 dark:border-green-700/60' },
  { name: 'purple', bg: 'bg-purple-100 dark:bg-purple-900/40', border: 'border-purple-300 dark:border-purple-700/60' },
];

const memoFormSchema = z.object({
  title: z.string().min(1, "El título no puede estar vacío.").max(100, "El título es demasiado largo."),
  content: z.string().min(1, "El contenido no puede estar vacío."),
  color: z.string().optional(),
});

type MemoFormValues = z.infer<typeof memoFormSchema>;

export default function MisNotasDialog({
  isOpen,
  onOpenChange,
  memos,
  onAddMemo,
  onUpdateMemo,
  onDeleteMemo,
}: MisNotasDialogProps) {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingMemo, setEditingMemo] = useState<MemoEntry | null>(null);
  const [memoToDelete, setMemoToDelete] = useState<MemoEntry | null>(null);
  const { toast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  
  const form = useForm<MemoFormValues>({
    resolver: zodResolver(memoFormSchema),
    defaultValues: { title: "", content: "", color: "yellow" },
  });
  
  // Cleanup function para Speech Recognition
  const cleanupSpeechRecognition = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.warn("Error stopping speech recognition:", error);
      }
    }
    setIsListening(false);
    setSpeechError(null);
  }, [isListening]);

  // Effect para reset cuando se cierra el dialog
  useEffect(() => {
    if (!isOpen) {
      // Reset state when dialog is closed
      setView('list');
      setEditingMemo(null);
      setMemoToDelete(null);
      form.reset({ title: "", content: "", color: 'yellow' });
      cleanupSpeechRecognition();
    }
  }, [isOpen, form, cleanupSpeechRecognition]);

  // Effect para cargar datos al editar
  useEffect(() => {
    if (editingMemo) {
      form.reset({ 
        title: editingMemo.title, 
        content: editingMemo.content, 
        color: editingMemo.color || 'yellow' 
      });
      setView('form');
    } else {
      form.reset({ title: "", content: "", color: 'yellow' });
    }
  }, [editingMemo, form]);

  // Effect para inicializar Speech Recognition
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setIsSpeechRecognitionSupported(true);
      
      try {
        recognitionRef.current = new SpeechRecognitionAPI();
        const recognition = recognitionRef.current;
        
        if (!recognition) {
          setIsSpeechRecognitionSupported(false);
          return;
        }
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'es-ES';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          if (event.results && event.results.length > 0) {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            if (transcript) {
              const currentContent = form.getValues('content');
              const newContent = currentContent ? `${currentContent} ${transcript}` : transcript;
              form.setValue('content', newContent, { shouldValidate: true });
              toast({ 
                title: "Texto reconocido", 
                description: "El contenido ha sido añadido a tu nota."
              });
            }
          }
        };
        
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error);
          let errorMsg = "Ocurrió un error con el reconocimiento de voz.";
          
          switch (event.error) {
            case 'no-speech':
              errorMsg = "No se detectó voz. Inténtalo de nuevo.";
              break;
            case 'audio-capture':
              errorMsg = "No se pudo acceder al micrófono.";
              break;
            case 'not-allowed':
              errorMsg = "Permiso para usar el micrófono denegado.";
              break;
            case 'network':
              errorMsg = "Error de red. Verifica tu conexión.";
              break;
            case 'service-not-allowed':
              errorMsg = "Servicio de reconocimiento no permitido.";
              break;
          }
          
          setSpeechError(errorMsg);
          setIsListening(false);
          toast({ 
            title: "Error de reconocimiento", 
            description: errorMsg, 
            variant: "destructive" 
          });
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onstart = () => {
          setSpeechError(null);
        };

      } catch (error) {
        console.error("Error initializing speech recognition:", error);
        setIsSpeechRecognitionSupported(false);
      }
    }

    // Cleanup on unmount
    return () => {
      cleanupSpeechRecognition();
    };
  }, [form, toast, cleanupSpeechRecognition]);

  const toggleListening = async () => {
    if (!isSpeechRecognitionSupported || !recognitionRef.current) {
      toast({ 
        title: "Función no Soportada", 
        description: "El reconocimiento de voz no está disponible en tu navegador.", 
        variant: "destructive" 
      });
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping recognition:", error);
        setIsListening(false);
      }
    } else {
      try {
        // Check for microphone permission if available
        if (navigator.permissions) {
          const permissionStatus = await navigator.permissions.query({ 
            name: 'microphone' as PermissionName 
          });
          
          if (permissionStatus.state === 'denied') {
            setSpeechError("Permiso para micrófono denegado. Habilítalo en los ajustes de tu navegador.");
            toast({ 
              title: "Permiso Requerido", 
              description: "Necesitas dar permiso para usar el micrófono.", 
              variant: "destructive"
            });
            return;
          }
        }

        setSpeechError(null);
        recognitionRef.current.start();
        setIsListening(true);
        
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setSpeechError("No se pudo iniciar el reconocimiento de voz. Revisa los permisos del micrófono.");
        setIsListening(false);
        toast({ 
          title: "Error al iniciar", 
          description: "No se pudo iniciar el reconocimiento de voz.", 
          variant: "destructive" 
        });
      }
    }
  };
  
  const handleFormSubmit = (values: MemoFormValues) => {
    try {
      if (editingMemo) {
        onUpdateMemo({ 
          ...editingMemo, 
          ...values,
          updatedAt: new Date().toISOString()
        });
        toast({ 
          title: "Nota actualizada", 
          description: "La nota se ha actualizado correctamente." 
        });
      } else {
        onAddMemo({
          title: values.title, 
          content: values.content, 
          color: values.color || 'yellow'
        });
        toast({ 
          title: "Nota creada", 
          description: "La nota se ha guardado correctamente." 
        });
      }
      
      setView('list');
      setEditingMemo(null);
      cleanupSpeechRecognition();
      
    } catch (error) {
      console.error("Error saving memo:", error);
      toast({ 
        title: "Error", 
        description: "No se pudo guardar la nota. Inténtalo de nuevo.", 
        variant: "destructive" 
      });
    }
  };
  
  const confirmDelete = (memo: MemoEntry) => {
    setMemoToDelete(memo);
  };

  const executeDelete = () => {
    if (memoToDelete) {
      try {
        onDeleteMemo(memoToDelete.id);
        toast({ 
          title: "Nota eliminada", 
          description: "La nota se ha eliminado correctamente." 
        });
      } catch (error) {
        console.error("Error deleting memo:", error);
        toast({ 
          title: "Error", 
          description: "No se pudo eliminar la nota. Inténtalo de nuevo.", 
          variant: "destructive" 
        });
      }
      setMemoToDelete(null);
    }
  };

  const handleCancel = () => {
    setView('list');
    setEditingMemo(null);
    cleanupSpeechRecognition();
    form.reset({ title: "", content: "", color: 'yellow' });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl h-[90vh] flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center text-2xl">
              <NotebookText className="mr-2 h-6 w-6 text-primary" />
              Mis Notas / Ayudamemorias
            </DialogTitle>
            <DialogDescription>
              {view === 'list' 
                ? 'Crea y gestiona tus apuntes rápidos y recordatorios.' 
                : (editingMemo ? `Editando: ${editingMemo.title}` : 'Añadir Nueva Nota')
              }
            </DialogDescription>
          </DialogHeader>

          {view === 'list' ? (
            <div className="flex-grow overflow-hidden flex flex-col p-6">
              <Button 
                onClick={() => { 
                  setEditingMemo(null); 
                  setView('form'); 
                }} 
                className="mb-4"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nueva Nota
              </Button>
              
              <ScrollArea className="flex-grow">
                {memos.length === 0 ? (
                  <div className="text-center py-8">
                    <NotebookText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      No tienes notas guardadas.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Haz clic en &quot;Añadir Nueva Nota&quot; para crear tu primera nota.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {memos.map(memo => {
                      const colorClasses = POST_IT_COLORS.find(c => c.name === memo.color) || POST_IT_COLORS[0];
                      return (
                        <Accordion 
                          key={memo.id} 
                          type="single" 
                          collapsible 
                          className={cn(
                            "w-full border rounded-md overflow-hidden", 
                            colorClasses.bg, 
                            colorClasses.border
                          )}
                        >
                          <AccordionItem value={memo.id} className="border-b-0">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline text-left">
                              {memo.title}
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <p className="whitespace-pre-wrap text-sm mb-4">
                                {memo.content}
                              </p>
                              <div className="text-xs text-muted-foreground mb-2">
                                Creado: {format(parseISO(memo.createdAt), "PPP p", { locale: es })}
                                {memo.updatedAt && memo.updatedAt !== memo.createdAt && (
                                  <span className="block">
                                    Actualizado: {format(parseISO(memo.updatedAt), "PPP p", { locale: es })}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => setEditingMemo(memo)}
                                >
                                  <Edit className="mr-2 h-3 w-3" /> Editar
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => confirmDelete(memo)}
                                >
                                  <Trash2 className="mr-2 h-3 w-3" /> Eliminar
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>
          ) : (
            <ScrollArea className="flex-grow p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título de la nota..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contenido</FormLabel>
                        <div className="flex gap-2 items-start">
                          <FormControl className="flex-grow">
                            <Textarea 
                              placeholder="Escribe tu nota aquí o usa el micrófono..." 
                              rows={10} 
                              {...field} 
                            />
                          </FormControl>
                          {isSpeechRecognitionSupported && (
                            <Button 
                              type="button" 
                              onClick={toggleListening} 
                              size="icon" 
                              variant={isListening ? "destructive" : "outline"} 
                              aria-label={isListening ? "Detener grabación" : "Iniciar grabación"}
                              disabled={form.formState.isSubmitting}
                            >
                              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                        
                        {speechError && (
                          <p className="text-xs text-destructive flex items-center gap-1 pt-1">
                            <AlertTriangle className="h-3 w-3 flex-shrink-0" /> 
                            {speechError}
                          </p>
                        )}
                        
                        {!isSpeechRecognitionSupported && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
                            <AlertTriangle className="h-3 w-3 flex-shrink-0" /> 
                            El reconocimiento de voz no es compatible con este navegador.
                          </p>
                        )}
                        
                        {isListening && (
                          <p className="text-xs text-blue-600 flex items-center gap-1 pt-1">
                            <Mic className="h-3 w-3 flex-shrink-0 animate-pulse" /> 
                            Escuchando... Habla ahora
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Palette className="mr-2 h-4 w-4" /> Color de la Nota
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-3 pt-2">
                            {POST_IT_COLORS.map(color => (
                              <button
                                key={color.name}
                                type="button"
                                className={cn(
                                  "w-10 h-10 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                                  color.bg, 
                                  color.border,
                                  field.value === color.name 
                                    ? "ring-2 ring-offset-2 ring-primary scale-110" 
                                    : "border-muted-foreground/30"
                                )}
                                onClick={() => field.onChange(color.name)}
                                aria-label={`Seleccionar color ${color.name}`}
                                title={`Color ${color.name}`}
                              >
                                {field.value === color.name && (
                                  <CheckCircle className="h-5 w-5 text-slate-800/80" />
                                )}
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2 pt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                      disabled={form.formState.isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={form.formState.isSubmitting}
                    >
                      <Save className="mr-2 h-4 w-4" /> 
                      {form.formState.isSubmitting 
                        ? 'Guardando...' 
                        : (editingMemo ? 'Actualizar Nota' : 'Guardar Nota')
                      }
                    </Button>
                  </div>
                </form>
              </Form>
            </ScrollArea>
          )}

          {view === 'list' && (
            <DialogFooter className="p-6 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={memoToDelete !== null} onOpenChange={(open) => !open && setMemoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar Eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar la nota &quot;{memoToDelete?.title}&quot;? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMemoToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeDelete} 
              className="bg-destructive hover:bg-destructive/90"
            >
              Sí, Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
