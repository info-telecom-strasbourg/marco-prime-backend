import { z } from "zod";

export const orderSchema = z.object({
  id: z.number(),
  productId: z.number().nullable(),
  memberId: z.number().nullable(),
  price: z.string(),
  amount: z.number(),
  date: z.date(),
});

export const paginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default(20),
});

export const paginatedResponseSchema = z.object({
  data: z.array(orderSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});
