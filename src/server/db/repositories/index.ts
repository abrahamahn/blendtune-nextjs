// src/server/db/repositories/index.ts
import type { RawDb } from '../client';
import { createUsersRepository, type UsersRepository } from './users';
import { createSessionsRepository, type SessionsRepository } from './sessions';
import { createProfileRepository, type ProfileRepository } from './profile';
import { createTenantRepository, type TenantRepository } from './tenant';
import { createTracksRepository, type TracksRepository } from './tracks';

export { createUsersRepository, createSessionsRepository, createProfileRepository };
export { createTenantRepository, createTracksRepository };
export type {
  UsersRepository,
  SessionsRepository,
  ProfileRepository,
  TenantRepository,
  TracksRepository,
};
export type { AuthUserRow, NewAuthUser } from './users';
export type { NewSession, SessionProfileRow } from './sessions';
export type { BasicProfileInput, ProfileRow } from './profile';
export type { TrackInfoRow } from './tracks';

/** The full set of repositories bound to a RawDb (mirrors bslt's createRepositories). */
export interface Repositories {
  users: UsersRepository;
  sessions: SessionsRepository;
  profile: ProfileRepository;
  tenants: TenantRepository;
  tracks: TracksRepository;
}

export function createRepositories(db: RawDb): Repositories {
  return {
    users: createUsersRepository(db),
    sessions: createSessionsRepository(db),
    profile: createProfileRepository(db),
    tenants: createTenantRepository(db),
    tracks: createTracksRepository(db),
  };
}
