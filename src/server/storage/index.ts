// src/server/storage/index.ts
import { createSpacesStorage } from './spaces';

export { createSpacesStorage } from './spaces';
export type { SpacesConfig } from './spaces';
export type { StorageClient, GetObjectOptions } from './types';

/** The app's public-media storage client (Blendtune DO Spaces bucket). */
export const storage = createSpacesStorage({
  hosts: [
    'https://blendtune-public.nyc3.cdn.digitaloceanspaces.com',
    'https://blendtune-public.nyc3.digitaloceanspaces.com',
  ],
});
