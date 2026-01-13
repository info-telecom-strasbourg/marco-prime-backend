import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { members, orders, products } from "../db/schema.js";
import {
  InsufficientBalanceError,
  NotFoundError,
  ProductUnavailableError,
} from "../errors/index.js";
import type { PurchaseReceiptDTO } from "../types/index.js";

export class PurchaseService {
  async executePurchase(
    productId: number,
    cardNumber: number,
    amount: number,
  ): Promise<PurchaseReceiptDTO> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      throw new NotFoundError("Product", productId);
    }

    if (!product.available) {
      throw new ProductUnavailableError(productId);
    }

    const [member] = await db
      .select()
      .from(members)
      .where(eq(members.cardNumber, cardNumber))
      .limit(1);

    if (!member) {
      throw new NotFoundError("Member", cardNumber);
    }

    const unitPrice = parseFloat(product.price);
    const totalPrice = (unitPrice * amount).toFixed(2);
    const currentBalance = parseFloat(member.balance);

    if (currentBalance < parseFloat(totalPrice)) {
      throw new InsufficientBalanceError(totalPrice, member.balance);
    }

    const newBalance = (currentBalance - parseFloat(totalPrice)).toFixed(2);

    return await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          productId: product.id,
          memberId: member.id,
          price: product.price,
          amount,
        })
        .$returningId();

      await tx
        .update(members)
        .set({ balance: newBalance })
        .where(eq(members.id, member.id));

      const [createdOrder] = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, order.id))
        .limit(1);

      return {
        success: true,
        transaction: {
          orderId: order.id,
          date: createdOrder.date,
          product: {
            id: product.id,
            name: product.name,
            title: product.title,
            price: product.price,
          },
          member: {
            id: member.id,
            firstName: member.firstName,
            lastName: member.lastName,
            cardNumber: member.cardNumber!,
          },
          amount,
          totalPrice,
          previousBalance: member.balance,
          newBalance,
        },
      };
    });
  }
}
