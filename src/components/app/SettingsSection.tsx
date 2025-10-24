// src/components/app/SettingsSection.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, LogOut } from "lucide-react";
import Link from "next/link";
import SettingsDropdown from "@/components/settings/settings-dropdown";

interface SettingsSectionProps {
  userEmail: string;
  logout: () => void;

  // Visibilidad de tarjetas
  showPendientesCard: boolean;
  onTogglePendientesVisibility: (value: boolean) => void;
  showRcpLogCard: boolean;
  onToggleRcpLogVisibility: (value: boolean) => void;
  showShoppingListCard: boolean;
  onToggleShoppingListVisibility: (value: boolean) => void;
  showFinanzasCard: boolean;
  onToggleFinanzasVisibility: (value: boolean) => void;
  showPastilleroCard: boolean;
  onTogglePastilleroVisibility: (value: boolean) => void;
  showCicloCard: boolean;
  onToggleCicloVisibility: (value: boolean) => void;
  showVademecumCard: boolean;
  onToggleVademecumVisibility: (value: boolean) => void;
  showLMCompatibilityCard: boolean;
  onToggleLMCompatibilityVisibility: (value: boolean) => void;
  showCalculatorsCard: boolean;
  onToggleCalculatorsVisibility: (value: boolean) => void;
  showEscalasCard: boolean;
  onToggleEscalasVisibility: (value: boolean) => void;
  showMisPacientesCard: boolean;
  onToggleMisPacientesVisibility: (value: boolean) => void;
  showMisNotasCard: boolean;
  onToggleMisNotasVisibility: (value: boolean) => void;
  showSaludInfantilCard: boolean;
  onToggleSaludInfantilVisibility: (value: boolean) => void;
  showTriviaCard: boolean;
  onToggleTriviaVisibility: (value: boolean) => void;
  showMisTurnosCard?: boolean; // ✅ NUEVO
  onToggleMisTurnosVisibility?: () => void; // ✅ NUEVO

  // Abrir diálogos de configuración
  onOpenProfileSettings: () => void;
  onOpenBackgroundSettings: () => void;
  onOpenAvatarSettings: () => void;
  onOpenAlarmSettings: () => void;
  onOpenContactDialog: () => void;
  onOpenReferencesDialog: () => void;
  onOpenHelpDialog?: () => void; // opcional
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  userEmail,
  logout,
  showPendientesCard,
  onTogglePendientesVisibility,
  showRcpLogCard,
  onToggleRcpLogVisibility,
  showShoppingListCard,
  onToggleShoppingListVisibility,
  showFinanzasCard,
  onToggleFinanzasVisibility,
  showPastilleroCard,
  onTogglePastilleroVisibility,
  showCicloCard,
  onToggleCicloVisibility,
  showVademecumCard,
  onToggleVademecumVisibility,
  showLMCompatibilityCard,
  onToggleLMCompatibilityVisibility,
  showCalculatorsCard,
  onToggleCalculatorsVisibility,
  showEscalasCard,
  onToggleEscalasVisibility,
  showMisPacientesCard,
  onToggleMisPacientesVisibility,
  showMisNotasCard,
  onToggleMisNotasVisibility,
  showSaludInfantilCard,
  onToggleSaludInfantilVisibility,
  showTriviaCard,
  onToggleTriviaVisibility,
  showMisTurnosCard, // ✅ NUEVO
  onToggleMisTurnosVisibility, // ✅ NUEVO
  onOpenProfileSettings,
  onOpenBackgroundSettings,
  onOpenAvatarSettings,
  onOpenAlarmSettings,
  onOpenContactDialog,
  onOpenReferencesDialog,
  onOpenHelpDialog,
}) => {
  return (
    <div className="w-full max-w-3xl mt-12 flex flex-col items-center gap-4">
      <p className="text-sm bg-background/80 dark:bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-md border">
        Sesión iniciada como: {userEmail}
      </p>

      <SettingsDropdown
        showPendientesCard={showPendientesCard}
        onTogglePendientesVisibility={onTogglePendientesVisibility}
        showRcpLogCard={showRcpLogCard}
        onToggleRcpLogVisibility={onToggleRcpLogVisibility}
        showShoppingListCard={showShoppingListCard}
        onToggleShoppingListVisibility={onToggleShoppingListVisibility}
        showFinanzasCard={showFinanzasCard}
        onToggleFinanzasVisibility={onToggleFinanzasVisibility}
        showPastilleroCard={showPastilleroCard}
        onTogglePastilleroVisibility={onTogglePastilleroVisibility}
        showCicloCard={showCicloCard}
        onToggleCicloVisibility={onToggleCicloVisibility}
        showVademecumCard={showVademecumCard}
        onToggleVademecumVisibility={onToggleVademecumVisibility}
        showLMCompatibilityCard={showLMCompatibilityCard}
        onToggleLMCompatibilityVisibility={onToggleLMCompatibilityVisibility}
        showCalculatorsCard={showCalculatorsCard}
        onToggleCalculatorsVisibility={onToggleCalculatorsVisibility}
        showEscalasCard={showEscalasCard}
        onToggleEscalasVisibility={onToggleEscalasVisibility}
        showMisPacientesCard={showMisPacientesCard}
        onToggleMisPacientesVisibility={onToggleMisPacientesVisibility}
        showMisNotasCard={showMisNotasCard}
        onToggleMisNotasVisibility={onToggleMisNotasVisibility}
        showSaludInfantilCard={showSaludInfantilCard}
        onToggleSaludInfantilVisibility={onToggleSaludInfantilVisibility}
        showTriviaCard={showTriviaCard}
        onToggleTriviaVisibility={onToggleTriviaVisibility}
        {...(showMisTurnosCard !== undefined && { showMisTurnosCard })} 
        {...(onToggleMisTurnosVisibility && { onToggleMisTurnosVisibility })}
        onOpenProfileSettings={onOpenProfileSettings}
        onOpenBackgroundSettings={onOpenBackgroundSettings}
        onOpenAvatarSettings={onOpenAvatarSettings}
        onOpenAlarmSettings={onOpenAlarmSettings}
        onOpenContactDialog={onOpenContactDialog}
        onOpenReferencesDialog={onOpenReferencesDialog}
      />

      {onOpenHelpDialog && (
        <Button variant="outline" onClick={onOpenHelpDialog}>
          <HelpCircle className="mr-2 h-4 w-4" />
          Ayuda
        </Button>
      )}

      <div className="flex gap-4">
        <Button variant="link" size="sm" asChild>
          <Link href="/privacy.html" target="_blank">
            Política de Privacidad
          </Link>
        </Button>
        <Button variant="link" size="sm" asChild>
          <Link href="/terms.html" target="_blank">
            Términos de Servicio
          </Link>
        </Button>
      </div>

      <Button variant="outline" onClick={logout}>
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesión
      </Button>
    </div>
  );
};

export default SettingsSection;