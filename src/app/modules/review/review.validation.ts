import { Types } from "mongoose";
import { z } from "zod";

export const reviewValidation = z.object({
  body: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(1).max(500),
  })
});

export const updateReviewValidation = z.object({
  body: z.object({
    product: z.string().refine((id) => Types.ObjectId.isValid(id), {
      message: "Invalid ObjectId for product",
    }),
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().min(1).max(500).optional(),
  })
});