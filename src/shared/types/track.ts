// src\shared\types\track.ts

/**
 * Comprehensive track metadata interface
 */
export interface Track {
  /** Unique track identifier */
  id: number;

  /** Track audio file reference */
  file: string;

  /** Catalog and identification details */
  metadata: {
    catalog: string;
    isrc: string;
    iswc: string;
    title: string;
    release: string;
    album: string;
    
    track: string;
    producer: string;
  };

  /** Track characteristics and metadata */
  info: {
    duration: string;
    bpm: string;
    key: {
      note: string;
      scale: string;
    };
    genre: {
      maingenre: string;
      subgenre: string;
    }[];
    relatedartist: string[];
    mood: string[];
    tag: string[];
  };

  /** Track arrangement sections */
  arrangement: {
    time: string;
    section: string;
  }[];

  /** Instruments used in the track */
  instruments: {
    main: string;
    sub: string;
  }[];

  /** Sample information */
  sample: {
    file: string;
    samplepack: string;
    author: string;
    clearance: string;
  };

  /** Track creators and their roles */
  creator: {
    name: string;
    producer: boolean;
    songwriter: boolean;
    ipi: string;
    splits: string;
  }[];

  /** Exclusive track rights information */
  exclusive: {
    artistname: string;
    email: string;
    phone: string;
    address: string;
    management: string;
  };
}