import type { Context } from "hono";
import { count, desc } from "drizzle-orm";
import { db } from "../config/database.js";
import { orders } from "../db/schema.js";

export class OrderController {
  async getOrdersHistory(c: Context) {
    const query = c.req.valid("query" as never);
    const { page, limit } = query as { page: number; limit: number };
    const offset = (page - 1) * limit;

    const [{ total }] = await db.select({ total: count() }).from(orders);

    const allOrders = await db
      .select()
      .from(orders)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(orders.date));

    const totalPages = Math.ceil(total / limit);

    return c.json({
      data: allOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  }
}
