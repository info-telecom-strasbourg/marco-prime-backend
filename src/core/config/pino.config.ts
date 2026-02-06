import { pino } from "pino";
import pretty from "pino-pretty";
import { env } from "@/core/config/env.config.ts";

export const pinoConfig = pino(
  {
    level: env.LOG_LEVEL,
  },
  env.NODE_ENV === "production" ? undefined : pretty(),
);
