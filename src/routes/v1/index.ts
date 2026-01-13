import { Hono } from "hono";
import productsRouter from "./products.js";
import membersRouter from "./members.js";

const v1Router = new Hono();

v1Router.route("/products", productsRouter);
v1Router.route("/member", membersRouter);

export default v1Router;
