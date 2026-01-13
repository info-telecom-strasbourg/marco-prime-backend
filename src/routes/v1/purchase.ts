import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../db/index.js";
import { members, orders, products } from "../../db/schema.js";
import {
  purchaseReceiptSchema,
  purchaseRequestSchema,
} from "../../validators/purchase.validator.js";

const purchaseRouter = new Hono();

purchaseRouter.post(
  "/",
  zValidator("json", purchaseRequestSchema),
  async (c) => {
    const { productId, cardNumber, amount } = c.req.valid("json");

    try {
      // Get product
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      if (!product) {
        return c.json({ error: "Product not found" }, 404);
      }

      if (!product.available) {
        return c.json({ error: "Product not available" }, 400);
      }

      // Get member
      const [member] = await db
        .select()
        .from(members)
        .where(eq(members.cardNumber, cardNumber))
        .limit(1);

      if (!member) {
        return c.json({ error: "Member not found" }, 404);
      }

      // Calculate total price
      const unitPrice = parseFloat(product.price);
      const totalPrice = (unitPrice * amount).toFixed(2);
      const currentBalance = parseFloat(member.balance);

      // Check if member has enough balance
      if (currentBalance < parseFloat(totalPrice)) {
        return c.json(
          {
            error: "Insufficient balance",
            required: totalPrice,
            available: member.balance,
          },
          400,
        );
      }

      // Calculate new balance
      const newBalance = (currentBalance - parseFloat(totalPrice)).toFixed(2);

      // Create order
      const [order] = await db
        .insert(orders)
        .values({
          productId: product.id,
          memberId: member.id,
          price: product.price,
          amount,
        })
        .$returningId();

      // Update member balance
      await db
        .update(members)
        .set({ balance: newBalance })
        .where(eq(members.id, member.id));

      // Get the created order with date
      const [createdOrder] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, order.id))
        .limit(1);

      // Build receipt
      const receipt = purchaseReceiptSchema.parse({
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
      });

      return c.json(receipt, 201);
    } catch (error) {
      console.error("Purchase error:", error);
      return c.json({ error: "Transaction failed" }, 500);
    }
  },
);

export { purchaseRouter };
