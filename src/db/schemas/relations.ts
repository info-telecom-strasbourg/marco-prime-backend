import { relations } from "drizzle-orm";
import { members } from "./members.schema.ts";
import { orders } from "./orders.schema.ts";
import { productTypes } from "./product-types.schema.ts";
import { products } from "./products.schema.ts";

export const membersRelations = relations(members, ({ many }) => ({
  orders: many(orders),
}));

export const productTypesRelations = relations(productTypes, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  type: one(productTypes, {
    fields: [products.productTypeId],
    references: [productTypes.id],
  }),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
  member: one(members, {
    fields: [orders.memberId],
    references: [members.id],
  }),
}));
