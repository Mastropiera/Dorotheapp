"use client";

import { useState } from 'react';
import PostItCard from './post-it-card';
import ShoppingListDialog from './shopping-list-dialog';
import MisFinanzasDialog from './mis-finanzas-dialog';
import PastilleroDialog from './pastillero-dialog';
import MiCicloDialog from './mi-ciclo-dialog';
import type { SavedShoppingList, IncomeEntry, ManualExpenseEntry, MedicationReminder, MedicationTakenLog, TodoItem, MenstrualCycleSettings, PeriodEntry, MenstrualData } from '@/lib/types';
import { ShoppingCart, PiggyBank, HeartPulse, Pill, Baby, Calculator, ClipboardList, Users2, NotebookText, Heart, Syringe, BrainCircuit } from 'lucide-react';
import PendientesCard from './pendientes-card';
import PendientesDialog from './pendientes-dialog';

interface PostItSectionProps {
  // Pendientes
  showPendientesCard: boolean;
  todoItems: TodoItem[];
  onAddTodoItem: (item: Omit<TodoItem, 'id'|'completed'>) => void;
  onToggleTodoItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearCompletedTodos: () => void;

  // Otras props
  onOpenRcpLog: () => void;
  showRcpLogCard: boolean;
  onOpenVademecum: () => void;
  showVademecumCard: boolean;
  onOpenLMCompatibility: () => void;
  showLMCompatibilityCard: boolean;
  onOpenCalculators: () => void;
  showCalculatorsCard: boolean;
  onOpenSaludInfantil: () => void;
  showSaludInfantilCard: boolean;
  onOpenTrivia: () => void;
  showTriviaCard: boolean;
  onOpenEscalas: () => void;
  showEscalasCard: boolean;
  onOpenMisPacientes: () => void;
  showMisPacientesCard: boolean;
  onOpenMisNotas: () => void;
  showMisNotasCard: boolean;
  savedShoppingLists: SavedShoppingList[];
  onSaveShoppingList: (list: SavedShoppingList) => void;
  showShoppingListCard: boolean;
  incomeEntries: IncomeEntry[];
  onAddIncomeEntry: (entry: Omit<IncomeEntry, 'id'>) => void;
  onDeleteIncomeEntry: (id: string) => void;
  manualExpenseEntries: ManualExpenseEntry[];
  onAddManualExpenseEntry: (entry: Omit<ManualExpenseEntry, 'id'>) => void;
  onDeleteManualExpenseEntry: (id: string) => void;
  showFinanzasCard: boolean;
  
  // Props para el ciclo menstrual
  showCicloCard: boolean;
  menstrualData: MenstrualData;
  onSaveMenstrualSettings: (settings: MenstrualCycleSettings, newPeriodStartDate?: string) => void;

  medicationReminders: MedicationReminder[];
  medicationTakenLog: MedicationTakenLog;
  onAddMedicationReminder: (reminder: Omit<MedicationReminder, 'id'>) => void;
  onDeleteMedicationReminder: (id: string) => void;
  onToggleMedicationTaken: (medicationId: string, date: string, time: string) => void;
  showPastilleroCard: boolean;
  userName?: string;
}

export default function PostItSection({
  showPendientesCard,
  todoItems,
  onAddTodoItem,
  onToggleTodoItem,
  onDeleteItem,
  onClearCompletedTodos,
  showRcpLogCard,
  onOpenRcpLog,
  onOpenVademecum,
  showVademecumCard,
  onOpenLMCompatibility,
  showLMCompatibilityCard,
  onOpenCalculators,
  showCalculatorsCard,
  onOpenSaludInfantil,
  showSaludInfantilCard,
  onOpenTrivia,
  showTriviaCard,
  onOpenEscalas,
  showEscalasCard,
  onOpenMisPacientes,
  showMisPacientesCard,
  onOpenMisNotas,
  showMisNotasCard,
  savedShoppingLists,
  onSaveShoppingList,
  showShoppingListCard,
  incomeEntries,
  onAddIncomeEntry,
  onDeleteIncomeEntry,
  manualExpenseEntries,
  onAddManualExpenseEntry,
  onDeleteManualExpenseEntry,
  showFinanzasCard,
  showCicloCard,
  menstrualData,
  onSaveMenstrualSettings,
  medicationReminders,
  medicationTakenLog,
  onAddMedicationReminder,
  onDeleteMedicationReminder,
  onToggleMedicationTaken,
  showPastilleroCard,
}: PostItSectionProps) {
  const [isPendientesOpen, setIsPendientesOpen] = useState(false);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isFinanzasOpen, setIsFinanzasOpen] = useState(false);
  const [isPastilleroOpen, setIsPastilleroOpen] = useState(false);
  const [isCicloOpen, setIsCicloOpen] = useState(false);

  return (
    <div className="mt-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
        {showPendientesCard && (
            <PendientesCard
                items={todoItems}
                onClick={() => setIsPendientesOpen(true)}
            />
        )}
        {showRcpLogCard && (
             <PostItCard
                title="RCP Log"
                icon={<Heart className="w-8 h-8" />}
                colorClasses="bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700/60"
                onClick={onOpenRcpLog}
                description="Inicia un registro de eventos de RCP."
            />
        )}
        {showVademecumCard && (
             <PostItCard
                title="Vademécum"
                icon={<Syringe className="w-8 h-8" />}
                colorClasses="bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700/60"
                onClick={onOpenVademecum}
                description="Información sobre fármacos EV."
            />
        )}
         {showLMCompatibilityCard && (
            <PostItCard
                title="Compatibilidad LM"
                icon={<Baby className="w-8 h-8" />}
                colorClasses="bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700/60"
                onClick={onOpenLMCompatibility}
                description="Medicamentos en lactancia y embarazo."
            />
        )}
        {showCalculatorsCard && (
            <PostItCard
                title="Calculadoras"
                icon={<Calculator className="w-8 h-8" />}
                colorClasses="bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700/60"
                onClick={onOpenCalculators}
                description="Cálculos clínicos útiles."
            />
        )}
        {showSaludInfantilCard && (
            <PostItCard
              title="Salud Infantil"
              icon={<Baby className="w-8 h-8" />}
              colorClasses="bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700/60"
              onClick={onOpenSaludInfantil}
              description="Evaluación de niñas, niños y adolescentes."
            />
        )}
        {showTriviaCard && (
             <PostItCard
                title="Trivia"
                icon={<BrainCircuit className="w-8 h-8" />}
                colorClasses="bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700/60"
                onClick={onOpenTrivia}
                description="¡Prueba tus conocimientos!"
            />
        )}
        {showMisPacientesCard && (
            <PostItCard
                title="Mis Pacientes"
                icon={<Users2 className="w-8 h-8" />}
                colorClasses="bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700/60"
                onClick={onOpenMisPacientes}
                description="Gestiona la información clínica de tus pacientes."
            />
        )}
         {showMisNotasCard && (
            <PostItCard
                title="Mis Notas"
                icon={<NotebookText className="w-8 h-8" />}
                colorClasses="bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700/60"
                onClick={onOpenMisNotas}
                description="Anota información útil que debas recordar."
            />
        )}
        {showShoppingListCard && (
            <PostItCard
                title="Lista de Compras"
                icon={<ShoppingCart className="w-8 h-8" />}
                colorClasses="bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700/60"
                onClick={() => setIsShoppingListOpen(true)}
                description="¿Vayamos al súper?"
            />
        )}
        {showFinanzasCard && (
            <PostItCard
                title="Finanzas"
                icon={<PiggyBank className="w-8 h-8" />}
                colorClasses="bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700/60"
                onClick={() => setIsFinanzasOpen(true)}
                description="Las cuentas claras."
            />
        )}
        {showPastilleroCard && (
            <PostItCard
                title="Pastillero"
                icon={<Pill className="w-8 h-8" />}
                colorClasses="bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700/60"
                onClick={() => setIsPastilleroOpen(true)}
                description="Que no se te olvide el losartán."
            />
        )}
        {showCicloCard && (
            <PostItCard
                title="Mi Ciclo Menstrual"
                icon={<HeartPulse className="w-8 h-8" />}
                colorClasses="bg-pink-100 border-pink-300 dark:bg-pink-900/30 dark:border-pink-700/60"
                onClick={() => setIsCicloOpen(true)}
                description="Que no te pille desprevenida."
            />
        )}
         {showEscalasCard && (
            <PostItCard
                title="Escalas"
                icon={<ClipboardList className="w-8 h-8" />}
                colorClasses="bg-indigo-100 border-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-700/60"
                onClick={onOpenEscalas}
                description="Valoraciones y tests clínicos."
            />
        )}
      </div>

      <PendientesDialog
        isOpen={isPendientesOpen}
        onOpenChange={setIsPendientesOpen}
        items={todoItems}
        onAddItem={onAddTodoItem}
        onToggleItem={onToggleTodoItem}
        onDeleteItem={onDeleteItem}
        onClearCompleted={onClearCompletedTodos}
      />
      
      <ShoppingListDialog
        isOpen={isShoppingListOpen}
        onOpenChange={setIsShoppingListOpen}
        onSaveList={onSaveShoppingList}
      />
      <MisFinanzasDialog
        isOpen={isFinanzasOpen}
        onOpenChange={setIsFinanzasOpen}
        shoppingLists={savedShoppingLists}
        incomeEntries={incomeEntries}
        onAddIncomeEntry={onAddIncomeEntry}
        onDeleteIncomeEntry={onDeleteIncomeEntry}
        manualExpenseEntries={manualExpenseEntries}
        onAddManualExpenseEntry={onAddManualExpenseEntry}
        onDeleteManualExpenseEntry={onDeleteManualExpenseEntry}
      />
      <PastilleroDialog
        isOpen={isPastilleroOpen}
        onOpenChange={setIsPastilleroOpen}
        reminders={medicationReminders}
        takenLog={medicationTakenLog}
        onAddReminder={onAddMedicationReminder}
        onDeleteReminder={onDeleteMedicationReminder}
        onToggleTaken={onToggleMedicationTaken}
      />
      <MiCicloDialog
        isOpen={isCicloOpen}
        onOpenChange={setIsCicloOpen}
        currentSettings={menstrualData.settings}
        recordedPeriods={menstrualData.recordedPeriods}
        onSave={onSaveMenstrualSettings}
       />
    </div>
  );
}