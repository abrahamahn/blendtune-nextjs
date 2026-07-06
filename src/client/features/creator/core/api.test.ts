// src/client/features/creator/core/api.test.ts
import {
  CreatorApiError,
  createWorkspaceTrack,
  fetchWorkspaceCatalog,
  fetchWorkspaces,
} from './api';

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('creator api client', () => {
  const fetchMock = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('fetchWorkspaces unwraps the workspaces list', async () => {
    const workspaces = [{ id: 't-1', name: 'W', slug: 'w', logoUrl: null, role: 'owner' }];
    fetchMock.mockResolvedValue(jsonResponse({ workspaces }));
    expect(await fetchWorkspaces()).toEqual(workspaces);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/creator/workspaces',
      expect.objectContaining({ cache: 'no-store' }),
    );
  });

  it('fetchWorkspaceCatalog sends the tenant header and returns a list', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ 1: { id: 1 }, 2: { id: 2 } }));
    const tracks = await fetchWorkspaceCatalog('meekah');
    expect(tracks.map((t) => t.id)).toEqual([1, 2]);
    const [, init] = fetchMock.mock.calls[0];
    expect(init?.headers).toEqual({ 'x-tenant-slug': 'meekah' });
  });

  it('fetchWorkspaceCatalog returns [] for an empty workspace', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    expect(await fetchWorkspaceCatalog('new')).toEqual([]);
  });

  it('createWorkspaceTrack POSTs JSON with the tenant header', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: 63, catalog: 'vfy001', title: 'T' }, 201));
    const created = await createWorkspaceTrack('meekah', { catalog: 'vfy001', title: 'T' });
    expect(created).toEqual({ id: 63, catalog: 'vfy001', title: 'T' });
    const [, init] = fetchMock.mock.calls[0];
    expect(init?.method).toBe('POST');
    expect(JSON.parse(init?.body as string)).toEqual({ catalog: 'vfy001', title: 'T' });
  });

  it('throws CreatorApiError with status + code from the API body', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: 'Catalog id "x" is already taken', code: 'TRACK_CATALOG_TAKEN' }, 409),
    );
    const err = await createWorkspaceTrack('meekah', { catalog: 'x1', title: 'T' }).catch(
      (e: unknown) => e,
    );
    expect(err).toBeInstanceOf(CreatorApiError);
    expect((err as CreatorApiError).status).toBe(409);
    expect((err as CreatorApiError).code).toBe('TRACK_CATALOG_TAKEN');
  });

  it('survives a non-JSON error body', async () => {
    fetchMock.mockResolvedValue(new Response('gateway timeout', { status: 504 }));
    const err = await fetchWorkspaces().catch((e: unknown) => e);
    expect(err).toBeInstanceOf(CreatorApiError);
    expect((err as CreatorApiError).message).toBe('Request failed (504)');
  });
});
