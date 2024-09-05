"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsValidations = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const createProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }),
        description: zod_1.z.string().min(1, { message: "Description is required" }),
        brand: zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid brand ID",
        }),
        productsQuantity: zod_1.z.number().min(0, { message: "Products quantity must be 0 or greater" }),
        price: zod_1.z.number().min(0, { message: "Price must be 0 or greater" }),
        reviews: zod_1.z.array(zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid review ID",
        })).optional(),
        isFeatured: zod_1.z.boolean().optional().default(false),
        size: zod_1.z.string(),
        isDeleted: zod_1.z.boolean().optional().default(false),
    })
});
const updateProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        brand: zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid brand ID",
        }).optional(),
        productsQuantity: zod_1.z.number().optional(),
        price: zod_1.z.number().optional(),
        reviews: zod_1.z.array(zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid review ID",
        })).optional(),
        isFeatured: zod_1.z.boolean().optional(),
        size: zod_1.z.string().optional(),
        isDeleted: zod_1.z.boolean().optional(),
    })
});
exports.ProductsValidations = {
    createProductValidation, updateProductValidation
};
