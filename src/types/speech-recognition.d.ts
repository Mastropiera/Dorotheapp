
interface ISpeechRecognition extends EventTarget {
    continuous: boolean;
    grammars: SpeechGrammarList;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    serviceURI: string;
    onaudioend: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onaudiostart: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundend: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onsoundstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
    abort(): void;
    start(): void;
    stop(): void;
  }
  
  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
    readonly resultIndex: number;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }
  
  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }
  
  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }
  
  interface SpeechRecognitionAlternative {
    readonly confidence: number;
    readonly transcript: string;
  }
  
  interface SpeechGrammarList {
    readonly length: number;
    item(index: number): SpeechGrammar;
    [index: number]: SpeechGrammar;
    addFromString(string: string, weight?: number): void;
    addFromURI(src: string, weight?: number): void;
  }
  
  interface SpeechGrammar {
    src: string;
    weight: number;
  }
  
  interface SpeechRecognitionConstructor {
    new(): ISpeechRecognition;
  }
  
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
