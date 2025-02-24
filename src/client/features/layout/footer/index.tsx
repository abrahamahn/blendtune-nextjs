/**
* Responsive footer component with navigation links and social media icons.
* Hidden on desktop viewports and optimized for mobile display.
*/

import React from "react";
import {
 faYoutube,
 faInstagram,
 faFacebook,
 faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import Logo from "@components/common//Logo";
import SocialIcon from "@/client/shared/components/icons/SocialIcons";

interface ListSectionProps {
 title: string;
 items: { name: string; url: string }[];
}

// Renders navigation group with title and list of links
const ListSection = ({ title, items }: ListSectionProps) => {
 return (
   <div>
     <h3 className="text-sm text-black dark:text-gray-300 mb-2 font-medium">
       {title}
     </h3>
     <ul className="list-none">
       {items.map((item) => (
          <li key={item.name} className="mb-2">
            <a
              href={item.url}
              className="text-neutral-600 dark:text-neutral-200 hover:text-neutral-500 dark:hover:text-neutral-300 md:text-sm text-sm"
            >
              {item.name}
            </a>
        </li>
       ))}
     </ul>
   </div>
 );
}

const Footer = () => {
 // Navigation section configuration with links
 const sections = [
   {
     title: "Home",
     items: [{ name: "Sounds", url: "/sounds" }],
   },
   {
     title: "Services",
     items: [
       { name: "Pricing", url: "/pricing" },
       { name: "Support", url: "/support" },
       { name: "Submit", url: "/submit" },
     ],
   },
   {
     title: "Legal",
     items: [
       { name: "Terms of Use", url: "/terms" },
       { name: "Privacy Policy", url: "/privacy-policy" },
     ],
   },
 ];

 return (
   <footer className="block md:hidden">
     <div className="flex flex-col lg:flex-row w-full justify-center items-center h-auto px-4 md:px-10 lg:px-0 pt-0 pb-0 lg:pb-24">
       {/* Navigation Links Section */}
       <div className="flex flex-wrap gap-0 lg:justify-center md:gap-10 mt-8 lg:order-2 w-full lg:w-2/3 px-2 md:px-0">
         {sections.map((section) => (
           <div
             key={section.title}
             className="lg:ml-4 text-base w-1/3 md:w-28 lg:w-32"
           >
             <ListSection title={section.title} items={section.items} />
           </div>
         ))}
       </div>

       {/* Brand and Social Media Section */}
       <div className="ml-0 sm:ml-0 md:ml-12 lg:ml-0 xl:ml-0 w-full lg:w-40 flex flex-col mt-0 md:mt-8 lg:order-1">
         <div className="flex flex-start p-2">
           <Logo />
         </div>
         <div className="flex mb-8 space-x-2 md:space-x-1 lg:space-x-2">
           <SocialIcon icon={faYoutube} />
           <SocialIcon icon={faInstagram} />
           <SocialIcon icon={faFacebook} />
           <SocialIcon icon={faTwitter} />
         </div>
         <p className="text-xs text-neutral-400 mb-8">
           © 2023 Blend, Inc. All rights reserved.
         </p>
       </div>
     </div>
   </footer>
 );
};

export default Footer;