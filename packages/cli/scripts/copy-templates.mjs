import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const src = path.join(root, "src", "templates");
const dest = path.join(root, "dist", "templates");

async function main() {
  await fs.remove(dest);
  await fs.copy(src, dest);

  // Also compile the .ts files inside templates/new-app down to plain
  // text copies with no transformation — they are copied verbatim
  // into generated apps and compiled later by the *generated app's*
  // own tsc, not by the CLI's build.
  console.log(`Copied templates -> ${dest}`);
}

main();
