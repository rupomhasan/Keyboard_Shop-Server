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
exports.orderService = void 0;
const sslcommerz_lts_1 = require("sslcommerz-lts");
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../Error/AppError");
const products_model_1 = require("../products/products.model");
const totalPrice_1 = require("./utils/totalPrice");
const order_model_1 = require("./order.model");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../user/user.model");
const sendMail_1 = require("../../utils/sendMail");
const mongodb_1 = require("mongodb");
const payment_model_1 = require("../payment/payment.model");
const store_id = "your_store_id";
const store_password = "your_store_password";
const is_live = false;
const sslcommerz = new sslcommerz_lts_1.SSLCommerzPayment(store_id, store_password, is_live);
const getAllOrderFormDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.find({});
    return result;
});
const getMyOrderFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const myOrder = yield order_model_1.Order.find({ email: user.email, isDeleted: false });
    return myOrder;
});
const createNewOrderIntoDB = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { items } = payload;
    const isUserExist = yield user_model_1.User.findOne({ email: user.email });
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User is not found ");
    }
    // Fetch the existing products from the database
    const isProductExist = yield products_model_1.Products.find({
        _id: { $in: items.map(item => item.productId) }
    });
    // Validate each item against the available products
    for (let i = 0; i < items.length; i++) {
        let productFound = false;
        for (let r = 0; r < isProductExist.length; r++) {
            const isExist = (items[i].productId).toString() === (isProductExist[r]._id).toString();
            if (isExist) {
                productFound = true;
                if (isProductExist[r].availableQuantity === 0) {
                    throw new AppError_1.AppError(http_status_1.default.CONFLICT, `The product '${isProductExist[r].name}' is currently out of stock.`);
                }
                if (isProductExist[r].availableQuantity < items[i].quantity) {
                    throw new AppError_1.AppError(http_status_1.default.CONFLICT, `Insufficient quantity for '${isProductExist[r].name}'. Available: ${isProductExist[r].availableQuantity}, Requested: ${items[i].quantity}.`);
                }
                // Calculate the price and subTotal for the item
                items[i].price = isProductExist[r].price;
                items[i].total = Math.round(isProductExist[r].price * items[i].quantity);
                break;
            }
        }
        if (!productFound) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, `Product with ID ${items[i].productId} not found.`);
        }
    }
    const total = (0, totalPrice_1.totalPrice)(items, isProductExist);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        let updatedProduct;
        // Update the product quantities in the database
        for (const item of items) {
            updatedProduct = yield products_model_1.Products.findOneAndUpdate({ _id: item.productId }, { $inc: { availableQuantity: -item.quantity } }, { new: true, session });
        }
        const tran_id = new mongodb_1.ObjectId().toString();
        payload.subTotal = total;
        payload.deliveryCharge = 120;
        payload.totalPrice = total + 120;
        // payload.orderStatus = "pending";
        payload.email = user.email;
        payload.tranId = tran_id;
        const paymentData = {
            total_amount: totalPrice_1.totalPrice,
            currency: "BDT",
            tran_id, // use unique tran_id for each api call
            success_url: `http://localhost:3000/payment/success/${tran_id}`,
            fail_url: `http://localhost:3000/payment/fail/${tran_id}`,
            cancel_url: `http://localhost:3000/payment/cancel/${tran_id}`,
            ipn_url: "http://localhost:3030/ipn",
            shipping_method: "Courier",
            product_name: updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct.name,
            cus_name: isUserExist.name,
            cus_email: isUserExist.email,
            cus_phone: payload.shippedAddress.contactNo,
            ship_name: payload.shippedAddress.customerName,
            ship_state: payload.shippedAddress.states,
            ship_postcode: payload.shippedAddress.zipCode,
            ship_country: "Bangladesh",
        };
        const paymentSession = yield sslcommerz.init(paymentData);
        if (paymentSession.status !== "SUCCESS") {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create payment session.");
        }
        yield payment_model_1.Payments.create([paymentData], {
            session
        });
        const order = yield order_model_1.Order.create([payload], { session });
        yield user_model_1.User.findOneAndUpdate({ email: user.email }, {
            $push: { order: order[0]._id }
        }, {
            session
        });
        (0, sendMail_1.sendMail)(isUserExist, order[0]);
        yield session.commitTransaction();
        yield session.endSession();
        return order;
    }
    catch (error) {
        yield session.abortTransaction();
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, error);
    }
});
const canceledMyOrderFormDB = (user, _id) => __awaiter(void 0, void 0, void 0, function* () {
    const myOrder = yield order_model_1.Order.findById(_id);
    if ((myOrder === null || myOrder === void 0 ? void 0 : myOrder.email) !== user.email) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Your not authorized to cancel this order");
    }
    if ((myOrder === null || myOrder === void 0 ? void 0 : myOrder.orderStatus) !== "pending") {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Your cann't change this order status ${myOrder === null || myOrder === void 0 ? void 0 : myOrder.orderStatus} to canceled`);
    }
    const result = yield order_model_1.Order.findByIdAndUpdate(_id, { orderStatus: "canceled" });
    return result;
});
const updateOrderStatusFormDB = (_id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const myOrder = yield order_model_1.Order.findById(_id);
    if (!myOrder) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "This order id does not exist");
    }
    if (myOrder.isDeleted) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "This order is deleted");
    }
    if (myOrder.orderStatus === "canceled") {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "You cannot change the status of a canceled order");
    }
    if (myOrder.orderStatus === status) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `this order is already ${status}`);
    }
    if (myOrder.orderStatus === "delivered" && (status === "shipped" || status === "pending" || status === "canceled")) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `You cannot change directly from ${myOrder.orderStatus} to ${status}`);
    }
    if (myOrder.orderStatus === "shipped" && status === "pending") {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `You cannot change directly from ${myOrder.orderStatus} to ${status}`);
    }
    const result = yield order_model_1.Order.findByIdAndUpdate(_id, { orderStatus: status }, { new: true });
    const user = yield user_model_1.User.findOne({ email: myOrder.email });
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User not found");
    }
    if ((result === null || result === void 0 ? void 0 : result.orderStatus) === status) {
        try {
            (0, sendMail_1.sendMail)(user, result);
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    return result;
});
const deleteOrderByIdFormDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(_id);
    if (!order) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "This order id is not exist");
    }
    if (order.isDeleted) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "This order is deleted");
    }
    if (order.orderStatus !== "canceled") {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `You can not delete  ${order.orderStatus} status  `);
    }
    const result = yield order_model_1.Order.findByIdAndUpdate(_id, {
        isDeleted: true
    }, { new: true });
    return result === null || result === void 0 ? void 0 : result.isDeleted;
});
exports.orderService = {
    getAllOrderFormDB,
    getMyOrderFromDB,
    createNewOrderIntoDB,
    canceledMyOrderFormDB,
    updateOrderStatusFormDB,
    deleteOrderByIdFormDB
};
