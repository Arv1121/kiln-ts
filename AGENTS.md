# AGENTS.md

This file is for AI coding agents (Claude Code, Cursor, etc.) working
in a Kiln app or on the Kiln framework itself. It's the same content
as CONVENTIONS.md, restated as direct instructions.


## If you are working inside a generated Kiln app

1. **Routing is automatic.** Never hand-write a route or an Express
   `app.get(...)` call outside `src/server.ts`. To add a route, add a
   named export (`index`, `show`, `create`, `update`, or `destroy`)
   to a file in `src/controllers/named-thing.controller.ts`. The
   router scans this directory at startup — see `src/kiln-router.ts`.

2. **One controller file per resource.** The filename before
   `.controller.ts` becomes the URL path segment. `posts.controller.ts`
   → `/posts`.

3. **Models live in `src/models/`, one file per model.** Each model
   file exports:
   - `<Name>Schema` — a Zod schema for validation
   - `<Name>Model` — a typed Prisma accessor (e.g. `PostModel`)

   Use the *exact* exported binding names. A common mistake is to
   reference `postModel` (lowercase) when the actual export is
   `PostModel` (capitalized) — match the casing exactly as it appears
   in the model file's `export const` statement.

4. **Validate before writing.** Every `create`/`update` handler
   should `safeParse` the request body against the model's Zod schema
   before touching Prisma. Return `422` with `parsed.error.flatten()`
   on failure — this is the established pattern, copy it.

5. **Don't introduce a second ORM, validator, or router.** Prisma,
   Zod, and the file-based router are the only sanctioned choices in
   a Kiln app. If a task seems to need something else, say so rather
   than silently adding a new dependency.

6. **Prefer the generators over hand-writing boilerplate.** If asked
   to add a new resource, the correct sequence is:
   ```
   kiln generate model <Name> field:type ...
   kiln generate controller <resource-plural>
   kiln db migrate
   ```
   Hand-editing is appropriate for customizing generated output, not
   for replacing the generation step.

## If you are working on the Kiln framework itself (this repo)

- The CLI lives in `packages/cli/src/`. `commands/` wires up
  `commander`; `generators/` contains the actual codegen logic.
- Templates that get copied into a new user app live in
  `packages/cli/src/templates/new-app/`. Anything there is *user-app*
  code, not CLI code — it must stand on its own (no imports from the
  CLI package).
- After changing anything under `src/`, run `npm run build` in
  `packages/cli` before testing — the `kiln` binary runs from `dist/`.
- `CONVENTIONS.md` is the source of truth. If you change a convention,
  update CONVENTIONS.md, this file, and the README's routing table
  together — they should never drift out of sync.
