import { defineConfig } from "drizzle-kit";
import { env } from "@/lib/config/env.config.ts";

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schemas",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
