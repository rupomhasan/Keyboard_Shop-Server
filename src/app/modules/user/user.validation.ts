import { ObjectId } from "mongodb";
import { z } from "zod";

const CreateUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ invalid_type_error: "Name must be string", required_error: "Name is required" }),
    email: z.string().email(),
    password: z
      .string({
        invalid_type_error: "Password must be a string",
      })
      .max(20, { message: "Password can not be more than 20 characters" })
      .min(6, { message: "password at list 6 char" })
      .optional(),
    role: z.enum(["Admin", "Customer"]).default("Customer"),
    order: z.array(z.instanceof(ObjectId)).optional(),
    photoUrl: z.string().optional(),
    isDeleted: z.boolean().default(false)
  })
})

const CreateAdminSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email(),
    password: z
      .string({
        invalid_type_error: "Password must be a string",
      })
      .max(20, { message: "Password can not be more than 20 characters" })
      .min(6, { message: "password at list 6 char" })
      .optional(),
    role: z.enum(["Admin", "Customer"]).default("Admin"),
    order: z.array(z.instanceof(ObjectId)).optional(),
    photoUrl: z.string().optional(),
    isDeleted: z.boolean().default(false)
  })
})


export const UserValidationSchema = {
  CreateUserValidationSchema,
  CreateAdminSchema
} 
