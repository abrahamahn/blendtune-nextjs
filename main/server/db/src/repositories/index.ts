// src/server/db/repositories/index.ts
import type { RawDb } from '../client';
import { createUsersRepository, type UsersRepository } from './users';
import { createProfileRepository, type ProfileRepository } from './profile';
import { createRefreshTokensRepository, type RefreshTokensRepository } from './refreshTokens';
import { createTenantRepository, type TenantRepository } from './tenant';
import { createTracksRepository, type TracksRepository } from './tracks';

export { createUsersRepository, createProfileRepository, createRefreshTokensRepository };
export { createTenantRepository, createTracksRepository };
export type {
  UsersRepository,
  ProfileRepository,
  RefreshTokensRepository,
  TenantRepository,
  TracksRepository,
};
export type { TenantWithRole } from './tenant';
export type { AuthUserRow, NewAuthUser } from './users';
export type { NewRefreshToken, RefreshTokenRow } from './refreshTokens';
export type { BasicProfileInput, ProfileRow, SessionProfileRow } from './profile';
export type { TrackInfoRow } from './tracks';

/** The full set of repositories bound to a RawDb (mirrors bslt's createRepositories). */
export interface Repositories {
  users: UsersRepository;
  profile: ProfileRepository;
  refreshTokens: RefreshTokensRepository;
  tenants: TenantRepository;
  tracks: TracksRepository;
}

export function createRepositories(db: RawDb): Repositories {
  return {
    users: createUsersRepository(db),
    profile: createProfileRepository(db),
    refreshTokens: createRefreshTokensRepository(db),
    tenants: createTenantRepository(db),
    tracks: createTracksRepository(db),
  };
}
