# __APP_NAME__

A [Kiln](https://github.com/) app.

## Getting started

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Visit http://localhost:3000

## Conventions

See [CONVENTIONS.md](https://github.com/) in the Kiln repo for the
full rundown. The short version:

- `src/models/` — one file per data model
- `src/controllers/` — one file per resource, named `<name>.controller.ts`
- A controller's exported `index`/`show`/`create`/`update`/`destroy`
  functions become routes automatically. No router file to maintain.

## Common commands

```bash
kiln generate model Post title:string body:string
kiln generate controller posts
kiln db:migrate
npm run dev
```
