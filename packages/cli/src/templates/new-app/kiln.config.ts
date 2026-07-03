import "dotenv/config";

export interface KilnConfig {
  port: number;
  env: "development" | "production" | "test";
}

export const kilnConfig: KilnConfig = {
  port: Number(process.env.PORT ?? 3000),
  env: (process.env.NODE_ENV as KilnConfig["env"]) ?? "development",
};
