import { createSelectSchema } from "drizzle-zod";
import { products } from "@/db/schemas/products.schema.ts";

export const SelectProductValidator = createSelectSchema(products);
