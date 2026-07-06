declare global {
  interface HTMLAudioElement {
    sourceNode?: MediaElementAudioSourceNode;
    analyser?: AnalyserNode;
  }
}

// node-cron ships no type declarations; declare it as untyped (matches the prior require()).
declare module 'node-cron';
