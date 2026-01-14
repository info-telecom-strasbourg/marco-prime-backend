import type { Context } from "hono";
import type { z } from "zod";
import { count, desc } from "drizzle-orm";
import { db } from "../config/database.js";
import { orders } from "../db/schema.js";
import { paginationQuerySchema } from "../validators/orders.validator.js";

type OrdersQueryRequest = z.infer<typeof paginationQuerySchema>;

export class OrderController {
  async getOrdersHistory(c: Context) {
    const { page, limit } = this.getValidatedQuery<OrdersQueryRequest>(c);

    const offset = this.calculateOffset(page, limit);
    const total = await this.countTotalOrders();
    const ordersList = await this.fetchOrders(limit, offset);
    const totalPages = this.calculateTotalPages(total, limit);

    return c.json({
      data: ordersList,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  }

  private getValidatedQuery<T>(c: Context): T {
    return c.req.valid("query" as never) as T;
  }

  private calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  private async countTotalOrders(): Promise<number> {
    const [{ total }] = await db.select({ total: count() }).from(orders);
    return total;
  }

  private async fetchOrders(limit: number, offset: number) {
    return await db
      .select()
      .from(orders)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(orders.date));
  }

  private calculateTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }
}
