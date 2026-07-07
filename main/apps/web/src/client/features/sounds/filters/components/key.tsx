// main/apps/web/src/client/features/sounds/filters/components/key.tsx
/**
 * Musical key filter: scale + accidental segments, piano-style key grid, and
 * relative-scale expansion. Selection produces the key/note/scale combinations
 * consumed by the filter logic.
 */
import React, { useState, useEffect } from 'react';

import { Button, Checkbox } from '@ui';
import { FilterWrapper, ActionButtons } from '@features/sounds/filters/ui';

interface KeyFilterProps {
  selectedKeys: string;
  setSelectedKeys(selectedKeys: string): void;
  selectedScale: string;
  setSelectedScale(selectedScale: string): void;
  setKeyFilterCombinations: React.Dispatch<
    React.SetStateAction<{ key: string | null; 'key.note': string | null; 'key.scale': string | null }[]>
  >;
  onClose: () => void;
}

const scales = ['Major', 'Minor'];
const accidentals = ['Flat', 'Sharp'];
const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackSharpKeys = ['C#', 'D#', 'F#', 'G#', 'A#'];
const blackFlatKeys = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'];

const flatToSharpMap: Record<string, string> = { Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#' };
const sharpToFlatMap: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
};

const getSharpEquivalent = (flatKey: string) => flatToSharpMap[flatKey] || flatKey;
const getFlatEquivalent = (sharpKey: string) => sharpToFlatMap[sharpKey] || sharpKey;

/** Piano-style key button (mono type, amber when active). */
const KeyButton: React.FC<{ note: string; active: boolean; onClick: () => void }> = ({
  note,
  active,
  onClick,
}) => (
  <Button
    variant="text"
    size="inline"
    className="bt-key"
    data-active={active}
    aria-pressed={active}
    onClick={onClick}
  >
    {note}
  </Button>
);

/** Two-option segmented control (accidental / scale). */
const Segment: React.FC<{
  options: string[];
  value: string;
  onChange: (option: string) => void;
}> = ({ options, value, onChange }) => (
  <div className="bt-key-segment">
    {options.map((option) => (
      <Button
        key={option}
        variant="text"
        size="inline"
        className="bt-key-segment-option"
        data-active={value === option}
        aria-pressed={value === option}
        onClick={() => onChange(option)}
      >
        {option}
      </Button>
    ))}
  </div>
);

const KeyFilter: React.FC<KeyFilterProps> = ({
  onClose,
  selectedKeys,
  setSelectedKeys,
  selectedScale,
  setSelectedScale,
  setKeyFilterCombinations,
}) => {
  const [selectedAccidental, setSelectedAccidental] = useState<string>('Flat');
  const [includeRelativeScales, setIncludeRelativeScales] = useState<boolean>(false);

  const handleKeyChange = (key: string) => {
    if (blackFlatKeys.includes(key)) {
      setSelectedAccidental('Flat');
    } else if (blackSharpKeys.includes(key)) {
      setSelectedAccidental('Sharp');
    }
    setSelectedKeys(key);
  };

  const handleAccidentalChange = (accidental: string) => {
    setSelectedAccidental(accidental);
    // Swap the selected key to its enharmonic equivalent where applicable.
    if (accidental === 'Flat' && blackSharpKeys.includes(selectedKeys)) {
      setSelectedKeys(getFlatEquivalent(selectedKeys));
    } else if (accidental === 'Sharp' && blackFlatKeys.includes(selectedKeys)) {
      setSelectedKeys(getSharpEquivalent(selectedKeys));
    }
  };

  /**
   * Generates key combinations (with relative scales and enharmonic
   * equivalents) whenever the selection changes.
   */
  useEffect(() => {
    const majorToMinorMap: Record<string, string> = {
      C: 'A',
      'C#': 'A#',
      D: 'B',
      'D#': 'C',
      E: 'C#',
      F: 'D',
      'F#': 'D#',
      G: 'E',
      'G#': 'F',
      A: 'F#',
      'A#': 'G',
      B: 'G#',
      Db: 'Bb',
      Eb: 'C',
      Gb: 'Eb',
      Ab: 'F',
      Bb: 'G',
    };
    const minorToMajorMap = Object.fromEntries(
      Object.entries(majorToMinorMap).map(([major, minor]) => [minor, major]),
    );

    const getRelativeScale = (key: string, isMajor: boolean) =>
      isMajor ? majorToMinorMap[key] : minorToMajorMap[key];

    /** A single combination entry (empty when the note is missing). */
    const combo = (keyNote: string, scaleType: string) =>
      keyNote
        ? [{ key: `${keyNote} ${scaleType}`, 'key.note': keyNote, 'key.scale': scaleType }]
        : [];

    /** All combinations for one key: primary, relative scale, enharmonics. */
    const addKeyAndRelativeScale = (key: string, scale: string, withRelative: boolean) => {
      const isMajor = scale === 'Major';
      const otherScale = isMajor ? 'Minor' : 'Major';
      const relativeKey =
        withRelative && (scale === 'Major' || scale === 'Minor')
          ? (getRelativeScale(key, isMajor) ?? '')
          : '';
      const relativeEnharmonic = isMajor
        ? getFlatEquivalent(relativeKey)
        : getSharpEquivalent(relativeKey);
      const sharpEquivalent = getSharpEquivalent(key);
      const flatEquivalent = getFlatEquivalent(key);

      return [
        ...(scale === 'Major' || scale === 'Minor' ? combo(key, scale) : []),
        ...combo(relativeKey, otherScale),
        ...(relativeEnharmonic !== relativeKey ? combo(relativeEnharmonic, otherScale) : []),
        ...(sharpEquivalent !== key ? combo(sharpEquivalent, scale) : []),
        ...(flatEquivalent !== key ? combo(flatEquivalent, scale) : []),
      ];
    };

    const equivalentKey =
      selectedAccidental === 'Flat'
        ? getFlatEquivalent(selectedKeys)
        : getSharpEquivalent(selectedKeys);
    const all = selectedKeys
      ? [
          ...addKeyAndRelativeScale(selectedKeys, selectedScale, includeRelativeScales),
          ...addKeyAndRelativeScale(equivalentKey, selectedScale, includeRelativeScales),
        ]
      : [];

    // Dedupe by note+scale, keeping first occurrence.
    const seen = new Set<string>();
    const result = all.filter((combination) => {
      const uniqueKey = `${combination['key.note']}-${combination['key.scale']}`;
      if (seen.has(uniqueKey)) return false;
      seen.add(uniqueKey);
      return true;
    });

    setKeyFilterCombinations(result);
  }, [setKeyFilterCombinations, selectedKeys, selectedScale, includeRelativeScales, selectedAccidental]);

  const handleClearClick = () => {
    setSelectedKeys('');
    setIncludeRelativeScales(false);
  };

  const blackKeysArray = selectedAccidental === 'Flat' ? blackFlatKeys : blackSharpKeys;

  return (
    <FilterWrapper>
      <Segment options={accidentals} value={selectedAccidental} onChange={handleAccidentalChange} />
      <Segment options={scales} value={selectedScale} onChange={setSelectedScale} />
      <div className="bt-key-row" data-black="true">
        <div className="bt-key-black-group">
          {blackKeysArray.slice(0, 2).map((key) => (
            <KeyButton
              key={key}
              note={key}
              active={selectedKeys === key}
              onClick={() => handleKeyChange(key)}
            />
          ))}
        </div>
        <div className="bt-key-black-group">
          {blackKeysArray.slice(2).map((key) => (
            <KeyButton
              key={key}
              note={key}
              active={selectedKeys === key}
              onClick={() => handleKeyChange(key)}
            />
          ))}
        </div>
      </div>
      <div className="bt-key-row">
        {whiteKeys.map((key) => (
          <KeyButton
            key={key}
            note={key}
            active={selectedKeys === key}
            onClick={() => handleKeyChange(key)}
          />
        ))}
      </div>
      <div className="bt-filter-checks">
        <Checkbox
          label="Include relative scale"
          checked={includeRelativeScales}
          onChange={setIncludeRelativeScales}
        />
      </div>
      <ActionButtons onClear={handleClearClick} onClose={onClose} />
    </FilterWrapper>
  );
};

export default KeyFilter;
