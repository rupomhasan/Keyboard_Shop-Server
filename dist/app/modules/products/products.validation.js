"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductValidation = exports.createProductValidation = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const dimensionsValidation = zod_1.z.object({
    length: zod_1.z.number().min(0, { message: "Length must be 0 or greater" }),
    width: zod_1.z.number().min(0, { message: "Width must be 0 or greater" }),
    height: zod_1.z.number().min(0, { message: "Height must be 0 or greater" }),
});
const featuresValidation = zod_1.z.object({
    size: zod_1.z.string().optional(),
    keys: zod_1.z.number().optional(),
    SwitchLifecycle: zod_1.z.string().optional(),
    Switch: zod_1.z.string().optional(),
    mode: zod_1.z.string().optional(),
    battery: zod_1.z.string().optional(),
    lighting: zod_1.z.string().optional(),
    weight: zod_1.z.string().optional(),
});
const createProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }),
        description: zod_1.z.string().min(1, { message: "Description is required" }),
        image: zod_1.z.string().optional(),
        brand: zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid brand ID",
        }),
        productsQuantity: zod_1.z.number().min(0, { message: "Products quantity must be 0 or greater" }),
        availableQuantity: zod_1.z.number().optional(),
        price: zod_1.z.number().min(0, { message: "Price must be 0 or greater" }),
        discount: zod_1.z.number().min(0).optional(),
        reviews: zod_1.z.array(zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid review ID",
        })).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        connectivity: zod_1.z.string().min(1, { message: "Connectivity is required" }),
        dimensions: dimensionsValidation,
        averageRating: zod_1.z.number().min(0).max(5).optional(),
        numberOfReviews: zod_1.z.number().optional(),
        features: featuresValidation.optional(),
        slug: zod_1.z.string().optional(),
        isDeleted: zod_1.z.boolean().optional().default(false),
    }),
});
exports.createProductValidation = createProductValidation;
const updateProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        brand: zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid brand ID",
        }).optional(),
        productsQuantity: zod_1.z.number().optional(),
        availableQuantity: zod_1.z.number().optional(),
        price: zod_1.z.number().optional(),
        discount: zod_1.z.number().optional(),
        sku: zod_1.z.string().optional(),
        reviews: zod_1.z.array(zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid review ID",
        })).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        connectivity: zod_1.z.string().optional(),
        dimensions: dimensionsValidation.optional(),
        weight: zod_1.z.number().optional(),
        averageRating: zod_1.z.number().optional(),
        numberOfReviews: zod_1.z.number().optional(),
        features: featuresValidation.optional(),
        slug: zod_1.z.string().optional(),
        isDeleted: zod_1.z.boolean().optional(),
    }),
});
exports.updateProductValidation = updateProductValidation;
