// src\client\shared\components\common\Logo.tsx
import React from 'react';
import { Link } from '@router/index';

/** 
 * Site logo component with home page link
 */
const Logo: React.FC = () => {
  return (
    <Link
      className='flex justify-center items-center text-black dark:text-white text-2xl font-extrabold tracking-tighter rounded-lg p-0'
      to='/'
    >
      BLEND.
    </Link>
  );
};

export default Logo;