import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { env } from "@/lib/config/env.config.ts";
import { HTTPStatusCodes } from "@/lib/helpers/http/index.ts";

export const errorHandlerMiddleware: ErrorHandler = (err, c) => {
  const currentStatus =
    "status" in err ? err.status : c.newResponse(null).status;
  const statusCode =
    currentStatus !== HTTPStatusCodes.OK
      ? (currentStatus as ContentfulStatusCode)
      : HTTPStatusCodes.INTERNAL_SERVER_ERROR;

  const nodeEnv = c.env?.NODE_ENV || env.NODE_ENV;
  return c.json(
    {
      message: err.message,

      stack: nodeEnv === "production" ? undefined : err.stack,
    },
    statusCode,
  );
};
