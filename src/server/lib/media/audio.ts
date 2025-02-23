// src\server\lib\media\audio.ts
export function getContentType(extension: string): string {
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
        return "application/octet-stream";
    }
  }