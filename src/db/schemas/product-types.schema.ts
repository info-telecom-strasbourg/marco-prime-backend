import * as t from "drizzle-orm/mysql-core";

export const productTypes = t.mysqlTable("product_types", {
  id: t
    .bigint("id", { mode: "number", unsigned: true })
    .notNull()
    .primaryKey()
    .autoincrement(),
  type: t.varchar("type", { length: 50 }).notNull(),
});
