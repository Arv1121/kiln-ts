import express from "express";
import { kilnConfig } from "../kiln.config.js";
import { buildRouter } from "./kiln-router.js";

async function main() {
  const app = express();
  app.use(express.json());

  console.log("Kiln: mounting routes from src/controllers ...");
  const router = await buildRouter();
  app.use(router);

  app.get("/", (_req, res) => {
    res.json({ message: "Kiln app is running.", env: kilnConfig.env });
  });

  app.listen(kilnConfig.port, () => {
    console.log(`\nKiln app listening on http://localhost:${kilnConfig.port}`);
  });
}

main();
