import * as t from "drizzle-orm/mysql-core";

export const members = t.mysqlTable("members", {
  id: t
    .bigint("id", { mode: "number", unsigned: true })
    .notNull()
    .primaryKey()
    .autoincrement(),
  lastName: t.varchar("last_name", { length: 50 }).notNull(),
  firstName: t.varchar("first_name", { length: 50 }).notNull(),
  cardNumber: t.bigint("card_number", { mode: "number" }),
  email: t.varchar("email", { length: 50 }).notNull(),
  phone: t.varchar("phone", { length: 50 }),
  balance: t
    .decimal("balance", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
  admin: t.boolean("admin").notNull().default(false),
  contributor: t.boolean("contributor").notNull().default(false),
  birthDate: t.date("birth_date"),
  sector: t.varchar("sector", { length: 255 }),
  createdAt: t.timestamp("created_at").notNull().defaultNow(),
  class: t.int("class"),
});
