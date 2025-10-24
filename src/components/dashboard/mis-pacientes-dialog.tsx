
"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Patient, PatientNote } from '@/lib/types';
import { Users2, PlusCircle, ChevronRight, ArrowLeft, Trash2, NotebookPen, Activity, Heart, Thermometer, Percent, Stethoscope, Droplets as GlucoseIcon, Ruler, Download, Share2, Mic, MicOff, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from '@/hooks/use-toast';

interface MisPacientesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patients: Patient[];
  onAddPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  selectedPatientId: string | null;
  onSelectPatient: (patientId: string | null) => void;
  patientNotes: Record<string, PatientNote[]>;
  onAddPatientNote: (patientId: string, content: string, vitalSigns?: PatientNote['vitalSigns']) => void;
  onDeletePatient: (patientId: string) => void;
  onDeletePatientNote: (patientId: string, noteId: string) => void;
}

const patientFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres.").max(100),
  identifier: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

const noteFormSchema = z.object({
  content: z.string().min(1, "La nota no puede estar vacía."),
  bloodPressure: z.string().optional().refine(val => !val || /^\d{1,3}\/\d{1,3}$/.test(val), { message: "Formato PA inválido (ej: 120/80)"}),
  heartRate: z.coerce.number().positive("Debe ser positivo").optional().or(z.literal('')),
  respiratoryRate: z.coerce.number().positive("Debe ser positivo").optional().or(z.literal('')),
  temperature: z.coerce.number().positive("Debe ser positivo").optional().or(z.literal('')),
  saturation: z.coerce.number().min(0, "Mínimo 0%").max(100, "Máximo 100%").optional().or(z.literal('')),
  painScale: z.string().optional(),
  glycemia: z.coerce.number().positive("Debe ser positivo").optional().or(z.literal('')),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

export default function MisPacientesDialog({
  isOpen,
  onOpenChange,
  patients,
  onAddPatient,
  selectedPatientId,
  onSelectPatient,
  patientNotes,
  onAddPatientNote,
  onDeletePatient,
  onDeletePatientNote,
}: MisPacientesDialogProps) {
  const [view, setView] = useState<'list' | 'addPatient' | 'patientDetail'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<{patientId: string, noteId: string} | null>(null);
  const [isShareApiAvailable, setIsShareApiAvailable] = useState(false);
  const { toast } = useToast();

  const [isListeningNote, setIsListeningNote] = useState(false);
  const [speechErrorNote, setSpeechErrorNote] = useState<string | null>(null);
  const [isSpeechRecognitionSupportedNote, setIsSpeechRecognitionSupportedNote] = useState(false);
  const recognitionNoteRef = useRef<ISpeechRecognition | null>(null);

  const patientForm = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: { name: "", identifier: "", address: "", phone: "" },
  });

  const noteForm = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
        content: "",
        bloodPressure: "",
        heartRate: '',
        respiratoryRate: '',
        temperature: '',
        saturation: '',
        painScale: "",
        glycemia: '',
     },
  });

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setIsShareApiAvailable(true);
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setIsSpeechRecognitionSupportedNote(true);
      recognitionNoteRef.current = new SpeechRecognitionAPI();
      const recognition = recognitionNoteRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'es-ES';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        noteForm.setValue('content', noteForm.getValues('content') + (noteForm.getValues('content') ? " " : "") + transcript);
        if (transcript) {
          toast({ title: "Nota reconocida", description: "El contenido ha sido añadido a la nota."});
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error for note", event.error);
        let errorMsg = `Error de reconocimiento: ${event.error}`;
        if (event.error === 'no-speech') {
          errorMsg = "No se detectó voz. Inténtalo de nuevo.";
        } else if (event.error === 'audio-capture') {
          errorMsg = "Error de captura de audio. Revisa tu micrófono.";
        } else if (event.error === 'not-allowed') {
          errorMsg = "Permiso para micrófono denegado. Habilítalo en los ajustes.";
        }
        setSpeechErrorNote(errorMsg);
        setIsListeningNote(false);
      };

      recognition.onend = () => {
        setIsListeningNote(false);
      };
    } else {
      setIsSpeechRecognitionSupportedNote(false);
      console.warn("SpeechRecognition API no es soportada por este navegador.");
    }

    return () => {
      if (recognitionNoteRef.current) {
        recognitionNoteRef.current.abort();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteForm, toast]);

  const toggleListeningNote = async () => {
    if (!isSpeechRecognitionSupportedNote || !recognitionNoteRef.current) {
        toast({ title: "Función no Soportada", description: "El reconocimiento de voz no está disponible en tu navegador.", variant: "destructive" });
        return;
    }

    if (isListeningNote) {
      recognitionNoteRef.current.stop();
      setIsListeningNote(false);
    } else {
      try {
        if (navigator.permissions) {
            const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
            if (permissionStatus.state === 'denied') {
                 setSpeechErrorNote("Permiso para micrófono denegado. Habilítalo en los ajustes de tu navegador.");
                 toast({ title: "Permiso Requerido", description: "Necesitas dar permiso para usar el micrófono.", variant: "destructive"});
                 setIsListeningNote(false);
                 return;
            }
        }
        setSpeechErrorNote(null);
        recognitionNoteRef.current.start();
        setIsListeningNote(true);
      } catch (err) {
        console.error("Error starting speech recognition for note:", err);
        setSpeechErrorNote("No se pudo iniciar el reconocimiento de voz. Revisa los permisos.");
        setIsListeningNote(false);
        toast({ title: "Error al Iniciar", description: "No se pudo activar el micrófono.", variant: "destructive"});
      }
    }
  };


  useEffect(() => {
    if (!isOpen) {
      setView('list');
      setSearchTerm('');
      onSelectPatient(null);
      patientForm.reset();
      noteForm.reset({
        content: "",
        bloodPressure: "",
        heartRate: '',
        respiratoryRate: '',
        temperature: '',
        saturation: '',
        painScale: "",
        glycemia: '',
      });
      setIsListeningNote(false);
      setSpeechErrorNote(null);
    }
  }, [isOpen, onSelectPatient, patientForm, noteForm]);

  const handleAddPatientSubmit = (values: PatientFormValues) => {
    onAddPatient(values);
    patientForm.reset();
    setView('list');
  };

  const handleAddNoteSubmit = (values: NoteFormValues) => {
    if (selectedPatientId) {
      const vitalSigns: PatientNote['vitalSigns'] = {};
      let hasVitalSigns = false;

      if (values.bloodPressure && values.bloodPressure.trim() !== "") { vitalSigns.bloodPressure = values.bloodPressure; hasVitalSigns = true; }
      if (values.heartRate !== '' && values.heartRate !== undefined) { vitalSigns.heartRate = Number(values.heartRate); hasVitalSigns = true; }
      if (values.respiratoryRate !== '' && values.respiratoryRate !== undefined) { vitalSigns.respiratoryRate = Number(values.respiratoryRate); hasVitalSigns = true; }
      if (values.temperature !== '' && values.temperature !== undefined) { vitalSigns.temperature = Number(values.temperature); hasVitalSigns = true; }
      if (values.saturation !== '' && values.saturation !== undefined) { vitalSigns.saturation = Number(values.saturation); hasVitalSigns = true; }
      if (values.painScale && values.painScale.trim() !== "") { vitalSigns.painScale = values.painScale; hasVitalSigns = true; }
      if (values.glycemia !== '' && values.glycemia !== undefined) { vitalSigns.glycemia = Number(values.glycemia); hasVitalSigns = true; }
      
      onAddPatientNote(selectedPatientId, values.content, hasVitalSigns ? vitalSigns : undefined);
      noteForm.reset({
        content: "",
        bloodPressure: "",
        heartRate: '',
        respiratoryRate: '',
        temperature: '',
        saturation: '',
        painScale: "",
        glycemia: '',
      });
      setSpeechErrorNote(null);
    }
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.identifier && p.identifier.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [patients, searchTerm]);

  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId);
  }, [patients, selectedPatientId]);

  const currentPatientNotes = useMemo(() => {
    if (!selectedPatientId || !patientNotes[selectedPatientId]) return [];
    return patientNotes[selectedPatientId].sort((a, b) =>
      parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()
    );
  }, [patientNotes, selectedPatientId]);

  const confirmDeletePatient = (patient: Patient) => {
    setPatientToDelete(patient);
  };

  const executeDeletePatient = () => {
    if (patientToDelete) {
      onDeletePatient(patientToDelete.id);
      setPatientToDelete(null);
      if (selectedPatientId === patientToDelete.id) {
        setView('list');
        onSelectPatient(null);
      }
    }
  };
  
  const confirmDeleteNote = (patientId: string, noteId: string) => {
    setNoteToDelete({ patientId, noteId });
  };

  const executeDeleteNote = () => {
    if (noteToDelete) {
      onDeletePatientNote(noteToDelete.patientId, noteToDelete.noteId);
      setNoteToDelete(null);
    }
  };

  const renderVitalSign = (label: string, value?: string | number, unit?: string, icon?: React.ReactNode) => {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === "")) return null;
    return (
      <span className="text-xs mr-2 pr-2 border-r border-muted-foreground/30 last:border-r-0 last:pr-0">
        {icon && React.cloneElement(icon as React.ReactElement, { className: "inline h-3 w-3 mr-1 text-muted-foreground" })}
        <span className="font-medium">{label}:</span> {value}{unit && ` ${unit}`}
      </span>
    );
  };

  const generateNoteExportContent = (patient: Patient, note: PatientNote): string => {
    let content = `Nota de Evolución del Paciente\n`;
    content += `---------------------------------\n`;
    content += `Paciente: ${patient.name}\n`;
    if (patient.identifier) {
      content += `Identificador: ${patient.identifier}\n`;
    }
    content += `Fecha de la Nota: ${format(parseISO(note.createdAt), "PPP p", { locale: es })}\n`;
    content += `---------------------------------\n\n`;
    content += `Contenido de la Nota:\n${note.content}\n\n`;
  
    if (note.vitalSigns && (Object.keys(note.vitalSigns).length > 0 || (note.vitalSigns.bloodPressure && note.vitalSigns.bloodPressure !== ""))) {
      content += `Signos Vitales Registrados:\n`;
      if (note.vitalSigns.bloodPressure) content += `  - P. Arterial: ${note.vitalSigns.bloodPressure} mmHg\n`;
      if (note.vitalSigns.heartRate) content += `  - F. Cardíaca: ${note.vitalSigns.heartRate} lpm\n`;
      if (note.vitalSigns.respiratoryRate) content += `  - F. Respiratoria: ${note.vitalSigns.respiratoryRate} rpm\n`;
      if (note.vitalSigns.temperature) content += `  - Temperatura: ${note.vitalSigns.temperature} °C\n`;
      if (note.vitalSigns.saturation) content += `  - Sat. O₂: ${note.vitalSigns.saturation} %\n`;
      if (note.vitalSigns.painScale) content += `  - Escala Dolor: ${note.vitalSigns.painScale}\n`;
      if (note.vitalSigns.glycemia) content += `  - Glicemia: ${note.vitalSigns.glycemia} mg/dL\n`;
      content += `---------------------------------\n`;
    }
    return content;
  };

  const handleExportNote = (patient: Patient, note: PatientNote) => {
    const content = generateNoteExportContent(patient, note);
    if (!content) return;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const noteDateFormatted = format(parseISO(note.createdAt), "yyyyMMdd_HHmmss");
    const patientNameFormatted = patient.name.replace(/\s+/g, '_').substring(0, 20);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nota_${patientNameFormatted}_${noteDateFormatted}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Nota Exportada", description: "La nota se ha descargado como archivo .txt." });
  };

  const handleShareNote = async (patient: Patient, note: PatientNote) => {
    const contentToShare = generateNoteExportContent(patient, note);
    if (!contentToShare || !navigator.share) return;

    try {
      await navigator.share({
        title: `Nota de ${patient.name} - ${format(parseISO(note.createdAt), "PPP", { locale: es })}`,
        text: contentToShare,
      });
      toast({ title: "Nota Compartida", description: "La nota se ha compartido exitosamente." });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error al compartir nota:', error);
        toast({ title: "Error al Compartir", description: `No se pudo compartir la nota: ${error.message}`, variant: "destructive" });
      }
    }
  };


  return (
    <>
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center text-2xl">
            <Users2 className="mr-2 h-6 w-6 text-primary" />
            Mis Pacientes
          </DialogTitle>
          {view === 'list' && <DialogDescription>Gestiona tu lista de pacientes.</DialogDescription>}
          {view === 'addPatient' && <DialogDescription>Añadir nuevo paciente.</DialogDescription>}
          {view === 'patientDetail' && selectedPatient && <DialogDescription>Detalles y notas para {selectedPatient.name}.</DialogDescription>}
        </DialogHeader>

        {view === 'list' && (
          <div className="px-6 py-4 flex-grow overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <Input
                type="search"
                placeholder="Buscar paciente por nombre o RUT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Button onClick={() => setView('addPatient')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Paciente
              </Button>
            </div>
            <ScrollArea className="flex-grow">
              {filteredPatients.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {patients.length === 0 ? "No hay pacientes registrados." : "No se encontraron pacientes."}
                </p>
              ) : (
                <ul className="space-y-2">
                  {filteredPatients.map((patient) => (
                    <li
                      key={patient.id}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => { onSelectPatient(patient.id); setView('patientDetail'); }}
                    >
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        {patient.identifier && <p className="text-xs text-muted-foreground">ID: {patient.identifier}</p>}
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </div>
        )}

        {view === 'addPatient' && (
          <ScrollArea className="flex-grow px-6 py-4">
            <Form {...patientForm}>
              <form onSubmit={patientForm.handleSubmit(handleAddPatientSubmit)} className="space-y-4">
                <FormField
                  control={patientForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl><Input placeholder="Nombre del paciente" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={patientForm.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identificador (RUT, DNI, etc.)</FormLabel>
                      <FormControl><Input placeholder="Ej: 12.345.678-9" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={patientForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl><Input placeholder="Dirección del paciente" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={patientForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono de Contacto</FormLabel>
                      <FormControl><Input type="tel" placeholder="Ej: +56912345678" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setView('list')}>Cancelar</Button>
                  <Button type="submit">Guardar Paciente</Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
        )}

        {view === 'patientDetail' && selectedPatient && (
          <div className="flex-grow overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-primary">{selectedPatient.name}</h3>
              {selectedPatient.identifier && <p className="text-sm text-muted-foreground">ID: {selectedPatient.identifier}</p>}
              {selectedPatient.address && <p className="text-sm text-muted-foreground">Dir: {selectedPatient.address}</p>}
              {selectedPatient.phone && <p className="text-sm text-muted-foreground">Tel: {selectedPatient.phone}</p>}
               <Button variant="destructive" size="sm" onClick={() => confirmDeletePatient(selectedPatient)} className="mt-2">
                <Trash2 className="mr-2 h-3 w-3" /> Eliminar Paciente
              </Button>
            </div>
            <ScrollArea className="flex-grow px-6 py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center"><NotebookPen className="mr-2 h-5 w-5" />Notas de Evolución / Visita</h4>
                  <Form {...noteForm}>
                    <form onSubmit={noteForm.handleSubmit(handleAddNoteSubmit)} className="space-y-3 mb-4 p-4 border rounded-lg bg-card shadow-sm">
                      <FormField
                        control={noteForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contenido de la Nota</FormLabel>
                            <div className="flex gap-2 items-start">
                                <FormControl className="flex-grow">
                                    <Textarea placeholder="Escribe tu nota aquí o usa el micrófono..." rows={3} {...field} />
                                </FormControl>
                                {isSpeechRecognitionSupportedNote && (
                                <Button type="button" onClick={toggleListeningNote} size="icon" variant="outline" aria-label={isListeningNote ? "Detener grabación de nota" : "Iniciar grabación de nota"}>
                                    {isListeningNote ? <MicOff className="text-destructive" /> : <Mic />}
                                </Button>
                                )}
                            </div>
                            <FormMessage />
                            {speechErrorNote && (
                                <p className="text-xs text-destructive flex items-center gap-1 pt-1">
                                <AlertTriangle className="h-3 w-3 flex-shrink-0" /> {speechErrorNote}
                                </p>
                            )}
                            {!isSpeechRecognitionSupportedNote && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
                                <AlertTriangle className="h-3 w-3 flex-shrink-0" /> Reconocimiento de voz no compatible.
                                </p>
                            )}
                          </FormItem>
                        )}
                      />
                      
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="vital-signs">
                          <AccordionTrigger className="text-sm py-2 font-medium hover:no-underline">
                            <Activity className="mr-2 h-4 w-4 text-blue-500"/> Registrar Signos Vitales (Opcional)
                          </AccordionTrigger>
                          <AccordionContent className="pt-3">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                              <FormField control={noteForm.control} name="bloodPressure" render={({ field }) => (
                                <FormItem><FormLabel className="text-xs">P. Arterial</FormLabel><FormControl><Input placeholder="120/80" {...field} className="h-8 text-xs" /></FormControl><FormMessage className="text-xs"/></FormItem>
                              )}/>
                              <FormField control={noteForm.control} name="heartRate" render={({ field }) => (
                                <FormItem><FormLabel className="text-xs">F. Cardíaca</FormLabel><FormControl><Input type="number" placeholder="70" {...field} className="h-8 text-xs" /></FormControl><FormMessage className="text-xs"/></FormItem>
                              )}/>
                              <FormField control={noteForm.control} name="respiratoryRate" render={({ field }) => (
                                <FormItem><FormLabel className="text-xs">F. Respiratoria</FormLabel><FormControl><Input type="number" placeholder="16" {...field} className="h-8 text-xs" /></FormControl><FormMessage className="text-xs"/></FormItem>
                              )}/>
                              <FormField control={noteForm.control} name="temperature" render={({ field }) => (
                                <FormItem><FormLabel className="text-xs">Temperatura (°C)</FormLabel><FormControl><Input type="number" step="0.1" placeholder="36.5" {...field} className="h-8 text-xs" /></FormControl><FormMessage className="text-xs"/></FormItem>
                              )}/>
                              <FormField control={noteForm.control} name="saturation" render={({ field }) => (
                                <FormItem><FormLabel className="text-xs">Sat. O₂ (%)</FormLabel><FormControl><Input type="number" placeholder="98" {...field} className="h-8 text-xs" /></FormControl><FormMessage className="text-xs"/></FormItem>
                              )}/>
                              <FormField control={noteForm.control} name="painScale" render={({ field }) => (
                                <FormItem><FormLabel className="text-xs">Escala Dolor</FormLabel><FormControl><Input placeholder="EVA: 3/10" {...field} className="h-8 text-xs" /></FormControl><FormMessage className="text-xs"/></FormItem>
                              )}/>
                              <FormField control={noteForm.control} name="glycemia" render={({ field }) => (
                                <FormItem><FormLabel className="text-xs">Glicemia (mg/dL)</FormLabel><FormControl><Input type="number" placeholder="90" {...field} className="h-8 text-xs" /></FormControl><FormMessage className="text-xs"/></FormItem>
                              )}/>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <Button type="submit" size="sm" className="mt-2">
                        <PlusCircle className="mr-2 h-4 w-4" /> Guardar Nota
                      </Button>
                    </form>
                  </Form>
                  {currentPatientNotes.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No hay notas para este paciente.</p>
                  ) : (
                    <ul className="space-y-3">
                      {currentPatientNotes.map(note => (
                        <li key={note.id} className="p-3 border rounded-md bg-card shadow-sm">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-xs text-muted-foreground">
                              {format(parseISO(note.createdAt), "PPP p", { locale: es })}
                            </p>
                            <div className="flex items-center gap-1 ml-auto">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); if (selectedPatient) {handleExportNote(selectedPatient, note); } }}>
                                    <Download className="h-3.5 w-3.5" />
                                    <span className="sr-only">Exportar Nota</span>
                                </Button>
                                {isShareApiAvailable && (
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); if (selectedPatient) { handleShareNote(selectedPatient, note); } }}>
                                    <Share2 className="h-3.5 w-3.5" />
                                    <span className="sr-only">Compartir Nota</span>
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); if (selectedPatient) { confirmDeleteNote(selectedPatient.id, note.id); } }}>
                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                    <span className="sr-only">Eliminar Nota</span>
                                </Button>
                            </div>
                          </div>
                          <p className="text-sm whitespace-pre-wrap mb-2">{note.content}</p>
                          {note.vitalSigns && (Object.keys(note.vitalSigns).length > 0 || (note.vitalSigns.bloodPressure && note.vitalSigns.bloodPressure !== "") ) && (
                            <div className="mt-2 pt-2 border-t border-muted/50">
                                <p className="text-xs text-foreground flex flex-wrap items-center">
                                  {renderVitalSign("PA", note.vitalSigns.bloodPressure, "mmHg", <Stethoscope />)}
                                  {renderVitalSign("FC", note.vitalSigns.heartRate, "lpm", <Heart />)}
                                  {renderVitalSign("FR", note.vitalSigns.respiratoryRate, "rpm", <Activity />)}
                                  {renderVitalSign("T°", note.vitalSigns.temperature, "°C", <Thermometer />)}
                                  {renderVitalSign("SatO₂", note.vitalSigns.saturation, "%", <Percent />)}
                                  {renderVitalSign("Dolor", note.vitalSigns.painScale, "", <Ruler />)}
                                  {renderVitalSign("Glicemia", note.vitalSigns.glycemia, "mg/dL", <GlucoseIcon />)}
                                </p>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        )}

        <DialogFooter className="px-6 pt-4 pb-6 border-t">
          {view !== 'list' && (
            <Button variant="outline" onClick={() => { setView('list'); onSelectPatient(null); }} className="mr-auto">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la Lista
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} className={view === 'list' ? 'w-full sm:w-auto' : ''}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog open={patientToDelete !== null} onOpenChange={(open) => !open && setPatientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar Eliminación de Paciente?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar a &quot;{patientToDelete?.name}&quot;? Se eliminarán también todas sus notas. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPatientToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executeDeletePatient} className="bg-destructive hover:bg-destructive/90">
              Sí, Eliminar Paciente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    <AlertDialog open={noteToDelete !== null} onOpenChange={(open) => !open && setNoteToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar Eliminación de Nota?</AlertDialogTitle>
            <AlertDialogDescription>
                ¿Estás seguro de que quieres eliminar esta nota? Esta acción no se puede deshacer.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNoteToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executeDeleteNote} className="bg-destructive hover:bg-destructive/90">
                Sí, Eliminar Nota
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
