import * as t from "drizzle-orm/mysql-core";
import { members } from "./members.schema.ts";
import { products } from "./products.schema.ts";

export const orders = t.mysqlTable("orders", {
  id: t
    .bigint("id", { mode: "number", unsigned: true })
    .notNull()
    .primaryKey()
    .autoincrement(),
  productId: t
    .bigint("product_id", { mode: "number", unsigned: true })
    .references(() => products.id),
  memberId: t
    .bigint("member_id", { mode: "number", unsigned: true })
    .references(() => members.id),
  price: t.decimal("price", { precision: 10, scale: 2 }).notNull(),
  amount: t.int("amount").notNull(),
  date: t.timestamp("date").notNull().defaultNow(),
});
