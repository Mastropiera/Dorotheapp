"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings, UserCircle, Image as ImageIcon, MessageCircle, Calculator, ClipboardList, Users2, HeartPulse, NotebookText, TrendingUp, AlarmClock, BookCopy, Syringe, BrainCircuit, Baby, ListChecks, Clock } from "lucide-react"; // ✅ Agregado Clock
import { cn } from "@/lib/utils";

interface SettingsDropdownProps {
  showPendientesCard: boolean;
  onTogglePendientesVisibility: (visible: boolean) => void;
  showRcpLogCard: boolean;
  onToggleRcpLogVisibility: (visible: boolean) => void;
  showShoppingListCard: boolean;
  onToggleShoppingListVisibility: (visible: boolean) => void;
  showFinanzasCard: boolean;
  onToggleFinanzasVisibility: (visible: boolean) => void;
  showPastilleroCard: boolean;
  onTogglePastilleroVisibility: (visible: boolean) => void;
  showCicloCard: boolean;
  onToggleCicloVisibility: (visible: boolean) => void;
  showVademecumCard: boolean;
  onToggleVademecumVisibility: (visible: boolean) => void;
  showLMCompatibilityCard: boolean;
  onToggleLMCompatibilityVisibility: (visible: boolean) => void;
  showCalculatorsCard: boolean;
  onToggleCalculatorsVisibility: (visible: boolean) => void;
  showEscalasCard: boolean;
  onToggleEscalasVisibility: (visible: boolean) => void;
  showMisPacientesCard: boolean; 
  onToggleMisPacientesVisibility: (visible: boolean) => void; 
  showMisNotasCard: boolean; 
  onToggleMisNotasVisibility: (visible: boolean) => void;
  showSaludInfantilCard: boolean;
  onToggleSaludInfantilVisibility: (visible: boolean) => void;
  showTriviaCard: boolean;
  onToggleTriviaVisibility: (visible: boolean) => void;
  showMisTurnosCard?: boolean; // ✅ NUEVO
  onToggleMisTurnosVisibility?: () => void; // ✅ NUEVO
  onOpenProfileSettings: () => void;
  onOpenBackgroundSettings: () => void;
  onOpenAvatarSettings: () => void;
  onOpenAlarmSettings: () => void;
  onOpenContactDialog: () => void;
  onOpenReferencesDialog: () => void;
}

export default function SettingsDropdown({
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
}: SettingsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("w-56 max-h-[70vh] overflow-y-auto")} align="end">
        <DropdownMenuLabel>Configuración</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
            <DropdownMenuItem onClick={onOpenProfileSettings}>
                <UserCircle className="mr-2 h-4 w-4" />
                Establecer Nombre
            </DropdownMenuItem>
             <DropdownMenuItem onClick={onOpenReferencesDialog}>
                <BookCopy className="mr-2 h-4 w-4" />
                Referencias
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenContactDialog}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Contacto
            </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground px-2">Apariencia y Sonidos</DropdownMenuLabel>
          <DropdownMenuItem onClick={onOpenAlarmSettings}>
            <AlarmClock className="mr-2 h-4 w-4" />
            Resumen de Actividades
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenBackgroundSettings}>
            <ImageIcon className="mr-2 h-4 w-4" />
            Imágenes de Fondo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenAvatarSettings}>
            <UserCircle className="mr-2 h-4 w-4" />
            Cambiar Avatar
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground px-2">Mostrar Secciones</DropdownMenuLabel>
           <DropdownMenuCheckboxItem
            checked={showPendientesCard}
            onCheckedChange={onTogglePendientesVisibility}
          >
            <ListChecks className="mr-2 h-4 w-4" /> Pendientes
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showRcpLogCard}
            onCheckedChange={onToggleRcpLogVisibility}
          >
            <HeartPulse className="mr-2 h-4 w-4" /> Registro RCP
          </DropdownMenuCheckboxItem>
           <DropdownMenuCheckboxItem
            checked={showVademecumCard}
            onCheckedChange={onToggleVademecumVisibility}
          >
            <Syringe className="mr-2 h-4 w-4" /> Diluciones
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showCalculatorsCard}
            onCheckedChange={onToggleCalculatorsVisibility}
          >
            <Calculator className="mr-2 h-4 w-4" /> Calculadoras
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showEscalasCard}
            onCheckedChange={onToggleEscalasVisibility}
          >
            <ClipboardList className="mr-2 h-4 w-4" /> Escalas
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showSaludInfantilCard}
            onCheckedChange={onToggleSaludInfantilVisibility}
          >
            <Baby className="mr-2 h-4 w-4" /> Salud Infantil
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showTriviaCard}
            onCheckedChange={onToggleTriviaVisibility}
          >
            <BrainCircuit className="mr-2 h-4 w-4" /> Trivia
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={showMisPacientesCard}
            onCheckedChange={onToggleMisPacientesVisibility}
          >
            <Users2 className="mr-2 h-4 w-4" /> Mis Pacientes
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showMisNotasCard}
            onCheckedChange={onToggleMisNotasVisibility}
          >
            <NotebookText className="mr-2 h-4 w-4" /> Mis Notas
          </DropdownMenuCheckboxItem>
           <DropdownMenuCheckboxItem
            checked={showLMCompatibilityCard}
            onCheckedChange={onToggleLMCompatibilityVisibility}
          >
            <Baby className="mr-2 h-4 w-4" /> Compatibilidad LM
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showShoppingListCard}
            onCheckedChange={onToggleShoppingListVisibility}
          >
            Lista de Compras
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showFinanzasCard}
            onCheckedChange={onToggleFinanzasVisibility}
          >
            Mis Finanzas
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showPastilleroCard}
            onCheckedChange={onTogglePastilleroVisibility}
          >
            Pastillero
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showCicloCard}
            onCheckedChange={onToggleCicloVisibility}
          >
            <HeartPulse className="mr-2 h-4 w-4" /> Mi Ciclo Menstrual
          </DropdownMenuCheckboxItem>
          {/* ✅ NUEVO: Mis Turnos */}
          {onToggleMisTurnosVisibility && (
            <DropdownMenuCheckboxItem
              checked={showMisTurnosCard ?? true}
              onCheckedChange={onToggleMisTurnosVisibility}
            >
              <Clock className="mr-2 h-4 w-4" /> Mis Turnos
            </DropdownMenuCheckboxItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}