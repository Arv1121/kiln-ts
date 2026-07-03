import { Command } from "commander";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import kleur from "kleur";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.join(__dirname, "..", "templates", "new-app");

export function newCommand(): Command {
  const cmd = new Command("new");

  cmd
    .argument("<appName>", "Name of the app / target directory to create")
    .description("Scaffold a new Kiln app")
    .action(async (appName: string) => {
      const targetDir = path.resolve(process.cwd(), appName);

      if (await fs.pathExists(targetDir)) {
        console.error(kleur.red(`✖ Directory "${appName}" already exists.`));
        process.exitCode = 1;
        return;
      }

      console.log(kleur.cyan(`Creating new Kiln app in ${targetDir} ...`));
      await fs.copy(TEMPLATE_DIR, targetDir);

      // package.json.tpl -> package.json, with name substitution
      const pkgTplPath = path.join(targetDir, "package.json.tpl");
      const pkgPath = path.join(targetDir, "package.json");
      const pkgRaw = await fs.readFile(pkgTplPath, "utf-8");
      await fs.writeFile(pkgPath, pkgRaw.replace(/__APP_NAME__/g, appName));
      await fs.remove(pkgTplPath);

      // gitignore.tpl -> .gitignore
      // (named gitignore.tpl in the template source because npm strips
      // files literally named ".gitignore" out of published tarballs)
      const gitignoreTplPath = path.join(targetDir, "gitignore.tpl");
      const gitignorePath = path.join(targetDir, ".gitignore");
      if (await fs.pathExists(gitignoreTplPath)) {
        await fs.move(gitignoreTplPath, gitignorePath);
      }

      // README name substitution
      const readmePath = path.join(targetDir, "README.md");
      const readmeRaw = await fs.readFile(readmePath, "utf-8");
      await fs.writeFile(readmePath, readmeRaw.replace(/__APP_NAME__/g, appName));

      console.log(kleur.green(`✔ App created.\n`));
      console.log("Next steps:\n");
      console.log(kleur.bold(`  cd ${appName}`));
      console.log(kleur.bold("  npm install"));
      console.log(kleur.bold("  cp .env.example .env"));
      console.log(kleur.bold("  npm run db:migrate"));
      console.log(kleur.bold("  npm run dev"));
      console.log("");
    });

  return cmd;
}
