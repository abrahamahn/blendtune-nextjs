// Directory: src/client/features/sounds/tracks/hooks/fetchTracks.ts

import { Track } from '@/shared/types/track';

/**
 * Fetches track data from the API.
 * Retrieves an array of tracks, sorts them by release date (newest first),
 * and returns the formatted list.
 *
 * @returns {Promise<Track[]>} A promise resolving to an array of tracks.
 * @throws {Error} If the fetch request fails.
 */
export async function fetchTracks(): Promise<Track[]> {
  try {
    const response = await fetch('/api/tracks');

    // Ensure the response is successful before proceeding.
    if (!response.ok) {
      throw new Error('Failed to fetch tracks: Network response was not ok');
    }

    // Parse the response JSON.
    const data = await response.json();

    // Convert response object to an array of Track objects.
    const trackArray: Track[] = Object.values(data);

    // Sort tracks by release date (descending: newest first).
    return trackArray.toSorted((a, b) =>
      b.metadata.release.localeCompare(a.metadata.release)
    );
  } catch (error) {
    console.error('Error fetching tracks:', error);
    throw error; // Re-throw error for further handling in consuming components.
  }
}
