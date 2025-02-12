export interface Track {
  id: number;
  file: string;
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
  info: {
    duration: string;
    bpm: string;
    key: {
      note: string;
      scale: string;
    };
    genre: [{
      maingenre: string;
      subgenre: string;
    }];
    relatedartist: string[];
    mood: string[];
    tag: string[];
  };
  arrangement: [{
    time: string;
    section: string;
  }];
  instruments: [{
    main: string;
    sub: string;
  }];
  sample: {
    file: string;
    samplepack: string;
    author: string;
    clearance: string;
  };
  creator: [{
    name: string;
    producer: boolean;
    songwriter: boolean;
    ipi: string;
    splits: string;
  }];
  exclusive: {
    artistname: string;
    email: string;
    phone: string;
    address: string;
    management: string;
  };
}
