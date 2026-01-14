import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { AppError } from "../errors/base.error.js";

export const errorHandler = async (err: Error, c: Context) => {
  if (process.env.NODE_ENV !== "test") {
    console.error("Error:", err);
  }

  // Handle Hono's HTTPException (from bearerAuth, validators, etc.)
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  // Handle custom AppError
  if (err instanceof AppError && err.isOperational) {
    const errorResponse =
      "toJSON" in err && typeof err.toJSON === "function"
        ? err.toJSON()
        : { error: err.message };

    return c.json(errorResponse, err.statusCode as any);
  }

  return c.json({ error: "An unexpected error occurred" }, 500);
};
