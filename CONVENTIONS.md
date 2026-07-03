# Kiln Conventions

Kiln is a Rails-style, convention-over-configuration framework for
TypeScript. This document is the single source of truth for how a
Kiln app is structured. If the CLI, the generators, or the docs ever
disagree with this file, this file wins.

## 1. Folder structure

Every generated app follows this exact shape:

```
my-app/
├── src/
│   ├── models/          # Prisma-backed data models (one file per model)
│   ├── controllers/     # Request handlers, one file per resource
│   ├── routes/          # Auto-derived from controllers, rarely hand-edited
│   ├── middleware/       # Cross-cutting request middleware
│   └── server.ts         # App entrypoint
├── prisma/
│   └── schema.prisma     # Single schema file, generators write into it
├── kiln.config.ts        # App-level config (port, db url, etc.)
├── package.json
└── tsconfig.json
```

## 2. Naming conventions (the "magic")

| You write...                          | Kiln infers...                              |
|----------------------------------------|----------------------------------------------|
| `kiln generate model User`             | `src/models/user.ts`, `User` table in Prisma |
| `kiln generate controller users`       | `src/controllers/users.controller.ts`        |
| Controller file `users.controller.ts`  | Routes mounted at `/users`                   |
| Exported function `index`              | `GET /users`                                 |
| Exported function `show`               | `GET /users/:id`                             |
| Exported function `create`             | `POST /users`                                |
| Exported function `update`             | `PATCH /users/:id`                           |
| Exported function `destroy`            | `DELETE /users/:id`                          |

This mirrors Rails' resourceful routing almost exactly, on purpose —
it's a well-tested convention and there's no reason to reinvent it.

## 3. Models

- One file per model in `src/models/`.
- A model file exports a Zod schema (validation) and a typed accessor
  built on the Prisma client.
- `kiln generate model Name field:type field:type...` writes:
  1. A block in `prisma/schema.prisma`
  2. A model file in `src/models/`

## 4. Controllers

- A controller is a plain object of functions: `index`, `show`,
  `create`, `update`, `destroy`. You only implement the ones you need.
- Controllers receive a typed `KilnRequest` and return a typed
  `KilnResponse` — no implicit `any`, ever. This matters specifically
  for AI coding agents: a consistent, fully-typed shape means an agent
  editing one controller can correctly predict the shape of every
  other controller without re-reading the whole codebase.

## 5. Routing

- Routes are NOT hand-written in normal use. They are derived from
  controller file names + exported function names (see table above).
- This is the single biggest "convention over configuration" win:
  there is no router file to keep in sync by hand.

## 6. Config

- One config file: `kiln.config.ts`. No scattered `.env`-only sprawl
  for app behavior — environment variables are read once, in this
  file, and typed from there on.

## 7. Why this matters for AI coding agents

Kiln intentionally has *one correct way* to do most things. This is
the same bet Rails made in 2004, and it pays off twice over in 2026:

- Human contributors ramp up fast because there's one pattern to learn.
- AI coding agents (Claude Code, Cursor, etc.) generate far more
  reliable code against a framework with strong, consistent
  conventions than against an "assemble it yourself" stack — because
  there's less ambiguity about where things go and what shape they
  take.

See `AGENTS.md` for the agent-facing version of this document.
