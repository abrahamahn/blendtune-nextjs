// main/apps/web/src/client/features/player/visualizer/utils/waveformRenderer.ts
import { useEffect, useState } from "react";
import { getCachedBuffer, setCachedBuffer } from "./audioBufferCache";

export const BAR_WIDTH = 2;
export const GAP_WIDTH = 1;
const TRANSITION_WIDTH = 5;

export function useWaveformBuffer(audioUrl: string): AudioBuffer | null {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const fetchDataAndDecode = async () => {
      try {
        const cached = getCachedBuffer(audioUrl);
        if (cached) {
          setAudioBuffer(cached);
          return;
        }

        const response = await fetch(audioUrl, { signal: controller.signal });
        const arrayBuffer = await response.arrayBuffer();

        type WindowWithVendorAudio = Window & {
          webkitOfflineAudioContext?: typeof OfflineAudioContext;
          webkitAudioContext?: typeof AudioContext;
        };
        const vendorWindow = window as WindowWithVendorAudio;

        let OfflineAudioContextClass: typeof OfflineAudioContext =
          window.OfflineAudioContext || vendorWindow.webkitOfflineAudioContext!;

        if (!OfflineAudioContextClass) {
          OfflineAudioContextClass = (window.AudioContext ||
            vendorWindow.webkitAudioContext) as unknown as typeof OfflineAudioContext;
        }

        const offlineCtx = new OfflineAudioContextClass(2, 44100 * 600, 44100);
        const decodedBuffer = await offlineCtx.decodeAudioData(arrayBuffer);
        if (cancelled) return;
        setCachedBuffer(audioUrl, decodedBuffer);
        setAudioBuffer(decodedBuffer);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Error loading audio (Waveform):", error);
      }
    };

    void fetchDataAndDecode();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [audioUrl]);

  return audioBuffer;
}

export interface DrawWaveformOptions {
  width: number;
  amplitude: number;
  time: number | undefined;
  trackDuration: number | undefined;
  isDragging: boolean;
  hoverPosition: number;
}

export function drawWaveformBars(
  canvas: HTMLCanvasElement,
  audioBuffer: AudioBuffer,
  options: DrawWaveformOptions,
): void {
  const { width, amplitude, time, trackDuration, isDragging, hoverPosition } =
    options;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const numBars = Math.floor((width + GAP_WIDTH) / (BAR_WIDTH + GAP_WIDTH));
  if (numBars <= 0) return;

  canvas.width = width;
  canvas.height = 50;
  const data = audioBuffer.getChannelData(0);
  const sampleSize = Math.floor(data.length / numBars);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const styles = getComputedStyle(canvas);
  const waveTop = styles.getPropertyValue("--bt-wave-top").trim();
  const waveBottom = styles.getPropertyValue("--bt-wave-bottom").trim();
  const unplayedColor = styles.getPropertyValue("--ui-color-border").trim();

  const playbackPosition = ((time ?? 0) / (trackDuration || 1)) * canvas.width;
  const highlightStart = Math.min(hoverPosition, playbackPosition);
  const highlightEnd = Math.max(hoverPosition, playbackPosition);

  for (let i = 0; i < numBars; i++) {
    let sumSquared = 0;
    for (let j = 0; j < sampleSize; j++) {
      const sample = data[i * sampleSize + j] || 0;
      sumSquared += sample * sample;
    }
    const rms = Math.sqrt(sumSquared / sampleSize);
    const baseBarHeight = rms * amplitude * canvas.height * 6;
    const offsetY = (canvas.height - baseBarHeight) / 2;
    const barX = i * (BAR_WIDTH + GAP_WIDTH);

    const playedFill = ctx.createLinearGradient(
      0,
      offsetY,
      0,
      offsetY + baseBarHeight,
    );
    playedFill.addColorStop(0, waveTop);
    playedFill.addColorStop(1, waveBottom);

    const fillBar = (fill: string | CanvasGradient, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = fill;
      ctx.fillRect(barX, offsetY, BAR_WIDTH, baseBarHeight);
      ctx.globalAlpha = 1;
    };

    if (isDragging && barX >= highlightStart && barX < highlightEnd) {
      fillBar(playedFill, 0.5);
    } else if (barX < playbackPosition - TRANSITION_WIDTH) {
      fillBar(playedFill);
    } else if (barX < playbackPosition) {
      fillBar(unplayedColor);
      fillBar(playedFill, (playbackPosition - barX) / TRANSITION_WIDTH);
    } else {
      fillBar(unplayedColor);
    }
  }
}
