// src\client\features\sounds\catalog\components\TrackActions.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

const TrackActions: React.FC = () => (
  <div className="absolute flex right-0 lg:right-6 items-center group-hover:shadow-3xl group-hover:shadow-neutral-100 dark:group-hover:shadow-neutral-900">
    <div className="text-[#6D6D6D] group-hover:bg-neutral-100 dark:text-neutral-300 p-2.5 sm:p-3 dark:group-hover:bg-neutral-900">
      <FontAwesomeIcon icon={faHeart} className="invisible group-hover:visible" />
    </div>
    <div className="text-[#6D6D6D] group-hover:bg-neutral-100 dark:text-neutral-300 p-2.5 sm:p-3 dark:group-hover:bg-neutral-900">
      <FontAwesomeIcon icon={faPlus} className="invisible group-hover:visible" />
    </div>
    <div className="dark:text-white sm:p-3 text-[#6D6D6D] flex justify-center p-2.5 mr-1">
      <FontAwesomeIcon icon={faEllipsisVertical} />
    </div>
  </div>
);

export default TrackActions;
