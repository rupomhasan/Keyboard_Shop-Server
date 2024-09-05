"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../Error/AppError");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const order_model_1 = require("../order/order.model");
const payment_model_1 = require("./payment.model");
const successPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tranId = req.params.tranId;
    const result = yield order_model_1.Order.findOneAndUpdate({ tranId }, { $set: { paidStatus: true } }, { new: true });
    if (result) {
        res.redirect(`http://localhost:5173/payment/success/${tranId}`);
    }
    else {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Order not found or update failed");
    }
}));
const failPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tranId = req.params.tranId;
    // Find and delete the associated order
    const orderResult = yield order_model_1.Order.findOneAndDelete({ transactionId: tranId });
    // Find and delete the associated payment record
    const paymentResult = yield payment_model_1.Payments.findOneAndDelete({ tran_id: tranId });
    if (orderResult && paymentResult) {
        // Redirect to the frontend failure page
        res.redirect(`http://localhost:5173/payment/fail/${tranId}`);
    }
    else {
        // Throw an error if the order or payment record was not found
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Order or payment record not found or deletion failed");
    }
}));
const cancelPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tranId = req.params.tranId;
    // Find and delete the associated order
    const orderResult = yield order_model_1.Order.findOneAndDelete({ transactionId: tranId });
    // Find and delete the associated payment record
    const paymentResult = yield payment_model_1.Payments.findOneAndDelete({ tran_id: tranId });
    if (orderResult && paymentResult) {
        // Redirect to the frontend cancellation page
        res.redirect(`http://localhost:5173/payment/cancel/${tranId}`);
    }
    else {
        // Throw an error if the order or payment record was not found
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Order or payment record not found or deletion failed");
    }
}));
exports.paymentService = {
    successPayment,
    failPayment,
    cancelPayment
};
