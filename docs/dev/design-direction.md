# Blendtune design direction (UI-2)

The brief for the pure-CSS redesign. Every UI change in UI-3/4/5 follows this document.

## Subject & job

Blendtune sells **type beats** — instrumentals in the style of a named artist ("PLAYA
[Bad Bunny]"). The buyer is a recording artist hunting for something to write on; the
seller is a producer. The catalog page has one job: **let an artist hear candidates fast
and narrow by musical facts** (genre, BPM, key, mood). It is a pro tool with shopping
semantics — closer to a record crate + channel strip than a brochure.

## Direction: "studio at night"

Dark-first, **warm** near-black — the room a beat is actually bought in. Not the AI-default
cold `#0a0a0a` + acid accent: the base has a faint red-brown undertone (hardware bitumen,
not OLED black) and the single accent is **VU amber** — the glow of tape machines, console
meters, MPC pads. Light theme exists and works, but dark is the designed-for mode.

### Palette (tokens in `blendtune.css`)

| Name | Hex | Role |
|---|---|---|
| Char | `#131014` | bg (dark) |
| Booth | `#1B171D` | surface |
| Console | `#241F26` | surface-strong / hover |
| Seam | `#2E2830` | border |
| Bone | `#EDE9E3` | text |
| Smoke | `#9C948E` | text-muted |
| VU Amber | `#F2A33C` | primary/accent — play states, active filters, links |
| Meter Green | `#63C68C` | success only |
| Clip Red | `#E5604C` | danger only |

Restraint rule: amber is the only voice of emphasis. If two things glow, neither does.

### Typography

- **Display**: Berthold Akzidenz Grotesk Medium Extended (already in `public/fonts`) —
  wordmark, page titles, hero. Tracked slightly tight, always sentence case or caps-with-purpose.
  It is the brand; use it sparingly so it stays loud.
- **Body/UI**: Archivo (self-hosted woff2, 400/500/600) — a grotesque that shares Akzidenz's
  bones; clean at 13–15px UI sizes.
- **Data/mono**: IBM Plex Mono 500 — *all musical facts*: key, BPM, duration, counts.

### Signature element: the facts readout

Every track renders its musical facts as one consistent **LED-style mono readout**:
`Cmin · 98 · 3:42` — IBM Plex Mono, small caps chip on `Console` background. When a track
is playing, its readout (and only its readout) glows amber. This replaces today's three
inconsistent chip styles and is the one element the product is remembered by.

## Layout rules (marketplace)

- Keep the efficient three-zone shell: left nav rail · content · persistent bottom player.
- **Kill the right details sidebar** — its content moves into the bottom player (expanded
  state) and the row itself. The catalog gets the full width back.
- Track row grammar: `artwork │ TITLE + producer │ facts readout │ ≤3 muted tags │ hover actions`.
  Type-artist reference stays in the title (it's the product convention), moods become at most
  three quiet tags — no more six-cell grey metadata tables.
- Left rail = navigation only (Sounds, Pricing, Support, Submit). Genres are tabs above the
  catalog — not duplicated in the rail.
- Filters are one chip style (Seam border, Bone text; active = amber border + amber text).
- Hero (home): the thesis is *sound*. Extended-grotesque headline + one featured beat playable
  in a single click, sitting on Char. Copy: "Find the beat. Make the record." — no broken-English
  taglines, no feature grids.

## Component rules

- Buttons: `@ui` Button variants only. Primary = amber fill/char text; secondary = Seam border,
  Bone text; ghost for tertiary. No hand-rolled buttons anywhere.
- All colors via `var(--ui-*)`. No hex in components, no Tailwind classes in converted files.
- Radii: bslt defaults (`--ui-radius-md`) — soft, not pill, except the facts readout chip.
- Motion: one orchestrated moment — play-state transitions (readout glow, row highlight,
  player slide). No scroll-triggered decoration. `prefers-reduced-motion` respected.
- Focus states always visible (`--ui-focus`); keyboard is a first-class instrument.

## Copy voice

Plain verbs, sentence case, artist-side vocabulary: "Play", "Save", "Use this beat".
Facts never chatty ("98 BPM", never "Tempo: 98 beats per minute"). Errors say what happened
and what to do. Empty states invite: "No beats match — loosen a filter."
