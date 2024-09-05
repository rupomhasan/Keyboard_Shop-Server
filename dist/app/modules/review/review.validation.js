"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewValidation = exports.reviewValidation = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.reviewValidation = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z.number().min(1).max(5),
        comment: zod_1.z.string().min(1).max(500),
    })
});
exports.updateReviewValidation = zod_1.z.object({
    body: zod_1.z.object({
        product: zod_1.z.string().refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
            message: "Invalid ObjectId for product",
        }),
        rating: zod_1.z.number().min(1).max(5).optional(),
        comment: zod_1.z.string().min(1).max(500).optional(),
    })
});
