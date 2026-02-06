import { config } from "dotenv";
import { expand } from "dotenv-expand";
import z from "zod";

expand(config());

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum([
    "fatal",
    "error",
    "warn",
    "info",
    "debug",
    "trace",
    "silent",
  ]),
  DATABASE_URL: z.url(),
});

function getEnv() {
  try {
    // biome-ignore lint/style/noProcessEnv: We need to access process.env to validate it against our schema
    return EnvSchema.parse(process.env);
  } catch (e) {
    const error = e as z.ZodError;
    console.error("❌ Invalid env:");
    console.error(z.flattenError(error).fieldErrors);
    process.exit(1);
  }
}

export const env = getEnv();
