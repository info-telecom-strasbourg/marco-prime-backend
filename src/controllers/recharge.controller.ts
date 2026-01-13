import type { Context } from "hono";
import { RechargeService } from "../services/recharge.service.js";

export class RechargeController {
  private rechargeService: RechargeService;

  constructor() {
    this.rechargeService = new RechargeService();
  }

  async createRecharge(c: Context) {
    const body = c.req.valid("json" as never);
    const { cardNumber, adminCardNumber, amount } = body as {
      cardNumber: number;
      adminCardNumber?: number;
      amount: number;
    };
    const receipt = await this.rechargeService.executeRecharge(
      cardNumber,
      amount,
      adminCardNumber,
    );
    return c.json(receipt, 201);
  }
}
