// src/server/core/tracks/service.test.ts
import { listPublicCatalog, listTenantCatalog } from './service';
import { NotFoundError } from '../errors';
import type { TracksRepository, TrackInfoRow } from '@server/db/repositories/tracks';

const row = (over: Partial<TrackInfoRow> = {}): TrackInfoRow =>
  ({
    id: 1,
    release: '2018-11-30',
    file_public: 'mkh049_shark.ogg',
    track_catalog: 'mkh049',
    track_title: 'Shark',
    track_producer: 'Meekah',
    duration: '3:44',
    bpm: '66',
    note: 'C',
    scale: 'minor',
    main_genre_1: 'Hip Hop',
    sub_genre_1: 'Trap',
    main_genre_2: '',
    sub_genre_2: '',
    related_artist_1: 'A',
    related_artist_2: 'B',
    related_artist_3: 'C',
    mood_1: 'dark',
    mood_2: '',
    mood_3: '',
    instrument_1: 'piano',
    instrument_category_1: 'keys',
    instrument_2: '',
    instrument_category_2: '',
    instrument_3: '',
    instrument_category_3: '',
    instrument_4: '',
    instrument_category_4: '',
    instrument_5: '',
    instrument_category_5: '',
    tenant_id: 't-1',
    ...over,
  }) as TrackInfoRow;

function repo(over: Partial<TracksRepository> = {}): TracksRepository {
  return {
    listAll: async () => [],
    listByTenant: async () => [],
    createForTenant: async () => row(),
    ...over,
  };
}

describe('tracks service', () => {
  it('shapes catalog rows into the keyed API response', async () => {
    const tracks = repo({ listAll: async () => [row(), row({ track_catalog: 'mkh050' })] });
    const catalog = await listPublicCatalog({ tracks });
    expect(Object.keys(catalog)).toEqual(['1', '2']);
    expect(catalog[1].metadata).toEqual({
      catalog: 'mkh049',
      title: 'Shark',
      release: '2018-11-30',
      producer: 'Meekah',
    });
    expect(catalog[1].info.key).toEqual({ note: 'C', scale: 'minor' });
    expect(catalog[1].info.genre[0]).toEqual({ maingenre: 'Hip Hop', subgenre: 'Trap' });
    expect(catalog[2].id).toBe(2);
  });

  it('throws NotFound when the catalog is empty', async () => {
    await expect(listPublicCatalog({ tracks: repo() })).rejects.toBeInstanceOf(NotFoundError);
  });

  it('returns an empty catalog for a tenant with no tracks yet', async () => {
    expect(await listTenantCatalog({ tracks: repo() }, 't-new')).toEqual({});
  });

  it('lists a single tenant catalog via the repository', async () => {
    const calls: string[] = [];
    const tracks = repo({
      listByTenant: async (id) => {
        calls.push(id);
        return [row()];
      },
    });
    const catalog = await listTenantCatalog({ tracks }, 't-42');
    expect(calls).toEqual(['t-42']);
    expect(catalog[1].metadata.catalog).toBe('mkh049');
  });
});
