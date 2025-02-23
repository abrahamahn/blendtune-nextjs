// src\client\shared\components\common\Logo.tsx
import React from 'react';
import Link from 'next/link';

const Logo: React.FC = () => {
  return (
    <Link
      className='flex justify-center items-center text-black dark:text-white text-2xl font-extrabold tracking-tighter rounded-lg p-0'
      href='/'
    >
      BLEND.
    </Link>
  );
};

export default Logo;
