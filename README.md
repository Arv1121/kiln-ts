# Kiln 


A Rails-style, convention-over-configuration framework for TypeScript.

Kiln gives you one obvious way to structure a backend app — models,
controllers, and routes derived automatically from file names and
function names, the same bet Rails made in 2004 — built on a modern
TypeScript stack (Express, Prisma, Zod).

```bash
npx kiln-ts new my-app
cd my-app
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

That's a running server with a working route at `http://localhost:3000`.

## Why

The TypeScript ecosystem has Django (Python) and Rails (Ruby) levels
of batteries-included convenience, but the dominant pattern is still
"assemble Express + an ORM + a validator + a router yourself." Kiln
picks one good way to wire those together and gets out of your way.

It's also deliberately designed to be easy for AI coding agents
(Claude Code, Cursor, etc.) to extend correctly — strong, consistent
conventions mean an agent editing one controller can predict the
shape of every other one without re-reading the whole codebase. See
[AGENTS.md](./AGENTS.md) for the agent-facing version of the
conventions.

## Quick example

```bash
kiln generate model Post title:string body:string published:boolean
kiln generate controller posts
kiln db:migrate
```

This gives you a fully working `GET/POST/PATCH/DELETE /posts` REST
resource, backed by SQLite via Prisma, with request validation via
Zod — with zero hand-written routing code.

```bash
curl http://localhost:3000/posts
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","body":"First post","published":true}'
```

## How routing works

| File / export                          | Becomes...                |
|------------------------------------------|----------------------------|
| `src/controllers/posts.controller.ts`    | Routes mounted at `/posts` |
| exported `index`                         | `GET /posts`               |
| exported `show`                          | `GET /posts/:id`           |
| exported `create`                        | `POST /posts`              |
| exported `update`                        | `PATCH /posts/:id`         |
| exported `destroy`                       | `DELETE /posts/:id`        |

Full details in [CONVENTIONS.md](./CONVENTIONS.md).

## CLI reference

```
kiln new <app-name>                          Scaffold a new app
kiln generate model <Name> field:type ...    Generate a model
kiln generate controller <resource>          Generate a CRUD controller
kiln db migrate                              Run pending migrations
kiln db seed                                 Run the seed script
kiln db studio                               Open Prisma Studio
kiln server                                  Start the dev server
```

Supported field types for `kiln generate model`: `string`, `text`,
`int`, `integer`, `float`, `boolean`, `datetime`.

## Local development (working on Kiln itself)

```bash
git clone https://github.com/<you>/kiln-ts.git
cd kiln-ts
npm install
npm run build --workspace=kiln-ts
cd packages/cli && npm link
```

Now the `kiln` command points at your local build. Any time you
change CLI source, re-run `npm run build` in `packages/cli` (the link
stays valid — you don't need to `npm link` again).

## Status

Early. The core loop (new → generate model → generate controller →
migrate → run) works. Not yet covered: authentication, background
jobs, a view/templating layer, production deploy tooling. Contributions
welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
