import { Track } from '@/types/track';

export async function getTracks(): Promise<Track[]> {
  try {
    const response = await fetch('/api/tracks');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const trackArray: Track[] = Object.values(data);
    const sortedTracks = trackArray.toSorted((a, b) =>
      b.metadata.release.localeCompare(a.metadata.release)
    );
    return sortedTracks;
  } catch (error) {
    console.error('Error fetching tracks:', error);
    throw error;
  }
}
