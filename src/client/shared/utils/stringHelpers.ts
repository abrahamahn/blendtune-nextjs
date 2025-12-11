// src\client\shared\utils\stringHelpers.ts
export function renderValue(value: string): string | null {
    return value && value !== "n/a" && value !== "" ? value : null;
  }
  
  export function formatDuration(durationString: string): string {
    const [minutesStr, secondsStr] = durationString.split(":");
    const minutes = parseInt(minutesStr, 10);
    const seconds = parseInt(secondsStr, 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  