import { Track } from "@/shared/types/track";

/**
 * Generates the URL for a track's artwork image.
 * Prioritizes the imageUrl property if available, otherwise
 * constructs URL from catalog metadata.
 * Falls back to a default image if no valid data is available.
 */
export function getImageUrl(track: Track): string {
  if (track?.metadata?.catalog) {
    return `https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${track.metadata.catalog}.jpg`;
  }
  
  // Default fallback
  return "https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/default.jpg";
}

/**
 * Safely renders a value, returning `null` if empty or `"n/a"`.
 */
export function renderValue(value: string | null | undefined) {
  return value && value !== "n/a" && value !== "" ? value : null;
}

/**
 * Formats a track duration string from `MM:SS` format to ensure zero-padding.
 */
export function formatDuration(durationString: string): string {
  if (!durationString) return "00:00";
  
  const [minutesStr, secondsStr] = durationString.split(":");
  const minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}