// main/apps/web/src/client/features/sounds/filters/components/instrument.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDrum,
  faGuitar,
  faBarsStaggered,
  faMicrophoneLines,
  faWaveSquare,
  faMemory,
  faDrumSteelpan,
  faLinesLeaning,
} from '@fortawesome/free-solid-svg-icons';

import { FilterWrapper, Item, ActionButtons } from '@client/features/sounds/filters/ui';

interface InstrumentFilterProps {
  selectedInstruments: string[];
  setSelectedInstruments: (selectedInstruments: string[]) => void;
  onClose: () => void;
}

const INSTRUMENT_ITEMS = [
  { icon: faDrum, text: 'Drums' },
  { icon: faGuitar, text: 'Guitars' },
  { icon: faBarsStaggered, text: 'Bass' },
  { icon: faMicrophoneLines, text: 'Vocals' },
  { icon: faWaveSquare, text: 'Synth' },
  { icon: faMemory, text: 'Keyboard' },
  { icon: faDrumSteelpan, text: 'Percussion' },
  { icon: faLinesLeaning, text: 'Strings' },
];

/** Instrument filter panel — multi-select toggles. */
const InstrumentFilter: React.FC<InstrumentFilterProps> = ({
  selectedInstruments,
  setSelectedInstruments,
  onClose,
}) => {
  const handleInstrumentToggle = (instrument: string) => {
    setSelectedInstruments(
      selectedInstruments.includes(instrument)
        ? selectedInstruments.filter((i) => i !== instrument)
        : [...selectedInstruments, instrument],
    );
  };

  return (
    <FilterWrapper>
      <div className="bt-filter-choices">
        {INSTRUMENT_ITEMS.map((item) => (
          <Item
            key={item.text}
            selected={selectedInstruments.includes(item.text)}
            onClick={() => handleInstrumentToggle(item.text)}
          >
            <FontAwesomeIcon icon={item.icon} />
            {item.text}
          </Item>
        ))}
      </div>
      <ActionButtons onClear={() => setSelectedInstruments([])} onClose={onClose} />
    </FilterWrapper>
  );
};

export default InstrumentFilter;
