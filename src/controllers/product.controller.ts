import type { Context } from "hono";
import { ProductRepository } from "../repositories/product.repository.js";

export class ProductController {
  private productRepository = new ProductRepository();

  async getAllProducts(c: Context) {
    const allProducts = await this.productRepository.findAll();
    return c.json(allProducts);
  }
}
