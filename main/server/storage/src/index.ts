// src/server/storage/index.ts
import { createSpacesStorage } from "./spaces";

export { createSpacesStorage } from "./spaces";
export type { SpacesConfig } from "./spaces";
export type { StorageClient, GetObjectOptions } from "./types";

/** Public media is served by Caddy on the droplet; no Spaces dependency. */
export const storage = createSpacesStorage({
  hosts: [process.env.MEDIA_ORIGIN || "https://blendtune.com/media"],
});
