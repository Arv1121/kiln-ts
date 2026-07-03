# Contributing to Kiln

Thanks for considering a contribution. This project is early-stage,
so the bar for small, focused PRs is low — don't feel like you need
to solve everything at once.

## Setup

```bash
git clone https://github.com/<you>/kiln-ts.git
cd kiln-ts
npm install
cd packages/cli
npm run build
npm link
```

`kiln` now points at your local build.

## Workflow for testing a change

```bash
# after editing anything under packages/cli/src/
cd packages/cli
npm run build

# try it against a throwaway app
cd /tmp
kiln new test-app
cd test-app
npm install
kiln generate model Widget name:string
kiln generate controller widgets
```

## Ground rules

- **CONVENTIONS.md is the spec.** If a PR changes a convention
  (folder layout, naming, routing behavior), it must update
  `CONVENTIONS.md` and `AGENTS.md` in the same PR, and update the
  routing table in `README.md` if relevant. These three files should
  never disagree with each other or with the code.
- **No new "magic" without a generator.** If a feature requires the
  user to remember a manual step, prefer adding a `kiln generate ...`
  command that does it for them.
- **Generated app code must stand alone.** Files under
  `packages/cli/src/templates/new-app/` are copied into user
  projects — they cannot import anything from the `kiln-ts` CLI
  package itself.
- **Keep the typed contract strict.** `KilnController` /
  `KilnRequest` / `KilnResponse` in `kiln-types.ts` exist so that
  every controller has an identical, predictable shape. Don't loosen
  these to `any` to make a feature easier to ship.

## Reporting bugs

Open an issue with:
1. The exact `kiln` command you ran
2. What you expected
3. What happened instead (full terminal output, if an error)

## Ideas for first contributions

- Additional field types for `kiln generate model` (e.g. `json`, enums)
- A `kiln generate middleware` command
- A `kiln destroy` command to undo a generator (mirrors Rails)
- Postgres/MySQL support alongside the default SQLite
- A minimal auth scaffold (`kiln generate auth`)
