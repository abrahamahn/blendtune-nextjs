import { Track } from '@/types/track';

export const tempoFilter = (track: Track, minTempo: number, maxTempo: number, includeHalfTime: boolean, includeDoubleTime: boolean) => {
  return (!isNaN(parseFloat(track.info.bpm)) &&
          ((parseFloat(track.info.bpm) >= minTempo &&
            parseFloat(track.info.bpm) <= maxTempo) ||
            (includeHalfTime &&
              parseFloat(track.info.bpm) >= minTempo / 2 &&
              parseFloat(track.info.bpm) <= maxTempo / 2) ||
            (includeDoubleTime &&
              parseFloat(track.info.bpm) >= minTempo * 2 &&
              parseFloat(track.info.bpm) <= maxTempo * 2))) ||
        (minTempo === 40 && maxTempo === 200);
}

export const keyFilter = (track: Track, keyFilterCombinations: Array<{
  key: string | null;
  'key.note': string | null;
  'key.scale': string | null;
}>) => {
  return keyFilterCombinations.length === 0 ||
        keyFilterCombinations.some(combination => {
          const { 'key.note': note, 'key.scale': scale } = combination || {};
          const passes =
            track.info.key.note === note && track.info.key.scale === scale;
          return passes;
        });
}

export const categoryFilter = (track: Track, selectedCategory: string) => {
  if (selectedCategory === 'All') {
    return true;
  } else {
    return track.info.genre.some(g => 
      g.maingenre === selectedCategory || 
      (g.subgenre && g.subgenre.includes(selectedCategory))
    );
  }
};

export const genreFilter = (track: Track, selectedGenres: string[]) => {
  const selectedGenresEmpty = selectedGenres.length === 0;
  return selectedGenresEmpty || selectedGenres.some(genre => {
    return track.info.genre.some(
      g => g.maingenre === genre || (g.subgenre && g.subgenre.includes(genre))
    );
  });
};

export const artistFilter = (track: Track, selectedArtists: string[]) => {
  const selectedArtistsEmpty = selectedArtists.length === 0;
  return selectedArtistsEmpty || selectedArtists.some(artist => {
    return track.info.relatedartist.includes(artist);
  });
};

export const instrumentFilter = (track: Track, selectedInstruments: string[]) => {
  const selectedInstrumentsEmpty = selectedInstruments.length === 0;
  return selectedInstrumentsEmpty || selectedInstruments.some(instrument => {
    return track.instruments.some(instr => instr.main === instrument);
  });
};

export const moodFilter = (track: Track, selectedMoods: string[]) => {
  const selectedMoodsEmpty = selectedMoods.length === 0;
  return selectedMoodsEmpty || selectedMoods.some(mood => {
    return track.info.mood.includes(mood);
  });
};

export const keywordFilter = (track: Track, selectedKeywords: string[]) => {
  const selectedKeywordsEmpty = selectedKeywords?.length === 0;

  return selectedKeywordsEmpty || selectedKeywords.some(keyword => {
    return track.metadata.title.includes(keyword) ||
           track.metadata.producer.includes(keyword) ||
           track.info.genre.some(g => g.maingenre.includes(keyword) || (g.subgenre && g.subgenre.includes(keyword))) ||
           track.info.relatedartist.some(artist => artist.includes(keyword)) ||
           track.instruments.some(instr => instr.main.includes(keyword) || (instr.sub && instr.sub.includes(keyword))) ||
           track.info.mood.some(mood => mood.includes(keyword));
  });
};
