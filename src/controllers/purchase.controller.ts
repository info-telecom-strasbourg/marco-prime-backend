import type { Context } from "hono";
import type { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { members, orders, products } from "../db/schema.js";
import {
  purchaseReceiptSchema,
  purchaseRequestSchema,
} from "../validators/purchase.validator.js";

type PurchaseRequest = z.infer<typeof purchaseRequestSchema>;
type PurchaseReceiptDTO = z.infer<typeof purchaseReceiptSchema>;

export class PurchaseController {
  async createPurchase(c: Context) {
    const { productId, cardNumber, amount } =
      this.getValidatedBody<PurchaseRequest>(c);

    const product = await this.getProduct(productId);
    this.validateProductAvailability(product);

    const member = await this.getMember(cardNumber);

    const totalPrice = this.calculateTotalPrice(product.price, amount);
    this.validateSufficientBalance(member.balance, totalPrice);
    const newBalance = this.calculateNewBalance(member.balance, totalPrice);

    const { orderId, orderDate } = await this.createOrderInTransaction(
      product,
      member,
      amount,
      newBalance,
    );

    const receipt = this.buildPurchaseReceipt(
      orderId,
      orderDate,
      product,
      member,
      amount,
      totalPrice,
      member.balance,
      newBalance,
    );

    return c.json(receipt, 201);
  }

  private getValidatedBody<T>(c: Context): T {
    return c.req.valid("json" as never) as T;
  }

  private async getProduct(productId: number) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      throw new HTTPException(404, {
        message: `Product with identifier '${productId}' not found`,
      });
    }

    return product;
  }

  private validateProductAvailability(product: any): void {
    if (!product.available) {
      throw new HTTPException(400, {
        message: `Product with ID ${product.id} is not available`,
      });
    }
  }

  private async getMember(cardNumber: number) {
    const [member] = await db
      .select()
      .from(members)
      .where(eq(members.cardNumber, cardNumber))
      .limit(1);

    if (!member) {
      throw new HTTPException(404, {
        message: `Member with identifier '${cardNumber}' not found`,
      });
    }

    return member;
  }

  private calculateTotalPrice(productPrice: string, amount: number): string {
    const unitPrice = parseFloat(productPrice);
    return (unitPrice * amount).toFixed(2);
  }

  private validateSufficientBalance(
    currentBalance: string,
    totalPrice: string,
  ): void {
    if (parseFloat(currentBalance) < parseFloat(totalPrice)) {
      const errorResponse = new Response(
        JSON.stringify({
          error: "Insufficient balance",
          required: totalPrice,
          available: currentBalance,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
      throw new HTTPException(400, { res: errorResponse });
    }
  }

  private calculateNewBalance(
    currentBalance: string,
    totalPrice: string,
  ): string {
    return (parseFloat(currentBalance) - parseFloat(totalPrice)).toFixed(2);
  }

  private async createOrderInTransaction(
    product: any,
    member: any,
    amount: number,
    newBalance: string,
  ): Promise<{ orderId: number; orderDate: Date }> {
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

      return { orderId: order.id, orderDate: createdOrder.date };
    });
  }

  private buildPurchaseReceipt(
    orderId: number,
    orderDate: Date,
    product: any,
    member: any,
    amount: number,
    totalPrice: string,
    previousBalance: string,
    newBalance: string,
  ): PurchaseReceiptDTO {
    return {
      success: true,
      transaction: {
        orderId,
        date: orderDate,
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
        previousBalance,
        newBalance,
      },
    };
  }
}
