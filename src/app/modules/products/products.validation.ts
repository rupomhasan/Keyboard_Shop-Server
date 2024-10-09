import { Types } from "mongoose";
import { z } from "zod";

const dimensionsValidation = z.object({
  length: z.number().min(0, { message: "Length must be 0 or greater" }),
  width: z.number().min(0, { message: "Width must be 0 or greater" }),
  height: z.number().min(0, { message: "Height must be 0 or greater" }),
});

const featuresValidation = z.object({
  size: z.string().optional(),
  keys: z.number().optional(),
  SwitchLifecycle: z.string().optional(),
  Switch: z.string().optional(),
  mode: z.string().optional(),
  battery: z.string().optional(),
  lighting: z.string().optional(),
  weight: z.string().optional(),
});

const createProductValidation = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    image: z.string().optional(),
    brand: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid brand ID",
    }),
    productsQuantity: z.number().min(0, { message: "Products quantity must be 0 or greater" }),
    availableQuantity: z.number().optional(),
    price: z.number().min(0, { message: "Price must be 0 or greater" }),
    discount: z.number().min(0).optional(),


    reviews: z.array(z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid review ID",
    })).optional(),
    tags: z.array(z.string()).optional(),
    connectivity: z.string().min(1, { message: "Connectivity is required" }),
    dimensions: dimensionsValidation,

    averageRating: z.number().min(0).max(5).optional(),
    numberOfReviews: z.number().optional(),
    features: featuresValidation.optional(),
    slug: z.string().optional(),
    isDeleted: z.boolean().optional().default(false),
  }),
});

const updateProductValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    brand: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid brand ID",
    }).optional(),
    productsQuantity: z.number().optional(),
    availableQuantity: z.number().optional(),
    price: z.number().optional(),
    discount: z.number().optional(),
    sku: z.string().optional(),
    reviews: z.array(z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid review ID",
    })).optional(),
    tags: z.array(z.string()).optional(),
    connectivity: z.string().optional(),
    dimensions: dimensionsValidation.optional(),
    weight: z.number().optional(),
    averageRating: z.number().optional(),
    numberOfReviews: z.number().optional(),
    features: featuresValidation.optional(),
    slug: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export { createProductValidation, updateProductValidation };
