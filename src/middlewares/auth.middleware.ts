import "dotenv/config";
import { bearerAuth } from "hono/bearer-auth";

const apiToken = process.env.API_TOKEN;
if (!apiToken) {
  throw new Error("API_TOKEN is not defined in environment variables");
}

export const authMiddleware = bearerAuth({
  token: apiToken,
});
