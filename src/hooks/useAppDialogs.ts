"use client";

import { useState } from "react";
import type { MedicationReminder } from "@/lib/types";

export function useAppDialogs() {
  // Estados de diálogos principales
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHolidayName, setSelectedHolidayName] = useState<string | null>(null);
  const [selectedInternationalDayName, setSelectedInternationalDayName] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Estados de diálogos de configuración
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isBackgroundSettingsOpen, setIsBackgroundSettingsOpen] = useState(false);
  const [isAvatarSettingsOpen, setIsAvatarSettingsOpen] = useState(false);
  const [isAlarmSettingsOpen, setIsAlarmSettingsOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [isReferencesOpen, setIsReferencesOpen] = useState(false);

  // Estados de diálogos de funcionalidad
  const [isDilucionesOpen, setIsDilucionesOpen] = useState(false);
  const [isLMCompatibilityDialogOpen, setIsLMCompatibilityDialogOpen] = useState(false);
  const [isCalculatorsDialogOpen, setIsCalculatorsDialogOpen] = useState(false);
  const [isEscalasDialogOpen, setIsEscalasDialogOpen] = useState(false);
  const [isMisPacientesDialogOpen, setIsMisPacientesDialogOpen] = useState(false);
  const [isMisNotasDialogOpen, setIsMisNotasDialogOpen] = useState(false);
  const [isSaludInfantilOpen, setIsSaludInfantilOpen] = useState(false);
  const [isRcpLogOpen, setIsRcpLogOpen] = useState(false);
  const [isTriviaOpen, setIsTriviaOpen] = useState(false);

  // Estados especiales
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(false);
  const [isMedicationAlarmOpen, setIsMedicationAlarmOpen] = useState(false);
  const [medicationToAnnounce, setMedicationToAnnounce] = useState<MedicationReminder | null>(null);
  const [timeToAnnounce, setTimeToAnnounce] = useState<string | null>(null);

  // Estados de loading/error
  const [isLoadingWelcomeEvents, setIsLoadingWelcomeEvents] = useState(false);

  // Handlers para diálogos principales
  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setSelectedHolidayName(null);
      setSelectedInternationalDayName(null);
    }
  };

  const openDialog = (dialogType: string) => {
    switch (dialogType) {
      case 'profile':
        setIsProfileSettingsOpen(true);
        break;
      case 'background':
        setIsBackgroundSettingsOpen(true);
        break;
      case 'avatar':
        setIsAvatarSettingsOpen(true);
        break;
      case 'alarm':
        setIsAlarmSettingsOpen(true);
        break;
      case 'contact':
        setIsContactDialogOpen(true);
        break;
      case 'help':
        setIsHelpDialogOpen(true);
        break;
      case 'references':
        setIsReferencesOpen(true);
        break;
      case 'diluciones':
        setIsDilucionesOpen(true);
        break;
      case 'lmCompatibility':
        setIsLMCompatibilityDialogOpen(true);
        break;
      case 'calculators':
        setIsCalculatorsDialogOpen(true);
        break;
      case 'escalas':
        setIsEscalasDialogOpen(true);
        break;
      case 'pacientes':
        setIsMisPacientesDialogOpen(true);
        break;
      case 'notas':
        setIsMisNotasDialogOpen(true);
        break;
      case 'saludInfantil':
        setIsSaludInfantilOpen(true);
        break;
      case 'rcpLog':
        setIsRcpLogOpen(true);
        break;
      case 'trivia':
        setIsTriviaOpen(true);
        break;
      case 'welcome':
        setIsWelcomeDialogOpen(true);
        break;
      case 'medicationAlarm':
        setIsMedicationAlarmOpen(true);
        break;
    }
  };

  const closeDialog = (dialogType: string) => {
    switch (dialogType) {
      case 'profile':
        setIsProfileSettingsOpen(false);
        break;
      case 'background':
        setIsBackgroundSettingsOpen(false);
        break;
      case 'avatar':
        setIsAvatarSettingsOpen(false);
        break;
      case 'alarm':
        setIsAlarmSettingsOpen(false);
        break;
      case 'contact':
        setIsContactDialogOpen(false);
        break;
      case 'help':
        setIsHelpDialogOpen(false);
        break;
      case 'references':
        setIsReferencesOpen(false);
        break;
      case 'diluciones':
        setIsDilucionesOpen(false);
        break;
      case 'lmCompatibility':
        setIsLMCompatibilityDialogOpen(false);
        break;
      case 'calculators':
        setIsCalculatorsDialogOpen(false);
        break;
      case 'escalas':
        setIsEscalasDialogOpen(false);
        break;
      case 'pacientes':
        setIsMisPacientesDialogOpen(false);
        break;
      case 'notas':
        setIsMisNotasDialogOpen(false);
        break;
      case 'saludInfantil':
        setIsSaludInfantilOpen(false);
        break;
      case 'rcpLog':
        setIsRcpLogOpen(false);
        break;
      case 'trivia':
        setIsTriviaOpen(false);
        break;
      case 'welcome':
        setIsWelcomeDialogOpen(false);
        break;
      case 'medicationAlarm':
        setIsMedicationAlarmOpen(false);
        break;
    }
  };

  const setMedicationAlarm = (medication: MedicationReminder, time: string) => {
    setMedicationToAnnounce(medication);
    setTimeToAnnounce(time);
    setIsMedicationAlarmOpen(true);
  };

  const clearMedicationAlarm = () => {
    setMedicationToAnnounce(null);
    setTimeToAnnounce(null);
    setIsMedicationAlarmOpen(false);
  };

  return {
    // Estados de fecha/calendario
    selectedDate,
    selectedHolidayName,
    selectedInternationalDayName,
    isSheetOpen,
    setSelectedDate,
    setSelectedHolidayName,
    setSelectedInternationalDayName,
    handleSheetOpenChange,

    // Estados de diálogos de configuración
    isProfileSettingsOpen,
    isBackgroundSettingsOpen,
    isAvatarSettingsOpen,
    isAlarmSettingsOpen,
    isContactDialogOpen,
    isHelpDialogOpen,
    isReferencesOpen,
    setIsProfileSettingsOpen,
    setIsBackgroundSettingsOpen,
    setIsAvatarSettingsOpen,
    setIsAlarmSettingsOpen,
    setIsContactDialogOpen,
    setIsHelpDialogOpen,
    setIsReferencesOpen,

    // Estados de diálogos de funcionalidad
    isDilucionesOpen,
    isLMCompatibilityDialogOpen,
    isCalculatorsDialogOpen,
    isEscalasDialogOpen,
    isMisPacientesDialogOpen,
    isMisNotasDialogOpen,
    isSaludInfantilOpen,
    isRcpLogOpen,
    isTriviaOpen,
    setIsDilucionesOpen,
    setIsLMCompatibilityDialogOpen,
    setIsCalculatorsDialogOpen,
    setIsEscalasDialogOpen,
    setIsMisPacientesDialogOpen,
    setIsMisNotasDialogOpen,
    setIsSaludInfantilOpen,
    setIsRcpLogOpen,
    setIsTriviaOpen,

    // Estados especiales
    isWelcomeDialogOpen,
    isMedicationAlarmOpen,
    medicationToAnnounce,
    timeToAnnounce,
    isLoadingWelcomeEvents,
    setIsWelcomeDialogOpen,
    setIsMedicationAlarmOpen,
    setIsLoadingWelcomeEvents,

    // Handlers útiles
    openDialog,
    closeDialog,
    setMedicationAlarm,
    clearMedicationAlarm,
  };
}