// src/client/features/sounds/filters/utils/sortLogic.ts
import { Track } from '@/shared/types/track';

export const sortByCriteria = {
  Newest: (a: Track, b: Track) => b.metadata.release.localeCompare(a.metadata.release),
  Oldest: (a: Track, b: Track) => a.metadata.release.localeCompare(b.metadata.release),
  "A-Z": (a: Track, b: Track) =>
    a.metadata.title.localeCompare(b.metadata.title, undefined, { sensitivity: "base" }),
};

export const shuffleArray = <T>(array: T[]): T[] => {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

export const sortTracks = (tracks: Track[], option: string) => {
  const sortedTracks = [...tracks];
  if (option === "Random") {
    return shuffleArray(sortedTracks);
  } else {
    const sortFn = sortByCriteria[option as keyof typeof sortByCriteria];
    if (sortFn) {
      sortedTracks.sort(sortFn);
    }
    return sortedTracks;
  }
};
