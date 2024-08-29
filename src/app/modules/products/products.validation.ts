import { Types } from "mongoose";
import { z } from "zod";


const createProductValidation = z.object(
  {
    body: z.object({
      name: z.string().min(1, { message: "Name is required" }),
      description: z.string().min(1, { message: "Description is required" }),
      brand: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid brand ID",
      }),
      productsQuantity: z.number().min(0, { message: "Products quantity must be 0 or greater" }),
      price: z.number().min(0, { message: "Price must be 0 or greater" }),
      reviews: z.array(z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid review ID",
      })).optional(),
      isFeatured: z.boolean().optional().default(false),
      size: z.string(),
      isDeleted: z.boolean().optional().default(false),
    })
  }
);

const updateProductValidation = z.object(
  {
    body: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      brand: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid brand ID",
      }).optional(),
      productsQuantity: z.number().optional(),
      price: z.number().optional(),
      reviews: z.array(z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid review ID",
      })).optional(),
      isFeatured: z.boolean().optional(),
      size: z.string().optional(),
      isDeleted: z.boolean().optional(),
    })
  }
);


export const ProductsValidations = {
  createProductValidation, updateProductValidation
}