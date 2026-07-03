#!/usr/bin/env node
import { Command } from "commander";
import { newCommand } from "./commands/new.js";
import { generateCommand } from "./commands/generate.js";
import { dbCommand } from "./commands/db.js";
import { serverCommand } from "./commands/server.js";
const program = new Command();
program
    .name("kiln")
    .description("Kiln: a Rails-style framework for TypeScript.")
    .version("0.1.0");
program.addCommand(newCommand());
program.addCommand(generateCommand());
program.addCommand(dbCommand());
program.addCommand(serverCommand());
program.parse(process.argv);
