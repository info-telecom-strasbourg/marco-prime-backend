import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { products } from "../db/schema.js";

export class ProductRepository {
  async findAll() {
    return await db
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
  }

  async findById(productId: number) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    return product;
  }
}
