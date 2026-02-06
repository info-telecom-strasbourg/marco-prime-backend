import { pinoLogger } from "hono-pino";
import { pinoConfig } from "@/lib/config/pino.config.ts";

export function pinoMiddleware() {
  return pinoLogger({
    pino: pinoConfig,
  });
}
