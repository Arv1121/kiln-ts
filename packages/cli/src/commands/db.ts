import { Command } from "commander";
import { spawn } from "node:child_process";
import kleur from "kleur";

function runNpmScript(script: string, extraArgs: string[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", script, ...extraArgs], {
      stdio: "inherit",
      cwd: process.cwd(),
      shell: process.platform === "win32",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`"npm run ${script}" exited with code ${code}`));
    });
  });
}

export function dbCommand(): Command {
  const cmd = new Command("db").description("Database tasks (wraps Prisma)");

  cmd
    .command("migrate")
    .description("Run pending migrations (wraps `prisma migrate dev`)")
    .action(async () => {
      console.log(kleur.cyan("Running migrations ..."));
      await runNpmScript("db:migrate");
    });

  cmd
    .command("seed")
    .description("Run the seed script")
    .action(async () => {
      console.log(kleur.cyan("Seeding database ..."));
      await runNpmScript("db:seed");
    });

  cmd
    .command("studio")
    .description("Open Prisma Studio")
    .action(async () => {
      console.log(kleur.cyan("Opening Prisma Studio ..."));
      await runNpmScript("db:studio");
    });

  return cmd;
}
