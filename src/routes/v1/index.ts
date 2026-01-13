import { Hono } from "hono";
import productsRouter from "./products.js";

const v1Router = new Hono();

v1Router.route("/products", productsRouter);

export default v1Router;
