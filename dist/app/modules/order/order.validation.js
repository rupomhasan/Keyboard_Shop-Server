"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusSchema = exports.OrderValidationSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const ItemsSchema = zod_1.z.object({
    productId: zod_1.z.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid productId",
    }),
    quantity: zod_1.z.number().min(1, "Quantity must be at least 1"),
});
const ShippedAddressSchema = zod_1.z.object({
    customerName: zod_1.z.string(),
    states: zod_1.z.string(),
    contactNo: zod_1.z.string(),
    zipCode: zod_1.z.string(),
    address: zod_1.z.string(),
    note: zod_1.z.string().optional(),
});
const OrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        items: zod_1.z.array(ItemsSchema),
        shippedAddress: ShippedAddressSchema,
    })
});
exports.OrderValidationSchema = OrderValidationSchema;
const orderStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderStatus: zod_1.z.enum(["pending", "shipped", "delivered", "canceled"])
    })
});
exports.orderStatusSchema = orderStatusSchema;
