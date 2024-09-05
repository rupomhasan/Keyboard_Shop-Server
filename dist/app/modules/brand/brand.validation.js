"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandValidation = void 0;
const zod_1 = require("zod");
const createBrandSchema = zod_1.z.object({
    body: zod_1.z.object({
        brandName: zod_1.z.string(),
        // logo: z.string(),
    })
});
exports.brandValidation = {
    createBrandSchema,
};
