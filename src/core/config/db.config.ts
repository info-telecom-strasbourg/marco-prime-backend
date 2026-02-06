import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import * as schema from "@/db/schemas/index.ts";
import { env } from "./env.config.ts";

const pool = mysql.createPool({
  uri: env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema,
  mode: "default",
});
