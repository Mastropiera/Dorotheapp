// src/components/app-content/DialogsSection.tsx
import React from "react";
import DailyPlanSheet from '@/components/color-plan/daily-plan-sheet';
import ProfileSettingsDialog from '@/components/settings/profile-settings-dialog';
import BackgroundSettingsDialog from '@/components/settings/background-settings-dialog';
import AvatarSettingsDialog from '@/components/settings/avatar-settings-dialog';
import AlarmSettingsDialog from '@/components/settings/alarm-settings-dialog';
import ContactDialog from '@/components/settings/contact-dialog';
import HelpDialog from '@/components/settings/help-dialog';
import ReferencesDialog from '@/components/settings/references-dialog';
import DilucionesDialog from '@/components/dashboard/diluciones-dialog';
import RcpLogDialog from '@/components/dashboard/rcp-log-dialog';
import LMCompatibilityDialog from '@/components/dashboard/lm-compatibility-dialog';
import CalculatorsDialog from '@/components/dashboard/calculadoras-dialog';
import EscalasDialog from '@/components/dashboard/escalas-dialog';
import SaludInfantilDialog from '@/components/dashboard/salud-infantil-dialog';
import TriviaDialog from '@/components/dashboard/trivia-dialog';
import MisPacientesDialog from '@/components/dashboard/mis-pacientes-dialog';
import MisNotasDialog from '@/components/dashboard/mis-notas-dialog';
import MedicationAlarmDialog from '@/components/dashboard/medication-alarm-dialog';
import WelcomeDialog from '@/components/dashboard/welcome-dialog';
import type { LocalEvent } from "@/lib/types/calendar";
import type { GoogleCalendarEvent } from "@/lib/types/google-calendar";
import type { MenstrualData } from "@/lib/types/cycles";
import type { VademecumEntry, MedicationReminder } from "@/lib/types/medications";
import type { Patient, PatientNote } from "@/lib/types/patients";
import type { MemoEntry } from "@/lib/types/memos";
import type { AlarmSound } from "@/lib/types/sounds";

// Valor por defecto del sonido de alarma
const defaultAlarmSound: AlarmSound = {
  id: "default-alarm",
  name: "Alarma por defecto",
  src: "/sounds/alarm.mp3",
};

export interface DialogsSectionProps {
  selectedDate?: Date;
  isSheetOpen: boolean;
  handleSheetOpenChange: (open: boolean) => void;
  selectedHolidayName?: string | null;
  selectedInternationalDayName?: string | null;
  googleCalendarEvents: GoogleCalendarEvent[];
  localEvents: LocalEvent[];
  isLoadingGoogleEvents: boolean;
  googleApiError: string | null;
  onAddCelebration: (title: string, date: Date) => void;
  onAddLocalEvent: (event: any) => void;
  onDeleteLocalEvent: (id: string) => void;
  menstrualData: MenstrualData;
  setMenstrualData: React.Dispatch<React.SetStateAction<MenstrualData>>;

  isProfileSettingsOpen: boolean;
  setIsProfileSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isBackgroundSettingsOpen: boolean;
  setIsBackgroundSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAvatarSettingsOpen: boolean;
  setIsAvatarSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAlarmSettingsOpen: boolean;
  setIsAlarmSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isContactDialogOpen: boolean;
  setIsContactDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isHelpDialogOpen: boolean;
  setIsHelpDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isReferencesOpen: boolean;
  setIsReferencesOpen: React.Dispatch<React.SetStateAction<boolean>>;

  isDilucionesOpen: boolean;
  setIsDilucionesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  vademecumEntries: VademecumEntry[];
  onAddVademecumEntry: (entry: Omit<VademecumEntry, "id">) => void;
  onUpdateVademecumEntry: (entry: VademecumEntry) => void;
  onDeleteVademecumEntry: (id: string) => void;

  isRcpLogOpen: boolean;
  setIsRcpLogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLMCompatibilityDialogOpen: boolean;
  setIsLMCompatibilityDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCalculatorsDialogOpen: boolean;
  setIsCalculatorsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  favoriteCalculators: string[];
  onToggleFavoriteCalculator: (calculatorName: string) => void;
  isEscalasDialogOpen: boolean;
  setIsEscalasDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  favoriteScales: string[];
  onToggleFavoriteScale: (scaleName: string) => void;
  isSaludInfantilOpen: boolean;
  setIsSaludInfantilOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTriviaOpen: boolean;
  setIsTriviaOpen: React.Dispatch<React.SetStateAction<boolean>>;

  isMisPacientesDialogOpen: boolean;
  setIsMisPacientesDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  patients: Patient[];
  onAddPatient: (patientData: Omit<Patient, "id" | "createdAt">) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: React.Dispatch<React.SetStateAction<string | null>>;
  patientNotes: Record<string, PatientNote[]>;
  onAddPatientNote: (patientId: string, noteContent: string, vitalSigns?: PatientNote["vitalSigns"]) => void;
  onDeletePatient: (patientId: string) => void;
  onDeletePatientNote: (patientId: string, noteId: string) => void;

  isMisNotasDialogOpen: boolean;
  setIsMisNotasDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  memos: MemoEntry[];
  onAddMemo: (memoData: Omit<MemoEntry, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateMemo: (memo: MemoEntry) => void;
  onDeleteMemo: (memoId: string) => void;

  medicationToAnnounce?: MedicationReminder | null;
  timeToAnnounce?: string | null;
  isMedicationAlarmOpen: boolean;
  setIsMedicationAlarmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userName: string;
  currentAlarmSound?: { src: string };
  isInitialDataLoadComplete: boolean;
  isWelcomeDialogOpen: boolean;
  setIsWelcomeDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  todaysMedicationReminders: MedicationReminder[];
  isLoadingWelcomeEvents: boolean;

  selectedBackgroundUrl?: string | null;
  selectedAvatarUrl?: string;
  wakeUpTimes?: string[];
  alarmSoundId?: string;
  onSaveUserName?: (name: string) => void;
  onSetBackgroundUrl?: (url: string | null) => void;
  onSetAvatarUrl?: (url: string) => void;
  onSaveAlarmTimes?: (times: string[]) => void;
  onSaveSound?: (soundId: string) => void;
}

export const DialogsSection: React.FC<DialogsSectionProps> = (props) => {
  const { 
    selectedDate, 
    isSheetOpen, 
    handleSheetOpenChange, 
    selectedHolidayName, 
    selectedInternationalDayName, 
    googleCalendarEvents, 
    localEvents, 
    isLoadingGoogleEvents, 
    googleApiError, 
    onAddCelebration, 
    onAddLocalEvent, 
    onDeleteLocalEvent, 
    menstrualData, 
    setMenstrualData,
    ...rest 
  } = props;

  // Merge para garantizar siempre un AlarmSound válido
  const alarmSound: AlarmSound = rest.currentAlarmSound
    ? { ...defaultAlarmSound, ...rest.currentAlarmSound }
    : defaultAlarmSound;

  return (
    <>
      {selectedDate && (
        <DailyPlanSheet
          isOpen={isSheetOpen}
          onOpenChange={handleSheetOpenChange}
          selectedDate={selectedDate}
          holidayName={selectedHolidayName}
          internationalDayName={selectedInternationalDayName}
          googleCalendarEvents={googleCalendarEvents}
          localEvents={localEvents}
          isLoadingGoogleEvents={isLoadingGoogleEvents}
          googleApiError={googleApiError}
          onAddCelebration={onAddCelebration}
          onAddLocalEvent={onAddLocalEvent}
          onDeleteLocalEvent={onDeleteLocalEvent}
          menstrualData={menstrualData}
          setMenstrualData={setMenstrualData}
        />
      )}

      <ProfileSettingsDialog
        isOpen={rest.isProfileSettingsOpen}
        onOpenChange={rest.setIsProfileSettingsOpen}
        currentUserName={rest.userName}
        onSaveUserName={rest.onSaveUserName || (() => {})}
      />

      <BackgroundSettingsDialog
        isOpen={rest.isBackgroundSettingsOpen}
        onOpenChange={rest.setIsBackgroundSettingsOpen}
        currentBackgroundUrl={rest.selectedBackgroundUrl}
        onSetBackgroundUrl={rest.onSetBackgroundUrl || ((_: string | null) => {})}
      />

      <AvatarSettingsDialog
        isOpen={rest.isAvatarSettingsOpen}
        onOpenChange={rest.setIsAvatarSettingsOpen}
        currentAvatarUrl={rest.selectedAvatarUrl}
        onSetAvatarUrl={rest.onSetAvatarUrl || (() => {})}
      />

      <AlarmSettingsDialog
        isOpen={rest.isAlarmSettingsOpen}
        onOpenChange={rest.setIsAlarmSettingsOpen}
        currentAlarmTimes={rest.wakeUpTimes || []}
        onSaveAlarmTimes={rest.onSaveAlarmTimes || (() => {})}
        currentSoundId={rest.alarmSoundId ?? ""} 
        onSaveSound={rest.onSaveSound || (() => {})}
      />

      <ContactDialog
        isOpen={rest.isContactDialogOpen}
        onOpenChange={rest.setIsContactDialogOpen}
      />

      <HelpDialog
        isOpen={rest.isHelpDialogOpen}
        onOpenChange={rest.setIsHelpDialogOpen}
      />

      <ReferencesDialog
        isOpen={rest.isReferencesOpen}
        onOpenChange={rest.setIsReferencesOpen}
      />

      <DilucionesDialog
        isOpen={rest.isDilucionesOpen}
        onOpenChange={rest.setIsDilucionesOpen}
        userVademecumEntries={rest.vademecumEntries}
        onAddEntry={rest.onAddVademecumEntry}
        onUpdateEntry={rest.onUpdateVademecumEntry}
        onDeleteEntry={rest.onDeleteVademecumEntry}
      />

      <RcpLogDialog
        isOpen={rest.isRcpLogOpen}
        onOpenChange={rest.setIsRcpLogOpen}
      />

      <LMCompatibilityDialog
        isOpen={rest.isLMCompatibilityDialogOpen}
        onOpenChange={rest.setIsLMCompatibilityDialogOpen}
      />

      <CalculatorsDialog
        isOpen={rest.isCalculatorsDialogOpen}
        onOpenChange={rest.setIsCalculatorsDialogOpen}
        favoriteCalculators={rest.favoriteCalculators}
        onToggleFavorite={rest.onToggleFavoriteCalculator}
      />

      <EscalasDialog
        isOpen={rest.isEscalasDialogOpen}
        onOpenChange={rest.setIsEscalasDialogOpen}
        favoriteScales={rest.favoriteScales}
        onToggleFavorite={rest.onToggleFavoriteScale}
      />

      <SaludInfantilDialog
        isOpen={rest.isSaludInfantilOpen}
        onOpenChange={rest.setIsSaludInfantilOpen}
      />

      <TriviaDialog
        isOpen={rest.isTriviaOpen}
        onOpenChange={rest.setIsTriviaOpen}
        userName={rest.userName}
      />

      <MisPacientesDialog
        isOpen={rest.isMisPacientesDialogOpen}
        onOpenChange={rest.setIsMisPacientesDialogOpen}
        patients={rest.patients}
        onAddPatient={rest.onAddPatient}
        selectedPatientId={rest.selectedPatientId}
        onSelectPatient={rest.setSelectedPatientId}
        patientNotes={rest.patientNotes}
        onAddPatientNote={rest.onAddPatientNote}
        onDeletePatient={rest.onDeletePatient}
        onDeletePatientNote={rest.onDeletePatientNote}
      />

      <MisNotasDialog
        isOpen={rest.isMisNotasDialogOpen}
        onOpenChange={rest.setIsMisNotasDialogOpen}
        memos={rest.memos}
        onAddMemo={rest.onAddMemo}
        onUpdateMemo={rest.onUpdateMemo}
        onDeleteMemo={rest.onDeleteMemo}
      />

      {rest.medicationToAnnounce && rest.timeToAnnounce && (
        <MedicationAlarmDialog
          isOpen={rest.isMedicationAlarmOpen}
          onOpenChange={rest.setIsMedicationAlarmOpen}
          userName={rest.userName}
          medication={rest.medicationToAnnounce}
          onMarkAsTaken={() => {}}
          alarmSoundSrc={rest.currentAlarmSound?.src ?? defaultAlarmSound.src} 
        />
      )}

      {rest.isWelcomeDialogOpen && (
        <WelcomeDialog
          isOpen={rest.isWelcomeDialogOpen}
          onOpenChange={rest.setIsWelcomeDialogOpen}
          userName={rest.userName}
          todaysMedications={rest.todaysMedicationReminders}
          isLoadingEvents={rest.isLoadingWelcomeEvents}
          todaysEvents={[]}
          tomorrowsEvents={[]}
          alarmSound={alarmSound}  // ✅ Siempre pasa un AlarmSound válido
        />
      )}
    </>
  );
};
