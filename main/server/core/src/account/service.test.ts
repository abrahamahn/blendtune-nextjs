// main/server/core/src/account/service.test.ts
import type { ProfileRow } from '@server/db/repositories/profile';
import { getProfile, updateBasicProfile } from './service';

const mockQueryOne = jest.fn();
const mockExecute = jest.fn();
jest.mock('@server/db', () => ({
  db: {
    queryOne: (query: unknown) => mockQueryOne(query),
    execute: (query: unknown) => mockExecute(query),
  },
}));

const USER_ID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

beforeEach(() => {
  mockQueryOne.mockReset();
  mockExecute.mockReset();
});

describe('getProfile', () => {
  it('returns null for a profile-less user (/api/account 404 pin)', async () => {
    mockQueryOne.mockResolvedValueOnce(null);
    expect(await getProfile(USER_ID)).toBeNull();
  });

  it('returns the profile row when one exists', async () => {
    const row = { user_id: USER_ID, profile_created: true } as ProfileRow;
    mockQueryOne.mockResolvedValueOnce(row);
    expect(await getProfile(USER_ID)).toEqual(row);
  });
});

describe('updateBasicProfile', () => {
  it('maps the request payload onto the repository update', async () => {
    mockExecute.mockResolvedValueOnce(1);
    await updateBasicProfile(USER_ID, {
      userArtistCreatorName: 'MK',
      userType: 'artist',
      userOccupation: 'producer',
      userGender: 'other',
      userDateOfBirth: '1990-01-01',
      userMarketingConsent: false,
    });
    expect(mockExecute).toHaveBeenCalledWith(
      expect.objectContaining({
        values: ['MK', 'artist', 'producer', 'other', '1990-01-01', false, USER_ID],
      }),
    );
  });
});
