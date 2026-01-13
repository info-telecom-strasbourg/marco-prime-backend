import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../db/index.js";
import { members } from "../../db/schema.js";
import {
  rechargeReceiptSchema,
  rechargeRequestSchema,
} from "../../validators/recharge.validator.js";

const rechargeRouter = new Hono();

rechargeRouter.post(
  "/",
  zValidator("json", rechargeRequestSchema),
  async (c) => {
    const { cardNumber, adminCardNumber, amount } = c.req.valid("json");

    try {
      // Get member to recharge
      const [member] = await db
        .select()
        .from(members)
        .where(eq(members.cardNumber, cardNumber))
        .limit(1);

      if (!member) {
        return c.json({ error: "Member not found" }, 404);
      }

      // Check if member is admin
      const memberIsAdmin = member.admin;

      // If member is not admin, require adminCardNumber
      let adminMember = null;
      if (!memberIsAdmin) {
        if (!adminCardNumber) {
          return c.json(
            {
              error:
                "Admin card number required for non-admin member recharge",
            },
            400,
          );
        }

        // Get admin member
        const [admin] = await db
          .select()
          .from(members)
          .where(eq(members.cardNumber, adminCardNumber))
          .limit(1);

        if (!admin) {
          return c.json({ error: "Admin member not found" }, 404);
        }

        if (!admin.admin) {
          return c.json(
            { error: "Provided card number is not an admin" },
            403,
          );
        }

        adminMember = admin;
      }

      // Calculate new balance
      const currentBalance = parseFloat(member.balance);
      const rechargeAmount = parseFloat(amount.toFixed(2));
      const newBalance = (currentBalance + rechargeAmount).toFixed(2);

      // Update member balance
      await db
        .update(members)
        .set({ balance: newBalance })
        .where(eq(members.id, member.id));

      // Build receipt
      const receipt = rechargeReceiptSchema.parse({
        success: true,
        transaction: {
          date: new Date(),
          member: {
            id: member.id,
            firstName: member.firstName,
            lastName: member.lastName,
            cardNumber: member.cardNumber!,
          },
          processedBy: adminMember
            ? {
                id: adminMember.id,
                firstName: adminMember.firstName,
                lastName: adminMember.lastName,
                cardNumber: adminMember.cardNumber!,
                isAdmin: adminMember.admin,
              }
            : undefined,
          amount: rechargeAmount.toFixed(2),
          previousBalance: member.balance,
          newBalance,
        },
      });

      return c.json(receipt, 201);
    } catch (error) {
      console.error("Recharge error:", error);
      return c.json({ error: "Recharge failed" }, 500);
    }
  },
);

export { rechargeRouter };
