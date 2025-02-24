import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 faDrum,
 faGuitar,
 faBarsStaggered,
 faMicrophoneLines,
 faWaveSquare,
 faMemory,
 faDrumSteelpan,
 faLinesLeaning,
} from "@fortawesome/free-solid-svg-icons";
import { FilterWrapper } from "../shared/ui/FilterWrapper";
import { Button } from "../shared/ui/Button";
import { ActionButtons } from "../shared/ui/ActionButtons";

/**
* Props interface for InstrumentFilter component
*/
interface InstrumentFilterProps {
 selectedInstruments: string[];
 setSelectedInstruments: (selectedInstruments: string[]) => void;
 onClose: () => void;
}

/**
* Predefined list of instruments with their corresponding icons
*/
const instrumentItems = [
 { icon: faDrum, text: "Drums" },
 { icon: faGuitar, text: "Guitars" },
 { icon: faBarsStaggered, text: "Bass" },
 { icon: faMicrophoneLines, text: "Vocals" },
 { icon: faWaveSquare, text: "Synth" },
 { icon: faMemory, text: "Keyboard" },
 { icon: faDrumSteelpan, text: "Percussion" },
 { icon: faLinesLeaning, text: "Strings" },
];

/**
* Component for filtering tracks by instrument type
* Provides both desktop and mobile layouts
*/
const InstrumentFilter: React.FC<InstrumentFilterProps> = ({
 selectedInstruments,
 setSelectedInstruments,
 onClose,
}) => {
 /**
  * Toggles selection state for an instrument
  */
 const handleInstrumentToggle = (instrument: string) => {
   let newInstruments;
   if (selectedInstruments.includes(instrument)) {
     newInstruments = selectedInstruments.filter((i) => i !== instrument);
   } else {
     newInstruments = [...selectedInstruments, instrument];
   }

   setSelectedInstruments(newInstruments);
 };

 return (
   <div>
     {/* Desktop Filter */}
     <FilterWrapper 
       isDesktop={true}
       className="top-0 absolute bg-white/95 dark:bg-black/90 border border-neutral-200 dark:border-neutral-700 py-4 px-2 shadow rounded-lg text-neutral-300 text-xs"
     >
       <div className="grid grid-cols-2 gap-2">
         {instrumentItems.map((item, index) => (
           <Button
             key={index}
             variant="filter"
             size="sm"
             selected={selectedInstruments.includes(item.text)}
             onClick={() => handleInstrumentToggle(item.text)}
             className="mb-0 flex flex-row px-1.5 py-1.5"
           >
             <div className="flex items-center justify-center w-4 mr-1">
               <FontAwesomeIcon
                 icon={item.icon}
                 className="justify-center items-center mt-0.5"
               />
             </div>
             <p>{item.text}</p>
           </Button>
         ))}
       </div>
       
       <ActionButtons 
         onClear={() => setSelectedInstruments([])}
         onClose={onClose}
       />
     </FilterWrapper>

     {/* Mobile Filter */}
     <FilterWrapper 
       isDesktop={false}
       className="z-10 py-4 px-2 shadow rounded-lg text-neutral-300 text-sm"
     >
       <div className="grid grid-cols-3 gap-2">
         {instrumentItems.map((item, index) => (
           <Button
             key={index}
             variant="filter"
             size="md"
             selected={selectedInstruments.includes(item.text)}
             onClick={() => handleInstrumentToggle(item.text)}
             className="mb-0 flex flex-row px-1.5 py-1.5"
           >
             <div className="flex items-center justify-center w-6 mr-2">
               <FontAwesomeIcon
                 icon={item.icon}
                 size="lg"
                 className="justify-center items-center mt-0.5"
               />
             </div>
             <p>{item.text}</p>
           </Button>
         ))}
       </div>

       <ActionButtons 
         onClear={() => setSelectedInstruments([])}
         isMobile={true}
       />
     </FilterWrapper>
   </div>
 );
};

export default InstrumentFilter;