"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { doc, setDoc, updateDoc } from "firebase/firestore"; // ✅ Agregado updateDoc
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_ALARM_SOUND } from '@/lib/sounds';

export function useConfiguracion(
  initialUserName: string = '',
  initialBackgroundUrl: string | null = null,
  initialAvatarUrl: string = '/avatars/gatita.webp',
  initialWakeUpTimes: string[] = [],
  initialAlarmSoundId: string = DEFAULT_ALARM_SOUND.id,
  initialFavoriteCalculators: string[] = [],
  initialFavoriteScales: string[] = [],
  initialVisibilitySettings: Record<string, boolean> = {}
) {
  const { user } = useAuth();
  const { toast } = useToast();

  // Estados de configuración personal
  const [userName, setUserName] = useState<string>(initialUserName);
  const [selectedBackgroundUrl, setSelectedBackgroundUrl] = useState<string | null>(initialBackgroundUrl);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(initialAvatarUrl);
  const [wakeUpTimes, setWakeUpTimes] = useState<string[]>(initialWakeUpTimes);
  const [alarmSoundId, setAlarmSoundId] = useState<string>(initialAlarmSoundId);

  // Estados de favoritos
  const [favoriteCalculators, setFavoriteCalculators] = useState<string[]>(initialFavoriteCalculators);
  const [favoriteScales, setFavoriteScales] = useState<string[]>(initialFavoriteScales);

  // ✅ NUEVO: Estado consolidado de visibilidad
  const [visibilitySettings, setVisibilitySettings] = useState({
    showPendientesCard: initialVisibilitySettings.showPendientesCard ?? true,
    showRcpLogCard: initialVisibilitySettings.showRcpLogCard ?? true,
    showShoppingListCard: initialVisibilitySettings.showShoppingListCard ?? true,
    showFinanzasCard: initialVisibilitySettings.showFinanzasCard ?? true,
    showPastilleroCard: initialVisibilitySettings.showPastilleroCard ?? true,
    showCicloCard: initialVisibilitySettings.showCicloCard ?? true,
    showVademecumCard: initialVisibilitySettings.showVademecumCard ?? true,
    showLMCompatibilityCard: initialVisibilitySettings.showLMCompatibilityCard ?? true,
    showCalculatorsCard: initialVisibilitySettings.showCalculatorsCard ?? true,
    showEscalasCard: initialVisibilitySettings.showEscalasCard ?? true,
    showMisPacientesCard: initialVisibilitySettings.showMisPacientesCard ?? true,
    showMisNotasCard: initialVisibilitySettings.showMisNotasCard ?? true,
    showSaludInfantilCard: initialVisibilitySettings.showSaludInfantilCard ?? true,
    showTriviaCard: initialVisibilitySettings.showTriviaCard ?? true,
    showMisTurnosCard: initialVisibilitySettings.showMisTurnosCard ?? true, // ✅ NUEVO
  });

  // Estados individuales de visibilidad (mantener para compatibilidad)
  const [showPendientesCard, setShowPendientesCard] = useState(initialVisibilitySettings.showPendientesCard ?? true);
  const [showRcpLogCard, setShowRcpLogCard] = useState(initialVisibilitySettings.showRcpLogCard ?? true);
  const [showShoppingListCard, setShowShoppingListCard] = useState(initialVisibilitySettings.showShoppingListCard ?? true);
  const [showFinanzasCard, setShowFinanzasCard] = useState(initialVisibilitySettings.showFinanzasCard ?? true);
  const [showPastilleroCard, setShowPastilleroCard] = useState(initialVisibilitySettings.showPastilleroCard ?? true);
  const [showCicloCard, setShowCicloCard] = useState(initialVisibilitySettings.showCicloCard ?? true);
  const [showVademecumCard, setShowVademecumCard] = useState(initialVisibilitySettings.showVademecumCard ?? true);
  const [showLMCompatibilityCard, setShowLMCompatibilityCard] = useState(initialVisibilitySettings.showLMCompatibilityCard ?? true);
  const [showCalculatorsCard, setShowCalculatorsCard] = useState(initialVisibilitySettings.showCalculatorsCard ?? true);
  const [showEscalasCard, setShowEscalasCard] = useState(initialVisibilitySettings.showEscalasCard ?? true);
  const [showMisPacientesCard, setShowMisPacientesCard] = useState(initialVisibilitySettings.showMisPacientesCard ?? true);
  const [showMisNotasCard, setShowMisNotasCard] = useState(initialVisibilitySettings.showMisNotasCard ?? true);
  const [showSaludInfantilCard, setShowSaludInfantilCard] = useState(initialVisibilitySettings.showSaludInfantilCard ?? true);
  const [showTriviaCard, setShowTriviaCard] = useState(initialVisibilitySettings.showTriviaCard ?? true);

  // Guardar en Firestore
  const saveConfigData = useCallback(
    async (field: string, data: any) => {
      if (!user) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { [field]: data }, { merge: true });
      } catch (error) {
        console.error(`Error guardando ${field}:`, error);
        toast({
          title: "Error al guardar",
          description: "No se pudieron guardar las configuraciones.",
          variant: "destructive",
        });
      }
    },
    [user, toast]
  );

  // ✅ NUEVO: Función para actualizar un setting de visibilidad específico
  const updateVisibilitySetting = useCallback((key: string, value: boolean) => {
    setVisibilitySettings(prev => {
      const updated = { ...prev, [key]: value };
      
      // Guardar en Firestore
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        updateDoc(userDocRef, { [key]: value }).catch(error => {
          console.error("Error updating visibility setting:", error);
        });
      }
      
      return updated;
    });
  }, [user]);

  // Effects para guardar cada configuración
  useEffect(() => { saveConfigData('userName', userName); }, [userName, saveConfigData]);
  useEffect(() => { saveConfigData('selectedBackgroundUrl', selectedBackgroundUrl); }, [selectedBackgroundUrl, saveConfigData]);
  useEffect(() => { saveConfigData('selectedAvatarUrl', selectedAvatarUrl); }, [selectedAvatarUrl, saveConfigData]);
  useEffect(() => { saveConfigData('wakeUpTimes', wakeUpTimes); }, [wakeUpTimes, saveConfigData]);
  useEffect(() => { saveConfigData('alarmSoundId', alarmSoundId); }, [alarmSoundId, saveConfigData]);
  useEffect(() => { saveConfigData('favoriteCalculators', favoriteCalculators); }, [favoriteCalculators, saveConfigData]);
  useEffect(() => { saveConfigData('favoriteScales', favoriteScales); }, [favoriteScales, saveConfigData]);
  
  // Effects para visibilidad
  useEffect(() => { saveConfigData('showPendientesCard', showPendientesCard); }, [showPendientesCard, saveConfigData]);
  useEffect(() => { saveConfigData('showRcpLogCard', showRcpLogCard); }, [showRcpLogCard, saveConfigData]);
  useEffect(() => { saveConfigData('showShoppingListCard', showShoppingListCard); }, [showShoppingListCard, saveConfigData]);
  useEffect(() => { saveConfigData('showFinanzasCard', showFinanzasCard); }, [showFinanzasCard, saveConfigData]);
  useEffect(() => { saveConfigData('showPastilleroCard', showPastilleroCard); }, [showPastilleroCard, saveConfigData]);
  useEffect(() => { saveConfigData('showCicloCard', showCicloCard); }, [showCicloCard, saveConfigData]);
  useEffect(() => { saveConfigData('showVademecumCard', showVademecumCard); }, [showVademecumCard, saveConfigData]);
  useEffect(() => { saveConfigData('showLMCompatibilityCard', showLMCompatibilityCard); }, [showLMCompatibilityCard, saveConfigData]);
  useEffect(() => { saveConfigData('showCalculatorsCard', showCalculatorsCard); }, [showCalculatorsCard, saveConfigData]);
  useEffect(() => { saveConfigData('showEscalasCard', showEscalasCard); }, [showEscalasCard, saveConfigData]);
  useEffect(() => { saveConfigData('showMisPacientesCard', showMisPacientesCard); }, [showMisPacientesCard, saveConfigData]);
  useEffect(() => { saveConfigData('showMisNotasCard', showMisNotasCard); }, [showMisNotasCard, saveConfigData]);
  useEffect(() => { saveConfigData('showSaludInfantilCard', showSaludInfantilCard); }, [showSaludInfantilCard, saveConfigData]);
  useEffect(() => { saveConfigData('showTriviaCard', showTriviaCard); }, [showTriviaCard, saveConfigData]);

  // Handlers de configuración personal
  const saveUserName = (newName: string) => {
    const trimmedName = newName.trim();
    setUserName(trimmedName);
    toast({ title: "Nombre Guardado", description: "Tu nombre ha sido actualizado." });
  };

  const setBackgroundUrl = (url: string | null) => {
    setSelectedBackgroundUrl(url);
    if (url) {
      toast({ title: "Fondo Actualizado", description: "El nuevo fondo ha sido aplicado." });
    } else {
      toast({ title: "Fondo Eliminado", description: "Se ha restaurado el fondo por defecto." });
    }
  };

  const setAvatarUrl = (url: string) => {
    setSelectedAvatarUrl(url);
    toast({ title: "Avatar Actualizado", description: "Tu nuevo avatar ha sido aplicado." });
  };

  const saveAlarmTimes = (times: string[]) => {
    setWakeUpTimes(times);
    toast({ 
      title: "Alarmas de Resumen Actualizadas", 
      description: times.length > 0 ? `Se han guardado ${times.length} alarmas de resumen.` : "Se han desactivado todas las alarmas de resumen." 
    });
  };

  const saveAlarmSound = (soundId: string) => {
    setAlarmSoundId(soundId);
    toast({ title: "Sonido de Alarma Guardado", description: "El nuevo sonido se usará para las notificaciones." });
  };

  // Handlers de favoritos
  const toggleFavoriteCalculator = (calculatorName: string) => {
    setFavoriteCalculators(prev =>
      prev.includes(calculatorName)
        ? prev.filter(name => name !== calculatorName)
        : [...prev, calculatorName]
    );
  };

  const toggleFavoriteScale = (scaleName: string) => {
    setFavoriteScales(prev =>
      prev.includes(scaleName)
        ? prev.filter(name => name !== scaleName)
        : [...prev, scaleName]
    );
  };

  // Helper para crear togglers de visibilidad
  const createVisibilityToggler = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return (value: boolean) => {
      setter(value);
    };
  };

  return {
    // Estados
    userName,
    selectedBackgroundUrl,
    selectedAvatarUrl,
    wakeUpTimes,
    alarmSoundId,
    favoriteCalculators,
    favoriteScales,
    
    // ✅ NUEVO: visibilitySettings consolidado
    visibilitySettings,
    updateVisibilitySetting,
    
    // Visibilidad individual (mantener para compatibilidad)
    showPendientesCard,
    showRcpLogCard,
    showShoppingListCard,
    showFinanzasCard,
    showPastilleroCard,
    showCicloCard,
    showVademecumCard,
    showLMCompatibilityCard,
    showCalculatorsCard,
    showEscalasCard,
    showMisPacientesCard,
    showMisNotasCard,
    showSaludInfantilCard,
    showTriviaCard,

    // Handlers de configuración
    saveUserName,
    setBackgroundUrl,
    setAvatarUrl,
    saveAlarmTimes,
    saveAlarmSound,
    toggleFavoriteCalculator,
    toggleFavoriteScale,

    // Handlers de visibilidad
    togglePendientesVisibility: createVisibilityToggler(setShowPendientesCard),
    toggleRcpLogVisibility: createVisibilityToggler(setShowRcpLogCard),
    toggleShoppingListVisibility: createVisibilityToggler(setShowShoppingListCard),
    toggleFinanzasVisibility: createVisibilityToggler(setShowFinanzasCard),
    togglePastilleroVisibility: createVisibilityToggler(setShowPastilleroCard),
    toggleCicloVisibility: createVisibilityToggler(setShowCicloCard),
    toggleVademecumVisibility: createVisibilityToggler(setShowVademecumCard),
    toggleLMCompatibilityVisibility: createVisibilityToggler(setShowLMCompatibilityCard),
    toggleCalculatorsVisibility: createVisibilityToggler(setShowCalculatorsCard),
    toggleEscalasVisibility: createVisibilityToggler(setShowEscalasCard),
    toggleMisPacientesVisibility: createVisibilityToggler(setShowMisPacientesCard),
    toggleMisNotasVisibility: createVisibilityToggler(setShowMisNotasCard),
    toggleSaludInfantilVisibility: createVisibilityToggler(setShowSaludInfantilCard),
    toggleTriviaVisibility: createVisibilityToggler(setShowTriviaCard),
  };
}