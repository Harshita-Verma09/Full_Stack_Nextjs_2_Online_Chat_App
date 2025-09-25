// // File: src/types/speech.d.ts
// declare interface SpeechRecognitionEvent extends Event {
//   readonly results: SpeechRecognitionResultList;
// }

// declare class SpeechRecognition extends EventTarget {
//   continuous: boolean;
//   interimResults: boolean;
//   lang: string;
//   onresult:
//     | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
//     | null;
//   onend: (() => void) | null;
//   start(): void;
//   stop(): void;
// }

// declare class webkitSpeechRecognition extends SpeechRecognition {}

// src/types/speech.d.ts

// src/types/speech.d.ts
interface SpeechRecognitionResult {
  0: { transcript: string; confidence: number };
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

declare interface SpeechRecognitionEvent extends Event {
  resultIndex: number; //  add resultIndex
  readonly results: SpeechRecognitionResultList; //  results
}

declare class SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

declare class webkitSpeechRecognition extends SpeechRecognition {}
