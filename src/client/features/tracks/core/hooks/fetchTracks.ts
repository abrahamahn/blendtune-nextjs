import { cache } from 'react';
import { Track } from '@/shared/types/track';
import { 
  TrackError, 
  TrackErrorCode, 
  handleTrackError,
  createFetchError
} from '@tracks/utils/errors';

/**
 * Cached version of track fetching with Next.js server-side caching
 * Fetches track data from the API, caches the result server-side.
 * 
 * @returns {Promise<Track[]>} A promise resolving to an array of tracks.
 * @throws {TrackError} If the fetch request fails with a specific error code.
 */
export const fetchTracks = cache(async (): Promise<Track[]> => {
  try {
    const controller = new AbortController();
    // Set a timeout to prevent indefinite waiting
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    const response = await fetch('/api/tracks', {
      // Configure Next.js cache behavior
      next: {
        revalidate: 3600, // Revalidate every hour
        tags: ['tracks'], // Allow manual revalidation
      },
      signal: controller.signal // Add abort signal for timeout
    });

    // Clear the timeout
    clearTimeout(timeoutId);

    // Ensure the response is successful before proceeding.
    if (!response.ok) {
      // Use createFetchError for more specific error handling
      throw createFetchError(response.status, {
        url: response.url,
        headers: Object.fromEntries(response.headers)
      });
    }

    // Parse the response JSON.
    const data = await response.json();

    // Validate the response structure
    if (!data || typeof data !== 'object') {
      throw new TrackError(
        'Invalid track data format received',
        TrackErrorCode.INVALID_FORMAT,
        { receivedData: data }
      );
    }

    // Convert response object to an array of Track objects.
    const trackArray: Track[] = Object.values(data);

    // Validate track array
    if (trackArray.length === 0) {
      throw new TrackError(
        'No tracks found in the response',
        TrackErrorCode.MISSING_DATA
      );
    }

    // Sort tracks by release date (descending: newest first).
    return trackArray.toSorted((a, b) =>
      b.metadata.release.localeCompare(a.metadata.release)
    );
  } catch (error) {
    // If it's already a TrackError, rethrow it
    if (error instanceof TrackError) {
      throw error;
    }
    
    // Otherwise, handle and convert the error
    const { message, code, details } = handleTrackError(error);
    console.error('Error fetching tracks:', message, details);
    
    // Throw a properly formatted TrackError
    throw new TrackError(message, code, details);
  }
});

// Optional: Add a utility for manual revalidation
export async function revalidateTracks() {
  // This can be used in an API route or server action
  const { revalidateTag } = require('next/cache');
  revalidateTag('tracks');
}