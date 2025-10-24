
import type { PautaBreveData } from './types';

export type PautaBreveAgeKey = '4m' | '8m' | '12m' | '18m' | '24m';

export const PAUTA_BREVE_DSM_DATA: PautaBreveData = {
  "4m": [
    {
      id: "4m-motor",
      area: "Motor",
      text: "En prono levanta la cabeza y tronco apoyándose en antebrazos",
      instructions: "Posición: En prono sobre una superficie dura.\nEstímulo: Observar la postura.\nRespuesta: La cabeza debe estar en la línea media y elevarse junto al tronco, apoyándose en los antebrazos. La pelvis debe estar plana sobre la superficie."
    },
    {
      id: "4m-coordinacion",
      area: "Coordinación",
      text: "Acerca la mano a un objeto en la línea media",
      instructions: "Posición: En supino sobre una superficie dura.\nEstímulo: Presentar un objeto en la línea media, a 20 cm de su pecho.\nRespuesta: Intenta alcanzar el objeto con una o ambas manos."
    },
    {
      id: "4m-lenguaje",
      area: "Lenguaje",
      text: "Sonríe en respuesta a la sonrisa del examinador/a",
      instructions: "Posición: Niño/a en supino o en brazos de la madre.\nEstímulo: El examinador/a sonríe y le habla suavemente.\nRespuesta: Responde con una sonrisa."
    },
    {
      id: "4m-social",
      area: "Social",
      text: "Vocaliza en respuesta a la conversación",
      instructions: "Posición: Niño/a en supino o en brazos de la madre.\nEstímulo: El examinador/a le habla suavemente.\nRespuesta: Emite sonidos guturales o vocálicos."
    }
  ],
  "8m": [
    {
      id: "8m-motor",
      area: "Motor",
      text: "Se sienta solo sin apoyo",
      instructions: "Posición: Sentado/a sobre una superficie dura.\nEstímulo: Observar la postura.\nRespuesta: Se mantiene sentado/a sin apoyo de sus manos durante al menos 10 segundos."
    },
    {
      id: "8m-coordinacion",
      area: "Coordinación",
      text: "Toma un objeto en cada mano",
      instructions: "Posición: Sentado/a sobre una superficie dura.\nEstímulo: Se le ofrecen dos cubos, uno en cada mano, simultáneamente.\nRespuesta: Toma un cubo en cada mano."
    },
    {
      id: "8m-lenguaje",
      area: "Lenguaje",
      text: "Dice 'da-da', 'ba-ba' u otro bisílabo",
      instructions: "Posición: Sentado/a o en brazos de la madre.\nEstímulo: Observación espontánea o estimular con conversación.\nRespuesta: Emite bisílabos sin significado."
    },
    {
      id: "8m-social",
      area: "Social",
      text: "Busca con la mirada un objeto que cae",
      instructions: "Posición: Sentado/a o en brazos de la madre.\nEstímulo: Dejar caer un objeto llamativo cerca del niño/a.\nRespuesta: Busca el objeto con la mirada."
    }
  ],
  "12m": [
    {
      id: "12m-motor",
      area: "Motor",
      text: "Se pone de pie solo/a",
      instructions: "Posición: Cerca de un mueble u objeto firme.\nEstímulo: Observación espontánea o motivar a ponerse de pie.\nRespuesta: Se para y se mantiene de pie por sí solo/a, afirmándose."
    },
    {
      id: "12m-coordinacion",
      area: "Coordinación",
      text: "Encuentra un objeto escondido bajo el pañal",
      instructions: "Posición: Sentado/a.\nEstímulo: Esconder un objeto de su interés bajo un pañal, a su vista.\nRespuesta: Levanta el pañal y encuentra el objeto."
    },
    {
      id: "12m-lenguaje",
      area: "Lenguaje",
      text: "Dice al menos una palabra con sentido",
      instructions: "Posición: Indiferente.\nEstímulo: Observación espontánea o preguntar a la madre.\nRespuesta: Dice al menos una palabra con significado (ej. mamá, papá, agua)."
    },
    {
      id: "12m-social",
      area: "Social",
      text: "Alcanza un objeto para entregarlo",
      instructions: "Posición: Sentado/a.\nEstímulo: Pedirle un objeto que tenga en la mano (ej. 'dame el cubo').\nRespuesta: Extiende el brazo para entregar el objeto, puede o no soltarlo."
    }
  ],
  "18m": [
    {
      id: "18m-motor",
      area: "Motor",
      text: "Camina solo/a",
      instructions: "Posición: De pie.\nEstímulo: Observar la marcha espontánea.\nRespuesta: Camina solo/a algunos pasos, aunque la marcha sea inestable."
    },
    {
      id: "18m-coordinacion",
      area: "Coordinación",
      text: "Introduce una pastilla en una botella",
      instructions: "Posición: Sentado/a frente a una mesa.\nEstímulo: Se le muestra cómo introducir una pastilla (o similar) en una botella plástica y se le pide que lo haga.\nRespuesta: Logra introducir la pastilla en la botella."
    },
    {
      id: "18m-lenguaje",
      area: "Lenguaje",
      text: "Nombra al menos un objeto",
      instructions: "Posición: Sentado/a.\nEstímulo: Mostrarle objetos conocidos (taza, cuchara, perro, gato) y preguntarle '¿qué es esto?'.\nRespuesta: Nombra correctamente al menos un objeto."
    },
    {
      id: "18m-social",
      area: "Social",
      text: "Apunta a lo que desea",
      instructions: "Posición: Indiferente.\nEstímulo: Observación espontánea.\nRespuesta: Usa el dedo índice para apuntar a un objeto que desea."
    }
  ],
  "24m": [
    {
      id: "24m-motor",
      area: "Motor",
      text: "Corre",
      instructions: "Posición: De pie.\nEstímulo: Motivar al niño/a a correr.\nRespuesta: Corre sin caerse."
    },
    {
      id: "24m-coordinacion",
      area: "Coordinación",
      text: "Construye una torre de tres cubos",
      instructions: "Posición: Sentado/a frente a una mesa.\nEstímulo: Se le entregan 3 cubos y se le pide que construya una torre.\nRespuesta: Construye una torre de tres cubos sin que se caiga."
    },
    {
      id: "24m-lenguaje",
      area: "Lenguaje",
      text: "Dice frases de dos palabras",
      instructions: "Posición: Indiferente.\nEstímulo: Observación espontánea o preguntar a la madre.\nRespuesta: Une dos palabras para formar una frase (ej. 'mamá pan', 'más jugo')."
    },
    {
      id: "24m-social",
      area: "Social",
      text: "Señala dos partes de su cuerpo",
      instructions: "Posición: Sentado/a o de pie.\nEstímulo: Preguntar '¿dónde está tu nariz?', '¿dónde está tu boca?'.\nRespuesta: Señala correctamente al menos dos partes de su cuerpo."
    }
  ]
};
