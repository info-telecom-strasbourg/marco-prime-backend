import type { AppRouteHandler } from "@/lib/config/app.config.ts";
import { db } from "@/lib/config/db.config.ts";
import { HTTPStatusCodes } from "@/lib/helpers/http/index.ts";
import type { ListRoute } from "@/routes/products.route.ts";

const list: AppRouteHandler<ListRoute> = async (c) => {
  const tasks = await db.query.products.findMany();
  return c.json(tasks, HTTPStatusCodes.OK);
};

export const productHandlers = { list };
