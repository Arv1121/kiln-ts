import { Command } from "commander";
import kleur from "kleur";
import { generateModel } from "../generators/model.js";
import { generateController } from "../generators/controller.js";
export function generateCommand() {
    const cmd = new Command("generate").alias("g").description("Generate models, controllers, etc.");
    cmd
        .command("model")
        .alias("m")
        .argument("<name>", "Model name, e.g. User")
        .argument("[fields...]", "Field definitions, e.g. name:string age:int")
        .description("Generate a Prisma model + typed model file")
        .action(async (name, fields) => {
        try {
            console.log(kleur.cyan(`Generating model ${name} ...`));
            await generateModel(name, fields, process.cwd());
            console.log(kleur.green("✔ Done. Run `kiln db:migrate` to apply the schema change."));
        }
        catch (err) {
            console.error(kleur.red(`✖ ${err.message}`));
            process.exitCode = 1;
        }
    });
    cmd
        .command("controller")
        .alias("c")
        .argument("<name>", "Resource name, plural, e.g. users")
        .description("Generate a CRUD controller for a resource")
        .action(async (name) => {
        try {
            console.log(kleur.cyan(`Generating controller ${name} ...`));
            await generateController(name, process.cwd());
            console.log(kleur.green("✔ Done. Routes will be mounted automatically on next server start."));
        }
        catch (err) {
            console.error(kleur.red(`✖ ${err.message}`));
            process.exitCode = 1;
        }
    });
    return cmd;
}
