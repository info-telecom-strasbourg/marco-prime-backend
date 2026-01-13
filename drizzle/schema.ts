import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, varchar, datetime, text, int, index, unique, bigint, decimal, date, foreignKey } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const prismaMigrations = mysqlTable("_prisma_migrations", {
	id: varchar({ length: 36 }).notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: datetime("finished_at", { mode: 'string', fsp: 3 }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: datetime("rolled_back_at", { mode: 'string', fsp: 3 }),
	startedAt: datetime("started_at", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	appliedStepsCount: int("applied_steps_count", { unsigned: true }).default(0).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "_prisma_migrations_id"}),
]);

export const members = mysqlTable("members", {
	id: bigint({ mode: "number" }).autoincrement().notNull(),
	lastName: varchar("last_name", { length: 100 }).notNull(),
	firstName: varchar("first_name", { length: 100 }).notNull(),
	cardNumber: bigint("card_number", { mode: "number" }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }),
	balance: decimal({ precision: 10, scale: 2 }).default('0.00').notNull(),
	admin: tinyint().default(0).notNull(),
	contributor: tinyint().default(0).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	birthDate: date("birth_date", { mode: 'string' }),
	sector: varchar({ length: 100 }),
	class: int(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
},
(table) => [
	index("members_card_number_idx").on(table.cardNumber),
	index("members_email_idx").on(table.email),
	primaryKey({ columns: [table.id], name: "members_id"}),
	unique("members_card_number_key").on(table.cardNumber),
	unique("members_email_key").on(table.email),
]);

export const orders = mysqlTable("orders", {
	id: bigint({ mode: "number" }).autoincrement().notNull(),
	productId: bigint("product_id", { mode: "number" }).references(() => products.id, { onDelete: "set null", onUpdate: "cascade" } ),
	memberId: bigint("member_id", { mode: "number" }).notNull().references(() => members.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	price: decimal({ precision: 10, scale: 2 }).notNull(),
	amount: int().default(1).notNull(),
	date: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
},
(table) => [
	index("orders_date_idx").on(table.date),
	index("orders_member_id_idx").on(table.memberId),
	index("orders_product_id_idx").on(table.productId),
	primaryKey({ columns: [table.id], name: "orders_id"}),
]);

export const productTypes = mysqlTable("product_types", {
	id: bigint({ mode: "number" }).autoincrement().notNull(),
	type: varchar({ length: 50 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "product_types_id"}),
	unique("product_types_type_key").on(table.type),
]);

export const products = mysqlTable("products", {
	id: bigint({ mode: "number" }).autoincrement().notNull(),
	name: varchar({ length: 100 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	price: decimal({ precision: 10, scale: 2 }).notNull(),
	productType: bigint("product_type", { mode: "number" }).notNull().references(() => productTypes.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	color: varchar({ length: 50 }),
	available: tinyint().default(1).notNull(),
},
(table) => [
	index("products_available_idx").on(table.available),
	index("products_product_type_idx").on(table.productType),
	primaryKey({ columns: [table.id], name: "products_id"}),
]);
