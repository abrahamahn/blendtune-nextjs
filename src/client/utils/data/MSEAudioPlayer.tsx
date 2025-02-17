// File: @/client/utils/data/MSEAudioPlayer.tsx
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface MSEAudioPlayerProps {
  audioUrl: string;
  onTimeUpdate: () => void;
  onEnded: () => void;
  onLoadedMetadata: () => void;
  controls?: boolean;
  autoPlay?: boolean;
  preload?: string;
}

const MSEAudioPlayer = forwardRef<HTMLAudioElement, MSEAudioPlayerProps>(
  (
    {
      audioUrl,
      onTimeUpdate,
      onEnded,
      onLoadedMetadata,
      controls = false,
      autoPlay = false,
      preload = "auto",
    },
    ref
  ) => {
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const mediaSourceRef = useRef<MediaSource | null>(null);
    const sourceBufferRef = useRef<SourceBuffer | null>(null);

    // For crossfade via Web Audio API
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const mediaElementSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    // Expose the underlying audio element via ref
    useImperativeHandle(ref, () => localAudioRef.current!);

    // Set up AudioContext and connect the audio element only once.
    useEffect(() => {
      if (localAudioRef.current && !mediaElementSourceRef.current) {
        const context = new AudioContext();
        audioContextRef.current = context;
        // Create the MediaElementSource only if not already created.
        try {
          const source = context.createMediaElementSource(localAudioRef.current);
          mediaElementSourceRef.current = source;
          const gainNode = context.createGain();
          gainNode.gain.value = 1;
          gainNodeRef.current = gainNode;
          source.connect(gainNode).connect(context.destination);
        } catch (error) {
          console.error("Error creating MediaElementSource:", error);
        }
      }
    }, []);

    useEffect(() => {
      const audio = localAudioRef.current;
      if (!audio) return;

      // Fallback: if MediaSource is not supported, use direct URL.
      if (!window.MediaSource) {
        console.warn("MediaSource API not supported. Using direct audio URL.");
        audio.src = audioUrl;
        return;
      }

      const mimeCodec = 'audio/webm; codecs="opus"';
      if (!MediaSource.isTypeSupported(mimeCodec)) {
        console.error(
          `MSE does not support MIME type: ${mimeCodec}. Falling back to direct playback.`
        );
        audio.src = audioUrl;
        return;
      }

      // Create and assign a new MediaSource.
      const mediaSource = new MediaSource();
      mediaSourceRef.current = mediaSource;
      audio.src = URL.createObjectURL(mediaSource);

      const handleSourceOpen = async () => {
        // Wait until the MediaSource's readyState is "open".
        while (mediaSourceRef.current?.readyState !== "open") {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }

        let sourceBuffer;
        try {
          sourceBuffer = mediaSourceRef.current!.addSourceBuffer(mimeCodec);
          sourceBufferRef.current = sourceBuffer;
        } catch (error) {
          console.error("Error adding SourceBuffer, falling back:", error);
          audio.src = audioUrl;
          return;
        }

        // Fetch the audio progressively in chunks.
        await fetchAudioStream(audioUrl, sourceBuffer);

        // When all data has been appended, ensure MediaSource is still open and end the stream.
        if (
          mediaSourceRef.current &&
          mediaSourceRef.current.readyState === "open"
        ) {
          try {
            mediaSourceRef.current.endOfStream();
          } catch (error) {
            console.error("Error ending MediaSource stream:", error);
          }
        }
      };

      mediaSource.addEventListener("sourceopen", handleSourceOpen);

      // Cleanup on unmount or audioUrl change.
      return () => {
        mediaSource.removeEventListener("sourceopen", handleSourceOpen);
        if (audio && audio.src) {
          URL.revokeObjectURL(audio.src);
        }
      };
    }, [audioUrl]);

    // Fetch audio data in chunks using Range requests.
    // Now using a 2 MB chunk size.
    const fetchAudioStream = async (
      url: string,
      sourceBuffer: SourceBuffer
    ) => {
      let start = 0;
      const chunkSize = 1 * 1024 * 1024; // 2 MB
      let isFirstChunk = true;
      const mediaSource = mediaSourceRef.current;

      while (true) {
        try {
          // Check if MediaSource is still open.
          if (!mediaSource || mediaSource.readyState !== "open") {
            console.warn("MediaSource is not open, stopping fetch.");
            break;
          }

          const response = await fetch(url, {
            headers: { Range: `bytes=${start}-${start + chunkSize - 1}` },
          });
          if (!response.ok) break;
          const data = await response.arrayBuffer();
          if (data.byteLength === 0) break;

          if (isFirstChunk) {
            localAudioRef.current?.play().catch(console.error);
            isFirstChunk = false;
          }

          // Apply a brief crossfade effect using the GainNode.
          if (gainNodeRef.current && audioContextRef.current) {
            const now = audioContextRef.current.currentTime;
            // Fade out quickly over 20ms before appending.
            gainNodeRef.current.gain.setValueAtTime(1, now);
            gainNodeRef.current.gain.linearRampToValueAtTime(0, now + 0.01);
          }

          // Wait if the sourceBuffer is still updating.
          if (sourceBuffer.updating) {
            await new Promise((resolve) => {
              sourceBuffer.addEventListener("updateend", resolve, { once: true });
            });
          }

          // Double-check that the MediaSource is still open.
          if (!mediaSource || mediaSource.readyState !== "open") {
            console.warn("MediaSource closed before appending, stopping fetch.");
            break;
          }

          try {
            sourceBuffer.appendBuffer(new Uint8Array(data));
          } catch (error) {
            console.error("Error appending buffer:", error);
            if (localAudioRef.current) {
              localAudioRef.current.src = url;
            }
            break;
          }

          // After appending, restore the gain quickly.
          if (gainNodeRef.current && audioContextRef.current) {
            const now = audioContextRef.current.currentTime;
            gainNodeRef.current.gain.setValueAtTime(0.8, now);
            gainNodeRef.current.gain.linearRampToValueAtTime(1, now + 0.02);
          }

          start += data.byteLength;
        } catch (error) {
          console.error("Error fetching audio chunks:", error);
          break;
        }
      }
    };

    return (
      <audio
        ref={localAudioRef}
        controls={controls}
        autoPlay={autoPlay}
        preload={preload}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        onLoadedMetadata={onLoadedMetadata}
      />
    );
  }
);

MSEAudioPlayer.displayName = "MSEAudioPlayer";

export default MSEAudioPlayer;
