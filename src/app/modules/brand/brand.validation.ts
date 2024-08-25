import { z } from "zod";

const createBrandSchema = z.object({
  body: z.object({
    brandName: z.string(),
    logo: z.string(),
  })
});

export const brandValidation = {
  createBrandSchema,
}