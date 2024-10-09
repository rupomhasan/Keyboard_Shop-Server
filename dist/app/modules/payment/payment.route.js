"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_service_1 = require("./payment.service");
const router = express_1.default.Router();
router.post("/payment/success/:tran_id", payment_service_1.paymentService.successPayment);
router.post("/payment/fail/:tran_id", payment_service_1.paymentService.failPayment);
router.post("/payment/cancel/:tran_id", payment_service_1.paymentService.cancelPayment);
exports.PaymentRoutes = router;
