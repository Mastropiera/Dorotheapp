
import type { TriviaQuestion } from './types';

// Banco de preguntas para la sección de Trivia.
export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 'invisibilidad-1',
    text: 'Un obstáculo recurrente en la presentación de los resultados de la investigación en salud, ha sido la asunción, como norma, de que las mujeres presentan la misma situación que los hombres. A esto se le conoce como:',
    options: [
      { text: 'Efecto Matilda.', isCorrect: false },
      { text: 'Paradigma de Invisibilidad.', isCorrect: true },
      { text: 'Dobles estándares.', isCorrect: false },
      { text: 'Techo de cristal.', isCorrect: false },
    ],
    explanation: 'El Paradigma de Invisibilidad se refiere a la tendencia en la investigación y la medicina a considerar el cuerpo masculino como el estándar, asumiendo que los resultados son aplicables a las mujeres sin considerar las diferencias biológicas y sociales, lo que puede llevar a diagnósticos erróneos o tratamientos ineficaces.'
  },
  {
    id: 'hand-hygiene-1',
    text: '¿Cuántos son los momentos para la higiene de manos según la OMS?',
    options: [
      { text: '3 momentos.', isCorrect: false },
      { text: '5 momentos.', isCorrect: true },
      { text: '2 momentos.', isCorrect: false },
      { text: '10 momentos.', isCorrect: false },
    ],
    explanation: 'La OMS define 5 momentos clave para la higiene de manos en la atención sanitaria para prevenir infecciones: antes del contacto con el paciente, antes de una tarea limpia/aséptica, después del riesgo de exposición a fluidos corporales, después del contacto con el paciente y después del contacto con el entorno del paciente.'
  },
  {
    id: 'farmaco-2',
    text: '¿Cuál de los siguientes fármacos es el antídoto específico para la intoxicación por benzodiacepinas?',
    options: [
      { text: 'Naloxona.', isCorrect: false },
      { text: 'Flumazenil.', isCorrect: true },
      { text: 'Atropina.', isCorrect: false },
      { text: 'N-acetilcisteína.', isCorrect: false },
    ],
    explanation: 'El Flumazenil es un antagonista de los receptores de benzodiacepinas y se utiliza para revertir sus efectos sedantes en casos de sobredosis o para finalizar la anestesia.'
  },
  {
    id: 'vital-signs-1',
    text: '¿Cuál es el rango normal de frecuencia cardíaca en reposo para un adulto sano?',
    options: [
      { text: '40-60 latidos por minuto.', isCorrect: false },
      { text: '100-120 latidos por minuto.', isCorrect: false },
      { text: '60-100 latidos por minuto.', isCorrect: true },
      { text: '120-140 latidos por minuto.', isCorrect: false },
    ],
    explanation: 'Para un adulto sano en reposo, el rango normal de frecuencia cardíaca se considera entre 60 y 100 latidos por minuto (lpm).'
  },
  {
    id: 'nightingale-1',
    text: '¿A qué figura histórica de la enfermería se le atribuye la creación del primer modelo conceptual de enfermería y la fundación de la enfermería moderna?',
    options: [
      { text: 'Virginia Henderson.', isCorrect: false },
      { text: 'Florence Nightingale.', isCorrect: true },
      { text: 'Hildegard Peplau.', isCorrect: false },
      { text: 'Dorothea Orem.', isCorrect: false },
    ],
    explanation: 'Florence Nightingale es considerada la fundadora de la enfermería moderna. Su trabajo durante la Guerra de Crimea y su libro "Notas sobre Enfermería" sentaron las bases de la profesión, enfatizando la importancia del entorno y la higiene.'
  },
  {
    id: 'orem-1',
    text: '¿Cuál de las siguientes teóricas de enfermería es conocida por su "Teoría del Autocuidado"?',
    options: [
      { text: 'Virginia Henderson.', isCorrect: false },
      { text: 'Hildegard Peplau.', isCorrect: false },
      { text: 'Dorothea Orem.', isCorrect: true },
      { text: 'Madeleine Leininger.', isCorrect: false },
    ],
    explanation: 'La Teoría del Déficit de Autocuidado de Dorothea Orem se centra en la capacidad del individuo para realizar su propio cuidado. La enfermería actúa cuando la persona es incapaz de cuidarse por sí misma.'
  },
  {
    id: 'labs-1',
    text: '¿Cuál es el rango normal de potasio (K+) en sangre para un adulto?',
    options: [
      { text: '2.5-3.5 mEq/L', isCorrect: false },
      { text: '3.5-5.0 mEq/L', isCorrect: true },
      { text: '5.0-6.5 mEq/L', isCorrect: false },
      { text: '1.5-2.5 mEq/L', isCorrect: false },
    ],
    explanation: 'El rango normal de potasio sérico en adultos es aproximadamente de 3.5 a 5.0 mEq/L. Valores fuera de este rango pueden causar arritmias cardíacas y debilidad muscular.'
  },
  {
    id: 'vital-signs-2',
    text: 'Una presión arterial de 135/85 mmHg en un adulto se clasifica como:',
    options: [
      { text: 'Normal', isCorrect: false },
      { text: 'Hipertensión Etapa 1', isCorrect: true },
      { text: 'Hipotensión', isCorrect: false },
      { text: 'Hipertensión Etapa 2', isCorrect: false },
    ],
    explanation: 'Según las guías de la AHA/ACC, la presión arterial entre 130-139 mmHg de sistólica u 80-89 mmHg de diastólica se clasifica como Hipertensión Etapa 1.'
  },
  {
    id: 'farmaco-3',
    text: '¿Cuál es el principal mecanismo de acción de la Aspirina (Ácido Acetilsalicílico) como antiagregante plaquetario?',
    options: [
      { text: 'Bloqueo de los receptores de ADP.', isCorrect: false },
      { text: 'Inhibición reversible de la enzima COX-1.', isCorrect: false },
      { text: 'Inhibición irreversible de la enzima COX-1.', isCorrect: true },
      { text: 'Bloqueo de la glucoproteína IIb/IIIa.', isCorrect: false },
    ],
    explanation: 'La aspirina inhibe de forma irreversible la ciclooxigenasa-1 (COX-1) en las plaquetas, lo que impide la formación de tromboxano A2, un potente promotor de la agregación plaquetaria. Este efecto dura toda la vida de la plaqueta (7-10 días).'
  },
  {
    id: 'scales-1',
    text: '¿Qué evalúa principalmente la Escala de Coma de Glasgow (GCS)?',
    options: [
      { text: 'El riesgo de caídas en adultos mayores.', isCorrect: false },
      { text: 'El nivel de conciencia.', isCorrect: true },
      { text: 'El riesgo de úlceras por presión.', isCorrect: false },
      { text: 'La severidad de un accidente cerebrovascular.', isCorrect: false },
    ],
    explanation: 'La Escala de Coma de Glasgow es una herramienta neurológica diseñada para evaluar de manera objetiva el nivel de conciencia de una persona después de un traumatismo craneoencefálico, a través de la evaluación de la respuesta ocular, verbal y motora.'
  },
  {
    id: 'lme-1',
    text: 'Juanito, lactante de cuatro meses, es traído por su madre a control de salud infantil. Es una guagua activa y sonriente. Se alimenta con LME a libre demanda. Al examen físico no se observan alteraciones, pero la evaluación antropométrica muestra: PE +1, TE +1, PT +2. ¿Cuál de las siguientes afirmaciones es correcta?',
    options: [
      { text: 'Juanito presenta obesidad. Derivar a nutricionista lo antes posible. Indicar a la madre poner horarios a la lactancia.', isCorrect: false },
      { text: 'Juanito es un niño grande para su edad, y su peso está por sobre la media para su talla, pero esto es normal y fisiológico en lactantes con LME. Felicita a la madre por mantener LME y cita al control nutricional de los cinco meses.', isCorrect: true },
      { text: 'Si bien Juanito se ve muy saludable, es necesario prevenir que la obesidad se mantenga porque puede traer graves daños a futuro. Es necesario reducir gradualmente la frecuencia y duración de las tomas. Además pronto iniciará alimentación complementaria, podrá reemplazar la LME por comidas menos calóricas.', isCorrect: false },
    ],
    explanation: 'Un lactante alimentado con Lactancia Materna Exclusiva (LME) puede presentar un P/T de hasta +2 DE considerándose una variante normal. No se debe restringir la lactancia. La conducta correcta es felicitar, educar y controlar según calendario. La obesidad se diagnostica con P/T > +3 DE, o >+2 DE en niños alimentados con fórmula.'
  },
  {
    id: 'cpr-dea-1',
    text: 'Después de administrar una descarga con un DEA, debes:',
    options: [
      { text: 'Iniciar la RCP, empezando con compresiones torácicas.', isCorrect: true },
      { text: 'Comprobar el pulso', isCorrect: false },
      { text: 'Dar una respiración de rescate', isCorrect: false },
      { text: 'Dejar que el DEA vuelva a analizar el ritmo', isCorrect: false },
    ],
    explanation: 'Inmediatamente después de una descarga, es crucial reanudar las compresiones torácicas para minimizar las interrupciones en el flujo sanguíneo al cerebro y al corazón. El DEA indicará cuándo volver a analizar el ritmo, generalmente después de 2 minutos de RCP.'
  },
  {
    id: 'cpr-ratio-1',
    text: 'Durante la RCP sin un dispositivo avanzado para la vía aérea, la relación compresión-ventilación es:',
    options: [
      { text: '5:1', isCorrect: false },
      { text: '30:2', isCorrect: true },
      { text: '10:1', isCorrect: false },
      { text: '20:2', isCorrect: false },
    ],
    explanation: 'Para adultos, la relación compresión-ventilación recomendada por las guías internacionales (AHA, ERC) es de 30 compresiones seguidas de 2 ventilaciones. Esto se aplica tanto para un reanimador como para dos, siempre que no se disponga de un dispositivo avanzado para la vía aérea.'
  },
  {
    id: 'cpr-advanced-airway-1',
    text: 'Durante la RCP después de colocar un dispositivo avanzado para la vía aérea, ¿cuál de las siguientes afirmaciones es verdadera?',
    options: [
      { text: 'Las respiraciones deben estar sincronizadas con las compresiones torácicas.', isCorrect: false },
      { text: 'El objetivo es 20 o más respiraciones por minuto.', isCorrect: false },
      { text: 'Las compresiones torácicas deben suspenderse mientras se administran respiraciones.', isCorrect: false },
      { text: 'Se debe administrar una respiración cada 6 segundos.', isCorrect: true },
    ],
    explanation: 'Una vez que se ha colocado un dispositivo avanzado para la vía aérea (como un tubo endotraqueal), las compresiones y las ventilaciones se vuelven asincrónicas. Las compresiones se realizan de forma continua a un ritmo de 100-120 por minuto, y se administra una ventilación cada 6 segundos (10 por minuto) sin pausar las compresiones.'
  },
  {
    id: 'cpr-pcr-presenciado-1',
    text: 'La intervención más importante ante un paro cardíaco repentino presenciado es:',
    options: [
      { text: 'desfibrilación temprana', isCorrect: true },
      { text: 'compresiones torácicas efectivas', isCorrect: false },
      { text: 'activación temprana del SEM', isCorrect: false },
      { text: 'uso rápido de fármacos de reanimación', isCorrect: false },
    ],
    explanation: 'En un paro cardíaco presenciado, la causa más probable es una arritmia ventricular como la Fibrilación Ventricular. La desfibrilación temprana es la única intervención que puede revertirla y es el factor más determinante para la supervivencia. Las compresiones y la activación del SEM son vitales, pero la desfibrilación es prioritaria.'
  },
  {
    id: 'acls-suction-1',
    text: 'Por lo general, los intentos de succión en situaciones de ACLS deben ser:',
    options: [
      { text: 'diez segundos o menos', isCorrect: true },
      { text: '20 segundos o menos', isCorrect: false },
      { text: '5 segundos o menos', isCorrect: false },
      { text: 'no más de 30 segundos', isCorrect: false },
    ],
    explanation: 'Para minimizar la interrupción de las compresiones torácicas y la ventilación durante la reanimación, las guías de ACLS recomiendan que cada intento de succión de la vía aérea no dure más de 10 segundos.'
  },
  {
    id: 'reanimacion-exito-1',
    text: 'El éxito de cualquier intento de reanimación se basa en:',
    options: [
      { text: 'RCP de alta calidad', isCorrect: false },
      { text: 'Desfibrilación cuando lo requiera el ritmo del ECG del paciente.', isCorrect: false },
      { text: 'ni 1 ni 2', isCorrect: false },
      { text: 'tanto 1 como 2', isCorrect: true },
    ],
    explanation: 'El éxito de la reanimación depende de una cadena de supervivencia bien ejecutada, cuyos eslabones fundamentales son la RCP de alta calidad (compresiones efectivas, ventilación adecuada) y la desfibrilación temprana para ritmos desfibrilables. Ambos son cruciales.'
  },
  {
    id: 'developmental-milestones-1',
    text: 'Un niño corre, sube y baja escaleras alternando los pies y es capaz de pedalear en un triciclo. Además dice cerca de 250 palabras, armando frases de 3 a 4 palabras y es capaz de darse a entender con adultos distintos a sus padres, cometiendo pocos errores de lenguaje. La edad aproximada del niño es:',
    options: [
      { text: '12 meses', isCorrect: false },
      { text: '18 meses', isCorrect: false },
      { text: '24 meses', isCorrect: false },
      { text: '36 meses', isCorrect: true },
      { text: '48 meses', isCorrect: false },
    ],
    explanation: 'Los hitos del desarrollo descritos como correr, subir y bajar escaleras alternando pies, pedalear un triciclo, usar frases de 3-4 palabras y tener un vocabulario de aproximadamente 250 palabras son característicos de un niño de 36 meses (3 años).'
  },
  {
    id: 'bronquiolitis-1',
    text: 'Un niño de 6 meses presenta un cuadro de fiebre hasta 38,2°C y tos seca, que evoluciona con dificultad respiratoria. Al examen se observa taquipneico, con retracción intercostal y subcostal y a la auscultación pulmonar se escuchan sibilancias bilaterales difusas. El diagnóstico más probable es:',
    options: [
      { text: 'Neumonía', isCorrect: false },
      { text: 'Asma', isCorrect: false },
      { text: 'Laringitis obstructiva', isCorrect: false },
      { text: 'Bronquiolitis', isCorrect: true },
      { text: 'Bronquitis aguda', isCorrect: false },
    ],
    explanation: 'El cuadro clínico de un lactante menor de 2 años con un pródromo viral que evoluciona a dificultad respiratoria y sibilancias difusas es característico de la bronquiolitis, comúnmente causada por el Virus Respiratorio Sincicial (VRS).'
  },
  {
    id: 'envejecimiento-1',
    text: '¿Cuál de los siguientes cambios no suele aparecer con el envejecimiento normal?',
    options: [
      { text: 'Aumento de la base de sustentación durante la marcha', isCorrect: false },
      { text: 'Disminución de la filtración glomerular', isCorrect: false },
      { text: 'Disminución del hematocrito', isCorrect: true },
      { text: 'Disminución de las horas de sueño', isCorrect: false },
      { text: 'Disminución de la masa muscular', isCorrect: false },
    ],
    explanation: 'Aunque muchos sistemas cambian con la edad (aumento de base de sustentación, disminución de filtración renal, cambios en el sueño, sarcopenia), el hematocrito y los niveles de hemoglobina no suelen disminuir en adultos mayores sanos. Una disminución significativa generalmente indica una patología subyacente y no es parte del envejecimiento normal.'
  }
];
