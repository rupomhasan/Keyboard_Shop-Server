"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payments = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paymentSchema = new mongoose_1.default.Schema({
    total_amount: { type: Number },
    currency: { type: String },
    tran_id: { type: String },
    success_url: { type: String },
    fail_url: { type: String },
    cancel_url: { type: String },
    ipn_url: { type: String },
    shipping_method: { type: String },
    product_name: { type: String },
    cus_name: { type: String },
    cus_email: { type: String },
    cus_phone: { type: String },
    ship_name: { type: String },
    ship_state: { type: String },
    ship_postcode: { type: String },
    ship_country: { type: String },
});
exports.Payments = mongoose_1.default.model("Payments", paymentSchema);
