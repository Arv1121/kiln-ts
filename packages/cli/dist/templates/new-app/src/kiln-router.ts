import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { KilnController } from "./kiln-types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTROLLERS_DIR = path.join(__dirname, "controllers");

/**
 * Maps a controller's exported handler names to HTTP verbs + paths,
 * exactly per CONVENTIONS.md section 2. This is the one place that
 * encodes "the Kiln way" of routing — change it here, and every app
 * built with this version of Kiln changes consistently.
 */
function mount(router: Router, resourceName: string, controller: KilnController) {
  const base = `/${resourceName}`;

  if (controller.index) router.get(base, controller.index);
  if (controller.show) router.get(`${base}/:id`, controller.show);
  if (controller.create) router.post(base, controller.create);
  if (controller.update) router.patch(`${base}/:id`, controller.update);
  if (controller.destroy) router.delete(`${base}/:id`, controller.destroy);
}

/**
 * Scans src/controllers/*.controller.ts (compiled to .js at runtime)
 * and mounts each one at /<resource-name>, derived from the filename.
 * No router file to hand-maintain — this is intentional.
 */
export async function buildRouter(): Promise<Router> {
  const router = Router();

  if (!fs.existsSync(CONTROLLERS_DIR)) {
    return router;
  }

  const files = fs
    .readdirSync(CONTROLLERS_DIR)
    .filter((f) => f.endsWith(".controller.js") || f.endsWith(".controller.ts"));

  for (const file of files) {
    const resourceName = file.replace(/\.controller\.(js|ts)$/, "");
    const modulePath = path.join(CONTROLLERS_DIR, file.replace(/\.ts$/, ".js"));
    const mod = await import(`file://${modulePath}`);
    const controller: KilnController = mod.default ?? mod;
    mount(router, resourceName, controller);
    console.log(`  → mounted /${resourceName} from ${file}`);
  }

  return router;
}
