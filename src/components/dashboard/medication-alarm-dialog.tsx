"use client";

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { MedicationReminder } from '@/lib/types';
import { Pill, Volume2, CheckCircle, Loader2 } from 'lucide-react';
import { textToSpeech } from '@/ai/flows/tts-flow';

interface MedicationAlarmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  medication: MedicationReminder;
  onMarkAsTaken: () => void;
  alarmSoundSrc: string; // Nueva prop para la fuente del sonido
}

export default function MedicationAlarmDialog({
  isOpen,
  onOpenChange,
  userName,
  medication,
  onMarkAsTaken,
  alarmSoundSrc,
}: MedicationAlarmDialogProps) {
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const alarmAudioRef = useRef<HTMLAudioElement>(null);
  const announcementAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioTriggeredRef = useRef(false);

  // Effect to generate TTS audio URL when dialog opens with a new medication
  useEffect(() => {
    if (isOpen && userName && medication && !audioUrl && !isLoadingAudio) {
      audioTriggeredRef.current = true;
      const generateAudio = async () => {
        setIsLoadingAudio(true);
        try {
          const speechText = `${userName}, no olvides tomarte el ${medication.name} ${medication.dose ? `, ${medication.dose}` : ''}.`;
          const generatedUrl = await textToSpeech(speechText);
          setAudioUrl(generatedUrl);
        } catch (error) {
          console.error("Failed to generate TTS audio:", error);
        } finally {
          setIsLoadingAudio(false);
        }
      };
      generateAudio();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userName, medication]);

  // Effect to handle audio playback logic
  useEffect(() => {
    const alarmAudio = alarmAudioRef.current;
    const announcementAudio = announcementAudioRef.current;
    let announcementTimeout: NodeJS.Timeout;

    if (isOpen && audioUrl && alarmAudio && announcementAudio) {
        const playAnnouncement = () => {
            announcementTimeout = setTimeout(() => {
                announcementAudio.play().catch(e => console.error("Error playing announcement:", e));
            }, 1200);
        };
        
        alarmAudio.addEventListener('ended', playAnnouncement);
        
        // Use a promise to handle play() to avoid interruption errors
        const playPromise = alarmAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.error("Error playing alarm sound:", e);
                // If alarm fails to play, try playing announcement directly
                playAnnouncement();
            });
        }
        
        return () => { // Cleanup
            clearTimeout(announcementTimeout);
            if (alarmAudio) alarmAudio.removeEventListener('ended', playAnnouncement);
        };
    }
  }, [isOpen, audioUrl]);

  // Effect to reset state when the dialog closes
  useEffect(() => {
    if (!isOpen) {
      setAudioUrl(null);
      setIsLoadingAudio(false);
      audioTriggeredRef.current = false;
      // Stop any playing audio
      if (alarmAudioRef.current) {
        alarmAudioRef.current.pause();
        alarmAudioRef.current.currentTime = 0;
      }
      if (announcementAudioRef.current) {
        announcementAudioRef.current.pause();
        announcementAudioRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Pill className="mr-2 h-6 w-6 text-primary" />
            ¡Hora de tu Medicamento!
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 text-center">
            <p className="text-lg">
                <span className="font-semibold">{userName}</span>, es hora de tomar:
            </p>
            <p className="text-2xl font-bold text-primary mt-2">{medication.name}</p>
            {medication.dose && <p className="text-muted-foreground">{medication.dose}</p>}
        </div>

        <div className="text-xs text-muted-foreground flex items-center justify-center">
             {isLoadingAudio ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Generando audio...
              </>
            ) : (
              <>
                <Volume2 className="mr-1 h-3 w-3" /> La alarma se ha reproducido.
              </>
            )}
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button onClick={onMarkAsTaken} className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-2 h-4 w-4" /> Marcar como Tomado
          </Button>
        </DialogFooter>

        {/* Hidden Audio Elements */}
        <audio ref={alarmAudioRef} src={alarmSoundSrc} preload="auto" />
        {audioUrl && <audio ref={announcementAudioRef} src={audioUrl} preload="auto" />}
      </DialogContent>
    </Dialog>
  );
}
