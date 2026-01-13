import { zValidator } from "@hono/zod-validator";
import { count } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../db/index.js";
import { orders } from "../../db/schema.js";
import {
  paginatedResponseSchema,
  paginationQuerySchema,
} from "../../validators/orders.validator.js";

const ordersRouter = new Hono();

ordersRouter.get(
  "/history",
  zValidator("query", paginationQuerySchema),
  async (c) => {
    const { page, limit } = c.req.valid("query");

    const offset = (page - 1) * limit;

    const [{ total }] = await db.select({ total: count() }).from(orders);

    const allOrders = await db
      .select()
      .from(orders)
      .limit(limit)
      .offset(offset)
      .orderBy(orders.date);

    const totalPages = Math.ceil(total / limit);

    const response = paginatedResponseSchema.parse({
      data: allOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });

    return c.json(response);
  },
);

export { ordersRouter };
