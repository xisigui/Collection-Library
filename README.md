# Collection Library

A desktop collection manager built with Electron, React, TypeScript, and SQLite.

## Development

Use Node.js 22 and npm. Install the locked dependencies, then start the desktop app:

```sh
npm ci
npm run dev
```

Vite serves the renderer on port 5123. The Electron launcher waits for Vite before
opening the window. Renderer changes use hot reload; restart `npm run dev` after
changing Electron or preload code.

`npm run dev:react` runs the renderer alone. Collection storage is available only
inside Electron; a browser preview displays a message explaining that requirement.

## Structure

```text
src/
  electron/
    main.ts                         Application startup and shutdown
    window.ts                       BrowserWindow configuration
    paths.ts                        Development and packaged paths
    preload.cts                     Narrow, typed bridge to the renderer
    database/
      database.ts                   SQLite initialization and close
      collection-repository.ts      Collection queries and row mapping
    ipc/
      collection-handlers.ts        IPC registration and sender checks
      collection-validation.ts      Runtime request validation
    tsconfig.json
  renderer/
    main.tsx                        React entry point
    app/
      App.tsx                       Application composition
      providers/theme-provider.tsx
    features/
      collections/
        collections-page.tsx        Collection screen and dialog selection
        api/collections-api.ts      The only renderer access to the bridge
        hooks/use-collections.ts    Loading, errors, and collection state
        components/                 Cards and create/edit/delete dialogs
    components/ui/                  Reusable UI primitives
    hooks/                          Shared React hooks
    lib/                            Shared renderer helpers
    styles/globals.css
    types/electron.d.ts             Window bridge declaration
  shared/
    collections.ts                  Collection, input, API, and IPC types
scripts/
  dev-electron.mjs                  Waits for Vite and launches Electron
tests/
  collections.test.mjs              Real SQLite persistence and validation
  preload.test.mjs                  Compiled bridge contract
  desktop-smoke.cjs                 Hidden Electron integration test
```

The data flow is:

```text
Collection components
  -> useCollections
  -> collectionsApi
  -> window.collections (preload)
  -> IPC handlers
  -> collection repository
  -> SQLite
```

## Boundaries

- **Renderer:** owns presentation and React state. Components receive callbacks;
  they do not call Electron or SQL. Feature-specific code stays together under
  `features/collections`; shared UI remains in `components/ui`.
- **Electron:** owns the database and desktop lifecycle. Startup awaits database
  initialization before registering requests and opening the window. IPC handlers
  validate the caller and payload; the repository handles SQL.
- **Shared:** contains contracts with no React, Electron, or database imports.
  Use `import type` for these contracts. The preload compiles to a standalone
  CommonJS file with only an Electron runtime import, as required by
  [Electron's sandboxed preload environment](https://www.electronjs.org/docs/latest/tutorial/sandbox#preload-scripts).

The `@` alias resolves to `src/renderer`; `@shared` resolves to `src/shared`.
Electron uses relative imports with emitted `.js` extensions. ESLint checks
imports across these boundaries, and both renderer and backend use strict
TypeScript checks.

## State and existing data

Collections are stored in `data.db` under Electron's `userData` directory.
The application identity, database location, and existing `collections` table
are preserved. The repository maps the existing `url_picture` column to the
shared `imageUrl` field; no database migration is needed.

Create and update return a complete collection object. The feature hook updates
React state after each successful mutation, including deletes, without a page
reload. Loading, empty, and error states are separate. Failed mutations leave
the dialog open with an error, and controls are disabled while saving or deleting.
Titles must contain non-whitespace text.

## Verification and distribution

| Command | Purpose |
| --- | --- |
| `npm run lint` | Lint source, scripts, tests, and import boundaries |
| `npm test` | Compile Electron and run five database/validation/preload tests |
| `npm run build` | Compile Electron, type-check the renderer, and build its assets |
| `npm run test:desktop` | Build and test CRUD through hidden Electron windows |
| `npm run dist:win` | Build and package the Windows portable executable |

The desktop smoke test uses an isolated temporary profile and an in-memory
database. It checks create/edit/delete, failed mutations, request validation,
untrusted callers, and updates without page reloads. Expected rejected requests
appear in Electron's test output.

Build output goes to `dist-react/` and `dist-electron/`. The desktop entry point
is `dist-electron/electron/main.js`; its preload is beside it as `preload.cjs`.
Electron Builder packages both output folders. The preload resolves relative
to its compiled module, so it does not need a second copy in extra resources.
