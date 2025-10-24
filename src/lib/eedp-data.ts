
import type { EEDPData, EEDPProfileData } from './types/assessments';

// Fuente: Norma Técnica para la supervisión de niños y niñas de 0 a 9 años en la Atención Primaria de Salud, MINSAL 2014, Anexo 4
// https://www.saludquillota.cl/biblioteca/unidad_infantil/NORMA%20PEDIATRICA%204.pdf
// Los números de ítem (1-75) se han asignado según el manual oficial de la EEDP.

export const EEDP_DATA: EEDPData = {
  "1m": [
    { id: "1m_S1", itemNumber: 1, area: "S", text: "Reacciona al sonido de una campanilla", instructions: "Hacer sonar una campanilla a 30 cm de su oído, fuera de su vista. Debe reaccionar con parpadeo, sobresalto o cese de actividad." },
    { id: "1m_L2", itemNumber: 2, area: "L", text: "Succiona vigorosamente", instructions: "Observar durante la alimentación o con un chupete. La succión debe ser fuerte y rítmica." },
    { id: "1m_M3", itemNumber: 3, area: "M", text: "En prono, levanta la cabeza de la superficie", instructions: "Colocar al niño en prono. Debe ser capaz de levantar la cabeza momentáneamente, despegando la cara de la superficie." },
    { id: "1m_C4", itemNumber: 4, area: "C", text: "Sigue con la vista un objeto en movimiento (90°)", instructions: "Presentar una argolla roja a 20-30 cm. Moverla lentamente en un arco de 90°. El niño debe seguirla con los ojos, con o sin mover la cabeza." },
    { id: "1m_M5", itemNumber: 5, area: "M", text: "Mueve brazos y piernas vigorosamente", instructions: "Observar al niño en supino. Debe mover las 4 extremidades con energía y variedad." },
  ],
  "2m": [
    { id: "2m_S6", itemNumber: 6, area: "S", text: "Sonrisa social", instructions: "El examinador sonríe y habla al niño. El niño debe responder con una sonrisa." },
    { id: "2m_L7", itemNumber: 7, area: "L", text: "Emite sonidos guturales (gorgoritos)", instructions: "Observación espontánea. Emite sonidos como 'a-a', 'e-e'." },
    { id: "2m_C8", itemNumber: 8, area: "C", text: "Sigue un objeto que se mueve en 180°", instructions: "Mover la argolla roja en un arco completo de lado a lado. El niño debe seguirlo." },
    { id: "2m_M9", itemNumber: 9, area: "M", text: "Mantiene la cabeza erguida al ser llevado a la posición sentada", instructions: "Tirar suavemente de los brazos desde supino a sentado. La cabeza no debe caer completamente hacia atrás." },
    { id: "2m_L10", itemNumber: 10, area: "L", text: "Vocaliza dos sonidos diferentes", instructions: "Observar si emite al menos dos sonidos vocálicos o guturales diferentes." },
  ],
  "3m": [
    { id: "3m_S11", itemNumber: 11, area: "S", text: "Ríe a carcajadas", instructions: "Observación espontánea o durante el juego." },
    { id: "3m_L12", itemNumber: 12, area: "L", text: "Gira la cabeza hacia la fuente de sonido", instructions: "Hacer sonar la campanilla fuera de su vista. Debe girar la cabeza buscando el sonido." },
    { id: "3m_C13", itemNumber: 13, area: "C", text: "Coge un objeto que se le ofrece", instructions: "Ofrecerle un cubo a 15-20 cm de su mano. Debe cogerlo." },
    { id: "3m_M14", itemNumber: 14, area: "M", text: "En prono, levanta la cabeza y el tórax", instructions: "En prono, se apoya en antebrazos levantando cabeza y hombros." },
    { id: "3m_L15", itemNumber: 15, area: "L", text: "Vocaliza en respuesta al examinador", instructions: "Hablarle al niño. Debe responder con sonidos." },
  ],
  "4m": [
    { id: "4m_C16", itemNumber: 16, area: "C", text: "Manos se juntan en la línea media", instructions: "Observación espontánea en supino. El niño debe ser capaz de juntar sus manos sobre su pecho o cara." },
    { id: "4m_C17", itemNumber: 17, area: "C", text: "Intenta alcanzar un objeto", instructions: "Presentar un objeto llamativo a su alcance. El niño debe mover sus brazos activamente hacia el objeto, aunque no lo coja." },
    { id: "4m_M18", itemNumber: 18, area: "M", text: "En prono, se apoya en sus manos con los brazos extendidos", instructions: "En prono, el niño debe extender sus brazos para levantar el tronco." },
    { id: "4m_M19", itemNumber: 19, area: "M", text: "Gira de supino a prono", instructions: "Observar si el niño es capaz de rolar en esta dirección." },
    { id: "4m_S20", itemNumber: 20, area: "S", text: "Se lleva objetos a la boca", instructions: "Observación espontánea con un objeto en la mano." },
  ],
  "5m": [
    { id: "5m_S21", itemNumber: 21, area: "S", text: "Reconoce a su madre o cuidador principal", instructions: "Observar si su comportamiento cambia (sonríe, vocaliza, se calma) al ver a su madre." },
    { id: "5m_C22", itemNumber: 22, area: "C", text: "Se pasa un objeto de una mano a otra", instructions: "Darle un cubo. Debe ser capaz de transferirlo a la otra mano." },
    { id: "5m_C23", itemNumber: 23, area: "C", text: "Coge un objeto voluntariamente", instructions: "Ofrecerle un cubo. Debe cogerlo activamente." },
    { id: "5m_M24", itemNumber: 24, area: "M", text: "Gira de prono a supino", instructions: "Observar si puede rolar en esta dirección." },
    { id: "5m_M25", itemNumber: 25, area: "M", text: "En supino, se coge los pies", instructions: "Observar en supino. El niño debe ser capaz de agarrarse los pies con las manos." },
  ],
  "6m": [
    { id: "6m_M26", itemNumber: 26, area: "M", text: "Se mantiene sentado con apoyo", instructions: "Sentar al niño con un cojín de apoyo en la espalda. Debe mantenerse erguido." },
    { id: "6m_C27", itemNumber: 27, area: "C", text: "Coge un cubo con prensión palmar", instructions: "Ofrecer un cubo. Debe cogerlo usando toda la mano." },
    { id: "6m_C28", itemNumber: 28, area: "C", text: "Deja caer un objeto para coger otro", instructions: "Con un cubo en cada mano, ofrecer un tercero. Debe soltar uno para coger el nuevo." },
    { id: "6m_C29", itemNumber: 29, area: "C", text: "Golpea un objeto contra la mesa", instructions: "Darle un cubo. Debe golpearlo contra la superficie." },
    { id: "6m_S30", itemNumber: 30, area: "S", text: "Muestra disgusto cuando se le quita un juguete", instructions: "Retirar un juguete con el que está jugando. Debe protestar." },
  ],
  "7m": [
    { id: "7m_M31", itemNumber: 31, area: "M", text: "Se sienta solo sin apoyo por unos segundos", instructions: "Sentar al niño sin apoyo. Debe mantenerse sentado al menos 5 segundos." },
    { id: "7m_C32", itemNumber: 32, area: "C", text: "Coge dos objetos, uno en cada mano", instructions: "Ofrecerle dos cubos sucesivamente. Debe sostener uno en cada mano." },
    { id: "7m_L33", itemNumber: 33, area: "L", text: "Laleo (reduplicación de sílabas)", instructions: "Observar si dice 'ma-ma', 'da-da' sin significado." },
    { id: "7m_S34", itemNumber: 34, area: "S", text: "Muestra ansiedad ante extraños", instructions: "Observar la reacción del niño ante el examinador." },
    { id: "7m_C35", itemNumber: 35, area: "C", text: "Busca con la vista un objeto que cae", instructions: "Dejar caer un objeto llamativo. Debe buscarlo con la mirada." },
  ],
  "8m": [
    { id: "8m_M36", itemNumber: 36, area: "M", text: "Se arrastra o repta", instructions: "Observar si se desplaza en prono." },
    { id: "8m_M37", itemNumber: 37, area: "M", text: "Se sienta solo firmemente por un minuto", instructions: "Sentar al niño sin apoyo. Debe mantenerse por un minuto, pudiendo inclinarse para jugar." },
    { id: "8m_M38", itemNumber: 38, area: "M", text: "Se pone de pie afirmándose de muebles", instructions: "Observar si se para solo." },
    { id: "8m_C39", itemNumber: 39, area: "C", text: "Usa pinza inferior (rastrillo)", instructions: "Colocar una pastilla pequeña. Debe intentar cogerla con un movimiento de rastrillo de los dedos." },
    { id: "8m_L40", itemNumber: 40, area: "L", text: "Responde a su nombre", instructions: "Llamarlo por su nombre. Debe girarse o responder." },
  ],
  "9m": [
    { id: "9m_M41", itemNumber: 41, area: "M", text: "Camina afirmado de los muebles", instructions: "Observar si se desplaza lateralmente apoyado en muebles." },
    { id: "9m_M42", itemNumber: 42, area: "M", text: "Gatea", instructions: "Observar si se desplaza en cuatro puntos." },
    { id: "9m_C43", itemNumber: 43, area: "C", text: "Usa pinza fina (pulgar e índice)", instructions: "Colocar una pastilla pequeña. Debe cogerla usando el pulgar y el índice." },
    { id: "9m_C44", itemNumber: 44, area: "C", text: "Busca un objeto escondido", instructions: "Cubrir un juguete con un pañal. El niño debe buscarlo." },
    { id: "9m_S45", itemNumber: 45, area: "S", text: "Dice adiós con la mano (imitando)", instructions: "El examinador dice adiós con la mano. El niño debe imitarlo." },
  ],
  "10m": [
    { id: "10m_C46", itemNumber: 46, area: "C", text: "Junta dos cubos en la línea media", instructions: "Darle dos cubos, uno en cada mano. Debe ser capaz de golpearlos entre sí." },
    { id: "10m_S47", itemNumber: 47, area: "S", text: "Muestra un juguete a su madre sin entregarlo", instructions: "Observación espontánea." },
    { id: "10m_C48", itemNumber: 48, area: "C", text: "Saca objetos de un recipiente", instructions: "Poner cubos en un vaso y pedirle que los saque." },
    { id: "10m_C49", itemNumber: 49, area: "C", text: "Introduce objetos en un recipiente", instructions: "Darle cubos y un recipiente y pedirle que los meta." },
    { id: "10m_L50", itemNumber: 50, area: "L", text: "Entiende el 'no'", instructions: "Decir 'no' firmemente cuando intenta hacer algo prohibido. Debe detenerse." },
  ],
  "12m": [
    { id: "12m_M51", itemNumber: 51, area: "M", text: "Da algunos pasos solo", instructions: "Observar si camina algunos pasos sin apoyo." },
    { id: "12m_C52", itemNumber: 52, area: "C", text: "Hace una torre de dos cubos", instructions: "Mostrarle cómo hacer una torre. Debe imitarlo." },
    { id: "12m_M53", itemNumber: 53, area: "M", text: "Se pone de pie solo", instructions: "Observar si puede pararse sin afirmarse." },
    { id: "12m_S54", itemNumber: 54, area: "S", text: "Juega a la pelota (la empuja o la tira)", instructions: "Hacer rodar una pelota hacia él. Debe responder empujándola o tirándola." },
    { id: "12m_L55", itemNumber: 55, area: "L", text: "Dice 2-3 palabras con significado", instructions: "Preguntar a la madre." },
  ],
  "15m": [
    { id: "15m_M56", itemNumber: 56, area: "M", text: "Sube escaleras gateando", instructions: "Ponerlo frente a una escalera." },
    { id: "15m_C57", itemNumber: 57, area: "C", text: "Hace una torre de 3 cubos", instructions: "Mostrarle cómo hacer una torre." },
    { id: "15m_C58", itemNumber: 58, area: "C", text: "Garabatea espontáneamente", instructions: "Darle papel y lápiz. Debe hacer trazos." },
    { id: "15m_C59", itemNumber: 59, area: "C", text: "Introduce una pastilla en una botella", instructions: "Mostrar cómo hacerlo y pedirle que lo repita." },
    { id: "15m_L60", itemNumber: 60, area: "L", text: "Señala 2-3 partes de su cuerpo", instructions: "Preguntarle '¿dónde está tu nariz?', etc." },
  ],
  "18m": [
    { id: "18m_S61", itemNumber: 61, area: "S", text: "Ayuda en tareas simples del hogar (imitando)", instructions: "Observar si imita acciones como barrer o limpiar." },
    { id: "18m_M62", itemNumber: 62, area: "M", text: "Corre (rígidamente)", instructions: "Observar su desplazamiento rápido." },
    { id: "18m_M63", itemNumber: 63, area: "M", text: "Lanza una pelota", instructions: "Darle una pelota y pedirle que la tire." },
    { id: "18m_C64", itemNumber: 64, area: "C", text: "Pasa las páginas de un libro (varias a la vez)", instructions: "Darle un libro de cartón." },
    { id: "18m_C65", itemNumber: 65, area: "C", text: "Construye una torre de 4-5 cubos", instructions: "Darle los cubos." },
  ],
  "21m": [
    { id: "21m_L66", itemNumber: 66, area: "L", text: "Usa frases de dos palabras (ej. 'mamá pan')", instructions: "Observación o preguntar a la madre." },
    { id: "21m_L67", itemNumber: 67, area: "L", text: "Nombra 2-3 objetos en una lámina", instructions: "Mostrarle una lámina y preguntar '¿qué es esto?'." },
    { id: "21m_C68", itemNumber: 68, area: "C", text: "Construye una torre de 6-7 cubos", instructions: "Darle los cubos." },
    { id: "21m_L69", itemNumber: 69, area: "L", text: "Sigue una orden de dos pasos", instructions: "Ej. 'Toma el cubo y pónlo en la caja'." },
    { id: "21m_S70", itemNumber: 70, area: "S", text: "Se quita alguna prenda de vestir", instructions: "Observar si se saca los zapatos, calcetines o gorro." },
  ],
  "24m": [
    { id: "24m_M71", itemNumber: 71, area: "M", text: "Salta con ambos pies", instructions: "Mostrarle cómo saltar." },
    { id: "24m_L72", itemNumber: 72, area: "L", text: "Usa pronombres (yo, tú, mi)", instructions: "Observación espontánea." },
    { id: "24m_S73", itemNumber: 73, area: "S", text: "Usa la cuchara correctamente", instructions: "Observar durante la comida." },
    { id: "24m_L74", itemNumber: 74, area: "L", text: "Nombra 4-5 objetos en una lámina", instructions: "Mostrar una lámina y preguntar '¿qué es esto?'." },
    { id: "24m_C75", itemNumber: 75, area: "C", text: "Imita un trazo vertical", instructions: "Hacer una línea vertical y pedirle que la copie." },
  ]
};

// Fuente: Anexo 5, Norma Técnica para la supervisión de niños y niñas de 0 a 9 años en la APS.
export const EEDP_PROFILE_REQUIREMENTS: EEDPProfileData = {
  "1m": { M: [[3, 5]], C: [[4]], S: [[1]], L: [[2]] },
  "2m": { M: [[9]], C: [[8]], S: [[6]], L: [[7]] },
  "3m": { M: [[14]], C: [[13]], S: [[11]], L: [[12]] },
  "4m": { M: [[18]], C: [[16, 17]], S: [[20]], L: [[15]] },
  "5m": { M: [[24, 25]], C: [[22, 23]], S: [[21]] },
  "6m": { M: [[26]], C: [[27, 28, 29]], S: [[30]] },
  "7m": { M: [[31]], C: [[32]], S: [[34]], L: [[33]] },
  "8m": { M: [[36, 37, 38]], C: [[39]], L: [[40]] },
  "9m": { M: [[41, 42]], C: [[43, 44]], S: [[45]] },
  "10m": { C: [[46, 48, 49]], S: [[47]], L: [[50]] },
  "12m": { M: [[51, 53]], C: [[52]], S: [[54]], L: [[55]] },
  "15m": { M: [[56]], C: [[57, 58, 59]], L: [[60]] },
  "18m": { M: [[62, 63]], C: [[64, 65]], S: [[61]] },
  "21m": { C: [[68]], S: [[70]], L: [[66, 67, 69]] },
  "24m": { M: [[71]], C: [[75]], S: [[73]], L: [[72, 74]] },
};
