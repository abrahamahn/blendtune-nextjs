// main/apps/web/src/client/features/sounds/filters/components/tempo.tsx
import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { Checkbox, Input } from '@ui';
import { FilterWrapper, ActionButtons } from '@features/sounds/filters/ui';

interface TempoFilterProps {
  onClose: () => void;
  minTempo: number;
  setMinTempo: (minTempo: number) => void;
  maxTempo: number;
  setMaxTempo: (maxTempo: number) => void;
  includeHalfTime: boolean;
  setIncludeHalfTime: (includeHalfTime: boolean) => void;
  includeDoubleTime: boolean;
  setIncludeDoubleTime: (includeDoubleTime: boolean) => void;
}

const MIN_TEMPO = 40;
const MAX_TEMPO = 200;

/** Tempo range panel: BPM slider + bounds inputs + half/double-time toggles. */
const TempoFilter: React.FC<TempoFilterProps> = ({
  minTempo,
  setMinTempo,
  maxTempo,
  setMaxTempo,
  includeHalfTime,
  setIncludeHalfTime,
  includeDoubleTime,
  setIncludeDoubleTime,
  onClose,
}) => {
  const handleSliderChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      const [minValue, maxValue] = values;
      setMinTempo(minValue);
      setMaxTempo(maxValue);
    } else {
      setMinTempo(values);
      setMaxTempo(values);
    }
  };

  const handleClearClick = () => {
    setMinTempo(MIN_TEMPO);
    setMaxTempo(MAX_TEMPO);
    setIncludeHalfTime(false);
    setIncludeDoubleTime(false);
  };

  return (
    <FilterWrapper>
      <Slider
        min={MIN_TEMPO}
        max={MAX_TEMPO}
        range
        value={[minTempo, maxTempo]}
        onChange={handleSliderChange}
      />
      <div className="bt-tempo-range">
        <label className="bt-tempo-field">
          From
          <Input
            inputMode="numeric"
            value={minTempo}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setMinTempo(Number.isNaN(value) ? MIN_TEMPO : value);
            }}
          />
        </label>
        <label className="bt-tempo-field">
          To
          <Input
            inputMode="numeric"
            value={maxTempo}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setMaxTempo(Number.isNaN(value) ? MAX_TEMPO : value);
            }}
          />
        </label>
      </div>
      <div className="bt-filter-checks">
        <Checkbox
          label="Include half time"
          checked={includeHalfTime}
          onChange={setIncludeHalfTime}
        />
        <Checkbox
          label="Include double time"
          checked={includeDoubleTime}
          onChange={setIncludeDoubleTime}
        />
      </div>
      <ActionButtons onClear={handleClearClick} onClose={onClose} />
    </FilterWrapper>
  );
};

export default TempoFilter;
