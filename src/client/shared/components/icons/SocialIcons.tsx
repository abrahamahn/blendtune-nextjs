// src\client\shared\components\icons\SocialIcons.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

/**
 * Props for individual social media icon
 */
interface SocialIconProps {
  /** FontAwesome icon definition */
  icon: IconDefinition;
}

/**
 * Type definition for social media URL mapping
 */
interface SocialMediaUrls {
  [key: string]: string;
}

/**
 * Mapping of social media icon names to their respective URLs
 */
const socialMediaUrls: SocialMediaUrls = {
  faYoutube: 'https://www.youtube.com',
  faInstagram: 'https://www.instagram.com',
  faFacebook: 'https://www.facebook.com',
  faTwitter: 'https://www.twitter.com',
};

/**
 * Renders a social media icon with a link to the platform
 * 
 * @component
 * @example
 * return (
 *   <SocialIcon icon={faFacebook} />
 * )
 */
const SocialIcon: React.FC<SocialIconProps> = ({ icon }) => {
  // Retrieve corresponding social media URL based on icon name
  const url = socialMediaUrls[icon.iconName as string];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className='w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white flex items-center justify-center'
    >
      <FontAwesomeIcon icon={icon} />
    </a>
  );
};

export default SocialIcon;