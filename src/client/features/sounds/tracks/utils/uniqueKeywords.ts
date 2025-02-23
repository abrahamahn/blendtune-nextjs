// src\client\features\sounds\tracks\utils\uniqueKeywords.ts
import { Track } from '@/shared/types/track';

export const uniqueArtists = (tracks: Track[]) => {
  const artistSet = new Set<string>();
  tracks.forEach(track => {
    track.info?.relatedartist?.forEach(combinedArtists => {
      if (combinedArtists) {
        combinedArtists.split(',').forEach(artist => {
          artistSet.add(artist.trim()); // This should handle duplicates
        });
      }
    });
  });

  const uniqueArtistsArray = Array.from(artistSet).sort();
  return uniqueArtistsArray;
};

export const uniqueMoods = (tracks: Track[]) => {
  const moodSet = new Set<string>();
  tracks.forEach(track => {
    track.info?.mood?.forEach(mood => {
      moodSet.add(mood); // This should handle duplicates
    });
  });

  const uniqueMoodsArray = Array.from(moodSet).sort();
  return uniqueMoodsArray;
};

export const uniqueKeywords = (tracks: Track[]) => {
  const keywordSet = new Set<string>();

  // Adding unique artists and moods
  tracks.forEach(track => {
    track.info?.relatedartist?.forEach(artist => {
      if (artist) {
        artist.split(',').forEach(a => keywordSet.add(a.trim()));
      }
    });
    track.info?.mood?.forEach(mood => keywordSet.add(mood));

    // Adding other fields
    if (track.metadata?.producer) keywordSet.add(track.metadata.producer);
    if (track.metadata?.title) keywordSet.add(track.metadata.title);
    track.info?.genre?.forEach(genre => {
      if (genre.maingenre) keywordSet.add(genre.maingenre);
      if (genre.subgenre) keywordSet.add(genre.subgenre);
    });
    track.instruments?.forEach(instrument => {
      if (instrument.main) keywordSet.add(instrument.main);
      if (instrument.sub) keywordSet.add(instrument.sub);
    });
  });

  const uniqueKeywordsArray = Array.from(keywordSet).sort();
  return uniqueKeywordsArray;
};
