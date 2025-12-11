// src/client/features/player/hooks/useAudioAnalyser.ts
/**
 * Shared analyser setup to avoid duplicating MediaElementAudioSource wiring.
 */
import { RefObject, useEffect, useState } from "react";

export function useAudioAnalyser(
  audioRef: RefObject<HTMLAudioElement | null>
): AnalyserNode | null {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  type ExtendedAudioEl = HTMLAudioElement & {
    __btAudioCtx?: AudioContext;
    __btSource?: MediaElementAudioSourceNode;
    __btAnalyser?: AnalyserNode;
  };

  useEffect(() => {
    const audioEl = audioRef.current as ExtendedAudioEl | null;
    if (!audioEl) return;

    if (audioEl.__btAnalyser) {
      setAnalyser(audioEl.__btAnalyser);
      return;
    }

    const AudioContextClass =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx: AudioContext =
      audioEl.__btAudioCtx || new AudioContextClass();
    const source: MediaElementAudioSourceNode =
      audioEl.__btSource || ctx.createMediaElementSource(audioEl);
    const analyserNode = ctx.createAnalyser();

    // Persist source/context/analyser on the element
    audioEl.__btAudioCtx = ctx;
    audioEl.__btSource = source;
    audioEl.__btAnalyser = analyserNode;

    source.connect(analyserNode);
    analyserNode.connect(ctx.destination);

    setAnalyser(analyserNode);

    // No cleanup: persist the graph for the lifecycle of the audio element
  }, [audioRef]);

  return analyser;
}
