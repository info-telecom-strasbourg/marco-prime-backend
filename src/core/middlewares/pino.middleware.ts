import { pinoLogger } from "hono-pino";
import { pinoConfig } from "@/core/config/pino.config.ts";

export function pinoMiddleware() {
  return pinoLogger({
    pino: pinoConfig,
  });
}
