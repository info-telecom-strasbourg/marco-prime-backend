import z from "zod";

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  name: z.string(),
  color: z.string().nullable(),
  price: z.string(),
  productTypeId: z.number(),
  available: z.boolean(),
});
