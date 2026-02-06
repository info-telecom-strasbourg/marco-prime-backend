import * as t from "drizzle-orm/mysql-core";
import { productTypes } from "./product-types.schema.ts";

export const products = t.mysqlTable("products", {
  id: t
    .bigint("id", { mode: "number", unsigned: true })
    .notNull()
    .primaryKey()
    .autoincrement(),
  name: t.varchar("name", { length: 50 }).notNull(),
  title: t.varchar("title", { length: 25 }).notNull(),
  price: t
    .decimal("price", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
  productTypeId: t
    .bigint("product_type_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => productTypes.id),
  color: t.varchar("color", { length: 50 }),
  available: t.boolean("available").notNull().default(true),
});
