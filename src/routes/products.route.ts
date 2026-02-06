import { createRoute } from "@hono/zod-openapi";
import z from "zod/v4";
import { HTTPStatusCodes } from "@/lib/helpers/http/index.ts";
import { jsonContent } from "@/lib/helpers/open-api/response-objects.ts";
import { SelectProductValidator } from "@/validators/product.validator.ts";

const tags = ["Products"];

const list = createRoute({
  tags,
  path: "/products",
  method: "get",
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.array(SelectProductValidator),
      "List all products",
    ),
  },
});

export type ListRoute = typeof list;
export const productRoutes = { list };
