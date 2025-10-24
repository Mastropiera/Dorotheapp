
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, StopCircle, HeartPulse, Timer, RefreshCw, Download, Zap, Syringe, Minus, Plus, Airplay, Pill, Mic, MicOff, AlertTriangle, NotebookPen as NoteIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';


// --- Tipos de Eventos ---
type RhythmType = 'Fibrilación Ventricular' | 'Taquicardia Ventricular Sin Pulso' | 'Actividad Eléctrica Sin Pulso' | 'Asistolia' | 'Otro';
type LogEventType = 'START_RCP' | 'PAUSE_RCP' | 'RESUME_RCP' | 'FINISH_RCP' | 'RHYTHM_CHECK' | 'START_CYCLE' | 'STOP_CYCLE' | 'DEFIBRILLATION' | 'MEDICATION' | 'IV_IO_ACCESS' | 'AIRWAY_DEVICE' | 'CUSTOM_NOTE';

interface LogEvent {
  id: number;
  time: number; // Tiempo en segundos desde el inicio
  type: LogEventType;
  description: string;
}

interface MedicationEvent {
    name: string;
    dose: string;
    time: number; // elapsedTime in seconds
}

interface DefibrillationEvent {
    count: number;
    joules: number;
    time: number; // elapsedTime in seconds
}

interface RcpLogDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}


// --- Modales ---

const RhythmModal = ({ onSelect }: { onSelect: (rhythm: RhythmType, customText?: string) => void }) => {
    const [customRhythm, setCustomRhythm] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
  
    const handleSelect = (rhythm: RhythmType) => {
      if (rhythm === 'Otro') {
        setShowCustomInput(true);
      } else {
        onSelect(rhythm);
      }
    };
  
    const handleCustomSubmit = () => {
      if (customRhythm.trim()) {
        onSelect('Otro', customRhythm.trim());
      }
    };

    return (
        <>
            <AlertDialogHeader>
              <AlertDialogTitle>Seleccionar Ritmo</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-2">
                {!showCustomInput ? (
                    <>
                        <Button className="w-full justify-start" variant="outline" onClick={() => handleSelect('Fibrilación Ventricular')}>Fibrilación Ventricular (FV)</Button>
                        <Button className="w-full justify-start" variant="outline" onClick={() => handleSelect('Taquicardia Ventricular Sin Pulso')}>TV Sin Pulso (TVSP)</Button>
                        <Button className="w-full justify-start" variant="outline" onClick={() => handleSelect('Actividad Eléctrica Sin Pulso')}>AESP</Button>
                        <Button className="w-full justify-start" variant="outline" onClick={() => handleSelect('Asistolia')}>Asistolia</Button>
                        <Button className="w-full justify-start" variant="outline" onClick={() => handleSelect('Otro')}>Otro ritmo...</Button>
                    </>
                ) : (
                    <>
                        <Input autoFocus placeholder="Describa el ritmo..." value={customRhythm} onChange={e => setCustomRhythm(e.target.value)} />
                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" onClick={() => setShowCustomInput(false)} className="w-full">Volver</Button>
                            <Button onClick={handleCustomSubmit} className="w-full">Aceptar</Button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

const DefibrillationModal = ({ onConfirm }: { onConfirm: (joules: number) => void }) => {
    const [joules, setJoules] = useState<number | ''>(200);
    return (
        <>
             <AlertDialogHeader>
              <AlertDialogTitle>Administrar Desfibrilación</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-3">
                <Label htmlFor="joules-input">Energía (Joules)</Label>
                <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => setJoules(j => Math.max(0, (Number(j) || 0) - 10))}><Minus className="h-4 w-4"/></Button>
                    <Input id="joules-input" type="number" value={joules} onChange={e => setJoules(e.target.value === '' ? '' : parseInt(e.target.value))} className="text-center" placeholder="Ej: 200" />
                    <Button size="icon" variant="outline" onClick={() => setJoules(j => (Number(j) || 0) + 10)}><Plus className="h-4 w-4"/></Button>
                </div>
                <Button onClick={() => onConfirm(Number(joules))} disabled={!joules || joules <= 0} className="w-full">Confirmar Descarga</Button>
            </div>
        </>
    );
};

const MedicationModal = ({ onConfirm }: { onConfirm: (name: string, dose: string) => void }) => {
    const [medication, setMedication] = useState<'amiodarone' | 'lidocaine' | 'other' | null>(null);
    const [amiodaroneDose, setAmiodaroneDose] = useState<number | ''>(300);
    const [lidocaineDose, setLidocaineDose] = useState<number | ''>(1);
    const [otherName, setOtherName] = useState('');
    const [otherDose, setOtherDose] = useState('');

    const handleConfirm = () => {
        switch(medication) {
            case 'amiodarone':
                if (amiodaroneDose && amiodaroneDose > 0) onConfirm('Amiodarona', `${amiodaroneDose} mg`);
                break;
            case 'lidocaine':
                if (lidocaineDose && lidocaineDose > 0) onConfirm('Lidocaína', `${lidocaineDose} mg/kg`);
                break;
            case 'other':
                if (otherName.trim() && otherDose.trim()) onConfirm(otherName.trim(), otherDose.trim());
                break;
        }
    };
    
    if (medication === 'amiodarone') return (
        <><AlertDialogHeader><AlertDialogTitle>Administrar Amiodarona</AlertDialogTitle></AlertDialogHeader>
        <div className="space-y-3">
            <Label htmlFor="amiodarone-dose">Dosis (mg)</Label>
            <div className="flex items-center gap-2"><Button size="icon" variant="outline" onClick={() => setAmiodaroneDose(d => Math.max(0, (Number(d) || 0) - 50))}><Minus className="h-4 w-4"/></Button><Input id="amiodarone-dose" type="number" step="50" value={amiodaroneDose} onChange={e => setAmiodaroneDose(e.target.value === '' ? '' : parseInt(e.target.value))} className="text-center" /><Button size="icon" variant="outline" onClick={() => setAmiodaroneDose(d => (Number(d) || 0) + 50)}><Plus className="h-4 w-4"/></Button></div>
            <Button onClick={handleConfirm} disabled={!amiodaroneDose || amiodaroneDose <= 0} className="w-full">Confirmar Dosis</Button>
        </div></>
    );

    if (medication === 'lidocaine') return (
        <><AlertDialogHeader><AlertDialogTitle>Administrar Lidocaína</AlertDialogTitle></AlertDialogHeader>
        <div className="space-y-3">
            <Label htmlFor="lidocaine-dose">Dosis (mg/kg)</Label>
            <div className="flex items-center gap-2"><Button size="icon" variant="outline" onClick={() => setLidocaineDose(d => parseFloat(((Number(d) || 0) - 0.25).toFixed(2)))}><Minus className="h-4 w-4"/></Button><Input id="lidocaine-dose" type="number" step="0.25" value={lidocaineDose} onChange={e => setLidocaineDose(e.target.value === '' ? '' : parseFloat(e.target.value))} className="text-center" /><Button size="icon" variant="outline" onClick={() => setLidocaineDose(d => parseFloat(((Number(d) || 0) + 0.25).toFixed(2)))}><Plus className="h-4 w-4"/></Button></div>
            <Button onClick={handleConfirm} disabled={!lidocaineDose || lidocaineDose <= 0} className="w-full">Confirmar Dosis</Button>
        </div></>
    );

    if (medication === 'other') return (
        <><AlertDialogHeader><AlertDialogTitle>Administrar Otro Medicamento</AlertDialogTitle></AlertDialogHeader>
        <div className="space-y-3">
            <Label htmlFor="other-name">Nombre del Medicamento</Label><Input id="other-name" value={otherName} onChange={e => setOtherName(e.target.value)} placeholder="Ej: Atropina" />
            <Label htmlFor="other-dose">Dosis y Unidad</Label><Input id="other-dose" value={otherDose} onChange={e => setOtherDose(e.target.value)} placeholder="Ej: 1 mg" />
            <Button onClick={handleConfirm} disabled={!otherName.trim() || !otherDose.trim()} className="w-full">Confirmar Dosis</Button>
        </div></>
    );

    return (
        <><AlertDialogHeader><AlertDialogTitle>Seleccionar Medicamento</AlertDialogTitle></AlertDialogHeader>
        <div className="space-y-2">
            <Button className="w-full justify-start" variant="outline" onClick={() => setMedication('amiodarone')}>Amiodarona</Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => setMedication('lidocaine')}>Lidocaína</Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => setMedication('other')}>Otro...</Button>
        </div></>
    );
};

const AirwayModal = ({ onConfirm }: { onConfirm: (details: { device: string, otherDevice?: string, size?: number, attempts?: number }) => void }) => {
    const [deviceType, setDeviceType] = useState<string | null>(null);
    const [otherDeviceText, setOtherDeviceText] = useState('');
    const [size, setSize] = useState<number | ''>(8.0);
    const [attempts, setAttempts] = useState<number | ''>(1);

    const handleConfirm = () => {
        if (!deviceType) return;
        onConfirm({
            device: deviceType,
            otherDevice: deviceType === 'Otro' ? otherDeviceText : undefined,
            size: Number(size) || undefined,
            attempts: Number(attempts) || undefined,
        });
    };

    return (<>
        <AlertDialogHeader><AlertDialogTitle>Instalar Dispositivo de Vía Aérea</AlertDialogTitle></AlertDialogHeader>
        <div className="space-y-4">
            <RadioGroup onValueChange={setDeviceType} value={deviceType || undefined} className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2"><RadioGroupItem value="TET" id="tet" /><Label htmlFor="tet">TET</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="TQT" id="tqt" /><Label htmlFor="tqt">TQT</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="Máscara Laríngea" id="laryngeal-mask" /><Label htmlFor="laryngeal-mask">Máscara Laríngea</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="Otro" id="other-airway" /><Label htmlFor="other-airway">Otro</Label></div>
            </RadioGroup>
            {deviceType === 'Otro' && (
                <Input value={otherDeviceText} onChange={e => setOtherDeviceText(e.target.value)} placeholder="Especifique el dispositivo..." />
            )}
            <Separator/>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="device-size">Calibre / Tamaño</Label>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => setSize(s => parseFloat(((Number(s) || 0) - 0.5).toFixed(1)))}><Minus className="h-4 w-4"/></Button>
                        <Input id="device-size" type="number" step="0.5" value={size} onChange={e => setSize(e.target.value === '' ? '' : parseFloat(e.target.value))} className="text-center w-20" placeholder="8.0" />
                        <Button size="icon" variant="outline" onClick={() => setSize(s => parseFloat(((Number(s) || 0) + 0.5).toFixed(1)))}><Plus className="h-4 w-4"/></Button>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="device-attempts">Nº de Intentos</Label>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => setAttempts(a => Math.max(1, (Number(a) || 1) - 1))}><Minus className="h-4 w-4"/></Button>
                        <Input id="device-attempts" type="number" min="1" value={attempts} onChange={e => setAttempts(e.target.value === '' ? '' : parseInt(e.target.value))} className="text-center w-20" placeholder="1" />
                        <Button size="icon" variant="outline" onClick={() => setAttempts(a => (Number(a) || 0) + 1)}><Plus className="h-4 w-4"/></Button>
                    </div>
                </div>
            </div>
            <Button onClick={handleConfirm} disabled={!deviceType} className="w-full">Confirmar Instalación</Button>
        </div>
    </>);
};

const AccessModal = ({ onConfirm }: { onConfirm: (details: { type: string, gauge?: number, site?: string, attempts?: number }) => void }) => {
    const [type, setType] = useState<'IV' | 'IO' | null>(null);
    const [gauge, setGauge] = useState<number | ''>(18);
    const [side, setSide] = useState<'Derecha' | 'Izquierda' | null>(null);
    const [limb, setLimb] = useState<'Superior' | 'Inferior' | null>(null);
    const [customLocation, setCustomLocation] = useState('');
    const [attempts, setAttempts] = useState<number | ''>('');

    const handleConfirm = () => {
        if (!type) {
            toast({ title: "Tipo de Acceso Requerido", description: "Debe seleccionar IV o IO.", variant: "destructive" });
            return;
        }
        let siteDescription = "";
        if (limb) siteDescription += `Extremidad ${limb} `;
        if (side) siteDescription += `${side} `;
        if (customLocation) siteDescription += `(${customLocation}) `;
        
        onConfirm({ type, gauge: Number(gauge) || undefined, site: siteDescription.trim() || undefined, attempts: Number(attempts) || undefined });
    }
    
    return (
        <>
            <AlertDialogHeader><AlertDialogTitle>Registrar Acceso Vascular</AlertDialogTitle></AlertDialogHeader>
            <div className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RadioGroup onValueChange={(v) => setType(v as 'IV' | 'IO')} value={type || undefined}>
                        <Label>Tipo de Acceso</Label>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="IV" id="iv" /><Label htmlFor="iv">Intravenoso (IV)</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="IO" id="io" /><Label htmlFor="io">Intraóseo (IO)</Label></div>
                    </RadioGroup>
                     <div className="space-y-1">
                        <Label htmlFor="gauge-input">Calibre (G)</Label>
                         <div className="flex items-center gap-1">
                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setGauge(g => (Number(g) || 24) + 1)}><Minus className="h-4 w-4"/></Button>
                            <Input id="gauge-input" type="number" value={gauge} onChange={e => setGauge(e.target.value === '' ? '' : parseInt(e.target.value))} className="text-center w-14 h-8" placeholder="18" />
                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setGauge(g => Math.max(14, (Number(g) || 14) - 1))}><Plus className="h-4 w-4"/></Button>
                        </div>
                    </div>
                </div>

                <Separator/>
                <p className="text-sm font-medium text-muted-foreground">Sitio de Inserción (Opcional)</p>
                <div className="grid grid-cols-2 gap-4">
                     <RadioGroup onValueChange={(v) => setLimb(v as 'Superior' | 'Inferior')} value={limb || undefined}>
                        <Label>Extremidad</Label>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Superior" id="sup" /><Label htmlFor="sup">Superior</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Inferior" id="inf" /><Label htmlFor="inf">Inferior</Label></div>
                     </RadioGroup>
                     <RadioGroup onValueChange={(v) => setSide(v as 'Derecha' | 'Izquierda')} value={side || undefined}>
                        <Label>Lado</Label>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Derecha" id="der" /><Label htmlFor="der">Derecho</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Izquierda" id="izq" /><Label htmlFor="izq">Izquierdo</Label></div>
                     </RadioGroup>
                </div>
                 <Input value={customLocation} onChange={e => setCustomLocation(e.target.value)} placeholder="Ubicación específica (ej: Fosa antecubital)"/>
                <div className="space-y-2">
                    <Label htmlFor="attempts-input">Número de Intentos (Opcional)</Label>
                    <Input id="attempts-input" type="number" min="1" value={attempts} onChange={e => setAttempts(e.target.value === '' ? '' : parseInt(e.target.value))} placeholder="Ej: 1" />
                </div>
                <Button onClick={handleConfirm} className="w-full">Registrar Acceso</Button>
            </div>
        </>
    );
};

const EpinephrineModal = ({ onConfirm }: { onConfirm: (dose: string) => void }) => {
    const [dose, setDose] = useState('1');
    return (
        <>
            <AlertDialogHeader><AlertDialogTitle>Confirmar Administración de Epinefrina</AlertDialogTitle></AlertDialogHeader>
            <div className="space-y-3">
                <Label htmlFor="epi-dose">Dosis</Label>
                <div className="flex items-center gap-2">
                    <Input id="epi-dose" value={dose} onChange={e => setDose(e.target.value)} className="text-center" placeholder="1" />
                    <span className="font-semibold">mg</span>
                </div>
            </div>
            <Button onClick={() => onConfirm(`${dose} mg`)} disabled={!dose.trim() || isNaN(parseFloat(dose))} className="w-full mt-3">Confirmar</Button>
        </>
    );
};

const CustomNoteModal = ({ onConfirm }: { onConfirm: (note: string) => void }) => {
    const [note, setNote] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const recognitionRef = useRef<ISpeechRecognition | null>(null);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setIsSupported(true);
            recognitionRef.current = new SpeechRecognition();
            const recognition = recognitionRef.current;
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'es-ES';

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setNote(prev => prev ? `${prev} ${finalTranscript}` : finalTranscript);
                }
            };
            
            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                setSpeechError(`Error de reconocimiento: ${event.error}`);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };
        } else {
            setIsSupported(false);
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setSpeechError(null);
            recognitionRef.current.start();
            setIsListening(true);
        }
    };
    
    return (
        <>
            <AlertDialogHeader><AlertDialogTitle>Agregar Nota Personalizada</AlertDialogTitle></AlertDialogHeader>
            <div className="space-y-3">
                <Textarea placeholder="Escriba su nota aquí o use el micrófono..." value={note} onChange={e => setNote(e.target.value)} rows={4}/>
                {isSupported && (
                    <Button type="button" variant="outline" onClick={toggleListening} className="w-full">
                        {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                        {isListening ? 'Detener Grabación' : 'Grabar por Voz'}
                    </Button>
                )}
                {speechError && <p className="text-xs text-destructive">{speechError}</p>}
                <Button onClick={() => onConfirm(note)} disabled={!note.trim()} className="w-full">Guardar Nota</Button>
            </div>
        </>
    );
};

const FinalizeButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="hidden" data-finalize-button="true"></button>
);


// Componente interno del temporizador y la lógica
const RCPTimer = ({ onReset }: { onReset: () => void }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isRcpStarted, setIsRcpStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // en ms
  const [cycles, setCycles] = useState(0);
  const [isCycleRunning, setIsCycleRunning] = useState(false);
  const [phaseTime, setPhaseTime] = useState(120000); // 2 minutes in ms
  
  const [eventsLog, setEventsLog] = useState<LogEvent[]>([]);
  const [activeModal, setActiveModal] = useState<'rhythm' | 'defib' | 'epi' | 'access' | 'airway' | 'meds' | 'customNote' | null>(null);

  const [defibrillations, setDefibrillations] = useState<DefibrillationEvent[]>([]);
  const [epinephrineDoses, setEpinephrineDoses] = useState<MedicationEvent[]>([]);
  const [lastEpiTime, setLastEpiTime] = useState<number | null>(null);
  const [timeSinceLastEpi, setTimeSinceLastEpi] = useState(0);
  
  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mainIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const epiTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const addLog = useCallback((type: LogEventType, description: string) => {
    setEventsLog(prev => [...prev, { id: Date.now(), time: Math.floor(elapsedTime / 1000), type, description }]);
  }, [elapsedTime]);

  // Main Timer & Epi Timer
  useEffect(() => {
    if (isRunning) {
      mainIntervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 10);
      }, 10);
      if (lastEpiTime !== null) {
          epiTimerRef.current = setInterval(() => {
              setTimeSinceLastEpi(Date.now() - lastEpiTime);
          }, 1000);
      }
    } else {
      if (mainIntervalRef.current) clearInterval(mainIntervalRef.current);
      if (epiTimerRef.current) clearInterval(epiTimerRef.current);
    }
    return () => {
      if (mainIntervalRef.current) clearInterval(mainIntervalRef.current);
      if (epiTimerRef.current) clearInterval(epiTimerRef.current);
    };
  }, [isRunning, lastEpiTime]);

  // Metronome
  useEffect(() => {
    if (isCycleRunning) {
      metronomeIntervalRef.current = setInterval(() => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (!audioContext) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      }, 545); // ~110 BPM
    } else {
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
    }
    return () => {
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
    };
  }, [isCycleRunning]);

  // Cycle Timer
  useEffect(() => {
    if (isCycleRunning) {
      cycleIntervalRef.current = setInterval(() => {
        setPhaseTime(prev => {
          const newTime = prev - 10;
          if (newTime <= 0) {
            setIsCycleRunning(false);
            if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
            addLog('STOP_CYCLE', `Ciclo ${cycles + 1} realizado (2:00).`);
            setCycles(c => c + 1);
            return 120000;
          }
          return newTime;
        });
      }, 10);
    } else {
       if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    }
    return () => {
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    };
  }, [isCycleRunning, addLog, cycles]);


  const startRcp = () => {
    if (!isRcpStarted) {
        setIsRunning(true);
        setIsRcpStarted(true);
        addLog('START_RCP', 'Inicio de maniobras de RCP.');
    }
  };

  const togglePause = () => {
    const nowRunning = !isRunning;
    setIsRunning(nowRunning);
    addLog(nowRunning ? 'RESUME_RCP' : 'PAUSE_RCP', nowRunning ? 'Reanudado' : 'Pausado');
  };

  const startCycle = () => {
    if (!isRcpStarted) startRcp();
    setPhaseTime(120000);
    setIsCycleRunning(true);
    addLog('START_CYCLE', `Inicio de ciclo de compresiones ${cycles + 1}.`);
  };
  
  const stopCycle = () => {
    setIsCycleRunning(false);
    addLog('STOP_CYCLE', `Ciclo ${cycles + 1} realizado.`);
    setCycles(c => c + 1);
  };
  
  const handleRhythmCheck = (rhythm: RhythmType, customText?: string) => {
    const description = rhythm === 'Otro' ? `Otro: ${customText}` : rhythm;
    addLog('RHYTHM_CHECK', `Ritmo comprobado: ${description}`);
    setActiveModal(null);
    toast({ title: "Ritmo Registrado", description: `Se ha registrado ${description}.` });
  };

   const handleDefibrillation = (joules: number) => {
    const newDefib = { count: defibrillations.length + 1, joules, time: Math.floor(elapsedTime / 1000) };
    setDefibrillations(prev => [...prev, newDefib]);
    addLog('DEFIBRILLATION', `Desfibrilación #${newDefib.count} administrada: ${joules}J.`);
    setActiveModal(null);
  };

  const handleEpinephrine = (dose: string) => {
    const newDose = { name: 'Epinefrina', dose, time: Math.floor(elapsedTime / 1000) };
    setEpinephrineDoses(prev => [...prev, newDose]);
    addLog('MEDICATION', `Administrada Epinefrina: ${dose}.`);
    setLastEpiTime(Date.now());
    setTimeSinceLastEpi(0);
    setActiveModal(null);
  };

  const handleMedication = (name: string, dose: string) => {
      addLog('MEDICATION', `Administrado ${name}: ${dose}.`);
      setActiveModal(null);
      toast({ title: "Medicamento Registrado" });
  };

  const handleAirway = (details: { device: string, otherDevice?: string, size?: number, attempts?: number }) => {
      let description = `Instalado dispositivo de vía aérea: ${details.device}`;
      if (details.device === 'Otro' && details.otherDevice) {
        description += ` (${details.otherDevice})`;
      }
      if (details.size) description += `, Calibre ${details.size}`;
      if (details.attempts) description += `, Intentos: ${details.attempts}`;
      addLog('AIRWAY_DEVICE', description);
      setActiveModal(null);
      toast({ title: "Vía Aérea Registrada" });
  };
  
  const handleAccess = (details: { type: string, gauge?: number, site?: string, attempts?: number }) => {
    let description = `Se instala acceso ${details.type}`;
    if (details.gauge) description += ` #${details.gauge}G`;
    if (details.site) description += ` en ${details.site}`;
    if (details.attempts) description += `. Intentos: ${details.attempts}`;
    addLog('IV_IO_ACCESS', description);
    setActiveModal(null);
  };

  const handleCustomNote = (note: string) => {
    if (note.trim()) {
        addLog('CUSTOM_NOTE', `Nota: ${note.trim()}`);
    }
    setActiveModal(null);
  };
  
  const formatTime = (ms: number, showMs = false) => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 100);

    const parts = [];
    if (hours > 0) parts.push(hours.toString().padStart(2, '0'));
    parts.push(minutes.toString().padStart(2, '0'));
    parts.push(seconds.toString().padStart(2, '0'));
    
    let timeStr = parts.join(':');
    if (showMs) timeStr += `.${milliseconds}`;
    return timeStr;
  };

  const getRhythmAbbreviation = (description: string): string => {
      if (description.includes('Fibrilación Ventricular')) return 'FV';
      if (description.includes('Taquicardia Ventricular Sin Pulso')) return 'TVSP';
      if (description.includes('Actividad Eléctrica Sin Pulso')) return 'AESP';
      if (description.includes('Asistolia')) return 'Asist.';
      if (description.includes('Otro:')) return description.replace('Ritmo comprobado: Otro:', '').trim();
      return 'N/A';
  };

  const rhythmCheckEvents = eventsLog.filter(e => e.type === 'RHYTHM_CHECK');
  const initialRhythm = rhythmCheckEvents.length > 0 ? getRhythmAbbreviation(rhythmCheckEvents[0].description) : '---';
  const currentRhythm = rhythmCheckEvents.length > 0 ? getRhythmAbbreviation(rhythmCheckEvents[rhythmCheckEvents.length - 1].description) : '---';

  const onFinalize = useCallback(() => {
    const finalLog = [...eventsLog, { id: Date.now(), time: Math.floor(elapsedTime / 1000), type: 'FINISH_RCP', description: 'Registro Finalizado.' }];
    setIsRunning(false);
    setIsCycleRunning(false);
    addLog('FINISH_RCP', 'Registro Finalizado.');

    let logContent = `Registro de Maniobras de RCP\n`;
    logContent += `Fecha y Hora de Inicio: ${new Date(finalLog[0].id).toLocaleString('es-CL', { timeZone: 'America/Santiago' })}\n`;
    logContent += '------------------------------------------\n\n';
    finalLog.forEach(event => {
        const timestamp = new Date(event.id).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const elapsedTimeFormatted = formatTime(event.time * 1000);
        logContent += `[${timestamp}] - [T+ ${elapsedTimeFormatted}] ${event.description}\n`;
    });

    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rcp_log_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Registro Exportado", description: "El registro de RCP se ha descargado como archivo de texto." });
  }, [addLog, elapsedTime, eventsLog]);
  
  const renderModalContent = () => {
    switch (activeModal) {
      case 'rhythm': return <RhythmModal onSelect={handleRhythmCheck} />;
      case 'defib': return <DefibrillationModal onConfirm={handleDefibrillation} />;
      case 'epi': return <EpinephrineModal onConfirm={handleEpinephrine} />;
      case 'access': return <AccessModal onConfirm={handleAccess} />;
      case 'airway': return <AirwayModal onConfirm={handleAirway} />;
      case 'meds': return <MedicationModal onConfirm={handleMedication} />;
      case 'customNote': return <CustomNoteModal onConfirm={handleCustomNote} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-4" data-rcp-timer-container>
      <div className="text-foreground grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-base font-medium flex items-center justify-center text-muted-foreground"><Timer className="mr-2 h-4 w-4"/>Tiempo Total</CardTitle></CardHeader>
            <CardContent className="flex flex-col justify-center items-center gap-2">
                {!isRcpStarted ? (
                    <Button className="w-full h-16 text-lg bg-primary hover:bg-primary/90 text-primary-foreground" onClick={startRcp}><Play className="mr-2 h-5 w-5"/> Iniciar Registro</Button>
                ) : (
                    <Button variant={isRunning ? 'secondary' : 'default'} className="w-full h-16 text-lg" onClick={togglePause}>
                        {isRunning ? <><Pause className="mr-2 h-5 w-5"/> Pausar</> : <><Play className="mr-2 h-5 w-5"/>Reanudar</>}
                    </Button>
                )}
                <div className="text-4xl font-bold text-primary mt-2 flex items-center justify-center min-h-[48px]">{formatTime(elapsedTime)}</div>
            </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base font-medium flex items-center justify-center text-muted-foreground"><RefreshCw className="mr-2 h-4 w-4"/>Compresiones</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-2">
              {!isCycleRunning ? (
                   <Button onClick={startCycle} className="w-full h-16 text-center whitespace-normal leading-tight text-lg bg-primary hover:bg-primary/90 text-primary-foreground">Iniciar Compresiones</Button>
              ) : (
                  <div className="flex flex-col gap-2 w-full items-center">
                       <Button onClick={stopCycle} variant="destructive" className="w-full h-16 text-base"><StopCircle className="mr-2 h-5 w-5"/> Detener Compresiones</Button>
                       <div className="text-4xl font-bold text-center mt-2">{formatTime(phaseTime)}</div>
                      <Progress value={( (120000 - phaseTime) / 120000) * 100} />
                  </div>
              )}
              <p className="text-sm text-muted-foreground mt-2">Ciclos realizados: <span className="font-bold text-foreground">{cycles}</span></p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-base font-medium flex items-center justify-center text-muted-foreground"><HeartPulse className="mr-2 h-4 w-4"/>Ritmo</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-2">
                <Button onClick={() => setActiveModal('rhythm')} className="w-full h-16 mb-3 text-lg bg-primary hover:bg-primary/90 text-primary-foreground">Comprobar Ritmo</Button>
                <div className="flex justify-between text-sm w-full">
                    <div><p className="text-muted-foreground">Inicial:</p><p className="font-bold text-lg">{initialRhythm}</p></div>
                    <div className="text-right"><p className="text-muted-foreground">Actual:</p><p className="font-bold text-lg text-primary">{currentRhythm}</p></div>
                </div>
            </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto py-3 flex-col bg-card shadow-sm" onClick={() => setActiveModal('defib')}>
                <div className="flex items-center text-lg font-semibold"><Zap className="mr-2 h-5 w-5 text-yellow-500"/>Desfibrilar</div>
                <span className="text-xs text-muted-foreground">Descargas: {defibrillations.length}</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex-col bg-card shadow-sm" onClick={() => setActiveModal('epi')}>
                <div className="flex items-center text-lg font-semibold"><Syringe className="mr-2 h-5 w-5 text-blue-500"/>Epinefrina</div>
                <span className="text-xs text-muted-foreground">
                    Dosis: {epinephrineDoses.length} | Última: {lastEpiTime ? formatTime(timeSinceLastEpi) : 'N/A'}
                </span>
            </Button>
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-3 text-lg bg-card shadow-sm" onClick={() => setActiveModal('access')}>
                <Syringe className="mr-2 h-4 w-4" /> Acceso IV/IO
            </Button>
            <Button variant="outline" className="h-auto py-3 text-lg bg-card shadow-sm" onClick={() => setActiveModal('airway')}>
                <Airplay className="mr-2 h-4 w-4" /> Vía Aérea
            </Button>
            <Button variant="outline" className="h-auto py-3 text-lg bg-card shadow-sm" onClick={() => setActiveModal('meds')}>
                <Pill className="mr-2 h-4 w-4" /> Medicamentos
            </Button>
       </div>

       <Button variant="outline" className="h-auto py-3 text-lg w-full bg-card shadow-sm" onClick={() => setActiveModal('customNote')}>
            <NoteIcon className="mr-2 h-4 w-4" /> Agregar Nota Personalizada
       </Button>

        <div className="border rounded-lg p-2 mt-2">
            <h4 className="font-medium text-sm mb-2">Registro de Eventos</h4>
            <ScrollArea className="h-40 text-xs">
                <div className="space-y-1 pr-2">
                    {eventsLog.map((event) => (
                        <p key={event.id} className="font-mono text-muted-foreground">
                            [{new Date(event.id).toLocaleTimeString('es-CL')}] - [T+{formatTime(event.time * 1000)}] <span className="text-foreground">{event.description}</span>
                        </p>
                    ))}
                </div>
            </ScrollArea>
        </div>

        <FinalizeButton onClick={onFinalize} />

       <AlertDialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
            <AlertDialogContent>
                {renderModalContent()}
                 <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel onClick={() => setActiveModal(null)}>Cancelar</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
       </AlertDialog>
    </div>
  );
};

export default function RcpLogDialog({ isOpen, onOpenChange }: RcpLogDialogProps) {
  const [timerKey, setTimerKey] = useState(Date.now());

  const handleReset = () => {
    setTimerKey(Date.now());
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 sm:p-6 pb-2">
          <DialogTitle className="text-xl sm:text-2xl flex items-center">
            <HeartPulse className="mr-2 h-6 w-6 text-red-500" />
            Registro de Maniobras de RCP
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-grow p-4 sm:p-6 pt-2">
          <RCPTimer key={timerKey} onReset={handleReset} />
        </ScrollArea>

        <DialogFooter className="p-4 sm:p-6 pt-4 border-t flex flex-col sm:flex-row gap-2 justify-end">
            <Button variant="destructive" className="w-full sm:w-auto" onClick={() => {
              const rcpTimerContainer = document.querySelector('[data-rcp-timer-container]');
              if (rcpTimerContainer) {
                 const finalizeButton = rcpTimerContainer.querySelector('button.hidden[data-finalize-button="true"]');
                 if(finalizeButton) (finalizeButton as HTMLElement).click();
              }
            }} disabled={!document.querySelector('.text-4xl.font-bold.text-primary')?.textContent?.includes(':')}>
              Finalizar Maniobras y Exportar
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleReset}>Resetear Registro Completo</Button>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
                Cerrar
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    

    

