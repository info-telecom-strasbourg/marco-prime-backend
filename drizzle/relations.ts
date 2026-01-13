import { relations } from "drizzle-orm/relations";
import { members, orders, products, productTypes } from "./schema";

export const ordersRelations = relations(orders, ({one}) => ({
	member: one(members, {
		fields: [orders.memberId],
		references: [members.id]
	}),
	product: one(products, {
		fields: [orders.productId],
		references: [products.id]
	}),
}));

export const membersRelations = relations(members, ({many}) => ({
	orders: many(orders),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	orders: many(orders),
	productType: one(productTypes, {
		fields: [products.productType],
		references: [productTypes.id]
	}),
}));

export const productTypesRelations = relations(productTypes, ({many}) => ({
	products: many(products),
}));