import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { members } from "../db/schema.js";
import {
  AdminAuthorizationError,
  ForbiddenError,
  NotFoundError,
} from "../errors/index.js";
import type { RechargeReceiptDTO } from "../types/index.js";

export class RechargeController {
  async createRecharge(c: Context) {
    const body = c.req.valid("json" as never);
    const { cardNumber, adminCardNumber, amount } = body as {
      cardNumber: number;
      adminCardNumber?: number;
      amount: number;
    };

    const member = await this.getMember(cardNumber);

    const adminMember = await this.validateAdminPermissions(
      member,
      adminCardNumber,
    );

    const newBalance = this.calculateNewBalance(member.balance, amount);

    await this.executeRechargeTransaction(member.id, newBalance);

    const receipt = this.buildReceipt(member, adminMember, amount, newBalance);

    return c.json(receipt, 201);
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

  private async validateAdminPermissions(
    member: any,
    adminCardNumber?: number,
  ) {
    if (member.admin) {
      return null;
    }

    if (!adminCardNumber) {
      throw new AdminAuthorizationError();
    }

    const [admin] = await db
      .select()
      .from(members)
      .where(eq(members.cardNumber, adminCardNumber))
      .limit(1);

    if (!admin) {
      throw new NotFoundError("Admin member", adminCardNumber);
    }

    if (!admin.admin) {
      throw new ForbiddenError("Provided card number is not an admin");
    }

    return admin;
  }

  private calculateNewBalance(currentBalance: string, amount: number): string {
    const balance = parseFloat(currentBalance);
    const rechargeAmount = parseFloat(amount.toFixed(2));
    return (balance + rechargeAmount).toFixed(2);
  }

  private async executeRechargeTransaction(
    memberId: number,
    newBalance: string,
  ) {
    await db.transaction(async (tx) => {
      await tx
        .update(members)
        .set({ balance: newBalance })
        .where(eq(members.id, memberId));
    });
  }

  private buildReceipt(
    member: any,
    adminMember: any | null,
    amount: number,
    newBalance: string,
  ): RechargeReceiptDTO {
    return {
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
        amount: parseFloat(amount.toFixed(2)).toFixed(2),
        previousBalance: member.balance,
        newBalance,
      },
    };
  }
}
