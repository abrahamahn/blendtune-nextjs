declare global {
  interface HTMLAudioElement {
    sourceNode?: MediaElementAudioSourceNode;
    analyser?: AnalyserNode;
  }
}
