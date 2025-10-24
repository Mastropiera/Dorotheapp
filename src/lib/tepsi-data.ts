
// src/lib/tepsi-data.ts
import type { TEPSIData } from './types/assessments';

// Fuente: Norma Técnica para la supervisión de niños y niñas de 0 a 9 años en la Atención Primaria de Salud, MINSAL 2014, Anexo 6
// Páginas 34, 35, 36.

export const TEPSI_DATA: TEPSIData = {
  coordinacion: [
    { id: "c1", itemNumber: 1, text: "Traslada agua de un vaso a otro sin derramar.", instructions: "Materiales: Dos vasos y agua. Un vaso se llena con agua. Instrucción: 'Cambia toda el agua a este otro vaso, sin botar nada'." },
    { id: "c2", itemNumber: 2, text: "Construye un puente con 3 cubos con un modelo presente.", instructions: "Materiales: 3 cubos. Se construye un puente y se le pide al niño: 'Haz uno igual a este'." },
    { id: "c3", itemNumber: 3, text: "Copia una línea recta.", instructions: "Materiales: Lápiz y papel. Se dibuja una línea y se le dice: 'Haz una igual a esta'." },
    { id: "c4", itemNumber: 4, text: "Copia un círculo.", instructions: "Materiales: Lápiz y papel. Se dibuja un círculo y se le dice: 'Dibuja uno igual a este'." },
    { id: "c5", itemNumber: 5, text: "Copia una cruz.", instructions: "Materiales: Lápiz y papel. Se dibuja una cruz y se le dice: 'Dibuja una igual a esta'." },
    { id: "c6", itemNumber: 6, text: "Copia un triángulo.", instructions: "Materiales: Lápiz y papel. Se dibuja un triángulo y se le dice: 'Dibuja uno igual a este'." },
    { id: "c7", itemNumber: 7, text: "Copia un cuadrado.", instructions: "Materiales: Lápiz y papel. Se dibuja un cuadrado y se le dice: 'Dibuja uno igual a este'." },
    { id: "c8", itemNumber: 8, text: "Dibuja 9 o más cubos.", instructions: "Materiales: Lápiz y papel. Se le pide al niño: 'Dibuja todos los cubos que puedas'." },
    { id: "c9", itemNumber: 9, text: "Dibuja una figura humana (cabeza y tronco).", instructions: "Materiales: Lápiz y papel. Se le pide: 'Dibuja una persona'." },
    { id: "c10", itemNumber: 10, text: "Dibuja una figura humana (cabeza, tronco, brazos/piernas).", instructions: "Materiales: Lápiz y papel. Se le pide: 'Dibuja una persona'." },
    { id: "c11", itemNumber: 11, text: "Dibuja una figura humana (6 partes).", instructions: "Materiales: Lápiz y papel. Se le pide: 'Dibuja una persona'." },
    { id: "c12", itemNumber: 12, text: "Dibuja una figura humana (8 partes).", instructions: "Materiales: Lápiz y papel. Se le pide: 'Dibuja una persona'." },
    { id: "c13", itemNumber: 13, text: "Ordena por tamaño (el más grande primero).", instructions: "Materiales: Tablero con barras de diferente tamaño. Se le dice: 'Ordena estas barras de la más grande a la más chica'." },
    { id: "c14", itemNumber: 14, text: "Ordena por tamaño (el más chico primero).", instructions: "Materiales: Tablero con barras de diferente tamaño. Se le dice: 'Ahora ordena estas barras de la más chica a la más grande'." },
    { id: "c15", itemNumber: 15, text: "Desata un nudo.", instructions: "Materiales: Cordón con un nudo. Se le dice: 'Desata este nudo'." },
    { id: "c16", itemNumber: 16, text: "Abotona.", instructions: "Materiales: Estuche con botones. Se le pide: 'Abotona estos botones'." }
  ],
  lenguaje: [
    { id: "l1", itemNumber: 1, text: "Reconoce grande y chico.", instructions: "Materiales: Dos cuadrados de cartón. Preguntar: 'Muéstrame el cuadrado grande', 'Muéstrame el chico'." },
    { id: "l2", itemNumber: 2, text: "Reconoce más y menos.", instructions: "Materiales: Dos grupos de fichas. Preguntar: '¿Dónde hay más fichas?', '¿Dónde hay menos?'." },
    { id: "l3", itemNumber: 3, text: "Nombra animales.", instructions: "Materiales: Lámina con dibujos de animales. Preguntar: '¿Qué es esto?' para pato, perro y chancho." },
    { id: "l4", itemNumber: 4, text: "Nombra objetos.", instructions: "Materiales: Lámina con dibujos de objetos. Preguntar: '¿Qué es esto?' para paraguas, vela, escoba, tetera y zapato." },
    { id: "l5", itemNumber: 5, text: "Reconoce colores.", instructions: "Materiales: Papeles lustre. Preguntar: 'Nombra este color' para rojo, azul y amarillo." },
    { id: "l6", itemNumber: 6, text: "Define palabras.", instructions: "Preguntar: '¿Qué es una cuchara?', '¿Qué es una silla?', '¿Qué es una casa?', '¿Qué es una manzana?', '¿Qué es un abrigo?'." },
    { id: "l7", itemNumber: 7, text: "Sabe para qué sirven las cosas.", instructions: "Preguntar: '¿Para qué sirve una cuchara?', '¿Para qué sirve un lápiz?', '¿Para qué sirve un jabón?', '¿Para qué sirve una escoba?', '¿Para qué sirve una cama?', '¿Para qué sirve una tijera?'." },
    { id: "l8", itemNumber: 8, text: "Maneja conceptos espaciales.", instructions: "Preguntar: '¿Qué haces cuando tienes frío?', '¿Qué haces cuando tienes hambre?', '¿Qué haces cuando estás cansado?'." },
    { id: "l9", itemNumber: 9, text: "Comprende preposiciones.", instructions: "Materiales: Lápiz. Pedir: 'Pon el lápiz detrás de la silla', 'Pon el lápiz sobre la mesa'." },
    { id: "l10", itemNumber: 10, text: "Da respuestas coherentes a situaciones planteadas.", instructions: "Preguntar: '¿Qué harías si se te pierde un zapato en la calle?'." },
    { id: "l11", itemNumber: 11, text: "Verbaliza su nombre y apellido.", instructions: "Preguntar: '¿Cómo te llamas tú?'." },
    { id: "l12", itemNumber: 12, text: "Identifica su sexo.", instructions: "Preguntar: '¿Eres hombre o mujer?'." },
    { id: "l13", itemNumber: 13, text: "Conoce el nombre de sus padres.", instructions: "Preguntar: '¿Cómo se llama tu mamá?', '¿Cómo se llama tu papá?'." },
    { id: "l14", itemNumber: 14, text: "Da el nombre de tres objetos.", instructions: "Señalar la silla, la mesa y la puerta y preguntar: '¿Cómo se llama esto?'." },
    { id: "l15", itemNumber: 15, text: "Describe una lámina.", instructions: "Materiales: Lámina con una escena. Preguntar: '¿Qué ves en esta lámina?'." },
    { id: "l16", itemNumber: 16, text: "Reconoce absurdos.", instructions: "Materiales: Lámina con absurdos. Preguntar: '¿Qué está malo en este dibujo?'." },
    { id: "l17", itemNumber: 17, text: "Usa plurales.", instructions: "Materiales: Lámina. Mostrar un pájaro y preguntar qué es. Luego mostrar dos y preguntar qué son." },
    { id: "l18", itemNumber: 18, text: "Reconoce antes y después.", instructions: "Materiales: Lámina. Contar una historia y preguntar: '¿Qué pasó antes?', '¿Qué pasó después?'." },
    { id: "l19", itemNumber: 19, text: "Relata experiencias personales.", instructions: "Preguntar: 'Cuéntame algo que hiciste ayer'." },
    { id: "l20", itemNumber: 20, text: "Da respuestas a situaciones.", instructions: "Preguntar: '¿Qué harías si se te rompe un vaso?'." },
    { id: "l21", itemNumber: 21, text: "Identifica absurdos verbales.", instructions: "Decir: 'Un pajarito me dijo que...' y preguntar '¿Puede ser eso?'." },
    { id: "l22", itemNumber: 22, text: "Comprende una analogía.", instructions: "Preguntar: 'El fuego es caliente y el hielo es...'." },
    { id: "l23", itemNumber: 23, text: "Comprende una negación.", instructions: "Decir: 'Juan no es mi hermano' y preguntar '¿Qué es Juan para mí?'." },
    { id: "l24", itemNumber: 24, text: "Comprende una pregunta.", instructions: "Preguntar: '¿Por qué nos lavamos las manos?'." }
  ],
  motricidad: [
    { id: "m1", itemNumber: 1, text: "Salta con los pies juntos en el mismo lugar.", instructions: "Pedir al niño: 'Salta con los dos pies juntos como un conejo'." },
    { id: "m2", itemNumber: 2, text: "Camina 10 pasos llevando un vaso lleno de agua.", instructions: "Materiales: Vaso y agua. Pedir: 'Camina con este vaso de agua hasta allá sin botar el agua'." },
    { id: "m3", itemNumber: 3, text: "Lanza una pelota en una dirección determinada.", instructions: "Materiales: Pelota. Decir: 'Tírame la pelota a mí'." },
    { id: "m4", itemNumber: 4, text: "Se para en un pie sin apoyo por 1 segundo.", instructions: "Mostrar cómo hacerlo y decir: 'Párate en un pie igual que yo'." },
    { id: "m5", itemNumber: 5, text: "Se para en un pie sin apoyo por 5 segundos o más.", instructions: "Mostrar cómo hacerlo y decir: 'Párate en un pie igual que yo'." },
    { id: "m6", itemNumber: 6, text: "Se para en un pie sin apoyo por 10 segundos o más.", instructions: "Mostrar cómo hacerlo y decir: 'Párate en un pie igual que yo'." },
    { id: "m7", itemNumber: 7, text: "Salta 20 cm con los pies juntos.", instructions: "Marcar una línea de 20 cm y decir: 'Salta de aquí hasta allá con los dos pies juntos'." },
    { id: "m8", itemNumber: 8, text: "Salta en un pie tres o más veces.", instructions: "Pedir: 'Salta en un pie tres veces seguidas'." },
    { id: "m9", itemNumber: 9, text: "Coge una pelota.", instructions: "Lanzar una pelota al niño/a para que la coja." },
    { id: "m10", itemNumber: 10, text: "Camina en punta de pies 5 o más pasos.", instructions: "Pedir: 'Camina en la punta de los pies'." },
    { id: "m11", itemNumber: 11, text: "Se para en un pie alternadamente.", instructions: "Pedir: 'Párate en un pie y después en el otro'." },
    { id: "m12", itemNumber: 12, text: "Salta un obstáculo.", instructions: "Poner un obstáculo y decir: 'Salta por encima de esto sin tocarlo'." }
  ]
};
