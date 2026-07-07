// main/apps/web/src/client/features/layout/leftbar/index.tsx
/**
 * Left nav rail — navigation only, per the design direction
 * (Sounds, Pricing, Support, Submit). Genres live in the catalog tabs.
 */
import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faFile, faCircleInfo, faUpload } from '@fortawesome/free-solid-svg-icons';

import { Link, useNavigate } from '@router/index';
import { removeAllGenres } from '@client/features/sounds/filters/store/filterSlice';

import './leftbar.css';

const PAGE_ITEMS = [
  { icon: faFile, text: 'Pricing', to: '/pricing' },
  { icon: faCircleInfo, text: 'Support', to: '/support' },
  { icon: faUpload, text: 'Submit', to: '/submit' },
];

const LeftBar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /** Clears genre filters and navigates to the catalog. */
  const handleSoundsClick = () => {
    dispatch(removeAllGenres());
    navigate('/sounds');
  };

  return (
    <nav className="bt-rail" aria-label="Primary">
      <button type="button" className="bt-rail-item" onClick={handleSoundsClick}>
        <FontAwesomeIcon icon={faMusic} size="lg" />
        <span>Sounds</span>
      </button>
      {PAGE_ITEMS.map((page) => (
        <Link to={page.to} key={page.text} className="bt-rail-item">
          <FontAwesomeIcon icon={page.icon} size="lg" />
          <span>{page.text}</span>
        </Link>
      ))}
    </nav>
  );
};

export default LeftBar;
