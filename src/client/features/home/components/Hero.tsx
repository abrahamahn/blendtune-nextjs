// src\client\features\home\components\Hero.tsx

/**
* @fileoverview Hero component displaying artwork grid with animated columns
*/

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@styles/Home.module.css";

/**
* Hero section component with artwork grid and call-to-action
*/
const Hero: React.FC = () => {
 // Generate array of artwork URLs
 const artworks = Array.from(
   { length: 999 },
   (_, i) =>
     `https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/mkh${String(i + 1).padStart(3, "0")}.jpg`
 );

 // Split artworks into animated columns
 const chunks = [
   artworks.slice(0, 15),
   artworks.slice(16, 30),
   artworks.slice(31, 45),
   artworks.slice(46, 60),
   artworks.slice(7, 22),
   artworks.slice(23, 37),
   artworks.slice(38, 53),
   artworks.slice(0, 15),
 ];

 return (
   <div className="h-screen w-full mx-auto bg-gradient-to-r from-cyan-100 via-sky-100 to-red-100 dark:from-black dark:to-black">
     <div className="flex flex-col justify-center items-center text-black dark:text-white relative w-full overflow-hidden lg:mt-0">
       {/* Animated artwork grid */}
       <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center overflow-visible rounded-xl">
         {chunks.map((chunk, chunkIndex) => (
           <div
             key={chunkIndex}
             className={`${styles.column} ${
               chunkIndex % 2 === 0 ? styles.up : styles.down
             }`}
           >
             {chunk.map((art, artIndex) => (
               <div
                 key={artIndex}
                 className="relative z-0 m-1 lg:m-2 overflow-visible"
               >
                 <div className="vintage-cover relative">
                   {/* Mobile artwork view */}
                   <div className="block sm:hidden">
                     <Image
                       crossOrigin="anonymous"
                       src={art}
                       alt="artwork"
                       width={300}
                       height={300}
                       className="object-cover w-full border-black dark:border-black rounded-xl"
                     />
                   </div>
                   {/* Desktop artwork view */}
                   <div className="hidden sm:block">
                     <Image
                       crossOrigin="anonymous"
                       src={art}
                       alt="artwork"
                       width={200}
                       height={200}
                       className="object-cover w-full border-black dark:border-black rounded-xl"
                     />
                   </div>
                 </div>
               </div>
             ))}
           </div>
         ))}
       </div>

       <div className={styles.overlay}></div>

       {/* Hero content */}
       <div className="flex flex-col justify-center items-center text-center w-full z-10 h-screen">
         <div className="flex flex-col justify-center text-center w-1/2 md:w-4/6 lg:w-1/2 xl:w-4/5 mb-5 ${styles.fadeInUp}">
           <h1 className="font-custom text-xl font-medium mb-3 mx-auto leading-tight xl:text-5xl text-neutral-900 dark:text-white lg:text-3xl md:text-3xl w-full xl:w-5/5 ${styles.fadeInUp}">
             Find, Make, Share. <br />
             With Best Music Library.
           </h1>
           <h2 className="leading-tight text-center text-black dark:text-white w-full md:w-4/5 lg:w-full mx-auto">
             Blendtune is a music web studio with better, faster search for
             beats.
           </h2>
         </div>

         {/* Call-to-action buttons */}
         <div className={`mt-2 justify-center ${styles.fadeInUp}`}>
           <Link
             className="text-sm md:text-base text-white dark:text-black rounded-lg py-3 sm:py-3 px-10 bg-black dark:bg-white hover:bg-neutral-900 dark:hover:bg-neutral-200 mr-4 dark:font-medium"
             href="/sounds"
           >
             Explore
           </Link>
           <Link
             className="text-sm md:text-base text-neutral-600 dark:text-neutral-200 rounded-lg py-3 sm:py-3 px-10 dark:bg-blue-600 hover:bg-blue-500 dark:font-medium"
             href="/auth/signup"
           >
             Try Free
           </Link>
         </div>
       </div>
     </div>
   </div>
 );
};

export default Hero;