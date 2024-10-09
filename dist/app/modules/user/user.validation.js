"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidationSchema = void 0;
const mongodb_1 = require("mongodb");
const zod_1 = require("zod");
const CreateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ invalid_type_error: "Name must be string", required_error: "Name is required" }),
        email: zod_1.z.string().email(),
        password: zod_1.z
            .string({
            invalid_type_error: "Password must be a string",
        })
            .max(20, { message: "Password can not be more than 20 characters" })
            .min(6, { message: "password at list 6 char" })
            .optional(),
        role: zod_1.z.enum(["Admin", "Customer"]).default("Customer"),
        photoUrl: zod_1.z.string().optional(),
        order: zod_1.z.array(zod_1.z.instanceof(mongodb_1.ObjectId)).optional().default([]),
        isDeleted: zod_1.z.boolean().default(false)
    })
});
const CreateAdminSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().email(),
        password: zod_1.z
            .string({
            invalid_type_error: "Password must be a string",
        })
            .max(20, { message: "Password can not be more than 20 characters" })
            .min(6, { message: "password at list 6 char" })
            .optional(),
        photoUrl: zod_1.z.string().optional(),
        role: zod_1.z.enum(["Admin", "Customer"]).default("Admin"),
        order: zod_1.z.array(zod_1.z.instanceof(mongodb_1.ObjectId)).optional(),
        isDeleted: zod_1.z.boolean().default(false)
    })
});
exports.UserValidationSchema = {
    CreateUserValidationSchema,
    CreateAdminSchema
};
