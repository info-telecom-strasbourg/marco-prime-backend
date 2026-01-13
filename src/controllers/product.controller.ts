import type { Context } from "hono";
import { db } from "../config/database.js";
import { products } from "../db/schema.js";

export class ProductController {
  async getAllProducts(c: Context) {
    const allProducts = await db
      .select({
        id: products.id,
        title: products.title,
        name: products.name,
        color: products.color,
        price: products.price,
        productTypeId: products.productTypeId,
        available: products.available,
      })
      .from(products);

    return c.json(allProducts);
  }
}
