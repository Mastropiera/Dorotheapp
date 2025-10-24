"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { doc, getDoc, setDoc, getDocFromCache } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { format, startOfDay, parseISO, addDays, getDay, isValid, parse, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';
import { ToastAction } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { CHILEAN_HOLIDAYS_LIST, INTERNATIONAL_DAYS_LIST, getHolidayForDate, getInternationalDayForDate } from '@/lib/holiday-data';
import { getAlarmSoundById } from '@/lib/sounds';
import { useGoogleApi } from '@/contexts/google-api-context';

// Importar hooks personalizados
import { useTodos } from '@/hooks/useTodos';
import { useMemos } from '@/hooks/useMemos';
import { useFinanzas } from '@/hooks/useFinanzas';
import { useMedicamentos } from '@/hooks/useMedicamentos';
import { usePacientes } from '@/hooks/usePacientes';
import { useVademecum } from '@/hooks/useVademecum';
import { useEventos } from '@/hooks/useEventos';
import { useConfiguracion } from '@/hooks/useConfiguracion';
import { useAppDialogs } from '@/hooks/useAppDialogs';
import { useShiftEarnings } from '@/hooks/useShiftEarnings'; // ✅ NUEVO

// Importar componentes de sección
import DailyPlanSection from '@/components/app/DailyPlanSection';
import PostItSection from '@/components/dashboard/post-it-section';
import { DialogsSection } from '@/components/app/DialogsSection';
import SettingsSection from '@/components/app/SettingsSection';
import MisTurnos from '@/app/app-content/MisTurnos'; // ✅ NUEVO
import { PRESET_SHIFTS } from '@/lib/shifts'; // ✅ NUEVO

// Constantes
const DEFAULT_MENSTRUAL_SETTINGS = { cycleLength: 28, periodLength: 5 };
const INITIAL_MENSTRUAL_DATA = { settings: DEFAULT_MENSTRUAL_SETTINGS, recordedPeriods: [], manualPeriodDays: {} };

export default function AppContent() {
  const { user, logout: firebaseLogout } = useAuth();
  const { toast } = useToast();
  const { 
    isAuthorized: isGoogleApiAuthorized, 
    logout: googleLogout,
    getGoogleTasks
  } = useGoogleApi();
  
  const [isInitialDataLoadComplete, setIsInitialDataLoadComplete] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<string>('default');
  const initialLoadAttemptedRef = useRef<string | null>(null);
  const lastAlarmCheckMinuteRef = useRef<string | null>(null);

  // Estado inicial para los hooks
  const [initialData, setInitialData] = useState({
    todoItems: [],
    memos: [],
    incomeEntries: [],
    manualExpenseEntries: [],
    medicationReminders: [],
    medicationTakenLog: {},
    patients: [],
    patientNotes: {},
    vademecumEntries: [],
    localEvents: [],
    savedShoppingLists: [],
    menstrualData: INITIAL_MENSTRUAL_DATA,
    userName: '',
    selectedBackgroundUrl: null,
    selectedAvatarUrl: '/avatars/gatita.webp',
    wakeUpTimes: [],
    alarmSoundId: 'default-ting',
    favoriteCalculators: [],
    favoriteScales: [],
    visibilitySettings: {},
    extraHours: [], // ✅ NUEVO
    shiftEarningsSettings: undefined // ✅ NUEVO
  });

  // Inicializar hooks con datos
  const todosHook = useTodos(initialData.todoItems);
  const memosHook = useMemos(initialData.memos);
  const finanzasHook = useFinanzas(initialData.incomeEntries, initialData.manualExpenseEntries);
  const medicamentosHook = useMedicamentos(initialData.medicationReminders, initialData.medicationTakenLog);
  const pacientesHook = usePacientes(initialData.patients, initialData.patientNotes);
  const vademecumHook = useVademecum(initialData.vademecumEntries);
  const eventosHook = useEventos(initialData.localEvents, initialData.savedShoppingLists, initialData.menstrualData);
  const configuracionHook = useConfiguracion(
    initialData.userName,
    initialData.selectedBackgroundUrl,
    initialData.selectedAvatarUrl,
    initialData.wakeUpTimes,
    initialData.alarmSoundId,
    initialData.favoriteCalculators,
    initialData.favoriteScales,
    initialData.visibilitySettings
  );
  const dialogsHook = useAppDialogs();
  
  // ✅ NUEVO: Hook para manejar horas extra y cálculos de turnos
  const shiftEarningsHook = useShiftEarnings(
    initialData.extraHours,
    initialData.shiftEarningsSettings
  );

  // Centralized logout function
  const logout = async () => {
    await firebaseLogout();
    if(isGoogleApiAuthorized) {
        await googleLogout();
    }
  };

  // Cargar datos desde Firestore
  useEffect(() => {
    if (!user || initialLoadAttemptedRef.current === user.uid) {
        if (!user) {
          setIsInitialDataLoadComplete(false);
          initialLoadAttemptedRef.current = null;
        }
        return;
    }
    initialLoadAttemptedRef.current = user.uid;

    const loadAllData = async () => {
      setIsInitialDataLoadComplete(false);
      const userDocRef = doc(db, 'users', user.uid);
      
      try {
        let userDocSnap;
        try {
          userDocSnap = await getDocFromCache(userDocRef);
          if (!userDocSnap.exists()) {
             userDocSnap = await getDoc(userDocRef);
          }
        } catch (error) {
            console.warn("Failed to fetch from cache, trying server.", error);
            userDocSnap = await getDoc(userDocRef);
        }

        if (userDocSnap.exists()) {
          const firestoreData = userDocSnap.data();
          
          // ✅ Convertir fechas de settings si existen
          let shiftSettings = undefined;
          if (firestoreData.shiftEarningsSettings) {
            shiftSettings = {
              ...firestoreData.shiftEarningsSettings,
              startDate: new Date(firestoreData.shiftEarningsSettings.startDate),
              endDate: new Date(firestoreData.shiftEarningsSettings.endDate)
            };
          }
          
          setInitialData({
            todoItems: firestoreData.todoItems || [],
            memos: firestoreData.memos || [],
            incomeEntries: firestoreData.incomeEntries || [],
            manualExpenseEntries: firestoreData.manualExpenseEntries || [],
            medicationReminders: firestoreData.medicationReminders || [],
            medicationTakenLog: firestoreData.medicationTakenLog || {},
            patients: firestoreData.patients || [],
            patientNotes: firestoreData.patientNotes || {},
            vademecumEntries: firestoreData.vademecumEntries || [],
            localEvents: firestoreData.localEvents || [],
            savedShoppingLists: firestoreData.savedShoppingLists || [],
            menstrualData: firestoreData.menstrualData || INITIAL_MENSTRUAL_DATA,
            userName: firestoreData.userName || '',
            selectedBackgroundUrl: firestoreData.selectedBackgroundUrl || null,
            selectedAvatarUrl: firestoreData.selectedAvatarUrl || '/avatars/gatita.webp',
            wakeUpTimes: firestoreData.wakeUpTimes || [],
            alarmSoundId: firestoreData.alarmSoundId || 'default-ting',
            favoriteCalculators: firestoreData.favoriteCalculators || [],
            favoriteScales: firestoreData.favoriteScales || [],
            extraHours: firestoreData.extraHours || [], // ✅ NUEVO
            shiftEarningsSettings: shiftSettings, // ✅ NUEVO
            visibilitySettings: {
              showPendientesCard: firestoreData.showPendientesCard ?? true,
              showRcpLogCard: firestoreData.showRcpLogCard ?? true,
              showShoppingListCard: firestoreData.showShoppingListCard ?? true,
              showFinanzasCard: firestoreData.showFinanzasCard ?? true,
              showPastilleroCard: firestoreData.showPastilleroCard ?? true,
              showCicloCard: firestoreData.showCicloCard ?? true,
              showVademecumCard: firestoreData.showVademecumCard ?? true,
              showLMCompatibilityCard: firestoreData.showLMCompatibilityCard ?? true,
              showCalculatorsCard: firestoreData.showCalculatorsCard ?? true,
              showEscalasCard: firestoreData.showEscalasCard ?? true,
              showMisPacientesCard: firestoreData.showMisPacientesCard ?? true,
              showMisNotasCard: firestoreData.showMisNotasCard ?? true,
              showSaludInfantilCard: firestoreData.showSaludInfantilCard ?? true,
              showTriviaCard: firestoreData.showTriviaCard ?? true,
              showMisTurnosCard: firestoreData.showMisTurnosCard ?? true, // ✅ NUEVO
            }
          });
        } else {
          toast({title: "Bienvenida/o a Dorothea", description: "Configura tu perfil y empieza a organizar tu día."});
        }
      } catch (error: any) {
        console.error("Error loading data from Firestore:", error);
        toast({
            title: "Error al Cargar Datos",
            description: "No se pudieron cargar tus datos. Intenta recargar la página.",
            variant: "destructive"
        });
      } finally {
        setIsInitialDataLoadComplete(true);
      }
    };

    loadAllData();
  }, [user, toast]);

  // Cargar eventos de Google Calendar cuando se autoriza o al cargar la app
  useEffect(() => {
    if (isInitialDataLoadComplete && isGoogleApiAuthorized) {
      eventosHook.refreshGoogleEvents(new Date());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialDataLoadComplete, isGoogleApiAuthorized]);


  // Notification Logic
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const scheduleNotifications = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller || Notification.permission !== 'granted') {
      console.log("No se pueden programar notificaciones. Condiciones no cumplidas (sin SW o sin permiso).");
      return;
    }
  
    const allAlarms: { id: string; title: string; body: string; timestamp: number, data: any }[] = [];
    const now = new Date();
  
    for (let i = 0; i < 7; i++) {
      const futureDate = addDays(now, i);
      const dayKey = format(futureDate, 'yyyy-MM-dd');
      const dayOfWeek = getDay(futureDate);
  
      medicamentosHook.medicationReminders.forEach(reminder => {
        if (reminder.daysOfWeek.includes(dayOfWeek)) {
          reminder.times.forEach((time: string) => {
            const alarmDateTime = parse(`${dayKey} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
            if (isValid(alarmDateTime) && alarmDateTime > now) {
              allAlarms.push({
                id: `medication-${reminder.id}-${dayKey}-${time}`,
                title: `💊 Recordatorio de Medicamento`,
                body: `Es hora de tomar: ${reminder.name} ${reminder.dose ? `(${reminder.dose})` : ''}.`,
                timestamp: alarmDateTime.getTime(),
                data: {
                  type: 'medication',
                  medicationId: reminder.id,
                  time: time,
                }
              });
            }
          });
        }
      });
    }
    
    navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATIONS',
        payload: allAlarms,
    });
    
    console.log(`${allAlarms.length} notificaciones de medicamentos programadas.`);
  }, [medicamentosHook.medicationReminders]);

  const handleEnableNotifications = () => {
    if (!('Notification' in window)) {
      toast({ title: "No Soportado", description: "Tu navegador no soporta notificaciones.", variant: "destructive" });
      return;
    }
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
        if (permission === 'granted') {
          toast({ title: "¡Genial!", description: "Notificaciones habilitadas. Las alarmas ahora sonarán en segundo plano." });
          scheduleNotifications(); 
        } else {
          toast({ title: "Permiso Denegado", description: "No se mostrarán notificaciones de alarmas.", variant: "destructive" });
        }
      });
    } else if (Notification.permission === 'denied') {
      toast({ title: "Permiso Bloqueado", description: "Debes habilitar las notificaciones en la configuración de tu navegador.", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (isInitialDataLoadComplete && 'Notification' in window && Notification.permission === 'default') {
      const timer = setTimeout(() => {
        toast({
          title: "Habilitar Notificaciones de Alarmas",
          description: "Para que las alarmas suenen incluso con la app cerrada, necesitas habilitar las notificaciones.",
          duration: 30000,
          action: (
            <ToastAction altText="Habilitar" onClick={handleEnableNotifications}>
              Habilitar
            </ToastAction>
          ),
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialDataLoadComplete, toast]);
  
  useEffect(() => {
    if (isInitialDataLoadComplete && notificationPermission === 'granted') {
      scheduleNotifications();
    }
  }, [medicamentosHook.medicationReminders, isInitialDataLoadComplete, notificationPermission, scheduleNotifications]);

  // Voice alarm for medications (in-app)
  useEffect(() => {
    if (!isInitialDataLoadComplete || !configuracionHook.userName) return;

    const intervalId = setInterval(() => {
      const now = new Date();
      const currentDay = getDay(now);
      const currentTime = format(now, 'HH:mm');
      const todayKey = format(now, 'yyyy-MM-dd');

      if (currentTime === lastAlarmCheckMinuteRef.current) {
        return;
      }
      lastAlarmCheckMinuteRef.current = currentTime;

      const dueMedications = medicamentosHook.medicationReminders.filter(reminder => 
        reminder.daysOfWeek.includes(currentDay) &&
        reminder.times.includes(currentTime) &&
        !medicamentosHook.medicationTakenLog[reminder.id]?.[todayKey]?.[currentTime]
      );

      if (dueMedications.length > 0) {
        dialogsHook.setMedicationAlarm(dueMedications[0], currentTime);
      }

    }, 30000);

    return () => clearInterval(intervalId);
  }, [isInitialDataLoadComplete, configuracionHook.userName, medicamentosHook.medicationReminders, medicamentosHook.medicationTakenLog, dialogsHook]);

  // Handle voice alarm from notification click
  useEffect(() => {
    if (!isInitialDataLoadComplete || !configuracionHook.userName) {
      return;
    }
  
    const params = new URLSearchParams(window.location.search);
    const medicationId = params.get('alarm_medication_id');
    const alarmTime = params.get('alarm_time');
  
    if (medicationId && alarmTime) {
      const medication = medicamentosHook.medicationReminders.find(med => med.id === medicationId);
      if (medication) {
        dialogsHook.setMedicationAlarm(medication, alarmTime);
  
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [isInitialDataLoadComplete, configuracionHook.userName, medicamentosHook.medicationReminders, dialogsHook]);

  // Resumen de Actividades alarm logic
  useEffect(() => {
    if (!isInitialDataLoadComplete || configuracionHook.wakeUpTimes.length === 0 || !user || !configuracionHook.userName) {
      return; 
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      const todayFormatted = format(now, 'yyyy-MM-dd');

      configuracionHook.wakeUpTimes.forEach((alarmTime: string) => {
        const lastTriggerKey = `agenditaWelcomeTrigger_${user.uid}_${alarmTime}`;
        const lastTriggerDate = localStorage.getItem(lastTriggerKey);

        if (currentTime === alarmTime && lastTriggerDate !== todayFormatted) {
          console.log(`Resumen de Actividades triggered for ${alarmTime}`);
          dialogsHook.setIsWelcomeDialogOpen(true);
          localStorage.setItem(lastTriggerKey, todayFormatted);
        }
      });
    }, 60000);

    return () => clearInterval(intervalId);
  }, [isInitialDataLoadComplete, configuracionHook.wakeUpTimes, user, configuracionHook.userName, dialogsHook]);

  // Google Tasks integration
  useEffect(() => {
    if (isInitialDataLoadComplete && isGoogleApiAuthorized) {
      getGoogleTasks().then(googleTasks => {
        const newTasks = googleTasks
          .filter(gTask => gTask.title && gTask.id)
          .map(gTask => ({
            id: `google-${gTask.id}`,
            text: gTask.title!,
            completed: gTask.status === 'completed'
          }));

        // TODO: Integrar con todosHook
      });
    }
  }, [isInitialDataLoadComplete, isGoogleApiAuthorized, getGoogleTasks]);

  useEffect(() => {
    if (!user) {
        initialLoadAttemptedRef.current = null;
    }
  }, [user]);

  // Background styling
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const themeColorVariables = ['--background', '--foreground', '--primary', '--accent', '--card', '--card-foreground', '--popover', '--popover-foreground', '--secondary', '--secondary-foreground', '--muted', '--muted-foreground', '--destructive', '--destructive-foreground', '--border', '--input', '--ring'];

    if (configuracionHook.selectedBackgroundUrl) {
      root.style.backgroundImage = `url(${configuracionHook.selectedBackgroundUrl})`;
      root.style.backgroundSize = 'cover';
      root.style.backgroundPosition = 'center';
      root.style.backgroundAttachment = 'fixed';
      body.style.backgroundColor = 'transparent';

      themeColorVariables.forEach(variableName => {
        root.style.removeProperty(variableName);
      });
    } else {
      root.style.backgroundImage = '';
      body.style.removeProperty('background-color');

      themeColorVariables.forEach(variableName => {
        root.style.removeProperty(variableName);
      });
    }
  }, [configuracionHook.selectedBackgroundUrl]);

  const handleDateSelect = useCallback((date?: Date) => {
    if (date) {
      const sDate = startOfDay(date);
      dialogsHook.setSelectedDate(sDate);
      const holiday = getHolidayForDate(sDate, CHILEAN_HOLIDAYS_LIST);
      dialogsHook.setSelectedHolidayName(holiday ? holiday.name : null);
      const internationalDay = getInternationalDayForDate(sDate, INTERNATIONAL_DAYS_LIST);
      dialogsHook.setSelectedInternationalDayName(internationalDay ? internationalDay.name : null);
      
      dialogsHook.handleSheetOpenChange(true);
    } else {
      dialogsHook.setSelectedDate(undefined);
      dialogsHook.setSelectedHolidayName(null);
      dialogsHook.setSelectedInternationalDayName(null);
      dialogsHook.handleSheetOpenChange(false);
    }
  }, [dialogsHook]);
  
  const handleMonthChange = (month: Date) => {
    if (isGoogleApiAuthorized) {
        eventosHook.refreshGoogleEvents(month);
    }
  };

  const currentAlarmSound = useMemo(() => {
    return getAlarmSoundById(configuracionHook.alarmSoundId);
  }, [configuracionHook.alarmSoundId]);  
  
  const todayDayOfWeek = useMemo(() => getDay(new Date()), []);
  const todaysMedicationReminders = useMemo(() =>
    medicamentosHook.medicationReminders.filter(reminder => reminder.daysOfWeek.includes(todayDayOfWeek)),
    [medicamentosHook.medicationReminders, todayDayOfWeek]
  );

  // ✅ Convertir PRESET_SHIFTS array a objeto para MisTurnos
  const presetShiftsRecord = useMemo(() => {
    const record: Record<string, any> = {};
    PRESET_SHIFTS.forEach(shift => {
      record[shift.value] = {
        start: shift.start,
        end: shift.end,
        overnight: shift.overnight || false,
        symbol: shift.symbol,
        color: shift.backgroundColor
      };
    });
    return record;
  }, []);
  
  return (
    <div
      className={cn(
        "flex flex-col items-center min-h-screen p-4 md:p-8",
        configuracionHook.selectedBackgroundUrl ? "bg-transparent" : "bg-background"
      )}
    >
      <header className="my-8 w-full">
        <div className="w-full max-w-3xl mx-auto">
          <div className="relative bg-white/80 dark:bg-slate-900/80 rounded-xl shadow-md">
            <div className="flex justify-between items-center gap-x-3 p-3">
              <h1 className="flex-grow text-center text-5xl sm:text-6xl font-bold text-primary font-untalo-cursive truncate">
                Dorothea
              </h1>
              <div className="relative z-10 -my-5 -mr-5 flex-shrink-0">
                <Image 
                  src={configuracionHook.selectedAvatarUrl} 
                  alt="Dorothea illustration" 
                  width={144} 
                  height={144} 
                  data-ai-hint="brain pencil" 
                  className="rounded-lg shadow-lg" 
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-3xl relative z-0">
        <DailyPlanSection
          selectedDate={dialogsHook.selectedDate}
          onDateSelect={handleDateSelect}
          googleCalendarEvents={eventosHook.googleCalendarEvents}
          localEvents={eventosHook.localEvents}
          menstrualData={eventosHook.menstrualData}
          onMonthChange={handleMonthChange}
        />

        <PostItSection
          showPendientesCard={configuracionHook.showPendientesCard}
          showRcpLogCard={configuracionHook.showRcpLogCard}
          showVademecumCard={configuracionHook.showVademecumCard}
          showLMCompatibilityCard={configuracionHook.showLMCompatibilityCard}
          showCalculatorsCard={configuracionHook.showCalculatorsCard}
          showSaludInfantilCard={configuracionHook.showSaludInfantilCard}
          showTriviaCard={configuracionHook.showTriviaCard}
          showEscalasCard={configuracionHook.showEscalasCard}
          showMisPacientesCard={configuracionHook.showMisPacientesCard}
          showMisNotasCard={configuracionHook.showMisNotasCard}
          showShoppingListCard={configuracionHook.showShoppingListCard}
          showFinanzasCard={configuracionHook.showFinanzasCard}
          showCicloCard={configuracionHook.showCicloCard}
          showPastilleroCard={configuracionHook.showPastilleroCard}
          todoItems={todosHook.todoItems}
          onAddTodoItem={todosHook.addTodoItem}
          onToggleTodoItem={todosHook.toggleTodoItem}
          onDeleteItem={todosHook.deleteTodoItem}
          onClearCompletedTodos={todosHook.clearCompletedTodos}
          savedShoppingLists={eventosHook.savedShoppingLists}
          onSaveShoppingList={eventosHook.saveShoppingList}
          incomeEntries={finanzasHook.incomeEntries}
          onAddIncomeEntry={finanzasHook.addIncomeEntry}
          onDeleteIncomeEntry={finanzasHook.deleteIncomeEntry}
          manualExpenseEntries={finanzasHook.manualExpenseEntries}
          onAddManualExpenseEntry={finanzasHook.addManualExpenseEntry}
          onDeleteManualExpenseEntry={finanzasHook.deleteManualExpenseEntry}
          menstrualData={eventosHook.menstrualData}
          onSaveMenstrualSettings={(settings, newPeriodStartDate) => eventosHook.saveMenstrualData(settings, newPeriodStartDate)}
          medicationReminders={medicamentosHook.medicationReminders}
          medicationTakenLog={medicamentosHook.medicationTakenLog}
          onAddMedicationReminder={medicamentosHook.addMedicationReminder}
          onDeleteMedicationReminder={medicamentosHook.deleteMedicationReminder}
          onToggleMedicationTaken={medicamentosHook.toggleMedicationTaken}
          userName={configuracionHook.userName}
          onOpenRcpLog={() => dialogsHook.openDialog('rcpLog')}
          onOpenVademecum={() => dialogsHook.openDialog('diluciones')}
          onOpenLMCompatibility={() => dialogsHook.openDialog('lmCompatibility')}
          onOpenCalculators={() => dialogsHook.openDialog('calculators')}
          onOpenSaludInfantil={() => dialogsHook.openDialog('saludInfantil')}
          onOpenTrivia={() => dialogsHook.openDialog('trivia')}
          onOpenEscalas={() => dialogsHook.openDialog('escalas')}
          onOpenMisPacientes={() => dialogsHook.openDialog('pacientes')}
          onOpenMisNotas={() => dialogsHook.openDialog('notas')}
        />

        {/* ✅ NUEVO: Sección Mis Turnos */}
        {configuracionHook.visibilitySettings.showMisTurnosCard !== false && (
          <div className="mt-6">
            <MisTurnos
              localEvents={eventosHook.localEvents}
              extraHours={shiftEarningsHook.extraHours}
              presetShifts={presetShiftsRecord}
              settings={shiftEarningsHook.settings}
              addExtraHours={shiftEarningsHook.addExtraHours}
            />
          </div>
        )}
      </main>

      <DialogsSection
        googleCalendarEvents={eventosHook.googleCalendarEvents}
        localEvents={eventosHook.localEvents}
        isLoadingGoogleEvents={eventosHook.isLoadingGoogleEvents}
        googleApiError={eventosHook.googleApiError}
        onAddCelebration={eventosHook.addCelebration}
        onAddLocalEvent={eventosHook.addLocalEvent}
        onDeleteLocalEvent={eventosHook.deleteLocalEvent}
        menstrualData={eventosHook.menstrualData}
        setMenstrualData={eventosHook.setMenstrualData}
        {...dialogsHook}
        vademecumEntries={vademecumHook.vademecumEntries}
        onAddVademecumEntry={vademecumHook.addVademecumEntry}
        onUpdateVademecumEntry={vademecumHook.updateVademecumEntry}
        onDeleteVademecumEntry={vademecumHook.deleteVademecumEntry}
        favoriteCalculators={configuracionHook.favoriteCalculators}
        onToggleFavoriteCalculator={configuracionHook.toggleFavoriteCalculator}
        favoriteScales={configuracionHook.favoriteScales}
        onToggleFavoriteScale={configuracionHook.toggleFavoriteScale}
        patients={pacientesHook.patients}
        onAddPatient={pacientesHook.addPatient}
        selectedPatientId={pacientesHook.selectedPatientId}
        setSelectedPatientId={pacientesHook.setSelectedPatientId}
        patientNotes={pacientesHook.patientNotes}
        onAddPatientNote={pacientesHook.addPatientNote}
        onDeletePatient={pacientesHook.deletePatient}
        onDeletePatientNote={pacientesHook.deletePatientNote}
        memos={memosHook.memos}
        onAddMemo={memosHook.addMemo}
        onUpdateMemo={memosHook.updateMemo}
        onDeleteMemo={memosHook.deleteMemo}
        currentAlarmSound={currentAlarmSound}
        todaysMedicationReminders={todaysMedicationReminders}
        userName={configuracionHook.userName}
        isInitialDataLoadComplete={isInitialDataLoadComplete}
        selectedBackgroundUrl={configuracionHook.selectedBackgroundUrl}
        selectedAvatarUrl={configuracionHook.selectedAvatarUrl}
        wakeUpTimes={configuracionHook.wakeUpTimes}
        alarmSoundId={configuracionHook.alarmSoundId}
        onSaveUserName={configuracionHook.saveUserName}
        onSetBackgroundUrl={configuracionHook.setBackgroundUrl}
        onSetAvatarUrl={configuracionHook.setAvatarUrl}
        onSaveAlarmTimes={configuracionHook.saveAlarmTimes}
        onSaveSound={configuracionHook.saveAlarmSound}
        isLoadingWelcomeEvents={dialogsHook.isLoadingWelcomeEvents}
      />

      {user && (
        <SettingsSection
          userEmail={user.email || ''}
          logout={logout}
          showPendientesCard={configuracionHook.showPendientesCard}
          onTogglePendientesVisibility={configuracionHook.togglePendientesVisibility}
          showRcpLogCard={configuracionHook.showRcpLogCard}
          onToggleRcpLogVisibility={configuracionHook.toggleRcpLogVisibility}
          showShoppingListCard={configuracionHook.showShoppingListCard}
          onToggleShoppingListVisibility={configuracionHook.toggleShoppingListVisibility}
          showFinanzasCard={configuracionHook.showFinanzasCard}
          onToggleFinanzasVisibility={configuracionHook.toggleFinanzasVisibility}
          showPastilleroCard={configuracionHook.showPastilleroCard}
          onTogglePastilleroVisibility={configuracionHook.togglePastilleroVisibility}
          showCicloCard={configuracionHook.showCicloCard}
          onToggleCicloVisibility={configuracionHook.toggleCicloVisibility}
          showVademecumCard={configuracionHook.showVademecumCard}
          onToggleVademecumVisibility={configuracionHook.toggleVademecumVisibility}
          showLMCompatibilityCard={configuracionHook.showLMCompatibilityCard}
          onToggleLMCompatibilityVisibility={configuracionHook.toggleLMCompatibilityVisibility}
          showCalculatorsCard={configuracionHook.showCalculatorsCard}
          onToggleCalculatorsVisibility={configuracionHook.toggleCalculatorsVisibility}
          showEscalasCard={configuracionHook.showEscalasCard}
          onToggleEscalasVisibility={configuracionHook.toggleEscalasVisibility}
          showMisPacientesCard={configuracionHook.showMisPacientesCard}
          onToggleMisPacientesVisibility={configuracionHook.toggleMisPacientesVisibility}
          showMisNotasCard={configuracionHook.showMisNotasCard}
          onToggleMisNotasVisibility={configuracionHook.toggleMisNotasVisibility}
          showSaludInfantilCard={configuracionHook.showSaludInfantilCard}
          onToggleSaludInfantilVisibility={configuracionHook.toggleSaludInfantilVisibility}
          showTriviaCard={configuracionHook.showTriviaCard}
          onToggleTriviaVisibility={configuracionHook.toggleTriviaVisibility}
          onOpenProfileSettings={() => dialogsHook.openDialog('profile')}
          onOpenBackgroundSettings={() => dialogsHook.openDialog('background')}
          onOpenAvatarSettings={() => dialogsHook.openDialog('avatar')}
          onOpenAlarmSettings={() => dialogsHook.openDialog('alarm')}
          onOpenContactDialog={() => dialogsHook.openDialog('contact')}
          onOpenReferencesDialog={() => dialogsHook.openDialog('references')}
          onOpenHelpDialog={() => dialogsHook.openDialog('help')}
          showMisTurnosCard={configuracionHook.visibilitySettings.showMisTurnosCard}
          onToggleMisTurnosVisibility={() => {
            if (user) {
              const newValue = !configuracionHook.visibilitySettings.showMisTurnosCard;
              configuracionHook.updateVisibilitySetting('showMisTurnosCard', newValue);
            }
          }}
        />
      )}
    </div>
  );
}