import { Command } from "commander";
import { spawn } from "node:child_process";
import kleur from "kleur";
export function serverCommand() {
    const cmd = new Command("server")
        .alias("s")
        .description("Start the dev server (wraps `npm run dev`)")
        .action(() => {
        console.log(kleur.cyan("Starting Kiln dev server ...\n"));
        const child = spawn("npm", ["run", "dev"], {
            stdio: "inherit",
            cwd: process.cwd(),
            shell: process.platform === "win32",
        });
        child.on("exit", (code) => {
            process.exitCode = code ?? 0;
        });
    });
    return cmd;
}
