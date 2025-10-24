// src/lib/sounds.ts
import type { AlarmSound } from './types';

// Colección de sonidos de alarma disponibles en la aplicación.
export const ALARM_SOUNDS: AlarmSound[] = [
  { id: 'default-ting', name: 'Ting (Defecto)', src: 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjQwLjEwMQAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAASW3Lq8AAAAADSAAAAAPAZGlmZ7/+n4dIAgAAAAAD/A/wJgBgAg4AAAAnAqgGgDEQ//dG///gB4AgIAEAAATAZGlmZ7/+n4dIAgAAAAAD/A/wJgBgAg4AAAAnAqgGgDEQ//dG///gB4AgIAEAAA' },
  { id: 'hmch', name: 'Heavy Metal Chainsaw', src: '/sounds/hmch.mp3' },
  { id: "monitor", name: "Monitor Cardiaco", src: "/sounds/monitor.mp3" },
  { id: "despertador", name: "Despertador", src: "/sounds/despertador.mp3" },
  { id: "udec", name: "Campanil UdeC", src: "/sounds/udec.mp3" },
];

// Función para obtener un sonido por su ID. Devuelve el sonido por defecto si no se encuentra.
export const getAlarmSoundById = (id: string): AlarmSound => {
  return ALARM_SOUNDS.find(sound => sound.id === id) || ALARM_SOUNDS[0];
};

// Sonido por defecto para acceso rápido
export const DEFAULT_ALARM_SOUND = ALARM_SOUNDS[0];
