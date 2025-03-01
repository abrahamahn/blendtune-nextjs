// Directory: src/client/features/sounds/tracks/hooks/useTracks.ts

import { useContext } from "react";
import { TracksContext } from "@/client/features/sounds/tracks/core/services";

/**
 * Custom hook for accessing the TracksContext.
 * Ensures that the hook is only used within a valid provider.
 * 
 * @returns {TracksContextType} The context value containing track-related data and actions.
 * @throws {Error} If used outside of a TracksProvider.
 */
export const useTracks = () => {
    const context = useContext(TracksContext);

    // Ensure the hook is called within a valid provider context.
    if (!context) {
        throw new Error("useTracks must be used within a TracksProvider");
    }

    return context;
};
