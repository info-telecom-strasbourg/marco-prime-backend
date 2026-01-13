import type { Context } from "hono";
import { AppError } from "../errors/base.error.js";

export const errorHandler = async (err: Error, c: Context) => {
  console.error("Error:", err);

  if (err instanceof AppError && err.isOperational) {
    const errorResponse =
      "toJSON" in err && typeof err.toJSON === "function"
        ? err.toJSON()
        : { error: err.message };

    return c.json(errorResponse, err.statusCode as any);
  }

  return c.json({ error: "An unexpected error occurred" }, 500);
};
