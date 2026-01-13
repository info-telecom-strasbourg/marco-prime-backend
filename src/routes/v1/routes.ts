import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { MemberController } from "../../controllers/member.controller.js";
import { OrderController } from "../../controllers/order.controller.js";
import { ProductController } from "../../controllers/product.controller.js";
import { PurchaseController } from "../../controllers/purchase.controller.js";
import { RechargeController } from "../../controllers/recharge.controller.js";
import { cardNumberParamSchema } from "../../validators/members.validator.js";
import { paginationQuerySchema } from "../../validators/orders.validator.js";
import { purchaseRequestSchema } from "../../validators/purchase.validator.js";
import { rechargeRequestSchema } from "../../validators/recharge.validator.js";

const router = new Hono();

const memberController = new MemberController();
const productController = new ProductController();
const orderController = new OrderController();
const purchaseController = new PurchaseController();
const rechargeController = new RechargeController();

router.get(
  "/member/:card_number",
  zValidator("param", cardNumberParamSchema),
  (c) => memberController.getMemberByCardNumber(c),
);

router.get("/products", (c) => productController.getAllProducts(c));

router.get(
  "/orders/history",
  zValidator("query", paginationQuerySchema),
  (c) => orderController.getOrdersHistory(c),
);

router.post(
  "/purchase",
  zValidator("json", purchaseRequestSchema),
  (c) => purchaseController.createPurchase(c),
);

router.post(
  "/recharge",
  zValidator("json", rechargeRequestSchema),
  (c) => rechargeController.createRecharge(c),
);

export { router };
