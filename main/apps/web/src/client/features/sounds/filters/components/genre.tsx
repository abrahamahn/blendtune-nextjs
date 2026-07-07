// main/apps/web/src/client/features/sounds/filters/components/genre.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faGem,
  faWater,
  faLeaf,
  faPaw,
  faBoltLightning,
} from '@fortawesome/free-solid-svg-icons';

import { selectGenres, removeAllGenres } from '@core/store/slices';
import { FilterWrapper, Item, ActionButtons } from '@features/sounds/filters/ui';

interface GenreFilterProps {
  selectedGenres: string[];
  onClose: () => void;
}

const GENRE_ITEMS = [
  { icon: faStar, text: 'Pop' },
  { icon: faGem, text: 'Hiphop' },
  { icon: faWater, text: 'R&B' },
  { icon: faLeaf, text: 'Latin' },
  { icon: faPaw, text: 'Afrobeat' },
  { icon: faBoltLightning, text: 'Electronic' },
];

/** Genre filter panel — multi-select toggles backed by the Redux filter store. */
const GenreFilter: React.FC<GenreFilterProps> = ({ selectedGenres, onClose }) => {
  const dispatch = useDispatch();

  return (
    <FilterWrapper>
      <div className="bt-filter-choices">
        {GENRE_ITEMS.map((item) => (
          <Item
            key={item.text}
            selected={selectedGenres.includes(item.text)}
            onClick={() => dispatch(selectGenres(item.text))}
          >
            <FontAwesomeIcon icon={item.icon} />
            {item.text}
          </Item>
        ))}
      </div>
      <ActionButtons onClear={() => dispatch(removeAllGenres())} onClose={onClose} />
    </FilterWrapper>
  );
};

export default GenreFilter;
