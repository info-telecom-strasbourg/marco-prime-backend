import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../db/index.js";
import { products } from "../../db/schema.js";
import { productSchema } from "../../validators/products.validator.js";

const router = new Hono();

const productsResponseSchema = z.array(productSchema);

router.get("/", async (c) => {
  const allProducts = await db
    .select({
      title: products.title,
      name: products.name,
      color: products.color,
      price: products.price,
      productTypeId: products.productTypeId,
      available: products.available,
    })
    .from(products);

  const validatedProducts = productsResponseSchema.parse(allProducts);

  return c.json(validatedProducts);
});

export default router;
