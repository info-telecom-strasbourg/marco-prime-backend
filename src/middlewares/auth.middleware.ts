import "dotenv/config";
import type { Context, Next } from "hono";
import { bearerAuth } from "hono/bearer-auth";

const apiToken = process.env.API_TOKEN;
if (!apiToken) {
  throw new Error("API_TOKEN is not defined in environment variables");
}

const bearerAuthHandler = bearerAuth({
  token: apiToken,
});

export const authMiddleware = async (c: Context, next: Next) => {
  if (c.req.method === "OPTIONS") {
    return next();
  }
  return bearerAuthHandler(c, next);
};
