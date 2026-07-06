# Blendtune Multi-Tenancy & bslt-Alignment Plan

> Status: **DRAFT v2 — awaiting approval.** North star: refactor structure + database so the app
> ports into the **bslt stack** (`/home/abe/projects/main/bslt/bslt-main`) with minimal friction,
> and become multi-tenant *using bslt's existing tenancy model*.
> Last updated: 2026-07-06.

## 1. Goal (revised)

Blendtune becomes a **creator-marketplace** (tenant = creator workspace that owns its tracks;
buyers browse across all). But the shape of *every* change is now dictated by one rule:

> **Mirror bslt's conventions so porting is copy-paste, not rewrite.**

bslt already solves multi-tenancy, RLS, auth, storage, and media. We do not invent parallel
systems — we reshape Blendtune to slot into bslt's.

## 2. What bslt already provides (do not reinvent)

| Concern | bslt reality | Blendtune target |
|---|---|---|
| Tenancy | `tenants` table (`id, name, slug, owner_id, is_active, …`) + `memberships` (`tenant_id, user_id, role owner\|admin\|member\|viewer`) | A creator workspace **is a `tenants` row**; owner via `memberships` |
| Scoping col | `tenant_id` on scoped tables | `tenant_id` on all `meekah.*` |
| Isolation | Postgres RLS + `SET LOCAL app.tenant_id/app.user_id/app.role`, policies use `current_setting('app.tenant_id')::uuid` | Same GUC + policy pattern |
| Tenant resolution | per-request: JWT/`x-tenant-id` → verify `memberships` → contextualize; raw headers never trusted | Same, path-based `/c/:slug` → resolve tenant → verify membership |
| DB access | raw SQL over `postgres` driver, `RawDb` interface, query builder, **repositories** | `RawDb`-shaped interface + repositories (keep `pg` under the hood for now) |
| Migrations | numbered `.sql` files + custom runner (`0000_`, `0100_`, `0900_rls.sql`) | **Adopt this style** (supersedes node-pg-migrate) |
| Auth | Argon2id + JWT + refresh tokens + device `user_sessions` | Keep bcrypt+session now; restructure into bslt module shape; full swap gated |
| Storage | `@bslt/storage` S3 provider (custom `endpoint` ⇒ DO Spaces) + HMAC signed URLs | `StorageClient`-shaped adapter wrapping current Spaces streaming |
| Media | `@bslt/media` (ffmpeg, audio-metadata, range streaming) | Structure audio behind a media port |
| Contracts | `@bslt/shared` domain types + custom schema framework + `contract.<domain>.ts` | Per-domain contracts in `shared/` |
| Conventions | file-path header comment, barrel `index.ts`, path aliases, colocated `*.test.ts` | Already partly present; enforce |

## 3. Decision reversals from v1 (because of bslt)

1. **Tenancy naming** → use bslt's `tenants` + `memberships` + `tenant_id` + `app.tenant_id`
   (was: `tenancy.workspaces` / `workspace_id`). "Workspace" stays as *UI wording* only.
2. **Migration tool** → adopt **bslt-style numbered `.sql` + tiny runner** (was: node-pg-migrate).
   Same numbering scheme so files lift into `main/server/db/migrations/` later. **Needs re-confirm.**
3. **DB driver** → keep `pg` now but hide it behind a `RawDb`-shaped interface mirroring
   bslt's (`query/queryOne/execute/transaction/withSession`); swap to the `postgres` driver at
   port time. Low risk now, trivial swap later. **Recommend; alternative = switch driver now.**

## 4. Target structure (bslt-mirrored)

Reshape `src/` so each unit maps 1:1 to a bslt package/module:

```
src/
├── shared/           → @bslt/shared     domain types, schemas, per-domain contracts
├── server/
│   ├── db/           → @bslt/db         RawDb client, query builder-lite, repositories,
│   │                                    schema/ (TS interface + *_COLUMNS maps), migrations/
│   ├── core/         → @bslt/core       domains: auth, sessions, tenants, tracks(catalog),
│   │                                    each = routes.ts · handlers/ · service.ts · types.ts · index.ts
│   ├── storage/      → @bslt/storage    StorageClient port + Spaces adapter + signed URLs
│   └── media/        → @bslt/media      audio metadata + range streaming
└── client/           → @bslt/web/react/ui   feature UIs (creator dashboard, buyer marketplace)
```
Next.js `app/api/*/route.ts` become **thin adapters** that call `core` handlers — so the business
logic is Next-independent and lifts into Fastify handlers unchanged.

## 5. Database changes (mirroring bslt migrations)

Single consolidated DB (schemas kept). New numbered SQL migrations:

- `0000_baseline.sql` — capture current `auth`/`users`/`meekah` schema (idempotent `IF NOT EXISTS`).
- `0100_tenants.sql` — `tenants` + `memberships` (+ `invitations` later), bslt columns/roles.
- `0101_personal_tenants.sql` — backfill a tenant per existing user + seed one "Blendtune" creator
  tenant that owns all current tracks (so nothing 404s).
- `0200_tracks_tenant_id.sql` — add `tenant_id uuid references tenants(id)` to every `meekah.*`
  table; backfill to the seed tenant.
- `0900_rls.sql` — `ENABLE ROW LEVEL SECURITY` + isolation policies (`tenant_id =
  current_setting('app.tenant_id',true)::uuid`) matching bslt patterns; separate public-read path
  for the marketplace (`published = true`).

## 6. Server changes (bslt-shaped)

- `RawDb` client wrapping `pg` with `withSession({userId,tenantId,role})` that opens a txn and runs
  `SET LOCAL app.*` — byte-for-byte the mechanism in `main/server/db/src/client.ts`.
- Repositories per domain (`tracksRepo`, `tenantRepo`, `membershipRepo`, `userRepo`, `sessionRepo`).
- `getRequestContext(req) → { userId, tenantId, role }` with membership verification (mirrors
  bslt `contextualizeRequest`); replaces bare `requireSession` (returns only userId today).
- `middleware.ts` resolves tenant from `/c/:slug`.
- Move inline tracks logic (route → `core/tracks/service.ts`); split `listPublic()` (marketplace)
  vs `listForTenant()` (creator). Fix found bugs: cron hits `public.sessions` not `auth.sessions`;
  empty `services/tracks/mapper.ts`.

## 7. Phases (each independently reviewable & shippable)

| Phase | Scope | Ports-to-bslt payoff |
|---|---|---|
| **0. Foundations** | Consolidate the two DBs → one; add SQL-migration runner + `0000_baseline`; introduce `RawDb` interface over `pg`; collapse pools. No behavior change. | DB access matches `@bslt/db` shape |
| **1. Tenancy schema** | `0100_tenants` + `0101_personal_tenants` + `0200_tracks_tenant_id`; seed + backfill. Reads unchanged. | `tenants`/`memberships` identical to bslt |
| **2. Module reshape** | Extract `core/` domains (auth, sessions, tenants, tracks) into `routes/handlers/service/types`; routes become thin; `getRequestContext`; middleware `/c/:slug`. | Handlers lift into `@bslt/core` |
| **3. RLS** | `0900_rls` + `withSession` GUC wiring + public-read path; isolation tests (tenant A ≠ tenant B). | Same RLS engine as bslt |
| **4. Storage/media ports** | `StorageClient` adapter over DO Spaces + signed URLs; audio behind media port. | Swaps to `@bslt/storage`/`@bslt/media` |
| **5. Creator surface** | Upload/manage-catalog API scoped to tenant; membership mgmt. | Uses tenant-scoped repos |
| **6. Client** | Buyer marketplace (root) + creator dashboard (`/c/:slug`) + workspace switcher. | Maps to `@bslt/web` features |
| **7. Refactor sweep** | DRY, barrels, aliases, colocated tests, file headers, dead-code. | Passes bslt lint/test-pair gates |
| **8. Dependencies** | Minors/patches now; majors gated (Tailwind v4 etc.). | — |

## 8. Deferred / gated (needs its own approval)

- **Auth swap** bcrypt+session → Argon2id+JWT+refresh (bslt model). Security-sensitive; do at/near
  port time, not now.
- **Profile consolidation**: bslt inlines profile on `users`; Blendtune has separate `users.profile`.
  Align later (data migration).
- **Validation framework**: bslt uses a custom schema lib, not Zod. Blendtune has neither broadly;
  introduce bslt-compatible contracts in `shared/` incrementally.
- **Driver swap** `pg` → `postgres` (porsager): at port time.

## 9. Decisions (v1, still locked)

- Consolidate the two DBs into one. ✅
- Packages: minors/patches now, majors gated. ✅
- Routing: path-based `/c/:slug`. ✅

## 10. Decisions v2 (LOCKED — 2026-07-06)

1. **Migration tooling** → **bslt-style numbered `.sql` + tiny runner.** Supersedes node-pg-migrate.
2. **DB driver** → **keep `pg` behind a bslt-shaped `RawDb`** now; swap to `postgres` at port time.
3. **Refactor** → **reshape `src/` into the bslt `core/` module layout now** (routes/handlers/
   service/types + repositories). This is the point of the exercise.
