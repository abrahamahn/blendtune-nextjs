// src/server/lib/media/audio.ts

/**
 * Determines the MIME content type for a given audio file extension
 * 
 * @param {string} extension - The file extension of the audio file
 * @returns {string} The corresponding MIME content type
 * @description
 * This function maps file extensions to their standard MIME content types.
 * If an unsupported extension is provided, it returns a generic binary stream type.
 * 
 * @example
 * getContentType('mp3')  // returns 'audio/mpeg'
 * getContentType('wav')  // returns 'application/octet-stream'
 */
export function getContentType(extension: string): string {
  // Convert extension to lowercase to ensure case-insensitive matching
  switch (extension.toLowerCase()) {
      case "mp3":
          return "audio/mpeg";
      case "ogg":
          return "audio/ogg";
      case "flac":
          return "audio/flac";
      case "webm":
          return "audio/webm";
      default:
          // Fallback to generic binary stream for unsupported extensions
          return "application/octet-stream";
  }
}