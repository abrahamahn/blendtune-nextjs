// src/server/core/account/service.ts
/**
 * Account/profile service (framework-agnostic). Behavior preserved from
 * services/session/userProfile.ts, over the RawDb profile repository.
 */

import { db } from '@server/db';
import { createProfileRepository, type ProfileRow } from '@server/db/repositories/profile';

/** Request payload shape from the profile form (unchanged from the previous service). */
export interface BasicProfileData {
  userArtistCreatorName: string;
  userType: string;
  userOccupation: string;
  userGender: string;
  userDateOfBirth: string;
  userMarketingConsent: boolean;
}

export function getProfile(userId: string): Promise<ProfileRow | null> {
  return createProfileRepository(db).get(userId);
}

export async function updateBasicProfile(userId: string, data: BasicProfileData): Promise<void> {
  await createProfileRepository(db).updateBasic(userId, {
    artistCreatorName: data.userArtistCreatorName,
    userType: data.userType,
    occupation: data.userOccupation,
    gender: data.userGender,
    dateOfBirth: data.userDateOfBirth,
    marketingConsent: data.userMarketingConsent,
  });
}
