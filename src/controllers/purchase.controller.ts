import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { members, orders, products } from "../db/schema.js";
import {
  InsufficientBalanceError,
  NotFoundError,
  ProductUnavailableError,
} from "../errors/index.js";
import type { PurchaseReceiptDTO } from "../types/index.js";

export class PurchaseController {
  async createPurchase(c: Context) {
    const body = c.req.valid("json" as never);
    const { productId, cardNumber, amount } = body as {
      productId: number;
      cardNumber: number;
      amount: number;
    };

    const product = await this.getProduct(productId);
    this.validateProductAvailability(product);

    const member = await this.getMember(cardNumber);

    const { totalPrice, newBalance } = this.calculatePurchase(
      product.price,
      amount,
      member.balance,
    );

    const receipt = await this.executePurchaseTransaction(
      product,
      member,
      amount,
      totalPrice,
      newBalance,
    );

    return c.json(receipt, 201);
  }

  private async getProduct(productId: number) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      throw new NotFoundError("Product", productId);
    }

    return product;
  }

  private validateProductAvailability(product: any) {
    if (!product.available) {
      throw new ProductUnavailableError(product.id);
    }
  }

  private async getMember(cardNumber: number) {
    const [member] = await db
      .select()
      .from(members)
      .where(eq(members.cardNumber, cardNumber))
      .limit(1);

    if (!member) {
      throw new NotFoundError("Member", cardNumber);
    }

    return member;
  }

  private calculatePurchase(
    productPrice: string,
    amount: number,
    memberBalance: string,
  ) {
    const unitPrice = parseFloat(productPrice);
    const totalPrice = (unitPrice * amount).toFixed(2);
    const currentBalance = parseFloat(memberBalance);

    if (currentBalance < parseFloat(totalPrice)) {
      throw new InsufficientBalanceError(totalPrice, memberBalance);
    }

    const newBalance = (currentBalance - parseFloat(totalPrice)).toFixed(2);

    return { totalPrice, newBalance };
  }

  private async executePurchaseTransaction(
    product: any,
    member: any,
    amount: number,
    totalPrice: string,
    newBalance: string,
  ): Promise<PurchaseReceiptDTO> {
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
