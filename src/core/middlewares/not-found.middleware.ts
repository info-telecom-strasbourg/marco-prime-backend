import type { NotFoundHandler } from "hono";
import { HTTPStatusCodes, HTTPStatusPhrases } from "../helpers/http/index.ts";

export const notFoundMiddleware: NotFoundHandler = (c) => {
  return c.json(
    {
      message: `${HTTPStatusPhrases.NOT_FOUND} - ${c.req.path}`,
    },
    HTTPStatusCodes.NOT_FOUND,
  );
};
