// src\client\features\sounds\catalog\components\TrackActions.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

export interface TrackActionsProps {
  variant?: 'mobile' | 'desktop';
  onFavorite?: () => void;
  onAddToPlaylist?: () => void;
  onMoreOptions?: () => void;
}

/**
 * Reusable component for track action buttons (favorite, add to playlist, more options)
 * with responsive styling for both mobile and desktop views.
 */
const TrackActions: React.FC<TrackActionsProps> = ({
  variant = 'mobile',
  onFavorite,
  onAddToPlaylist,
  onMoreOptions
}) => {
  // Handle desktop variant
  if (variant === 'desktop') {
    return (
      <div className="flex justify-center items-center flex-grow relative">
        <ActionButton 
          icon={faHeart} 
          onClick={onFavorite}
          className="text-[#707070] dark:text-neutral-300 w-8 h-8 mr-2 bg-[#F9F9F9] hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full opacity-0 group-hover:opacity-100 hover:cursor-pointer"
        />
        <ActionButton 
          icon={faPlus} 
          onClick={onAddToPlaylist}
          className="text-[#707070] dark:text-neutral-300 w-8 h-8 mr-2 bg-[#F9F9F9] hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full opacity-0 group-hover:opacity-100 hover:cursor-pointer"
        />
        <ActionButton 
          icon={faEllipsisVertical} 
          onClick={onMoreOptions}
          className="text-[#707070] dark:text-neutral-300 w-8 h-8 bg-[#F9F9F9] hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full opacity-0 group-hover:opacity-100 hover:cursor-pointer"
        />
      </div>
    );
  }
  
  // Mobile variant (default)
  return (
    <div className="absolute flex right-0 lg:right-6 items-center group-hover:shadow-3xl group-hover:shadow-neutral-100 dark:group-hover:shadow-neutral-900">
      <ActionButton 
        icon={faHeart} 
        onClick={onFavorite}
        className="text-[#6D6D6D] group-hover:bg-neutral-100 dark:text-neutral-300 p-2.5 sm:p-3 dark:group-hover:bg-neutral-900 invisible group-hover:visible"
      />
      <ActionButton 
        icon={faPlus} 
        onClick={onAddToPlaylist}
        className="text-[#6D6D6D] group-hover:bg-neutral-100 dark:text-neutral-300 p-2.5 sm:p-3 dark:group-hover:bg-neutral-900 invisible group-hover:visible"
      />
      <ActionButton 
        icon={faEllipsisVertical} 
        onClick={onMoreOptions}
        className="dark:text-white sm:p-3 text-[#6D6D6D] flex justify-center p-2.5 mr-1"
      />
    </div>
  );
};

interface ActionButtonProps {
  icon: any;
  onClick?: () => void;
  className?: string;
}

/**
 * Individual action button component
 */
const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, onClick, className = "" 
}) => (
  <div 
    className={`flex justify-center items-center ${className}`}
    onClick={(e) => {
      e.stopPropagation();
      if (onClick) onClick();
    }}
  >
    <FontAwesomeIcon icon={icon} />
  </div>
);

export default TrackActions;