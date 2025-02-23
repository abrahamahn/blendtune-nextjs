// src\client\features\layout\header\components\Dropdown.tsx

/**
* @fileoverview Dropdown menu component for header navigation
*/

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
 faRecordVinyl,
 faCubes, 
 faFont,
 faFire,
 faWandSparkles,
 faUserLarge,
 faBolt,
 faStar,
 faGem,
 faWater,
 faLeaf,
 faPaw,
 faBoltLightning,
} from '@fortawesome/free-solid-svg-icons';

/**
* Navigation menu items configuration
*/
const menuItems = [
 { icon: faRecordVinyl, text: 'Sounds' },
 { icon: faWandSparkles, text: 'Newest' },
 { icon: faFire, text: 'Popular' },
 { icon: faCubes, text: 'Random' },
 { icon: faFont, text: 'A-Z' },
 { icon: faUserLarge, text: 'Creators' },
 { icon: faBolt, text: 'Free Beats' },
];

/**
* Genre navigation items configuration
*/
const genreItems = [
 { icon: faStar, text: 'Pop' },
 { icon: faGem, text: 'Hiphop' },
 { icon: faWater, text: 'R&B' },
 { icon: faLeaf, text: 'Latin' },
 { icon: faPaw, text: 'Afrobeat' },
 { icon: faBoltLightning, text: 'Electronic' },
];

/**
* Dropdown menu component with navigation and genre sections
*/
const DropdownMenu: React.FC = () => {
 return (
   <div className='border border-neutral-300 dark:border-neutral-500 flex absolute top-56 pt-1 bg-white/90 dark:bg-black/90 rounded-2xl shadow-lg z-30'>
     {/* Navigation section */}
     <div className='flex-1 py-4 px-4 pr-2 w-60 border-r dark:border-neutral-700 '>
       <h4 className='mb-2 ml-2 font-medium text-neutral-400 dark:text-neutral-300 text-sm'>
         EXPLORE
       </h4>
       <ul className='text-neutral-200 text-sm'>
         {menuItems.slice(0, 5).map((item, index) => (
           <li
             key={index}
             className='mb-1 hover:text-neutral-200 hover:bg-neutral-200/20 rounded-lg'
           >
             <Link className='flex flex-row px-2 py-1.5' href='/sounds'>
               <div className='flex items-center w-4 mr-2'>
                 <FontAwesomeIcon
                   icon={item.icon}
                   className='text-neutral-400 dark:text-neutral-300 justify-center items-center'
                 />
               </div>
               <p className='text-neutral-400 dark:text-neutral-300'>
                 {item.text}
               </p>
             </Link>
           </li>
         ))}
         <li className='border border-t-0 border-neutral-300 dark:border-neutral-500 my-5'></li>
         {menuItems.slice(5).map((item, index) => (
           <li
             key={index}
             className='mb-1 hover:text-neutral-200 hover:bg-neutral-200/20 rounded-lg'
           >
             <Link className='flex flex-row px-2 py-1.5' href='/sounds'>
               <div className='flex items-center w-4'>
                 <FontAwesomeIcon
                   icon={item.icon}
                   className='text-neutral-400 dark:text-neutral-300 justify-center items-center'
                 />
               </div>
               <p className='ml-2 text-neutral-400 dark:text-neutral-300'>
                 {item.text}
               </p>
             </Link>
           </li>
         ))}
       </ul>
     </div>

     {/* Genres section */}
     <div className='flex-1 py-4 px-4 pr-2 border-r dark:border-neutral-700 '>
       <h4 className='mb-2 ml-2 font-medium text-neutral-400 dark:text-neutral-300 text-sm'>
         GENRES
       </h4>
       <ul className='text-neutral-200 text-sm'>
         {genreItems.map((item, index) => (
           <li
             key={index}
             className='mb-1 hover:text-neutral-200 hover:bg-neutral-200/20 rounded-lg'
           >
             <Link className='flex flex-row px-2 py-1.5' href='/sounds'>
               <div className='flex items-center w-4'>
                 <FontAwesomeIcon
                   icon={item.icon}
                   className='text-neutral-400 dark:text-neutral-300 justify-center items-center'
                 />
               </div>
               <p className='ml-2 text-neutral-400 dark:text-neutral-300'>
                 {item.text}
               </p>
             </Link>
           </li>
         ))}
       </ul>
     </div>
   </div>
 );
};

export default DropdownMenu;