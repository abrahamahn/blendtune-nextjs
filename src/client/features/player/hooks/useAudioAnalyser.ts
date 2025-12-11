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
  };

  useEffect(() => {
    const audioEl = audioRef.current as ExtendedAudioEl | null;
    if (!audioEl) return;

    const AudioContextClass =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx: AudioContext =
      audioEl.__btAudioCtx || new AudioContextClass();
    const source: MediaElementAudioSourceNode =
      audioEl.__btSource || ctx.createMediaElementSource(audioEl);
    const analyserNode = ctx.createAnalyser();

    // Persist source/context on the element to avoid InvalidStateError on re-use
    audioEl.__btAudioCtx = ctx;
    audioEl.__btSource = source;

    source.connect(analyserNode);
    analyserNode.connect(ctx.destination);

    setAnalyser(analyserNode);

    return () => {
      try {
        source.disconnect();
        analyserNode.disconnect();
      } catch {
        // no-op cleanup guard
      }
      setAnalyser(null);
    };
  }, [audioRef]);

  return analyser;
}
