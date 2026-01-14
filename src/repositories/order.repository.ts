import { count, desc, eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { members, orders } from "../db/schema.js";

export class OrderRepository {
  async countAll() {
    const [{ total }] = await db.select({ total: count() }).from(orders);
    return total;
  }

  async findMany(limit: number, offset: number) {
    return await db
      .select()
      .from(orders)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(orders.date));
  }

  async create(data: {
    productId: number;
    memberId: number;
    price: string;
    amount: number;
  }) {
    const [order] = await db.insert(orders).values(data).$returningId();
    return order;
  }

  async findById(orderId: number) {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    return order;
  }

  async createPurchaseTransaction(
    productId: number,
    memberId: number,
    price: string,
    amount: number,
    newBalance: string,
  ): Promise<{ orderId: number; orderDate: Date }> {
    return await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          productId,
          memberId,
          price,
          amount,
        })
        .$returningId();

      await tx
        .update(members)
        .set({ balance: newBalance })
        .where(eq(members.id, memberId));

      const [createdOrder] = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, order.id))
        .limit(1);

      return { orderId: order.id, orderDate: createdOrder.date };
    });
  }
}
