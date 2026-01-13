import { Hono } from "hono";
import { ProductController } from "../../controllers/product.controller.js";

const productController = new ProductController();
const productRouter = new Hono();

productRouter.get("/", (c) => productController.getAllProducts(c));

export { productRouter };
