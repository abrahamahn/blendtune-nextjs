// src/client/features/player/visualizer/utils/audioBufferCache.ts

/**
 * Simple LRU cache for decoded audio buffers keyed by URL.
 */
const bufferCache = new Map<string, AudioBuffer>();
const MAX_ENTRIES = 20;

export const getCachedBuffer = (url: string): AudioBuffer | undefined => {
  const existing = bufferCache.get(url);
  if (!existing) return undefined;
  // Bump to most-recent
  bufferCache.delete(url);
  bufferCache.set(url, existing);
  return existing;
};

export const setCachedBuffer = (url: string, buffer: AudioBuffer) => {
  if (bufferCache.has(url)) {
    bufferCache.delete(url);
  }
  bufferCache.set(url, buffer);
  if (bufferCache.size > MAX_ENTRIES) {
    const oldestKey = bufferCache.keys().next().value;
    if (oldestKey) {
        bufferCache.delete(oldestKey);
    }
  }
};
