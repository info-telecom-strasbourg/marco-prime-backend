import z from "zod";

export const productSchema = z.object({
  title: z.string(),
  name: z.string(),
  color: z.string().nullable(),
  price: z.string(),
  productTypeId: z.number(),
  available: z.boolean(),
});
