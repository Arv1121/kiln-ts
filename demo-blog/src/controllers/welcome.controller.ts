import type { KilnController } from "../kiln-types.js";

/**
 * Example controller, generated automatically by `kiln new`.
 * This is here so a brand new app has a working route on first run.
 * Feel free to delete this file once you generate your own resources
 * with `kiln generate controller <name>`.
 */
const welcomeController: KilnController = {
  index: (_req, res) => {
    res.json({
      message: "Welcome to Kiln! Edit src/controllers/welcome.controller.ts to get started.",
      nextSteps: [
        "kiln generate model Post title:string body:string",
        "kiln generate controller posts",
        "kiln db:migrate",
      ],
    });
  },
};

export default welcomeController;
