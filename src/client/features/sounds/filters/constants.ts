// src/client/features/sounds/filters/constants.ts
/**
 * Constants for the filters feature
 * Centralizes all filter-related constants in one location
 * 
 * @module filters/constants
 */

/**
 * Default filter values
 */
export const FILTER_DEFAULTS = {
    /** Default minimum tempo value (BPM) */
    MIN_TEMPO: 40,
    
    /** Default maximum tempo value (BPM) */
    MAX_TEMPO: 200,
    
    /** Default initial state for half-time inclusion */
    INCLUDE_HALF_TIME: false,
    
    /** Default initial state for double-time inclusion */
    INCLUDE_DOUBLE_TIME: false,
  };
  
  /**
   * Musical key constants
   */
  export const KEY_CONSTANTS = {
    /** Available musical scales */
    SCALES: ["Major", "Minor"],
    
    /** Available accidental notations */
    ACCIDENTALS: ["Flat", "Sharp"],
    
    /** White keys on piano (no accidentals) */
    WHITE_KEYS: ["C", "D", "E", "F", "G", "A", "B"],
    
    /** Black keys with sharp notation */
    BLACK_SHARP_KEYS: ["C#", "D#", "F#", "G#", "A#"],
    
    /** Black keys with flat notation */
    BLACK_FLAT_KEYS: ["Db", "Eb", "Gb", "Ab", "Bb"],
    
    /** Default selected scale */
    DEFAULT_SCALE: "Major",
    
    /** Default selected accidental */
    DEFAULT_ACCIDENTAL: "Flat",
  };
  
  export const GENRE_CONSTANTS = {
    /** Available genre options with icons */
    GENRE_ITEMS: [
      { id: 'pop', name: 'Pop', icon: 'faStar' },
      { id: 'hiphop', name: 'Hiphop', icon: 'faGem' },
      { id: 'rnb', name: 'R&B', icon: 'faWater' },
      { id: 'latin', name: 'Latin', icon: 'faLeaf' },
      { id: 'afrobeat', name: 'Afrobeat', icon: 'faPaw' },
      { id: 'electronic', name: 'Electronic', icon: 'faBoltLightning' },
    ],
  };
  
  /**
   * Sort options
   */
  export const SORT_OPTIONS = ["Newest", "Oldest", "Random", "A-Z"] as const;
  
  /**
   * Instrument definitions with icons
   */
  export const INSTRUMENT_ITEMS = [
    { id: "drums", name: "Drums", icon: "faDrum" },
    { id: "guitars", name: "Guitars", icon: "faGuitar" },
    { id: "bass", name: "Bass", icon: "faBarsStaggered" },
    { id: "vocals", name: "Vocals", icon: "faMicrophoneLines" },
    { id: "synth", name: "Synth", icon: "faWaveSquare" },
    { id: "keyboard", name: "Keyboard", icon: "faMemory" },
    { id: "percussion", name: "Percussion", icon: "faDrumSteelpan" },
    { id: "strings", name: "Strings", icon: "faLinesLeaning" },
  ];
  
  /**
   * Filter names
   */
  export const FILTER_NAMES = {
    TEMPO: "Tempo",
    KEY: "Key",
    GENRE: "Genre",
    ARTIST: "Artist",
    INSTRUMENT: "Instrument",
    MOOD: "Mood",
    KEYWORD: "Keyword",
    SORT: "Sort",
  } as const;
  
  /**
   * Filter tooltip messages
   */
  export const FILTER_TOOLTIPS = {
    TEMPO: "Filter by tempo (beats per minute)",
    KEY: "Filter by musical key and scale",
    GENRE: "Filter by music genre",
    ARTIST: "Filter by artist",
    INSTRUMENT: "Filter by instruments used",
    MOOD: "Filter by mood or emotion",
    KEYWORD: "Filter by keywords",
  };
  
  /**
   * CSS class mappings for consistent styling
   */
  export const STYLE_CLASSES = {
    ACTIVE_FILTER: "border-blue-500 dark:border-blue-500",
    OPEN_FILTER: "border-[#D5D5D5] hover:border-neutral-300 dark:border-neutral-200 shadow-md dark:hover:border-neutral-200",
    DEFAULT_FILTER: "border-neutral-400 hover:border-neutral-300 dark:border-neutral-600 dark:hover:border-neutral-500",
    SELECTED_ITEM: "bg-blue-600 dark:bg-blue-600 text-white dark:text-white",
    UNSELECTED_ITEM: "bg-white/90 dark:bg-black/90 text-neutral-600 dark:text-neutral-300",
  };
  
  /**
   * Accessibility labels for better screen reader support
   */
  export const ARIA_LABELS = {
    FILTER_PANEL: "Filter options panel",
    SORT_PANEL: "Sort options panel",
    CLEAR_BUTTON: "Clear all filters",
    CLOSE_BUTTON: "Close filter panel",
    APPLY_BUTTON: "Apply selected filters",
  };